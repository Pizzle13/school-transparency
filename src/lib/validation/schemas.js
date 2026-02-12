import { z } from 'zod';

// Core City Schema
export const CitySchema = z.object({
  name: z.string().min(1, 'City name is required').max(100, 'City name too long'),
  country: z.string().min(1, 'Country is required').max(100, 'Country name too long'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  hero_image_url: z.string().url('Invalid image URL').optional(),
  description: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  language: z.string().optional(),
});

// Related data schemas
export const SalaryDataSchema = z.object({
  avg_salary: z.number().positive('Salary must be positive'),
  currency: z.string().optional(),
  year: z.number().int().min(2020).max(2030).optional(),
});

export const EconomicDataSchema = z.object({
  gdp_growth: z.number().optional(),
  inflation: z.number().optional(),
  unemployment_rate: z.number().optional(),
  cost_of_living_index: z.number().optional(),
});

export const SchoolSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  type: z.string().min(1, 'School type is required'),
  grade_levels: z.string().optional(),
  website_url: z.string().url().optional(),
  contact_email: z.string().email().optional(),
  phone_number: z.string().optional(),
});

export const HousingAreaSchema = z.object({
  area_name: z.string().min(1, 'Area name is required'),
  avg_rent_1br: z.number().positive().optional(),
  avg_rent_2br: z.number().positive().optional(),
  avg_rent_3br: z.number().positive().optional(),
  description: z.string().optional(),
});

export const HospitalSchema = z.object({
  name: z.string().min(1, 'Hospital name is required'),
  type: z.string().optional(),
  address: z.string().optional(),
  phone_number: z.string().optional(),
  website_url: z.string().url().optional(),
});

export const AirQualitySchema = z.object({
  aqi_value: z.number().min(0).max(500),
  quality_level: z.string().min(1),
  pm25: z.number().optional(),
  pm10: z.number().optional(),
  last_updated: z.string().optional(),
});

// Full city import schema for bulk operations
export const FullCityImportSchema = z.object({
  cityData: CitySchema,
  salary_data: SalaryDataSchema.optional(),
  economic_data: EconomicDataSchema.optional(),
  schools: z.array(SchoolSchema).optional(),
  housing_areas: z.array(HousingAreaSchema).optional(),
  hospitals: z.array(HospitalSchema).optional(),
  air_quality: AirQualitySchema.optional(),
});

// Bulk import schema for multiple cities
export const BulkCityImportSchema = z.object({
  cities: z.array(FullCityImportSchema).min(1, 'At least one city is required'),
  validate_only: z.boolean().default(false),
  skip_duplicates: z.boolean().default(true),
});

// API response schemas
export const ApiSuccessSchema = z.object({
  success: z.array(z.any()),
  failed: z.array(z.object({
    city: z.string(),
    errors: z.array(z.object({
      field: z.string(),
      message: z.string(),
    })),
  })),
  transaction_id: z.string(),
});

// Validation helper functions
export function validateCity(data) {
  return CitySchema.safeParse(data);
}

export function validateFullCityImport(data) {
  return FullCityImportSchema.safeParse(data);
}

export function validateBulkImport(data) {
  return BulkCityImportSchema.safeParse(data);
}

// Transform errors to user-friendly format
export function formatZodErrors(error) {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}