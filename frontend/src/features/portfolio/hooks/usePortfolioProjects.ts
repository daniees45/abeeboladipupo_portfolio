import { useEffect, useState } from 'react'
import { fetchPortfolioProjects } from '../api/portfolioApi'
import { portfolioProjects as fallbackProjects } from '../data/projects'
import type { PortfolioProjectApiResponse } from '../types'

export function usePortfolioProjects() {
  const [projects, setProjects] = useState<PortfolioProjectApiResponse[]>(fallbackProjects)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOfflineFallback, setIsOfflineFallback] = useState(false)

  useEffect(() => {
    let isMounted = true

    fetchPortfolioProjects()
      .then((data) => {
        if (!isMounted) {
          return
        }

        setProjects(data)
        setError(null)
        setIsOfflineFallback(false)
      })
      .catch((fetchError) => {
        if (!isMounted) {
          return
        }

        // Graceful fallback to rich mock data
        setProjects(fallbackProjects)
        setIsOfflineFallback(true)
        setError(fetchError instanceof Error ? fetchError.message : 'Backend offline - using demo data')
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const addProject = (newProject: PortfolioProjectApiResponse) => {
    setProjects((prev) => [newProject, ...prev])
  }

  return { projects, loading, error, isOfflineFallback, addProject }
}
