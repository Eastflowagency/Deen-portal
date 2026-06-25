'use client'

import { useRef, useState, useEffect } from 'react'

interface ClassroomProps {
  courseId: string
  courseName?: string
}

export default function Classroom({ courseId, courseName }: ClassroomProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const callRef = useRef<any>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'joined' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    return () => {
      if (callRef.current) {
        callRef.current.leave().catch(() => {})
        callRef.current.destroy()
        callRef.current = null
      }
    }
  }, [])

  async function joinClassroom() {
    if (!containerRef.current) return
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Kunne ikke starte klassen')
        setStatus('error')
        return
      }

      const { default: Daily } = await import('@daily-co/daily-js')

      const call = Daily.createFrame(containerRef.current, {
        showLeaveButton: true,
        showFullscreenButton: true,
        iframeStyle: {
          position: 'absolute',
          inset: '0',
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '10px',
        },
      })

      call.on('left-meeting', () => {
        setStatus('idle')
        call.destroy()
        callRef.current = null
      })

      callRef.current = call
      await call.join({ url: data.url, token: data.token })
      setStatus('joined')
    } catch {
      setErrorMsg('Tilkoblingsfeil — prøv igjen')
      setStatus('error')
    }
  }

  return (
    <div style={{ marginTop: '32px' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round">
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2"/>
          </svg>
        </div>
        <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.72rem', letterSpacing: '0.18em', color: '#C9A84C', textTransform: 'uppercase', margin: 0 }}>
          Klasseromsøkt
        </h2>
      </div>

      {/* Video container — always mounted so DailyIframe has a DOM node */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: status === 'joined' ? '56.25%' : '0',
        height: status === 'joined' ? undefined : '0',
        background: '#000611',
        borderRadius: '10px',
        overflow: 'hidden',
        border: status === 'joined' ? '1px solid rgba(201,168,76,0.18)' : 'none',
        boxShadow: status === 'joined' ? '0 8px 40px rgba(0,0,0,0.6)' : 'none',
        transition: 'padding-bottom 0.3s ease',
      }}>
        <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
      </div>

      {/* CTA / status */}
      {status !== 'joined' && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '16px',
          padding: '36px 24px',
          background: 'rgba(15,24,41,0.5)',
          border: '1px solid rgba(201,168,76,0.12)',
          borderRadius: '10px',
          backdropFilter: 'blur(12px)',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="1.4">
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2"/>
          </svg>

          {courseName && (
            <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', margin: 0, textAlign: 'center' }}>
              {courseName}
            </p>
          )}

          {status === 'error' && (
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.72rem', color: 'rgba(220,38,38,0.8)', margin: 0, textAlign: 'center' }}>
              {errorMsg}
            </p>
          )}

          <button
            onClick={joinClassroom}
            disabled={status === 'loading'}
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: status === 'loading' ? '#64748b' : '#0F1829',
              background: status === 'loading' ? 'rgba(201,168,76,0.2)' : '#C9A84C',
              border: 'none',
              padding: '13px 40px',
              borderRadius: '7px',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s cubic-bezier(0.23,1,0.32,1)',
            }}
            onMouseEnter={(e) => {
              if (status !== 'loading') (e.currentTarget as HTMLButtonElement).style.background = '#d4b55a'
            }}
            onMouseLeave={(e) => {
              if (status !== 'loading') (e.currentTarget as HTMLButtonElement).style.background = '#C9A84C'
            }}
          >
            {status === 'loading' ? 'Kobler til…' : 'Bli med i klassen'}
          </button>
        </div>
      )}
    </div>
  )
}
