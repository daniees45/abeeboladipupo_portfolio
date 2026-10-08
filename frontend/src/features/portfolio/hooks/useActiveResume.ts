import { useEffect, useState } from 'react'
import { fetchActiveResume } from '../api/portfolioApi'
import type { ActiveResume } from '../types'

const DEFAULT_ACTIVE_RESUME: ActiveResume = {
  id: 'b0000000-0000-0000-0000-000000000001',
  fileName: 'Abeeb_Oladipupo_Resume.pdf',
  contentType: 'application/pdf',
  fileSizeBytes: 24576,
  versionTag: 'v1.0-official',
  downloadUrl: '/api/v1/resume/download/b0000000-0000-0000-0000-000000000001',
  uploadedAt: new Date().toISOString(),
}

export function useActiveResume() {
  const [activeResume, setActiveResume] = useState<ActiveResume>(DEFAULT_ACTIVE_RESUME)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reloadActiveResume = () => {
    setLoading(true)
    fetchActiveResume()
      .then((data) => {
        if (data && data.id) {
          setActiveResume(data)
        }
        setError(null)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Backend offline')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    let ignore = false
    fetchActiveResume()
      .then((data) => {
        if (!ignore && data && data.id) {
          setActiveResume(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Backend offline')
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false)
        }
      })
    return () => {
      ignore = true
    }
  }, [])

  return { activeResume, loading, error, reloadActiveResume }
}
