import { supabaseAdmin } from '../../../../../lib/supabase/admin';
import { resendClient } from '../../../../../lib/email/resend-client';
import { getApprovalEmail, getRejectionEmail } from '../../../../../lib/email/templates';
import { revalidatePath } from 'next/cache';

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
