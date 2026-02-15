import { supabaseAdmin } from '../../../../lib/supabase/admin';
import { SchoolReviewSubmissionSchema, formatZodErrors } from '../../../../lib/validation/submission-schemas';
import { resendClient } from '../../../../lib/email/resend-client';
import { getVerificationEmail } from '../../../../lib/email/templates';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = SchoolReviewSubmissionSchema.safeParse(body);
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

    // Verify school exists
    const { data: school, error: schoolError } = await supabaseAdmin
      .from('schools')
      .select('id, name')
      .eq('id', data.school_id)
      .single();

    if (schoolError || !school) {
      return Response.json({ error: 'School not found' }, { status: 404 });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create parent submission record
    const { data: submission, error: submissionError } = await supabaseAdmin
      .from('user_submissions')
      .insert({
        submission_type: 'school_review',
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

    // Create school review record
    const { error: reviewError } = await supabaseAdmin
      .from('school_reviews')
      .insert({
        submission_id: submission.id,
        school_id: data.school_id,
        overall_rating: data.overall_rating,
        years_taught: data.years_taught,
        position: data.position,
        contract_type: data.contract_type,
        admin_responsiveness: data.admin_responsiveness,
        teacher_community: data.teacher_community,
        professional_development_opportunities: data.professional_development_opportunities,
        work_life_balance: data.work_life_balance,
        pros: data.pros,
        cons: data.cons,
        advice_for_teachers: data.advice_for_teachers,
        reported_salary_min: data.reported_salary_min,
        reported_salary_max: data.reported_salary_max,
        salary_currency: data.salary_currency,
      });

    if (reviewError) {
      console.error('Review creation error:', reviewError);
      // Rollback parent submission
      await supabaseAdmin.from('user_submissions').delete().eq('id', submission.id);
      return Response.json({ error: 'Failed to create review' }, { status: 500 });
    }

    // Send verification email
    try {
      const emailTemplate = getVerificationEmail(
        data.submitter_email,
        verificationToken,
        'school_review',
        city.name
      );

      await resendClient.emails.send(emailTemplate);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the submission if email fails - admin can manually verify
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
    message: 'School Review Submission API',
    version: '1.0.0',
    method: 'POST',
    authentication: 'None required for submission, email verification required'
  });
}
