const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://znfwwwcjkjglgdudwnnq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZnd3d2Nqa2pnbGdkdWR3bm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTMxODAsImV4cCI6MjA4NDEyOTE4MH0.AYJuOCdDcbQBkB_BHxskbsZPnrXesWnIAkrFp_VlK-E'
);

async function check() {
  // Get a pipeline school from Abu Dhabi
  const { data: city } = await supabase
    .from('cities')
    .select('id')
    .eq('slug', 'abu-dhabi')
    .single();

  const { data: pipelineSchool } = await supabase
    .from('schools')
    .select('*')
    .eq('city_id', city.id)
    .limit(1)
    .single();

  console.log('=== Pipeline school (Abu Dhabi) - all columns ===');
  for (const [key, val] of Object.entries(pipelineSchool)) {
    if (val !== null) {
      console.log(`  ${key}: ${JSON.stringify(val)}`);
    }
  }
  console.log('\nNull columns:', Object.entries(pipelineSchool).filter(([k,v]) => v === null).map(([k]) => k).join(', '));

  // Get an IBO directory school from Abu Dhabi
  const { data: iboSchool } = await supabase
    .from('schools')
    .select('*')
    .not('slug', 'is', null)
    .is('city_id', null)
    .ilike('address', '%Abu Dhabi%')
    .limit(1)
    .single();

  console.log('\n=== IBO directory school (Abu Dhabi) - all columns ===');
  for (const [key, val] of Object.entries(iboSchool)) {
    if (val !== null) {
      console.log(`  ${key}: ${JSON.stringify(val)}`);
    }
  }
  console.log('\nNull columns:', Object.entries(iboSchool).filter(([k,v]) => v === null).map(([k]) => k).join(', '));

  // Count pipeline schools for Abu Dhabi and Dubai that have names similar to IBO schools
  console.log('\n=== Name comparison (Abu Dhabi) ===');
  const { data: allPipeline } = await supabase
    .from('schools')
    .select('name')
    .eq('city_id', city.id)
    .order('name');

  const { data: allIBO } = await supabase
    .from('schools')
    .select('name, slug')
    .not('slug', 'is', null)
    .is('city_id', null)
    .ilike('address', '%Abu Dhabi%')
    .order('name');

  console.log('Pipeline schools:');
  for (const s of allPipeline) console.log('  P: ' + s.name);
  console.log('\nIBO directory schools:');
  for (const s of allIBO) console.log('  D: ' + s.name);
}
check();
