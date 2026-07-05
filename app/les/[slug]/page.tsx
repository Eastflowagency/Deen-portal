import NavBar from '@/app/components/NavBar'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ALL_BOOKS } from '../_data'

export function generateStaticParams() {
  return ALL_BOOKS.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const book = ALL_BOOKS.find((b) => b.slug === slug)
  if (!book) return {}
  return { title: `${book.title} — Al Rawdah Institutt` }
}

function CoverArt({ book }: { book: (typeof ALL_BOOKS)[0] }) {
  const pat = book.textDark ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.025)'
  const tc = book.textDark ? book.accentColor : '#fff'
  const authorColor = book.textDark ? `${book.accentColor}99` : 'rgba(255,255,255,0.48)'

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '2/3',
      borderRadius: '12px',
      overflow: 'hidden',
      background: book.bg,
      boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 16px 40px rgba(0,0,0,0.4)',
    }}>
      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          `repeating-linear-gradient(0deg,transparent,transparent 30px,${pat} 30px,${pat} 31px),` +
          `repeating-linear-gradient(90deg,transparent,transparent 30px,${pat} 30px,${pat} 31px)`,
      }} />
      {/* Light ray — dark books */}
      {!book.textDark && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 55px 200px at 50% -5%, rgba(200,220,255,0.7) 0%, rgba(180,200,255,0.25) 35%, transparent 65%)',
        }} />
      )}
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 220px 300px at 50% 25%, ${book.accentColor}30 0%, transparent 60%)`,
      }} />
      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%',
        background: book.textDark
          ? 'linear-gradient(transparent, rgba(210,200,180,0.5))'
          : 'linear-gradient(transparent, rgba(2,6,24,0.9))',
      }} />
      {/* Cover text */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 16px' }}>
        <p style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '1.55rem',
          fontWeight: 700,
          fontStyle: 'italic',
          lineHeight: 1.15,
          color: tc,
          margin: '0 0 8px',
          textShadow: book.textDark ? 'none' : '0 2px 10px rgba(0,0,0,0.6)',
        }}>
          {book.title}
        </p>
        <p style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: '0.44rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: authorColor,
          margin: 0,
        }}>
          {book.author}
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={book.textDark ? '/logo-book-black.png' : '/logo-book.png'}
          alt="Al Rawdah Institutt"
          style={{ position: 'absolute', bottom: 16, right: 8, width: '100px', objectFit: 'contain', opacity: book.textDark ? 0.75 : 0.88 }}
        />
      </div>
    </div>
  )
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const book = ALL_BOOKS.find((b) => b.slug === slug)
  if (!book) notFound()

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <style>{`
        .book-layout { display: grid; grid-template-columns: min(340px, 38%) 1fr; gap: clamp(40px,6vw,96px); align-items: start; }
        @media (max-width: 700px) {
          .book-layout { grid-template-columns: 1fr; }
          .book-cover-col { max-width: 260px; margin: 0 auto; }
        }
      `}</style>

      <NavBar />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(90px,8vw,110px) clamp(20px,5vw,60px) clamp(72px,10vw,140px)' }}>

        {/* Back link */}
        <Link href="/les/bøker" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: 'var(--font-montserrat)', fontSize: '0.52rem',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#C9A84C', textDecoration: 'none',
          marginBottom: '48px',
          transition: 'color 0.18s',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Tilbake til e-bøker
        </Link>

        <div className="book-layout">

          {/* Cover */}
          <div className="book-cover-col">
            <CoverArt book={book} />
          </div>

          {/* Details */}
          <div>
            <p style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.55rem', letterSpacing: '0.26em',
              textTransform: 'uppercase', color: '#C9A84C',
              margin: '0 0 16px',
            }}>
              Les / Al Rawdah Bøker
            </p>
            <div style={{ width: '34px', height: '1px', background: 'rgba(201,168,76,0.55)', marginBottom: '22px' }} />

            <h1 style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(2rem,4.5vw,3.4rem)',
              fontWeight: 700, fontStyle: 'italic',
              lineHeight: 1.1, color: '#fff',
              margin: '0 0 10px',
            }}>
              {book.title}
            </h1>

            <p style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.68rem', letterSpacing: '0.06em',
              color: 'rgba(255,255,255,0.55)', margin: '0 0 6px',
            }}>
              {book.author}
            </p>
            <p style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.5rem', letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.18)', margin: '0 0 36px',
            }}>
              {book.publisher}
            </p>

            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: 'clamp(0.82rem,1.5vw,0.95rem)',
              lineHeight: 1.85, color: 'rgba(203,213,225,0.65)',
              margin: '0 0 48px', maxWidth: '520px',
            }}>
              {book.description}
            </p>

            {/* Coming soon card */}
            <div style={{
              padding: '28px 32px',
              background: 'rgba(201,168,76,0.04)',
              border: '1px solid rgba(201,168,76,0.14)',
              borderRadius: '10px',
              maxWidth: '420px',
            }}>
              <p style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.52rem', letterSpacing: '0.22em',
                textTransform: 'uppercase', color: '#C9A84C',
                margin: '0 0 10px',
              }}>
                Kommer snart
              </p>
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.82rem', lineHeight: 1.7,
                color: 'rgba(203,213,225,0.45)', margin: 0,
              }}>
                Denne boken er under klargjøring. Vi gir beskjed når den er tilgjengelig for nedlasting.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
