import { createClient } from '@supabase/supabase-js';

let cachedClient = null;

export function getSupabase() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    console.error('Missing Supabase env vars in runtime:', {
      hasUrl: Boolean(url),
      hasKey: Boolean(key),
    });
    throw new Error('Missing Supabase environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  // Clean url if user included /rest/v1/
  const cleanUrl = url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

  if (!cachedClient) {
    cachedClient = createClient(cleanUrl, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return cachedClient;
}

export const supabase = {
  from: (...args) => getSupabase().from(...args),
  storage: {
    from: (...args) => getSupabase().storage.from(...args),
  },
};
