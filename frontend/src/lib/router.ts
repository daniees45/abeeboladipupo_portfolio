/**
 * Lightweight browser-native client router with Universal SPA Fallback.
 *
 * Supports:
 * - HTML5 pushState pathnames (/resume, /projects, /portal-admin-abeeb)
 * - Hash fallback routing (#/resume, #resume, #/projects, #projects, #/portal-admin-abeeb)
 * - SPA redirect query params (?p=/resume or ?route=/resume)
 * - Built-in <Link /> component preventing accidental hard full-page server reloads
 */

import React, { useEffect, useState } from 'react'

export const ADMIN_ROUTE: string =
  (import.meta.env.VITE_ADMIN_PATH as string | undefined) || '/portal-admin-abeeb'

export const ADMIN_SECRET_KEY: string =
  (import.meta.env.VITE_ADMIN_SECRET_KEY as string | undefined) || 'abeeb-admin-2026'

const cleanRoute = (str: string): string => {
  if (!str) return '/'
  const noHash = str.replace(/^#\/?/, '/')
  const noQuery = noHash.split('?')[0]
  const trimmed = noQuery.replace(/\/+$/, '')
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

/**
 * Normalizes the current URL path from either query redirect, hash, or pathname.
 */
export function getNormalizedPath(): string {
  if (typeof window === 'undefined') return '/'

  // 1. Check query parameter redirect (e.g. from GitHub Pages 404 redirect: ?p=/resume)
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const queryPath = urlParams.get('p') || urlParams.get('route')
    if (queryPath) {
      return cleanRoute(decodeURIComponent(queryPath))
    }
  } catch {
    // fallback
  }

  // 2. Check hash route (e.g., #/resume, #resume, #/projects, #/portal-admin-abeeb)
  if (window.location.hash) {
    const hashCandidate = cleanRoute(window.location.hash)
    const adminPathClean = cleanRoute(ADMIN_ROUTE)
    if (
      hashCandidate === '/resume' ||
      hashCandidate === '/projects' ||
      hashCandidate === adminPathClean
    ) {
      return hashCandidate
    }
  }

  // 3. Check standard pathname (/resume, /projects, /portal-admin-abeeb)
  const path = cleanRoute(window.location.pathname)
  return path || '/'
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

    const targetUrl = cleanRoute(to)
    try {
      window.history.pushState({}, '', targetUrl)
    } catch {
      window.location.hash = targetUrl
    }
    setCurrentPath(targetUrl)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateHash = (to: string) => {
    if (typeof window === 'undefined') return
    const targetHash = to.startsWith('#') ? to : `#${to.replace(/^\//, '')}`
    window.location.hash = targetHash
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return { currentPath, navigate, navigateHash, ADMIN_ROUTE, ADMIN_SECRET_KEY }
}

export function Link({
  to,
  children,
  className,
  onClick,
  ...props
}: {
  to: string
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { navigate } = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e)
    // Only intercept local relative routes
    if (!to.startsWith('http') && !to.startsWith('#') && !to.startsWith('mailto:')) {
      e.preventDefault()
      navigate(to)
    }
  }

  return React.createElement(
    'a',
    {
      href: to,
      onClick: handleClick,
      className,
      ...props,
    },
    children
  )
}
