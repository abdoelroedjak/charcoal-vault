import { handleCors } from '../../cors.js';
import { requireAuth } from '../../auth.js';
import { getSupabase } from '../../supabase.js';
import { sectionBody, sectionUpdateBody, validate } from '../../validate.js';
import { log as auditLog } from '../../audit.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  let authUser;
  try {
    authUser = await requireAuth(req);
  } catch (err) {
    return res.status(err.status || 401).json({ error: err.message });
  }

  const supabase = getSupabase();
  const { key } = req.query;

  if (req.method === 'GET') {
    try {
      if (key) {
        const { data, error } = await supabase
          .from('sections')
          .select('*')
          .eq('section_key', key)
          .maybeSingle();
        if (error) throw error;
        return res.status(200).json({ section: data });
      }

      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      return res.status(200).json({ sections: data || [] });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'PUT') {
    const targetKey = key || req.body?.section_key;
    if (!targetKey) return res.status(400).json({ error: 'Section key is required.' });

    try {
      const data = validate(sectionUpdateBody, req.body || {});
      const { data: before } = await supabase
        .from('sections')
        .select('*')
        .eq('section_key', targetKey)
        .maybeSingle();

      const { data: updated, error } = await supabase
        .from('sections')
        .upsert(
          {
            section_key: targetKey,
            ...data,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'section_key' }
        )
        .select('*')
        .single();

      if (error) throw error;

      await auditLog(supabase, authUser.userId, 'UPDATE_SECTION', 'sections', updated.id, {
        key: targetKey,
        before,
        after: updated,
      });

      return res.status(200).json({ section: updated });
    } catch (err) {
      return res.status(err.status || 400).json({ error: err.message, details: err.errors });
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'Method Not Allowed' });
}
