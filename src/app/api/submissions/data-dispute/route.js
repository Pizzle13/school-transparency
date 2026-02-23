import { supabaseAdmin } from '../../../../lib/supabase/admin';
import { DataDisputeSubmissionSchema, formatZodErrors } from '../../../../lib/validation/submission-schemas';

export async function POST(request) {
  try {
    const body = await request.json();

    const validation = DataDisputeSubmissionSchema.safeParse(body);
    if (!validation.success) {
      return Response.json({
        error: 'Validation failed',
        details: formatZodErrors(validation.error)
      }, { status: 400 });
    }

    const data = validation.data;

    // Verify school exists
    const { data: school, error: schoolError } = await supabaseAdmin
      .from('schools')
      .select('id, name')
      .eq('id', data.school_id)
      .single();

    if (schoolError || !school) {
      return Response.json({ error: 'School not found' }, { status: 404 });
    }

    // Insert dispute record
    const { error: insertError } = await supabaseAdmin
      .from('data_dispute_submissions')
      .insert({
        school_id: data.school_id,
        category: data.category,
        description: data.description,
        evidence_url: data.evidence_url || null,
      });

    if (insertError) {
      console.error('Dispute insert error:', insertError);
      return Response.json({ error: 'Failed to save report' }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: 'Report received. We will review this and update the data if needed.',
    }, { status: 201 });

  } catch (error) {
    console.error('Data dispute API error:', error);
    return Response.json({
      error: 'Internal server error',
      message: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    message: 'Data Dispute Submission API',
    version: '1.0.0',
    method: 'POST',
    authentication: 'None required'
  });
}
