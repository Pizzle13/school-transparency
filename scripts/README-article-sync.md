# Article-City Sync Workflow

## Overview

City pages automatically show related blog articles from the School Transparency blog. This document explains how the system works and how to maintain it.

## How It Works

### Data Flow
```
Archi publishes article
    ↓
Archi updates ARTICLES_INVENTORY.md (blog repo)
    ↓
Tigger runs sync script (this repo)
    ↓
articles-index.json updated with city tags
    ↓
City pages render with "Related Articles" section
    ↓
Vercel auto-deploys
```

### Key Files
- **Source of truth:** `E:\Genral Manager\projects\blog\ARTICLES_INVENTORY.md` (Archi maintains)
- **Sync script:** `scripts/sync-articles-from-inventory.js` (reads inventory, updates index)
- **Populated index:** `public/data/articles-index.json` (generated, don't edit manually)
- **City component:** `src/components/cities/RelatedArticlesSection.js` (renders articles)
- **Data layer:** `src/lib/data/city-queries.js` → `getRelatedArticlesForCity(slug)`

## Maintenance Workflow

### When Archi Publishes New Articles

Archi's job (in blog repo):
1. Write article JSON: `public/data/articles/[slug].json`
2. Update `ARTICLES_INVENTORY.md`:
   - Add article to appropriate category (Salary & Compensation, Cost of Living, etc.)
   - Add article to "LEAN VERSION FOR TIGGER" section under relevant city headers
   - Update counts at top
3. Commit & push to blog repo

### When Tigger Updates City Tags

Tigger's job (in this repo):
```bash
# After Archi publishes and updates inventory
node scripts/sync-articles-from-inventory.js

# This script:
# - Reads ARTICLES_INVENTORY.md
# - Parses "LEAN VERSION FOR TIGGER" section
# - Extracts city→article mappings
# - Updates articles-index.json with cities field
# - Shows summary of what was updated

# Then commit
git add public/data/articles-index.json
git commit -m "sync: Update article-city mappings from inventory"
git push origin main
```

Vercel auto-redeploys. City pages now show new articles.

## Frequency

**Every 2 weeks** (roughly when Archi publishes a new batch):
1. Archi updates ARTICLES_INVENTORY.md
2. Tigger runs `node scripts/sync-articles-from-inventory.js`
3. Commit & push

No other maintenance needed. The component gracefully hides if a city has no articles.

## How the Sync Script Works

The script `sync-articles-from-inventory.js`:

1. **Loads valid cities** from `public/data/cities.json`
2. **Parses ARTICLES_INVENTORY.md** looking for:
   - Section headers: `### CityName` or `### City1 & City2, Country`
   - Article listings: `- [Title](url)` or `- Title`
3. **Maps articles to cities** based on which city section they appear under
4. **Updates articles-index.json** with `cities: ["slug1", "slug2"]` for each article
5. **Skips "Other Locations"** section (multi-city articles not tagged to specific cities)
6. **Reports progress** (how many updated, sample outputs)

Run it with:
```bash
node scripts/sync-articles-from-inventory.js
```

## Troubleshooting

### Articles not appearing on city pages
1. **Check articles-index.json** — does the article have a `cities` array with the city slug?
   ```bash
   grep -A 2 "article-slug" public/data/articles-index.json
   ```
2. **Check city slug** — verify you're using the correct slug (e.g., `ho-chi-minh-city` not `hcmc`)
3. **Run sync script** — may need to refresh after updates
   ```bash
   node scripts/sync-articles-from-inventory.js
   ```
4. **Hard refresh browser** — Ctrl+Shift+R to clear cache

### Sync script fails
- **Inventory file not found:** Verify path `E:\Genral Manager\projects\blog\ARTICLES_INVENTORY.md` exists
- **JSON parse error:** Check articles-index.json syntax (run `node -e "require('./public/data/articles-index.json')"`)
- **No cities parsed:** Check ARTICLES_INVENTORY.md format — headers must be `### CityName`

## Component Behavior

**RelatedArticlesSection.js:**
- Shows 3 most recent articles for the city (sorted by `publishedDate` desc)
- Returns `null` if no articles (graceful degradation — no broken layouts)
- Design matches "Bold Retroverse" city section style
- Links to `/blog/[slug]`

**Example cities with articles:**
- Singapore: 5 articles
- Dubai: 3 articles
- Bangkok: 3 articles
- Ho Chi Minh City: 2 articles
- Hanoi: 2 articles
- Kuala Lumpur: 1 article

## Future Enhancements

- Auto-trigger sync on Archi's push (via webhook/CI)
- Tag categories/topics on articles for more granular filtering
- Featured article pin per city
- A/B test article recommendations

---

**Last updated:** 2026-03-13
**Maintained by:** Tigger (with Archi's inventory updates)
