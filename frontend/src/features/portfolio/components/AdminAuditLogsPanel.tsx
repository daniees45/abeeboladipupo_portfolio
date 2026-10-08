import { useState, useEffect } from 'react'
import { fetchAdminAuditLogs } from '../api/portfolioApi'
import type { AuditLogItem } from '../types'

export function AdminAuditLogsPanel() {
  const [logs, setLogs] = useState<AuditLogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadLogs = () => {
    setLoading(true)
    fetchAdminAuditLogs()
      .then((data) => {
        setLogs(data)
        setError(null)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to retrieve audit trail')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let ignore = false
    fetchAdminAuditLogs()
      .then((data) => {
        if (!ignore) {
          setLogs(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to retrieve audit trail')
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Security &amp; Compliance</p>
          <h2 className="mt-1 text-2xl font-bold text-white">System Audit Logs</h2>
          <p className="mt-1 text-xs text-slate-400">
            Immutable trace of administrative mutations, security authentications, and content publishing events.
          </p>
        </div>
        <button
          type="button"
          onClick={loadLogs}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
        >
          🔄 Refresh Logs
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-500">Retrieving audit events from database...</div>
      ) : logs.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">
          No audit logs recorded yet. Changes will be audited automatically upon execution.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-2">ID</th>
                <th className="py-3 px-2">Action</th>
                <th className="py-3 px-2">Entity Type</th>
                <th className="py-3 px-2">Entity ID</th>
                <th className="py-3 px-2">Request ID</th>
                <th className="py-3 px-2 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-2 text-slate-500">#{log.id}</td>
                  <td className="py-2.5 px-2 font-semibold text-emerald-400">{log.action}</td>
                  <td className="py-2.5 px-2 text-cyan-300">{log.entityType}</td>
                  <td className="py-2.5 px-2 text-slate-400 truncate max-w-[120px]">{log.entityId || '—'}</td>
                  <td className="py-2.5 px-2 text-slate-500 truncate max-w-[140px]">{log.requestId}</td>
                  <td className="py-2.5 px-2 text-right text-slate-400">
                    {new Date(log.occurredAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
