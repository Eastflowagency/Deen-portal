import { ClassError, classAdmin, classFailure, jsonBody, teacherSession } from '@/lib/class-server'
import { loginEmail, studentUsername, validateStudent } from '@/lib/student-login'

export async function DELETE(request: Request) {
  try {
    const { db, user } = await teacherSession()
    const body = await jsonBody(request)
    if (!body || typeof body !== 'object' || !('studentId' in body) || !('confirmation' in body) ||
        typeof body.studentId !== 'string' || typeof body.confirmation !== 'string' ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.studentId)) {
      throw new ClassError(400, 'Velg eleven og skriv slett for å bekrefte.')
    }
    if (body.studentId === user.id) throw new ClassError(403, 'Du kan ikke slette din egen konto her.')
    // RLS and explicit ownership filtering both apply before any privileged operation.
    const { data: member, error } = await db.from('class_students')
      .select('user_id, username').eq('user_id', body.studentId).eq('owner_id', user.id).maybeSingle()
    if (error) throw new ClassError(503, 'Kunne ikke kontrollere elevens klassetilhørighet.')
    if (!member) throw new ClassError(404, 'Eleven finnes ikke i din klasse.')
    if (body.confirmation.trim() !== 'slett') throw new ClassError(400, 'Skriv slett for å bekrefte slettingen.')

    const admin = classAdmin()
    const { data: teacher, error: roleError } = await admin.from('class_teachers').select('user_id').eq('user_id', member.user_id).maybeSingle()
    if (roleError) throw new ClassError(503, 'Kunne ikke kontrollere kontotypen.')
    if (teacher) throw new ClassError(403, 'Lærerkontoer kan ikke slettes her.')
    const { data: account, error: accountError } = await admin.auth.admin.getUserById(member.user_id)
    if (accountError || !account.user) throw new ClassError(503, 'Kunne ikke kontrollere elevkontoen. Oppdater siden og prøv igjen.')
    const email = account.user.email ?? ''
    // Trusted admin/teacher roles are synchronized into class_teachers by the database.
    if (studentUsername(email) !== member.username) {
      throw new ClassError(403, 'Denne kontoen må håndteres av administrator.')
    }
    // Atomically reserve the owned membership so a simultaneous move cannot change
    // its owner between authorization and the Auth deletion.
    const { data: reserved, error: reserveError } = await admin.from('class_students')
      .update({ deletion_pending: true }).eq('user_id', member.user_id).eq('owner_id', user.id)
      .eq('deletion_pending', false).select('user_id').maybeSingle()
    if (reserveError) throw new ClassError(503, 'Elevadministrasjonen må oppdateres. Kontakt administrator.')
    if (!reserved) throw new ClassError(409, 'Eleven er flyttet eller behandles allerede. Oppdater siden.')
    // Hard-delete Auth first. The existing FK atomically cascades to class_students.
    // Do not remove membership separately: a failed Auth deletion must keep the roster intact.
    try {
      const { error: deleteError } = await admin.auth.admin.deleteUser(member.user_id, false)
      if (deleteError) throw new Error('Account deletion failed')
    } catch {
      const { error: releaseError } = await admin.from('class_students')
        .update({ deletion_pending: false }).eq('user_id', member.user_id).eq('owner_id', user.id)
      if (releaseError) throw new ClassError(503, 'Slettingen ble avbrutt. Kontakt administrator for å låse opp elevkontoen.')
      throw new ClassError(503, 'Kunne ikke slette elevkontoen. Oppdater siden før du prøver igjen. Kontakt administrator hvis feilen fortsetter.')
    }
    return Response.json({ deletedStudentId: member.user_id }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) { return classFailure(error) }
}

export async function POST(request: Request) {
  try {
    const { db, user } = await teacherSession()
    const raw = await jsonBody(request)
    const student = validateStudent(raw)
    const classId = raw && typeof raw === 'object' && 'classId' in raw ? raw.classId : null
    if (typeof classId !== 'string' || !classId) throw new ClassError(400, 'Velg klasse.')
    if (!student) throw new ClassError(400, 'Bruk navn (maks 120 tegn), brukernavn (3–32 små bokstaver, tall, punktum, bindestrek eller understrek) og passord (12–128 tegn).')
    // Ownership and class are derived from the verified session, never from the request body.
    const { data: classroom, error } = await db.from('teacher_classes').select('id').eq('owner_id', user.id).eq('id', classId).maybeSingle()
    if (error) throw new ClassError(503, 'Kunne ikke hente klassen.')
    if (!classroom) throw new ClassError(409, 'Opprett klassen din først.')
    const admin = classAdmin()
    const { data: account, error: accountError } = await admin.auth.admin.createUser({
      email: loginEmail(student.username), password: student.password, email_confirm: true,
      user_metadata: { full_name: student.fullName },
    })
    if (accountError || !account.user) {
      if (accountError?.code === 'email_exists' || accountError?.code === 'user_already_exists') throw new ClassError(409, 'Brukernavnet er opptatt. Velg et annet.')
      throw new ClassError(400, 'Kunne ikke opprette eleven. Kontroller brukernavn og passord.')
    }
    let added: { user_id: string; username: string; full_name: string; created_at: string } | null = null
    try {
      const result = await admin.from('class_students').insert({
        user_id: account.user.id, class_id: classroom.id, owner_id: user.id,
        username: student.username, full_name: student.fullName,
      }).select('user_id, username, full_name, created_at').single()
      if (result.error || !result.data) throw new Error('Enrollment failed')
      added = result.data
    } catch {
      // Compensate for enrollment failure; never leave a newly created account silently unassigned.
      try {
        const { error: cleanupError } = await admin.auth.admin.deleteUser(account.user.id)
        if (cleanupError) throw new Error('Cleanup failed')
      } catch {
        console.error('Class enrollment cleanup requires attention for Auth user', account.user.id)
        throw new ClassError(500, 'Elevopprettingen ble avbrutt. Kontakt administrator før du prøver igjen.')
      }
      throw new ClassError(503, 'Eleven ble ikke lagt til. Ingen elevkonto ble beholdt. Prøv igjen.')
    }
    return Response.json({ student: added }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
  } catch (error) { return classFailure(error) }
}
