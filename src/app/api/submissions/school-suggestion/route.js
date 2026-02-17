import { supabaseAdmin } from '../../../../lib/supabase/admin';
import { SchoolSuggestionSchema, formatZodErrors } from '../../../../lib/validation/submission-schemas';
import { resendClient } from '../../../../lib/email/resend-client';
import { getVerificationEmail } from '../../../../lib/email/templates';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = SchoolSuggestionSchema.safeParse(body);
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
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create parent submission record
    const { data: submission, error: submissionError } = await supabaseAdmin
      .from('user_submissions')
      .insert({
        submission_type: 'school_suggestion',
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

    // Create school suggestion record
    const { error: suggestionError } = await supabaseAdmin
      .from('school_suggestions')
      .insert({
        submission_id: submission.id,
        city_id: data.city_id,
        school_name: data.school_name,
        school_type: data.school_type,
        school_website: data.school_website,
        school_district: data.school_district,
      });

    if (suggestionError) {
      console.error('School suggestion creation error:', suggestionError);
      await supabaseAdmin.from('user_submissions').delete().eq('id', submission.id);
      return Response.json({ error: 'Failed to create school suggestion' }, { status: 500 });
    }

    // Create the linked school review (school_id is null — will be linked when school is approved)
    const { error: reviewError } = await supabaseAdmin
      .from('school_reviews')
      .insert({
        submission_id: submission.id,
        school_id: null,
        overall_rating: data.overall_rating,
        years_taught: data.years_taught,
        position: data.position,
        contract_type: data.contract_type,
        role_level: data.role_level,
        admin_responsiveness: data.admin_responsiveness,
        teacher_community: data.teacher_community,
        professional_development_opportunities: data.professional_development_opportunities,
        work_life_balance: data.work_life_balance,
        pros: data.pros,
        cons: data.cons,
        advice_for_teachers: data.advice_for_teachers,
        reported_monthly_salary: data.reported_monthly_salary,
        housing_type: data.housing_type,
        housing_stipend_amount: data.housing_stipend_amount,
        insurance_type: data.insurance_type,
        tuition_covered: data.tuition_covered,
        tuition_percentage: data.tuition_percentage,
        tuition_kids_covered: data.tuition_kids_covered,
        flight_type: data.flight_type,
        flight_amount: data.flight_amount,
      });

    if (reviewError) {
      console.error('Review creation error:', reviewError);
      // Rollback
      await supabaseAdmin.from('school_suggestions').delete().eq('submission_id', submission.id);
      await supabaseAdmin.from('user_submissions').delete().eq('id', submission.id);
      return Response.json({ error: 'Failed to create review' }, { status: 500 });
    }

    // Send verification email
    try {
      const emailTemplate = getVerificationEmail(
        data.submitter_email,
        verificationToken,
        'school_suggestion',
        city.name
      );

      await resendClient.emails.send(emailTemplate);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    return Response.json({
      success: true,
      message: 'School suggestion and review received! Please check your email to verify.',
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
    message: 'School Suggestion Submission API',
    version: '1.0.0',
    method: 'POST',
    authentication: 'None required for submission, email verification required'
  });
}
