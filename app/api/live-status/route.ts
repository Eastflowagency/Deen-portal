export const dynamic = 'force-dynamic'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In-memory fallback — used when DB table doesn't exist yet
let memState = {
  isLive: false, title: '', teacher: '', subject: '', meetingUrl: '', startedAt: null as string | null,
}

function makeSupabase(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch { /* read-only in Route Handlers */ }
        },
      },
    }
  )
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = makeSupabase(cookieStore)

    const { data, error } = await supabase
      .from('live_status')
      .select('*')
      .eq('id', 1)
      .single()

    if (error || !data) {
      // Table not created yet — return in-memory state
      return NextResponse.json(memState)
    }

    const dbState = {
      isLive:     data.is_live,
      title:      data.title,
      teacher:    data.teacher,
      subject:    data.subject,
      meetingUrl: data.meeting_url,
      startedAt:  data.started_at,
    }
    // If in-memory says live but DB says not, the DB upsert likely failed (RLS/permissions).
    // Trust memState — it was set by the admin's POST in this server process.
    if (memState.isLive && !dbState.isLive) {
      return NextResponse.json(memState)
    }
    return NextResponse.json(dbState)
  } catch {
    return NextResponse.json(memState)
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = makeSupabase(cookieStore)

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('[live-status POST] auth error:', authError?.message ?? 'no user')
      return NextResponse.json({ error: 'Not authenticated — are you logged in as admin?' }, { status: 401 })
    }

    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '')
      .split(',').map(e => e.trim()).filter(Boolean)
    if (adminEmails.length > 0 && !adminEmails.includes(user.email ?? '')) {
      console.error('[live-status POST] unauthorized:', user.email)
      return NextResponse.json({ error: `Unauthorized — ${user.email} is not an admin` }, { status: 401 })
    }

    const body = await request.json()
    const nextState = {
      isLive:     body.isLive     ?? false,
      title:      body.title      ?? '',
      teacher:    body.teacher    ?? '',
      subject:    body.subject    ?? '',
      meetingUrl: body.meetingUrl ?? '',
      startedAt:  body.isLive ? new Date().toISOString() : null,
    }

    // Try to persist to Supabase
    const { error: dbError } = await supabase
      .from('live_status')
      .upsert({ id: 1,
        is_live:     nextState.isLive,
        title:       nextState.title,
        teacher:     nextState.teacher,
        subject:     nextState.subject,
        meeting_url: nextState.meetingUrl,
        started_at:  nextState.startedAt,
      }, { onConflict: 'id' })

    if (dbError) {
      // Table not set up — fall back to in-memory so live still works
      console.warn('[live-status POST] DB not available, using memory:', dbError.message)
      memState = nextState
    } else {
      memState = nextState
    }

    return NextResponse.json({ success: true, ...nextState })
  } catch (err) {
    console.error('[live-status POST] unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
