export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const apiKey = process.env.DAILY_API_KEY
  if (!apiKey) {
    console.error('[daily-token] DAILY_API_KEY not set')
    return NextResponse.json({ error: 'Daily.co API key not configured' }, { status: 500 })
  }

  let body: { roomName?: unknown; role?: unknown; userName?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { roomName, role, userName } = body
  if (!roomName || typeof roomName !== 'string') {
    return NextResponse.json({ error: 'roomName required' }, { status: 400 })
  }

  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 8
  const nameStr = typeof userName === 'string' && userName.trim() ? userName.trim() : 'Student'

  let properties: Record<string, unknown>

  if (role === 'teacher') {
    properties = { room_name: roomName, is_owner: true, user_name: nameStr, exp }
  } else if (role === 'speaker') {
    // Admitted student — joins with mic on, camera off by default
    properties = {
      room_name: roomName,
      user_name: nameStr,
      start_video_off: true,
      start_audio_off: false,
      permissions: { canSend: ['video', 'audio', 'screenVideo', 'screenAudio'], canAdmin: [] },
      exp,
    }
  } else {
    // Viewer — watch and hear only, cannot send any media
    properties = {
      room_name: roomName,
      user_name: nameStr,
      start_video_off: true,
      start_audio_off: true,
      permissions: { canSend: [], canAdmin: [] },
      exp,
    }
  }

  try {
    const res = await fetch('https://api.daily.co/v1/meeting-tokens', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      console.error('[daily-token] Daily.co error:', res.status, data)
      return NextResponse.json(
        { error: (data as Record<string, unknown>).info ?? `Daily.co feil ${res.status}` },
        { status: res.status }
      )
    }

    return NextResponse.json({ token: (data as Record<string, unknown>).token })
  } catch (err) {
    console.error('[daily-token] fetch error:', err)
    return NextResponse.json({ error: 'Nettverksfeil mot Daily.co' }, { status: 502 })
  }
}
