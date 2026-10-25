const { handleCors } = require('../_lib/cors');
const { getSupabase } = require('../_lib/supabase');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  try {
    const supabase = getSupabase();
    const { key } = req.query;

    if (key) {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('section_key', key)
        .eq('is_enabled', true)
        .maybeSingle();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: `Section "${key}" not found` });
      return res.status(200).json({ section: data });
    }

    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .eq('is_enabled', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    // Convert array to a keyed dictionary for quick lookup by frontend
    const sectionMap = {};
    (data || []).forEach((sec) => {
      sectionMap[sec.section_key] = sec;
    });

    return res.status(200).json({
      sections: data || [],
      byKey: sectionMap,
    });
  } catch (err) {
    console.error('Error fetching public sections:', err);
    return res.status(500).json({ error: 'Failed to retrieve site sections' });
  }
};
