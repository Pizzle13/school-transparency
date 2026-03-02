import { supabase } from '../../lib/supabase';

/**
 * Fetch all cities
 */
async function fetchAllCities() {
  const { data, error } = await supabase
    .from('cities')
    .select('slug, created_at')
    .order('name');

  if (error) {
    console.error('Error fetching cities for sitemap:', error);
    return [];
  }

  return data || [];
}

/**
 * Generate cities sitemap (~200 entries)
 * Priority: 0.8, weekly update frequency
 */
export async function GET() {
  const baseUrl = 'https://schooltransparency.com';
  const now = new Date();

  try {
    const cities = await fetchAllCities();

    const cityUrls = cities
      .map((city) => {
        const lastMod = city.created_at
          ? new Date(city.created_at).toISOString().split('T')[0]
          : now.toISOString().split('T')[0];

        return `  <url>
    <loc>${baseUrl}/cities/${city.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cityUrls}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Error generating cities sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}
