/**
 * Seed Bangkok base city record into Supabase.
 * Run: node scripts/seed-bangkok.js
 *
 * This creates the city shell so the page is live at /cities/bangkok.
 * The Pipeline project will populate all related data (salary, schools, housing, etc.)
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BANGKOK_CITY = {
  name: 'Bangkok',
  country: 'Thailand',
  slug: 'bangkok',
  hero_image_url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1600&q=80',
  tagline: 'The City of Angels — where ancient temples meet modern teaching opportunities in Southeast Asia\'s most vibrant metropolis.',
};

async function seed() {
  // Check if Bangkok already exists
  const { data: existing } = await supabase
    .from('cities')
    .select('id, name')
    .eq('slug', 'bangkok')
    .single();

  if (existing) {
    console.log(`Bangkok already exists (id: ${existing.id}). Skipping.`);
    return;
  }

  const { data, error } = await supabase
    .from('cities')
    .insert(BANGKOK_CITY)
    .select()
    .single();

  if (error) {
    console.error('Failed to insert Bangkok:', error.message);
    process.exit(1);
  }

  console.log(`Bangkok created successfully!`);
  console.log(`  ID:   ${data.id}`);
  console.log(`  Slug: ${data.slug}`);
  console.log(`  URL:  https://www.schooltransparency.com/cities/bangkok`);
}

seed();
