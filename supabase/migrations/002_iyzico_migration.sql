-- Migration: Replace Stripe fields with İyzico fields
-- Recoverly v2 — İyzico payment provider

-- ============================================
-- ORGANIZATIONS — replace stripe fields
-- ============================================
ALTER TABLE organizations
  DROP COLUMN IF EXISTS stripe_api_key_encrypted,
  DROP COLUMN IF EXISTS stripe_webhook_secret_encrypted,
  DROP COLUMN IF EXISTS stripe_connected,
  DROP COLUMN IF EXISTS stripe_customer_id,
  DROP COLUMN IF EXISTS stripe_subscription_id;

ALTER TABLE organizations
  ADD COLUMN iyzico_api_key_encrypted TEXT,
  ADD COLUMN iyzico_secret_key_encrypted TEXT,
  ADD COLUMN iyzico_merchant_id TEXT,
  ADD COLUMN iyzico_base_url TEXT DEFAULT 'https://sandbox-api.iyzipay.com',
  ADD COLUMN iyzico_connected BOOLEAN DEFAULT FALSE,
  ADD COLUMN recoverly_customer_id TEXT,     -- Recoverly's own subscription customer id
  ADD COLUMN recoverly_subscription_id TEXT; -- Recoverly subscription id

-- ============================================
-- CUSTOMERS — replace stripe_customer_id
-- ============================================
ALTER TABLE customers
  DROP COLUMN IF EXISTS stripe_customer_id;

ALTER TABLE customers
  ADD COLUMN iyzico_card_user_key TEXT,    -- İyzico card user key for saved cards
  ADD COLUMN iyzico_card_token TEXT,       -- Default saved card token
  ADD COLUMN provider_customer_id TEXT;    -- Generic provider customer reference

-- Update unique constraint
ALTER TABLE customers
  DROP CONSTRAINT IF EXISTS customers_org_id_stripe_customer_id_key;

CREATE UNIQUE INDEX customers_org_provider_unique
  ON customers(org_id, provider_customer_id)
  WHERE provider_customer_id IS NOT NULL;

-- ============================================
-- PAYMENT_EVENTS — generalize provider fields
-- ============================================
ALTER TABLE payment_events
  DROP COLUMN IF EXISTS stripe_event_id,
  DROP COLUMN IF EXISTS stripe_payment_intent_id,
  DROP COLUMN IF EXISTS stripe_invoice_id;

ALTER TABLE payment_events
  ADD COLUMN provider_event_id TEXT,           -- İyzico conversationId or similar
  ADD COLUMN provider_payment_id TEXT,         -- İyzico paymentId
  ADD COLUMN provider_reference_code TEXT;     -- İyzico iyziReferenceCode

-- Unique constraint on provider event
CREATE UNIQUE INDEX payment_events_org_provider_event_unique
  ON payment_events(org_id, provider_event_id)
  WHERE provider_event_id IS NOT NULL;

-- ============================================
-- Update indexes
-- ============================================
DROP INDEX IF EXISTS idx_payment_events_status;
CREATE INDEX idx_payment_events_status ON payment_events(org_id, status);
