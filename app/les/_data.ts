export interface Book {
  slug: string
  id: number
  category: string
  title: string
  author: string
  publisher: string
  description: string
  href?: string
  bg: string
  accentColor: string
  textDark?: boolean
  isSpotlight?: boolean
}

export const SPOTLIGHT: Book = {
  slug: 'forandret-av-koranen',
  id: 0,
  category: 'Koran-vitenskaper',
  title: 'Forandret av Koranen',
  author: 'Sh Fulaan ibn Hebel',
  publisher: 'Al Rawdah Institutt',
  description:
    'En praktisk guide for å fjerne de åndelige og intellektuelle hindringene mellom enhver muslim og deres personlige, transformative forhold til Koranen — fra grunn til blad.',
  bg: 'linear-gradient(170deg, #04081e 0%, #091a5a 35%, #1235a8 65%, #1f4fd4 100%)',
  accentColor: '#3a6fd4',
  isSpotlight: true,
}

export const BOOKS: Book[] = [
  {
    slug: 'koran-30-for-30-livsleksjoner',
    id: 1,
    category: 'Koran-vitenskaper',
    title: 'Koran 30 for 30: Livsleksjoner',
    author: 'Sh Fulaan ibn Hebel',
    publisher: 'Al Rawdah Institutt',
    description: 'Dyp innsikt i Koranens siste juz — en leksjon for hver dag i Ramadan.',
    bg: 'linear-gradient(145deg, #ece6d8 0%, #c8bfa4 100%)',
    accentColor: '#0d2a6e',
    textDark: true,
  },
  {
    slug: 'salahens-hemmeligheter',
    id: 2,
    category: 'Salah',
    title: 'Salahens Hemmeligheter',
    author: 'Sh Fulaan ibn Hebel',
    publisher: 'Al Rawdah Institutt',
    description: 'En veiledning til den indre dimensjonen av bønnen og hvordan du kan oppnå khushoo.',
    bg: 'linear-gradient(170deg, #0c0a06 0%, #241504 45%, #3a2210 100%)',
    accentColor: '#c9a84c',
  },
  {
    slug: 'den-rette-sti',
    id: 3,
    category: 'Aqidah',
    title: 'Den Rette Sti',
    author: 'Sh Fulaan ibn Hebel',
    publisher: 'Al Rawdah Institutt',
    description: 'En tilgjengelig innføring i islamsk trosforståelse basert på Ahlus-Sunnah wal-Jamaah.',
    bg: 'linear-gradient(145deg, #f0ede6 0%, #ddd6c8 100%)',
    accentColor: '#1a2a6e',
    textDark: true,
  },
  {
    slug: '40-profetiske-hadither-om-helse',
    id: 4,
    category: 'Hadith',
    title: '40 Profetiske Hadither om Helse og Velvære',
    author: 'Sh Fulaan ibn Hebel',
    publisher: 'Al Rawdah Institutt',
    description: 'Profetens ﷺ veiledning om kropp, sinn og sjel — samlet i førti autentiske overleveringer.',
    bg: 'linear-gradient(145deg, #e4f0ec 0%, #bcdfd2 100%)',
    accentColor: '#145232',
    textDark: true,
  },
  {
    slug: 'koran-30-for-30-tematisk-tafsir',
    id: 5,
    category: 'Koran-vitenskaper',
    title: 'Koran 30 for 30: Tematisk Tafsir',
    author: 'Sh Fulaan ibn Hebel',
    publisher: 'Al Rawdah Institutt',
    description: 'Tematisk gjennomgang av de tretti delene av Koranen med fokus på de store fortellingene.',
    bg: 'linear-gradient(170deg, #060f1e 0%, #0d1f42 45%, #163060 100%)',
    accentColor: '#3a80c0',
  },
  {
    slug: 'dypere-inn-i-dhikr',
    id: 6,
    category: 'Dhikr & Ibadah',
    title: 'Dypere inn i Dhikr',
    author: 'Sh Fulaan ibn Hebel',
    publisher: 'Al Rawdah Institutt',
    description: 'En guide til å forstå og internalisere Allahs ihukommelse — fra tunge til hjerte.',
    bg: 'linear-gradient(170deg, #060810 0%, #0e1225 50%, #181d3c 100%)',
    accentColor: '#c9a84c',
  },
]

export const ALL_BOOKS: Book[] = [SPOTLIGHT, ...BOOKS]
