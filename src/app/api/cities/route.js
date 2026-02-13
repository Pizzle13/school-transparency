import { supabaseAdmin } from '../../../lib/supabase/admin';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    // Use public client — no admin needed for reads
    const { data: cities, error } = await supabase
      .from('cities')
      .select('id, name, country, slug')
      .order('name');

    if (error) {
      console.error('Database error:', error);
      return Response.json({ error: 'Failed to fetch cities' }, { status: 500 });
    }

    return Response.json(cities);
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Authentication check
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.PIPELINE_API_KEY}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cityData = await request.json();

    const { data, error } = await supabaseAdmin
      .from('cities')
      .insert(cityData)
      .select();

    if (error) {
      console.error('Database error:', error);
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json(data[0]);
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}