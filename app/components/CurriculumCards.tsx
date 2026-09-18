import Link from 'next/link'
import type { CSSProperties } from 'react'
import { CATALOG, LEVELS } from '@/lib/curriculum'
import styles from './CurriculumCards.module.css'

const themes: Record<string, [string, string, string]> = {
  Aqidah: ['160,132,232', '#221040', 'ع'],
  Fiqh: ['112,166,235', '#102540', 'ف'],
  Seerah: ['230,175,97', '#34200c', 'س'],
  Koranvitenskaper: ['104,197,144', '#102d1c', 'آ'],
  Hadith: ['227,139,151', '#301420', 'ح'],
  Adab: ['141,173,214', '#152438', 'أ'],
  Tazkiyah: ['157,177,226', '#1d2341', 'ت'],
  Arabisk: ['123,193,190', '#102d30', 'ض'],
}

export default function CurriculumCards() {
  return <div>{LEVELS.map(level => <section key={level.id} className={styles.section}>
    <header className={styles.heading}>
      <p className={styles.eyebrow}>Studieprogram · {level.name}</p>
      <h2>{level.level}</h2>
      <p className={styles.semester}>Høst og vår · {level.year}</p>
    </header>
    <div className={styles.grid}>
      {CATALOG.filter(course => course.levelNumber === level.id).map(course => {
        const [accent, background, symbol] = themes[course.subject] ?? themes.Adab
        const upcoming = level.id > 1
        const appearance = { '--accent': accent, '--art-background': background } as CSSProperties
        const content = <>
          <div className={styles.art} aria-hidden="true">
            <span className={styles.symbol}>{symbol}</span>
            <span className={styles.roman}>{['I', 'II', 'III'][level.id - 1]}</span>
            {upcoming && <span className={styles.coming}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="10" width="12" height="11" rx="2"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg>Kommende</span>}
            <span className={styles.level}>{level.level}</span>
          </div>
          <div className={styles.body}>
            <div className={styles.meta}><span className={styles.badge}>{level.name}</span><span>{level.year}</span></div>
            <h3>{course.name}</h3>
            <p>{course.subject} · Høst og vår</p>
            <span className={styles.action}>{upcoming ? `Starter ${level.id === 2 ? '2027' : '2028'}` : 'Åpne kurset'}{!upcoming && <span aria-hidden="true"> →</span>}</span>
          </div>
        </>
        return upcoming
          ? <article key={course.slug} style={appearance} className={`${styles.card} ${styles.upcoming}`} aria-label={`${course.name}, ${level.level}, kommende`}>{content}</article>
          : <Link key={course.slug} href={`/portal/nivå${level.id}/${course.slug}`} style={appearance} className={styles.card}>{content}</Link>
      })}
    </div>
  </section>)}</div>
}
