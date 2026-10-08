# Resume Template Engine & Export Architecture

**Module:** `frontend/src/features/portfolio/components/ResumeModule.tsx`  
**Data Layer:** `frontend/src/features/portfolio/data/resumeTemplates.ts`  
**Export Engine:** `frontend/src/features/portfolio/utils/resumeExport.ts`  
**Styles:** `frontend/src/index.css` (`@media print`)  

---

## 1. System Overview

The **Resume Template Engine** provides a dynamic, role-tailored resume experience for hiring managers, technical recruiters, and engineering executives. Rather than presenting a generic, one-size-fits-all resume, the engine allows visitors to toggle between distinct target-role specializations. 

When a visitor downloads or prints the resume, the generated document is **dynamically constructed and styled according to the active template**.

---

## 2. Available Resume Presets

| Template Key | Display Name | Target Focus | Accent Color | Intended Audience |
| :--- | :--- | :--- | :--- | :--- |
| `cloud-architect` | **Cloud Solutions Architect** | Infrastructure, Kubernetes, Spring Boot, Redis, Observability, 99.99% Availability | `#0284c7` (Sky/Cyan) | Platform Engineering Directors, Cloud Architecture Teams |
| `full-stack` | **Full-Stack Product Engineer** | React 19, TypeScript, Tailwind, Spring Boot APIs, UX Polish, Feature Velocity | `#0d9488` (Teal) | Product-led Startups, Engineering Managers |
| `minimal-ats` | **ATS Executive Technical Lead** | High-density ATS formatting, Leadership, Distributed Systems, Mentorship | `#334155` (Slate) | Automated ATS Screeners, VP of Engineering Reviews |

---

## 3. Template-Driven Download Mechanics

The platform offers three export methods, each strictly adhering to the selected template:

### 1. Word Document Export (`exportResumeAsDoc`)
- **Technology**: Office HTML MIME format (`application/msword;charset=utf-8`) with embedded Microsoft Word XML tags (`urn:schemas-microsoft-com:office:word`).
- **File Naming**: Dynamically generated as `abeeb_oladipupo_resume_<template_id>.doc`.
- **Formatting**:
  - Embedded `@page` definition setting exact 0.75-inch margins on US Letter size.
  - Native typography (Calibri / Segoe UI / Arial) with clean hierarchy.
  - Colored section dividing rules dynamically matching `template.accentColor`.
  - Structured HTML tables for role/company headers with clean right-aligned dates and locations.
  - Formatted bullet points for achievements and key responsibilities.
- **Compatibility**: Natively opens in **Microsoft Word**, **Google Docs**, **Apple Pages**, and **LibreOffice Writer** with perfect formatting and zero conversion degradation.

### 2. Print / PDF Export (`printResumeTemplate`)
- **Technology**: Native browser print subsystem orchestrated with CSS `@media print` rules.
- **Document Title Synchronization**: Temporarily modifies `document.title` to `Abeeb_Oladipupo_Resume_<TemplateId>` during the print lifecycle so the browser's default suggested filename when clicking **"Save as PDF"** is automatically formatted correctly.
- **Print Stylesheet (`index.css`)**:
  - Hides non-essential website UI (`nav`, `footer`, `#projects`, `#admin`, `#contact`, `.no-print`).
  - Strips website dark-mode backgrounds, rendering clean, high-contrast black typography on pure white paper.
  - Removes container borders, shadows, and paddings for a true printed document layout.

### 3. Markdown (ATS-Optimized) Export (`exportResumeAsMarkdown`)
- **Technology**: Plaintext UTF-8 Markdown Blob (`text/markdown;charset=utf-8`).
- **File Naming**: `abeeb_oladipupo_resume_<template_id>.md`.
- **Purpose**: Tailored for developer portfolios, GitHub profiles, and strict text-based Applicant Tracking Systems (ATS) that parse plaintext headers, bullet points, and contact hyperlinks.

---

## 4. Data Model & Contract

Each template implements the `ResumeTemplate` interface:

```typescript
export interface ResumeTemplate {
  id: 'cloud-architect' | 'full-stack' | 'minimal-ats'
  name: string
  targetRole: string
  badge: string
  description: string
  accentColor: string
  contact: {
    fullName: string
    email: string
    location: string
    linkedin: string
    github: string
    website: string
  }
  summary: string
  skills: ResumeSkillCategory[]
  experience: ResumeExperience[]
  projects: ResumeProject[]
  education: ResumeEducation[]
  certifications: string[]
}
```

---

## 5. How to Add a New Resume Preset

To add a new specialization preset (e.g., `devops-sre` or `data-engineer`):

1. **Extend Type**: Add the new key to `ResumeTemplate['id']` in `resumeTemplates.ts`.
2. **Add Data Definition**: Add a new configuration entry into `resumeTemplates` record in `frontend/src/features/portfolio/data/resumeTemplates.ts`.
3. **Verify Rendering**: The UI tab selector in `ResumeModule.tsx` automatically iterates over `Object.values(resumeTemplates)`, so the new preset tab, preview, and download triggers will appear automatically without manual component modifications.
4. **Test Exports**: Verify Word DOC, Markdown, and Print/PDF downloads for the new preset.
