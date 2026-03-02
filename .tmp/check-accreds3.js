const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://znfwwwcjkjglgdudwnnq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZnd3d2Nqa2pnbGdkdWR3bm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTMxODAsImV4cCI6MjA4NDEyOTE4MH0.AYJuOCdDcbQBkB_BHxskbsZPnrXesWnIAkrFp_VlK-E'
);

async function check() {
  // Check how many have non-null accreditations
  const { count: withAccreds } = await supabase
    .from('schools')
    .select('id', { count: 'exact', head: true })
    .not('slug', 'is', null)
    .not('accreditations', 'is', null);

  const { count: total } = await supabase
    .from('schools')
    .select('id', { count: 'exact', head: true })
    .not('slug', 'is', null);

  console.log('Total schools with slugs:', total);
  console.log('Schools with non-null accreditations:', withAccreds);

  // Get all unique accreditation values - paginate
  const allAccreds = {};
  let from = 0;
  let hasMore = true;
  while (hasMore) {
    const { data, error } = await supabase
      .from('schools')
      .select('accreditations')
      .not('slug', 'is', null)
      .not('accreditations', 'is', null)
      .range(from, from + 999);
    if (error) {
      console.error('Error:', error);
      break;
    }
    if (!data || data.length === 0) break;
    for (const row of data) {
      if (Array.isArray(row.accreditations)) {
        for (const a of row.accreditations) {
          allAccreds[a] = (allAccreds[a] || 0) + 1;
        }
      }
    }
    hasMore = data.length === 1000;
    from += 1000;
  }

  console.log('\nAll accreditation values and counts:');
  const sorted = Object.entries(allAccreds).sort((a, b) => b[1] - a[1]);
  for (const [key, count] of sorted) {
    console.log('  ' + key + ': ' + count);
  }

  // Also check programmes column
  const allProgs = {};
  from = 0;
  hasMore = true;
  while (hasMore) {
    const { data, error } = await supabase
      .from('schools')
      .select('programmes')
      .not('slug', 'is', null)
      .not('programmes', 'is', null)
      .range(from, from + 999);
    if (error) break;
    if (!data || data.length === 0) break;
    for (const row of data) {
      if (Array.isArray(row.programmes)) {
        for (const p of row.programmes) {
          allProgs[p] = (allProgs[p] || 0) + 1;
        }
      }
    }
    hasMore = data.length === 1000;
    from += 1000;
  }

  console.log('\nAll programme values and counts:');
  const sortedProgs = Object.entries(allProgs).sort((a, b) => b[1] - a[1]);
  for (const [key, count] of sortedProgs) {
    console.log('  ' + key + ': ' + count);
  }
}
check();
