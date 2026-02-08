import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import ArticleContent from '../../../components/blogs/ArticleContent';
import articlesIndex from '../../../../public/data/articles-index.json';

export const revalidate = 3600;

function getArticleBySlug(slug) {
  // Try individual file first (new structure)
  const filePath = path.join(process.cwd(), 'public', 'data', 'articles', `${slug}.json`);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    // Fallback to legacy articles.json
    try {
      const legacyPath = path.join(process.cwd(), 'public', 'data', 'articles.json');
      const legacyContent = fs.readFileSync(legacyPath, 'utf-8');
      const legacyData = JSON.parse(legacyContent);
      return legacyData.articles.find(a => a.slug === slug) || null;
    } catch {
      return null;
    }
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  // Use index for metadata (lightweight)
  const indexEntry = articlesIndex.find(a => a.slug === resolvedParams.slug);

  if (!indexEntry) {
    return { title: 'Article Not Found' };
  }

  const canonicalUrl = `https://schooltransparency.com/blog/${resolvedParams.slug}`;

  return {
    title: `${indexEntry.title} | School Transparency`,
    description: indexEntry.excerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: indexEntry.title,
      description: indexEntry.excerpt,
      url: canonicalUrl,
      type: 'article',
      images: indexEntry.featuredImage ? [indexEntry.featuredImage] : [],
    },
  };
}

export default async function ArticlePage({ params }) {
  const resolvedParams = await params;
  const article = getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  // Resolve related articles from index (metadata only, for cards)
  const relatedArticlesData = (article.relatedArticles || [])
    .map(slug => articlesIndex.find(a => a.slug === slug))
    .filter(Boolean);

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
        <ArticleContent article={article} relatedArticles={relatedArticlesData} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return articlesIndex.map((article) => ({
    slug: article.slug,
  }));
}
