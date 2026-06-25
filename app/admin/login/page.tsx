'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40)
    return () => clearTimeout(t)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '')
      .split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
    if (!adminEmails.includes(email.toLowerCase())) {
      setError('Denne kontoen har ikke admin-tilgang.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('Feil e-post eller passord.')
      setLoading(false)
    } else {
      router.replace('/student')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundImage: "url('/Background.png')",
      backgroundSize: 'cover', backgroundPosition: 'center',
      backgroundAttachment: 'fixed', backgroundColor: '#060b14',
      position: 'relative', padding: '20px',
    }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'rgba(6,11,20,0.92)', pointerEvents: 'none' }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '400px',
        background: 'rgba(15,24,41,0.75)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(201,168,76,0.18)',
        borderRadius: '16px',
        padding: 'clamp(32px, 6vw, 48px) clamp(24px, 6vw, 44px)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.55)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <Image src="/logo-cropped.png" alt="Al Rawdah Institutt" width={1287} height={461}
            style={{ width: '100%', maxWidth: '240px', height: 'auto' }} priority />
        </div>

        {/* Admin badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '28px' }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.25))' }} />
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', letterSpacing: '0.26em', color: 'rgba(201,168,76,0.5)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Adminpanel
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.25))' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(203,213,225,0.6)', marginBottom: 8 }}>
              Admin-e-post
            </label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(6,11,20,0.6)',
                border: '1px solid rgba(201,168,76,0.18)', borderRadius: 8,
                padding: '12px 14px', color: '#f1f5f9',
                fontFamily: 'var(--font-montserrat)', fontSize: '1rem', outline: 'none',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.55)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)' }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(203,213,225,0.6)', marginBottom: 8 }}>
              Passord
            </label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(6,11,20,0.6)',
                border: '1px solid rgba(201,168,76,0.18)', borderRadius: 8,
                padding: '12px 14px', color: '#f1f5f9',
                fontFamily: 'var(--font-montserrat)', fontSize: '1rem', outline: 'none',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.55)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)' }}
            />
          </div>

          {/* Error */}
          {error && (
            <div role="alert" style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 8, padding: '11px 14px',
              fontFamily: 'var(--font-montserrat)', fontSize: '0.88rem', color: '#fca5a5', lineHeight: 1.5,
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading} className="btn-press" style={{
            width: '100%', padding: '13px',
            background: loading ? 'rgba(201,168,76,0.45)' : '#C9A84C',
            border: 'none', borderRadius: 8,
            color: '#0F1829', fontFamily: 'var(--font-montserrat)',
            fontSize: '0.68rem', letterSpacing: '0.18em', fontWeight: 700,
            textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s cubic-bezier(0.23,1,0.32,1)',
          }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#d4b55a' }}
            onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#C9A84C' }}
          >
            {loading ? 'Logger inn…' : 'Logg inn som admin'}
          </button>
        </form>
      </div>
    </div>
  )
}
