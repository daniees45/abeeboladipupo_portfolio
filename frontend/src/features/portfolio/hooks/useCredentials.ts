import { useEffect, useState } from 'react'
import { fetchCertifications, fetchEducation } from '../api/portfolioApi'
import type { Certification, Education } from '../types'

const DEFAULT_EDUCATION: Education[] = [
  {
    id: 'edu-vvu-1',
    institution: 'Valley View University',
    degree: 'Bachelor of Science in Computer Science',
    fieldOfStudy: 'Computer Science & Software Engineering',
    startedOn: '2020-09-01',
    endedOn: '2024-07-31',
    currentEducation: false,
    description:
      'Comprehensive 4-year curriculum spanning software engineering, database management systems, data structures & algorithms, operating systems, and computer networks. Evaluated by World Education Services (WES).',
    credentialUrl: 'https://www.wes.org',
    displayOrder: 1,
  },
]

const DEFAULT_CERTIFICATIONS: Certification[] = [
  {
    id: 'cert-cisco-1',
    name: 'Introduction to Cybersecurity',
    issuingOrganization: 'Cisco Networking Academy',
    issueDate: '2024-05-15',
    credentialId: 'CISCO-CYBER-2024',
    credentialUrl: 'https://www.credly.com',
    displayOrder: 1,
  },
  {
    id: 'cert-wes-1',
    name: "Academic Credential Evaluation (Bachelor's Equivalence)",
    issuingOrganization: 'World Education Services (WES)',
    issueDate: '2024-08-10',
    credentialId: 'WES-REF-VERIFIED',
    credentialUrl: 'https://www.wes.org',
    displayOrder: 2,
  },
]

export function useCredentials() {
  const [education, setEducation] = useState<Education[]>(DEFAULT_EDUCATION)
  const [certifications, setCertifications] = useState<Certification[]>(DEFAULT_CERTIFICATIONS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reloadCredentials = () => {
    setLoading(true)
    Promise.allSettled([fetchEducation(), fetchCertifications()])
      .then(([eduRes, certRes]) => {
        if (eduRes.status === 'fulfilled' && eduRes.value.length > 0) {
          setEducation(eduRes.value)
        }
        if (certRes.status === 'fulfilled' && certRes.value.length > 0) {
          setCertifications(certRes.value)
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
    Promise.allSettled([fetchEducation(), fetchCertifications()])
      .then(([eduRes, certRes]) => {
        if (!ignore) {
          if (eduRes.status === 'fulfilled' && eduRes.value.length > 0) {
            setEducation(eduRes.value)
          }
          if (certRes.status === 'fulfilled' && certRes.value.length > 0) {
            setCertifications(certRes.value)
          }
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

  return { education, certifications, loading, error, reloadCredentials }
}
