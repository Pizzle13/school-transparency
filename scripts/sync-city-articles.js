#!/usr/bin/env node
/**
 * Sync City-Article Tags
 *
 * This script reads all article JSON files and populates the `cities` field
 * in articles-index.json by:
 * 1. Extracting explicit city tags from article.relatedCities[].slug
 * 2. Auto-detecting cities from article title/slug by matching against cities.json
 *
 * Run this after Archi publishes new articles:
 *   node scripts/sync-city-articles.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const ARTICLES_DIR = path.join(__dirname, '../public/data/articles');
const ARTICLES_INDEX_PATH = path.join(__dirname, '../public/data/articles-index.json');
const CITIES_PATH = path.join(__dirname, '../public/data/cities.json');

/**
 * Load all cities and build slug → name mappings for auto-detection
 */
function loadCities() {
  const rawData = JSON.parse(fs.readFileSync(CITIES_PATH, 'utf-8'));
  const citiesArray = rawData.cities || rawData;
  const cityMap = {};

  citiesArray.forEach(city => {
    cityMap[city.slug] = city.name;
  });

  return { citiesData: citiesArray, cityMap };
}

/**
 * Extract city slugs from an article JSON file
 * Returns: Set of city slugs
 */
function extractCitiesFromArticle(articlePath, articleSlug, cityMap) {
  const cities = new Set();

  try {
    const article = JSON.parse(fs.readFileSync(articlePath, 'utf-8'));

    // 1. Explicit relatedCities
    if (article.relatedCities && Array.isArray(article.relatedCities)) {
      article.relatedCities.forEach(city => {
        if (city.slug) {
          cities.add(city.slug);
        }
      });
    }

    // 2. Auto-detect from title
    const titleLower = (article.title || '').toLowerCase();
    Object.entries(cityMap).forEach(([slug, name]) => {
      const nameLower = name.toLowerCase();
      if (titleLower.includes(nameLower)) {
        cities.add(slug);
      }
    });

    // 3. Auto-detect from slug
    const slugLower = articleSlug.toLowerCase();
    Object.keys(cityMap).forEach(slug => {
      if (slugLower.includes(slug.replace(/-/g, ' ')) || slugLower.includes(slug)) {
        cities.add(slug);
      }
    });

    // 4. Auto-detect from slug (variant: check if any city slug is a substring)
    Object.keys(cityMap).forEach(citySlug => {
      if (slugLower.includes(citySlug)) {
        cities.add(citySlug);
      }
    });

  } catch (error) {
    console.warn(`Warning: Could not parse article ${articleSlug}: ${error.message}`);
  }

  return cities;
}

/**
 * Main function
 */
function main() {
  console.log('🔄 Syncing city-article tags...\n');

  // Load cities
  const { citiesData, cityMap } = loadCities();
  console.log(`✓ Loaded ${citiesData.length} cities\n`);

  // Load articles index
  const articlesIndex = JSON.parse(fs.readFileSync(ARTICLES_INDEX_PATH, 'utf-8'));
  console.log(`✓ Loaded ${articlesIndex.length} articles from index\n`);

  // Read all article files
  const articleFiles = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));
  console.log(`✓ Found ${articleFiles.length} article files\n`);

  // Process each article
  let totalCitiesAdded = 0;
  const taggedArticles = [];

  articlesIndex.forEach(article => {
    const articlePath = path.join(ARTICLES_DIR, `${article.slug}.json`);

    if (fs.existsSync(articlePath)) {
      const cities = extractCitiesFromArticle(articlePath, article.slug, cityMap);
      const citiesArray = Array.from(cities).sort();

      if (citiesArray.length > 0) {
        article.cities = citiesArray;
        totalCitiesAdded += citiesArray.length;
        taggedArticles.push({ slug: article.slug, cities: citiesArray });
      } else {
        article.cities = [];
      }
    } else {
      article.cities = [];
    }
  });

  // Write back to index
  fs.writeFileSync(ARTICLES_INDEX_PATH, JSON.stringify(articlesIndex, null, 2) + '\n');

  // Summary
  console.log('✅ Sync complete!\n');
  console.log(`📊 Summary:`);
  console.log(`   Articles with city tags: ${taggedArticles.length} / ${articlesIndex.length}`);
  console.log(`   Total city tags added: ${totalCitiesAdded}`);

  if (taggedArticles.length > 0) {
    console.log(`\n🏙️  Sample tagged articles:`);
    taggedArticles.slice(0, 5).forEach(({ slug, cities }) => {
      console.log(`   • ${slug}`);
      console.log(`     → ${cities.join(', ')}`);
    });
    if (taggedArticles.length > 5) {
      console.log(`   ... and ${taggedArticles.length - 5} more`);
    }
  }

  console.log(`\n✓ Updated: ${ARTICLES_INDEX_PATH}`);
}

main();
