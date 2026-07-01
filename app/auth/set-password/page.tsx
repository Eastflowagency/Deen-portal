'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createBrowserClient } from '@supabase/ssr'

export default function SetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/login')
      else setChecking(false)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError(updateError.message)
    } else {
      router.push('/student')
    }
  }

  if (checking) return null

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0F1829' }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(60deg,  rgba(201,168,76,0.04) 0, rgba(201,168,76,0.04) 1px, transparent 1px, transparent 70px),
            repeating-linear-gradient(120deg, rgba(201,168,76,0.04) 0, rgba(201,168,76,0.04) 1px, transparent 1px, transparent 70px)
          `,
        }}
      />
      <div className="relative w-full max-w-md">
        <div
          className="rounded-2xl p-10 sm:p-12"
          style={{ backgroundColor: '#1a2540', border: '1px solid rgba(201,168,76,0.25)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}
        >
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <Image
                src="/logo-cropped.png"
                alt="Al Rawdah Institute"
                width={988} height={374}
                style={{ height: '80px', width: 'auto', objectFit: 'contain' }}
                priority
              />
            </div>
            <h1 style={{ color: '#f1f5f9', fontSize: '1.05rem', fontFamily: 'var(--font-montserrat)', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Create Your Password
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.85rem', letterSpacing: '0.04em' }}>
              Set a secure password to activate your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>
                New Password
              </label>
              <input
                id="password" type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                required placeholder="Minimum 8 characters"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200"
                style={{ backgroundColor: '#0F1829', border: '1px solid rgba(201,168,76,0.2)', color: '#fff' }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.6)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
              />
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>
                Confirm Password
              </label>
              <input
                id="confirm" type="password" value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200"
                style={{ backgroundColor: '#0F1829', border: '1px solid rgba(201,168,76,0.2)', color: '#fff' }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.6)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
              />
            </div>

            {error && (
              <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full font-bold rounded-lg py-3 mt-2 transition-opacity duration-200 disabled:opacity-60"
              style={{ backgroundColor: '#C9A84C', color: '#0F1829', fontSize: '0.95rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Activating account…' : 'Activate Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

