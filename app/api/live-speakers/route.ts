import { adminSession, classAdmin, classFailure, jsonBody, ClassError } from '@/lib/class-server'
import { activeLive, roomFromUrl } from '@/lib/live-server'
export async function POST(request: Request) {
  try {
    await adminSession()
    const body = await jsonBody(request) as { userId?: unknown } | null
    if (typeof body?.userId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.userId)) throw new ClassError(400, 'Velg en elev.')
    const db = classAdmin()
    const { data: account, error } = await db.from('app_accounts').select('status').eq('user_id', body.userId).maybeSingle()
    if (error || account?.status !== 'active') throw new ClassError(403, 'Eleven har ikke aktiv tilgang.')
    const live = await activeLive()
    if (!live?.is_live) throw new ClassError(409, 'Start undervisningen først.')
    const { error: grantError } = await db.from('live_speakers').upsert({ user_id: body.userId, room_name: roomFromUrl(live.meeting_url), expires_at: new Date(Date.now()+3600000).toISOString() })
    if (grantError) throw new ClassError(503, 'Kunne ikke gi ordet til eleven.')
    return Response.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) { return classFailure(e) }
}
