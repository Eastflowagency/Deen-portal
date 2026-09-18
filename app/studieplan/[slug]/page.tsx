'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/app/components/NavBar'
import styles from './CourseDetail.module.css'
import { COURSES } from '@/lib/curriculum/courses'

// ── Types ──────────────────────────────────────────────────────────────────
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

// ── Accordion item ─────────────────────────────────────────────────────────
function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={styles.accordionItem}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={styles.accordionButton}
        aria-expanded={open}
      >
        <span>{title}</span>
        <Chevron open={open} />
      </button>

      <div className={`${styles.accordionPanel} ${open ? styles.accordionPanelOpen : ''}`}>
        <div>
          <div className={styles.accordionContent}>{children}</div>
        </div>
      </div>
    </div>
  )
}

// ── Body text helper ───────────────────────────────────────────────────────
function BodyText({ children }: { children: React.ReactNode }) {
  return <p className={styles.bodyText}>{children}</p>
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className={styles.sectionLabel}>{children}</p>
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className={styles.bulletList}>
      {items.map((item, i) => (
        <li key={i}>
          <span aria-hidden="true" />
          <p>{item}</p>
        </li>
      ))}
    </ul>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function CourseDetailPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : ''
  const course = COURSES[slug]

  if (!course) return notFound()

  // derive subject name for accordion titles
  const subject = course.name.replace(/\s*\d+[ab]?$/i, '').trim()

  return (
    <div className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />
      <NavBar />

      <main className={styles.content}>
        <Link href="/studieplan" className={styles.backLink}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Tilbake til studieplan
        </Link>

        <header className={styles.header}>
          <p className={styles.courseMeta}>
            {course.level} · {course.year}
          </p>
          <h1>{course.name}</h1>
          {course.subject && <p className={styles.listIntro}>Fag: {course.subject}</p>}
        </header>

        <section className={styles.accordionCard} aria-label={`Kursinformasjon for ${course.name}`}>
          {course.book && (
            <AccordionItem title="Pensum" defaultOpen>
              <BodyText>{course.book.title}</BodyText>
              <SectionLabel>{course.book.chapter}</SectionLabel>
              <BodyText>Side {course.book.pages} · Spørsmål {course.book.questions}</BodyText>
            </AccordionItem>
          )}
          <AccordionItem title={course.book ? 'Om kurset' : `Hva er ${subject}?`}>
            <BodyText>{course.whatIs}</BodyText>
          </AccordionItem>

          <AccordionItem title={`Hvorfor studere ${subject}?`}>
            <BodyText>{course.whyStudy}</BodyText>
          </AccordionItem>

          <AccordionItem title="Læringsutbytte">
            <BodyText>{course.lo.intro}</BodyText>

            <SectionLabel>Kunnskap</SectionLabel>
            <p className={styles.listIntro}>Studenten:</p>
            <BulletList items={course.lo.knowledge} />

            <SectionLabel>Ferdigheter</SectionLabel>
            <p className={styles.listIntro}>Studenten:</p>
            <BulletList items={course.lo.skills} />

            <SectionLabel>Generell kompetanse</SectionLabel>
            <p className={styles.listIntro}>Studenten:</p>
            <BulletList items={course.lo.competence} />
          </AccordionItem>

          <AccordionItem title="Dato">
            <dl className={styles.dateList}>
              {[
                { label: 'Oppstart', value: course.dato.start },
                { label: 'Slutt', value: course.dato.end },
                { label: 'Semester', value: course.dato.semester },
                { label: 'Studieår', value: course.year },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </AccordionItem>

          <AccordionItem title="Arbeidskrav og Vurdering">
            <SectionLabel>Arbeidskrav</SectionLabel>
            <BulletList items={course.arbeidskrav.requirements} />
            <SectionLabel>Vurdering</SectionLabel>
            <BulletList items={course.arbeidskrav.assessment} />
          </AccordionItem>
        </section>

        <section className={styles.contactCard}>
          <div>
            <h2>Vil du vite mer om kurset?</h2>
            <p>Interessert i å melde deg på?</p>
          </div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSftLc6RDvnztwOoIJgqj-szlmP5HuMJuoxp80sRsmx0c-1bdQ/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactButton}
          >
            Ta kontakt for påmelding
          </a>
        </section>
      </main>
    </div>
  )
}
