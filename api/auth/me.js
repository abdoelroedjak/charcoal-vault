const { handleCors } = require('../_lib/cors');
const { requireAuth } = require('../_lib/auth');
const { getSupabase } = require('../_lib/supabase');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let authUser;
  try {
    authUser = await requireAuth(req);
  } catch (err) {
    return res.status(err.status || 401).json({ error: err.message });
  }

  try {
    const supabase = getSupabase();
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('id, email, role, is_active, created_at')
      .eq('id', authUser.userId)
      .maybeSingle();

    if (error || !user || !user.is_active) {
      return res.status(401).json({ error: 'User is inactive or not found' });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error('Error fetching /api/auth/me:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
