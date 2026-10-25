import loginHandler from '../lib/handlers/auth/login.js';
import logoutHandler from '../lib/handlers/auth/logout.js';
import meHandler from '../lib/handlers/auth/me.js';
import { handleCors } from '../lib/cors.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const route = req.query.route || pathname.split('/').filter(Boolean).pop();

  if (route === 'login' || pathname.endsWith('/login')) {
    return loginHandler(req, res);
  }
  if (route === 'logout' || pathname.endsWith('/logout')) {
    return logoutHandler(req, res);
  }
  if (route === 'me' || pathname.endsWith('/me')) {
    return meHandler(req, res);
  }

  return res.status(404).json({ error: `Auth endpoint not found: ${route}` });
}
