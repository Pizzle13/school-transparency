import Anthropic from '@anthropic-ai/sdk';

function checkAdminAuth(request) {
  const authHeader = request.headers.get('authorization');
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error('ADMIN_PASSWORD not configured');
  const providedPassword = authHeader?.replace('Bearer ', '');
  return providedPassword === password;
}

export async function POST(request) {
  try {
    if (!checkAdminAuth(request)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'ANTHROPIC_API_KEY not configured. Add it to .env.local' },
        { status: 500 }
      );
    }

    const { schoolName, schoolData, reviews, notes } = await request.json();

    if (!notes?.trim()) {
      return Response.json({ error: 'Notes are required' }, { status: 400 });
    }

    const client = new Anthropic({ apiKey });

    // Build school-level section
    const schoolSection = schoolData ? `
SCHOOL-LEVEL INFO (ID: school):
  Overview: ${schoolData.summary || '(empty)'}
  What Teachers Love: ${schoolData.pros || '(empty)'}
  Common Concerns: ${schoolData.cons || '(empty)'}` : '';

    // Build individual reviews section
    const reviewsSection = reviews?.length ? reviews.map((r, i) => {
      return `Review #${i + 1} (ID: ${r.id}):
  Position: ${r.position || 'Not specified'}
  Years taught: ${r.years_taught || 'Not specified'}
  Overall rating: ${r.overall_rating}/10
  Pros: ${r.pros || '(empty)'}
  Cons: ${r.cons || '(empty)'}
  Advice: ${r.advice_for_teachers || '(empty)'}
  Salary range: ${r.reported_salary_min || '?'} - ${r.reported_salary_max || '?'} ${r.salary_currency || 'USD'}`;
    }).join('\n\n') : '(No individual reviews)';

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `You are editing data for the school "${schoolName}". The admin has provided these update notes:

"${notes}"

Here is the current data:

${schoolSection}

INDIVIDUAL REVIEWS:
${reviewsSection}

Suggest updated text based on the admin's notes. Rules:
- Only change what the notes indicate needs changing
- Preserve the original voice and tone
- If content isn't affected by the notes, return it unchanged with changed: false
- Keep the same level of detail and length

Respond with valid JSON only, no markdown. The first item MUST be the school-level suggestion (id: "school"), followed by any review suggestions.

{
  "suggestions": [
    {
      "id": "school",
      "summary": "updated overview text",
      "pros": "updated what teachers love text",
      "cons": "updated common concerns text",
      "changed": true,
      "change_summary": "brief description of what changed"
    },
    {
      "id": "review-uuid-here",
      "pros": "updated pros text",
      "cons": "updated cons text",
      "advice_for_teachers": "updated advice text",
      "changed": true,
      "change_summary": "brief description of what changed"
    }
  ]
}`
      }]
    });

    let responseText = message.content[0].text.trim();
    // Strip markdown code fences if present
    if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    let suggestions;
    try {
      suggestions = JSON.parse(responseText);
    } catch {
      return Response.json(
        { error: 'AI returned invalid JSON. Try again with clearer notes.', raw: responseText },
        { status: 500 }
      );
    }

    return Response.json(suggestions);
  } catch (error) {
    console.error('Suggest API error:', error);
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
