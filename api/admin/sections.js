const { handleCors } = require('../_lib/cors');
const { requireAuth } = require('../_lib/auth');
const { getSupabase } = require('../_lib/supabase');
const { sectionBody, validate } = require('../_lib/validate');
const { log: auditLog } = require('../_lib/audit');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  let authUser;
  try {
    authUser = await requireAuth(req);
  } catch (err) {
    return res.status(err.status || 401).json({ error: err.message });
  }

  const supabase = getSupabase();
  const { key } = req.query;

  // GET: Single section by key or list all
  if (req.method === 'GET') {
    try {
      if (key) {
        const { data, error } = await supabase
          .from('sections')
          .select('*')
          .eq('section_key', key)
          .maybeSingle();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: `Section "${key}" not found` });
        return res.status(200).json({ section: data });
      }

      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      return res.status(200).json({ sections: data || [] });
    } catch (err) {
      console.error('Error fetching sections:', err);
      return res.status(500).json({ error: err.message || 'Failed to fetch sections' });
    }
  }

  // PUT: Upsert section by key
  if (req.method === 'PUT') {
    const sectionKey = key || req.body?.section_key;
    if (!sectionKey) {
      return res.status(400).json({ error: 'Section key is required.' });
    }

    try {
      const payload = { ...req.body, section_key: sectionKey };
      const validated = validate(sectionBody, payload);

      const { data, error } = await supabase
        .from('sections')
        .upsert(
          {
            ...validated,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'section_key' }
        )
        .select('*')
        .single();

      if (error) throw error;

      await auditLog(supabase, authUser.userId, 'UPDATE_SECTION', 'sections', data.id, {
        section_key: sectionKey,
        title: data.title,
      });

      return res.status(200).json({ message: 'Section updated successfully', section: data });
    } catch (err) {
      console.error('Error updating section:', err);
      return res.status(err.status || 500).json({ error: err.message || 'Failed to update section' });
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'Method Not Allowed' });
};
