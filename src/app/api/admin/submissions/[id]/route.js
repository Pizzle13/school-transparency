import { supabaseAdmin } from '../../../../../lib/supabase/admin';
import { resendClient } from '../../../../../lib/email/resend-client';
import { getApprovalEmail, getRejectionEmail } from '../../../../../lib/email/templates';
import { revalidatePath } from 'next/cache';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Recalculate a school's blended rating from ISR baseline + approved user reviews.
 * Formula: (isr_total + sum_of_user_ratings) / (isr_count + user_count)
 */
async function recalculateSchoolRating(schoolId) {
  try {
    // Get the school's ISR baseline
    const { data: school, error: schoolError } = await supabaseAdmin
      .from('schools')
      .select('isr_rating, isr_review_count')
      .eq('id', schoolId)
      .single();

    if (schoolError || !school) {
      console.warn('Could not fetch school for rating recalculation:', schoolError);
      return;
    }

    // Get all approved user reviews with ratings for this school
    const { data: userReviews, error: reviewsError } = await supabaseAdmin
      .from('school_reviews')
      .select('overall_rating, submission_id')
      .eq('school_id', schoolId)
      .not('overall_rating', 'is', null);

    if (reviewsError) {
      console.warn('Could not fetch reviews for rating recalculation:', reviewsError);
      return;
    }

    // Filter to only approved submissions
    const approvedReviews = [];
    for (const review of userReviews || []) {
      const { data: sub } = await supabaseAdmin
        .from('user_submissions')
        .select('status')
        .eq('id', review.submission_id)
        .single();
      if (sub?.status === 'approved') {
        approvedReviews.push(review);
      }
    }

    // Calculate blended rating
    const isrRating = school.isr_rating || 0;
    const isrCount = school.isr_review_count || 0;
    const isrTotal = isrRating * isrCount;

    const userTotal = approvedReviews.reduce((sum, r) => sum + r.overall_rating, 0);
    const userCount = approvedReviews.length;

    const totalCount = isrCount + userCount;
    const blendedRating = totalCount > 0
      ? Math.round((isrTotal + userTotal) / totalCount * 10) / 10
      : 0;

    // Update the school's display rating
    await supabaseAdmin
      .from('schools')
      .update({
        rating: blendedRating,
        reviews: totalCount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', schoolId);

    console.log(`Recalculated rating for school ${schoolId}: ${blendedRating}/10 (${totalCount} reviews: ${isrCount} ISR + ${userCount} user)`);
  } catch (err) {
    console.error('Rating recalculation failed:', err);
  }
}

/**
 * Recalculate city-level salary breakdown from approved school_reviews.
 * Maps role_level → salary_data columns (entry_level, mid_level, senior_level).
 * Values stored as annual USD.
 */
async function recalculateCitySalaryData(cityId) {
  try {
    // Get all approved school reviews with salary data for this city
    const { data: reviews, error: reviewsError } = await supabaseAdmin
      .from('school_reviews')
      .select('role_level, reported_monthly_salary, reported_salary_min, reported_salary_max, submission_id, school_id')
      .not('role_level', 'is', null);

    if (reviewsError) {
      console.warn('Could not fetch reviews for salary recalculation:', reviewsError);
      return;
    }

    // Filter to approved submissions for schools in this city
    const cityReviews = [];
    for (const review of reviews || []) {
      // Check school belongs to this city
      if (review.school_id) {
        const { data: school } = await supabaseAdmin
          .from('schools')
          .select('city_id')
          .eq('id', review.school_id)
          .single();
        if (!school || school.city_id !== cityId) continue;
      }

      // Check submission is approved
      const { data: sub } = await supabaseAdmin
        .from('user_submissions')
        .select('status')
        .eq('id', review.submission_id)
        .single();
      if (sub?.status === 'approved') {
        cityReviews.push(review);
      }
    }

    if (cityReviews.length === 0) return;

    // Group by role_level and compute average annual salary
    const roleMap = { classroom_teacher: 'entry_level', teacher_leader: 'mid_level', senior_leadership: 'senior_level' };
    const updates = {};

    for (const [roleLevel, column] of Object.entries(roleMap)) {
      const matching = cityReviews.filter(r => r.role_level === roleLevel);
      if (matching.length === 0) continue;

      const annualSalaries = matching.map(r => {
        if (r.reported_monthly_salary) return r.reported_monthly_salary * 12;
        if (r.reported_salary_min && r.reported_salary_max) return (r.reported_salary_min + r.reported_salary_max) / 2;
        return null;
      }).filter(Boolean);

      if (annualSalaries.length > 0) {
        updates[column] = Math.round(annualSalaries.reduce((a, b) => a + b, 0) / annualSalaries.length);
      }
    }

    if (Object.keys(updates).length === 0) return;

    updates.sample_size = cityReviews.length;

    const { error: updateError } = await supabaseAdmin
      .from('salary_data')
      .update(updates)
      .eq('city_id', cityId);

    if (updateError) {
      console.warn('Salary data update failed:', updateError);
    } else {
      console.log(`Recalculated salary data for city ${cityId}:`, updates);
    }
  } catch (err) {
    console.error('Salary recalculation failed:', err);
  }
}

/**
 * Recalculate a school's salary_range, salary_min, salary_max from approved reviews.
 * Blends ISR pipeline data with user-submitted salary reports.
 */
async function recalculateSchoolSalary(schoolId) {
  try {
    const { data: reviews, error } = await supabaseAdmin
      .from('school_reviews')
      .select('reported_monthly_salary, reported_salary_min, reported_salary_max, submission_id, created_at')
      .eq('school_id', schoolId);

    if (error || !reviews) return;

    // Filter to approved reviews with salary data
    const withSalary = [];
    for (const r of reviews) {
      if (!r.reported_monthly_salary && !r.reported_salary_min) continue;
      const { data: sub } = await supabaseAdmin
        .from('user_submissions')
        .select('status')
        .eq('id', r.submission_id)
        .single();
      if (sub?.status === 'approved') withSalary.push(r);
    }

    if (withSalary.length === 0) return;

    // Compute annual salary range from user reports
    const annualMins = [];
    const annualMaxes = [];
    for (const r of withSalary) {
      if (r.reported_monthly_salary) {
        // Single monthly figure — use as both min and max
        annualMins.push(r.reported_monthly_salary * 12);
        annualMaxes.push(r.reported_monthly_salary * 12);
      } else if (r.reported_salary_min && r.reported_salary_max) {
        annualMins.push(r.reported_salary_min);
        annualMaxes.push(r.reported_salary_max);
      }
    }

    if (annualMins.length === 0) return;

    const salaryMin = Math.round(Math.min(...annualMins));
    const salaryMax = Math.round(Math.max(...annualMaxes));
    const salaryRange = `$${Math.round(salaryMin / 1000)}K - $${Math.round(salaryMax / 1000)}K`;

    await supabaseAdmin
      .from('schools')
      .update({
        salary_min: salaryMin,
        salary_max: salaryMax,
        salary_range: salaryRange,
        updated_at: new Date().toISOString(),
      })
      .eq('id', schoolId);

    console.log(`Recalculated salary for school ${schoolId}: ${salaryRange} (${withSalary.length} reports)`);
  } catch (err) {
    console.error('School salary recalculation failed:', err);
  }
}

/**
 * Re-synthesize a school's summary, pros, and cons using AI.
 * Blends ISR baseline with approved user reviews, weighting newer reviews higher.
 * Only runs when there are user reviews with written content (pros/cons).
 */
async function resynthesizeSchoolSummary(schoolId) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.warn('ANTHROPIC_API_KEY not set — skipping summary re-synthesis');
      return;
    }

    // Get current school data (ISR baseline lives in summary/pros/cons)
    const { data: school, error: schoolError } = await supabaseAdmin
      .from('schools')
      .select('name, summary, pros, cons, isr_rating, isr_review_count')
      .eq('id', schoolId)
      .single();

    if (schoolError || !school) return;

    // Get all approved user reviews with written content, ordered newest first
    const { data: allReviews, error: reviewsError } = await supabaseAdmin
      .from('school_reviews')
      .select('pros, cons, advice_for_teachers, overall_rating, position, years_taught, created_at, submission_id')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false });

    if (reviewsError || !allReviews) return;

    const approvedReviews = [];
    for (const r of allReviews) {
      const { data: sub } = await supabaseAdmin
        .from('user_submissions')
        .select('status')
        .eq('id', r.submission_id)
        .single();
      if (sub?.status === 'approved') approvedReviews.push(r);
    }

    // Only re-synthesize if there are reviews with written content
    const withWritten = approvedReviews.filter(r => r.pros || r.cons || r.advice_for_teachers);
    if (withWritten.length === 0) return;

    // Build the prompt with recency weighting
    const reviewsText = approvedReviews.map((r, i) => {
      const age = i === 0 ? 'MOST RECENT' : i < 3 ? 'RECENT' : 'OLDER';
      return `[${age}] ${r.position || 'Teacher'}, ${r.years_taught || '?'} years, rated ${r.overall_rating}/10 (${r.created_at?.slice(0, 10)})
  Pros: ${r.pros || '(none)'}
  Cons: ${r.cons || '(none)'}
  Advice: ${r.advice_for_teachers || '(none)'}`;
    }).join('\n\n');

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `You are updating the profile for "${school.name}", an international school.

CURRENT BASELINE (from aggregated historical reviews):
Summary: ${school.summary || '(empty)'}
What Teachers Love: ${school.pros || '(empty)'}
Common Concerns: ${school.cons || '(empty)'}

TEACHER REVIEWS (newest first — weight recent reviews MORE heavily):
${reviewsText}

ISR baseline: ${school.isr_review_count || 0} historical reviews. User reviews: ${approvedReviews.length}.

Rules:
- Blend the baseline with user reviews. Recent reviews carry more weight than older ones.
- If a school is improving (recent reviews more positive than baseline), reflect that shift — the school deserves credit for getting better.
- If recent reviews confirm old problems, keep those concerns but note they persist.
- Write in third person, factual, teacher-focused tone. No marketing language.
- Never reference ISR, data sources, or review counts. Write as synthesized teacher feedback.
- Keep each field to 2-4 sentences max. Be specific, not generic.
- summary: What this school is and what it's like to work there.
- pros: Specific things teachers consistently praise.
- cons: Specific concerns that come up across multiple reviews. Don't pile on from one person.

Respond with ONLY valid JSON, no markdown:
{"summary": "...", "pros": "...", "cons": "..."}`
      }]
    });

    let responseText = message.content[0].text.trim();
    if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    let updates;
    try {
      updates = JSON.parse(responseText);
    } catch {
      console.warn('AI returned invalid JSON for school summary re-synthesis');
      return;
    }

    if (!updates.summary && !updates.pros && !updates.cons) return;

    await supabaseAdmin
      .from('schools')
      .update({
        ...(updates.summary && { summary: updates.summary }),
        ...(updates.pros && { pros: updates.pros }),
        ...(updates.cons && { cons: updates.cons }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', schoolId);

    console.log(`Re-synthesized summary for school ${schoolId} (${approvedReviews.length} user reviews blended)`);
  } catch (err) {
    console.error('School summary re-synthesis failed:', err);
  }
}

function checkAdminAuth(request) {
  const authHeader = request.headers.get('authorization');
  const password = process.env.ADMIN_PASSWORD;
  return authHeader?.replace('Bearer ', '') === password;
}

export async function PATCH(request, { params }) {
  try {
    if (!checkAdminAuth(request)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, rejection_reason } = body; // action: 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Get submission details
    const { data: submission, error: fetchError } = await supabaseAdmin
      .from('user_submissions')
      .select(`
        *,
        cities(name, slug),
        school_reviews(id, school_id, schools(name)),
        school_suggestions(id, school_name, school_type, school_website, school_district, city_id),
        local_intel_submissions(id, category, tip_text),
        housing_submissions(id, area_name),
        salary_submissions(id, position)
      `)
      .eq('id', id)
      .single();

    if (fetchError || !submission) {
      return Response.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (action === 'approve') {
      // Update submission status
      const { error: updateError } = await supabaseAdmin
        .from('user_submissions')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'admin',
        })
        .eq('id', id);

      if (updateError) {
        console.error('Update error:', updateError);
        return Response.json({ error: 'Failed to approve submission' }, { status: 500 });
      }

      // Handle school suggestion approval: create school + link review
      if (submission.submission_type === 'school_suggestion' && submission.school_suggestions?.[0]) {
        const suggestion = submission.school_suggestions[0];
        try {
          // Insert the new school into the schools table
          const { data: newSchool, error: schoolInsertError } = await supabaseAdmin
            .from('schools')
            .insert({
              city_id: suggestion.city_id,
              name: suggestion.school_name,
              type: suggestion.school_type,
              website: suggestion.school_website,
              district: suggestion.school_district,
              rating: 0,
              reviews: 0,
              student_count: 0,
              salary_range: 'Not yet reported',
              summary: 'Recently added — awaiting more data.',
              source: 'user_suggestion',
            })
            .select()
            .single();

          if (schoolInsertError) {
            console.error('School insert error:', schoolInsertError);
          } else if (newSchool && submission.school_reviews?.[0]) {
            // Link the pending review to the newly created school
            await supabaseAdmin
              .from('school_reviews')
              .update({ school_id: newSchool.id })
              .eq('id', submission.school_reviews[0].id);

            // Recalculate all data for the new school (ISR baseline = 0, so it's purely user data)
            await recalculateSchoolRating(newSchool.id);
            await recalculateSchoolSalary(newSchool.id);
            await resynthesizeSchoolSummary(newSchool.id);
          }
        } catch (schoolError) {
          console.warn('Failed to create school from suggestion:', schoolError);
        }
      }

      // Recalculate school data after approving a review
      if (submission.submission_type === 'school_review' && submission.school_reviews?.[0]?.school_id) {
        const schoolId = submission.school_reviews[0].school_id;
        await recalculateSchoolRating(schoolId);
        await recalculateSchoolSalary(schoolId);
        await resynthesizeSchoolSummary(schoolId);
      }

      // Recalculate city salary breakdown from approved reviews
      if (submission.city_id && (submission.submission_type === 'school_review' || submission.submission_type === 'salary')) {
        await recalculateCitySalaryData(submission.city_id);
      }

      // Copy local intel data to production table if applicable
      if (submission.submission_type === 'local_intel' && submission.local_intel_submissions?.[0]) {
        const intel = submission.local_intel_submissions[0];
        try {
          await supabaseAdmin.from('local_intel_data').insert({
            city_id: submission.city_id,
            category: intel.category,
            tip_text: intel.tip_text,
            contributor_count: 1,
            source: 'user_submission',
            last_updated: new Date().toISOString(),
          });
        } catch (copyError) {
          console.warn('Failed to copy to production table:', copyError);
        }
      }

      // Send approval email
      try {
        const emailTemplate = getApprovalEmail(
          submission.submitter_email,
          submission.submission_type,
          submission.cities.name
        );
        await resendClient.emails.send(emailTemplate);
      } catch (emailError) {
        console.error('Email error:', emailError);
      }

      // Revalidate city page cache
      try {
        revalidatePath(`/cities/${submission.cities.slug}`);
      } catch (revalidateError) {
        console.warn('Revalidate error:', revalidateError);
      }

      return Response.json({ success: true, message: 'Submission approved' });

    } else if (action === 'reject') {
      const { error: updateError } = await supabaseAdmin
        .from('user_submissions')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'admin',
          rejection_reason: rejection_reason || 'Does not meet community guidelines',
        })
        .eq('id', id);

      if (updateError) {
        return Response.json({ error: 'Failed to reject submission' }, { status: 500 });
      }

      // Send rejection email
      try {
        const emailTemplate = getRejectionEmail(
          submission.submitter_email,
          submission.submission_type,
          submission.cities.name,
          rejection_reason || 'Does not meet community guidelines'
        );
        await resendClient.emails.send(emailTemplate);
      } catch (emailError) {
        console.error('Email error:', emailError);
      }

      return Response.json({ success: true, message: 'Submission rejected' });
    }

  } catch (error) {
    console.error('Admin action error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
