import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && !key.startsWith('#')) {
    env[key] = rest.join('=').trim();
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateCairoImage() {
  const cairoImageUrl = 'https://images.unsplash.com/photo-1572928915307-cf1ee4c007db?w=1600&q=80';
  
  const { data, error } = await supabase
    .from('cities')
    .update({ hero_image_url: cairoImageUrl })
    .eq('slug', 'cairo')
    .select();
  
  if (error) {
    console.error('Error updating Cairo:', error);
    process.exit(1);
  }
  
  console.log('✅ Cairo hero_image_url updated in Supabase');
  console.log(JSON.stringify(data, null, 2));
}

updateCairoImage();
