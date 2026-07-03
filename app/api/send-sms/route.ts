import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '').split(',').map(e => e.trim())

export async function POST(req: NextRequest) {
  // Verify admin via Supabase session header
  const authHeader = req.headers.get('x-admin-email') ?? ''
  if (!ADMIN_EMAILS.includes(authHeader)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { to, message } = await req.json()

  if (!to || !message) {
    return NextResponse.json({ error: 'Missing to or message' }, { status: 400 })
  }

  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  // Use alphanumeric sender ID if set, otherwise fall back to the phone number
  const from = process.env.TWILIO_SENDER_ID || process.env.TWILIO_FROM_NUMBER

  if (!sid || !token || !from) {
    return NextResponse.json({ error: 'Twilio not configured' }, { status: 500 })
  }

  const client = twilio(sid, token)

  // to can be a single number string or array of numbers
  const rawRecipients: string[] = Array.isArray(to) ? to : [to]

  // Normalize Norwegian numbers: 47XXXXXXXX → +47XXXXXXXX, 0047... → +47...
  function normalizeNumber(n: string): string {
    const digits = n.replace(/[\s\-().]/g, '')
    if (digits.startsWith('+')) return digits
    if (digits.startsWith('0047')) return '+47' + digits.slice(4)
    if (digits.startsWith('47') && digits.length === 10) return '+' + digits
    return digits
  }

  const recipients = rawRecipients.map(normalizeNumber)

  const results = await Promise.allSettled(
    recipients.map(number =>
      client.messages.create({ body: message, from, to: number })
    )
  )

  const sent = results.filter(r => r.status === 'fulfilled').length
  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map(r => (r.reason as { message?: string })?.message ?? String(r.reason))

  return NextResponse.json({ sent, failed: errors.length, errors })
}
