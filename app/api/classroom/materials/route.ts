import { classSession, classFailure, ClassError, jsonBody } from '@/lib/class-server'
import { classroomAccess, id, textField } from '@/lib/classroom-server'
import { randomUUID } from 'node:crypto'

export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'no-store' }
export async function GET(request: Request) {
  try {
    const { db } = await classSession()
    const materialId = id(new URL(request.url).searchParams.get('id'))
    const { data, error } = await db.from('class_materials').select('url,storage_path').eq('id',materialId).maybeSingle()
    if (error) throw new ClassError(503,'Kunne ikke hente materiell.')
    if (!data) throw new ClassError(404,'Materiellet finnes ikke eller du mangler tilgang.')
    if (data.url) return Response.json({ url:data.url },{headers})
    const { data: signed, error: signError } = await db.storage.from('class-materials').createSignedUrl(data.storage_path,60)
    if (signError || !signed) throw new ClassError(503,'Kunne ikke åpne filen. Prøv igjen.')
    return Response.json({ url:signed.signedUrl },{headers})
  } catch (e) { return classFailure(e) }
}
export async function POST(request: Request) {
  try {
    const session = await classSession()
    if (!['admin','teacher'].includes(session.access.role)) throw new ClassError(403,'Bare klassens lærer kan laste opp materiell.')
    const size = Number(request.headers.get('content-length'))
    if (size > 11*1024*1024) throw new ClassError(413,'PDF-filen kan være maks 10 MB.')
    if (!request.headers.get('content-type')?.includes('multipart/form-data')) throw new ClassError(415,'Velg en PDF-fil.')
    const form = await request.formData()
    const { db, classroom } = await classroomAccess(form.get('classId'),true)
    const lessonId = id(form.get('lessonId'))
    const title = textField(form.get('title'),160,true)
    const file = form.get('file')
    if (!(file instanceof File) || file.size<5 || file.size>10*1024*1024 || file.type!=='application/pdf') throw new ClassError(400,'Velg en PDF-fil på maks 10 MB.')
    const bytes = new Uint8Array(await file.arrayBuffer())
    if (new TextDecoder().decode(bytes.slice(0,5))!=='%PDF-') throw new ClassError(400,'Filen er ikke en gyldig PDF.')
    const { data: lesson, error } = await db.from('class_lessons').select('id').eq('id',lessonId).eq('class_id',classroom.id).maybeSingle()
    if (error || !lesson) throw new ClassError(404,'Leksjonen finnes ikke i klassen.')
    const path = `${classroom.id}/${lessonId}/${randomUUID()}.pdf`
    const storage = db.storage.from('class-materials')
    const { error: uploadError } = await storage.upload(path,bytes,{contentType:'application/pdf',upsert:false})
    if (uploadError) throw new ClassError(503,'Kunne ikke laste opp PDF. Kontroller lagring og databaseoppdatering.')
    try {
      const { error: saveError } = await db.from('class_materials').insert({class_id:classroom.id,lesson_id:lessonId,title,storage_path:path})
      if (saveError) throw new Error('Material save failed')
    } catch {
      const { error: cleanup } = await storage.remove([path])
      if (cleanup) throw new ClassError(503,'Opplastingen ble avbrutt. Administrator må rydde en uregistrert fil i class-materials.')
      throw new ClassError(503,'Materiellet ble ikke lagret. Prøv igjen.')
    }
    return Response.json({success:true},{headers})
  } catch (e) { return classFailure(e) }
}
export async function DELETE(request: Request) {
  try {
    const session = await classSession()
    if (!['admin','teacher'].includes(session.access.role)) throw new ClassError(403,'Du kan ikke slette materiell.')
    const body = await jsonBody(request) as Record<string,unknown> | null
    if (!body || body.confirmation!=='slett') throw new ClassError(400,'Skriv slett for å bekrefte.')
    const {db,classroom} = await classroomAccess(body.classId,true)
    const {data,error} = await db.from('class_materials').select('id,storage_path').eq('id',id(body.id)).eq('class_id',classroom.id).maybeSingle()
    if (error || !data) throw new ClassError(404,'Materiellet finnes ikke i klassen.')
    if (data.storage_path) {
      const {error:removeError} = await db.storage.from('class-materials').remove([data.storage_path])
      if (removeError) throw new ClassError(503,'Filen kunne ikke slettes. Materielloppføringen er beholdt.')
    }
    const {error:deleteError} = await db.from('class_materials').delete().eq('id',data.id).eq('class_id',classroom.id)
    if (deleteError) throw new ClassError(503,'Filen er fjernet, men listen kunne ikke oppdateres. Prøv slettingen igjen.')
    return Response.json({success:true},{headers})
  } catch (e) { return classFailure(e) }
}
