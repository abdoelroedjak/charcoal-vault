const { z } = require('zod');

// 1. Auth Schemas
const loginBody = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// 2. Product Schemas
const productSpecSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const productBody = z.object({
  code: z.string().optional().nullable(),
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  tagline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  badge: z.string().optional().nullable(),
  size_badge: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  gallery_urls: z.array(z.string()).optional().default([]),
  color_theme: z.enum(['gold', 'blue', 'purple', 'green', 'charcoal']).optional().default('gold'),
  weight: z.string().optional().nullable(),
  contains: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  specs: z.array(productSpecSchema).optional().default([]),
  grade: z.string().optional().nullable(),
  shape: z.string().optional().nullable(),
  ash_content: z.string().optional().nullable(),
  moisture: z.string().optional().nullable(),
  fixed_carbon: z.string().optional().nullable(),
  volatile_matter: z.string().optional().nullable(),
  caloric_value: z.string().optional().nullable(),
  burn_time: z.string().optional().nullable(),
  light_time: z.string().optional().nullable(),
  packaging: z.string().optional().nullable(),
  moq: z.string().optional().nullable(),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
  order_index: z.coerce.number().int().default(0),
  is_featured: z.boolean().default(false),
});

// 3. Pricing Schemas
const pricingBody = z.object({
  shipping_term: z.enum(['EXW', 'FOB'], { errorMap: () => ({ message: 'Shipping term must be EXW or FOB' }) }),
  packaging: z.string().min(1, 'Packaging description is required'),
  price_per_mt: z.coerce.number().positive('Price must be greater than 0'),
  currency: z.string().default('USD'),
  moq_tons: z.coerce.number().int().positive().default(18),
  is_active: z.boolean().default(true),
  effective_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Effective date must be YYYY-MM-DD').optional(),
  notes: z.string().optional().nullable(),
});

// 4. FAQ Schemas
const faqBody = z.object({
  question: z.string().min(1, 'Question cannot be empty'),
  answer: z.string().min(1, 'Answer cannot be empty'),
  order_index: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

// 5. Section Schemas
const sectionBody = z.object({
  section_key: z.string().min(1, 'Section key is required'),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  body_text: z.string().optional().nullable(),
  cta_text: z.string().optional().nullable(),
  cta_url: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  extra_data: z.record(z.any()).optional().default({}),
  is_enabled: z.boolean().default(true),
  order_index: z.coerce.number().int().default(0),
});

// 6. Contact Settings Schemas
const contactBody = z.object({
  email: z.string().email('Invalid email address').optional().nullable(),
  whatsapp: z.string().min(1, 'WhatsApp number is required').optional().nullable(),
  whatsapp_display: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  default_wa_text: z.string().optional().nullable(),
  cta_url: z.string().optional().nullable(),
});

// 7. SEO Settings Schemas
const seoBody = z.object({
  meta_title: z.string().min(1, 'Meta title is required').max(120),
  meta_description: z.string().min(1, 'Meta description is required').max(320),
  og_title: z.string().optional().nullable(),
  og_description: z.string().optional().nullable(),
  og_image_url: z.string().optional().nullable(),
  canonical_url: z.string().url('Must be a valid URL').optional().nullable(),
});

/**
 * Validation helper function
 */
function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    const message = issue ? `${issue.path.join('.')}: ${issue.message}` : 'Validation error';
    const error = new Error(message);
    error.status = 400;
    error.errors = result.error.format();
    throw error;
  }
  return result.data;
}

module.exports = {
  loginBody,
  productBody,
  pricingBody,
  faqBody,
  sectionBody,
  contactBody,
  seoBody,
  validate,
};
