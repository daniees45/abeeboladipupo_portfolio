export type DemoViewport = 'desktop' | 'tablet' | 'mobile'
export type ProjectStatus = 'live' | 'prototype' | 'concept'

export interface PortfolioProject {
  id: string
  title: string
  slug: string
  summary: string
  problem: string
  solution: string
  architectureFlow: string
  keyFeatures: string[]
  stack: string[]
  demoUrl: string
  repoUrl?: string
  githubUrl?: string
  year: number
  status: ProjectStatus
  demoViewport: DemoViewport
  liveDemoType?: 'fyp' | 'timetabler' | 'portfolio'
  category?: 'academic' | 'ai' | 'platform' | 'security'
  published?: boolean
  featured?: boolean
  displayOrder?: number
  version?: number
}

export interface PortfolioProjectApiResponse {
  id: string
  title: string
  slug: string
  summary: string
  problem?: string
  solution?: string
  architectureFlow?: string
  keyFeatures?: string[]
  stack: string[]
  status: ProjectStatus
  demoViewport: DemoViewport
  year: number
  githubUrl?: string
  liveDemoType?: 'fyp' | 'timetabler' | 'portfolio'
  published?: boolean
  featured?: boolean
  displayOrder?: number
  version?: number
  updatedAt?: string
}

export interface PortfolioMetricsApiResponse {
  totalProjects: number
  totalViews: number
  cacheStatus: 'HIT' | 'MISS' | 'UNAVAILABLE'
  cacheKey: string
}

export interface SiteSettings {
  id: string
  fullName: string
  professionalTitle: string
  headline: string
  bio: string
  contactEmail: string
  phone?: string
  location: string
  profileImageUrl?: string
  githubUrl?: string
  linkedinUrl?: string
  websiteUrl?: string
  seoTitle?: string
  seoDescription?: string
  availabilityBadge?: string
  openToWork: boolean
  updatedAt: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy?: string
  startedOn: string
  endedOn?: string
  currentEducation: boolean
  description?: string
  credentialUrl?: string
  displayOrder: number
}

export interface Certification {
  id: string
  name: string
  issuingOrganization: string
  issueDate: string
  expirationDate?: string
  credentialId?: string
  credentialUrl?: string
  displayOrder: number
}

export interface SkillItem {
  id: string
  name: string
  category: string
  displayOrder: number
}

export interface ExperienceItem {
  id: string
  company: string
  role: string
  location?: string
  descriptionMarkdown: string
  startedOn: string
  endedOn?: string
  currentRole: boolean
}

export interface ResumeDocument {
  id: string
  fileName: string
  contentType: string
  fileSizeBytes: number
  versionTag: string
  targetTrack: string
  isPublished: boolean
  uploadedAt: string
}

export interface ActiveResume {
  id: string
  fileName: string
  contentType: string
  fileSizeBytes: number
  versionTag: string
  downloadUrl: string
  uploadedAt: string
}

export interface ContactMessage {
  id: string
  senderName: string
  senderEmail: string
  subject: string
  body: string
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'SPAM'
  createdAt: string
  resolvedAt?: string
}

export interface AuditLogItem {
  id: number
  actorId?: string
  action: string
  entityType: string
  entityId?: string
  occurredAt: string
  requestId: string
}
