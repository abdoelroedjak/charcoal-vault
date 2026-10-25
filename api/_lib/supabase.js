const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

function getSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return supabase;
}

module.exports = {
  supabase,
  getSupabase,
};
