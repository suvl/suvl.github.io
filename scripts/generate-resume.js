/**
 * PDF Resume Generator
 * 
 * Generates a PDF resume directly from data/en/ YAML files.
 * Single source of truth - no hardcoded content.
 * Supports multi-page PDFs.
 * 
 * Usage: node scripts/generate-resume.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Paths
const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data', 'en');
const SECTIONS_DIR = path.join(DATA_DIR, 'sections');
const AVATAR_PATH = path.join(ROOT_DIR, 'static', 'images', 'author', 'avatar.jpg');
const OUTPUT_PATH = path.join(ROOT_DIR, 'static', 'files', 'resume.pdf');

// Load YAML file safely
function loadYaml(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return yaml.load(content);
  } catch (e) {
    console.warn(`   ⚠️ Could not load ${path.basename(filePath)}`);
    return null;
  }
}

// Load all data from data/en/
function loadAllData() {
  return {
    author: loadYaml(path.join(DATA_DIR, 'author.yaml')),
    site: loadYaml(path.join(DATA_DIR, 'site.yaml')),
    about: loadYaml(path.join(SECTIONS_DIR, 'about.yaml')),
    experiences: loadYaml(path.join(SECTIONS_DIR, 'experiences.yaml')),
    education: loadYaml(path.join(SECTIONS_DIR, 'education.yaml')),
    skills: loadYaml(path.join(SECTIONS_DIR, 'skills.yaml')),
    accomplishments: loadYaml(path.join(SECTIONS_DIR, 'accomplishments.yaml')),
    projects: loadYaml(path.join(SECTIONS_DIR, 'projects.yaml')),
  };
}

// Get avatar as base64 data URI
function getAvatarBase64() {
  if (fs.existsSync(AVATAR_PATH)) {
    const avatarBuffer = fs.readFileSync(AVATAR_PATH);
    const ext = path.extname(AVATAR_PATH).slice(1);
    return `data:image/${ext};base64,${avatarBuffer.toString('base64')}`;
  }
  return '';
}

// Strip markdown links but keep text, escape HTML
function cleanText(text) {
  if (!text) return '';
  // Convert [text](url) to just text
  let cleaned = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // Escape basic HTML entities
  cleaned = cleaned.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return cleaned;
}

// Generate HTML from data - NO hardcoded content
function generateHTML(data, avatarBase64) {
  const { author, about, experiences, education, skills, accomplishments } = data;
  
  // Build contact info dynamically
  const contactParts = [];
  if (author?.contactInfo?.email) {
    contactParts.push(`<span>📧 <a href="mailto:${author.contactInfo.email}">${author.contactInfo.email}</a></span>`);
  }
  if (author?.contactInfo?.linkedin) {
    contactParts.push(`<span>💼 <a href="https://linkedin.com/in/${author.contactInfo.linkedin}">linkedin.com/in/${author.contactInfo.linkedin}</a></span>`);
  }
  if (author?.contactInfo?.github) {
    contactParts.push(`<span>🐙 <a href="https://github.com/${author.contactInfo.github}">github.com/${author.contactInfo.github}</a></span>`);
  }
  // Add website from site.yaml if available
  if (data.site?.openGraph?.url) {
    const url = data.site.openGraph.url.replace(/^https?:\/\//, '');
    contactParts.push(`<span>🔗 <a href="${data.site.openGraph.url}">${url}</a></span>`);
  }

  // Build certification badges from about.yaml
  const certBadges = (about?.badges || [])
    .filter(b => b.type === 'certification')
    .map(b => {
      const match = b.name.match(/\(([^)]+)\)/);
      const shortName = match ? match[1] : b.name.substring(0, 4);
      return `<span class="cert-badge">${shortName}</span>`;
    })
    .join('');

  // Build summary from about.yaml
  let summaryText = '';
  if (about?.summary) {
    summaryText = about.summary.trim();
  }

  // Build skills section dynamically
  const skillTags = (skills?.skills || [])
    .map(skill => {
      const isHighlight = skill.categories?.includes('kubernetes');
      return `<span class="skill-tag${isHighlight ? ' highlight' : ''}">${skill.name}</span>`;
    })
    .join('');

  // Build experiences section dynamically
  let experiencesHTML = '';
  for (const exp of (experiences?.experiences || [])) {
    const company = exp.company;
    for (const pos of (exp.positions || [])) {
      const dateRange = pos.end ? `${pos.start} – ${pos.end}` : `${pos.start} – Present`;
      const responsibilities = (pos.responsibilities || [])
        .map(r => `<li>${cleanText(r)}</li>`)
        .join('');
      
      experiencesHTML += `
        <div class="experience-item">
          <div class="experience-header">
            <span class="experience-title">${pos.designation}</span>
            <span class="experience-date">${dateRange}</span>
          </div>
          <div class="experience-company">${company.name} <span class="experience-location">• ${company.location || ''}</span></div>
          <ul class="experience-list">
            ${responsibilities}
          </ul>
        </div>
      `;
    }
  }

  // Build education section dynamically
  let educationHTML = '';
  for (const degree of (education?.degrees || [])) {
    educationHTML += `
      <div class="education-item">
        <div class="education-header">
          <span class="education-degree">${degree.name}</span>
          <span class="education-date">${degree.timeframe}</span>
        </div>
        <div class="education-institution">${degree.institution?.name || ''}</div>
      </div>
    `;
  }

  // Build certifications section dynamically
  let certificationsHTML = '';
  for (const cert of (accomplishments?.accomplishments || [])) {
    certificationsHTML += `
      <div class="certification-item">
        <div class="certification-header">
          <span class="certification-name">${cert.name}</span>
          <span class="certification-date">${cert.timeline}</span>
        </div>
        <div class="certification-org">${cert.organization?.name || ''}</div>
      </div>
    `;
  }

  // Generate the complete HTML - all content comes from data files
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${author?.name || 'Resume'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html, body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 9.5pt;
      line-height: 1.45;
      color: #1a1a1a;
      background: white;
    }
    
    .resume {
      width: 210mm;
    }
    
    /* Header */
    .header {
      display: flex;
      gap: 16px;
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 2px solid #2563eb;
    }
    
    .avatar {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #2563eb;
      flex-shrink: 0;
    }
    
    .header-content {
      flex: 1;
    }
    
    .name {
      font-size: 22pt;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 2px;
      line-height: 1.1;
    }
    
    .title {
      font-size: 11pt;
      font-weight: 500;
      color: #2563eb;
      margin-bottom: 6px;
    }
    
    .contact-row {
      font-size: 8.5pt;
      color: #555;
      line-height: 1.5;
    }
    
    .contact-row a {
      color: #555;
      text-decoration: none;
    }
    
    .contact-row span {
      margin-right: 12px;
      white-space: nowrap;
    }
    
    .certifications {
      display: flex;
      gap: 6px;
      margin-top: 6px;
    }
    
    .cert-badge {
      background: #dbeafe;
      color: #1e40af;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 8pt;
      font-weight: 600;
    }
    
    /* Sections */
    .section {
      margin-bottom: 14px;
    }
    
    .section-title {
      font-size: 10.5pt;
      font-weight: 700;
      color: #2563eb;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      padding-bottom: 3px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    /* Summary */
    .summary {
      font-size: 9.5pt;
      color: #374151;
      line-height: 1.5;
    }
    
    .summary p {
      margin-bottom: 8px;
    }
    
    .summary p:last-child {
      margin-bottom: 0;
    }
    
    /* Skills */
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
    
    .skill-tag {
      background: #f3f4f6;
      color: #374151;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 8.5pt;
      font-weight: 500;
    }
    
    .skill-tag.highlight {
      background: #dbeafe;
      color: #1e40af;
    }
    
    /* Experience */
    .experience-item {
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }
    
    .experience-title {
      font-size: 10pt;
      font-weight: 600;
      color: #1a1a1a;
    }
    
    .experience-date {
      font-size: 9pt;
      color: #6b7280;
      font-weight: 500;
    }
    
    .experience-company {
      font-size: 9pt;
      color: #2563eb;
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .experience-location {
      color: #6b7280;
      font-weight: 400;
    }
    
    .experience-list {
      list-style: none;
      padding-left: 0;
    }
    
    .experience-list li {
      position: relative;
      padding-left: 12px;
      font-size: 9pt;
      color: #374151;
      margin-bottom: 2px;
      line-height: 1.4;
    }
    
    .experience-list li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #2563eb;
      font-weight: bold;
    }
    
    /* Education & Certifications */
    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .education-item, .certification-item {
      margin-bottom: 8px;
      page-break-inside: avoid;
    }
    
    .education-header, .certification-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    
    .education-degree, .certification-name {
      font-size: 9.5pt;
      font-weight: 600;
      color: #1a1a1a;
    }
    
    .education-date, .certification-date {
      font-size: 8.5pt;
      color: #6b7280;
    }
    
    .education-institution, .certification-org {
      font-size: 8.5pt;
      color: #2563eb;
    }
    
    @page {
      size: A4;
      margin: 14mm 16mm;
    }
    
    .disclaimer {
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      font-size: 8pt;
      color: #9ca3af;
      text-align: center;
      font-style: italic;
    }
    
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      .experience-item, .education-item, .certification-item {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="resume">
    <!-- Header - from author.yaml and about.yaml -->
    <header class="header">
      ${avatarBase64 ? `<img src="${avatarBase64}" alt="${author?.name || 'Avatar'}" class="avatar">` : ''}
      <div class="header-content">
        <h1 class="name">${author?.name || ''}</h1>
        <div class="title">${about?.designation || ''} at ${about?.company?.name || ''}</div>
        <div class="contact-row">
          ${contactParts.join('')}
        </div>
        ${certBadges ? `<div class="certifications">${certBadges}</div>` : ''}
      </div>
    </header>
    
    <!-- Summary - from about.yaml -->
    ${summaryText ? `
    <section class="section">
      <h2 class="section-title">About</h2>
      <div class="summary">${summaryText.split('\n\n').map(p => `<p>${p.replace(/\n/g, ' ')}</p>`).join('')}</div>
    </section>
    ` : ''}
    
    <!-- Skills - from skills.yaml -->
    ${skillTags ? `
    <section class="section">
      <h2 class="section-title">Skills</h2>
      <div class="skills-grid">
        ${skillTags}
      </div>
    </section>
    ` : ''}
    
    <!-- Experience - from experiences.yaml -->
    ${experiencesHTML ? `
    <section class="section">
      <h2 class="section-title">Experience</h2>
      ${experiencesHTML}
    </section>
    ` : ''}
    
    <!-- Education & Certifications - from education.yaml and accomplishments.yaml -->
    <div class="two-column">
      ${educationHTML ? `
      <section class="section">
        <h2 class="section-title">Education</h2>
        ${educationHTML}
      </section>
      ` : ''}
      
      ${certificationsHTML ? `
      <section class="section">
        <h2 class="section-title">Certifications</h2>
        ${certificationsHTML}
      </section>
      ` : ''}
    </div>
    
    <!-- Disclaimer -->
    <div class="disclaimer">
      This PDF was automatically generated from <a href="${data.site?.openGraph?.url || 'https://jtsoar.es'}">${(data.site?.openGraph?.url || 'https://jtsoar.es').replace(/^https?:\/\//, '')}</a>
    </div>
  </div>
</body>
</html>`;
}

async function generatePDF() {
  console.log('🚀 Starting PDF generation from data/en/ files...');
  
  // Load all data from YAML files
  const data = loadAllData();
  console.log('   ✓ Loaded data files');
  
  // Get avatar as base64
  const avatarBase64 = getAvatarBase64();
  if (avatarBase64) {
    console.log('   ✓ Avatar embedded as base64');
  }
  
  // Generate HTML from data
  const html = generateHTML(data, avatarBase64);
  console.log('   ✓ Generated HTML from data');
  
  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Launch browser and generate PDF
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');
    
    // Generate PDF - Puppeteer handles multi-page automatically
    await page.pdf({
      path: OUTPUT_PATH,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    
    // Report results
    const stats = fs.statSync(OUTPUT_PATH);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    
    console.log(`✅ PDF generated successfully!`);
    console.log(`   Output: ${OUTPUT_PATH}`);
    console.log(`   Size: ${fileSizeKB} KB`);
    
  } finally {
    await browser.close();
  }
}

generatePDF().catch(err => {
  console.error('❌ Error generating PDF:', err);
  process.exit(1);
});
