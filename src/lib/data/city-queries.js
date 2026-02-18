import { supabase } from '../supabase';

// Fallback Unsplash hero images when the DB has no hero_image_url
const FALLBACK_IMAGES = {
  'ho-chi-minh-city': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1600&q=80',
  'hanoi': 'https://images.unsplash.com/photo-1753939582094-3091a6e0891e?w=1600&q=80',
  'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80',
  'bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1600&q=80',
  'chiang-mai': 'https://images.unsplash.com/photo-1513296314573-7065061dd88d?w=1600&q=80',
  'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1600&q=80',
  'istanbul': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&q=80',
  'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1600&q=80',
  'phnom-penh': 'https://images.unsplash.com/photo-1639805855077-c7978ecd2214?w=1600&q=80',
};

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
      created_at,
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

  // Use fallback image if DB has none or has invalid value
  if (!city.hero_image_url || city.hero_image_url === 'null' || !city.hero_image_url.startsWith('http')) {
    city.hero_image_url = FALLBACK_IMAGES[city.slug] || null;
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

// Get platform-wide stats (city count, total school count)
export async function getPlatformStats() {
  const [citiesResult, schoolsResult] = await Promise.all([
    supabase.from('cities').select('id', { count: 'exact', head: true }),
    supabase.from('schools').select('id', { count: 'exact', head: true }),
  ]);

  return {
    cityCount: citiesResult.count || 0,
    schoolCount: schoolsResult.count || 0,
  };
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
    const hasValidImage = city.hero_image_url && city.hero_image_url !== 'null' && city.hero_image_url.startsWith('http');
    const heroImage = hasValidImage ? city.hero_image_url : (FALLBACK_IMAGES[city.slug] || null);

    return {
      ...city,
      hero_image_url: heroImage,
      image: heroImage,
      stats: {
        avgSalary: avgSalary ? `$${Math.round(avgSalary).toLocaleString()}` : 'N/A',
        costOfLiving: 'N/A',
        schoolCount: schoolCount,
        sentiment: 'N/A'
      }
    };
  });
}