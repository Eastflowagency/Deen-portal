import { LEVEL_ONE_COURSES } from './level-one-courses'
import { COURSES } from './courses'

export const LEVELS = [
  {
    id: 1,
    level: 'Nivå 1',
    name: 'Grunnivå',
    year: '2026–2027',
    islamic: Object.entries(LEVEL_ONE_COURSES).map(([slug, course]) => ({
      slug, name: course.name, desc: course.summary,
    })),
    arabic: [
      { name: 'Arabisk 1', slug: 'arabisk-1', semester: 'Høst og vår' },
    ],
  },
  {
    id: 2,
    level: 'Nivå 2',
    name: 'Mellomnivå',
    year: '2027–2028',
    islamic: [
      { name: 'Koranvitenskaper 2', slug: 'koranvitenskaper-2', desc: 'Fordypning i tafseer og koranvitenskapenes metodologi.' },
      { name: 'Aqidah 2', slug: 'aqidah-2', desc: 'Klassiske verk i aqidah og avvik fra rett tro.' },
      { name: 'Fiqh 2', slug: 'fiqh-2', desc: 'Fordypning i fiqh-kapitler med fokus på bevis fra Koranen og Sunnah.' },
      { name: 'Seerah 2', slug: 'seerah-2', desc: 'Profeten Muhammads ﷺ liv i Madinah og de store hendelsene.' },
      { name: 'Hadith 2', slug: 'hadith-2', desc: 'Studium av Sahih al-Bukhari og Muslim med forklaringer.' },
      { name: 'Tazkiyah 1', slug: 'tazkiyah-1', desc: 'Renselse av sjelen og dens sykdommer — basert på klassiske verk om tazkiyah.' },
    ],
    arabic: [
      { name: 'Arabisk 2', slug: 'arabisk-2', semester: 'Høst og vår' },
    ],
  },
  {
    id: 3,
    level: 'Nivå 3',
    name: 'Viderenivå',
    year: '2028–2029',
    islamic: [
      { name: 'Koranvitenskaper 3', slug: 'koranvitenskaper-3', desc: 'Avansert tafseer med selvstendige tekststudier på arabisk.' },
      { name: 'Aqidah 3', slug: 'aqidah-3', desc: 'Avansert aqidah med primærkilder på arabisk.' },
      { name: 'Fiqh 3', slug: 'fiqh-3', desc: 'Sammenlignende fiqh og ulikheter mellom de fire madhhabene.' },
      { name: 'Seerah 3', slug: 'seerah-3', desc: 'Dybdestudie av seerahkilder og den profetiske metodikkens relevans i dag.' },
      { name: 'Hadith 3', slug: 'hadith-3', desc: 'Selvstendige hadithstudier med original arabisk tekst.' },
      { name: 'Tazkiyah 2', slug: 'tazkiyah-2', desc: 'Avansert tazkiyah med primærkilder og praktisk anvendelse av sjelens renselse.' },
    ],
    arabic: [
      { name: 'Arabisk 3', slug: 'arabisk-3', semester: 'Høst og vår' },
    ],
  },
]

export function getSubjectLabel(slug: string): string {
  if (slug === 'adab-1') return 'Adab'
  if (slug === 'dua-dhikr-1') return 'Tazkiyah'
  if (slug.startsWith('koranvitenskaper')) return 'Koranvitenskaper'
  if (slug.startsWith('aqidah')) return 'Aqidah'
  if (slug.startsWith('fiqh')) return 'Fiqh'
  if (slug.startsWith('seerah')) return 'Seerah'
  if (slug.startsWith('hadith')) return 'Hadith'
  if (slug.startsWith('adab-al-talib')) return 'Adab og Tazkiyah'
  if (slug.startsWith('tazkiyah')) return 'Tazkiyah'
  if (slug.startsWith('arabic') || slug.startsWith('arabisk')) return 'Arabisk'
  return 'Kurs'
}

export const CATALOG = LEVELS.flatMap(level => [...level.islamic, ...level.arabic].map(item => ({
  ...COURSES[item.slug], slug: item.slug, levelNumber: level.id,
  name: COURSES[item.slug].name,
  subject: COURSES[item.slug].subject ?? getSubjectLabel(item.slug),
})))

export function getPortalCourse(level: number, subject: string) {
  const aliases: Record<string, string> = { 'adab-al-talib': level === 1 ? 'adab' : 'tazkiyah', 'arabic': 'arabisk' }
  const key = aliases[subject] ?? subject
  return CATALOG.find(course => course.levelNumber === level && (
    course.slug === subject || course.slug.replace(/-\d+$/, '') === key ||
    (level === 1 && key === 'tazkiyah' && course.slug === 'dua-dhikr-1')
  ))
}

