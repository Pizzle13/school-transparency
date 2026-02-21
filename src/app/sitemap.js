import { supabase } from '../lib/supabase';
import articlesIndex from '../../public/data/articles-index.json';

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Paginate through all rows of a Supabase query (1000-row cap per request).
 */
async function fetchAll(tableName, selectColumns, filters = []) {
  const batchSize = 1000;
  let from = 0;
  let allData = [];
  let hasMore = true;

  while (hasMore) {
    let query = supabase.from(tableName).select(selectColumns);
    for (const filter of filters) {
      query = filter(query);
    }
    query = query.range(from, from + batchSize - 1);

    const { data, error } = await query;
    if (error || !data) break;

    allData = allData.concat(data);
    hasMore = data.length === batchSize;
    from += batchSize;
  }

  return allData;
}

export default async function sitemap() {
  const baseUrl = 'https://schooltransparency.com';
  const now = new Date();

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/cities`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/schools`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/schools/compare`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Curriculum pages (4 IB programmes)
  const curriculumPages = ['PYP', 'MYP', 'DP', 'CP'].map((prog) => ({
    url: `${baseUrl}/schools/curriculum/${prog.toLowerCase()}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Blog article pages
  const blogPages = articlesIndex.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.publishedDate ? new Date(article.publishedDate) : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // --- Supabase data ---
  let cityPages = [];
  let schoolProfilePages = [];
  let countryPages = [];
  let countryCityPages = [];

  try {
    // City detail pages (existing)
    const cities = await fetchAll('cities', 'slug, updated_at');
    cityPages = cities.map((city) => ({
      url: `${baseUrl}/cities/${city.slug}`,
      lastModified: city.updated_at ? new Date(city.updated_at) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // All school data needed for school profiles + country/city aggregation
    const schools = await fetchAll('schools', 'slug, country_name, address, updated_at', [
      (q) => q.not('slug', 'is', null),
    ]);

    // Individual school profile pages: /schools/s/[slug]
    schoolProfilePages = schools.map((school) => ({
      url: `${baseUrl}/schools/s/${school.slug}`,
      lastModified: school.updated_at ? new Date(school.updated_at) : now,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    // Aggregate unique countries for /schools/[country] pages
    const countrySet = new Set();
    const countryCitySet = new Set();

    for (const school of schools) {
      if (school.country_name) {
        const countrySlug = slugify(school.country_name);
        countrySet.add(countrySlug);

        // Extract city from address (last part after comma, if present)
        if (school.address) {
          const parts = school.address.split(',');
          if (parts.length >= 2) {
            const cityPart = parts[parts.length - 1].trim();
            if (cityPart) {
              const citySlug = slugify(cityPart);
              countryCitySet.add(`${countrySlug}/${citySlug}`);
            }
          }
        }
      }
    }

    countryPages = Array.from(countrySet).map((countrySlug) => ({
      url: `${baseUrl}/schools/${countrySlug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    countryCityPages = Array.from(countryCitySet).map((path) => ({
      url: `${baseUrl}/schools/${path}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching data for sitemap:', error);
  }

  return [
    ...staticPages,
    ...curriculumPages,
    ...blogPages,
    ...cityPages,
    ...countryPages,
    ...countryCityPages,
    ...schoolProfilePages,
  ];
}
