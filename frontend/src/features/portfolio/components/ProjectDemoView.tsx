import { useState } from 'react'
import { portfolioProjects } from '../data/projects'
import type { DemoViewport } from '../types'

export function ProjectDemoView() {
  const [selectedId, setSelectedId] = useState<string>('fyp-supervision-system')
  const [activeViewport, setActiveViewport] = useState<DemoViewport>('desktop')

  const currentProject =
    portfolioProjects.find((p) => p.id === selectedId) ?? portfolioProjects[0]

  // FYP Interactive State
  const [fypRole, setFypRole] = useState<'student' | 'supervisor' | 'hod'>('student')
  const [fypMilestoneSubmitted, setFypMilestoneSubmitted] = useState(false)
  const [fypFeedbackGiven, setFypFeedbackGiven] = useState(false)
  const [fypSimilarityChecked, setFypSimilarityChecked] = useState(false)

  // AI Timetabling State
  const [isSolving, setIsSolving] = useState(false)
  const [solverResult, setSolverResult] = useState<{
    solved: boolean
    timeMs: number
    conflicts: number
    satisfactionRate: number
  } | null>({
    solved: true,
    timeMs: 76,
    conflicts: 0,
    satisfactionRate: 100,
  })

  // Portfolio Platform & Security Audit State
  const [securityLogs, setSecurityLogs] = useState([
    {
      id: '1',
      time: '10/08/2026 08:31:04',
      level: 'INFO',
      event: 'LOGIN_SUCCESS',
      detail: 'Admin Session 9F83... authenticated via Auth0 OIDC (Role: ADMIN)',
    },
    {
      id: '2',
      time: '10/08/2026 08:28:12',
      level: 'WARN',
      event: 'LOGIN_FAILED',
      detail: 'Invalid credentials from 198.51.100.44 (Attempt 3 of 5 - Bucket4j throttling)',
    },
    {
      id: '3',
      time: '10/07/2026 22:14:50',
      level: 'INFO',
      event: 'PROJECT_UPDATED',
      detail: 'Entity: AI-Powered Timetabling System (v2) - Redis cache evicted',
    },
    {
      id: '4',
      time: '10/07/2026 21:05:19',
      level: 'INFO',
      event: 'CACHE_INVALIDATION',
      detail: 'Evicted projects:list:* namespace after transaction commit',
    },
  ])
  const [cacheHit, setCacheHit] = useState(true)

  const handleSimulateLoginAttempt = () => {
    const newLog = {
      id: String(Date.now()),
      time: new Date().toLocaleTimeString(),
      level: 'WARN',
      event: 'LOGIN_ATTEMPT_RATE_LIMITED',
      detail: 'Bucket4j consumed 1 token on /api/v1/contact-messages from client IP',
    }
    setSecurityLogs((prev) => [newLog, ...prev.slice(0, 5)])
  }

  const handleRunCspSolver = () => {
    setIsSolving(true)
    setTimeout(() => {
      setIsSolving(false)
      setSolverResult({
        solved: true,
        timeMs: Math.floor(Math.random() * 40 + 65),
        conflicts: 0,
        satisfactionRate: 100,
      })
    }, 600)
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-950/40">
      {/* Sandbox Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-400">
              Interactive Engineering Sandbox
            </p>
          </div>
          <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            Hands-On System Demonstrations
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Select an engineering system below to interact directly with its logic, role gates, and algorithms.
          </p>
        </div>

        {/* Project Selector Pills & Viewport Toggle */}
        <div className="flex flex-col gap-2.5 sm:items-end">
          <div className="flex flex-wrap items-center gap-2">
            {portfolioProjects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => setSelectedId(project.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  selectedId === project.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {project.id === 'fyp-supervision-system' && '🎓 FYP Supervision System'}
                {project.id === 'ai-timetabling-system' && '⚡ AI Timetabling CSP'}
                {project.id === 'portfolio-platform' && '🛡️ Security & Telemetry Platform'}
              </button>
            ))}
          </div>

          {/* Viewport Frame Switcher */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <span>Frame:</span>
            {(['desktop', 'tablet', 'mobile'] as const).map((vp) => (
              <button
                key={vp}
                type="button"
                onClick={() => setActiveViewport(vp)}
                className={`rounded-md px-2 py-0.5 capitalize transition ${
                  activeViewport === vp
                    ? 'bg-slate-200 font-semibold text-slate-900 dark:bg-slate-800 dark:text-white'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {vp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Case Study Meta Strip */}
      <div className="my-4 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-950 sm:grid-cols-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Architecture Flow</p>
          <p className="mt-1 font-mono text-xs text-slate-700 dark:text-slate-300">
            {currentProject.architectureFlow}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Core Problem Solved</p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            {currentProject.problem}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Source Repository</p>
          <a
            href={currentProject.githubUrl || 'https://github.com/daniees45'}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 hover:underline dark:text-cyan-400"
          >
            <span>View GitHub Codebase &rarr;</span>
          </a>
        </div>
      </div>

      {/* Dynamic Interactive Simulator Viewports */}
      <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-slate-100/70 p-4 transition-all duration-300 dark:border-slate-800 dark:bg-slate-950/80 ${
        activeViewport === 'mobile' ? 'max-w-md mx-auto' : activeViewport === 'tablet' ? 'max-w-2xl mx-auto' : 'w-full'
      }`}>

        {/* 1. FYP Supervision System Simulator */}
        {selectedId === 'fyp-supervision-system' && (
          <div className="space-y-4">
            {/* Role Switcher Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500">Switch Active Role:</span>
                {(['student', 'supervisor', 'hod'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFypRole(role)}
                    className={`rounded-lg px-3 py-1 font-medium transition ${
                      fypRole === role
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                    }`}
                  >
                    {role === 'student' && '👨‍🎓 Student View'}
                    {role === 'supervisor' && '👨‍🏫 Supervisor View'}
                    {role === 'hod' && '🏛️ Department Head (HOD) View'}
                  </button>
                ))}
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                RBAC Session Gate: ACTIVE
              </span>
            </div>

            {/* Student Role Screen */}
            {fypRole === 'student' && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Student Dashboard: Abeeb Oladipupo (ID: VVU/CS/2024)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Assigned Supervisor: Dr. K. Mensah • Research Topic: Automated AI Scheduling
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    fypMilestoneSubmitted ? 'bg-amber-500/15 text-amber-600' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                  }`}>
                    {fypMilestoneSubmitted ? 'Milestone: Under Review' : 'Milestone 2 Pending'}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Milestone Progress</p>
                    <ul className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <li className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        ✓ Chapter 1: Problem Statement &amp; Objectives (Approved)
                      </li>
                      <li className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                        {fypMilestoneSubmitted ? '✓ Chapter 2: Literature Review (Submitted)' : '○ Chapter 2: Literature Review (Drafting)'}
                      </li>
                      <li className="flex items-center gap-1.5 text-slate-400">
                        ○ Chapter 3: System Architecture &amp; Methodology
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Simulate Student Actions</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Upload revisions or test proposal novelty detection.
                      </p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFypMilestoneSubmitted(true)}
                        className="rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400"
                      >
                        {fypMilestoneSubmitted ? '✓ Revision Uploaded' : '📤 Submit Milestone Draft'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFypSimilarityChecked(true)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900"
                      >
                        {fypSimilarityChecked ? '✓ 96% Novelty Score' : '🔍 Run Topic Analysis'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Supervisor Role Screen */}
            {fypRole === 'supervisor' && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Supervisor Portal: Dr. K. Mensah (Faculty of Computing)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Supervised Students: 3 Assigned • 1 Milestone Awaiting Review
                </p>
                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Candidate: Abeeb Oladipupo</p>
                      <p className="text-[11px] text-slate-500">Document: Chapter_2_LiteratureReview_v2.pdf (1.4 MB)</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFypFeedbackGiven(true)}
                        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                      >
                        {fypFeedbackGiven ? '✓ Approved for Defense' : '✓ Approve Draft'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HOD Role Screen */}
            {fypRole === 'hod' && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Head of Department (HOD) Oversight Dashboard
                </h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-3 text-xs">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-slate-400">Total Enrolled</p>
                    <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">48 Students</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-slate-400">Defense Ready</p>
                    <p className="mt-1 text-xl font-bold text-emerald-500">41 Cleared</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-slate-400">Scheduled Panels</p>
                    <p className="mt-1 text-xl font-bold text-cyan-500">6 Panels</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. AI Timetabling System Simulator */}
        {selectedId === 'ai-timetabling-system' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Constraint Satisfaction Problem (CSP) Engine
                </h4>
                <p className="text-xs text-slate-500">
                  Simulating 12 Courses, 6 Faculty Lecturers, and 4 Amphitheatres
                </p>
              </div>
              <button
                type="button"
                onClick={handleRunCspSolver}
                disabled={isSolving}
                className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
              >
                {isSolving ? 'Solving CSP Constraints...' : '⚡ Run CSP Optimization Engine'}
              </button>
            </div>

            {solverResult && (
              <div className="grid gap-3 sm:grid-cols-4 text-xs">
                <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-slate-400">Execution Time</p>
                  <p className="mt-1 text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400">{solverResult.timeMs} ms</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-slate-400">Schedule Conflicts</p>
                  <p className="mt-1 text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{solverResult.conflicts} Clashes</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-slate-400">Room Capacity Fit</p>
                  <p className="mt-1 text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">100% Validated</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-slate-400">Lecturer Availability</p>
                  <p className="mt-1 text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">0 Overlaps</p>
                </div>
              </div>
            )}

            {/* Generated Timetable Preview Matrix */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                    <th className="py-2 pr-3">Slot / Time</th>
                    <th className="py-2 pr-3">Monday</th>
                    <th className="py-2 pr-3">Tuesday</th>
                    <th className="py-2 pr-3">Wednesday</th>
                    <th className="py-2">Thursday</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
                  <tr>
                    <td className="py-2 pr-3 text-slate-400">08:00 - 10:00</td>
                    <td className="py-2 pr-3 text-cyan-600 dark:text-cyan-400">CS301 (Hall A - Dr. K)</td>
                    <td className="py-2 pr-3 text-slate-400">Free Period</td>
                    <td className="py-2 pr-3 text-cyan-600 dark:text-cyan-400">CS305 (Lab 2 - Prof. B)</td>
                    <td className="py-2 text-slate-400">Free Period</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 text-slate-400">10:15 - 12:15</td>
                    <td className="py-2 pr-3 text-slate-400">Free Period</td>
                    <td className="py-2 pr-3 text-emerald-600 dark:text-emerald-400">CS402 (Hall B - Dr. T)</td>
                    <td className="py-2 pr-3 text-slate-400">Free Period</td>
                    <td className="py-2 text-emerald-600 dark:text-emerald-400">CS408 (Hall A - Dr. K)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Portfolio Platform & Security Audit Simulator */}
        {selectedId === 'portfolio-platform' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Spring Boot &amp; Redis Security Telemetry
                </h4>
                <p className="text-xs text-slate-500">
                  Tamper-resistant audit logs, session state, and rate-limiting inspection
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSimulateLoginAttempt}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900"
                >
                  ⚡ Simulate Failed Login Probe
                </button>
                <button
                  type="button"
                  onClick={() => setCacheHit((prev) => !prev)}
                  className="rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400"
                >
                  Redis Cache: {cacheHit ? 'FORCE MISS' : 'FORCE HIT'}
                </button>
              </div>
            </div>

            {/* Live Security Log Stream */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-400">
                <span>SECURITY AUDIT STREAM (PostgreSQL audit_log table)</span>
                <span className="text-emerald-400">● LIVE</span>
              </div>
              <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto">
                {securityLogs.map((log) => (
                  <div key={log.id} className="flex flex-wrap items-start gap-2">
                    <span className="text-slate-500">[{log.time}]</span>
                    <span
                      className={
                        log.level === 'WARN'
                          ? 'text-amber-400 font-bold'
                          : 'text-emerald-400 font-bold'
                      }
                    >
                      {log.event}
                    </span>
                    <span className="text-slate-300">{log.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
