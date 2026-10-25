-- CHARCOAL VAULT — Supabase Database Migration
-- 002_enable_rls.sql: Enable Row Level Security (RLS) on all tables to prevent direct client/anon data access

-- 1. admin_users: Strict private access (NO policies = zero access to anon/authenticated, only service_role)
ALTER TABLE IF EXISTS admin_users ENABLE ROW LEVEL SECURITY;

-- 2. products: Enable RLS (Read-only for active non-deleted products)
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read active products" ON products;
CREATE POLICY "Public read active products" ON products
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active' AND deleted_at IS NULL);

-- 3. pricing: Enable RLS (Read-only for active non-deleted pricing)
ALTER TABLE IF EXISTS pricing ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read active pricing" ON pricing;
CREATE POLICY "Public read active pricing" ON pricing
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true AND deleted_at IS NULL);

-- 4. sections: Enable RLS (Read-only for enabled sections)
ALTER TABLE IF EXISTS sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read enabled sections" ON sections;
CREATE POLICY "Public read enabled sections" ON sections
  FOR SELECT
  TO anon, authenticated
  USING (is_enabled = true);

-- 5. faqs: Enable RLS (Read-only for active non-deleted faqs)
ALTER TABLE IF EXISTS faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read active faqs" ON faqs;
CREATE POLICY "Public read active faqs" ON faqs
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true AND deleted_at IS NULL);

-- 6. media: Enable RLS (Read-only for media metadata)
ALTER TABLE IF EXISTS media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read media metadata" ON media;
CREATE POLICY "Public read media metadata" ON media
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 7. contact_settings: Enable RLS (Read-only for public contact info)
ALTER TABLE IF EXISTS contact_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read contact settings" ON contact_settings;
CREATE POLICY "Public read contact settings" ON contact_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 8. seo_settings: Enable RLS (Read-only for public seo info)
ALTER TABLE IF EXISTS seo_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read seo settings" ON seo_settings;
CREATE POLICY "Public read seo settings" ON seo_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 9. audit_logs: Strict private access (NO policies = zero access to anon/authenticated, only service_role)
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;

-- 10. login_attempts: Strict private access (NO policies = zero access to anon/authenticated, only service_role)
ALTER TABLE IF EXISTS login_attempts ENABLE ROW LEVEL SECURITY;
