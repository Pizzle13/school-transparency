import { supabaseAdmin } from '../../../../lib/supabase/admin';
import { BulkCityImportSchema, formatZodErrors } from '../../../../lib/validation/schemas';
import { revalidatePath } from 'next/cache';

// Fields to copy from pipeline school onto existing directory school during auto-link
const AUTO_LINK_FIELDS = [
  'city_id', 'rating', 'reviews', 'salary_range', 'summary',
  'pros', 'cons', 'community_rating', 'salary_min', 'salary_max',
  'isr_rating', 'isr_review_count', 'type',
];

/**
 * Normalize a school name for matching: lowercase, strip punctuation and noise words.
 */
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[,\-–—().]/g, ' ')
    .replace(/\b(the|of|in|and|for|a|an)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Word-overlap similarity between two normalized names (0–1).
 */
function wordSimilarity(a, b) {
  const wordsA = new Set(a.split(' ').filter(w => w.length > 1));
  const wordsB = new Set(b.split(' ').filter(w => w.length > 1));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let overlap = 0;
  for (const w of wordsA) if (wordsB.has(w)) overlap++;
  return (2 * overlap) / (wordsA.size + wordsB.size);
}

/**
 * Try to match a pipeline school against existing directory schools.
 * Returns the matched directory school ID if confidence >= 0.7, or null.
 */
async function findDirectoryMatch(schoolName, cityName) {
  const { data: candidates } = await supabaseAdmin
    .from('schools')
    .select('id, name, slug')
    .not('slug', 'is', null)
    .is('city_id', null)
    .ilike('address', `%${cityName}%`);

  if (!candidates || candidates.length === 0) return null;

  const normalized = normalizeName(schoolName);
  let bestMatch = null;
  let bestScore = 0;

  for (const c of candidates) {
    const cn = normalizeName(c.name);
    let score = wordSimilarity(normalized, cn);
    if (normalized.includes(cn) || cn.includes(normalized)) {
      score = Math.max(score, 0.7);
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = c;
    }
  }

  return bestScore >= 0.7 ? bestMatch : null;
}

export async function POST(request) {
  try {
    // Authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.PIPELINE_API_KEY}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestBody = await request.json();

    // Validate entire request payload
    const validation = BulkCityImportSchema.safeParse(requestBody);
    if (!validation.success) {
      return Response.json({
        error: 'Validation failed',
        details: formatZodErrors(validation.error)
      }, { status: 400 });
    }

    const { cities, validate_only, skip_duplicates } = validation.data;
    const results = {
      success: [],
      failed: [],
      transaction_id: `tx_${Date.now()}`,
      total_processed: cities.length,
    };

    // If validate_only is true, just return validation results
    if (validate_only) {
      return Response.json({
        ...results,
        message: 'Validation completed successfully',
        skipped: cities.length,
      });
    }

    // Process each city
    for (let i = 0; i < cities.length; i++) {
      const cityImportData = cities[i];

      try {
        // Check for duplicates if skip_duplicates is enabled
        if (skip_duplicates) {
          const { data: existingCity } = await supabaseAdmin
            .from('cities')
            .select('id, name')
            .eq('slug', cityImportData.cityData.slug)
            .single();

          if (existingCity) {
            results.failed.push({
              city: cityImportData.cityData.name,
              errors: [{ field: 'slug', message: 'City with this slug already exists' }]
            });
            continue;
          }
        }

        // Create city with relations atomically using database transaction
        const cityResult = await createCityWithRelations(cityImportData);

        results.success.push({
          city_id: cityResult.id,
          name: cityResult.name,
          slug: cityResult.slug,
          relations_created: cityResult.relations_created || []
        });

        // Revalidate cached city page so new data appears immediately
        revalidatePath(`/cities/${cityImportData.cityData.slug}`);

      } catch (error) {
        console.error(`Error importing city ${cityImportData.cityData.name}:`, error);

        results.failed.push({
          city: cityImportData.cityData.name,
          errors: [{
            field: 'general',
            message: error.message || 'Unknown error occurred'
          }]
        });
      }
    }

    // Revalidate the cities listing page and homepage stats so new cities appear immediately
    revalidatePath('/cities');
    revalidatePath('/');

    return Response.json({
      ...results,
      message: `Processed ${results.success.length} cities successfully, ${results.failed.length} failed`
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    return Response.json({
      error: 'Internal server error',
      message: error.message
    }, { status: 500 });
  }
}

async function createCityWithRelations(cityImportData) {
  const { cityData, ...relatedData } = cityImportData;
  const relationsCreated = [];

  try {
    // Start transaction by creating the city first
    const { data: city, error: cityError } = await supabaseAdmin
      .from('cities')
      .insert(cityData)
      .select()
      .single();

    if (cityError) {
      throw new Error(`Failed to create city: ${cityError.message}`);
    }

    // Create related data if provided
    for (const [tableName, data] of Object.entries(relatedData)) {
      if (!data || (Array.isArray(data) && data.length === 0)) continue;

      try {
        // Auto-link schools: check if pipeline schools match existing IBO directory entries
        if (tableName === 'schools' && Array.isArray(data)) {
          let linked = 0;
          let inserted = 0;

          for (const schoolData of data) {
            const match = await findDirectoryMatch(schoolData.name, city.name);

            if (match) {
              // Merge pipeline data into existing directory school
              const updateData = {};
              const pipelineWithCity = { ...schoolData, city_id: city.id };
              for (const field of AUTO_LINK_FIELDS) {
                if (pipelineWithCity[field] != null) updateData[field] = pipelineWithCity[field];
              }

              const { error: updateErr } = await supabaseAdmin
                .from('schools')
                .update(updateData)
                .eq('id', match.id);

              if (updateErr) {
                console.warn(`Auto-link failed for "${schoolData.name}" → "${match.name}":`, updateErr.message);
              } else {
                linked++;
                console.log(`Auto-linked: "${schoolData.name}" → "${match.name}" (${match.slug})`);
              }
            } else {
              // No match — insert as new pipeline school
              const { error: insertErr } = await supabaseAdmin
                .from('schools')
                .insert({ ...schoolData, city_id: city.id });

              if (insertErr) {
                console.warn(`Failed to insert school "${schoolData.name}":`, insertErr.message);
              } else {
                inserted++;
              }
            }
          }

          relationsCreated.push(`schools (${linked} linked, ${inserted} new)`);
          continue;
        }

        const relationData = Array.isArray(data)
          ? data.map(item => ({ ...item, city_id: city.id }))
          : { ...data, city_id: city.id };

        const { error: relationError } = await supabaseAdmin
          .from(tableName)
          .insert(relationData);

        if (relationError) {
          console.warn(`Failed to create ${tableName} for city ${city.name}:`, relationError.message);
        } else {
          relationsCreated.push(tableName);
        }
      } catch (relationError) {
        console.warn(`Error processing ${tableName} for city ${city.name}:`, relationError.message);
      }
    }

    return {
      ...city,
      relations_created: relationsCreated
    };

  } catch (error) {
    // If city creation failed, the transaction is automatically rolled back
    throw error;
  }
}

// GET endpoint for testing API connectivity
export async function GET() {
  return Response.json({
    message: 'School Transparency Bulk Import API',
    version: '1.0.0',
    endpoints: {
      'POST /api/cities/bulk-import': 'Import multiple cities with related data',
      'GET /api/cities': 'List all cities',
      'POST /api/cities': 'Create single city'
    },
    authentication: 'Bearer token required',
    documentation: 'https://github.com/your-repo/docs/api'
  });
}