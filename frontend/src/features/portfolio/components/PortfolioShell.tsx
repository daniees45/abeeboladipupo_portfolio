/**
 * Root portfolio shell for the public-facing site.
 *
 * Designed as a high-credibility engineering platform showcase for Abeeb Oladipupo:
 * - Software Developer | Systems & Cybersecurity
 * - Computer Science graduate (Valley View University, WES evaluated, Cisco certified)
 * - Deep engineering case studies, interactive recruiter sandbox demos, and engineering labs
 * - 4-track career resume engine with dynamic Word, Markdown, and Print/PDF export
 * - Light/dark theme toggle with responsive layout and mobile drawer
 */

import { useEffect, useState, type FormEvent } from 'react'
import heroImage from '../../../assets/hero.png'
import { usePortfolioMetrics } from '../hooks/usePortfolioMetrics'
import { usePortfolioProjects } from '../hooks/usePortfolioProjects'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { useCredentials } from '../hooks/useCredentials'
import { submitContactMessage } from '../api/portfolioApi'
import { ProjectDemoView } from './ProjectDemoView'
import { LabsSection } from './LabsSection'
import { ResumeModule } from './ResumeModule'
import { useRouter } from '../../../lib/router'

const CURRENT_YEAR = new Date().getFullYear()

const viewportLabelMap = {
  desktop: 'Desktop View',
  tablet: 'Tablet View',
  mobile: 'Mobile View',
} as const

const engineeringPrinciples = [
  {
    step: '01',
    title: 'Clean Code & Architecture',
    description: 'Clear separation of concerns, Domain-Driven Design (DDD), interface contracts, and automated testing across all layers.',
  },
  {
    step: '02',
    title: 'Defensive Security by Design',
    description: 'Least privilege access, Role-Based Access Control (RBAC), stateless JWT validation, password hashing, and OWASP mitigation.',
  },
  {
    step: '03',
    title: 'Precision Relational Modeling',
    description: 'Normalized schemas (3NF), strict foreign key constraints, ACID transaction safety, and versioned Flyway database migrations.',
  },
  {
    step: '04',
    title: 'Observability & Reliability',
    description: 'Proactive Redis cache-aside patterns, connection pooling with HikariCP, rate limiting, and structured RFC 7807 problem details.',
  },
]

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#sandbox', label: 'Live Sandbox' },
  { href: '#labs', label: 'Engineering Labs' },
  { href: '#credentials', label: 'Credentials' },
  { href: '#resume', label: 'Résumé' },
  { href: '#principles', label: 'Principles' },
  { href: '#contact', label: 'Contact' },
]

export function PortfolioShell() {
  const { projects, loading, isOfflineFallback } = usePortfolioProjects()
  const { metrics, loading: metricsLoading } = usePortfolioMetrics()
  const { settings } = useSiteSettings()
  const { education, certifications } = useCredentials()
  const { navigate } = useRouter()

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return true
    const savedTheme = window.localStorage.getItem('portfolio-theme')
    if (savedTheme) return savedTheme === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'systems' | 'fullstack'>('all')
  const [copiedEmail, setCopiedEmail] = useState(false)

  // Interactive contact form state with real backend transmission
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactSubject, setContactSubject] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactSent, setContactSent] = useState(false)
  const [contactError, setContactError] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light'
    window.localStorage.setItem('portfolio-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const portfolioProjects = projects.map((project) => ({
    ...project,
    demoUrl: `/demos/${project.slug}`,
    repoUrl: `/projects/${project.slug}`,
  }))

  const filteredProjects = portfolioProjects.filter((p) => {
    if (selectedCategory === 'systems') {
      return p.stack.some((s) => ['Java', 'Spring Boot', 'Python', 'Flask', 'PostgreSQL', 'MySQL', 'CSP'].includes(s))
    }
    if (selectedCategory === 'fullstack') {
      return p.stack.some((s) => ['React', 'TypeScript', 'Tailwind CSS', 'Vite'].includes(s))
    }
    return true
  })

  const handleCopyEmail = () => {
    const emailToCopy = settings.contactEmail || 'abeeboladipupo@example.com'
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(emailToCopy)
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2500)
    }
  }

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return
    setContactSubmitting(true)
    setContactError(null)
    try {
      await submitContactMessage({
        senderName: contactName.trim(),
        senderEmail: contactEmail.trim(),
        subject: contactSubject.trim() || 'Portfolio Inquiry / Opportunity',
        body: contactMessage.trim(),
      })
      setContactSent(true)
      setContactName('')
      setContactEmail('')
      setContactSubject('')
      setContactMessage('')
    } catch (err) {
      setContactError(err instanceof Error ? err.message : 'Transmission failed. Please reach out via email.')
    } finally {
      setContactSubmitting(false)
    }
  }

  const stats = [
    { label: 'Verified Systems', value: metrics ? String(metrics.totalProjects) : '3' },
    { label: 'Engineering Case Studies', value: '3 Built' },
    {
      label: 'Redis Cache Status',
      value: metrics ? metrics.cacheStatus : metricsLoading ? 'Loading...' : 'HIT',
    },
  ]

  return (
    <main className={isDarkMode ? 'dark' : 'light'}>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Top Floating Glassmorphism Navbar */}
          <nav className="sticky top-0 z-30 border-b border-slate-200/80 bg-slate-50/90 py-3.5 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80 no-print">
            <div className="flex items-center justify-between">
              {/* Brand Logo & Name */}
              <a href="#" className="flex items-center gap-3 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-cyan-400 text-sm font-bold text-slate-950 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition">
                  AO
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900 dark:text-white">
                    {settings.fullName || 'Abeeb Oladipupo'}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold">
                    {settings.professionalTitle || 'Software Developer | Systems & Cybersecurity'}
                  </p>
                </div>
              </a>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-full px-2.5 py-1.5 transition hover:bg-slate-200/80 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="ml-2 flex items-center gap-1 border-l border-slate-200 pl-2 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => navigate('/resume')}
                    className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 transition cursor-pointer"
                  >
                    📄 Résumé Page
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/projects')}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    🚀 Projects Hub
                  </button>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDarkMode((current) => !current)}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800 cursor-pointer"
                  aria-label="Toggle color theme"
                >
                  {isDarkMode ? '☀️ Light' : '🌙 Dark'}
                </button>

                <a
                  href="#contact"
                  className="hidden sm:inline-flex rounded-full bg-cyan-500 px-4 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400 shadow-sm shadow-cyan-500/20"
                >
                  Get in Touch
                </a>

                {/* Mobile Menu Toggle Button */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  aria-label="Toggle mobile menu"
                >
                  {mobileMenuOpen ? '✕' : '☰'}
                </button>
              </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
              <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 md:hidden">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="border-t border-slate-200 pt-3 dark:border-slate-800 flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      navigate('/resume')
                    }}
                    className="text-cyan-600 dark:text-cyan-400 font-semibold"
                  >
                    Dedicated Résumé Page &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      navigate('/projects')
                    }}
                    className="text-cyan-600 dark:text-cyan-400 font-semibold"
                  >
                    Dedicated Projects Page &rarr;
                  </button>
                </div>
              </div>
            )}
          </nav>

          {/* Hero Section */}
          <section className="grid items-center gap-10 pb-12 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:pb-20">
            <div>
              {/* Availability Status Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{settings.availabilityBadge || '🎓 Computer Science Graduate • Available for Full-Time Roles'}</span>
              </div>

              {/* Main Headline */}
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white leading-[1.12]">
                {settings.headline ? (
                  settings.headline
                ) : (
                  <>
                    I build <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-sky-400">secure, scalable software</span> and practical technology solutions.
                  </>
                )}
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
                {settings.bio || 'Computer Science graduate focused on software development, backend systems, databases, Linux, cloud infrastructure, and cybersecurity. Passionate about engineering systems that solve real organizational problems.'}
              </p>

              {/* 30-Second Recruiter Action Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  🚀 Explore Projects &darr;
                </a>
                <a
                  href="#sandbox"
                  className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-700 dark:text-cyan-300 transition hover:bg-cyan-500/20"
                >
                  ⚡ Live Interactive Demos
                </a>
                <a
                  href="#resume"
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-800 cursor-pointer"
                >
                  📄 View Résumé &darr;
                </a>
                <a
                  href={settings.githubUrl || 'https://github.com/abeeboladipupo'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  🐙 GitHub
                </a>
                <a
                  href={settings.linkedinUrl || 'https://linkedin.com/in/abeeboladipupo'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  💼 LinkedIn
                </a>
              </div>

              {/* Key Competency Badges */}
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Core Technical Stack:</p>
                <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
                  {['Java 21', 'Python', 'TypeScript', 'SQL', 'Spring Boot 3', 'Flask', 'PostgreSQL', 'MySQL', 'React 19', 'Linux', 'Docker', 'Git'].map((tech) => (
                    <span key={tech} className="rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Hero Visual Card with Real-time Telemetry & Architecture graphic */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/10 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/40">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                
                {/* Traffic lights header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>System Telemetry</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* System Health Card */}
                  <div className="flex items-center justify-between rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3.5">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300 font-semibold">Platform Status</p>
                      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        {isOfflineFallback ? 'Offline Fallback (Active)' : 'UP • Clean Architecture Active'}
                      </p>
                    </div>
                    <img
                      src={heroImage}
                      alt="Layered System Architecture"
                      className="h-16 w-16 object-contain opacity-90 drop-shadow-md"
                    />
                  </div>

                  {/* 3 Metric cards */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    {stats.map((stat) => (
                      <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Latency & Specs ticker */}
                  <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/60 text-xs">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span>Database Engine:</span>
                      <strong className="text-emerald-500 font-mono">PostgreSQL / MySQL (3NF)</strong>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span>Security &amp; Auth:</span>
                      <strong className="text-cyan-400 font-mono">JWT + RBAC + OIDC</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* About / Why Teams Hire Me Section */}
          <section id="about" className="grid gap-8 border-t border-slate-200 py-14 dark:border-slate-800 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">Engineering Profile</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                Solid Computer Science foundations, hands-on systems capability.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                I am a Computer Science graduate from Valley View University with academic credentials evaluated by World Education Services (WES) and formal cybersecurity training from Cisco. Rather than presenting a generic résumé, I demonstrate capability through working software, clear architectural reasoning, and defensive security practices.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Open to Full-Time Roles</span>
                <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Remote, Hybrid &amp; On-Site Ready</span>
                <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Proven Working Systems</span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: 'Core Software Development',
                  desc: 'Proficient in Java and Python with clean architectural boundaries, object-oriented design patterns, RESTful APIs, and rigorous unit testing.',
                },
                {
                  title: 'Database Architecture & SQL',
                  desc: 'Designing normalized schemas (3NF) in PostgreSQL and MySQL, writing complex queries, enforcing foreign key integrity, and optimizing indexes.',
                },
                {
                  title: 'Systems & Cybersecurity Focus',
                  desc: 'Trained in Cisco cybersecurity principles, Linux server administration, Role-Based Access Control (RBAC), stateless JWT authentication, and OWASP mitigation.',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/70">
                  <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    ✓
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Selected Projects Showcase with Category Filter */}
          <section id="projects" className="py-14 border-t border-slate-200 dark:border-slate-800">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">Centerpiece Projects</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Engineering Case Studies</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Real systems with detailed technical breakdowns: Problem, Solution, Architecture Flow, and Live Interactive Demos.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    selectedCategory === 'all'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20'
                      : 'border border-slate-300 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                  }`}
                >
                  All Projects
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('systems')}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    selectedCategory === 'systems'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20'
                      : 'border border-slate-300 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                  }`}
                >
                  Backend &amp; Systems
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('fullstack')}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    selectedCategory === 'fullstack'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20'
                      : 'border border-slate-300 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                  }`}
                >
                  Full-Stack
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/projects')}
                  className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 transition cursor-pointer"
                >
                  🚀 Full Projects Catalog &rarr;
                </button>
              </div>
            </div>

            {loading && portfolioProjects.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
                Loading project data from the API...
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredProjects.map((project) => (
                  <article
                    key={project.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-950/5 transition duration-200 hover:-translate-y-1 hover:border-cyan-500/50 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/25"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                          {project.status}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{project.year}</span>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{project.summary}</p>
                      </div>

                      {/* Architecture Flow Strip */}
                      {project.architectureFlow && (
                        <div className="mt-3 rounded-lg bg-slate-100 p-2 text-[10px] font-mono text-cyan-800 dark:bg-slate-950 dark:text-cyan-300">
                          <span className="font-semibold text-slate-500">Flow:</span> {project.architectureFlow}
                        </div>
                      )}

                      {/* Problem & Solution Mini Case Study */}
                      {project.problem && (
                        <div className="mt-3.5 space-y-2 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-xs dark:border-slate-800/80 dark:bg-slate-950/50">
                          <p className="text-slate-700 dark:text-slate-300">
                            <strong className="text-slate-900 dark:text-white">Challenge:</strong> {project.problem}
                          </p>
                          {project.solution && (
                            <p className="text-slate-700 dark:text-slate-300">
                              <strong className="text-slate-900 dark:text-white">Solution:</strong> {project.solution}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Key Features */}
                      {project.keyFeatures && (
                        <ul className="mt-3.5 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                          {project.keyFeatures.slice(0, 3).map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <span className="text-emerald-500 font-bold">✓</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.stack.map((tech) => (
                          <span
                            key={`${project.id}-${tech}`}
                            className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-3.5 dark:border-slate-800">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400">
                        {viewportLabelMap[project.demoViewport]}
                      </span>
                      <a
                        href="#sandbox"
                        className="rounded-lg border border-cyan-400/60 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-500/20 dark:text-cyan-200"
                      >
                        Test in Sandbox &darr;
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Interactive Recruiter Demo Sandbox Section */}
          <section id="sandbox" className="py-14 border-t border-slate-200 dark:border-slate-800">
            <ProjectDemoView />
          </section>

          {/* Engineering Labs Section */}
          <section id="labs" className="py-14 border-t border-slate-200 dark:border-slate-800">
            <LabsSection />
          </section>

          {/* Verified Credentials & Education Section */}
          <section id="credentials" className="py-14 border-t border-slate-200 dark:border-slate-800">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">Verified Credentials</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Education &amp; Professional Certifications</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Authentic academic qualifications and industry-recognized certifications verified for global engineering opportunities.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Dynamic Education Cards */}
              {education.map((edu) => (
                <div key={edu.id} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
                        Degree
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {edu.currentEducation ? 'In Progress' : edu.endedOn ? `Graduated ${new Date(edu.endedOn).getFullYear()}` : 'Completed'}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                      {edu.degree}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                      {edu.institution} {edu.fieldOfStudy ? `• ${edu.fieldOfStudy}` : ''}
                    </p>
                    {edu.description && (
                      <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        {edu.description}
                      </p>
                    )}
                  </div>
                  {edu.credentialUrl && (
                    <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                      <a
                        href={edu.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
                      >
                        <span>✓</span> Verified Credential &rarr;
                      </a>
                    </div>
                  )}
                </div>
              ))}

              {/* Dynamic Certification Cards */}
              {certifications.map((cert) => (
                <div key={cert.id} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                        Certification
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {new Date(cert.issueDate).getFullYear()} Verified
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                      {cert.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {cert.issuingOrganization}
                    </p>
                    {cert.credentialId && (
                      <p className="mt-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        Credential ID: {cert.credentialId}
                      </p>
                    )}
                  </div>
                  {cert.credentialUrl && (
                    <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
                      >
                        <span>✓</span> Digital Credential Issued &rarr;
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Resume Engine Section */}
          <section id="resume" className="py-14 border-t border-slate-200 dark:border-slate-800">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">Curriculum Vitae</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Interactive Résumé &amp; Career Track Switcher</h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/resume')}
                className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 transition cursor-pointer w-fit"
              >
                Open Full Dedicated Résumé Page (/resume) &rarr;
              </button>
            </div>
            <ResumeModule />
          </section>

          {/* Engineering Principles Section */}
          <section id="principles" className="border-t border-slate-200 py-14 dark:border-slate-800">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">How I Build Systems</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Engineering principles &amp; execution</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {engineeringPrinciples.map((item) => (
                <div key={item.step} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/70">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">{item.step}</p>
                  <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Interactive Recruiter Contact & Inquiries Section */}
          <footer id="contact" className="border-t border-slate-200 py-14 dark:border-slate-800">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">Let’s Connect</p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                  Available for Software Developer, Systems, IT &amp; Cybersecurity roles.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Have an open role, an engineering challenge, or an opportunity to discuss? Reach out directly or dispatch a message below.
                </p>

                {/* Email Pill with 1-Click Copy */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${settings.contactEmail || 'abeeboladipupo@example.com'}`}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                  >
                    <span>✉️</span>
                    <span>{settings.contactEmail || 'abeeboladipupo@example.com'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="rounded-full border border-slate-300 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    {copiedEmail ? '✓ Copied to Clipboard!' : '📋 Copy Email'}
                  </button>
                </div>

                {/* Social Profiles & Location */}
                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <a href={settings.linkedinUrl || 'https://linkedin.com/in/abeeboladipupo'} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500">
                    LinkedIn &rarr;
                  </a>
                  <a href={settings.githubUrl || 'https://github.com/abeeboladipupo'} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500">
                    GitHub &rarr;
                  </a>
                  <span>•</span>
                  <span>{settings.location || 'Accra / Open to Relocation & Remote'}</span>
                  <span>•</span>
                  <span>{settings.openToWork ? '🟢 Available for Roles' : 'Occupied'}</span>
                </div>
              </div>

              {/* Direct Recruiter Message Form */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/90">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Send a Direct Message</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Direct transmission to Abeeb's portfolio inbox.</p>

                {contactSent ? (
                  <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
                    <p className="text-sm font-bold text-emerald-400">✓ Message Dispatched Successfully!</p>
                    <p className="mt-1 text-xs text-slate-300">Thank you for reaching out. Abeeb will respond promptly.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setContactSent(false)
                        setContactMessage('')
                        setContactSubject('')
                      }}
                      className="mt-4 text-xs text-cyan-400 underline cursor-pointer"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="mt-4 space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Your Name</label>
                      <input
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Jane Doe (Hiring Manager / Recruiter)"
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="jane@company.com"
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Subject / Topic</label>
                      <input
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        placeholder="Software Developer Opportunity / Systems Role"
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Message / Opportunity Details</label>
                      <textarea
                        required
                        rows={3}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Hi Abeeb, we're interested in discussing an opportunity for a Software Developer / Systems role..."
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    {contactError && (
                      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-400">
                        ⚠️ {contactError}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={contactSubmitting}
                      className="w-full rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-400 shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                    >
                      {contactSubmitting ? 'Transmitting to Server...' : 'Dispatch Message →'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="mt-12 border-t border-slate-200 pt-6 text-center text-xs text-slate-400 dark:border-slate-800">
              © {CURRENT_YEAR} {settings.fullName || 'Abeeb Oladipupo'} • {settings.professionalTitle || 'Software Developer | Systems & Cybersecurity'}
            </div>
          </footer>

        </div>
      </div>
    </main>
  )
}
