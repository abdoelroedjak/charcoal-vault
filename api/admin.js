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

  try {
    const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
    const pathname = url.pathname;
    req.query = { ...Object.fromEntries(url.searchParams), ...(req.query || {}) };
    const route = req.query.route || pathname.split('/').filter(Boolean).pop();

    if (route === 'products' || pathname.includes('/products')) {
      return await productsHandler(req, res);
    }
    if (route === 'pricing' || pathname.includes('/pricing')) {
      return await pricingHandler(req, res);
    }
    if (route === 'sections' || pathname.includes('/sections')) {
      return await sectionsHandler(req, res);
    }
    if (route === 'faqs' || pathname.includes('/faqs')) {
      return await faqsHandler(req, res);
    }
    if (route === 'media' || pathname.includes('/media')) {
      return await mediaHandler(req, res);
    }
    if (route === 'contact' || pathname.includes('/contact')) {
      return await contactHandler(req, res);
    }
    if (route === 'seo' || pathname.includes('/seo')) {
      return await seoHandler(req, res);
    }
    if (route === 'audit-logs' || pathname.includes('/audit-logs')) {
      return await auditLogsHandler(req, res);
    }

    return res.status(404).json({ error: `Admin endpoint not found: ${route}` });
  } catch (err) {
    console.error('Unhandled error in admin dispatcher:', err);
    return res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  }
}
