import { supabaseAdmin } from '../../../../lib/supabase/admin';
import { SalarySubmissionSchema, formatZodErrors } from '../../../../lib/validation/submission-schemas';
import { resendClient } from '../../../../lib/email/resend-client';
import { getVerificationEmail } from '../../../../lib/email/templates';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const body = await request.json();

    const validation = SalarySubmissionSchema.safeParse(body);
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

    // Verify school exists (if provided)
    if (data.school_id) {
      const { data: school, error: schoolError } = await supabaseAdmin
        .from('schools')
        .select('id')
        .eq('id', data.school_id)
        .single();

      if (schoolError || !school) {
        return Response.json({ error: 'School not found' }, { status: 404 });
      }
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create parent submission
    const { data: submission, error: submissionError } = await supabaseAdmin
      .from('user_submissions')
      .insert({
        submission_type: 'salary',
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

    // Create salary submission record
    const { error: salaryError } = await supabaseAdmin
      .from('salary_submissions')
      .insert({
        submission_id: submission.id,
        city_id: data.city_id,
        school_id: data.school_id || null,
        position: data.position,
        years_experience: data.years_experience,
        salary_amount: data.salary_amount,
        currency: data.currency,
        housing_provided: data.housing_provided,
        flight_allowance: data.flight_allowance,
        health_insurance: data.health_insurance,
        tuition_discount: data.tuition_discount,
        contract_type: data.contract_type,
        qualifications: data.qualifications,
      });

    if (salaryError) {
      console.error('Salary creation error:', salaryError);
      await supabaseAdmin.from('user_submissions').delete().eq('id', submission.id);
      return Response.json({ error: 'Failed to create salary submission' }, { status: 500 });
    }

    // Send verification email
    try {
      const emailTemplate = getVerificationEmail(
        data.submitter_email,
        verificationToken,
        'salary',
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
    message: 'Salary Submission API',
    version: '1.0.0',
    method: 'POST'
  });
}
