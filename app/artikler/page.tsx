import NavBar from '@/app/components/NavBar'

export const metadata = {
  title: 'Artikler — Al Rawdah Institutt',
  description: 'Islamske artikler og ressurser fra Al Rawdah Institutt. Kommer snart.',
}

export default function ArtiklerPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>

      <NavBar />

      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(48px, 10vw, 120px) clamp(20px, 5vw, 60px)',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', width: '100%' }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '999px',
            padding: '6px 18px',
            marginBottom: '36px',
          }}>
            <span style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.6rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              fontWeight: 700,
            }}>
              Artikler
            </span>
          </div>

          {/* Heading — same font as "ISLAMSKE VITENSKAPER OG ARABISK" */}
          <h1 style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            fontWeight: 700,
            letterSpacing: '0.06em',
            lineHeight: 1.05,
            color: '#ffffff',
            textTransform: 'uppercase',
            margin: '0 0 28px',
          }}>
            Kommer snart
          </h1>

          {/* Gold divider */}
          <div style={{
            width: '56px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #C9A84C, transparent)',
            margin: '0 auto 28px',
          }} />

          {/* Description */}
          <p style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: 'clamp(0.78rem, 1.8vw, 0.9rem)',
            letterSpacing: '0.04em',
            color: 'rgba(203,213,225,0.72)',
            lineHeight: 1.85,
            margin: '0 auto 44px',
            maxWidth: '460px',
          }}>
            Vi arbeider med å samle autentiske artikler om islamsk tro, fiqh, arabisk og profetens sunnah. Innholdet vil bli tilgjengelig etter lanseringen.
          </p>

          {/* Back button */}
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.62rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: '#C9A84C',
              textDecoration: 'none',
              border: '1px solid rgba(201,168,76,0.28)',
              borderRadius: '6px',
              padding: '11px 24px',
              transition: 'background 0.2s, border-color 0.2s',
            }}
          >
            ← Tilbake til forsiden
          </a>
        </div>
      </main>
    </div>
  )
}
