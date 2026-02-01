# Product Requirements Document (PRD)

## João Trigo Soares - Personal CV Website

**Document Version:** 2.0  
**Last Updated:** February 2026  
**Project URL:** https://jtsoar.es/

---

## 1. Executive Summary

This is a personal CV/portfolio website for João Trigo Soares, a Platforms Engineering Team Lead based in Lisbon, Portugal. The site is built using **Hugo** static site generator with the **Toha v4** theme, providing a modern, responsive, and feature-rich presentation of professional experience, technical skills, and certifications.

**Current State:** Fully migrated from the legacy `hugo-devresume-theme` to Toha v4 in February 2026. The site is actively maintained and deployed via GitHub Pages.

---

## 2. Goals & Objectives

### 2.1 Primary Goals

| Goal | Description | Success Metric |
|------|-------------|----------------|
| **Professional Visibility** | Public, accessible resume for recruiters and hiring managers | Active website with current information |
| **Personal Branding** | Showcase expertise in DevOps, Kubernetes, and Cloud Native | Consistent, modern presentation |
| **SEO & Discoverability** | Search engine optimized with proper meta tags | Google Analytics integration (GA4) |
| **Low Maintenance** | Static site with minimal hosting overhead | GitHub Pages, Hugo static generation |

### 2.2 Secondary Goals

- Highlight Kubernetes triple certification (CKA, CKAD, CKS)
- Showcase career progression from developer to team lead
- Provide filterable skills taxonomy
- Host additional standalone pages (e.g., Mac Apps guide)

---

## 3. User Personas

### 3.1 Technical Recruiter
- **Goals:** Quickly assess technical background, verify certifications, find contact info
- **Needs:** Clear experience timeline, downloadable resume, LinkedIn link

### 3.2 Engineering Manager
- **Goals:** Evaluate technical depth and leadership experience
- **Needs:** Project details, team leadership evidence, technology expertise

### 3.3 Fellow Engineer
- **Goals:** Network, explore open-source contributions
- **Needs:** GitHub link, blog posts (if enabled), project showcases

---

## 4. Technical Architecture

### 4.1 Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Static Site Generator | Hugo Extended | 0.155.1 |
| Theme | Toha | v4 (Hugo Module) |
| Hosting | GitHub Pages | - |
| CI/CD | GitHub Actions | - |
| Analytics | Google Analytics 4 | G-HNL3T7BE5Z |
| Package Manager | npm | 24.x |
| CSS Framework | Bootstrap (via Toha) | - |

### 4.2 Project Structure

```
suvl.github.io/
├── hugo.yaml              # Main Hugo configuration
├── go.mod / go.sum        # Hugo module dependencies
├── package.json           # npm dependencies (fonts, icons)
├── data/
│   └── en/
│       ├── author.yaml    # Profile information
│       ├── site.yaml      # Site metadata
│       └── sections/
│           ├── about.yaml          # Professional summary, social links, badges
│           ├── experiences.yaml    # Work history
│           ├── education.yaml      # Academic background
│           ├── skills.yaml         # Filterable skills with icons
│           ├── projects.yaml       # Notable projects
│           └── accomplishments.yaml # Certifications
├── static/
│   ├── apps/              # Standalone Mac Apps guide
│   └── images/            # Logos, avatar, skill icons
├── public/                # Generated output
└── .github/workflows/
    └── hugo.yaml          # CI/CD pipeline
```

### 4.3 Build & Deploy

- **Local Dev:** `hugo server`
- **Production Build:** `hugo --gc --minify`
- **Deploy:** Automatic via GitHub Actions on push to `main`
- **Output:** `public/` directory deployed to GitHub Pages

---

## 5. Content Sections

### 5.1 About
- Professional designation and company
- Career summary narrative
- Social links (Email, GitHub, LinkedIn, Twitter)
- Certification badges (CKA, CKAD, CKS)

### 5.2 Skills (Filterable)
Categories: Kubernetes, Cloud, CI/CD, Observability, Languages

| Skill | Category |
|-------|----------|
| Kubernetes | kubernetes |
| Docker | kubernetes |
| Helm | kubernetes |
| Istio | kubernetes |
| Azure / AKS | cloud |
| GCP / GKE | cloud |
| Terraform | cloud, cicd |
| Ansible | cicd |
| Jenkins | cicd |
| Prometheus | observability |
| Grafana | observability |
| And more... | - |

### 5.3 Experiences
**NOS Inovação (2015 - Present)**
- Platforms Engineering Team Lead (2023+)
- DevOps Team Lead (2021-2022)
- DevOps Engineer (2018-2020)
- Lead Software Engineer (2017)
- Senior Software Engineer (2015-2016)

**Accenture (2011 - 2014)**
- Software Engineer

**INESC TEC (2010 - 2011)**
- Researcher (Computer Vision)

### 5.4 Education
- MSc Informatics Engineering — FEUP (2011)
- BSc Informatics Engineering — FEUP (2009)

### 5.5 Accomplishments
- Certified Kubernetes Administrator (CKA)
- Certified Kubernetes Application Developer (CKAD)
- Certified Kubernetes Security Specialist (CKS)

### 5.6 Projects
- NAME SDK — Open-source .NET instrumentation library
- Network PVR — Cloud-based recording platform
- edpOn Intranet — Award-winning enterprise intranet

---

## 6. Additional Pages

### 6.1 Mac Apps Guide (`/apps/`)
A standalone interactive page showcasing recommended macOS applications for power users. Features:
- Category filtering (Productivity, System, Dev & Networks, Bonus)
- Search functionality
- "Problem Mode" toggle (browse by pain point vs. solution)
- Distribution chart (Chart.js)
- Self-contained HTML with Tailwind CSS

---

## 7. Features & Configuration

### 7.1 Theme Features
- ✅ Light/Dark mode (system default)
- ✅ Responsive design
- ✅ Table of Contents
- ✅ Contact form section
- ❌ Blog (disabled)
- ❌ Portfolio gallery (disabled)
- ❌ Tags (disabled)

### 7.2 Analytics
- Google Analytics 4: `G-HNL3T7BE5Z`

### 7.3 SEO
- Open Graph meta tags
- JSON-LD structured data (via Toha)
- Sitemap generation
- robots.txt

---

## 8. Dependencies

### 8.1 Hugo Modules
```yaml
module:
  imports:
    - path: github.com/hugo-toha/toha/v4
```

### 8.2 npm Packages
- `flag-icons` — Country flag SVGs
- `@fontsource/mulish` — Typography
- `katex` — Math rendering (if needed)

---

## 9. CI/CD Pipeline

**Workflow:** `.github/workflows/hugo.yaml`

| Step | Description |
|------|-------------|
| Checkout | Clone repo with submodules |
| Setup Go | Install Go for Hugo modules |
| Setup Node.js | Install npm for dependencies |
| Install Dart Sass | SCSS compilation |
| Install Hugo | Extended version |
| npm ci | Install node dependencies |
| Hugo Build | Generate static site |
| Deploy | Push to GitHub Pages |

---

## 10. Maintenance Notes

### 10.1 Known Issues
- **sitemap.xml permissions:** Hugo occasionally creates read-only files. Workflow includes workaround.
- **Static mounts:** Explicit mounts in `hugo.yaml` required for static files to be copied.

### 10.2 Update Procedures
1. **Content:** Edit YAML files in `data/en/sections/`
2. **Theme:** `hugo mod get -u github.com/hugo-toha/toha/v4`
3. **Dependencies:** `npm update`

---

## 11. Future Roadmap

| Priority | Feature | Status |
|----------|---------|--------|
| Low | Enable blog section | Planned |
| Low | Add Portuguese translation | Planned |
| Medium | Add resume PDF download | Pending |
| Low | Enable portfolio/gallery | Not planned |

---

**Document maintained by:** João Trigo Soares  
**Repository:** https://github.com/suvl/suvl.github.io
