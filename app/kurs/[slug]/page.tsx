'use client'

import { use } from 'react'
import Link from 'next/link'
import NavBar from '@/app/components/NavBar'
import Classroom from '@/app/components/Classroom'

type CourseData = {
  name: string
  program: string
  level: string
  year: string
  semester?: string
  innledning: string
  læringsutbytte: string[]
  arbeidskrav: string[]
  vurdering: string
  books: string[]
}

const COURSES: Record<string, CourseData> = {
  'koranvitenskaper-1': {
    name: 'Koranvitenskaper 1',
    program: 'Islamske vitenskaper',
    level: 'Grunnivå',
    year: '2026–2027',
    innledning: 'Koranvitenskaper 1 gir en grunnleggende innføring i Koranens åpenbaring, bevaring og resitasjon. Studentene lærer tajweed-reglene for korrekt lesning og studerer utvalgte kapitler med klassisk tafseer. Kurset legger fundamentet for videre studier i koranvitenskapene.',
    læringsutbytte: [
      'Forstå Koranens åpenbaring, bevaring og overlevering',
      'Lese Koranen med korrekt tajweed og uttale',
      'Gjøre rede for grunnleggende begreper i koranvitenskapene',
      'Forstå utvalgte kapitler ved hjelp av klassisk tafseer',
      'Skille mellom makkanske og medinensiske åpenbaringer',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Fullføre ukentlige lesninger fra pensumlitteraturen',
      'Memorere utvalgte koranverser med korrekt tajweed',
      'Levere en kort skriftlig refleksjon per semester',
      'Aktiv deltakelse i klassediskusjoner',
    ],
    vurdering: 'Kurset vurderes gjennom en muntlig eksamen ved slutten av skoleåret. Studenten resiterer utvalgte koranvers og svarer på spørsmål om tajweed og tafseer. Faglærer vurderer også løpende deltakelse gjennom året. Bestått/ikke bestått.',
    books: ['Muqaddimah fi Ulum al-Quran', 'Tafsir Ibn Kathir — utvalgte kapitler'],
  },
  'koranvitenskaper-2': {
    name: 'Koranvitenskaper 2',
    program: 'Islamske vitenskaper',
    level: 'Mellomnivå',
    year: '2027–2028',
    innledning: 'Koranvitenskaper 2 bygger videre på grunnivået med fordypning i tafseer-metodikk og koranvitenskapenes klassiske disipliner. Studentene studerer årsaker til åpenbaring, abrogasjon og klassiske tafseerverk. Arabisk brukes aktivt som verktøy i koranforståelse.',
    læringsutbytte: [
      'Anvende tafseer-metodikk selvstendig på utvalgte tekster',
      'Forklare asbab al-nuzul og dens betydning for tolkning',
      'Redegjøre for nasikh og mansukh i Koranen',
      'Lese og forstå utdrag fra klassiske tafseerverk på arabisk',
      'Bruke arabisk aktivt i studiet av koranvitenskapene',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Fullføre ukentlige lesninger inkludert arabiske primærkilder',
      'Skriftlig analyse av ett korankapittel per semester',
      'Presentere ett tafseer-emne muntlig for klassen',
      'Aktiv deltakelse i klassediskusjoner',
    ],
    vurdering: 'Vurderes gjennom en skriftlig oppgave (2–3 sider) om et valgt tema i koranvitenskapene, etterfulgt av en muntlig presentasjon. Faglærer vurderer innhold, bruk av kilder og arabisk terminologi. Bestått/ikke bestått.',
    books: ['Al-Itqan fi Ulum al-Quran (al-Suyuti) — utdrag', 'Tafsir al-Sa\'di — utvalgte kapitler'],
  },
  'koranvitenskaper-3': {
    name: 'Koranvitenskaper 3',
    program: 'Islamske vitenskaper',
    level: 'Viderenivå',
    year: '2028–2029',
    innledning: 'Koranvitenskaper 3 er et avansert kurs der studentene leser og analyserer klassiske tafseerverk på originalspråk. Emner som Koranens relasjon til islamsk lovgivning og moderne tafseertilnærminger behandles inngående. Kurset forbereder studentene til selvstendige koranstudier.',
    læringsutbytte: [
      'Lese og forstå klassisk tafseer selvstendig på arabisk',
      'Analysere moderne tafseertilnærminger kritisk',
      'Redegjøre for Koranens rolle i islamsk lovgivning',
      'Undervise grunnleggende koranvitenskaper til andre',
      'Skrive en akademisk tekst om et koranvitenskapelig tema',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Selvstendige lesninger av arabiske primærkilder ukentlig',
      'Skriftlig avsluttende prosjektoppgave (5–8 sider)',
      'Presentere prosjektet for klassen',
      'Aktiv deltakelse og bidrag til faglig diskusjon',
    ],
    vurdering: 'Avsluttende prosjektoppgave på 5–8 sider om et selvvalgt koranvitenskapelig emne, med arabiske primærkilder. Etterfølges av muntlig forsvar. Faglærer vurderer faglig dybde, kildebruk og arabisk kompetanse. Bestått/ikke bestått.',
    books: ['Primærkilder på arabisk — selvvalgte med lærerveiledning', 'Al-Burhan fi Ulum al-Quran (al-Zarkashi) — utdrag'],
  },
  'aqidah-1': {
    name: 'Aqidah 1',
    program: 'Islamske vitenskaper',
    level: 'Grunnivå',
    year: '2026–2027',
    innledning: 'Aqidah 1 gir en systematisk innføring i islamsk tro (aqidah) basert på Koranen og Sunnah. Studentene lærer de seks trospilarene og Allahs navn og egenskaper slik Ahl al-Sunnah forstår dem. Kurset bygger et solid troslæremessig fundament for videre studier.',
    læringsutbytte: [
      'Gjøre rede for de seks trospilarene med koraniske bevis',
      'Forklare Allahs navn og egenskaper etter Ahl al-Sunnah',
      'Forstå grunnlaget for islamsk tro fra primærkildene',
      'Lese enkle arabiske tekster i aqidah med hjelp',
      'Skille mellom riktig tro og vanlige misforståelser',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Fullføre ukentlige lesninger fra pensumlitteraturen',
      'Memorere utvalgte aqidah-tekster',
      'Levere en kort skriftlig refleksjon per semester',
      'Aktiv deltakelse i klassediskusjoner',
    ],
    vurdering: 'Muntlig eksamen ved slutten av skoleåret. Studenten svarer på spørsmål om de seks trospilarene og Allahs egenskaper med referanse til primærkilder. Faglærer vurderer forståelse og presisjon. Bestått/ikke bestått.',
    books: ['Al-Aqidah al-Wasitiyyah (Ibn Taymiyyah) — utdrag', 'Al-Usul al-Thalatha (Ibn Abd al-Wahhab)'],
  },
  'aqidah-2': {
    name: 'Aqidah 2',
    program: 'Islamske vitenskaper',
    level: 'Mellomnivå',
    year: '2027–2028',
    innledning: 'Aqidah 2 fordyper studentenes forståelse gjennom studium av klassiske aqidah-verk og behandling av historiske avvik fra rett tro. Emner som tawassul, bid\'ah og metodologiske spørsmål analyseres kritisk. Arabiske primærkilder brukes aktivt.',
    læringsutbytte: [
      'Lese og forstå klassiske aqidah-verk med arabisk tekst',
      'Analysere og tilbakevise vanlige avvik fra rett tro',
      'Redegjøre for hvem Ahl al-Sunnah wa al-Jama\'ah er',
      'Drøfte spørsmål om tawassul og bid\'ah med bevis',
      'Forklare forskjellen mellom kalam og Sunnah-metodikk',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Ukentlige lesninger inkludert arabiske tekster',
      'Skriftlig analyse av ett aqidah-tema per semester',
      'Muntlig presentasjon for klassen',
      'Aktiv deltakelse i faglig diskusjon',
    ],
    vurdering: 'Skriftlig oppgave (2–3 sider) om et valgt aqidah-tema med kildehenvisninger, etterfulgt av muntlig presentasjon. Faglærer vurderer faglig presisjon og bruk av arabiske begreper. Bestått/ikke bestått.',
    books: ['Al-Aqidah al-Tahawiyyah med kommentar — utdrag', 'Al-Lum\'ah fi al-I\'tiqad (Ibn Qudamah)'],
  },
  'aqidah-3': {
    name: 'Aqidah 3',
    program: 'Islamske vitenskaper',
    level: 'Viderenivå',
    year: '2028–2029',
    innledning: 'Aqidah 3 er et avansert kurs der studentene studerer primærkilder i aqidah på arabisk og utvikler evnen til selvstendig analyse. Komplekse temaer som Allahs handling, predestinasjon og forholdet til skaperverket behandles. Kurset ruster studentene til å undervise og veilede andre.',
    læringsutbytte: [
      'Lese avanserte aqidah-tekster selvstendig på arabisk',
      'Analysere komplekse teologiske spørsmål med primærkilder',
      'Undervise grunnleggende aqidah til andre på en klar måte',
      'Skrive en akademisk tekst om et aqidah-tema',
      'Drøfte teologiske spørsmål med presisjon og ro',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Selvstendige lesninger av arabiske primærkilder',
      'Avsluttende prosjektoppgave (5–8 sider)',
      'Muntlig forsvar av prosjektet',
      'Aktiv bidragsytelse i faglig diskusjon',
    ],
    vurdering: 'Avsluttende prosjektoppgave (5–8 sider) om et selvvalgt aqidah-tema med arabiske primærkilder, etterfulgt av muntlig forsvar. Faglærer vurderer faglig dybde, kildebruk og evne til å formidle. Bestått/ikke bestått.',
    books: ['Dar\' Ta\'arud al-Aql wa al-Naql (Ibn Taymiyyah) — utdrag', 'Arabiske primærkilder — selvvalgte'],
  },
  'fiqh-1': {
    name: 'Fiqh 1',
    program: 'Islamske vitenskaper',
    level: 'Grunnivå',
    year: '2026–2027',
    innledning: 'Fiqh 1 gir en grundig innføring i islamsk rettsvitenskap med fokus på ibadah — de grunnleggende pliktene som salah, zakah, sawm og hajj. Studentene lærer reglene med beviser fra Koranen og Sunnah og trenes i å bruke faglig terminologi korrekt.',
    læringsutbytte: [
      'Gjøre rede for betingelsene og søylene i de fem pliktene',
      'Begrunne fiqh-regler med koraniske og hadith-baserte bevis',
      'Bruke grunnleggende fiqh-terminologi korrekt på arabisk',
      'Skille mellom de fire madhhabene på utvalgte spørsmål',
      'Anvende fiqh-reglene på praktiske hverdagssituasjoner',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Ukentlige lesninger fra pensumlitteraturen',
      'Memorere utvalgte fiqh-definisjoner og betingelser',
      'Levere ett skriftlig arbeid per semester',
      'Aktiv deltakelse i klassediskusjoner',
    ],
    vurdering: 'Muntlig eksamen ved slutten av skoleåret. Studenten svarer på praktiske og teoretiske fiqh-spørsmål og begrunner svarene med bevis. Faglærer vurderer presisjon og forståelse. Bestått/ikke bestått.',
    books: ['Al-Uddah (Ibn al-Bannaa) — utdrag', 'Bulugh al-Maram (Ibn Hajar) — ibadah-kapitler'],
  },
  'fiqh-2': {
    name: 'Fiqh 2',
    program: 'Islamske vitenskaper',
    level: 'Mellomnivå',
    year: '2027–2028',
    innledning: 'Fiqh 2 fordyper studentenes kunnskap med fokus på bevis fra Koranen og Sunnah for fiqh-reglene. Studentene studerer flere fiqh-kapitler inklusive mu\'amalat og familiefiqh, og trenes i å lese arabiske fiqh-tekster. Metodologisk forståelse vektlegges.',
    læringsutbytte: [
      'Lese arabiske fiqh-tekster med forståelse',
      'Begrunne fiqh-regler med Koran og Sunnah selvstendig',
      'Redegjøre for metodologiske prinsipper i fiqh',
      'Analysere utvalgte fiqh-spørsmål med kildehenvisninger',
      'Sammenligne madhhabenes syn på utvalgte spørsmål',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Ukentlige lesninger inkludert arabiske primærkilder',
      'Skriftlig analyse av ett fiqh-spørsmål per semester',
      'Muntlig presentasjon for klassen',
      'Aktiv deltakelse i faglig diskusjon',
    ],
    vurdering: 'Skriftlig oppgave (2–3 sider) der studenten analyserer et fiqh-spørsmål med bevis fra Koran og Sunnah, etterfulgt av muntlig presentasjon. Bestått/ikke bestått.',
    books: ['Bulugh al-Maram (Ibn Hajar) — utvalgte kapitler', 'Al-Mumti\' (Ibn Uthaimin) — utdrag'],
  },
  'fiqh-3': {
    name: 'Fiqh 3',
    program: 'Islamske vitenskaper',
    level: 'Viderenivå',
    year: '2028–2029',
    innledning: 'Fiqh 3 er et avansert kurs i sammenlignende fiqh der studentene studerer ulikhetene mellom de fire madhhabene og de metodologiske grunnene bak dem. Arabiske primærkilder leses selvstendig. Kurset forbereder studentene til å navigere fiqh-spørsmål med presisjon og sans for bevis.',
    læringsutbytte: [
      'Analysere fiqh-ulikheter mellom madhhabene med bevis',
      'Lese klassiske fiqh-verk selvstendig på arabisk',
      'Forklare usul al-fiqh som grunnlag for rettslæren',
      'Skrive en akademisk analyse av et sammenlignende fiqh-tema',
      'Veilede andre i grunnleggende fiqh-spørsmål',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Selvstendige lesninger av arabiske fiqh-primærkilder',
      'Avsluttende prosjektoppgave (5–8 sider)',
      'Muntlig forsvar av prosjektet',
      'Aktiv faglig bidragsytelse',
    ],
    vurdering: 'Avsluttende prosjektoppgave (5–8 sider) om et sammenlignende fiqh-tema med arabiske primærkilder, etterfulgt av muntlig forsvar. Faglærer vurderer faglig dybde, kildebruk og formidlingsevne. Bestått/ikke bestått.',
    books: ['Al-Mughni (Ibn Qudamah) — utvalgte kapitler', 'Arabiske primærkilder — selvvalgte'],
  },
  'seerah-1': {
    name: 'Seerah 1',
    program: 'Islamske vitenskaper',
    level: 'Grunnivå',
    year: '2026–2027',
    innledning: 'Seerah 1 gir en systematisk gjennomgang av Profeten Muhammads ﷺ tidlige liv, kallet i Makkah og den tidlige islams utfordringer. Studentene lærer å sette den profetiske historien i kontekst og hente lærdom for eget liv fra seerah.',
    læringsutbytte: [
      'Gjenfortelle seerah fra fødsel til hijra i kronologisk rekkefølge',
      'Forklare den makkanske periodens viktigste hendelser og lærdom',
      'Redegjøre for de første muslimenes prøvelser og tålmodighet',
      'Knytte seerah-hendelser til koraniske åpenbaringer',
      'Hente konkrete lærdomspunkter fra seerah til eget liv',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Ukentlige lesninger fra seerah-litteraturen',
      'Levere ett skriftlig refleksjonsnotat per semester',
      'Presentere én seerah-hendelse muntlig for klassen',
      'Aktiv deltakelse i klassediskusjoner',
    ],
    vurdering: 'Muntlig eksamen ved slutten av skoleåret. Studenten forteller og analyserer utvalgte seerah-hendelser og trekker lærdom. Faglærer vurderer faktakunnskap og refleksjon. Bestått/ikke bestått.',
    books: ['Al-Rahiq al-Makhtum (Mubarakpuri)', 'Ibn Hisham — utvalgte kapitler'],
  },
  'seerah-2': {
    name: 'Seerah 2',
    program: 'Islamske vitenskaper',
    level: 'Mellomnivå',
    year: '2027–2028',
    innledning: 'Seerah 2 dekker den medinensiske perioden — statsdannelsen, de store slagene og Profetens ﷺ bortgang. Studentene studerer den politiske, militære og sosiale dimensjonen av seerah med arabiske primærkilder som supplement. Faget trener kritisk historisk tenkning.',
    læringsutbytte: [
      'Redegjøre for den medinensiske periodens viktigste hendelser',
      'Analysere Profetens ﷺ lederskap og beslutninger',
      'Lese utdrag av seerah-primærkilder på arabisk',
      'Drøfte islamsk statsdannelse og fredsavtaler',
      'Trekke lærdom fra Profetens ﷺ strategi og moral',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Ukentlige lesninger inkludert arabiske utdrag',
      'Skriftlig analyse av ett seerah-tema per semester',
      'Muntlig presentasjon for klassen',
      'Aktiv deltakelse i faglig diskusjon',
    ],
    vurdering: 'Skriftlig oppgave (2–3 sider) om et valgt seerah-tema, etterfulgt av muntlig presentasjon. Faglærer vurderer historisk nøyaktighet, kildebruk og lærdomspunkter. Bestått/ikke bestått.',
    books: ['Ibn Hisham — Seerah al-Nabawiyyah — medinensiske kapitler', 'Al-Bidaya wa al-Nihaya — utdrag'],
  },
  'seerah-3': {
    name: 'Seerah 3',
    program: 'Islamske vitenskaper',
    level: 'Viderenivå',
    year: '2028–2029',
    innledning: 'Seerah 3 er et dybdestudie av seerahkildene og den profetiske metodikkens relevans i vår tid. Studentene leser arabiske seerah-verk selvstendig, analyserer historiske begivenheter kritisk og reflekterer over profetisk lederskap i en moderne kontekst.',
    læringsutbytte: [
      'Lese og analysere seerah-primærkilder selvstendig på arabisk',
      'Drøfte islamsk historieskriving og kildevurdering',
      'Knytte profetisk metode til samtidige spørsmål',
      'Skrive en akademisk analyse av et seerah-tema',
      'Undervise seerah på en engasjerende og faglig måte',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Selvstendige lesninger av arabiske primærkilder',
      'Avsluttende prosjektoppgave (5–8 sider)',
      'Muntlig forsvar av prosjektet',
      'Aktiv faglig bidragsytelse',
    ],
    vurdering: 'Avsluttende prosjektoppgave (5–8 sider) om et selvvalgt seerah-tema med arabiske primærkilder, etterfulgt av muntlig forsvar. Faglærer vurderer faglig dybde, kildebruk og refleksjonsnivå. Bestått/ikke bestått.',
    books: ['Ibn Hisham — komplett', 'Al-Shifa (Qadi Iyad) — utdrag', 'Arabiske primærkilder — selvvalgte'],
  },
  'hadith-1': {
    name: 'Hadith 1',
    program: 'Islamske vitenskaper',
    level: 'Grunnivå',
    year: '2026–2027',
    innledning: 'Hadith 1 gir en innføring i hadithvitenskapen og de viktigste hadith-samlingene. Studentene lærer grunnleggende terminologi (isnad, matn, sahih, da\'if) og studerer utvalgte hadither med forklaring. Kurset trener respekt og presisjon i omgang med profetiske overleveringer.',
    læringsutbytte: [
      'Bruke grunnleggende hadith-terminologi korrekt',
      'Skille mellom hadith-kategorier (sahih, hasan, da\'if)',
      'Gjenfortelle og forklare utvalgte hadither med lærdom',
      'Redegjøre for de seks store hadith-samlingene',
      'Forstå isnad-systemets rolle i hadithbevaring',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Ukentlige lesninger fra pensumlitteraturen',
      'Memorere utvalgte hadither med arabisk tekst',
      'Levere ett skriftlig arbeid per semester',
      'Aktiv deltakelse i klassediskusjoner',
    ],
    vurdering: 'Muntlig eksamen der studenten resiterer utvalgte hadither og forklarer innhold og lærdom. Faglærer vurderer memorering, forståelse og terminologibruk. Bestått/ikke bestått.',
    books: ['Al-Arba\'un al-Nawawiyyah (al-Nawawi)', 'Riyad al-Salihin — utvalgte kapitler'],
  },
  'hadith-2': {
    name: 'Hadith 2',
    program: 'Islamske vitenskaper',
    level: 'Mellomnivå',
    year: '2027–2028',
    innledning: 'Hadith 2 fordyper studiet gjennom lesning av Sahih al-Bukhari og Sahih Muslim med klassiske kommentarer. Studentene trenes i å lese arabisk hadith-tekst og bruke kommentarlitteratur aktivt. Kritisk kildebedømmelse og hadith-metodikk vektlegges.',
    læringsutbytte: [
      'Lese arabisk hadith-tekst med forståelse',
      'Bruke klassiske kommentarer i studiet av hadither',
      'Analysere hadithers isnad og matn',
      'Redegjøre for metodologien i hadith-kritikk',
      'Hente lærdom og fiqh-regler fra utvalgte hadither',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Ukentlige lesninger inkludert arabiske kommentarer',
      'Skriftlig analyse av ett hadith-tema per semester',
      'Muntlig presentasjon for klassen',
      'Aktiv deltakelse i faglig diskusjon',
    ],
    vurdering: 'Skriftlig oppgave (2–3 sider) der studenten analyserer en utvalgt hadith med isnad og matn, etterfulgt av muntlig presentasjon. Bestått/ikke bestått.',
    books: ['Sahih al-Bukhari — utvalgte kapitler med kommentar', 'Fath al-Bari (Ibn Hajar) — utdrag'],
  },
  'hadith-3': {
    name: 'Hadith 3',
    program: 'Islamske vitenskaper',
    level: 'Viderenivå',
    year: '2028–2029',
    innledning: 'Hadith 3 er et avansert kurs der studentene studerer hadith-vitenskapens metodologi og leser arabiske primærkilder selvstendig. Mustalah al-hadith og rijal-vitenskapen behandles inngående. Kurset ruster studentene til selvstendige hadith-studier og formidling.',
    læringsutbytte: [
      'Lese og analysere arabiske hadith-samlinger selvstendig',
      'Anvende mustalah al-hadith metodisk i kildebedømmelse',
      'Redegjøre for rijal-vitenskapens prinsipper og bruk',
      'Skrive en akademisk tekst om et hadith-tema',
      'Undervise grunnleggende hadith-vitenskap til andre',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Selvstendige lesninger av arabiske primærkilder',
      'Avsluttende prosjektoppgave (5–8 sider)',
      'Muntlig forsvar av prosjektet',
      'Aktiv faglig bidragsytelse',
    ],
    vurdering: 'Avsluttende prosjektoppgave (5–8 sider) om et selvvalgt hadith-tema med arabiske primærkilder, etterfulgt av muntlig forsvar. Faglærer vurderer metodisk presisjon, kildebruk og formidlingsevne. Bestått/ikke bestått.',
    books: ['Nukhbat al-Fikr (Ibn Hajar) med kommentar', 'Arabiske primærkilder — selvvalgte'],
  },
  'adab-al-talib-1': {
    name: 'Adab al-Talib 1',
    program: 'Islamske vitenskaper',
    level: 'Grunnivå',
    year: '2026–2027',
    innledning: 'Adab al-Talib 1 innfører studentene i etikken og egenskapene til en kunnskapssøker i islamsk tradisjon. Faget behandler niyya (intensjon), respekt for læreren, tålmodighet og orden. Kurset former holdninger og vaner som løfter alt annet læringsarbeid.',
    læringsutbytte: [
      'Forklare betydningen av riktig niyya i søken etter kunnskap',
      'Vise respekt for lærere og medstudenter i praksis',
      'Redegjøre for grunnleggende adab for kunnskapssøkere',
      'Reflektere over egne læringsrutiner og forbedre dem',
      'Forstå kunnskap som en amanah (tillit) fra Allah',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Ukentlige lesninger fra pensumlitteraturen',
      'Skrive en personlig refleksjon om adab per semester',
      'Demonstrere adab aktivt i all undervisning',
      'Aktiv deltakelse i klassediskusjoner',
    ],
    vurdering: 'Vurderes gjennom løpende observasjon av studentens adab og deltakelse gjennom året, samt en muntlig samtale ved slutten av skoleåret. Faglærer vurderer holdning, refleksjonsnivå og utvikling. Bestått/ikke bestått.',
    books: ['Tazkirat al-Sami\' wa al-Mutakallim (Ibn Jama\'ah) — utdrag', 'Hilyat Talib al-Ilm (al-Uthaymin)'],
  },
  'adab-al-talib-2': {
    name: 'Adab al-Talib 2',
    program: 'Islamske vitenskaper',
    level: 'Mellomnivå',
    year: '2027–2028',
    innledning: 'Adab al-Talib 2 fordyper studiet av lærernes metoder og kunnskapens verdier i islamsk tradisjon. Studentene studerer klassiske verk om adab og utvikler et bevisst forhold til sin egen rolle som fremtidige kunnskapsformidlere. Arabiske primærkilder brukes aktivt.',
    læringsutbytte: [
      'Lese klassiske adab-tekster med arabisk terminologi',
      'Analysere lærernes metodikk og formidlingsstil',
      'Reflektere over egne styrker og utfordringer som student',
      'Drøfte islamsk kunnskapskultur og dens prinsipper',
      'Anvende adab-prinsipper i eget studie og samhandling',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Ukentlige lesninger inkludert arabiske utdrag',
      'Skriftlig refleksjonsoppgave om ett adab-tema per semester',
      'Muntlig presentasjon for klassen',
      'Aktiv og bidragsytende deltakelse',
    ],
    vurdering: 'Skriftlig refleksjonsoppgave (2–3 sider) om et valgt adab-tema, etterfulgt av muntlig presentasjon. Faglærer vurderer dybde i refleksjon, kildebruk og personlig vekst. Bestått/ikke bestått.',
    books: ['Tazkirat al-Sami\' wa al-Mutakallim (Ibn Jama\'ah) — fordypning', 'Al-Jami\' li Akhlaq al-Rawi (al-Khatib) — utdrag'],
  },
  'adab-al-talib-3': {
    name: 'Adab al-Talib 3',
    program: 'Islamske vitenskaper',
    level: 'Viderenivå',
    year: '2028–2029',
    innledning: 'Adab al-Talib 3 er et avansert kurs i islamsk læringskultur og etikk i praksis. Studentene studerer klassiske verk selvstendig på arabisk og reflekterer over hvordan de kan formidle kunnskap og veilede andre. Kurset markerer overgangen fra student til kunnskapsbærer.',
    læringsutbytte: [
      'Lese avanserte adab-tekster selvstendig på arabisk',
      'Drøfte islamsk læringskultur historisk og i dag',
      'Skrive en akademisk tekst om et adab-tema',
      'Demonstrere modenhet som student og fremtidig formidler',
      'Veilede yngre studenter i grunnleggende adab',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Selvstendige lesninger av arabiske primærkilder',
      'Avsluttende prosjektoppgave (5–8 sider)',
      'Muntlig forsvar og presentasjon for klassen',
      'Aktiv faglig og personlig bidragsytelse',
    ],
    vurdering: 'Avsluttende prosjektoppgave (5–8 sider) om et selvvalgt adab-tema, etterfulgt av muntlig forsvar. Faglærer vurderer faglig modenhet, refleksjonsdybde og evne til å formidle islamsk læringskultur. Bestått/ikke bestått.',
    books: ['Klassiske arabiske adab-verk — selvvalgte med lærerveiledning'],
  },
  'arabic-1a': {
    name: 'Arabic 1a',
    program: 'Arabisk',
    level: 'Grunnivå',
    year: '2026',
    semester: 'Høst',
    innledning: 'Arabic 1a introduserer studentene til det arabiske alfabetet, grunnleggende vokabular og enkle setningsstrukturer. Kurset legger fundamentet for videre arabiskstudier med fokus på korrekt uttale og skrift. Innholdet er rettet mot islamsk arabisk fra første dag.',
    læringsutbytte: [
      'Lese og skrive det arabiske alfabetet korrekt',
      'Forstå og bruke enkle arabiske ord og fraser',
      'Lage enkle setninger med nominale og verbale strukturer',
      'Gjenkjenne vanlige koraniske ord og uttrykk',
      'Uttale arabiske lyder korrekt med makharaj',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Daglig øvelse av alfabetet og vokabular',
      'Ukentlige diktater og skriftlige øvelser',
      'Fullføre semesterets pensum-oppgaver',
      'Aktiv muntlig deltakelse i undervisningen',
    ],
    vurdering: 'Skriftlig prøve (alfabetet, vokabular, enkle setninger) og muntlig prøve (uttale og enkle spørsmål-svar). Faglærer vurderer nøyaktighet og fremgang. Bestått/ikke bestått.',
    books: ['Madinah Arabic Reader — Book 1', 'Al-Arabiyyah bayna Yadayk — Bind 1 utdrag'],
  },
  'arabic-1b': {
    name: 'Arabic 1b',
    program: 'Arabisk',
    level: 'Grunnivå',
    year: '2027',
    semester: 'Vår',
    innledning: 'Arabic 1b viderefører grunnlaget fra 1a med fokus på arabiske verbformer og koranisk arabisk. Studentene begynner å lese enkle koraniske tekster med hjelp og bygger vokabular systematisk. Kurset styrker grunnlaget for grammatikkstudiet i nivå 2.',
    læringsutbytte: [
      'Bøye grunnleggende arabiske verb i fortid og nåtid',
      'Forstå enkle koraniske setninger med hjelp',
      'Bruke pronomen og possessivsuffikser korrekt',
      'Gjenkjenne og bruke 200+ koraniske grunnsord',
      'Lese enkle arabiske tekster med forståelse',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Daglig repetisjon av verbformer og vokabular',
      'Ukentlige skriftlige øvelser',
      'Fullføre semesterets pensum-oppgaver',
      'Aktiv muntlig deltakelse',
    ],
    vurdering: 'Skriftlig prøve (verbformer, grammatikk, lesing) og muntlig prøve (oversettelse av enkle setninger). Bestått/ikke bestått.',
    books: ['Madinah Arabic Reader — Book 1 og 2', 'Al-Arabiyyah bayna Yadayk — Bind 1'],
  },
  'arabic-2a': {
    name: 'Arabic 2a',
    program: 'Arabisk',
    level: 'Mellomnivå',
    year: '2027',
    semester: 'Høst',
    innledning: 'Arabic 2a introduserer formell arabisk grammatikk (i\'rab) og trener studentene i å lese islamske tekster med forståelse. Studentene begynner å analysere setningsstrukturer og forstå hvordan grammatikken former meningsinnhold i klassiske tekster.',
    læringsutbytte: [
      'Anvende i\'rab (kasus-systemet) på enkle setninger',
      'Lese og forstå islamske tekster på mellomvanskelig nivå',
      'Analysere arabiske setninger grammatisk',
      'Bruke arabisk-arabisk ordbok selvstendig',
      'Oversette utvalgte hadither og koranvers med presisjon',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Ukentlige grammatikk- og leseøvelser',
      'Skriftlig grammatikkanalyse per semester',
      'Bruke ordbok aktivt i ukentlige lesninger',
      'Aktiv muntlig deltakelse',
    ],
    vurdering: 'Skriftlig prøve (grammatikkanalyse og oversettelse) og muntlig prøve (lesing og forklaring av utvalgt tekst). Bestått/ikke bestått.',
    books: ['Al-Ajurrumiyyah med kommentar', 'Madinah Arabic Reader — Book 2 og 3'],
  },
  'arabic-2b': {
    name: 'Arabic 2b',
    program: 'Arabisk',
    level: 'Mellomnivå',
    year: '2028',
    semester: 'Vår',
    innledning: 'Arabic 2b fordyper grammatikkstudiet med morfologi (sarf) og trener bruk av arabiske ordbøker og klassisk prosa. Studentene utvikler evnen til å lese lengre islamske tekster selvstendig og begynner å forstå klassiske islamske verk i original.',
    læringsutbytte: [
      'Analysere arabiske ord morfologisk (sarf)',
      'Lese klassisk arabisk prosa med forståelse',
      'Bruke arabisk-arabisk ordbok effektivt',
      'Forstå og oversette utdrag fra islamske primærtekster',
      'Identifisere og forklare grammatiske strukturer i tekst',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Ukentlige morfologi- og leseøvelser',
      'Skriftlig analyse av ett tekstutdrag per semester',
      'Aktiv bruk av arabisk-arabisk ordbok',
      'Aktiv muntlig deltakelse',
    ],
    vurdering: 'Skriftlig prøve (morfologianalyse og tekstoversettelse) og muntlig prøve (lesing og forklaring). Bestått/ikke bestått.',
    books: ['Al-Arabiyyah bayna Yadayk — Bind 2', 'Al-Ajurrumiyyah fordypning', 'Arabisk-arabisk ordbok'],
  },
  'arabic-3a': {
    name: 'Arabic 3a',
    program: 'Arabisk',
    level: 'Viderenivå',
    year: '2028',
    semester: 'Høst',
    innledning: 'Arabic 3a er et avansert kurs der studentene leser islamske primærkilder nesten selvstendig og introduseres til arabisk retorikk (balagah). Studentene arbeider med selvvalgte tekster og utvikler kritisk tekstanalysekompetanse på arabisk.',
    læringsutbytte: [
      'Lese islamske primærkilder nesten selvstendig på arabisk',
      'Analysere klassiske arabiske tekster grammatisk og stilistisk',
      'Introdusere balagah som verktøy i tekstforståelse',
      'Oversette avanserte arabiske tekster med presisjon',
      'Diskutere tekstinnhold på arabisk',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Selvstendige ukentlige lesninger av primærkilder',
      'Skriftlig analyse av selvvalgt tekstutdrag',
      'Muntlig presentasjon av tekstanalyse',
      'Aktiv faglig deltakelse',
    ],
    vurdering: 'Skriftlig analyse (2–3 sider) av et selvvalgt arabisk tekstutdrag, etterfulgt av muntlig presentasjon og diskusjon. Bestått/ikke bestått.',
    books: ['Primærtekster i islamske fag — selvvalgte', 'Qatr al-Nada (Ibn Hisham) — utdrag'],
  },
  'arabic-3b': {
    name: 'Arabic 3b',
    program: 'Arabisk',
    level: 'Viderenivå',
    year: '2029',
    semester: 'Vår',
    innledning: 'Arabic 3b er det avsluttende arabiskurset der studentene demonstrerer full selvstendighet i lesning av klassiske islamske tekster. Avansert balagah, arabisk akademisk skriving og et selvstendig avslutningsprosjekt kjennetegner kurset.',
    læringsutbytte: [
      'Lese klassiske islamske tekster fullt selvstendig på arabisk',
      'Anvende balagah-analyse på arabiske tekster',
      'Skrive en akademisk tekst på arabisk',
      'Veilede andre i arabisk grammatikk og lesing',
      'Demonstrere helhetlig arabisk kompetanse etter tre år',
    ],
    arbeidskrav: [
      'Minimum 80 % oppmøte til ukentlige klasser',
      'Selvstendige ukentlige lesninger',
      'Avsluttende prosjektoppgave på arabisk (3–5 sider)',
      'Muntlig forsvar av prosjektet',
      'Aktiv faglig bidragsytelse',
    ],
    vurdering: 'Avsluttende prosjektoppgave (3–5 sider) på arabisk om et selvvalgt tema, etterfulgt av muntlig forsvar. Faglærer vurderer helhetlig arabisk kompetanse, skriveferdighet og formidlingsevne. Bestått/ikke bestått.',
    books: ['Selvvalgte primærkilder i islamske vitenskaper', 'Arabisk retorikk — utvalgte tekster'],
  },
}

const SECTIONS = [
  { key: 'innledning', label: 'Innledning' },
  { key: 'læringsutbytte', label: 'Læringsutbytte' },
  { key: 'arbeidskrav', label: 'Arbeidskrav og obligatoriske aktiviteter' },
  { key: 'vurdering', label: 'Vurdering og eksamen' },
] as const

export default function KursSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const course = COURSES[slug]

  if (!course) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060b14' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-cinzel)', color: '#e2e8f0', marginBottom: '16px' }}>Kurs ikke funnet</h1>
          <Link href="/studieplan" style={{ color: '#C9A84C', fontFamily: 'var(--font-cinzel)', fontSize: '0.7rem', letterSpacing: '0.15em' }}>
            ← Tilbake til kurs
          </Link>
        </div>
      </div>
    )
  }

  const levelBadgeColor =
    course.level === 'Grunnivå' ? 'rgba(100,180,120,0.12)' :
    course.level === 'Mellomnivå' ? 'rgba(201,168,76,0.12)' :
    'rgba(180,140,220,0.12)'

  const levelTextColor =
    course.level === 'Grunnivå' ? 'rgba(100,180,120,0.9)' :
    course.level === 'Mellomnivå' ? '#C9A84C' :
    'rgba(180,140,220,0.9)'

  return (
    <div style={{ minHeight: '100vh', backgroundImage: "url('/Background.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', backgroundColor: '#060b14' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,11,20,0.85)', pointerEvents: 'none', zIndex: 0 }} />
      <NavBar />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '820px', margin: '0 auto', padding: '130px 24px 80px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
          <Link href="/studieplan" style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#64748b', textDecoration: 'none', textTransform: 'uppercase' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#C9A84C')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#64748b')}
          >
            ← Kurs
          </Link>
          <span style={{ color: '#334155', fontSize: '0.7rem' }}>›</span>
          <span style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.6rem', letterSpacing: '0.15em', color: '#94a3b8', textTransform: 'uppercase' }}>
            {course.name}
          </span>
        </div>

        {/* Course Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            <span style={{ display: 'inline-block', padding: '4px 14px', background: levelBadgeColor, border: `1px solid ${levelTextColor}`, borderRadius: '4px', fontFamily: 'var(--font-cinzel)', fontSize: '0.55rem', letterSpacing: '0.16em', color: levelTextColor, textTransform: 'uppercase' }}>
              {course.level}
            </span>
            <span style={{ display: 'inline-block', padding: '4px 14px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '4px', fontFamily: 'var(--font-cinzel)', fontSize: '0.55rem', letterSpacing: '0.16em', color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase' }}>
              {course.program}
            </span>
            <span style={{ display: 'inline-block', padding: '4px 14px', background: 'rgba(100,116,139,0.08)', border: '1px solid rgba(100,116,139,0.2)', borderRadius: '4px', fontFamily: 'var(--font-cinzel)', fontSize: '0.55rem', letterSpacing: '0.16em', color: '#94a3b8', textTransform: 'uppercase' }}>
              {course.semester ? `${course.semester} ${course.year}` : course.year}
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', fontWeight: 700, color: '#fff', letterSpacing: '0.06em', marginBottom: '16px', textTransform: 'uppercase' }}>
            {course.name}
          </h1>
          <div style={{ width: '56px', height: '1px', background: 'linear-gradient(to right, transparent, #C9A84C, transparent)' }} />
        </div>

        {/* Academic Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '32px' }}>
          {SECTIONS.map((section, idx) => {
            const isFirst = idx === 0
            const isLast = idx === SECTIONS.length - 1
            return (
              <div
                key={section.key}
                style={{
                  background: 'rgba(15,24,41,0.6)',
                  border: '1px solid rgba(201,168,76,0.15)',
                  borderRadius: isFirst ? '10px 10px 4px 4px' : isLast ? '4px 4px 10px 10px' : '4px',
                  backdropFilter: 'blur(12px)',
                  overflow: 'hidden',
                }}
              >
                {/* Section header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 28px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.6rem', color: '#C9A84C', fontWeight: 700 }}>{idx + 1}</span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.72rem', letterSpacing: '0.18em', color: '#C9A84C', textTransform: 'uppercase', margin: 0 }}>
                    {section.label}
                  </h2>
                </div>

                {/* Section content */}
                <div style={{ padding: '24px 28px' }}>
                  {section.key === 'innledning' && (
                    <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.15rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontStyle: 'italic', margin: 0 }}>
                      {course.innledning}
                    </p>
                  )}
                  {section.key === 'læringsutbytte' && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {course.læringsutbytte.map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <span style={{ color: '#C9A84C', fontSize: '0.65rem', marginTop: '4px', flexShrink: 0, opacity: 0.8 }}>✓</span>
                          <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.key === 'arbeidskrav' && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {course.arbeidskrav.map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <span style={{ color: '#C9A84C', fontSize: '0.65rem', marginTop: '4px', flexShrink: 0, opacity: 0.8 }}>◆</span>
                          <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.key === 'vurdering' && (
                    <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0 }}>
                      {course.vurdering}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Pensumlitteratur */}
        <div style={{ padding: '28px', background: 'rgba(15,24,41,0.5)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '10px', backdropFilter: 'blur(12px)', marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', marginBottom: '16px' }}>
            Pensumlitteratur
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {course.books.map((book, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: '#475569', fontSize: '0.7rem', marginTop: '3px', flexShrink: 0 }}>—</span>
                <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', color: '#94a3b8', lineHeight: 1.5 }}>{book}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Classroom */}
        <Classroom courseId={slug} courseName={course.name} />

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/studieplan" style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#64748b', textDecoration: 'none', borderBottom: '1px solid rgba(201,168,76,0.2)', paddingBottom: '2px', transition: 'color 0.2s' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#C9A84C')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#64748b')}
          >
            ← Se alle kurs
          </Link>
        </div>
      </div>
    </div>
  )
}
