import { handleCors } from '../../lib/cors.js';
import { getSupabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');

  try {
    const supabase = getSupabase();
    const { data: rows, error } = await supabase
      .from('pricing')
      .select('*')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('price_per_mt', { ascending: true });

    if (error) throw error;

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        available: false,
        message: 'Contact us for current pricing.',
        pricing: [],
      });
    }

    const exwOptions = rows.filter((r) => r.shipping_term === 'EXW');
    const fobOptions = rows.filter((r) => r.shipping_term === 'FOB');

    return res.status(200).json({
      available: true,
      currency: 'USD',
      unit: 'MT',
      unitLabel: 'Metric Ton (1,000 kg)',
      moq: '18 MT',
      lastUpdated: rows[0]?.updated_at || new Date().toISOString(),
      disclaimer:
        'Prices are supplier-based reference rates subject to market raw material changes. Binding quotes confirmed via official inquiry.',
      terms: {
        EXW: {
          label: 'EXW',
          description: 'Ex Works — buyer arranges pickup and container shipping',
          options: exwOptions,
        },
        FOB: {
          label: 'FOB',
          description: 'Free on Board — price includes vessel port loading',
          options: fobOptions,
        },
      },
    });
  } catch (err) {
    console.error('Error fetching public pricing:', err);
    return res.status(200).json({
      available: false,
      message: 'Contact us for current pricing.',
      pricing: [],
    });
  }
}
