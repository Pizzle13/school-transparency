import { getSchoolBySlug } from '../../../../lib/data/school-queries';
import SchoolProfile from '../../../../components/schools/SchoolProfile';
import HeroBackground from '../../../../components/schools/HeroBackground';
import Link from 'next/link';

export const revalidate = 600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const school = await getSchoolBySlug(slug);

  if (!school) {
    return { title: 'School Not Found | School Transparency' };
  }

  const location = school.country_name || '';
  const programmes = Array.isArray(school.programmes) ? school.programmes.join(', ') : '';
  const description = [
    school.name,
    location ? `in ${location}` : '',
    programmes ? `— ${programmes}` : '',
  ].filter(Boolean).join(' ');

  return {
    title: `${school.name} — ${location || 'International School'} | School Transparency`,
    description,
    alternates: {
      canonical: `https://schooltransparency.com/schools/s/${slug}`,
    },
    openGraph: {
      title: `${school.name} | School Transparency`,
      description,
      url: `https://schooltransparency.com/schools/s/${slug}`,
      type: 'website',
    },
  };
}

export default async function SchoolDetailPage({ params }) {
  const { slug } = await params;
  const school = await getSchoolBySlug(slug);

  if (!school) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-5xl font-black text-stone-300 mb-4">School Not Found</h1>
          <p className="text-stone-500 mb-6">
            This school may not be in our directory yet, or the link may be incorrect.
          </p>
          <Link
            href="/schools"
            className="inline-block px-6 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors"
          >
            Browse all schools
          </Link>
        </div>
      </div>
    );
  }

  const countrySlug = school.country_name
    ? school.country_name.toLowerCase().replace(/\s+/g, '-')
    : '';

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero header */}
      <section className="relative bg-stone-900 text-white py-12 md:py-16 overflow-hidden">
        <HeroBackground />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-stone-400 mb-6 flex-wrap">
            <Link href="/schools" className="hover:text-white transition-colors">Schools</Link>
            {countrySlug && (
              <>
                <span>/</span>
                <Link href={`/schools/${countrySlug}/`} className="hover:text-white transition-colors">
                  {school.country_name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-white truncate">{school.name}</span>
          </nav>

          {/* Programme badges + rating */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {Array.isArray(school.programmes) && school.programmes.map(p => (
              <span key={p} className="text-xs font-bold uppercase bg-white/10 px-3 py-1 rounded">
                {p}
              </span>
            ))}
            {school.rating != null && (
              <span className="text-xs font-bold bg-orange-600/20 text-orange-400 px-3 py-1 rounded">
                &#9733; {school.rating}/10
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-black mb-3">
            {school.name}
          </h1>

          {school.country_name && (
            <p className="text-lg text-stone-400 mb-6">
              {school.address || school.country_name}
            </p>
          )}

          {/* Quick actions */}
          <div className="flex flex-wrap gap-3">
            {school.website_url && (
              <a
                href={school.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors backdrop-blur-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                Visit Website
              </a>
            )}
            {school.phone && (
              <a
                href={`tel:${school.phone}`}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors backdrop-blur-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                Call
              </a>
            )}
            {school.ibo_url && (
              <a
                href={school.ibo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors backdrop-blur-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                IBO Profile
              </a>
            )}
          </div>
        </div>
      </section>

      {/* School profile content */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <SchoolProfile school={school} />
      </section>

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'School',
            name: school.name,
            ...(school.website_url && { url: school.website_url }),
            ...(school.phone && { telephone: school.phone }),
            ...(school.country_name && {
              location: {
                '@type': 'Place',
                name: school.address || school.country_name,
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: school.country_code || school.country_name,
                  ...(school.address && { streetAddress: school.address }),
                },
              },
            }),
          }),
        }}
      />
    </div>
  );
}
