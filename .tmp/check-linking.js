const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://znfwwwcjkjglgdudwnnq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZnd3d2Nqa2pnbGdkdWR3bm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTMxODAsImV4cCI6MjA4NDEyOTE4MH0.AYJuOCdDcbQBkB_BHxskbsZPnrXesWnIAkrFp_VlK-E'
);

async function check() {
  // 1. How many schools have city_id set vs null
  const { count: withCityId } = await supabase
    .from('schools')
    .select('id', { count: 'exact', head: true })
    .not('city_id', 'is', null);

  const { count: withoutCityId } = await supabase
    .from('schools')
    .select('id', { count: 'exact', head: true })
    .is('city_id', null);

  const { count: withSlug } = await supabase
    .from('schools')
    .select('id', { count: 'exact', head: true })
    .not('slug', 'is', null);

  console.log('=== School Linking Overview ===');
  console.log('Schools with city_id:', withCityId);
  console.log('Schools without city_id (directory-only):', withoutCityId);
  console.log('Schools with slug (in directory):', withSlug);

  // 2. Get all cities and their school counts
  const { data: cities } = await supabase
    .from('cities')
    .select('id, name, slug')
    .order('name');

  console.log('\n=== Cities and their linked schools ===');
  for (const city of cities) {
    const { count } = await supabase
      .from('schools')
      .select('id', { count: 'exact', head: true })
      .eq('city_id', city.id);

    const { count: withSlugCount } = await supabase
      .from('schools')
      .select('id', { count: 'exact', head: true })
      .eq('city_id', city.id)
      .not('slug', 'is', null);

    const { count: withReviews } = await supabase
      .from('schools')
      .select('id', { count: 'exact', head: true })
      .eq('city_id', city.id)
      .not('rating', 'is', null);

    console.log(`  ${city.name} (${city.slug}): ${count} schools, ${withSlugCount} in directory, ${withReviews} with ratings`);
  }

  // 3. Check Abu Dhabi and Dubai specifically
  for (const cityName of ['Abu Dhabi', 'Dubai']) {
    const { data: cityData } = await supabase
      .from('cities')
      .select('id, name')
      .ilike('name', cityName)
      .single();

    if (!cityData) {
      console.log(`\n${cityName}: NOT FOUND in cities table`);
      continue;
    }

    console.log(`\n=== ${cityName} Details ===`);

    // Schools linked to this city
    const { data: citySchools } = await supabase
      .from('schools')
      .select('id, name, slug, rating, reviews, avg_salary, source, programmes, city_id')
      .eq('city_id', cityData.id)
      .order('name')
      .limit(20);

    console.log(`Schools linked to ${cityName}:`);
    for (const s of citySchools || []) {
      console.log(`  - ${s.name}`);
      console.log(`    slug: ${s.slug}, rating: ${s.rating}, reviews: ${s.reviews}, salary: ${s.avg_salary}`);
      console.log(`    source: ${s.source}, programmes: ${JSON.stringify(s.programmes)}`);
    }

    // Check if there are IBO directory schools in Abu Dhabi/Dubai that AREN'T linked
    const { data: unlinked } = await supabase
      .from('schools')
      .select('id, name, slug, city_id, country_name, address, programmes')
      .not('slug', 'is', null)
      .is('city_id', null)
      .ilike('address', `%${cityName}%`)
      .limit(10);

    console.log(`\nUnlinked directory schools with "${cityName}" in address:`);
    for (const s of unlinked || []) {
      console.log(`  - ${s.name} (${s.slug})`);
      console.log(`    address has: ${cityName}, programmes: ${JSON.stringify(s.programmes)}`);
    }
  }

  // 4. Check what "merged" schools look like (have both city_id and IBO programmes)
  const { data: merged } = await supabase
    .from('schools')
    .select('name, slug, city_id, rating, programmes, source')
    .not('city_id', 'is', null)
    .not('programmes', 'is', null)
    .not('slug', 'is', null)
    .limit(10);

  console.log('\n=== Sample merged schools (have city_id + programmes + slug) ===');
  for (const s of merged || []) {
    console.log(`  - ${s.name}: rating=${s.rating}, programmes=${JSON.stringify(s.programmes)}, source=${s.source}`);
  }

  // 5. Check the source column values
  const sources = {};
  let from = 0;
  let hasMore = true;
  while (hasMore) {
    const { data } = await supabase
      .from('schools')
      .select('source')
      .range(from, from + 999);
    if (!data || data.length === 0) break;
    for (const row of data) {
      const src = row.source || 'NULL';
      sources[src] = (sources[src] || 0) + 1;
    }
    hasMore = data.length === 1000;
    from += 1000;
  }
  console.log('\n=== Source column values ===');
  for (const [src, count] of Object.entries(sources).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${src}: ${count}`);
  }
}

check();
