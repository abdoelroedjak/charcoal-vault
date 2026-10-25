/**
 * CHARCOAL VAULT — Admin API Client
 * Centralized, typed fetch client with automatic cookie credential handling,
 * error parsing, and session expiry redirect.
 */

const BASE_URL = import.meta.env.VITE_API_BASE || '/api';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  code?: string | null;
  name: string;
  slug: string;
  tagline?: string | null;
  description?: string | null;
  badge?: string | null;
  size_badge?: string | null;
  image_url?: string | null;
  gallery_urls?: string[];
  color_theme?: string;
  weight?: string | null;
  contains?: string | null;
  size?: string | null;
  specs?: ProductSpec[];
  grade?: string | null;
  shape?: string | null;
  ash_content?: string | null;
  moisture?: string | null;
  fixed_carbon?: string | null;
  volatile_matter?: string | null;
  caloric_value?: string | null;
  burn_time?: string | null;
  light_time?: string | null;
  packaging?: string | null;
  moq?: string | null;
  status: 'active' | 'inactive' | 'archived';
  order_index: number;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PricingRow {
  id: string;
  shipping_term: 'EXW' | 'FOB';
  packaging: string;
  price_per_mt: number;
  currency: string;
  moq_tons: number;
  is_active: boolean;
  effective_date?: string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Section {
  id: string;
  section_key: string;
  title?: string | null;
  subtitle?: string | null;
  body_text?: string | null;
  cta_text?: string | null;
  cta_url?: string | null;
  image_url?: string | null;
  extra_data?: Record<string, any>;
  is_enabled: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  original_name?: string | null;
  url: string;
  mime_type: string;
  size_bytes?: number | null;
  alt_text?: string | null;
  title?: string | null;
  uploaded_by?: string | null;
  created_at?: string;
}

export interface ContactSettings {
  id?: string;
  email?: string | null;
  whatsapp?: string | null;
  whatsapp_display?: string | null;
  phone?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  default_wa_text?: string | null;
  cta_url?: string | null;
  updated_at?: string;
}

export interface SEOSettings {
  id?: string;
  meta_title: string;
  meta_description: string;
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  canonical_url?: string | null;
  updated_at?: string;
}

export interface AuditLog {
  id: string;
  admin_user_id?: string | null;
  admin_email?: string;
  action: string;
  resource_type: string;
  resource_id?: string | null;
  details?: Record<string, any>;
  created_at: string;
}

class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Includes HttpOnly cookies
  });

  if (res.status === 401) {
    if (window.location.pathname !== '/admin/login') {
      window.location.href = '/admin/login';
    }
  }

  let json: any = null;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    json = await res.json().catch(() => null);
  }

  if (!res.ok) {
    const errorMsg = json?.error || json?.message || `Request failed with status ${res.status}`;
    throw new ApiError(errorMsg, res.status, json?.details);
  }

  return json as T;
}

export const api = {
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<{ message: string; user: AdminUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    logout: () =>
      request<{ message: string }>('/auth/logout', {
        method: 'POST',
      }),
    me: () =>
      request<{ user: AdminUser }>('/auth/me', {
        method: 'GET',
      }),
  },

  products: {
    list: (status?: string) =>
      request<{ products: Product[] }>(`/admin/products${status ? `?status=${status}` : ''}`),
    get: (id: string) =>
      request<{ product: Product }>(`/admin/products?id=${id}`),
    create: (data: Partial<Product>) =>
      request<{ message: string; product: Product }>('/admin/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Product>) =>
      request<{ message: string; product: Product }>(`/admin/products?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/admin/products?id=${id}`, {
        method: 'DELETE',
      }),
  },

  pricing: {
    list: () =>
      request<{ pricing: PricingRow[] }>('/admin/pricing'),
    create: (data: Partial<PricingRow>) =>
      request<{ message: string; pricing: PricingRow }>('/admin/pricing', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<PricingRow>) =>
      request<{ message: string; pricing: PricingRow }>(`/admin/pricing?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/admin/pricing?id=${id}`, {
        method: 'DELETE',
      }),
  },

  sections: {
    list: () =>
      request<{ sections: Section[] }>('/admin/sections'),
    get: (key: string) =>
      request<{ section: Section }>(`/admin/sections?key=${key}`),
    update: (key: string, data: Partial<Section>) =>
      request<{ message: string; section: Section }>(`/admin/sections?key=${key}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  faqs: {
    list: () =>
      request<{ faqs: FAQ[] }>('/admin/faqs'),
    create: (data: Partial<FAQ>) =>
      request<{ message: string; faq: FAQ }>('/admin/faqs', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<FAQ>) =>
      request<{ message: string; faq: FAQ }>(`/admin/faqs?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/admin/faqs?id=${id}`, {
        method: 'DELETE',
      }),
  },

  media: {
    list: () =>
      request<{ media: MediaItem[] }>('/admin/media'),
    upload: (payload: { data: string; filename: string; alt?: string; title?: string }) =>
      request<{ message: string; media: MediaItem }>('/admin/media', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/admin/media?id=${id}`, {
        method: 'DELETE',
      }),
  },

  contact: {
    get: () =>
      request<{ contact: ContactSettings }>('/admin/contact'),
    update: (data: Partial<ContactSettings>) =>
      request<{ message: string; contact: ContactSettings }>('/admin/contact', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  seo: {
    get: () =>
      request<{ seo: SEOSettings }>('/admin/seo'),
    update: (data: Partial<SEOSettings>) =>
      request<{ message: string; seo: SEOSettings }>('/admin/seo', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  audit: {
    list: (params?: { page?: number; limit?: number; resource_type?: string }) => {
      const q = new URLSearchParams();
      if (params?.page) q.set('page', String(params.page));
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.resource_type) q.set('resource_type', params.resource_type);
      return request<{
        audit_logs: AuditLog[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
      }>(`/admin/audit-logs?${q.toString()}`);
    },
  },
};
