'use client'

import { use, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import 'plyr/dist/plyr.css'

const F = "var(--font-inter), 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"

const LESSONS = [
  {
    id: 1, title: 'Introduksjon av Aqeedah', duration: '21min',
    src: 'https://mkqxsppoxcuyklrxpjox.supabase.co/storage/v1/object/public/Videos/WIN_20260625_00_48_34_Pro.mp4',
    overview: 'This lesson covers the ten introductory principles of Islamic creed, the topics covered in Aqeedah, and the historical development of authorship from the Sahaba onward.',
    learnPoints: [
      'Navnene på denne vitenskapen: Aqeedah, al-Fiqh al-Akbar, al-Iman, al-Sunnah og al-Tawhid',
      'Hadith fra Jibreel som det grunnleggende tekstgrunnlaget for de seks pilarene i iman',
      'Emnene som dekkes i aqeedah: tawhid, de seks pilarene, troens natur og avvikende sekter',
      'Den historiske utviklingen av aqeedah-litteraturen fra sahabah til i dag',
    ],
  },
  {
    id: 2, title: 'Hvem er din Herre?', duration: '18min', src: '',
    overview: 'Vi utforsker det grunnleggende spørsmålet om å kjenne Allah, Hans egenskaper og vår plikt overfor Ham som Hans skapninger og tjenere.',
    learnPoints: [
      'Hva det betyr å kjenne Allah og hvorfor dette er det viktigste spørsmålet i livet',
      'Allahs egenskaper slik de er beskrevet i Koranen og Sunnah',
      'Plikten til å tilbe Allah alene og unngå alle former for shirk',
      'Hvordan kunnskap om Allah styrker og stabiliserer troens fundament',
    ],
  },
  {
    id: 3, title: 'De seks pilarene i troen', duration: '24min', src: '',
    overview: 'En grundig gjennomgang av de seks pilarene i iman slik de er definert i Sunnah, og hvordan disse pilarene utgjør kjernen i en muslims trosoverbevisning.',
    learnPoints: [
      'De seks pilarene: tro på Allah, englene, skriftene, profetene, den siste dag og al-qadr',
      'Koraniske og hadith-baserte bevis for hver av de seks pilarene i iman',
      'Sammenhengen mellom de seks pilarene og det daglige islamske livet',
      'Konsekvensene for troen av å avvise én av de seks pilarene',
    ],
  },
  {
    id: 4, title: 'Å tro på Allah og Hans navn og egenskaper', duration: '29min', src: '',
    overview: 'Detaljert studie av Allahs vakre navn og egenskaper (al-Asma wa al-Sifat), og den rette metodologien for å forstå dem uten forvrenging, avvisning eller sammenlikning.',
    learnPoints: [
      'De fire avvikende metodologiene i forståelsen av Allahs navn og egenskaper',
      'Ahlu Sunnahs korrekte metodologi: bekreftelse uten sammenlikning',
      'Eksempler på Allahs navn og egenskaper fra Koranen og den autentiske Sunnah',
      'Hvordan denne troen påvirker tilbedelsen og ens forhold til Allah',
    ],
  },
  {
    id: 5, title: 'Profetene og de himmelske skriftene', duration: '22min', src: '',
    overview: 'Troen på alle Allahs profeter fra Adam til Muhammad ﷺ, og de åpenbarte skriftene, inkludert Koranen som det endelige og bevarte ord fra Allah.',
    learnPoints: [
      'Troen på alle profeter som en pilar i iman, og hva dette innebærer i praksis',
      'Egenskapene til en profet og forskjellen mellom rasul og nabi',
      'De fire store åpenbarte skriftene og deres stilling i Islam',
      'Koranens unike stilling som det siste og perfekt bevarte ord fra Allah',
    ],
  },
  {
    id: 6, title: 'Å tro på qadr', duration: '25min', src: '',
    overview: 'En dyptgående forklaring av troen på al-qadr (guddommelig skjebne) — de fire nivåene og hvordan denne troen gir muslimen styrke, takknemlighet og indre fred.',
    learnPoints: [
      'De fire nivåene av troen på qadr: Allahs kunnskap, oppskrift, vilje og skapelse',
      'Forholdet mellom Allahs qadr og menneskets frie vilje og personlige ansvar',
      'Hvordan troen på qadr gir indre fred, takknemlighet og styrke i motgang',
      'Avvikende sekters syn på qadr og Ahlu Sunnahs korrekte forståelse',
    ],
  },
]

const SUBJECT_NAMES: Record<string, string> = {
  aqidah: 'Aqidah', fiqh: 'Fiqh', seerah: 'Seerah',
  koranvitenskaper: 'Koranvitenskaper', hadith: 'Hadith', 'adab-al-talib': 'Adab al-Talib',
}
const NIVEAU_LABELS: Record<number, string> = { 1: 'Nivå 1', 2: 'Nivå 2', 3: 'Nivå 3' }
const TABS = ['Overview', 'Lessons', 'Notes', 'Resources'] as const

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
    --plyr-menu-background: rgba(10,14,26,0.97);
    --plyr-menu-color: rgba(255,255,255,0.88);
    --plyr-menu-shadow: 0 8px 32px rgba(0,0,0,0.65);
    --plyr-menu-radius: 10px;
    --plyr-menu-arrow-color: transparent;
    --plyr-menu-item-arrow-color: rgba(255,255,255,0.38);
    --plyr-menu-border-color: rgba(255,255,255,0.07);
    --plyr-menu-border-shadow-color: transparent;
  }
  .plyr--video { height: 100%; background: #000; width: 100%; }
  .plyr--video .plyr__video-wrapper { height: 100%; width: 100%; }
  .plyr--fullscreen .plyr__video-wrapper video { object-fit: cover !important; }
  .plyr--video .plyr__controls { padding: 28px 14px 10px; }
  .plyr__progress__buffer { background: rgba(255,255,255,0.18) !important; }
  .plyr--video .plyr__control:hover { background: rgba(255,255,255,0.1); }
  .plyr__time { font-size: 0.72rem !important; font-weight: 500; }
  .plyr--full-ui input[type=range] { color: #26caff; }
  .plyr__menu__container { border: 1px solid rgba(255,255,255,0.08) !important; backdrop-filter: blur(12px); }
  .plyr__menu__container .plyr__menu__value { color: rgba(255,255,255,0.42) !important; }
  .plyr__menu__container [data-plyr="back"] { color: rgba(255,255,255,0.55) !important; border-bottom: 1px solid rgba(255,255,255,0.07) !important; margin-bottom: 4px; padding-bottom: 8px; }
  .plyr__menu__container [role=menuitemradio], .plyr__menu__container [role=menuitem] { color: rgba(255,255,255,0.82) !important; font-size: 0.85rem !important; }
  .plyr__menu__container [role=menuitemradio][aria-checked=true] { color: #26caff !important; }
  .plyr__menu__container [role=menuitemradio][aria-checked=true]::before { background: #26caff !important; }
  .plyr__menu__container [role=menuitemradio]:hover, .plyr__menu__container [role=menuitem]:hover { background: rgba(255,255,255,0.06) !important; }
  .plyr__control--active[data-plyr="settings"], .plyr__control[data-plyr="settings"]:hover { background: rgba(255,255,255,0.1) !important; }

  /* ── Mobile layout ── */
  @media (max-width: 767px) {
    .course-layout { flex-direction: column !important; padding-bottom: 80px; }
    .course-right { display: none !important; }
    .course-left { width: 100% !important; }
    .course-video { height: 56.25vw !important; min-height: 200px !important; }
    .course-bottom-bar { display: flex !important; }
    .course-info-pad { padding: 16px 16px 24px !important; }
    .course-title { font-size: 1.3rem !important; }
  }
  @media (min-width: 768px) {
    .course-bottom-bar { display: none !important; }
  }
`

export default function CoursePage({ params }: { params: Promise<{ subject: string; niveau: string }> }) {
  const { subject, niveau } = use(params)
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<any>(null)
  const [active, setActive] = useState(0)
  const [done, setDone] = useState<Set<number>>(new Set())
  const [ready, setReady] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'notes' | 'resources'>('overview')
  const activeRef = useRef(0)

  const nNum = parseInt(niveau.replace(/\D/g, '')) || 1
  const nLabel = NIVEAU_LABELS[nNum] ?? 'Nivå 1'
  const sName = SUBJECT_NAMES[subject] ?? subject.charAt(0).toUpperCase() + subject.slice(1)
  activeRef.current = active
  const lesson = LESSONS[active]
  const isComplete = done.has(active)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.replace('/login'); return }
      setReady(true)
    })
  }, [router])

  useEffect(() => {
    if (!ready || !videoRef.current || playerRef.current) return
    const video = videoRef.current
    const src = LESSONS[0].src
    if (src) { video.src = src; video.load() }
    import('plyr').then(({ default: Plyr }) => {
      if (playerRef.current) return
      playerRef.current = new Plyr(video, {
        controls: ['play', 'rewind', 'fast-forward', 'mute', 'progress', 'current-time', 'duration', 'settings', 'fullscreen'],
        settings: ['quality', 'speed'],
        speed: { selected: 1, options: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75] },
        tooltips: { controls: false, seek: true },
        invertTime: false,
        i18n: { speed: 'Playback speed', normal: 'Normal', quality: 'Quality' },
      } as any)
    })
    return () => { if (playerRef.current) { playerRef.current.destroy(); playerRef.current = null } }
  }, [ready])

  if (!ready) return null

  function selectLesson(i: number) {
    const video = videoRef.current
    if (!video) return
    const src = LESSONS[i].src
    video.pause()
    video.src = src || ''
    video.load()
    if (src) video.play().catch(() => {})
    setActive(i)
    setActiveTab('overview')
  }

  function toggle() {
    setDone(prev => {
      const n = new Set(prev)
      if (n.has(active)) { n.delete(active) } else {
        n.add(active)
        if (active < LESSONS.length - 1) setTimeout(() => selectLesson(activeRef.current + 1), 350)
      }
      return n
    })
  }

  function goNext() { if (active < LESSONS.length - 1) selectLesson(active + 1) }
  function goPrev() { if (active > 0) selectLesson(active - 1) }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PLYR_STYLES }} />

      {/* Back button */}
      <Link href="/student" style={{
        position: 'fixed', top: 14, left: 14, zIndex: 200,
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

      {/* Mobile bottom bar */}
      <div className="course-bottom-bar" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 150,
        height: 72, background: '#0d1117',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', gap: 12, display: 'none',
      }}>
        <button onClick={goPrev} disabled={active === 0} style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: active === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.1)', cursor: active === 0 ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: active === 0 ? 'rgba(255,255,255,0.2)' : '#fff', transition: 'all 0.15s',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button onClick={toggle} style={{
          flex: 1, height: 44, borderRadius: 10,
          background: isComplete ? 'transparent' : '#fff',
          border: isComplete ? '1px solid rgba(255,255,255,0.22)' : 'none',
          color: isComplete ? 'rgba(255,255,255,0.65)' : '#0d1117',
          fontFamily: F, fontSize: '0.82rem', fontWeight: 600,
          cursor: 'pointer', transition: 'all 0.18s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          {isComplete && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
          {isComplete ? 'Completed' : 'Mark complete'}
        </button>
        <button onClick={goNext} disabled={active === LESSONS.length - 1} style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: active === LESSONS.length - 1 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.1)', cursor: active === LESSONS.length - 1 ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: active === LESSONS.length - 1 ? 'rgba(255,255,255,0.2)' : '#fff', transition: 'all 0.15s',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      {/* ── Main layout ────────────────────────────────────────────────────────── */}
      {/* position: relative + zIndex: 1 ensures this sits above the fixed global-fixed-bg layer */}
      <div className="course-layout" style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh', backgroundColor: '#0a0e1a',
        color: '#fff', fontFamily: F,
        display: 'flex', alignItems: 'flex-start',
      }}>

        {/* LEFT — scrolls with the page */}
        <div className="course-left" style={{ flex: '0 0 77%', minHeight: '100vh', backgroundColor: '#0a0e1a' }}>

          {/* Video */}
          <div className="course-video" style={{ background: '#000', width: '100%', height: '80vh', position: 'relative', overflow: 'hidden' }}>
            <video ref={videoRef} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} playsInline />
          </div>

          {/* Info section */}
          <div className="course-info-pad" style={{ padding: '20px 28px 60px' }}>
            <p style={{ margin: '0 0 1px', fontFamily: F, fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{sName}</p>
            <p style={{ margin: '0 0 10px', fontFamily: F, fontSize: '0.95rem', fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>{nLabel}</p>
            <h1 className="course-title" style={{ margin: '0 0 18px', fontFamily: F, fontSize: 'clamp(1.3rem, 2.4vw, 1.85rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              {active + 1}. {lesson.title}
            </h1>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 24, overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' as any }}>
              {TABS.map(tab => {
                const t = tab.toLowerCase() as typeof activeTab
                const isActive = activeTab === t
                return (
                  <button key={tab} onClick={() => setActiveTab(t)} style={{
                    padding: '7px 16px', fontFamily: F, fontSize: '0.82rem', flexShrink: 0,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                    background: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                    border: isActive ? '1px solid rgba(255,255,255,0.18)' : '1px solid transparent',
                    borderRadius: 999, cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                    {tab}
                  </button>
                )
              })}
            </div>

            {/* Overview tab */}
            {activeTab === 'overview' && (
              <>
                {/* Ustadh card */}
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 28, padding: '18px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.32))', border: '2px solid rgba(201,168,76,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: F, fontSize: '1rem', fontWeight: 700, color: '#C9A84C' }}>SY</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 5px', fontFamily: F, fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Ustadh Sadiq.A Yasin</p>
                    <p style={{ margin: 0, fontFamily: F, fontSize: '0.83rem', color: 'rgba(255,255,255,0.52)', lineHeight: 1.72 }}>
                      Ustadh Sadiq Yasin is a PhD candidate at the Islamic University of Madinah. He holds a Master's in 'Aqidah and a Bachelor's in Hadith, and is known for his thorough research and deep understanding across the Islamic sciences. His academic strength and clarity in explanation have made him a respected voice among students of knowledge.
                    </p>
                  </div>
                </div>

                {/* Om denne leksjonen */}
                <div style={{ marginBottom: 26 }}>
                  <p style={{ margin: '0 0 10px', fontFamily: F, fontSize: '0.88rem', fontWeight: 700, color: '#fff', letterSpacing: '0.01em' }}>Om denne leksjonen</p>
                  <p style={{ margin: 0, fontFamily: F, fontSize: '0.87rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.78 }}>
                    {lesson.overview}
                  </p>
                </div>

                {/* Hva du vil lære */}
                <div style={{ marginBottom: 24 }}>
                  <p style={{ margin: '0 0 14px', fontFamily: F, fontSize: '0.88rem', fontWeight: 700, color: '#fff', letterSpacing: '0.01em' }}>Hva du vil lære</p>
                  {lesson.learnPoints.map((point, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 11, marginBottom: 11, alignItems: 'flex-start' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 3 }}>
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                      <p style={{ margin: 0, fontFamily: F, fontSize: '0.87rem', color: 'rgba(255,255,255,0.68)', lineHeight: 1.65 }}>{point}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Lessons tab */}
            {activeTab === 'lessons' && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: F, fontSize: '0.72rem', color: 'rgba(255,255,255,0.42)' }}>Progress</span>
                    <span style={{ fontFamily: F, fontSize: '0.72rem', color: 'rgba(255,255,255,0.42)' }}>{done.size}/{LESSONS.length}</span>
                  </div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(done.size / LESSONS.length) * 100}%`, background: '#fff', borderRadius: 2, transition: 'width 0.4s ease' }} />
                  </div>
                </div>
                {LESSONS.map((l, i) => {
                  const isDone = done.has(i)
                  const isAct = i === active
                  return (
                    <div key={l.id} onClick={() => selectLesson(i)} style={{
                      display: 'flex', gap: 12, padding: '12px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      borderLeft: `3px solid ${isAct ? '#fff' : 'transparent'}`,
                      paddingLeft: isAct ? 12 : 3,
                      background: isAct ? 'rgba(255,255,255,0.04)' : 'transparent',
                      cursor: 'pointer', transition: 'all 0.12s', alignItems: 'flex-start', borderRadius: 8,
                    }}>
                      <div style={{ width: 100, height: 58, borderRadius: 6, flexShrink: 0, background: '#1a2035', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        {isAct && !isDone && <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.75)" style={{ marginLeft: 2 }}><path d="M8 5v14l11-7z"/></svg>}
                        <span style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.78)', borderRadius: 3, padding: '1px 4px', fontFamily: F, fontSize: '0.55rem', color: '#fff' }}>{l.duration}</span>
                        {isDone && (
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                        <p style={{ margin: '0 0 4px', fontFamily: F, fontSize: '0.82rem', fontWeight: isAct ? 600 : 400, lineHeight: 1.35, color: isAct ? '#fff' : isDone ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.82)', overflow: 'hidden', maxHeight: '2.7em' }}>
                          {i + 1}. {l.title}
                        </p>
                        {isDone
                          ? <span style={{ fontFamily: F, fontSize: '0.68rem', color: '#22c55e', fontWeight: 500 }}>Completed</span>
                          : isAct ? <span style={{ fontFamily: F, fontSize: '0.68rem', color: 'rgba(255,255,255,0.38)' }}>Now playing</span>
                          : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Notes / Resources placeholder */}
            {(activeTab === 'notes' || activeTab === 'resources') && (
              <div style={{ padding: '32px 0', textAlign: 'center' }}>
                <p style={{ fontFamily: F, fontSize: '0.88rem', color: 'rgba(255,255,255,0.28)' }}>Kommer snart</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT sidebar — sticky, stays on screen while page scrolls */}
        <div className="course-right" style={{
          flex: '0 0 23%', position: 'sticky', top: 0, height: '100vh',
          backgroundColor: '#0d1222',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
            <p style={{ margin: '0 0 2px', fontFamily: F, fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{sName}</p>
            <p style={{ margin: '0 0 14px', fontFamily: F, fontSize: '0.9rem', fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>{nLabel}</p>
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
              fontFamily: F, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              {isComplete && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              {isComplete ? 'Completed' : 'Mark as complete'}
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {LESSONS.map((l, i) => {
              const isDone = done.has(i)
              const isAct = i === active
              return (
                <div key={l.id} onClick={() => selectLesson(i)} style={{
                  display: 'flex', gap: 12, padding: '11px 14px',
                  borderBottom: '1px solid rgba(255,255,255,0.045)',
                  borderLeft: `3px solid ${isAct ? '#fff' : 'transparent'}`,
                  background: isAct ? 'rgba(255,255,255,0.055)' : 'transparent',
                  cursor: 'pointer', transition: 'background 0.12s', alignItems: 'flex-start',
                }}
                  onMouseEnter={e => { if (!isAct) e.currentTarget.style.background = 'rgba(255,255,255,0.028)' }}
                  onMouseLeave={e => { if (!isAct) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ width: 116, height: 68, borderRadius: 5, flexShrink: 0, background: '#1a2035', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {isAct && !isDone && <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.75)" style={{ marginLeft: 3 }}><path d="M8 5v14l11-7z"/></svg>}
                    <span style={{ position: 'absolute', bottom: 5, right: 5, background: 'rgba(0,0,0,0.78)', borderRadius: 3, padding: '2px 5px', fontFamily: F, fontSize: '0.58rem', color: '#fff' }}>{l.duration}</span>
                    {isDone && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                    <p style={{ margin: '0 0 5px', fontFamily: F, fontSize: '0.82rem', fontWeight: isAct ? 600 : 400, lineHeight: 1.35, color: isAct ? '#fff' : isDone ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.82)', overflow: 'hidden', maxHeight: '2.7em' }}>
                      {i + 1}. {l.title}
                    </p>
                    {isDone
                      ? <span style={{ fontFamily: F, fontSize: '0.7rem', color: '#22c55e', fontWeight: 500 }}>Completed</span>
                      : isAct ? <span style={{ fontFamily: F, fontSize: '0.7rem', color: 'rgba(255,255,255,0.38)' }}>Now playing</span>
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
