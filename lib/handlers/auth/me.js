import { handleCors } from '../../cors.js';
import { requireAuth } from '../../auth.js';
import { getSupabase } from '../../supabase.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const authUser = await requireAuth(req);
    const supabase = getSupabase();

    const { data: user, error } = await supabase
      .from('admin_users')
      .select('id, email, role, is_active, created_at')
      .eq('id', authUser.userId)
      .maybeSingle();

    if (error || !user || !user.is_active) {
      return res.status(401).json({ error: 'Unauthorized or inactive user.' });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    return res.status(err.status || 401).json({ error: err.message });
  }
}
