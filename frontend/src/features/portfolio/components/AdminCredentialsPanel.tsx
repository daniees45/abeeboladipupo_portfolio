import { useState, useEffect, type FormEvent } from 'react'
import {
  fetchEducation,
  fetchCertifications,
  createEducationEntry,
  deleteEducationEntry,
  createCertificationEntry,
  deleteCertificationEntry,
} from '../api/portfolioApi'
import type { Education, Certification } from '../types'

export function AdminCredentialsPanel() {
  const [educationList, setEducationList] = useState<Education[]>([])
  const [certificationsList, setCertificationsList] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Education form state
  const [eduInstitution, setEduInstitution] = useState('')
  const [eduDegree, setEduDegree] = useState('')
  const [eduField, setEduField] = useState('')
  const [eduStarted, setEduStarted] = useState('2020-09-01')
  const [eduEnded, setEduEnded] = useState('2024-07-31')
  const [eduDesc, setEduDesc] = useState('')
  const [eduUrl, setEduUrl] = useState('')

  // Certification form state
  const [certName, setCertName] = useState('')
  const [certOrg, setCertOrg] = useState('')
  const [certDate, setCertDate] = useState('2024-05-15')
  const [certId, setCertId] = useState('')
  const [certUrl, setCertUrl] = useState('')

  const loadData = () => {
    setLoading(true)
    Promise.allSettled([fetchEducation(), fetchCertifications()])
      .then(([eduRes, certRes]) => {
        if (eduRes.status === 'fulfilled') setEducationList(eduRes.value)
        if (certRes.status === 'fulfilled') setCertificationsList(certRes.value)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let ignore = false
    Promise.allSettled([fetchEducation(), fetchCertifications()])
      .then(([eduRes, certRes]) => {
        if (!ignore) {
          if (eduRes.status === 'fulfilled') setEducationList(eduRes.value)
          if (certRes.status === 'fulfilled') setCertificationsList(certRes.value)
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  const handleAddEducation = async (e: FormEvent) => {
    e.preventDefault()
    setFeedback(null)
    try {
      await createEducationEntry({
        institution: eduInstitution.trim(),
        degree: eduDegree.trim(),
        fieldOfStudy: eduField.trim() || undefined,
        startedOn: eduStarted,
        endedOn: eduEnded || undefined,
        currentEducation: !eduEnded,
        description: eduDesc.trim() || undefined,
        credentialUrl: eduUrl.trim() || undefined,
        displayOrder: educationList.length + 1,
      })
      setFeedback({ type: 'success', message: 'Education record added successfully!' })
      setEduInstitution('')
      setEduDegree('')
      setEduField('')
      setEduDesc('')
      setEduUrl('')
      loadData()
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Failed to add education: ${err instanceof Error ? err.message : 'Unknown error'}`,
      })
    }
  }

  const handleDeleteEducation = async (id: string, name: string) => {
    if (!confirm(`Delete education record for "${name}"?`)) return
    try {
      await deleteEducationEntry(id)
      setFeedback({ type: 'success', message: `Deleted ${name}` })
      loadData()
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`,
      })
    }
  }

  const handleAddCertification = async (e: FormEvent) => {
    e.preventDefault()
    setFeedback(null)
    try {
      await createCertificationEntry({
        name: certName.trim(),
        issuingOrganization: certOrg.trim(),
        issueDate: certDate,
        credentialId: certId.trim() || undefined,
        credentialUrl: certUrl.trim() || undefined,
        displayOrder: certificationsList.length + 1,
      })
      setFeedback({ type: 'success', message: 'Certification record added successfully!' })
      setCertName('')
      setCertOrg('')
      setCertId('')
      setCertUrl('')
      loadData()
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Failed to add certification: ${err instanceof Error ? err.message : 'Unknown error'}`,
      })
    }
  }

  const handleDeleteCertification = async (id: string, name: string) => {
    if (!confirm(`Delete certification "${name}"?`)) return
    try {
      await deleteCertificationEntry(id)
      setFeedback({ type: 'success', message: `Deleted ${name}` })
      loadData()
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`,
      })
    }
  }

  return (
    <div className="space-y-8">
      {feedback && (
        <div
          className={`rounded-xl p-3 text-xs font-medium border ${
            feedback.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Education Management Section */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
        <div className="border-b border-slate-800 pb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Academic History</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Degrees &amp; Academic Qualifications</h2>
          <p className="mt-1 text-xs text-slate-400">
            Add accredited university degrees and credential evaluations (e.g. WES, Valley View University).
          </p>
        </div>

        {/* Existing Education List */}
        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="py-4 text-xs text-slate-500">Loading academic records...</div>
          ) : educationList.length === 0 ? (
            <div className="py-4 text-xs text-slate-500">No education records found.</div>
          ) : (
            educationList.map((edu) => (
              <div
                key={edu.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{edu.degree}</h4>
                  <p className="text-xs text-cyan-400">{edu.institution} {edu.fieldOfStudy ? `• ${edu.fieldOfStudy}` : ''}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {edu.startedOn} &rarr; {edu.endedOn || 'Present'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteEducation(edu.id, edu.degree)}
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/20"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Education Form */}
        <form onSubmit={handleAddEducation} className="mt-6 border-t border-slate-800 pt-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">+ Add New Degree Record</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-slate-400">Institution Name</label>
              <input
                required
                value={eduInstitution}
                onChange={(e) => setEduInstitution(e.target.value)}
                placeholder="Valley View University"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400">Degree Title</label>
              <input
                required
                value={eduDegree}
                onChange={(e) => setEduDegree(e.target.value)}
                placeholder="Bachelor of Science in Computer Science"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs text-slate-400">Field of Study</label>
              <input
                value={eduField}
                onChange={(e) => setEduField(e.target.value)}
                placeholder="Computer Science & Software Engineering"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400">Start Date (YYYY-MM-DD)</label>
              <input
                required
                type="date"
                value={eduStarted}
                onChange={(e) => setEduStarted(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400">End Date (Leave blank if ongoing)</label>
              <input
                type="date"
                value={eduEnded}
                onChange={(e) => setEduEnded(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400">Description &amp; Key Highlights</label>
            <textarea
              rows={2}
              value={eduDesc}
              onChange={(e) => setEduDesc(e.target.value)}
              placeholder="Core coursework: Data structures, software engineering, databases, distributed systems..."
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400">Credential Verification URL (Optional)</label>
            <input
              value={eduUrl}
              onChange={(e) => setEduUrl(e.target.value)}
              placeholder="https://www.wes.org"
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
            >
              Save Education Entry
            </button>
          </div>
        </form>
      </section>

      {/* Certifications Management Section */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
        <div className="border-b border-slate-800 pb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Industry Credentials</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Professional Certifications</h2>
          <p className="mt-1 text-xs text-slate-400">
            Manage validated industry badges (e.g. Cisco Cybersecurity, WES Equivalence).
          </p>
        </div>

        {/* Existing Certifications List */}
        <div className="mt-6 space-y-3">
          {certificationsList.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4"
            >
              <div>
                <h4 className="text-sm font-bold text-white">{cert.name}</h4>
                <p className="text-xs text-emerald-400">{cert.issuingOrganization}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Issued: {cert.issueDate} {cert.credentialId ? `• ID: ${cert.credentialId}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteCertification(cert.id, cert.name)}
                className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/20"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Add Certification Form */}
        <form onSubmit={handleAddCertification} className="mt-6 border-t border-slate-800 pt-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">+ Add New Certification</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-slate-400">Certification Name</label>
              <input
                required
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                placeholder="Introduction to Cybersecurity"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400">Issuing Organization</label>
              <input
                required
                value={certOrg}
                onChange={(e) => setCertOrg(e.target.value)}
                placeholder="Cisco Networking Academy"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs text-slate-400">Issue Date</label>
              <input
                required
                type="date"
                value={certDate}
                onChange={(e) => setCertDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400">Credential ID / Reference</label>
              <input
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="CISCO-CYBER-2024"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400">Verification URL</label>
              <input
                value={certUrl}
                onChange={(e) => setCertUrl(e.target.value)}
                placeholder="https://www.credly.com"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
            >
              Save Certification
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
