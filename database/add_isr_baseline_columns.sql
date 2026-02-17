-- Migration: Add ISR baseline columns to schools table
-- Purpose: Preserve the original ISR (International Schools Review) rating data
-- separately from the blended display rating. This allows us to blend ISR data
-- with user-submitted reviews while always preserving the ISR baseline.
--
-- Run this ONCE in Supabase SQL Editor.
-- After running, the existing rating/reviews values are copied to the ISR columns.

-- Step 1: Add the ISR baseline columns
ALTER TABLE schools
  ADD COLUMN IF NOT EXISTS isr_rating DECIMAL DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS isr_review_count INTEGER DEFAULT 0;

-- Step 2: Backfill from current data (current rating IS the ISR data)
UPDATE schools
SET isr_rating = rating,
    isr_review_count = reviews
WHERE rating IS NOT NULL;

-- Step 3: Update the rating constraint to allow 0-10 range
-- (drop old constraint if it exists, add new one)
ALTER TABLE schools DROP CONSTRAINT IF EXISTS rating_range;
ALTER TABLE schools ADD CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 10);

-- Verify: Check the backfill worked
-- SELECT name, rating, reviews, isr_rating, isr_review_count FROM schools LIMIT 20;
