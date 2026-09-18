import 'server-only'
import { classAdmin, ClassError, classSession } from './class-server'

export function roomName(value: unknown): string {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(value)) throw new ClassError(400, 'Ugyldig romnavn.')
  return value
}
export function roomFromUrl(value: string): string {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || !url.hostname.endsWith('.daily.co') || url.username || url.password) throw new Error()
    return roomName(url.pathname.replace(/^\//, '').replace(/\/$/, ''))
  } catch { throw new ClassError(400, 'Bruk en gyldig Daily-romlenke.') }
}
export async function daily(path: string, body?: object) {
  const key = process.env.DAILY_API_KEY
  if (!key) throw new ClassError(503, 'Live er ikke konfigurert.')
  const response = await fetch(`https://api.daily.co/v1/${path}`, { method: body ? 'POST' : 'GET', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}), cache: 'no-store' })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new ClassError(502, 'Kunne ikke kontakte live-rommet. Kontroller rommet og prøv igjen.')
  return data
}
export async function activeLive() {
  const { data, error } = await classAdmin().from('live_status').select('*').eq('id', 1).maybeSingle()
  if (error) throw new ClassError(503, 'Kunne ikke hente live-status.')
  return data
}
export async function createRoom(name: string) {
  roomName(name)
  try { return await daily(`rooms/${encodeURIComponent(name)}`, { privacy: 'private' }) }
  catch { return daily('rooms', { name, privacy: 'private', properties: { enable_prejoin_ui: false, start_audio_off: true, start_video_off: true, exp: Math.floor(Date.now()/1000)+28800 } }) }
}
export async function mintToken(session: Awaited<ReturnType<typeof classSession>>, name: string, wantsSpeaker = false) {
  roomName(name)
  const owner = session.access.role === 'admin'
  let speaker = false
  let exp = Math.floor(Date.now()/1000) + 60 * 60 * 4
  if (!owner) {
    const live = await activeLive()
    if (!live?.is_live || roomFromUrl(live.meeting_url) !== name) throw new ClassError(403, 'Dette rommet er ikke åpent for elever.')
    if (wantsSpeaker) {
      const { data, error } = await classAdmin().from('live_speakers').select('expires_at').eq('room_name', name).eq('user_id', session.user.id).maybeSingle()
      if (error) throw new ClassError(503, 'Kunne ikke kontrollere taletilgangen.')
      if (!data || Date.parse(data.expires_at) <= Date.now()) throw new ClassError(403, 'Vent til administrator gir deg ordet.')
      exp = Math.min(exp, Math.floor(Date.parse(data.expires_at)/1000)); speaker = true
    }
  }
  const properties = {
    room_name: name, user_id: session.user.id,
    user_name: String(session.user.user_metadata?.full_name || 'Student').slice(0,120),
    is_owner: owner, exp, eject_at_token_exp: true,
    start_video_off: true, start_audio_off: !owner && !speaker,
    ...(!owner ? { permissions: { canSend: speaker ? ['audio','video'] : [], canAdmin: [] } } : {}),
  }
  return (await daily('meeting-tokens', { properties })).token as string
}
