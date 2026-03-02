const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://znfwwwcjkjglgdudwnnq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZnd3d2Nqa2pnbGdkdWR3bm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTMxODAsImV4cCI6MjA4NDEyOTE4MH0.AYJuOCdDcbQBkB_BHxskbsZPnrXesWnIAkrFp_VlK-E'
);

async function check() {
  // Find Abu Dhabi in cities table
  const { data, error } = await supabase
    .from('cities')
    .select('id, name, slug, hero_image_url')
    .ilike('name', '%abu%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Cities matching "abu":');
  console.log(JSON.stringify(data, null, 2));
}
check();
