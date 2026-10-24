// Vercel Serverless Function — Secure B2B Contact Gateway
// Enforces server-side honeypot, origin validation, rate-limiting, CRLF sanitization, and input length capping.

const ipRateLimit = new Map();

export default async function handler(req, res) {
  // 1. Enforce POST only
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Validate Origin & Referer (Prevent Cross-Site Form Abuse)
  const origin = req.headers['origin'] || '';
  const referer = req.headers['referer'] || '';
  const allowedHost = 'charcoal-vault.vercel.app';
  const isAllowedOrigin =
    !origin ||
    origin.includes(allowedHost) ||
    origin.includes('localhost') ||
    origin.includes('127.0.0.1');

  if (!isAllowedOrigin && !referer.includes(allowedHost)) {
    return res.status(403).json({ error: 'Forbidden: Invalid origin' });
  }

  // 3. Server-Side Rate Limiting (1 submission per 10s per IP)
  const clientIp =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown';

  const now = Date.now();
  const lastTime = ipRateLimit.get(clientIp) || 0;
  if (now - lastTime < 10000) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Please wait at least 10 seconds before submitting another inquiry.',
    });
  }
  ipRateLimit.set(clientIp, now);

  // Clean old rate-limit entries periodically
  if (ipRateLimit.size > 1000) {
    for (const [ip, time] of ipRateLimit.entries()) {
      if (now - time > 60000) ipRateLimit.delete(ip);
    }
  }

  const body = req.body || {};

  // 4. Server-Side Honeypot Verification
  // If either honeypot field is filled, silently drop without emailing
  if (body._gotcha_hp || body._honey) {
    return res.status(200).json({
      success: true,
      message: 'Inquiry processed successfully.',
    });
  }

  // 5. Server-Side Input Validation
  const rawName = String(body.name || '').trim();
  const rawEmail = String(body.email || '').trim();

  if (!rawName || !rawEmail) {
    return res.status(400).json({ error: 'Name and Email are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(rawEmail) || rawEmail.length > 120) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // 6. Server-Side CRLF Sanitization (Prevent Email Header Injection)
  const sanitize = (str) =>
    String(str || '')
      .replace(/[\r\n\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const name = sanitize(rawName).slice(0, 100);
  const business = sanitize(body.business).slice(0, 80);
  const whatsapp = sanitize(body.whatsapp).slice(0, 40);
  const product = sanitize(body.product).slice(0, 100);
  const quantity = sanitize(body.quantity).slice(0, 60);
  const message = String(body.message || '').trim().slice(0, 2000);

  const subject = `New Supply Inquiry — ${name}${business ? ` [${business}]` : ''}`;

  // 7. Forward to FormSubmit via server-to-server request
  const TARGET_EMAIL = 'charcoalvault@gmail.com';

  try {
    const upstreamRes = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        _honey: '',
        name,
        business: business || 'N/A',
        whatsapp: whatsapp || 'N/A',
        email: rawEmail,
        product: product || 'N/A',
        quantity: quantity || '18 MT (MOQ)',
        message: message || 'N/A',
      }),
    });

    if (!upstreamRes.ok) {
      throw new Error(`Upstream error: HTTP ${upstreamRes.status}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry successfully delivered.',
    });
  } catch (err) {
    console.error('Failed to forward inquiry to FormSubmit:', err);
    return res.status(502).json({
      error: 'Gateway Error',
      message: 'Failed to route inquiry to email gateway.',
    });
  }
}
