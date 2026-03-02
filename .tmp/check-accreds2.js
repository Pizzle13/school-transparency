const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://gacrqpxjjikecqqtmlwc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhY3JxcHhqamlrZWNxcXRtbHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjMzMDYsImV4cCI6MjA1MTk5OTMwNn0.6MlROEJOhJRFJBKJflkGjyngzFJamJRPb9F0qtz-OdQ'
);

async function check() {
  // First, check a few rows to see what accreditations look like
  const { data: sample, error } = await supabase
    .from('schools')
    .select('name, accreditations, programmes')
    .not('slug', 'is', null)
    .limit(10);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Sample rows:');
  for (const row of sample) {
    console.log('  ' + row.name);
    console.log('    programmes:', JSON.stringify(row.programmes));
    console.log('    accreditations:', JSON.stringify(row.accreditations));
  }

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

  console.log('\nTotal schools with slugs:', total);
  console.log('Schools with non-null accreditations:', withAccreds);

  // Try looking for schools that have accreditations as non-empty array
  const { data: withData } = await supabase
    .from('schools')
    .select('name, accreditations')
    .not('slug', 'is', null)
    .not('accreditations', 'is', null)
    .neq('accreditations', '{}')
    .limit(20);

  console.log('\nSchools with non-empty accreditations:');
  if (withData) {
    for (const row of withData) {
      console.log('  ' + row.name + ': ' + JSON.stringify(row.accreditations));
    }
  }
}
check();
