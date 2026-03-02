const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://znfwwwcjkjglgdudwnnq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZnd3d2Nqa2pnbGdkdWR3bm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTMxODAsImV4cCI6MjA4NDEyOTE4MH0.AYJuOCdDcbQBkB_BHxskbsZPnrXesWnIAkrFp_VlK-E'
);

async function run() {
  console.log('=== SCHOOL TRANSPARENCY DATABASE REPORT ===');
  console.log('Date:', new Date().toISOString().split('T')[0]);
  console.log('');

  // 1. Total schools
  const { count: totalCount } = await supabase.from('schools').select('*', { count: 'exact', head: true });
  console.log('--- OVERVIEW ---');
  console.log('Total schools:', totalCount);

  // 2. Schools with slugs
  const { count: withSlugs } = await supabase.from('schools').select('*', { count: 'exact', head: true }).not('slug', 'is', null);
  console.log('Schools with slugs (in directory):', withSlugs);

  // 3. Schools with city_id
  const { count: withCityId } = await supabase.from('schools').select('*', { count: 'exact', head: true }).not('city_id', 'is', null);
  console.log('Schools with city_id (review/salary data):', withCityId);

  console.log('');

  // 4. Field population counts
  console.log('--- FIELD POPULATION ---');
  const fields = ['country_name', 'programmes', 'website_url', 'mission_statement', 'accreditations', 'school_type', 'gender', 'boarding'];
  for (const field of fields) {
    const { count } = await supabase.from('schools').select('*', { count: 'exact', head: true }).not(field, 'is', null);
    const pct = totalCount ? ((count / totalCount) * 100).toFixed(1) : '0';
    console.log('  ' + field + ':', count, '(' + pct + '%)');
  }

  console.log('');

  // 5. Unique countries
  const { data: countries } = await supabase.from('schools').select('country_name').not('country_name', 'is', null);
  const uniqueCountries = [...new Set(countries.map(c => c.country_name))];
  console.log('--- GEOGRAPHIC SPREAD ---');
  console.log('Unique countries:', uniqueCountries.length);

  // 6. Unique cities
  try {
    const { data: cities, error: cityErr } = await supabase.from('schools').select('city_name').not('city_name', 'is', null).limit(1);
    if (cityErr === null && cities && cities.length > 0) {
      const { data: allCities } = await supabase.from('schools').select('city_name').not('city_name', 'is', null);
      const uniqueCities = [...new Set(allCities.map(c => c.city_name))];
      console.log('Unique cities:', uniqueCities.length);
    } else if (cityErr) {
      console.log('Unique cities: (city_name column not available - ' + cityErr.message + ')');
    } else {
      console.log('Unique cities: 0 (no city_name values found)');
    }
  } catch(e) {
    console.log('Unique cities: (city_name column not available)');
  }

  console.log('');

  // 7. Top 20 countries by school count
  console.log('--- TOP 20 COUNTRIES BY SCHOOL COUNT ---');
  const countryCount = {};
  countries.forEach(c => { countryCount[c.country_name] = (countryCount[c.country_name] || 0) + 1; });
  const sorted = Object.entries(countryCount).sort((a, b) => b[1] - a[1]).slice(0, 20);
  sorted.forEach(([name, count], i) => {
    console.log('  ' + (i+1) + '. ' + name + ': ' + count);
  });

  // Count schools with no country
  const noCountryCount = totalCount - countries.length;
  if (noCountryCount > 0) {
    console.log('  (No country_name: ' + noCountryCount + ' schools)');
  }

  console.log('');

  // 8. Schools added in the last 7 days
  console.log('--- RECENT ADDITIONS (Last 7 Days) ---');
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  try {
    const { data: recent, count: recentCount, error: recentErr } = await supabase
      .from('schools')
      .select('name, country_name, created_at', { count: 'exact' })
      .gte('created_at', sevenDaysAgo)
      .order('created_at', { ascending: false })
      .limit(20);

    if (recentErr) {
      console.log('  (created_at column not available or error: ' + recentErr.message + ')');
    } else if (recentCount === 0) {
      console.log('  No schools added in the last 7 days.');
    } else {
      console.log('  Total new schools (last 7 days): ' + recentCount);
      recent.forEach(s => {
        console.log('    - ' + s.name + ' (' + (s.country_name || 'Unknown') + ') -- ' + s.created_at);
      });
      if (recentCount > 20) console.log('    ... and ' + (recentCount - 20) + ' more');
    }
  } catch(e) {
    console.log('  (Could not query created_at: ' + e.message + ')');
  }

  console.log('');
  console.log('=== END REPORT ===');
}

run().catch(err => console.error('Script error:', err));
