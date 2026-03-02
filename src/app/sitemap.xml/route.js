/**
 * Sitemap index that references segmented sitemaps for efficient crawling
 */
export async function GET() {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://schooltransparency.com/sitemap-static.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://schooltransparency.com/sitemap-schools.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://schooltransparency.com/sitemap-cities.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://schooltransparency.com/sitemap-blog.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
