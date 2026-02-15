-- ============================================================
-- School Suggestions Table
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================
-- Date: 2026-02-15
-- Purpose: Allow users to suggest new schools not yet in the directory.
-- School suggestions are reviewed by JP before being added to the schools table.
-- A linked school_review is created at the same time (also pending review).
-- ============================================================

CREATE TABLE IF NOT EXISTS school_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES user_submissions(id) ON DELETE CASCADE,
  city_id UUID NOT NULL REFERENCES cities(id),
  school_name TEXT NOT NULL,
  school_type TEXT NOT NULL,  -- 'International' | 'Bilingual' | 'Language Center' | 'Private National' | 'Other'
  school_website TEXT,
  school_district TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_school_suggestions_city ON school_suggestions(city_id);
CREATE INDEX IF NOT EXISTS idx_school_suggestions_submission ON school_suggestions(submission_id);

-- RLS
ALTER TABLE school_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON school_suggestions FOR ALL USING (true) WITH CHECK (true);
