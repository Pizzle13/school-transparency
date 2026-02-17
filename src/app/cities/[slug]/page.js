import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getCriticalCityData } from '../../../lib/data/city-queries';
import CityHero from '../../../components/cities/CityHero';
import SalaryAnalysis from '../../../components/cities/SalaryAnalysis';
import SchoolSection from '../../../components/cities/SchoolSection';

// Static imports for components
import AirQualitySection from '../../../components/cities/AirQualitySection';
import HousingResources from '../../../components/cities/HousingResources';
import EssentialAppsSection from '../../../components/cities/EssentialAppsSection';
import HealthcareSection from '../../../components/cities/HealthcareSection';
import PetImportSection from '../../../components/cities/PetImportSection';
import RecentNewsSection from '../../../components/cities/RecentNewsSection';
import LocalIntelSection from '../../../components/cities/LocalIntelSection';

export const revalidate = 600;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const city = await getCriticalCityData(resolvedParams.slug);

  if (!city) {
    return {
      title: 'City Not Found | School Transparency',
    };
  }

  const canonicalUrl = `https://schooltransparency.com/cities/${resolvedParams.slug}`;

  return {
    title: `${city.name}, ${city.country} - Teaching Jobs & City Guide | School Transparency`,
    description: `Comprehensive guide for international teachers in ${city.name}, ${city.country}. Explore salary data, international schools, housing, healthcare, and living costs.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${city.name} - International Teaching Guide`,
      description: `Everything you need to know about teaching in ${city.name}. Salary insights, schools, and expat resources.`,
      url: canonicalUrl,
      type: 'website',
      images: city.hero_image ? [city.hero_image] : [],
    },
  };
}

// Use optimized critical data fetching
async function getCityData(slug) {
  return await getCriticalCityData(slug);
}

export default async function CityPage({ params }) {
  const resolvedParams = await params;
  const city = await getCityData(resolvedParams.slug);

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

  // Fetch all secondary data at once
  const { getSecondaryCityData } = await import('../../../lib/data/city-queries');
  const secondaryData = await getSecondaryCityData(city.id);

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

      {/* Critical above-the-fold content */}
      <SalaryAnalysis data={city.salary_data?.[0]} economic={city.economic_data?.[0]} schools={city.schools} />
      <SchoolSection schools={city.schools} cityId={city.id} cityName={city.name} />

      {/* Secondary sections with fetched data */}
      <AirQualitySection data={secondaryData.air_quality} cityName={city.name} dataYear={city.created_at ? new Date(city.created_at).getFullYear() : null} />
      <HousingResources
        areas={secondaryData.housing_areas}
        websites={secondaryData.housing_websites}
        cityName={city.name}
      />
      <EssentialAppsSection apps={secondaryData.city_apps} />
      <HealthcareSection hospitals={secondaryData.hospitals} />
      <PetImportSection petImport={secondaryData.pet_import?.[0]} />
      <RecentNewsSection news={secondaryData.city_news} />
      <LocalIntelSection intelData={secondaryData.local_intel_data} cityId={city.id} cityName={city.name} />
    </div>
  );
}

