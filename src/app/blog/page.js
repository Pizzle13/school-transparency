import ArticleCard from '../../components/blogs/ArticleCard';
import articlesData from '../../../public/data/articles.json';
export const metadata = {
  title: 'Blog | School Transparency',
  description: 'Data-driven insights for international teachers',
};

export default function BlogPage() {
  const articles = articlesData.articles;

  // Sort by date (newest first)
  const sortedArticles = [...articles].sort((a, b) => 
    new Date(b.publishedDate) - new Date(a.publishedDate)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blog
          </h1>
          <p className="text-xl text-gray-600">
            Data-driven insights for international teachers
          </p>
        </header>

        {sortedArticles.length === 0 ? (
          <p className="text-gray-600">No articles published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}