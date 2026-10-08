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
}

export interface PortfolioMetricsApiResponse {
  totalProjects: number
  totalViews: number
  cacheStatus: 'HIT' | 'MISS' | 'UNAVAILABLE'
  cacheKey: string
}
