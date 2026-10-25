import productsHandler from '../lib/handlers/public/products.js';
import pricingHandler from '../lib/handlers/public/pricing.js';
import sectionsHandler from '../lib/handlers/public/sections.js';
import faqsHandler from '../lib/handlers/public/faqs.js';
import contactHandler from '../lib/handlers/public/contact.js';
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
  if (route === 'contact' || pathname.includes('/contact')) {
    return contactHandler(req, res);
  }

  return res.status(404).json({ error: `Public endpoint not found: ${route}` });
}
