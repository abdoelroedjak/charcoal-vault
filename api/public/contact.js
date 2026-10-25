const { handleCors } = require('../_lib/cors');
const { getSupabase } = require('../_lib/supabase');

const SINGLETON_ID = '00000000-0000-0000-0000-000000000001';

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Shorter edge cache because wrong contact details = business communication loss
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('contact_settings')
      .select('email, whatsapp, whatsapp_display, phone, instagram, linkedin, default_wa_text, cta_url')
      .eq('id', SINGLETON_ID)
      .maybeSingle();

    if (error) throw error;

    return res.status(200).json({
      contact: data || {
        email: 'charcoalvault@gmail.com',
        whatsapp: '6281294779925',
        whatsapp_display: '+62 812-9477-9925',
        default_wa_text: 'Hello Charcoal Vault, I would like to inquire about shisha charcoal supply.',
      },
    });
  } catch (err) {
    console.error('Error fetching public contact settings:', err);
    return res.status(500).json({ error: 'Failed to retrieve contact details' });
  }
};
