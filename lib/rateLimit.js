const rateLimitMap = new Map();

export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
}

export function checkRateLimit(ip, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, firstAttempt: now };

  if (now - entry.firstAttempt > windowMs) {
    entry.count = 1;
    entry.firstAttempt = now;
    rateLimitMap.set(ip, entry);
    return { allowed: true, remaining: limit - 1 };
  }

  entry.count += 1;
  rateLimitMap.set(ip, entry);

  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now - val.firstAttempt > windowMs) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (entry.count > limit) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: limit - entry.count };
}
