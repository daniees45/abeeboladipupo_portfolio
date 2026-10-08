import { useEffect, useState } from 'react'
import { fetchSiteSettings } from '../api/portfolioApi'
import type { SiteSettings } from '../types'

const DEFAULT_SETTINGS: SiteSettings = {
  id: 'a0000000-0000-0000-0000-000000000001',
  fullName: 'Abeeb Oladipupo',
  professionalTitle: 'Software Developer | Systems & Cybersecurity',
  headline: 'I build secure, scalable software and practical technology solutions.',
  bio: 'Computer Science graduate focused on software development, backend systems, databases, Linux, cloud infrastructure, and cybersecurity. Passionate about engineering systems that solve real organizational problems.',
  contactEmail: 'abeeboladipupo@example.com',
  location: 'Accra / Open to Relocation & Remote',
  githubUrl: 'https://github.com/abeeboladipupo',
  linkedinUrl: 'https://linkedin.com/in/abeeboladipupo',
  websiteUrl: 'https://www.abeeboladipupo.com',
  seoTitle: 'Abeeb Oladipupo | Software Developer & Cybersecurity',
  seoDescription: 'Computer Science graduate focused on software development, backend systems, databases, Linux, cloud infrastructure, and cybersecurity.',
  availabilityBadge: '🎓 Computer Science Graduate • Available for Full-Time Roles',
  openToWork: true,
  updatedAt: new Date().toISOString(),
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reloadSettings = () => {
    setLoading(true)
    fetchSiteSettings()
      .then((data) => {
        setSettings(data)
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
    fetchSiteSettings()
      .then((data) => {
        if (!ignore) {
          setSettings(data)
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

  return { settings, loading, error, reloadSettings }
}
