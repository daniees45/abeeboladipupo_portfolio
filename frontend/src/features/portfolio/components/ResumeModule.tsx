/**
 * ResumeModule component with dynamic template selection and template-driven downloads.
 *
 * Provides:
 * - Interactive template switching (Cloud Architect, Full-Stack Product, Minimal ATS)
 * - Live formatted resume sheet preview
 * - Download strictly driven by the active template (Word .doc, Markdown .md, and PDF Print)
 * - Print-optimized layout (@media print)
 */

import { useState } from 'react'
import { resumeTemplates, type ResumeTemplate } from '../data/resumeTemplates'
import { exportResumeAsDoc, exportResumeAsMarkdown, printResumeTemplate } from '../utils/resumeExport'

export function ResumeModule() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<ResumeTemplate['id']>('software-developer')

  const activeTemplate = resumeTemplates[selectedTemplateId]

  return (
    <section className="resume-module rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800">
      {/* Header with Title and Download Actions */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 lg:flex-row lg:items-end lg:justify-between no-print">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">
              Interactive Resume Engine
            </p>
            <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-700 dark:text-cyan-300">
              {activeTemplate.badge}
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            Professional Profile &amp; Résumé
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Select a specialized career track below. Downloads dynamically generate with that template's content and styling.
          </p>
        </div>

        {/* Action Download Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => exportResumeAsDoc(activeTemplate)}
            className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400 sm:text-sm"
            title="Download structured Word Document formatted with this template"
          >
            <span>📄</span>
            <span>Download DOC</span>
          </button>

          <button
            type="button"
            onClick={() => printResumeTemplate(activeTemplate)}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            title="Open browser print preview to Save as PDF"
          >
            <span>🖨️</span>
            <span>Print / PDF</span>
          </button>

          <button
            type="button"
            onClick={() => exportResumeAsMarkdown(activeTemplate)}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Download clean Markdown formatted with this template"
          >
            <span>📝</span>
            <span>Markdown (ATS)</span>
          </button>
        </div>
      </div>

      {/* Template Switcher Tabs */}
      <div className="mt-5 border-b border-slate-200 pb-4 dark:border-slate-800 no-print">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Select Career Track Template:
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.values(resumeTemplates) as ResumeTemplate[]).map((tmpl) => {
            const isSelected = tmpl.id === selectedTemplateId
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setSelectedTemplateId(tmpl.id)}
                className={`rounded-2xl border p-3.5 text-left transition ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-50/70 shadow-sm dark:border-cyan-400 dark:bg-cyan-950/30'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{tmpl.name}</h4>
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                  {tmpl.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Resume Document Preview Container */}
      <div className="resume-sheet mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-inner dark:border-slate-800 dark:bg-slate-950/80 sm:p-8">
        
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {activeTemplate.contact.fullName}
              </h3>
              <p className="mt-1 text-base font-semibold text-cyan-600 dark:text-cyan-400">
                {activeTemplate.targetRole}
              </p>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 sm:text-right">
              <p>{activeTemplate.contact.location}</p>
              <p className="mt-0.5 text-cyan-600 dark:text-cyan-400">{activeTemplate.contact.email}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
            <a href={activeTemplate.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500">
              LinkedIn &rarr;
            </a>
            <a href={activeTemplate.contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500">
              GitHub &rarr;
            </a>
            <span className="text-slate-400">• Active Template: <strong className="text-slate-700 dark:text-slate-200">{activeTemplate.name}</strong></span>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-400">
            Professional Summary
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {activeTemplate.summary}
          </p>
        </div>

        {/* Technical Competencies */}
        <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-400">
            Core Competencies &amp; Technical Stack
          </h4>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {activeTemplate.skills.map((skillGroup) => (
              <div key={skillGroup.category} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">{skillGroup.category}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {skillGroup.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-400">
            Professional Experience
          </h4>
          <div className="mt-4 space-y-5">
            {activeTemplate.experience.map((exp, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/40">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                    {exp.role} <span className="font-normal text-slate-500">— {exp.company}</span>
                  </h5>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{exp.period} • {exp.location}</span>
                </div>
                <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {exp.highlights.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2">
                      <span className="text-cyan-500 font-bold">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        {activeTemplate.projects && activeTemplate.projects.length > 0 && (
          <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-400">
              Featured Systems &amp; Projects
            </h4>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {activeTemplate.projects.map((proj, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">{proj.name}</h5>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{proj.description}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {proj.technologies.map((t) => (
                      <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Certifications */}
        <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-400">
                Education
              </h4>
              <div className="mt-3 space-y-3">
                {activeTemplate.education.map((edu, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{edu.degree}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{edu.institution} • {edu.period}</p>
                    {edu.details && (
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{edu.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {activeTemplate.certifications.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-400">
                  Certifications
                </h4>
                <div className="mt-3 space-y-2">
                  {activeTemplate.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-900/60">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-xs text-emerald-600 dark:text-emerald-400">
                        ✓
                      </span>
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}
