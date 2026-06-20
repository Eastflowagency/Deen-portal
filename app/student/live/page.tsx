'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import LiveVideo from '@/app/components/live/LiveVideo'
import LiveChat from '@/app/components/live/LiveChat'
import RaiseHandButton from '@/app/components/live/RaiseHandButton'
import SessionInfo, { LiveSession } from '@/app/components/live/SessionInfo'
import LivePageHeader from '@/app/components/live/LivePageHeader'

const MOCK_SESSION: LiveSession = {
  title: 'Aqidah — Lektion 7: Tawhid al-Asma wa al-Sifat',
  teacher: 'Sheikh Abdullah',
  subject: 'Aqidah',
  level: 'Nivå 1 — Grunnivå',
  startTime: '19:00',
  date: 'Mandag 22. juni 2026',
  description: 'I denne leksjonen fortsetter vi studiet av de guddommelige attributtene slik de er beskrevet i Koranen og Sunnah, med fokus på sifat dhatiyya og fi\'liyya.',
}

// ── Portal shell ─────────────────────────────────────────────────────────────

function PortalLiveUI({ firstName, onSignOut }: { firstName: string; onSignOut: () => void }) {
  const [meetingUrl, setMeetingUrl] = useState('')
  const [isLive, setIsLive] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = `${window.location.origin}/live`
    if (navigator.share) {
      try { await navigator.share({ title: 'Al Rawdah — Direkteklasse', url }) } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Poll live status every 5s
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/live-status', { cache: 'no-store' })
        const data = await res.json()
        if (data.meetingUrl) setMeetingUrl(data.meetingUrl)
        setIsLive(!!data.isLive)
      } catch { /* ignore */ }
    }
    checkStatus()
    const id = setInterval(checkStatus, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#060b14', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top nav ──────────────────────────────────────────────────────────── */}
      <header style={{
        height: '62px',
        background: 'rgba(6,11,20,0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201,168,76,0.08)',
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: '16px',
        position: 'sticky', top: 0, zIndex: 50, flexShrink: 0,
      }}>
        <Link href="/student" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <Image src="/logo-cropped.png" alt="Al Rawdah" width={640} height={230}
            style={{ height: '40px', width: 'auto', objectFit: 'contain' }} priority />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {['Islamske Vitenskaper', 'Arabic', 'Kalender', 'Timeplan'].map((tab) => (
            <div key={tab} title="Kommer snart" style={{
              padding: '6px 14px', borderRadius: '20px',
              fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem',
              letterSpacing: '0.14em', color: '#1e2d42',
              textTransform: 'uppercase', cursor: 'not-allowed',
              whiteSpace: 'nowrap', userSelect: 'none',
            }}>
              {tab}
            </div>
          ))}
          <div style={{
            padding: '6px 14px',
            background: 'rgba(220,38,38,0.1)',
            border: '1px solid rgba(220,38,38,0.28)',
            borderRadius: '20px',
            fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem',
            letterSpacing: '0.14em', color: '#ef4444',
            textTransform: 'uppercase', whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', animation: 'livePulse 1.4s infinite', flexShrink: 0 }} />
            Live
          </div>
        </div>

        <button onClick={onSignOut} title="Logg ut" style={{
          width: '34px', height: '34px', borderRadius: '50%',
          background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#C9A84C', fontFamily: 'var(--font-montserrat)',
          fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0,
        }}>
          {firstName.charAt(0)}
        </button>
      </header>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: 'clamp(20px, 3vw, 32px) clamp(16px, 3vw, 32px)', minWidth: 0 }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: '20px' }}>
          <LivePageHeader isLive={isLive} subject={MOCK_SESSION.subject} />
        </div>

        {/* ── Two-column layout (flexbox — no auto-placement issues) ────────── */}
        <div className="live-layout" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

          {/* LEFT: video + controls + session info */}
          <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <LiveVideo
              meetingUrl={meetingUrl}
              isLive={isLive}
              viewerCount={viewerCount}
              displayName={firstName}
              role="student"
            />

            {/* Controls bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <RaiseHandButton userName={firstName} />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {/* Share button */}
                <button
                  onClick={handleShare}
                  title="Del lenke til live-klassen"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '0 14px', height: 38, borderRadius: 8,
                    background: copied ? 'rgba(74,197,120,0.12)' : 'rgba(201,168,76,0.08)',
                    border: `1px solid ${copied ? 'rgba(74,197,120,0.3)' : 'rgba(201,168,76,0.2)'}`,
                    color: copied ? 'rgba(74,197,120,0.9)' : '#C9A84C',
                    fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem',
                    letterSpacing: '0.14em', fontWeight: 700, textTransform: 'uppercase',
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                >
                  {copied ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  )}
                  {copied ? 'Kopiert!' : 'Del lenke'}
                </button>
              </div>
            </div>

            <SessionInfo session={MOCK_SESSION} />
          </div>

          {/* RIGHT: chat panel — Supabase Realtime */}
          <div className="live-chat-col" style={{ flexShrink: 0, width: '380px', minHeight: '620px', display: 'flex', flexDirection: 'column' }}>
            <LiveChat
              channelName="live-class"
              userName={firstName}
              isTeacher={false}
              onParticipantCountChange={setViewerCount}
            />
          </div>
        </div>
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

// ── Auth wrapper ──────────────────────────────────────────────────────────────

export default function StudentLivePage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [firstName, setFirstName] = useState('Student')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace('/login'); return }
      const email = session.user.email ?? ''
      const name = email.split('@')[0] ?? 'Student'
      setFirstName(name.charAt(0).toUpperCase() + name.slice(1))
      setChecking(false)
    })
  }, [router])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060b14' }}>
        <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase' }}>
          Laster inn…
        </div>
      </div>
    )
  }

  return <PortalLiveUI firstName={firstName} onSignOut={handleSignOut} />
}
