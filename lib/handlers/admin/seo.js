import { handleCors } from '../../cors.js';
import { requireAuth } from '../../auth.js';
import { getSupabase } from '../../supabase.js';
import { seoBody, validate } from '../../validate.js';
import { log as auditLog } from '../../audit.js';

const SINGLETON_ID = '00000000-0000-0000-0000-000000000002';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  let authUser;
  try {
    authUser = await requireAuth(req);
  } catch (err) {
    return res.status(err.status || 401).json({ error: err.message });
  }

  const supabase = getSupabase();

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('id', SINGLETON_ID)
        .maybeSingle();

      if (error) throw error;
      return res.status(200).json({ seo: data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const data = validate(seoBody, req.body || {});
      const { data: before } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('id', SINGLETON_ID)
        .maybeSingle();

      const { data: updated, error } = await supabase
        .from('seo_settings')
        .upsert(
          {
            id: SINGLETON_ID,
            ...data,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )
        .select('*')
        .single();

      if (error) throw error;

      await auditLog(supabase, authUser.userId, 'UPDATE_SEO_SETTINGS', 'seo_settings', SINGLETON_ID, {
        before,
        after: updated,
      });

      return res.status(200).json({ seo: updated });
    } catch (err) {
      return res.status(err.status || 400).json({ error: err.message, details: err.errors });
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'Method Not Allowed' });
}
