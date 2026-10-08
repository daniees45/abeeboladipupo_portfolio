-- Portfolio schema for PostgreSQL.
-- This file provides the minimum tables needed for a portfolio application with:
-- - admin authentication metadata
-- - project content management
-- - resume/cv content
-- - uploaded media records
-- - project demos and public publishing workflow

CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    github_url TEXT,
    demo_url TEXT,
    stack TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    demo_viewport VARCHAR(50) NOT NULL DEFAULT 'desktop',
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    cover_image_url TEXT,
    project_year INTEGER NOT NULL DEFAULT 2026,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resume_entries (
    id SERIAL PRIMARY KEY,
    section_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    company_or_org VARCHAR(255),
    period VARCHAR(100),
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uploaded_media (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    source VARCHAR(100) NOT NULL DEFAULT 'local',
    cloudinary_public_id VARCHAR(255),
    cloudinary_secure_url TEXT,
    storage_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_metrics (
    id SERIAL PRIMARY KEY,
    total_projects INTEGER NOT NULL DEFAULT 0,
    total_views BIGINT NOT NULL DEFAULT 0,
    cache_status VARCHAR(50) NOT NULL DEFAULT 'MISS',
    cache_key VARCHAR(255) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    school VARCHAR(255),
    degree VARCHAR(255),
    course VARCHAR(255),
    citizenship VARCHAR(255),
    graduation VARCHAR(100),
    race VARCHAR(100),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Seed data for a working local demo.
INSERT INTO admin_users (email, full_name, password_hash, role, is_active)
VALUES ('admin@example.com', 'Portfolio Administrator', '$2a$10$examplehashplaceholder', 'admin', TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO portfolio_projects (title, slug, summary, github_url, demo_url, stack, status, demo_viewport, is_public, cover_image_url)
VALUES (
    'Portfolio Platform',
    'portfolio-platform',
    'A secure portfolio experience with live project previews and production-grade architecture.',
    'https://github.com/example/portfolio-platform',
    '/demos/portfolio-platform',
    'React, TypeScript, Java, PostgreSQL',
    'published',
    'desktop',
    TRUE,
    NULL
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO resume_entries (section_name, title, company_or_org, period, description, sort_order)
VALUES
    ('Experience', 'Senior Software Engineer', 'Independent Product Engineering', '2022 - Present', 'Design and deliver resilient product systems', 1),
    ('Experience', 'Cloud Architect', 'Portfolio Platform', '2020 - 2022', 'Built containerized deployment patterns and reliability scoring systems', 2),
    ('Education', 'B.Sc. Computer Science', 'University of Technology', '2015 - 2019', 'Focused on software systems, networks, and product design', 3);
