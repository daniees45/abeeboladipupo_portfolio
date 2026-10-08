import { fetchJson } from '../../../lib/api'
import type { PortfolioMetricsApiResponse, PortfolioProjectApiResponse } from '../types'

export async function fetchPortfolioProjects(): Promise<PortfolioProjectApiResponse[]> {
  return fetchJson<PortfolioProjectApiResponse[]>('/api/v1/projects')
}

export async function fetchPortfolioMetrics(): Promise<PortfolioMetricsApiResponse> {
  return fetchJson<PortfolioMetricsApiResponse>('/api/v1/metrics')
}
