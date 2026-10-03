const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const puppeteer = require('puppeteer');

const publicDir = path.resolve(__dirname, '..', 'public');
const resultsDir = process.env.SITE_TEST_RESULTS_DIR || path.join(os.tmpdir(), 'site-smoke-test');
const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

async function main() {
  assert.ok(fs.existsSync(path.join(publicDir, 'index.html')), 'Hugo output is missing public/index.html');
  fs.mkdirSync(resultsDir, { recursive: true });

  const server = http.createServer((request, response) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
      response.writeHead(400).end('Bad request');
      return;
    }

    const filePath = path.resolve(publicDir, `.${pathname}`);
    if (filePath !== publicDir && !filePath.startsWith(`${publicDir}${path.sep}`)) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    let target = filePath;
    try {
      if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    } catch {
      response.writeHead(404).end('Not found');
      return;
    }

    fs.createReadStream(target)
      .on('error', () => response.writeHead(404).end('Not found'))
      .on('open', () => {
        response.writeHead(200, {
          'Content-Type': contentTypes[path.extname(target)] || 'application/octet-stream'
        });
      })
      .pipe(response);
  });

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000 });
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    const response = await page.goto(`http://127.0.0.1:${address.port}/`, { waitUntil: 'networkidle2' });
    assert.equal(response.status(), 200, 'Home page did not return HTTP 200');
    await page.evaluate(() => document.fonts.ready);

    const desktop = await page.evaluate(() => {
      const requiredSections = ['about', 'skills', 'experiences', 'education', 'accomplishments'];
      const missingSections = requiredSections.filter(id => !document.getElementById(id));
      const brokenAnchors = [...document.querySelectorAll('a[href^="#"]')]
        .map(link => link.getAttribute('href').slice(1))
        .filter(id => id && !document.getElementById(id));

      return {
        title: document.title,
        text: document.body.innerText,
        missingSections,
        brokenAnchors,
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        documentHeight: document.documentElement.scrollHeight,
        stylesheets: document.styleSheets.length
      };
    });

    assert.match(desktop.title, /João Trigo Soares/, 'Page title is missing the site owner name');
    for (const expected of ['Platforms Engineering Team Lead', 'NOS Inovação', 'Kubernetes']) {
      assert.ok(desktop.text.includes(expected), `Page is missing expected content: ${expected}`);
    }
    assert.deepEqual(desktop.missingSections, [], 'One or more expected page sections are missing');
    assert.deepEqual(desktop.brokenAnchors, [], 'A section navigation link has no matching target');
    assert.ok(desktop.stylesheets > 0, 'No stylesheets were loaded');
    assert.ok(desktop.documentHeight > 0, 'The page has no rendered content');
    assert.ok(desktop.documentWidth <= desktop.viewportWidth + 1, 'Desktop layout overflows horizontally');
    await page.screenshot({ path: path.join(resultsDir, 'desktop.png'), fullPage: true });

    await page.setViewport({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'networkidle2' });
    const mobile = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight
    }));
    assert.ok(mobile.documentHeight > 0, 'The mobile page has no rendered content');
    assert.ok(mobile.documentWidth <= mobile.viewportWidth + 1, 'Mobile layout overflows horizontally');
    assert.deepEqual(pageErrors, [], `The page raised JavaScript errors: ${pageErrors.join('; ')}`);
    await page.screenshot({ path: path.join(resultsDir, 'mobile.png'), fullPage: true });

    console.log(`Site smoke test passed at desktop (${desktop.viewportWidth}px) and mobile (${mobile.viewportWidth}px).`);
    console.log(`Screenshots saved to ${resultsDir}`);
  } finally {
    await browser.close();
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
