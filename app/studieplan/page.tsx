'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/app/components/NavBar'
import styles from './Studieplan.module.css'
import { LEVELS, getSubjectLabel } from '@/lib/curriculum'

export default function StudieplanPage() {
  const params = useSearchParams()
  const nivåParam = Number(params.get('nivå'))
  const [activeLevel, setActiveLevel] = useState(nivåParam >= 1 && nivåParam <= 3 ? nivåParam : 1)
  const current = LEVELS[activeLevel - 1]

  return (
    <div className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />
      <NavBar />

      <main className={styles.content}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Studieplan</p>
          <h1>Islamske vitenskaper</h1>
          <p className={styles.intro}>
            Tre år med islamske vitenskaper og arabisk, fra grunnivå til viderenivå.
          </p>
        </header>

        <div className={styles.levelPicker} aria-label="Velg nivå">
          {LEVELS.map((level) => (
            <button
              key={level.id}
              type="button"
              aria-pressed={activeLevel === level.id}
              className={`${styles.levelButton} ${activeLevel === level.id ? styles.levelButtonActive : ''}`}
              onClick={() => setActiveLevel(level.id)}
            >
              <span>{level.level}</span>
              <small>{level.name}</small>
            </button>
          ))}
        </div>

        <section className={styles.levelSummary} aria-label={`${current.level}, ${current.name}`}>
          <div>
            <span className={styles.summaryLabel}>Studieår</span>
            <strong>{current.year}</strong>
          </div>
          <div className={styles.summaryDivider} aria-hidden="true" />
          <div>
            <span className={styles.summaryLabel}>Undervisning</span>
            <strong>Høst og vår</strong>
          </div>
        </section>

        <section className={styles.program}>
          <div className={styles.sectionHeader}>
            <span>01</span>
            <div>
              <p>Program</p>
              <h2>Islamske vitenskaper</h2>
            </div>
          </div>

          {activeLevel === 1 && (
            <p className={styles.description}>
              Grunnbok: Zad al-Muslim – Den lille muslimens forråd.
              Fem kapitler fordelt på Aqidah, Fiqh, Seerah, Tazkiyah og Adab.
            </p>
          )}
          <div className={styles.courseGrid}>
            {current.islamic.map((course) => (
              <Link key={course.slug} href={`/studieplan/${course.slug}`} className={styles.courseLink}>
                <article className={styles.courseCard}>
                  <p className={styles.category}>{getSubjectLabel(course.slug)}</p>
                  <h3>{course.name}</h3>
                  <p className={styles.description}>{course.desc}</p>
                  <span className={styles.cardAction}>Se kurs <span aria-hidden="true">→</span></span>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.program}>
          <div className={styles.sectionHeader}>
            <span>02</span>
            <div>
              <p>Program</p>
              <h2>Arabisk</h2>
            </div>
          </div>

          <div className={`${styles.courseGrid} ${styles.arabicGrid}`}>
            {current.arabic.map((course) => (
              <Link key={course.slug} href={`/studieplan/${course.slug}`} className={styles.courseLink}>
                <article className={`${styles.courseCard} ${styles.arabicCard}`}>
                  <p className={styles.category}>Arabisk</p>
                  <h3>{course.name}</h3>
                  <p className={styles.description}>{course.semester}</p>
                  <span className={styles.cardAction}>Se kurs <span aria-hidden="true">→</span></span>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
