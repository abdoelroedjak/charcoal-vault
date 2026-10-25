import productsHandler from '../lib/handlers/admin/products.js';
import pricingHandler from '../lib/handlers/admin/pricing.js';
import sectionsHandler from '../lib/handlers/admin/sections.js';
import faqsHandler from '../lib/handlers/admin/faqs.js';
import mediaHandler from '../lib/handlers/admin/media.js';
import contactHandler from '../lib/handlers/admin/contact.js';
import seoHandler from '../lib/handlers/admin/seo.js';
import auditLogsHandler from '../lib/handlers/admin/audit-logs.js';
import { handleCors } from '../lib/cors.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const route = req.query.route || pathname.split('/').filter(Boolean).pop();

  if (route === 'products' || pathname.includes('/products')) {
    return productsHandler(req, res);
  }
  if (route === 'pricing' || pathname.includes('/pricing')) {
    return pricingHandler(req, res);
  }
  if (route === 'sections' || pathname.includes('/sections')) {
    return sectionsHandler(req, res);
  }
  if (route === 'faqs' || pathname.includes('/faqs')) {
    return faqsHandler(req, res);
  }
  if (route === 'media' || pathname.includes('/media')) {
    return mediaHandler(req, res);
  }
  if (route === 'contact' || pathname.includes('/contact')) {
    return contactHandler(req, res);
  }
  if (route === 'seo' || pathname.includes('/seo')) {
    return seoHandler(req, res);
  }
  if (route === 'audit-logs' || pathname.includes('/audit-logs')) {
    return auditLogsHandler(req, res);
  }

  return res.status(404).json({ error: `Admin endpoint not found: ${route}` });
}
