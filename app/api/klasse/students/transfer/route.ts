import { ClassError, classAdmin, classFailure, jsonBody, teacherSession } from '@/lib/class-server'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(request: Request) {
  try {
    const { db, user } = await teacherSession()
    const body = await jsonBody(request)
    if (!body || typeof body !== 'object' || !('studentId' in body) || !('destinationClassId' in body) ||
        typeof body.studentId !== 'string' || typeof body.destinationClassId !== 'string' ||
        !UUID.test(body.studentId) || !UUID.test(body.destinationClassId)) {
      throw new ClassError(400, 'Velg eleven og en mottakerklasse.')
    }
    const { data: member, error } = await db.from('class_students').select('user_id, class_id')
      .eq('user_id', body.studentId).eq('owner_id', user.id).maybeSingle()
    if (error) throw new ClassError(503, 'Kunne ikke kontrollere elevens klassetilhørighet.')
    if (!member) throw new ClassError(404, 'Eleven finnes ikke i din klasse.')
    if (member.class_id === body.destinationClassId) throw new ClassError(400, 'Eleven er allerede i denne klassen.')
    const admin = classAdmin()
    const { data: destination, error: destinationError } = await admin.from('teacher_classes')
      .select('id, owner_id').eq('id', body.destinationClassId).maybeSingle()
    if (destinationError) throw new ClassError(503, 'Kunne ikke kontrollere mottakerklassen.')
    if (!destination) throw new ClassError(400, 'Velg en annen gyldig klasse.')
    const { data: recipient, error: recipientError } = await admin.from('app_accounts').select('role,status').eq('user_id', destination.owner_id).maybeSingle()
    if (recipientError) throw new ClassError(503, 'Kunne ikke kontrollere mottakerens tilgang.')
    if (!recipient || recipient.status !== 'active' || !['teacher','admin'].includes(recipient.role)) throw new ClassError(400, 'Mottakeren må være en aktiv lærer.')
    // One database statement changes class and owner together. Match the old owner
    // again so stale/replayed requests cannot move a student after ownership changes.
    const { data: moved, error: moveError } = await admin.from('class_students')
      .update({ class_id: destination.id, owner_id: destination.owner_id })
      .eq('user_id', member.user_id).eq('owner_id', user.id).eq('class_id', member.class_id)
      .eq('deletion_pending', false).select('user_id').maybeSingle()
    if (moveError) throw new ClassError(503, 'Kunne ikke flytte eleven. Kontakt administrator hvis feilen fortsetter.')
    if (!moved) throw new ClassError(409, 'Eleven er flyttet eller behandles allerede. Oppdater siden.')
    return Response.json({ movedStudentId: moved.user_id }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) { return classFailure(error) }
}
