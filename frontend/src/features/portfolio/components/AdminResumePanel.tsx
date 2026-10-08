import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import {
  fetchAdminResumes,
  uploadResumeDocument,
  publishResumeDocument,
  deleteResumeDocument,
} from '../api/portfolioApi'
import type { ResumeDocument } from '../types'

export function AdminResumePanel() {
  const [resumes, setResumes] = useState<ResumeDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [versionTag, setVersionTag] = useState('')
  const [targetTrack, setTargetTrack] = useState('GENERAL')
  const [makePublished, setMakePublished] = useState(true)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const loadResumes = () => {
    setLoading(true)
    fetchAdminResumes()
      .then((data) => {
        setResumes(data)
      })
      .catch((err) => {
        setFeedback({
          type: 'error',
          message: `Failed to load resume documents: ${err instanceof Error ? err.message : 'Unknown error'}`,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    let ignore = false
    fetchAdminResumes()
      .then((data) => {
        if (!ignore) setResumes(data)
      })
      .catch((err) => {
        if (!ignore) {
          setFeedback({
            type: 'error',
            message: `Failed to load resume documents: ${err instanceof Error ? err.message : 'Unknown error'}`,
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      setFile(selected)
      if (!versionTag) {
        setVersionTag(`v${new Date().getFullYear()}.${new Date().getMonth() + 1}`)
      }
    }
  }

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault()
    if (!file) {
      setFeedback({ type: 'error', message: 'Please select a PDF or DOCX file to upload.' })
      return
    }

    setUploading(true)
    setFeedback(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('versionTag', versionTag.trim() || 'v1.0')
    formData.append('targetTrack', targetTrack)
    formData.append('isPublished', String(makePublished))

    try {
      await uploadResumeDocument(formData)
      setFeedback({ type: 'success', message: 'Resume document uploaded and stored in database successfully!' })
      setFile(null)
      setVersionTag('')
      loadResumes()
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      })
    } finally {
      setUploading(false)
    }
  }

  const handlePublish = async (id: string) => {
    try {
      await publishResumeDocument(id)
      setFeedback({ type: 'success', message: 'Published resume updated. Visitors will now download this version.' })
      loadResumes()
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Failed to set active version: ${err instanceof Error ? err.message : 'Unknown error'}`,
      })
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return
    try {
      await deleteResumeDocument(id)
      setFeedback({ type: 'success', message: `Deleted ${name} from database.` })
      loadResumes()
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Failed to delete document: ${err instanceof Error ? err.message : 'Unknown error'}`,
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <section className="space-y-6">
      {/* Upload Box */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
        <div className="border-b border-slate-800 pb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Database Storage</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Upload New Official Résumé</h2>
          <p className="mt-1 text-xs text-slate-400">
            Upload PDF or DOCX files stored directly in PostgreSQL with binary byte verification.
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

        <form onSubmit={handleUpload} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Select Resume File (.pdf, .docx)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white file:mr-2 file:rounded-lg file:border-0 file:bg-cyan-500 file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-slate-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Version Tag
              </label>
              <input
                value={versionTag}
                onChange={(e) => setVersionTag(e.target.value)}
                placeholder="e.g. v2026.1-swe"
                required
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Target Specialization Track
              </label>
              <select
                value={targetTrack}
                onChange={(e) => setTargetTrack(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
              >
                <option value="GENERAL">General / Comprehensive</option>
                <option value="SOFTWARE_ENGINEERING">Software Developer / Backend</option>
                <option value="SYSTEMS_CYBERSECURITY">Systems &amp; Cybersecurity</option>
                <option value="CLOUD_INFRASTRUCTURE">Cloud &amp; DevOps</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="makePublished"
                checked={makePublished}
                onChange={(e) => setMakePublished(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-400"
              />
              <label htmlFor="makePublished" className="text-xs font-medium text-slate-300 cursor-pointer">
                Publish immediately as the active download for recruiters
              </label>
            </div>

            <button
              type="submit"
              disabled={uploading || !file}
              className="rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50 cursor-pointer"
            >
              {uploading ? 'Uploading to PostgreSQL...' : 'Upload & Save Document'}
            </button>
          </div>
        </form>
      </div>

      {/* Resumes List Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Database Version Archive</h3>
            <p className="mt-1 text-xs text-slate-400">
              Manage uploaded revisions, set active version, or download binaries.
            </p>
          </div>
          <button
            type="button"
            onClick={loadResumes}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
          >
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading document catalog...</div>
        ) : resumes.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No resume documents found in PostgreSQL yet.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-2">Document Name</th>
                  <th className="py-3 px-2">Version</th>
                  <th className="py-3 px-2">Track</th>
                  <th className="py-3 px-2">File Size</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Uploaded</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {resumes.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-2 font-medium text-white flex items-center gap-2">
                      <span>📄</span>
                      <span className="truncate max-w-[180px]">{doc.fileName}</span>
                    </td>
                    <td className="py-3 px-2 font-mono text-cyan-300">{doc.versionTag}</td>
                    <td className="py-3 px-2 text-slate-300">{doc.targetTrack}</td>
                    <td className="py-3 px-2 text-slate-400">{formatFileSize(doc.fileSizeBytes)}</td>
                    <td className="py-3 px-2">
                      {doc.isPublished ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-bold text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-slate-400">
                          Archived
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-slate-400">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 text-right space-x-2">
                      <a
                        href={`/api/v1/resume/download/${doc.id}`}
                        download={doc.fileName}
                        className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-cyan-300 hover:bg-cyan-500/20"
                      >
                        Download
                      </a>
                      {!doc.isPublished && (
                        <button
                          type="button"
                          onClick={() => handlePublish(doc.id)}
                          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-300 hover:bg-emerald-500/20"
                        >
                          Make Active
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(doc.id, doc.fileName)}
                        className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-rose-300 hover:bg-rose-500/20"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
