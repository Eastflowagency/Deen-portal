import { adminSession, classAdmin, classFailure, jsonBody, ClassError } from '@/lib/class-server'
export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'no-store' }
export async function GET() {
  try {
    await adminSession()
    const { data, error } = await classAdmin().from('notifications').select('id,title,message,created_at,is_active').order('created_at', { ascending: false })
    if (error) throw new ClassError(503, 'Kunne ikke hente varsler.')
    return Response.json({ notifications: data }, { headers })
  } catch (e) { return classFailure(e) }
}
export async function POST(request: Request) {
  try {
    await adminSession()
    const body = await jsonBody(request) as Record<string, unknown> | null
    if (!body) throw new ClassError(400, 'Ugyldig forespørsel.')
    const db = classAdmin()
    let result
    if (body.action === 'publish') {
      if (typeof body.title !== 'string' || !body.title.trim() || body.title.length > 200 || typeof body.message !== 'string' || !body.message.trim() || body.message.length > 3000) throw new ClassError(400, 'Skriv tittel og melding (maks 200 og 3000 tegn).')
      result = await db.from('notifications').insert({ title: body.title.trim(), message: body.message.trim(), is_active: true })
    } else {
      if (typeof body.id !== 'string' || !body.id) throw new ClassError(400, 'Velg et varsel.')
      if (body.action === 'delete') result = await db.from('notifications').delete().eq('id',body.id)
      else if (body.action === 'toggle' && typeof body.active === 'boolean') result = await db.from('notifications').update({ is_active: body.active }).eq('id',body.id)
      else throw new ClassError(400, 'Ukjent handling.')
    }
    if (result.error) throw new ClassError(503, 'Kunne ikke lagre varselet.')
    return Response.json({ success: true }, { headers })
  } catch (e) { return classFailure(e) }
}
