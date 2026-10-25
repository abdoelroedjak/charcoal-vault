import { handleCors } from '../../lib/cors.js';
import { requireAuth } from '../../lib/auth.js';
import { getSupabase } from '../../lib/supabase.js';
import { pricingBody, pricingUpdateBody, validate } from '../../lib/validate.js';
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
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('pricing')
        .select('*')
        .is('deleted_at', null)
        .order('shipping_term', { ascending: true })
        .order('price_per_mt', { ascending: true });

      if (error) throw error;
      return res.status(200).json({ pricing: data || [] });
    } catch (err) {
      console.error('Error fetching admin pricing:', err);
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const data = validate(pricingBody, req.body || {});
      const { data: inserted, error } = await supabase
        .from('pricing')
        .insert(data)
        .select('*')
        .single();

      if (error) throw error;

      await auditLog(supabase, authUser.userId, 'CREATE_PRICING', 'pricing', inserted.id, {
        after: inserted,
      });

      return res.status(201).json({ pricing: inserted });
    } catch (err) {
      return res.status(err.status || 400).json({ error: err.message, details: err.errors });
    }
  }

  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ error: 'Missing pricing option ID in query.' });

    try {
      const updateData = validate(pricingUpdateBody, req.body || {});
      const { data: before } = await supabase.from('pricing').select('*').eq('id', id).single();

      const { data: updated, error } = await supabase
        .from('pricing')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;

      await auditLog(supabase, authUser.userId, 'UPDATE_PRICING', 'pricing', id, {
        before,
        after: updated,
        diff: {
          priceChanged: before.price_per_mt !== updated.price_per_mt,
          oldPrice: before.price_per_mt,
          newPrice: updated.price_per_mt,
        },
      });

      return res.status(200).json({ pricing: updated });
    } catch (err) {
      return res.status(err.status || 400).json({ error: err.message, details: err.errors });
    }
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ error: 'Missing pricing option ID in query.' });

    try {
      const { data: before } = await supabase.from('pricing').select('*').eq('id', id).single();

      const { data: archived, error } = await supabase
        .from('pricing')
        .update({
          is_active: false,
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;

      await auditLog(supabase, authUser.userId, 'ARCHIVE_PRICING', 'pricing', id, {
        before,
        after: archived,
      });

      return res.status(200).json({ message: 'Pricing row archived', pricing: archived });
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Failed to archive pricing option.' });
    }
  }

  res.setHeader('Allow', 'GET, POST, PUT, DELETE');
  return res.status(405).json({ error: 'Method Not Allowed' });
}
