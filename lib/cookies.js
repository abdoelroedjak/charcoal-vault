const COOKIE_NAME = 'session_token';
const MAX_AGE_SECONDS = 2 * 60 * 60; // 2 hours

export function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieParts = [
    `${COOKIE_NAME}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${MAX_AGE_SECONDS}`,
  ];

  if (isProd) {
    cookieParts.push('Secure');
  }

  res.setHeader('Set-Cookie', cookieParts.join('; '));
}

export function clearAuthCookie(res) {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieParts = [
    `${COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Max-Age=0',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ];

  if (isProd) {
    cookieParts.push('Secure');
  }

  res.setHeader('Set-Cookie', cookieParts.join('; '));
}

export function getAuthToken(req) {
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map((c) => c.trim());
    const sessionCookie = cookies.find((c) => c.startsWith(`${COOKIE_NAME}=`));
    if (sessionCookie) {
      return sessionCookie.substring(COOKIE_NAME.length + 1);
    }
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}
