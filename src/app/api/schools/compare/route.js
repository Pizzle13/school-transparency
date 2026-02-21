import { getSchoolsForCompare } from '../../../../lib/data/school-queries';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const schoolsParam = searchParams.get('schools') || '';
  const slugsOrIds = schoolsParam.split(',').filter(Boolean).slice(0, 3);

  if (slugsOrIds.length < 2) {
    return Response.json(
      { error: 'Provide at least 2 school identifiers' },
      { status: 400 }
    );
  }

  const schools = await getSchoolsForCompare(slugsOrIds);

  return Response.json({ schools });
}
