const { handleCors } = require('../_lib/cors');
const { requireAuth } = require('../_lib/auth');
const { getSupabase } = require('../_lib/supabase');
const { productBody, validate } = require('../_lib/validate');
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

  // GET: List all or single
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

      let query = supabase.from('products').select('*');
      if (req.query.status) {
        query = query.eq('status', req.query.status);
      }
      query = query.order('order_index', { ascending: true }).order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      return res.status(200).json({ products: data || [] });
    } catch (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: err.message || 'Failed to fetch products' });
    }
  }

  // POST: Create product
  if (req.method === 'POST') {
    try {
      const validated = validate(productBody, req.body || {});
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...validated,
          updated_at: new Date().toISOString(),
        })
        .select('*')
        .single();

      if (error) {
        if (error.code === '23505') {
          return res.status(409).json({ error: 'A product with this slug already exists.' });
        }
        throw error;
      }

      await auditLog(supabase, authUser.userId, 'CREATE_PRODUCT', 'products', data.id, {
        slug: data.slug,
        name: data.name,
      });

      return res.status(201).json({ message: 'Product created successfully', product: data });
    } catch (err) {
      console.error('Error creating product:', err);
      return res.status(err.status || 500).json({ error: err.message || 'Failed to create product' });
    }
  }

  // PUT: Update product
  if (req.method === 'PUT') {
    const targetId = id || req.body?.id;
    if (!targetId) {
      return res.status(400).json({ error: 'Product ID is required for updating.' });
    }

    try {
      const validated = validate(productBody, req.body || {});
      
      const { data, error } = await supabase
        .from('products')
        .update({
          ...validated,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetId)
        .select('*')
        .single();

      if (error) {
        if (error.code === '23505') {
          return res.status(409).json({ error: 'Another product with this slug already exists.' });
        }
        throw error;
      }

      await auditLog(supabase, authUser.userId, 'UPDATE_PRODUCT', 'products', targetId, {
        updatedFields: Object.keys(validated),
      });

      return res.status(200).json({ message: 'Product updated successfully', product: data });
    } catch (err) {
      console.error('Error updating product:', err);
      return res.status(err.status || 500).json({ error: err.message || 'Failed to update product' });
    }
  }

  // DELETE: Soft delete
  if (req.method === 'DELETE') {
    const targetId = id || req.body?.id;
    if (!targetId) {
      return res.status(400).json({ error: 'Product ID is required for deletion.' });
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          status: 'archived',
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetId)
        .select('*')
        .single();

      if (error) throw error;

      await auditLog(supabase, authUser.userId, 'DELETE_PRODUCT', 'products', targetId, {
        slug: data?.slug,
        name: data?.name,
      });

      return res.status(200).json({ message: 'Product archived successfully', success: true });
    } catch (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ error: err.message || 'Failed to delete product' });
    }
  }

  res.setHeader('Allow', 'GET, POST, PUT, DELETE');
  return res.status(405).json({ error: 'Method Not Allowed' });
};
