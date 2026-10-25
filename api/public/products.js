const { handleCors } = require('../_lib/cors');
const { getSupabase } = require('../_lib/supabase');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Set caching headers for edge network
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  try {
    const supabase = getSupabase();
    const { slug } = req.query;

    if (slug) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .is('deleted_at', null)
        .maybeSingle();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json({ product: data });
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.status(200).json({ products: data || [] });
  } catch (err) {
    console.error('Error fetching public products:', err);
    return res.status(500).json({ error: 'Failed to retrieve products' });
  }
};
