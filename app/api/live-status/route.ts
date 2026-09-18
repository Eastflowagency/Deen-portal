import { adminSession, classSession, classAdmin, classFailure, jsonBody, ClassError } from '@/lib/class-server'
import { activeLive, roomFromUrl, daily } from '@/lib/live-server'
export const dynamic = 'force-dynamic'
function state(row: Record<string, unknown> | null) {
  return { isLive: row?.is_live ?? false, title: row?.title ?? '', teacher: row?.teacher ?? '', subject: row?.subject ?? '', meetingUrl: row?.meeting_url ?? '', startedAt: row?.started_at ?? null, time: row?.time ?? '' }
}
export async function GET() {
  try { await classSession(); return Response.json(state(await activeLive()), { headers: { 'Cache-Control': 'no-store' } }) }
  catch (e) { return classFailure(e) }
}
export async function POST(request: Request) {
  try {
    await adminSession()
    const body = await jsonBody(request) as Record<string, unknown> | null
    if (!body || typeof body.isLive !== 'boolean' || ['title','teacher','subject','meetingUrl','time'].some(k => body[k] !== undefined && (typeof body[k] !== 'string' || (body[k] as string).length > 500))) throw new ClassError(400, 'Kontroller feltene for undervisningen.')
    if (body.isLive) {
      let url: URL
      try { url = new URL(String(body.meetingUrl || '')) } catch { throw new ClassError(400, 'Skriv en gyldig møtelenke.') }
      if (url.protocol !== 'https:' || url.username || url.password) throw new ClassError(400, 'Bruk en HTTPS-møtelenke.')
      if (url.hostname.endsWith('.daily.co')) {
        const name = roomFromUrl(url.href)
        const room = await daily(`rooms/${encodeURIComponent(name)}`, { privacy: 'private' })
        if (new URL(room.url).origin !== url.origin) throw new ClassError(400, 'Rommet tilhører ikke denne live-tjenesten.')
      }
    }
    const row = { id: 1, is_live: body.isLive, title: body.title ?? '', teacher: body.teacher ?? '', subject: body.subject ?? '', meeting_url: body.meetingUrl ?? '', time: body.time ?? '', started_at: body.isLive ? new Date().toISOString() : null }
    const db = classAdmin()
    const { error: grantError } = await db.from('live_speakers').delete().neq('room_name', '')
    if (grantError) throw new ClassError(503, 'Taletilgang kunne ikke nullstilles.')
    const { error } = await db.from('live_status').upsert(row, { onConflict: 'id' })
    if (error) throw new ClassError(503, 'Live-status ble ikke lagret. Kontroller databaseoppdateringen.')
    return Response.json({ success: true, ...state(row) }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) { return classFailure(e) }
}
