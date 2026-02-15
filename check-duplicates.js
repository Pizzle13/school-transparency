const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://znfwwwcjkjglgdudwnnq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZnd3d2Nqa2pnbGdkdWR3bm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTMxODAsImV4cCI6MjA4NDEyOTE4MH0.AYJuOCdDcbQBkB_BHxskbsZPnrXesWnIAkrFp_VlK-E'
);

async function checkDuplicates() {
  const cityId = '6667f0e7-f9c0-439d-abe1-029ad8f45093';

  console.log('🔍 Checking for duplicate data in HCMC tables...');
  console.log('====================================================');

  // Check Local Intel Data
  console.log('\n📋 LOCAL INTEL DATA:');
  const { data: localIntel } = await supabase
    .from('local_intel_data')
    .select('id, category, tip_text, contributor_count, source, created_at')
    .eq('city_id', cityId)
    .order('created_at');

  console.log(`Total records: ${localIntel?.length || 0}`);

  if (localIntel) {
    // Group by category to find duplicates
    const categories = {};
    localIntel.forEach(record => {
      const category = record.category;
      if (!categories[category]) categories[category] = [];
      categories[category].push(record);
    });

    console.log('\nBy category:');
    Object.keys(categories).forEach(category => {
      console.log(`  ${category}: ${categories[category].length} records`);
    });

    // Look for potential duplicates (same category and similar text)
    console.log('\nPotential duplicates:');
    Object.keys(categories).forEach(category => {
      if (categories[category].length > 2) {
        console.log(`  ⚠️ ${category} has ${categories[category].length} records (might be duplicated)`);
        categories[category].forEach((record, i) => {
          const tipPreview = record.tip_text.substring(0, 50) + '...';
          const date = new Date(record.created_at).toLocaleDateString();
          console.log(`    ${i+1}. [${record.id.substring(0,8)}] ${tipPreview} (${date})`);
        });
      }
    });
  }

  // Check City Apps
  console.log('\n📱 CITY APPS:');
  const { data: cityApps } = await supabase
    .from('city_apps')
    .select('id, name, type, created_at')
    .eq('city_id', cityId)
    .order('created_at');

  console.log(`Total records: ${cityApps?.length || 0}`);
  if (cityApps) {
    console.log('Apps:');
    cityApps.forEach((app, i) => {
      const date = new Date(app.created_at).toLocaleDateString();
      console.log(`  ${i+1}. ${app.name} (${app.type}) - ${date}`);
    });
  }

  // Check Housing Websites
  console.log('\n🏠 HOUSING WEBSITES:');
  const { data: housingWebsites } = await supabase
    .from('housing_websites')
    .select('id, name, type, created_at')
    .eq('city_id', cityId)
    .order('created_at');

  console.log(`Total records: ${housingWebsites?.length || 0}`);
  if (housingWebsites) {
    console.log('Websites:');
    housingWebsites.forEach((site, i) => {
      const date = new Date(site.created_at).toLocaleDateString();
      console.log(`  ${i+1}. ${site.name} (${site.type}) - ${date}`);
    });
  }

  // Check Air Quality
  console.log('\n🌬️ AIR QUALITY:');
  const { data: airQuality } = await supabase
    .from('air_quality')
    .select('id, month, aqi, status, created_at')
    .eq('city_id', cityId)
    .order('month');

  console.log(`Total records: ${airQuality?.length || 0}`);
  if (airQuality) {
    // Group by month to find duplicates
    const months = {};
    airQuality.forEach(record => {
      const month = record.month;
      if (!months[month]) months[month] = [];
      months[month].push(record);
    });

    console.log('By month:');
    Object.keys(months).forEach(month => {
      if (months[month].length > 1) {
        console.log(`  ⚠️ ${month}: ${months[month].length} records (DUPLICATED)`);
        months[month].forEach((record, i) => {
          const date = new Date(record.created_at).toLocaleDateString();
          console.log(`    ${i+1}. AQI ${record.aqi} (${record.status}) - ${date}`);
        });
      } else {
        console.log(`  ✅ ${month}: ${months[month].length} record`);
      }
    });
  }

  // Check City News
  console.log('\n📰 CITY NEWS:');
  const { data: cityNews } = await supabase
    .from('city_news')
    .select('id, headline, category, created_at')
    .eq('city_id', cityId)
    .order('created_at');

  console.log(`Total records: ${cityNews?.length || 0}`);
  if (cityNews) {
    console.log('News articles:');
    cityNews.forEach((news, i) => {
      const date = new Date(news.created_at).toLocaleDateString();
      console.log(`  ${i+1}. [${news.category}] ${news.headline.substring(0, 50)}... - ${date}`);
    });
  }

  console.log('\n🎯 Summary:');
  console.log('============');
  console.log(`Local Intel: ${localIntel?.length || 0} records`);
  console.log(`City Apps: ${cityApps?.length || 0} records`);
  console.log(`Housing Websites: ${housingWebsites?.length || 0} records`);
  console.log(`Air Quality: ${airQuality?.length || 0} records`);
  console.log(`City News: ${cityNews?.length || 0} records`);
}

checkDuplicates().catch(console.error);