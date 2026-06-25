'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import LiveChat from '@/app/components/live/LiveChat'
import { createClient } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

// ── Types ─────────────────────────────────────────────────────────────────────

interface SessionForm {
  title: string
  description: string
  teacher: string
  subject: string
  date: string
  time: string
  meetingUrl: string
  isLive: boolean
}

interface RaisedHand {
  id: number
  student: string
  raisedAt: string
}


const SUBJECTS = ['Koranvitenskaper', 'Aqidah', 'Fiqh', 'Seerah', 'Hadith', 'Adab al-Talib', 'Arabisk']

// ── Admin UI ──────────────────────────────────────────────────────────────────

export default function AdminLivePage() {
  const [form, setForm] = useState<SessionForm>({
    title:       'Aqidah — Lektion 7: Tawhid al-Asma wa al-Sifat',
    description: 'Studiet av de guddommelige attributtene slik de er beskrevet i Koranen og Sunnah.',
    teacher:     'Sheikh Abdullah',
    subject:     'Aqidah',
    date:        '2026-06-22',
    time:        '19:00',
    meetingUrl:  '',
    isLive:      false,
  })
  const [hands, setHands] = useState<RaisedHand[]>([])
  const [saved, setSaved] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [liveError, setLiveError] = useState('')
  const [generatingUrl, setGeneratingUrl] = useState(false)
  const [urlError, setUrlError] = useState('')
  const channelRef = useRef<RealtimeChannel | null>(null)

  // Subscribe to real-time raisehand events
  useEffect(() => {
    const supabase = createClient()
    const ch = supabase.channel('live-class-hands', {
      config: { broadcast: { self: false } },
    })
    ch.on('broadcast', { event: 'raisehand' }, ({ payload }) => {
      setHands(prev => {
        // Ignore if same student already has hand raised
        if (prev.some(h => h.student === payload.student)) return prev
        return [...prev, { id: payload.id, student: payload.student, raisedAt: payload.raisedAt }]
      })
    }).subscribe()
    channelRef.current = ch
    return () => { supabase.removeChannel(ch) }
  }, [])

  // Load existing live state into form on mount
  useEffect(() => {
    fetch('/api/live-status', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (data.meetingUrl || data.isLive) {
          setForm(prev => ({
            ...prev,
            title:      data.title      || prev.title,
            teacher:    data.teacher    || prev.teacher,
            subject:    data.subject    || prev.subject,
            meetingUrl: data.meetingUrl || prev.meetingUrl,
            isLive:     !!data.isLive,
          }))
        }
      })
      .catch(() => {})
  }, [])

  function handleField(key: keyof SessionForm, value: string | boolean) {
    setForm(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  async function handleSave() {
    setSaved(true)
    // Push current form (not toggling live) to API so students see updated info
    await fetch('/api/live-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form }),
    })
    setTimeout(() => setSaved(false), 2500)
  }

  const toggleLive = useCallback(async () => {
    setPublishing(true)
    setLiveError('')
    const next = !form.isLive
    const res = await fetch('/api/live-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, isLive: next }),
    })
    if (res.ok) {
      setForm(prev => ({ ...prev, isLive: next }))
    } else {
      const data = await res.json().catch(() => ({}))
      setLiveError(data.error ?? `Feil ${res.status}`)
    }
    setPublishing(false)
  }, [form])

  async function generateDailyUrl() {
    setGeneratingUrl(true)
    setUrlError('')
    try {
      const d = form.date ? new Date(form.date) : new Date()
      const day   = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year  = d.getFullYear()
      const subject = (form.subject || 'Klasse').replace(/\s+/g, '')
      const roomName = `AlRawdah-${subject}-${day}-${month}-${year}`
      const res = await fetch('/api/create-daily-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: roomName }),
      })
      const data = await res.json()
      if (data.url) {
        handleField('meetingUrl', data.url)
      } else {
        setUrlError(data.error ?? 'Kunne ikke opprette Daily.co-rom')
      }
    } catch {
      setUrlError('Nettverksfeil — prøv igjen')
    }
    setGeneratingUrl(false)
  }

  function dismissHand(id: number) {
    setHands(prev => prev.filter(h => h.id !== id))
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    background: 'rgba(6,11,20,0.7)',
    border: '1px solid rgba(201,168,76,0.14)',
    borderRadius: 8,
    padding: '11px 14px',
    color: '#f1f5f9',
    fontFamily: 'var(--font-montserrat)',
    fontSize: '0.88rem',
    fontWeight: 400,
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-montserrat)',
    fontSize: '0.58rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: '#334155',
    display: 'block',
    marginBottom: 7,
  }

  // ── Shared sub-components ─────────────────────────────────────────────────

  const handsPanel = (compact = false) => (
    <div style={{
      background: 'rgba(10,16,32,0.75)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(201,168,76,0.12)',
      borderRadius: 12,
      padding: compact ? '14px 16px' : '24px',
      display: 'flex', flexDirection: 'column', gap: compact ? '10px' : '16px',
      height: '100%',
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <h2 style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', letterSpacing: '0.22em', color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', margin: 0 }}>
          Hevede hender
        </h2>
        <span style={{
          fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700,
          background: hands.length > 0 ? 'rgba(220,38,38,0.12)' : 'rgba(255,255,255,0.04)',
          color: hands.length > 0 ? '#ef4444' : '#334155',
          border: hands.length > 0 ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(255,255,255,0.06)',
          borderRadius: 20, padding: '2px 9px',
        }}>
          {hands.length}
        </span>
      </div>
      <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
        {hands.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.78rem', color: '#1e2d42', textAlign: 'center', padding: compact ? '8px 0' : '20px 0', margin: 0 }}>
            Ingen hevede hender
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {hands.map((hand) => (
              <div key={hand.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 8, padding: compact ? '8px 10px' : '10px 12px',
              }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.82rem', color: '#e2e8f0', margin: 0, fontWeight: 600 }}>
                    {hand.student}
                  </p>
                  <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', color: '#334155', margin: '2px 0 0' }}>
                    {hand.raisedAt}
                  </p>
                </div>
                <button
                  onClick={() => dismissHand(hand.id)}
                  className="btn-press"
                  title="Bekreft / avvis"
                  style={{
                    width: 26, height: 26, borderRadius: 6,
                    background: 'rgba(74,197,120,0.08)',
                    border: '1px solid rgba(74,197,120,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(74,197,120,0.7)', cursor: 'pointer', fontSize: '0.75rem',
                  }}
                >
                  ✓
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#060b14', color: '#f1f5f9', overflow: 'hidden' }}>

      {/* ── Admin header ───────────────────────────────────────────────────── */}
      <header style={{
        height: '52px',
        background: 'rgba(6,11,20,0.97)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', flexShrink: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', letterSpacing: '0.24em', color: 'rgba(201,168,76,0.5)', textTransform: 'uppercase' }}>
            Al Rawdah — Admin
          </span>
          <span style={{ color: 'rgba(201,168,76,0.15)' }}>/</span>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', letterSpacing: '0.18em', color: '#C9A84C', textTransform: 'uppercase' }}>
            Live-klasse
          </span>
          {form.isLive && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.28)', borderRadius: 20, padding: '3px 10px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'livePulse 1.4s infinite' }} />
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.52rem', letterSpacing: '0.18em', color: '#ef4444', fontWeight: 700 }}>LIVE</span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Go Live / End */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <button
              onClick={toggleLive}
              disabled={publishing}
              className="btn-press"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 20px',
                background: form.isLive ? 'rgba(220,38,38,0.12)' : 'rgba(74,197,120,0.1)',
                border: form.isLive ? '1px solid rgba(220,38,38,0.4)' : '1px solid rgba(74,197,120,0.35)',
                borderRadius: 7,
                color: form.isLive ? '#ef4444' : 'rgba(74,197,120,0.9)',
                fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem',
                letterSpacing: '0.14em', fontWeight: 700, textTransform: 'uppercase',
                cursor: publishing ? 'wait' : 'pointer',
                opacity: publishing ? 0.7 : 1,
                transition: 'all 0.22s cubic-bezier(0.23,1,0.32,1)',
              }}
            >
              {publishing ? <span>…</span> : form.isLive ? (
                <><div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', animation: 'livePulse 1.4s infinite' }} />Avslutt sending</>
              ) : (
                <><div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(74,197,120,0.85)' }} />Gå LIVE</>
              )}
            </button>
            {liveError && (
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', color: '#ef4444' }}>{liveError}</span>
            )}
          </div>
          <Link href="/admin/notifications" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', letterSpacing: '0.14em', color: '#334155', textTransform: 'uppercase', transition: 'color 0.18s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#94a3b8' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#334155' }}
            >
              Varsler
            </span>
          </Link>
          <Link href="/student" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', letterSpacing: '0.14em', color: '#334155', textTransform: 'uppercase', transition: 'color 0.18s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#94a3b8' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#334155' }}
            >
              ← Portal
            </span>
          </Link>
        </div>
      </header>

      {/* ── LIVE monitoring layout ─────────────────────────────────────────── */}
      {form.isLive && form.meetingUrl ? (

        <div style={{ flex: 1, display: 'flex', gap: '12px', padding: '12px', minHeight: 0, overflow: 'hidden' }}>

          {/* LEFT: Daily.co video — fills all available height */}
          <div style={{ flex: '0 0 78%', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0, minHeight: 0 }}>
            <div style={{
              flex: 1, position: 'relative', background: '#000611',
              borderRadius: '12px', overflow: 'hidden',
              border: '1px solid rgba(201,168,76,0.18)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
              minHeight: 0,
            }}>
              <iframe
                src={form.meetingUrl}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                allow="camera; microphone; display-capture; fullscreen; autoplay"
                allowFullScreen
                title="Live klasse"
              />
            </div>

            {/* Compact session info below the video */}
            <div style={{
              flexShrink: 0, padding: '10px 16px',
              background: 'rgba(10,16,32,0.8)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(201,168,76,0.1)', borderRadius: '8px',
              display: 'flex', alignItems: 'center', gap: '16px',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', letterSpacing: '0.14em', color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase', marginBottom: 3 }}>
                  {form.subject} · {form.teacher}
                </div>
                <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.88rem', color: '#e2e8f0', fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {form.title}
                </div>
              </div>
              <a href="/live" target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', letterSpacing: '0.14em', color: '#334155', textTransform: 'uppercase', textDecoration: 'none', flexShrink: 0, transition: 'color 0.18s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#C9A84C' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#334155' }}
              >
                Forhåndsvis →
              </a>
            </div>
          </div>

          {/* RIGHT: Chat (top, fills space) + Hevede hender (bottom, fixed) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0, minHeight: 0, overflow: 'hidden' }}>

            {/* LiveChat — top half */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <LiveChat
                channelName="live-class"
                userName={form.teacher || 'Sheikh'}
                isTeacher={true}
              />
            </div>

            {/* Hevede hender — bottom half, equal share */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              {handsPanel(true)}
            </div>
          </div>
        </div>

      ) : (

        /* ── PRE-LIVE: settings + raised hands + chat ───────────────────── */
        <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(24px, 4vw, 40px) clamp(16px, 3vw, 32px)' }}>

          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', letterSpacing: '0.24em', color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase', margin: '0 0 6px' }}>
              Administrasjon
            </p>
            <h1 style={{ fontFamily: 'var(--font-montserrat)', fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '0.04em' }}>
              Live-klasse
            </h1>
          </div>

          {/* ── 3-column grid ──────────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px 280px', gap: '20px', alignItems: 'start' }}>

            {/* Col 1: Session form */}
            <div style={{
              background: 'rgba(10,16,32,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(201,168,76,0.12)', borderRadius: 12, padding: '28px',
              display: 'flex', flexDirection: 'column', gap: '20px',
            }}>
              <h2 style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.22em', color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', margin: 0 }}>
                Øktinnstillinger
              </h2>

              <div>
                <label style={labelStyle}>Tittel</label>
                <input value={form.title} onChange={(e) => handleField('title', e.target.value)} style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.14)' }} />
              </div>

              <div>
                <label style={labelStyle}>Beskrivelse</label>
                <textarea value={form.description} onChange={(e) => handleField('description', e.target.value)} rows={3}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55 }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.14)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Lærer</label>
                  <input value={form.teacher} onChange={(e) => handleField('teacher', e.target.value)} style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.14)' }} />
                </div>
                <div>
                  <label style={labelStyle}>Fag</label>
                  <select value={form.subject} onChange={(e) => handleField('subject', e.target.value)}
                    style={{ ...inputStyle, cursor: 'pointer' }}>
                    {SUBJECTS.map(s => <option key={s} value={s} style={{ background: '#0F1829' }}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Dato</label>
                  <input type="date" value={form.date} onChange={(e) => handleField('date', e.target.value)}
                    style={{ ...inputStyle, colorScheme: 'dark' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.14)' }} />
                </div>
                <div>
                  <label style={labelStyle}>Klokkeslett</label>
                  <input type="time" value={form.time} onChange={(e) => handleField('time', e.target.value)}
                    style={{ ...inputStyle, colorScheme: 'dark' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.14)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Møtelenke</label>
                  <button type="button" onClick={generateDailyUrl} disabled={generatingUrl}
                    style={{
                      fontFamily: 'var(--font-montserrat)', fontSize: '0.52rem', letterSpacing: '0.12em',
                      textTransform: 'uppercase', color: '#C9A84C', background: 'rgba(201,168,76,0.08)',
                      border: '1px solid rgba(201,168,76,0.2)', borderRadius: 5, padding: '4px 10px',
                      cursor: generatingUrl ? 'wait' : 'pointer', opacity: generatingUrl ? 0.6 : 1, transition: 'background 0.18s',
                    }}
                    onMouseEnter={(e) => { if (!generatingUrl) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.16)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.08)' }}
                  >
                    {generatingUrl ? 'Oppretter…' : '+ Generer ny lenke'}
                  </button>
                </div>
                <input value={form.meetingUrl} onChange={(e) => handleField('meetingUrl', e.target.value)}
                  placeholder="https://alrawdah.daily.co/AlRawdah-Aqidah-20-06-2026" style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.14)' }} />
                <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.62rem', color: '#334155', margin: '6px 0 0', lineHeight: 1.5 }}>
                  Klikk «Generer ny lenke» for å opprette et Daily.co-rom — nytt rom per fag og dato.
                </p>
                {urlError && <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: '#ef4444', margin: '4px 0 0' }}>{urlError}</p>}
              </div>

              <button onClick={handleSave} className="btn-press" style={{
                width: '100%', padding: '13px',
                background: saved ? 'rgba(74,197,120,0.15)' : '#C9A84C',
                border: saved ? '1px solid rgba(74,197,120,0.4)' : 'none',
                borderRadius: 8, color: saved ? 'rgba(74,197,120,0.9)' : '#0F1829',
                fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem',
                letterSpacing: '0.16em', fontWeight: 700, textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.23,1,0.32,1)',
              }}>
                {saved ? '✓ Lagret' : 'Lagre økt'}
              </button>
            </div>

            {/* Col 2: Raised hands */}
            {handsPanel()}

            {/* Col 3: Live chat */}
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '480px' }}>
              <LiveChat channelName="live-class" userName={form.teacher || 'Sheikh'} isTeacher={true} />
            </div>
          </div>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link href="/live" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.18em', color: '#334155', textTransform: 'uppercase', transition: 'color 0.18s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#C9A84C' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#334155' }}
              >
                Forhåndsvis studentvisning →
              </span>
            </Link>
          </div>
        </div>
        </div>
      )}
    </div>
  )
}
