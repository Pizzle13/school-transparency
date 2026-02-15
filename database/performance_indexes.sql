-- School Transparency Performance Optimization Indexes
-- Execute these in the Supabase SQL Editor for Phase 1 performance improvements

-- Critical performance indexes for cities table
CREATE INDEX CONCURRENTLY IF NOT EXISTS cities_slug_idx ON cities(slug);
CREATE INDEX CONCURRENTLY IF NOT EXISTS cities_name_idx ON cities(name);
CREATE INDEX CONCURRENTLY IF NOT EXISTS cities_country_idx ON cities(country);

-- Foreign key indexes for JOIN optimization
-- These improve performance of the monolithic query in city pages
CREATE INDEX CONCURRENTLY IF NOT EXISTS schools_city_id_idx ON schools(city_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS salary_data_city_id_idx ON salary_data(city_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS economic_data_city_id_idx ON economic_data(city_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS housing_areas_city_id_idx ON housing_areas(city_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS housing_websites_city_id_idx ON housing_websites(city_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS air_quality_city_id_idx ON air_quality(city_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS city_apps_city_id_idx ON city_apps(city_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS hospitals_city_id_idx ON hospitals(city_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS pet_import_city_id_idx ON pet_import(city_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS city_news_city_id_idx ON city_news(city_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS local_intel_data_city_id_idx ON local_intel_data(city_id);

-- Additional performance indexes for common queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS salary_data_avg_salary_idx ON salary_data(avg_salary);
CREATE INDEX CONCURRENTLY IF NOT EXISTS schools_type_idx ON schools(type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS cities_created_at_idx ON cities(created_at);

-- Composite indexes for complex queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS cities_country_name_idx ON cities(country, name);

-- Instructions:
-- 1. Log into your Supabase dashboard
-- 2. Go to SQL Editor
-- 3. Copy and paste this entire file
-- 4. Execute the commands
-- 5. The CONCURRENTLY flag ensures no downtime during index creation
-- 6. Monitor execution - large tables may take several minutes
--
-- Expected impact: 10x faster database queries for city pages