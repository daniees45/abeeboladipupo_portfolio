import { useState, useEffect } from 'react'
import { fetchAdminContactMessages, updateContactMessageStatus } from '../api/portfolioApi'
import type { ContactMessage } from '../types'

export function AdminMessagesPanel() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'NEW' | 'IN_PROGRESS' | 'RESOLVED'>('ALL')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const loadMessages = () => {
    setLoading(true)
    fetchAdminContactMessages()
      .then((data) => setMessages(data))
      .catch((err) => {
        setFeedback({
          type: 'error',
          message: `Failed to load messages: ${err instanceof Error ? err.message : 'Unknown error'}`,
        })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let ignore = false
    fetchAdminContactMessages()
      .then((data) => {
        if (!ignore) setMessages(data)
      })
      .catch((err) => {
        if (!ignore) {
          setFeedback({
            type: 'error',
            message: `Failed to load messages: ${err instanceof Error ? err.message : 'Unknown error'}`,
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

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateContactMessageStatus(id, newStatus)
      setFeedback({ type: 'success', message: `Message status updated to ${newStatus}` })
      loadMessages()
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Failed to update status: ${err instanceof Error ? err.message : 'Unknown error'}`,
      })
    }
  }

  const filtered = messages.filter((m) => {
    if (filter === 'ALL') return true
    return m.status === filter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">NEW</span>
      case 'IN_PROGRESS':
        return <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400">IN PROGRESS</span>
      case 'RESOLVED':
        return <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-400">RESOLVED</span>
      default:
        return <span className="rounded-full bg-rose-500/15 px-2.5 py-0.5 text-[10px] font-bold text-rose-400">{status}</span>
    }
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
      <div className="border-b border-slate-800 pb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Recruiter Inquiries</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Contact Submissions Inbox</h2>
          <p className="mt-1 text-xs text-slate-400">
            Messages transmitted directly from the public portfolio contact form into PostgreSQL.
          </p>
        </div>
        <button
          type="button"
          onClick={loadMessages}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 hover:text-white w-fit"
        >
          🔄 Refresh Inbox
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

      {/* Filter Tabs */}
      <div className="mt-4 flex gap-2 border-b border-slate-800 pb-3">
        {(['ALL', 'NEW', 'IN_PROGRESS', 'RESOLVED'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
              filter === tab
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'ALL' ? `All (${messages.length})` : tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-500">Loading messages from database...</div>
      ) : filtered.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">No inquiries found in this folder.</div>
      ) : (
        <div className="mt-4 space-y-3">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-4 transition hover:border-slate-700"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  {getStatusBadge(msg.status)}
                  <h4 className="text-sm font-bold text-white">{msg.senderName}</h4>
                  <a
                    href={`mailto:${msg.senderEmail}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    {msg.senderEmail}
                  </a>
                </div>
                <span className="text-[11px] text-slate-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="mt-2 text-xs font-semibold text-slate-300">
                Subject: <span className="text-white">{msg.subject}</span>
              </div>

              <p className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-900/60 p-3 text-xs leading-relaxed text-slate-300">
                {msg.body}
              </p>

              <div className="mt-3 flex items-center justify-between border-t border-slate-850 pt-3 text-xs">
                <a
                  href={`mailto:${msg.senderEmail}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-cyan-300 hover:bg-cyan-500/20"
                >
                  ✉️ Reply via Email
                </a>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px]">Set Status:</span>
                  {msg.status !== 'NEW' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(msg.id, 'NEW')}
                      className="rounded border border-slate-700 px-2 py-0.5 text-[11px] text-slate-300 hover:bg-slate-800"
                    >
                      New
                    </button>
                  )}
                  {msg.status !== 'IN_PROGRESS' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(msg.id, 'IN_PROGRESS')}
                      className="rounded border border-cyan-500/30 px-2 py-0.5 text-[11px] text-cyan-300 hover:bg-cyan-500/10"
                    >
                      In Progress
                    </button>
                  )}
                  {msg.status !== 'RESOLVED' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(msg.id, 'RESOLVED')}
                      className="rounded border border-emerald-500/30 px-2 py-0.5 text-[11px] text-emerald-300 hover:bg-emerald-500/10"
                    >
                      Resolved
                    </button>
                  )}
                  {msg.status !== 'SPAM' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(msg.id, 'SPAM')}
                      className="rounded border border-rose-500/30 px-2 py-0.5 text-[11px] text-rose-300 hover:bg-rose-500/10"
                    >
                      Spam
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
