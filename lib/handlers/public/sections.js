import { handleCors } from '../../cors.js';
import { getSupabase } from '../../supabase.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  const { key } = req.query;

  try {
    const supabase = getSupabase();

    if (key) {
      const { data: section, error } = await supabase
        .from('sections')
        .select('*')
        .eq('section_key', key)
        .eq('is_enabled', true)
        .maybeSingle();

      if (error) throw error;
      if (!section) return res.status(404).json({ error: 'Section not found or disabled' });
      return res.status(200).json({ section });
    }

    const { data: sections, error } = await supabase
      .from('sections')
      .select('*')
      .eq('is_enabled', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    const map = {};
    (sections || []).forEach((s) => {
      map[s.section_key] = s;
    });

    return res.status(200).json({ sections: map });
  } catch (err) {
    console.error('Error fetching public sections:', err);
    return res.status(500).json({ error: 'Failed to fetch website copy' });
  }
}
