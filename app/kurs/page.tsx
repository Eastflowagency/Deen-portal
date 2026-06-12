'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/app/components/NavBar'

const SUBJECTS = [
  {
    name: 'Koranvitenskaper',
    arabic: 'علوم القرآن',
    desc: 'Tafseer, tajweed og koranvitenskapene — fra grunnivå til avansert lesning av primærkilder.',
    courses: [
      { name: 'Koranvitenskaper 1', slug: 'koranvitenskaper-1', level: 'Grunnivå', nivå: 1, year: '2026–2027' },
      { name: 'Koranvitenskaper 2', slug: 'koranvitenskaper-2', level: 'Mellomnivå', nivå: 2, year: '2027–2028' },
      { name: 'Koranvitenskaper 3', slug: 'koranvitenskaper-3', level: 'Viderenivå', nivå: 3, year: '2028–2029' },
    ],
  },
  {
    name: 'Aqidah',
    arabic: 'العقيدة',
    desc: 'Islamsk monoteisme, grunnlag og pilarer — fra introduksjon til selvstendige studier på arabisk.',
    courses: [
      { name: 'Aqidah 1', slug: 'aqidah-1', level: 'Grunnivå', nivå: 1, year: '2026–2027' },
      { name: 'Aqidah 2', slug: 'aqidah-2', level: 'Mellomnivå', nivå: 2, year: '2027–2028' },
      { name: 'Aqidah 3', slug: 'aqidah-3', level: 'Viderenivå', nivå: 3, year: '2028–2029' },
    ],
  },
  {
    name: 'Fiqh',
    arabic: 'الفقه',
    desc: 'Islamsk rettsvitenskap med regler og bevis — fra grunnleggende ibadah til sammenlignende fiqh.',
    courses: [
      { name: 'Fiqh 1', slug: 'fiqh-1', level: 'Grunnivå', nivå: 1, year: '2026–2027' },
      { name: 'Fiqh 2', slug: 'fiqh-2', level: 'Mellomnivå', nivå: 2, year: '2027–2028' },
      { name: 'Fiqh 3', slug: 'fiqh-3', level: 'Viderenivå', nivå: 3, year: '2028–2029' },
    ],
  },
  {
    name: 'Seerah',
    arabic: 'السيرة',
    desc: 'Profeten Muhammads ﷺ liv og biografi — fra kallet i Makkah til det profetiske arvet.',
    courses: [
      { name: 'Seerah 1', slug: 'seerah-1', level: 'Grunnivå', nivå: 1, year: '2026–2027' },
      { name: 'Seerah 2', slug: 'seerah-2', level: 'Mellomnivå', nivå: 2, year: '2027–2028' },
      { name: 'Seerah 3', slug: 'seerah-3', level: 'Viderenivå', nivå: 3, year: '2028–2029' },
    ],
  },
  {
    name: 'Hadith',
    arabic: 'الحديث',
    desc: 'Profetens ﷺ ord, handlinger og godkjennelser — fra introduksjon til selvstendige tekststudier.',
    courses: [
      { name: 'Hadith 1', slug: 'hadith-1', level: 'Grunnivå', nivå: 1, year: '2026–2027' },
      { name: 'Hadith 2', slug: 'hadith-2', level: 'Mellomnivå', nivå: 2, year: '2027–2028' },
      { name: 'Hadith 3', slug: 'hadith-3', level: 'Viderenivå', nivå: 3, year: '2028–2029' },
    ],
  },
  {
    name: 'Adab al-Talib',
    arabic: 'أدب الطالب',
    desc: 'Oppførselen og egenskapene til en kunnskapssøker — etikk, metode og islamsk læringskultur.',
    courses: [
      { name: 'Adab al-Talib 1', slug: 'adab-al-talib-1', level: 'Grunnivå', nivå: 1, year: '2026–2027' },
      { name: 'Adab al-Talib 2', slug: 'adab-al-talib-2', level: 'Mellomnivå', nivå: 2, year: '2027–2028' },
      { name: 'Adab al-Talib 3', slug: 'adab-al-talib-3', level: 'Viderenivå', nivå: 3, year: '2028–2029' },
    ],
  },
]

const ARABIC_COURSES = [
  { name: 'Arabic 1a', slug: 'arabic-1a', nivå: 1, semester: 'Høst 2026', desc: 'Alfabet, grunnvokabular og enkle setninger.' },
  { name: 'Arabic 1b', slug: 'arabic-1b', nivå: 1, semester: 'Vår 2027', desc: 'Verbformer, koranisk arabisk introduksjon.' },
  { name: 'Arabic 2a', slug: 'arabic-2a', nivå: 2, semester: 'Høst 2027', desc: 'Grammatikk (i\'rab), lesing av islamske tekster.' },
  { name: 'Arabic 2b', slug: 'arabic-2b', nivå: 2, semester: 'Vår 2028', desc: 'Morfologi (sarf), ordbøker og klassisk prosa.' },
  { name: 'Arabic 3a', slug: 'arabic-3a', nivå: 3, semester: 'Høst 2028', desc: 'Selvstendige tekststudier, balagah introduksjon.' },
  { name: 'Arabic 3b', slug: 'arabic-3b', nivå: 3, semester: 'Vår 2029', desc: 'Avansert arabisk, akademisk skriving, avsluttende prosjekt.' },
]

const LEVEL_COLORS = {
  1: { text: 'rgba(100,200,130,0.9)', bg: 'rgba(100,200,130,0.08)', border: 'rgba(100,200,130,0.25)', label: 'Grunnivå' },
  2: { text: '#C9A84C', bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.3)', label: 'Mellomnivå' },
  3: { text: 'rgba(180,140,220,0.9)', bg: 'rgba(180,140,220,0.08)', border: 'rgba(180,140,220,0.3)', label: 'Viderenivå' },
}

const FILTERS = [
  { id: 0, label: 'Alle kurs' },
  { id: 1, label: 'Nivå 1 — Grunnivå' },
  { id: 2, label: 'Nivå 2 — Mellomnivå' },
  { id: 3, label: 'Nivå 3 — Viderenivå' },
]

export default function KursPage() {
  const params = useSearchParams()
  const filterParam = Number(params.get('filter'))
  const [activeFilter, setActiveFilter] = useState(filterParam >= 1 && filterParam <= 3 ? filterParam : 0)

  const filteredArabic = activeFilter === 0
    ? ARABIC_COURSES
    : ARABIC_COURSES.filter((c) => c.nivå === activeFilter)

  return (
    <div style={{ minHeight: '100vh', backgroundImage: "url('/Background.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', backgroundColor: '#060b14' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,11,20,0.83)', pointerEvents: 'none', zIndex: 0 }} />
      <NavBar />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1160px', margin: '0 auto', padding: '130px 24px 80px' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.62rem', letterSpacing: '0.3em', color: '#C9A84C', marginBottom: '14px', textTransform: 'uppercase' }}>
            — AL RAWDAH INSTITUTT —
          </p>
          <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 700, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>
            Kurs
          </h1>
          <div style={{ width: '56px', height: '1px', background: 'linear-gradient(to right, transparent, #C9A84C, transparent)', margin: '0 auto 18px' }} />
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', maxWidth: '540px', margin: '0 auto' }}>
            24 kurs over tre år — hvert fag bygger fra grunnivå til primærkilder.
          </p>
        </div>

        {/* ── Level filter tabs ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '56px', flexWrap: 'wrap' }}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              style={{
                fontFamily: 'var(--font-cinzel)',
                fontSize: '0.65rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                padding: '10px 24px',
                border: activeFilter === f.id ? '1px solid #C9A84C' : '1px solid rgba(201,168,76,0.2)',
                background: activeFilter === f.id ? 'rgba(201,168,76,0.12)' : 'transparent',
                color: activeFilter === f.id ? '#C9A84C' : '#94a3b8',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Program 1: Islamske vitenskaper ── */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '36px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(201,168,76,0.1)' }} />
            <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.58rem', letterSpacing: '0.28em', color: '#C9A84C', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Program 1 — Islamske vitenskaper
            </p>
            <div style={{ flex: 1, height: '1px', background: 'rgba(201,168,76,0.1)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {SUBJECTS.map((subject, si) => {
              const visible = activeFilter === 0
                ? subject.courses
                : subject.courses.filter((c) => c.nivå === activeFilter)
              if (visible.length === 0) return null

              return (
                <div
                  key={subject.name}
                  style={{
                    background: 'rgba(15,24,41,0.55)',
                    border: '1px solid rgba(201,168,76,0.12)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(16px)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Subject header */}
                  <div style={{ padding: '20px 28px 16px', borderBottom: '1px solid rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '8px',
                        background: 'rgba(201,168,76,0.1)',
                        border: '1px solid rgba(201,168,76,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-cinzel)', fontSize: '0.75rem', color: '#C9A84C', fontWeight: 700,
                        flexShrink: 0,
                      }}>
                        {si + 1}
                      </div>
                      <div>
                        <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.9rem', letterSpacing: '0.1em', color: '#f1f5f9', marginBottom: '3px' }}>
                          {subject.name}
                        </h2>
                        <p style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem', color: 'rgba(201,168,76,0.6)', direction: 'rtl' }}>
                          {subject.arabic}
                        </p>
                      </div>
                    </div>
                    <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '0.95rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', textAlign: 'right', maxWidth: '360px', display: 'none' }}>
                      {subject.desc}
                    </p>
                  </div>

                  {/* Subject description */}
                  <div style={{ padding: '12px 28px 0' }}>
                    <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>
                      {subject.desc}
                    </p>
                  </div>

                  {/* Course cards row */}
                  <div style={{ padding: '16px 28px 24px', display: 'flex', gap: '0', alignItems: 'stretch' }}>
                    {visible.map((course, ci) => {
                      const lc = LEVEL_COLORS[course.nivå as 1 | 2 | 3]
                      const isLast = ci === visible.length - 1
                      return (
                        <div key={course.slug} style={{ display: 'flex', alignItems: 'stretch', flex: 1 }}>
                          <Link href={`/kurs/${course.slug}`} style={{ textDecoration: 'none', flex: 1 }}>
                            <div
                              style={{
                                padding: '16px 18px',
                                background: lc.bg,
                                border: `1px solid ${lc.border}`,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                height: '100%',
                              }}
                              onMouseEnter={(e) => {
                                const el = e.currentTarget as HTMLDivElement
                                el.style.background = `rgba(201,168,76,0.12)`
                                el.style.borderColor = '#C9A84C'
                                el.style.transform = 'translateY(-2px)'
                              }}
                              onMouseLeave={(e) => {
                                const el = e.currentTarget as HTMLDivElement
                                el.style.background = lc.bg
                                el.style.borderColor = lc.border
                                el.style.transform = 'none'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{
                                  fontFamily: 'var(--font-cinzel)', fontSize: '0.5rem', letterSpacing: '0.16em',
                                  color: lc.text, textTransform: 'uppercase',
                                  padding: '3px 8px', borderRadius: '3px',
                                  background: `${lc.bg}`,
                                  border: `1px solid ${lc.border}`,
                                }}>
                                  {lc.label}
                                </span>
                                <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: '0.7rem' }}>→</span>
                              </div>
                              <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.78rem', letterSpacing: '0.08em', color: '#e2e8f0', marginBottom: '6px' }}>
                                {course.name}
                              </h3>
                              <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.5rem', letterSpacing: '0.12em', color: '#475569', textTransform: 'uppercase' }}>
                                {course.year}
                              </p>
                            </div>
                          </Link>
                          {/* Progression arrow between cards */}
                          {!isLast && activeFilter === 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', flexShrink: 0 }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                              </svg>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Program 2: Arabisk ── */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '36px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(201,168,76,0.1)' }} />
            <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.58rem', letterSpacing: '0.28em', color: '#C9A84C', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Program 2 — Arabisk
            </p>
            <div style={{ flex: 1, height: '1px', background: 'rgba(201,168,76,0.1)' }} />
          </div>

          <div
            style={{
              background: 'rgba(15,24,41,0.55)',
              border: '1px solid rgba(201,168,76,0.12)',
              borderRadius: '12px',
              backdropFilter: 'blur(16px)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '20px 28px 16px', borderBottom: '1px solid rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-cinzel)', fontSize: '0.75rem', color: '#C9A84C', fontWeight: 700, flexShrink: 0 }}>
                ع
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.9rem', letterSpacing: '0.1em', color: '#f1f5f9', marginBottom: '3px' }}>Arabisk</h2>
                <p style={{ fontFamily: 'var(--font-arabic)', fontSize: '0.85rem', color: 'rgba(201,168,76,0.6)', direction: 'rtl' }}>اللغة العربية</p>
              </div>
            </div>
            <div style={{ padding: '12px 28px 0' }}>
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>
                Klassisk arabisk grammatikk, vokabular og lesekomprehensjon. To semesterkurs per nivå — Høst og Vår.
              </p>
            </div>
            <div style={{ padding: '16px 28px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {filteredArabic.map((course) => {
                const lc = LEVEL_COLORS[course.nivå as 1 | 2 | 3]
                return (
                  <Link key={course.slug} href={`/kurs/${course.slug}`} style={{ textDecoration: 'none' }}>
                    <div
                      style={{ padding: '16px 18px', background: lc.bg, border: `1px solid ${lc.border}`, borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLDivElement
                        el.style.background = 'rgba(201,168,76,0.12)'
                        el.style.borderColor = '#C9A84C'
                        el.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLDivElement
                        el.style.background = lc.bg
                        el.style.borderColor = lc.border
                        el.style.transform = 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.5rem', letterSpacing: '0.14em', color: lc.text, textTransform: 'uppercase' }}>
                          {course.semester}
                        </span>
                        <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: '0.7rem' }}>→</span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.82rem', letterSpacing: '0.08em', color: '#e2e8f0', marginBottom: '6px' }}>
                        {course.name}
                      </h3>
                      <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', lineHeight: 1.4 }}>
                        {course.desc}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '12px' }}>
          <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.6rem', letterSpacing: '0.25em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '12px' }}>
            Se kursene per nivå
          </p>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', marginBottom: '24px' }}>
            Studieplan viser hvilke kurs som hører til hvert år
          </p>
          <Link
            href="/studieplan"
            style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0F1829', background: '#C9A84C', padding: '13px 40px', textDecoration: 'none', display: 'inline-block', borderRadius: '4px' }}
          >
            Åpne studieplan
          </Link>
        </div>
      </div>
    </div>
  )
}
