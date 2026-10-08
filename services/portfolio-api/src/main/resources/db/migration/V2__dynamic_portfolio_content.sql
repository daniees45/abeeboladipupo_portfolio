-- services/portfolio-api/src/main/resources/db/migration/V2__dynamic_portfolio_content.sql

-- 1. Site Settings table (singleton configuration managed by admin)
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(160) NOT NULL,
  professional_title VARCHAR(200) NOT NULL,
  headline VARCHAR(300) NOT NULL,
  bio TEXT NOT NULL,
  contact_email VARCHAR(320) NOT NULL,
  phone VARCHAR(50),
  location VARCHAR(160) NOT NULL,
  profile_image_url VARCHAR(2048),
  github_url VARCHAR(2048),
  linkedin_url VARCHAR(2048),
  website_url VARCHAR(2048),
  seo_title VARCHAR(200),
  seo_description VARCHAR(500),
  availability_badge VARCHAR(120),
  open_to_work BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES app_user(id)
);

-- 2. Education table
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution VARCHAR(160) NOT NULL,
  degree VARCHAR(160) NOT NULL,
  field_of_study VARCHAR(160),
  started_on DATE NOT NULL,
  ended_on DATE,
  current_education BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  credential_url VARCHAR(2048),
  display_order INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT education_display_order_nonnegative CHECK (display_order >= 0)
);
CREATE INDEX ix_education_public ON education (display_order, started_on DESC) WHERE deleted_at IS NULL;

-- 3. Certification table
CREATE TABLE certification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(160) NOT NULL,
  issuing_organization VARCHAR(160) NOT NULL,
  issue_date DATE NOT NULL,
  expiration_date DATE,
  credential_id VARCHAR(160),
  credential_url VARCHAR(2048),
  display_order INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT certification_display_order_nonnegative CHECK (display_order >= 0)
);
CREATE INDEX ix_certification_public ON certification (display_order, issue_date DESC) WHERE deleted_at IS NULL;

-- 4. Resume Document table
CREATE TABLE resume_document (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name VARCHAR(255) NOT NULL,
  content_type VARCHAR(100) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  file_data BYTEA NOT NULL,
  version_tag VARCHAR(50) NOT NULL,
  target_track VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
  is_published BOOLEAN NOT NULL DEFAULT false,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX ix_resume_published ON resume_document (is_published, uploaded_at DESC) WHERE deleted_at IS NULL;

-- 5. Alter project table to support rich engineering case studies
ALTER TABLE project
  ADD COLUMN IF NOT EXISTS problem TEXT,
  ADD COLUMN IF NOT EXISTS solution TEXT,
  ADD COLUMN IF NOT EXISTS architecture_flow VARCHAR(500),
  ADD COLUMN IF NOT EXISTS key_features TEXT,
  ADD COLUMN IF NOT EXISTS technologies VARCHAR(500);

-- 6. Pre-seed default Site Settings
INSERT INTO site_settings (
  id, full_name, professional_title, headline, bio, contact_email, location,
  github_url, linkedin_url, website_url, seo_title, seo_description,
  availability_badge, open_to_work, updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Abeeb Oladipupo',
  'Software Developer | Systems & Cybersecurity',
  'I build secure, scalable software and practical technology solutions.',
  'Computer Science graduate focused on software development, backend systems, databases, Linux, cloud infrastructure, and cybersecurity. Passionate about engineering systems that solve real organizational problems.',
  'abeeboladipupo@example.com',
  'Accra / Open to Relocation & Remote',
  'https://github.com/abeeboladipupo',
  'https://linkedin.com/in/abeeboladipupo',
  'https://www.abeeboladipupo.com',
  'Abeeb Oladipupo | Software Developer & Cybersecurity',
  'Computer Science graduate focused on software development, backend systems, databases, Linux, cloud infrastructure, and cybersecurity.',
  '🎓 Computer Science Graduate • Available for Full-Time Roles',
  true,
  now()
) ON CONFLICT DO NOTHING;

-- 7. Pre-seed Education
INSERT INTO education (
  institution, degree, field_of_study, started_on, ended_on, current_education, description, credential_url, display_order
) VALUES (
  'Valley View University',
  'Bachelor of Science in Computer Science',
  'Computer Science & Software Engineering',
  '2020-09-01',
  '2024-07-31',
  false,
  'Comprehensive 4-year curriculum spanning software engineering, database management systems, data structures & algorithms, operating systems, and computer networks. Evaluated by World Education Services (WES).',
  'https://www.wes.org',
  1
) ON CONFLICT DO NOTHING;

-- 8. Pre-seed Certifications
INSERT INTO certification (
  name, issuing_organization, issue_date, credential_id, credential_url, display_order
) VALUES (
  'Introduction to Cybersecurity',
  'Cisco Networking Academy',
  '2024-05-15',
  'CISCO-CYBER-2024',
  'https://www.credly.com',
  1
), (
  'Academic Credential Evaluation (Bachelor''s Equivalence)',
  'World Education Services (WES)',
  '2024-08-10',
  'WES-REF-VERIFIED',
  'https://www.wes.org',
  2
) ON CONFLICT DO NOTHING;

-- 9. Pre-seed Centerpiece Projects
INSERT INTO project (
  slug, title, summary, content_markdown, repository_url, live_url, demo_url,
  published, featured, display_order, problem, solution, architecture_flow,
  key_features, technologies
) VALUES (
  'fyp-supervision-system',
  'Final Year Project (FYP) Supervision System',
  'Multi-tenant academic research lifecycle platform featuring role-based workflows for Students, Supervisors, and HODs.',
  '## Final Year Project (FYP) Supervision System\n\nFull-lifecycle academic research management system designed to eliminate coordination bottlenecks.',
  'https://github.com/daniees45/fyp-supervision-system',
  'https://www.abeeboladipupo.com/projects',
  '/demos/fyp-supervision-system',
  true, true, 1,
  'University departments struggle with untracked student proposal submissions, duplicate thesis topics, and scattered supervisor feedback.',
  'Engineered a centralized multi-role platform with role-based access control (RBAC), topic proposal review workflows, milestone document versioning, and supervisor feedback tracking.',
  'React Client → Flask / Python REST API → Role Guard Middleware → MySQL / PostgreSQL',
  'Role-gated access (Student, Supervisor, HOD); Thesis topic proposal approval workflows; Document version control & supervisor feedback; Topic similarity & clash checks',
  'Python, Flask, React, MySQL, PostgreSQL, JWT, RBAC, REST API'
), (
  'ai-timetabling-system',
  'AI-Powered Timetabling System (CSP Engine)',
  'Automated academic scheduling system applying Constraint Satisfaction Problem (CSP) heuristics and room-capacity validation.',
  '## AI-Powered Timetabling System\n\nConstraint-driven scheduling engine resolving course collisions, lecturer slots, and room constraints.',
  'https://github.com/daniees45/ai-timetabling-system',
  'https://www.abeeboladipupo.com/projects',
  '/demos/ai-timetabling-system',
  true, true, 2,
  'Universities spend weeks manually generating conflict-free timetables across fluctuating room capacities, lecturer time slots, and cross-enrolled student cohorts.',
  'Formulated a constraint satisfaction engine with backtracking heuristics, variable ordering, and capacity verification to generate clash-free schedules in under 100 milliseconds.',
  'React UI → Flask API → Python CSP Solver Engine → Constraint Validator → MySQL',
  'Automated lecture slot optimization; Zero-clash lecturer availability enforcement; Room capacity & equipment constraints; CSV bulk data import/export',
  'Python, Constraint Optimization, Flask, MySQL, Algorithms, REST API'
), (
  'portfolio-platform',
  'Full-Stack Engineering & Security Platform',
  'Production portfolio platform demonstrating Clean Architecture, Spring Boot 3 REST API, PostgreSQL, Redis cache-aside, and live systems telemetry.',
  '## Full-Stack Portfolio Platform\n\nPersonal engineering platform with Clean Architecture, rate limiting, and observability.',
  'https://github.com/abeeboladipupo/portfolio-platform',
  'https://www.abeeboladipupo.com',
  '/demos/portfolio-platform',
  true, true, 3,
  'Static portfolio sites fail to demonstrate real backend engineering, caching architectures, database design, or defensive security practices.',
  'Constructed a production-ready system utilizing Spring Boot 3, PostgreSQL with Flyway migrations, Redis cache-aside invalidation, OIDC/JWT authorization, and live browser simulation sandboxes.',
  'React SPA → Vite Proxy / ALB → Spring Boot 3 API → Redis Cache → PostgreSQL',
  'Clean Architecture DDD service with Flyway migrations; Redis cache-aside with sub-millisecond response caching; Bucket4j rate limiting on sensitive write endpoints; Interactive recruiter simulation sandboxes',
  'Java 21, Spring Boot 3, PostgreSQL, Redis, Docker, TypeScript, React 19, Tailwind CSS'
) ON CONFLICT (slug) DO NOTHING;

-- 10. Pre-seed Skills
INSERT INTO skill (name, category, display_order) VALUES
  ('Java 21', 'Languages', 1),
  ('Python 3', 'Languages', 2),
  ('TypeScript', 'Languages', 3),
  ('SQL', 'Languages', 4),
  ('Bash / Shell', 'Languages', 5),
  ('Spring Boot 3', 'Backend & Frameworks', 1),
  ('Flask', 'Backend & Frameworks', 2),
  ('Spring Data JPA / Hibernate', 'Backend & Frameworks', 3),
  ('RESTful API Design', 'Backend & Frameworks', 4),
  ('PostgreSQL', 'Databases & Storage', 1),
  ('MySQL', 'Databases & Storage', 2),
  ('Redis (Cache-Aside)', 'Databases & Storage', 3),
  ('Schema Normalization (3NF)', 'Databases & Storage', 4),
  ('Linux (Ubuntu/Debian)', 'Systems & Security', 1),
  ('Docker', 'Systems & Security', 2),
  ('Role-Based Access Control (RBAC)', 'Systems & Security', 3),
  ('JWT & OAuth2', 'Systems & Security', 4),
  ('OWASP Defensive Coding', 'Systems & Security', 5),
  ('React 19', 'Frontend & Tools', 1),
  ('Tailwind CSS', 'Frontend & Tools', 2),
  ('Git / GitHub', 'Frontend & Tools', 3),
  ('Vite', 'Frontend & Tools', 4)
ON CONFLICT DO NOTHING;

-- 11. Pre-seed initial default Resume version (PDF metadata placeholder)
INSERT INTO resume_document (
  id, file_name, content_type, file_size_bytes, file_data, version_tag, target_track, is_published, uploaded_at
) VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'Abeeb_Oladipupo_Resume.pdf',
  'application/pdf',
  24500,
  E'\\x255044462d312e340a25d0d4c5d80a312030206f626a0a3c3c2f547970652f436174616c6f672f50616765732032203020523e3e0a656e646f626a0a', -- minimal valid PDF header
  'v1.0-published',
  'GENERAL',
  true,
  now()
) ON CONFLICT DO NOTHING;
