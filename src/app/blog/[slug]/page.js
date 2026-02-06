import { notFound } from 'next/navigation';
import Link from 'next/link';
import ArticleContent from '../../../components/blogs/ArticleContent';
import articlesData from '../../../../public/data/articles.json';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const article = articlesData.articles.find(a => a.slug === resolvedParams.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const canonicalUrl = `https://schooltransparency.com/blog/${resolvedParams.slug}`;

  return {
    title: `${article.title} | School Transparency`,
    description: article.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: canonicalUrl,
      type: 'article',
      images: article.featuredImage ? [article.featuredImage] : [],
    },
  };
}

export default async function ArticlePage({ params }) {
  const resolvedParams = await params;
  const article = articlesData.articles.find(a => a.slug === resolvedParams.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Back Button */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors group"
          >
            <svg className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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