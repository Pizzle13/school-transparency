import Link from 'next/link';

export default function ArticleCard({ article }) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {article.featuredImage && (
        <img 
          src={article.featuredImage} 
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            {article.category}
          </span>
          <span>{article.publishedDate}</span>
        </div>
        
        <h2 className="text-xl font-bold mb-2 text-gray-900">
          <Link href={`/blog/${article.slug}`} className="hover:text-blue-600">
            {article.title}
          </Link>
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        
        <Link 
          href={`/blog/${article.slug}`}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}