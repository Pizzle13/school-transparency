import { supabase } from '../supabase';

const PER_PAGE = 24;

// IB programmes live in the `programmes` text[] column.
// Non-IB curricula live in the `accreditations` text[] column.
const IB_PROGRAMMES = new Set(['DP', 'MYP', 'PYP', 'CP']);

function applyCurriculumFilter(query, value) {
  if (!value) return query;
  if (IB_PROGRAMMES.has(value)) {
    return query.contains('programmes', [value]);
  }
  // Non-IB curriculum — stored in accreditations
  return query.contains('accreditations', [value]);
}

/**
 * Flexible query for school listings. Powers all directory pages.
 *
 * Schema: schools table has direct country_name, country_code, programmes, slug columns.
 * 8,697 schools. Data completeness varies — some have full enrichment (programmes,
 * accreditations, mission), others are still being enriched. 233 have review/salary data.
 */
export async function getSchools({
  search = '',
  country = '',
  programme = '',
  schoolType = '',
  boarding = '',
  gender = '',
  counsellor = '',
  page = 1,
  perPage = PER_PAGE,
  sort = 'name',
} = {}) {
  let query = supabase
    .from('schools')
    .select('*', { count: 'exact' })
    .not('slug', 'is', null); // Only directory schools with slugs

  // Text search on school name
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  // Country filter — match slugified country_name
  if (country) {
    const countryName = country.replace(/-/g, ' ');
    query = query.ilike('country_name', countryName);
  }

  // Curriculum filter — IB programmes or non-IB curricula
  query = applyCurriculumFilter(query, programme);

  // School type filter (PRIVATE, PUBLIC, STATE)
  if (schoolType) {
    query = query.ilike('school_type', schoolType);
  }

  // Boarding filter
  if (boarding) {
    if (boarding === 'YES') {
      query = query.neq('boarding', 'NONE');
    } else {
      query = query.eq('boarding', boarding);
    }
  }

  // Gender filter
  if (gender) {
    query = query.ilike('gender', gender);
  }

  // University counsellor filter
  if (counsellor === 'YES') {
    query = query.eq('has_university_counsellor', true);
  } else if (counsellor === 'NO') {
    query = query.eq('has_university_counsellor', false);
  }

  // Sorting
  if (sort === 'country') {
    query = query.order('country_name').order('name');
  } else {
    query = query.order('name');
  }

  // Pagination
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching schools:', error);
    return { schools: [], totalCount: 0, totalPages: 0 };
  }

  return {
    schools: data || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / perPage),
  };
}

/**
 * Get a single school by slug.
 */
export async function getSchoolBySlug(slug) {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching school by slug:', error);
    return null;
  }

  return data;
}

/**
 * Fetch multiple schools by slug for comparison tool.
 */
export async function getSchoolsForCompare(slugs = []) {
  if (!slugs.length) return [];

  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .in('slug', slugs);

  if (error) {
    console.error('Error fetching schools for compare:', error);
    return [];
  }

  return data || [];
}

/**
 * Get distinct countries with school counts for filter sidebar.
 * Accepts optional filters so counts reflect the active filter state
 * (e.g. when programme=DP is active, Vietnam shows 21 not 29).
 * Paginates through all rows since Supabase caps at 1000 per request.
 */
export async function getCountryList({
  search = '',
  programme = '',
  schoolType = '',
  boarding = '',
  gender = '',
  counsellor = '',
} = {}) {
  const countryMap = {};
  const batchSize = 1000;
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    let query = supabase
      .from('schools')
      .select('country_name')
      .not('slug', 'is', null)
      .not('country_name', 'is', null);

    if (search) query = query.ilike('name', `%${search}%`);
    query = applyCurriculumFilter(query, programme);
    if (schoolType) query = query.ilike('school_type', schoolType);
    if (boarding) {
      if (boarding === 'YES') {
        query = query.neq('boarding', 'NONE');
      } else {
        query = query.eq('boarding', boarding);
      }
    }
    if (gender) query = query.ilike('gender', gender);
    if (counsellor === 'YES') query = query.eq('has_university_counsellor', true);
    else if (counsellor === 'NO') query = query.eq('has_university_counsellor', false);

    query = query.range(from, from + batchSize - 1);

    const { data, error } = await query;

    if (error || !data) {
      console.error('Error fetching country list:', error);
      break;
    }

    for (const row of data) {
      const name = row.country_name;
      if (!name) continue;
      if (!countryMap[name]) {
        countryMap[name] = { name, count: 0 };
      }
      countryMap[name].count++;
    }

    hasMore = data.length === batchSize;
    from += batchSize;
  }

  return Object.values(countryMap)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get stats for the directory hero.
 * Paginates through all rows to get accurate counts.
 */
export async function getDirectoryStats() {
  // Get exact total via head-only count
  const { count: totalSchools } = await supabase
    .from('schools')
    .select('id', { count: 'exact', head: true })
    .not('slug', 'is', null);

  const countries = new Set();
  const programmeCounts = {};
  const batchSize = 1000;
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('schools')
      .select('country_name, programmes')
      .not('slug', 'is', null)
      .range(from, from + batchSize - 1);

    if (error || !data) break;

    for (const school of data) {
      if (school.country_name) countries.add(school.country_name);
      if (Array.isArray(school.programmes)) {
        for (const prog of school.programmes) {
          programmeCounts[prog] = (programmeCounts[prog] || 0) + 1;
        }
      }
    }

    hasMore = data.length === batchSize;
    from += batchSize;
  }

  return {
    totalSchools: totalSchools || 0,
    totalCountries: countries.size,
    programmeCounts,
  };
}

/**
 * Get country-specific stats for country listing pages.
 */
export async function getCountryStats(countrySlug) {
  const countryName = countrySlug.replace(/-/g, ' ');

  // Get exact total
  const { count: totalSchools, error: countError } = await supabase
    .from('schools')
    .select('id', { count: 'exact', head: true })
    .not('slug', 'is', null)
    .ilike('country_name', countryName);

  if (countError) return null;

  // Paginate for programme breakdown
  const programmeCounts = {};
  const batchSize = 1000;
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('schools')
      .select('programmes')
      .not('slug', 'is', null)
      .ilike('country_name', countryName)
      .range(from, from + batchSize - 1);

    if (error || !data) break;

    for (const school of data) {
      if (Array.isArray(school.programmes)) {
        for (const prog of school.programmes) {
          programmeCounts[prog] = (programmeCounts[prog] || 0) + 1;
        }
      }
    }

    hasMore = data.length === batchSize;
    from += batchSize;
  }

  return {
    totalSchools: totalSchools || 0,
    programmeCounts,
  };
}

/**
 * Get schools in a specific city within a country.
 * Uses city_name field or parses from address.
 */
export async function getSchoolsByCity({
  country = '',
  city = '',
  page = 1,
  perPage = PER_PAGE,
  search = '',
  programme = '',
  sort = 'name',
} = {}) {
  const countryName = country.replace(/-/g, ' ');
  const cityName = city.replace(/-/g, ' ');

  let query = supabase
    .from('schools')
    .select('*', { count: 'exact' })
    .not('slug', 'is', null)
    .ilike('country_name', countryName)
    .ilike('address', `%${cityName}%`);

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  query = applyCurriculumFilter(query, programme);

  query = query.order('name');

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching schools by city:', error);
    return { schools: [], totalCount: 0, totalPages: 0 };
  }

  return {
    schools: data || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / perPage),
  };
}
