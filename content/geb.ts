import type {
  Claim,
  HistoricalEntity,
  HistoricalRelationship,
  LocalizedText,
  Reference,
} from '@/types/history';
const t = (en: string, de: string, es: string): LocalizedText => ({ en, de, es });

export const gebReferences: Reference[] = [
  {
    id: 'geb-1979',
    type: 'book',
    title: 'Gödel, Escher, Bach: An Eternal Golden Braid',
    authors: ['Douglas R. Hofstadter'],
    year: 1979,
    url: 'https://jonas.salk.edu/cgi-bin/koha/opac-detail.pl?biblionumber=4220',
    accessedAt: '2026-10-08',
    notes: 'First-edition bibliographic record: Basic Books, New York, 1979.',
  },
  {
    id: 'geb-publisher',
    type: 'website',
    title: 'Gödel, Escher, Bach: publisher description and author biography',
    authors: ['Basic Books'],
    year: 1999,
    url: 'https://www.hachettebookgroup.com/titles/douglas-r-hofstadter/godel-escher-bach/9780465026562/',
    accessedAt: '2026-10-08',
    notes: 'The listed 1999 date is for the later paperback edition, not the 1979 first edition.',
  },
  {
    id: 'hofstadter-iu',
    type: 'website',
    title: 'Douglas R. Hofstadter: University Honors and Awards',
    authors: ['Indiana University'],
    year: 2026,
    yearKind: 'access',
    url: 'https://honorsandawards.iu.edu/awards/honoree/1678.html',
    accessedAt: '2026-10-08',
  },
  {
    id: 'hofstadter-directory',
    type: 'website',
    title: 'Douglas Hofstadter: Indiana University Bloomington faculty directory',
    authors: ['Indiana University'],
    year: 2026,
    yearKind: 'access',
    url: 'https://luddy.iu.edu/people/hofstadter-douglas.html',
    accessedAt: '2026-10-08',
    notes:
      'Documents institutional affiliation; not a claim about where every part of GEB was written.',
  },
  {
    id: 'geb-pulitzer',
    type: 'archive',
    title: '1980 Pulitzer Prize in General Nonfiction: Douglas R. Hofstadter',
    authors: ['The Pulitzer Prizes'],
    year: 1980,
    yearKind: 'award',
    url: 'https://www.pulitzer.org/winners/douglas-r-hofstadter',
    accessedAt: '2026-10-08',
  },
];
const caveat = t(
  'Strange loops are Hofstadter’s proposal about selfhood, not an established test of consciousness. GEB predates modern deep learning and LLMs; it does not demonstrate that statistical models cannot be self-aware. Connections here distinguish intellectual context from documented technical influence.',
  'Seltsame Schleifen sind Hofstadters Vorschlag zum Selbst, kein etablierter Bewusstseinstest. GEB entstand vor modernem Deep Learning und LLMs; es beweist nicht, dass statistische Modelle kein Selbstbewusstsein haben können. Verbindungen unterscheiden Ideenkontext von belegtem technischem Einfluss.',
  'Los bucles extraños son la propuesta de Hofstadter sobre el yo, no una prueba establecida de conciencia. GEB precede al aprendizaje profundo moderno y los LLM; no demuestra que los modelos estadísticos no puedan tener autoconciencia. Las conexiones distinguen contexto intelectual de influencia técnica documentada.',
);
export const gebEntities: HistoricalEntity[] = [
  {
    id: 'godel-escher-bach',
    slug: 'godel-escher-bach',
    type: 'publication',
    domain: 'computing',
    startDate: '1979',
    title: t(
      'Gödel, Escher, Bach: An Eternal Golden Braid',
      'Gödel, Escher, Bach: ein endloses geflochtenes Band',
      'Gödel, Escher, Bach: un eterno y grácil bucle',
    ),
    shortDescription: t(
      'Hofstadter connects formal systems, art, and music to questions about minds and self-reference.',
      'Hofstadter verbindet formale Systeme, Kunst und Musik mit Fragen zu Geist und Selbstbezug.',
      'Hofstadter conecta sistemas formales, arte y música con preguntas sobre la mente y la autorreferencia.',
    ),
    description: t(
      'Published by Basic Books in New York in 1979, GEB became an influential meeting point for artificial intelligence and cognitive science. Douglas R. Hofstadter connects Kurt Gödel’s mathematical self-reference, M. C. Escher’s visual paradoxes, and Johann Sebastian Bach’s contrapuntal music. His strange-loop proposal asks how a system’s representations might include itself. The book received the 1980 Pulitzer Prize for General Nonfiction.',
      'GEB erschien 1979 bei Basic Books in New York und wurde zu einem einflussreichen Treffpunkt von künstlicher Intelligenz und Kognitionswissenschaft. Douglas R. Hofstadter verbindet Kurt Gödels mathematischen Selbstbezug, M. C. Eschers visuelle Paradoxien und Johann Sebastian Bachs kontrapunktische Musik. Sein Vorschlag der seltsamen Schleife fragt, wie die Repräsentationen eines Systems es selbst einschließen könnten. Das Buch erhielt 1980 den Pulitzer-Preis für Sachbücher.',
      'Publicado por Basic Books en Nueva York en 1979, GEB se convirtió en un influyente punto de encuentro entre inteligencia artificial y ciencia cognitiva. Douglas R. Hofstadter conecta la autorreferencia matemática de Kurt Gödel, las paradojas visuales de M. C. Escher y la música contrapuntística de Johann Sebastian Bach. Su propuesta del bucle extraño pregunta cómo las representaciones de un sistema podrían incluirlo a él mismo. El libro recibió el Pulitzer de no ficción general en 1980.',
    ),
    technical: t(
      'Recursion repeats a rule through nested applications; self-reference makes a representation refer to itself. A strange loop crosses levels of description and returns to its starting point. These are related ideas, not interchangeable definitions. GEB uses formal systems and analogies to investigate meaning and emergence, not a training recipe for neural networks. Its continuing relevance to AGI and machine consciousness is philosophical; it establishes no direct lineage to transformer architectures.',
      'Rekursion wiederholt eine Regel durch verschachtelte Anwendungen; Selbstbezug lässt eine Repräsentation auf sich selbst verweisen. Eine seltsame Schleife durchläuft Beschreibungsebenen und kehrt zum Ausgangspunkt zurück. Diese Ideen sind verwandt, aber nicht identisch. GEB untersucht Bedeutung und Emergenz anhand formaler Systeme und Analogien, nicht anhand eines Trainingsrezepts für neuronale Netze. Seine Bedeutung für AGI und Maschinenbewusstsein ist philosophisch; eine direkte Abstammung von Transformer-Architekturen wird damit nicht belegt.',
      'La recursión repite una regla mediante aplicaciones anidadas; la autorreferencia hace que una representación se refiera a sí misma. Un bucle extraño cruza niveles de descripción y vuelve al inicio. Son ideas relacionadas, no definiciones intercambiables. GEB investiga significado y emergencia mediante sistemas formales y analogías, no una receta de entrenamiento neuronal. Su relevancia para la AGI y la conciencia artificial es filosófica; no establece una genealogía directa de los transformadores.',
    ),
    locations: [
      {
        name: 'New York, United States',
        institution: 'Basic Books (publication city)',
        lat: 40.7128,
        lon: -74.006,
        year: 1979,
      },
    ],
    people: ['Douglas R. Hofstadter', 'Kurt Gödel', 'M. C. Escher', 'Johann Sebastian Bach'],
    references: ['geb-1979', 'geb-publisher', 'geb-pulitzer', 'hofstadter-iu'],
    tags: [
      'GEB',
      'self-reference',
      'recursion',
      'strange loops',
      'consciousness',
      'emergence',
      'cognitive science',
      'AGI',
      'formal systems',
      'incompleteness',
      'fugues',
    ],
    status: 'verified',
    editorialNotes: caveat,
  },
  {
    id: 'douglas-hofstadter',
    slug: 'douglas-hofstadter',
    type: 'person',
    domain: 'computing',
    startDate: '1979',
    title: t('Douglas R. Hofstadter', 'Douglas R. Hofstadter', 'Douglas R. Hofstadter'),
    shortDescription: t(
      'Author of GEB and researcher of analogy, creativity, and cognition.',
      'Autor von GEB und Forscher zu Analogie, Kreativität und Kognition.',
      'Autor de GEB e investigador de la analogía, la creatividad y la cognición.',
    ),
    description: t(
      'Hofstadter’s research at Indiana University Bloomington connects cognitive science with the study of analogy and concepts. GEB (1979) brought these questions to a broad readership. The date marks the book’s publication, not his birth or the start of his university appointment; Bloomington marks his institutional association, not the book’s publication city.',
      'Hofstadters Forschung an der Indiana University Bloomington verbindet Kognitionswissenschaft mit Analogien und Konzepten. GEB (1979) brachte diese Fragen einem breiten Publikum nahe. Das Datum bezeichnet die Buchveröffentlichung, nicht seine Geburt oder den Beginn seiner Berufung; Bloomington steht für seine institutionelle Verbindung, nicht den Erscheinungsort des Buches.',
      'La investigación de Hofstadter en Indiana University Bloomington conecta la ciencia cognitiva con las analogías y los conceptos. GEB (1979) acercó estas preguntas a un público amplio. La fecha indica la publicación del libro, no su nacimiento ni el inicio de su nombramiento; Bloomington representa su afiliación institucional, no la ciudad de publicación.',
    ),
    technical: t(
      'His research uses small computational domains to study how concepts and perception interact in analogy-making. These models provide a different research lens from large-scale statistical language modeling; comparisons should specify the task and evidence rather than equating either approach with consciousness.',
      'Seine Forschung nutzt kleine Rechendomänen, um das Zusammenspiel von Konzepten und Wahrnehmung beim Analogiebilden zu untersuchen. Diese Modelle bieten eine andere Forschungsperspektive als großskalige statistische Sprachmodelle. Vergleiche sollten Aufgabe und Evidenz benennen, statt einen Ansatz mit Bewusstsein gleichzusetzen.',
      'Su investigación utiliza pequeños dominios computacionales para estudiar cómo interactúan conceptos y percepción al construir analogías. Estos modelos ofrecen una perspectiva distinta de los modelos estadísticos de lenguaje a gran escala. Las comparaciones deben especificar tarea y evidencia, sin equiparar ningún enfoque con la conciencia.',
    ),
    locations: [
      {
        name: 'Bloomington, United States',
        institution: 'Indiana University (institutional affiliation)',
        lat: 39.1653,
        lon: -86.5264,
      },
    ],
    people: ['Douglas R. Hofstadter'],
    references: ['hofstadter-iu', 'hofstadter-directory', 'geb-1979'],
    tags: ['cognitive science', 'analogy', 'creativity', 'GEB', 'self-reference'],
    status: 'verified',
  },
];
export const gebRelationships: HistoricalRelationship[] = [
  {
    id: 'hofstadter-geb',
    source: 'douglas-hofstadter',
    target: 'godel-escher-bach',
    type: 'historical-context',
    confidence: 'high',
    evidence: ['geb-1979'],
    description: t(
      'Authorship: Hofstadter wrote GEB, published in 1979.',
      'Autorschaft: Hofstadter schrieb GEB, veröffentlicht 1979.',
      'Autoría: Hofstadter escribió GEB, publicado en 1979.',
    ),
  },
  {
    id: 'symbolic-geb',
    source: 'symbolic-ai',
    target: 'godel-escher-bach',
    type: 'historical-context',
    confidence: 'high',
    evidence: ['geb-1979'],
    description: t(
      'GEB examines symbols and formal systems in the intellectual context of symbolic AI. This is a contextual connection, not a claim that one algorithm produced the book.',
      'GEB untersucht Symbole und formale Systeme im Ideenkontext symbolischer KI. Dies ist eine Kontextverbindung, keine algorithmische Abstammung.',
      'GEB examina símbolos y sistemas formales en el contexto de la IA simbólica. Es una conexión contextual, no una genealogía algorítmica.',
    ),
  },
  {
    id: 'geb-foundation-comparison',
    source: 'godel-escher-bach',
    target: 'foundation-models',
    type: 'conceptual-analogy',
    confidence: 'low',
    evidence: ['geb-1979', 'geb-publisher', 'foundation-2021'],
    description: t(
      'Editorial comparison: GEB asks how symbols could acquire meaning and self-reference; foundation models learn transferable representations from data. This comparison is not evidence of direct influence or a verdict about machine consciousness.',
      'Redaktioneller Vergleich: GEB fragt nach Bedeutung und Selbstbezug von Symbolen; Foundation Models lernen übertragbare Repräsentationen aus Daten. Das belegt weder direkten Einfluss noch ein Urteil über Maschinenbewusstsein.',
      'Comparación editorial: GEB pregunta cómo los símbolos adquieren significado y autorreferencia; los modelos fundacionales aprenden representaciones transferibles de datos. No demuestra influencia directa ni resuelve la conciencia artificial.',
    ),
  },
];
export const gebClaims: Claim[] = [
  {
    id: 'geb-publication',
    entityId: 'godel-escher-bach',
    claim: t(
      'Basic Books published GEB in New York in 1979; it won the 1980 Pulitzer Prize for General Nonfiction.',
      'Basic Books veröffentlichte GEB 1979 in New York; es gewann 1980 den Pulitzer-Preis für Sachbücher.',
      'Basic Books publicó GEB en Nueva York en 1979; ganó el Pulitzer de no ficción general en 1980.',
    ),
    references: ['geb-1979', 'geb-pulitzer'],
    status: 'verified',
  },
  {
    id: 'geb-proposal',
    entityId: 'godel-escher-bach',
    claim: t(
      'Hofstadter presents the strange loop as an account of selfhood; this is an attributed proposal, not an experimentally established consciousness criterion.',
      'Hofstadter stellt die seltsame Schleife als Erklärung des Selbst vor; dies ist ein zugeschriebener Vorschlag, kein experimentell etabliertes Bewusstseinskriterium.',
      'Hofstadter presenta el bucle extraño como explicación del yo; es una propuesta atribuida, no un criterio de conciencia establecido experimentalmente.',
    ),
    references: ['geb-publisher'],
    status: 'verified',
  },
  {
    id: 'hofstadter-affiliation',
    entityId: 'douglas-hofstadter',
    claim: t(
      'Indiana University lists Hofstadter as a Bloomington faculty member and describes his research on analogy and cognition.',
      'Indiana University führt Hofstadter als Mitglied der Fakultät in Bloomington und beschreibt seine Forschung zu Analogie und Kognition.',
      'Indiana University incluye a Hofstadter en su profesorado de Bloomington y describe su investigación sobre analogía y cognición.',
    ),
    references: ['hofstadter-directory', 'hofstadter-iu'],
    status: 'verified',
  },
];
