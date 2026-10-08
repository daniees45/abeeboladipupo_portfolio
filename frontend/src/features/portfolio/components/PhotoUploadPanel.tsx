/**
 * Photo upload module for Cloudinary-ready media assets.
 *
 * The component supports two modes:
 * 1. a local preview flow for free local development, and
 * 2. a Cloudinary upload flow when the owner provides cloud name plus upload preset.
 *
 * This keeps the feature usable without sponsorship while still enabling a path to
 * a managed asset host in production.
 */
import { useState, type ChangeEvent } from 'react'

export function PhotoUploadPanel() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [cloudName, setCloudName] = useState(() => (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined) ?? '')
  const [uploadPreset, setUploadPreset] = useState(() => (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined) ?? '')
  const [status, setStatus] = useState('Ready to upload a profile image or project photo.')

  const handleLocalFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setStatus('Local preview created. Cloudinary upload will activate when credentials are supplied.')
  }

  const handleCloudinaryUpload = async () => {
    if (!selectedFile) {
      setStatus('Select a file before uploading to Cloudinary.')
      return
    }

    if (!cloudName || !uploadPreset) {
      setStatus('Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to enable Cloudinary upload.')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('upload_preset', uploadPreset)

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Cloudinary request failed')
      }

      const data = (await response.json()) as { secure_url?: string }
      setPreviewUrl(data.secure_url ?? previewUrl)
      setStatus('Cloudinary upload succeeded.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Cloudinary upload failed.')
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">Photo management</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Cloud-ready media upload</h2>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-200">
          Free-tier ready
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/70">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Cloudinary cloud name</label>
            <input
              value={cloudName}
              onChange={(event) => setCloudName(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              placeholder="my-portfolio-cloud"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Upload preset</label>
            <input
              value={uploadPreset}
              onChange={(event) => setUploadPreset(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              placeholder="portfolio_unsigned_upload"
            />
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Select file</span>
            <input type="file" accept="image/*" onChange={handleLocalFile} className="block w-full text-sm text-slate-600 dark:text-slate-300" />
          </label>

          <button
            type="button"
            onClick={handleCloudinaryUpload}
            className="w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Upload to Cloudinary
          </button>

          <p className="text-sm text-slate-600 dark:text-slate-300">{status}</p>
        </div>

        <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/70">
          {previewUrl ? (
            <img src={previewUrl} alt="Portfolio preview" className="max-h-[320px] w-full rounded-xl object-cover shadow-sm" />
          ) : (
            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
              No image selected yet. Add a profile or project photo to preview it here.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
