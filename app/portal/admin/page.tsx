'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image' // still used for card images
import { createClient } from '@/lib/supabase'

export default function AdminHubPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [role, setRole] = useState('teacher')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/portal/admin/login'); return }
      const response = await fetch('/api/account', { cache: 'no-store' })
      if (!response.ok) { router.replace('/login'); return }
      setRole((await response.json()).role)
      setChecking(false)
    })
  }, [router])

  if (checking) return null

  const cards = [
    { href: '/portal/admin/accounts', src: '/Klasse symbol.svg', alt: 'Brukere', title: 'BRUKERE', action: 'Administrer brukere' },
    { href: '/portal/admin/live',          src: '/Live symbol.png',    alt: 'Live',    title: 'LIVE',    action: 'Start klasse →' },
    { href: '/portal/admin/klasse',        src: '/Klasse symbol.svg',  alt: 'Klasse',  title: 'KLASSE',  action: 'Åpne klasse →' },
    { href: '/portal/admin/notifications', src: '/Varsler symbol.png', alt: 'Varsler', title: 'VARSLER', action: 'Send varsel →'  },
  ].filter(card => role === 'admin' || card.title === 'KLASSE')

  return (
    <>
      {/* Use site background */}
      <div className="global-fixed-bg" />

      <div style={{
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        fontFamily: 'var(--font-montserrat)',
      }}>
        {/* Back button */}
        <Link href="/portal" style={{
          position: 'absolute', top: '28px', left: '28px',
          display: 'flex', alignItems: 'center', gap: 8,
          textDecoration: 'none', color: 'rgba(255,255,255,0.55)',
          fontFamily: 'var(--font-montserrat)', fontSize: '0.62rem',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          transition: 'color 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Portal
        </Link>

        {/* Admin label */}
        <div style={{
          position: 'absolute', top: '32px', left: '50%', transform: 'translateX(-50%)',
          fontFamily: 'var(--font-montserrat)', fontSize: '0.62rem',
          letterSpacing: '0.32em', color: 'rgba(201,168,76,0.5)',
          textTransform: 'uppercase',
        }}>
          Admin
        </div>

        <div className="admin-hub-cards">
          {cards.map(({ href, src, alt, title, action }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none', display: 'block' }}>
              <div className="flip-wrap">
                <div className="flip-inner">

                  {/* FRONT */}
                  <div className="flip-face flip-front">
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      style={{ objectFit: 'contain', padding: '28px' }}
                    />
                    <div className="flip-gradient" />
                    <div className="flip-title">{title}</div>
                  </div>

                  {/* BACK */}
                  <div className="flip-face flip-back">
                    <div className="flip-title">{title}</div>
                    <div className="flip-btn">{action}</div>
                  </div>

                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .admin-hub-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
          width: 100%;
          max-width: 980px;
        }
        .admin-hub-cards > a:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 5px;
          border-radius: 18px;
        }
        .flip-wrap {
          perspective: 900px;
          height: 360px;
          cursor: pointer;
        }
        .flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .flip-wrap:hover .flip-inner {
          transform: rotateY(180deg);
        }
        .flip-face {
          position: absolute;
          inset: 0;
          border-radius: 18px;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          overflow: hidden;
        }
        .flip-front {
          background: #000;
          border: 1px solid rgba(201,168,76,0.22);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }
        .flip-back {
          background: #0a1020;
          border: 1px solid rgba(201,168,76,0.38);
          transform: rotateY(180deg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 24px;
        }
        .flip-gradient {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 50%;
          background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%);
          pointer-events: none;
        }
        .flip-title {
          position: relative;
          z-index: 1;
          font-size: 1.45rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.14em;
          padding-bottom: 28px;
        }
        .flip-back .flip-title {
          padding-bottom: 0;
        }
        .flip-btn {
          border: 1px solid rgba(201,168,76,0.45);
          border-radius: 999px;
          padding: 11px 28px;
          font-size: 0.58rem;
          letter-spacing: 0.18em;
          color: rgba(201,168,76,0.85);
          text-transform: uppercase;
          font-family: var(--font-montserrat);
        }
        @media (max-width: 540px) {
          .admin-hub-cards { grid-template-columns: 1fr; max-width: 340px; padding-top: 48px; }
          .flip-wrap { height: 260px; }
          .flip-title { font-size: 1.15rem; }
        }
      `}</style>
    </>
  )
}
