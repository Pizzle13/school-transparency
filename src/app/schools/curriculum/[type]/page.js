import { getSchools, getCountryList } from '../../../../lib/data/school-queries';
import SchoolDirectoryClient from '../../../../components/schools/SchoolDirectoryClient';
import HeroBackground from '../../../../components/schools/HeroBackground';
import Link from 'next/link';

export const revalidate = 600;

// Map URL slugs to curriculum filter values and display labels.
// IB programmes use `programmes` text[] contains filter.
// National curricula use `curriculum` text[] contains filter.
const CURRICULUM_MAP = {
  // IB programmes
  'ib': { programme: 'IB_ALL', label: 'IB World Schools', description: 'All IB World Schools offering PYP, MYP, DP, or CP programmes' },
  'ib-dp': { programme: 'DP', label: 'IB Diploma Programme (DP)', description: 'Schools offering the IB Diploma Programme for ages 16-19' },
  'ib-myp': { programme: 'MYP', label: 'IB Middle Years Programme (MYP)', description: 'Schools offering the IB Middle Years Programme for ages 11-16' },
  'ib-pyp': { programme: 'PYP', label: 'IB Primary Years Programme (PYP)', description: 'Schools offering the IB Primary Years Programme for ages 3-12' },
  'ib-cp': { programme: 'CP', label: 'IB Career-related Programme (CP)', description: 'Schools offering the IB Career-related Programme for ages 16-19' },
  // National curricula
  'british': { programme: 'British', label: 'British Curriculum Schools', description: 'International schools following the British national curriculum, including IGCSE and A-Levels' },
  'american': { programme: 'American', label: 'American Curriculum Schools', description: 'International schools following the American curriculum, including US high school diploma programs' },
  'canadian': { programme: 'Canadian', label: 'Canadian Curriculum Schools', description: 'International schools offering the Canadian provincial curriculum' },
  'australian': { programme: 'Australian', label: 'Australian Curriculum Schools', description: 'International schools following the Australian national curriculum' },
  'french': { programme: 'French', label: 'French Curriculum Schools', description: 'International schools offering the French national curriculum and baccalauréat' },
  'german': { programme: 'German', label: 'German Curriculum Schools', description: 'International schools offering the German curriculum and Abitur qualification' },
  'indian': { programme: 'Indian', label: 'Indian Curriculum Schools', description: 'International schools following CBSE, ICSE, or other Indian national curriculum boards' },
  'swiss': { programme: 'Swiss', label: 'Swiss Curriculum Schools', description: 'International schools offering the Swiss Maturité or Swiss curriculum' },
};

export async function generateMetadata({ params }) {
  const { type } = await params;
  const curriculum = CURRICULUM_MAP[type];

  if (!curriculum) {
    return { title: 'Curriculum Not Found | School Transparency' };
  }

  const { totalCount } = await getSchools({ programme: curriculum.programme, perPage: 1 });

  return {
    title: `${curriculum.label} — ${totalCount.toLocaleString()} Schools Worldwide | School Transparency`,
    description: `${curriculum.description}. Browse ${totalCount.toLocaleString()} schools worldwide.`,
    alternates: {
      canonical: `https://schooltransparency.com/schools/curriculum/${type}`,
    },
    openGraph: {
      title: `${curriculum.label} | School Transparency`,
      description: `Browse ${totalCount.toLocaleString()} ${curriculum.label} schools worldwide.`,
      url: `https://schooltransparency.com/schools/curriculum/${type}`,
      type: 'website',
    },
  };
}

export default async function CurriculumPage({ params, searchParams }) {
  const { type } = await params;
  const resolvedParams = await searchParams;
  const curriculum = CURRICULUM_MAP[type];

  // 404-style for unknown curriculum types
  if (!curriculum) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-stone-300 mb-4">Curriculum Not Found</h1>
          <p className="text-stone-500 mb-6">We don&apos;t have data for this curriculum type yet.</p>
          <Link href="/schools" className="text-orange-600 font-bold hover:underline">
            Browse all schools &rarr;
          </Link>
        </div>
      </div>
    );
  }

  const page = Math.max(1, parseInt(resolvedParams?.page) || 1);
  const country = resolvedParams?.country || '';
  const search = resolvedParams?.q || '';
  const sort = resolvedParams?.sort || 'name';

  const [schoolsResult, countries] = await Promise.all([
    getSchools({
      search, country, programme: curriculum.programme, page, sort,
    }),
    getCountryList({ programme: curriculum.programme }),
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
            <span className="text-white">{curriculum.label}</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-black mb-4">
            {curriculum.label}
          </h1>
          <p className="text-lg text-stone-400 max-w-2xl">
            {curriculum.description}.{' '}
            {schoolsResult.totalCount > 0 &&
              `${schoolsResult.totalCount.toLocaleString()} schools worldwide.`
            }
          </p>
        </div>
      </section>

      {/* Directory */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <SchoolDirectoryClient
          schools={schoolsResult.schools}
          totalCount={schoolsResult.totalCount}
          totalPages={schoolsResult.totalPages}
          currentPage={page}
          countries={countries}
          lockedFilters={{ programme: curriculum.programme || undefined }}
        />
      </section>
    </div>
  );
}
