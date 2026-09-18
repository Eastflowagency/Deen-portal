const AQIDAH_ONE_LESSONS = [
  {
    id: 1, title: 'Introduksjon av Aqeedah', duration: '21min',
    src: 'https://mkqxsppoxcuyklrxpjox.supabase.co/storage/v1/object/public/Videos/WIN_20260625_00_48_34_Pro.mp4',
    overview: 'This lesson covers the ten introductory principles of Islamic creed, the topics covered in Aqeedah, and the historical development of authorship from the Sahaba onward.',
    learnPoints: [
      'Navnene på denne vitenskapen: Aqeedah, al-Fiqh al-Akbar, al-Iman, al-Sunnah og al-Tawhid',
      'Hadith fra Jibreel som det grunnleggende tekstgrunnlaget for de seks pilarene i iman',
      'Emnene som dekkes i aqeedah: tawhid, de seks pilarene, troens natur og avvikende sekter',
      'Den historiske utviklingen av aqeedah-litteraturen fra sahabah til i dag',
    ],
  },
  {
    id: 2, title: 'Hvem er din Herre?', duration: '18min', src: '',
    overview: 'Vi utforsker det grunnleggende spørsmålet om å kjenne Allah, Hans egenskaper og vår plikt overfor Ham som Hans skapninger og tjenere.',
    learnPoints: [
      'Hva det betyr å kjenne Allah og hvorfor dette er det viktigste spørsmålet i livet',
      'Allahs egenskaper slik de er beskrevet i Koranen og Sunnah',
      'Plikten til å tilbe Allah alene og unngå alle former for shirk',
      'Hvordan kunnskap om Allah styrker og stabiliserer troens fundament',
    ],
  },
  {
    id: 3, title: 'De seks pilarene i troen', duration: '24min', src: '',
    overview: 'En grundig gjennomgang av de seks pilarene i iman slik de er definert i Sunnah, og hvordan disse pilarene utgjør kjernen i en muslims trosoverbevisning.',
    learnPoints: [
      'De seks pilarene: tro på Allah, englene, skriftene, profetene, den siste dag og al-qadr',
      'Koraniske og hadith-baserte bevis for hver av de seks pilarene i iman',
      'Sammenhengen mellom de seks pilarene og det daglige islamske livet',
      'Konsekvensene for troen av å avvise én av de seks pilarene',
    ],
  },
  {
    id: 4, title: 'Å tro på Allah og Hans navn og egenskaper', duration: '29min', src: '',
    overview: 'Detaljert studie av Allahs vakre navn og egenskaper (al-Asma wa al-Sifat), og den rette metodologien for å forstå dem uten forvrenging, avvisning eller sammenlikning.',
    learnPoints: [
      'De fire avvikende metodologiene i forståelsen av Allahs navn og egenskaper',
      'Ahlu Sunnahs korrekte metodologi: bekreftelse uten sammenlikning',
      'Eksempler på Allahs navn og egenskaper fra Koranen og den autentiske Sunnah',
      'Hvordan denne troen påvirker tilbedelsen og ens forhold til Allah',
    ],
  },
  {
    id: 5, title: 'Profetene og de himmelske skriftene', duration: '22min', src: '',
    overview: 'Troen på alle Allahs profeter fra Adam til Muhammad ﷺ, og de åpenbarte skriftene, inkludert Koranen som det endelige og bevarte ord fra Allah.',
    learnPoints: [
      'Troen på alle profeter som en pilar i iman, og hva dette innebærer i praksis',
      'Egenskapene til en profet og forskjellen mellom rasul og nabi',
      'De fire store åpenbarte skriftene og deres stilling i Islam',
      'Koranens unike stilling som det siste og perfekt bevarte ord fra Allah',
    ],
  },
  {
    id: 6, title: 'Å tro på qadr', duration: '25min', src: '',
    overview: 'En dyptgående forklaring av troen på al-qadr (guddommelig skjebne) — de fire nivåene og hvordan denne troen gir muslimen styrke, takknemlighet og indre fred.',
    learnPoints: [
      'De fire nivåene av troen på qadr: Allahs kunnskap, oppskrift, vilje og skapelse',
      'Forholdet mellom Allahs qadr og menneskets frie vilje og personlige ansvar',
      'Hvordan troen på qadr gir indre fred, takknemlighet og styrke i motgang',
      'Avvikende sekters syn på qadr og Ahlu Sunnahs korrekte forståelse',
    ],
  },
]


export const lessonsForCourse = (slug: string) => slug === 'aqidah-1' ? AQIDAH_ONE_LESSONS.filter(lesson => Boolean(lesson.src)) : []
