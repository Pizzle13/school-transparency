import { supabase } from '../supabase';

// Critical data needed for initial page render (above the fold)
export async function getCriticalCityData(slug) {
  const { data: city, error } = await supabase
    .from('cities')
    .select(`
      id,
      name,
      country,
      slug,
      hero_image_url,
      tagline,
      emergency_numbers,
      salary_data(*),
      economic_data(*),
      schools(*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Critical city data error:', error);
    return null;
  }

  return city;
}

// Secondary data that can be loaded progressively (below the fold)
export async function getSecondaryCityData(cityId) {
  try {
    // Load all secondary data in parallel
    const [
      housingAreasResult,
      housingWebsitesResult,
      airQualityResult,
      cityAppsResult,
      hospitalsResult,
      petImportResult,
      cityNewsResult,
      localIntelResult
    ] = await Promise.all([
      supabase.from('housing_areas').select('*').eq('city_id', cityId),
      supabase.from('housing_websites').select('*').eq('city_id', cityId),
      supabase.from('air_quality').select('*').eq('city_id', cityId),
      supabase.from('city_apps').select('*').eq('city_id', cityId),
      supabase.from('hospitals').select('*').eq('city_id', cityId),
      supabase.from('pet_import').select('*').eq('city_id', cityId),
      supabase.from('city_news').select('*').eq('city_id', cityId),
      supabase.from('local_intel_data').select('*').eq('city_id', cityId),
    ]);

    return {
      housing_areas: housingAreasResult.data || [],
      housing_websites: housingWebsitesResult.data || [],
      air_quality: airQualityResult.data || [],
      city_apps: cityAppsResult.data || [],
      hospitals: hospitalsResult.data || [],
      pet_import: petImportResult.data || [],
      city_news: cityNewsResult.data || [],
      local_intel_data: localIntelResult.data || [],
    };
  } catch (error) {
    console.error('Secondary city data error:', error);
    return {
      housing_areas: [],
      housing_websites: [],
      air_quality: [],
      city_apps: [],
      hospitals: [],
      pet_import: [],
      city_news: [],
      local_intel_data: [],
    };
  }
}

// Optimized cities listing query
export async function getCitiesListing() {
  const { data: cities, error } = await supabase
    .from('cities')
    .select(`
      id,
      name,
      country,
      slug,
      hero_image_url,
      salary_data(avg_salary),
      schools(id)
    `)
    .order('name');

  if (error) {
    console.error('Error fetching cities listing:', error);
    return [];
  }

  // Transform to match CityCard expectations
  return cities.map(city => {
    const schoolCount = Array.isArray(city.schools) ? city.schools.length : 0;
    const avgSalary = city.salary_data?.[0]?.avg_salary;

    return {
      ...city,
      image: city.hero_image_url,
      stats: {
        avgSalary: avgSalary ? `$${Math.round(avgSalary).toLocaleString()}` : 'N/A',
        costOfLiving: 'N/A',
        schoolCount: schoolCount,
        sentiment: 'N/A'
      }
    };
  });
}