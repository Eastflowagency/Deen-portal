import { adminSession, classFailure, jsonBody } from '@/lib/class-server'
import { createRoom, roomName } from '@/lib/live-server'
export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
  try {
    await adminSession()
    const body = await jsonBody(request) as { name?: unknown } | null
    const room = await createRoom(roomName(body?.name))
    return Response.json({ url: room.url, name: room.name }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) { return classFailure(e) }
}
