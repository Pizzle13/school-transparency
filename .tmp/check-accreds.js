const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://gacrqpxjjikecqqtmlwc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhY3JxcHhqamlrZWNxcXRtbHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjMzMDYsImV4cCI6MjA1MTk5OTMwNn0.6MlROEJOhJRFJBKJflkGjyngzFJamJRPb9F0qtz-OdQ'
);

async function check() {
  const allAccreds = {};
  let from = 0;
  let hasMore = true;
  while (hasMore) {
    const { data } = await supabase
      .from('schools')
      .select('accreditations')
      .not('slug', 'is', null)
      .not('accreditations', 'is', null)
      .range(from, from + 999);
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
  console.log('All accreditation values and counts:');
  const sorted = Object.entries(allAccreds).sort((a, b) => b[1] - a[1]);
  for (const [key, count] of sorted) {
    console.log('  ' + key + ': ' + count);
  }
}
check();
