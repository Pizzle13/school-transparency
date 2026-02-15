const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Using public client for mock data addition
const supabase = createClient(
  'https://znfwwwcjkjglgdudwnnq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZnd3d2Nqa2pnbGdkdWR3bm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTMxODAsImV4cCI6MjA4NDEyOTE4MH0.AYJuOCdDcbQBkB_BHxskbsZPnrXesWnIAkrFp_VlK-E'
);

async function addMockDataToHCMC() {
  try {
    console.log('🔍 Looking for Ho Chi Minh City...');

    // First, find the HCMC city record
    const { data: cities, error: cityError } = await supabase
      .from('cities')
      .select('id, name')
      .eq('slug', 'ho-chi-minh-city')
      .single();

    if (cityError) {
      console.error('❌ Error finding HCMC:', cityError);
      return;
    }

    if (!cities) {
      console.log('❌ Ho Chi Minh City not found in database');
      return;
    }

    console.log(`✅ Found ${cities.name} with ID: ${cities.id}`);
    const cityId = cities.id;

    // Load mock data
    const mockData = JSON.parse(fs.readFileSync('hcmc-local-intel-mock-data.json', 'utf8'));
    const hcmcData = mockData.cities[0];

    // Check what data already exists
    console.log('🔍 Checking existing data...');

    const { data: existingLocal } = await supabase
      .from('local_intel_data')
      .select('id')
      .eq('city_id', cityId);

    console.log(`📊 Found ${existingLocal?.length || 0} existing Local Intel records`);

    // Add Local Intel data
    if (hcmcData.local_intel_data && hcmcData.local_intel_data.length > 0) {
      console.log('📝 Adding Local Intel data...');

      const localIntelToAdd = hcmcData.local_intel_data.map(item => ({
        ...item,
        city_id: cityId
      }));

      const { data: localResult, error: localError } = await supabase
        .from('local_intel_data')
        .insert(localIntelToAdd)
        .select();

      if (localError) {
        console.error('❌ Error adding Local Intel data:', localError);
      } else {
        console.log(`✅ Added ${localResult.length} Local Intel records`);
      }
    }

    // Add City Apps data
    if (hcmcData.city_apps && hcmcData.city_apps.length > 0) {
      console.log('📱 Adding City Apps data...');

      const appsToAdd = hcmcData.city_apps.map(item => ({
        ...item,
        city_id: cityId
      }));

      const { data: appsResult, error: appsError } = await supabase
        .from('city_apps')
        .insert(appsToAdd)
        .select();

      if (appsError) {
        console.error('❌ Error adding City Apps data:', appsError);
      } else {
        console.log(`✅ Added ${appsResult.length} City Apps records`);
      }
    }

    // Add Housing Websites data
    if (hcmcData.housing_websites && hcmcData.housing_websites.length > 0) {
      console.log('🏠 Adding Housing Websites data...');

      const websitesToAdd = hcmcData.housing_websites.map(item => ({
        ...item,
        city_id: cityId
      }));

      const { data: websitesResult, error: websitesError } = await supabase
        .from('housing_websites')
        .insert(websitesToAdd)
        .select();

      if (websitesError) {
        console.error('❌ Error adding Housing Websites data:', websitesError);
      } else {
        console.log(`✅ Added ${websitesResult.length} Housing Websites records`);
      }
    }

    // Add Air Quality data
    if (hcmcData.air_quality && hcmcData.air_quality.length > 0) {
      console.log('🌬️ Adding Air Quality data...');

      const airQualityToAdd = hcmcData.air_quality.map(item => ({
        ...item,
        city_id: cityId
      }));

      const { data: airResult, error: airError } = await supabase
        .from('air_quality')
        .insert(airQualityToAdd)
        .select();

      if (airError) {
        console.error('❌ Error adding Air Quality data:', airError);
      } else {
        console.log(`✅ Added ${airResult.length} Air Quality records`);
      }
    }

    // Add City News data
    if (hcmcData.city_news && hcmcData.city_news.length > 0) {
      console.log('📰 Adding City News data...');

      const newsToAdd = hcmcData.city_news.map(item => ({
        ...item,
        city_id: cityId
      }));

      const { data: newsResult, error: newsError } = await supabase
        .from('city_news')
        .insert(newsToAdd)
        .select();

      if (newsError) {
        console.error('❌ Error adding City News data:', newsError);
      } else {
        console.log(`✅ Added ${newsResult.length} City News records`);
      }
    }

    console.log('🎉 Mock data addition completed!');
    console.log('🌐 Visit http://localhost:3000/cities/ho-chi-minh-city to see the results');

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

addMockDataToHCMC();