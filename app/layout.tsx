import type { Metadata } from 'next'
import { Cinzel, Cormorant_Garamond, Noto_Naskh_Arabic, Montserrat, Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const notoArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-arabic',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-montserrat',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Al Rawdah Institutt',
  description: 'Authentic Islamic Education — Learn Arabic, study Islamic sciences, transform your understanding.',
  icons: {
    icon: '/Logo2.png',
    apple: '/Logo2.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb" className={`${cinzel.variable} ${cormorant.variable} ${notoArabic.variable} ${montserrat.variable} ${inter.variable}`}>
      <body>
        {/* Fixed background layer — always behind all content.
            On desktop, page elements paint their own fixed-attachment backgrounds on top.
            On mobile (where fixed-attachment is unsupported), this div provides the
            equivalent effect: one image, locked to viewport, as content scrolls over it. */}
        <div className="global-fixed-bg" aria-hidden="true" />
        <Suspense>{children}</Suspense>
      </body>
    </html>
  )
}
