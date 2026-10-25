# CHARCOAL VAULT — Enterprise Admin CMS & Gateway Guide

The CHARCOAL VAULT Admin CMS provides full operational and commercial control over product SKUs, Incoterms pricing matrices (EXW & FOB), website copy, media storage, buyer FAQs, and communication routing for container export dispatches.

---

## 1. System Architecture

- **Public Site**: Fast, immutable React 19 + Vite SPA with static fallback data (`src/data/charcoalData.ts`).
- **Admin CMS SPA**: Dedicated Vite entry point (`admin/`) routed through `/admin/*`, isolated from the public consumer experience.
- **Backend**: Vercel Serverless Functions (`/api/*`) executing CommonJS handlers with built-in CORS, origin checking, and rate limiting.
- **Database**: PostgreSQL hosted on Supabase with pgcrypto extensions, row-level safety, and immutable audit logs.
- **Session Auth**: HttpOnly, SameSite=Strict JWT session cookies with 2-hour sliding expiry and bcrypt password hashing (cost factor 12).

---

## 2. Environment Variables Configuration

Set these environment variables in your Vercel Project Settings (under **Environment Variables**) and in your local `.env` file:

```bash
# ==============================================================================
# Server-Side Secrets (Never expose to client or prefix with VITE_)
# ==============================================================================

# Supabase API URL & Service Role Key (from Supabase Project Settings -> API)
SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJh..."

# JWT Secret for signing 2-hour session tokens (generate with `openssl rand -base64 32`)
JWT_SECRET="YOUR_RANDOM_256_BIT_SECRET"

# ==============================================================================
# Client-Side Public Variables (Safe to expose)
# ==============================================================================
VITE_API_BASE="/api"
```

---

## 3. Database Migration & Initialization

### Step 1: Run SQL Migration
In your Supabase SQL Editor:
1. Open `supabase/migrations/001_initial_schema.sql`.
2. Execute the entire file to create all tables:
   - `admin_users`
   - `products`
   - `pricing`
   - `sections`
   - `faqs`
   - `media`
   - `contact_settings`
   - `seo_settings`
   - `audit_logs`
   - `login_attempts`
3. In Supabase Dashboard, go to **Storage**, click **New Bucket**, and create a public bucket named `media`.

### Step 2: Seed Initial Data
Run the idempotent seed script to populate products, EXW/FOB pricing, FAQs, sections, and SEO metadata:

```bash
SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY" \
node scripts/seed_initial_data.js
```

---

## 4. Provisioning the First Admin User

To create your initial administrative account securely with a bcrypt hash (cost factor 12):

```bash
SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY" \
node scripts/generate_admin.js --email admin@charcoalvault.com --password "YourSuperSecurePassword123"
```

*Note: The plain-text password is never logged or stored anywhere. Only the one-way bcrypt digest is saved.*

---

## 5. Development & Build Workflow

### Local Development
```bash
# Run public website (Port 3000)
npm run dev

# Run Admin CMS in parallel (Port 3001)
npm run dev:admin
```

### Production Build
```bash
# Typecheck and build both public SPA and Admin SPA into dist/ and dist/admin/
npm run build
```

The build output generates:
- `dist/index.html` + `dist/assets/*` (Public customer site)
- `dist/admin/index.html` + `dist/admin/assets/*` (Admin CMS)

---

## 6. Accessing the Admin Panel

1. Navigate to: `https://your-domain.com/admin` (or `http://localhost:3000/admin` locally).
2. If unauthenticated, you will be automatically redirected to `/admin/login`.
3. Sign in with the credentials created in Step 4.
4. On successful login:
   - An HttpOnly, SameSite=Strict cookie `session_token` is issued.
   - You are routed to the **Commercial Control Center** at `/admin/dashboard`.

---

## 7. Security Hardening & Rate Limiting

1. **Brute Force Defense**:
   - Both in-memory and database sliding window limits allow a maximum of 5 attempts per 10-minute window per IP.
   - Repeated failures return `429 Too Many Requests`.
2. **Immutable Audit Trail**:
   - Every mutation (product edits, rate adjustments, file uploads, deletions, logins) is recorded in `audit_logs`.
   - Pricing changes store exact `before` and `after` diffs.
3. **Magic Bytes Validation**:
   - Uploads in `api/admin/media.js` verify binary file headers to ensure real JPEG, PNG, WEBP, or GIF contents before storage.
   - File size is capped strictly at 5MB.
4. **Content Security Policy**:
   - `vercel.json` enforces COOP (`same-origin`), COEP (`credentialless`), CORP (`same-origin`), and CSP directives allowing secure Supabase connections.

---

## 8. Rollback & Disaster Recovery

If you ever need to rollback a bad configuration or revert to the initial catalog:
1. Re-run `node scripts/seed_initial_data.js` to restore baseline catalog and pricing data.
2. In case of database migration rollback, revert changes via Supabase SQL editor or drop modified columns/tables.
3. The public site components continue to function even if Supabase is temporarily unreachable because baseline data is bundled with the SPA.
