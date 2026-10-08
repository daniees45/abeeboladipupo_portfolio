export type DemoViewport = 'desktop' | 'tablet' | 'mobile'
export type ProjectStatus = 'live' | 'prototype' | 'concept'

export interface PortfolioProject {
  id: string
  title: string
  slug: string
  summary: string
  stack: string[]
  demoUrl: string
  repoUrl?: string
  year: number
  status: ProjectStatus
  demoViewport: DemoViewport
}

export interface PortfolioProjectApiResponse {
  id: string
  title: string
  slug: string
  summary: string
  stack: string[]
  status: ProjectStatus
  demoViewport: DemoViewport
  year: number
}

export interface PortfolioMetricsApiResponse {
  totalProjects: number
  totalViews: number
  cacheStatus: 'HIT' | 'MISS' | 'UNAVAILABLE'
  cacheKey: string
}
