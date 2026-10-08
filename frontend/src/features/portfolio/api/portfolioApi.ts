import { fetchJson, uploadFile, setAuthToken } from '../../../lib/api'
import type {
  ActiveResume,
  AuditLogItem,
  Certification,
  ContactMessage,
  Education,
  ExperienceItem,
  PortfolioMetricsApiResponse,
  PortfolioProjectApiResponse,
  ResumeDocument,
  SiteSettings,
  SkillItem,
} from '../types'

// --- Public Endpoints ---

export async function fetchPortfolioProjects(): Promise<PortfolioProjectApiResponse[]> {
  const data = await fetchJson<PortfolioProjectApiResponse[] | { content: PortfolioProjectApiResponse[] }>('/api/v1/projects')
  return Array.isArray(data) ? data : data.content
}

export async function fetchProjectBySlug(slug: string): Promise<PortfolioProjectApiResponse> {
  return fetchJson<PortfolioProjectApiResponse>(`/api/v1/projects/${slug}`)
}

export async function fetchPortfolioMetrics(): Promise<PortfolioMetricsApiResponse> {
  return fetchJson<PortfolioMetricsApiResponse>('/api/v1/metrics')
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  return fetchJson<SiteSettings>('/api/v1/settings')
}

export async function fetchEducation(): Promise<Education[]> {
  return fetchJson<Education[]>('/api/v1/education')
}

export async function fetchCertifications(): Promise<Certification[]> {
  return fetchJson<Certification[]>('/api/v1/certifications')
}

export async function fetchSkills(): Promise<SkillItem[]> {
  return fetchJson<SkillItem[]>('/api/v1/skills')
}

export async function fetchExperience(): Promise<ExperienceItem[]> {
  return fetchJson<ExperienceItem[]>('/api/v1/experience')
}

export async function fetchActiveResume(): Promise<ActiveResume> {
  return fetchJson<ActiveResume>('/api/v1/resume/active')
}

export async function submitContactMessage(message: {
  senderName: string
  senderEmail: string
  subject: string
  body: string
}): Promise<void> {
  await fetchJson('/api/v1/contact-messages', {
    method: 'POST',
    body: JSON.stringify(message),
  })
}

// --- Admin Authentication ---

export async function adminLogin(usernameOrKey: string, password?: string): Promise<{ token: string; role: string }> {
  const res = await fetchJson<{ token: string; role: string }>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ usernameOrKey, password }),
  })
  if (res.token) {
    setAuthToken(res.token)
  }
  return res
}

// --- Admin Endpoints ---

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  return fetchJson<SiteSettings>('/api/v1/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  })
}

export async function fetchAdminProjects(): Promise<PortfolioProjectApiResponse[]> {
  return fetchJson<PortfolioProjectApiResponse[]>('/api/v1/admin/projects')
}

export async function createAdminProject(payload: Record<string, unknown>): Promise<PortfolioProjectApiResponse> {
  return fetchJson<PortfolioProjectApiResponse>('/api/v1/admin/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateAdminProject(id: string, payload: Record<string, unknown>): Promise<PortfolioProjectApiResponse> {
  return fetchJson<PortfolioProjectApiResponse>(`/api/v1/admin/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteAdminProject(id: string): Promise<void> {
  await fetchJson(`/api/v1/admin/projects/${id}`, {
    method: 'DELETE',
  })
}

export async function fetchAdminResumes(): Promise<ResumeDocument[]> {
  return fetchJson<ResumeDocument[]>('/api/v1/admin/resumes')
}

export async function uploadResumeDocument(formData: FormData): Promise<ResumeDocument> {
  return uploadFile<ResumeDocument>('/api/v1/admin/resumes/upload', formData)
}

export async function publishResumeDocument(id: string): Promise<ResumeDocument> {
  return fetchJson<ResumeDocument>(`/api/v1/admin/resumes/${id}/publish`, {
    method: 'PUT',
  })
}

export async function deleteResumeDocument(id: string): Promise<void> {
  await fetchJson(`/api/v1/admin/resumes/${id}`, {
    method: 'DELETE',
  })
}

export async function fetchAdminContactMessages(): Promise<ContactMessage[]> {
  return fetchJson<ContactMessage[]>('/api/v1/admin/contact-messages')
}

export async function updateContactMessageStatus(id: string, status: string): Promise<ContactMessage> {
  return fetchJson<ContactMessage>(`/api/v1/admin/contact-messages/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })
}

export async function fetchAdminAuditLogs(): Promise<AuditLogItem[]> {
  return fetchJson<AuditLogItem[]>('/api/v1/admin/audit-logs')
}

// Credentials Admin CRUD
export async function createEducationEntry(payload: Partial<Education>): Promise<Education> {
  return fetchJson<Education>('/api/v1/admin/education', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function deleteEducationEntry(id: string): Promise<void> {
  await fetchJson(`/api/v1/admin/education/${id}`, { method: 'DELETE' })
}

export async function createCertificationEntry(payload: Partial<Certification>): Promise<Certification> {
  return fetchJson<Certification>('/api/v1/admin/certifications', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function deleteCertificationEntry(id: string): Promise<void> {
  await fetchJson(`/api/v1/admin/certifications/${id}`, { method: 'DELETE' })
}
