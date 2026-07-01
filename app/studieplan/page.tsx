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
      { name: 'Adab al-Talib 2', slug: 'adab-al-talib-2', desc: 'Dypere studium av lærernes metoder og kunnskapens verdier.' },
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
      { name: 'Adab al-Talib 3', slug: 'adab-al-talib-3', desc: 'Avanserte verker om læringskultur og islamsk etikk i praksis.' },
    ],
    arabic: [
      { name: 'Arabic 3a', slug: 'arabic-3a', semester: 'Høst' },
      { name: 'Arabic 3b', slug: 'arabic-3b', semester: 'Vår' },
    ],
  },
]

export default function StudieplanPage() {
  const params = useSearchParams()
  const nivåParam = Number(params.get('nivå'))
  const [activeLevel, setActiveLevel] = useState(nivåParam >= 1 && nivåParam <= 3 ? nivåParam : 1)
  const current = LEVELS[activeLevel - 1]

  return (
    <div
      className="page-bg"
      style={{
        minHeight: '100vh',
        backgroundImage: "url('/Background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: '#060b14',
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          .page-bg { background-attachment: scroll !important; }
          .sp-content { padding: 90px 16px 60px !important; }
          .sp-tab-btn { padding: 9px 14px !important; font-size: 0.63rem !important; letter-spacing: 0.12em !important; }
          .sp-banner { gap: 12px !important; padding: 12px 16px !important; }
          .sp-grid { grid-template-columns: 1fr !important; }
          .sp-grid-sm { grid-template-columns: 1fr !important; }
          .sp-divider-text { font-size: 0.6rem !important; letter-spacing: 0.18em !important; }
        }
      `}</style>
      {/* Dark overlay */}
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,11,20,0.82)', pointerEvents: 'none', zIndex: 0 }} />

      <NavBar />

      {/* Content */}
      <div className="sp-content" style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '130px 24px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', letterSpacing: '0.3em', color: '#C9A84C', marginBottom: '16px', textTransform: 'uppercase' }}>
            — AL RAWDAH INSTITUTT —
          </p>
          <h1 style={{ fontFamily: 'var(--font-montserrat)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Studieplan
          </h1>
          <div style={{ width: '56px', height: '1px', background: 'linear-gradient(to right, transparent, #C9A84C, transparent)', margin: '0 auto 20px' }} />
          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '1.05rem', color: '#94a3b8', fontWeight: 400, maxWidth: '520px', margin: '0 auto', lineHeight: 1.65 }}>
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
            {current.islamic.map((course) => (
              <Link
                key={course.slug}
                href={`/studieplan/${course.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    padding: '20px 24px',
                    background: 'rgba(15,24,41,0.6)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(12px)',
                    transition: 'border-color 0.2s cubic-bezier(0.23,1,0.32,1), background 0.2s cubic-bezier(0.23,1,0.32,1)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'rgba(201,168,76,0.45)'
                    el.style.background = 'rgba(201,168,76,0.07)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'rgba(201,168,76,0.15)'
                    el.style.background = 'rgba(15,24,41,0.6)'
                  }}
                >
                  <h3 style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.9rem', letterSpacing: '0.1em', color: '#e2e8f0', marginBottom: '8px' }}>
                    {course.name}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.65, fontWeight: 400 }}>
                    {course.desc}
                  </p>
                  <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.78rem', letterSpacing: '0.18em', color: '#C9A84C', marginTop: '12px', textTransform: 'uppercase' }}>
                    Se kurs →
                  </p>
                </div>
              </Link>
            ))}
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
            {current.arabic.map((course) => (
              <Link
                key={course.slug}
                href={`/studieplan/${course.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    padding: '20px 24px',
                    background: 'rgba(15,24,41,0.6)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(12px)',
                    transition: 'border-color 0.2s cubic-bezier(0.23,1,0.32,1), background 0.2s cubic-bezier(0.23,1,0.32,1)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'rgba(201,168,76,0.45)'
                    el.style.background = 'rgba(201,168,76,0.07)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'rgba(201,168,76,0.15)'
                    el.style.background = 'rgba(15,24,41,0.6)'
                  }}
                >
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.9rem', letterSpacing: '0.1em', color: '#e2e8f0', marginBottom: '4px' }}>
                      {course.name}
                    </h3>
                    <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.78rem', letterSpacing: '0.18em', color: '#94a3b8', textTransform: 'uppercase' }}>
                      {course.semester} semester
                    </p>
                  </div>
                  <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.78rem', letterSpacing: '0.18em', color: '#C9A84C', textTransform: 'uppercase' }}>
                    Se kurs →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
