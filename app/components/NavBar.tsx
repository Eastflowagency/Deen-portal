'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)
const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)
const IconChevronDown = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const NAV_LINKS: { label: string; href: string; dropdown?: { label: string; href: string }[] }[] = [
  { label: 'Hjem', href: '/' },
  {
    label: 'Pensum', href: '/#curriculum',
    dropdown: [
      { label: 'Studieplan', href: '/studieplan' },
    ],
  },
  { label: 'Pris', href: '/#pricing' },
  { label: 'Artikler', href: '/artikler' },
  { label: 'Spørsmål', href: '/#faq' },
]

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [navOpacity, setNavOpacity] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setNavOpacity(Math.min(y / 80, 1))
      setScrolled(y > 40)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const pillBg = scrolled ? 'rgba(12,20,38,0.5)' : 'rgba(12,20,38,0.18)'
  const pillBorder = scrolled ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(201,168,76,0.22)'
  const pillShadow = scrolled
    ? '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(201,168,76,0.12), inset 0 0 0 1px rgba(201,168,76,0.06)'
    : '0 2px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(201,168,76,0.08)'

  return (
    <header className="fixed z-50" style={{ top: 0, left: 0, right: 0 }}>
      {/* Blur overlay — always rendered, opacity-driven by scroll (GPU-composited) */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'rgba(6,11,20,0.82)',
        backdropFilter: 'blur(12px) saturate(140%)',
        WebkitBackdropFilter: 'blur(12px) saturate(140%)',
        borderBottom: '1px solid rgba(201,168,76,0.08)',
        opacity: navOpacity,
        transition: 'opacity 180ms linear',
        willChange: 'opacity',
      }} />
      <div
        className="flex items-center justify-between"
        style={{ position: 'relative', width: '100%', padding: '8px 24px', gap: '16px' }}
      >
        {/* Logo */}
        <Link href="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image
            src="/logo-cropped.png"
            alt="Al Rawdah Institutt"
            width={988} height={374}
            style={{ height: 'clamp(54px, 7vw, 78px)', width: 'auto', objectFit: 'contain' }}
            priority
          />
        </Link>

        <nav role="navigation" aria-label="Main navigation" style={{ flexShrink: 0 }}>
          {/* â”€â”€ Desktop pill â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div
            className="hidden md:flex items-center gap-0.5"
            style={{
              background: pillBg,
              backdropFilter: 'blur(28px) saturate(200%) brightness(1.04)',
              WebkitBackdropFilter: 'blur(28px) saturate(200%) brightness(1.04)',
              border: pillBorder,
              borderRadius: '999px',
              padding: '6px 6px 6px 8px',
              transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
              boxShadow: pillShadow,
            }}
          >
            {NAV_LINKS.map((l) => {
              const isOpen = dropdownOpen === l.label

              if (l.dropdown) {
                return (
                  <div
                    key={l.label}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setDropdownOpen(l.label)}
                    onMouseLeave={() => setDropdownOpen(null)}
                  >
                    <Link
                      href={l.href}
                      style={{
                        color: isOpen ? '#C9A84C' : '#e2e8f0',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-montserrat)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        padding: '9px 18px',
                        borderRadius: '999px',
                        whiteSpace: 'nowrap',
                        transition: 'color 0.2s ease, background 0.2s ease',
                        lineHeight: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: isOpen ? 'rgba(201,168,76,0.12)' : 'transparent',
                        fontWeight: isOpen ? 600 : 400,
                      }}
                    >
                      {l.label}
                      <span style={{ transition: 'transform 0.2s ease', transform: isOpen ? 'rotate(180deg)' : 'none', display: 'flex' }}>
                        <IconChevronDown />
                      </span>
                    </Link>
                    {isOpen && (
                      <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', paddingTop: '10px', zIndex: 200, minWidth: '210px' }}>
                        <div style={{
                          background: 'rgba(6,11,20,0.97)',
                          backdropFilter: 'blur(24px) saturate(200%)',
                          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
                          border: '1px solid rgba(201,168,76,0.2)',
                          borderRadius: '16px',
                          padding: '8px',
                          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                        }}>
                          {l.dropdown.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={() => setDropdownOpen(null)}
                              style={{
                                display: 'block',
                                color: '#cbd5e1',
                                textDecoration: 'none',
                                fontSize: '0.8rem',
                                fontFamily: 'var(--font-montserrat)',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                padding: '12px 18px',
                                borderRadius: '10px',
                                transition: 'color 0.2s ease, background 0.2s ease',
                                whiteSpace: 'nowrap',
                              }}
                              onMouseEnter={(e) => {
                                const el = e.currentTarget as HTMLElement
                                el.style.color = '#C9A84C'
                                el.style.background = 'rgba(201,168,76,0.08)'
                              }}
                              onMouseLeave={(e) => {
                                const el = e.currentTarget as HTMLElement
                                el.style.color = '#cbd5e1'
                                el.style.background = 'transparent'
                              }}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{
                    color: '#e2e8f0',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-montserrat)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    padding: '9px 18px',
                    borderRadius: '999px',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s ease, background 0.2s ease',
                    lineHeight: 1,
                    display: 'block',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = '#C9A84C'
                    el.style.background = 'rgba(201,168,76,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = '#e2e8f0'
                    el.style.background = 'transparent'
                  }}
                >
                  {l.label}
                </Link>
              )
            })}

            {/* Student Login CTA */}
            <Link
              href="/login"
              className="btn-press"
              style={{
                background: '#C9A84C',
                color: '#0F1829',
                padding: '9px 22px',
                borderRadius: '999px',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-montserrat)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #C9A84C',
                transition: 'background 0.2s cubic-bezier(0.23,1,0.32,1), transform 0.14s cubic-bezier(0.23,1,0.32,1), box-shadow 0.2s cubic-bezier(0.23,1,0.32,1)',
                lineHeight: 1,
                boxShadow: '0 2px 12px rgba(201,168,76,0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#dbb95e'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.45)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#C9A84C'
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(201,168,76,0.3)'
              }}
            >
              Student Login <IconArrow />
            </Link>
          </div>

          {/* â”€â”€ Mobile hamburger â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <button
            className="md:hidden flex items-center justify-center btn-press"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{
              background: pillBg,
              backdropFilter: 'blur(28px) saturate(200%) brightness(1.04)',
              WebkitBackdropFilter: 'blur(28px) saturate(200%) brightness(1.04)',
              border: pillBorder,
              borderRadius: '999px',
              color: '#C9A84C',
              width: '48px',
              height: '48px',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </nav>
      </div>

      {/* â”€â”€ Mobile menu panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            background: 'rgba(6,11,20,0.97)',
            backdropFilter: 'blur(24px) saturate(200%)',
            WebkitBackdropFilter: 'blur(24px) saturate(200%)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '20px',
            padding: '8px',
            margin: '8px 20px 0',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {NAV_LINKS.map((l) => {
            if (l.dropdown) {
              const isExpanded = mobileDropdownOpen === l.label
              return (
                <div key={l.label}>
                  <button
                    onClick={() => setMobileDropdownOpen(isExpanded ? null : l.label)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      color: isExpanded ? '#C9A84C' : '#cbd5e1',
                      background: isExpanded ? 'rgba(201,168,76,0.08)' : 'transparent',
                      border: 'none',
                      fontSize: '0.88rem',
                      fontFamily: 'var(--font-montserrat)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '14px 20px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease, background 0.2s ease',
                    }}
                  >
                    {l.label}
                    <span style={{ transition: 'transform 0.2s ease', transform: isExpanded ? 'rotate(180deg)' : 'none', display: 'flex' }}>
                      <IconChevronDown />
                    </span>
                  </button>
                  {isExpanded && (
                    <div style={{ paddingLeft: '16px', paddingBottom: '4px' }}>
                      {l.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => { setMenuOpen(false); setMobileDropdownOpen(null) }}
                          style={{
                            display: 'block',
                            color: '#C9A84C',
                            textDecoration: 'none',
                            fontSize: '0.78rem',
                            fontFamily: 'var(--font-montserrat)',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            padding: '11px 20px',
                            borderRadius: '10px',
                            borderLeft: '1px solid rgba(201,168,76,0.25)',
                            marginLeft: '4px',
                            transition: 'background 0.2s ease',
                          }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.08)')}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-montserrat)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  transition: 'color 0.2s ease, background 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = '#C9A84C'
                  el.style.background = 'rgba(201,168,76,0.08)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = '#cbd5e1'
                  el.style.background = 'transparent'
                }}
              >
                {l.label}
              </Link>
            )
          })}
          <div style={{ padding: '4px 8px 8px' }}>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="btn-press"
              style={{
                display: 'block',
                textAlign: 'center',
                backgroundColor: '#C9A84C',
                color: '#0F1829',
                padding: '14px 20px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                fontFamily: 'var(--font-montserrat)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Student Login
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

