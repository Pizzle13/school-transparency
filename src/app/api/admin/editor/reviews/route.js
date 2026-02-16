import { supabaseAdmin } from '../../../../../lib/supabase/admin';

function checkAdminAuth(request) {
  const authHeader = request.headers.get('authorization');
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error('ADMIN_PASSWORD not configured');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === password;
}

export async function GET(request) {
  try {
    if (!checkAdminAuth(request)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('school_id');
    const cityId = searchParams.get('city_id');

    // If no params, return all cities
    if (!schoolId && !cityId) {
      const { data: cities, error } = await supabaseAdmin
        .from('cities')
        .select('id, name, slug')
        .order('name');

      if (error) throw error;
      return Response.json({ cities });
    }

    // If city_id, return schools for that city
    if (cityId && !schoolId) {
      const { data: schools, error } = await supabaseAdmin
        .from('schools')
        .select('id, name, type')
        .eq('city_id', cityId)
        .order('name');

      if (error) throw error;
      return Response.json({ schools });
    }

    // If school_id, return reviews for that school
    if (schoolId) {
      const { data: school, error: schoolError } = await supabaseAdmin
        .from('schools')
        .select('id, name, type, summary, pros, cons, salary_range, rating, reviews, student_count')
        .eq('id', schoolId)
        .single();

      if (schoolError) throw schoolError;

      const { data: reviews, error: reviewsError } = await supabaseAdmin
        .from('school_reviews')
        .select(`
          id,
          overall_rating,
          years_taught,
          position,
          contract_type,
          admin_responsiveness,
          teacher_community,
          professional_development_opportunities,
          work_life_balance,
          pros,
          cons,
          advice_for_teachers,
          reported_salary_min,
          reported_salary_max,
          salary_currency,
          created_at
        `)
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      return Response.json({ school, reviews: reviews || [] });
    }

    return Response.json({ error: 'Invalid parameters' }, { status: 400 });
  } catch (error) {
    console.error('Editor reviews API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
