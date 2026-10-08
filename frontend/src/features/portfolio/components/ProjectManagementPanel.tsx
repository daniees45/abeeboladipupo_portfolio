import { useState, useEffect, type FormEvent } from 'react'
import { fetchAdminProjects, createAdminProject, deleteAdminProject } from '../api/portfolioApi'
import type { PortfolioProjectApiResponse } from '../types'

interface ProjectManagementPanelProps {
  onProjectAdded?: (project: PortfolioProjectApiResponse) => void
}

export function ProjectManagementPanel({ onProjectAdded }: ProjectManagementPanelProps = {}) {
  const [projects, setProjects] = useState<PortfolioProjectApiResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [problem, setProblem] = useState('')
  const [solution, setSolution] = useState('')
  const [architectureFlow, setArchitectureFlow] = useState('')
  const [keyFeatures, setKeyFeatures] = useState('')
  const [technologies, setTechnologies] = useState('Java 21, Spring Boot 3, PostgreSQL')
  const [githubUrl, setGithubUrl] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [featured, setFeatured] = useState(true)

  const loadProjects = () => {
    setLoading(true)
    fetchAdminProjects()
      .then((data) => setProjects(data))
      .catch((err) => {
        setFeedback({
          type: 'error',
          message: `Failed to load projects: ${err instanceof Error ? err.message : 'Unknown error'}`,
        })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let ignore = false
    fetchAdminProjects()
      .then((data) => {
        if (!ignore) setProjects(data)
      })
      .catch((err) => {
        if (!ignore) {
          setFeedback({
            type: 'error',
            message: `Failed to load projects: ${err instanceof Error ? err.message : 'Unknown error'}`,
          })
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !summary.trim()) return

    setSaving(true)
    setFeedback(null)

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const payload = {
      title: title.trim(),
      slug,
      summary: summary.trim(),
      contentMarkdown: `## ${title.trim()}\n\n${summary.trim()}\n\n### Problem\n${problem.trim()}\n\n### Solution\n${solution.trim()}`,
      problem: problem.trim() || undefined,
      solution: solution.trim() || undefined,
      architectureFlow: architectureFlow.trim() || undefined,
      keyFeatures: keyFeatures.trim() || undefined,
      technologies: technologies.trim() || undefined,
      repositoryUrl: githubUrl.trim() || undefined,
      demoUrl: demoUrl.trim() || `/demos/${slug}`,
      liveUrl: demoUrl.trim() || `/projects/${slug}`,
      published: true,
      featured,
      displayOrder: projects.length + 1,
    }

    try {
      const created = await createAdminProject(payload)
      setFeedback({ type: 'success', message: `Project "${created.title}" successfully created in database!` })
      setTitle('')
      setSummary('')
      setProblem('')
      setSolution('')
      setArchitectureFlow('')
      setKeyFeatures('')
      setGithubUrl('')
      setDemoUrl('')
      loadProjects()
      onProjectAdded?.(created)
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Failed to create project: ${err instanceof Error ? err.message : 'Unknown error'}`,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, projectTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${projectTitle}" from the database?`)) return
    try {
      await deleteAdminProject(id)
      setFeedback({ type: 'success', message: `Deleted "${projectTitle}" from database.` })
      loadProjects()
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Failed to delete project: ${err instanceof Error ? err.message : 'Unknown error'}`,
      })
    }
  }

  return (
    <section className="space-y-6">
      {/* Header and Feedback */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
        <div className="border-b border-slate-800 pb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Engineering CMS</p>
            <h2 className="mt-1 text-2xl font-bold text-white">Create Case Study Project</h2>
            <p className="mt-1 text-xs text-slate-400">
              Publish structured architectural case studies directly into PostgreSQL and the live sandbox suite.
            </p>
          </div>
          <button
            type="button"
            onClick={loadProjects}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 hover:text-white w-fit"
          >
            🔄 Refresh Projects
          </button>
        </div>

        {feedback && (
          <div
            className={`mt-4 rounded-xl p-3 text-xs font-medium border ${
              feedback.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Project Title</label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enterprise Identity & Access Broker"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Architecture Flow</label>
              <input
                value={architectureFlow}
                onChange={(e) => setArchitectureFlow(e.target.value)}
                placeholder="Client SPA → Envoy Proxy → Spring Boot API → PostgreSQL"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Executive Summary</label>
            <textarea
              required
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="High-level engineering overview explaining what the system achieves..."
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Problem / Challenge</label>
              <textarea
                rows={2}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="The specific real-world organizational bottleneck or technical challenge..."
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Engineered Solution</label>
              <textarea
                rows={2}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Architectural approach, algorithmic heuristics, and safety mitigations applied..."
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Technologies (CSV)</label>
              <input
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                placeholder="Java 21, Spring Boot, PostgreSQL, Docker"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">GitHub Repository URL</label>
              <input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/abeeboladipupo/repo"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Demo URL / Route</label>
              <input
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="/demos/project-slug"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Key Features (Semicolon separated)</label>
            <input
              value={keyFeatures}
              onChange={(e) => setKeyFeatures(e.target.value)}
              placeholder="Stateless JWT Validation; Role-based access gates; Real-time audit telemetry"
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-400"
              />
              <label htmlFor="featured" className="text-xs font-medium text-slate-300 cursor-pointer">
                Mark as Featured Centerpiece Project
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-cyan-500 px-6 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Creating in Database...' : 'Publish Project to Database'}
            </button>
          </div>
        </form>
      </div>

      {/* Database Projects List */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white">Published Projects in Database ({projects.length})</h3>
        <p className="mt-1 text-xs text-slate-400">
          Projects stored in PostgreSQL and rendered on public routes and interactive sandbox sandboxes.
        </p>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading projects from PostgreSQL...</div>
        ) : projects.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">No projects found in database.</div>
        ) : (
          <div className="mt-4 space-y-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 transition hover:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400">
                      {proj.status.toUpperCase()}
                    </span>
                    <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                    <span className="font-mono text-[11px] text-slate-500">/{proj.slug}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2 max-w-2xl">{proj.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {proj.stack.map((tech) => (
                      <span
                        key={`${proj.id}-${tech}`}
                        className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <a
                    href={`/demos/${proj.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-300 hover:bg-cyan-500/20"
                  >
                    View Demo
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(proj.id, proj.title)}
                    className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/20 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
