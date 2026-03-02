import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://znfwwwcjkjglgdudwnnq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZnd3d2Nqa2pnbGdkdWR3bm5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODU1MzE4MCwiZXhwIjoyMDg0MTI5MTgwfQ.ubOPwOz_06iT_7u_BIp31_1eiSbNr-a5m0xES70h_R0'
);

async function run() {
  // First, let's see all columns on the schools table
  const { data: sample, error } = await supabase
    .from('schools')
    .select('*')
    .not('slug', 'is', null)
    .limit(1);
  
  if (error) { console.error(error); return; }
  
  console.log('=== SCHOOLS TABLE COLUMNS ===');
  console.log(Object.keys(sample[0]).join('\n'));
  
  // Check for a data_source or similar column
  const cols = Object.keys(sample[0]);
  const sourceCol = cols.find(c => c.includes('source') || c.includes('origin') || c.includes('provider'));
  console.log(`\nSource-like column found: ${sourceCol || 'NONE'}`);
  
  // Check for schrole/teacher horizons in any text fields
  console.log('\n=== CHECKING FOR SCHROLE / TEACHER HORIZONS REFERENCES ===');
  
  // Try ilike on website_url for schrole
  const { data: schroleByUrl } = await supabase
    .from('schools')
    .select('name, slug, country_name, accreditations, programmes, website_url, mission_statement')
    .not('slug', 'is', null)
    .ilike('website_url', '%schrole%')
    .limit(3);
  console.log(`\nSchools with "schrole" in website_url: ${schroleByUrl?.length || 0}`);
  
  // Try ilike on website_url for teacherhorizons
  const { data: thByUrl } = await supabase
    .from('schools')
    .select('name, slug, country_name, accreditations, programmes, website_url, mission_statement')
    .not('slug', 'is', null)
    .ilike('website_url', '%teacherhorizons%')
    .limit(3);
  console.log(`Schools with "teacherhorizons" in website_url: ${thByUrl?.length || 0}`);
  
  // Check if there's a data_source column value
  if (sourceCol) {
    const { data: sourceVals } = await supabase
      .from('schools')
      .select(sourceCol)
      .not(sourceCol, 'is', null)
      .limit(100);
    const distinct = [...new Set(sourceVals.map(r => r[sourceCol]))];
    console.log(`\nDistinct ${sourceCol} values:`, distinct);
  }

  // Let's check if there's an external_id or import_batch that hints at source
  const idCols = cols.filter(c => c.includes('id') || c.includes('external') || c.includes('batch') || c.includes('import'));
  console.log(`\nID/batch related columns: ${idCols.join(', ')}`);
  
  // Print sample school fully
  console.log('\n=== SAMPLE SCHOOL (ALL FIELDS) ===');
  console.log(JSON.stringify(sample[0], null, 2));
}

run().catch(console.error);
