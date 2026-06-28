'use client'

import { use, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import 'plyr/dist/plyr.css'

const F = "var(--font-inter), 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"

const LESSONS = [
  { id: 1, title: 'Introduksjon av Aqeedah', duration: '21min', src: '', overview: 'En innledning til islamsk trosoverbevisning (aqeedah) — hva det betyr, hvorfor det er viktig, og hva dette kurset dekker.' },
  { id: 2, title: 'Hvem er din Herre?', duration: '18min', src: '', overview: 'Vi utforsker det grunnleggende spørsmålet om å kjenne Allah, Hans egenskaper og vår plikt overfor Ham.' },
  { id: 3, title: 'De seks pilarene i troen', duration: '24min', src: '', overview: 'En gjennomgang av de seks pilarene i iman: Allah, englene, skriftene, profetene, den siste dag og al-qadr.' },
  { id: 4, title: 'Å tro på Allah og Hans navn og egenskaper', duration: '29min', src: '', overview: 'Detaljert studie av Allahs vakre navn og den rette metoden for å forstå Hans egenskaper uten forvrenging.' },
  { id: 5, title: 'Profetene og de himmelske skriftene', duration: '22min', src: '', overview: 'Troen på profetene fra Adam til Muhammad ﷺ, og de åpenbarte skriftene, inkludert Koranen som det endelige ord.' },
  { id: 6, title: 'Å tro på qadr', duration: '25min', src: '', overview: 'En dyptgående forklaring av qadr (guddommelig skjebne) — de fire nivåene og hvordan denne troen påvirker et muslims hjertelag.' },
]

const SUBJECT_NAMES: Record<string, string> = {
  aqidah: 'Aqidah', fiqh: 'Fiqh', seerah: 'Seerah',
  koranvitenskaper: 'Koranvitenskaper', hadith: 'Hadith', 'adab-al-talib': 'Adab al-Talib',
}
const NIVEAU_LABELS: Record<number, string> = { 1: 'Nivå 1', 2: 'Nivå 2', 3: 'Nivå 3' }

// Plyr CSS overrides
const PLYR_STYLES = `
  :root {
    --plyr-color-main: #26caff;
    --plyr-video-background: #000;
    --plyr-font-family: var(--font-inter), 'Inter', sans-serif;
    --plyr-font-size-base: 13px;
    --plyr-control-icon-size: 17px;
    --plyr-control-spacing: 10px;
    --plyr-range-thumb-height: 14px;
    --plyr-range-thumb-background: #26caff;
    --plyr-range-fill-background: #26caff;
    --plyr-video-controls-background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%);

    /* Settings menu — dark theme */
    --plyr-menu-background: rgba(10, 14, 26, 0.97);
    --plyr-menu-color: rgba(255,255,255,0.88);
    --plyr-menu-shadow: 0 8px 32px rgba(0,0,0,0.65);
    --plyr-menu-radius: 10px;
    --plyr-menu-arrow-color: transparent;
    --plyr-menu-item-arrow-color: rgba(255,255,255,0.38);
    --plyr-menu-border-color: rgba(255,255,255,0.07);
    --plyr-menu-border-shadow-color: transparent;
  }
  .plyr--video {
    height: 100%;
    background: #111;
  }
  .plyr--video .plyr__controls {
    padding: 28px 14px 10px;
  }
  .plyr__progress__buffer {
    background: rgba(255,255,255,0.18) !important;
  }
  .plyr--video .plyr__control:hover {
    background: rgba(255,255,255,0.1);
  }
  .plyr__time {
    font-size: 0.72rem !important;
    font-weight: 500;
  }
  .plyr--full-ui input[type=range] {
    color: #26caff;
  }

  /* Settings menu border */
  .plyr__menu__container {
    border: 1px solid rgba(255,255,255,0.08) !important;
    backdrop-filter: blur(12px);
  }
  /* Right-side values ("Normal", "Auto") */
  .plyr__menu__container .plyr__menu__value {
    color: rgba(255,255,255,0.42) !important;
  }
  /* Back button row in submenu */
  .plyr__menu__container [data-plyr="back"] {
    color: rgba(255,255,255,0.55) !important;
    border-bottom: 1px solid rgba(255,255,255,0.07) !important;
    margin-bottom: 4px;
    padding-bottom: 8px;
  }
  /* All menu items */
  .plyr__menu__container [role=menuitemradio],
  .plyr__menu__container [role=menuitem] {
    color: rgba(255,255,255,0.82) !important;
    font-size: 0.85rem !important;
  }
  /* Selected speed item */
  .plyr__menu__container [role=menuitemradio][aria-checked=true] {
    color: #26caff !important;
  }
  .plyr__menu__container [role=menuitemradio][aria-checked=true]::before {
    background: #26caff !important;
  }
  /* Hover on menu items */
  .plyr__menu__container [role=menuitemradio]:hover,
  .plyr__menu__container [role=menuitem]:hover {
    background: rgba(255,255,255,0.06) !important;
  }
  /* Settings icon active state */
  .plyr__control--active[data-plyr="settings"],
  .plyr__control[data-plyr="settings"]:hover {
    background: rgba(255,255,255,0.1) !important;
  }
  /* Hide left panel scrollbar */
  .left-scroll::-webkit-scrollbar { display: none; }
`

export default function CoursePage({ params }: { params: Promise<{ subject: string; niveau: string }> }) {
  const { subject, niveau } = use(params)
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<any>(null)
  const [active, setActive] = useState(0)
  const [done, setDone] = useState<Set<number>>(new Set())
  const [ready, setReady] = useState(false)

  const nNum = parseInt(niveau.replace(/\D/g, '')) || 1
  const nLabel = NIVEAU_LABELS[nNum] ?? 'Nivå 1'
  const sName = SUBJECT_NAMES[subject] ?? subject.charAt(0).toUpperCase() + subject.slice(1)
  const lesson = LESSONS[active]
  const isComplete = done.has(active)

  // Auth check
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace('/login'); return }
      setReady(true)
    })
  }, [router])

  // Init Plyr
  useEffect(() => {
    if (!ready || !videoRef.current) return

    import('plyr').then(({ default: Plyr }) => {
      // Destroy previous instance before creating new one
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
      playerRef.current = new Plyr(videoRef.current!, {
        controls: ['play', 'rewind', 'fast-forward', 'mute', 'progress', 'current-time', 'duration', 'settings', 'fullscreen'],
        settings: ['quality', 'speed'],
        speed: { selected: 1, options: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75] },
        rewind: 10,
        fastForward: 10,
        tooltips: { controls: false, seek: true },
        invertTime: false,
        i18n: {
          speed: 'Playback speed',
          normal: 'Normal',
          quality: 'Quality',
        },
      })
    })

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [ready, active])

  if (!ready) return null

  function toggle() {
    setDone(prev => {
      const n = new Set(prev)
      if (n.has(active)) { n.delete(active) } else {
        n.add(active)
        if (active < LESSONS.length - 1) setTimeout(() => setActive(active + 1), 350)
      }
      return n
    })
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PLYR_STYLES }} />

      {/* Back button — fixed, always visible */}
      <Link href="/student" style={{
        position: 'fixed', top: 14, left: 14, zIndex: 100,
        width: 38, height: 38, borderRadius: '50%',
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textDecoration: 'none', transition: 'background 0.15s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.85)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
      </Link>

      <div style={{ height: '100vh', background: '#0d1117', color: '#fff', fontFamily: F, display: 'flex', overflow: 'hidden' }}>

        {/* ══ LEFT — video + info ══════════════════════════════════════════════ */}
        <div className="left-scroll" style={{ flex: '0 0 74%', display: 'flex', flexDirection: 'column', overflowY: 'auto', scrollbarWidth: 'none' }}>

          {/* Video wrapper */}
          <div style={{ background: '#000', width: '100%', aspectRatio: '16/9', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>

            {/* Plyr video element */}
            <video
              ref={videoRef}
              style={{ width: '100%', height: '100%', display: 'block' }}
              playsInline
            >
              {lesson.src && <source src={lesson.src} type="video/mp4" />}
            </video>
          </div>

          {/* ── Info below video ── */}
          <div style={{ padding: '20px 28px 40px' }}>
            <p style={{ margin: '0 0 1px', fontFamily: F, fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
              {sName}
            </p>
            <p style={{ margin: '0 0 10px', fontFamily: F, fontSize: '0.95rem', fontWeight: 400, color: '#fff' }}>
              {nLabel}
            </p>
            <h1 style={{ margin: '0 0 18px', fontFamily: F, fontSize: 'clamp(1.5rem, 2.4vw, 1.85rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              {active + 1}. {lesson.title}
            </h1>

            {/* Pill tabs — all have dark background like reference */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
              {['Overview', 'Notes', 'Resources'].map((tab, i) => (
                <button key={tab} style={{
                  padding: '7px 18px', fontFamily: F, fontSize: '0.82rem',
                  fontWeight: i === 0 ? 600 : 400,
                  color: i === 0 ? '#fff' : 'rgba(255,255,255,0.5)',
                  background: 'rgba(255,255,255,0.08)',
                  border: i === 0 ? '1px solid rgba(255,255,255,0.18)' : '1px solid transparent',
                  borderRadius: 999, cursor: 'pointer', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { if (i !== 0) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' } }}
                  onMouseLeave={e => { if (i !== 0) { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'transparent' } }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Overview text */}
            <p style={{ margin: '0 0 24px', fontFamily: F, fontSize: '0.9rem', color: 'rgba(255,255,255,0.48)', lineHeight: 1.75 }}>
              {lesson.overview}
            </p>

            {/* Teacher bio card */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '20px 22px',
              display: 'flex', gap: 18, marginBottom: 24,
            }}>
              {/* Avatar placeholder */}
              <div style={{
                width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #1a2540 0%, #2a3a5c 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem', color: 'rgba(255,255,255,0.25)',
                overflow: 'hidden',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: '0 0 8px', fontFamily: F, fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                  Shaykh — Al Rawdah Institutt
                </p>
                <p style={{ margin: 0, fontFamily: F, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                  Underviseren ved Al Rawdah Institutt bringer sammen klassisk islamsk kunnskap og en dyp forståelse av moderne utfordringer. Kurset er nøye utformet for å gi studenter et solid fundament i {sName.toLowerCase()}, basert på autentiske kilder og anerkjente lærde.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT — sidebar ═════════════════════════════════════════════════ */}
        <div style={{ flex: '0 0 26%', background: '#10151f', borderLeft: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
            <p style={{ margin: '0 0 2px', fontFamily: F, fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
              {sName}
            </p>
            <p style={{ margin: '0 0 14px', fontFamily: F, fontSize: '0.9rem', fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>
              {nLabel}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <span style={{ fontFamily: F, fontSize: '0.72rem', color: 'rgba(255,255,255,0.42)' }}>Progress</span>
              <span style={{ fontFamily: F, fontSize: '0.72rem', color: 'rgba(255,255,255,0.42)' }}>{done.size}/{LESSONS.length}</span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginBottom: 14, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(done.size / LESSONS.length) * 100}%`, background: '#fff', borderRadius: 2, transition: 'width 0.4s ease' }} />
            </div>

            <button onClick={toggle} style={{
              width: '100%', padding: '10px 0', borderRadius: 8,
              background: isComplete ? 'transparent' : '#fff',
              border: isComplete ? '1px solid rgba(255,255,255,0.22)' : 'none',
              color: isComplete ? 'rgba(255,255,255,0.65)' : '#0d1117',
              fontFamily: F, fontSize: '0.82rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.18s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
              onMouseEnter={e => { if (!isComplete) e.currentTarget.style.background = 'rgba(255,255,255,0.9)' }}
              onMouseLeave={e => { if (!isComplete) e.currentTarget.style.background = isComplete ? 'transparent' : '#fff' }}
            >
              {isComplete && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              {isComplete ? 'Completed' : 'Mark as complete'}
            </button>
          </div>

          {/* Lesson list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {LESSONS.map((l, i) => {
              const isDone = done.has(i)
              const isActive = i === active
              return (
                <div key={l.id} onClick={() => setActive(i)} style={{
                  display: 'flex', gap: 12, padding: '11px 14px',
                  borderBottom: '1px solid rgba(255,255,255,0.045)',
                  borderLeft: `3px solid ${isActive ? '#fff' : 'transparent'}`,
                  background: isActive ? 'rgba(255,255,255,0.055)' : 'transparent',
                  cursor: 'pointer', transition: 'background 0.12s', alignItems: 'flex-start',
                }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.028)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  {/* Thumbnail */}
                  <div style={{ width: 116, height: 68, borderRadius: 5, flexShrink: 0, background: '#1a2035', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {isActive && !isDone && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.75)" style={{ marginLeft: 3 }}><path d="M8 5v14l11-7z"/></svg>
                    )}
                    <span style={{ position: 'absolute', bottom: 5, right: 5, background: 'rgba(0,0,0,0.78)', borderRadius: 3, padding: '2px 5px', fontFamily: F, fontSize: '0.58rem', color: '#fff' }}>{l.duration}</span>
                    {isDone && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                    <p style={{
                      margin: '0 0 5px', fontFamily: F,
                      fontSize: '0.82rem', fontWeight: isActive ? 600 : 400, lineHeight: 1.4,
                      color: isActive ? '#fff' : isDone ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.72)',
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                    }}>
                      {i + 1}. {l.title}
                    </p>
                    {isDone
                      ? <span style={{ fontFamily: F, fontSize: '0.7rem', color: '#22c55e', fontWeight: 500 }}>Completed</span>
                      : isActive
                        ? <span style={{ fontFamily: F, fontSize: '0.7rem', color: 'rgba(255,255,255,0.38)' }}>Now playing</span>
                        : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
