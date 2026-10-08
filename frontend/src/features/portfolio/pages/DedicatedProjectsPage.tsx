/**
 * Dedicated Projects Page view (/projects).
 * Provides a focused showcase of selected projects and the interactive sandbox suite.
 */

import { ProjectDemoView } from '../components/ProjectDemoView'
import { usePortfolioProjects } from '../hooks/usePortfolioProjects'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { useRouter } from '../../../lib/router'

const viewportLabelMap = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile',
} as const

export function DedicatedProjectsPage() {
  const { navigate } = useRouter()
  const { projects, loading, isOfflineFallback } = usePortfolioProjects()
  const { settings } = useSiteSettings()

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
              AO
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-200">
                {settings.fullName || 'Abeeb Oladipupo'}
              </p>
              <p className="text-[11px] text-cyan-600 dark:text-cyan-400">
                {settings.professionalTitle || 'Software Developer | Systems & Cybersecurity'}
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
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-950/5 transition duration-200 hover:-translate-y-1 hover:border-cyan-500/50 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/25"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                      {project.status}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{project.year}</span>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{project.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{project.summary}</p>
                  </div>

                  {project.architectureFlow && (
                    <div className="mt-3 rounded-lg bg-slate-100 p-2 text-[10px] font-mono text-cyan-800 dark:bg-slate-950 dark:text-cyan-300">
                      <span className="font-semibold text-slate-500">Flow:</span> {project.architectureFlow}
                    </div>
                  )}

                  {project.problem && (
                    <div className="mt-3.5 space-y-2 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-xs dark:border-slate-800/80 dark:bg-slate-950/50">
                      <p className="text-slate-700 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-white">Challenge:</strong> {project.problem}
                      </p>
                      {project.solution && (
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong className="text-slate-900 dark:text-white">Solution:</strong> {project.solution}
                        </p>
                      )}
                    </div>
                  )}

                  {project.keyFeatures && (
                    <ul className="mt-3.5 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                      {project.keyFeatures.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={`${project.id}-${tech}`}
                        className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-3.5 dark:border-slate-800">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {viewportLabelMap[project.demoViewport]}
                  </span>
                  <a
                    href="#interactive-sandbox"
                    className="rounded-lg border border-cyan-400/60 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-500/20 dark:text-cyan-200"
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
