import { Resend } from 'resend';

let _client = null;

function getClient() {
  if (!_client) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured in environment variables');
    }
    _client = new Resend(process.env.RESEND_API_KEY);
  }
  return _client;
}

// Lazy proxy pattern (mirrors supabaseAdmin pattern)
// Only creates client when first accessed
export const resendClient = new Proxy({}, {
  get(_, prop) {
    return getClient()[prop];
  }
});
