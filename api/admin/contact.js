const { handleCors } = require('../_lib/cors');
const { requireAuth } = require('../_lib/auth');
const { getSupabase } = require('../_lib/supabase');
const { contactBody, validate } = require('../_lib/validate');
const { log: auditLog } = require('../_lib/audit');

const SINGLETON_ID = '00000000-0000-0000-0000-000000000001';

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  let authUser;
  try {
    authUser = await requireAuth(req);
  } catch (err) {
    return res.status(err.status || 401).json({ error: err.message });
  }

  const supabase = getSupabase();

  // GET: Fetch contact settings singleton
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('contact_settings')
        .select('*')
        .eq('id', SINGLETON_ID)
        .maybeSingle();

      if (error) throw error;
      return res.status(200).json({ contact: data || {} });
    } catch (err) {
      console.error('Error fetching contact settings:', err);
      return res.status(500).json({ error: err.message || 'Failed to fetch contact settings' });
    }
  }

  // PUT: Upsert contact settings
  if (req.method === 'PUT') {
    try {
      const validated = validate(contactBody, req.body || {});

      const { data, error } = await supabase
        .from('contact_settings')
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

      await auditLog(supabase, authUser.userId, 'UPDATE_CONTACT_SETTINGS', 'contact_settings', SINGLETON_ID, {
        email: data.email,
        whatsapp: data.whatsapp,
      });

      return res.status(200).json({ message: 'Contact settings updated successfully', contact: data });
    } catch (err) {
      console.error('Error updating contact settings:', err);
      return res.status(err.status || 500).json({ error: err.message || 'Failed to update contact settings' });
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'Method Not Allowed' });
};
