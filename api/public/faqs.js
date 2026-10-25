import { handleCors } from '../../lib/cors.js';
import { getSupabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  try {
    const supabase = getSupabase();
    const { data: faqs, error } = await supabase
      .from('faqs')
      .select('id, question, answer, order_index')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return res.status(200).json({ faqs: faqs || [] });
  } catch (err) {
    console.error('Error fetching public FAQs:', err);
    return res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
}
