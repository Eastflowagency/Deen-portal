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
    // Verify admin session
    const cookieStore = await cookies()
    const supabase = makeSupabase(cookieStore)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '')
      .split(',').map(e => e.trim()).filter(Boolean)
    if (adminEmails.length > 0 && !adminEmails.includes(user.email ?? '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name } = await request.json()
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Room name required' }, { status: 400 })
    }

    const apiKey = process.env.DAILY_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Daily.co API key not configured' }, { status: 500 })
    }

    // Try to create the room
    let res = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        privacy: 'public',
        properties: {
          enable_prejoin_ui: false,
          start_audio_off: true,
          start_video_off: true,
          // Room expires 8 hours after creation
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
        },
      }),
    })

    // If the room already exists (same subject+date), fetch it instead
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      const alreadyExists = res.status === 400 &&
        (String(errBody.info ?? '').toLowerCase().includes('already exists'))

      if (alreadyExists) {
        res = await fetch(`https://api.daily.co/v1/rooms/${encodeURIComponent(name)}`, {
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
    return NextResponse.json({ url: room.url, name: room.name })
  } catch (err) {
    console.error('[create-daily-room] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
