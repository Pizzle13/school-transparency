import { supabaseAdmin } from '../../../../lib/supabase/admin';

function checkAdminAuth(request) {
  const authHeader = request.headers.get('authorization');
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error('ADMIN_PASSWORD not configured');
  return authHeader?.replace('Bearer ', '') === password;
}

// Fields to copy from pipeline school to directory school when merging
const MERGE_FIELDS = [
  'city_id', 'rating', 'reviews', 'salary_range', 'summary',
  'pros', 'cons', 'community_rating', 'salary_min', 'salary_max',
  'isr_rating', 'isr_review_count', 'type',
];

/**
 * Normalize a school name for fuzzy matching.
 * Lowercase, strip punctuation, remove common noise words.
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
 * Calculate word-overlap similarity between two normalized names.
 * Returns 0–1 (1 = perfect match).
 */
function wordSimilarity(a, b) {
  const wordsA = new Set(a.split(' ').filter(w => w.length > 1));
  const wordsB = new Set(b.split(' ').filter(w => w.length > 1));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let overlap = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) overlap++;
  }
  return (2 * overlap) / (wordsA.size + wordsB.size);
}

/**
 * GET /api/admin/link-schools?city={slug}
 *
 * Returns unlinked pipeline schools for a city with suggested IBO directory matches.
 */
export async function GET(request) {
  try {
    if (!checkAdminAuth(request)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const citySlug = searchParams.get('city');

    if (!citySlug) {
      // Return all cities with linking stats
      const { data: cities } = await supabaseAdmin
        .from('cities')
        .select('id, name, slug')
        .order('name');

      const cityStats = [];
      for (const city of cities || []) {
        const { count: totalLinked } = await supabaseAdmin
          .from('schools')
          .select('id', { count: 'exact', head: true })
          .eq('city_id', city.id);

        const { count: inDirectory } = await supabaseAdmin
          .from('schools')
          .select('id', { count: 'exact', head: true })
          .eq('city_id', city.id)
          .not('slug', 'is', null);

        const unlinked = (totalLinked || 0) - (inDirectory || 0);

        cityStats.push({
          ...city,
          totalLinked: totalLinked || 0,
          inDirectory: inDirectory || 0,
          unlinked,
        });
      }

      return Response.json({ cities: cityStats });
    }

    // Get city
    const { data: city, error: cityError } = await supabaseAdmin
      .from('cities')
      .select('id, name, slug, country')
      .eq('slug', citySlug)
      .single();

    if (cityError || !city) {
      return Response.json({ error: 'City not found' }, { status: 404 });
    }

    // Get pipeline schools (have city_id, no slug = not in directory)
    const { data: pipelineSchools } = await supabaseAdmin
      .from('schools')
      .select('id, name, rating, reviews, salary_range, type')
      .eq('city_id', city.id)
      .is('slug', null)
      .order('name');

    // Get IBO directory schools in the same area (matching address)
    const { data: directorySchools } = await supabaseAdmin
      .from('schools')
      .select('id, name, slug, programmes, address, school_type, accreditations')
      .not('slug', 'is', null)
      .is('city_id', null)
      .ilike('address', `%${city.name}%`);

    // Build suggested matches
    const suggestions = [];

    for (const ps of pipelineSchools || []) {
      const normalizedPipeline = normalizeName(ps.name);
      const matches = [];

      for (const ds of directorySchools || []) {
        const normalizedDirectory = normalizeName(ds.name);
        const similarity = wordSimilarity(normalizedPipeline, normalizedDirectory);

        // Also check if one name contains the other
        const containsMatch =
          normalizedPipeline.includes(normalizedDirectory) ||
          normalizedDirectory.includes(normalizedPipeline);

        if (similarity >= 0.4 || containsMatch) {
          matches.push({
            directorySchool: ds,
            similarity: containsMatch ? Math.max(similarity, 0.7) : similarity,
          });
        }
      }

      // Sort by similarity descending
      matches.sort((a, b) => b.similarity - a.similarity);

      suggestions.push({
        pipelineSchool: ps,
        suggestedMatches: matches.slice(0, 3),
        bestMatch: matches.length > 0 ? matches[0] : null,
      });
    }

    // Count already-linked schools
    const { count: alreadyLinked } = await supabaseAdmin
      .from('schools')
      .select('id', { count: 'exact', head: true })
      .eq('city_id', city.id)
      .not('slug', 'is', null);

    return Response.json({
      city,
      alreadyLinked: alreadyLinked || 0,
      unlinkedCount: (pipelineSchools || []).length,
      suggestions,
    });

  } catch (error) {
    console.error('Link schools error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/link-schools
 *
 * Actions:
 *   merge  — merge pipeline school data into directory school, delete pipeline row
 *   skip   — give pipeline school a slug so it appears in directory without merging
 *   bulk   — auto-merge all high-confidence matches for a city
 */
export async function POST(request) {
  try {
    if (!checkAdminAuth(request)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'merge') {
      return handleMerge(body);
    } else if (action === 'skip') {
      return handleSkip(body);
    } else if (action === 'bulk') {
      return handleBulkMerge(body);
    }

    return Response.json({ error: 'Invalid action. Use: merge, skip, or bulk' }, { status: 400 });

  } catch (error) {
    console.error('Link schools POST error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Merge a pipeline school into a directory school.
 * Copies review/salary data to the directory school, deletes the pipeline row.
 */
async function handleMerge({ pipelineSchoolId, directorySchoolId }) {
  if (!pipelineSchoolId || !directorySchoolId) {
    return Response.json({ error: 'pipelineSchoolId and directorySchoolId required' }, { status: 400 });
  }

  // Fetch pipeline school
  const { data: pipeline, error: pErr } = await supabaseAdmin
    .from('schools')
    .select('*')
    .eq('id', pipelineSchoolId)
    .single();

  if (pErr || !pipeline) {
    return Response.json({ error: 'Pipeline school not found' }, { status: 404 });
  }

  // Build update object from pipeline school
  const updateData = {};
  for (const field of MERGE_FIELDS) {
    if (pipeline[field] != null) {
      updateData[field] = pipeline[field];
    }
  }

  // Also copy website_url and phone if the directory school doesn't have them
  const { data: dirSchool } = await supabaseAdmin
    .from('schools')
    .select('website_url, phone')
    .eq('id', directorySchoolId)
    .single();

  if (dirSchool && !dirSchool.website_url && pipeline.website_url) {
    updateData.website_url = pipeline.website_url;
  }
  if (dirSchool && !dirSchool.phone && pipeline.phone) {
    updateData.phone = pipeline.phone;
  }

  // Update directory school
  const { error: updateErr } = await supabaseAdmin
    .from('schools')
    .update(updateData)
    .eq('id', directorySchoolId);

  if (updateErr) {
    return Response.json({ error: `Failed to update directory school: ${updateErr.message}` }, { status: 500 });
  }

  // Delete pipeline school
  const { error: deleteErr } = await supabaseAdmin
    .from('schools')
    .delete()
    .eq('id', pipelineSchoolId);

  if (deleteErr) {
    console.warn('Failed to delete pipeline school after merge:', deleteErr.message);
  }

  return Response.json({
    success: true,
    message: `Merged pipeline data into directory school`,
    merged: { pipelineSchoolId, directorySchoolId, fieldsUpdated: Object.keys(updateData) },
  });
}

/**
 * Give a pipeline school a slug so it appears in the directory without merging.
 * Used for schools that exist in the pipeline but NOT in the IBO directory.
 */
async function handleSkip({ pipelineSchoolId }) {
  if (!pipelineSchoolId) {
    return Response.json({ error: 'pipelineSchoolId required' }, { status: 400 });
  }

  const { data: school } = await supabaseAdmin
    .from('schools')
    .select('name, slug, country_name, city_id')
    .eq('id', pipelineSchoolId)
    .single();

  if (!school) {
    return Response.json({ error: 'School not found' }, { status: 404 });
  }

  if (school.slug) {
    return Response.json({ message: 'School already has a slug', slug: school.slug });
  }

  // Generate slug from name
  const slug = school.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  // Check for uniqueness
  const { data: existing } = await supabaseAdmin
    .from('schools')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

  // If pipeline school has no country_name, try to get it from the city
  const updateData = { slug: finalSlug };
  if (!school.country_name && school.city_id) {
    const { data: city } = await supabaseAdmin
      .from('cities')
      .select('country')
      .eq('id', school.city_id)
      .single();
    if (city?.country) {
      updateData.country_name = city.country;
    }
  }

  const { error } = await supabaseAdmin
    .from('schools')
    .update(updateData)
    .eq('id', pipelineSchoolId);

  if (error) {
    return Response.json({ error: `Failed to add slug: ${error.message}` }, { status: 500 });
  }

  return Response.json({
    success: true,
    message: `Added slug "${finalSlug}" to school`,
    slug: finalSlug,
  });
}

/**
 * Auto-merge all high-confidence matches for a city.
 * Only merges pairs with similarity >= threshold.
 */
async function handleBulkMerge({ citySlug, threshold = 0.7 }) {
  if (!citySlug) {
    return Response.json({ error: 'citySlug required' }, { status: 400 });
  }

  // Get city
  const { data: city } = await supabaseAdmin
    .from('cities')
    .select('id, name')
    .eq('slug', citySlug)
    .single();

  if (!city) {
    return Response.json({ error: 'City not found' }, { status: 404 });
  }

  // Get unlinked pipeline schools
  const { data: pipelineSchools } = await supabaseAdmin
    .from('schools')
    .select('id, name, rating, reviews, salary_range, city_id, type, summary, pros, cons, community_rating, salary_min, salary_max, isr_rating, isr_review_count, website_url, phone')
    .eq('city_id', city.id)
    .is('slug', null);

  // Get IBO directory schools in same area
  const { data: directorySchools } = await supabaseAdmin
    .from('schools')
    .select('id, name, slug, address, website_url, phone')
    .not('slug', 'is', null)
    .is('city_id', null)
    .ilike('address', `%${city.name}%`);

  const results = { merged: [], skipped: [], errors: [] };
  const usedDirectoryIds = new Set();

  for (const ps of pipelineSchools || []) {
    const normalizedPipeline = normalizeName(ps.name);
    let bestMatch = null;
    let bestSimilarity = 0;

    for (const ds of directorySchools || []) {
      if (usedDirectoryIds.has(ds.id)) continue;

      const normalizedDirectory = normalizeName(ds.name);
      let similarity = wordSimilarity(normalizedPipeline, normalizedDirectory);

      if (normalizedPipeline.includes(normalizedDirectory) ||
          normalizedDirectory.includes(normalizedPipeline)) {
        similarity = Math.max(similarity, 0.7);
      }

      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = ds;
      }
    }

    if (bestMatch && bestSimilarity >= threshold) {
      // Merge
      const updateData = {};
      for (const field of MERGE_FIELDS) {
        if (ps[field] != null) updateData[field] = ps[field];
      }
      if (!bestMatch.website_url && ps.website_url) updateData.website_url = ps.website_url;
      if (!bestMatch.phone && ps.phone) updateData.phone = ps.phone;

      const { error: updateErr } = await supabaseAdmin
        .from('schools')
        .update(updateData)
        .eq('id', bestMatch.id);

      if (updateErr) {
        results.errors.push({ pipeline: ps.name, directory: bestMatch.name, error: updateErr.message });
        continue;
      }

      await supabaseAdmin.from('schools').delete().eq('id', ps.id);
      usedDirectoryIds.add(bestMatch.id);

      results.merged.push({
        pipeline: ps.name,
        directory: bestMatch.name,
        similarity: bestSimilarity,
        fieldsUpdated: Object.keys(updateData),
      });
    } else {
      results.skipped.push({
        pipeline: ps.name,
        bestMatch: bestMatch ? bestMatch.name : null,
        similarity: bestSimilarity,
        reason: bestMatch ? 'Below threshold' : 'No match found',
      });
    }
  }

  return Response.json({
    success: true,
    city: city.name,
    threshold,
    ...results,
    summary: `${results.merged.length} merged, ${results.skipped.length} skipped, ${results.errors.length} errors`,
  });
}
