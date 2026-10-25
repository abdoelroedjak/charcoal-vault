/**
 * Rate Limiter for CHARCOAL VAULT API
 * In-memory sliding window rate limiter
 */

const store = new Map();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
}

function checkRateLimit(ip, limit = 5, windowMs = 600000) {
  const now = Date.now();
  const entry = store.get(ip) || { count: 0, firstAttempt: now, attempts: [] };

  // Filter attempts within the sliding window
  const validAttempts = entry.attempts.filter((timestamp) => now - timestamp < windowMs);
  validAttempts.push(now);

  const allowed = validAttempts.length <= limit;
  const remaining = Math.max(0, limit - validAttempts.length);

  store.set(ip, {
    count: validAttempts.length,
    firstAttempt: validAttempts[0] || now,
    attempts: validAttempts,
  });

  // Periodic cleanup if store exceeds 1000 items
  if (store.size > 1000) {
    for (const [key, val] of store.entries()) {
      if (now - (val.attempts[val.attempts.length - 1] || 0) > windowMs) {
        store.delete(key);
      }
    }
  }

  return {
    allowed,
    remaining,
    limit,
    resetTime: validAttempts.length > 0 ? validAttempts[0] + windowMs : now + windowMs,
  };
}

module.exports = {
  checkRateLimit,
  getClientIp,
};
