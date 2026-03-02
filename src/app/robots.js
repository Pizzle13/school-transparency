export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        // Exclude thin filter pages with very few results
        '/schools/curriculum/*?*', // Filter combinations
        '/schools/*/?*', // Country+filter combinations
      ],
    },
    sitemap: [
      'https://schooltransparency.com/sitemap.xml',
      'https://schooltransparency.com/sitemap-schools.xml',
      'https://schooltransparency.com/sitemap-cities.xml',
      'https://schooltransparency.com/sitemap-blog.xml',
      'https://schooltransparency.com/sitemap-static.xml',
    ],
  };
}
