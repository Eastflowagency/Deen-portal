'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/app/components/NavBar'

const LEVELS = [
  {
    id: 1,
    level: 'Nivå 1',
    name: 'Grunnivå',
    year: '2026–2027',
    islamic: [
      { name: 'Koranvitenskaper 1', slug: 'koranvitenskaper-1', desc: 'Grunnleggende tafseer, tajweed og koranvitenskapene.' },
      { name: 'Aqidah 1', slug: 'aqidah-1', desc: 'Grunnlaget i islamsk monoteisme og troslærens pilarer.' },
      { name: 'Fiqh 1', slug: 'fiqh-1', desc: 'Grunnleggende islamsk rettsvitenskap med regler og bevis.' },
      { name: 'Seerah 1', slug: 'seerah-1', desc: 'Profeten Muhammads ﷺ tidlige liv og kall.' },
      { name: 'Hadith 1', slug: 'hadith-1', desc: 'Introduksjon til hadithvitenskapen og de viktigste samlingene.' },
      { name: 'Adab al-Talib 1', slug: 'adab-al-talib-1', desc: 'Grunnleggende adab og egenskaper for kunnskapssøkere.' },
    ],
    arabic: [
      { name: 'Arabic 1a', slug: 'arabic-1a', semester: 'Høst' },
      { name: 'Arabic 1b', slug: 'arabic-1b', semester: 'Vår' },
    ],
  },
  {
    id: 2,
    level: 'Nivå 2',
    name: 'Mellomnivå',
    year: '2027–2028',
    islamic: [
      { name: 'Koranvitenskaper 2', slug: 'koranvitenskaper-2', desc: 'Fordypning i tafseer og koranvitenskapenes metodologi.' },
      { name: 'Aqidah 2', slug: 'aqidah-2', desc: 'Klassiske verk i aqidah og avvik fra rett tro.' },
      { name: 'Fiqh 2', slug: 'fiqh-2', desc: 'Fordypning i fiqh-kapitler med fokus på bevis fra Koranen og Sunnah.' },
      { name: 'Seerah 2', slug: 'seerah-2', desc: 'Profeten Muhammads ﷺ liv i Madinah og de store hendelsene.' },
      { name: 'Hadith 2', slug: 'hadith-2', desc: 'Studium av Sahih al-Bukhari og Muslim med forklaringer.' },
      { name: 'Tazkiyah 1', slug: 'tazkiyah-1', desc: 'Renselse av sjelen og dens sykdommer — basert på klassiske verk om tazkiyah.' },
    ],
    arabic: [
      { name: 'Arabic 2a', slug: 'arabic-2a', semester: 'Høst' },
      { name: 'Arabic 2b', slug: 'arabic-2b', semester: 'Vår' },
    ],
  },
  {
    id: 3,
    level: 'Nivå 3',
    name: 'Viderenivå',
    year: '2028–2029',
    islamic: [
      { name: 'Koranvitenskaper 3', slug: 'koranvitenskaper-3', desc: 'Avansert tafseer med selvstendige tekststudier på arabisk.' },
      { name: 'Aqidah 3', slug: 'aqidah-3', desc: 'Avansert aqidah med primærkilder på arabisk.' },
      { name: 'Fiqh 3', slug: 'fiqh-3', desc: 'Sammenlignende fiqh og ulikheter mellom de fire madhhabene.' },
      { name: 'Seerah 3', slug: 'seerah-3', desc: 'Dybdestudie av seerahkilder og den profetiske metodikkens relevans i dag.' },
      { name: 'Hadith 3', slug: 'hadith-3', desc: 'Selvstendige hadithstudier med original arabisk tekst.' },
      { name: 'Tazkiyah 2', slug: 'tazkiyah-2', desc: 'Avansert tazkiyah med primærkilder og praktisk anvendelse av sjelens renselse.' },
    ],
    arabic: [
      { name: 'Arabic 3a', slug: 'arabic-3a', semester: 'Høst' },
      { name: 'Arabic 3b', slug: 'arabic-3b', semester: 'Vår' },
    ],
  },
]

const SUBJECT_COLORS: Record<string, string> = {
  aqidah: 'rgb(160,132,232)',
  fiqh: 'rgb(56,189,248)',
  seerah: 'rgb(251,146,60)',
  koranvitenskaper: 'rgb(201,168,76)',
  hadith: 'rgb(248,113,113)',
  'adab-al-talib': 'rgb(52,211,153)',
  tazkiyah: 'rgb(52,211,153)',
  arabic: 'rgb(99,179,237)',
}

function getSubjectColor(slug: string): string {
  const key = Object.keys(SUBJECT_COLORS).find((k) => slug.startsWith(k))
  return key ? SUBJECT_COLORS[key] : 'rgb(201,168,76)'
}

function getSubjectLabel(slug: string): string {
  if (slug.startsWith('koranvitenskaper')) return 'Koranvitenskaper'
  if (slug.startsWith('aqidah')) return 'Aqidah'
  if (slug.startsWith('fiqh')) return 'Fiqh'
  if (slug.startsWith('seerah')) return 'Seerah'
  if (slug.startsWith('hadith')) return 'Hadith'
  if (slug.startsWith('adab-al-talib')) return 'Adab og Tazkiyah'
  if (slug.startsWith('tazkiyah')) return 'Adab og Tazkiyah'
  if (slug.startsWith('arabic')) return 'Arabisk'
  return 'Kurs'
}

export default function StudieplanPage() {
  const params = useSearchParams()
  const nivåParam = Number(params.get('nivå'))
  const [activeLevel, setActiveLevel] = useState(nivåParam >= 1 && nivåParam <= 3 ? nivåParam : 1)
  const current = LEVELS[activeLevel - 1]

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <style>{`
        .sp-card-link { text-decoration: none; display: block; }
        .sp-card-inner {
          transition: border-color 0.22s cubic-bezier(0.23,1,0.32,1), background 0.22s cubic-bezier(0.23,1,0.32,1), transform 0.22s cubic-bezier(0.23,1,0.32,1), box-shadow 0.22s cubic-bezier(0.23,1,0.32,1);
        }
        .sp-card-link:hover .sp-card-inner {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.45);
        }
        @media (max-width: 767px) {
          .sp-content { padding: 90px 16px 60px !important; }
          .sp-tab-btn { padding: 9px 14px !important; font-size: 0.63rem !important; letter-spacing: 0.12em !important; }
          .sp-banner { gap: 12px !important; padding: 12px 16px !important; }
          .sp-grid { grid-template-columns: 1fr !important; }
          .sp-grid-sm { grid-template-columns: 1fr !important; }
          .sp-divider-text { font-size: 0.6rem !important; letter-spacing: 0.18em !important; }
        }
      `}</style>
      {/* Dark overlay — matches home/artikler */}
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,11,20,0.72)', pointerEvents: 'none', zIndex: 0 }} />

      <NavBar />

      {/* Content */}
      <div className="sp-content" style={{ position: 'relative', zIndex: 1, maxWidth: '1240px', margin: '0 auto', padding: 'clamp(90px,8vw,110px) clamp(20px,5vw,60px) clamp(60px,8vw,100px)' }}>

        {/* Header */}
        <div style={{ marginBottom: '56px' }}>
          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: '#C9A84C', margin: '0 0 18px' }}>
            STUDIEPLAN /
          </p>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2.6rem, 7vw, 5.2rem)', fontWeight: 700, fontStyle: 'italic', lineHeight: 1.04, letterSpacing: '-0.01em', color: '#fff', margin: '0 0 24px' }}>
            Islamske Vitenskaper
          </h1>
          <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(201,168,76,0.45), rgba(201,168,76,0.08) 55%, transparent)', marginBottom: '20px' }} />
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.75rem,1.4vw,0.9rem)', color: 'rgba(203,213,225,0.6)', lineHeight: 1.75, maxWidth: '480px' }}>
            Tre år med islamske vitenskaper og arabisk — fra grunnivå til viderenivå.
          </p>
        </div>

        {/* Level Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '48px', flexWrap: 'wrap' }}>
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLevel(l.id)}
              className="btn-press sp-tab-btn"
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.7rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '12px 32px',
                border: activeLevel === l.id ? '1px solid #C9A84C' : '1px solid rgba(201,168,76,0.25)',
                background: activeLevel === l.id ? 'rgba(201,168,76,0.12)' : 'transparent',
                color: activeLevel === l.id ? '#C9A84C' : '#94a3b8',
                cursor: 'pointer',
                borderRadius: '4px',
                transition: 'border-color 0.2s cubic-bezier(0.23,1,0.32,1), background 0.2s cubic-bezier(0.23,1,0.32,1)',
              }}
              onMouseEnter={(e) => {
                if (activeLevel !== l.id) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.5)'
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0'
                }
              }}
              onMouseLeave={(e) => {
                if (activeLevel !== l.id) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.25)'
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'
                }
              }}
            >
              {l.level} — {l.name}
            </button>
          ))}
        </div>

        {/* Level Info Banner */}
        <div className="sp-banner" style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px',
          marginBottom: '40px',
          padding: '16px 32px',
          background: 'rgba(201,168,76,0.06)',
          border: '1px solid rgba(201,168,76,0.15)',
          borderRadius: '6px',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.8rem', letterSpacing: '0.2em', color: '#C9A84C', textTransform: 'uppercase' }}>
            {current.year}
          </span>
          <span style={{ color: 'rgba(201,168,76,0.3)', fontSize: '0.7rem' }}>·</span>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.8rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>
            Høst + Vår semester
          </span>
        </div>

        {/* Program 1: Islamske vitenskaper */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(201,168,76,0.12)' }} />
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', letterSpacing: '0.25em', color: '#C9A84C', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Program 1 — Islamske vitenskaper
            </p>
            <div style={{ flex: 1, height: '1px', background: 'rgba(201,168,76,0.12)' }} />
          </div>

          <div className="sp-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px,100%), 1fr))', gap: '16px' }}>
            {current.islamic.map((course) => {
              const accent = getSubjectColor(course.slug)
              const label = getSubjectLabel(course.slug)
              return (
                <Link
                  key={course.slug}
                  href={`/studieplan/${course.slug}`}
                  className="sp-card-link"
                >
                  <div
                    className="sp-card-inner"
                    style={{
                      padding: '22px 24px 20px',
                      background: 'rgba(10,16,30,0.75)',
                      border: `1px solid rgba(255,255,255,0.07)`,
                      borderRadius: '8px',
                      backdropFilter: 'blur(12px)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '160px',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.borderColor = accent.replace('rgb(', 'rgba(').replace(')', ', 0.35)')
                      el.style.background = 'rgba(15,24,41,0.85)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.borderColor = 'rgba(255,255,255,0.07)'
                      el.style.background = 'rgba(10,16,30,0.75)'
                    }}
                  >
                    {/* Category label */}
                    <p style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.28em',
                      color: '#C9A84C',
                      textTransform: 'uppercase',
                      marginBottom: '12px',
                      fontWeight: 700,
                    }}>
                      {label}
                    </p>
                    {/* Course name */}
                    <h3 style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                      fontWeight: 700,
                      color: '#f1f5f9',
                      lineHeight: 1.35,
                      marginBottom: '10px',
                      flex: 1,
                    }}>
                      {course.name}
                    </h3>
                    {/* Description */}
                    <p style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: '0.82rem',
                      color: '#64748b',
                      lineHeight: 1.6,
                      marginBottom: '16px',
                    }}>
                      {course.desc}
                    </p>
                    {/* CTA */}
                    <p style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: '0.65rem',
                      letterSpacing: '0.2em',
                      color: accent,
                      textTransform: 'uppercase',
                      fontWeight: 700,
                    }}>
                      Se kurs →
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Program 2: Arabisk */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(201,168,76,0.12)' }} />
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', letterSpacing: '0.25em', color: '#C9A84C', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Program 2 — Arabisk
            </p>
            <div style={{ flex: 1, height: '1px', background: 'rgba(201,168,76,0.12)' }} />
          </div>

          <div className="sp-grid-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px,100%), 1fr))', gap: '16px' }}>
            {current.arabic.map((course) => {
              const accent = SUBJECT_COLORS['arabic']
              return (
                <Link
                  key={course.slug}
                  href={`/studieplan/${course.slug}`}
                  className="sp-card-link"
                >
                  <div
                    className="sp-card-inner"
                    style={{
                      padding: '22px 24px 20px',
                      background: 'rgba(10,16,30,0.75)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(12px)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.borderColor = 'rgba(99,179,237,0.35)'
                      el.style.background = 'rgba(15,24,41,0.85)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.borderColor = 'rgba(255,255,255,0.07)'
                      el.style.background = 'rgba(10,16,30,0.75)'
                    }}
                  >
                    <p style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.28em',
                      color: '#C9A84C',
                      textTransform: 'uppercase',
                      marginBottom: '12px',
                      fontWeight: 700,
                    }}>
                      Arabisk
                    </p>
                    <h3 style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                      fontWeight: 700,
                      color: '#f1f5f9',
                      marginBottom: '6px',
                    }}>
                      {course.name}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.14em',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      marginBottom: '16px',
                    }}>
                      {course.semester} semester
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: '0.65rem',
                      letterSpacing: '0.2em',
                      color: accent,
                      textTransform: 'uppercase',
                      fontWeight: 700,
                    }}>
                      Se kurs →
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
