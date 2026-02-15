# Build City Page

**Slash Command:** `/[city] build`

**Model:** Haiku (verification only)

## Quick Answer
**There is nothing to build.** City pages are fully dynamic. When the pipeline pushes data to Supabase, the page appears automatically at `/cities/{slug}`.

If you want to verify the page displays correctly, here's how:

## How to Verify a City Page Works

### 1. City must exist in Supabase
The pipeline project pushes data via `POST /api/cities/bulk-import`. The website reads from Supabase automatically.

### 2. Visit the page
```
https://schooltransparency.com/cities/{slug}
```

(Or `http://localhost:3000/cities/{slug}` in development)

### 3. Check these sections load:
- **Hero section** — City name, image, salary/cost stats visible
- **School section** — List of international schools with ratings
- **Salary analysis** — Salary, monthly cost, monthly savings breakdown
- **Below-fold sections** — Air quality, housing, healthcare, news, apps, etc.

### 4. Sections gracefully handle missing data
If a section has no data, it's hidden. No errors.

### 5. Page caches for 10 minutes
After new data is pushed, pages cache at Vercel. Data updates within 10 minutes of import.

## Website Agent: Your Job Ends Here
- ✅ If the page displays: page works
- ✅ If a component needs fixing: fix it in `src/components/cities/`
- ❌ Do NOT import data, run seeds, manage Supabase credentials
- ❌ Do NOT create per-city pages or configs

**The pipeline handles data. You handle UI.**

## Example: Adding Bangkok

1. **Pipeline runs:** `python tools/run_city.py --city "Bangkok"`
2. **Pipeline pushes:** Data goes to Supabase via bulk-import API
3. **Website auto-renders:** Page appears at `/cities/bangkok` automatically
4. **You verify:** Visit the page, check sections load, done

No "building" needed on your end.
