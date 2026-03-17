import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getCairo() {
  const { data, error } = await supabase
    .from('cities')
    .select('id, name, country, slug, hero_image_url, salary_data(avg_salary), schools(id)')
    .eq('slug', 'cairo')
    .single();
  
  if (error) {
    console.error('Error:', error);
    return null;
  }
  
  console.log(JSON.stringify(data, null, 2));
}

getCairo();
