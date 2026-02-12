import { createClient } from '@supabase/supabase-js';

let _client = null;

function getClient() {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }
  return _client;
}

// Lazy proxy — only creates the Supabase client when first accessed at runtime,
// not at import/build time (prevents build failures when env vars aren't set)
export const supabaseAdmin = new Proxy({}, {
  get(_, prop) {
    return getClient()[prop];
  }
});
