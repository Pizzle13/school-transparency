import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import CityHero from '../../../components/cities/CityHero';
import SchoolSection from '../../../components/cities/SchoolSection';
import AirQualitySection from '../../../components/cities/AirQualitySection';
import SalaryAnalysis from '../../../components/cities/SalaryAnalysis';
import HousingResources from '../../../components/cities/HousingResources';
import EssentialAppsSection from '../../../components/cities/EssentialAppsSection';
import HealthcareSection from '../../../components/cities/HealthcareSection';
import PetImportSection from '../../../components/cities/PetImportSection';
import RecentNewsSection from '../../../components/cities/RecentNewsSection';
import LocalIntelSection from '../../../components/cities/LocalIntelSection';

async function getCityData(slug) {
  const { data: city, error } = await supabase
    .from('cities')
    .select(`
      *,
      economic_data(*),
      salary_data(*),
      housing_areas(*),
      housing_websites(*),
      schools(*),
      air_quality(*),
      city_apps(*),
      hospitals(*),
      pet_import(*),
      city_news(*),
      local_intel_data(*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return null;
  }

  return city;
}

export default async function CityPage({ params }) {
  const city = await getCityData(params.slug);

  if (!city) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">City Not Found</h1>
          <Link href="/cities" className="text-blue-700 hover:underline text-lg">
            ← Back to all cities
          </Link>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-white">
      <CityHero city={city} />

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/cities" 
            className="inline-flex items-center text-blue-700 hover:text-blue-800 font-semibold transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all cities
          </Link>
        </div>
      </div>

      <SalaryAnalysis data={city.salary_data?.[0]} economic={city.economic_data?.[0]} />
      <SchoolSection schools={city.schools} cityName={city.name} />
      <AirQualitySection data={city.air_quality} cityName={city.name} />
      <HousingResources areas={city.housing_areas} websites={city.housing_websites} cityName={city.name} />
      <EssentialAppsSection apps={city.city_apps} />
      <HealthcareSection hospitals={city.hospitals} emergencyNumbers={city.emergency_numbers} />
      <PetImportSection petImport={city.pet_import?.[0]} />
      <RecentNewsSection news={city.city_news} />
      <LocalIntelSection intelData={city.local_intel_data} cityName={city.name} />
    </div>
  );
}