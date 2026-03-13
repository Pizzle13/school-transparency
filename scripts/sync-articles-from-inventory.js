#!/usr/bin/env node
/**
 * Sync Articles from Inventory
 *
 * Reads ARTICLES_INVENTORY.md (Archi's source of truth) and populates
 * the `cities` field in articles-index.json based on documented city references.
 *
 * This is the authoritative mapping — when Archi updates the inventory,
 * this script keeps the index in sync.
 *
 * Run:
 *   node scripts/sync-articles-from-inventory.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const INVENTORY_PATH = path.join(__dirname, '../../blog/ARTICLES_INVENTORY.md');
const ARTICLES_INDEX_PATH = path.join(__dirname, '../public/data/articles-index.json');
const CITIES_PATH = path.join(__dirname, '../public/data/cities.json');

/**
 * Load valid city slugs from cities.json and create name→slug mapping
 */
function loadValidCities() {
  const rawData = JSON.parse(fs.readFileSync(CITIES_PATH, 'utf-8'));
  const citiesArray = rawData.cities || rawData;

  // Map: city name variations → slug
  const nameToSlug = {};
  const validSlugs = new Set();

  citiesArray.forEach(city => {
    validSlugs.add(city.slug);
    // Map both exact name and slugified name
    nameToSlug[city.name.toLowerCase()] = city.slug;
    nameToSlug[slugify(city.name)] = city.slug;
  });

  return { validSlugs, nameToSlug };
}

/**
 * Parse the LEAN VERSION section from ARTICLES_INVENTORY.md
 * Returns: Object mapping city slug → array of article slugs
 */
function parseInventoryLeanVersion(content, { validSlugs, nameToSlug }) {
  const cityArticleMap = {};

  // Find the "LEAN VERSION FOR TIGGER" section
  const leanStart = content.indexOf('## 📋 LEAN VERSION FOR TIGGER');
  const fullDbStart = content.indexOf('## 📚 FULL ARTICLE DATABASE');

  if (leanStart === -1 || fullDbStart === -1) {
    console.error('Could not find LEAN VERSION section in inventory');
    return cityArticleMap;
  }

  const leanSection = content.substring(leanStart, fullDbStart);
  const lines = leanSection.split('\n');

  let currentCities = []; // Array of city slugs for multi-city headers

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Match city headers: ### CityName or ### City1 & City2, Country
    const cityMatch = line.match(/^###\s+(.+?)(?:,\s*(.+?))?$/);
    if (cityMatch) {
      const headerText = cityMatch[1];

      // Skip "Other Locations" section (multi-city articles)
      if (headerText.includes('Other Locations') || headerText.includes('Multi-City')) {
        currentCities = [];
        continue;
      }

      // Parse city names from header (handle "City1 & City2, Country" format)
      currentCities = [];
      const cityParts = headerText.split('&').map(p => p.trim());

      cityParts.forEach(cityPart => {
        // Remove country name if present (after comma)
        const cityName = cityPart.split(',')[0].trim().toLowerCase();

        // Look up slug
        const slug = nameToSlug[cityName] || nameToSlug[slugify(cityName)];
        if (slug && validSlugs.has(slug)) {
          currentCities.push(slug);
          if (!cityArticleMap[slug]) {
            cityArticleMap[slug] = [];
          }
        }
      });

      continue;
    }

    // Match article lines: - [Title](url) or - Title
    const articleMatch = line.match(/^-\s+\[?(.+?)\]?(?:\(https:\/\/schooltransparency\.com\/blog\/(.+?)\))?(?:\s+—\s+(.+))?$/);
    if (articleMatch && currentCities.length > 0) {
      const title = articleMatch[1];
      let slug = articleMatch[2]; // From URL if present

      // If no slug in URL, derive from title
      if (!slug) {
        slug = slugify(title);
      }

      if (slug) {
        // Add this article to all cities in current section
        currentCities.forEach(citySlug => {
          if (!cityArticleMap[citySlug].includes(slug)) {
            cityArticleMap[citySlug].push(slug);
          }
        });
      }
    }
  }

  console.log(`\n✓ Parsed ${Object.keys(cityArticleMap).length} cities from inventory`);
  return cityArticleMap;
}

/**
 * Convert title/text to URL slug
 */
function slugify(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Main function
 */
function main() {
  console.log('🔄 Syncing articles from inventory...\n');

  // Read inventory
  if (!fs.existsSync(INVENTORY_PATH)) {
    console.error(`❌ Inventory not found at ${INVENTORY_PATH}`);
    process.exit(1);
  }

  const inventoryContent = fs.readFileSync(INVENTORY_PATH, 'utf-8');
  const cityMapping = loadValidCities();
  const cityArticleMap = parseInventoryLeanVersion(inventoryContent, cityMapping);

  // Read articles index
  if (!fs.existsSync(ARTICLES_INDEX_PATH)) {
    console.error(`❌ Articles index not found at ${ARTICLES_INDEX_PATH}`);
    process.exit(1);
  }

  const articlesIndex = JSON.parse(fs.readFileSync(ARTICLES_INDEX_PATH, 'utf-8'));
  console.log(`✓ Loaded ${articlesIndex.length} articles from index\n`);

  // Update articles with city tags from inventory
  let updated = 0;
  let unchanged = 0;

  articlesIndex.forEach(article => {
    const oldCities = article.cities || [];
    const newCities = [];

    // Find this article in any city's list
    Object.entries(cityArticleMap).forEach(([citySlug, articleSlugs]) => {
      if (articleSlugs.includes(article.slug)) {
        newCities.push(citySlug);
      }
    });

    // Sort for consistency
    newCities.sort();

    // Update if different
    if (JSON.stringify(oldCities) !== JSON.stringify(newCities)) {
      article.cities = newCities;
      updated++;
    } else {
      unchanged++;
    }
  });

  // Write back
  fs.writeFileSync(ARTICLES_INDEX_PATH, JSON.stringify(articlesIndex, null, 2) + '\n');

  // Report
  console.log('✅ Sync complete!\n');
  console.log(`📊 Summary:`);
  console.log(`   Articles updated: ${updated}`);
  console.log(`   Articles unchanged: ${unchanged}`);
  console.log(`   Total processed: ${articlesIndex.length}\n`);

  // Show sample
  const taggedArticles = articlesIndex.filter(a => a.cities && a.cities.length > 0);
  console.log(`📍 Articles with city tags: ${taggedArticles.length} / ${articlesIndex.length}\n`);

  if (taggedArticles.length > 0) {
    console.log(`🏙️  Sample tagged articles:`);
    taggedArticles.slice(0, 5).forEach(article => {
      console.log(`   • ${article.slug}`);
      console.log(`     → ${article.cities.join(', ')}`);
    });
    if (taggedArticles.length > 5) {
      console.log(`   ... and ${taggedArticles.length - 5} more`);
    }
  }

  console.log(`\n✓ Updated: ${ARTICLES_INDEX_PATH}`);
}

main();
