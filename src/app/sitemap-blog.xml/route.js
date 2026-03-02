import articlesIndex from '../../../public/data/articles-index.json';

/**
 * Generate blog + static pages sitemap
 * Includes blog articles and high-level static pages
 */
export async function GET() {
  const baseUrl = 'https://schooltransparency.com';
  const now = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages = [
    { url: baseUrl, priority: 1, changefreq: 'weekly' },
    { url: `${baseUrl}/blog`, priority: 0.9, changefreq: 'daily' },
    { url: `${baseUrl}/cities`, priority: 0.9, changefreq: 'weekly' },
    { url: `${baseUrl}/schools`, priority: 0.9, changefreq: 'weekly' },
    { url: `${baseUrl}/schools/compare`, priority: 0.3, changefreq: 'monthly' },
    // Curriculum pages
    { url: `${baseUrl}/schools/curriculum/ib-pyp`, priority: 0.7, changefreq: 'weekly' },
    { url: `${baseUrl}/schools/curriculum/ib-myp`, priority: 0.7, changefreq: 'weekly' },
    { url: `${baseUrl}/schools/curriculum/ib-dp`, priority: 0.7, changefreq: 'weekly' },
    { url: `${baseUrl}/schools/curriculum/ib-cp`, priority: 0.7, changefreq: 'weekly' },
    { url: `${baseUrl}/schools/curriculum/british`, priority: 0.7, changefreq: 'weekly' },
    { url: `${baseUrl}/schools/curriculum/american`, priority: 0.7, changefreq: 'weekly' },
    { url: `${baseUrl}/schools/curriculum/canadian`, priority: 0.7, changefreq: 'weekly' },
    { url: `${baseUrl}/schools/curriculum/australian`, priority: 0.7, changefreq: 'weekly' },
    { url: `${baseUrl}/schools/curriculum/french`, priority: 0.7, changefreq: 'weekly' },
    { url: `${baseUrl}/schools/curriculum/german`, priority: 0.7, changefreq: 'weekly' },
    { url: `${baseUrl}/schools/curriculum/indian`, priority: 0.7, changefreq: 'weekly' },
    { url: `${baseUrl}/schools/curriculum/swiss`, priority: 0.7, changefreq: 'weekly' },
  ];

  const staticUrls = staticPages
    .map(
      (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('\n');

  // Blog articles
  const blogUrls = articlesIndex
    .map((article) => {
      const lastMod = article.publishedDate
        ? new Date(article.publishedDate).toISOString().split('T')[0]
        : now;

      return `  <url>
    <loc>${baseUrl}/blog/${article.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${blogUrls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
