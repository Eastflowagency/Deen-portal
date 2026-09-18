import { classSession, classFailure, jsonBody } from '@/lib/class-server'
import { mintToken, roomName } from '@/lib/live-server'
export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
  try {
    const session = await classSession()
    const body = await jsonBody(request) as { roomName?: unknown; role?: unknown } | null
    const token = await mintToken(session, roomName(body?.roomName), body?.role === 'speaker')
    return Response.json({ token }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) { return classFailure(e) }
}
