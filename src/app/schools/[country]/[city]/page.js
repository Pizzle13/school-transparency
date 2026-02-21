import { getSchoolsByCity } from '../../../../lib/data/school-queries';
import { deslugifyDisplay } from '../../../../lib/utils/slug';
import SchoolDirectoryClient from '../../../../components/schools/SchoolDirectoryClient';
import HeroBackground from '../../../../components/schools/HeroBackground';
import Link from 'next/link';

export const revalidate = 600;

export async function generateMetadata({ params }) {
  const { country, city } = await params;
  const cityName = deslugifyDisplay(city);
  const countryName = deslugifyDisplay(country);

  const { totalCount } = await getSchoolsByCity({ country, city, perPage: 1 });

  return {
    title: `International Schools in ${cityName}, ${countryName} — ${totalCount} Schools | School Transparency`,
    description: `Browse ${totalCount} international schools in ${cityName}, ${countryName}. Compare schools, filter by programme, and find the right fit.`,
    alternates: {
      canonical: `https://schooltransparency.com/schools/${country}/${city}`,
    },
    openGraph: {
      title: `International Schools in ${cityName}, ${countryName} | School Transparency`,
      description: `Browse international schools in ${cityName}, ${countryName}.`,
      url: `https://schooltransparency.com/schools/${country}/${city}`,
      type: 'website',
    },
  };
}

export default async function CitySchoolsPage({ params, searchParams }) {
  const { country, city } = await params;
  const resolvedParams = await searchParams;
  const cityName = deslugifyDisplay(city);
  const countryName = deslugifyDisplay(country);

  const page = Math.max(1, parseInt(resolvedParams?.page) || 1);
  const programme = resolvedParams?.programme || '';
  const search = resolvedParams?.q || '';
  const sort = resolvedParams?.sort || 'name';

  const schoolsResult = await getSchoolsByCity({
    country, city, search, programme, page, sort,
  });

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
            <Link href={`/schools/${country}/`} className="hover:text-white transition-colors">{countryName}</Link>
            <span>/</span>
            <span className="text-white">{cityName}</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-black mb-4">
            International Schools in {cityName}
          </h1>
          <p className="text-lg text-stone-400">
            {schoolsResult.totalCount > 0
              ? `${schoolsResult.totalCount} international schools in ${cityName}, ${countryName}`
              : `Browse international schools in ${cityName}, ${countryName}`
            }
          </p>

          {/* Link to city guide */}
          <Link
            href={`/cities/${city}`}
            className="inline-block mt-4 text-sm text-orange-400 hover:text-orange-300 transition-colors"
          >
            View {cityName} city guide for teachers &rarr;
          </Link>
        </div>
      </section>

      {/* Directory */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <SchoolDirectoryClient
          schools={schoolsResult.schools}
          totalCount={schoolsResult.totalCount}
          totalPages={schoolsResult.totalPages}
          currentPage={page}
          countries={[]}
          lockedFilters={{ country, city }}
        />
      </section>
    </div>
  );
}
