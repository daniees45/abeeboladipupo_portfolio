import { useEffect, useState } from 'react'
import { fetchPortfolioMetrics } from '../api/portfolioApi'
import type { PortfolioMetricsApiResponse } from '../types'

const FALLBACK_METRICS: PortfolioMetricsApiResponse = {
  totalProjects: 3,
  totalViews: 14250,
  cacheStatus: 'HIT',
  cacheKey: 'portfolio:metrics:cached',
}

export function usePortfolioMetrics() {
  const [metrics, setMetrics] = useState<PortfolioMetricsApiResponse | null>(FALLBACK_METRICS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOfflineFallback, setIsOfflineFallback] = useState(false)

  useEffect(() => {
    let isMounted = true

    fetchPortfolioMetrics()
      .then((data) => {
        if (!isMounted) {
          return
        }

        setMetrics(data)
        setError(null)
        setIsOfflineFallback(false)
      })
      .catch((fetchError) => {
        if (!isMounted) {
          return
        }

        setMetrics(FALLBACK_METRICS)
        setIsOfflineFallback(true)
        setError(fetchError instanceof Error ? fetchError.message : 'Backend offline')
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

  return { metrics, loading, error, isOfflineFallback }
}
