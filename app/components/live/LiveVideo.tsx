'use client'

// ── Helpers ───────────────────────────────────────────────────────────────────

function isDailyUrl(url: string): boolean {
  try { return new URL(url).hostname.includes('daily.co') } catch { return false }
}

function isJoinOnlyUrl(url: string): boolean {
  try {
    const h = new URL(url).hostname
    return h.includes('meet.google') || h.includes('zoom.us') || h.includes('teams.microsoft')
  } catch { return false }
}

// ── Main component ────────────────────────────────────────────────────────────

interface LiveVideoProps {
  meetingUrl: string
  isLive: boolean
  viewerCount: number
  displayName?: string
  role?: 'teacher' | 'student'
}

export default function LiveVideo({ meetingUrl, isLive, viewerCount }: LiveVideoProps) {
  const daily    = meetingUrl && isDailyUrl(meetingUrl)
  const joinOnly = meetingUrl && !daily && isJoinOnlyUrl(meetingUrl)

  return (
    <div style={{ position: 'relative', width: '100%' }}>

      {/* 16:9 container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '56.25%',
        background: '#000611',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(201,168,76,0.18)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
      }}>

        {daily ? (
          /* Daily.co — iframe prebuilt UI */
          <iframe
            src={meetingUrl}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            allow="camera; microphone; display-capture; fullscreen; autoplay"
            allowFullScreen
            title="Live klasse"
          />

        ) : joinOnly ? (
          /* Google Meet / Zoom / Teams: can't embed — show join button */
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #060b14 0%, #0F1829 100%)',
            gap: 20, padding: 24,
          }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', margin: 0, textAlign: 'center' }}>
              Direkteklasse pågår
            </p>
            <a href={meetingUrl} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', letterSpacing: '0.16em',
              fontWeight: 700, textTransform: 'uppercase', color: '#0F1829',
              background: '#C9A84C', padding: '12px 32px', borderRadius: 8, textDecoration: 'none',
              transition: 'background 0.2s',
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#d4b55a' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#C9A84C' }}
            >
              Bli med i klassen →
            </a>
          </div>

        ) : (
          /* No URL or unknown — waiting state */
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #060b14 0%, #0F1829 100%)',
            gap: 16,
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', margin: 0 }}>
              Klassen starter snart
            </p>
          </div>
        )}

        {/* LIVE badge */}
        {isLive && (
          <div style={{
            position: 'absolute', top: 12, left: 12, zIndex: 10,
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(220,38,38,0.9)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            padding: '5px 10px', borderRadius: 4,
            pointerEvents: 'none',
          }}>
            <div style={{ width: 7, height: 7, background: '#fff', borderRadius: '50%', animation: 'livePulse 1.4s ease-in-out infinite', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', letterSpacing: '0.22em', color: '#fff', fontWeight: 700 }}>LIVE</span>
          </div>
        )}

        {/* Viewer count */}
        <div style={{
          position: 'absolute', top: 12, right: 12, zIndex: 10,
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          padding: '5px 10px', borderRadius: 4,
          pointerEvents: 'none',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{viewerCount}</span>
        </div>
      </div>

      {/* Fallback open-in-new-tab */}
      {meetingUrl && (
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
          <a href={meetingUrl} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', letterSpacing: '0.14em', color: '#334155', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.18s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#C9A84C' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#334155' }}
          >
            Åpne i eget vindu →
          </a>
        </div>
      )}
    </div>
  )
}
