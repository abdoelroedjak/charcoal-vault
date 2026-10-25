import { handleCors } from '../../cors.js';
import { requireAuth } from '../../auth.js';
import { getSupabase } from '../../supabase.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  try {
    await requireAuth(req);
  } catch (err) {
    return res.status(err.status || 401).json({ error: err.message });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const supabase = getSupabase();
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
  const resourceType = req.query.resource_type;

  try {
    let query = supabase
      .from('audit_logs')
      .select('id, action, resource_type, resource_id, details, created_at, admin_users(email)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (resourceType) {
      query = query.eq('resource_type', resourceType);
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.status(200).json({ logs: data || [] });
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
