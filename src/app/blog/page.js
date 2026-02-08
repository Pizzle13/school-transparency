'use client';

import { useState } from 'react';
import Link from 'next/link';
import ArticleCard from '../../components/blogs/ArticleCard';
import HeroCard from '../../components/blogs/HeroCard';
import CategorySection from '../../components/blogs/CategorySection';
import articlesIndex from '../../../public/data/articles-index.json';

export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const articles = articlesIndex;

  // Sort by date (newest first)
  const sortedArticles = [...articles].sort((a, b) =>
    new Date(b.publishedDate) - new Date(a.publishedDate)
  );

  // Define all categories in the order specified by the user
  const allCategories = [
    'Life Abroad',
    'Cost of Living',
    'Cultural Adaptation',
    'Quality of Life',
    'School Intelligence',
    'Country Guides',
    'Economic Data',
    'School Reviews',
    'Teacher Career',
    'Contracts & Salaries',
    'Job Search & Hiring',
    'Professional Development',
    'Uncategorized'
  ];

  // Create filter tabs (showing only categories with articles + "All")
  const categoriesWithArticles = allCategories.filter(category =>
    sortedArticles.some(article => article.category === category)
  );
  const filterTabs = ['All', ...categoriesWithArticles];

  // Filter articles based on active filter
  const filteredArticles = activeFilter === 'All'
    ? sortedArticles
    : sortedArticles.filter(article => article.category === activeFilter);

  // Get articles for display
  const newestArticle = filteredArticles[0];
  const otherArticles = filteredArticles.slice(1);

  // Group articles by category (for "All" view)
  const articlesByCategory = allCategories.reduce((acc, category) => {
    acc[category] = activeFilter === 'All'
      ? otherArticles.filter(article => article.category === category)
      : [];
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="pt-8 pb-4">
          <Link
            href="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors group"
          >
            <svg className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to School Transparency
          </Link>
        </div>

        {/* Header */}
        <header className="py-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Blog
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Data-driven insights for international teachers navigating careers, life abroad, and educational excellence
          </p>
        </header>

        {/* Category Filter Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
                  activeFilter === tab
                    ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on filter */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-20 w-20 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-500 mb-2">No Articles Found</h3>
              <p className="text-gray-400">
                Try selecting a different category or check back later for new content.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            {newestArticle && (
              <section className="mb-16">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {activeFilter === 'All' ? 'Latest Article' : `Latest in ${activeFilter}`}
                  </h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto"></div>
                </div>
                <HeroCard article={newestArticle} />
              </section>
            )}

            {/* Content Sections */}
            {activeFilter === 'All' ? (
              <section className="pb-16">
                {allCategories.map((category) => (
                  <CategorySection
                    key={category}
                    category={category}
                    articles={articlesByCategory[category] || []}
                  />
                ))}
              </section>
            ) : (
              <section className="pb-16">
                {otherArticles.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                      More in {activeFilter}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {otherArticles.map((article) => (
                        <ArticleCard key={article.id || article.slug} article={article} />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
