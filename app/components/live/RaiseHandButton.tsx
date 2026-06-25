'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface RaiseHandButtonProps {
  userName?: string
  channelName?: string
}

export default function RaiseHandButton({ userName = 'Student', channelName = 'live-class' }: RaiseHandButtonProps) {
  const [raised, setRaised] = useState(false)
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
    const next = !raised
    setRaised(next)
    if (next && channelRef.current) {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'raisehand',
        payload: {
          id: Date.now(),
          student: userName,
          raisedAt: new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' }),
        },
      })
    }
  }

  return (
    <button
      onClick={toggle}
      className="btn-press"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '11px 22px',
        background: raised ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.04)',
        border: raised ? '1px solid rgba(201,168,76,0.45)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        color: raised ? '#C9A84C' : '#475569',
        fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem',
        letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700,
        cursor: 'pointer',
        transition: 'background 0.22s cubic-bezier(0.23,1,0.32,1), border-color 0.22s, color 0.22s',
        boxShadow: raised ? '0 0 16px rgba(201,168,76,0.1)' : 'none',
      }}
    >
      <span style={{ fontSize: '1.05rem', display: 'inline-block', animation: raised ? 'handWave 0.55s ease' : 'none', transformOrigin: 'bottom center' }}>
        ✋
      </span>
      {raised ? 'Hånd hevet' : 'Rekk opp hånden'}
      {raised && (
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#C9A84C', animation: 'livePulse 1.6s ease-in-out infinite', flexShrink: 0 }} />
      )}
    </button>
  )
}
