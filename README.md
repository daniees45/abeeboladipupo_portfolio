# Abeoladipupo Portfolio Platform

A full-stack portfolio application built with React + TypeScript + Vite on the frontend and Spring Boot on the backend. The project is designed as a production-friendly personal portfolio and engineering showcase with admin tooling, project management, resume exports, and responsive presentation.

## Project overview

This application demonstrates a modern portfolio architecture with:

- a responsive landing page for personal branding and engineering profile
- modular sections for admin overview, projects, resume, and photo/media management
- a Spring Boot API layer for metrics and portfolio content
- a local-first / zero-cost stack suitable for personal deployment without paid dependencies
- PostgreSQL-ready schema definitions for future production persistence
- optional Cloudinary integration for upload workflows
- a light/dark theme toggle with responsive layout behavior

## Tech stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Static portfolio shell and module-based UI composition

### Backend
- Java 21
- Spring Boot 3.4.1
- Spring Data JPA
- Spring Data Redis
- PostgreSQL-ready database schema
- H2 in-memory fallback for local development/testing

### Hosting and deployment intent
This project is designed to remain low-cost and flexible. Suggested local and production-friendly deployment patterns include:

- Frontend: Vercel
- Backend: Render or Railway
- Database: Neon or managed PostgreSQL
- Cache: Upstash Redis or local Redis
- Storage: Cloudinary for image uploads

## Repository structure

```text
abeeboladipupo_portfolio/
├── docs/
│   ├── STRATEGIC_RECOMMENDATIONS.md
│   ├── RESUME_TEMPLATES.md
│   └── ADMIN_PORTAL.md
├── backend/
│   └── abeeboladipupo_portfolio/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/
│       │   │   │   └── com/abeeboladipupo_portfolio/abeeboladipupo_portfolio/
│       │   │   │       ├── api/
│       │   │   │       ├── config/
│       │   │   │       │   └── WebConfig.java (CORS)
│       │   │   │       ├── domain/
│       │   │   │       └── AbeeboladipupoPortfolioApplication.java
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   └── test/
│       ├── sql/
│       │   └── portfolio_schema.sql
│       ├── pom.xml
│       ├── mvnw
│       └── mvnw.cmd
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── admin/
│   │   │   │   └── AdminPortalPage.tsx (Secret Admin Route & Lock Gate)
│   │   │   └── portfolio/
│   │   │       ├── components/
│   │   │       │   ├── PortfolioShell.tsx (Public Showcase)
│   │   │       │   ├── ResumeModule.tsx (Template-Driven)
│   │   │       │   └── ProjectDemoView.tsx (Interactive Sandbox)
│   │   │       ├── pages/
│   │   │       │   ├── DedicatedResumePage.tsx (/resume)
│   │   │       │   └── DedicatedProjectsPage.tsx (/projects)
│   │   │       ├── data/
│   │   │       │   ├── projects.ts
│   │   │       │   └── resumeTemplates.ts
│   │   │       └── utils/
│   │   │           └── resumeExport.ts
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── router.ts (Path & Hash Client Router)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
├── README.md
└── .gitignore
```

## Frontend architecture

The frontend uses a modular structure to keep the portfolio presentation manageable and extensible.

### Key frontend modules
- `PortfolioShell` – main landing page, layout, hero section, theme toggle, and portfolio composition
- `AdminManagementPanel` – admin operations overview and management cards
- `ResumeModule` – professional profile and printable résumé export experience
- `ProjectManagementPanel` – project creation workflow and preview cards
- `PhotoUploadPanel` – local preview and Cloudinary-ready upload workflow
- `ProjectDemoView` – secure demo viewing interface for project previews

### Frontend behavior
- responsive navigation and content stacking for mobile devices
- light and dark theme support via Tailwind `dark` variants and a saved browser theme preference
- project data sourced from backend APIs or local mocked fallback state
- print/export helpers for résumé generation without third-party paid dependencies

## Backend architecture

The backend is organized around a simple Spring Boot API with both DTO-driven endpoints and JPA domain entities. This keeps the project practical and easy to grow without overengineering.

### Backend API layout
- `/api/v1/projects` – project listing and creation
- `/api/v1/metrics` – portfolio metrics and cache status
- `/api/v1/admin/overview` – admin summary information
- `/api/v1/resume` – resume content
- `/api/v1/media/upload` – media upload response placeholder for Cloudinary-ready flows

### Backend domain model
The project includes a set of persistent domain objects for future portfolio administration:

- `Project`
- `ProjectRepository`
- `ProjectService`
- `AdminUser`
- `ResumeEntry`
- `PortfolioMedia`

These are designed to be expanded into full CRUD and authorization flows as the project matures.

## Database schema

The SQL file at `backend/abeeboladipupo_portfolio/sql/portfolio_schema.sql` provides a PostgreSQL-ready base schema with tables for:

- `admin_users`
- `portfolio_projects`
- `resume_entries`
- `uploaded_media`
- `portfolio_metrics`

This schema supports the requirements for:

- admin access control metadata
- project publishing and public visibility
- resume content storage
- media records for uploaded image files
- metrics storage and status tracking

## Local development setup

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite app runs locally and connects with the backend by default through its environment configuration.

### 2. Backend

```bash
cd backend/abeeboladipupo_portfolio
./mvnw spring-boot:run
```

The backend defaults to an H2 in-memory database for local development and testing, while remaining compatible with PostgreSQL configuration in deployment.

## Environment configuration

The backend uses environment-driven configuration in `application.properties` and supports defaults for:

- H2 development database
- Redis host and port
- JPA settings

Example variables include:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `REDIS_HOST`
- `REDIS_PORT`

The frontend uses Vite environment values such as the API base URL and Cloudinary placeholders where required.

## Features implemented

### Portfolio and landing experience
- strong personal brand shell
- responsive landing page with project showcase
- platform metrics panel with cache and view tracking
- light/dark theme switch

### Interactive resume template engine
The resume module is powered by dynamic role templates with live document preview and template-specific downloads:
- **Cloud Solutions Architect** – highlights cloud infrastructure, Spring Boot microservices, Redis caching, and 99.99% availability.
- **Full-Stack Product Engineer** – highlights React 19, TypeScript, Tailwind CSS, API integration, and product delivery speed.
- **ATS Executive Technical Lead** – high-density, ATS-optimized layout for automated screeners and engineering leadership reviews.

#### Template-driven download mechanics
When a user selects a template, downloads dynamically format according to that preset:
- **Word Document (.doc)** – exports an Office-formatted HTML/MSO document with custom margins, typography, accent colors, and tables for native rendering in Microsoft Word, Google Docs, and Pages.
- **Print / Save as PDF** – triggers print stylesheets (`@media print`) that strip website chrome and format clean, high-contrast pages while synchronizing the PDF filename.
- **Markdown (.md)** – generates an ATS-friendly plaintext Markdown resume.
- *Detailed technical guide:* [`docs/RESUME_TEMPLATES.md`](file:///Users/obafemiawolowo/Desktop/abeeboladipupo_portfolio/docs/RESUME_TEMPLATES.md)

### Interactive recruiter demo sandbox
Rather than static screenshots or empty frames, the demo sandbox includes interactive simulators:
- **Project Demo View** – test responsive viewports with a live cross-frame `postMessage` handshake simulator.
- **API Observability** – live telemetry dashboard with simulated request stream, RPS counters, and Redis cache hit monitoring.
- **Cloud Automation** – interactive CI/CD pipeline simulator with animated step progression and live console log stream.

## Strategic engineering recommendations & roadmap

A comprehensive architectural roadmap has been developed to scale the platform into a production-grade enterprise system without incurring recurring SaaS costs:

1. **Security & Governance** – implement Spring Security 6 stateless JWT with asymmetric RS256 token verification, role-based access control, and HMAC-SHA256 signed Cloudinary upload tokens.
2. **Database Migrations** – introduce Flyway versioned migrations (`V1__initial_schema.sql`) replacing Hibernate `ddl-auto=update` to prevent schema drift across Neon/Supabase PostgreSQL.
3. **Caching & Telemetry** – upgrade Redis caching with Jackson JSON serialization, `@CacheEvict` lifecycles, and Spring Boot Actuator/Prometheus metrics.
4. **Cloud Topology** – deploy frontend on Vercel Edge CDN, Spring Boot on Render/Railway, managed PostgreSQL on Neon, and serverless cache on Upstash Redis.
5. **CI/CD Quality Gates** – implement GitHub Actions automating `oxlint`, `tsc -b`, `vite build`, and containerized Maven/JUnit test suites.

*Full architectural roadmap:* [`docs/STRATEGIC_RECOMMENDATIONS.md`](file:///Users/obafemiawolowo/Desktop/abeeboladipupo_portfolio/docs/STRATEGIC_RECOMMENDATIONS.md)

## Documentation index

- [`docs/STRATEGIC_RECOMMENDATIONS.md`](file:///Users/obafemiawolowo/Desktop/abeeboladipupo_portfolio/docs/STRATEGIC_RECOMMENDATIONS.md) – comprehensive technical architecture roadmap, security threat modeling, and deployment strategies.
- [`docs/RESUME_TEMPLATES.md`](file:///Users/obafemiawolowo/Desktop/abeeboladipupo_portfolio/docs/RESUME_TEMPLATES.md) – resume template engine specifications, data schemas, export formats, and developer extension guides.
- [`docs/ADMIN_PORTAL.md`](file:///Users/obafemiawolowo/Desktop/abeeboladipupo_portfolio/docs/ADMIN_PORTAL.md) – private admin console guide, secret URL routing, security key configuration, and operational workflow.
- [`backend/abeeboladipupo_portfolio/sql/portfolio_schema.sql`](file:///Users/obafemiawolowo/Desktop/abeeboladipupo_portfolio/backend/abeeboladipupo_portfolio/sql/portfolio_schema.sql) – PostgreSQL database schema definitions.

## Current status

The project is fully functional, lint-clean, and builds cleanly with:
- responsive frontend with React 19 + TypeScript + Vite + Tailwind CSS 4
- template-driven resume download engine with Word DOC, Markdown, and Print/PDF support
- interactive recruiter demo suite for API telemetry, CI/CD pipelines, and device sandboxing
- hardened Spring Boot 3.4.1 backend with global CORS configuration and resilient Redis error handling
- offline-first fallback guarantees ensuring the portfolio displays smoothly regardless of backend availability

## License

This project is intended for personal portfolio and engineering showcase use. Update license terms as needed for production or commercial distribution.
