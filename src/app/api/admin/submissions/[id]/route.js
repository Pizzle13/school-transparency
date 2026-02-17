import { supabaseAdmin } from '../../../../../lib/supabase/admin';
import { resendClient } from '../../../../../lib/email/resend-client';
import { getApprovalEmail, getRejectionEmail } from '../../../../../lib/email/templates';
import { revalidatePath } from 'next/cache';

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

            // Recalculate rating for the new school (ISR baseline = 0, so it's purely user data)
            await recalculateSchoolRating(newSchool.id);
          }
        } catch (schoolError) {
          console.warn('Failed to create school from suggestion:', schoolError);
        }
      }

      // Recalculate school rating after approving a review
      if (submission.submission_type === 'school_review' && submission.school_reviews?.[0]?.school_id) {
        await recalculateSchoolRating(submission.school_reviews[0].school_id);
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
