import Link from 'next/link';

// Explicit category styling to ensure Tailwind includes all classes
const getCategoryStyles = (category) => {
  const styles = {
    'Life Abroad': { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', accent: 'from-emerald-500 to-teal-600' },
    'Cost of Living': { badge: 'bg-amber-100 text-amber-800 border-amber-200', accent: 'from-amber-500 to-orange-600' },
    'Cultural Adaptation': { badge: 'bg-purple-100 text-purple-800 border-purple-200', accent: 'from-purple-500 to-indigo-600' },
    'Quality of Life': { badge: 'bg-rose-100 text-rose-800 border-rose-200', accent: 'from-rose-500 to-pink-600' },
    'School Intelligence': { badge: 'bg-blue-100 text-blue-800 border-blue-200', accent: 'from-blue-500 to-cyan-600' },
    'Country Guides': { badge: 'bg-green-100 text-green-800 border-green-200', accent: 'from-green-500 to-emerald-600' },
    'Economic Data': { badge: 'bg-indigo-100 text-indigo-800 border-indigo-200', accent: 'from-indigo-500 to-purple-600' },
    'School Reviews': { badge: 'bg-yellow-100 text-yellow-800 border-yellow-200', accent: 'from-yellow-500 to-amber-600' },
    'Teacher Career': { badge: 'bg-teal-100 text-teal-800 border-teal-200', accent: 'from-teal-500 to-cyan-600' },
    'Contracts & Salaries': { badge: 'bg-orange-100 text-orange-800 border-orange-200', accent: 'from-orange-500 to-red-600' },
    'Job Search & Hiring': { badge: 'bg-cyan-100 text-cyan-800 border-cyan-200', accent: 'from-cyan-500 to-blue-600' },
    'Professional Development': { badge: 'bg-violet-100 text-violet-800 border-violet-200', accent: 'from-violet-500 to-purple-600' },
    'Uncategorized': { badge: 'bg-gray-100 text-gray-800 border-gray-200', accent: 'from-gray-500 to-slate-600' }
  };
  return styles[category] || styles['Uncategorized'];
};

export default function HeroCard({ article }) {
  const styles = getCategoryStyles(article.category);

  return (
    <article className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:scale-[1.02]">
      <div className="lg:flex">
        {/* Image Section */}
        <div className="lg:w-1/2 relative">
          {article.featuredImage ? (
            <div className="relative overflow-hidden">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-64 lg:h-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>
          ) : (
            <div className={`w-full h-64 lg:h-full bg-gradient-to-br ${styles.accent} flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="text-center text-white relative z-10">
                <svg className="mx-auto h-20 w-20 mb-4 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className="text-lg font-medium opacity-90">Featured Article</p>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-sm mb-6">
            <span className={`${styles.badge} px-5 py-2 rounded-full font-semibold border shadow-sm`}>
              {article.category}
            </span>
            {article.subcategory && (
              <>
                <span className="text-gray-300">→</span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                  {article.subcategory}
                </span>
              </>
            )}
          </div>

          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            <Link href={`/blog/${article.slug}`} className="hover:text-indigo-600 transition-colors duration-300">
              {article.title}
            </Link>
          </h1>

          <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed line-clamp-4">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-3">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-700">{article.author}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(article.publishedDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link
            href={`/blog/${article.slug}`}
            className={`inline-flex items-center px-8 py-4 bg-gradient-to-r ${styles.accent} text-white font-semibold text-lg rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 group`}
          >
            Read Article
            <svg className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}