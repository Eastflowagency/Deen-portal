import { classSession, classFailure } from '@/lib/class-server'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const { user, access } = await classSession()
    return Response.json({ userId: user.id, ...access }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) { return classFailure(error) }
}
