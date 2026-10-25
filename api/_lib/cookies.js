/**
 * Cookie Helpers for CHARCOAL VAULT API
 */

function setAuthCookie(res, token) {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  // 7200 seconds = 2 hours
  const cookieParts = [
    `session_token=${token}`,
    'HttpOnly',
    'Path=/',
    'Max-Age=7200',
    'SameSite=Strict',
  ];

  if (isProduction) {
    cookieParts.push('Secure');
  }

  res.setHeader('Set-Cookie', cookieParts.join('; '));
}

function clearAuthCookie(res) {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  const cookieParts = [
    'session_token=',
    'HttpOnly',
    'Path=/',
    'Max-Age=0',
    'SameSite=Strict',
  ];

  if (isProduction) {
    cookieParts.push('Secure');
  }

  res.setHeader('Set-Cookie', cookieParts.join('; '));
}

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx < 0) continue;
    const key = pair.substring(0, idx).trim();
    const val = pair.substring(idx + 1).trim();
    cookies[key] = decodeURIComponent(val);
  }
  return cookies;
}

function getAuthToken(req) {
  const cookies = parseCookies(req.headers.cookie);
  if (cookies.session_token) {
    return cookies.session_token;
  }

  // Fallback to Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  return null;
}

module.exports = {
  setAuthCookie,
  clearAuthCookie,
  parseCookies,
  getAuthToken,
};
