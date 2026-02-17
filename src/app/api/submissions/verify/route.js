import { supabaseAdmin } from '../../../../lib/supabase/admin';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://schooltransparency.com';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return Response.json({ error: 'Verification token required' }, { status: 400 });
    }

    // Find submission by token
    const { data: submission, error: findError } = await supabaseAdmin
      .from('user_submissions')
      .select('*')
      .eq('verification_token', token)
      .single();

    if (findError || !submission) {
      return Response.json({ error: 'Invalid or expired verification token' }, { status: 404 });
    }

    // Check if already verified
    if (submission.email_verified) {
      return Response.redirect(`${BASE_URL}/submission-verified?already=true`);
    }

    // Check if expired
    const expiryDate = new Date(submission.verification_expires_at);
    if (expiryDate < new Date()) {
      return Response.json({ error: 'Verification token has expired' }, { status: 410 });
    }

    // Mark as verified
    const { error: updateError } = await supabaseAdmin
      .from('user_submissions')
      .update({
        email_verified: true,
        verification_token: null, // Clear token after use
      })
      .eq('id', submission.id);

    if (updateError) {
      console.error('Verification update error:', updateError);
      return Response.json({ error: 'Failed to verify submission' }, { status: 500 });
    }

    // Redirect to success page
    return Response.redirect(`${BASE_URL}/submission-verified`);

  } catch (error) {
    console.error('Verification API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
