import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://znfwwwcjkjglgdudwnnq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZnd3d2Nqa2pnbGdkdWR3bm5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODU1MzE4MCwiZXhwIjoyMDg0MTI5MTgwfQ.ubOPwOz_06iT_7u_BIp31_1eiSbNr-a5m0xES70h_R0'
);

const fields = 'name, slug, country_name, accreditations, programmes, website_url, mission_statement';

async function run() {
  // 1. Get 3 Schrole-source schools with slugs
  console.log('=== 1. SCHROLE-SOURCE SCHOOLS (3) ===\n');
  const { data: schrole, error: e1 } = await supabase
    .from('schools')
    .select(fields)
    .eq('source', 'schrole')
    .not('slug', 'is', null)
    .limit(3);
  if (e1) console.error('Schrole error:', e1.message);
  else schrole.forEach((s, i) => {
    console.log(`[${i+1}] ${s.name}`);
    console.log(`    slug: ${s.slug}`);
    console.log(`    country: ${s.country_name}`);
    console.log(`    accreditations: ${JSON.stringify(s.accreditations)}`);
    console.log(`    programmes: ${JSON.stringify(s.programmes)}`);
    console.log(`    website: ${s.website_url}`);
    console.log(`    mission: ${s.mission_statement ? s.mission_statement.substring(0, 120) + '...' : null}`);
    console.log();
  });

  // 2. Get 3 Teacher Horizons schools with slugs
  console.log('=== 2. TEACHER HORIZONS-SOURCE SCHOOLS (3) ===\n');
  const { data: th, error: e2 } = await supabase
    .from('schools')
    .select(fields)
    .eq('source', 'teacher_horizons')
    .not('slug', 'is', null)
    .limit(3);
  if (e2) console.error('TH error:', e2.message);
  else if (th.length === 0) {
    // Try other possible source names
    console.log('No results for "teacher_horizons". Checking distinct sources...');
    const { data: sources } = await supabase
      .from('schools')
      .select('source')
      .not('source', 'is', null);
    const distinct = [...new Set(sources.map(s => s.source))];
    console.log('Distinct sources:', distinct);
    
    // Try with the TH-like source
    for (const src of distinct) {
      if (src.toLowerCase().includes('teacher') || src.toLowerCase().includes('horizon') || src.toLowerCase().includes('th')) {
        console.log(`\nTrying source = "${src}"...`);
        const { data: th2 } = await supabase
          .from('schools')
          .select(fields)
          .eq('source', src)
          .not('slug', 'is', null)
          .limit(3);
        if (th2 && th2.length > 0) {
          th2.forEach((s, i) => {
            console.log(`[${i+1}] ${s.name}`);
            console.log(`    slug: ${s.slug}`);
            console.log(`    country: ${s.country_name}`);
            console.log(`    accreditations: ${JSON.stringify(s.accreditations)}`);
            console.log(`    programmes: ${JSON.stringify(s.programmes)}`);
            console.log(`    website: ${s.website_url}`);
            console.log(`    mission: ${s.mission_statement ? s.mission_statement.substring(0, 120) + '...' : null}`);
            console.log();
          });
        }
      }
    }
  } else {
    th.forEach((s, i) => {
      console.log(`[${i+1}] ${s.name}`);
      console.log(`    slug: ${s.slug}`);
      console.log(`    country: ${s.country_name}`);
      console.log(`    accreditations: ${JSON.stringify(s.accreditations)}`);
      console.log(`    programmes: ${JSON.stringify(s.programmes)}`);
      console.log(`    website: ${s.website_url}`);
      console.log(`    mission: ${s.mission_statement ? s.mission_statement.substring(0, 120) + '...' : null}`);
      console.log();
    });
  }

  // 3. Check accreditation values NOT in the known badge list
  console.log('=== 3. ACCREDITATION VALUES NOT COVERED BY BADGES ===\n');
  const knownBadges = new Set([
    'IBO', 'CIS', 'WASC', 'NEASC', 'MSA', 'Cognia', 'COBIS', 'BSO', 
    'ECIS', 'EARCOS', 'Cambridge', 'Edexcel', 'AP'
  ]);
  
  // Fetch all accreditation values
  const { data: accredData, error: e3 } = await supabase
    .from('schools')
    .select('accreditations')
    .not('accreditations', 'is', null);
  
  if (e3) console.error('Accreditation error:', e3.message);
  else {
    const allValues = new Set();
    accredData.forEach(row => {
      if (Array.isArray(row.accreditations)) {
        row.accreditations.forEach(v => allValues.add(v));
      } else if (typeof row.accreditations === 'string') {
        allValues.add(row.accreditations);
      }
    });
    
    const uncovered = [...allValues].filter(v => !knownBadges.has(v)).sort();
    console.log(`Total distinct accreditation values: ${allValues.size}`);
    console.log(`Covered by badges: ${[...allValues].filter(v => knownBadges.has(v)).length}`);
    console.log(`NOT covered: ${uncovered.length}`);
    console.log('\nUncovered values:');
    uncovered.forEach(v => console.log(`  - "${v}"`));
  }

  // 4. Check country_name duplicates — US variations and similar
  console.log('\n=== 4. COUNTRY NAME DUPLICATES ===\n');
  
  // Get all distinct country names and their counts
  const { data: countries, error: e4 } = await supabase
    .from('schools')
    .select('country_name')
    .not('country_name', 'is', null);
  
  if (e4) console.error('Country error:', e4.message);
  else {
    const countMap = {};
    countries.forEach(r => {
      countMap[r.country_name] = (countMap[r.country_name] || 0) + 1;
    });
    
    // Check specific US variations
    const usVariants = ['United States', 'United States of America', 'USA', 'US', 'U.S.', 'U.S.A.'];
    console.log('US name variants:');
    usVariants.forEach(v => {
      console.log(`  "${v}": ${countMap[v] || 0} schools`);
    });
    
    // Check UK variations
    const ukVariants = ['United Kingdom', 'UK', 'U.K.', 'England', 'Great Britain', 'Britain'];
    console.log('\nUK name variants:');
    ukVariants.forEach(v => {
      console.log(`  "${v}": ${countMap[v] || 0} schools`);
    });
    
    // Check UAE variations
    const uaeVariants = ['United Arab Emirates', 'UAE', 'U.A.E.'];
    console.log('\nUAE name variants:');
    uaeVariants.forEach(v => {
      console.log(`  "${v}": ${countMap[v] || 0} schools`);
    });
    
    // Check other potential duplicates - look for similar names
    const sortedCountries = Object.entries(countMap).sort((a, b) => a[0].localeCompare(b[0]));
    console.log(`\nAll distinct country names (${sortedCountries.length} total):`);
    sortedCountries.forEach(([name, count]) => {
      console.log(`  ${name}: ${count}`);
    });
  }
}

run().catch(console.error);
