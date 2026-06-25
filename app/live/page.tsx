'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LiveVideo from '@/app/components/live/LiveVideo'
import LiveChat from '@/app/components/live/LiveChat'
import LivePageHeader from '@/app/components/live/LivePageHeader'
import SessionInfo, { LiveSession } from '@/app/components/live/SessionInfo'
import RaiseHandButton from '@/app/components/live/RaiseHandButton'

// Generate a stable anonymous display name for this browser session
function getAnonName(): string {
  if (typeof window === 'undefined') return 'Elev'
  const key = 'alrawdah_guest_name'
  const stored = sessionStorage.getItem(key)
  if (stored) return stored
  const names = ['Elev', 'Student', 'Deltaker']
  const random = `${names[Math.floor(Math.random() * names.length)]}${Math.floor(Math.random() * 900) + 100}`
  sessionStorage.setItem(key, random)
  return random
}

export default function PublicLivePage() {
  const [meetingUrl, setMeetingUrl] = useState('')
  const [isLive, setIsLive] = useState(false)
  const [session, setSession] = useState<LiveSession | null>(null)
  const [viewerCount, setViewerCount] = useState(0)
  const [guestName] = useState<string>(() => {
    if (typeof window === 'undefined') return 'Elev'
    return getAnonName()
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Poll live status every 15s
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/live-status', { cache: 'no-store' })
        const data = await res.json()
        setIsLive(!!data.isLive)
        setMeetingUrl(data.meetingUrl ?? '')
        if (data.isLive && data.title) {
          setSession({
            title: data.title,
            teacher: data.teacher,
            subject: data.subject,
            level: '',
            startTime: '',
            date: new Date().toLocaleDateString('no-NO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
            description: '',
            isLive: true,
          })
        } else {
          setSession(null)
        }
      } catch { /* ignore */ }
    }
    checkStatus()
    const id = setInterval(checkStatus, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#060b14', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header style={{
        height: '62px',
        background: 'rgba(6,11,20,0.96)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201,168,76,0.08)',
        display: 'flex', alignItems: 'center', padding: '0 20px', gap: '16px',
        position: 'sticky', top: 0, zIndex: 50, flexShrink: 0,
      }}>
        <Link href="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <Image src="/logo-cropped.png" alt="Al Rawdah" width={640} height={230}
            style={{ height: '40px', width: 'auto', objectFit: 'contain' }} priority />
        </Link>

        <div style={{ flex: 1 }} />

        {/* Live indicator */}
        {isLive && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.28)',
            borderRadius: '20px', padding: '5px 12px',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', animation: 'livePulse 1.4s infinite' }} />
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', letterSpacing: '0.14em', color: '#ef4444', textTransform: 'uppercase' }}>
              Direkteklasse
            </span>
          </div>
        )}

        {/* Viewer count from presence */}
        {viewerCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.5)" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'rgba(201,168,76,0.6)' }}>
              {viewerCount}
            </span>
          </div>
        )}
      </header>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: 'clamp(20px, 3vw, 32px) clamp(16px, 3vw, 32px)', minWidth: 0 }}>

        <div style={{ marginBottom: '20px' }}>
          <LivePageHeader isLive={isLive} subject={session?.subject ?? ''} />
        </div>

        {!isLive ? (
          /* ── No active class ────────────────────────────────────────────── */
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '60vh', gap: 20, textAlign: 'center',
          }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.25)" strokeWidth="1.2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <h2 style={{ fontFamily: 'var(--font-montserrat)', fontSize: 'clamp(1rem,2.5vw,1.4rem)', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>
              Ingen aktiv klasse
            </h2>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.82rem', color: '#334155', margin: 0, maxWidth: 360, lineHeight: 1.6 }}>
              Siden oppdateres automatisk når læreren starter direkteklassen.
            </p>
          </div>
        ) : (
          <div className="live-layout" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

            {/* LEFT: video (full-screen teacher, student tiles hidden) */}
            <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mounted && (
                <LiveVideo
                  meetingUrl={meetingUrl}
                  isLive={isLive}
                  viewerCount={viewerCount}
                  displayName={guestName}
                  role="student"
                />
              )}

              {/* Raise hand */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <RaiseHandButton />
                <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: '#1e2d42', letterSpacing: '0.1em' }}>
                  Rek opp hånden for å stille spørsmål
                </span>
              </div>

              {session && <SessionInfo session={session} />}
            </div>

            {/* RIGHT: chat — Supabase Realtime, anonymous */}
            <div className="live-chat-col" style={{ flexShrink: 0, width: '380px', minHeight: '620px', display: 'flex', flexDirection: 'column' }}>
              <LiveChat
                channelName="live-class"
                userName={guestName}
                isTeacher={false}
                onParticipantCountChange={setViewerCount}
              />
            </div>
          </div>
        )}
      </main>

      <style>{`
        @media (max-width: 920px) {
          .live-layout { flex-direction: column !important; }
          .live-chat-col { width: 100% !important; min-height: 420px !important; }
        }
      `}</style>
    </div>
  )
}
