import { LEVEL_ONE_COURSES } from './level-one-courses'
import { ARABIC_COURSES } from './arabic-courses'

type LO = {
  intro: string
  knowledge: string[]
  skills: string[]
  competence: string[]
}
export type Course = {
  subject?: string
  book?: { title: string; chapter: string; pages: string; questions: string }
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
export const COURSES: Record<string, Course> = {
  'tazkiyah-1': {
    name: 'Tazkiyah 1', subject: 'Tazkiyah', level: 'Nivå 2 — Mellomnivå', year: '2027–2028',
    whatIs: 'Renselse av sjelen og dens sykdommer — basert på klassiske verk om tazkiyah.',
    whyStudy: 'Detaljert kursbeskrivelse publiseres senere.',
    lo: { intro: 'Læringsutbytte er ikke publisert ennå.', knowledge: [], skills: [], competence: [] },
    dato: { start: 'September 2027', end: 'Juni 2028', semester: 'Høst og vår' },
    arbeidskrav: { requirements: ['Arbeidskrav publiseres senere.'], assessment: ['Vurderingsform publiseres senere.'] },
  },
  'tazkiyah-2': {
    name: 'Tazkiyah 2', subject: 'Tazkiyah', level: 'Nivå 3 — Viderenivå', year: '2028–2029',
    whatIs: 'Avansert tazkiyah med primærkilder og praktisk anvendelse av sjelens renselse.',
    whyStudy: 'Detaljert kursbeskrivelse publiseres senere.',
    lo: { intro: 'Læringsutbytte er ikke publisert ennå.', knowledge: [], skills: [], competence: [] },
    dato: { start: 'September 2028', end: 'Juni 2029', semester: 'Høst og vår' },
    arbeidskrav: { requirements: ['Arbeidskrav publiseres senere.'], assessment: ['Vurderingsform publiseres senere.'] },
  },
  ...ARABIC_COURSES,

  ...LEVEL_ONE_COURSES,
  // Keep the previous Adab link working with the corrected first-year curriculum.
  'adab-al-talib-1': LEVEL_ONE_COURSES['adab-1'],

  // ── NIVÅ 1 — Arabisk ─────────────────────────────────────────────────────
  'arabic-1a': ARABIC_COURSES['arabisk-1'],

  'arabic-1b': ARABIC_COURSES['arabisk-1'],

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
  'arabic-2a': ARABIC_COURSES['arabisk-2'],

  'arabic-2b': ARABIC_COURSES['arabisk-2'],

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
  'arabic-3a': ARABIC_COURSES['arabisk-3'],

  'arabic-3b': ARABIC_COURSES['arabisk-3'],
}

// ── Chevron icon ───────────────────────────────────────────────────────────
