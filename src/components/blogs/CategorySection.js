import Link from 'next/link';
import ArticleCard from './ArticleCard';

// Explicit category styling to ensure Tailwind includes all classes
const getCategoryStyles = (category) => {
  const styles = {
    'Life Abroad': {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      container: 'bg-emerald-100 border-emerald-200',
      text: 'text-emerald-800',
      accent: 'from-emerald-500 to-teal-600'
    },
    'Cost of Living': {
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      container: 'bg-amber-100 border-amber-200',
      text: 'text-amber-800',
      accent: 'from-amber-500 to-orange-600'
    },
    'Cultural Adaptation': {
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      container: 'bg-purple-100 border-purple-200',
      text: 'text-purple-800',
      accent: 'from-purple-500 to-indigo-600'
    },
    'Quality of Life': {
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
      container: 'bg-rose-100 border-rose-200',
      text: 'text-rose-800',
      accent: 'from-rose-500 to-pink-600'
    },
    'School Intelligence': {
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      container: 'bg-blue-100 border-blue-200',
      text: 'text-blue-800',
      accent: 'from-blue-500 to-cyan-600'
    },
    'Country Guides': {
      badge: 'bg-green-100 text-green-800 border-green-200',
      container: 'bg-green-100 border-green-200',
      text: 'text-green-800',
      accent: 'from-green-500 to-emerald-600'
    },
    'Economic Data': {
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      container: 'bg-indigo-100 border-indigo-200',
      text: 'text-indigo-800',
      accent: 'from-indigo-500 to-purple-600'
    },
    'School Reviews': {
      badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      container: 'bg-yellow-100 border-yellow-200',
      text: 'text-yellow-800',
      accent: 'from-yellow-500 to-amber-600'
    },
    'Teacher Career': {
      badge: 'bg-teal-100 text-teal-800 border-teal-200',
      container: 'bg-teal-100 border-teal-200',
      text: 'text-teal-800',
      accent: 'from-teal-500 to-cyan-600'
    },
    'Contracts & Salaries': {
      badge: 'bg-orange-100 text-orange-800 border-orange-200',
      container: 'bg-orange-100 border-orange-200',
      text: 'text-orange-800',
      accent: 'from-orange-500 to-red-600'
    },
    'Job Search & Hiring': {
      badge: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      container: 'bg-cyan-100 border-cyan-200',
      text: 'text-cyan-800',
      accent: 'from-cyan-500 to-blue-600'
    },
    'Professional Development': {
      badge: 'bg-violet-100 text-violet-800 border-violet-200',
      container: 'bg-violet-100 border-violet-200',
      text: 'text-violet-800',
      accent: 'from-violet-500 to-purple-600'
    },
    'Uncategorized': {
      badge: 'bg-gray-100 text-gray-800 border-gray-200',
      container: 'bg-gray-100 border-gray-200',
      text: 'text-gray-800',
      accent: 'from-gray-500 to-slate-600'
    }
  };

  return styles[category] || styles['Uncategorized'];
};

export default function CategorySection({ category, articles }) {
  const styles = getCategoryStyles(category);

  return (
    <section className="mb-20">
      {/* Category Header - Always shows colored badge */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              <span className={`${styles.badge} px-6 py-3 rounded-2xl text-2xl font-bold border-2 shadow-sm`}>
                {category}
              </span>
            </h2>
            <div className={`h-1 w-24 bg-gradient-to-r ${styles.accent} rounded-full ml-1`}></div>
          </div>
        </div>
        {articles.length > 0 && (
          <Link
            href="#"
            className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm flex items-center group px-4 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-all border border-indigo-200"
          >
            View All
            <svg className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {/* Articles Grid or Empty State */}
      {articles.length === 0 ? (
        <div className={`${styles.container} border-2 rounded-3xl p-16 text-center transition-all duration-300 hover:shadow-md`}>
          <div className={`${styles.text} mb-8`}>
            <svg className="mx-auto h-20 w-20 mb-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className={`text-2xl font-bold ${styles.text} mb-4 opacity-80`}>Coming Soon</h3>
            <p className={`${styles.text} leading-relaxed text-lg opacity-70`}>
              We're working on insightful content for <span className="font-semibold">{category.toLowerCase()}</span>.
              <br />
              Stay tuned for expert insights and practical advice!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}