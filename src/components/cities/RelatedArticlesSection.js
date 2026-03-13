'use client';

export default function RelatedArticlesSection({ articles, cityName }) {
  // Only render if there are articles
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header - Bold Retroverse Style */}
        <div className="mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-orange-100 text-orange-600 text-xs uppercase tracking-widest font-medium">
              From The Blog
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-4 text-stone-900">
            Related Articles
          </h2>
          <p className="text-xl text-stone-600">In-depth guides written for teachers in {cityName}</p>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {articles.map(article => (
            <a
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Featured Image */}
              <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
                {article.featuredImage ? (
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500" />
                )}
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Category Badge */}
                <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                  {article.category}
                </span>

                {/* Title */}
                <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {article.excerpt}
                </p>

                {/* Published Date */}
                <p className="mt-3 text-xs text-gray-500 font-medium">
                  {new Date(article.publishedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Footer Link */}
        <div className="text-center">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors text-lg"
          >
            Browse all articles
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
