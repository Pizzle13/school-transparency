import { notFound } from 'next/navigation';
import ArticleContent from '../../../components/blogs/ArticleContent';
import articlesData from '../../../../public/data/articles.json';

export async function generateMetadata({ params }) {
  const article = articlesData.articles.find(a => a.slug === params.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | School Transparency`,
    description: article.excerpt,
  };
}

export default function ArticlePage({ params }) {
  const article = articlesData.articles.find(a => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ArticleContent article={article} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return articlesData.articles.map((article) => ({
    slug: article.slug,
  }));
}