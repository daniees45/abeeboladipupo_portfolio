-- services/portfolio-api/src/main/resources/db/migration/V1__init.sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE app_user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), subject VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(320) NOT NULL UNIQUE, display_name VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE role (id SMALLINT PRIMARY KEY, code VARCHAR(20) NOT NULL UNIQUE);
INSERT INTO role (id, code) VALUES (1, 'ADMIN'), (2, 'EDITOR'), (3, 'VISITOR');
CREATE TABLE user_role (user_id UUID NOT NULL REFERENCES app_user(id), role_id SMALLINT NOT NULL REFERENCES role(id), PRIMARY KEY (user_id, role_id));

CREATE TABLE project (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug VARCHAR(120) NOT NULL, title VARCHAR(160) NOT NULL,
  summary VARCHAR(500) NOT NULL, content_markdown TEXT NOT NULL, repository_url VARCHAR(2048), live_url VARCHAR(2048), demo_url VARCHAR(2048),
  published BOOLEAN NOT NULL DEFAULT false, featured BOOLEAN NOT NULL DEFAULT false, display_order INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), created_by UUID REFERENCES app_user(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_by UUID REFERENCES app_user(id), deleted_at TIMESTAMPTZ,
  CONSTRAINT project_display_order_nonnegative CHECK (display_order >= 0)
);
CREATE UNIQUE INDEX uq_project_slug_active ON project (slug) WHERE deleted_at IS NULL;
CREATE INDEX ix_project_public ON project (featured DESC, display_order, updated_at DESC) WHERE published AND deleted_at IS NULL;

CREATE TABLE skill (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(80) NOT NULL, category VARCHAR(80) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), deleted_at TIMESTAMPTZ,
  CONSTRAINT skill_display_order_nonnegative CHECK (display_order >= 0));
CREATE UNIQUE INDEX uq_skill_name_active ON skill (name) WHERE deleted_at IS NULL;
CREATE TABLE project_skill (project_id UUID NOT NULL REFERENCES project(id), skill_id UUID NOT NULL REFERENCES skill(id), PRIMARY KEY (project_id, skill_id));
CREATE TABLE project_image (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), project_id UUID NOT NULL REFERENCES project(id), url VARCHAR(2048) NOT NULL, alt_text VARCHAR(200) NOT NULL, display_order INTEGER NOT NULL DEFAULT 0, UNIQUE(project_id, display_order));

CREATE TABLE experience (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), company VARCHAR(160) NOT NULL, role VARCHAR(160) NOT NULL, location VARCHAR(160), description_markdown TEXT NOT NULL,
  started_on DATE NOT NULL, ended_on DATE, current_role BOOLEAN NOT NULL DEFAULT false, display_order INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), created_by UUID REFERENCES app_user(id), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_by UUID REFERENCES app_user(id), deleted_at TIMESTAMPTZ,
  CONSTRAINT experience_dates CHECK ((current_role AND ended_on IS NULL) OR (NOT current_role AND ended_on IS NOT NULL AND ended_on >= started_on)));
CREATE INDEX ix_experience_public ON experience (display_order, started_on DESC) WHERE deleted_at IS NULL;

CREATE TABLE blog_post (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug VARCHAR(120) NOT NULL, title VARCHAR(160) NOT NULL, excerpt VARCHAR(500) NOT NULL, body_markdown TEXT NOT NULL,
  cover_image_url VARCHAR(2048), published BOOLEAN NOT NULL DEFAULT false, published_at TIMESTAMPTZ, author_id UUID REFERENCES app_user(id), version INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), deleted_at TIMESTAMPTZ,
  CONSTRAINT blog_post_published_at CHECK ((published AND published_at IS NOT NULL) OR NOT published));
CREATE UNIQUE INDEX uq_blog_post_slug_active ON blog_post (slug) WHERE deleted_at IS NULL;
CREATE INDEX ix_blog_post_public ON blog_post (published_at DESC) WHERE published AND deleted_at IS NULL;

CREATE TABLE product (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug VARCHAR(120) NOT NULL, title VARCHAR(160) NOT NULL,
  summary VARCHAR(500) NOT NULL, description_markdown TEXT NOT NULL, image_url VARCHAR(2048), availability_status VARCHAR(20) NOT NULL DEFAULT 'COMING_SOON',
  active BOOLEAN NOT NULL DEFAULT false, display_order INTEGER NOT NULL DEFAULT 0, version INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), created_by UUID REFERENCES app_user(id), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_by UUID REFERENCES app_user(id), deleted_at TIMESTAMPTZ,
  CONSTRAINT product_availability_status CHECK (availability_status IN ('COMING_SOON', 'INQUIRY_ONLY')), CONSTRAINT product_display_order_nonnegative CHECK (display_order >= 0));
CREATE UNIQUE INDEX uq_product_slug_active ON product (slug) WHERE deleted_at IS NULL;
CREATE INDEX ix_product_public ON product (display_order, updated_at DESC) WHERE active AND deleted_at IS NULL;

CREATE TABLE contact_message (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), sender_name VARCHAR(120) NOT NULL, sender_email VARCHAR(320) NOT NULL, subject VARCHAR(200) NOT NULL, body TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'NEW', resolved_at TIMESTAMPTZ, resolved_by UUID REFERENCES app_user(id), created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT contact_message_status CHECK (status IN ('NEW', 'IN_PROGRESS', 'RESOLVED', 'SPAM')));
CREATE INDEX ix_contact_message_inbox ON contact_message (status, created_at DESC);
CREATE TABLE audit_log (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, actor_id UUID REFERENCES app_user(id), action VARCHAR(80) NOT NULL, entity_type VARCHAR(80) NOT NULL, entity_id UUID, before_state JSONB, after_state JSONB, request_id VARCHAR(100) NOT NULL, occurred_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX ix_audit_log_entity ON audit_log (entity_type, entity_id, occurred_at DESC);
CREATE INDEX ix_audit_log_actor ON audit_log (actor_id, occurred_at DESC);
