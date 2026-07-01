'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// ── SVG Icons (no emoji — ui-ux-pro-max: no-emoji-icons) ────────────────────

const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const IconChevronDown = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

// ── Data ─────────────────────────────────────────────────────────────────────

const ISLAMIC_SUBJECTS = [
  { name: 'Koranvitenskaper', desc: 'Tafseer, tajweed og koranvitenskapene.' },
  { name: 'Aqidah', desc: 'Islamsk monoteisme, grunnlag og pilarer.' },
  { name: 'Fiqh', desc: 'Islamsk rettsvitenskap med regler og bevis.' },
  { name: 'Seerah', desc: 'Profeten Muhammads ﷺ liv og biografi.' },
  { name: 'Hadith', desc: 'Profetens ﷺ ord, handlinger og godkjennelser.' },
  { name: 'Adab al-Talib', desc: 'Oppførselen og egenskapene til en kunnskapssøker.' },
]

const ARABIC_SUBJECTS = [
  { name: 'Arabisk', desc: 'Klassisk arabisk grammatikk, vokabular og lesekomprehensjon. Det er dette som gjør det mulig å lese kildene direkte.' },
]

const TIMELINE = [
  { year: '2026–2027', level: 'Nivå 1', sub: 'Grunnivå', semesters: 'Høst + Vår', nivå: 1 },
  { year: '2027–2028', level: 'Nivå 2', sub: 'Mellomnivå', semesters: 'Høst + Vår', nivå: 2 },
  { year: '2028–2029', level: 'Nivå 3', sub: 'Viderenivå', semesters: 'Høst + Vår', nivå: 3 },
]

const FAQS = [
  { q: 'Når starter Nivå 1?', a: 'Nivå 1 starter september 2026. Nivå 2 og 3 følger i de to påfølgende skoleårene, med det samme kullet.' },
  { q: 'Hvordan fungerer opptaksprosessen?', a: 'Alle søkere fyller først ut søknadsskjemaet. Deretter kaller vi inn til en kort samtale (ingen eksamen) hvor vi blir kjent med eleven og ser at programmet passer for dem. Vi ser ikke etter forkunnskaper i arabisk eller islamske vitenskaper; programmet starter fra grunnen. Det vi ser etter er motivasjon og at familien er innstilt på et treårig løp.' },
  { q: 'Hva skjer hvis jeg ikke kommer inn?', a: 'Du havner på venteliste. Vi planlegger nye kull etter hvert.' },
  { q: 'Hvor ofte holdes liveklassene?', a: 'Klasser holdes ukentlig via Google Meet, over Høst- og Vårsemester.' },
  { q: 'Hvordan får jeg tilgang til klassemateriell?', a: 'Alle PDF-er og ressurser ligger i studentportalen etter innlogging.' },
  { q: 'Hvordan fungerer karakterer og oppmøte?', a: 'Begge spores og er synlige i studentportalen.' },
]

const STEPS = [
  { num: '01', title: 'Søk om plass', desc: 'Fyll ut søknadsskjemaet vårt online.' },
  { num: '02', title: 'Intervju', desc: 'Vi kontakter deg for et kort intervju.' },
  { num: '03', title: 'Start september 2026', desc: 'Bli med på det første kullet fra september 2026.' },
]

const FEATURES = [
  'Arabisk + Islamske vitenskaper inkludert',
  'Ukentlige liveklasser via Google Meet',
  'PDF-studiemateriell',
  'Tilbakemeldinger fra lærer',
  'Fraværs- og fremgangssporing',
]

// ── AnimatedHeading ───────────────────────────────────────────────────────────

function AnimatedHeading({ text, delay = 0, color, gradient }: { text: string; delay?: number; color?: string; gradient?: string }) {
  if (gradient) {
    return (
      <span
        className="hero-fade-item"
        aria-label={text}
        style={{
          display: 'block',
          background: gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animationDelay: `${delay}ms`,
          opacity: 0,
        }}
      >
        {text}
      </span>
    )
  }
  return (
    <span aria-label={text} style={{ perspective: '600px', display: 'block', color: color ?? 'inherit' }}>
      {text.split(' ').map((word, wi, arr) => {
        const wordStart = arr.slice(0, wi).reduce((a, w) => a + w.length + 1, 0)
        return (
          <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {word.split('').map((ch, ci) => (
              <span
                key={ci}
                className="hero-char"
                style={{ animationDelay: `${delay + (wordStart + ci) * 36}ms` }}
                aria-hidden="true"
              >
                {ch}
              </span>
            ))}
            {wi < arr.length - 1 && (
              <span aria-hidden="true" style={{ display: 'inline-block' }}>&nbsp;</span>
            )}
          </span>
        )
      })}
    </span>
  )
}

// ── useReveal ─────────────────────────────────────────────────────────────────

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, revealed }
}

// ── Particle type ─────────────────────────────────────────────────────────────

type Particle = { x: number; y: number; vx: number; vy: number; r: number; opacity: number; node: boolean }

// ── Section heading helper ────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-16">
      <h2 style={{
        fontFamily: 'var(--font-montserrat)',
        fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: '#f1f5f9',
        marginBottom: 20,
        lineHeight: 1.2,
      }}>
        {children}
      </h2>
      <div className="gold-rule" />
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('top')
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null)
  const [loadingPercent, setLoadingPercent] = useState(0)
  const [loadingDone, setLoadingDone] = useState(false)
  const [loadingHidden, setLoadingHidden] = useState(false)
  const [navOpacity, setNavOpacity] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Section reveal hooks
  const { ref: currRef, revealed: currRevealed } = useReveal()
  const { ref: howRef, revealed: howRevealed } = useReveal()
  const { ref: pricingRef, revealed: pricingRevealed } = useReveal()
  const { ref: faqRef, revealed: faqRevealed } = useReveal()
  const { ref: footerRef, revealed: footerRevealed } = useReveal()

  // Scroll detector — continuous 0→1 over first 80px, boolean for pill styling
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setNavOpacity(Math.min(y / 80, 1))
      setScrolled(y > 40)
      if (y < 80) {
        setActiveSection('top')
        window.history.replaceState(null, '', '/hjem')
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Clean URL ↔ section ID maps
  const sectionToUrl: Record<string, string> = {
    top: '/hjem', curriculum: '/pensum', pricing: '/søknad', faq: '/spørsmål',
  }
  const urlToSection: Record<string, string> = {
    '/hjem': 'top', '/pensum': 'curriculum', '/søknad': 'pricing', '/spørsmål': 'faq',
  }

  function scrollToSection(sectionId: string, url: string) {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const el = document.getElementById(sectionId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
    window.history.replaceState(null, '', url)
    setActiveSection(sectionId)
  }

  // On first load: if URL is /pensum etc., scroll to that section
  useEffect(() => {
    const path = window.location.pathname
    const sectionId = urlToSection[path]
    if (sectionId && sectionId !== 'top') {
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        setActiveSection(sectionId)
      }, 120)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Active section detection via IntersectionObserver
  useEffect(() => {
    const ids = ['curriculum', 'pricing', 'faq']
    const observers = ids.map(id => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
            window.history.replaceState(null, '', sectionToUrl[id])
          }
        },
        { rootMargin: '-25% 0px -65% 0px', threshold: 0 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(obs => obs?.disconnect())
  }, [])

  // Loading screen — full on first visit, instant skip on return (sessionStorage flag)
  useEffect(() => {
    if (sessionStorage.getItem('ar_loaded')) {
      setLoadingPercent(100)
      setLoadingDone(true)
      setLoadingHidden(true)
      return
    }

    let count = 0
    const id = setInterval(() => {
      count++
      setLoadingPercent(count)
      if (count >= 100) {
        clearInterval(id)
        setLoadingDone(true)
        sessionStorage.setItem('ar_loaded', '1')
        setTimeout(() => setLoadingHidden(true), 600)
      }
    }, 20)
    return () => clearInterval(id)
  }, [])

  // Canvas Islamic constellation particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const count = canvas.width < 600 ? 40 : 75
    const particles: Particle[] = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: i % 12 === 0 ? 2.6 : 1.1 + Math.random() * 0.9,
      opacity: i % 12 === 0 ? 0.95 : 0.35 + Math.random() * 0.45,
      node: i % 12 === 0,
    }))

    const THRESH = 175
    let rafId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x = (p.x + p.vx + canvas.width) % canvas.width
        p.y = (p.y + p.vy + canvas.height) % canvas.height
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < THRESH) {
            const isNode = particles[i].node || particles[j].node
            const alpha = (1 - dist / THRESH) * (isNode ? 0.5 : 0.25)
            ctx.beginPath()
            ctx.strokeStyle = `rgba(201,168,76,${alpha})`
            ctx.lineWidth = particles[i].node && particles[j].node ? 0.85 : 0.4
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,168,76,${p.opacity})`
        ctx.fill()
      })
      rafId = requestAnimationFrame(draw)
    }
    rafId = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', resize) }
  }, [])

  const navLinks: { label: string; href: string; section?: string; dropdown?: { label: string; href: string }[] }[] = [
    { label: 'Hjem',      href: '/hjem',      section: 'top' },
    { label: 'Pensum',    href: '/pensum',     section: 'curriculum', dropdown: [{ label: 'Studieplan', href: '/studieplan' }] },
    { label: 'Søknad',    href: '/søknad',     section: 'pricing' },
    { label: 'Artikler',  href: '/artikler' },
    { label: 'Spørsmål',  href: '/spørsmål',   section: 'faq' },
  ]

  // ── Shared style tokens ──────────────────────────────────────────────────────
  const pillBg = scrolled ? 'rgba(12,20,38,0.5)' : 'rgba(12,20,38,0.18)'
  const pillBorder = scrolled ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(201,168,76,0.22)'
  const isActive = (href: string) => {
    const sectionId = urlToSection[href]
    return sectionId ? activeSection === sectionId : false
  }

  return (
    <div id="top" style={{ backgroundColor: '#080c14', color: '#f1f5f9' }}>

      {/* ── SKIP LINK ─────────────────────────────────────────── */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* ── LOADING SCREEN ──────────────────────────────────────── */}
      {!loadingHidden && (
        <div className={`loading-overlay${loadingDone ? ' loading-fade-out' : ''}`} aria-hidden="true">
          <div className="loading-logo">
            <div className="loading-logo-wrapper">
              <Image
                src="/logo-cropped.png"
                alt="Al Rawdah Institutt"
                width={1287}
                height={461}
                className="loading-logo-img"
                priority
              />
            </div>
          </div>
          <div className="loading-percent" aria-live="polite" aria-label={`Laster inn ${loadingPercent} prosent`}>{loadingPercent}%</div>
          <div className="loading-bar-track">
            <div className="loading-bar-fill" style={{ width: `${loadingPercent}%` }} />
          </div>
          <div className="loading-tagline">Laster din opplevelse</div>

          {/* Full-width gold line at the very bottom edge */}
          <div className="loading-bar-bottom">
            <div className="loading-bar-bottom-fill" style={{ width: `${loadingPercent}%` }} />
          </div>
        </div>
      )}

      {/* ── NAVBAR ────────────────────────────────────────────────────── */}
      <header
        className="fixed z-50"
        style={{
          top: 0, left: 0, right: 0,
          pointerEvents: 'none',
          opacity: loadingHidden ? 1 : 0,
          transition: 'opacity 0.7s ease',
        }}
      >
        {/* Blur overlay — always blurred, opacity drives the transition (GPU-composited) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(6,11,20,0.82)',
            backdropFilter: 'blur(12px) saturate(140%)',
            WebkitBackdropFilter: 'blur(12px) saturate(140%)',
            borderBottom: '1px solid rgba(201,168,76,0.08)',
            opacity: navOpacity,
            transition: 'opacity 180ms linear',
            willChange: 'opacity',
          }}
        />
        <div
          className="flex items-center justify-between"
          style={{
            position: 'relative',
            width: '100%',
            padding: '8px 24px',
            gap: '16px',
          }}
        >
          {/* Logo — left, shrinks via clamp so it never collides with the pill */}
          <a
            href="/hjem"
            onClick={(e) => { e.preventDefault(); scrollToSection('top', '/hjem') }}
            style={{ pointerEvents: 'all', flexShrink: 0, display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <Image
              src="/logo-cropped.png"
              alt="Al Rawdah Institutt"
              width={1287}
              height={461}
              style={{ width: 'clamp(130px, 16vw, 220px)', height: 'auto', objectFit: 'contain' }}
              priority
            />
          </a>

          {/* Nav pill — right */}
          <nav role="navigation" aria-label="Main navigation" style={{ pointerEvents: 'all', flexShrink: 0 }}>
            {/* Desktop pill */}
            <div
              className="hidden md:flex items-center gap-0.5"
              style={{
                background: pillBg,
                backdropFilter: 'blur(28px) saturate(200%) brightness(1.04)',
                WebkitBackdropFilter: 'blur(28px) saturate(200%) brightness(1.04)',
                border: pillBorder,
                borderRadius: '999px',
                padding: '6px 6px 6px 8px',
                transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
                boxShadow: scrolled
                  ? '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(201,168,76,0.12), inset 0 0 0 1px rgba(201,168,76,0.06)'
                  : '0 2px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(201,168,76,0.08)',
              }}
            >
              {navLinks.map((l) => {
                const active = isActive(l.href)
                const isOpen = dropdownOpen === l.label

                if (l.dropdown) {
                  return (
                    <div
                      key={l.label}
                      style={{ position: 'relative' }}
                      onMouseEnter={() => setDropdownOpen(l.label)}
                      onMouseLeave={() => setDropdownOpen(null)}
                    >
                      <a
                        href={l.href}
                        onClick={l.section ? (e) => { e.preventDefault(); scrollToSection(l.section!, l.href) } : undefined}
                        style={{
                          color: active || isOpen ? '#C9A84C' : '#e2e8f0',
                          fontSize: '0.8rem',
                          fontFamily: 'var(--font-montserrat)',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          textDecoration: 'none',
                          padding: '9px 18px',
                          borderRadius: '999px',
                          whiteSpace: 'nowrap',
                          transition: 'color 0.2s ease, background 0.2s ease',
                          lineHeight: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: active || isOpen ? 'rgba(201,168,76,0.12)' : 'transparent',
                          fontWeight: active || isOpen ? 600 : 400,
                        }}
                      >
                        {l.label}
                        <span style={{ transition: 'transform 0.2s ease', transform: isOpen ? 'rotate(180deg)' : 'none', display: 'flex' }}>
                          <IconChevronDown />
                        </span>
                      </a>
                      {isOpen && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          paddingTop: '10px',
                          zIndex: 200,
                          minWidth: '210px',
                        }}>
                        <div style={{
                          background: 'rgba(6,11,20,0.97)',
                          backdropFilter: 'blur(24px) saturate(200%)',
                          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
                          border: '1px solid rgba(201,168,76,0.2)',
                          borderRadius: '16px',
                          padding: '8px',
                          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                        }}>
                          {l.dropdown.map((item) => (
                            <a
                              key={item.label}
                              href={item.href}
                              onClick={() => setDropdownOpen(null)}
                              style={{
                                display: 'block',
                                color: '#cbd5e1',
                                textDecoration: 'none',
                                fontSize: '0.8rem',
                                fontFamily: 'var(--font-montserrat)',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                padding: '12px 18px',
                                borderRadius: '10px',
                                transition: 'color 0.2s ease, background 0.2s ease',
                                whiteSpace: 'nowrap',
                              }}
                              onMouseEnter={(e) => {
                                const el = e.currentTarget as HTMLElement
                                el.style.color = '#C9A84C'
                                el.style.background = 'rgba(201,168,76,0.08)'
                              }}
                              onMouseLeave={(e) => {
                                const el = e.currentTarget as HTMLElement
                                el.style.color = '#cbd5e1'
                                el.style.background = 'transparent'
                              }}
                            >
                              {item.label}
                            </a>
                          ))}
                        </div>
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={l.section ? (e) => { e.preventDefault(); scrollToSection(l.section!, l.href) } : undefined}
                    style={{
                      color: active ? '#C9A84C' : '#e2e8f0',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-montserrat)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      padding: '9px 18px',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.2s ease, background 0.2s ease',
                      lineHeight: 1,
                      display: 'block',
                      background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
                      fontWeight: active ? 600 : 400,
                      boxShadow: active ? 'inset 0 0 0 1px rgba(201,168,76,0.25)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.color = '#C9A84C'
                      el.style.background = 'rgba(201,168,76,0.1)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.color = active ? '#C9A84C' : '#e2e8f0'
                      el.style.background = active ? 'rgba(201,168,76,0.12)' : 'transparent'
                    }}
                  >
                    {l.label}
                  </a>
                )
              })}
              <Link
                href="/student"
                className="btn-press"
                style={{
                  background: '#C9A84C',
                  color: '#0F1829',
                  padding: '9px 22px',
                  borderRadius: '999px',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-montserrat)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid #C9A84C',
                  transition: 'background 0.2s cubic-bezier(0.23,1,0.32,1), transform 0.14s cubic-bezier(0.23,1,0.32,1), box-shadow 0.2s cubic-bezier(0.23,1,0.32,1)',
                  lineHeight: 1,
                  boxShadow: '0 2px 12px rgba(201,168,76,0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dbb95e'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.45)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#C9A84C'
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(201,168,76,0.3)'
                }}
              >
                Student Login <IconArrow />
              </Link>
            </div>

            {/* Mobile hamburger — 44×44 touch target */}
            <button
              className="md:hidden flex items-center justify-center btn-press"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              style={{
                background: pillBg,
                backdropFilter: 'blur(28px) saturate(200%) brightness(1.04)',
                WebkitBackdropFilter: 'blur(28px) saturate(200%) brightness(1.04)',
                border: pillBorder,
                borderRadius: '999px',
                color: '#C9A84C',
                width: '48px',
                height: '48px',
                cursor: 'pointer',
                transition: 'background 0.2s cubic-bezier(0.23,1,0.32,1)',
              }}
            >
              {menuOpen ? <IconClose /> : <IconMenu />}
            </button>
          </nav>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            className="md:hidden"
            style={{
              background: 'rgba(6,11,20,0.97)',
              backdropFilter: 'blur(24px) saturate(200%)',
              WebkitBackdropFilter: 'blur(24px) saturate(200%)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '20px',
              padding: '8px',
              margin: '8px 20px 0',
              pointerEvents: 'all',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {navLinks.map((l) => {
              if (l.dropdown) {
                const isExpanded = mobileDropdownOpen === l.label
                return (
                  <div key={l.label}>
                    <button
                      onClick={() => setMobileDropdownOpen(isExpanded ? null : l.label)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        color: isExpanded ? '#C9A84C' : '#cbd5e1',
                        background: isExpanded ? 'rgba(201,168,76,0.08)' : 'transparent',
                        border: 'none',
                        fontSize: '0.88rem',
                        fontFamily: 'var(--font-montserrat)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        padding: '14px 20px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'color 0.2s ease, background 0.2s ease',
                      }}
                    >
                      {l.label}
                      <span style={{ transition: 'transform 0.2s ease', transform: isExpanded ? 'rotate(180deg)' : 'none', display: 'flex' }}>
                        <IconChevronDown />
                      </span>
                    </button>
                    {isExpanded && (
                      <div style={{ paddingLeft: '16px', paddingBottom: '4px' }}>
                        {l.dropdown.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => { setMenuOpen(false); setMobileDropdownOpen(null) }}
                            style={{
                              display: 'block',
                              color: '#C9A84C',
                              textDecoration: 'none',
                              fontSize: '0.78rem',
                              fontFamily: 'var(--font-montserrat)',
                              letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                              padding: '11px 20px',
                              borderRadius: '10px',
                              borderLeft: '1px solid rgba(201,168,76,0.25)',
                              marginLeft: '4px',
                              transition: 'background 0.2s ease',
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.08)')}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={l.section
                    ? (e) => { e.preventDefault(); scrollToSection(l.section!, l.href); setMenuOpen(false) }
                    : () => setMenuOpen(false)
                  }
                  style={{
                    display: 'block',
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    fontFamily: 'var(--font-montserrat)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    transition: 'color 0.2s ease, background 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = '#C9A84C'
                    el.style.background = 'rgba(201,168,76,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = '#cbd5e1'
                    el.style.background = 'transparent'
                  }}
                >
                  {l.label}
                </a>
              )
            })}
            <div style={{ padding: '4px 8px 8px' }}>
              <Link
                href="/student"
                onClick={() => setMenuOpen(false)}
                className="btn-press"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  backgroundColor: '#C9A84C',
                  color: '#0F1829',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-montserrat)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Student Login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── MAIN CONTENT ───────────────────────────────────────── */}
      <main id="main-content">

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section
        className={`hero-bg${loadingHidden ? ' hero-active' : ''}`}
        aria-label="Hero"
        style={{
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: "url('/Background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Constellation canvas */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />

        {/* Radial vignette */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 80% 65% at 50% 50%, transparent 15%, rgba(6,11,20,0.88) 100%)',
          }}
        />

        {/* Bottom fade — blends hero into sections below */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '220px',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(5,8,14,0.7) 50%, rgba(5,8,14,0.98) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div
          className="hero-content-flex"
          style={{
            position: 'relative', zIndex: 1,
            height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'space-between',
            textAlign: 'center',
            padding: 'clamp(80px, 13vh, 140px) 24px clamp(60px, 10vh, 100px)',
          }}
        >
          {/* Overline — bilingual, desktop only */}
          <div
            className="hero-fade-item hidden md:block"
            style={{
              animationDelay: '80ms',
              opacity: 0,
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.65rem',
              letterSpacing: '0.45em',
              color: '#C9A84C',
              textTransform: 'uppercase',
            }}
          >
            — Al Rawdah Institutt —
          </div>

          {/* Main heading */}
          <h1
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: 'clamp(1.2rem, 4.9vw, 5.2rem)',
              fontWeight: 700,
              letterSpacing: '0.05em',
              lineHeight: 1.0,
              color: '#ffffff',
              textTransform: 'uppercase',
              margin: '0',
            }}
          >
            <AnimatedHeading text="ISLAMSKE VITENSKAPER" delay={180} />
            <AnimatedHeading text="OG ARABISK" delay={420} gradient="linear-gradient(90deg, #f5e090 0%, #C9A84C 40%, #e0a830 70%, #f5e090 100%)" />
          </h1>

          {/* Gold separator */}
          <div
            className="hero-fade-item"
            aria-hidden="true"
            style={{
              width: 64,
              height: 1,
              background: 'linear-gradient(to right, transparent, #C9A84C 40%, #C9A84C 60%, transparent)',
              margin: '0 auto',
              animationDelay: '1440ms',
              opacity: 0,
            }}
          />

          {/* Subtitle */}
          <p
            className="hero-fade-item"
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: 'clamp(1.15rem, 2.2vw, 1.5rem)',
              color: 'rgba(241,245,249,0.95)',
              fontWeight: 400,
              maxWidth: '42ch',
              lineHeight: 1.7,
              animationDelay: '1540ms',
              opacity: 0,
              letterSpacing: '0.02em',
            }}
          >
            Et treårig program for ungdom mellom 10 og 15 år. Lær Islam direkte fra de klassiske kildene.
          </p>

          {/* CTA button */}
          <a
            href="#pricing"
            className="hero-fade-item btn-press"
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.82rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#0F1829',
              background: '#C9A84C',
              padding: '16px 56px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 0,
              transition: 'background 0.22s cubic-bezier(0.23,1,0.32,1), transform 0.14s cubic-bezier(0.23,1,0.32,1), box-shadow 0.22s cubic-bezier(0.23,1,0.32,1)',
              animationDelay: '1760ms',
              opacity: 0,
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: '0 4px 24px rgba(201,168,76,0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#dbb95e'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(201,168,76,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#C9A84C'
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(201,168,76,0.25)'
            }}
          >
            Søk om plass
          </a>

          {/* Stats */}
          <div
            className="hero-fade-item"
            style={{
              display: 'flex',
              gap: 'clamp(20px, 4vw, 36px)',
              marginTop: 0,
              fontFamily: 'var(--font-montserrat)',
              fontSize: 'clamp(0.7rem, 1.2vw, 0.82rem)',
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.85)',
              textTransform: 'uppercase',
              animationDelay: '1960ms',
              opacity: 0,
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span>10–15 År</span>
            <span aria-hidden="true" style={{ color: 'rgba(201,168,76,0.35)', fontSize: '1.2em' }}>·</span>
            <span>30 Plasser</span>
            <span aria-hidden="true" style={{ color: 'rgba(201,168,76,0.35)', fontSize: '1.2em' }}>·</span>
            <span>September 2026</span>
          </div>
        </div>
      </section>

      </main>

      {/* ── SECTIONS BACKGROUND ─────────────────────────────────── */}
      <div className="sections-bg" style={{
        backgroundImage: "url('/Background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}>
        {/* Top fade — eases in from hero's dark bottom */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, rgba(5,8,14,0.98) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

      {/* ── MISSION & VISION ──────────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(72px, 10vw, 112px) clamp(20px, 5vw, 48px)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <SectionHeading>Misjon &amp; Visjon</SectionHeading>

          {/* Identity card */}
          <div style={{
            marginTop: '48px',
            marginBottom: '48px',
            backgroundColor: 'rgba(15,24,41,0.6)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(201,168,76,0.22)',
            borderRadius: '16px',
            padding: '40px 36px',
          }}>
            <div style={{ width: 32, height: 2, background: '#C9A84C', marginBottom: 24 }} aria-hidden="true" />
            <h3 style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.75rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: 16,
              fontWeight: 700,
            }}>
              Formål
            </h3>
            <p style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#e2e8f0',
              fontWeight: 400,
            }}>
              Mellom 10 og 15 år formes identitet som varer livet ut. Uten islamsk forankring fylles rommet av noe annet. Al Rawdah finnes for å gi ungdommen en direkte forbindelse til kildene.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {/* Mission card */}
            <div style={{
              backgroundColor: 'rgba(15,24,41,0.6)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(201,168,76,0.22)',
              borderRadius: '16px',
              padding: '40px 36px',
            }}>
              <div style={{ width: 32, height: 2, background: '#C9A84C', marginBottom: 24 }} aria-hidden="true" />
              <h3 style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.75rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#C9A84C',
                marginBottom: 16,
                fontWeight: 700,
              }}>
                Misjon
              </h3>
              <p style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: '#e2e8f0',
                fontWeight: 400,
              }}>
                Forme kunnskapsrike muslimer med trygg rotfesting i den islamske tradisjon, med arabisk som nøkkel til kildene.
              </p>
            </div>
            {/* Vision card */}
            <div style={{
              backgroundColor: 'rgba(15,24,41,0.6)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(201,168,76,0.22)',
              borderRadius: '16px',
              padding: '40px 36px',
            }}>
              <div style={{ width: 32, height: 2, background: '#C9A84C', marginBottom: 24 }} aria-hidden="true" />
              <h3 style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.75rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#C9A84C',
                marginBottom: 16,
                fontWeight: 700,
              }}>
                Visjon
              </h3>
              <p style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: '#e2e8f0',
                fontWeight: 400,
              }}>
                Gjøre autentisk islamsk kunnskap tilgjengelig for norsk ungdom gjennom strukturert og levende undervisning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CURRICULUM ─────────────────────────────────────────── */}
      <section
        ref={currRef}
        id="curriculum"
        className={`reveal-section${currRevealed ? ' revealed' : ''}`}
        style={{ padding: 'clamp(72px, 10vw, 112px) clamp(20px, 5vw, 48px)' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionHeading>Hva du vil lære</SectionHeading>
          <p style={{
            textAlign: 'center',
            color: '#94a3b8',
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 400,
            fontSize: '1.15rem',
            lineHeight: 1.65,
            marginBottom: '64px',
            marginTop: '20px',
          }}>
            To programmer som går parallelt: Islamske vitenskaper og Arabisk.
          </p>

          {/* Program: Islamske vitenskaper */}
          <div style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
              <span style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.65rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#C9A84C',
                border: '1px solid rgba(201,168,76,0.35)',
                padding: '6px 18px',
                borderRadius: '999px',
                whiteSpace: 'nowrap',
              }}>
                Program 1
              </span>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.08em', color: '#f1f5f9' }}>
                Islamske vitenskaper
              </div>
              <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.15)' }} aria-hidden="true" />
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px',
            }}>
              {ISLAMIC_SUBJECTS.map((s, i) => (
                <article
                  key={s.name}
                  className="reveal-card"
                  style={{
                    backgroundColor: 'rgba(10,18,34,0.45)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(201,168,76,0.18)',
                    borderRadius: '14px',
                    padding: '32px 28px',
                    transition: 'border-color 0.25s cubic-bezier(0.23,1,0.32,1), box-shadow 0.25s cubic-bezier(0.23,1,0.32,1), transform 0.25s cubic-bezier(0.23,1,0.32,1)',
                    animationDelay: `${i * 75}ms`,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'rgba(201,168,76,0.45)'
                    el.style.boxShadow = '0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(201,168,76,0.1)'
                    el.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'rgba(201,168,76,0.14)'
                    el.style.boxShadow = 'none'
                    el.style.transform = 'none'
                  }}
                >
                  <div style={{ width: 28, height: 1, background: '#C9A84C', marginBottom: 20, opacity: 0.7 }} aria-hidden="true" />
                  <h3 style={{
                    color: '#C9A84C',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-montserrat)',
                    letterSpacing: '0.14em',
                    fontWeight: 700,
                    marginBottom: 10,
                    textTransform: 'uppercase',
                  }}>
                    {s.name}
                  </h3>
                  <p style={{
                    color: '#cbd5e1',
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '1rem',
                    lineHeight: 1.65,
                    fontWeight: 400,
                    flex: 1,
                  }}>
                    {s.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* Program: Arabisk */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
              <span style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.65rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#C9A84C',
                border: '1px solid rgba(201,168,76,0.35)',
                padding: '6px 18px',
                borderRadius: '999px',
                whiteSpace: 'nowrap',
              }}>
                Program 2
              </span>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.08em', color: '#f1f5f9' }}>
                Arabisk
              </div>
              <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.15)' }} aria-hidden="true" />
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px',
            }}>
              {ARABIC_SUBJECTS.map((s, i) => (
                <article
                  key={s.name}
                  className="reveal-card"
                  style={{
                    backgroundColor: 'rgba(10,18,34,0.45)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(201,168,76,0.18)',
                    borderRadius: '14px',
                    padding: '32px 28px',
                    transition: 'border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
                    cursor: 'default',
                    animationDelay: `${i * 75}ms`,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'rgba(201,168,76,0.45)'
                    el.style.boxShadow = '0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(201,168,76,0.1)'
                    el.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'rgba(201,168,76,0.14)'
                    el.style.boxShadow = 'none'
                    el.style.transform = 'none'
                  }}
                >
                  <div style={{ width: 28, height: 1, background: '#C9A84C', marginBottom: 20, opacity: 0.7 }} aria-hidden="true" />
                  <h3 style={{
                    color: '#C9A84C',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-montserrat)',
                    letterSpacing: '0.14em',
                    fontWeight: 700,
                    marginBottom: 10,
                    textTransform: 'uppercase',
                  }}>
                    {s.name}
                  </h3>
                  <p style={{
                    color: '#cbd5e1',
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '1rem',
                    lineHeight: 1.65,
                    fontWeight: 400,
                  }}>
                    {s.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY AL RAWDAH ──────────────────────────────────────── */}
      <section style={{ padding: 'clamp(72px, 10vw, 112px) clamp(20px, 5vw, 48px)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <SectionHeading>Ikke nok en helgeskole</SectionHeading>
          <p style={{
            textAlign: 'center',
            color: '#94a3b8',
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 400,
            fontSize: '1.15rem',
            lineHeight: 1.65,
            marginTop: '20px',
            marginBottom: '56px',
          }}>
            Al Rawdah er ikke sporadisk moskeundervisning eller løsrevne helgetimer. Det er et strukturert treårig løp, med de samme elevene og lærerne gjennom hele programmet.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}>
            {[
              {
                title: 'Kontinuitet',
                desc: 'Samme 30 elever følges gjennom hele programmet, år for år.',
              },
              {
                title: 'Struktur',
                desc: 'En tydelig studieplan bygget på klassisk pensum.',
              },
              {
                title: 'Oppfølging',
                desc: 'Fremgang, oppmøte og tilbakemeldinger spores i studentportalen, synlig for både elev og foresatte.',
              },
              {
                title: 'Progresjon',
                desc: 'Hvert nivå bygger direkte på det forrige, mot et reelt sluttmål.',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                style={{
                  backgroundColor: 'rgba(10,18,34,0.45)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(201,168,76,0.18)',
                  borderRadius: '14px',
                  padding: '32px 28px',
                  transition: 'border-color 0.25s cubic-bezier(0.23,1,0.32,1), box-shadow 0.25s cubic-bezier(0.23,1,0.32,1)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(201,168,76,0.4)'
                  el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(201,168,76,0.18)'
                  el.style.boxShadow = 'none'
                }}
              >
                <div style={{ width: 28, height: 1, background: '#C9A84C', marginBottom: 20, opacity: 0.7 }} aria-hidden="true" />
                <h3 style={{
                  color: '#C9A84C',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-montserrat)',
                  letterSpacing: '0.14em',
                  fontWeight: 700,
                  marginBottom: 12,
                  textTransform: 'uppercase',
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: '#cbd5e1',
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '1rem',
                  lineHeight: 1.65,
                  fontWeight: 400,
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section
        ref={howRef}
        className={`reveal-section${howRevealed ? ' revealed' : ''}`}
        style={{ padding: 'clamp(72px, 10vw, 112px) clamp(20px, 5vw, 48px)' }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <SectionHeading>Slik fungerer det</SectionHeading>
          <p style={{
            color: '#cbd5e1',
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 400,
            fontSize: '1.15rem',
            marginBottom: '48px',
            marginTop: '20px',
          }}>
            De samme 30 studentene følger programmet gjennom tre skoleår.
          </p>

          {/* 3-year timeline */}
          <div
            className="reveal-card"
            style={{
              backgroundColor: 'rgba(10,18,34,0.52)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '56px',
              animationDelay: '0ms',
            }}
          >
            {/* Table header */}
            <div className="tl-header" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr auto',
              borderBottom: '1px solid rgba(201,168,76,0.15)',
              padding: '14px 32px',
            }}>
              {['År', 'Nivå', 'Semester'].map((h) => (
                <div key={h} style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(201,168,76,0.55)',
                }}>
                  {h}
                </div>
              ))}
              <div />
            </div>
            {/* Timeline rows */}
            {TIMELINE.map((row, i) => (
              <Link
                key={row.year}
                href={`/studieplan?nivå=${row.nivå}`}
                className="tl-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr auto',
                  padding: '20px 32px',
                  borderBottom: i < TIMELINE.length - 1 ? '1px solid rgba(201,168,76,0.08)' : 'none',
                  alignItems: 'center',
                  transition: 'background 0.2s ease',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.04)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
              >
                <div className="tl-year" style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '1.05rem',
                  color: '#cbd5e1',
                  fontWeight: 400,
                  textAlign: 'left',
                }}>
                  {row.year}
                </div>
                <div className="tl-level" style={{ textAlign: 'left' }}>
                  <span style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#C9A84C',
                    textTransform: 'uppercase',
                    display: 'block',
                  }}>
                    {row.level}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.95rem',
                    color: '#94a3b8',
                    fontWeight: 400,
                  }}>
                    {row.sub}
                  </span>
                </div>
                <div className="tl-sem" style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '1rem',
                  color: '#cbd5e1',
                  textAlign: 'left',
                }}>
                  {row.semesters}
                </div>
                <span
                  className="hidden sm:block"
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#C9A84C',
                    border: '1px solid rgba(201,168,76,0.3)',
                    padding: '6px 14px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#C9A84C'
                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)'
                    ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                >
                  Se studieplan →
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────── */}
      <section
        ref={pricingRef}
        id="pricing"
        className={`reveal-section${pricingRevealed ? ' revealed' : ''}`}
        style={{ padding: 'clamp(72px, 10vw, 112px) clamp(20px, 5vw, 48px)' }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <SectionHeading>Pris</SectionHeading>

          <div
            style={{
              backgroundColor: 'rgba(15,24,41,0.72)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: '20px',
              padding: 'clamp(40px, 8vw, 72px)',
              boxShadow: '0 2px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.06) inset',
              marginTop: '40px',
            }}
          >
            <span style={{
              display: 'inline-block',
              color: '#C9A84C',
              border: '1px solid rgba(201,168,76,0.35)',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.65rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              padding: '7px 22px',
              borderRadius: '999px',
              marginBottom: 28,
            }}>
              Månedlig
            </span>

            <h3 style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: 10,
              color: '#f1f5f9',
            }}>
              100 kr/mnd
            </h3>
            <p style={{
              color: '#cbd5e1',
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 400,
              fontSize: '1.1rem',
              marginBottom: 40,
              lineHeight: 1.6,
            }}>
              100 kr per måned. Maks 30 studenter per kull. Alle søkere kalles inn til intervju.
            </p>

            <ul style={{ textAlign: 'left', maxWidth: '300px', margin: '0 auto 44px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {FEATURES.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ flexShrink: 0, display: 'flex' }}><IconCheck /></span>
                  <span style={{ color: '#e2e8f0', fontFamily: 'var(--font-montserrat)', fontSize: '1.1rem', lineHeight: 1.4 }}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSftLc6RDvnztwOoIJgqj-szlmP5HuMJuoxp80sRsmx0c-1bdQ/viewform?usp=dialog"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.8rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#0F1829',
                background: '#C9A84C',
                padding: '16px 48px',
                textDecoration: 'none',
                display: 'inline-block',
                whiteSpace: 'nowrap',
                transition: 'background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
                cursor: 'pointer',
                fontWeight: 600,
                borderRadius: '2px',
                boxShadow: '0 4px 20px rgba(201,168,76,0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#dbb95e'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(201,168,76,0.35)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#C9A84C'
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.2)'
              }}
            >
              Søk om plass
            </a>
          </div>
        </div>

        {/* Slik søker du */}
        <div style={{ maxWidth: '900px', margin: '64px auto 0', textAlign: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
            justifyContent: 'center',
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.12)' }} aria-hidden="true" />
            <span style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.5)',
              whiteSpace: 'nowrap',
            }}>
              Slik søker du
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.12)' }} aria-hidden="true" />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
          }}>
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                className="reveal-card"
                style={{
                  animationDelay: `${i * 110}ms`,
                  backgroundColor: 'rgba(10,18,34,0.52)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: '16px',
                  padding: '36px 28px 32px',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: 'clamp(3.5rem, 7vw, 5.5rem)',
                  fontWeight: 300,
                  color: 'rgba(201,168,76,0.22)',
                  lineHeight: 1,
                  marginBottom: 20,
                  letterSpacing: '0.04em',
                  userSelect: 'none',
                }}>
                  {s.num}
                </div>
                <div style={{
                  color: '#C9A84C',
                  letterSpacing: '0.2em',
                  fontSize: '0.72rem',
                  marginBottom: 10,
                  fontFamily: 'var(--font-montserrat)',
                  textTransform: 'uppercase',
                }}>
                  Steg {s.num}
                </div>
                <h3 style={{
                  fontSize: '1.05rem',
                  fontFamily: 'var(--font-montserrat)',
                  letterSpacing: '0.06em',
                  fontWeight: 700,
                  marginBottom: 14,
                  color: '#ffffff',
                }}>
                  {s.title}
                </h3>
                <p style={{
                  color: '#e2e8f0',
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '1.15rem',
                  lineHeight: 1.75,
                  fontWeight: 400,
                }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section
        ref={faqRef}
        id="faq"
        className={`reveal-section${faqRevealed ? ' revealed' : ''}`}
        style={{ padding: 'clamp(72px, 10vw, 112px) clamp(20px, 5vw, 48px)' }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <SectionHeading>Vanlige spørsmål</SectionHeading>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '40px' }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="reveal-card"
                style={{
                  backgroundColor: openFaq === i ? 'rgba(10,18,34,0.65)' : 'rgba(10,18,34,0.42)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: `1px solid ${openFaq === i ? 'rgba(201,168,76,0.45)' : 'rgba(201,168,76,0.18)'}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  animationDelay: `${i * 80}ms`,
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: openFaq === i ? '0 4px 24px rgba(201,168,76,0.08)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (openFaq !== i)(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.28)'
                }}
                onMouseLeave={(e) => {
                  if (openFaq !== i)(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.14)'
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    padding: '22px 26px',
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    gap: '16px',
                    fontFamily: 'var(--font-montserrat)',
                    letterSpacing: '0.05em',
                    lineHeight: 1.4,
                    transition: 'color 0.3s ease',
                  }}
                >
                  <span>{faq.q}</span>
                  <svg
                    width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"
                    aria-hidden="true"
                    style={{
                      flexShrink: 0,
                      transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                {/* Smooth accordion — CSS grid trick, always rendered */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: openFaq === i ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{
                      padding: '0 26px 22px',
                      color: '#94a3b8',
                      fontFamily: 'var(--font-montserrat)',
                      fontWeight: 400,
                      fontSize: '0.88rem',
                      letterSpacing: '0.05em',
                      lineHeight: 1.75,
                    }}>
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer
        ref={footerRef}
        className={`reveal-section${footerRevealed ? ' revealed' : ''}`}
        style={{
          borderTop: '1px solid rgba(201,168,76,0.1)',
          padding: 'clamp(48px, 8vw, 80px) clamp(20px, 5vw, 48px)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{
              color: '#C9A84C',
              fontSize: '1.05rem',
              letterSpacing: '0.14em',
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}>
              Al Rawdah Institutt
            </div>
            <div
              className="arabic-text"
              style={{
                color: 'rgba(201,168,76,0.55)',
                fontSize: '0.95rem',
                marginTop: 4,
              }}
            >
              معهد الروضة
            </div>
          </div>
          <p style={{
            color: '#94a3b8',
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 400,
            fontSize: '1.05rem',
            marginBottom: 40,
            lineHeight: 1.6,
          }}>
            &ldquo;Å søke kunnskap er en plikt for enhver muslim&rdquo;
          </p>

          <nav aria-label="Footer navigation" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: 40 }}>
            {[
              { label: 'Hjem',      href: '/hjem',      section: 'top' },
              { label: 'Pensum',    href: '/pensum',     section: 'curriculum' },
              { label: 'Søknad',    href: '/søknad',     section: 'pricing' },
              { label: 'Artikler',  href: '/artikler' },
              { label: 'Spørsmål',  href: '/spørsmål',   section: 'faq' },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={'section' in l ? (e) => { e.preventDefault(); scrollToSection((l as { section: string }).section, l.href) } : undefined}
                style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-montserrat)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  transition: 'color 0.2s ease',
                  padding: '8px 16px',
                  borderRadius: '6px',
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#C9A84C')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#64748b')}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <p style={{ color: '#64748b', fontSize: '0.9rem', fontFamily: 'var(--font-montserrat)' }}>
            &copy; {new Date().getFullYear()} Al Rawdah Institutt. Alle rettigheter forbeholdt.
          </p>
        </div>
      </footer>

      </div>{/* end sections-bg */}
    </div>
  )
}
