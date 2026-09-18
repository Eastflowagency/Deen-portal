import { ClassError, classFailure, classSession } from '@/lib/class-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { db, user } = await classSession()
    const { data: member, error } = await db.from('class_students').select('class_id, username, full_name').eq('user_id', user.id).maybeSingle()
    if (error) throw new ClassError(503, 'Klasseoversikten er ikke tilgjengelig ennå.')
    if (!member) return Response.json({ classroom: null }, { headers: { 'Cache-Control': 'no-store' } })
    const { data: classroom, error: classError } = await db.from('teacher_classes').select('name').eq('id', member.class_id).single()
    if (classError) throw new ClassError(503, 'Kunne ikke hente klassen.')
    return Response.json({ classroom, username: member.username, fullName: member.full_name }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) { return classFailure(error) }
}
