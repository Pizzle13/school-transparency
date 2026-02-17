-- ============================================================
-- Add compensation & benefits fields to school_reviews
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- Date: 2026-02-17
-- ============================================================
-- Replaces: reported_salary_min, reported_salary_max (range was wrong —
-- teachers know their own salary, not a range. We build ranges from aggregated data.)
--
-- New fields: single monthly salary + detailed benefits breakdown

-- Monthly salary (what the teacher actually receives per month in USD)
ALTER TABLE school_reviews ADD COLUMN IF NOT EXISTS reported_monthly_salary INT;

-- Housing benefit
ALTER TABLE school_reviews ADD COLUMN IF NOT EXISTS housing_type TEXT;  -- 'apartment', 'stipend', 'none', 'unknown'
ALTER TABLE school_reviews ADD COLUMN IF NOT EXISTS housing_stipend_amount INT;  -- monthly USD, only if housing_type = 'stipend'

-- Health insurance
ALTER TABLE school_reviews ADD COLUMN IF NOT EXISTS insurance_type TEXT;  -- 'international', 'local', 'none', 'unknown'

-- Tuition for kids
ALTER TABLE school_reviews ADD COLUMN IF NOT EXISTS tuition_covered BOOLEAN;
ALTER TABLE school_reviews ADD COLUMN IF NOT EXISTS tuition_percentage INT;  -- 0-100
ALTER TABLE school_reviews ADD COLUMN IF NOT EXISTS tuition_kids_covered INT;  -- number of kids

-- Flight allowance
ALTER TABLE school_reviews ADD COLUMN IF NOT EXISTS flight_type TEXT;  -- 'home', 'anywhere', 'fixed', 'none'
ALTER TABLE school_reviews ADD COLUMN IF NOT EXISTS flight_amount INT;  -- USD per year, only if flight_type = 'fixed'

-- Note: old columns (reported_salary_min, reported_salary_max, salary_currency)
-- are left in place for now — no data loss. They can be dropped later once
-- confirmed that no existing data needs migration.
