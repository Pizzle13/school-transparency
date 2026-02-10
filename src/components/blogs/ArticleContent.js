'use client';

import articlesData from '../../../public/data/articles.json';

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

export default function ArticleContent({ article }) {
  const styles = getCategoryStyles(article.category);

  // Remove the old references/sources section from the HTML content
  const cleanContent = article.content
    .replace(/<h2>References<\/h2>[\s\S]*$/, '') // Remove References section and everything after
    .replace(/<h2>Conclusion<\/h2>([\s\S]*?)<h2>References<\/h2>[\s\S]*$/, '<h2>Conclusion</h2>$1') // Keep conclusion but remove references
    .replace(/<hr>\s*<strong>About This Article<\/strong>[\s\S]*$/, '') // Remove "About This Article" footer section
    .replace(/<hr>\s*$/, ''); // Remove trailing HR tags

  return (
    <>
      {/* Hero Section with Featured Image */}
      <section className="relative mb-16">
        {article.featuredImage ? (
          <div className="relative h-[60vh] min-h-[400px] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

            {/* Hero Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 text-white">
              <div className="max-w-4xl">
                {/* Category Badges */}
                <div className="flex items-center gap-3 mb-6">
                  <span className={`${styles.badge} px-5 py-2 rounded-full font-semibold text-sm border-2 shadow-lg`}>
                    {article.category}
                  </span>
                  {article.subcategory && (
                    <>
                      <span className="text-white/70">→</span>
                      <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                        {article.subcategory}
                      </span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 text-shadow-lg">
                  {article.title}
                </h1>

                {/* Author & Date */}
                <div className="flex items-center gap-6 text-white/90">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {article.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{article.author}</p>
                      <p className="text-sm text-white/70">
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
            </div>

            {/* Image Credit */}
            {article.imageCredit && (
              <div className="absolute top-4 right-4">
                <p
                  className="text-xs text-white/70 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm"
                  dangerouslySetInnerHTML={{ __html: article.imageCredit }}
                />
              </div>
            )}
          </div>
        ) : (
          /* No Featured Image - Alternative Hero */
          <div className={`relative h-[40vh] min-h-[300px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br ${styles.accent}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
            <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-12 text-white text-center">
              <div className="max-w-4xl">
                {/* Category Badges */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="bg-white/20 text-white px-5 py-2 rounded-full font-semibold text-sm backdrop-blur-sm border border-white/30">
                    {article.category}
                  </span>
                  {article.subcategory && (
                    <>
                      <span className="text-white/70">→</span>
                      <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                        {article.subcategory}
                      </span>
                    </>
                  )}
                </div>

                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
                  {article.title}
                </h1>

                <div className="flex items-center justify-center gap-6 text-white/90">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg backdrop-blur-sm">
                      {article.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{article.author}</p>
                      <p className="text-sm text-white/70">
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
            </div>
          </div>
        )}
      </section>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Article Body with Enhanced Typography */}
        <div className="prose prose-lg prose-indigo max-w-none">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />
        </div>

        {/* Related Articles Section */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {article.relatedArticles.map((slug) => {
                const relatedArticle = articlesData.articles.find(a => a.slug === slug);
                if (!relatedArticle) return null;
                return (
                  <a
                    key={slug}
                    href={`/blog/${slug}`}
                    className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      {relatedArticle.featuredImage ? (
                        <img
                          src={relatedArticle.featuredImage}
                          alt={relatedArticle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500" />
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                        {relatedArticle.category}
                      </span>
                      <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Sources Section */}
        {article.sources && article.sources.length > 0 && (
          <div className="mt-20 pt-12 border-t-2 border-gradient">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">References & Sources</h3>
              </div>
              <div className="grid gap-4">
                {article.sources.map((source, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-lg transition-colors group"
                      >
                        {source.title}
                        <svg className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <p className="text-gray-500 text-sm mt-1 break-all overflow-wrap-anywhere">{source.url}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>

      {/* Enhanced Typography Styles */}
      <style jsx global>{`
        .article-content h1 {
          font-size: 2.75rem;
          font-weight: 800;
          margin: 3rem 0 1.5rem 0;
          color: #111827;
          line-height: 1.2;
          position: relative;
        }

        .article-content h1::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 60px;
          height: 4px;
          background: linear-gradient(to right, #6366f1, #8b5cf6);
          border-radius: 2px;
        }

        .article-content h2 {
          font-size: 2.25rem;
          font-weight: 700;
          margin: 2.5rem 0 1.25rem 0;
          color: #1f2937;
          line-height: 1.3;
        }

        .article-content h3 {
          font-size: 1.75rem;
          font-weight: 600;
          margin: 2rem 0 1rem 0;
          color: #374151;
          line-height: 1.4;
        }

        .article-content p {
          font-size: 1.2rem;
          line-height: 1.8;
          margin-bottom: 1.5rem;
          color: #4b5563;
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
        }

        .article-content a {
          color: #6366f1;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }

        .article-content a:hover {
          color: #4f46e5;
          border-bottom-color: #6366f1;
        }

        .article-content strong {
          font-weight: 700;
          color: #111827;
        }

        .article-content em {
          font-style: italic;
          color: #6b7280;
        }

        .article-content ul, .article-content ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }

        .article-content li {
          margin-bottom: 0.75rem;
          font-size: 1.2rem;
          line-height: 1.8;
          color: #4b5563;
        }

        .article-content hr {
          margin: 3rem 0;
          border: none;
          height: 1px;
          background: linear-gradient(to right, transparent, #d1d5db, transparent);
        }

        .article-content blockquote {
          margin: 2rem 0;
          padding: 1.5rem 2rem;
          border-left: 4px solid #6366f1;
          background: linear-gradient(to right, #f8fafc, #f1f5f9);
          border-radius: 0 8px 8px 0;
          font-style: italic;
          position: relative;
        }

        .article-content blockquote::before {
          content: '"';
          position: absolute;
          top: 0.5rem;
          left: 1rem;
          font-size: 3rem;
          color: #6366f1;
          opacity: 0.3;
        }


        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          font-size: 1.05rem;
          font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .article-content thead {
          background: linear-gradient(135deg, #1e293b, #334155);
        }

        .article-content th {
          padding: 0.875rem 1.25rem;
          text-align: left;
          font-weight: 600;
          color: #ffffff;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .article-content td {
          padding: 0.75rem 1.25rem;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }

        .article-content tbody tr:nth-child(even) {
          background-color: #f8fafc;
        }

        .article-content tbody tr:hover {
          background-color: #eef2ff;
        }

        .article-content tbody tr:last-child td {
          border-bottom: none;
        }

        .text-shadow-lg {
          text-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        /* Mobile responsive styles */
        @media (max-width: 640px) {
          .article-content h1 {
            font-size: 1.875rem;
            margin: 2rem 0 1rem 0;
          }

          .article-content h2 {
            font-size: 1.5rem;
            margin: 1.5rem 0 1rem 0;
          }

          .article-content h3 {
            font-size: 1.25rem;
            margin: 1.25rem 0 0.75rem 0;
          }

          .article-content p {
            font-size: 1rem;
            line-height: 1.7;
            margin-bottom: 1.25rem;
          }

          .article-content li {
            font-size: 1rem;
            line-height: 1.7;
            margin-bottom: 0.5rem;
          }

          .article-content ul, .article-content ol {
            margin: 1rem 0;
            padding-left: 1.5rem;
          }

          .article-content blockquote {
            margin: 1.5rem 0;
            padding: 1rem 1.25rem;
          }

          .article-content blockquote::before {
            font-size: 2.5rem;
            left: 0.75rem;
          }

          .article-content table {
            font-size: 0.9rem;
            display: block;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .article-content th, .article-content td {
            padding: 0.625rem 0.875rem;
            white-space: nowrap;
          }


        }
      `}</style>
    </>
  );
}