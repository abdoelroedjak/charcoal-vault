const { handleCors } = require('../_lib/cors');
const { clearAuthCookie } = require('../_lib/cookies');
const { getSupabase } = require('../_lib/supabase');
const { log: auditLog } = require('../_lib/audit');
const { requireAuth } = require('../_lib/auth');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const auth = await requireAuth(req).catch(() => null);
    if (auth && auth.userId) {
      const supabase = getSupabase();
      await auditLog(supabase, auth.userId, 'LOGOUT', 'auth', auth.userId);
    }
  } catch (err) {
    // Ignore error on audit during logout
  }

  clearAuthCookie(res);
  return res.status(200).json({ message: 'Logged out successfully' });
};
