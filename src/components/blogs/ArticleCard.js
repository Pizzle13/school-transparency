import Link from 'next/link';

// Explicit category styling to ensure Tailwind includes all classes
const getCategoryStyles = (category) => {
  const styles = {
    'Life Abroad': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Cost of Living': 'bg-amber-100 text-amber-800 border-amber-200',
    'Cultural Adaptation': 'bg-purple-100 text-purple-800 border-purple-200',
    'Quality of Life': 'bg-rose-100 text-rose-800 border-rose-200',
    'School Intelligence': 'bg-blue-100 text-blue-800 border-blue-200',
    'Country Guides': 'bg-green-100 text-green-800 border-green-200',
    'Economic Data': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'School Reviews': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Teacher Career': 'bg-teal-100 text-teal-800 border-teal-200',
    'Contracts & Salaries': 'bg-orange-100 text-orange-800 border-orange-200',
    'Job Search & Hiring': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'Professional Development': 'bg-violet-100 text-violet-800 border-violet-200',
    'Uncategorized': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return styles[category] || styles['Uncategorized'];
};

export default function ArticleCard({ article }) {
  const categoryStyles = getCategoryStyles(article.category);

  return (
    <article className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1">
      {article.featuredImage && (
        <div className="relative overflow-hidden">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`${categoryStyles} px-4 py-2 rounded-full text-sm font-medium border`}>
            {article.category}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(article.publishedDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>

        <h2 className="text-xl font-bold mb-3 text-gray-900 leading-tight">
          <Link href={`/blog/${article.slug}`} className="hover:text-indigo-600 transition-colors">
            {article.title}
          </Link>
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>

        <Link
          href={`/blog/${article.slug}`}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold group transition-colors"
        >
          Read More
          <svg className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}