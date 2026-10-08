/**
 * Production API client for Spring Boot REST endpoints.
 *
 * Handles:
 * - Environment-aware base URL resolution (defaults to backend port 8080 in dev or relative /api)
 * - Automatic Authorization header injection for authenticated admin sessions
 * - RFC 7807 ProblemDetail error normalization
 * - Multipart file upload support for resume documents
 */

export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL as string | undefined

  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.replace(/\/$/, '')
  }

  // If in browser development mode (Vite default port 5173), target local Spring Boot API
  if (typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '3000')) {
    return 'http://localhost:8080'
  }

  // In production, default to empty string so requests go to the same origin (handled by reverse proxy or ALB)
  return ''
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.sessionStorage.getItem('admin_auth_token') ||
         window.localStorage.getItem('admin_auth_token') ||
         window.sessionStorage.getItem('admin_access_key')
}

export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return
  if (token) {
    window.sessionStorage.setItem('admin_auth_token', token)
  } else {
    window.sessionStorage.removeItem('admin_auth_token')
  }
}

export interface ProblemDetail {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  invalidParams?: Array<{ name: string; reason: string }>
}

export class ApiError extends Error {
  status: number
  problemDetail?: ProblemDetail

  constructor(message: string, status: number, problemDetail?: ProblemDetail) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.problemDetail = problemDetail
  }
}

export async function fetchJson<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const token = getAuthToken()

  const headers = new Headers(init?.headers)
  if (!headers.has('Content-Type') && !(init?.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`

  const response = await fetch(url, {
    ...init,
    headers,
  })

  if (!response.ok) {
    let problem: ProblemDetail | undefined
    let errorMessage = `Request failed with status ${response.status}`

    try {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('json')) {
        problem = (await response.json()) as ProblemDetail
        if (problem.detail) {
          errorMessage = problem.detail
        } else if (problem.title) {
          errorMessage = problem.title
        }
      }
    } catch {
      // Fallback to default message
    }

    throw new ApiError(errorMessage, response.status, problem)
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return (await response.json()) as T
  }

  return {} as T
}

export async function uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const token = getAuthToken()

  const headers = new Headers()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  })

  if (!response.ok) {
    throw new ApiError(`File upload failed with status ${response.status}`, response.status)
  }

  return (await response.json()) as T
}
