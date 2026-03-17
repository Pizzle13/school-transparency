# Supabase Table Mismatch Issue — Local Intel Display

**Status:** BLOCKED — Pepper (pipeline) can't find tables; website expects specific table names

---

## Frontend Expected Tables (Read-Only)

The website queries these Supabase tables to display city data:

| Table Name | Purpose | Queried By |
|------------|---------|-----------|
| `cities` | City metadata | city-queries.js |
| `schools` | School directory | school-queries.js |
| `city_news` | News articles per city | city-queries.js |
| **`local_intel_data`** | Local Intel tips (categories, content) | city-queries.js line 72 |
| `housing_areas` | Neighborhood data | city-queries.js |
| `housing_websites` | Housing resource links | city-queries.js |
| `air_quality` | AQI data | city-queries.js |
| `city_apps` | Essential apps per city | city-queries.js |
| `hospitals` | Healthcare facilities | city-queries.js |
| `pet_import` | Pet import info per city | city-queries.js |

---

## The Problem

**CHANGE_LOG mentions (Feb 15, 2026):**
> Database tables created: `user_submissions`, `school_reviews`, `local_intel_submissions`, `housing_submissions`, `salary_submissions`

**But the Frontend Expects:**
- `local_intel_data` (not `local_intel_submissions`)

**What Pepper Is Trying To Do:**
- Pepper is trying to insert Local Intel submissions into the database
- But Pepper can't find the table structure/names in Supabase
- This may be because:
  1. Tables were never actually created in Supabase (despite CHANGE_LOG saying they were)
  2. Tables exist but with different names than what the pipeline expects
  3. Mismatch between `local_intel_submissions` (submission table) vs `local_intel_data` (published data table)

---

## How Local Intel Currently Works (Frontend)

1. Users submit tips via `LocalIntelModal` form
2. Form posts to `/api/submissions/local-intel` API endpoint
3. Backend saves to `local_intel_submissions` table
4. **BUT:** The city page displays data from `local_intel_data` table instead
5. This means there's supposed to be a process to:
   - Accept submissions in `local_intel_submissions`
   - Admin reviews them
   - Approved submissions are published to `local_intel_data` for display

---

## Current Bangkok Data

When you visit `/cities/bangkok`, the LocalIntelSection component:
1. Queries Supabase for `local_intel_data` WHERE `city_id = bangkok_id`
2. Groups results by category (Restaurants, Housing, Transportation, etc.)
3. Displays colored cards with tips

**If no data appears:** Either:
- The `local_intel_data` table doesn't exist
- Bangkok's local intel hasn't been populated yet (manually or by pipeline)

---

## What Needs To Happen

**For Pepper (Pipeline Project):**
1. Confirm table structure in Supabase:
   - Does `local_intel_submissions` table exist? (for user submissions)
   - Does `local_intel_data` table exist? (for published content)
2. If tables don't exist, create them with proper schema
3. Populate `local_intel_data` with sample content for Bangkok, Mumbai, etc.

**For Tigger (This Project):**
- No changes needed to frontend code
- The website is ready to display local intel once tables are populated

---

## Schema Reference (What Tables Should Look Like)

### local_intel_submissions
```
id (uuid, primary key)
city_id (uuid, foreign key → cities)
submitter_email (email)
category (text: 'Restaurants & Food', 'Apartment Hunting', etc.)
content (text, the tip)
status (text: 'pending', 'approved', 'rejected')
created_at (timestamp)
```

### local_intel_data
```
id (uuid, primary key)
city_id (uuid, foreign key → cities)
category (text)
content (text)
contributor_count (int, aggregate of submissions)
last_updated (timestamp)
```

---

## Action Items

**For Carl (GM):**
- File cross-project request to Pepper about table schema/population
- Verify if tables actually exist in Supabase
- Confirm table names match between pipeline expectations and frontend queries

**For Pepper (Pipeline):**
- Check Supabase table schema
- Populate `local_intel_data` with Bangkok/Mumbai/HCMC/Hanoi intel
- Set up submission → publication workflow

**For Tigger (Frontend):**
- ✅ Already ready to display local intel
- Waiting for backend to populate data

---

## Testing Locally

Once tables are populated, you can test by visiting:
- `http://localhost:3000/cities/bangkok` — should show Local Intel section
- Scroll to "Local Intel" section — should display colorful tip cards grouped by category

