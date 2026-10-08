/**
 * Admin management panel for portfolio operations.
 *
 * This module is intentionally framework-light and does not depend on a paid service.
 * It demonstrates how a portfolio owner can manage approvals, content updates, and
 * operational status while keeping the UI easy to extend with a real backend later.
 */
export function AdminManagementPanel() {
  const actions = [
    {
      id: 'content',
      label: 'Content approvals',
      description: 'Review and approve case-study updates before publishing them publicly.',
      status: 'Ready',
    },
    {
      id: 'systems',
      label: 'System health',
      description: 'Monitor uptime, build pipelines, and performance thresholds for the portfolio stack.',
      status: 'Live',
    },
    {
      id: 'security',
      label: 'Access control',
      description: 'Verify that admin credentials and release permissions remain restricted and auditable.',
      status: 'Protected',
    },
  ]

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">Admin management</p>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Operations overview</h2>
          <span className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300">
            Authorized • no sponsorship required
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <div key={action.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/70">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{action.label}</h3>
              <span className="rounded-full bg-cyan-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                {action.status}
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{action.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
