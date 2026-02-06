import Link from 'next/link';
import { getCitiesListing } from '../../lib/data/city-queries';
import CitySearch from '../../components/cities/CitySearch';

export const revalidate = 300;

export const metadata = {
  title: 'City Guides for International Teachers | School Transparency',
  description: 'Explore comprehensive city guides for international teachers. Find salary data, international schools, housing, healthcare, and living costs in cities worldwide.',
  alternates: {
    canonical: 'https://schooltransparency.com/cities',
  },
  openGraph: {
    title: 'City Guides for International Teachers',
    description: 'Data-driven city guides with salary insights, school information, and expat resources for international educators.',
    url: 'https://schooltransparency.com/cities',
    type: 'website',
  },
};

async function getCities() {
  return await getCitiesListing();
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