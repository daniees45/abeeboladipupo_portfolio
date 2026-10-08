/**
 * Utility functions for exporting and downloading resumes according to selected templates.
 *
 * Supports:
 * - Word Document (.doc) export with template-specific styling and layout
 * - Clean Markdown (.md) export for ATS/developer workflows
 * - Template-specific Print / PDF trigger with proper document title naming
 */

import type { ResumeTemplate } from '../data/resumeTemplates'

/**
 * Exports the selected resume template as a formatted Word Document (.doc).
 * Uses Office HTML format with embedded MSO styles for Microsoft Word, Google Docs, and LibreOffice.
 */
export function exportResumeAsDoc(template: ResumeTemplate): void {
  if (typeof window === 'undefined') return

  const skillsHtml = template.skills
    .map(
      (s) => `
      <p style="margin: 4px 0; font-size: 11pt; color: #1e293b;">
        <strong style="color: #0f172a;">${s.category}:</strong> ${s.items.join(' • ')}
      </p>
    `,
    )
    .join('')

  const experienceHtml = template.experience
    .map(
      (exp) => `
      <div style="margin-bottom: 14px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="text-align: left; font-size: 11.5pt; font-weight: bold; color: #0f172a;">
              ${exp.role} — <span style="font-weight: normal; color: #334155;">${exp.company}</span>
            </td>
            <td style="text-align: right; font-size: 10pt; color: #64748b; white-space: nowrap;">
              ${exp.period} | ${exp.location}
            </td>
          </tr>
        </table>
        <ul style="margin: 6px 0 0 20px; padding: 0; font-size: 10.5pt; color: #334155; line-height: 1.45;">
          ${exp.highlights.map((h) => `<li style="margin-bottom: 4px;">${h}</li>`).join('')}
        </ul>
      </div>
    `,
    )
    .join('')

  const projectsHtml = template.projects
    .map(
      (proj) => `
      <div style="margin-bottom: 10px;">
        <p style="margin: 0; font-size: 11pt; font-weight: bold; color: #0f172a;">
          ${proj.name}
          <span style="font-size: 9.5pt; font-weight: normal; color: #64748b;">
            (${proj.technologies.join(', ')})
          </span>
        </p>
        <p style="margin: 3px 0 0 0; font-size: 10.5pt; color: #334155;">
          ${proj.description}
        </p>
      </div>
    `,
    )
    .join('')

  const educationHtml = template.education
    .map(
      (edu) => `
      <div style="margin-bottom: 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="text-align: left; font-size: 11pt; font-weight: bold; color: #0f172a;">
              ${edu.degree}
            </td>
            <td style="text-align: right; font-size: 10pt; color: #64748b;">
              ${edu.period}
            </td>
          </tr>
        </table>
        <p style="margin: 2px 0 0 0; font-size: 10.5pt; color: #475569;">
          ${edu.institution}${edu.details ? ` — <em>${edu.details}</em>` : ''}
        </p>
      </div>
    `,
    )
    .join('')

  const certificationsHtml = template.certifications.length
    ? `
      <h3 style="margin: 16px 0 6px 0; font-size: 12pt; text-transform: uppercase; letter-spacing: 1px; color: ${template.accentColor}; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px;">
        Certifications &amp; Accreditations
      </h3>
      <ul style="margin: 6px 0 0 20px; padding: 0; font-size: 10.5pt; color: #334155;">
        ${template.certifications.map((c) => `<li style="margin-bottom: 3px;">${c}</li>`).join('')}
      </ul>
    `
    : ''

  const documentHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>${template.contact.fullName} - ${template.targetRole}</title>
      <style>
        @page {
          size: letter;
          margin: 0.75in 0.75in 0.75in 0.75in;
        }
        body {
          font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
          line-height: 1.4;
          color: #0f172a;
          background-color: #ffffff;
        }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 16px; border-bottom: 2px solid ${template.accentColor}; padding-bottom: 12px;">
        <h1 style="margin: 0; font-size: 22pt; font-weight: bold; color: #0f172a; letter-spacing: -0.5px;">
          ${template.contact.fullName}
        </h1>
        <p style="margin: 4px 0 0 0; font-size: 12pt; font-weight: 600; color: ${template.accentColor};">
          ${template.targetRole}
        </p>
        <p style="margin: 6px 0 0 0; font-size: 9.5pt; color: #475569;">
          ${template.contact.location} •
          <a href="mailto:${template.contact.email}" style="color: #0284c7; text-decoration: none;">${template.contact.email}</a> •
          <a href="${template.contact.linkedin}" style="color: #0284c7; text-decoration: none;">LinkedIn</a> •
          <a href="${template.contact.github}" style="color: #0284c7; text-decoration: none;">GitHub</a>
        </p>
      </div>

      <!-- Executive Summary -->
      <h3 style="margin: 14px 0 6px 0; font-size: 12pt; text-transform: uppercase; letter-spacing: 1px; color: ${template.accentColor}; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px;">
        Professional Summary
      </h3>
      <p style="margin: 0 0 12px 0; font-size: 10.5pt; color: #334155; line-height: 1.5; text-align: justify;">
        ${template.summary}
      </p>

      <!-- Technical Competencies -->
      <h3 style="margin: 14px 0 6px 0; font-size: 12pt; text-transform: uppercase; letter-spacing: 1px; color: ${template.accentColor}; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px;">
        Core Competencies &amp; Technical Skills
      </h3>
      <div style="margin-bottom: 14px;">
        ${skillsHtml}
      </div>

      <!-- Professional Experience -->
      <h3 style="margin: 14px 0 6px 0; font-size: 12pt; text-transform: uppercase; letter-spacing: 1px; color: ${template.accentColor}; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px;">
        Professional Experience
      </h3>
      ${experienceHtml}

      <!-- Key Projects -->
      <h3 style="margin: 14px 0 6px 0; font-size: 12pt; text-transform: uppercase; letter-spacing: 1px; color: ${template.accentColor}; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px;">
        Featured Systems &amp; Technical Projects
      </h3>
      ${projectsHtml}

      <!-- Education -->
      <h3 style="margin: 14px 0 6px 0; font-size: 12pt; text-transform: uppercase; letter-spacing: 1px; color: ${template.accentColor}; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px;">
        Education
      </h3>
      ${educationHtml}

      <!-- Certifications -->
      ${certificationsHtml}
    </body>
    </html>
  `

  const blob = new Blob(['\ufeff', documentHtml], {
    type: 'application/msword',
  })
  const url = URL.createObjectURL(blob)
  const filename = `${template.contact.fullName.toLowerCase().replace(/\s+/g, '_')}_resume_${template.id.replace(/-/g, '_')}.doc`

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Exports the selected resume template as a clean, structured Markdown file (.md).
 */
export function exportResumeAsMarkdown(template: ResumeTemplate): void {
  if (typeof window === 'undefined') return

  const lines: string[] = [
    `# ${template.contact.fullName}`,
    `**${template.targetRole}**`,
    ``,
    `${template.contact.location} | [${template.contact.email}](mailto:${template.contact.email}) | [LinkedIn](${template.contact.linkedin}) | [GitHub](${template.contact.github})`,
    ``,
    `---`,
    ``,
    `## Professional Summary`,
    template.summary,
    ``,
    `## Technical Skills`,
  ]

  template.skills.forEach((s) => {
    lines.push(`- **${s.category}:** ${s.items.join(', ')}`)
  })

  lines.push(``, `## Professional Experience`)
  template.experience.forEach((exp) => {
    lines.push(
      ``,
      `### ${exp.role} — ${exp.company}`,
      `*${exp.period} | ${exp.location}*`,
      ``,
    )
    exp.highlights.forEach((h) => {
      lines.push(`- ${h}`)
    })
  })

  lines.push(``, `## Key Projects`)
  template.projects.forEach((proj) => {
    lines.push(
      ``,
      `### ${proj.name} (${proj.technologies.join(', ')})`,
      proj.description,
    )
  })

  lines.push(``, `## Education`)
  template.education.forEach((edu) => {
    lines.push(
      ``,
      `### ${edu.degree} — ${edu.institution}`,
      `*${edu.period}*`,
      edu.details ? `${edu.details}` : '',
    )
  })

  if (template.certifications.length) {
    lines.push(``, `## Certifications`)
    template.certifications.forEach((c) => {
      lines.push(`- ${c}`)
    })
  }

  const content = lines.join('\n')
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const filename = `${template.contact.fullName.toLowerCase().replace(/\s+/g, '_')}_resume_${template.id.replace(/-/g, '_')}.md`

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Triggers template-specific PDF printing.
 * Temporarily sets document.title so the browser defaults to a clean filename when saving as PDF.
 */
export function printResumeTemplate(template: ResumeTemplate): void {
  if (typeof window === 'undefined') return

  const originalTitle = document.title
  const pdfTitle = `${template.contact.fullName.replace(/\s+/g, '_')}_Resume_${template.id.replace(/-/g, '_')}`
  document.title = pdfTitle

  window.print()

  // Restore original title after print dialog closes
  setTimeout(() => {
    document.title = originalTitle
  }, 1000)
}
