import { adminSession, classAdmin, classFailure, ClassError, jsonBody } from '@/lib/class-server'
import { studentUsername } from '@/lib/student-login'
export const dynamic = 'force-dynamic'
const UUID = /^[0-9a-f-]{36}$/i

export async function GET(request: Request) {
  try {
    await adminSession()
    const page = Math.max(1, Math.min(10000, Math.floor(Number(new URL(request.url).searchParams.get('page')) || 1)))
    const db = classAdmin()
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 50 })
    if (error) throw new ClassError(503, 'Kunne ikke hente brukerne.')
    const [accounts, classes, teachers, memberships] = await Promise.all([
      db.from('app_accounts').select('user_id, role, status').in('user_id', data.users.map(user => user.id)),
      db.from('teacher_classes').select('id, name, owner_id, level').order('created_at'),
      db.from('app_accounts').select('user_id, role, status').in('role',['admin','teacher']),
      db.from('class_students').select('user_id,class_id').in('user_id',data.users.map(user => user.id)),
    ])
    if (accounts.error || classes.error || teachers.error || memberships.error) throw new ClassError(503, 'Databaseoppdateringen må fullføres før brukeradministrasjonen kan åpnes.')
    const teacherNames = await Promise.all((teachers.data ?? []).map(async teacher => {
      const { data: account, error } = await db.auth.admin.getUserById(teacher.user_id)
      if (error || !account.user) throw new ClassError(503, 'Kunne ikke hente lærerne.')
      return { id: teacher.user_id, name: account.user.user_metadata?.full_name || account.user.email || 'Lærer', status: teacher.status }
    }))
    const users = data.users.map(user => ({
      id: user.id, name: user.user_metadata?.full_name || 'Uten navn',
      identifier: studentUsername(user.email ?? '') || user.email || '',
      classroom: classes.data?.find(c => c.id === memberships.data?.find(m => m.user_id === user.id)?.class_id) ?? null,
      ...accounts.data?.find(account => account.user_id === user.id),
    }))
    return Response.json({ users, classes: classes.data, teachers: teacherNames, page, hasNext: data.users.length === 50 }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) { return classFailure(error) }
}

export async function POST(request: Request) {
  try {
    const { user } = await adminSession()
    const raw = await jsonBody(request)
    if (!raw || typeof raw !== 'object') throw new ClassError(400, 'Ugyldig forespørsel.')
    const body = raw as Record<string, unknown>
    const db = classAdmin()
    if (body.action === 'create_teacher') {
      if (typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()) ||
          typeof body.name !== 'string' || !body.name.trim() || body.name.length > 120 ||
          typeof body.password !== 'string' || body.password.length < 12 || body.password.length > 128) throw new ClassError(400, 'Skriv navn, gyldig e-post og passord på 12–128 tegn.')
      const { data, error } = await db.auth.admin.createUser({ email: body.email.trim().toLowerCase(), password: body.password, email_confirm: true, user_metadata: { full_name: body.name.trim() } })
      if (error || !data.user) throw new ClassError(400, 'Kunne ikke opprette læreren. Kontroller om kontoen finnes fra før.')
      try {
        const { data: updated, error: roleError } = await db.from('app_accounts').update({ role: 'teacher' }).eq('user_id', data.user.id).select('user_id').single()
        if (roleError || !updated) throw new Error('Role assignment failed')
      } catch {
        try {
          const { error: cleanupError } = await db.auth.admin.deleteUser(data.user.id)
          if (cleanupError) throw new Error('Cleanup failed')
        } catch { throw new ClassError(500, 'Lærerkontoen ble opprettet, men rollen kunne ikke lagres. Kontakt administrator før nytt forsøk.') }
        throw new ClassError(503, 'Kunne ikke tildele lærerrollen. Kontakt administrator.')
      }
    } else if (body.action === 'create_class' || body.action === 'assign_class') {
      if (typeof body.teacherId !== 'string' || !UUID.test(body.teacherId)) throw new ClassError(400, 'Velg en lærer.')
      const { data: teacher, error } = await db.from('app_accounts').select('role, status').eq('user_id', body.teacherId).single()
      if (error || !teacher || teacher.status !== 'active' || !['admin','teacher'].includes(teacher.role)) throw new ClassError(400, 'Velg en aktiv lærer.')
      if (body.action === 'create_class') {
        if (typeof body.name !== 'string' || !body.name.trim() || body.name.length > 120 || ![1,2,3].includes(Number(body.level))) throw new ClassError(400, 'Skriv klassenavn og velg nivå.')
        const { error } = await db.from('teacher_classes').insert({ name: body.name.trim(), owner_id: body.teacherId, level: Number(body.level) })
        if (error) throw new ClassError(503, 'Kunne ikke opprette klassen.')
      } else {
        if (typeof body.classId !== 'string' || !UUID.test(body.classId)) throw new ClassError(400, 'Velg en klasse.')
        const { error } = await db.rpc('admin_assign_class', { target_class: body.classId, target_teacher: body.teacherId })
        if (error) throw new ClassError(409, 'Kunne ikke bytte lærer. En elev kan være under sletting. Oppdater og prøv igjen.')
      }
    } else {
      if (typeof body.userId !== 'string' || !UUID.test(body.userId) || body.userId === user.id) throw new ClassError(400, 'Velg en annen bruker.')
      const { data: target, error } = await db.from('app_accounts').select('role, status').eq('user_id', body.userId).single()
      if (error || !target) throw new ClassError(404, 'Brukeren finnes ikke.')
      if (target.role === 'admin') throw new ClassError(403, 'Administratorkontoer kan ikke endres her.')
      if (body.action === 'reset_password') {
        if (target.role !== 'student' || typeof body.password !== 'string' || body.password.length < 12 || body.password.length > 128) throw new ClassError(400, 'Velg en elev og passord på 12–128 tegn.')
        const { error } = await db.auth.admin.updateUserById(body.userId, { password: body.password })
        if (error) throw new ClassError(503, 'Kunne ikke endre passordet.')
      } else if (body.action === 'set_role' || body.action === 'set_status') {
        const key = body.action === 'set_role' ? 'role' : 'status'
        const allowed = key === 'role' ? ['teacher','student'] : ['active','suspended']
        if (typeof body.value !== 'string' || !allowed.includes(body.value)) throw new ClassError(400, 'Ugyldig verdi.')
        const { error } = await db.from('app_accounts').update({ [key]: body.value }).eq('user_id', body.userId).neq('role','admin')
        if (error) throw new ClassError(409, 'Kunne ikke endre kontoen. Flytt lærerens klasser til en annen lærer før rollen fjernes.')
      } else throw new ClassError(400, 'Ukjent handling.')
    }
    return Response.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) { return classFailure(error) }
}
