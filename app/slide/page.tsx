'use client'

import Image from 'next/image'

export default function SlidePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #060b14;
          font-family: 'Cormorant Garamond', serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        @media print {
          body { background: #060b14; }
          @page { size: A4 landscape; margin: 0; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Print button — hidden when printing */}
      <div className="no-print" style={{
        position: 'fixed', top: '20px', right: '20px', zIndex: 999,
        display: 'flex', gap: '10px',
      }}>
        <button
          onClick={() => window.print()}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            padding: '10px 24px',
            background: '#C9A84C',
            color: '#0F1829',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          Print / Save PDF
        </button>
        <a
          href="/"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            padding: '10px 24px',
            background: 'transparent',
            color: '#94a3b8',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '4px',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          ← Back
        </a>
      </div>

      {/* SLIDE — A4 landscape proportions */}
      <div style={{
        width: '297mm',
        height: '210mm',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: "url('/Background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#060b14',
        display: 'flex',
      }}>

        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,11,20,0.78)' }} />

        {/* Gold left accent bar */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px', background: 'linear-gradient(to bottom, transparent, #C9A84C, transparent)' }} />

        {/* LEFT COLUMN */}
        <div style={{ position: 'relative', zIndex: 1, width: '45%', padding: '28mm 12mm 20mm 18mm', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid rgba(201,168,76,0.15)' }}>

          {/* Logo */}
          <div>
            <Image
              src="/logo-cropped.png"
              alt="Al Rawdah Institutt"
              width={988} height={374}
              style={{ height: '20mm', width: 'auto', objectFit: 'contain', marginBottom: '10mm' }}
            />

            {/* Divider */}
            <div style={{ width: '40mm', height: '1px', background: 'linear-gradient(to right, #C9A84C, transparent)', marginBottom: '8mm' }} />

            {/* Tagline */}
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: '6pt', letterSpacing: '0.28em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '5mm' }}>
              — Islamsk utdanning i Norge —
            </p>

            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '22pt', fontWeight: 700, color: '#ffffff', letterSpacing: '0.04em', lineHeight: 1.1, marginBottom: '6mm' }}>
              TRE ÅR.<br />
              <span style={{ color: '#C9A84C' }}>ÉTT MÅL.</span>
            </h1>

            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '10pt', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontStyle: 'italic', maxWidth: '70mm' }}>
              Et strukturert 3-årig program i arabisk og islamske vitenskaper — laget for norske muslimer som vil lære Islam ordentlig.
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '8mm', alignItems: 'flex-end' }}>
            {[
              { num: '30', label: 'Plasser' },
              { num: '3', label: 'År' },
              { num: '7', label: 'Fag' },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: '20pt', fontWeight: 700, color: '#C9A84C', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: '5pt', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase', marginTop: '1mm' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ position: 'relative', zIndex: 1, width: '55%', padding: '20mm 18mm 20mm 14mm', display: 'flex', flexDirection: 'column', gap: '6mm' }}>

          {/* Timeline */}
          <div style={{ marginBottom: '2mm' }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: '5.5pt', letterSpacing: '0.25em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '4mm' }}>Studieplan</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5mm' }}>
              {[
                { year: '2026–2027', label: 'Nivå 1', sub: 'Grunnivå' },
                { year: '2027–2028', label: 'Nivå 2', sub: 'Mellomnivå' },
                { year: '2028–2029', label: 'Nivå 3', sub: 'Viderenivå' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4mm', padding: '3mm 5mm', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '3mm' }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: '5.5pt', letterSpacing: '0.1em', color: '#C9A84C', minWidth: '18mm' }}>{t.year}</div>
                  <div style={{ width: '1px', height: '8mm', background: 'rgba(201,168,76,0.2)' }} />
                  <div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: '7.5pt', letterSpacing: '0.1em', color: '#e2e8f0', fontWeight: 600 }}>{t.label}</div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: '5pt', letterSpacing: '0.12em', color: '#64748b', textTransform: 'uppercase', marginTop: '0.5mm' }}>{t.sub} · Høst + Vår</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subjects grid */}
          <div>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: '5.5pt', letterSpacing: '0.25em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '3mm' }}>Fagområder</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2mm' }}>
              {[
                'Koranvitenskaper',
                'Aqidah',
                'Fiqh',
                'Seerah',
                'Hadith',
                'Adab al-Talib',
                'Arabisk (2 sem. per år)',
              ].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '2.5mm' }}>
                  <div style={{ width: '1.5mm', height: '1.5mm', borderRadius: '50%', background: '#C9A84C', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '8pt', color: 'rgba(255,255,255,0.75)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(201,168,76,0.12)' }} />

          {/* Bottom info row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: '5pt', letterSpacing: '0.2em', color: '#64748b', textTransform: 'uppercase', marginBottom: '1.5mm' }}>Pris</p>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: '14pt', color: '#C9A84C', fontWeight: 700, lineHeight: 1 }}>100 kr<span style={{ fontSize: '7pt', color: '#94a3b8', fontWeight: 400 }}>/mnd</span></p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '7pt', color: '#64748b', fontStyle: 'italic', marginTop: '1mm' }}>Maks 30 studenter · Intervju kreves</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: '5pt', letterSpacing: '0.2em', color: '#64748b', textTransform: 'uppercase', marginBottom: '1.5mm' }}>Start</p>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: '12pt', color: '#fff', fontWeight: 700, lineHeight: 1 }}>Sep 2026</p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: '5pt', letterSpacing: '0.2em', color: '#64748b', textTransform: 'uppercase', marginBottom: '1.5mm' }}>Undervisning</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '8.5pt', color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', lineHeight: 1.4 }}>
                Ukentlige liveklasser<br />
                via Google Meet
              </p>
            </div>
          </div>

          {/* Website */}
          <div style={{ paddingTop: '2mm', borderTop: '1px solid rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: '5.5pt', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>
              معهد الروضة
            </p>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: '5.5pt', letterSpacing: '0.15em', color: '#C9A84C', textTransform: 'uppercase' }}>
              AL RAWDAH INSTITUTT · NORGE
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

