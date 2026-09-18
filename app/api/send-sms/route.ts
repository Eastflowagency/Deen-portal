import twilio from 'twilio'
import { adminSession, classFailure, jsonBody, ClassError } from '@/lib/class-server'
export async function POST(request: Request) {
  try {
    await adminSession()
    const body = await jsonBody(request) as { to?: unknown; message?: unknown } | null
    const raw: unknown[] = Array.isArray(body?.to) ? body.to : [body?.to]
    if (!raw.length || raw.length > 100 || raw.some(n => typeof n !== 'string') || typeof body?.message !== 'string' || !body.message.trim() || body.message.length > 1600) throw new ClassError(400, 'Skriv melding og 1-100 gyldige telefonnumre.')
    const recipients = [...new Set((raw as string[]).map(n => {
      const value = n.replace(/[\s\-().]/g, '')
      if (value.startsWith('00')) return '+' + value.slice(2)
      if (/^47\d{8}$/.test(value)) return '+' + value
      return value
    }))]
    if (recipients.some(n => !/^\+[1-9]\d{7,14}$/.test(n))) throw new ClassError(400, 'Bruk telefonnummer med landskode, for eksempel +47.')
    const sid = process.env.TWILIO_ACCOUNT_SID, token = process.env.TWILIO_AUTH_TOKEN
    const from = process.env.TWILIO_SENDER_ID || process.env.TWILIO_FROM_NUMBER
    if (!sid || !token || !from) throw new ClassError(503, 'SMS er ikke konfigurert.')
    const client = twilio(sid, token)
    const results = await Promise.allSettled(recipients.map(to => client.messages.create({ body: body.message as string, from, to })))
    const sent = results.filter(r => r.status === 'fulfilled').length
    return Response.json({ sent, failed: results.length - sent, errors: results.filter(r => r.status === 'rejected').map(() => 'SMS kunne ikke leveres. Kontroller nummeret og Twilio-status.') }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) { return classFailure(e) }
}
