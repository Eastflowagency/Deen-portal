'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface Notification {
  id: string
  message: string
  created_at: string
  is_active: boolean
}

export default function AdminNotificationsPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/admin/login'); return }
      await load()
      setChecking(false)
    })
  }, [router])

  async function load() {
    const supabase = createClient()
    const { data } = await supabase
      .from('notifications')
      .select('id, message, created_at, is_active')
      .order('created_at', { ascending: false })
    if (data) setNotifications(data)
  }

  async function publish() {
    if (!message.trim()) return
    setSaving(true); setStatusMsg('')
    const supabase = createClient()
    const { error } = await supabase.from('notifications').insert({ message: message.trim(), is_active: true })
    setSaving(false)
    if (!error) {
      setMessage('')
      setStatusMsg('✓ Varsel publisert!')
      await load()
      setTimeout(() => setStatusMsg(''), 3000)
    } else {
      setStatusMsg(`Feil: ${error.message}`)
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

  if (checking) return null

  return (
    <div style={{ minHeight: '100vh', background: '#060b14', color: '#e2e8f0', fontFamily: 'var(--font-montserrat)' }}>

      {/* Header */}
      <header style={{
        height: '56px', background: 'rgba(6,11,20,0.96)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        display: 'flex', alignItems: 'center', padding: '0 28px', gap: '20px',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/admin/live" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', letterSpacing: '0.12em', transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Admin Live
        </Link>
        <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#C9A84C', textTransform: 'uppercase' }}>Varsler</span>
      </header>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '36px 24px' }}>

        {/* Compose */}
        <div style={{
          background: 'rgba(10,16,32,0.7)', border: '1px solid rgba(201,168,76,0.14)',
          borderRadius: '12px', padding: '24px',
        }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: '#C9A84C', marginBottom: '14px', textTransform: 'uppercase' }}>Nytt varsel</div>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Skriv meldingen som studentene skal se…"
            rows={3}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(6,11,20,0.7)', border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: '8px', padding: '12px 14px',
              color: '#e2e8f0', fontFamily: 'var(--font-montserrat)', fontSize: '0.84rem',
              resize: 'vertical', outline: 'none', lineHeight: 1.6,
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
            {statusMsg ? (
              <span style={{ fontSize: '0.72rem', color: statusMsg.startsWith('✓') ? 'rgba(74,197,120,0.85)' : '#ef4444' }}>{statusMsg}</span>
            ) : <span />}
            <button
              onClick={publish}
              disabled={saving || !message.trim()}
              style={{
                padding: '10px 24px', borderRadius: '8px',
                background: saving || !message.trim() ? 'rgba(201,168,76,0.2)' : '#C9A84C',
                border: 'none', color: saving || !message.trim() ? '#475569' : '#0F1829',
                fontFamily: 'var(--font-montserrat)', fontSize: '0.62rem',
                letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase',
                cursor: saving || !message.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {saving ? 'Publiserer…' : 'Publiser'}
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ marginTop: '28px' }}>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '12px' }}>
            Publiserte varsler ({notifications.length})
          </div>

          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', fontSize: '0.78rem', color: '#1e2d42' }}>Ingen varsler ennå</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {notifications.map(n => (
                <div key={n.id} style={{
                  background: 'rgba(10,16,32,0.6)', border: `1px solid ${n.is_active ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '10px', padding: '14px 16px',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  opacity: n.is_active ? 1 : 0.45,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 6px', fontSize: '0.82rem', color: n.is_active ? '#e2e8f0' : '#475569', lineHeight: 1.5 }}>{n.message}</p>
                    <span style={{ fontSize: '0.6rem', color: '#1e2d42' }}>
                      {new Date(n.created_at).toLocaleDateString('no-NO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    {/* Toggle active */}
                    <button
                      onClick={() => toggleActive(n.id, n.is_active)}
                      title={n.is_active ? 'Skjul' : 'Vis'}
                      style={{
                        padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                        background: n.is_active ? 'rgba(74,197,120,0.1)' : 'rgba(255,255,255,0.04)',
                        color: n.is_active ? 'rgba(74,197,120,0.7)' : '#334155',
                        fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', letterSpacing: '0.1em',
                        transition: 'all 0.15s',
                      }}
                    >
                      {n.is_active ? 'Aktiv' : 'Skjult'}
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => remove(n.id)}
                      disabled={deletingId === n.id}
                      title="Slett"
                      style={{
                        width: '28px', height: '28px', borderRadius: '6px', border: 'none',
                        background: 'rgba(239,68,68,0.08)', color: 'rgba(239,68,68,0.55)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; e.currentTarget.style.color = '#ef4444' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = 'rgba(239,68,68,0.55)' }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
