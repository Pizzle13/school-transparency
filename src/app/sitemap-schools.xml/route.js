import { supabase } from '../../lib/supabase';

/**
 * Fetch all school profiles with pagination (Supabase has 1000-row cap per request)
 */
async function fetchAllSchools() {
  const batchSize = 1000;
  let from = 0;
  let allSchools = [];
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('schools')
      .select('slug, updated_at')
      .not('slug', 'is', null)
      .range(from, from + batchSize - 1);

    if (error || !data) break;
    allSchools = allSchools.concat(data);
    hasMore = data.length === batchSize;
    from += batchSize;
  }

  return allSchools;
}

/**
 * Generate schools sitemap (10k+ entries)
 * Priority: 0.6, monthly update frequency
 */
export async function GET() {
  const baseUrl = 'https://schooltransparency.com';
  const now = new Date();

  try {
    const schools = await fetchAllSchools();

    const schoolUrls = schools
      .map((school) => {
        const lastMod = school.updated_at
          ? new Date(school.updated_at).toISOString().split('T')[0]
          : now.toISOString().split('T')[0];

        return `  <url>
    <loc>${baseUrl}/schools/s/${school.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      })
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${schoolUrls}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Error generating schools sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}
