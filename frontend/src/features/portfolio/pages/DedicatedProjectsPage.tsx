/**
 * Dedicated Projects Page view (/projects).
 * Provides a focused showcase of selected projects and the interactive sandbox suite.
 */

import { ProjectDemoView } from '../components/ProjectDemoView'
import { usePortfolioProjects } from '../hooks/usePortfolioProjects'
import { useRouter } from '../../../lib/router'

const viewportLabelMap = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile',
} as const

export function DedicatedProjectsPage() {
  const { navigate } = useRouter()
  const { projects, loading, isOfflineFallback } = usePortfolioProjects()

  const portfolioProjects = projects.map((project) => ({
    ...project,
    demoUrl: `/demos/${project.slug}`,
    repoUrl: `/projects/${project.slug}`,
  }))

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* Header Bar */}
      <header className="border-b border-slate-200 bg-white/80 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-semibold text-cyan-600 dark:text-cyan-300"
            >
              A
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-200">
                Abeoladipupo
              </p>
              <p className="text-[11px] text-cyan-600 dark:text-cyan-400">
                Engineering Projects &amp; Live Sandbox
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              &larr; Portfolio Home
            </button>
            <button
              type="button"
              onClick={() => navigate('/resume')}
              className="rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Résumé &rarr;
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
        {/* Header Intro */}
        <div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">
                Selected Works
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                Engineering Projects &amp; Architecture
              </h2>
            </div>
            {isOfflineFallback && (
              <span className="w-fit rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                Offline demo dataset active
              </span>
            )}
          </div>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Explore production systems, cloud telemetry tools, and infrastructure automation workflows. Test live simulated sandboxes below.
          </p>
        </div>

        {/* Selected Project Grid */}
        {loading && portfolioProjects.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
            Loading project data from the API...
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {portfolioProjects.map((project) => (
              <article
                key={project.id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-950/5 transition duration-200 hover:-translate-y-1 hover:border-cyan-500/50 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/25"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                    {project.status}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{project.year}</span>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{project.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{project.summary}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={`${project.id}-${tech}`}
                      className="rounded-full border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {viewportLabelMap[project.demoViewport]}
                  </span>
                  <a
                    href="#interactive-sandbox"
                    className="rounded-md border border-cyan-400/60 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-500/20 dark:text-cyan-200"
                  >
                    Test Sandbox &darr;
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Live Interactive Sandbox */}
        <div id="interactive-sandbox" className="pt-4">
          <ProjectDemoView />
        </div>
      </main>
    </div>
  )
}
