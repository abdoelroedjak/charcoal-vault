const { handleCors } = require('../_lib/cors');
const { requireAuth } = require('../_lib/auth');
const { getSupabase } = require('../_lib/supabase');
const { faqBody, validate } = require('../_lib/validate');
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
  const { id } = req.query;

  // GET: List FAQs
  if (req.method === 'GET') {
    try {
      if (id) {
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'FAQ not found' });
        return res.status(200).json({ faq: data });
      }

      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .is('deleted_at', null)
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return res.status(200).json({ faqs: data || [] });
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      return res.status(500).json({ error: err.message || 'Failed to fetch FAQs' });
    }
  }

  // POST: Create FAQ
  if (req.method === 'POST') {
    try {
      const validated = validate(faqBody, req.body || {});
      const { data, error } = await supabase
        .from('faqs')
        .insert({
          ...validated,
          updated_at: new Date().toISOString(),
        })
        .select('*')
        .single();

      if (error) throw error;

      await auditLog(supabase, authUser.userId, 'CREATE_FAQ', 'faqs', data.id, {
        question: data.question,
      });

      return res.status(201).json({ message: 'FAQ created successfully', faq: data });
    } catch (err) {
      console.error('Error creating FAQ:', err);
      return res.status(err.status || 500).json({ error: err.message || 'Failed to create FAQ' });
    }
  }

  // PUT: Update FAQ
  if (req.method === 'PUT') {
    const targetId = id || req.body?.id;
    if (!targetId) {
      return res.status(400).json({ error: 'FAQ ID is required for update.' });
    }

    try {
      const validated = validate(faqBody, req.body || {});
      const { data, error } = await supabase
        .from('faqs')
        .update({
          ...validated,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetId)
        .select('*')
        .single();

      if (error) throw error;

      await auditLog(supabase, authUser.userId, 'UPDATE_FAQ', 'faqs', targetId, {
        question: data.question,
      });

      return res.status(200).json({ message: 'FAQ updated successfully', faq: data });
    } catch (err) {
      console.error('Error updating FAQ:', err);
      return res.status(err.status || 500).json({ error: err.message || 'Failed to update FAQ' });
    }
  }

  // DELETE: Soft delete
  if (req.method === 'DELETE') {
    const targetId = id || req.body?.id;
    if (!targetId) {
      return res.status(400).json({ error: 'FAQ ID is required for deletion.' });
    }

    try {
      const { data, error } = await supabase
        .from('faqs')
        .update({
          is_active: false,
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetId)
        .select('*')
        .single();

      if (error) throw error;

      await auditLog(supabase, authUser.userId, 'DELETE_FAQ', 'faqs', targetId, {
        question: data?.question,
      });

      return res.status(200).json({ message: 'FAQ deleted successfully', success: true });
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      return res.status(500).json({ error: err.message || 'Failed to delete FAQ' });
    }
  }

  res.setHeader('Allow', 'GET, POST, PUT, DELETE');
  return res.status(405).json({ error: 'Method Not Allowed' });
};
