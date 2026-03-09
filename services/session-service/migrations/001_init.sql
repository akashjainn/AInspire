CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS orgs (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  plan_tier TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES orgs(id),
  email TEXT,
  role TEXT NOT NULL DEFAULT 'editor',
  consent_flags JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id UUID,
  artifact_type TEXT NOT NULL,
  vibe_chips JSONB NOT NULL DEFAULT '[]'::jsonb,
  constraints JSONB NOT NULL DEFAULT '{}'::jsonb,
  session_vector JSONB NOT NULL DEFAULT '[]'::jsonb,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  source_type TEXT NOT NULL,
  storage_url TEXT NOT NULL,
  embedding_id TEXT,
  artifact_type TEXT NOT NULL DEFAULT 'any',
  metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  license_type TEXT,
  provenance TEXT,
  moderation_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS image_attributes (
  id UUID PRIMARY KEY,
  image_id UUID REFERENCES images(id) ON DELETE CASCADE,
  palette TEXT,
  composition_type TEXT,
  linework TEXT,
  texture TEXT,
  realism_score DOUBLE PRECISION,
  density_score DOUBLE PRECISION,
  typography_present BOOLEAN,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS interactions (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  image_id UUID REFERENCES images(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  value DOUBLE PRECISION,
  attribute_feedback JSONB NOT NULL DEFAULT '[]'::jsonb,
  comparison_image_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS boards (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id UUID,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS board_items (
  id UUID PRIMARY KEY,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  image_id UUID REFERENCES images(id) ON DELETE CASCADE,
  saved_reason TEXT,
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS generation_jobs (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  model_provider TEXT,
  prompt_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  seed INT,
  status TEXT NOT NULL,
  cost_usd DOUBLE PRECISION NOT NULL DEFAULT 0,
  moderation_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS moderation_decisions (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  subject_type TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  decision TEXT NOT NULL,
  reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  model_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS provider_usage_costs (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  operation_name TEXT NOT NULL,
  units DOUBLE PRECISION NOT NULL DEFAULT 0,
  cost_usd DOUBLE PRECISION NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_log (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  session_id UUID,
  event_name TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
