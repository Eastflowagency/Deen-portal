'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Participant {
  sessionId: string
  userName: string
  isOwner: boolean
  isLocal: boolean
  videoTrack: MediaStreamTrack | null
  audioTrack: MediaStreamTrack | null
}

interface Props {
  meetingUrl: string
  token: string
  displayName: string
  role: 'teacher' | 'viewer' | 'speaker'
}

// ── Sub-components ────────────────────────────────────────────────────────────

// All video elements are always muted — audio is handled by RemoteAudio
function VideoTile({ track, label, style }: {
  track: MediaStreamTrack | null
  label?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.srcObject = track ? new MediaStream([track]) : null
  }, [track])

  return (
    <div style={{ position: 'relative', background: '#060b14', overflow: 'hidden', ...style }}>
      <video
        ref={ref}
        autoPlay
        muted
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      {!track && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
          </svg>
        </div>
      )}
      {label && (
        <div style={{
          position: 'absolute', bottom: 8, left: 8,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
          padding: '2px 8px', borderRadius: 4,
        }}>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.52rem', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.08em' }}>
            {label}
          </span>
        </div>
      )}
    </div>
  )
}

function RemoteAudio({ track }: { track: MediaStreamTrack | null }) {
  const ref = useRef<HTMLAudioElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !track) return
    el.srcObject = new MediaStream([track])
    el.play().catch(() => {})
    return () => { el.srcObject = null }
  }, [track])
  return <audio ref={ref} autoPlay style={{ display: 'none' }} />
}

function ControlBtn({ active, onClick, label, children }: {
  active: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
        background: active ? 'rgba(255,255,255,0.1)' : 'rgba(220,38,38,0.75)',
        border: '1px solid ' + (active ? 'rgba(255,255,255,0.12)' : 'rgba(220,38,38,0.5)'),
        borderRadius: 10, padding: '10px 20px', cursor: 'pointer',
        transition: 'all 0.18s cubic-bezier(0.23,1,0.32,1)',
        color: '#fff',
      }}
    >
      {children}
      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.48rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DailyVideoCall({ meetingUrl, token, displayName, role }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const callRef = useRef<any>(null)
  const [participants, setParticipants] = useState<Record<string, Participant>>({})
  const [micOn, setMicOn] = useState(role === 'teacher')
  const [camOn, setCamOn] = useState(role === 'teacher')
  const [error, setError] = useState('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sync = useCallback((call: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: Record<string, any> = call.participants()
    const next: Record<string, Participant> = {}
    Object.entries(raw).forEach(([key, p]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pp = p as any
      const sid = key === 'local' ? 'local' : (pp.session_id as string)
      next[sid] = {
        sessionId: sid,
        userName: (pp.user_name as string) || displayName,
        isOwner: !!pp.owner,
        isLocal: key === 'local',
        videoTrack: pp.tracks?.video?.persistentTrack ?? null,
        audioTrack: pp.tracks?.audio?.persistentTrack ?? null,
      }
    })
    setParticipants(next)
  }, [displayName])

  useEffect(() => {
    if (!meetingUrl || !token) return
    let destroyed = false

    import('@daily-co/daily-js').then(mod => {
      if (destroyed) return
      const Daily = mod.default
      const call = Daily.createCallObject()
      callRef.current = call

      call
        .on('joined-meeting', () => {
          sync(call)
          if (role !== 'viewer') {
            setMicOn(call.localAudio())
            setCamOn(call.localVideo())
          }
        })
        .on('participant-joined', () => sync(call))
        .on('participant-updated', () => sync(call))
        .on('participant-left', () => sync(call))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('error', (e: any) => setError(e?.errorMsg ?? 'Tilkoblingsfeil'))

      call.join({ url: meetingUrl, token, userName: displayName }).catch(() => {
        setError('Kunne ikke koble til klassen')
      })
    }).catch(() => setError('Kunne ikke laste videomodul'))

    return () => {
      destroyed = true
      callRef.current?.destroy()
      callRef.current = null
      setParticipants({})
      setError('')
    }
  }, [meetingUrl, token, displayName, role, sync])

  const toggleMic = () => {
    const call = callRef.current
    if (!call) return
    const next = !micOn
    call.setLocalAudio(next)
    setMicOn(next)
  }

  const toggleCam = () => {
    const call = callRef.current
    if (!call) return
    const next = !camOn
    call.setLocalVideo(next)
    setCamOn(next)
  }

  if (error) {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: '#060b14' }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
          {error}
        </span>
      </div>
    )
  }

  const list = Object.values(participants)
  const local = participants['local']
  const remotes = list.filter(p => !p.isLocal)
  // Teacher is the owner — the pinned dominant participant
  const teacher = remotes.find(p => p.isOwner)
  // Admitted speakers: remote non-owners who have active tracks
  const admittedSpeakers = remotes.filter(p => !p.isOwner && (p.videoTrack || p.audioTrack))

  // Teacher always sees their own camera as dominant
  // Everyone else always sees the teacher (owner) as dominant
  const dominantTrack = role === 'teacher' ? (local?.videoTrack ?? null) : (teacher?.videoTrack ?? null)
  const dominantLabel = role === 'teacher' ? (local?.userName ?? displayName) : (teacher?.userName ?? 'Ustadh')

  const showControls = role === 'teacher' || role === 'speaker'

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000611' }}>

      {/* Audio for all remote participants */}
      {remotes.map(p => <RemoteAudio key={p.sessionId} track={p.audioTrack} />)}

      {/* Dominant tile: teacher is always here */}
      <VideoTile
        track={dominantTrack}
        label={dominantLabel}
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* Thumbnail column: admitted speakers (top-right) */}
      {admittedSpeakers.length > 0 && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          display: 'flex', flexDirection: 'column', gap: 8,
          zIndex: 10,
        }}>
          {admittedSpeakers.map(p => (
            <VideoTile
              key={p.sessionId}
              track={p.videoTrack}
              label={p.userName}
              style={{
                width: 140, height: 79, borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              }}
            />
          ))}
        </div>
      )}

      {/* Self-view for admitted speakers (bottom-right) */}
      {role === 'speaker' && local?.videoTrack && (
        <VideoTile
          track={local.videoTrack}
          label="Deg"
          style={{
            position: 'absolute',
            bottom: showControls ? 72 : 12, right: 12,
            width: 120, height: 68, borderRadius: 8, zIndex: 10,
            border: '1px solid rgba(201,168,76,0.25)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          }}
        />
      )}

      {/* Controls bar for teacher + admitted speakers */}
      {showControls && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
          display: 'flex', justifyContent: 'center', gap: 10,
          padding: '12px 16px 14px',
          background: 'linear-gradient(transparent, rgba(0,6,20,0.92))',
        }}>
          <ControlBtn active={micOn} onClick={toggleMic} label={micOn ? 'Mute' : 'Unmute'}>
            {micOn ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="8" y1="22" x2="16" y2="22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                <path d="M17 16.95A7 7 0 0 1 5 10v-1m14 0v1a7 7 0 0 1-.11 1.23" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="8" y1="22" x2="16" y2="22" />
              </svg>
            )}
          </ControlBtn>

          <ControlBtn active={camOn} onClick={toggleCam} label={camOn ? 'Kamera av' : 'Kamera på'}>
            {camOn ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06A2 2 0 0 1 12 15.5a2 2 0 0 1-.5-3.93" />
                <polyline points="23 7 16 12 23 17 23 7" />
              </svg>
            )}
          </ControlBtn>
        </div>
      )}
    </div>
  )
}
