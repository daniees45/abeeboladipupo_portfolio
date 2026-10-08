/**
 * Resume templates and structured profile data.
 *
 * Provides specialized presets for different target roles:
 * 1. Cloud Architect & Platform Lead: Highlights infrastructure, reliability, microservices, and metrics.
 * 2. Full-Stack Product Engineer: Highlights React, TypeScript, Vite, Spring Boot APIs, and user experience.
 * 3. Minimalist ATS Technical Lead: Optimized for ATS parsers and executive readability with dense achievement metrics.
 */

export interface ResumeExperience {
  role: string
  company: string
  location: string
  period: string
  highlights: string[]
}

export interface ResumeProject {
  name: string
  description: string
  technologies: string[]
}

export interface ResumeEducation {
  degree: string
  institution: string
  period: string
  details?: string
}

export interface ResumeSkillCategory {
  category: string
  items: string[]
}

export interface ResumeTemplate {
  id: 'cloud-architect' | 'full-stack' | 'minimal-ats'
  name: string
  targetRole: string
  badge: string
  description: string
  accentColor: string
  contact: {
    fullName: string
    email: string
    location: string
    linkedin: string
    github: string
    website: string
  }
  summary: string
  skills: ResumeSkillCategory[]
  experience: ResumeExperience[]
  projects: ResumeProject[]
  education: ResumeEducation[]
  certifications: string[]
}

export const resumeTemplates: Record<ResumeTemplate['id'], ResumeTemplate> = {
  'cloud-architect': {
    id: 'cloud-architect',
    name: 'Cloud Solutions Architect',
    targetRole: 'Cloud Solutions Architect & Platform Engineer',
    badge: 'Infrastructure & Scale',
    description: 'Emphasizes cloud-native systems, zero-downtime deployments, distributed telemetry, and reliability engineering.',
    accentColor: '#0284c7', // Sky / Cyan
    contact: {
      fullName: 'Abeeb Oladipupo',
      email: 'abeeboladipupo@example.com',
      location: 'United States • Authorized to Work',
      linkedin: 'https://linkedin.com/in/abeeboladipupo',
      github: 'https://github.com/abeeboladipupo',
      website: 'https://abeeboladipupo.dev',
    },
    summary:
      'Cloud Solutions Architect and Systems Engineer with extensive experience designing resilient distributed applications, containerized release pipelines, and high-throughput backend services. Specialized in Spring Boot microservices, PostgreSQL data modeling, Redis caching layers, and cloud infrastructure automation. Proven track record of architecting systems delivering 99.99% availability with automated health observability.',
    skills: [
      {
        category: 'Cloud & Infrastructure',
        items: ['Docker', 'Kubernetes', 'Terraform', 'AWS / Render / Railway', 'Linux', 'GitHub Actions CI/CD'],
      },
      {
        category: 'Backend & Data',
        items: ['Java 21', 'Spring Boot 3', 'Spring Data JPA', 'PostgreSQL', 'Redis', 'REST APIs', 'Hibernate'],
      },
      {
        category: 'Architecture & Reliability',
        items: ['Microservices', 'Distributed Caching', 'Zero-Downtime Rollouts', 'OpenTelemetry', 'System Security'],
      },
      {
        category: 'Frontend & Integrations',
        items: ['TypeScript', 'React 19', 'Tailwind CSS', 'Vite', 'Cloudinary API'],
      },
    ],
    experience: [
      {
        role: 'Senior Cloud & Platform Engineer',
        company: 'Independent Engineering Consulting',
        location: 'Remote',
        period: '2022 — Present',
        highlights: [
          'Architected containerized microservice platforms using Spring Boot and Docker, achieving sub-25ms p99 latency across core API endpoints.',
          'Engineered a multi-tiered caching topology utilizing Spring Data Redis, increasing cache hit rates to 96.8% and reducing primary PostgreSQL read load by 60%.',
          'Automated CI/CD deployment pipelines with zero-downtime blue/green releases and automated health verification probes.',
          'Designed schema migration routines and resilient database connection pooling with HikariCP for fault-tolerant database operations.',
        ],
      },
      {
        role: 'Systems & Backend Engineer',
        company: 'Portfolio Platform Services',
        location: 'Remote',
        period: '2020 — 2022',
        highlights: [
          'Built RESTful APIs supporting portfolio management, content approvals, and real-time observability telemetry.',
          'Formulated database schemas in PostgreSQL with optimized B-tree indexes and transactional isolation guarantees.',
          'Integrated media processing workflows with Cloudinary and client-side secure upload protocols.',
          'Authored comprehensive system architecture documentation, performance tuning guides, and deployment playbooks.',
        ],
      },
    ],
    projects: [
      {
        name: 'API Observability & Telemetry Gateway',
        description: 'Production-grade service observability dashboard tracking Spring Boot request rates, p99 latency, and Redis cache statuses.',
        technologies: ['Java 21', 'Spring Boot 3', 'Redis', 'PostgreSQL', 'Docker'],
      },
      {
        name: 'Cloud Infrastructure Pipeline Runner',
        description: 'Multi-stage continuous delivery pipeline automating linting, JUnit testing, Docker builds, and cloud rollouts.',
        technologies: ['GitHub Actions', 'Terraform', 'Docker', 'Render'],
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Technology',
        period: '2015 — 2019',
        details: 'Specialization in Distributed Systems, Computer Networks, and Software Architecture.',
      },
    ],
    certifications: [
      'AWS Certified Solutions Architect (Associate)',
      'Certified Kubernetes Application Developer (CKAD) Curriculum',
    ],
  },

  'full-stack': {
    id: 'full-stack',
    name: 'Full-Stack Product Engineer',
    targetRole: 'Senior Full-Stack Product Engineer',
    badge: 'Product & UX Velocity',
    description: 'Balances high-performance React + TypeScript user interfaces with robust Spring Boot backend APIs.',
    accentColor: '#0d9488', // Teal
    contact: {
      fullName: 'Abeeb Oladipupo',
      email: 'abeeboladipupo@example.com',
      location: 'United States • Authorized to Work',
      linkedin: 'https://linkedin.com/in/abeeboladipupo',
      github: 'https://github.com/abeeboladipupo',
      website: 'https://abeeboladipupo.dev',
    },
    summary:
      'Product-minded Senior Full-Stack Engineer with a strong passion for craftsmanship, responsive user interfaces, and robust backend engineering. Proven expertise building single-page applications with React 19, TypeScript, and Tailwind CSS paired with scalable Java / Spring Boot services. Dedicated to rapid product iteration, crisp visual polish, and production reliability.',
    skills: [
      {
        category: 'Frontend Engineering',
        items: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS 4', 'HTML5/CSS3', 'Responsive Design', 'State Management'],
      },
      {
        category: 'Backend & APIs',
        items: ['Java 21', 'Spring Boot 3', 'RESTful API Design', 'Spring Data JPA', 'PostgreSQL', 'Redis'],
      },
      {
        category: 'DevOps & Tooling',
        items: ['Git', 'Docker', 'Vercel', 'Render', 'Oxlint', 'Vitest / JUnit 5'],
      },
      {
        category: 'Engineering Practices',
        items: ['Agile / Scrum', 'Component-Driven Development', 'Code Reviews', 'Accessibility (a11y)', 'Design Systems'],
      },
    ],
    experience: [
      {
        role: 'Senior Full-Stack Product Engineer',
        company: 'Independent Product Engineering',
        location: 'Remote',
        period: '2022 — Present',
        highlights: [
          'Spearheaded end-to-end development of the portfolio platform featuring live sandboxed project demos, resume builders, and media management.',
          'Implemented responsive component architecture adhering to modern web design standards with light/dark theme synchronization.',
          'Built type-safe API communication layers with resilient offline fallbacks, ensuring seamless UX even under network constraints.',
          'Constructed an interactive recruiter preview engine allowing live device breakpoint testing and cross-frame postMessage communications.',
        ],
      },
      {
        role: 'Full-Stack Software Engineer',
        company: 'Digital Solutions Group',
        location: 'Remote',
        period: '2020 — 2022',
        highlights: [
          'Delivered customer-facing web applications utilizing React and TypeScript, improving user engagement scores by 35%.',
          'Constructed Spring Boot backend controllers with validation and structured error responses.',
          'Collaborated closely with design and product teams to translate Figma wireframes into reusable, accessible design systems.',
          'Optimized bundle size and Largest Contentful Paint (LCP) across production landing pages.',
        ],
      },
    ],
    projects: [
      {
        name: 'Interactive Project Demo Sandbox',
        description: 'Recruiter-friendly demo sandbox embedding live device viewports, signal testing, and responsive previews.',
        technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite'],
      },
      {
        name: 'Full-Stack Portfolio Platform',
        description: 'Complete personal branding platform with admin dashboard, PostgreSQL schema, and Cloudinary upload workflow.',
        technologies: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'Redis'],
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Technology',
        period: '2015 — 2019',
        details: 'Focused on Human-Computer Interaction, Web Technologies, and Data Engineering.',
      },
    ],
    certifications: [
      'Meta Frontend Developer Professional Certificate',
      'Spring Certified Professional Foundations',
    ],
  },

  'minimal-ats': {
    id: 'minimal-ats',
    name: 'ATS Executive Technical Lead',
    targetRole: 'Staff Software Engineer / Technical Lead',
    badge: 'ATS-Optimized & Executive',
    description: 'High-density, ATS-friendly format tailored for automated recruiter screeners and hiring committee reviews.',
    accentColor: '#334155', // Slate
    contact: {
      fullName: 'Abeeb Oladipupo',
      email: 'abeeboladipupo@example.com',
      location: 'United States • US Work Authorization (No Sponsorship Required)',
      linkedin: 'https://linkedin.com/in/abeeboladipupo',
      github: 'https://github.com/abeeboladipupo',
      website: 'https://abeeboladipupo.dev',
    },
    summary:
      'Accomplished Software Engineer and Technical Lead with 6+ years of experience spearheading distributed systems, enterprise APIs, and modern web applications. Expert in Java/Spring Boot ecosystems, TypeScript/React architectures, cloud infrastructure, and database optimization. Experienced in leading architectural decisions, mentoring engineers, and executing roadmap milestones with high velocity and operational excellence.',
    skills: [
      {
        category: 'Core Technologies',
        items: ['Java 21', 'Spring Boot', 'TypeScript', 'React', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
      },
      {
        category: 'Architecture & Practices',
        items: ['Distributed Systems', 'System Design', 'Domain-Driven Design (DDD)', 'CI/CD Pipelines', 'TDD', 'Agile Leadership'],
      },
      {
        category: 'Cloud & Infrastructure',
        items: ['Terraform', 'AWS', 'Linux Administration', 'Container Orchestration', 'Microservices Security', 'HikariCP'],
      },
    ],
    experience: [
      {
        role: 'Technical Lead & Senior Software Engineer',
        company: 'Enterprise Product Systems',
        location: 'Remote',
        period: '2022 — Present',
        highlights: [
          'Led technical design and delivery of mission-critical platform services supporting high-concurrency client workloads.',
          'Reduced p95 API response times from 180ms to 24ms through aggressive query indexing, Redis caching, and async processing.',
          'Instituted automated static code analysis, code review standards, and comprehensive JUnit/integration testing suites.',
          'Mentored junior and mid-level engineers in distributed system patterns, clean architecture, and modern TypeScript.',
        ],
      },
      {
        role: 'Software Engineer',
        company: 'Cloud Application Services',
        location: 'Remote',
        period: '2019 — 2022',
        highlights: [
          'Implemented Spring Data JPA persistence layers and database migrations for high-availability transactional datasets.',
          'Developed responsive React administrative dashboards with secure authentication workflows.',
          'Reduced CI/CD build and deploy cycle times by 45% using Docker layer caching and optimized Gradle/Maven workflows.',
        ],
      },
    ],
    projects: [
      {
        name: 'Distributed Platform Telemetry Engine',
        description: 'Scalable observability engine capturing microservice metrics and transaction traces in real time.',
        technologies: ['Java', 'Spring Boot', 'Redis', 'PostgreSQL'],
      },
      {
        name: 'Portfolio Platform Architecture',
        description: 'Full-stack platform demonstrating clean separation of concerns, containerized builds, and zero-cost cloud deployment.',
        technologies: ['React 19', 'TypeScript', 'Java 21', 'Spring Boot 3'],
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Technology',
        period: '2015 — 2019',
        details: 'Graduated with honors. Coursework: Algorithms, Database Management, Operating Systems.',
      },
    ],
    certifications: [
      'AWS Certified Solutions Architect',
      'Professional Scrum Master (PSM I)',
    ],
  },
}
