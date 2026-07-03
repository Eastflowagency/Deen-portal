import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          )
        },
      },
    }
  )

  // Refreshes the session cookie — do not remove this call.
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Network error or Supabase unavailable — fail safe to login redirect
  }

  if (request.nextUrl.pathname.startsWith('/portal') &&
      !request.nextUrl.pathname.startsWith('/portal/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protect /portal/admin/* — redirect to /portal/admin/login if not admin
  if (request.nextUrl.pathname.startsWith('/portal/admin') &&
      !request.nextUrl.pathname.startsWith('/portal/admin/login')) {
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '')
      .split(',').map(e => e.trim()).filter(Boolean)
    if (!user || !adminEmails.includes(user.email ?? '')) {
      return NextResponse.redirect(new URL('/portal/admin/login', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/portal/:path*'],
}
