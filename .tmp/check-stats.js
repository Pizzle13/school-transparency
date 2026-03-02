const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://znfwwwcjkjglgdudwnnq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZnd3d2Nqa2pnbGdkdWR3bm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTMxODAsImV4cCI6MjA4NDEyOTE4MH0.AYJuOCdDcbQBkB_BHxskbsZPnrXesWnIAkrFp_VlK-E'
);

async function check() {
  // Count distinct countries
  const countries = new Set();
  let from = 0;
  let hasMore = true;
  while (hasMore) {
    const { data } = await supabase
      .from('schools')
      .select('country_name')
      .not('slug', 'is', null)
      .not('country_name', 'is', null)
      .range(from, from + 999);
    if (!data || data.length === 0) break;
    for (const row of data) {
      if (row.country_name) countries.add(row.country_name);
    }
    hasMore = data.length === 1000;
    from += 1000;
  }

  console.log('Actual distinct countries:', countries.size);
  console.log('Countries:', [...countries].sort().join(', '));

  // Total schools
  const { count } = await supabase
    .from('schools')
    .select('id', { count: 'exact', head: true })
    .not('slug', 'is', null);
  console.log('\nTotal schools with slugs:', count);

  // Check how many schools have NULL country_name
  const { count: noCountry } = await supabase
    .from('schools')
    .select('id', { count: 'exact', head: true })
    .not('slug', 'is', null)
    .is('country_name', null);
  console.log('Schools with NULL country_name:', noCountry);
}
check();
