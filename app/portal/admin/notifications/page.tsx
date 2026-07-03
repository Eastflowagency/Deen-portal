'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface Notification {
  id: string
  title: string
  message: string
  created_at: string
  is_active: boolean
}

function BellIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )
}

function SmsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  )
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('no-NO', { day: 'numeric', month: 'short', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })
}

export default function AdminNotificationsPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [adminEmail, setAdminEmail] = useState('')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState<'varsel' | 'sms'>('varsel')

  // Varsel state
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  // SMS state
  const [smsTo, setSmsTo] = useState('')
  const [smsMsg, setSmsMsg] = useState('')
  const [smsSending, setSmsSending] = useState(false)
  const [smsStatus, setSmsStatus] = useState('')

  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/portal/admin/login'); return }
      setAdminEmail(session.user.email ?? '')
      await load()
      setChecking(false)
    })
  }, [router])

  async function load() {
    const supabase = createClient()
    const { data } = await supabase
      .from('notifications')
      .select('id, title, message, created_at, is_active')
      .order('created_at', { ascending: false })
    if (data) setNotifications(data)
  }

  async function publish() {
    if (!title.trim() || !message.trim()) return
    setSaving(true); setStatusMsg('')
    const supabase = createClient()
    const { error } = await supabase.from('notifications').insert({ title: title.trim(), message: message.trim(), is_active: true })
    setSaving(false)
    if (!error) {
      setTitle(''); setMessage('')
      setStatusMsg('published')
      await load()
      setTimeout(() => setStatusMsg(''), 3000)
    } else {
      setStatusMsg('error:' + error.message)
    }
  }

  async function toggleActive(id: string, current: boolean) {
    const supabase = createClient()
    await supabase.from('notifications').update({ is_active: !current }).eq('id', id)
    await load()
  }

  async function remove(id: string) {
    setDeletingId(id)
    const supabase = createClient()
    await supabase.from('notifications').delete().eq('id', id)
    await load()
    setDeletingId(null)
  }

  async function sendSms() {
    if (!smsTo.trim() || !smsMsg.trim()) return
    setSmsSending(true); setSmsStatus('')
    const numbers = smsTo.split(',').map(n => n.trim()).filter(Boolean)
    const res = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-email': adminEmail },
      body: JSON.stringify({ to: numbers, message: smsMsg.trim() }),
    })
    const data = await res.json()
    setSmsSending(false)
    if (res.ok) {
      const errDetail = data.errors?.length ? ` — ${data.errors[0]}` : ''
      setSmsStatus(`sent:${data.sent}:${data.failed}${errDetail}`)
      if (data.sent > 0) { setSmsTo(''); setSmsMsg('') }
    } else {
      setSmsStatus('error:' + (data.error ?? 'Ukjent feil'))
    }
    setTimeout(() => setSmsStatus(''), 5000)
  }

  if (checking) return null

  const isVarselReady = title.trim() && message.trim()
  const isSmsReady = smsTo.trim() && smsMsg.trim()

  function parseSmsStatus() {
    if (!smsStatus) return null
    if (smsStatus.startsWith('error:')) return { ok: false, text: 'Feil: ' + smsStatus.slice(6) }
    if (smsStatus.startsWith('sent:')) {
      const [, sent, failed, ...rest] = smsStatus.split(':')
      const sentN = Number(sent), failedN = Number(failed)
      const extra = rest.join(':')
      return { ok: true, text: `Sendt til ${sentN} nummer${sentN !== 1 ? 'e' : ''}${failedN > 0 ? ` (${failedN} feilet${extra})` : ''}` }
    }
    return null
  }
  const parsedSms = parseSmsStatus()

  return (
    <>
      <div className="global-fixed-bg" />
      <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1, color: '#e2e8f0', fontFamily: 'var(--font-montserrat)' }}>

        {/* Header */}
        <header style={{
          height: '62px',
          position: 'relative',
          display: 'flex', alignItems: 'center',
          padding: '0 28px',
        }}>
          <Link
            href="/portal/admin"
            style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-montserrat)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'}
          >
            <BackIcon /> Admin
          </Link>
          <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-montserrat)', fontSize: '0.62rem', letterSpacing: '0.32em', color: 'rgba(201,168,76,0.5)', textTransform: 'uppercase' }}>
            Varsler
          </span>
        </header>

        <main style={{ maxWidth: '660px', margin: '0 auto', padding: '32px 20px 64px' }}>

          {/* Tab switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(10,16,32,0.6)',
            border: '1px solid rgba(201,168,76,0.1)',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '20px',
          }}>
            {(['varsel', 'sms'] as const).map(tab => {
              const active = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                    padding: '9px 0', borderRadius: '7px', border: 'none', cursor: 'pointer',
                    background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
                    color: active ? '#C9A84C' : 'rgba(255,255,255,0.28)',
                    fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem',
                    letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600,
                    transition: 'all 0.18s',
                  }}
                >
                  {tab === 'varsel' ? <BellIcon /> : <SmsIcon />}
                  {tab === 'varsel' ? 'Nytt varsel' : 'Send SMS'}
                </button>
              )
            })}
          </div>

          {/* Compose: Varsel */}
          {activeTab === 'varsel' && (
            <div style={{
              background: 'rgba(10,16,32,0.55)',
              border: '1px solid rgba(201,168,76,0.12)',
              borderRadius: '12px', padding: '22px',
            }}>
              <Field
                label="Tittel"
                value={title}
                onChange={setTitle}
                placeholder="Emne for varselet…"
                accent="#C9A84C"
                bold
              />
              <Field
                label="Melding"
                value={message}
                onChange={setMessage}
                placeholder="Skriv meldingen som studentene skal se…"
                accent="#C9A84C"
                textarea
                style={{ marginTop: '10px' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
                <StatusBadge msg={statusMsg} />
                <GoldButton
                  onClick={publish}
                  disabled={saving || !isVarselReady}
                  loading={saving}
                  label="Publiser"
                  loadingLabel="Publiserer…"
                />
              </div>
            </div>
          )}

          {/* Compose: SMS */}
          {activeTab === 'sms' && (
            <div style={{
              background: 'rgba(10,16,32,0.55)',
              border: '1px solid rgba(56,189,248,0.12)',
              borderRadius: '12px', padding: '22px',
            }}>
              <Field
                label="Mottaker(e)"
                value={smsTo}
                onChange={setSmsTo}
                placeholder="+47 xxx xx xxx  ·  kommaseparer for flere"
                accent="rgb(56,189,248)"
              />
              <Field
                label="Melding"
                value={smsMsg}
                onChange={setSmsMsg}
                placeholder="Skriv SMS-melding…"
                accent="rgb(56,189,248)"
                textarea
                maxLength={160}
                style={{ marginTop: '10px' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.58rem', color: smsMsg.length > 140 ? '#f59e0b' : 'rgba(255,255,255,0.2)', fontVariantNumeric: 'tabular-nums' }}>
                    {smsMsg.length}/160
                  </span>
                  {parsedSms && (
                    <span style={{ fontSize: '0.68rem', color: parsedSms.ok ? 'rgba(74,197,120,0.85)' : '#ef4444' }}>
                      {parsedSms.text}
                    </span>
                  )}
                </div>
                <BlueButton
                  onClick={sendSms}
                  disabled={smsSending || !isSmsReady}
                  loading={smsSending}
                  label="Send SMS"
                  loadingLabel="Sender…"
                />
              </div>
            </div>
          )}

          {/* Notification list */}
          <section style={{ marginTop: '32px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '12px',
            }}>
              <span style={{ fontSize: '0.57rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
                Publiserte varsler
              </span>
              {notifications.length > 0 && (
                <span style={{ fontSize: '0.57rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em' }}>
                  {notifications.length}
                </span>
              )}
            </div>

            {notifications.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '52px 0',
                color: 'rgba(255,255,255,0.1)', fontSize: '0.78rem', letterSpacing: '0.04em',
              }}>
                Ingen varsler ennå
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {notifications.map(n => (
                  <NotifRow
                    key={n.id}
                    n={n}
                    deleting={deletingId === n.id}
                    onToggle={() => toggleActive(n.id, n.is_active)}
                    onDelete={() => remove(n.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  )
}

/* ── Sub-components ─────────────────────────────────── */

function Field({
  label, value, onChange, placeholder, accent, bold, textarea, maxLength, style: extraStyle,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  accent: string
  bold?: boolean
  textarea?: boolean
  maxLength?: number
  style?: React.CSSProperties
}) {
  const [focused, setFocused] = useState(false)
  const base: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(6,11,20,0.6)',
    border: `1px solid ${focused ? accent + '55' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: '8px', padding: textarea ? '11px 13px' : '10px 13px',
    color: '#e2e8f0', fontFamily: 'var(--font-montserrat)',
    fontSize: '0.83rem', outline: 'none', lineHeight: 1.6,
    fontWeight: bold ? 600 : 400,
    transition: 'border-color 0.15s',
    resize: textarea ? 'vertical' : undefined,
  }

  return (
    <div style={extraStyle}>
      <label style={{
        display: 'block', fontSize: '0.55rem', letterSpacing: '0.18em',
        color: focused ? accent : 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase', marginBottom: '6px',
        transition: 'color 0.15s',
      }}>
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          maxLength={maxLength}
          style={base}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={base}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      )}
    </div>
  )
}

function StatusBadge({ msg }: { msg: string }) {
  if (!msg) return <span />
  const ok = msg === 'published'
  const text = ok ? 'Varsel publisert' : msg.startsWith('error:') ? msg.slice(6) : msg
  return (
    <span style={{ fontSize: '0.68rem', color: ok ? 'rgba(74,197,120,0.85)' : '#ef4444' }}>{text}</span>
  )
}

function GoldButton({ onClick, disabled, loading, label, loadingLabel }: {
  onClick: () => void; disabled: boolean; loading: boolean; label: string; loadingLabel: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '9px 22px', borderRadius: '7px', border: 'none',
        background: disabled ? 'rgba(201,168,76,0.15)' : '#C9A84C',
        color: disabled ? 'rgba(255,255,255,0.2)' : '#0F1829',
        fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem',
        letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.18s',
      }}
      onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLElement).style.background = '#d4b15a' }}
      onMouseLeave={e => { if (!disabled) (e.currentTarget as HTMLElement).style.background = '#C9A84C' }}
    >
      {loading ? loadingLabel : label}
    </button>
  )
}

function BlueButton({ onClick, disabled, loading, label, loadingLabel }: {
  onClick: () => void; disabled: boolean; loading: boolean; label: string; loadingLabel: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '9px 22px', borderRadius: '7px', border: 'none',
        background: disabled ? 'rgba(56,189,248,0.08)' : 'rgb(56,189,248)',
        color: disabled ? 'rgba(255,255,255,0.2)' : '#0a0e1a',
        fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem',
        letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.18s',
      }}
      onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLElement).style.background = 'rgb(100,210,255)' }}
      onMouseLeave={e => { if (!disabled) (e.currentTarget as HTMLElement).style.background = 'rgb(56,189,248)' }}
    >
      {loading ? loadingLabel : label}
    </button>
  )
}

function NotifRow({ n, deleting, onToggle, onDelete }: {
  n: Notification; deleting: boolean; onToggle: () => void; onDelete: () => void
}) {
  const [hoverDel, setHoverDel] = useState(false)
  return (
    <div style={{
      background: 'rgba(10,16,32,0.5)',
      border: `1px solid ${n.is_active ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.04)'}`,
      borderRadius: '10px', padding: '13px 14px',
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      opacity: n.is_active ? 1 : 0.4,
      transition: 'opacity 0.2s, border-color 0.2s',
    }}>
      {/* Status dot */}
      <div style={{
        width: '7px', height: '7px', borderRadius: '50%', marginTop: '5px', flexShrink: 0,
        background: n.is_active ? '#C9A84C' : 'rgba(255,255,255,0.15)',
        boxShadow: n.is_active ? '0 0 6px rgba(201,168,76,0.5)' : 'none',
        transition: 'all 0.2s',
      }} />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: '0 0 3px', fontSize: '0.78rem', fontWeight: 700,
          color: n.is_active ? '#e2e8f0' : '#475569', lineHeight: 1.4,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {n.title}
        </p>
        <p style={{
          margin: '0 0 7px', fontSize: '0.78rem',
          color: n.is_active ? 'rgba(226,232,240,0.65)' : '#334155',
          lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {n.message}
        </p>
        <span style={{ fontSize: '0.57rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.04em' }}>
          {formatDate(n.created_at)}
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, paddingTop: '1px' }}>
        {/* Toggle pill */}
        <button
          onClick={onToggle}
          title={n.is_active ? 'Skjul for studenter' : 'Vis for studenter'}
          style={{
            padding: '5px 11px', borderRadius: '20px', border: 'none', cursor: 'pointer',
            background: n.is_active ? 'rgba(74,197,120,0.12)' : 'rgba(255,255,255,0.05)',
            color: n.is_active ? 'rgba(74,197,120,0.8)' : 'rgba(255,255,255,0.25)',
            fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem',
            letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600,
            transition: 'all 0.15s',
          }}
        >
          {n.is_active ? 'Aktiv' : 'Skjult'}
        </button>

        {/* Delete */}
        <button
          onClick={onDelete}
          disabled={deleting}
          title="Slett varsel"
          onMouseEnter={() => setHoverDel(true)}
          onMouseLeave={() => setHoverDel(false)}
          style={{
            width: '28px', height: '28px', borderRadius: '7px', border: 'none',
            background: hoverDel ? 'rgba(239,68,68,0.18)' : 'rgba(239,68,68,0.07)',
            color: hoverDel ? '#ef4444' : 'rgba(239,68,68,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: deleting ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}
