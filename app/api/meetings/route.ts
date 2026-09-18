import { classSession, classFailure, jsonBody, ClassError } from '@/lib/class-server'
import { createRoom, roomName, mintToken, activeLive, roomFromUrl } from '@/lib/live-server'
export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
  try {
    const session = await classSession()
    const body = await jsonBody(request) as { courseId?: unknown } | null
    if (typeof body?.courseId !== 'string') throw new ClassError(400, 'Velg et kurs.')
    const name = roomName(`course-${body.courseId}`)
    let url: string
    if (session.access.role === 'admin') url = (await createRoom(name)).url
    else {
      const live = await activeLive()
      if (!live?.is_live || roomFromUrl(live.meeting_url) !== name) throw new ClassError(403, 'Undervisningen er ikke startet.')
      url = live.meeting_url
    }
    return Response.json({ url, token: await mintToken(session, name) }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) { return classFailure(e) }
}
