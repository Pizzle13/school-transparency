#!/usr/bin/env node

/**
 * Update Cairo's hero_image_url in Supabase
 * Run: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/update-cairo-hero-image.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function updateCairo() {
  console.log('📍 Updating Cairo hero image in Supabase...');

  const { data, error } = await supabase
    .from('cities')
    .update({
      hero_image_url: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1600&q=80'
    })
    .eq('slug', 'cairo')
    .select();

  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  console.log('✅ Cairo updated:', data);
}

updateCairo();
