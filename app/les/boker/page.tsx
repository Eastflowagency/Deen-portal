import NavBar from '@/app/components/NavBar'
import Link from 'next/link'
import { SPOTLIGHT, BOOKS } from '../_data'
import type { Book } from '../_data'

export const metadata = {
  title: 'E-bøker — Al Rawdah Institutt',
  description: 'Islamske e-bøker og ressurser. Lær om tro, fiqh, arabisk og profetens sunnah.',
}

function SpotlightCover() {
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '2/3', borderRadius: '10px',
      overflow: 'hidden',
      background: 'linear-gradient(170deg, #04081e 0%, #091a5a 35%, #1235a8 65%, #1f4fd4 100%)',
      boxShadow: '0 32px 80px rgba(0,0,0,0.75), 0 12px 32px rgba(0,0,0,0.5)',
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(255,255,255,0.025) 30px, rgba(255,255,255,0.025) 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(255,255,255,0.025) 30px, rgba(255,255,255,0.025) 31px)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55px 200px at 50% -5%, rgba(200,220,255,0.7) 0%, rgba(180,200,255,0.25) 35%, transparent 65%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 220px 300px at 50% 25%, rgba(40,100,220,0.18) 0%, transparent 60%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%', background: 'linear-gradient(transparent, rgba(2,6,24,0.88))' }} />
      <div style={{ position: 'absolute', top: 'clamp(6px,3%,12px)', left: 'clamp(6px,3%,12px)', width: 'clamp(32px,16%,50px)', height: 'clamp(32px,16%,50px)', borderRadius: '50%', background: 'linear-gradient(135deg, #c97d0a, #f0a820)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(200,120,0,0.55)', zIndex: 10 }}>
        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: 'clamp(0.36rem,0.45rem,0.52rem)', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>NY!</span>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(8px,5%,14px)' }}>
        <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(0.85rem, 5.5vw, 1.45rem)', fontWeight: 700, fontStyle: 'italic', lineHeight: 1.15, color: '#fff', margin: '0 0 6px', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
          Forandret<br />av Koranen
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: 'clamp(0.3rem, 1.2vw, 0.42rem)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.48)', margin: 0 }}>Sh Fulaan ibn Hebel</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-book.png" alt="Al Rawdah Institutt" style={{ width: 'clamp(55px, 8vw, 100px)', objectFit: 'contain', opacity: 0.88, flexShrink: 0 }} />
        </div>
      </div>
    </div>
  )
}

function BookCover({ book }: { book: Book }) {
  const tc = book.textDark ? book.accentColor : '#fff'
  const pat = book.textDark ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.025)'
  const authorColor = book.textDark ? `${book.accentColor}99` : 'rgba(255,255,255,0.48)'
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '2/3', borderRadius: '7px', overflow: 'hidden', background: book.bg, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 26px,${pat} 26px,${pat} 27px),repeating-linear-gradient(90deg,transparent,transparent 26px,${pat} 26px,${pat} 27px)` }} />
      {!book.textDark && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 30px 120px at 50% -5%, rgba(200,220,255,0.55) 0%, rgba(180,200,255,0.15) 35%, transparent 65%)' }} />}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 20%, ${book.accentColor}2a 0%, transparent 65%)` }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%', background: book.textDark ? 'linear-gradient(transparent, rgba(210,200,180,0.5))' : 'linear-gradient(transparent, rgba(2,6,24,0.9))' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 10px' }}>
        <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', fontWeight: 700, fontStyle: 'italic', lineHeight: 1.15, color: tc, margin: '0 0 5px', textShadow: book.textDark ? 'none' : '0 2px 10px rgba(0,0,0,0.6)' }}>{book.title}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.38rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: authorColor, margin: 0 }}>{book.author}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={book.textDark ? '/logo-book-black.png' : '/logo-book.png'} alt="Al Rawdah Institutt" style={{ width: '60px', objectFit: 'contain', opacity: book.textDark ? 0.75 : 0.82, flexShrink: 0 }} />
        </div>
      </div>
    </div>
  )
}

export default function LesBokerPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      <style>{`
        .les-spotlight { display: grid; grid-template-columns: min(280px, 30%) 1fr; gap: clamp(32px,5vw,72px); align-items: center; }
        .les-books    { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(16px,2vw,28px); }
        .les-card { text-decoration: none; display: block; }
        .les-card .les-cover { transition: transform 0.28s cubic-bezier(0.23,1,0.32,1), box-shadow 0.28s cubic-bezier(0.23,1,0.32,1); }
        .les-card:hover .les-cover { transform: translateY(-7px); box-shadow: 0 24px 52px rgba(0,0,0,0.72) !important; }
        .les-card-title { transition: color 0.2s; }
        .les-card:hover .les-card-title { color: #C9A84C !important; }
        .les-btn:hover { background: rgba(201,168,76,0.1) !important; border-color: rgba(201,168,76,0.65) !important; }
        @media (max-width: 900px) { .les-books { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 760px) {
          .les-spotlight { grid-template-columns: min(180px,42%) 1fr; gap: clamp(16px,4vw,32px); }
          .les-books { grid-template-columns: repeat(2, 1fr); gap: 14px; }
        }
        @media (max-width: 480px) {
          .les-books { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .les-spotlight { grid-template-columns: min(150px,40%) 1fr; gap: 14px; }
        }
      `}</style>

      <NavBar />

      <main style={{ flex: 1 }}>
        <section style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(90px,8vw,110px) clamp(20px,5vw,60px) 0' }}>
          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: '#C9A84C', margin: '0 0 18px' }}>LES /</p>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2.6rem, 7vw, 5.2rem)', fontWeight: 700, fontStyle: 'italic', lineHeight: 1.04, letterSpacing: '-0.01em', color: '#fff', margin: '0 0 36px' }}>
            Islamske E-bøker
          </h1>
          <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(201,168,76,0.45), rgba(201,168,76,0.08) 55%, transparent)' }} />
        </section>

        <section style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(48px,6vw,80px) clamp(20px,5vw,60px)' }}>
          <div className="les-spotlight">
            <div className="les-cover-col">
              <Link href={`/les/${SPOTLIGHT.slug}`} className="les-card">
                <div className="les-cover" style={{ borderRadius: '10px', overflow: 'hidden' }}><SpotlightCover /></div>
              </Link>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C9A84C', margin: '0 0 14px' }}>Bok i Fokus</p>
              <div style={{ width: '34px', height: '1px', background: 'rgba(201,168,76,0.55)', marginBottom: '20px' }} />
              <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.3rem,4vw,3.1rem)', fontWeight: 700, fontStyle: 'italic', lineHeight: 1.1, letterSpacing: '-0.01em', color: '#fff', margin: '0 0 clamp(12px,2vw,22px)' }}>{SPOTLIGHT.title}</h2>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.7rem,1.4vw,0.9rem)', lineHeight: 1.8, color: 'rgba(203,213,225,0.62)', margin: '0 0 clamp(16px,2vw,28px)', maxWidth: '520px' }}>{SPOTLIGHT.description}</p>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: 'clamp(0.55rem,1.2vw,0.68rem)', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.72)', margin: '0 0 7px' }}>{SPOTLIGHT.author}</p>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: 'clamp(0.42rem,1vw,0.52rem)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', margin: '0 0 clamp(20px,3vw,38px)' }}>{SPOTLIGHT.publisher}</p>
              <Link href={`/les/${SPOTLIGHT.slug}`} className="les-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase', color: '#C9A84C', textDecoration: 'none', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '6px', padding: '12px 26px', transition: 'background 0.22s, border-color 0.22s', cursor: 'pointer' }}>
                Les boken
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </section>

        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 clamp(20px,5vw,60px)' }}>
          <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent)' }} />
        </div>

        <section style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(48px,6vw,80px) clamp(20px,5vw,60px) clamp(72px,10vw,140px)' }}>
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 600, color: '#fff', margin: '0 0 40px', letterSpacing: '0.01em' }}>Andre bøker</h2>
          <div className="les-books">
            {BOOKS.map(book => (
              <Link key={book.id} href={`/les/${book.slug}`} className="les-card">
                <div className="les-cover" style={{ marginBottom: '15px', borderRadius: '7px', overflow: 'hidden' }}><BookCover book={book} /></div>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.5rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C9A84C', margin: '0 0 8px' }}>{book.category}</p>
                <p className="les-card-title" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1rem,1.8vw,1.2rem)', fontWeight: 600, lineHeight: 1.25, color: '#e2e8f0', margin: '0 0 6px' }}>{book.title}</p>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', lineHeight: 1.45, color: 'rgba(148,163,184,0.65)', margin: 0 }}>{book.author}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
