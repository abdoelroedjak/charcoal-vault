import { z } from 'zod';

// 1. Auth Schemas
export const loginBody = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// 2. Product Schemas
export const productSpecSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const productBody = z.object({
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
  order_index: z.number().int().optional().default(0),
  is_featured: z.boolean().optional().default(false),
});

export const productUpdateBody = productBody.partial();

// 3. Pricing Schemas
export const pricingBody = z.object({
  shipping_term: z.enum(['EXW', 'FOB']),
  packaging: z.string().min(1, 'Packaging name is required'),
  price_per_mt: z.number().positive('Price must be greater than 0'),
  currency: z.string().default('USD'),
  moq_tons: z.number().int().positive().default(18),
  is_active: z.boolean().default(true),
  effective_date: z.string().optional(),
  notes: z.string().optional().nullable(),
});

export const pricingUpdateBody = pricingBody.partial();

// 4. FAQ Schemas
export const faqBody = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  order_index: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const faqUpdateBody = faqBody.partial();

// 5. Section Schemas
export const sectionBody = z.object({
  section_key: z.string().min(1, 'Section key is required'),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  body_text: z.string().optional().nullable(),
  cta_text: z.string().optional().nullable(),
  cta_url: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  extra_data: z.record(z.any()).optional().default({}),
  is_enabled: z.boolean().default(true),
  order_index: z.number().int().default(0),
});

export const sectionUpdateBody = sectionBody.partial();

// 6. Contact Settings Schemas
export const contactBody = z.object({
  email: z.string().email().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  whatsapp_display: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  default_wa_text: z.string().optional().nullable(),
  cta_url: z.string().optional().nullable(),
});

// 7. SEO Settings Schemas
export const seoBody = z.object({
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  og_title: z.string().optional().nullable(),
  og_description: z.string().optional().nullable(),
  og_image_url: z.string().optional().nullable(),
  canonical_url: z.string().url().optional().nullable(),
});

// Validation Helper
export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const error = new Error('Validation failed');
    error.status = 400;
    error.errors = result.error.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    throw error;
  }
  return result.data;
}
