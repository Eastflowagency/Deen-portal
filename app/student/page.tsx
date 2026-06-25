'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

// ── Subject data ────────────────────────────────────────────────────────────────

const SUBJECTS = [
  {
    id: 'koranvitenskaper',
    name: 'Koranvitenskaper',
    arabic: 'علوم القرآن',
    desc: 'Tajweed, Tafseer og Koranvitenskapene',
    gradient: 'linear-gradient(150deg, #071a0e 0%, #0e2d18 50%, #0a2010 100%)',
    accentRgb: '74,197,120',
    symbol: 'آ',
    slugPrefix: 'koranvitenskaper',
  },
  {
    id: 'aqidah',
    name: 'Aqidah',
    arabic: 'العقيدة',
    desc: 'Islamsk tro og troslære',
    gradient: 'linear-gradient(150deg, #130a24 0%, #221040 50%, #180c30 100%)',
    accentRgb: '160,132,232',
    symbol: 'ع',
    slugPrefix: 'aqidah',
  },
  {
    id: 'fiqh',
    name: 'Fiqh',
    arabic: 'الفقه',
    desc: 'Islamsk rettsvitenskap',
    gradient: 'linear-gradient(150deg, #071624 0%, #0f2a40 50%, #0a1e34 100%)',
    accentRgb: '56,189,248',
    symbol: 'ف',
    slugPrefix: 'fiqh',
  },
  {
    id: 'seerah',
    name: 'Seerah',
    arabic: 'السيرة',
    desc: 'Profetens ﷺ biografi',
    gradient: 'linear-gradient(150deg, #1e0e00 0%, #3a1e00 50%, #2a1400 100%)',
    accentRgb: '251,191,36',
    symbol: 'س',
    slugPrefix: 'seerah',
  },
  {
    id: 'hadith',
    name: 'Hadith',
    arabic: 'الحديث',
    desc: 'Profetiske overleveringer',
    gradient: 'linear-gradient(150deg, #180808 0%, #301414 50%, #200c0c 100%)',
    accentRgb: '248,113,113',
    symbol: 'ح',
    slugPrefix: 'hadith',
  },
  {
    id: 'adab-al-talib',
    name: 'Adab al-Talib',
    arabic: 'أدب الطالب',
    desc: 'Kunnskapssøkerens etikk og egenskaper',
    gradient: 'linear-gradient(150deg, #0a1320 0%, #152438 50%, #0d1a2c 100%)',
    accentRgb: '201,168,76',
    symbol: 'أ',
    slugPrefix: 'adab-al-talib',
  },
]

const LEVELS = [
  { label: 'Grunnivå', num: 1, year: '2026–2027', color: 'rgba(74,197,120,0.75)', bg: 'rgba(74,197,120,0.08)', locked: false, startsYear: null },
  { label: 'Mellomnivå', num: 2, year: '2027–2028', color: '#C9A84C', bg: 'rgba(201,168,76,0.08)', locked: true, startsYear: '2027' },
  { label: 'Viderenivå', num: 3, year: '2028–2029', color: 'rgba(167,139,250,0.85)', bg: 'rgba(167,139,250,0.08)', locked: true, startsYear: '2028' },
]

// ── Components ──────────────────────────────────────────────────────────────────

function IntroCard({ subject }: { subject: typeof SUBJECTS[0] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: '210px',
        borderRadius: '10px',
        overflow: 'hidden',
        border: hovered ? `1px solid rgba(${subject.accentRgb},0.45)` : '1px solid rgba(255,255,255,0.09)',
        cursor: 'pointer',
        transition: 'transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
        transform: hovered ? 'translateY(-5px)' : 'none',
        boxShadow: hovered ? `0 20px 48px rgba(0,0,0,0.65)` : '0 2px 14px rgba(0,0,0,0.4)',
        background: subject.gradient,
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', height: '158px', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(60deg, rgba(255,255,255,0.022) 0, rgba(255,255,255,0.022) 1px, transparent 1px, transparent 44px), repeating-linear-gradient(120deg, rgba(255,255,255,0.022) 0, rgba(255,255,255,0.022) 1px, transparent 1px, transparent 44px)',
        }} />
        {/* Decorative symbol — background only, very subtle */}
        <div style={{
          position: 'absolute', right: '-10px', bottom: '-16px',
          fontFamily: 'serif', fontSize: '8rem', lineHeight: 1,
          color: `rgba(${subject.accentRgb},0.07)`, userSelect: 'none', pointerEvents: 'none',
        }}>
          {subject.symbol}
        </div>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 80% at 15% 85%, rgba(${subject.accentRgb},0.14) 0%, transparent 70%)` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%', background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }} />
        {/* Text */}
        <div style={{ position: 'absolute', bottom: '13px', left: '14px', right: '14px' }}>
          <div style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.6rem',
            letterSpacing: '0.24em',
            color: 'rgba(255,255,255,0.42)',
            textTransform: 'uppercase',
            marginBottom: '5px',
          }}>FAG</div>
          <div style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '0.02em',
            lineHeight: 1.2,
            textShadow: '0 2px 10px rgba(0,0,0,0.6)',
          }}>{subject.name}</div>
        </div>
      </div>
      {/* Bottom panel */}
      <div style={{ padding: '11px 14px 13px', background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(6px)' }}>
        <div style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: '0.92rem',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.45,
        }}>{subject.desc}</div>
      </div>
    </div>
  )
}

function LevelCard({ subject, level }: { subject: typeof SUBJECTS[0]; level: typeof LEVELS[0] }) {
  const [hovered, setHovered] = useState(false)
  const slug = `${subject.slugPrefix}-${level.num}`
  const isLocked = level.locked

  const cardInner = (
    <div style={{
      borderRadius: '10px',
      overflow: 'hidden',
      border: isLocked
        ? '1px solid rgba(255,255,255,0.06)'
        : hovered ? `1px solid rgba(${subject.accentRgb},0.4)` : '1px solid rgba(255,255,255,0.09)',
      cursor: isLocked ? 'default' : 'pointer',
      transition: 'transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
      transform: !isLocked && hovered ? 'translateY(-5px)' : 'none',
      boxShadow: !isLocked && hovered ? `0 20px 52px rgba(0,0,0,0.65)` : '0 2px 14px rgba(0,0,0,0.4)',
      background: 'rgba(8,14,26,0.75)',
      backdropFilter: 'blur(12px)',
    }}>

      {/* ── Thumbnail ──────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: '190px', background: subject.gradient, overflow: 'hidden' }}>
        {/* Grid texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(60deg, rgba(255,255,255,0.025) 0, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 44px), repeating-linear-gradient(120deg, rgba(255,255,255,0.025) 0, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 44px)',
        }} />
        {/* Arabic watermark */}
        <div style={{
          position: 'absolute', right: '-18px', bottom: '-22px',
          fontFamily: 'serif', fontSize: '12rem', lineHeight: 1,
          color: `rgba(${subject.accentRgb},${isLocked ? '0.04' : '0.09'})`,
          userSelect: 'none', pointerEvents: 'none',
        }}>
          {subject.symbol}
        </div>
        {/* Glow */}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 70% at 18% 82%, rgba(${subject.accentRgb},${isLocked ? '0.06' : '0.18'}) 0%, transparent 65%)` }} />
        {/* Lock overlay */}
        {isLocked && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,7,16,0.58)' }} />
        )}
        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%)' }} />

        {/* ── Lock badge top-left ───────────────────────────────────────────── */}
        {isLocked && (
          <div style={{
            position: 'absolute', top: '13px', left: '13px',
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '6px 13px',
            background: 'rgba(6,10,22,0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: '7px',
            border: '1px solid rgba(255,255,255,0.14)',
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#ffffff" opacity={0.8} aria-hidden="true">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <span style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.62rem',
              letterSpacing: '0.16em',
              color: '#ffffff',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}>Kommende</span>
          </div>
        )}

        {/* ── Nivå badge top-right ──────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: '13px', right: '13px',
          padding: '5px 13px',
          background: 'rgba(6,10,22,0.82)',
          backdropFilter: 'blur(8px)',
          borderRadius: '7px',
          fontFamily: 'var(--font-montserrat)',
          fontSize: '0.62rem',
          letterSpacing: '0.14em',
          fontWeight: 700,
          color: isLocked ? 'rgba(255,255,255,0.3)' : '#ffffff',
          border: `1px solid ${isLocked ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.18)'}`,
          textTransform: 'uppercase',
        }}>
          Nivå {level.num}
        </div>

        {/* Level number centered in thumbnail */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '5rem',
            fontWeight: 800,
            color: `rgba(${subject.accentRgb},${isLocked ? '0.06' : '0.12'})`,
            letterSpacing: '-0.02em',
            userSelect: 'none',
          }}>
            {level.num === 1 ? 'I' : level.num === 2 ? 'II' : 'III'}
          </span>
        </div>
      </div>

      {/* ── Bottom info ────────────────────────────────────────────────────── */}
      <div style={{ padding: '14px 16px 17px', background: 'rgba(6,10,20,0.6)' }}>
        {/* Level chip + year */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '9px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '4px 11px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: '5px',
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.62rem',
            letterSpacing: '0.14em',
            fontWeight: 600,
            color: isLocked ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.75)',
            textTransform: 'uppercase',
          }}>
            {level.label}
          </span>
          <span style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            color: isLocked ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.4)',
          }}>
            {level.year}
          </span>
        </div>

        {/* Course name */}
        <div style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: '1rem',
          fontWeight: 800,
          color: isLocked ? 'rgba(255,255,255,0.28)' : '#ffffff',
          letterSpacing: '0.01em',
          marginBottom: '10px',
          lineHeight: 1.3,
        }}>
          {subject.name}
          <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: isLocked ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
            {level.label}
          </span>
        </div>

        {/* CTA or start date */}
        {isLocked ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.62rem',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.35)',
              textTransform: 'uppercase',
            }}>Starter {level.startsYear}</span>
          </div>
        ) : (
          <span style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.62rem',
            letterSpacing: '0.18em',
            color: `rgba(${subject.accentRgb},0.75)`,
            textTransform: 'uppercase',
          }}>Se kurs →</span>
        )}
      </div>
    </div>
  )

  if (isLocked) return <div>{cardInner}</div>

  return (
    <Link
      href={`/studieplan/${slug}`}
      style={{ textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {cardInner}
    </Link>
  )
}

// ── Portal UI ────────────────────────────────────────────────────────────────────

function PortalUI({ firstName, email, onSignOut, isLive, isAdmin }: { firstName: string; email: string; onSignOut: () => void; isLive: boolean; isAdmin: boolean }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [accountTab, setAccountTab] = useState<'profil' | 'passord'>('profil')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; created_at: string }>>([])
  const [notifLoading, setNotifLoading] = useState(false)

  // Profile form
  const [editFirst, setEditFirst] = useState(firstName.split(' ')[0] || '')
  const [editLast, setEditLast] = useState(firstName.split(' ').slice(1).join(' ') || '')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')

  // Password form
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [signOutOthers, setSignOutOthers] = useState(true)
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState('')

  const [displayName, setDisplayName] = useState(firstName)
  const initials = displayName.split(' ').map(w => w[0]).filter(Boolean).join('').slice(0, 2).toUpperCase()

  // Sync form fields to current saved name each time the modal opens
  useEffect(() => {
    if (showAccount) {
      setEditFirst(displayName.split(' ')[0] || '')
      setEditLast(displayName.split(' ').slice(1).join(' ') || '')
      setProfileMsg('')
    }
  }, [showAccount])

  async function handleSaveProfile() {
    if (!editFirst.trim()) return
    setProfileSaving(true); setProfileMsg('')
    const supabase = createClient()
    const fullName = `${editFirst.trim()} ${editLast.trim()}`.trim()
    const { error } = await supabase.auth.updateUser({ data: { first_name: editFirst.trim(), last_name: editLast.trim(), full_name: fullName } })
    setProfileSaving(false)
    if (!error) {
      setDisplayName(fullName)
      setProfileMsg('✓ Endringer lagret!')
    } else {
      setProfileMsg(`Feil: ${error.message}`)
    }
  }

  async function handleUpdatePassword() {
    setPwMsg('')
    if (!currentPw) { setPwMsg('Skriv inn nåværende passord.'); return }
    if (newPw.length < 8) { setPwMsg('Nytt passord må ha minst 8 tegn.'); return }
    if (newPw !== confirmPw) { setPwMsg('Passordene matcher ikke.'); return }
    setPwSaving(true)
    const supabase = createClient()
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password: currentPw })
    if (signInErr) { setPwSaving(false); setPwMsg('Nåværende passord er feil.'); return }
    const { error } = await supabase.auth.updateUser({ password: newPw })
    if (!error && signOutOthers) await supabase.auth.signOut({ scope: 'others' })
    setPwSaving(false)
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
    setPwMsg(error ? `Feil: ${error.message}` : '✓ Passord oppdatert!')
  }

  async function loadNotifications() {
    setNotifLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('notifications')
      .select('id, message, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setNotifications(data)
    setNotifLoading(false)
  }

  useEffect(() => {
    if (!showNotifications) return
    loadNotifications()
    const supabase = createClient()
    const ch = supabase.channel('notifications-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, () => loadNotifications())
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [showNotifications])

  return (
    <div style={{ height: '100vh', overflow: 'hidden', position: 'relative', background: '#060b14' }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: "url('/Background.png')",
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'rgba(6,11,20,0.92)' }} />

      {/* Top navigation — sits in normal flow, never scrolls */}
      <nav style={{
        position: 'relative', zIndex: 10,
        height: '112px',
        display: 'flex', alignItems: 'center',
        padding: '0 32px',
        background: 'rgba(6,11,20,0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        gap: '32px',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ flexShrink: 0 }}>
          <Image
            src="/Logo2.png"
            alt="Al Rawdah Institutt"
            width={640}
            height={230}
            style={{ height: '108px', width: 'auto', objectFit: 'contain' }}
            priority
          />
        </div>

        {/* Center tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, marginTop: '-16px' }}>
          {/* Active tab */}
          <div style={{
            padding: '6px 16px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: '20px',
            fontFamily: 'Inter, var(--font-montserrat), sans-serif',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#ffffff',
            cursor: 'default',
            whiteSpace: 'nowrap',
          }}>
            Islamske Vitenskaper
          </div>
          {/* Inactive tabs - coming soon */}
          {['Arabic', 'Kalender', 'Timeplan'].map((tab) => (
            <div
              key={tab}
              title="Kommer snart"
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                fontFamily: 'Inter, var(--font-montserrat), sans-serif',
                fontSize: '0.72rem',
                fontWeight: 400,
                color: '#99A5B8',
                cursor: 'not-allowed',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              {tab}
            </div>
          ))}
          {/* Live tab — only shown when admin has an active session */}
          {isLive && (
            <Link href="/live" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.56rem',
                letterSpacing: '0.14em',
                color: '#ef4444',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                background: 'rgba(220,38,38,0.08)',
                border: '1px solid rgba(220,38,38,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', animation: 'livePulse 1.4s infinite', flexShrink: 0 }} />
                Live
              </div>
            </Link>
          )}
          {/* Admin tab — only visible to admin accounts */}
          {isAdmin && (
            <Link href="/admin/live" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.56rem',
                letterSpacing: '0.14em',
                color: '#C9A84C',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                background: 'rgba(201,168,76,0.08)',
                border: '1px solid rgba(201,168,76,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Start Live
              </div>
            </Link>
          )}
        </div>

        {/* Right: placeholder icons + sign out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginTop: '-16px' }}>
          {/* Bell — notifications */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowNotifications(v => !v); setShowMenu(false) }}
              title="Varsler"
              style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: showNotifications ? 'rgba(255,255,255,0.06)' : 'transparent',
                border: `1px solid ${showNotifications ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: showNotifications ? '#fff' : 'rgba(255,255,255,0.55)',
                cursor: 'pointer', transition: 'all 0.15s', position: 'relative',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {notifications.length > 0 && (
                <span style={{ position: 'absolute', top: '6px', right: '6px', width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444', border: '1.5px solid #060b14' }} />
              )}
            </button>

            {showNotifications && (
              <>
                <div onClick={() => setShowNotifications(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
                <div style={{
                  position: 'absolute', top: '44px', right: 0, width: '300px', zIndex: 100,
                  background: 'rgba(8,13,26,0.98)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
                  overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                }}>
                  <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.72rem', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.06em' }}>VARSLER</span>
                    {notifications.length > 0 && (
                      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', color: '#C9A84C', letterSpacing: '0.1em' }}>{notifications.length} ny</span>
                    )}
                  </div>
                  <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                    {notifLoading ? (
                      <div style={{ padding: '28px 16px', textAlign: 'center', fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem', color: '#334155' }}>Laster…</div>
                    ) : notifications.length === 0 ? (
                      <div style={{ padding: '32px 16px', textAlign: 'center', fontFamily: 'var(--font-montserrat)', fontSize: '0.72rem', color: '#334155' }}>Ingen varsler ennå</div>
                    ) : (
                      notifications.map((n, idx) => (
                        <div key={n.id} style={{ padding: '12px 16px', borderBottom: idx < notifications.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.8rem', color: '#e2e8f0', margin: '0 0 5px', lineHeight: 1.55 }}>{n.message}</p>
                          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: '#334155' }}>
                            {new Date(n.created_at).toLocaleDateString('no-NO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Placeholder icons */}
          {[
            <svg key="support" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round"/><circle cx="12" cy="17" r=".5" fill="currentColor"/></svg>,
            <svg key="star" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
          ].map((icon, i) => (
            <button key={i} title="Kommer snart" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.55)', cursor: 'not-allowed' }}>
              {icon}
            </button>
          ))}
          {/* Avatar — opens account menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(v => !v)}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(201,168,76,0.15)',
                border: `1px solid ${showMenu ? 'rgba(201,168,76,0.55)' : 'rgba(201,168,76,0.3)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#C9A84C', fontFamily: 'var(--font-montserrat)',
                fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
                transition: 'border-color 0.18s',
              }}
            >
              {initials}
            </button>

            {/* Dropdown */}
            {showMenu && (
              <>
                {/* Click-away backdrop */}
                <div onClick={() => setShowMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 100 }} />

                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0, zIndex: 101,
                  width: '220px',
                  background: 'rgba(10,16,32,0.97)',
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(201,168,76,0.14)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                }}>
                  {/* User info */}
                  <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#C9A84C', fontFamily: 'var(--font-montserrat)', fontSize: '0.72rem', fontWeight: 700,
                      }}>
                        {initials}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {displayName}
                        </div>
                        <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: '#334155', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: '6px' }}>
                    <button
                      onClick={() => { setShowMenu(false); setAccountTab('profil'); setShowAccount(true) }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 12px', borderRadius: '8px', border: 'none',
                        background: 'transparent', color: '#94a3b8',
                        fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', cursor: 'pointer',
                        transition: 'background 0.15s, color 0.15s', textAlign: 'left',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#e2e8f0' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/></svg>
                      Konto
                    </button>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />

                    <button
                      onClick={() => { setShowMenu(false); onSignOut() }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 12px', borderRadius: '8px', border: 'none',
                        background: 'transparent', color: '#94a3b8',
                        fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', cursor: 'pointer',
                        transition: 'background 0.15s, color 0.15s', textAlign: 'left',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round"/></svg>
                      Logg ut
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Account modal */}
      {showAccount && (
        <div onClick={() => setShowAccount(false)} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '560px', background: '#0b1220', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', letterSpacing: '0.2em', color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase' }}>Konto</span>
              <button onClick={() => setShowAccount(false)} style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', cursor: 'pointer', fontSize: '13px' }}>✕</button>
            </div>

            {/* Body: sidebar + content */}
            <div style={{ display: 'flex', minHeight: '380px' }}>

              {/* Sidebar */}
              <div style={{ width: '168px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {([['profil', 'Profil', <svg key="p" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/></svg>], ['passord', 'Passord', <svg key="k" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round"/></svg>]] as [string, string, React.ReactNode][]).map(([tab, label, icon]) => (
                  <button key={tab} onClick={() => setAccountTab(tab as 'profil' | 'passord')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', background: accountTab === tab ? 'rgba(255,255,255,0.07)' : 'transparent', color: accountTab === tab ? '#e2e8f0' : '#475569', fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', fontWeight: accountTab === tab ? 600 : 400, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', width: '100%' }}
                    onMouseEnter={(e) => { if (accountTab !== tab) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                    onMouseLeave={(e) => { if (accountTab !== tab) e.currentTarget.style.background = 'transparent' }}
                  >
                    {icon}{label}
                  </button>
                ))}
                <div style={{ flex: 1 }} />
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />
                <button onClick={() => { setShowAccount(false); onSignOut() }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#475569', fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round"/></svg>
                  Logg ut
                </button>
              </div>

              {/* Content */}
              <div style={{ flex: 1, padding: '28px 28px 24px', overflowY: 'auto' }}>

                {accountTab === 'profil' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Avatar row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(201,168,76,0.12)', border: '1.5px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontFamily: 'var(--font-montserrat)', fontSize: '1.1rem', fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0' }}>{displayName}</div>
                        <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', color: '#334155', marginTop: '3px' }}>{email}</div>
                      </div>
                    </div>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

                    {/* Name fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {[['Fornavn', editFirst, setEditFirst], ['Etternavn', editLast, setEditLast]].map(([label, val, setter]) => (
                        <div key={label as string}>
                          <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', letterSpacing: '0.1em', color: '#475569', textTransform: 'uppercase', marginBottom: '7px' }}>{label as string}</label>
                          <input value={val as string} onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 13px', color: '#e2e8f0', fontFamily: 'var(--font-montserrat)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.18s' }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)' }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                          />
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {profileMsg && <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', color: profileMsg.startsWith('✓') ? 'rgba(74,197,120,0.9)' : '#ef4444' }}>{profileMsg}</span>}
                      <button onClick={handleSaveProfile} disabled={profileSaving} style={{ marginLeft: 'auto', padding: '10px 22px', background: '#C9A84C', border: 'none', borderRadius: '8px', color: '#0F1829', fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase', cursor: profileSaving ? 'wait' : 'pointer', opacity: profileSaving ? 0.7 : 1 }}>
                        {profileSaving ? 'Lagrer…' : 'Lagre endringer'}
                      </button>
                    </div>
                  </div>
                )}

                {accountTab === 'passord' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[['Nåværende passord', currentPw, setCurrentPw], ['Nytt passord', newPw, setNewPw], ['Bekreft nytt passord', confirmPw, setConfirmPw]].map(([label, val, setter]) => (
                      <div key={label as string}>
                        <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', letterSpacing: '0.1em', color: '#475569', textTransform: 'uppercase', marginBottom: '7px' }}>{label as string}</label>
                        <input type="password" value={val as string} onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                          style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 13px', color: '#e2e8f0', fontFamily: 'var(--font-montserrat)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.18s' }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)' }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                        />
                      </div>
                    ))}

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={signOutOthers} onChange={(e) => setSignOutOthers(e.target.checked)} style={{ width: '15px', height: '15px', accentColor: '#C9A84C', cursor: 'pointer' }} />
                      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.72rem', color: '#64748b' }}>Logg ut av andre enheter</span>
                    </label>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                      {pwMsg && <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', color: pwMsg.startsWith('✓') ? 'rgba(74,197,120,0.9)' : '#ef4444' }}>{pwMsg}</span>}
                      <button onClick={handleUpdatePassword} disabled={pwSaving} style={{ marginLeft: 'auto', padding: '10px 22px', background: '#C9A84C', border: 'none', borderRadius: '8px', color: '#0F1829', fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase', cursor: pwSaving ? 'wait' : 'pointer', opacity: pwSaving ? 0.7 : 1 }}>
                        {pwSaving ? 'Oppdaterer…' : 'Oppdater passord'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable page content — only this div scrolls */}
      <div style={{ height: 'calc(100vh - 112px)', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 32px 80px' }}>

        {/* Greeting */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.25em', color: 'rgba(201,168,76,0.55)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Studentportal
          </div>
          <h1 style={{ fontFamily: 'var(--font-montserrat)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 700, color: '#fff', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Velkommen, <span style={{ color: '#C9A84C' }}>{displayName}</span>
          </h1>
          <div style={{ width: '48px', height: '1px', background: 'linear-gradient(to right, #C9A84C, transparent)' }} />
        </div>

        {/* ── Per-subject sections ─────────────────────────────────────────────── */}
        {SUBJECTS.map((subject) => (
          <section key={subject.id} style={{ marginBottom: '60px' }}>
            {/* Section header */}
            <div style={{ marginBottom: '6px' }}>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.62rem', letterSpacing: '0.28em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>
                FAG
              </div>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: 'clamp(1.1rem, 2vw, 1.45rem)',
              fontWeight: 700, color: '#fff', letterSpacing: '0.05em', marginBottom: '24px',
            }}>
              {subject.name}
            </h2>
            {/* 3-col grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {LEVELS.map((level) => (
                <LevelCard key={level.num} subject={subject} level={level} />
              ))}
            </div>
          </section>
        ))}

      </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────────

export default function StudentPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [firstName, setFirstName] = useState('Student')
  const [userEmail, setUserEmail] = useState('')
  const [isLive, setIsLive] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login')
      } else {
        const { email, user_metadata } = session.user
        setUserEmail(email ?? '')
        const fullName = (user_metadata?.full_name as string | undefined)?.trim()
        if (fullName) {
          setFirstName(fullName)
        } else {
          const prefix = (email ?? '').split('@')[0] || 'Student'
          setFirstName(prefix.charAt(0).toUpperCase() + prefix.slice(1))
        }
        const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '')
          .split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
        setIsAdmin(adminEmails.includes(email.toLowerCase()))
        setChecking(false)
      }
    })
  }, [router])

  // Poll live status every 5 seconds
  useEffect(() => {
    async function checkLive() {
      try {
        const res = await fetch('/api/live-status', { cache: 'no-store' })
        const data = await res.json()
        setIsLive(!!data.isLive)
      } catch { /* ignore */ }
    }
    checkLive()
    const id = setInterval(checkLive, 5000)
    return () => clearInterval(id)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (checking) {
    return (
      <div className="loading-overlay">
        <div className="loading-logo">
          <div className="loading-logo-wrapper">
            <Image
              src="/logo-cropped.png"
              alt="Al Rawdah Institutt"
              width={1287}
              height={461}
              className="loading-logo-img"
              priority
            />
          </div>
        </div>
        <div className="loading-tagline">Laster din opplevelse…</div>
      </div>
    )
  }

  return <PortalUI firstName={firstName} email={userEmail} onSignOut={handleSignOut} isLive={isLive} isAdmin={isAdmin} />
}
