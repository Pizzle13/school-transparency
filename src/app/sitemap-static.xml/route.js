import { supabase } from '../../lib/supabase';

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
 * Fetch schools to generate country and country-city pages
 */
async function fetchAllSchools() {
  const batchSize = 1000;
  let from = 0;
  let allSchools = [];
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('schools')
      .select('country_name, address')
      .not('country_name', 'is', null)
      .range(from, from + batchSize - 1);

    if (error || !data) break;
    allSchools = allSchools.concat(data);
    hasMore = data.length === batchSize;
    from += batchSize;
  }

  return allSchools;
}

/**
 * Generate static country and country-city pages sitemap
 */
export async function GET() {
  const baseUrl = 'https://schooltransparency.com';
  const now = new Date().toISOString().split('T')[0];

  try {
    const schools = await fetchAllSchools();

    const countrySet = new Set();
    const countryCitySet = new Set();

    // Aggregate unique countries and country-city combinations
    for (const school of schools) {
      if (school.country_name) {
        const countrySlug = slugify(school.country_name);
        countrySet.add(countrySlug);

        // Extract city from address (last part after comma)
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

    // Generate country URLs
    const countryUrls = Array.from(countrySet)
      .map(
        (countrySlug) => `  <url>
    <loc>${baseUrl}/schools/${countrySlug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
      )
      .join('\n');

    // Generate country-city URLs
    const countryCityUrls = Array.from(countryCitySet)
      .map(
        (path) => `  <url>
    <loc>${baseUrl}/schools/${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
      )
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${countryUrls}
${countryCityUrls}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Error generating static sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}
