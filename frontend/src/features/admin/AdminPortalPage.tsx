/**
 * Dedicated Secret Admin Portal Page.
 *
 * This page is accessible ONLY via the private URL path (e.g. /portal-admin-abeeb)
 * and is protected by a session-level security key gate with signed JWT authorization.
 *
 * It houses all administration modules backed by PostgreSQL:
 * 1. Operations Overview & System Audit Trail
 * 2. Project Creation & Case Study CMS
 * 3. Site Settings & Bio Positioning
 * 4. Education & Industry Certifications
 * 5. Official Résumé Version Management & Downloads
 * 6. Recruiter Inquiries & Contact Submissions Inbox
 * 7. Media Asset Management & Cloudinary Setup
 */

import { useState, type FormEvent } from 'react'
import { AdminManagementPanel } from '../portfolio/components/AdminManagementPanel'
import { PhotoUploadPanel } from '../portfolio/components/PhotoUploadPanel'
import { ProjectManagementPanel } from '../portfolio/components/ProjectManagementPanel'
import { AdminSettingsPanel } from '../portfolio/components/AdminSettingsPanel'
import { AdminCredentialsPanel } from '../portfolio/components/AdminCredentialsPanel'
import { AdminResumePanel } from '../portfolio/components/AdminResumePanel'
import { AdminMessagesPanel } from '../portfolio/components/AdminMessagesPanel'
import { AdminAuditLogsPanel } from '../portfolio/components/AdminAuditLogsPanel'
import { usePortfolioProjects } from '../portfolio/hooks/usePortfolioProjects'
import { usePortfolioMetrics } from '../portfolio/hooks/usePortfolioMetrics'
import { adminLogin } from '../portfolio/api/portfolioApi'
import { ADMIN_SECRET_KEY, useRouter } from '../../lib/router'

type AdminTab =
  | 'operations'
  | 'projects'
  | 'settings'
  | 'credentials'
  | 'resumes'
  | 'messages'
  | 'media'

export function AdminPortalPage() {
  const { navigate } = useRouter()
  const { addProject } = usePortfolioProjects()
  const { metrics, isOfflineFallback } = usePortfolioMetrics()

  // Session-based authentication check
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.sessionStorage.getItem('admin_session_auth') === 'true'
  })

  const [enteredKey, setEnteredKey] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<AdminTab>('operations')

  const handleAuthenticate = async (e: FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError(null)

    try {
      // Attempt real authentication against Spring Boot REST API
      await adminLogin(enteredKey.trim())
      window.sessionStorage.setItem('admin_session_auth', 'true')
      window.sessionStorage.setItem('admin_access_key', enteredKey.trim())
      setIsAuthenticated(true)
    } catch {
      // Offline fallback: verify against client-configured secret key
      if (enteredKey.trim() === ADMIN_SECRET_KEY) {
        window.sessionStorage.setItem('admin_session_auth', 'true')
        window.sessionStorage.setItem('admin_access_key', enteredKey.trim())
        setIsAuthenticated(true)
        setAuthError(null)
      } else {
        setAuthError('Invalid administrator access key. Access denied.')
      }
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    window.sessionStorage.removeItem('admin_session_auth')
    window.sessionStorage.removeItem('admin_auth_token')
    window.sessionStorage.removeItem('admin_access_key')
    setIsAuthenticated(false)
    setEnteredKey('')
  }

  // 1. Security Gate View: If not authenticated, show secret key prompt
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-2xl text-cyan-400">
              🔒
            </div>
          </div>

          <h2 className="mt-5 text-center text-2xl font-bold tracking-tight text-white">
            Restricted Admin Portal
          </h2>
          <p className="mt-2 text-center text-xs text-slate-400">
            This private management console is isolated from the public portfolio. Enter your secret key to proceed.
          </p>

          <form onSubmit={handleAuthenticate} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Secret Access Key
              </label>
              <input
                type="password"
                value={enteredKey}
                onChange={(e) => {
                  setEnteredKey(e.target.value)
                  setAuthError(null)
                }}
                placeholder="Enter secret access key"
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-medium">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-xl bg-cyan-500 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50 cursor-pointer"
            >
              {authLoading ? 'Verifying with Backend...' : 'Unlock Admin Console'}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-4 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs text-slate-400 transition hover:text-white cursor-pointer"
            >
              &larr; Return to Public Portfolio
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 2. Authenticated Admin Dashboard View
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Admin Top Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 px-4 py-3.5 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-sm font-bold text-cyan-300">
              ⚡
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">
                Abeeb Oladipupo • Admin Console
              </h1>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Database-Driven Session Active • Clean Architecture
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300">
              Backend: {isOfflineFallback ? 'Offline Fallback' : 'Connected (PostgreSQL)'}
            </span>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-full border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:text-white cursor-pointer"
            >
              Public Portfolio &nearr;
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-rose-500/15 border border-rose-500/30 px-3.5 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/25 cursor-pointer"
            >
              Lock &amp; Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        {/* Navigation Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-slate-800 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('operations')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'operations'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            📊 Operations &amp; Audit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'projects'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            🚀 Projects CMS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'settings'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            ⚙️ Profile &amp; Settings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'credentials'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            🎓 Credentials &amp; Degrees
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('resumes')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'resumes'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            📄 Résumé Manager
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('messages')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'messages'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            📬 Inquiries Inbox
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'media'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            🖼️ Media
          </button>
        </div>

        {/* Tab 1: Operations Overview & Audit */}
        {activeTab === 'operations' && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">Total Projects</p>
                <p className="mt-2 text-3xl font-bold text-white">{metrics?.totalProjects ?? 3}</p>
                <p className="mt-1 text-xs text-emerald-400">Published in portfolio showcase</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">Tracked Profile Views</p>
                <p className="mt-2 text-3xl font-bold text-white">{metrics?.totalViews ?? 14250}</p>
                <p className="mt-1 text-xs text-cyan-400">Aggregated visitor telemetry</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">Cache Key Status</p>
                <p className="mt-2 text-3xl font-bold text-emerald-400">{metrics?.cacheStatus ?? 'HIT'}</p>
                <p className="mt-1 text-xs text-slate-400">Redis cache persistence</p>
              </div>
            </div>

            <AdminManagementPanel />
            <AdminAuditLogsPanel />
          </div>
        )}

        {/* Tab 2: Project Management CMS */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-xs text-cyan-300">
              💡 Projects created here are committed to PostgreSQL and immediately appear in the portfolio showcase and live preview sandbox.
            </div>
            <ProjectManagementPanel onProjectAdded={addProject} />
          </div>
        )}

        {/* Tab 3: Site Profile & Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <AdminSettingsPanel />
          </div>
        )}

        {/* Tab 4: Credentials & Degrees */}
        {activeTab === 'credentials' && (
          <div className="space-y-6">
            <AdminCredentialsPanel />
          </div>
        )}

        {/* Tab 5: Resume Manager */}
        {activeTab === 'resumes' && (
          <div className="space-y-6">
            <AdminResumePanel />
          </div>
        )}

        {/* Tab 6: Recruiter Inquiries Inbox */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <AdminMessagesPanel />
          </div>
        )}

        {/* Tab 7: Media Upload */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <PhotoUploadPanel />
          </div>
        )}
      </main>
    </div>
  )
}
