import type { PortfolioProject } from '../types'

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'fyp-supervision-system',
    title: 'Final Year Project (FYP) Supervision System',
    slug: 'fyp-supervision-system',
    summary:
      'Role-based academic workflow platform coordinating project milestone submissions, supervisor reviews, and departmental defense clearances.',
    problem:
      'University project coordination suffered from fragmented email threads, lost document drafts, delayed supervisor feedback, and zero departmental oversight into student progress toward graduation deadlines.',
    solution:
      'Engineered a centralized multi-tier web platform with strict Role-Based Access Control (RBAC) connecting Students, Supervisors, and Department Heads (HOD). Built structured milestone submission trackers, topic review loops, and document status dashboards.',
    architectureFlow:
      'React Client UI ──▶ REST API ──▶ Spring Boot Backend ──▶ PostgreSQL ──▶ Role Gates (Student / Supervisor / HOD)',
    keyFeatures: [
      'Role-Based Access Control with distinct Student, Supervisor, and HOD dashboards',
      'Milestone dissertation submission and document version tracking',
      'Topic similarity review to prevent redundant research proposals',
      'Supervisor feedback loop with structured approval/revision statuses',
      'Departmental defense scheduling and final clearance verification',
    ],
    stack: ['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'REST API', 'RBAC'],
    demoUrl: '#sandbox',
    repoUrl: 'https://github.com/daniees45/fyp-supervision-system',
    githubUrl: 'https://github.com/daniees45/fyp-supervision-system',
    year: 2025,
    status: 'live',
    demoViewport: 'desktop',
    liveDemoType: 'fyp',
    category: 'academic',
  },
  {
    id: 'ai-timetabling-system',
    title: 'AI-Powered Timetabling System',
    slug: 'ai-timetabling-system',
    summary:
      'Automated academic scheduling system using Constraint Satisfaction Problem (CSP) optimization to resolve lecturer availability, room capacities, and course overlaps.',
    problem:
      'Academic departments manually built lecture timetables over several weeks, frequently running into room capacity overfills, lecturer schedule clashes, course collisions, and student enrollment bottlenecks.',
    solution:
      'Developed an automated scheduling engine applying Constraint Satisfaction Problem (CSP) heuristics with a clean REST backend. Validates hard constraints (zero lecturer clashes, room capacity compliance) and optimizes soft constraints in seconds.',
    architectureFlow:
      'Client Frontend ──▶ Flask REST API ──▶ Python CSP Optimization Solver ──▶ MySQL / PostgreSQL ──▶ Conflict-Free Matrix',
    keyFeatures: [
      'Automated conflict-free course timetable generation using CSP heuristics',
      'Lecturer availability windows and department-specific constraints',
      'Room capacity vs. student enrollment validation',
      'CSV roster and course data batch importing and export',
      'Real-time collision detection during manual schedule overrides',
      'Student timetable viewer with filtered personalized schedule views',
    ],
    stack: ['Python', 'Flask', 'MySQL', 'REST API', 'CSP Optimization', 'Algorithms'],
    demoUrl: '#sandbox',
    repoUrl: 'https://github.com/daniees45/ai-timetabling-system',
    githubUrl: 'https://github.com/daniees45/ai-timetabling-system',
    year: 2024,
    status: 'live',
    demoViewport: 'desktop',
    liveDemoType: 'timetabler',
    category: 'ai',
  },
  {
    id: 'portfolio-platform',
    title: 'Full-Stack Engineering & Security Platform',
    slug: 'portfolio-platform',
    summary:
      'The personal engineering platform powering this site: decoupled React 19 frontend, Spring Boot 3 REST API, Redis cache-aside, PostgreSQL persistence, and tamper-resistant security audit logs.',
    problem:
      'Standard developer portfolios merely show static screenshots without proving real backend competence, database schemas, distributed caching, rate-limiting, or security engineering.',
    solution:
      'Architected a production full-stack platform implementing Clean Architecture (Hexagonal/DDD). Integrates cache-aside Redis with key eviction on writes, Bucket4j rate limiting, and an isolated administrative console with session audit logging.',
    architectureFlow:
      'Edge CDN (Vercel) ──▶ Spring Boot 3 API ──▶ Redis Cache-Aside ──▶ Supabase PostgreSQL ──▶ Security Audit Trail',
    keyFeatures: [
      'Hexagonal / DDD domain architecture with versioned Flyway migrations',
      'Cache-aside Redis engine with versioned namespace key eviction',
      'Bucket4j distributed rate limiting protecting public endpoints',
      'Security audit logging tracking administrative sessions and events',
      'Template-driven dynamic résumé exporter (Word DOC, Markdown ATS, Print/PDF)',
      'Automated GitHub Actions CI quality pipeline with zero-warning static analysis',
    ],
    stack: ['Java 21', 'Spring Boot 3', 'React 19', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'Flyway'],
    demoUrl: '#sandbox',
    repoUrl: 'https://github.com/daniees45/abeeboladipupo_portfolio',
    githubUrl: 'https://github.com/daniees45/abeeboladipupo_portfolio',
    year: 2026,
    status: 'live',
    demoViewport: 'desktop',
    liveDemoType: 'portfolio',
    category: 'platform',
  },
]
