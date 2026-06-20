export interface LiveSession {
  title: string
  teacher: string
  subject: string
  level: string
  startTime: string
  date: string
  description: string
  isLive?: boolean
}

interface SessionInfoProps {
  session: LiveSession
}

export default function SessionInfo({ session }: SessionInfoProps) {
  return (
    <div style={{
      background: 'rgba(10,16,32,0.75)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(201,168,76,0.14)',
      borderRadius: '12px',
      padding: '22px 24px',
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'flex-start' }}>

        {/* Left: title + desc */}
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', letterSpacing: '0.24em', color: 'rgba(201,168,76,0.65)', textTransform: 'uppercase', marginBottom: 6 }}>
            {session.subject} — {session.level}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: 'clamp(0.9rem, 1.6vw, 1.1rem)',
            fontWeight: 700,
            color: '#f1f5f9',
            margin: '0 0 8px',
            lineHeight: 1.35,
          }}>
            {session.title}
          </h2>
          <p style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.88rem',
            color: '#475569',
            margin: 0,
            lineHeight: 1.6,
            fontWeight: 400,
          }}>
            {session.description}
          </p>
        </div>

        {/* Right: meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flexShrink: 0 }}>
          {([
            { label: 'Lærer', value: session.teacher },
            { label: 'Dato',  value: session.date },
            { label: 'Tid',   value: session.startTime },
          ] as const).map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.56rem',
                letterSpacing: '0.18em',
                color: '#1e2d42',
                textTransform: 'uppercase',
                minWidth: 38,
              }}>
                {label}
              </span>
              <span style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.82rem',
                color: '#94a3b8',
                fontWeight: 500,
              }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
