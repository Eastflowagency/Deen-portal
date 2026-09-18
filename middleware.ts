import { readAccess } from '@/lib/access'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Rewrite /les/bøker → /les/boker (Windows filesystem can't use ø in folder names)
  if (decodeURIComponent(request.nextUrl.pathname) === '/les/bøker') {
    const url = request.nextUrl.clone()
    url.pathname = '/les/boker'
    return NextResponse.rewrite(url)
  }

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

  const path = request.nextUrl.pathname
  if (path.startsWith('/portal') && path !== '/portal/admin/login') {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
    let access
    try { access = await readAccess(supabase, user.id) } catch {
      return NextResponse.redirect(new URL('/login?access=unavailable', request.url))
    }
    if (!access || access.status !== 'active') return NextResponse.redirect(new URL('/login?access=suspended', request.url))
    if (path.startsWith('/portal/admin')) {
      const teacherArea = path === '/portal/admin' || path === '/portal/admin/klasse' || path.startsWith('/portal/admin/klasse/')
      if (access.role !== 'admin' && !(access.role === 'teacher' && teacherArea)) {
        return NextResponse.redirect(new URL('/portal', request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/portal/:path*', '/les/:path*'],
}
