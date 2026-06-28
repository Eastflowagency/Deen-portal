# Pensum Connections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the home page curriculum sections to /kurs and /studieplan, make Nivå rows and subject cards interactive, and add URL-param-based level pre-selection to the pensum pages.

**Architecture:** Three independent edits to existing client components — no new files, no new routes. `useSearchParams()` reads `?nivå=N` / `?filter=N` from the URL on mount and seeds the active-level state. A Suspense boundary already exists in layout.tsx so no extra wrapper is needed.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS (utility classes only where pre-existing), inline React styles (project convention).

---

## Files Modified

| File | What changes |
|---|---|
| `app/page.tsx` | TIMELINE gets `nivå` field; table header gets 4th column; rows become `<Link>` with button; subject cards become `<Link>` with "Se kurs →" footer |
| `app/studieplan/page.tsx` | `useSearchParams` seeds `activeLevel` from `?nivå=` |
| `app/kurs/page.tsx` | `useSearchParams` seeds `activeFilter` from `?filter=` |
| `app/kurs/[slug]/page.tsx` | Already has breadcrumb — verified, no change needed |

---

## Task 1: Add `nivå` field to TIMELINE and update table header

**Files:**
- Modify: `app/page.tsx:58-62` (TIMELINE array)
- Modify: `app/page.tsx:1155-1173` (table header)

- [ ] **Step 1: Update TIMELINE array** (line 58–62)

Replace:
```tsx
const TIMELINE = [
  { year: '2026–2027', level: 'Nivå 1', sub: 'Grunnivå', semesters: 'Høst + Vår' },
  { year: '2027–2028', level: 'Nivå 2', sub: 'Mellomnivå', semesters: 'Høst + Vår' },
  { year: '2028–2029', level: 'Nivå 3', sub: 'Viderenivå', semesters: 'Høst + Vår' },
]
```

With:
```tsx
const TIMELINE = [
  { year: '2026–2027', level: 'Nivå 1', sub: 'Grunnivå', semesters: 'Høst + Vår', nivå: 1 },
  { year: '2027–2028', level: 'Nivå 2', sub: 'Mellomnivå', semesters: 'Høst + Vår', nivå: 2 },
  { year: '2028–2029', level: 'Nivå 3', sub: 'Viderenivå', semesters: 'Høst + Vår', nivå: 3 },
]
```

- [ ] **Step 2: Update table header to add 4th column**

Replace the table header div (lines ~1155–1173):
```tsx
{/* Table header */}
<div style={{
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr auto',
  borderBottom: '1px solid rgba(201,168,76,0.15)',
  padding: '14px 32px',
}}>
  {['År', 'Nivå', 'Semester'].map((h) => (
    <div key={h} style={{
      fontFamily: 'var(--font-cinzel)',
      fontSize: '0.6rem',
      letterSpacing: '0.25em',
      textTransform: 'uppercase',
      color: 'rgba(201,168,76,0.55)',
    }}>
      {h}
    </div>
  ))}
  <div />
</div>
```

- [ ] **Step 3: Verify the dev server compiles** — open http://localhost:3002, no red error overlay.

- [ ] **Step 4: Commit**
```bash
git add app/page.tsx
git commit -m "feat: add nivå field to TIMELINE and 4th column to table header"
```

---

## Task 2: Make timeline rows clickable with "Se studieplan →" button

**Files:**
- Modify: `app/page.tsx:1174-1228` (timeline rows)

- [ ] **Step 1: Replace timeline row `<div>` with `<Link>`**

Replace the entire `{TIMELINE.map(...)}` block (lines ~1175–1228) with:

```tsx
{/* Timeline rows */}
{TIMELINE.map((row, i) => (
  <Link
    key={row.year}
    href={`/studieplan?nivå=${row.nivå}`}
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr auto',
      padding: '20px 32px',
      borderBottom: i < TIMELINE.length - 1 ? '1px solid rgba(201,168,76,0.08)' : 'none',
      alignItems: 'center',
      transition: 'background 0.2s ease',
      textDecoration: 'none',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.04)')}
    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
  >
    <div style={{
      fontFamily: 'var(--font-cormorant)',
      fontSize: '1.05rem',
      color: '#cbd5e1',
      fontStyle: 'italic',
      textAlign: 'left',
    }}>
      {row.year}
    </div>
    <div style={{ textAlign: 'left' }}>
      <span style={{
        fontFamily: 'var(--font-cinzel)',
        fontSize: '0.78rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: '#C9A84C',
        textTransform: 'uppercase',
        display: 'block',
      }}>
        {row.level}
      </span>
      <span style={{
        fontFamily: 'var(--font-cormorant)',
        fontSize: '0.95rem',
        color: '#94a3b8',
        fontStyle: 'italic',
      }}>
        {row.sub}
      </span>
    </div>
    <div style={{
      fontFamily: 'var(--font-cormorant)',
      fontSize: '1rem',
      color: '#cbd5e1',
      textAlign: 'left',
    }}>
      {row.semesters}
    </div>
    <span style={{
      fontFamily: 'var(--font-cinzel)',
      fontSize: '0.55rem',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: '#C9A84C',
      border: '1px solid rgba(201,168,76,0.3)',
      padding: '6px 14px',
      borderRadius: '4px',
      whiteSpace: 'nowrap',
      transition: 'border-color 0.2s, background 0.2s',
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.borderColor = '#C9A84C'
      ;(e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.08)'
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)'
      ;(e.currentTarget as HTMLElement).style.background = 'transparent'
    }}
    >
      Se studieplan →
    </span>
  </Link>
))}
```

- [ ] **Step 2: Hide button on mobile** — add `className="hidden sm:block"` to the `<span>` button so it disappears at ≤640px. The full row is still a `<Link>` so mobile users can tap anywhere on the row.

```tsx
<span
  className="hidden sm:block"
  style={{ ... }} // keep existing style object unchanged
  onMouseEnter={...}
  onMouseLeave={...}
>
  Se studieplan →
</span>
```

- [ ] **Step 3: Test in browser** — hover each Nivå row, confirm button highlights. Click Nivå 1 row, confirm browser navigates to `/studieplan?nivå=1`. Resize to <640px and confirm button disappears but row is still tappable.

- [ ] **Step 4: Commit**
```bash
git add app/page.tsx
git commit -m "feat: make timeline rows clickable links to studieplan"
```

---

## Task 3: Make subject cards clickable links to /kurs

**Files:**
- Modify: `app/page.tsx:984-1035` (ISLAMIC_SUBJECTS cards)

- [ ] **Step 1: Replace `<article>` with `<Link>` wrapper and add "Se kurs →" footer**

Replace the `{ISLAMIC_SUBJECTS.map(...)}` block (lines ~984–1035) with:

```tsx
{ISLAMIC_SUBJECTS.map((s, i) => (
  <Link
    key={s.name}
    href="/kurs"
    style={{ textDecoration: 'none' }}
  >
    <article
      className="reveal-card"
      style={{
        backgroundColor: 'rgba(10,18,34,0.45)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(201,168,76,0.18)',
        borderRadius: '14px',
        padding: '32px 28px',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
        cursor: 'pointer',
        animationDelay: `${i * 75}ms`,
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(201,168,76,0.45)'
        el.style.boxShadow = '0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(201,168,76,0.1)'
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(201,168,76,0.14)'
        el.style.boxShadow = 'none'
        el.style.transform = 'none'
      }}
    >
      <div style={{ width: 28, height: 1, background: '#C9A84C', marginBottom: 20, opacity: 0.7 }} aria-hidden="true" />
      <h3 style={{
        color: '#C9A84C',
        fontSize: '0.78rem',
        fontFamily: 'var(--font-cinzel)',
        letterSpacing: '0.14em',
        fontWeight: 700,
        marginBottom: 10,
        textTransform: 'uppercase',
      }}>
        {s.name}
      </h3>
      <p style={{
        color: '#f1f5f9',
        fontFamily: 'var(--font-cormorant)',
        fontSize: '1.1rem',
        lineHeight: 1.7,
        fontStyle: 'italic',
        fontWeight: 500,
        flex: 1,
      }}>
        {s.desc}
      </p>
      <span style={{
        fontFamily: 'var(--font-cinzel)',
        fontSize: '0.58rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#C9A84C',
        marginTop: '16px',
        display: 'block',
      }}>
        Se kurs →
      </span>
    </article>
  </Link>
))}
```

- [ ] **Step 2: Test in browser** — hover a subject card, confirm lift + border. Click it, confirm navigation to `/kurs`.

- [ ] **Step 3: Commit**
```bash
git add app/page.tsx
git commit -m "feat: make subject cards clickable links to /kurs"
```

---

## Task 4: Add `useSearchParams` to `/studieplan` for pre-selected level

**Files:**
- Modify: `app/studieplan/page.tsx:1-5` (imports)
- Modify: `app/studieplan/page.tsx:65` (useState initializer)

- [ ] **Step 1: Add `useSearchParams` import**

Change line 3:
```tsx
import { useState } from 'react'
```
To:
```tsx
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
```

- [ ] **Step 2: Seed activeLevel from URL param**

Inside `StudieplanPage()`, before the return, add after the existing function opening:
```tsx
const params = useSearchParams()
const nivåParam = Number(params.get('nivå'))
const [activeLevel, setActiveLevel] = useState(nivåParam >= 1 && nivåParam <= 3 ? nivåParam : 1)
```

Remove the old `useState(1)` line (the existing `const [activeLevel, setActiveLevel] = useState(1)`).

- [ ] **Step 3: Test** — navigate to http://localhost:3002/studieplan?nivå=2 and confirm Nivå 2 tab is active on load. Navigate to `/studieplan?nivå=3` and confirm Nivå 3 is active.

- [ ] **Step 4: Test the full flow** — from home page, click the Nivå 2 "Se studieplan →" button. Confirm arrival at studieplan with Nivå 2 pre-selected.

- [ ] **Step 5: Commit**
```bash
git add app/studieplan/page.tsx
git commit -m "feat: pre-select studieplan level from ?nivå= URL param"
```

---

## Task 5: Add `useSearchParams` to `/kurs` for pre-selected filter

**Files:**
- Modify: `app/kurs/page.tsx:1-5` (imports)
- Modify: `app/kurs/page.tsx` (useState initializer for activeFilter)

- [ ] **Step 1: Add `useSearchParams` import**

At the top of `app/kurs/page.tsx`, change:
```tsx
import { useState } from 'react'
```
To:
```tsx
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
```

- [ ] **Step 2: Seed activeFilter from URL param**

Inside `KursPage()`, replace:
```tsx
const [activeFilter, setActiveFilter] = useState(0)
```
With:
```tsx
const params = useSearchParams()
const filterParam = Number(params.get('filter'))
const [activeFilter, setActiveFilter] = useState(filterParam >= 1 && filterParam <= 3 ? filterParam : 0)
```

- [ ] **Step 3: Test** — navigate to http://localhost:3002/kurs?filter=2 and confirm the "Nivå 2 — Mellomnivå" tab is active on load with only Mellomnivå courses showing.

- [ ] **Step 4: Commit**
```bash
git add app/kurs/page.tsx
git commit -m "feat: pre-select kurs filter level from ?filter= URL param"
```

---

## Task 6: Final integration smoke test

- [ ] **Step 1: Full flow A** — Home → scroll to "Slik fungerer det" → click "Nivå 1 Se studieplan →" → lands on `/studieplan?nivå=1` with Nivå 1 tab active.

- [ ] **Step 2: Full flow B** — Home → scroll to "Hva du vil lære" → click "Koranvitenskaper" card → lands on `/kurs` (all courses visible).

- [ ] **Step 3: Direct URL test** — navigate to `/studieplan?nivå=3`, `/kurs?filter=1`, `/kurs?filter=0` — all render correctly without errors.

- [ ] **Step 4: Mobile test** — at ≤640px viewport, confirm timeline rows are still tappable (the "Se studieplan →" button may be tight — acceptable since full row is the link).

- [ ] **Step 5: TypeScript check**
```bash
npx tsc --noEmit
```
Expected: no output (zero errors).

- [ ] **Step 6: Final commit if anything was missed**
```bash
git add -p
git commit -m "fix: pensum connections smoke test fixes"
```
