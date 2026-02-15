import { supabaseAdmin } from '../../../../lib/supabase/admin';
import { LocalIntelSubmissionSchema, formatZodErrors } from '../../../../lib/validation/submission-schemas';
import { resendClient } from '../../../../lib/email/resend-client';
import { getVerificationEmail } from '../../../../lib/email/templates';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const body = await request.json();

    const validation = LocalIntelSubmissionSchema.safeParse(body);
    if (!validation.success) {
      return Response.json({
        error: 'Validation failed',
        details: formatZodErrors(validation.error)
      }, { status: 400 });
    }

    const data = validation.data;

    // Verify city exists
    const { data: city, error: cityError } = await supabaseAdmin
      .from('cities')
      .select('id, name')
      .eq('id', data.city_id)
      .single();

    if (cityError || !city) {
      return Response.json({ error: 'City not found' }, { status: 404 });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create parent submission
    const { data: submission, error: submissionError } = await supabaseAdmin
      .from('user_submissions')
      .insert({
        submission_type: 'local_intel',
        city_id: data.city_id,
        submitter_email: data.submitter_email,
        verification_token: verificationToken,
        verification_expires_at: verificationExpiry.toISOString(),
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Submission creation error:', submissionError);
      return Response.json({ error: 'Failed to create submission' }, { status: 500 });
    }

    // Create local intel record
    const { error: intelError } = await supabaseAdmin
      .from('local_intel_submissions')
      .insert({
        submission_id: submission.id,
        city_id: data.city_id,
        category: data.category,
        tip_text: data.tip_text,
      });

    if (intelError) {
      console.error('Intel creation error:', intelError);
      await supabaseAdmin.from('user_submissions').delete().eq('id', submission.id);
      return Response.json({ error: 'Failed to create intel submission' }, { status: 500 });
    }

    // Send verification email
    try {
      const emailTemplate = getVerificationEmail(
        data.submitter_email,
        verificationToken,
        'local_intel',
        city.name
      );
      await resendClient.emails.send(emailTemplate);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    return Response.json({
      success: true,
      message: 'Submission received! Please check your email to verify.',
      submission_id: submission.id,
    }, { status: 201 });

  } catch (error) {
    console.error('Submission API error:', error);
    return Response.json({
      error: 'Internal server error',
      message: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    message: 'Local Intel Submission API',
    version: '1.0.0',
    method: 'POST',
    authentication: 'None required for submission, email verification required'
  });
}
