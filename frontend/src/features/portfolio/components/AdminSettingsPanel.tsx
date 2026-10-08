import { useState, useEffect, type FormEvent } from 'react'
import { fetchSiteSettings, updateSiteSettings } from '../api/portfolioApi'
import type { SiteSettings } from '../types'

export function AdminSettingsPanel() {
  const [form, setForm] = useState<Partial<SiteSettings>>({
    fullName: '',
    professionalTitle: '',
    headline: '',
    bio: '',
    contactEmail: '',
    phone: '',
    location: '',
    githubUrl: '',
    linkedinUrl: '',
    websiteUrl: '',
    availabilityBadge: '',
    openToWork: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    let ignore = false
    fetchSiteSettings()
      .then((data) => {
        if (!ignore && data) {
          setForm(data)
        }
      })
      .catch((err) => {
        if (!ignore) {
          setFeedback({
            type: 'error',
            message: `Failed to load settings: ${err instanceof Error ? err.message : 'Unknown error'}`,
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

  const handleChange = (field: keyof SiteSettings, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)
    try {
      const updated = await updateSiteSettings(form)
      setForm(updated)
      setFeedback({ type: 'success', message: 'Site settings updated and saved to database successfully!' })
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`,
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
        Loading site profile configuration...
      </div>
    )
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
      <div className="border-b border-slate-800 pb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Content Management</p>
        <h2 className="mt-1 text-2xl font-bold text-white">Site Profile &amp; Positioning Settings</h2>
        <p className="mt-1 text-xs text-slate-400">
          Control the public persona, title, headline, contact email, social links, and open-to-work availability badge in PostgreSQL.
        </p>
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

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Full Legal / Brand Name
            </label>
            <input
              required
              value={form.fullName || ''}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Professional Positioning Title
            </label>
            <input
              required
              value={form.professionalTitle || ''}
              onChange={(e) => handleChange('professionalTitle', e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Hero Headline
          </label>
          <input
            required
            value={form.headline || ''}
            onChange={(e) => handleChange('headline', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Professional Biography &amp; Focus
          </label>
          <textarea
            required
            rows={3}
            value={form.bio || ''}
            onChange={(e) => handleChange('bio', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Public Contact Email
            </label>
            <input
              type="email"
              required
              value={form.contactEmail || ''}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Location / Relocation
            </label>
            <input
              value={form.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Phone / Mobile (Optional)
            </label>
            <input
              value={form.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              GitHub Profile URL
            </label>
            <input
              value={form.githubUrl || ''}
              onChange={(e) => handleChange('githubUrl', e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              LinkedIn Profile URL
            </label>
            <input
              value={form.linkedinUrl || ''}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Availability Badge Text
            </label>
            <input
              value={form.availabilityBadge || ''}
              onChange={(e) => handleChange('availabilityBadge', e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="openToWork"
              checked={form.openToWork ?? true}
              onChange={(e) => handleChange('openToWork', e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-400"
            />
            <label htmlFor="openToWork" className="text-xs font-medium text-slate-300 cursor-pointer">
              Open to Work (display active hiring pill on public site)
            </label>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-cyan-500 px-6 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Saving to Database...' : 'Save Site Settings'}
          </button>
        </div>
      </form>
    </section>
  )
}
