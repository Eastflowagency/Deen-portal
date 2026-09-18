import { ClassError, classAdmin, classFailure, teacherSession } from '@/lib/class-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await teacherSession()
    // The transfer picker exposes only destination names/IDs, never their rosters.
    const { data, error } = await classAdmin().from('teacher_classes')
      .select('id, name').order('name')
    if (error) throw new ClassError(503, 'Kunne ikke hente mottakerklassene.')
    return Response.json({ destinations: data }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) { return classFailure(error) }
}
