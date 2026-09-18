'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './LiveRoom.module.css'
import { createClient } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface ChatMessage {
  id: number
  user: string
  message: string
  time: string
  isTeacher: boolean
}

export interface QnaItem {
  id: number
  user: string
  question: string
  votes: number
  answered: boolean
}

interface LiveChatProps {
  channelName?: string
  userName?: string
  isTeacher?: boolean
  onParticipantCountChange?: (count: number) => void
}

export default function LiveChat({
  channelName = 'live-class',
  userName = 'Student',
  isTeacher = false,
  onParticipantCountChange,
}: LiveChatProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'qna'>('chat')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [qna, setQna] = useState<QnaItem[]>([])
  const [connected, setConnected] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const followLatest = useRef(true)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const presenceChRef = useRef<RealtimeChannel | null>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    const list = listRef.current
    if (list && followLatest.current) list.scrollTop = list.scrollHeight
  }, [messages, qna, activeTab])

  // Connect to Supabase Realtime
  useEffect(() => {
    const supabase = createClient()

    // Broadcast-only channel for chat + qna — no presence config so it never
    // conflicts with RaiseHandButton which subscribes to the same topic.
    const ch = supabase.channel(channelName, {
      config: { broadcast: { self: true } },
    })

    ch
      .on('broadcast', { event: 'chat' }, ({ payload }) => {
        setMessages(prev => [...prev, payload as ChatMessage])
      })
      .on('broadcast', { event: 'qna' }, ({ payload }) => {
        setQna(prev => [...prev, payload as QnaItem])
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setConnected(true)
        else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') setConnected(false)
      })

    channelRef.current = ch

    // Separate presence channel so we never add presence callbacks to an
    // already-subscribed broadcast channel (which causes a runtime error).
    const presenceCh = supabase.channel(`${channelName}-presence`, {
      config: { presence: { key: `${userName}-${Date.now()}` } },
    })

    presenceCh
      .on('presence', { event: 'sync' }, () => {
        const count = Object.keys(presenceCh.presenceState()).length
        onParticipantCountChange?.(count)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceCh.track({ userName, role: isTeacher ? 'teacher' : 'student' })
        }
      })

    presenceChRef.current = presenceCh

    return () => {
      supabase.removeChannel(ch)
      supabase.removeChannel(presenceCh)
      channelRef.current = null
      presenceChRef.current = null
      setConnected(false)
    }
  }, [channelName, userName, isTeacher, onParticipantCountChange])

  async function send() {
    if (!input.trim() || !channelRef.current) return
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    if (activeTab === 'chat') {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'chat',
        payload: {
          id: Date.now(),
          user: userName,
          message: input.trim(),
          time,
          isTeacher,
        } satisfies ChatMessage,
      })
    } else {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'qna',
        payload: {
          id: Date.now(),
          user: userName,
          question: input.trim(),
          votes: 0,
          answered: false,
        } satisfies QnaItem,
      })
    }
    setInput('')
  }

  return (
    <div className={styles.chat} style={{
      display: 'flex', flexDirection: 'column',
      height: '100%',
      background: '#0F1829',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '20px', overflow: 'hidden',
    }}>

      {/* Tab header */}
      <div style={{ flexShrink: 0 }}>
        {/* Tab buttons row */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {(['chat', 'qna'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { followLatest.current = true; setActiveTab(tab) }}
              aria-pressed={activeTab === tab}
              className="btn-press"
              style={{
                padding: '18px 22px',
                background: 'transparent', border: 'none',
                borderBottom: activeTab === tab ? '2px solid #ffffff' : '2px solid transparent',
                fontFamily: 'var(--font-inter)', fontSize: '0.85rem', fontWeight: 600,
                letterSpacing: 'normal',
                color: activeTab === tab ? '#ffffff' : '#94a3b8',
                cursor: 'pointer', transition: 'color 0.2s', marginBottom: '-1px',
                whiteSpace: 'nowrap',
              }}
            >
              {tab === 'chat' ? 'Chat' : 'Spørsmål & Svar'}
            </button>
          ))}
        </div>
      </div>

      {/* Message list */}
      <div ref={listRef} onScroll={e => { const el = e.currentTarget; followLatest.current = el.scrollHeight - el.scrollTop - el.clientHeight < 64 }} style={{
        minHeight: 0, overflowWrap: 'anywhere', flex: 1, overflowY: 'auto', padding: '16px',
        display: 'flex', flexDirection: 'column', gap: '14px',
        scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.14) transparent',
      }}>
        {activeTab === 'chat' ? (
          messages.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.72rem', color: '#64748b', textAlign: 'center', margin: 'auto 0' }}>
              Ingen meldinger ennå
            </p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={styles.chatMessage}>
                <span className={styles.chatAvatar} aria-hidden="true">{msg.user.charAt(0).toUpperCase()}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                    {msg.user}
                  </span>
                  {msg.isTeacher && (
                    <span style={{ fontSize: '0.52rem', letterSpacing: '0.12em', background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', padding: '1px 6px', borderRadius: 3, fontFamily: 'var(--font-inter)', fontWeight: 700 }}>
                      LÆRER
                    </span>
                  )}
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-inter)', marginLeft: 'auto' }}>
                    {msg.time}
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', color: msg.isTeacher ? '#e2e8f0' : '#cbd5e1', lineHeight: 1.55, margin: 0, fontWeight: 400 }}>
                  {msg.message}
                </p>
              </div>
            ))
          )
        ) : (
          qna.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.72rem', color: '#64748b', textAlign: 'center', margin: 'auto 0' }}>
              Ingen spørsmål ennå
            </p>
          ) : (
            qna.map((item) => (
              <div key={item.id} style={{
                background: item.answered ? 'rgba(74,197,120,0.05)' : 'rgba(255,255,255,0.025)',
                border: `1px solid ${item.answered ? 'rgba(74,197,120,0.18)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 8, padding: '12px 14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.58rem', letterSpacing: '0.1em', color: '#64748b' }}>
                      {item.user}
                    </span>
                    <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', color: '#94a3b8', margin: '5px 0 0', lineHeight: 1.5, fontWeight: 400 }}>
                      {item.question}
                    </p>
                  </div>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 700, flexShrink: 0 }}>
                    ↑{item.votes}
                  </span>
                </div>
                {item.answered && (
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(74,197,120,0.65)' }} />
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.52rem', color: 'rgba(74,197,120,0.65)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                      Besvart
                    </span>
                  </div>
                )}
              </div>
            ))
          )
        )}

      </div>

      {/* Input */}
      <div style={{ padding: '12px 14px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, background: 'transparent' }}>
        <div style={{ display: 'flex', gap: 8, minWidth: 0 }}>
          <input
            aria-label="Melding eller spørsmål"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder={!connected ? 'Kobler til chat...' : activeTab === 'chat' ? 'Skriv en melding…' : 'Still et spørsmål…'}
            disabled={!connected}
            style={{
              minWidth: 0, flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 12, padding: '14px 13px',
              color: '#f1f5f9', fontFamily: 'var(--font-inter)',
              fontSize: '0.9rem', outline: 'none', fontWeight: 400,
              transition: 'border-color 0.2s',
              opacity: connected ? 1 : 0.5,
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.42)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)' }}
          />
          <button
            onClick={() => { followLatest.current = true; void send() }}
            aria-label="Send melding"
            disabled={!connected || !input.trim()}
            className="btn-press"
            style={{
              padding: '10px 16px',
              background: connected && input.trim() ? '#f8fafc' : 'rgba(255,255,255,0.06)',
              border: 'none', borderRadius: 7,
              color: connected && input.trim() ? '#0F1829' : '#64748b',
              fontFamily: 'var(--font-inter)', fontSize: '0.6rem',
              letterSpacing: '0.14em', fontWeight: 700,
              cursor: connected && input.trim() ? 'pointer' : 'not-allowed',
              whiteSpace: 'nowrap', textTransform: 'uppercase',
              transition: 'all 0.2s cubic-bezier(0.23,1,0.32,1)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
