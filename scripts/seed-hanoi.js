/**
 * Seed Hanoi base city record into Supabase.
 * Run: node scripts/seed-hanoi.js
 *
 * This creates the city shell so the page is live at /cities/hanoi.
 * The Pipeline project will populate all related data (salary, schools, housing, etc.)
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const HANOI_CITY = {
  name: 'Hanoi',
  country: 'Vietnam',
  slug: 'hanoi',
  hero_image_url: 'https://images.unsplash.com/photo-1753939582094-3091a6e0891e?w=1600&q=80',
  tagline: 'Culture, charm, and surprisingly affordable — Hanoi is where tradition meets the teaching frontier.',
};

async function seed() {
  // Check if Hanoi already exists
  const { data: existing } = await supabase
    .from('cities')
    .select('id, name')
    .eq('slug', 'hanoi')
    .single();

  if (existing) {
    console.log(`Hanoi already exists (id: ${existing.id}). Skipping.`);
    return;
  }

  const { data, error } = await supabase
    .from('cities')
    .insert(HANOI_CITY)
    .select()
    .single();

  if (error) {
    console.error('Failed to insert Hanoi:', error.message);
    process.exit(1);
  }

  console.log(`Hanoi created successfully!`);
  console.log(`  ID:   ${data.id}`);
  console.log(`  Slug: ${data.slug}`);
  console.log(`  URL:  https://www.schooltransparency.com/cities/hanoi`);
}

seed();
