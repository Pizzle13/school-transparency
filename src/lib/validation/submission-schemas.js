import { z } from 'zod';

// ============================================
// SCHOOL REVIEW SUBMISSION SCHEMA
// ============================================
export const SchoolReviewSubmissionSchema = z.object({
  city_id: z.string().uuid('Invalid city ID'),
  school_id: z.string().uuid('Invalid school ID'),
  submitter_email: z.string().email('Invalid email address'),

  overall_rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  years_taught: z.number().int().min(1, 'Must be at least 1 year').max(50, 'Invalid years').optional(),
  position: z.string().min(2, 'Position too short').max(100, 'Position too long').optional(),
  contract_type: z.enum(['local', 'foreign', 'management', 'other']).optional(),

  admin_responsiveness: z.number().int().min(1).max(5).optional(),
  teacher_community: z.number().int().min(1).max(5).optional(),
  professional_development_opportunities: z.number().int().min(1).max(5).optional(),
  work_life_balance: z.number().int().min(1).max(5).optional(),

  pros: z.string().min(20, 'Please provide at least 20 characters').max(2000, 'Maximum 2000 characters').optional(),
  cons: z.string().min(20, 'Please provide at least 20 characters').max(2000, 'Maximum 2000 characters').optional(),
  advice_for_teachers: z.string().max(2000, 'Maximum 2000 characters').optional(),

  reported_salary_min: z.number().int().positive('Salary must be positive').optional(),
  reported_salary_max: z.number().int().positive('Salary must be positive').optional(),
  salary_currency: z.string().length(3, 'Use 3-letter currency code').default('USD').optional(),
}).refine(
  (data) => {
    if (data.reported_salary_min && data.reported_salary_max) {
      return data.reported_salary_min <= data.reported_salary_max;
    }
    return true;
  },
  {
    message: 'Minimum salary cannot be greater than maximum salary',
    path: ['reported_salary_max'],
  }
);

// ============================================
// LOCAL INTEL SUBMISSION SCHEMA
// ============================================
export const LocalIntelSubmissionSchema = z.object({
  city_id: z.string().uuid('Invalid city ID'),
  submitter_email: z.string().email('Invalid email address'),

  category: z.enum([
    'Restaurants & Food',
    'Apartment Hunting',
    'Transportation',
    'Shopping',
    'Safety & Avoiding Scams',
    'Social Life',
    'Banking & Finance',
    'Healthcare Tips',
    'Other'
  ], { errorMap: () => ({ message: 'Select a valid category' }) }),

  tip_text: z.string()
    .min(20, 'Please provide at least 20 characters')
    .max(1000, 'Tips must be under 1000 characters'),
});

// ============================================
// HOUSING SUBMISSION SCHEMA
// ============================================
export const HousingSubmissionSchema = z.object({
  city_id: z.string().uuid('Invalid city ID'),
  submitter_email: z.string().email('Invalid email address'),

  area_name: z.string().min(2, 'Area name too short').max(200, 'Area name too long'),
  rent_1br: z.number().int().positive('Rent must be positive').optional(),
  rent_2br: z.number().int().positive('Rent must be positive').optional(),
  rent_3br: z.number().int().positive('Rent must be positive').optional(),
  currency: z.string().length(3, 'Use 3-letter currency code').default('USD').optional(),

  neighborhood_vibe: z.string().max(1000, 'Maximum 1000 characters').optional(),
  commute_to_schools: z.string().max(500, 'Maximum 500 characters').optional(),
  safety_rating: z.number().int().min(1).max(5).optional(),
  expat_friendly_rating: z.number().int().min(1).max(5).optional(),
});

// ============================================
// SALARY SUBMISSION SCHEMA
// ============================================
export const SalarySubmissionSchema = z.object({
  city_id: z.string().uuid('Invalid city ID'),
  submitter_email: z.string().email('Invalid email address'),
  school_id: z.string().uuid('Invalid school ID').optional(),

  position: z.string().min(2, 'Position too short').max(200, 'Position too long'),
  years_experience: z.number().int().min(0, 'Years must be non-negative').max(50, 'Invalid years'),
  salary_amount: z.number().int().positive('Salary must be positive'),
  currency: z.string().length(3, 'Use 3-letter currency code').default('USD').optional(),

  housing_provided: z.boolean().optional(),
  flight_allowance: z.boolean().optional(),
  health_insurance: z.boolean().optional(),
  tuition_discount: z.boolean().optional(),

  contract_type: z.enum(['local', 'foreign', 'management']).optional(),
  qualifications: z.string().max(500, 'Maximum 500 characters').optional(),
});

// ============================================
// SCHOOL SUGGESTION + REVIEW SCHEMA
// (new school that doesn't exist in DB yet)
// ============================================
export const SchoolSuggestionSchema = z.object({
  city_id: z.string().uuid('Invalid city ID'),
  submitter_email: z.string().email('Invalid email address'),

  // School details
  school_name: z.string().min(2, 'School name too short').max(200, 'School name too long'),
  school_type: z.enum(['International', 'Bilingual', 'Language Center', 'Private National', 'Other']),
  school_website: z.string().url('Invalid URL').max(500).optional(),
  school_district: z.string().max(200, 'District name too long').optional(),

  // Review fields (same as SchoolReviewSubmissionSchema minus school_id)
  overall_rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  years_taught: z.number().int().min(1, 'Must be at least 1 year').max(50, 'Invalid years').optional(),
  position: z.string().min(2, 'Position too short').max(100, 'Position too long').optional(),
  contract_type: z.enum(['local', 'foreign', 'management', 'other']).optional(),

  admin_responsiveness: z.number().int().min(1).max(5).optional(),
  teacher_community: z.number().int().min(1).max(5).optional(),
  professional_development_opportunities: z.number().int().min(1).max(5).optional(),
  work_life_balance: z.number().int().min(1).max(5).optional(),

  pros: z.string().min(20, 'Please provide at least 20 characters').max(2000, 'Maximum 2000 characters').optional(),
  cons: z.string().min(20, 'Please provide at least 20 characters').max(2000, 'Maximum 2000 characters').optional(),
  advice_for_teachers: z.string().max(2000, 'Maximum 2000 characters').optional(),

  reported_salary_min: z.number().int().positive('Salary must be positive').optional(),
  reported_salary_max: z.number().int().positive('Salary must be positive').optional(),
  salary_currency: z.string().length(3, 'Use 3-letter currency code').default('USD').optional(),
}).refine(
  (data) => {
    if (data.reported_salary_min && data.reported_salary_max) {
      return data.reported_salary_min <= data.reported_salary_max;
    }
    return true;
  },
  {
    message: 'Minimum salary cannot be greater than maximum salary',
    path: ['reported_salary_max'],
  }
);

// ============================================
// ERROR FORMATTING HELPER
// ============================================
export function formatZodErrors(error) {
  const items = error.issues || error.errors || [];
  return items.map(err => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}
