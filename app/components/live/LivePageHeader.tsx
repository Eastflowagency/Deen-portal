import Link from 'next/link'

interface LivePageHeaderProps {
  isLive: boolean
  subject: string
}

export default function LivePageHeader({ isLive, subject }: LivePageHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/student" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.6rem',
            letterSpacing: '0.18em',
            color: '#334155',
            textTransform: 'uppercase',
            transition: 'color 0.18s',
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#94a3b8' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#334155' }}
          >
            ← Portal
          </span>
        </Link>
        <span style={{ color: 'rgba(201,168,76,0.2)' }}>/</span>
        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.18em', color: '#475569', textTransform: 'uppercase' }}>
          {subject}
        </span>
      </div>

      {/* Status badge */}
      {isLive ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(220,38,38,0.08)',
          border: '1px solid rgba(220,38,38,0.25)',
          borderRadius: 6,
          padding: '5px 14px',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', animation: 'livePulse 1.4s infinite', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', letterSpacing: '0.2em', color: '#ef4444', fontWeight: 700 }}>
            DIREKTEKLASSE PÅGÅR
          </span>
        </div>
      ) : (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(30,45,66,0.5)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 6,
          padding: '5px 14px',
        }}>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.56rem', letterSpacing: '0.2em', color: '#334155' }}>
            INGEN AKTIV KLASSE
          </span>
        </div>
      )}
    </div>
  )
}
