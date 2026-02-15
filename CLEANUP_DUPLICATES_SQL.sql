-- SQL to Clean Up Duplicate HCMC Data
-- Run these in your Supabase SQL Editor
-- HCMC City ID: 6667f0e7-f9c0-439d-abe1-029ad8f45093

-- ====================================
-- 1. CHECK CURRENT STATUS
-- ====================================

-- First, let's see what we have:

-- ====================================
-- 2. IDENTIFY LOCAL INTEL DUPLICATES
-- ====================================

-- Show all Local Intel records grouped by category:
SELECT
    category,
    COUNT(*) as count,
    string_agg(substring(tip_text from 1 for 50), ' | ') as tip_previews,
    string_agg(created_at::text, ' | ') as created_dates
FROM local_intel_data
WHERE city_id = '6667f0e7-f9c0-439d-abe1-029ad8f45093'
GROUP BY category
ORDER BY count DESC, category;

-- ====================================
-- 3. DELETE STRATEGY OPTIONS
-- ====================================

-- OPTION 1: Keep only NEWEST records (from our mock data insertion - 2026-01-27)
-- This removes the older, potentially less comprehensive data

-- Preview what would be deleted (OLD data):
SELECT
    id,
    category,
    substring(tip_text from 1 for 60) as tip_preview,
    source,
    created_at
FROM local_intel_data
WHERE city_id = '6667f0e7-f9c0-439d-abe1-029ad8f45093'
AND created_at < '2026-01-25'  -- Anything before our mock data
ORDER BY category, created_at;

-- OPTION 2: Keep only OLDEST records (original data)
-- This removes our mock data and keeps whatever was there originally

-- Preview what would be deleted (NEW data - our mock data):
SELECT
    id,
    category,
    substring(tip_text from 1 for 60) as tip_preview,
    source,
    created_at
FROM local_intel_data
WHERE city_id = '6667f0e7-f9c0-439d-abe1-029ad8f45093'
AND created_at >= '2026-01-25'  -- Our mock data insertion
ORDER BY category, created_at;

-- ====================================
-- 4. RECOMMENDED: KEEP NEWEST (MOCK) DATA
-- ====================================
-- The mock data is more comprehensive and better formatted
-- Uncomment the DELETE statement below to execute:

/*
DELETE FROM local_intel_data
WHERE city_id = '6667f0e7-f9c0-439d-abe1-029ad8f45093'
AND created_at < '2026-01-25';
*/

-- ====================================
-- 5. ALTERNATIVE: KEEP OLDEST (ORIGINAL) DATA
-- ====================================
-- If you prefer to keep the original data and remove the mock data
-- Uncomment the DELETE statement below instead:

/*
DELETE FROM local_intel_data
WHERE city_id = '6667f0e7-f9c0-439d-abe1-029ad8f45093'
AND created_at >= '2026-01-25';
*/

-- ====================================
-- 6. CHECK IF OTHER TABLES NEED CLEANUP
-- ====================================

-- Check if other mock data tables actually have data but RLS is hiding them:
-- (Run this as admin/service role user if public client shows 0 records)

-- Check city_apps with admin access:
-- SELECT COUNT(*) FROM city_apps WHERE city_id = '6667f0e7-f9c0-439d-abe1-029ad8f45093';

-- Check housing_websites with admin access:
-- SELECT COUNT(*) FROM housing_websites WHERE city_id = '6667f0e7-f9c0-439d-abe1-029ad8f45093';

-- Check air_quality with admin access:
-- SELECT COUNT(*) FROM air_quality WHERE city_id = '6667f0e7-f9c0-439d-abe1-029ad8f45093';

-- Check city_news with admin access:
-- SELECT COUNT(*) FROM city_news WHERE city_id = '6667f0e7-f9c0-439d-abe1-029ad8f45093';

-- ====================================
-- 7. VERIFICATION AFTER CLEANUP
-- ====================================

-- After running the DELETE, verify the result:
SELECT
    category,
    COUNT(*) as count,
    string_agg(substring(tip_text from 1 for 40), ' | ') as tip_previews
FROM local_intel_data
WHERE city_id = '6667f0e7-f9c0-439d-abe1-029ad8f45093'
GROUP BY category
ORDER BY category;