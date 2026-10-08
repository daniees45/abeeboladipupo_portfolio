import type { PortfolioProject } from '../types'

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'project-demo-view',
    title: 'Project Demo View',
    slug: 'project-demo-view',
    summary:
      'A secure, recruiter-friendly demo environment that can open a live project sandbox inside the portfolio viewport.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Cloudflare'],
    demoUrl: '/demos/project-demo-view',
    repoUrl: '/projects/project-demo-view',
    year: 2026,
    status: 'live',
    demoViewport: 'desktop',
  },
  {
    id: 'api-observability',
    title: 'API Observability',
    slug: 'api-observability',
    summary:
      'A production-ready service telemetry dashboard that makes Spring Boot APIs and event flow easy to track.',
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'OpenTelemetry'],
    demoUrl: '/demos/api-observability',
    repoUrl: '/projects/api-observability',
    year: 2026,
    status: 'prototype',
    demoViewport: 'tablet',
  },
  {
    id: 'cloud-automation',
    title: 'Cloud Automation',
    slug: 'cloud-automation',
    summary:
      'Infrastructure automation for deployment pipelines, environment parity, and release confidence across multiple services.',
    stack: ['Terraform', 'Docker', 'Render', 'GitHub Actions', 'Neon'],
    demoUrl: '/demos/cloud-automation',
    repoUrl: '/projects/cloud-automation',
    year: 2025,
    status: 'concept',
    demoViewport: 'mobile',
  },
]
