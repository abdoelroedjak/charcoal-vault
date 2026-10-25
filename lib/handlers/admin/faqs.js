import { handleCors } from '../../cors.js';
import { requireAuth } from '../../auth.js';
import { getSupabase } from '../../supabase.js';
import { faqBody, faqUpdateBody, validate } from '../../validate.js';
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
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .is('deleted_at', null)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return res.status(200).json({ faqs: data || [] });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const data = validate(faqBody, req.body || {});
      const { data: inserted, error } = await supabase
        .from('faqs')
        .insert(data)
        .select('*')
        .single();

      if (error) throw error;

      await auditLog(supabase, authUser.userId, 'CREATE_FAQ', 'faqs', inserted.id, {
        after: inserted,
      });

      return res.status(201).json({ faq: inserted });
    } catch (err) {
      return res.status(err.status || 400).json({ error: err.message, details: err.errors });
    }
  }

  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ error: 'FAQ ID required in query.' });

    try {
      const data = validate(faqUpdateBody, req.body || {});
      const { data: before } = await supabase.from('faqs').select('*').eq('id', id).single();

      const { data: updated, error } = await supabase
        .from('faqs')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;

      await auditLog(supabase, authUser.userId, 'UPDATE_FAQ', 'faqs', id, {
        before,
        after: updated,
      });

      return res.status(200).json({ faq: updated });
    } catch (err) {
      return res.status(err.status || 400).json({ error: err.message, details: err.errors });
    }
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ error: 'FAQ ID required in query.' });

    try {
      const { data: before } = await supabase.from('faqs').select('*').eq('id', id).single();

      const { data: archived, error } = await supabase
        .from('faqs')
        .update({
          is_active: false,
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;

      await auditLog(supabase, authUser.userId, 'ARCHIVE_FAQ', 'faqs', id, {
        before,
      });

      return res.status(200).json({ message: 'FAQ archived', faq: archived });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.setHeader('Allow', 'GET, POST, PUT, DELETE');
  return res.status(405).json({ error: 'Method Not Allowed' });
}
