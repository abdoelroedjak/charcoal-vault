const { handleCors } = require('../_lib/cors');
const { requireAuth } = require('../_lib/auth');
const { getSupabase } = require('../_lib/supabase');
const { pricingBody, validate } = require('../_lib/validate');
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

  // GET: List all pricing rows
  if (req.method === 'GET') {
    try {
      if (id) {
        const { data, error } = await supabase
          .from('pricing')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Pricing row not found' });
        return res.status(200).json({ pricing: data });
      }

      const { data, error } = await supabase
        .from('pricing')
        .select('*')
        .order('shipping_term', { ascending: true })
        .order('price_per_mt', { ascending: true });

      if (error) throw error;
      return res.status(200).json({ pricing: data || [] });
    } catch (err) {
      console.error('Error fetching pricing:', err);
      return res.status(500).json({ error: err.message || 'Failed to fetch pricing' });
    }
  }

  // POST: Create pricing option
  if (req.method === 'POST') {
    try {
      const validated = validate(pricingBody, req.body || {});
      const { data, error } = await supabase
        .from('pricing')
        .insert({
          ...validated,
          updated_at: new Date().toISOString(),
        })
        .select('*')
        .single();

      if (error) throw error;

      // CRITICAL: Pricing changes audit log
      await auditLog(supabase, authUser.userId, 'CREATE_PRICING', 'pricing', data.id, {
        shipping_term: data.shipping_term,
        packaging: data.packaging,
        price_per_mt: data.price_per_mt,
        currency: data.currency,
        effective_date: data.effective_date,
      });

      return res.status(201).json({ message: 'Pricing option created successfully', pricing: data });
    } catch (err) {
      console.error('Error creating pricing option:', err);
      return res.status(err.status || 500).json({ error: err.message || 'Failed to create pricing' });
    }
  }

  // PUT: Update pricing with before/after diff audit
  if (req.method === 'PUT') {
    const targetId = id || req.body?.id;
    if (!targetId) {
      return res.status(400).json({ error: 'Pricing ID is required for update.' });
    }

    try {
      // 1. Fetch old state for before/after diff
      const { data: beforeData, error: fetchError } = await supabase
        .from('pricing')
        .select('*')
        .eq('id', targetId)
        .maybeSingle();

      if (fetchError || !beforeData) {
        return res.status(404).json({ error: 'Existing pricing record not found.' });
      }

      const validated = validate(pricingBody, req.body || {});

      // 2. Perform update
      const { data: updatedData, error: updateError } = await supabase
        .from('pricing')
        .update({
          ...validated,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetId)
        .select('*')
        .single();

      if (updateError) throw updateError;

      // 3. Record audit log with exact before/after diff
      await auditLog(supabase, authUser.userId, 'UPDATE_PRICING', 'pricing', targetId, {
        before: {
          shipping_term: beforeData.shipping_term,
          packaging: beforeData.packaging,
          price_per_mt: beforeData.price_per_mt,
          is_active: beforeData.is_active,
        },
        after: {
          shipping_term: updatedData.shipping_term,
          packaging: updatedData.packaging,
          price_per_mt: updatedData.price_per_mt,
          is_active: updatedData.is_active,
        },
        price_diff: updatedData.price_per_mt - beforeData.price_per_mt,
      });

      return res.status(200).json({ message: 'Pricing updated successfully', pricing: updatedData });
    } catch (err) {
      console.error('Error updating pricing:', err);
      return res.status(err.status || 500).json({ error: err.message || 'Failed to update pricing' });
    }
  }

  // DELETE: Soft delete
  if (req.method === 'DELETE') {
    const targetId = id || req.body?.id;
    if (!targetId) {
      return res.status(400).json({ error: 'Pricing ID is required for deletion.' });
    }

    try {
      const { data, error } = await supabase
        .from('pricing')
        .update({
          is_active: false,
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetId)
        .select('*')
        .single();

      if (error) throw error;

      await auditLog(supabase, authUser.userId, 'DELETE_PRICING', 'pricing', targetId, {
        shipping_term: data?.shipping_term,
        packaging: data?.packaging,
        price_per_mt: data?.price_per_mt,
      });

      return res.status(200).json({ message: 'Pricing option archived successfully', success: true });
    } catch (err) {
      console.error('Error deleting pricing:', err);
      return res.status(500).json({ error: err.message || 'Failed to delete pricing' });
    }
  }

  res.setHeader('Allow', 'GET, POST, PUT, DELETE');
  return res.status(405).json({ error: 'Method Not Allowed' });
};
