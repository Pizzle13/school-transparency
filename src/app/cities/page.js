import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import CitySearch from '../../components/cities/CitySearch';

async function getCities() {
  const { data: cities, error } = await supabase
    .from('cities')
    .select(`
      *,
      salary_data(avg_salary),
      schools(id)
    `)
    .order('name');

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  // Transform to match CityCard expectations
  const transformedCities = cities.map(city => {
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

  return transformedCities;
}

export default async function CitiesPage() {
  const cities = await getCities();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-blue-700">City Intelligence</h1>
              <p className="text-slate-600 mt-1">Data-driven insights for international teachers</p>
            </div>
            <Link href="/" className="text-slate-600 hover:text-blue-700 transition">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <CitySearch cities={cities} />
    </div>
  );
}