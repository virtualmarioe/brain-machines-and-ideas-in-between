import { text } from './translations/ui';
import type { Complexity } from '@/lib/complexity';

export const winterCopy = {
  learn: text('Learn more', 'Mehr erfahren', 'Más información'),
  title: text(
    'Understanding the AI winters',
    'Die KI-Winter verstehen',
    'Entender los inviernos de la IA',
  ),
  intro: text(
    'Real advances, promises that outran them. The winters describe setbacks in confidence, support and investment, not a disappearance of useful ideas.',
    'Echte Fortschritte, überholte Versprechen. Die Winter beschreiben Rückschläge bei Vertrauen, Förderung und Investitionen, nicht das Verschwinden nützlicher Ideen.',
    'Avances reales, promesas que los superaron. Los inviernos describen retrocesos en confianza, apoyo e inversión, no la desaparición de ideas útiles.',
  ),
  caveat: text(
    'Dates are approximate and contested. The first winter is often dated 1974–1980; this timeline uses the 1973 Lighthill report as its transition anchor. The second is shown as 1987–1993. Neither period was a uniform worldwide halt to research.',
    'Die Daten sind ungefähr und umstritten. Der erste Winter wird oft auf 1974–1980 datiert; diese Zeitleiste nutzt den Lighthill-Bericht von 1973 als Übergang. Der zweite wird als 1987–1993 dargestellt. Keine der Phasen bedeutete einen weltweiten Forschungsstillstand.',
    'Las fechas son aproximadas y debatidas. El primer invierno suele situarse en 1974–1980; esta cronología usa el informe Lighthill de 1973 como referencia del cambio. El segundo se muestra como 1987–1993. Ninguno supuso una paralización mundial de la investigación.',
  ),
  cycleTitle: text(
    'How a breakthrough becomes an expectation gap',
    'Wie aus Fortschritt eine Erwartungslücke wird',
    'Cómo un avance abre una brecha de expectativas',
  ),
  cycle: [
    text('Breakthrough', 'Durchbruch', 'Avance'),
    text('Rising capability', 'Wachsende Fähigkeiten', 'Mayor capacidad'),
    text(
      'Faster-rising promises',
      'Noch schneller wachsende Versprechen',
      'Promesas que crecen más rápido',
    ),
    text('Limits become visible', 'Grenzen werden sichtbar', 'Límites visibles'),
    text('Confidence falls', 'Vertrauen sinkt', 'Pérdida de confianza'),
    text('Support contracts', 'Förderung schrumpft', 'Menor apoyo'),
  ],
  color: text(
    'Read the red tint as growing expectations and the risk of a gap with demonstrated capability, not as a measurement of progress. Blue marks a contraction in confidence and support. The gradients are an interpretive guide, not measured historical data or a prediction of another winter.',
    'Rot steht für wachsende Erwartungen und das Risiko einer Lücke zu belegten Fähigkeiten, nicht für gemessenen Fortschritt. Blau markiert sinkendes Vertrauen und geringere Unterstützung. Die Verläufe sind eine Deutung, keine historischen Messdaten oder Vorhersage eines weiteren Winters.',
    'El rojo representa expectativas crecientes y el riesgo de una brecha con la capacidad demostrada, no una medida del progreso. El azul indica menor confianza y apoyo. Los gradientes son una guía interpretativa, no datos históricos medidos ni una predicción de otro invierno.',
  ),
  first: text(
    'First winter: the demonstration did not scale',
    'Erster Winter: die Demonstration ließ sich nicht skalieren',
    'Primer invierno: la demostración no escalaba',
  ),
  second: text(
    'Second winter: useful systems became costly to sustain',
    'Zweiter Winter: nützliche Systeme wurden teuer im Betrieb',
    'Segundo invierno: sistemas útiles, costosos de mantener',
  ),
  firstBody: text(
    'Early programs could solve carefully bounded problems. Real settings introduced many more choices, missing knowledge, ambiguity and noise. Search grew too quickly for the available computing power and memory; manually encoded knowledge covered too little of the world. Predictions of near-term general intelligence, translation and problem solving exceeded what these demonstrations established.',
    'Frühe Programme lösten klar begrenzte Probleme. Reale Situationen brachten mehr Möglichkeiten, fehlendes Wissen, Mehrdeutigkeit und Störungen mit sich. Die Suche wuchs zu schnell für die verfügbare Rechenleistung und den Speicher; manuell codiertes Wissen deckte zu wenig ab. Vorhersagen baldiger allgemeiner Intelligenz, Übersetzung und Problemlösung gingen über die Belege hinaus.',
    'Los primeros programas resolvían problemas delimitados. Los entornos reales introducían más opciones, conocimiento incompleto, ambigüedad y ruido. La búsqueda crecía demasiado para el cómputo y la memoria disponibles; el conocimiento codificado a mano cubría muy poco del mundo. Las promesas de inteligencia general, traducción y resolución de problemas a corto plazo excedían lo demostrado.',
  ),
  secondBody: text(
    'Expert systems captured specialist knowledge as rules and achieved useful commercial results. But extracting rules from people was slow and expensive. As rule bases grew, debugging, updating and resolving contradictions became difficult. Many systems were brittle outside their narrow domain and depended on manual revisions instead of learning from new data. Benefits could be outweighed by development, maintenance and hardware costs.',
    'Expertensysteme erfassten Fachwissen als Regeln und erzielten kommerzielle Erfolge. Doch die Erhebung des Wissens war langsam und teuer. Mit wachsenden Regelbeständen wurden Fehlersuche, Aktualisierung und das Auflösen von Widersprüchen schwierig. Viele Systeme waren außerhalb ihres engen Bereichs fragil und brauchten manuelle Änderungen statt aus neuen Daten zu lernen. Entwicklungs-, Wartungs- und Hardwarekosten konnten den Nutzen übersteigen.',
    'Los sistemas expertos codificaban conocimiento especializado en reglas y lograron resultados comerciales útiles. Pero obtener esas reglas era lento y caro. Al crecer las bases de reglas, depurarlas, actualizarlas y resolver contradicciones se volvía difícil. Muchos sistemas eran frágiles fuera de su dominio y requerían revisiones manuales en lugar de aprender de nuevos datos. Los costes de desarrollo, mantenimiento y hardware podían superar los beneficios.',
  ),
  turningPoints: text(
    'Triggers and turning points',
    'Auslöser und Wendepunkte',
    'Desencadenantes y puntos de inflexión',
  ),
  triggersIntro: text(
    'Reports, procurement decisions and market shifts made existing limitations consequential. They were different events in different settings, not one simultaneous global collapse.',
    'Berichte, Beschaffungsentscheidungen und Marktverschiebungen machten bestehende Grenzen folgenreich. Es waren verschiedene Ereignisse in verschiedenen Kontexten, kein gleichzeitiger globaler Zusammenbruch.',
    'Informes, decisiones de compra y cambios de mercado hicieron que los límites existentes tuvieran consecuencias. Fueron hechos distintos en contextos distintos, no un colapso mundial simultáneo.',
  ),
  comparison: text(
    'Shared pressures, different bottlenecks',
    'Gemeinsamer Druck, unterschiedliche Engpässe',
    'Presiones compartidas, obstáculos distintos',
  ),
  factor: text('Structural pressure', 'Struktureller Druck', 'Presión estructural'),
  firstShort: text('First winter', 'Erster Winter', 'Primer invierno'),
  secondShort: text('Second winter', 'Zweiter Winter', 'Segundo invierno'),
  interpretation: text(
    'Why the winter metaphor needs care',
    'Warum die Wintermetapher Vorsicht verlangt',
    'Por qué hay que matizar la metáfora',
  ),
  interpretationBody: text(
    'Do not read these causes as a measured ranking. Their importance depended on the institution, country and application. Jon Agar places the Lighthill report within political debates about the usefulness of science. Thomas Haigh challenges the idea of a general first winter, pointing to continuing institutional growth. A report, a book or a market crash cannot explain every research trajectory. The familiar two-winter narrative is useful for comparing promises with deployment, but it compresses a much less uniform history.',
    'Diese Ursachen sind keine gemessene Rangfolge. Ihre Bedeutung hing von Institution, Land und Anwendung ab. Jon Agar ordnet den Lighthill-Bericht in politische Debatten über den Nutzen der Wissenschaft ein. Thomas Haigh bestreitet einen allgemeinen ersten Winter und verweist auf fortgesetztes institutionelles Wachstum. Ein Bericht, ein Buch oder ein Marktcrash erklärt nicht jeden Forschungsweg. Die Erzählung zweier Winter hilft beim Vergleich von Versprechen und Praxis, verdichtet aber eine viel uneinheitlichere Geschichte.',
    'Estas causas no forman una clasificación medida. Su peso dependía de la institución, el país y la aplicación. Jon Agar sitúa el informe Lighthill en debates políticos sobre la utilidad de la ciencia. Thomas Haigh cuestiona un primer invierno general y señala el crecimiento institucional continuado. Un informe, un libro o una crisis de mercado no explica todas las trayectorias. El relato de dos inviernos ayuda a comparar promesas y despliegue, pero comprime una historia mucho menos uniforme.',
  ),
  sources: text(
    'Sources and further reading',
    'Quellen und weiterführende Literatur',
    'Fuentes y lecturas adicionales',
  ),
  demoTitle: text(
    'Try it: why search grows so quickly',
    'Ausprobieren: warum Suche so schnell wächst',
    'Prueba: por qué la búsqueda crece tan rápido',
  ),
  demoIntro: text(
    'Suppose every decision opens several new choices. Add just one more decision and compare the number of possible paths.',
    'Angenommen, jede Entscheidung eröffnet mehrere Möglichkeiten. Füge eine Entscheidung hinzu und vergleiche die Zahl möglicher Pfade.',
    'Supón que cada decisión abre varias opciones. Añade una decisión y compara cuántos caminos son posibles.',
  ),
  choices: text('Choices per decision', 'Möglichkeiten pro Entscheidung', 'Opciones por decisión'),
  depth: text('Decisions in a path', 'Entscheidungen pro Pfad', 'Decisiones por camino'),
  paths: text(
    'possible complete paths',
    'mögliche vollständige Pfade',
    'caminos completos posibles',
  ),
  next: text('With one more decision', 'Mit einer weiteren Entscheidung', 'Con una decisión más'),
  demoNote: text(
    'Illustrative full search tree, not a historical benchmark. Heuristics can prune branches; useful systems need not enumerate every path. Faster hardware helps, but exponential growth can quickly absorb the improvement.',
    'Illustrativer vollständiger Suchbaum, kein historischer Benchmark. Heuristiken können Zweige abschneiden; nützliche Systeme müssen nicht jeden Pfad prüfen. Schnellere Hardware hilft, doch exponentielles Wachstum kann den Gewinn rasch aufzehren.',
    'Árbol de búsqueda completo e ilustrativo, no una medición histórica. Las heurísticas pueden podar ramas; los sistemas útiles no necesitan explorar todos los caminos. Un hardware más rápido ayuda, pero el crecimiento exponencial puede absorber pronto esa mejora.',
  ),
};

export const winterCards: Record<
  Complexity,
  { first: ReturnType<typeof text>; second: ReturnType<typeof text> }
> = {
  essentials: {
    first: text(
      'Small demonstrations looked promising, but real-world problems demanded far more computation and knowledge. Expectations outran what the systems could reliably do.',
      'Kleine Demonstrationen wirkten vielversprechend, doch reale Probleme verlangten viel mehr Rechenleistung und Wissen. Die Erwartungen überstiegen die verlässlichen Fähigkeiten.',
      'Las pequeñas demostraciones prometían mucho, pero los problemas reales exigían mucho más cómputo y conocimiento. Las expectativas superaron las capacidades fiables.',
    ),
    second: text(
      'Expert systems could solve useful, narrow tasks. Building and maintaining their rules proved costly, and they struggled when conditions changed. Commercial confidence weakened.',
      'Expertensysteme lösten nützliche, eng begrenzte Aufgaben. Aufbau und Pflege ihrer Regeln waren teuer; veränderte Bedingungen bereiteten Probleme. Das kommerzielle Vertrauen sank.',
      'Los sistemas expertos resolvían tareas útiles y acotadas. Crear y mantener sus reglas resultó caro y los cambios de contexto les planteaban dificultades. La confianza comercial disminuyó.',
    ),
  },
  connections: {
    first: text(
      'Search spaces expanded faster than limited hardware could handle. Sparse knowledge and fragile generalization undermined broad promises. The ALPAC translation review, Lighthill report and changing funding priorities affected different research communities.',
      'Suchräume wuchsen schneller, als begrenzte Hardware sie bewältigen konnte. Wissenslücken und fragile Generalisierung untergruben große Versprechen. ALPAC, der Lighthill-Bericht und veränderte Förderprioritäten betrafen unterschiedliche Forschungsgemeinschaften.',
      'Los espacios de búsqueda crecían más rápido de lo que permitía el hardware. El conocimiento limitado y la generalización frágil debilitaban las promesas. ALPAC, Lighthill y los cambios de financiación afectaron a comunidades distintas.',
    ),
    second: text(
      'The bottleneck shifted from impressive demonstrations to sustainable deployment: acquiring expert knowledge, maintaining large rule bases and adapting to change. Cheaper general-purpose machines also undercut specialized Lisp hardware.',
      'Der Engpass verschob sich von eindrucksvollen Demonstrationen zum tragfähigen Einsatz: Fachwissen erheben, große Regelbestände pflegen und Veränderungen bewältigen. Günstigere Allzweckrechner untergruben zudem spezialisierte Lisp-Hardware.',
      'El obstáculo pasó de demostrar capacidades a mantener despliegues viables: obtener conocimiento experto, mantener reglas y adaptarse. Los ordenadores de uso general más baratos también desplazaron al hardware Lisp especializado.',
    ),
  },
  expert: {
    first: text(
      'Separate technical limits from policy decisions: combinatorial search, scarce compute and brittle representations did not produce a uniform funding response. The 1973 marker anchors a disputed periodization, not a measured global collapse; historians challenge the general first-winter narrative.',
      'Technische Grenzen und politische Entscheidungen sind zu trennen: kombinatorische Suche, knappe Rechenleistung und fragile Repräsentationen führten nicht zu einer einheitlichen Förderreaktion. 1973 markiert eine umstrittene Periodisierung, keinen gemessenen globalen Einbruch; Historiker hinterfragen einen allgemeinen ersten Winter.',
      'Conviene separar límites técnicos y decisiones políticas: búsqueda combinatoria, cómputo escaso y representaciones frágiles no provocaron una respuesta financiera uniforme. 1973 marca una periodización debatida, no un colapso mundial medido; los historiadores cuestionan un primer invierno general.',
    ),
    second: text(
      'Deployment economics compounded technical brittleness: costly knowledge acquisition, rule maintenance, weak automatic adaptation and specialized infrastructure. The Lisp-machine market contraction and unmet program expectations are distinct mechanisms, not proof that all knowledge-based methods failed.',
      'Die Einsatzkosten verstärkten technische Fragilität: teure Wissenserhebung, Regelpflege, geringe automatische Anpassung und Spezialinfrastruktur. Der schrumpfende Lisp-Markt und unerfüllte Programmerwartungen sind unterschiedliche Mechanismen, kein Beweis für das Scheitern aller wissensbasierten Methoden.',
      'La economía del despliegue agravó la fragilidad técnica: adquisición costosa de conocimiento, mantenimiento, poca adaptación automática e infraestructura especializada. La contracción del mercado Lisp y las expectativas incumplidas de programas son mecanismos distintos, no prueba del fracaso de todos los métodos basados en conocimiento.',
    ),
  },
};

export const winterTriggers = [
  {
    year: '1966',
    title: 'ALPAC',
    body: text(
      'The US review questioned the practical progress and economics of machine translation, contributing to cuts in that area. This predates the usual first-winter dates.',
      'Die US-Prüfung hinterfragte Fortschritt und Wirtschaftlichkeit maschineller Übersetzung und trug zu Kürzungen in diesem Bereich bei. Sie liegt vor den üblichen Winterdaten.',
      'La revisión estadounidense cuestionó el progreso práctico y la economía de la traducción automática, contribuyendo a recortes en ese campo. Es anterior a las fechas habituales del primer invierno.',
    ),
    source: 'alpac',
  },
  {
    year: '1973',
    title: 'Lighthill',
    body: text(
      'The UK report criticized scaling and real-world usefulness. It became a landmark in disputes over public research support, with consequences concentrated in the British context.',
      'Der britische Bericht kritisierte Skalierung und praktischen Nutzen. Er wurde ein Bezugspunkt im Streit über öffentliche Forschungsförderung, insbesondere in Großbritannien.',
      'El informe británico criticó la escalabilidad y la utilidad práctica. Fue un hito del debate sobre apoyo público, con consecuencias centradas en el contexto británico.',
    ),
    source: 'agar',
  },
  {
    year: '1970s',
    title: 'DARPA',
    body: text(
      'US sponsorship increasingly emphasized practical or military deliverables over open-ended promises. Changing priorities affected projects differently; they do not establish a universal funding collapse.',
      'US-Förderung betonte zunehmend praktische oder militärische Ergebnisse statt offener Versprechen. Veränderte Prioritäten betrafen Projekte unterschiedlich und belegen keinen allgemeinen Fördereinbruch.',
      'La financiación estadounidense dio más peso a resultados prácticos o militares. Las nuevas prioridades afectaron de manera distinta a los proyectos y no demuestran un colapso universal.',
    ),
    source: 'haigh',
  },
  {
    year: '1987–1988',
    title: 'Lisp',
    body: text(
      'Cheaper, increasingly capable workstations and PCs eroded the case for expensive specialized Lisp machines. A hardware-market shakeout reinforced disappointment with the cost of expert-system deployment.',
      'Günstigere, leistungsfähigere Workstations und PCs schwächten den Nutzen teurer Lisp-Spezialrechner. Die Marktbereinigung verstärkte Enttäuschungen über die Einsatzkosten von Expertensystemen.',
      'Estaciones de trabajo y PC más baratos y potentes redujeron el atractivo de las costosas máquinas Lisp. La crisis del hardware reforzó la decepción por los costes de los sistemas expertos.',
    ),
    source: 'pioneers',
  },
  {
    year: '1982–1992',
    title: 'Fifth Generation',
    body: text(
      'Japan’s program pursued ambitious logic-programming and intelligent-computing goals. Its results fell short of the anticipated revolution. Unmet expectations fed reassessment of large programs without making every technical contribution worthless.',
      'Japans Programm verfolgte ehrgeizige Ziele in Logikprogrammierung und intelligentem Rechnen. Die Ergebnisse blieben hinter der erwarteten Revolution zurück. Unerfüllte Erwartungen förderten die Neubewertung großer Programme, ohne jeden technischen Beitrag wertlos zu machen.',
      'El programa japonés persiguió metas ambiciosas en programación lógica y computación inteligente. No produjo la revolución esperada. Las expectativas incumplidas impulsaron una revisión de grandes programas, sin invalidar todas sus contribuciones técnicas.',
    ),
    source: 'museum',
  },
];

export const winterPressures = [
  [
    text('Promises', 'Versprechen', 'Promesas'),
    text(
      'General intelligence inferred from narrow demonstrations',
      'Allgemeine Intelligenz aus engen Demonstrationen abgeleitet',
      'Inteligencia general inferida de demostraciones limitadas',
    ),
    text(
      'Commercial benefits projected beyond reliable deployment',
      'Kommerzieller Nutzen über verlässlichen Einsatz hinaus projiziert',
      'Beneficios proyectados más allá del despliegue fiable',
    ),
  ],
  [
    text('Compute and scaling', 'Rechenleistung und Skalierung', 'Cómputo y escalabilidad'),
    text(
      'Search explosion, limited memory and processing',
      'Explodierende Suche, begrenzter Speicher und Rechenleistung',
      'Explosión de búsqueda, memoria y procesamiento limitados',
    ),
    text(
      'Large rule bases and costly specialized infrastructure',
      'Große Regelbestände und teure Spezialinfrastruktur',
      'Grandes bases de reglas e infraestructura costosa',
    ),
  ],
  [
    text('Knowledge and learning', 'Wissen und Lernen', 'Conocimiento y aprendizaje'),
    text(
      'Sparse data and manually encoded toy worlds',
      'Wenige Daten und manuell codierte Modellwelten',
      'Pocos datos y mundos simplificados codificados a mano',
    ),
    text(
      'Slow knowledge acquisition; limited automatic adaptation',
      'Langsame Wissenserhebung; geringe automatische Anpassung',
      'Adquisición lenta; adaptación automática limitada',
    ),
  ],
  [
    text('Robustness', 'Robustheit', 'Robustez'),
    text(
      'Ambiguity, noise and unfamiliar cases break assumptions',
      'Mehrdeutigkeit, Störungen und neue Fälle verletzen Annahmen',
      'Ambigüedad, ruido y casos nuevos invalidan supuestos',
    ),
    text(
      'Brittle rules, contradictions and expensive updates',
      'Fragile Regeln, Widersprüche und teure Aktualisierungen',
      'Reglas frágiles, contradicciones y actualizaciones caras',
    ),
  ],
  [
    text('Economics', 'Wirtschaftlichkeit', 'Economía'),
    text(
      'Research feasibility and public support dominate',
      'Machbarkeit und öffentliche Förderung im Vordergrund',
      'Predominan viabilidad científica y apoyo público',
    ),
    text(
      'Development and maintenance can outweigh customer value',
      'Entwicklung und Wartung können den Kundennutzen übersteigen',
      'Desarrollo y mantenimiento pueden superar el valor aportado',
    ),
  ],
  [
    text('Funding and confidence', 'Förderung und Vertrauen', 'Financiación y confianza'),
    text(
      'Critical reviews and shifting agency priorities',
      'Kritische Berichte und neue Förderprioritäten',
      'Revisiones críticas y nuevas prioridades institucionales',
    ),
    text(
      'Investor reaction, market losses and unmet program goals',
      'Investorenreaktionen, Marktverluste und verfehlte Programmziele',
      'Reacción inversora, pérdidas y metas incumplidas',
    ),
  ],
];

export const winterSources = [
  {
    id: 'alpac',
    title: 'ALPAC (1966), Language and Machines',
    url: 'https://www.nationalacademies.org/publications/20813',
  },
  {
    id: 'agar',
    title: 'Jon Agar (2020), The Lighthill report reinterpreted',
    url: 'https://www.cambridge.org/core/journals/british-journal-for-the-history-of-science/article/abs/what-is-science-for-the-lighthill-report-on-artificial-intelligence-reinterpreted/61B13B32988D6A8C58CF8AADD4777789',
  },
  {
    id: 'haigh',
    title: 'Thomas Haigh (2023), There Was No First AI Winter',
    url: 'https://doi.org/10.1145/3625833',
  },
  {
    id: 'pioneers',
    title: 'Computer History Museum (2019), Expert Systems Pioneer Meeting, Session 4',
    url: 'https://archive.computerhistory.org/resources/access/text/2020/05/102781124-05-01-acc.pdf',
  },
  {
    id: 'museum',
    title: 'Computer History Museum, AI & Robotics timeline',
    url: 'https://www.computerhistory.org/timeline/ai-robotics/',
  },
];
