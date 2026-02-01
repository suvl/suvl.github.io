# Product Requirements Document (PRD)

## João Trigo Soares - Personal CV Website

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Project URL:** https://jtsoar.es/

---

## 1. Executive Summary

This is a personal CV/resume website for João Trigo Soares, a DevOps Team Leader based in Lisbon, Portugal. The site is built using Hugo static site generator with the `hugo-devresume-theme`, a professionally designed developer resume template. The website serves as a digital portfolio and professional presence, showcasing work experience, technical skills, education, and certifications.

**Current State:** The website has not been updated in approximately 5 years (last notable content dates to 2021). It requires content updates to reflect current career progression and technology stack.

---

## 2. Goals & Objectives

### 2.1 Primary Goals

| Goal | Description | Success Metric |
|------|-------------|----------------|
| **Professional Visibility** | Provide a public, easily accessible resume for recruiters, hiring managers, and professional contacts | Active website with current information |
| **Personal Branding** | Establish a professional online presence that reflects expertise in DevOps and Cloud Native technologies | Consistent, modern presentation of skills and experience |
| **SEO & Discoverability** | Ensure the website is discoverable via search engines | Proper meta tags, Google Analytics integration |
| **Low Maintenance** | Static site that requires minimal hosting and maintenance overhead | GitHub Pages hosting, Hugo static generation |

### 2.2 Secondary Goals

- Showcase open-source contributions and notable projects
- Display professional certifications (CKA, CKAD, CKS)
- Provide multiple contact methods for professional inquiries
- Demonstrate technical competency through the website itself

---

## 3. User Personas

### 3.1 Primary Persona: Technical Recruiter

**Name:** Maria, Technical Recruiter  
**Company Type:** Tech company or recruitment agency  
**Goals:**
- Quickly assess candidate's technical background and experience level
- Verify claimed certifications and skills
- Find contact information for outreach
- Understand career progression

**Needs from the Website:**
- Clear, scannable layout of skills and experience
- Prominent display of certifications with verification links
- Easy-to-find contact information
- PDF download option (not currently available)

**Pain Points:**
- Information overload; wants quick summary
- Outdated information makes assessment difficult

---

### 3.2 Secondary Persona: Hiring Manager / Engineering Lead

**Name:** Carlos, VP of Engineering  
**Company Type:** Enterprise or scale-up  
**Goals:**
- Deep-dive into technical capabilities
- Understand specific technologies and project experience
- Assess leadership and team experience
- Evaluate culture fit through interests and communication style

**Needs from the Website:**
- Detailed project descriptions with technologies used
- Evidence of leadership roles and responsibilities
- Links to GitHub, LinkedIn for further research
- Clear narrative of career growth

**Pain Points:**
- Generic descriptions without specific achievements
- Missing metrics or impact statements

---

### 3.3 Tertiary Persona: Professional Peer / Conference Attendee

**Name:** Ana, DevOps Engineer  
**Company Type:** Various  
**Goals:**
- Network with like-minded professionals
- Learn about interesting projects and approaches
- Find collaboration opportunities

**Needs from the Website:**
- Links to social profiles (GitHub, LinkedIn, Twitter)
- Information about interests and side projects
- Evidence of community involvement (conferences, open source)

---

## 4. Core Features

### 4.1 Currently Implemented Features

| Feature | Status | Section | Description |
|---------|--------|---------|-------------|
| **Profile Header** | ✅ Active | Header | Name, tagline, and professional photo |
| **Contact Information** | ✅ Active | Header | Email, website, location |
| **Professional Summary** | ✅ Active | Summary | Career narrative and certification highlights |
| **Work Experience** | ✅ Active | Experience | 6 positions with detailed descriptions and tech stacks |
| **Technical Skills** | ✅ Active | Skills | Comprehensive list of technologies organized by category |
| **Professional Skills** | ✅ Active | Skills | Soft skills and competencies |
| **Education** | ✅ Active | Sidebar | BSc and MSc from University of Porto |
| **Languages** | ✅ Active | Sidebar | Portuguese (Native), English (Professional) |
| **Interests** | ✅ Active | Sidebar | Personal hobbies and interests |
| **Social Links** | ✅ Active | Footer | GitHub, LinkedIn, Twitter |
| **Google Analytics** | ✅ Active | Head | UA-61989966-1 tracking code |
| **Responsive Design** | ✅ Active | Theme | Mobile-friendly Bootstrap 4 layout |

### 4.2 Disabled/Optional Features

| Feature | Status | Reason/Notes |
|---------|--------|--------------|
| **Awards** | ❌ Disabled | No awards configured |
| **Projects Section** | ❌ Disabled | Content exists but section is disabled |
| **Information/Papers** | ❌ Disabled | Not relevant or needs updating |

### 4.3 Missing Features (Potential Enhancements)

| Feature | Priority | Rationale |
|---------|----------|-----------|
| **PDF Export** | High | Recruiters often need downloadable resumes |
| **Dark Mode** | Medium | Modern UX expectation |
| **Blog/Articles** | Low | Content marketing, thought leadership |
| **Project Portfolio** | Medium | Already has content, just disabled |
| **Updated Analytics** | High | GA4 migration (UA deprecated) |
| **Certifications Section** | Medium | Currently embedded in summary text |

---

## 5. Technical Architecture

### 5.1 Technology Stack

| Component | Technology | Version/Notes |
|-----------|------------|---------------|
| **Static Site Generator** | Hugo | v0.69.0-DEV |
| **Theme** | hugo-devresume-theme | Custom fork |
| **CSS Framework** | Bootstrap 4 | SCSS source included |
| **Icons** | Font Awesome 5 | v5.8.1 |
| **Fonts** | Google Fonts (Roboto) | 300-900 weights |
| **Hosting** | GitHub Pages | suvl.github.io |
| **Domain** | jtsoar.es | CNAME configured |
| **Analytics** | Google Analytics | UA tracking (legacy) |

### 5.2 Project Structure

```
suvl.github.io/
├── src/                    # Hugo source files
│   ├── config.toml         # Main configuration (all content)
│   ├── themes/             # Theme files
│   │   └── hugo-devresume-theme/
│   ├── static/             # Static assets
│   └── resources/          # Generated resources
├── index.html              # Generated output (publishDir: ../)
├── assets/                 # Generated CSS/images
├── CNAME                   # Custom domain config
└── README.md               # Build instructions
```

### 5.3 Build Process

```bash
cd src
hugo -b "https://jtsoar.es" --gc --minify  # Production build
hugo server --bind 0.0.0.0 --disableFastRender  # Development
```

---

## 6. Content Inventory (Current State - 2021)

### 6.1 Work Experience Timeline

| Period | Role | Company |
|--------|------|---------|
| 2021 - Present | DevOps Team Leader | NOS Inovação |
| 2018 - 2021 | DevOps Engineer | NOS Inovação |
| 2017 - 2018 | Lead Software Engineer | NOS Inovação |
| 2015 - 2017 | Senior Software Engineer | NOS Inovação |
| 2011 - 2015 | Software Engineer | Accenture Technology Solutions |
| 2010 - 2011 | Researcher | INESC TEC |

### 6.2 Certifications

- **CKA** - Certified Kubernetes Administrator (ID: LF-7j6a6nkfxw)
- **CKAD** - Certified Kubernetes Application Developer (ID: LF-aqpmniufwu)
- **CKS** - Certified Kubernetes Security Specialist (ID: LF-rlmu1d2eat)

### 6.3 Key Technical Domains

- Kubernetes & Cloud Native (CNCF ecosystem)
- Container Technologies (Docker, containerd, CRI-O)
- Cloud Platforms (Azure/AKS, GCP/GKE)
- GitOps & CI/CD (Jenkins, Azure DevOps, Flux)
- Infrastructure as Code (Terraform, Ansible)
- Distributed Storage (Ceph, Rook)
- Observability (Prometheus, Grafana, ELK)

---

## 7. Identified Issues & Technical Debt

### 7.1 Content Issues

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| Outdated experience (5 years) | 🔴 Critical | Update with current role and recent achievements |
| "2021 - Present" still showing | 🔴 Critical | Update tenure dates |
| Kubernetes version "1.11 to latest" outdated | 🟡 Medium | Update to current LTS versions |
| Technology references may be outdated | 🟡 Medium | Review all tech references |
| Twitter/X branding change | 🟢 Low | Update social icon/branding |

### 7.2 Technical Issues

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| Hugo version 0.69.0-DEV is very old | 🟡 Medium | Upgrade to latest Hugo |
| Google Analytics UA deprecated | 🔴 Critical | Migrate to GA4 |
| No SSL certificate visible in config | 🟢 Low | Verify HTTPS configuration |
| Font Awesome 5.8.1 outdated | 🟢 Low | Consider upgrade to v6 |

### 7.3 Feature Gaps

| Gap | Impact | Recommendation |
|-----|--------|----------------|
| No PDF resume download | High | Add downloadable PDF |
| Projects section disabled | Medium | Enable and update content |
| No structured data (JSON-LD) | Medium | Add for better SEO |
| No meta image for social sharing | Medium | Add Open Graph image |

---

## 8. Recommendations for Update

### 8.1 Immediate Priority (Phase 1)

1. **Update work experience** - Add 2021-2026 achievements and any role changes
2. **Refresh skills section** - Add newer technologies, remove obsolete ones
3. **Migrate Google Analytics** - Switch from UA to GA4
4. **Update Hugo version** - Upgrade to latest stable release
5. **Verify all links** - Check for broken certification/social links

### 8.2 Short-term Improvements (Phase 2)

1. **Enable Projects section** - Showcase notable open source/proprietary work
2. **Add PDF download** - Generate downloadable resume
3. **Add separate Certifications section** - Better visibility for credentials
4. **Improve meta tags** - Open Graph, Twitter Cards for social sharing

### 8.3 Long-term Enhancements (Phase 3)

1. **Consider theme update or redesign** - Modern aesthetics
2. **Add blog capability** - Thought leadership content
3. **Implement dark mode** - User preference support
4. **Add structured data** - JSON-LD for better SEO

---

## 9. Success Metrics

| Metric | Current Baseline | Target |
|--------|------------------|--------|
| Content freshness | 5 years old | Updated quarterly |
| Page load time | TBD | < 2 seconds |
| Mobile responsiveness | Good | Excellent |
| Analytics tracking | UA (deprecated) | GA4 active |
| Social link validity | Unknown | 100% working |
| Certification verification | Links present | All verifiable |

---

## 10. Appendix

### A. Build Commands Reference

```bash
# Development server
cd src && hugo server --bind 0.0.0.0 --disableFastRender

# Production build
cd src && hugo -b "https://jtsoar.es" --gc --minify

# Output goes to parent directory (publishDir = "../")
```

### B. Configuration File Location

All content is managed in a single configuration file:
- **Path:** `src/config.toml`
- **Format:** TOML with nested params structure

### C. Theme Credits

- **Original Design:** Xiaoying Riley @ 3rd Wave Media
- **Hugo Port:** CowboySmall
- **Theme:** hugo-devresume-theme

---

*This PRD was generated based on analysis of the existing codebase as of February 2026.*
