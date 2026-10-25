const { handleCors } = require('../_lib/cors');
const { requireAuth } = require('../_lib/auth');
const { getSupabase } = require('../_lib/supabase');

module.exports = async function handler(req, res) {
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
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const offset = (page - 1) * limit;
  const resourceType = req.query.resource_type;

  try {
    let query = supabase
      .from('audit_logs')
      .select('id, admin_user_id, action, resource_type, resource_id, details, created_at', { count: 'exact' });

    if (resourceType) {
      query = query.eq('resource_type', resourceType);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: logs, count, error } = await query;
    if (error) throw error;

    // Fetch admin user emails for display
    const userIds = Array.from(new Set((logs || []).map((l) => l.admin_user_id).filter(Boolean)));
    let userMap = {};
    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from('admin_users')
        .select('id, email')
        .in('id', userIds);
      if (users) {
        userMap = Object.fromEntries(users.map((u) => [u.id, u.email]));
      }
    }

    const enhancedLogs = (logs || []).map((item) => ({
      ...item,
      admin_email: item.admin_user_id ? userMap[item.admin_user_id] || 'Unknown' : 'System',
    }));

    return res.status(200).json({
      audit_logs: enhancedLogs,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch audit logs' });
  }
};
