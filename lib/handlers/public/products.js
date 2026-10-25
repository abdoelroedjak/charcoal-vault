import { handleCors } from '../../cors.js';
import { getSupabase } from '../../supabase.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  try {
    const supabase = getSupabase();
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ error: 'Database query error', details: error.message });
    }
    return res.status(200).json({ products: products || [] });
  } catch (err) {
    console.error('Error fetching public products:', err);
    return res.status(500).json({ error: 'Failed to fetch catalog products', details: err.message });
  }
}
