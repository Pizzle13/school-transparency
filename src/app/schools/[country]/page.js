import { getSchools, getCountryStats } from '../../../lib/data/school-queries';
import { deslugifyDisplay } from '../../../lib/utils/slug';
import SchoolDirectoryClient from '../../../components/schools/SchoolDirectoryClient';
import CountryStats from '../../../components/schools/CountryStats';
import HeroBackground from '../../../components/schools/HeroBackground';
import Link from 'next/link';

export const revalidate = 600;

export async function generateMetadata({ params }) {
  const { country } = await params;
  const displayName = deslugifyDisplay(country);
  const stats = await getCountryStats(country);
  const count = stats?.totalSchools || 0;

  // Noindex pages with very few results (waste of crawl budget)
  const shouldNoindex = count < 5;

  return {
    title: `International Schools in ${displayName} — ${count} Schools | School Transparency`,
    description: `Browse ${count} international schools in ${displayName}. Filter by IB programme, school type, boarding, and more.`,
    alternates: {
      canonical: `https://schooltransparency.com/schools/${country}`,
    },
    robots: shouldNoindex ? { index: false } : undefined,
    openGraph: {
      title: `International Schools in ${displayName} | School Transparency`,
      description: `Browse ${count} international schools in ${displayName}.`,
      url: `https://schooltransparency.com/schools/${country}`,
      type: 'website',
    },
  };
}

export default async function CountrySchoolsPage({ params, searchParams }) {
  const { country } = await params;
  const resolvedParams = await searchParams;
  const displayName = deslugifyDisplay(country);

  const page = Math.max(1, parseInt(resolvedParams?.page) || 1);
  const programme = resolvedParams?.programme || '';
  const schoolType = resolvedParams?.schoolType || '';
  const boarding = resolvedParams?.boarding || '';
  const gender = resolvedParams?.gender || '';
  const search = resolvedParams?.q || '';
  const sort = resolvedParams?.sort || 'name';

  const [schoolsResult, stats] = await Promise.all([
    getSchools({ search, country, programme, schoolType, boarding, gender, page, sort }),
    getCountryStats(country),
  ]);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="relative bg-stone-900 text-white py-16 md:py-20 overflow-hidden">
        <HeroBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-stone-400 mb-6">
            <Link href="/schools" className="hover:text-white transition-colors">Schools</Link>
            <span>/</span>
            <span className="text-white">{displayName}</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-black mb-4">
            International Schools in {displayName}
          </h1>
          <p className="text-lg text-stone-400">
            {stats?.totalSchools
              ? `${stats.totalSchools.toLocaleString()} schools found in ${displayName}`
              : `Browse international schools in ${displayName}`
            }
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
        <CountryStats stats={stats} />
      </section>

      {/* Directory */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <SchoolDirectoryClient
          schools={schoolsResult.schools}
          totalCount={schoolsResult.totalCount}
          totalPages={schoolsResult.totalPages}
          currentPage={page}
          countries={[]}
          lockedFilters={{ country }}
        />
      </section>
    </div>
  );
}
