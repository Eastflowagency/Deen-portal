// Shared with middleware. No service key is needed to read the caller's own role.
import type { SupabaseClient } from '@supabase/supabase-js'

export type AccountRole = 'admin' | 'teacher' | 'student'
export type AccountAccess = { role: AccountRole; status: 'active' | 'suspended' }

export async function readAccess(db: SupabaseClient, userId: string): Promise<AccountAccess | null> {
  const { data, error } = await db.from('app_accounts').select('role, status').eq('user_id', userId).maybeSingle()
  if (error) throw new Error('Account access unavailable')
  if (!data || !['admin','teacher','student'].includes(data.role) || !['active','suspended'].includes(data.status)) return null
  return data as AccountAccess
}
