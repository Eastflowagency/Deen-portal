export const dynamic = 'force-dynamic'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function makeSupabase(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch { /* read-only in Route Handlers */ }
        },
      },
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = makeSupabase(cookieStore)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { courseId } = await request.json()
    if (!courseId || typeof courseId !== 'string') {
      return NextResponse.json({ error: 'courseId required' }, { status: 400 })
    }

    const apiKey = process.env.DAILY_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Daily.co API key not configured' }, { status: 500 })
    }

    // Derive role from server-side check — never trust client
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '')
      .split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
    const isOwner = adminEmails.includes((user.email ?? '').toLowerCase())

    const roomName = `course-${courseId}`

    // Create room (idempotent — reuse if already exists)
    let res = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: roomName,
        privacy: 'private',
        properties: {
          enable_prejoin_ui: false,
          start_audio_off: true,
          start_video_off: true,
          max_participants: 50,
          enable_chat: true,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
        },
      }),
    })

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      const alreadyExists = res.status === 400 &&
        String(errBody.info ?? '').toLowerCase().includes('already exists')

      if (alreadyExists) {
        res = await fetch(`https://api.daily.co/v1/rooms/${encodeURIComponent(roomName)}`, {
          headers: { 'Authorization': `Bearer ${apiKey}` },
        })
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        return NextResponse.json(
          { error: errData.info ?? `Daily.co error ${res.status}` },
          { status: res.status }
        )
      }
    }

    const room = await res.json()

    // Mint a meeting token
    const tokenRes = await fetch('https://api.daily.co/v1/meeting-tokens', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          user_name: user.email,
          is_owner: isOwner,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
        },
      }),
    })

    if (!tokenRes.ok) {
      const errData = await tokenRes.json().catch(() => ({}))
      return NextResponse.json(
        { error: errData.info ?? 'Could not create meeting token' },
        { status: tokenRes.status }
      )
    }

    const { token } = await tokenRes.json()
    return NextResponse.json({ url: room.url, token })
  } catch (err) {
    console.error('[meetings] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
