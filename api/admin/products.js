import { handleCors } from '../../lib/cors.js';
import { requireAuth } from '../../lib/auth.js';
import { getSupabase } from '../../lib/supabase.js';
import { productBody, productUpdateBody, validate } from '../../lib/validate.js';
import { log as auditLog } from '../../lib/audit.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  let authUser;
  try {
    authUser = await requireAuth(req);
  } catch (err) {
    return res.status(err.status || 401).json({ error: err.message });
  }

  const supabase = getSupabase();
  const { id, status } = req.query;

  if (req.method === 'GET') {
    try {
      if (id) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Product not found' });
        return res.status(200).json({ product: data });
      }

      let query = supabase.from('products').select('*').order('order_index', { ascending: true });
      if (status) query = query.eq('status', status);

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json({ products: data || [] });
    } catch (err) {
      console.error('Error in GET /api/admin/products:', err);
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const data = validate(productBody, req.body || {});
      const { data: inserted, error } = await supabase
        .from('products')
        .insert(data)
        .select('*')
        .single();

      if (error) throw error;

      await auditLog(supabase, authUser.userId, 'CREATE_PRODUCT', 'products', inserted.id, {
        after: inserted,
      });

      return res.status(201).json({ product: inserted });
    } catch (err) {
      return res.status(err.status || 400).json({ error: err.message, details: err.errors });
    }
  }

  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ error: 'Missing product ID in query parameter.' });

    try {
      const updateData = validate(productUpdateBody, req.body || {});
      const { data: before } = await supabase.from('products').select('*').eq('id', id).single();

      const { data: updated, error } = await supabase
        .from('products')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;

      await auditLog(supabase, authUser.userId, 'UPDATE_PRODUCT', 'products', id, {
        before,
        after: updated,
      });

      return res.status(200).json({ product: updated });
    } catch (err) {
      return res.status(err.status || 400).json({ error: err.message, details: err.errors });
    }
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ error: 'Missing product ID in query parameter.' });

    try {
      const { data: before } = await supabase.from('products').select('*').eq('id', id).single();

      const { data: archived, error } = await supabase
        .from('products')
        .update({
          status: 'archived',
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;

      await auditLog(supabase, authUser.userId, 'ARCHIVE_PRODUCT', 'products', id, {
        before,
        after: archived,
      });

      return res.status(200).json({ message: 'Product archived successfully', product: archived });
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Failed to archive product.' });
    }
  }

  res.setHeader('Allow', 'GET, POST, PUT, DELETE');
  return res.status(405).json({ error: 'Method Not Allowed' });
}
