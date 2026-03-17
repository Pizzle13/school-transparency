# Tigger — Brand & Architecture

## Brand Identity

**Project:** School Transparency (Glassdoor for international teachers)
**Part of:** Logos Edu ecosystem
**Personality:** Authoritative, data-driven, protective
**Voice:** "We tell you what the job posting won't"
**Audience:** Teachers evaluating job offers or considering a move

---

## Color Palette (Tailwind)

```js
colors: {
  logos: {
    navy: '#1B2A4A',      // Primary — headers, nav, buttons
    teal: '#2A9D8F',      // Accent — CTAs, highlights, data viz
    gold: '#E9B949',      // Sparingly — badges, achievements
    gray: '#F5F5F5',      // Section backgrounds
    charcoal: '#333333',  // Body text
  }
}
```

### Usage Rules

- **Navy dominates:** nav bar, hero backgrounds, section headers
- **Teal is the accent:** buttons, links, data highlights, charts
- **Gold sparingly:** ratings, badges, "top pick" indicators
- **White/Light Gray:** content areas (data-heavy pages need breathing room)

---

## Visual Standards

- Footer must include: "A Logos Edu project" with link to parent site
- No overly decorative elements — data is the hero
- Mobile-first responsive design
- Accessible contrast ratios (WCAG AA minimum)

---

## Voice Rules

**Honest over polished:** If a city has problems, say so
**Specific over vague:** Cite real numbers, real sources
**No recruitment agency language:** ("exciting opportunity", "competitive package")
**Banned buzzwords:** delve, leverage, navigate, comprehensive, robust, synergy, etc.

---

## Dynamic City Pages

City pages are **fully dynamic**. No per-city setup needed.

```
Pipeline pushes data → Supabase → Next.js renders at /cities/{slug}
```

**Key files:**
- `src/app/cities/page.js` — Cities listing (all from Supabase)
- `src/app/cities/[slug]/page.js` — Dynamic city detail page
- `src/lib/data/city-queries.js` — Database queries (critical + secondary)
- `src/components/cities/` — 17+ components for different data sections

**When pipeline pushes new city data:**
- The page just works — no frontend changes needed
- All components gracefully hide empty sections
- No broken layouts if a section is missing data

---

## Data Loading Strategy

### Critical Data (Above Fold)
Loaded immediately, blocking page render:
- CityHero (title, key stats)
- SalaryAnalysis (hero numbers)
- SchoolSection (school listings)

### Secondary Data (Below Fold)
Lazy loaded via ProgressiveLoader (non-blocking):
- Housing
- AirQuality
- Healthcare
- Transportation
- News
- LocalIntel

This keeps initial page load fast while still showing all data.

---

## Component Architecture

### Layout Components

| Component | Purpose |
|-----------|---------|
| Header | Navigation + logo |
| Footer | Links + "A Logos Edu project" credit |
| CityHero | City title, key stats, hero image |
| ProgressiveLoader | Lazy load secondary sections |

### Data Components

| Component | Purpose |
|-----------|---------|
| SalaryAnalysis | Salary, cost of living, savings |
| SchoolSection | Schools + reviews summary |
| HousingSection | Rent ranges, neighborhoods |
| AirQualitySection | AQI, pollution data |
| HealthcareSection | Hospitals, facilities |
| TransportationSection | Public transit, commute |
| NewsSection | Recent news + categories |
| LocalIntelSection | Reddit synthesis, culture tips |

**Pattern:** Each component:
1. Receives data as props
2. Returns null if data is empty (graceful hide)
3. Never crashes if fields are missing
4. Uses Tailwind for styling

---

## SEO Implementation

- **Sitemap:** Generated (all cities, all schools)
- **Meta tags:** Per-city custom descriptions, keywords
- **Breadcrumbs:** City → School (schema.org)
- **JSON-LD:** LocalBusiness schema for schools, SoftwareApplication for site
- **robots.txt:** Configured
- **Open Graph:** Social sharing images + descriptions

---

## Cross-Ecosystem Links

**To Blog (Archi):**
- City page can link to blog articles about that city
- Example: Bangkok article linked from Bangkok city page

**To YouTube:**
- Embed video if it exists for the city
- Link to channel for more videos

**To Social Media (Daisy):**
- Footer links to Reddit communities
- Cross-promotion of content

**To School Directory (Bruce):**
- School cards link to full school profiles
- "See all schools in {city}" link to filtered directory

---

## Performance Targets

- **Core Web Vitals:**
  - LCP < 2.5s (Largest Contentful Paint)
  - FID < 100ms (First Input Delay)
  - CLS < 0.1 (Cumulative Layout Shift)
- **Bundle size:** < 100KB (gzipped)
- **Images:** Optimized with next/image (automatic)
- **Caching:** ISR (Incremental Static Regeneration) where appropriate

---

## Accessibility

- Semantic HTML (h1, h2, nav, article, section)
- ARIA labels for icons/buttons
- Color contrast ≥ 4.5:1 for text
- Keyboard navigation (all interactive elements)
- Alt text for images
- Screen reader friendly (no content hidden from readers)

---

## Testing Checklist (Before Pushing)

- [ ] Local dev server works (`npm run dev`)
- [ ] No console errors or warnings
- [ ] All links on page work (no 404s)
- [ ] Images load + display correctly
- [ ] Mobile responsive (checked on 375px width)
- [ ] Dark mode works (if implemented)
- [ ] Lighthouse score ≥ 80 (Performance, Accessibility, Best Practices, SEO)
