import Link from 'next/link';
import { getPlatformStats } from '../lib/data/city-queries';
import articlesIndex from '../../public/data/articles-index.json';

export default async function Hero() {
  const { cityCount, schoolCount, reviewedSchoolCount, countryCount } = await getPlatformStats();
  const articleCount = articlesIndex.length;
  const categoryCount = new Set(articlesIndex.map(a => a.category)).size;
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-end justify-start bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-32 text-white">
          <div className="max-w-4xl">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-orange-500 text-orange-50 text-xs uppercase tracking-widest font-medium rounded-full">
                Data-Driven Education Intelligence
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-9xl font-black mb-8 leading-none">
              School Transparency
            </h1>
            <p className="text-lg sm:text-2xl md:text-3xl mb-12 text-white/90 max-w-3xl">
              Empowering international teachers with comprehensive data insights for smarter career decisions
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-6">
              <Link
                href="/schools"
                className="inline-flex items-center px-6 sm:px-8 py-4 bg-orange-600 text-white font-bold text-base sm:text-lg rounded-xl hover:bg-orange-500 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 border-4 border-black"
              >
                <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Browse {schoolCount.toLocaleString()} Schools
              </Link>
              <Link
                href="/cities"
                className="inline-flex items-center px-6 sm:px-8 py-4 bg-white text-black font-bold text-base sm:text-lg rounded-xl hover:bg-stone-100 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 border-4 border-black"
              >
                <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Explore Cities
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center px-6 sm:px-8 py-4 bg-white text-black font-bold text-base sm:text-lg rounded-xl hover:bg-stone-100 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 border-4 border-black"
              >
                <svg className="mr-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Read the Blog
              </Link>
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-orange-100 text-orange-600 text-xs uppercase tracking-widest font-medium">
                Platform Features
              </span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black mb-6 text-stone-900">
              Everything You Need
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl">
              Comprehensive resources and data insights designed specifically for international educators making informed career decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Blog Feature Card */}
            <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 border-4 border-indigo-200 hover:translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(99,102,241,1)] transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-stone-900">Educational Blog</h3>
                  <p className="text-indigo-600 font-semibold">Expert Insights & Analysis</p>
                </div>
              </div>
              <p className="text-lg text-stone-700 mb-6 leading-relaxed">
                In-depth articles covering contracts, salaries, cultural adaptation, and professional development. Filterable by {categoryCount} categories.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center p-3 bg-white rounded-xl border-2 border-indigo-200">
                  <p className="text-2xl font-black text-stone-900">{articleCount}</p>
                  <p className="text-sm text-stone-600">{articleCount === 1 ? 'Article' : 'Articles'} Published</p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl border-2 border-indigo-200">
                  <p className="text-2xl font-black text-stone-900">{categoryCount}</p>
                  <p className="text-sm text-stone-600">{categoryCount === 1 ? 'Category' : 'Categories'}</p>
                </div>
              </div>
              <Link href="/blog" className="text-indigo-600 font-bold hover:text-indigo-500 transition-colors">
                Start Reading →
              </Link>
            </div>

            {/* Cities Feature Card */}
            <div className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-3xl p-8 border-4 border-orange-200 hover:translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(234,88,12,1)] transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-stone-900">City Intelligence</h3>
                  <p className="text-orange-600 font-semibold">Data-Driven Location Analysis</p>
                </div>
              </div>
              <p className="text-lg text-stone-700 mb-6 leading-relaxed">
                Comprehensive city profiles including salary analysis, school data, cost of living, healthcare, and local insights for international teachers.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center p-3 bg-white rounded-xl border-2 border-orange-200">
                  <p className="text-2xl font-black text-stone-900">{cityCount}</p>
                  <p className="text-sm text-stone-600">{cityCount === 1 ? 'City' : 'Cities'} Covered</p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl border-2 border-orange-200">
                  <p className="text-2xl font-black text-stone-900">{reviewedSchoolCount}</p>
                  <p className="text-sm text-stone-600">{reviewedSchoolCount === 1 ? 'School' : 'Schools'} Reviewed</p>
                </div>
              </div>
              <Link href="/cities" className="text-orange-600 font-bold hover:text-orange-500 transition-colors">
                Explore Locations →
              </Link>
            </div>

            {/* Schools Directory Feature Card — full width below */}
            <div className="relative lg:col-span-2 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl p-8 border-4 border-emerald-200 hover:translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(5,150,105,1)] transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-stone-900">School Directory</h3>
                      <p className="text-emerald-600 font-semibold">Find & Compare International Schools</p>
                    </div>
                  </div>
                  <p className="text-lg text-stone-700 mb-6 leading-relaxed">
                    Search {schoolCount.toLocaleString()} international schools across {countryCount} countries. Filter by IB programme, school type, boarding, and more. Compare schools side by side.
                  </p>
                  <Link href="/schools" className="text-emerald-600 font-bold hover:text-emerald-500 transition-colors">
                    Browse Schools →
                  </Link>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-1 gap-4">
                  <div className="text-center p-3 bg-white rounded-xl border-2 border-emerald-200">
                    <p className="text-2xl font-black text-stone-900">{schoolCount.toLocaleString()}</p>
                    <p className="text-sm text-stone-600">Schools</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl border-2 border-emerald-200">
                    <p className="text-2xl font-black text-stone-900">{countryCount}</p>
                    <p className="text-sm text-stone-600">Countries</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl border-2 border-emerald-200">
                    <p className="text-2xl font-black text-stone-900">4</p>
                    <p className="text-sm text-stone-600">IB Programmes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-orange-100 text-orange-600 text-xs uppercase tracking-widest font-medium">
                What We Cover
              </span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black mb-6 text-stone-900">
              Built by an Educator
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              We&apos;re building the resource we wished existed when we started teaching abroad. Here&apos;s where we stand today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl border-2 border-stone-200 hover:scale-105 transition-transform duration-300">
              <p className="text-5xl font-black text-orange-600 mb-2">{articleCount}</p>
              <p className="text-stone-600 font-semibold">Articles Published</p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl border-2 border-stone-200 hover:scale-105 transition-transform duration-300">
              <p className="text-5xl font-black text-orange-600 mb-2">{cityCount}</p>
              <p className="text-stone-600 font-semibold">Cities Covered</p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl border-2 border-stone-200 hover:scale-105 transition-transform duration-300">
              <p className="text-5xl font-black text-orange-600 mb-2">{schoolCount}</p>
              <p className="text-stone-600 font-semibold">Schools Listed</p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl border-2 border-stone-200 hover:scale-105 transition-transform duration-300">
              <p className="text-5xl font-black text-orange-600 mb-2">{categoryCount}</p>
              <p className="text-stone-600 font-semibold">Topic Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-orange-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-orange-100 text-orange-600 text-xs uppercase tracking-widest font-medium">
              Get Started Today
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-6 text-stone-900">
            Your Next Step Awaits
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-12">
            Whether you're researching your next destination or looking for professional insights, we have the data you need to make confident decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/schools"
              className="inline-flex items-center px-10 py-5 bg-orange-600 text-white font-bold text-xl rounded-2xl hover:bg-orange-500 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 border-4 border-black"
            >
              Browse Schools
              <svg className="ml-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/cities"
              className="inline-flex items-center px-10 py-5 bg-white text-black font-bold text-xl rounded-2xl hover:bg-stone-100 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 border-4 border-black"
            >
              Explore Cities
              <svg className="ml-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}