/**
 * Project management module for drafting and previewing portfolio projects.
 *
 * This module is intentionally local-first so it remains usable without a paid
 * backend or external SaaS. It can later be connected to a secure API if the
 * portfolio owner wants to persist entries to PostgreSQL.
 */
import { useState, type FormEvent } from 'react'
import type { PortfolioProjectApiResponse } from '../types'

type ProjectDraft = {
  title: string
  summary: string
  githubUrl: string
  demoUrl: string
  stack: string
}

const initialDraft: ProjectDraft = {
  title: '',
  summary: '',
  githubUrl: '',
  demoUrl: '',
  stack: 'React, TypeScript, Spring Boot',
}

interface ProjectManagementPanelProps {
  onProjectAdded?: (project: PortfolioProjectApiResponse) => void
}

export function ProjectManagementPanel({ onProjectAdded }: ProjectManagementPanelProps = {}) {
  const [draft, setDraft] = useState<ProjectDraft>(initialDraft)
  const [storedProjects, setStoredProjects] = useState<ProjectDraft[]>([
    {
      title: 'Portfolio Platform',
      summary: 'A secure portfolio experience with live preview tooling and production-grade content publishing.',
      githubUrl: 'https://github.com/example/portfolio-platform',
      demoUrl: '/demos/portfolio-platform',
      stack: 'React, Vite, Tailwind, Java',
    },
  ])

  const handleChange = (field: keyof ProjectDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedDraft = { ...draft }
    if (!normalizedDraft.title.trim()) {
      return
    }

    setStoredProjects((current) => [normalizedDraft, ...current])
    
    const slug = normalizedDraft.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    onProjectAdded?.({
      id: slug || `project-${Date.now()}`,
      title: normalizedDraft.title.trim(),
      slug: slug || `project-${Date.now()}`,
      summary: normalizedDraft.summary.trim() || 'Project summary pending.',
      stack: normalizedDraft.stack.split(',').map((item) => item.trim()).filter(Boolean),
      status: 'live',
      demoViewport: 'desktop',
      year: new Date().getFullYear(),
    })

    setDraft(initialDraft)
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">Project management</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Add and preview projects</h2>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-200">
          GitHub-ready • demo-ready
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/70">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Project title</label>
            <input
              value={draft.title}
              onChange={(event) => handleChange('title', event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-cyan-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              placeholder="AI workflow dashboard"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Summary</label>
            <textarea
              value={draft.summary}
              onChange={(event) => handleChange('summary', event.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              placeholder="Describe the value and engineering outcome of the project."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">GitHub URL</label>
            <input
              value={draft.githubUrl}
              onChange={(event) => handleChange('githubUrl', event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              placeholder="https://github.com/owner/repo"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Demo URL</label>
            <input
              value={draft.demoUrl}
              onChange={(event) => handleChange('demoUrl', event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              placeholder="/demos/project-name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Stack</label>
            <input
              value={draft.stack}
              onChange={(event) => handleChange('stack', event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              placeholder="React, TypeScript, Node.js"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Add project
          </button>
        </form>

        <div className="space-y-4">
          {storedProjects.map((project, index) => (
            <article key={`${project.title}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/80">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{project.title}</h3>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300">
                  Ready
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{project.summary}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.split(',').map((item) => (
                  <span key={`${project.title}-${item}`} className="rounded-full border border-slate-300 bg-white px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    {item.trim()}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <a href={project.githubUrl || '#'} className="text-cyan-600 hover:text-cyan-500 dark:text-cyan-300">GitHub</a>
                <a href={project.demoUrl || '#'} className="text-cyan-600 hover:text-cyan-500 dark:text-cyan-300">Demo</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
