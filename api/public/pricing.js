const { handleCors } = require('../_lib/cors');
const { getSupabase } = require('../_lib/supabase');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Short edge cache to guarantee freshness on market fluctuations
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');

  try {
    const supabase = getSupabase();

    const { data: rows, error } = await supabase
      .from('pricing')
      .select('id, shipping_term, packaging, price_per_mt, currency, moq_tons, effective_date, notes')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('shipping_term', { ascending: true })
      .order('price_per_mt', { ascending: true });

    if (error) throw error;

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        available: false,
        message: 'Contact us for current pricing.',
        pricing: [],
      });
    }

    // Structure grouped by shipping_term (EXW / FOB)
    const terms = {
      EXW: rows.filter((r) => r.shipping_term === 'EXW'),
      FOB: rows.filter((r) => r.shipping_term === 'FOB'),
    };

    return res.status(200).json({
      available: true,
      currency: 'USD',
      unit: 'MT',
      pricing: rows,
      terms,
    });
  } catch (err) {
    console.error('Error fetching public pricing:', err);
    return res.status(500).json({
      available: false,
      message: 'Contact us for current pricing.',
    });
  }
};
