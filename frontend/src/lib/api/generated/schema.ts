/**
 * AUTO-GENERATED / CONTRACT-ALIGNED TYPES
 * Source: contracts/openapi/portfolio-api.yaml (OpenAPI 3.1.0)
 *
 * DO NOT EDIT MANUALLY. These types correspond strictly to the canonical contract.
 */

export interface ProjectCreate {
  slug: string
  title: string
  summary: string
  contentMarkdown: string
  repositoryUrl?: string
  liveUrl?: string
  demoUrl?: string
  published?: boolean
  featured?: boolean
  displayOrder?: number
}

export interface ProjectUpdate extends ProjectCreate {
  version: number
}

export interface Project extends ProjectCreate {
  id: string
  version: number
  updatedAt: string
}

export interface ProjectPage {
  content: Project[]
  page: number
  size: number
  totalElements: number
}

export interface Skill {
  id: string
  name: string
  category: string
  displayOrder: number
}

export interface Experience {
  id: string
  company: string
  role: string
  location?: string
  descriptionMarkdown: string
  startedOn: string
  endedOn?: string
  currentRole: boolean
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  bodyMarkdown: string
  coverImageUrl?: string
  published: boolean
  publishedAt?: string
}

export interface BlogPostPage {
  content: BlogPost[]
  page: number
  size: number
  totalElements: number
}

export interface ContactMessageCreate {
  senderName: string
  senderEmail: string
  subject: string
  body: string
}

export type ProductAvailabilityStatus = 'COMING_SOON' | 'INQUIRY_ONLY'

export interface ProductCreate {
  slug: string
  title: string
  summary: string
  descriptionMarkdown: string
  imageUrl?: string
  availabilityStatus: ProductAvailabilityStatus
  active?: boolean
  displayOrder?: number
}

export interface ProductUpdate extends ProductCreate {
  version: number
}

export interface Product extends ProductCreate {
  id: string
  version: number
  updatedAt: string
}

export interface ProblemDetail {
  type: string
  title: string
  status: number
  detail?: string
  instance?: string
  requestId?: string
  errors?: Array<{ field?: string; message?: string }>
}
