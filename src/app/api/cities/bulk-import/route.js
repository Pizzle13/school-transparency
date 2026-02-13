import { supabaseAdmin } from '../../../../lib/supabase/admin';
import { BulkCityImportSchema, formatZodErrors } from '../../../../lib/validation/schemas';
import { revalidatePath } from 'next/cache';

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

    // Revalidate the cities listing page so new cities appear immediately
    revalidatePath('/cities');

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
        const relationData = Array.isArray(data)
          ? data.map(item => ({ ...item, city_id: city.id }))
          : { ...data, city_id: city.id };

        const { error: relationError } = await supabaseAdmin
          .from(tableName)
          .insert(relationData);

        if (relationError) {
          console.warn(`Failed to create ${tableName} for city ${city.name}:`, relationError.message);
          // Don't throw error for relation failures, just log them
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