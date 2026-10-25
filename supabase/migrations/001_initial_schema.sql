-- CHARCOAL VAULT — Supabase Database Migration
-- Initial Schema for Admin CMS & Public Data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  badge TEXT,
  size_badge TEXT,
  image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  color_theme TEXT DEFAULT 'gold',
  weight TEXT,
  contains TEXT,
  size TEXT,
  specs JSONB DEFAULT '[]',
  grade TEXT,
  shape TEXT,
  ash_content TEXT,
  moisture TEXT,
  fixed_carbon TEXT,
  volatile_matter TEXT,
  caloric_value TEXT,
  burn_time TEXT,
  light_time TEXT,
  packaging TEXT,
  moq TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','archived')),
  order_index INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 3. pricing table
CREATE TABLE IF NOT EXISTS pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipping_term TEXT NOT NULL CHECK (shipping_term IN ('EXW','FOB')),
  packaging TEXT NOT NULL,
  price_per_mt NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  moq_tons INTEGER DEFAULT 18,
  is_active BOOLEAN NOT NULL DEFAULT true,
  effective_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 4. sections table (hero, about, process, cta, footer, infostrip, etc.)
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  subtitle TEXT,
  body_text TEXT,
  cta_text TEXT,
  cta_url TEXT,
  image_url TEXT,
  extra_data JSONB DEFAULT '{}',
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 6. media table
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_name TEXT,
  url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER,
  alt_text TEXT,
  title TEXT,
  uploaded_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. contact_settings table (singleton row, id='00000000-0000-0000-0000-000000000001')
CREATE TABLE IF NOT EXISTS contact_settings (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
  email TEXT,
  whatsapp TEXT,
  whatsapp_display TEXT,
  phone TEXT,
  instagram TEXT,
  linkedin TEXT,
  default_wa_text TEXT,
  cta_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. seo_settings table (singleton, id='00000000-0000-0000-0000-000000000002')
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000002',
  meta_title TEXT,
  meta_description TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. login_attempts table (for brute force protection)
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip TEXT NOT NULL,
  email TEXT,
  success BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_pricing_active ON pricing(is_active, shipping_term);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(order_index) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip, created_at DESC);
