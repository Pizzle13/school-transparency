# City Image Setup Guide

**Purpose:** Complete checklist for publishing hero images when new cities go live
**Owner:** Tigger (School Transparency frontend agent)
**Updated:** 2026-03-12

---

## Overview: 2-Layer Image System

City hero images require **two** layers to work reliably:

| Layer | Source | Purpose |
|-------|--------|---------|
| **Layer 1** | Supabase `cities.hero_image_url` | Primary source (set by Pepper/pipeline) |
| **Layer 2** | `src/lib/data/city-queries.js` → `FALLBACK_IMAGES` | Fallback if Supabase missing/invalid |

**CRITICAL:** Forgetting Layer 2 breaks image display. Both must use the **same Unsplash URL**.

---

## Step-by-Step Process

### 1. Get City Data
```bash
# Query Supabase to confirm city exists
# Need: city slug, name, hero_image_url (if already set)
```

### 2. Find/Verify Unsplash Image
- Search [unsplash.com](https://unsplash.com) for city skyline/landmark
- **VERIFY the URL is live** before using:
  ```bash
  curl -I "https://images.unsplash.com/photo-XXXXX?w=1600&q=80"
  # Should return HTTP 200, not 404
  ```
- Format: `https://images.unsplash.com/photo-{ID}?w=1600&q=80`

### 3. Update Supabase (Layer 1)
If not already set by pipeline:
```sql
UPDATE cities
SET hero_image_url = 'https://images.unsplash.com/photo-XXXXX?w=1600&q=80'
WHERE slug = 'city-slug';
```

### 4. Update FALLBACK_IMAGES (Layer 2) — REQUIRED
**File:** `src/lib/data/city-queries.js`

Find the `FALLBACK_IMAGES` object and add:
```js
const FALLBACK_IMAGES = {
  // ... existing cities ...
  'city-slug': 'https://images.unsplash.com/photo-XXXXX?w=1600&q=80',
};
```

### 5. Update cities.json
**File:** `public/data/cities.json`

Add complete entry matching existing cities:
```json
{
  "id": "auto-increment-id",
  "name": "City Name",
  "country": "Country Name",
  "slug": "city-slug",
  "image": "https://images.unsplash.com/photo-XXXXX?w=800&q=80"
}
```
**Note:** `image` field uses `w=800` (smaller for list view), `hero_image_url` uses `w=1600` (larger for hero)

### 6. Update CHANGE_LOG.md
**File:** `CHANGE_LOG.md`

Add entry with date:
```markdown
### 2026-03-12
- Add city: City Name (https://schooltransparency.com/cities/city-slug)
```

### 7. Git Workflow
```bash
# Stage changes
git add src/lib/data/city-queries.js public/data/cities.json CHANGE_LOG.md

# Commit
git commit -m "Add City Name: hero image + cities.json entry"

# Check for remote changes
git pull origin main

# Push to GitHub (Vercel auto-deploys)
git push origin main
```

---

## Critical Gotchas

### ⚠️ Unsplash Photos Get Deleted
- Photographers can delete photos anytime
- If deleted, URL returns HTTP 404 → image won't display
- **Always verify URL with `curl -I`** before committing
- Both FALLBACK_IMAGES and Supabase fail if photo deleted

### ⚠️ Image Parameters Matter
- **Hero (large):** `w=1600&q=80` (1600px wide, 80% quality)
- **List (small):** `w=800&q=80` (800px wide, 80% quality)
- **Don't mix:** Hero pages need high-res, lists need smaller

### ⚠️ Layer 2 is Mandatory
- **Without FALLBACK_IMAGES entry:** City displays with gradient fallback (no image)
- **With FALLBACK_IMAGES:** Image displays even if Supabase is null/invalid
- Always update both in the same commit

### ⚠️ Git Push Required for Deployment
- Local file changes don't deploy
- Vercel watches GitHub `main` branch only
- `git push origin main` is **required** — no takebacks after push

---

## Verification Checklist

Before pushing, verify:

- [ ] Unsplash URL returns HTTP 200 (not 404)
- [ ] FALLBACK_IMAGES entry added to `src/lib/data/city-queries.js`
- [ ] `cities.json` entry complete (id, name, country, slug, image fields)
- [ ] CHANGE_LOG.md updated with date and city
- [ ] Image URLs use correct `w=` parameter (1600 for hero, 800 for list)
- [ ] Both FALLBACK_IMAGES and cities.json use **same base photo ID**
- [ ] Git staged only: city-queries.js, cities.json, CHANGE_LOG.md
- [ ] Commit message is clear
- [ ] `git pull origin main` run before push (no merge conflicts)
- [ ] Ready to push: `git push origin main`

---

## Real Example: Cairo (2026-03-11)

**Problem:** Original photo deleted (404)
```
photo-1572928915307-cf1ee4c007db → HTTP 404
```

**Solution:** Found GPS-verified Pyramids photo
```
photo-1539768942893-daf53e448371 → HTTP 200 ✓
```

**Updated 3 files:**
1. FALLBACK_IMAGES: `'cairo': 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1600&q=80'`
2. cities.json: `"image": "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=80"`
3. Supabase: `hero_image_url = 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1600&q=80'`

**Result:** Image displays correctly

---

## File Locations Quick Reference

| File | Purpose |
|------|---------|
| `src/lib/data/city-queries.js` | FALLBACK_IMAGES dict (Layer 2) |
| `public/data/cities.json` | City listing + image (Layer 2) |
| `CHANGE_LOG.md` | Document additions |
| Supabase Admin | `cities.hero_image_url` (Layer 1) |

---

## When Multiple Cities

If setting up 2+ cities:
1. For each city: Follow steps 1-6
2. After all updates: Single commit with all cities
3. Single push: `git push origin main`
4. Vercel redeploys once (not per-city)

---

**Questions?** Refer to MEMORY.md "Hero Image Setup" section for deeper context.
