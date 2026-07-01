'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/app/components/NavBar'

// ── Types ──────────────────────────────────────────────────────────────────
type LO = {
  intro: string
  knowledge: string[]
  skills: string[]
  competence: string[]
}
type Course = {
  name: string
  level: string
  year: string
  whatIs: string
  whyStudy: string
  lo: LO
  dato: { start: string; end: string; semester: string }
  arbeidskrav: { requirements: string[]; assessment: string[] }
}

// ── All course data ────────────────────────────────────────────────────────
const COURSES: Record<string, Course> = {

  // ── NIVÅ 1 — Islamske vitenskaper ────────────────────────────────────────
  'koranvitenskaper-1': {
    name: 'Koranvitenskaper 1',
    level: 'Nivå 1 — Grunnivå',
    year: '2026–2027',
    whatIs:
      'Koranvitenskapene (Ulum al-Quran) er en samlebetegnelse for de vitenskapene som omhandler Koranens nedkomst, bevaring, tolkning (tafseer) og korrekt resitasjon (tajweed). Faget gir studenten et solid fundament for å forstå og bruke Koranens tekst på en korrekt og metodisk måte.',
    whyStudy:
      'Koranen er den første kilden i islam. Å forstå vitenskapene rundt den er uunnværlig for enhver som ønsker å lære islam fra dets primærkilder. Gjennom dette faget utvikler studenten evnen til å lese, forstå og formidle Koranens budskap med metodisk korrekthet.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        'Kjenner til de grunnleggende begrepene i Ulum al-Quran',
        'Forstår prinsippene for tafseer bi-l-mathur og tafseer bi-l-ray',
        'Kan gjøre rede for reglene i tajweed og anvende dem i lesing',
        'Har kunnskap om asbab al-nuzul og dens funksjon i koranforståelsen',
      ],
      skills: [
        'Kan resitere Koranen med korrekt tajweed på grunnleggende nivå',
        'Er i stand til å lese og forstå enkle tafseer-tekster',
        'Kan identifisere ulike typer vers (muhkam/mutashabih, makki/madani)',
      ],
      competence: [
        'Har en metodisk tilnærming til koranlæring',
        'Kan formidle grunnleggende koranvitenskaper til andre på en klar og korrekt måte',
      ],
    },
    dato: { start: 'September 2026', end: 'Juni 2027', semester: 'Høst + Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige leseoppgaver fra pensumliste',
        'To skriftlige refleksjonsnotater per semester',
      ],
      assessment: ['Muntlig eksamen ved slutten av hvert semester', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  'aqidah-1': {
    name: 'Aqidah 1',
    level: 'Nivå 1 — Grunnivå',
    year: '2026–2027',
    whatIs:
      'Aqidah er det islamske trosfundamentet — læren om Allah, Hans navn og egenskaper, englene, skriftene, profetene, den siste dagen og qadar (forutbestemmelse). Det er kjernen i en muslims tro og danner grunnlaget for all islamsk kunnskap og handling.',
    whyStudy:
      'En klar og korrekt aqidah er forutsetningen for et sunt religiøst liv. Uten en solid forståelse av trosfundamentene kan andre vitenskaper miste sin retning. Aqidah gir deg verktøyene til å forstå hvem Allah er, hva Han krever av oss, og hvordan vi navigerer moderne tvil og utfordringer med fast forankring.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        'Kjenner til de seks trossøylene og deres grunnlag i Koranen og Sunnah',
        'Forstår Ahlus Sunnahs metodologi i aqidah-spørsmål',
        'Kan gjøre rede for Allahs navn og egenskaper etter salaf al-salihs manhaj',
        'Har kunnskap om de viktigste avvikende gruppenes sentrale feil',
      ],
      skills: [
        'Kan identifisere og svare på vanlige tvil (shubuhat) i aqidah med bevis fra primærkildene',
        'Er i stand til å forklare grunnleggende trossaker på en klar og presis måte',
        'Kan anvende aqidah-prinsippene i hverdagslivet',
      ],
      competence: [
        'Har en balansert og metodisk tilnærming til trospørsmål',
        'Kan skille mellom overlevert kunnskap og personlige meninger i aqidah-spørsmål',
      ],
    },
    dato: { start: 'September 2026', end: 'Juni 2027', semester: 'Høst + Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige leseoppgaver fra pensumliste',
        'To skriftlige refleksjonsnotater per semester',
      ],
      assessment: ['Muntlig eksamen ved slutten av hvert semester', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  'fiqh-1': {
    name: 'Fiqh 1',
    level: 'Nivå 1 — Grunnivå',
    year: '2026–2027',
    whatIs:
      'Fiqh er islamsk rettsvitenskap — vitenskapen om å utlede praktiske rettsregler fra Koranen og Sunnah. Faget dekker de fem søylene i islam og grunnleggende regler for tilbedelse, med fokus på å forstå ikke bare hva som er korrekt, men hvorfor.',
    whyStudy:
      'Fiqh er det praktiske uttrykket for islam. Gjennom dette faget lærer studenten å navigere religiøse plikter og hverdagslige situasjoner med kunnskap og trygghet, basert på etablerte rettskilder og klar metodikk.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        'Kjenner til fiqh-kapitlene om taharah, salah, sawm, zakat og hajj',
        'Forstår de viktigste juridiske termene: wajib, sunnah, mustahabb, mubah, makruh, haram',
        'Kan gjøre rede for de fire madhhabenes overordnede metodikk og grunnleggende enighet',
        'Har kunnskap om grunnprinsippene i usul al-fiqh',
      ],
      skills: [
        'Kan utlede enkel fiqh fra Koranen og autentiske hadith med veiledning',
        'Er i stand til å identifisere ulike rettskilder i en fiqh-drøftelse',
        'Kan utføre de ritualene som gjennomgås på en korrekt og bevisst måte',
      ],
      competence: [
        'Har et metodisk grunnlag for å stille religiøse spørsmål og søke kunnskap',
        'Kan henvende seg til lærde med velformulerte og presise spørsmål',
      ],
    },
    dato: { start: 'September 2026', end: 'Juni 2027', semester: 'Høst + Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige leseoppgaver fra pensumliste',
        'To skriftlige refleksjonsnotater per semester',
      ],
      assessment: ['Muntlig eksamen ved slutten av hvert semester', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  'seerah-1': {
    name: 'Seerah 1',
    level: 'Nivå 1 — Grunnivå',
    year: '2026–2027',
    whatIs:
      'Seerah er biografien og livshistorien til Profeten Muhammad ﷺ. Faget dekker hans fødsel, oppvekst, kallet til profetskap, livet i Makkah og de sentrale hendelsene frem til hijra til Madinah.',
    whyStudy:
      'Seerah er mer enn historiefortelling — det er et studium av profetisk ledelse, karakter og metodikk. Gjennom å kjenne Profetens ﷺ liv forstår studenten islams fremvekst og får konkrete forbilder for eget liv i lys av hans eksempel.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        'Kjenner til de viktigste hendelsene i Profetens ﷺ liv i Makkah-perioden',
        'Forstår seerahens kronologi og dens primærkilder',
        'Kan gjøre rede for seerahens relevans for islamsk tro og praksis',
        'Har kunnskap om de nærmeste sahabah og deres rolle i islams fremvekst',
      ],
      skills: [
        'Kan presentere seerahens viktigste hendelser på en sammenhengende og korrekt måte',
        'Er i stand til å trekke lærdom (fiqh al-seerah) fra historiske hendelser',
        'Kan referere til primærkilder for seerah',
      ],
      competence: [
        'Har et bevisst forhold til Profetens ﷺ sunnah som moralsk og åndelig rettesnor',
        'Kan sette seerah-kunnskap i sammenheng med samtidige utfordringer',
      ],
    },
    dato: { start: 'September 2026', end: 'Juni 2027', semester: 'Høst + Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige leseoppgaver fra pensumliste',
        'To skriftlige refleksjonsnotater per semester',
      ],
      assessment: ['Muntlig eksamen ved slutten av hvert semester', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  'hadith-1': {
    name: 'Hadith 1',
    level: 'Nivå 1 — Grunnivå',
    year: '2026–2027',
    whatIs:
      'Hadith er overleveringer av Profeten Muhammads ﷺ ord, handlinger og godkjennelser. Hadith-vitenskapen (mustalah al-hadith) er metodikken for å vurdere, klassifisere og forstå disse overleveringene på en vitenskapelig og korrekt måte.',
    whyStudy:
      'Hadith er den andre primærkilden i islam etter Koranen. Å forstå hadith-vitenskapens metodikk er essensielt for å vurdere religiøse argumenter korrekt og for å unngå å basere seg på svake eller falske overleveringer.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        "Kjenner til de grunnleggende begrepene i mustalah al-hadith: sahih, hasan, da'if, mawdu'",
        'Forstår strukturen i en hadith (isnad og matn)',
        'Kan gjøre rede for de seks primærsamlingene (al-Kutub al-Sittah) og deres rang',
        'Har kunnskap om de viktigste hadith-lærde og deres bidrag',
      ],
      skills: [
        'Kan lese og forstå enkle hadith med isnad',
        'Er i stand til å bruke grunnleggende hadith-verktøy for å vurdere en overlevering',
        'Kan identifisere svakheter i isnad på innledende nivå',
      ],
      competence: [
        'Har et metodisk og kritisk forhold til religiøse overleveringer',
        'Kan etterspørre kildereferanser og vurdere disse med grunnleggende verktøy',
      ],
    },
    dato: { start: 'September 2026', end: 'Juni 2027', semester: 'Høst + Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige leseoppgaver fra pensumliste',
        'To skriftlige refleksjonsnotater per semester',
      ],
      assessment: ['Muntlig eksamen ved slutten av hvert semester', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  'adab-al-talib-1': {
    name: 'Adab al-Talib 1',
    level: 'Nivå 1 — Grunnivå',
    year: '2026–2027',
    whatIs:
      'Adab al-Talib er vitenskapen om kunnskapssøkerens etikk og metodikk. Faget dekker de indre og ytre egenskapene som kjennetegner en oppriktig og vellykket talib al-ilm (kunnskapssøker), fra niyyah (intensjon) til forholdet til lærere og medelever.',
    whyStudy:
      'Uten riktig adab er kunnskap uten frukt. Dette faget hjelper studenten å bygge det nødvendige fundamentet for at kunnskap skal feste seg, blomstre og komme andre til gode. Det er ikke et rent teoretisk fag — det er et livspraksis-fag.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        'Kjenner til de sentrale verkene om adab al-talib i den islamske tradisjonen',
        'Forstår betydningen av ikhlas (oppriktighet) og niyyah (intensjon) i kunnskapssøken',
        'Kan gjøre rede for lærernes status og rettighetene som tilhører lærere og medelever',
        'Har kunnskap om de viktigste adab-prinsippene for å lære og undervise',
      ],
      skills: [
        'Kan identifisere og arbeide med egne barrierer for læring',
        'Er i stand til å etablere en strukturert og konsekvent læringsrytme',
        'Kan ta notater og organisere kunnskap på en effektiv måte',
      ],
      competence: [
        'Har en oppriktig og ydmyk tilnærming til kunnskap og lærere',
        'Kan fungere som et godt eksempel for medelever i læringsmiljøet',
      ],
    },
    dato: { start: 'September 2026', end: 'Juni 2027', semester: 'Høst + Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige leseoppgaver fra pensumliste',
        'To skriftlige refleksjonsnotater per semester',
      ],
      assessment: ['Muntlig eksamen ved slutten av hvert semester', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  // ── NIVÅ 1 — Arabisk ─────────────────────────────────────────────────────
  'arabic-1a': {
    name: 'Arabic 1a',
    level: 'Nivå 1 — Grunnivå',
    year: '2026–2027',
    whatIs:
      'Arabic 1a er første semester av arabiskopplæringen på grunnivå. Kurset introduserer det arabiske alfabetet, grunnleggende grammatikk (nahw og sarf) og et basis vokabular som gjør studenten i stand til å lese enkle arabiske tekster.',
    whyStudy:
      'Arabisk er islams språk. Å forstå Koranen, hadith og den klassiske islamske litteraturen direkte — uten oversettelse — åpner dimensjoner som ingen oversettelse kan formidle fullt ut. Arabisk er nøkkelen til det islamske kunnskapsarvet.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        'Kjenner til det arabiske alfabetet med korrekt uttale av alle bokstaver',
        "Forstår grunnleggende morfologiske begreper: ism, fi'l, harf",
        "Kan gjøre rede for de viktigste kasusendingene (i'rab) i enkel form",
        'Har kunnskap om ca. 200 grunnleggende arabiske ord',
      ],
      skills: [
        'Kan lese og skrive arabisk med korrekt tegnsetting (tashkeel)',
        'Er i stand til å forstå og oversette enkle arabiske setninger',
        'Kan gjenkjenne enkle grammatiske mønstre i korte tekster',
      ],
      competence: [
        'Har et grunnlag for videre arabisklæring og selvstendig Koranlesing',
        'Kan bruke arabisk ordbok og grunnleggende referanser med veiledning',
      ],
    },
    dato: { start: 'September 2026', end: 'Januar 2027', semester: 'Høst' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige innleveringsoppgaver i grammatikk og vokabular',
        'Månedlige fremgangstester',
      ],
      assessment: ['Skriftlig avslutningseksamen', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  'arabic-1b': {
    name: 'Arabic 1b',
    level: 'Nivå 1 — Grunnivå',
    year: '2026–2027',
    whatIs:
      'Arabic 1b er andre semester av grunnkurset i arabisk. Kurset bygger videre på Arabic 1a og introduserer mer avansert grammatikk, utvidet vokabular og lengre tekster, med fokus på å befeste og utvide forståelsen fra første semester.',
    whyStudy:
      'Kontinuitet i arabisklæring er avgjørende. Arabic 1b befester grunnlaget fra første semester og gir studenten selvtilliten og ferdighetene til å begynne å arbeide med enklere islamske tekster på originalspråket.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        'Kjenner til grunnleggende verbmønstre og konjugering i arabisk',
        'Forstår pronominale suffikser og deres bruk i kontekst',
        'Kan gjøre rede for de vanligste preposisjonene og deres styringsregler',
        'Har kunnskap om ca. 400 arabiske ord (kumulativt fra begge semestre)',
      ],
      skills: [
        'Kan lese og forstå korte, vokalerte arabiske tekster med ordbokstøtte',
        'Er i stand til å konstruere enkle arabiske setninger',
        "Kan identifisere verbets rot (jidhr) og mønster (wazn)",
      ],
      competence: [
        'Har et grunnlag for selvstendig lesing av enklere islamske tekster på arabisk',
        'Kan ta i bruk arabisk-arabisk ordbok på innledende nivå',
      ],
    },
    dato: { start: 'Februar 2027', end: 'Juni 2027', semester: 'Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige innleveringsoppgaver i grammatikk og vokabular',
        'Månedlige fremgangstester',
      ],
      assessment: ['Skriftlig avslutningseksamen', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  // ── NIVÅ 2 — Islamske vitenskaper ────────────────────────────────────────
  'koranvitenskaper-2': {
    name: 'Koranvitenskaper 2',
    level: 'Nivå 2 — Mellomnivå',
    year: '2027–2028',
    whatIs:
      'Koranvitenskaper 2 er en fordypning i tafseer-metodologi og koranvitenskapenes teoretiske grunnlag. Faget studerer sentrale klassiske tafseer-verk og analyserer deres metodikk og innbyrdes forskjeller.',
    whyStudy:
      'Med et grunnlag fra Nivå 1 er studenten klar for å gå dypere inn i fortolkningens kunst og vitenskap. Dette kurset utvikler evnen til å forstå og bruke de klassiske tafseer-kildene med metodisk selvstendighet.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        'Kjenner til metodologien i de viktigste klassiske tafseer-verkene',
        'Forstår forskjellene mellom tafseer bi-l-mathur og tafseer bi-l-ray på et dypere nivå',
        'Kan gjøre rede for nasikh og mansukh og dens virkning på fiqh',
        'Har kunnskap om ulike qiraat og dens implikasjoner for tafseer',
      ],
      skills: [
        'Kan lese og analysere deler av en klassisk tafseer på arabisk med støtte',
        'Er i stand til å sammenligne ulike tafseer-tolkingers argumentasjon',
        'Kan anvende vitenskapene om asbab al-nuzul og nasikh/mansukh i koranforståelse',
      ],
      competence: [
        'Har et selvstendig og metodisk grunnlag for å tilnærme seg korantolkning',
        'Kan veilede andre i grunnleggende prinsipper for koranforståelse',
      ],
    },
    dato: { start: 'September 2027', end: 'Juni 2028', semester: 'Høst + Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige leseoppgaver fra klassiske primærkilder',
        'To skriftlige analyseoppgaver per semester',
      ],
      assessment: ['Muntlig eksamen ved slutten av hvert semester', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  'aqidah-2': {
    name: 'Aqidah 2',
    level: 'Nivå 2 — Mellomnivå',
    year: '2027–2028',
    whatIs:
      "Aqidah 2 er et fordypningskurs som studerer klassiske aqidah-verk og analyserer de historiske avvikene fra Ahlus Sunnahs linje. Kurset tar for seg Ash'ariyyah, Maturidiyyah, Mu'tazilah og andre gruppers posisjoner.",
    whyStudy:
      'Med et solid grunnlag fra Nivå 1 kan studenten nå gå dypere inn i de intellektuelle debattene i aqidah-historien. Dette gir en mer nyansert og robust tro, og evnen til å svare på moderne utfordringer med historisk forankring.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        'Kjenner til innholdet i klassiske aqidah-verk som al-Aqidah al-Wasitiyyah',
        'Forstår de viktigste teologiske skolenes historiske utvikling og standpunkter',
        "Kan gjøre rede for argumentene i debatten om sifat al-fi'liyyah vs. sifat al-dhatiyyah",
        "Har kunnskap om bid'ah og dens klassifisering",
      ],
      skills: [
        'Kan lese og forstå klassiske aqidah-tekster på arabisk med støtte',
        'Er i stand til å sammenligne ulike teologiske skolers argumentasjon',
        'Kan svare på samtidige filosofiske utfordringer til islamsk tro',
      ],
      competence: [
        'Har en metodisk og historisk forankret tilnærming til aqidah-spørsmål',
        'Kan fungere som en ressurs for medelever i grunnleggende aqidah-spørsmål',
      ],
    },
    dato: { start: 'September 2027', end: 'Juni 2028', semester: 'Høst + Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige leseoppgaver fra klassiske primærkilder',
        'To skriftlige analyseoppgaver per semester',
      ],
      assessment: ['Muntlig eksamen ved slutten av hvert semester', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  'fiqh-2': {
    name: 'Fiqh 2',
    level: 'Nivå 2 — Mellomnivå',
    year: '2027–2028',
    whatIs:
      'Fiqh 2 er en fordypning i islamsk rettsvitenskap med særlig fokus på å forstå de rettslige bevisene (adillah) bak de klassiske rettsstandpunktene. Kurset dekker kapitler fra mu\'amalat og mer avanserte ibadah-spørsmål.',
    whyStudy:
      'Å gå fra å kjenne rettsreglene til å forstå bevisene bak dem er et avgjørende steg i islamsk utdanning. Fiqh 2 trener studenten i å lese og anvende de klassiske fiqh-tekstene og forstå madhhabenes indre logikk.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        "Kjenner til fiqh-kapitlene om nikah, talaq, bay' og ijarah på mellomnivå",
        "Forstår prinsippene i usul al-fiqh: ijma', qiyas, maslahah",
        'Kan gjøre rede for madhhabenes uenigheter og begrunnelsene for dem',
        'Har kunnskap om de klassiske fiqh-verkene og deres metodikk',
      ],
      skills: [
        'Kan lese og analysere klassiske fiqh-tekster med støtte',
        'Er i stand til å identifisere dalil for de vanligste rettsstandpunktene',
        'Kan utlede grunnleggende fiqh-konklusjoner fra primærkilder med veiledning',
      ],
      competence: [
        'Har et selvstendig og metodisk grunnlag for å navigere fiqh-spørsmål',
        'Kan vurdere ulike standpunkter i lys av bevisene med akademisk disiplin',
      ],
    },
    dato: { start: 'September 2027', end: 'Juni 2028', semester: 'Høst + Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige leseoppgaver fra klassiske primærkilder',
        'To skriftlige analyseoppgaver per semester',
      ],
      assessment: ['Muntlig eksamen ved slutten av hvert semester', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  'seerah-2': {
    name: 'Seerah 2',
    level: 'Nivå 2 — Mellomnivå',
    year: '2027–2028',
    whatIs:
      'Seerah 2 dekker Profeten Muhammads ﷺ liv i Madinah — fra hijra til hans bortgang. Kurset fokuserer på de store hendelsene: Badr, Uhud, al-Khandaq, Fath Makkah og avslutningsperioden.',
    whyStudy:
      'Madinah-perioden er hjertet av islams statsdannelse og det profetiske systemets fulle utfoldelse. Studiet av denne perioden gir studenten et dyptgående bilde av islamsk lederskap, diplomati og samfunnsbygging.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        'Kjenner til de store hendelsene i Madinah-perioden i kronologisk orden',
        'Forstår de diplomatiske og militære aspektene ved Profetens ﷺ ledelse',
        'Kan gjøre rede for de sentrale sahabah i denne perioden og deres bidrag',
        'Har kunnskap om de primære seerah-kildene og deres pålitelighet',
      ],
      skills: [
        'Kan analysere hendelser i seerah og trekke relevant lærdom',
        'Er i stand til å presentere en sammenhengende oversikt over Madinah-perioden',
        'Kan bruke klassiske seerah-tekster med støtte',
      ],
      competence: [
        'Har et modent og analytisk forhold til seerah som kilde til islamsk veiledning',
        'Kan formidle seerahens lærdom til ulike målgrupper',
      ],
    },
    dato: { start: 'September 2027', end: 'Juni 2028', semester: 'Høst + Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige leseoppgaver fra primærkilder',
        'To skriftlige analyseoppgaver per semester',
      ],
      assessment: ['Muntlig eksamen ved slutten av hvert semester', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  'hadith-2': {
    name: 'Hadith 2',
    level: 'Nivå 2 — Mellomnivå',
    year: '2027–2028',
    whatIs:
      'Hadith 2 er et studium av Sahih al-Bukhari og Sahih Muslim med forklaringer fra de klassiske hadith-kommentarene. Kurset gir studenten en dypere forståelse av hadith-vitenskapens praktiske anvendelse.',
    whyStudy:
      'Å studere de to sahih-samlingene med de klassiske kommentarene er en sentral del av den islamske utdanningstradisjonen. Det gir studenten direkte kontakt med den profetiske sunnahen og utvikler evnen til å anvende hadith-vitenskap.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        'Kjenner til innholdet og strukturen i Sahih al-Bukhari og Sahih Muslim',
        'Forstår metodikken til imam al-Bukhari og imam Muslim i utvelgelse av hadith',
        'Kan gjøre rede for de klassiske hadith-kommentarenes bidrag til forståelsen',
        "Har kunnskap om 'ilm al-rijal og dets funksjon i hadith-kritikk",
      ],
      skills: [
        'Kan lese og forstå hadith fra de to sahih-samlingene på arabisk med støtte',
        'Er i stand til å bruke hadith-kommentarer for å forstå en overleverings implikasjoner',
        'Kan gjøre en grunnleggende rijal-analyse av en isnad',
      ],
      competence: [
        'Har et selvstendig og metodisk grunnlag for å arbeide med hadith-litteratur',
        'Kan veilede andre i grunnleggende hadith-forståelse',
      ],
    },
    dato: { start: 'September 2027', end: 'Juni 2028', semester: 'Høst + Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige leseoppgaver fra primærkilder og kommentarer',
        'To skriftlige analyseoppgaver per semester',
      ],
      assessment: ['Muntlig eksamen ved slutten av hvert semester', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  'adab-al-talib-2': {
    name: 'Adab al-Talib 2',
    level: 'Nivå 2 — Mellomnivå',
    year: '2027–2028',
    whatIs:
      "Adab al-Talib 2 er en fordypning i de klassiske verkene om læringskultur og kunnskapsformidling. Kurset studerer sentrale tekster fra de lærde om rollen som underviser og forholder seg til spørsmål om ansvarlig formidling av kunnskap.",
    whyStudy:
      'Med to års læringserfaring er studenten klar for å reflektere dypere over sin rolle som kunnskapssøker og fremtidig formidler. Dette kurset former karakteren og metodikken for livslang islamsk læring.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        'Kjenner til klassiske verk om læringskultur og metodikk i den islamske tradisjonen',
        "Forstår etikken rundt formidling av kunnskap (adab al-ta'lim)",
        "Kan gjøre rede for de lærdes tilnærming til håndtering av meningsforskjeller",
        "Har kunnskap om begreper som tawadu' (ydmykhet) og kibr (arroganse) i kunnskapssammenheng",
      ],
      skills: [
        'Kan reflektere skriftlig og muntlig over egne læringsutfordringer og fremgang',
        'Er i stand til å veilede og støtte medelever i læringsmiljøet',
        'Kan formidle enkel kunnskap til en gruppe med metodisk tydelighet',
      ],
      competence: [
        'Har en moden og karakter-forankret tilnærming til kunnskap og formidling',
        'Kan fungere som en positiv ressurs i læringsmiljøet',
      ],
    },
    dato: { start: 'September 2027', end: 'Juni 2028', semester: 'Høst + Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige refleksjonsnotater',
        'En presentasjon per semester for medelever',
      ],
      assessment: ['Muntlig eksamen ved slutten av hvert semester', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  // ── NIVÅ 2 — Arabisk ─────────────────────────────────────────────────────
  'arabic-2a': {
    name: 'Arabic 2a',
    level: 'Nivå 2 — Mellomnivå',
    year: '2027–2028',
    whatIs:
      'Arabic 2a er tredje semester av arabiskopplæringen. Kurset bygger på grunnkurset og introduserer mer avansert syntaks (nahw) og morfologi (sarf), med fokus på å lese og forstå uvokalerte islamske tekster.',
    whyStudy:
      'Overgangen fra vokalerte til uvokalerte tekster er et avgjørende steg mot selvstendighet i arabisk lesing. Arabic 2a gir studenten verktøyene til å begynne å lese klassiske islamske tekster på originalspråket.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        "Kjenner til avanserte nahw-kapitler: shart, tawabi', mansubat",
        "Forstår de vanligste arabiske verbmønstrene (awzan al-af'al)",
        "Kan gjøre rede for morfologiske derivasjonsregler for isim al-fa'il og isim al-maf'ul",
        'Har kunnskap om ca. 700 arabiske ord (kumulativt)',
      ],
      skills: [
        'Kan lese uvokalerte arabiske tekster med moderat støtte',
        "Er i stand til å analysere grammatisk struktur (i'rab) i komplekse setninger",
        'Kan bruke arabisk-arabisk ordbok selvstendig',
      ],
      competence: [
        'Har et grunnlag for å lese enklere klassiske islamske tekster på arabisk',
        'Kan gjøre en innledende grammatisk analyse av koranvers',
      ],
    },
    dato: { start: 'September 2027', end: 'Januar 2028', semester: 'Høst' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige grammatikkoppgaver og tekstanalyser',
        'Månedlige fremgangstester',
      ],
      assessment: ['Skriftlig avslutningseksamen', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  'arabic-2b': {
    name: 'Arabic 2b',
    level: 'Nivå 2 — Mellomnivå',
    year: '2027–2028',
    whatIs:
      'Arabic 2b er fjerde semester av arabiskopplæringen. Kurset befester og utvider kunnskapene fra Arabic 2a med fokus på leseflyt, tekstforståelse og begynnende skriving på arabisk.',
    whyStudy:
      'Arabic 2b avrunder mellomnivåets arabiskkurs og forbereder studenten for viderenivå. Ved fullføring skal studenten være i stand til å lese og forstå et bredere spekter av klassiske islamske tekster.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        "Kjenner til avanserte sarf-mønstre for uregelmessige verb (af'al naqisah, mithali, mudha'af)",
        'Forstår komplekse syntaktiske konstruksjoner i klassisk arabisk',
        'Kan gjøre rede for de vanligste retoriske figurene (balaghah) på innledende nivå',
        'Har kunnskap om ca. 900 arabiske ord (kumulativt)',
      ],
      skills: [
        'Kan lese uvokalerte arabiske tekster med god forståelse',
        'Er i stand til å skrive enkle arabiske avsnitt med korrekt grammatikk',
        "Kan gjøre en selvstendig grammatisk analyse (i'rab) av tekstpassasjer",
      ],
      competence: [
        'Har et solid grunnlag for å lese klassiske islamske tekster på arabisk',
        'Kan jobbe selvstendig med arabiske primærkilder med ordboksstøtte',
      ],
    },
    dato: { start: 'Februar 2028', end: 'Juni 2028', semester: 'Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige grammatikkoppgaver og tekstanalyser',
        'Månedlige fremgangstester',
      ],
      assessment: ['Skriftlig avslutningseksamen', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  // ── NIVÅ 3 — Islamske vitenskaper ────────────────────────────────────────
  'koranvitenskaper-3': {
    name: 'Koranvitenskaper 3',
    level: 'Nivå 3 — Viderenivå',
    year: '2028–2029',
    whatIs:
      'Koranvitenskaper 3 er et avansert studium av tafseer med selvstendige tekststudier fra de klassiske kildene på arabisk. Kurset fokuserer på metodisk fortolkning og evnen til å navigere selvstendig i tafseer-tradisjonen.',
    whyStudy:
      'På viderenivå møter studenten de klassiske tafseer-kildene direkte. Dette kurset gir den metodiske modenheten og arabiskferdighetene som trengs for å bedrive selvstendige koranstudier.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        "Kjenner til de avanserte diskusjonene i Ulum al-Quran: i'jaz al-Quran, tartib al-suwar",
        'Forstår metodologiske forskjeller mellom klassiske og moderne tafseer-retninger',
        'Kan gjøre rede for de sentrale spørsmålene i tafseer al-ahkam',
        'Har kunnskap om den islamske hermeneutikkens prinsipper',
      ],
      skills: [
        'Kan lese og analysere klassiske tafseer-tekster på arabisk selvstendig',
        'Er i stand til å fremlegge en selvstendig fortolkning av et koranvers med metodisk grunnlag',
        'Kan evaluere og sammenligne argumenter fra ulike tafseer-tradisjoner',
      ],
      competence: [
        'Har en akademisk og metodisk kompetanse i koranfortolkning',
        'Kan veilede og undervise i koranvitenskaper på grunnleggende nivå',
      ],
    },
    dato: { start: 'September 2028', end: 'Juni 2029', semester: 'Høst + Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige primærkildestudier på arabisk',
        'En selvstendig skriftlig analyse per semester',
      ],
      assessment: ['Muntlig eksamen basert på primærkilder', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  'aqidah-3': {
    name: 'Aqidah 3',
    level: 'Nivå 3 — Viderenivå',
    year: '2028–2029',
    whatIs:
      'Aqidah 3 er et avansert studium av de klassiske aqidah-primærkildene på arabisk. Kurset tar for seg de dypeste spørsmålene i islamsk teologi og gir studenten et akademisk og metodisk robust aqidah-fundament.',
    whyStudy:
      'På viderenivå møter studenten de klassiske primærkildene og de avanserte teologiske debattene direkte. Aqidah 3 forbereder studenten for en rolle som en kunnskapsrik ressurs i det islamske miljøet.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        "Kjenner til innholdet i avanserte primærkilder som Ibn Taymiyyahs og Ibn al-Qayyims aqidah-verk",
        "Forstår de avanserte spørsmålene om takwil og tafwid i sifat-debatten",
        'Kan gjøre rede for den moderne aqidah-debatten og dens historiske røtter',
        'Har kunnskap om metodikk for å møte samtidige ideologiske utfordringer',
      ],
      skills: [
        'Kan lese og analysere avanserte aqidah-tekster på arabisk selvstendig',
        'Er i stand til å fremlegge og forsvare aqidah-standpunkter med akademisk stringens',
        'Kan skrive en selvstendig akademisk analyse av et aqidah-spørsmål',
      ],
      competence: [
        'Har en moden og selvstendig akademisk kompetanse i islamsk teologi',
        'Kan fungere som en klar og metodisk formidler av aqidah-kunnskap',
      ],
    },
    dato: { start: 'September 2028', end: 'Juni 2029', semester: 'Høst + Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige primærkildestudier på arabisk',
        'En selvstendig skriftlig analyse per semester',
      ],
      assessment: ['Muntlig eksamen basert på primærkilder', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  'fiqh-3': {
    name: 'Fiqh 3',
    level: 'Nivå 3 — Viderenivå',
    year: '2028–2029',
    whatIs:
      'Fiqh 3 er et avansert studium av sammenlignende fiqh (fiqh al-muqaran) og de fire madhhabenes ulikheter. Kurset gir studenten evnen til å navigere madhhabenes primærkilder og forstå grunnene til juridiske meningsforskjeller.',
    whyStudy:
      'Sammenlignende fiqh er essensielt for den som ønsker å forstå islams rettssystem i sin fulle bredde. Fiqh 3 gir studenten et akademisk og metodisk grunnlag for å arbeide med de klassiske fiqh-verkene på arabisk.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        'Kjenner til metodologien i sammenlignende fiqh og dens klassiske verker',
        'Forstår de fire madhhabenes posisjon i et bredt spekter av fiqh-spørsmål',
        "Kan gjøre rede for avanserte usul al-fiqh-begreper: istihsan, istislah, sadd al-dhara'i'",
        'Har kunnskap om samtidige fiqh-utfordringer og de lærdes svar på dem',
      ],
      skills: [
        'Kan lese og analysere avanserte fiqh-tekster på arabisk selvstendig',
        'Er i stand til å sammenligne og vurdere madhhabenes argumentasjon med akademisk metode',
        'Kan utlede fiqh-konklusjoner fra primærkilder med metodisk selvstendighet',
      ],
      competence: [
        'Har en selvstendig og akademisk kompetanse i islamsk rettsvitenskap',
        'Kan veilede og undervise i fiqh på grunnleggende til mellomnivå',
      ],
    },
    dato: { start: 'September 2028', end: 'Juni 2029', semester: 'Høst + Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige primærkildestudier på arabisk',
        'En selvstendig skriftlig fiqh-analyse per semester',
      ],
      assessment: ['Muntlig eksamen basert på primærkilder', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  'seerah-3': {
    name: 'Seerah 3',
    level: 'Nivå 3 — Viderenivå',
    year: '2028–2029',
    whatIs:
      'Seerah 3 er et avansert dybdestudie av seerah-kildene på arabisk. Kurset analyserer den metodologiske debatten i seerah-vitenskapen og Profetens ﷺ metodikks relevans for samtiden.',
    whyStudy:
      'Et selvstendig møte med seerah-primærkildene gir en dypere forståelse av islams historiske fremvekst. Seerah 3 gir studenten evnen til å bruke seerah-kunnskapen aktivt i formidling og veiledning.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        'Kjenner til de klassiske seerah-verkene og deres metodiske tilnærminger',
        'Forstår debatten om autentisitet og kildekritikk i seerah-vitenskapen',
        'Kan gjøre rede for den profetiske metodikkens samtidsrelevans',
        'Har kunnskap om Profetens ﷺ ulike roller: leder, dommer, ektemann, strateg',
      ],
      skills: [
        'Kan lese og analysere klassiske seerah-tekster på arabisk selvstendig',
        'Er i stand til å fremlegge en akademisk analyse av seerah-hendelser',
        'Kan knytte seerah-kunnskap til samtidige spørsmål om islamsk lederskap',
      ],
      competence: [
        'Har en selvstendig og akademisk kompetanse i seerah-studier',
        'Kan formidle seerahens lærdom på en engasjerende og metodisk korrekt måte',
      ],
    },
    dato: { start: 'September 2028', end: 'Juni 2029', semester: 'Høst + Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige primærkildestudier',
        'En selvstendig skriftlig analyse per semester',
      ],
      assessment: ['Muntlig eksamen basert på primærkilder', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  'hadith-3': {
    name: 'Hadith 3',
    level: 'Nivå 3 — Viderenivå',
    year: '2028–2029',
    whatIs:
      'Hadith 3 er et avansert studium av hadith-vitenskapen med selvstendige studier av de klassiske hadith-kommentarene på arabisk. Kurset fokuserer på evnen til å arbeide metodisk og selvstendig med hadith-litteraturen.',
    whyStudy:
      'En selvstendig evne til å arbeide med hadith-litteraturen er kjennetegnet på en kompetent islamsk lærde. Hadith 3 gir studenten det akademiske og lingvistiske grunnlaget for dette nivået av selvstendighet.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        "Kjenner til avanserte begreper i 'ilm al-rijal og jarh wa ta'dil",
        'Forstår metodologien til de store hadith-lærde i klassifisering og kritikk',
        'Kan gjøre rede for komplekse isnad-problemer og deres løsninger',
        'Har kunnskap om samtidige hadith-studiers metodologi',
      ],
      skills: [
        'Kan lese og analysere klassiske hadith-kommentarer på arabisk selvstendig',
        'Er i stand til å gjøre en selvstendig isnad- og matn-analyse',
        'Kan bruke digitale og klassiske hadith-ressurser med akademisk metode',
      ],
      competence: [
        'Har en selvstendig akademisk kompetanse i hadith-vitenskap',
        'Kan veilede andre i grunnleggende til middels komplekse hadith-spørsmål',
      ],
    },
    dato: { start: 'September 2028', end: 'Juni 2029', semester: 'Høst + Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige primærkildestudier på arabisk',
        'En selvstendig skriftlig hadith-analyse per semester',
      ],
      assessment: ['Muntlig eksamen basert på primærkilder', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  'adab-al-talib-3': {
    name: 'Adab al-Talib 3',
    level: 'Nivå 3 — Viderenivå',
    year: '2028–2029',
    whatIs:
      'Adab al-Talib 3 er det avsluttende kurset i etikk og metodikk for kunnskapssøkere. Kurset studerer avanserte klassiske verk om islamsk læringskultur og forbereder studenten for rollen som formidler og veileder av kunnskap.',
    whyStudy:
      'Etter tre år med islamsk kunnskap er det avgjørende å reflektere over hva som er oppnådd, og hva ansvaret som følger med innebærer. Adab al-Talib 3 hjelper studenten å integrere kunnskapen i karakter og livsvisjon.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        'Kjenner til avanserte klassiske verk om læringskultur og formidling på arabisk',
        'Forstår de lærdes syn på forholdet mellom kunnskap, handling og formidling',
        'Kan gjøre rede for prinsippene for ansvarlig formidling av islamsk kunnskap',
        'Har kunnskap om klassiske og moderne utfordringer i islamsk pedagogikk',
      ],
      skills: [
        'Kan undervise og formidle islamsk kunnskap på en metodisk og ansvarlig måte',
        'Er i stand til å reflektere skriftlig over forholdet mellom kunnskap og handling',
        'Kan gi konstruktiv tilbakemelding til medelever med diplomatisk tydelighet',
      ],
      competence: [
        'Har en moden, ansvarsbevisst og karakterforankret tilnærming til islamsk kunnskap',
        'Kan fungere som en ressurs og veileder for andre kunnskapssøkere',
      ],
    },
    dato: { start: 'September 2028', end: 'Juni 2029', semester: 'Høst + Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Månedlige refleksjonsnotater og formidlingsøvelser',
        'En avsluttende presentasjon for lærere og medelever',
      ],
      assessment: ['Muntlig avslutningseksamen og presentasjon', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  // ── NIVÅ 3 — Arabisk ─────────────────────────────────────────────────────
  'arabic-3a': {
    name: 'Arabic 3a',
    level: 'Nivå 3 — Viderenivå',
    year: '2028–2029',
    whatIs:
      'Arabic 3a er femte semester av arabiskopplæringen. Kurset er på avansert nivå og fokuserer på arabisk retorikk (balaghah), avansert syntaks og selvstendige tekststudier fra klassiske islamske primærkilder.',
    whyStudy:
      'Balaghah er kunsten å forstå Koranens litterære og retoriske dimensjon. Arabic 3a gir studenten verktøyene til å lese og analysere den klassiske arabiske teksten med akademisk dybde.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        "Kjenner til de viktigste begrepene i balaghah: ma'ani, bayan, badi'",
        'Forstår avanserte nahw- og sarf-begreper på akademisk nivå',
        'Kan gjøre rede for arabisk grammatikktradisjonens historiske utvikling',
        'Har kunnskap om ca. 1200 arabiske ord (kumulativt) samt klassisk vokabular',
      ],
      skills: [
        'Kan lese og analysere klassiske arabiske tekster selvstendig',
        'Er i stand til å gjøre en retorisk analyse (balaghah) av koranvers og arabisk prosa',
        'Kan skrive arabiske avsnitt med grammatisk og stilistisk korrekthet',
      ],
      competence: [
        'Har et akademisk og selvstendig grunnlag for studier på arabisk',
        'Kan formidle islamsk kunnskap direkte fra arabiske primærkilder',
      ],
    },
    dato: { start: 'September 2028', end: 'Januar 2029', semester: 'Høst' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige primærkildeanalyser på arabisk',
        'Månedlige fremgangstester',
      ],
      assessment: ['Skriftlig avslutningseksamen', 'Vurdering: Bestått / Ikke bestått'],
    },
  },

  'arabic-3b': {
    name: 'Arabic 3b',
    level: 'Nivå 3 — Viderenivå',
    year: '2028–2029',
    whatIs:
      'Arabic 3b er sjette og siste semester av arabiskopplæringen. Kurset befester og integrerer alle aspekter av arabisklæringen og forbereder studenten for selvstendige studier av klassisk islamsk litteratur på arabisk.',
    whyStudy:
      'Arabic 3b er kronen på tre års arabisklæring. Ved fullføring har studenten de lingvistiske ferdighetene som trengs for å studere islamsk litteratur direkte fra primærkildene — uten oversettelse.',
    lo: {
      intro: 'Etter fullført kurs skal studenten ha følgende læringsutbytte definert i form av kunnskap, ferdigheter og generell kompetanse.',
      knowledge: [
        'Kjenner til avansert arabisk grammatikk og stilistikk på akademisk nivå',
        'Forstår den klassiske arabiske litteraturens sjangre og konvensjoner',
        'Kan gjøre rede for sentrale verker i arabisk lingvistisk tradisjon',
        "Har kunnskap om de lingvistiske aspektene ved Koranens i'jaz",
      ],
      skills: [
        'Kan lese og forstå et bredt spekter av klassiske arabiske tekster selvstendig',
        'Er i stand til å skrive akademisk arabisk prosa',
        'Kan gi en grammatisk og retorisk analyse av komplekse tekstpassasjer',
      ],
      competence: [
        'Har en selvstendig akademisk kompetanse i klassisk arabisk',
        'Kan studere, forstå og formidle islamsk kunnskap direkte fra arabiske primærkilder',
      ],
    },
    dato: { start: 'Februar 2029', end: 'Juni 2029', semester: 'Vår' },
    arbeidskrav: {
      requirements: [
        'Obligatorisk fremmøte — minimum 80 %',
        'Ukentlige primærkildeanalyser på arabisk',
        'En avsluttende selvstendig tekstanalyse',
      ],
      assessment: ['Skriftlig og muntlig avslutningseksamen', 'Vurdering: Bestått / Ikke bestått'],
    },
  },
}

// ── Chevron icon ───────────────────────────────────────────────────────────
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C9A84C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        flexShrink: 0,
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1)',
      }}
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
    <div style={{ borderBottom: '1px solid rgba(201,168,76,0.14)' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-press"
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '22px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '16px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: 'clamp(0.92rem, 2vw, 1.05rem)',
            fontWeight: 600,
            color: open ? '#C9A84C' : '#e2e8f0',
            letterSpacing: '0.02em',
            transition: 'color 0.2s cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          {title}
        </span>
        <Chevron open={open} />
      </button>

      <div
        style={{
          maxHeight: open ? '2400px' : '0',
          overflow: 'hidden',
          transition: open
            ? 'max-height 0.5s cubic-bezier(0.23,1,0.32,1)'
            : 'max-height 0.3s cubic-bezier(0.77,0,0.175,1)',
        }}
      >
        <div style={{ paddingBottom: '28px' }}>{children}</div>
      </div>
    </div>
  )
}

// ── Body text helper ───────────────────────────────────────────────────────
function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-montserrat)',
        fontSize: '1rem',
        color: '#94a3b8',
        lineHeight: 1.75,
        fontWeight: 400,
      }}
    >
      {children}
    </p>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-montserrat)',
        fontSize: '0.75rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#C9A84C',
        marginBottom: '10px',
        marginTop: '20px',
        fontWeight: 600,
      }}
    >
      {children}
    </p>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
            marginBottom: '10px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'rgba(201,168,76,0.45)',
              flexShrink: 0,
              marginTop: '8px',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.97rem',
              color: '#94a3b8',
              lineHeight: 1.7,
            }}
          >
            {item}
          </span>
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
    <div
      className="page-bg"
      style={{
        minHeight: '100vh',
        backgroundImage: "url('/Background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: '#060b14',
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          .page-bg { background-attachment: scroll !important; }
          .cs-content { padding: 90px 16px 60px !important; }
          .cs-accordion-card { padding-left: 16px !important; padding-right: 16px !important; }
          .cs-dato-label { min-width: 72px !important; }
          .cs-back-link { margin-bottom: 32px !important; }
          .cs-header { margin-bottom: 36px !important; }
        }
      `}</style>
      {/* Dark overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(6,11,20,0.82)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <NavBar />

      <div
        className="cs-content"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '760px',
          margin: '0 auto',
          padding: '130px 24px 100px',
        }}
      >
        {/* Back link */}
        <Link
          href="/studieplan"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.72rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#64748b',
            textDecoration: 'none',
            marginBottom: '48px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#C9A84C')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#64748b')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Tilbake til studieplan
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '56px' }}>
          <p
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.72rem',
              letterSpacing: '0.28em',
              color: '#C9A84C',
              marginBottom: '14px',
              textTransform: 'uppercase',
            }}
          >
            {course.level} · {course.year}
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '20px',
              lineHeight: 1.2,
            }}
          >
            {course.name}
          </h1>
          <div
            style={{
              width: '48px',
              height: '1px',
              background: 'linear-gradient(to right, transparent, #C9A84C, transparent)',
            }}
          />
        </div>

        {/* Accordion sections */}
        <div
          className="cs-accordion-card"
          style={{
            background: 'rgba(15,24,41,0.55)',
            border: '1px solid rgba(201,168,76,0.14)',
            borderRadius: '12px',
            backdropFilter: 'blur(16px)',
            padding: '0 28px',
          }}
        >
          {/* 1 — Hva er */}
          <AccordionItem title={`Hva er ${subject}?`}>
            <BodyText>{course.whatIs}</BodyText>
          </AccordionItem>

          {/* 2 — Hvorfor studere */}
          <AccordionItem title={`Hvorfor studere ${subject}?`}>
            <BodyText>{course.whyStudy}</BodyText>
          </AccordionItem>

          {/* 3 — Læringsutbytte */}
          <AccordionItem title="Læringsutbytte">
            <BodyText>{course.lo.intro}</BodyText>

            <SectionLabel>Kunnskap</SectionLabel>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.9rem', color: '#64748b', marginBottom: '10px' }}>
              Studenten:
            </p>
            <BulletList items={course.lo.knowledge} />

            <SectionLabel>Ferdigheter</SectionLabel>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.9rem', color: '#64748b', marginBottom: '10px' }}>
              Studenten:
            </p>
            <BulletList items={course.lo.skills} />

            <SectionLabel>Generell kompetanse</SectionLabel>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.9rem', color: '#64748b', marginBottom: '10px' }}>
              Studenten:
            </p>
            <BulletList items={course.lo.competence} />
          </AccordionItem>

          {/* 4 — Dato */}
          <AccordionItem title="Dato">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Oppstart', value: course.dato.start },
                { label: 'Slutt', value: course.dato.end },
                { label: 'Semester', value: course.dato.semester },
                { label: 'Studieår', value: course.year },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', gap: '16px', alignItems: 'baseline' }}>
                  <span
                    className="cs-dato-label"
                    style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: '#C9A84C',
                      minWidth: '90px',
                      flexShrink: 0,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: '0.97rem',
                      color: '#94a3b8',
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </AccordionItem>

          {/* 5 — Arbeidskrav og Vurdering */}
          <AccordionItem title="Arbeidskrav og Vurdering">
            <SectionLabel>Arbeidskrav</SectionLabel>
            <BulletList items={course.arbeidskrav.requirements} />
            <SectionLabel>Vurdering</SectionLabel>
            <BulletList items={course.arbeidskrav.assessment} />
          </AccordionItem>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '64px' }}>
          <p
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.8rem',
              color: '#64748b',
              letterSpacing: '0.08em',
              marginBottom: '20px',
            }}
          >
            Interessert i å melde deg på?
          </p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSftLc6RDvnztwOoIJgqj-szlmP5HuMJuoxp80sRsmx0c-1bdQ/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-press"
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.72rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: '#0F1829',
              background: '#C9A84C',
              padding: '14px 44px',
              textDecoration: 'none',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#d4b55a')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#C9A84C')}
          >
            Ta kontakt for påmelding
          </a>
        </div>
      </div>
    </div>
  )
}
