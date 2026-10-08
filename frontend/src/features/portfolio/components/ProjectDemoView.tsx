import { useEffect, useMemo, useState } from 'react'
import { portfolioProjects } from '../data/projects'
import type { DemoViewport, PortfolioProject } from '../types'

type DemoMessage = {
  type: 'demo:ready'
  projectId: string
  viewport: DemoViewport
}

type ViewMode = 'interactive' | 'iframe'

const viewportOptions: Record<
  DemoViewport,
  { label: string; widthClass: string; containerClass: string }
> = {
  desktop: {
    label: 'Desktop',
    widthClass: 'w-full max-w-5xl',
    containerClass: 'min-h-[460px]',
  },
  tablet: {
    label: 'Tablet',
    widthClass: 'w-[768px] max-w-full',
    containerClass: 'min-h-[520px]',
  },
  mobile: {
    label: 'Mobile',
    widthClass: 'w-[390px] max-w-full',
    containerClass: 'min-h-[620px]',
  },
}

function buildDemoUrl(project: PortfolioProject): string {
  const baseUrl = (import.meta.env.VITE_DEMO_BASE_URL ?? window.location.origin)
    .replace(/\/$/, '')
  const path = project.demoUrl.replace(/^\/+/, '')

  return new URL(path, `${baseUrl}/`).toString()
}

export function ProjectDemoView() {
  const initialProject = portfolioProjects[0]
  const [selectedId, setSelectedId] = useState<string>(initialProject?.id ?? '')
  const [activeViewport, setActiveViewport] = useState<DemoViewport>(initialProject?.demoViewport ?? 'desktop')
  const [viewMode, setViewMode] = useState<ViewMode>('interactive')
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('Secure demo environment active')

  // Observability simulator state
  const [requestLog, setRequestLog] = useState([
    { method: 'GET', path: '/api/v1/metrics', status: 200, time: '3ms', cache: 'HIT (Redis)' },
    { method: 'GET', path: '/api/v1/projects', status: 200, time: '14ms', cache: 'HIT (Postgres)' },
    { method: 'POST', path: '/api/v1/projects', status: 201, time: '38ms', cache: 'WRITE' },
  ])
  const [apiRps, setApiRps] = useState(24)

  // Cloud automation simulator state
  const [deployStep, setDeployStep] = useState<number>(5)
  const [isDeploying, setIsDeploying] = useState(false)
  const [logs, setLogs] = useState<string[]>([
    '✓ Linting and oxlint static checks passed in 62ms',
    '✓ Maven test suite passed: 14 test cases verified',
    '✓ Multi-stage Docker container built (size: 142MB)',
    '✓ PostgreSQL schema migration verified',
    '✓ Zero-downtime rolling update deployed to production',
  ])

  const selectedProject = useMemo(
    () => portfolioProjects.find((project) => project.id === selectedId) ?? initialProject,
    [initialProject, selectedId],
  )

  useEffect(() => {
    if (!selectedProject) {
      return
    }

    const onMessage = (event: MessageEvent) => {
      const payload = event.data as Partial<DemoMessage>
      if (payload?.type !== 'demo:ready') {
        return
      }

      if (payload.projectId !== selectedProject.id) {
        return
      }

      setStatusMessage(`Secure signal verified for ${selectedProject.title}.`)
      setIsLoading(false)
    }

    window.addEventListener('message', onMessage)

    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [selectedProject])

  if (!selectedProject) {
    return null
  }

  const handleProjectChange = (project: PortfolioProject) => {
    setSelectedId(project.id)
    setActiveViewport(project.demoViewport)
    setStatusMessage(`Active project: ${project.title}`)
  }

  const handleViewportChange = (viewport: DemoViewport) => {
    setActiveViewport(viewport)
    setStatusMessage(`Preview switched to ${viewportOptions[viewport].label}.`)
  }

  const triggerHandshake = () => {
    window.postMessage(
      {
        type: 'demo:ready',
        projectId: selectedProject.id,
        viewport: activeViewport,
      },
      '*',
    )
    setStatusMessage(`Handshake signal transmitted: demo:ready for ${selectedProject.title}`)
  }

  const handleSimulateRequest = () => {
    const endpoints = [
      { method: 'GET', path: '/api/v1/projects', time: `${Math.floor(Math.random() * 12 + 6)}ms`, cache: 'HIT (Redis)' },
      { method: 'GET', path: '/api/v1/metrics', time: `${Math.floor(Math.random() * 5 + 2)}ms`, cache: 'HIT (Redis)' },
      { method: 'GET', path: '/api/v1/resume', time: `${Math.floor(Math.random() * 8 + 4)}ms`, cache: 'HIT' },
      { method: 'POST', path: '/api/v1/projects', time: `${Math.floor(Math.random() * 30 + 20)}ms`, cache: 'WRITE' },
    ]
    const chosen = endpoints[Math.floor(Math.random() * endpoints.length)]
    setRequestLog((prev) => [
      { ...chosen, status: 200 },
      ...prev.slice(0, 5),
    ])
    setApiRps((prev) => prev + Math.floor(Math.random() * 5 - 2))
  }

  const handleTriggerDeploy = () => {
    if (isDeploying) return
    setIsDeploying(true)
    setDeployStep(1)
    setLogs(['[Pipeline Initialized] Fetching git refs...'])

    const steps = [
      { step: 2, log: '✓ Oxlint & TypeScript compilation clean (0 errors)' },
      { step: 3, log: '✓ JUnit 5 test suite: 14/14 tests green (0 flaky)' },
      { step: 4, log: '✓ Container image pushed to ghcr.io/abeeboladipupo (sha: ' + Math.random().toString(36).substring(2, 8) + ')' },
      { step: 5, log: '✓ Health check HTTP 200 OK — Production rollout active!' },
    ]

    steps.forEach((s, idx) => {
      setTimeout(() => {
        setDeployStep(s.step)
        setLogs((prev) => [...prev, s.log])
        if (idx === steps.length - 1) {
          setIsDeploying(false)
        }
      }, (idx + 1) * 800)
    })
  }

  const iframeSource = buildDemoUrl(selectedProject)
  const currentViewport = viewportOptions[activeViewport]

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl shadow-slate-950/30">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">Project Demo Sandbox</p>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
              Interactive
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Live interactive engineering demos</h2>
        </div>

        {/* Project Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {portfolioProjects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => handleProjectChange(project)}
              className={[
                'rounded-full border px-3.5 py-1.5 text-xs font-medium transition sm:text-sm',
                selectedId === project.id
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-sm shadow-cyan-500/20'
                  : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500 hover:text-white',
              ].join(' ')}
            >
              {project.title}
            </button>
          ))}
        </div>
      </div>

      {/* Control Bar: Viewport + Mode */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-slate-800 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-400">Viewport:</span>
          {(Object.keys(viewportOptions) as DemoViewport[]).map((viewport) => (
            <button
              key={viewport}
              type="button"
              onClick={() => handleViewportChange(viewport)}
              className={[
                'rounded-lg border px-2.5 py-1 text-xs uppercase tracking-wider transition',
                activeViewport === viewport
                  ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200'
                  : 'border-slate-700 bg-slate-950 text-slate-400 hover:text-slate-100',
              ].join(' ')}
            >
              {viewportOptions[viewport].label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('interactive')}
            className={[
              'rounded-lg px-3 py-1 text-xs font-medium transition',
              viewMode === 'interactive'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white',
            ].join(' ')}
          >
            Interactive Sandbox
          </button>
          <button
            type="button"
            onClick={() => setViewMode('iframe')}
            className={[
              'rounded-lg px-3 py-1 text-xs font-medium transition',
              viewMode === 'iframe'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white',
            ].join(' ')}
          >
            External Frame
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/90 p-4">
        {/* Status header */}
        <div className="mb-3 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-slate-400">
          <span className="font-semibold text-slate-300">{selectedProject.title}</span>
          <span className="text-emerald-400">{statusMessage}</span>
        </div>

        {/* Viewport Frame */}
        <div className="flex justify-center overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 px-2 py-4">
          <div className={`relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900 ${currentViewport.containerClass} ${currentViewport.widthClass} transition-all duration-300`}>
            
            {/* Window bar */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span>{selectedProject.slug} • {currentViewport.label}</span>
              <span className="text-cyan-400">{viewMode}</span>
            </div>

            {/* Interactive Mode Content */}
            {viewMode === 'interactive' && (
              <div className="p-5 text-slate-100">
                {selectedProject.id === 'project-demo-view' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white">PostMessage Handshake Simulator</h4>
                        <p className="text-xs text-slate-300">Test cross-origin window messaging protocol between parent container &amp; embedded app.</p>
                      </div>
                      <button
                        type="button"
                        onClick={triggerHandshake}
                        className="rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
                      >
                        Transmit Handshake
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">Target Protocol</p>
                        <p className="mt-1 text-sm font-semibold text-cyan-300">postMessage API</p>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">Message Type</p>
                        <p className="mt-1 text-sm font-semibold text-slate-200">demo:ready</p>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">Active Viewport</p>
                        <p className="mt-1 text-sm font-semibold text-emerald-400">{currentViewport.label}</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Interactive Controls Preview</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedProject.stack.map((tech) => (
                          <span key={tech} className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedProject.id === 'api-observability' && (
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-4">
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-emerald-400">Service Status</p>
                        <p className="mt-1 text-lg font-bold text-emerald-300">HEALTHY (UP)</p>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">Throughput</p>
                        <p className="mt-1 text-lg font-bold text-white">{apiRps} req/sec</p>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">p99 Latency</p>
                        <p className="mt-1 text-lg font-bold text-cyan-300">14.2 ms</p>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">Redis Cache Hit</p>
                        <p className="mt-1 text-lg font-bold text-emerald-400">96.8%</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Live API Traffic Stream</span>
                        <button
                          type="button"
                          onClick={handleSimulateRequest}
                          className="rounded-md bg-cyan-500/20 px-2.5 py-1 text-xs font-medium text-cyan-300 hover:bg-cyan-500/30"
                        >
                          + Send API Request
                        </button>
                      </div>
                      <div className="mt-2 space-y-1.5 font-mono text-xs">
                        {requestLog.map((req, i) => (
                          <div key={i} className="flex items-center justify-between rounded bg-slate-900/60 px-2.5 py-1 text-slate-300">
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-400 font-semibold">{req.method}</span>
                              <span className="text-slate-200">{req.path}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-cyan-400">{req.time}</span>
                              <span className="text-[11px] text-slate-400">{req.cache}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedProject.id === 'cloud-automation' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white">CI/CD Production Deployment Pipeline</h4>
                        <p className="text-xs text-slate-400">GitHub Actions &rarr; Docker multi-stage &rarr; Flyway &rarr; Render deployment</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleTriggerDeploy}
                        disabled={isDeploying}
                        className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
                      >
                        {isDeploying ? 'Deploying...' : 'Trigger Pipeline Run'}
                      </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-semibold uppercase tracking-wider">
                      {['Lint', 'Test', 'Build', 'Migrate', 'Deploy'].map((label, idx) => {
                        const stepNum = idx + 1
                        const isDone = deployStep >= stepNum
                        const isCurrent = deployStep === stepNum && isDeploying
                        return (
                          <div
                            key={label}
                            className={`rounded-lg py-2 border transition ${
                              isDone
                                ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                                : isCurrent
                                ? 'border-amber-500/50 bg-amber-500/20 text-amber-300 animate-pulse'
                                : 'border-slate-800 bg-slate-950 text-slate-500'
                            }`}
                          >
                            {label}
                          </div>
                        )
                      })}
                    </div>

                    {/* Live console logs */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300">
                      <p className="mb-2 text-[10px] uppercase tracking-wider text-slate-500">Pipeline Execution Stream</p>
                      <div className="space-y-1">
                        {logs.map((log, index) => (
                          <p key={index} className="text-emerald-400/90 leading-relaxed">
                            {log}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Iframe Mode Content */}
            {viewMode === 'iframe' && (
              <div className="relative h-full">
                {isLoading && (
                  <div className="flex h-32 items-center justify-center text-sm text-slate-400">
                    Loading frame...
                  </div>
                )}
                <div className="p-4 text-center">
                  <p className="text-sm text-slate-300">External demo iframe preview:</p>
                  <p className="mt-1 text-xs text-cyan-400">{iframeSource}</p>
                  <div className="mt-4">
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                      Open Demo in New Tab &nearr;
                    </a>
                  </div>
                </div>
                <iframe
                  key={`${selectedProject.id}-${activeViewport}`}
                  src={iframeSource}
                  title={`${selectedProject.title} Demo`}
                  sandbox="allow-scripts allow-same-origin"
                  className={`${currentViewport.widthClass} mx-auto mt-2 h-72 border-0 bg-white transition-all duration-200`}
                  onLoad={() => setIsLoading(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
