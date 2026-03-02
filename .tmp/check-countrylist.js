const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://znfwwwcjkjglgdudwnnq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZnd3d2Nqa2pnbGdkdWR3bm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTMxODAsImV4cCI6MjA4NDEyOTE4MH0.AYJuOCdDcbQBkB_BHxskbsZPnrXesWnIAkrFp_VlK-E'
);

async function simulateGetCountryList() {
  const countryMap = {};
  const batchSize = 1000;
  let from = 0;
  let hasMore = true;
  let batchNum = 0;

  while (hasMore) {
    let query = supabase
      .from('schools')
      .select('country_name')
      .not('slug', 'is', null)
      .not('country_name', 'is', null);

    query = query.range(from, from + batchSize - 1);

    const { data, error } = await query;

    batchNum++;
    console.log(`Batch ${batchNum}: from=${from}, got ${data ? data.length : 0} rows${error ? ', ERROR: ' + error.message : ''}`);

    if (error || !data) {
      console.log('Breaking due to error or no data');
      break;
    }

    for (const row of data) {
      const name = row.country_name;
      if (!name) continue;
      if (!countryMap[name]) {
        countryMap[name] = { name, count: 0 };
      }
      countryMap[name].count++;
    }

    hasMore = data.length === batchSize;
    from += batchSize;
  }

  const result = Object.values(countryMap).sort((a, b) => a.name.localeCompare(b.name));
  console.log('\nTotal unique countries:', result.length);
  console.log('Top 10 by count:', result.sort((a, b) => b.count - a.count).slice(0, 10).map(c => `${c.name}: ${c.count}`).join(', '));
}

simulateGetCountryList();
