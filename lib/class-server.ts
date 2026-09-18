import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { readAccess } from '@/lib/access'

export class ClassError extends Error {
  constructor(public status: number, message: string) { super(message) }
}

export async function classSession() {
  const jar = await cookies()
  const db = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (values: { name: string; value: string; options: CookieOptions }[]) => values.forEach(({ name, value, options }) => jar.set(name, value, options)),
    },
  })
  const { data: { user }, error } = await db.auth.getUser()
  if (error || !user) throw new ClassError(401, 'Logg inn for å fortsette.')
  let access
  try { access = await readAccess(db, user.id) }
  catch { throw new ClassError(503, 'Kontotilgang er ikke klar. Databaseoppdateringen må fullføres.') }
  if (!access || access.status !== 'active') throw new ClassError(403, 'Medlemskapet er satt på pause. Kontakt administrator.')
  return { db, user, access }
}

export async function teacherSession() {
  const session = await classSession()
  if (!['admin','teacher'].includes(session.access.role)) throw new ClassError(403, 'Denne kontoen har ikke tilgang til klasseadministrasjon.')
  const { data, error } = await session.db.from('class_teachers').select('user_id').eq('user_id', session.user.id).maybeSingle()
  if (error) throw new ClassError(503, 'Klasseadministrasjonen er ikke klar. Kontakt administrator.')
  if (!data) throw new ClassError(403, 'Denne kontoen har ikke tilgang til klasseadministrasjon.')
  return session
}

export async function adminSession() {
  const session = await classSession()
  if (session.access.role !== 'admin') throw new ClassError(403, 'Kun administrator har tilgang.')
  return session
}

export function classAdmin() {
  // This file is used only from server route handlers. Never export this client to the browser.
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!secret) throw new ClassError(503, 'Elevadministrasjon er ikke aktivert. Kontakt administrator.')
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export async function jsonBody(request: Request, maxLength = 4096) {
  if (!request.headers.get('content-type')?.includes('application/json')) throw new ClassError(415, 'Ugyldig forespørsel.')
  const text = await request.text()
  if (text.length > maxLength) throw new ClassError(413, 'Forespørselen er for stor.')
  try { return JSON.parse(text) as unknown } catch { throw new ClassError(400, 'Ugyldig forespørsel.') }
}

export function classFailure(error: unknown) {
  return Response.json({ error: error instanceof ClassError ? error.message : 'Noe gikk galt. Prøv igjen.' }, {
    status: error instanceof ClassError ? error.status : 500,
    headers: { 'Cache-Control': 'no-store' },
  })
}
