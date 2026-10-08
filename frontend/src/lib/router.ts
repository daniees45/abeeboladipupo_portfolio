/**
 * Lightweight browser-native client router.
 *
 * Supports both path-based routing (/resume) and hash-based routing (#/resume)
 * to ensure 100% compatibility across static hosts (Vercel, GitHub Pages)
 * without requiring server rewrites or external router dependencies.
 */

import { useEffect, useState } from 'react'

export const ADMIN_ROUTE: string =
  (import.meta.env.VITE_ADMIN_PATH as string | undefined) || '/portal-admin-abeeb'

export const ADMIN_SECRET_KEY: string =
  (import.meta.env.VITE_ADMIN_SECRET_KEY as string | undefined) || 'abeeb-admin-2026'

/**
 * Normalizes the current URL path from either pathname or hash.
 */
function getNormalizedPath(): string {
  if (typeof window === 'undefined') return '/'

  // Check hash route first (e.g., #/portal-admin-abeeb)
  if (window.location.hash.startsWith('#/')) {
    return window.location.hash.slice(1).split('?')[0] || '/'
  }

  // Otherwise check pathname
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  return path
}

export function useRouter() {
  const [currentPath, setCurrentPath] = useState<string>(getNormalizedPath)

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getNormalizedPath())
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  const navigate = (to: string) => {
    if (typeof window === 'undefined') return

    // If on a static page without HTML5 pushState fallback support, use hash
    const targetUrl = to.startsWith('/') ? to : `/${to}`
    window.history.pushState({}, '', targetUrl)
    setCurrentPath(targetUrl)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateHash = (to: string) => {
    if (typeof window === 'undefined') return
    window.location.hash = to.startsWith('#') ? to : `#${to}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return { currentPath, navigate, navigateHash, ADMIN_ROUTE, ADMIN_SECRET_KEY }
}
