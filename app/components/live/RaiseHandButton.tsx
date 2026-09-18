'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface RaiseHandButtonProps {
  userName?: string
  channelName?: string
}

function HandIcon({ raised }: { raised: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1)',
        transform: raised ? 'rotate(-10deg) translateY(-2px)' : 'rotate(0deg) translateY(0)',
      }}
    >
      {/* Palm */}
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <path d="M14 10.5V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v3" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  )
}

export default function RaiseHandButton({
  userName = 'Student',
  channelName = 'live-class',
}: RaiseHandButtonProps) {
  const [raised, setRaised] = useState(false)
  const [pressing, setPressing] = useState(false)
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const ch = supabase.channel(`${channelName}-hands`, {
      config: { broadcast: { self: false } },
    })
    ch.subscribe()
    channelRef.current = ch
    return () => { supabase.removeChannel(ch) }
  }, [channelName])

  async function toggle() {
    const { data: { user } } = await createClient().auth.getUser()
    if (!user) return
    const next = !raised
    setRaised(next)
    if (next && channelRef.current) {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'raisehand',
        payload: {
          id: Date.now(),
          userId: user.id,
          student: userName,
          raisedAt: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' }),
        },
      })
    }
  }

  return (
    <button
      onClick={toggle}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => setPressing(false)}
      onMouseLeave={() => setPressing(false)}
      aria-label={raised ? 'Senk hånden' : 'Rekk opp hånden'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 9,
        padding: '10px 20px',
        background: raised
          ? 'rgba(201,168,76,0.13)'
          : pressing
          ? 'rgba(255,255,255,0.06)'
          : 'rgba(255,255,255,0.04)',
        border: raised
          ? '1px solid rgba(201,168,76,0.45)'
          : '1px solid rgba(255,255,255,0.09)',
        borderRadius: 8,
        color: raised ? '#C9A84C' : '#64748b',
        fontFamily: 'var(--font-montserrat)',
        fontSize: '0.6rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        fontWeight: 700,
        cursor: 'pointer',
        transform: pressing ? 'scale(0.97)' : 'scale(1)',
        transition: 'background 0.2s, border-color 0.2s, color 0.2s, transform 0.12s cubic-bezier(0.23,1,0.32,1), box-shadow 0.2s',
        boxShadow: raised ? '0 0 18px rgba(201,168,76,0.1)' : 'none',
      }}
    >
      <HandIcon raised={raised} />
      {raised ? 'Hånd hevet' : 'Rekk opp hånden'}
      {raised && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#C9A84C',
            animation: 'livePulse 1.6s ease-in-out infinite',
            flexShrink: 0,
          }}
        />
      )}
    </button>
  )
}
