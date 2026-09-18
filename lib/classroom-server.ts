import 'server-only'
import { classSession, ClassError } from './class-server'
import { CATALOG } from './curriculum'
import type { SupabaseClient } from '@supabase/supabase-js'

// PostgREST caps responses at 1000 rows. Page explicitly so attendance totals
// cannot silently omit older records as a class grows.
export async function classRows(db: SupabaseClient, table: string, fields: string, classId: string, order: string, ascending = true) {
  const rows: Record<string,unknown>[] = []
  for (let offset=0;offset<100000;offset+=1000) {
    let query = db.from(table).select(fields).eq('class_id',classId).order(order,{ascending})
    if (table === 'class_attendance') query=query.order('session_id').order('student_id')
    else if (order !== 'id') query=query.order(table === 'class_lesson_notes'?'lesson_id':table==='class_students'?'user_id':'id')
    if(table==='class_students') query=query.eq('deletion_pending',false)
    const {data,error}=await query.range(offset,offset+999)
    if(error) throw new ClassError(503,'Klasserommet er ikke klart. Kontroller databaseoppdateringen for sesjon 2.')
    rows.push(...(data as unknown as Record<string,unknown>[] ?? []))
    if(!data||data.length<1000)return rows
  }
  throw new ClassError(503,'Klassen har for mye historikk til denne visningen. Kontakt administrator.')
}

export function id(value: unknown): string {
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) throw new ClassError(400, 'Velg en gyldig klasse eller leksjon.')
  return value
}
export function textField(value: unknown, max: number, required = false) {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw new ClassError(400, `Kontroller tekstfeltet (maks ${max} tegn).`)
  return value.trim()
}
export function httpsUrl(value: unknown) {
  const text = textField(value,2000,true)
  try {
    const url = new URL(text)
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error()
    return url.href
  } catch { throw new ClassError(400, 'Bruk en gyldig HTTPS-lenke uten innloggingsopplysninger.') }
}
export async function classroomAccess(classId: unknown, write = false) {
  const session = await classSession()
  const classID = id(classId)
  const { data: classroom, error } = await session.db.from('teacher_classes').select('id,name,owner_id,level').eq('id', classID).maybeSingle()
  if (error) throw new ClassError(503, 'Kunne ikke hente klassen.')
  if (!classroom) throw new ClassError(404, 'Klassen finnes ikke eller du mangler tilgang.')
  const canManage = session.access.role === 'admin' || (session.access.role === 'teacher' && classroom.owner_id === session.user.id)
  if (write && !canManage) throw new ClassError(403, 'Bare klassens lærer eller administrator kan endre dette.')
  return { ...session, classroom, canManage }
}
export function lessonInput(body: Record<string, unknown>, level: number) {
  const course = CATALOG.find(c => c.slug === body.courseSlug && c.levelNumber === level)
  if (!course || typeof body.published !== 'boolean') throw new ClassError(400, 'Velg et fag for klassens nivå og publiseringsstatus.')
  return { lesson: body.id ? id(body.id) : null, course: course.slug, lesson_title: textField(body.title,160,true), description: textField(body.summary ?? '',4000), pages: textField(body.bookPages ?? '',120), questions: textField(body.bookQuestions ?? '',120), is_published: body.published, private_notes: textField(body.notes ?? '',8000) }
}
export function sessionInput(body: Record<string, unknown>) {
  const starts = typeof body.startsAt === 'string' && /(?:Z|[+-]\d{2}:\d{2})$/.test(body.startsAt) ? Date.parse(body.startsAt) : NaN
  const ends = typeof body.endsAt === 'string' && /(?:Z|[+-]\d{2}:\d{2})$/.test(body.endsAt) ? Date.parse(body.endsAt) : NaN
  if (!Number.isFinite(starts) || !Number.isFinite(ends) || ends <= starts || ends-starts > 43200000 || typeof body.status !== 'string' || !['scheduled','completed','cancelled'].includes(body.status)) throw new ClassError(400, 'Velg gyldig start, slutt (maks 12 timer) og status.')
  return { lesson_id: id(body.lessonId), starts_at: new Date(starts).toISOString(), ends_at: new Date(ends).toISOString(), status: body.status }
}
