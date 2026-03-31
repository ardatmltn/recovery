-- Recoverly: Initial Database Schema
-- Multi-tenant Payment Recovery SaaS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ORGANIZATIONS (Multi-tenant root)
-- ============================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  stripe_api_key_encrypted TEXT,
  stripe_webhook_secret_encrypted TEXT,
  stripe_connected BOOLEAN DEFAULT FALSE,
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'growth', 'pro')),
  plan_status TEXT NOT NULL DEFAULT 'trialing' CHECK (plan_status IN ('trialing', 'active', 'past_due', 'canceled')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  n8n_webhook_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- USERS (Supabase Auth linked)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- CUSTOMERS (Payment provider customers)
-- ============================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  email TEXT,
  name TEXT,
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  total_failed_payments INTEGER DEFAULT 0,
  total_recovered_amount BIGINT DEFAULT 0,
  last_payment_failed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_id, stripe_customer_id)
);

-- ============================================
-- PAYMENT EVENTS (Raw webhook events)
-- ============================================
CREATE TABLE payment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  stripe_event_id TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  event_type TEXT NOT NULL,
  amount BIGINT NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'usd',
  failure_code TEXT,
  failure_message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'processing', 'recovered', 'failed', 'ignored')),
  raw_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_id, stripe_event_id)
);

-- ============================================
-- RECOVERY SEQUENCES (Step configuration)
-- ============================================
CREATE TABLE recovery_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  steps JSONB NOT NULL DEFAULT '[]',
  -- steps format: [{ "step": 1, "type": "retry|email|sms", "delay_hours": 4, "template_id": "..." }]
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- MESSAGE TEMPLATES (Email/SMS templates)
-- ============================================
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms')),
  subject TEXT,
  body TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  ai_enhanced BOOLEAN DEFAULT FALSE,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- RECOVERY ATTEMPTS (Individual attempts)
-- ============================================
CREATE TABLE recovery_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  payment_event_id UUID NOT NULL REFERENCES payment_events(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  sequence_id UUID REFERENCES recovery_sequences(id) ON DELETE SET NULL,
  template_id UUID REFERENCES message_templates(id) ON DELETE SET NULL,
  step_number INTEGER NOT NULL DEFAULT 1,
  type TEXT NOT NULL CHECK (type IN ('auto_retry', 'email', 'sms')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'in_progress', 'sent', 'succeeded', 'failed', 'skipped')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  executed_at TIMESTAMPTZ,
  result JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- DAILY ANALYTICS (Snapshot)
-- ============================================
CREATE TABLE daily_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_failed_amount BIGINT DEFAULT 0,
  total_recovered_amount BIGINT DEFAULT 0,
  total_failed_count INTEGER DEFAULT 0,
  total_recovered_count INTEGER DEFAULT 0,
  recovery_rate NUMERIC(5,2) DEFAULT 0,
  retry_success_count INTEGER DEFAULT 0,
  email_success_count INTEGER DEFAULT 0,
  sms_success_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_id, date)
);

-- ============================================
-- NOTIFICATION SETTINGS
-- ============================================
CREATE TABLE notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID UNIQUE NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email_on_failure BOOLEAN DEFAULT TRUE,
  email_on_recovery BOOLEAN DEFAULT TRUE,
  daily_summary BOOLEAN DEFAULT TRUE,
  weekly_report BOOLEAN DEFAULT TRUE,
  slack_webhook_url TEXT,
  notification_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_users_org ON users(org_id);
CREATE INDEX idx_customers_org ON customers(org_id);
CREATE INDEX idx_customers_risk ON customers(org_id, risk_score DESC);
CREATE INDEX idx_payment_events_org ON payment_events(org_id);
CREATE INDEX idx_payment_events_status ON payment_events(org_id, status);
CREATE INDEX idx_payment_events_created ON payment_events(org_id, created_at DESC);
CREATE INDEX idx_recovery_attempts_org ON recovery_attempts(org_id);
CREATE INDEX idx_recovery_attempts_status ON recovery_attempts(org_id, status);
CREATE INDEX idx_recovery_attempts_scheduled ON recovery_attempts(status, scheduled_at);
CREATE INDEX idx_daily_analytics_org_date ON daily_analytics(org_id, date DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Helper function: get user's org_id
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
  SELECT org_id FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Organizations: users can only see their own org
CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT
  USING (id = get_user_org_id());

CREATE POLICY "Owners can update own organization"
  ON organizations FOR UPDATE
  USING (id = get_user_org_id())
  WITH CHECK (id = get_user_org_id());

-- Users: can see members of own org
CREATE POLICY "Users can view org members"
  ON users FOR SELECT
  USING (org_id = get_user_org_id());

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Generic org-scoped SELECT policy for all data tables
CREATE POLICY "Org isolation" ON customers FOR SELECT USING (org_id = get_user_org_id());
CREATE POLICY "Org isolation" ON payment_events FOR SELECT USING (org_id = get_user_org_id());
CREATE POLICY "Org isolation" ON recovery_sequences FOR SELECT USING (org_id = get_user_org_id());
CREATE POLICY "Org isolation" ON message_templates FOR SELECT USING (org_id = get_user_org_id());
CREATE POLICY "Org isolation" ON recovery_attempts FOR SELECT USING (org_id = get_user_org_id());
CREATE POLICY "Org isolation" ON daily_analytics FOR SELECT USING (org_id = get_user_org_id());
CREATE POLICY "Org isolation" ON notification_settings FOR SELECT USING (org_id = get_user_org_id());

-- INSERT policies (org_id must match)
CREATE POLICY "Org insert" ON customers FOR INSERT WITH CHECK (org_id = get_user_org_id());
CREATE POLICY "Org insert" ON payment_events FOR INSERT WITH CHECK (org_id = get_user_org_id());
CREATE POLICY "Org insert" ON recovery_sequences FOR INSERT WITH CHECK (org_id = get_user_org_id());
CREATE POLICY "Org insert" ON message_templates FOR INSERT WITH CHECK (org_id = get_user_org_id());
CREATE POLICY "Org insert" ON recovery_attempts FOR INSERT WITH CHECK (org_id = get_user_org_id());
CREATE POLICY "Org insert" ON notification_settings FOR INSERT WITH CHECK (org_id = get_user_org_id());

-- UPDATE policies
CREATE POLICY "Org update" ON customers FOR UPDATE USING (org_id = get_user_org_id());
CREATE POLICY "Org update" ON payment_events FOR UPDATE USING (org_id = get_user_org_id());
CREATE POLICY "Org update" ON recovery_sequences FOR UPDATE USING (org_id = get_user_org_id());
CREATE POLICY "Org update" ON message_templates FOR UPDATE USING (org_id = get_user_org_id());
CREATE POLICY "Org update" ON recovery_attempts FOR UPDATE USING (org_id = get_user_org_id());
CREATE POLICY "Org update" ON notification_settings FOR UPDATE USING (org_id = get_user_org_id());

-- DELETE policies
CREATE POLICY "Org delete" ON recovery_sequences FOR DELETE USING (org_id = get_user_org_id());
CREATE POLICY "Org delete" ON message_templates FOR DELETE USING (org_id = get_user_org_id());

-- Service role bypass (for n8n webhooks / API routes)
-- Note: Supabase service_role key bypasses RLS by default

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON recovery_sequences FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON message_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON recovery_attempts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON notification_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
