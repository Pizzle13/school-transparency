-- ============================================================
-- User Data Infrastructure: Create Missing Tables
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================
-- Generated from actual code in src/app/api/submissions/
-- Date: 2026-02-14
-- ============================================================

-- =====================
-- 1. user_submissions (parent table for all submission types)
-- =====================
CREATE TABLE IF NOT EXISTS user_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_type TEXT NOT NULL,  -- 'school_review' | 'local_intel' | 'housing' | 'salary'
  city_id UUID NOT NULL REFERENCES cities(id),
  submitter_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'approved' | 'rejected'
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT,
  verification_expires_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  rejection_reason TEXT
);

-- =====================
-- 2. school_reviews
-- =====================
CREATE TABLE IF NOT EXISTS school_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES user_submissions(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id),
  overall_rating INT NOT NULL,
  years_taught INT,
  position TEXT,
  contract_type TEXT,
  admin_responsiveness INT,
  teacher_community INT,
  professional_development_opportunities INT,
  work_life_balance INT,
  pros TEXT,
  cons TEXT,
  advice_for_teachers TEXT,
  reported_salary_min INT,
  reported_salary_max INT,
  salary_currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 3. Fix local_intel_submissions (add submission_id FK)
-- The table exists but is missing submission_id which the code needs
-- =====================
ALTER TABLE local_intel_submissions
  ADD COLUMN IF NOT EXISTS submission_id UUID REFERENCES user_submissions(id) ON DELETE CASCADE;

-- =====================
-- 4. housing_submissions
-- =====================
CREATE TABLE IF NOT EXISTS housing_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES user_submissions(id) ON DELETE CASCADE,
  city_id UUID NOT NULL REFERENCES cities(id),
  area_name TEXT NOT NULL,
  rent_1br INT,
  rent_2br INT,
  rent_3br INT,
  currency TEXT DEFAULT 'USD',
  neighborhood_vibe TEXT,
  commute_to_schools TEXT,
  safety_rating INT,
  expat_friendly_rating INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 5. salary_submissions
-- =====================
CREATE TABLE IF NOT EXISTS salary_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES user_submissions(id) ON DELETE CASCADE,
  city_id UUID NOT NULL REFERENCES cities(id),
  school_id UUID REFERENCES schools(id),
  position TEXT NOT NULL,
  years_experience INT,
  salary_amount INT NOT NULL,
  currency TEXT DEFAULT 'USD',
  housing_provided BOOLEAN,
  flight_allowance BOOLEAN,
  health_insurance BOOLEAN,
  tuition_discount BOOLEAN,
  contract_type TEXT,
  qualifications TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 6. Indexes for query performance
-- =====================
CREATE INDEX IF NOT EXISTS idx_user_submissions_status ON user_submissions(status);
CREATE INDEX IF NOT EXISTS idx_user_submissions_city ON user_submissions(city_id);
CREATE INDEX IF NOT EXISTS idx_user_submissions_type ON user_submissions(submission_type);
CREATE INDEX IF NOT EXISTS idx_user_submissions_token ON user_submissions(verification_token);
CREATE INDEX IF NOT EXISTS idx_school_reviews_school ON school_reviews(school_id);
CREATE INDEX IF NOT EXISTS idx_school_reviews_submission ON school_reviews(submission_id);
CREATE INDEX IF NOT EXISTS idx_local_intel_submission ON local_intel_submissions(submission_id);
CREATE INDEX IF NOT EXISTS idx_housing_submissions_city ON housing_submissions(city_id);
CREATE INDEX IF NOT EXISTS idx_housing_submissions_sub ON housing_submissions(submission_id);
CREATE INDEX IF NOT EXISTS idx_salary_submissions_city ON salary_submissions(city_id);
CREATE INDEX IF NOT EXISTS idx_salary_submissions_sub ON salary_submissions(submission_id);
CREATE INDEX IF NOT EXISTS idx_salary_submissions_school ON salary_submissions(school_id);

-- =====================
-- 7. Row Level Security (RLS)
-- Service role bypasses RLS, anon key should NOT access these directly
-- =====================
ALTER TABLE user_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE housing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_submissions ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access (API routes use service role key)
CREATE POLICY "Service role full access" ON user_submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON school_reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON housing_submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON salary_submissions FOR ALL USING (true) WITH CHECK (true);

-- Block anon access to submission tables (all writes go through API routes with service role)
-- No anon policies = anon users get nothing (RLS enabled + no matching policy = denied)
