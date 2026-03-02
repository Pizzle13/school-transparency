import { getSchools, getCountryList, getDirectoryStats } from '../../lib/data/school-queries';
import SchoolDirectoryClient from '../../components/schools/SchoolDirectoryClient';
import HeroWires from '../../components/schools/HeroWires';

export const revalidate = 600;

export const metadata = {
  title: 'International School Directory | School Transparency',
  description: 'Browse 9,000+ international schools worldwide. Filter by country, IB programme, school type, and more. Compare schools side by side.',
  alternates: {
    canonical: 'https://schooltransparency.com/schools',
  },
  openGraph: {
    title: 'International School Directory | School Transparency',
    description: 'Browse 9,000+ international schools worldwide. Filter by country, IB programme, school type, and more.',
    url: 'https://schooltransparency.com/schools',
    type: 'website',
  },
};

export default async function SchoolsDirectoryPage({ searchParams }) {
  const resolvedParams = await searchParams;

  const page = Math.max(1, parseInt(resolvedParams?.page) || 1);
  const search = resolvedParams?.q || '';
  const country = resolvedParams?.country || '';
  const programme = resolvedParams?.programme || '';
  const schoolType = resolvedParams?.schoolType || '';
  const boarding = resolvedParams?.boarding || '';
  const gender = resolvedParams?.gender || '';
  const counsellor = resolvedParams?.counsellor || '';
  const sort = resolvedParams?.sort || 'name';

  const hasFilters = search || country || programme || schoolType || boarding || gender || counsellor;

  const [schoolsResult, countries, stats] = await Promise.all([
    getSchools({ search, country, programme, schoolType, boarding, gender, counsellor, page, sort }),
    getCountryList({ search, programme, schoolType, boarding, gender, counsellor }),
    page === 1 && !hasFilters
      ? getDirectoryStats()
      : Promise.resolve(null),
  ]);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="relative bg-stone-900 text-white py-16 md:py-24 overflow-hidden">
        <HeroWires />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-2 bg-orange-600/20 text-orange-400 text-xs uppercase tracking-widest font-medium rounded-full mb-6">
            School Directory
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-4">
            International Schools
          </h1>
          <p className="text-xl text-stone-400 max-w-2xl mx-auto">
            Browse {stats ? `${stats.totalSchools.toLocaleString()}` : ''} international schools across{' '}
            {countries.length} countries.
            Find the right school for your next move.
          </p>

          {/* Programme breakdown stats */}
          {stats && Object.keys(stats.programmeCounts).length > 0 && (
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {Object.entries(stats.programmeCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([prog, count]) => (
                  <div key={prog} className="text-center">
                    <p className="text-2xl font-black">{count.toLocaleString()}</p>
                    <p className="text-xs text-stone-400 font-medium">{prog}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Directory content */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <SchoolDirectoryClient
          schools={schoolsResult.schools}
          totalCount={schoolsResult.totalCount}
          totalPages={schoolsResult.totalPages}
          currentPage={page}
          countries={countries}
        />
      </section>
    </div>
  );
}
