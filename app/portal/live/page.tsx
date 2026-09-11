'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import LiveVideo from '@/app/components/live/LiveVideo'
import LiveChat from '@/app/components/live/LiveChat'
import RaiseHandButton from '@/app/components/live/RaiseHandButton'
import type { LiveSession } from '@/app/components/live/SessionInfo'
import styles from '@/app/components/live/LiveRoom.module.css'

// ── Portal shell ──────────────────────────────────────────────────────────────

function PortalLiveUI({ firstName, onSignOut, onLiveEnded }: { firstName: string; onSignOut: () => void; onLiveEnded: () => void }) {
  const [meetingUrl, setMeetingUrl] = useState('')
  const [isLive, setIsLive] = useState(false)
  const [session, setSession] = useState<LiveSession | null>(null)
  const [viewerCount, setViewerCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const wasLiveRef = useRef(false)

  async function handleShare() {
    const url = `${window.location.origin}/portal/live`
    if (navigator.share) {
      try { await navigator.share({ title: 'Al Rawdah — Direkteklasse', url }) } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Poll live status every 5s and populate session from real API data
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/live-status', { cache: 'no-store' })
        const data = await res.json()
        const nowLive = !!data.isLive

        // Live ended → redirect students to portal
        if (wasLiveRef.current && !nowLive) {
          onLiveEnded()
          return
        }

        // New live session started → reset viewer count so it builds from zero
        if (!wasLiveRef.current && nowLive) {
          setViewerCount(0)
        }

        wasLiveRef.current = nowLive
        if (data.meetingUrl) setMeetingUrl(data.meetingUrl)
        setIsLive(nowLive)

        if (nowLive && data.title) {
          setSession({
            title: data.title,
            teacher: data.teacher ?? '',
            subject: data.subject ?? '',
            level: '',
            startTime: data.time ?? '',
            date: new Date().toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' }),
            description: '',
            isLive: true,
          })
        } else if (!nowLive) {
          setSession(null)
        }
      } catch { /* ignore */ }
    }
    checkStatus()
    const id = setInterval(checkStatus, 5000)
    return () => clearInterval(id)
  }, [onLiveEnded])

  return (
    <div className={styles.room}>
      <header className={styles.header}>
        <Link href="/portal" className={styles.brand}><Image src="/logo-cropped.png" alt="Al Rawdah" width={988} height={374} priority /></Link>
        <Link href="/portal" className={styles.back}>Tilbake til portalen</Link>
        <button onClick={onSignOut} className={styles.avatar} aria-label="Logg ut" title="Logg ut">{firstName.charAt(0)}</button>
      </header>
      <main className={styles.layout}>
        <div className={styles.stage}>
          <LiveVideo meetingUrl={meetingUrl} isLive={isLive} viewerCount={viewerCount} displayName={firstName} role="student" />
          <section className={styles.session} aria-label="Om denne klassen">
            <div className={styles.sessionTop}>
              <span className={isLive ? styles.liveBadge : styles.waitingBadge}>{isLive ? 'LIVE' : 'Venter p\u00e5 l\u00e6rer'}</span>
              <div className={styles.actions}>
                {isLive && <RaiseHandButton userName={firstName} />}
                <button className={styles.share} onClick={handleShare}>{copied ? 'Lenke kopiert' : 'Del klasse'}</button>
              </div>
            </div>
            <h1>{session?.title || 'Velkommen til direkteklassen'}</h1>
            {session ? <div className={styles.details}>
              <h2>Om denne klassen</h2>
              <p>{[session.teacher, session.subject, session.startTime].filter(Boolean).join(' \u00b7 ')}</p>
              {session.description && <p>{session.description}</p>}
            </div> : <p className={styles.waitingText}>Video og informasjon vises her n&#229;r l&#230;reren starter klassen.</p>}
          </section>
        </div>
        <aside className={styles.chatColumn} aria-label="Klassechat">
          <LiveChat channelName="live-class" userName={firstName} isTeacher={false} onParticipantCountChange={setViewerCount} />
        </aside>
      </main>
    </div>
  )
}

export default function StudentLivePage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [firstName, setFirstName] = useState('Student')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace('/login'); return }
      const { email, user_metadata } = session.user
      const fullName = (user_metadata?.full_name as string | undefined)?.trim()
      if (fullName) {
        setFirstName(fullName)
      } else {
        const prefix = (email ?? '').split('@')[0] || 'Student'
        setFirstName(prefix.charAt(0).toUpperCase() + prefix.slice(1))
      }
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
      <div className="loading-overlay">
        <div className="loading-logo">
          <div className="loading-logo-wrapper">
            <Image
              src="/logo-cropped.png"
              alt="Al Rawdah Institutt"
              width={988} height={374}
              className="loading-logo-img"
              priority
            />
          </div>
        </div>
        <div className="loading-tagline">Laster din opplevelse…</div>
      </div>
    )
  }

  return <PortalLiveUI firstName={firstName} onSignOut={handleSignOut} onLiveEnded={() => router.replace('/portal')} />
}
