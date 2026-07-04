import NavBar from '@/app/components/NavBar'

export const metadata = {
  title: 'Les — Al Rawdah Institutt',
  description: 'Islamske e-bøker og ressurser. Lær om tro, fiqh, arabisk og profetens sunnah.',
}

// ── Data ──────────────────────────────────────────────────────────────────────

const SPOTLIGHT = {
  category: 'Koran-vitenskaper',
  title: 'Forandret av Koranen',
  description:
    'En praktisk guide for å fjerne de åndelige og intellektuelle hindringene mellom enhver muslim og deres personlige, transformative forhold til Koranen — fra grunn til blad.',
  author: 'Sheikh Mohammad Elshinawy',
  publisher: 'Yaqeen Institute',
  href: 'https://yaqeeninstitute.org/read/paper/changed-by-the-quran',
}

interface Book {
  id: number
  category: string
  title: string
  author: string
  href: string
  bg: string
  accentColor: string
  textDark?: boolean
}

const BOOKS: Book[] = [
  {
    id: 1,
    category: 'Koran-vitenskaper',
    title: 'Koran 30 for 30: Livsleksjoner',
    author: 'Dr. Omar Suleiman & Sh. Ismail Kamdar',
    href: 'https://yaqeeninstitute.org/read/books',
    bg: 'linear-gradient(145deg, #ece6d8 0%, #c8bfa4 100%)',
    accentColor: '#0d2a6e',
    textDark: true,
  },
  {
    id: 2,
    category: 'Salah',
    title: 'Salahens Hemmeligheter',
    author: 'Dr. Omar Suleiman',
    href: 'https://yaqeeninstitute.org/read/books',
    bg: 'linear-gradient(170deg, #0c0a06 0%, #241504 45%, #3a2210 100%)',
    accentColor: '#c9a84c',
  },
  {
    id: 3,
    category: 'Aqidah',
    title: 'Den Rette Sti',
    author: 'Dr. Nazir Khan',
    href: 'https://yaqeeninstitute.org/read/books',
    bg: 'linear-gradient(145deg, #f0ede6 0%, #ddd6c8 100%)',
    accentColor: '#1a2a6e',
    textDark: true,
  },
  {
    id: 4,
    category: 'Hadith',
    title: '40 Profetiske Hadither om Helse og Velvære',
    author: 'Dr. Hatem al-Haj',
    href: 'https://yaqeeninstitute.org/read/books',
    bg: 'linear-gradient(145deg, #e4f0ec 0%, #bcdfd2 100%)',
    accentColor: '#145232',
    textDark: true,
  },
  {
    id: 5,
    category: 'Koran-vitenskaper',
    title: 'Koran 30 for 30: Tematisk Tafsir',
    author: 'Dr. Omar Suleiman & Sh. Ismail Kamdar',
    href: 'https://yaqeeninstitute.org/read/books',
    bg: 'linear-gradient(170deg, #060f1e 0%, #0d1f42 45%, #163060 100%)',
    accentColor: '#3a80c0',
  },
  {
    id: 6,
    category: 'Dhikr & Ibadah',
    title: 'Dypere inn i Dhikr',
    author: 'Dr. Omar Suleiman',
    href: 'https://yaqeeninstitute.org/read/books',
    bg: 'linear-gradient(170deg, #060810 0%, #0e1225 50%, #181d3c 100%)',
    accentColor: '#c9a84c',
  },
]

// ── Spotlight cover ───────────────────────────────────────────────────────────

function SpotlightCover() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '2/3',
      borderRadius: '10px',
      overflow: 'hidden',
      background: 'linear-gradient(170deg, #04081e 0%, #091a5a 35%, #1235a8 65%, #1f4fd4 100%)',
      boxShadow: '0 32px 80px rgba(0,0,0,0.75), 0 12px 32px rgba(0,0,0,0.5)',
    }}>
      {/* Grid pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(255,255,255,0.025) 30px, rgba(255,255,255,0.025) 31px), ' +
          'repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(255,255,255,0.025) 30px, rgba(255,255,255,0.025) 31px)',
      }} />
      {/* Divine light ray */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 55px 200px at 50% -5%, rgba(200,220,255,0.7) 0%, rgba(180,200,255,0.25) 35%, transparent 65%)',
      }} />
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 220px 300px at 50% 25%, rgba(40,100,220,0.18) 0%, transparent 60%)',
      }} />
      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%',
        background: 'linear-gradient(transparent, rgba(2,6,24,0.88))',
      }} />

      {/* NY badge */}
      <div style={{
        position: 'absolute', top: -2, right: 22,
        width: 50, height: 50, borderRadius: '50%',
        background: 'linear-gradient(135deg, #c97d0a, #f0a820)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(200,120,0,0.55)',
        zIndex: 10,
      }}>
        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.52rem', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>NY!</span>
      </div>

      {/* Publisher */}
      <div style={{
        position: 'absolute', top: 14, left: 14,
        background: 'rgba(201,168,76,0.12)',
        border: '1px solid rgba(201,168,76,0.3)',
        borderRadius: '3px', padding: '2px 7px',
      }}>
        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.42rem', letterSpacing: '0.18em', color: '#C9A84C', textTransform: 'uppercase' }}>Yaqeen</span>
      </div>

      {/* Cover text */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 14px' }}>
        <p style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '1.45rem',
          fontWeight: 700,
          fontStyle: 'italic',
          lineHeight: 1.15,
          color: '#fff',
          margin: '0 0 6px',
          textShadow: '0 2px 10px rgba(0,0,0,0.6)',
        }}>
          Forandret<br />av Koranen
        </p>
        <p style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: '0.42rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.48)',
          margin: 0,
        }}>
          Mohammad Elshinawy
        </p>
      </div>
    </div>
  )
}

// ── Book grid cover ───────────────────────────────────────────────────────────

function BookCover({ book }: { book: Book }) {
  const tc = book.textDark ? book.accentColor : '#fff'
  const pat = book.textDark ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.035)'

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '2/3',
      borderRadius: '7px',
      overflow: 'hidden',
      background: book.bg,
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    }}>
      {/* Texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          `repeating-linear-gradient(0deg,transparent,transparent 26px,${pat} 26px,${pat} 27px),` +
          `repeating-linear-gradient(90deg,transparent,transparent 26px,${pat} 26px,${pat} 27px)`,
      }} />
      {/* Accent glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 20%, ${book.accentColor}2e 0%, transparent 65%)`,
      }} />
      {/* Bottom vignette */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '58%',
        background: book.textDark
          ? 'linear-gradient(transparent, rgba(210,200,180,0.35))'
          : 'linear-gradient(transparent, rgba(0,0,0,0.6))',
      }} />

      {/* Publisher badge */}
      <div style={{
        position: 'absolute', top: 9, left: 9,
        background: book.textDark ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)',
        border: `1px solid ${book.textDark ? 'rgba(0,0,0,0.13)' : 'rgba(255,255,255,0.13)'}`,
        borderRadius: '2px', padding: '2px 6px',
      }}>
        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.36rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: tc, opacity: 0.65 }}>Yaqeen</span>
      </div>

      {/* Title + author */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 10px' }}>
        <p style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '0.9rem',
          fontWeight: 600,
          lineHeight: 1.2,
          color: tc,
          margin: '0 0 3px',
        }}>
          {book.title}
        </p>
        <p style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: '0.36rem',
          letterSpacing: '0.06em',
          color: book.textDark ? `${book.accentColor}88` : 'rgba(255,255,255,0.45)',
          margin: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {book.author}
        </p>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LesPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>

      {/* ── Scoped styles (hover + responsive) ─────────────────────────── */}
      <style>{`
        .les-spotlight { display: grid; grid-template-columns: min(280px, 30%) 1fr; gap: clamp(32px,5vw,72px); align-items: center; }
        .les-books    { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(20px,2.5vw,36px); }
        .les-card { text-decoration: none; display: block; }
        .les-card .les-cover { transition: transform 0.28s cubic-bezier(0.23,1,0.32,1), box-shadow 0.28s cubic-bezier(0.23,1,0.32,1); }
        .les-card:hover .les-cover { transform: translateY(-7px); box-shadow: 0 24px 52px rgba(0,0,0,0.72) !important; }
        .les-card-title { transition: color 0.2s; }
        .les-card:hover .les-card-title { color: #C9A84C !important; }
        .les-btn:hover { background: rgba(201,168,76,0.1) !important; border-color: rgba(201,168,76,0.65) !important; }
        @media (max-width: 760px) {
          .les-spotlight { grid-template-columns: 1fr; }
          .les-spotlight .les-cover-col { max-width: 210px; margin: 0 auto; }
          .les-books { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 420px) {
          .les-books { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
      `}</style>

      <NavBar />

      <main style={{ flex: 1 }}>

        {/* ── Hero header ─────────────────────────────────────────────────── */}
        <section style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: 'clamp(52px,8vw,100px) clamp(20px,5vw,60px) 0',
        }}>
          <p style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.6rem',
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            margin: '0 0 18px',
          }}>
            LES /
          </p>
          <h1 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(2.6rem, 7vw, 5.2rem)',
            fontWeight: 700,
            fontStyle: 'italic',
            lineHeight: 1.04,
            letterSpacing: '-0.01em',
            color: '#fff',
            margin: '0 0 36px',
          }}>
            Islamske E-bøker<br />
            <span style={{ color: 'rgba(255,255,255,0.38)' }}>og Ressurser</span>
          </h1>
          <div style={{
            height: '1px',
            background: 'linear-gradient(to right, rgba(201,168,76,0.45), rgba(201,168,76,0.08) 55%, transparent)',
          }} />
        </section>

        {/* ── Spotlight ───────────────────────────────────────────────────── */}
        <section style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: 'clamp(48px,6vw,80px) clamp(20px,5vw,60px)',
        }}>
          <p style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.55rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.5)',
            margin: '0 0 44px',
          }}>
            I Fokus
          </p>

          <div className="les-spotlight">
            {/* Cover */}
            <div className="les-cover-col">
              <div className="les-cover" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                <SpotlightCover />
              </div>
            </div>

            {/* Details */}
            <div>
              <p style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.55rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#C9A84C',
                margin: '0 0 14px',
              }}>
                {SPOTLIGHT.category}
              </p>
              <div style={{ width: '34px', height: '1px', background: 'rgba(201,168,76,0.55)', marginBottom: '20px' }} />

              <h2 style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(1.9rem,4vw,3.1rem)',
                fontWeight: 700,
                fontStyle: 'italic',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                color: '#fff',
                margin: '0 0 22px',
              }}>
                {SPOTLIGHT.title}
              </h2>

              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'clamp(0.78rem,1.4vw,0.9rem)',
                lineHeight: 1.8,
                color: 'rgba(203,213,225,0.62)',
                margin: '0 0 28px',
                maxWidth: '520px',
              }}>
                {SPOTLIGHT.description}
              </p>

              <p style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.68rem',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.72)',
                margin: '0 0 7px',
              }}>
                {SPOTLIGHT.author}
              </p>
              <p style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.52rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.22)',
                margin: '0 0 38px',
              }}>
                {SPOTLIGHT.publisher}
              </p>

              <a
                href={SPOTLIGHT.href}
                target="_blank"
                rel="noopener noreferrer"
                className="les-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.18em',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#C9A84C',
                  textDecoration: 'none',
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: '6px',
                  padding: '12px 26px',
                  transition: 'background 0.22s, border-color 0.22s',
                  cursor: 'pointer',
                }}
              >
                Les boken
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* ── Section divider ─────────────────────────────────────────────── */}
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 clamp(20px,5vw,60px)' }}>
          <div style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent)',
          }} />
        </div>

        {/* ── Other books ─────────────────────────────────────────────────── */}
        <section style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: 'clamp(48px,6vw,80px) clamp(20px,5vw,60px) clamp(72px,10vw,140px)',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(1.5rem,3vw,2.2rem)',
            fontWeight: 600,
            color: '#fff',
            margin: '0 0 40px',
            letterSpacing: '0.01em',
          }}>
            Andre bøker
          </h2>

          <div className="les-books">
            {BOOKS.map(book => (
              <a
                key={book.id}
                href={book.href}
                target="_blank"
                rel="noopener noreferrer"
                className="les-card"
              >
                {/* Cover */}
                <div className="les-cover" style={{ marginBottom: '15px', borderRadius: '7px', overflow: 'hidden' }}>
                  <BookCover book={book} />
                </div>

                {/* Meta */}
                <p style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '0.5rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#C9A84C',
                  margin: '0 0 8px',
                }}>
                  {book.category}
                </p>
                <p
                  className="les-card-title"
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: 'clamp(1rem,1.8vw,1.2rem)',
                    fontWeight: 600,
                    lineHeight: 1.25,
                    color: '#e2e8f0',
                    margin: '0 0 6px',
                  }}
                >
                  {book.title}
                </p>
                <p style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.7rem',
                  lineHeight: 1.45,
                  color: 'rgba(148,163,184,0.65)',
                  margin: 0,
                }}>
                  {book.author}
                </p>
              </a>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}
