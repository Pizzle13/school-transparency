import { supabaseAdmin } from '../../../../../../lib/supabase/admin';

function checkAdminAuth(request) {
  const authHeader = request.headers.get('authorization');
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error('ADMIN_PASSWORD not configured');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === password;
}

export async function PATCH(request, { params }) {
  try {
    if (!checkAdminAuth(request)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const updates = await request.json();

    const allowedFields = [
      'summary', 'pros', 'cons', 'salary_range'
    ];

    const sanitized = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        sanitized[key] = updates[key];
      }
    }

    if (Object.keys(sanitized).length === 0) {
      return Response.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('schools')
      .update(sanitized)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return Response.json({ school: data });
  } catch (error) {
    console.error('School update error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
