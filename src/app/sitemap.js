import { supabase } from '../lib/supabase';
import articlesIndex from '../../public/data/articles-index.json';

export default async function sitemap() {
  const baseUrl = 'https://schooltransparency.com';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cities`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Blog article pages
  const blogPages = articlesIndex.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.publishedDate ? new Date(article.publishedDate) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // City pages from Supabase
  let cityPages = [];
  try {
    const { data: cities, error } = await supabase
      .from('cities')
      .select('slug, updated_at')
      .order('name');

    if (!error && cities) {
      cityPages = cities.map((city) => ({
        url: `${baseUrl}/cities/${city.slug}`,
        lastModified: city.updated_at ? new Date(city.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error fetching cities for sitemap:', error);
  }

  return [...staticPages, ...blogPages, ...cityPages];
}
