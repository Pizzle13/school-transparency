export default function ArticleContent({ article }) {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            {article.category}
          </span>
          {article.subcategory && (
            <span className="text-gray-500">→ {article.subcategory}</span>
          )}
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>By {article.author}</span>
          <span>•</span>
          <time>{article.publishedDate}</time>
        </div>
      </header>

      {/* Featured Image */}
      {article.featuredImage && (
        <div className="mb-8">
          <img 
            src={article.featuredImage} 
            alt={article.title}
            className="w-full rounded-lg"
          />
          {article.imageCredit && (
            <p 
              className="text-xs text-gray-500 mt-2"
              dangerouslySetInnerHTML={{ __html: article.imageCredit }}
            />
          )}
        </div>
      )}

      {/* Article Content */}
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Sources */}
      {article.sources && article.sources.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold mb-4">Sources</h3>
          <ul className="space-y-2">
            {article.sources.map((source, index) => (
              <li key={index}>
                <a 
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  [{index + 1}] {source.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}