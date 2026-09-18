import { classSession, classAdmin, classFailure, ClassError, jsonBody } from '@/lib/class-server'
import { classRows, classroomAccess, id, lessonInput, sessionInput, textField, httpsUrl } from '@/lib/classroom-server'
import { ATTENDANCE_LABELS } from '@/lib/classroom'

export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'no-store' }

export async function GET(request: Request) {
  try {
    const session = await classSession()
    const { data: classrooms, error } = await session.db.from('teacher_classes').select('id,name,owner_id,level').order('created_at')
    if (error) throw new ClassError(503, 'Kunne ikke hente klassene.')
    const selected = new URL(request.url).searchParams.get('classId')
    const classroom = selected ? classrooms?.find(c => c.id === selected) : classrooms?.[0]
    if (selected && !classroom) throw new ClassError(404, 'Klassen finnes ikke eller du mangler tilgang.')
    const empty = { classrooms: classrooms ?? [], classroom: null, canManage: false, teacherName: '', lessons: [], sessions: [], materials: [], announcements: [], attendance: [], roster: [], notes: [] }
    if (!classroom) return Response.json(empty, { headers })
    const canManage = session.access.role === 'admin' || (session.access.role === 'teacher' && classroom.owner_id === session.user.id)
    const db = session.db
    // Every query uses the caller's authenticated client, including the row-level policies.
    const results = await Promise.all([
      classRows(db,'class_lessons','*',classroom.id,'created_at'),
      classRows(db,'class_sessions','*',classroom.id,'starts_at'),
      classRows(db,'class_materials','id,class_id,lesson_id,title,url,storage_path',classroom.id,'created_at'),
      classRows(db,'class_announcements','*',classroom.id,'created_at',false),
      classRows(db,'class_attendance','session_id,student_id,student_name,status,marked_at',classroom.id,'marked_at',false),
      canManage ? classRows(db,'class_students','user_id,full_name,username',classroom.id,'full_name') : Promise.resolve([]),
      canManage ? classRows(db,'class_lesson_notes','lesson_id,notes',classroom.id,'lesson_id') : Promise.resolve([]),
    ])
    let teacherName = 'Klassens lærer'
    try {
      const { data } = await classAdmin().auth.admin.getUserById(classroom.owner_id)
      if (typeof data.user?.user_metadata?.full_name === 'string') teacherName = data.user.user_metadata.full_name
    } catch { /* A missing display name must not hide teaching content. */ }
    const [lessons,sessions,materials,announcements,attendance,roster,notes] = results
    return Response.json({ classrooms,classroom,canManage,teacherName,lessons,sessions,materials,announcements,attendance,roster,notes }, { headers })
  } catch (e) { return classFailure(e) }
}

export async function POST(request: Request) {
  try {
    // Authenticate before parsing potentially large attendance/lesson bodies.
    const initial = await classSession()
    if (!['admin','teacher'].includes(initial.access.role)) throw new ClassError(403, 'Bare lærere og administrator kan gjøre endringer.')
    const raw = await jsonBody(request,65536)
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new ClassError(400, 'Ugyldig forespørsel.')
    const body = raw as Record<string,unknown>
    const { db, classroom } = await classroomAccess(body.classId,true)
    let result: { data?: unknown; error: unknown }
    if (body.action === 'save_lesson') {
      result = await db.rpc('save_class_lesson', { ...lessonInput(body,classroom.level), classroom: classroom.id })
    } else if (body.action === 'save_session') {
      const values = sessionInput(body)
      if (body.id) result = await db.from('class_sessions').update(values).eq('id',id(body.id)).eq('class_id',classroom.id).select('id').single()
      else result = await db.from('class_sessions').insert({ ...values,class_id:classroom.id }).select('id').single()
    } else if (body.action === 'save_announcement') {
      if (typeof body.published !== 'boolean') throw new ClassError(400, 'Velg publiseringsstatus.')
      const values = { title:textField(body.title,160,true),message:textField(body.message,4000,true),published:body.published }
      if (body.id) result = await db.from('class_announcements').update(values).eq('id',id(body.id)).eq('class_id',classroom.id).select('id').single()
      else result = await db.from('class_announcements').insert({ ...values,class_id:classroom.id }).select('id').single()
    } else if (body.action === 'save_attendance') {
      const sessionId = id(body.sessionId)
      const {data:meeting,error:meetingError}=await db.from('class_sessions').select('starts_at,status').eq('id',sessionId).eq('class_id',classroom.id).maybeSingle()
      if(meetingError||!meeting)throw new ClassError(404,'Undervisningen finnes ikke i klassen.')
      if(meeting.status==='cancelled'||Date.parse(meeting.starts_at)>Date.now())throw new ClassError(400,'Oppmøte kan bare registreres for påbegynt undervisning som ikke er avlyst.')
      if (!Array.isArray(body.records) || !body.records.length || body.records.length>500) throw new ClassError(400, 'Velg oppmøte for 1–500 elever.')
      const records = body.records.map((value: unknown) => {
        if (!value || typeof value !== 'object') throw new ClassError(400,'Ugyldig oppmøte.')
        const record = value as Record<string,unknown>
        if (typeof record.status !== 'string' || !Object.hasOwn(ATTENDANCE_LABELS,record.status)) throw new ClassError(400,'Ugyldig oppmøtestatus.')
        return { student_id:id(record.studentId),status:record.status,session_id:sessionId,class_id:classroom.id }
      })
      if (new Set(records.map(r=>r.student_id)).size !== records.length) throw new ClassError(400,'En elev er valgt flere ganger.')
      result = await db.from('class_attendance').upsert(records,{onConflict:'session_id,student_id'})
    } else if (body.action === 'add_link') {
      result = await db.from('class_materials').insert({ class_id:classroom.id,lesson_id:id(body.lessonId),title:textField(body.title,160,true),url:httpsUrl(body.url) })
    } else if (body.action === 'delete_announcement') {
      if (body.confirmation !== 'slett') throw new ClassError(400,'Skriv slett for å bekrefte.')
      result = await db.from('class_announcements').delete().eq('id',id(body.id)).eq('class_id',classroom.id).select('id').single()
    } else throw new ClassError(400,'Ukjent handling.')
    if (result.error) throw new ClassError(409,'Kunne ikke lagre. Kontroller klassen, leksjonen og elevenes klassetilhørighet, og prøv igjen.')
    return Response.json({ success:true,result:result.data ?? null },{headers})
  } catch (e) { return classFailure(e) }
}
