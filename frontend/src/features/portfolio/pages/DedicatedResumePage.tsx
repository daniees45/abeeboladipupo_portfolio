/**
 * Dedicated Resume Page view (/resume).
 * Provides a focused, full-screen interactive resume experience with template controls and downloads.
 */

import { ResumeModule } from '../components/ResumeModule'
import { useRouter } from '../../../lib/router'
import { useSiteSettings } from '../hooks/useSiteSettings'

export function DedicatedResumePage() {
  const { navigate } = useRouter()
  const { settings } = useSiteSettings()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* Header Bar */}
      <header className="border-b border-slate-200 bg-white/80 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 no-print">
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
              onClick={() => navigate('/projects')}
              className="rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Projects &rarr;
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <ResumeModule />
      </main>
    </div>
  )
}
