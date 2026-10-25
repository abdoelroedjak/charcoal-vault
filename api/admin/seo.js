const { handleCors } = require('../_lib/cors');
const { requireAuth } = require('../_lib/auth');
const { getSupabase } = require('../_lib/supabase');
const { seoBody, validate } = require('../_lib/validate');
const { log: auditLog } = require('../_lib/audit');

const SINGLETON_ID = '00000000-0000-0000-0000-000000000002';

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  let authUser;
  try {
    authUser = await requireAuth(req);
  } catch (err) {
    return res.status(err.status || 401).json({ error: err.message });
  }

  const supabase = getSupabase();

  // GET: Fetch SEO settings singleton
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('id', SINGLETON_ID)
        .maybeSingle();

      if (error) throw error;
      return res.status(200).json({ seo: data || {} });
    } catch (err) {
      console.error('Error fetching SEO settings:', err);
      return res.status(500).json({ error: err.message || 'Failed to fetch SEO settings' });
    }
  }

  // PUT: Upsert SEO settings
  if (req.method === 'PUT') {
    try {
      const validated = validate(seoBody, req.body || {});

      const { data, error } = await supabase
        .from('seo_settings')
        .upsert(
          {
            id: SINGLETON_ID,
            ...validated,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )
        .select('*')
        .single();

      if (error) throw error;

      await auditLog(supabase, authUser.userId, 'UPDATE_SEO_SETTINGS', 'seo_settings', SINGLETON_ID, {
        meta_title: data.meta_title,
      });

      return res.status(200).json({ message: 'SEO settings updated successfully', seo: data });
    } catch (err) {
      console.error('Error updating SEO settings:', err);
      return res.status(err.status || 500).json({ error: err.message || 'Failed to update SEO settings' });
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'Method Not Allowed' });
};
