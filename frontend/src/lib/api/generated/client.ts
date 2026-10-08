/**
 * Canonical Portfolio API Client matching contracts/openapi/portfolio-api.yaml.
 * Works seamlessly across both SSR/ISR and browser client runtimes.
 */

import type {
  BlogPost,
  BlogPostPage,
  ContactMessageCreate,
  Experience,
  Product,
  ProductCreate,
  ProductUpdate,
  Project,
  ProjectCreate,
  ProjectPage,
  ProjectUpdate,
  Skill,
} from './schema'

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'https://api.abeeboladipupo.com/api/v1'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`API Error ${res.status}: ${errorText}`)
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return {} as T
  }

  return res.json() as Promise<T>
}

export const portfolioApiClient = {
  // Public Reads
  listProjects: (params?: { page?: number; size?: number; featured?: boolean }) => {
    const search = new URLSearchParams()
    if (params?.page !== undefined) search.set('page', String(params.page))
    if (params?.size !== undefined) search.set('size', String(params.size))
    if (params?.featured !== undefined) search.set('featured', String(params.featured))
    const query = search.toString() ? `?${search.toString()}` : ''
    return request<ProjectPage>(`/projects${query}`)
  },

  getProjectBySlug: (slug: string) => request<Project>(`/projects/${encodeURIComponent(slug)}`),

  listSkills: () => request<Skill[]>('/skills'),

  listExperience: () => request<Experience[]>('/experience'),

  listPosts: (params?: { page?: number; size?: number }) => {
    const search = new URLSearchParams()
    if (params?.page !== undefined) search.set('page', String(params.page))
    if (params?.size !== undefined) search.set('size', String(params.size))
    const query = search.toString() ? `?${search.toString()}` : ''
    return request<BlogPostPage>(`/posts${query}`)
  },

  getPostBySlug: (slug: string) => request<BlogPost>(`/posts/${encodeURIComponent(slug)}`),

  listProducts: () => request<Product[]>('/products'),

  getProductBySlug: (slug: string) => request<Product>(`/products/${encodeURIComponent(slug)}`),

  createContactMessage: (data: ContactMessageCreate) =>
    request<void>('/contact-messages', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Admin CMS Writes (Guarded by Bearer JWT token)
  createProject: (data: ProjectCreate, bearerToken: string) =>
    request<Project>('/admin/projects', {
      method: 'POST',
      headers: { Authorization: `Bearer ${bearerToken}` },
      body: JSON.stringify(data),
    }),

  updateProject: (id: string, data: ProjectUpdate, bearerToken: string) =>
    request<Project>(`/admin/projects/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${bearerToken}` },
      body: JSON.stringify(data),
    }),

  createProduct: (data: ProductCreate, bearerToken: string) =>
    request<Product>('/admin/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${bearerToken}` },
      body: JSON.stringify(data),
    }),

  updateProduct: (id: string, data: ProductUpdate, bearerToken: string) =>
    request<Product>(`/admin/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${bearerToken}` },
      body: JSON.stringify(data),
    }),

  softDeleteContent: (resource: 'projects' | 'experience' | 'skills' | 'posts' | 'products', id: string, bearerToken: string) =>
    request<void>(`/admin/${resource}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${bearerToken}` },
    }),
}
