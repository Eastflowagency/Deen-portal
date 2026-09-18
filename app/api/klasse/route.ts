import { ClassError, classFailure, jsonBody, teacherSession } from '@/lib/class-server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { db, user } = await teacherSession()
    const { data: classrooms, error } = await db.from('teacher_classes').select('id, name, created_at, level').eq('owner_id', user.id).order('created_at')
    if (error) throw new ClassError(503, 'Kunne ikke hente klassen.')
    const selected = request ? new URL(request.url).searchParams.get('classId') : null
    const classroom = (classrooms ?? []).find(item => item.id === selected) ?? (!selected ? classrooms?.[0] : null)
    if (selected && !classroom) throw new ClassError(404, 'Klassen finnes ikke.')
    if (!classroom) return Response.json({ classrooms: classrooms ?? [], classroom: null, students: [], canCreateStudents: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) }, { headers: { 'Cache-Control': 'no-store' } })
    const { data: students, error: rosterError } = await db.from('class_students')
      .select('user_id, username, full_name, created_at').eq('class_id', classroom.id).eq('owner_id', user.id).order('created_at')
    if (rosterError) throw new ClassError(503, 'Kunne ikke hente elevene.')
    return Response.json({ classrooms, classroom, students, canCreateStudents: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) { return classFailure(error) }
}

export async function POST(request: Request) {
  try {
    const { db, user } = await teacherSession()
    const body = await jsonBody(request)
    const name = body && typeof body === 'object' && 'name' in body ? body.name : null
    const level = body && typeof body === 'object' && 'level' in body ? body.level : 1
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 120) throw new ClassError(400, 'Skriv et klassenavn på 1–120 tegn.')
    if (typeof level !== 'number' || ![1,2,3].includes(level)) throw new ClassError(400, 'Velg nivå 1, 2 eller 3.')
    const { data, error } = await db.from('teacher_classes').insert({ owner_id: user.id, name: name.trim(), level }).select('id, name, created_at, level').single()
    if (error) throw new ClassError(503, 'Kunne ikke opprette klassen.')
    return Response.json({ classroom: data }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
  } catch (error) { return classFailure(error) }
}
