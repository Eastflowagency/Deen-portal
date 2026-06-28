# Pensum Connections & UI/UX — Design Spec
Date: 2026-06-12

## Goal
Connect the home page's curriculum sections to the pensum pages (/kurs, /studieplan), make Nivå rows and subject cards interactive, and polish UI/UX across all pensum-related pages.

---

## Decisions Made

| Question | Choice |
|---|---|
| Nivå rows navigation target | `/studieplan?nivå=N` (pre-selects tab) |
| Subject cards navigation target | `/kurs` (all courses) |
| Nivå row interaction style | Dedicated "Se studieplan →" outlined button in 4th column |
| Subject card interaction style | Full card is a Link + "Se kurs →" footer label |

---

## Changes by File

### 1. `app/page.tsx`

**"Slik fungerer det" timeline table**
- Add a 4th column to the header row: empty header cell
- Change `gridTemplateColumns` from `1fr 1fr 1fr` to `1fr 1fr 1fr auto`
- Wrap each timeline row in `<Link href={`/studieplan?nivå=${row.nivå}`}>` (add `nivå: 1|2|3` field to TIMELINE array)
- Add a "Se studieplan →" outlined button as the 4th cell in each row
- Button style: `border: 1px solid rgba(201,168,76,0.3)`, transparent background, gold text, `0.58rem` Cinzel, hover darkens border to `#C9A84C`
- Row keeps existing hover background (`rgba(201,168,76,0.04)`)

**"Hva du vil lære" subject cards**
- Change `ISLAMIC_SUBJECTS` cards from `<article>` to `<Link href="/kurs">` wrapper
- Add `cursor: pointer` to card style (currently `cursor: default`)
- Add `"Se kurs →"` label at bottom of each card in Cinzel `0.6rem` gold
- Keep all existing hover effects (border, shadow, translateY lift)

### 2. `app/studieplan/page.tsx`

- Add `import { useSearchParams } from 'next/navigation'` 
- Read `const params = useSearchParams(); const nivåParam = params.get('nivå')`
- Initialize `useState` with: `const [activeLevel, setActiveLevel] = useState(Number(nivåParam) || 1)`
- This makes `/studieplan?nivå=2` arrive with Nivå 2 pre-selected

### 3. `app/kurs/page.tsx`

- Add `import { useSearchParams } from 'next/navigation'`
- Read `const params = useSearchParams(); const filterParam = params.get('filter')`
- Initialize filter state with: `const [activeFilter, setActiveFilter] = useState(Number(filterParam) || 0)`
- This makes `/kurs?filter=1` arrive with Nivå 1 filter pre-selected

### 4. UI/UX Polish (all pensum pages)

- **`app/kurs/[slug]/page.tsx`**: Ensure back-link "← Tilbake til kurs" is visible and styled
- **`app/kurs/page.tsx`**: Add cross-link at bottom to `/studieplan` (already exists — verify it's prominent)
- **`app/studieplan/page.tsx`**: Add cross-link at bottom to `/kurs` (already exists as "Se alle kurs" button — verify)
- **Mobile (≤640px)**: Hide the "Se studieplan →" button column (`display:none` on the 4th cell). The whole row is already a `<Link>` so the row itself remains tappable. Grid stays `1fr 1fr 1fr` (År, Nivå, Semester) on mobile.

---

## Data Changes

Add `nivå` field to `TIMELINE` array in `app/page.tsx`:
```ts
const TIMELINE = [
  { year: '2026–2027', level: 'Nivå 1', sub: 'Grunnivå', semesters: 'Høst + Vår', nivå: 1 },
  { year: '2027–2028', level: 'Nivå 2', sub: 'Mellomnivå', semesters: 'Høst + Vår', nivå: 2 },
  { year: '2028–2029', level: 'Nivå 3', sub: 'Viderenivå', semesters: 'Høst + Vår', nivå: 3 },
]
```

---

## Out of Scope
- No new pages
- No database changes
- No changes to auth, login, or student portal
- No subject-level filtering on /kurs (only level filtering already exists)
