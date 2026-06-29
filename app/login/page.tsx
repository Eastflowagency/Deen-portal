'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/student')
      else setTimeout(() => setMounted(true), 50)
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('Feil e-postadresse eller passord. Prøv igjen.')
      setLoading(false)
    } else {
      setLoading(false)
      router.push('/student')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(20px, 5vh, 60px) 16px',
        backgroundImage: "url('/Background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: '#060b14',
        position: 'relative',
      }}
    >
      {/* Dark overlay */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'rgba(6,11,20,0.88)', pointerEvents: 'none' }} />

      {/* Atmospheric glow */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Card */}
      <main aria-label="Innlogging" style={{ position: 'relative', zIndex: 1 }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(15,24,41,0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(201,168,76,0.22)',
          borderRadius: '16px',
          padding: 'clamp(36px, 6vw, 52px) clamp(28px, 6vw, 48px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.06) inset',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <Image
            src="/logo-cropped.png"
            alt="Al Rawdah Institutt"
            width={1287}
            height={461}
            style={{ width: '100%', maxWidth: '320px', height: 'auto', objectFit: 'contain' }}
            priority
          />
        </div>

        {/* Divider with label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3))' }} />
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', letterSpacing: '0.22em', color: 'rgba(201,168,76,0.65)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Studentportal
          </span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.3))' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.65rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: emailFocused ? '#C9A84C' : 'rgba(203,213,225,0.7)',
                marginBottom: '10px',
                transition: 'color 0.2s',
              }}
            >
              E-postadresse
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="student@eksempel.no"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: 'rgba(6,11,20,0.6)',
                border: emailFocused ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(201,168,76,0.18)',
                borderRadius: '8px',
                padding: '13px 16px',
                color: '#f1f5f9',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '1.05rem',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxShadow: emailFocused ? '0 0 0 3px rgba(201,168,76,0.08)' : 'none',
              }}
            />
          </div>

          {/* Password field */}
          <div>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.65rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: passwordFocused ? '#C9A84C' : 'rgba(203,213,225,0.7)',
                marginBottom: '10px',
                transition: 'color 0.2s',
              }}
            >
              Passord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: 'rgba(6,11,20,0.6)',
                border: passwordFocused ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(201,168,76,0.18)',
                borderRadius: '8px',
                padding: '13px 16px',
                color: '#f1f5f9',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '1.05rem',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxShadow: passwordFocused ? '0 0 0 3px rgba(201,168,76,0.08)' : 'none',
              }}
            />
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.28)',
                borderRadius: '8px',
                padding: '12px 16px',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '1rem',
                color: '#fca5a5',
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-press"
            style={{
              width: '100%',
              padding: '14px 24px',
              background: loading ? 'rgba(201,168,76,0.5)' : '#C9A84C',
              color: '#0F1829',
              border: 'none',
              borderRadius: '8px',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.75rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '4px',
              transition: 'background 0.2s cubic-bezier(0.23,1,0.32,1), transform 0.14s cubic-bezier(0.23,1,0.32,1)',
            }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#d4b55a' }}
            onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#C9A84C' }}
          >
            {loading ? 'Logger inn…' : 'Logg inn'}
          </button>
        </form>

        {/* Footer */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(201,168,76,0.1)',
            textAlign: 'center',
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#64748b',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#C9A84C')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#64748b')}
          >
            ← Tilbake til nettsiden
          </Link>
        </div>
      </div>
      </main>
    </div>
  )
}
