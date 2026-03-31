-- Migration: Seed default recovery sequences and email templates
-- These are created per-organization on first login via the application.
-- This migration creates a helper function used during onboarding.

-- ============================================
-- Function: seed_org_defaults
-- Called after a new organization is created
-- ============================================
CREATE OR REPLACE FUNCTION seed_org_defaults(p_org_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Default 3-step recovery sequence
  INSERT INTO recovery_sequences (org_id, name, is_default, is_active, steps)
  VALUES (
    p_org_id,
    'Default Recovery Sequence',
    TRUE,
    TRUE,
    '[
      {"step": 1, "type": "retry",  "delay_hours": 1,  "template_id": null},
      {"step": 2, "type": "email",  "delay_hours": 24, "template_id": null},
      {"step": 3, "type": "email",  "delay_hours": 72, "template_id": null}
    ]'::jsonb
  )
  ON CONFLICT DO NOTHING;

  -- Email template 1: Gentle reminder
  INSERT INTO message_templates (org_id, name, type, subject, body, is_default)
  VALUES (
    p_org_id,
    'Gentle Reminder',
    'email',
    'Your payment needs attention',
    E'Hi {{customer_name}},\n\nWe noticed your recent payment of {{amount}} was unsuccessful.\n\nThis can happen for various reasons — an expired card, insufficient funds, or a temporary bank issue.\n\nPlease update your payment details to continue enjoying our service without interruption.\n\n[Update Payment]\n\nIf you have any questions, just reply to this email.\n\nBest regards,\n{{org_name}}',
    TRUE
  )
  ON CONFLICT DO NOTHING;

  -- Email template 2: Friendly follow-up
  INSERT INTO message_templates (org_id, name, type, subject, body, is_default)
  VALUES (
    p_org_id,
    'Friendly Follow-up',
    'email',
    'Still having trouble with your payment?',
    E'Hi {{customer_name}},\n\nWe wanted to follow up about the payment issue from a few days ago.\n\nYour subscription is important to us and we''d love to keep you on board.\n\nUpdating your payment takes less than a minute:\n\n[Fix My Payment]\n\nAs always, reply if we can help.\n\n{{org_name}}',
    TRUE
  )
  ON CONFLICT DO NOTHING;

  -- Email template 3: Final notice
  INSERT INTO message_templates (org_id, name, type, subject, body, is_default)
  VALUES (
    p_org_id,
    'Final Notice',
    'email',
    'Action required: Your account may be paused',
    E'Hi {{customer_name}},\n\nThis is a final reminder that your payment of {{amount}} is still outstanding.\n\nTo avoid any interruption to your service, please update your payment information today.\n\n[Update Payment Now]\n\nIf you''ve already resolved this, please disregard this message.\n\nThank you,\n{{org_name}}',
    TRUE
  )
  ON CONFLICT DO NOTHING;

END;
$$;

-- ============================================
-- Function: handle_new_organization
-- Trigger: auto-seed when org is inserted
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_organization()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM seed_org_defaults(NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_organization_created ON organizations;
CREATE TRIGGER on_organization_created
  AFTER INSERT ON organizations
  FOR EACH ROW EXECUTE FUNCTION handle_new_organization();

-- ============================================
-- Default notification settings per org
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_organization_notifications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO notification_settings (org_id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_organization_created_notifications ON organizations;
CREATE TRIGGER on_organization_created_notifications
  AFTER INSERT ON organizations
  FOR EACH ROW EXECUTE FUNCTION handle_new_organization_notifications();
