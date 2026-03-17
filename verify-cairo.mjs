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
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function verifyCairo() {
  const { data, error } = await supabase
    .from('cities')
    .select('id, slug, name, hero_image_url')
    .eq('slug', 'cairo')
    .single();
  
  console.log('Cairo in Supabase:');
  console.log(JSON.stringify(data, null, 2));
}

verifyCairo();
