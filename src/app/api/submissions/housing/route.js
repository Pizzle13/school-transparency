import { supabaseAdmin } from '../../../../lib/supabase/admin';
import { HousingSubmissionSchema, formatZodErrors } from '../../../../lib/validation/submission-schemas';
import { resendClient } from '../../../../lib/email/resend-client';
import { getVerificationEmail } from '../../../../lib/email/templates';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const body = await request.json();

    const validation = HousingSubmissionSchema.safeParse(body);
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
        submission_type: 'housing',
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

    // Create housing submission record
    const { error: housingError } = await supabaseAdmin
      .from('housing_submissions')
      .insert({
        submission_id: submission.id,
        city_id: data.city_id,
        area_name: data.area_name,
        rent_1br: data.rent_1br,
        rent_2br: data.rent_2br,
        rent_3br: data.rent_3br,
        currency: data.currency,
        neighborhood_vibe: data.neighborhood_vibe,
        commute_to_schools: data.commute_to_schools,
        safety_rating: data.safety_rating,
        expat_friendly_rating: data.expat_friendly_rating,
      });

    if (housingError) {
      console.error('Housing creation error:', housingError);
      await supabaseAdmin.from('user_submissions').delete().eq('id', submission.id);
      return Response.json({ error: 'Failed to create housing submission' }, { status: 500 });
    }

    // Send verification email
    try {
      const emailTemplate = getVerificationEmail(
        data.submitter_email,
        verificationToken,
        'housing',
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
    message: 'Housing Submission API',
    version: '1.0.0',
    method: 'POST'
  });
}
