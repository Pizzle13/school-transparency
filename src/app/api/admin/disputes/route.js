import { supabaseAdmin } from '../../../../lib/supabase/admin';

function checkAdminAuth(request) {
  const authHeader = request.headers.get('authorization');
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error('ADMIN_PASSWORD not configured');
  return authHeader?.replace('Bearer ', '') === password;
}

export async function GET(request) {
  try {
    if (!checkAdminAuth(request)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'open';

    const { data: disputes, error } = await supabaseAdmin
      .from('data_dispute_submissions')
      .select('*, schools(name, slug)')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Disputes query error:', error);
      return Response.json({ error: 'Failed to fetch disputes' }, { status: 500 });
    }

    // Get counts for each status
    const { count: openCount } = await supabaseAdmin
      .from('data_dispute_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'open');

    const { count: resolvedCount } = await supabaseAdmin
      .from('data_dispute_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'resolved');

    const { count: dismissedCount } = await supabaseAdmin
      .from('data_dispute_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'dismissed');

    return Response.json({
      disputes: disputes || [],
      counts: {
        open: openCount || 0,
        resolved: resolvedCount || 0,
        dismissed: dismissedCount || 0,
      },
    });
  } catch (error) {
    console.error('Admin disputes API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    if (!checkAdminAuth(request)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, action } = await request.json();

    if (!id || !['resolve', 'dismiss'].includes(action)) {
      return Response.json({ error: 'Invalid request. Provide id and action (resolve|dismiss).' }, { status: 400 });
    }

    const newStatus = action === 'resolve' ? 'resolved' : 'dismissed';

    const { error } = await supabaseAdmin
      .from('data_dispute_submissions')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Dispute update error:', error);
      return Response.json({ error: 'Failed to update dispute' }, { status: 500 });
    }

    return Response.json({ success: true, message: `Dispute ${newStatus}` });
  } catch (error) {
    console.error('Admin dispute action error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
