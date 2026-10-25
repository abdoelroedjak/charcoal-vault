import { handleCors } from '../../cors.js';
import { getSupabase } from '../../supabase.js';

const SINGLETON_ID = '00000000-0000-0000-0000-000000000001';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');

  try {
    const supabase = getSupabase();
    const { data: contact, error } = await supabase
      .from('contact_settings')
      .select('email, whatsapp, whatsapp_display, phone, instagram, linkedin, default_wa_text, cta_url')
      .eq('id', SINGLETON_ID)
      .maybeSingle();

    if (error) throw error;
    return res.status(200).json({ contact: contact || {} });
  } catch (err) {
    console.error('Error fetching public contact:', err);
    return res.status(500).json({ error: 'Failed to fetch contact channels' });
  }
}
