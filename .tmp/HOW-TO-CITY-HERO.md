# City Hero Image Setup — Process Guide

**Owner:** Tigger (School Transparency Frontend Agent)
**Frequency:** Every new city launch
**Complexity:** Routine

---

## Pattern Recognition

### FALLBACK_IMAGES (city-queries.js)
- **File:** `src/lib/data/city-queries.js` lines 4-16
- **Format:** `'city-slug': 'https://images.unsplash.com/photo-XXX?w=1600&q=80'`
- **Purpose:** Fallback if Supabase hero_image_url is missing/invalid
- **Examples:**
  - `'mumbai': 'https://images.unsplash.com/photo-1753806390462-580d7a625f76?w=1600&q=80'`
  - `'abu-dhabi': 'https://images.unsplash.com/photo-1603565095944-2a6f33bb517c?w=1600&q=80'`

### cities.json Entry
- **File:** `public/data/cities.json`
- **Format:** Object with id, name, country, slug, image, stats
- **Image param:** `?w=800` (thumbnail size, lightweight)
- **Example (Mumbai):**
  ```json
  {
    "id": "mumbai",
    "name": "Mumbai",
    "country": "India",
    "slug": "mumbai",
    "image": "https://images.unsplash.com/photo-1753806390462-580d7a625f76?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fG11bWJhaSUyMHNreWxpbmUlMjBjaXR5c2NhcGV8ZW58MHx8fHwxNzcyODYzOTI1fDA&ixlib=rb-4.1.0&q=85&w=800",
    "stats": {
      "avgSalary": "$32,000 - $38,000",
      "costOfLiving": "Low",
      "schoolCount": 9,
      "sentiment": "Positive"
    }
  }
  ```

### CHANGE_LOG Entry
- **File:** `CHANGE_LOG.md` top of table
- **Format:** | Date | Add hero image: [City] | Details...
- **Example (Mumbai):**
  ```
  | 2026-03-07 | Add hero image: Mumbai | Added Unsplash hero image (South Mumbai skyline) to both Supabase `cities.hero_image_url` and master `public/data/cities.json`. Image: South Mumbai skyline (6000x4000px). Stats: $32K-$38K salary, low cost of living, 9 schools. Page: /cities/mumbai |
  ```

---

## Responsibility Split

**Pepper (Pipeline):** Builds city, populates schools, salary, economic data, etc. in Supabase
**Tigger (Frontend):** Finds appropriate Unsplash image + sets up FALLBACK_IMAGES, cities.json, CHANGE_LOG

**Note:** `hero_image_url` in Supabase is left EMPTY. You (Tigger) choose the image.

## Step-by-Step Process

1. **Find an Unsplash image for the city**
   - Search Unsplash for relevant cityscape/skyline/landmark
   - Examples: Cairo skyline, Bangkok temple, Mumbai towers, Singapore harbor
   - Choose high-quality, representative image (avoid people, small details)

2. **Extract city data from Supabase**
   - City name, country, slug
   - Average salary from salary_data
   - School count from schools[]
   - Any other stats needed

3. **Set hero_image_url in Supabase**
   - Use Node script with SUPABASE_SERVICE_ROLE_KEY to update `hero_image_url` field
   - Format: `https://images.unsplash.com/photo-XXX?w=1600&q=80`

4. **Add to FALLBACK_IMAGES (city-queries.js)**
   - Add new line: `'city-slug': 'https://images.unsplash.com/photo-XXX?w=1600&q=80'`
   - Keep alphabetical order or grouped by region
   - **CRITICAL:** This is safety net if Supabase data is invalid

5. **Add to cities.json** (COMPLETE ENTRY - DO NOT SKIP)
   - Copy format from existing city (e.g., Mumbai)
   - Must include: id, name, country, slug, **image** (w=800 parameter)
   - Example:
   ```json
   {
     "id": "cairo",
     "name": "Cairo",
     "country": "Egypt",
     "slug": "cairo",
     "image": "https://images.unsplash.com/photo-1572928915307-cf1ee4c007db?w=800"
   }
   ```
   - **DO NOT hardcode stats** (salary, schoolCount, etc.) — these come from Supabase live data

6. **Update CHANGE_LOG.md**
   - Add row to top of table
   - Include: date, city name, image source, page URL

7. **Commit & Push**
   - `git add src/lib/data/city-queries.js public/data/cities.json CHANGE_LOG.md`
   - `git commit -m "Add hero image: [City]"`
   - `git push origin main`

---

## Data Sources

**Supabase `cities` table columns needed:**
- `name` — City name
- `country` — Country name
- `slug` — URL slug
- `hero_image_url` — Unsplash image URL
- `salary_data[0].avg_salary` — Average salary (annual)
- `schools` count — Number of schools

---

## Validation Checklist

- [ ] Image URL uses `?w=1600&q=80` in FALLBACK_IMAGES
- [ ] Image URL uses `?w=800` in cities.json (or original params)
- [ ] Salary is formatted correctly (range or number)
- [ ] School count is accurate
- [ ] City slug matches between all three places
- [ ] CHANGE_LOG date is correct
- [ ] Files committed and pushed to main

---

## Common Mistakes to Avoid

1. ❌ Forgetting FALLBACK_IMAGES → Hero image breaks on city card
2. ❌ Wrong image params (w=1600 vs w=800) → Oversized or low-res images
3. ❌ Mismatched slugs across files → Data won't load
4. ❌ Forgetting git push → Vercel doesn't see changes
5. ❌ Old CHANGE_LOG date → Confuses timeline

