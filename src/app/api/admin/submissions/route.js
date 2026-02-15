import { supabaseAdmin } from '../../../../lib/supabase/admin';

function checkAdminAuth(request) {
  const authHeader = request.headers.get('authorization');
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error('ADMIN_PASSWORD not configured');
  }

  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === password;
}

export async function GET(request) {
  try {
    if (!checkAdminAuth(request)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get submissions with related data
    let query = supabaseAdmin
      .from('user_submissions')
      .select(`
        id,
        submission_type,
        status,
        submitter_email,
        submitted_at,
        email_verified,
        city_id,
        cities(name, slug),
        school_reviews(id, school_id, overall_rating, pros, cons, schools(name)),
        school_suggestions(id, school_name, school_type, school_website, school_district),
        local_intel_submissions(id, category, tip_text),
        housing_submissions(id, area_name, rent_1br),
        salary_submissions(id, position, salary_amount)
      `)
      .eq('status', status)
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: submissions, error, count } = await query;

    if (error) {
      console.error('Query error:', error);
      return Response.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }

    // Get status counts
    const { count: pendingCount } = await supabaseAdmin
      .from('user_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: approvedCount } = await supabaseAdmin
      .from('user_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved');

    const { count: rejectedCount } = await supabaseAdmin
      .from('user_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'rejected');

    return Response.json({
      submissions: submissions || [],
      counts: {
        pending: pendingCount || 0,
        approved: approvedCount || 0,
        rejected: rejectedCount || 0,
      },
      pagination: {
        limit,
        offset,
        total: count || 0,
      }
    });

  } catch (error) {
    console.error('Admin API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
