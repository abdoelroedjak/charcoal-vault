import { handleCors } from '../../lib/cors.js';
import { clearAuthCookie } from '../../lib/cookies.js';
import { requireAuth } from '../../lib/auth.js';
import { getSupabase } from '../../lib/supabase.js';
import { log as auditLog } from '../../lib/audit.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const auth = await requireAuth(req);
    const supabase = getSupabase();
    await auditLog(supabase, auth.userId, 'LOGOUT', 'auth', auth.userId, {
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    // Non-blocking logout even if auth expired
  }

  clearAuthCookie(res);
  return res.status(200).json({ message: 'Logged out successfully' });
}
