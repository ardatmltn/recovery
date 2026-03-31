-- Migration: Auto-create organization and user record on Supabase Auth signup
-- Triggered when a new row is inserted into auth.users

CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id UUID;
  v_org_name TEXT;
  v_org_slug TEXT;
  v_full_name TEXT;
BEGIN
  -- Extract metadata passed during signUp()
  v_org_name  := COALESCE(NEW.raw_user_meta_data->>'org_name',  'My Organization');
  v_org_slug  := COALESCE(NEW.raw_user_meta_data->>'org_slug',  'org-' || LEFT(NEW.id::TEXT, 8));
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');

  -- Ensure slug is unique by appending short id suffix if needed
  IF EXISTS (SELECT 1 FROM organizations WHERE slug = v_org_slug) THEN
    v_org_slug := v_org_slug || '-' || LEFT(NEW.id::TEXT, 4);
  END IF;

  -- Create organization
  INSERT INTO organizations (name, slug)
  VALUES (v_org_name, v_org_slug)
  RETURNING id INTO v_org_id;

  -- Create user record linked to org
  INSERT INTO users (id, org_id, email, full_name, role)
  VALUES (NEW.id, v_org_id, NEW.email, v_full_name, 'owner');

  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();
