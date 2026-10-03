import type { Claim, LocalizedText } from '@/types/history';

const t = (en: string, de: string, es: string): LocalizedText => ({ en, de, es });
export const expansionClaims: Claim[] = [
  {
    id: 'hebb-plasticity',
    entityId: 'hebb',
    claim: t(
      'Hebb’s 1949 book proposed activity-dependent strengthening of connections and cell assemblies.',
      'Hebbs Buch von 1949 schlug aktivitätsabhängige Verbindungsstärkung und Zellverbände vor.',
      'El libro de Hebb de 1949 propuso reforzamiento de conexiones dependiente de actividad y asambleas celulares.',
    ),
    references: ['hebb-1949', 'hebb-mcgill'],
    status: 'verified',
  },
  {
    id: 'turing-computation',
    entityId: 'turing',
    claim: t(
      'Turing’s computable-numbers paper describes an abstract universal computing machine.',
      'Turings Artikel über berechenbare Zahlen beschreibt eine abstrakte universelle Rechenmaschine.',
      'El artículo de Turing sobre números computables describe una máquina abstracta universal.',
    ),
    references: ['turing-1936'],
    status: 'verified',
    editorialNotes: '1936 submission and conventional date; the volume also carries a 1937 date.',
  },
  {
    id: 'turing-imitation',
    entityId: 'turing',
    claim: t(
      'Computing Machinery and Intelligence appeared in 1950 and discussed an imitation game and learning machines.',
      'Computing Machinery and Intelligence erschien 1950 und diskutierte ein Imitationsspiel und lernende Maschinen.',
      'Computing Machinery and Intelligence apareció en 1950 y discutió un juego de imitación y máquinas que aprenden.',
    ),
    references: ['turing-1950'],
    status: 'verified',
  },
  {
    id: 'edvac-date-analogy',
    entityId: 'von-neumann',
    claim: t(
      'The EDVAC First Draft is dated June 30, 1945 and explicitly discusses a neural analogy.',
      'Der EDVAC First Draft ist auf den 30. Juni 1945 datiert und behandelt ausdrücklich eine neuronale Analogie.',
      'El First Draft de EDVAC está fechado el 30 de junio de 1945 y trata explícitamente una analogía neuronal.',
    ),
    references: ['edvac-1945'],
    status: 'verified',
    editorialNotes:
      'The document’s authorship does not establish sole invention of the EDVAC project’s concepts.',
  },
  {
    id: 'shannon-information',
    entityId: 'shannon',
    claim: t(
      'Shannon’s 1948 theory treats statistical uncertainty and reliable communication, separately from semantic meaning.',
      'Shannons Theorie von 1948 behandelt statistische Unsicherheit und zuverlässige Kommunikation getrennt von Bedeutung.',
      'La teoría de Shannon de 1948 trata incertidumbre estadística y comunicación fiable, separadas del significado.',
    ),
    references: ['shannon-1948'],
    status: 'verified',
  },
  {
    id: 'wiener-book-date',
    entityId: 'cybernetics',
    claim: t(
      'Wiener’s Cybernetics was first published in 1948 and connected control, communication and feedback.',
      'Wieners Cybernetics erschien erstmals 1948 und verband Regelung, Kommunikation und Rückkopplung.',
      'Cybernetics de Wiener apareció en 1948 y conectó control, comunicación y retroalimentación.',
    ),
    references: ['wiener-1948'],
    status: 'verified',
  },
  {
    id: 'dartmouth-proposal-date',
    entityId: 'dartmouth',
    claim: t(
      'McCarthy, Minsky, Rochester and Shannon proposed a summer 1956 Dartmouth study in a document dated August 31, 1955.',
      'McCarthy, Minsky, Rochester und Shannon schlugen in einem Dokument vom 31. August 1955 eine Dartmouth-Studie für Sommer 1956 vor.',
      'McCarthy, Minsky, Rochester y Shannon propusieron un estudio para el verano de 1956 en un documento del 31 de agosto de 1955.',
    ),
    references: ['dartmouth-proposal'],
    status: 'verified',
  },
  {
    id: 'logic-theorist-heuristics',
    entityId: 'symbolic-ai',
    claim: t(
      'The 1956 Logic Theory Machine report describes heuristic search for proofs; Newell, Simon and Shaw collaborated on the program.',
      'Der Logic-Theory-Machine-Bericht von 1956 beschreibt heuristische Beweissuche; Newell, Simon und Shaw arbeiteten am Programm zusammen.',
      'El informe Logic Theory Machine de 1956 describe búsqueda heurística de pruebas; Newell, Simon y Shaw colaboraron en el programa.',
    ),
    references: ['logic-theory-1956', 'rand-history'],
    status: 'verified',
  },
  {
    id: 'perceptrons-scope',
    entityId: 'perceptrons-1969',
    claim: t(
      'Perceptrons studies restricted architectures; a single linear threshold unit’s XOR limitation does not prohibit multilayer representations.',
      'Perceptrons untersucht eingeschränkte Architekturen; die XOR-Grenze einer linearen Schwellwerteinheit verbietet keine mehrschichtigen Darstellungen.',
      'Perceptrons estudia arquitecturas restringidas; la limitación XOR de una unidad lineal no impide representaciones multicapa.',
    ),
    references: ['minsky-papert-1969', 'perceptron-course'],
    status: 'verified',
  },
  {
    id: 'winters-interpretation',
    entityId: 'ai-winters',
    claim: t(
      'The idea of a single general first AI winter, and explanations attributing it to one book, are historically contested.',
      'Die Vorstellung eines allgemeinen ersten KI-Winters und seine Erklärung durch ein einzelnes Buch sind historisch umstritten.',
      'La idea de un primer invierno general de la IA y su atribución a un solo libro se discuten históricamente.',
    ),
    references: ['haigh-2023', 'agar-2020'],
    status: 'disputed',
    editorialNotes:
      'The dispute concerns periodization and causal interpretation. The atlas does not present the absence of a winter as settled consensus either.',
  },
  {
    id: 'hopfield-memory',
    entityId: 'hopfield',
    claim: t(
      'Hopfield’s 1982 paper describes associative retrieval through collective dynamics of a recurrent network.',
      'Hopfields Artikel von 1982 beschreibt assoziativen Abruf durch kollektive Dynamik eines rekurrenten Netzes.',
      'El artículo de Hopfield de 1982 describe recuperación asociativa mediante dinámica colectiva de una red recurrente.',
    ),
    references: ['hopfield-1982'],
    status: 'verified',
  },
  {
    id: 'physics-award-2024',
    entityId: 'hopfield',
    claim: t(
      'John Hopfield and Geoffrey Hinton jointly received the 2024 Nobel Prize in Physics.',
      'John Hopfield und Geoffrey Hinton erhielten gemeinsam den Physiknobelpreis 2024.',
      'John Hopfield y Geoffrey Hinton recibieron conjuntamente el Nobel de Física de 2024.',
    ),
    references: ['nobel-physics-2024'],
    status: 'verified',
  },
  {
    id: 'mnist-split',
    entityId: 'mnist',
    claim: t(
      'MNIST has 60,000 training images and 10,000 test images of normalized handwritten digits.',
      'MNIST enthält 60.000 Trainings- und 10.000 Testbilder normalisierter handgeschriebener Ziffern.',
      'MNIST contiene 60.000 imágenes de entrenamiento y 10.000 de prueba de dígitos manuscritos normalizados.',
    ),
    references: ['mnist-creators', 'lecun-1998'],
    status: 'verified',
    editorialNotes:
      '1998 is the selected publication milestone, not an asserted exact dataset release date.',
  },
  {
    id: 'bellman-book',
    entityId: 'bellman',
    claim: t(
      'Bellman’s Dynamic Programming was published in 1957; his contemporary paper lists RAND in Santa Monica.',
      'Bellmans Dynamic Programming erschien 1957; sein zeitgenössischer Artikel nennt RAND in Santa Monica.',
      'Dynamic Programming de Bellman se publicó en 1957; su artículo contemporáneo indica RAND en Santa Monica.',
    ),
    references: ['bellman-1957', 'bellman-communication'],
    status: 'verified',
  },
  {
    id: 'td-successive-predictions',
    entityId: 'temporal-difference',
    claim: t(
      'Sutton’s 1988 paper studies updates based on successive predictions and acknowledges earlier related work.',
      'Suttons Artikel von 1988 untersucht Aktualisierungen anhand aufeinanderfolgender Vorhersagen und würdigt frühere verwandte Arbeiten.',
      'El artículo de Sutton de 1988 estudia actualizaciones basadas en predicciones sucesivas y reconoce trabajos anteriores.',
    ),
    references: ['sutton-1988'],
    status: 'verified',
  },
  {
    id: 'td-gte-affiliation',
    entityId: 'temporal-difference',
    claim: t(
      'The 1988 temporal-difference paper lists GTE Laboratories in Waltham as Sutton’s affiliation.',
      'Der Temporal-Difference-Artikel von 1988 nennt GTE Laboratories in Waltham als Suttons Institution.',
      'El artículo de diferencias temporales de 1988 indica GTE Laboratories, Waltham, como afiliación de Sutton.',
    ),
    references: ['sutton-1988'],
    status: 'verified',
  },
  {
    id: 'q-learning-conditions',
    entityId: 'q-learning',
    claim: t(
      'Watkins and Dayan’s 1992 convergence result assumes discrete action values and appropriate repeated sampling.',
      'Das Konvergenzergebnis von Watkins und Dayan von 1992 setzt diskrete Handlungswerte und geeignete wiederholte Stichproben voraus.',
      'El resultado de convergencia de Watkins y Dayan de 1992 supone valores discretos y muestreo repetido adecuado.',
    ),
    references: ['watkins-dayan-1992'],
    status: 'verified',
    editorialNotes:
      'The theorem also requires learning-rate conditions. It is not a blanket guarantee for deep function approximation.',
  },
  {
    id: 'dopamine-td-interpretation',
    entityId: 'dopamine',
    claim: t(
      'Schultz, Dayan and Montague connected particular dopamine responses with temporal-difference reward prediction errors in 1997.',
      'Schultz, Dayan und Montague verbanden 1997 bestimmte Dopaminantworten mit Temporal-Difference-Belohnungsvorhersagefehlern.',
      'Schultz, Dayan y Montague relacionaron en 1997 ciertas respuestas de dopamina con errores de predicción de recompensa por diferencias temporales.',
    ),
    references: ['schultz-dayan-montague-1997'],
    status: 'verified',
    editorialNotes:
      'A computational interpretation of specific experimental findings, not a universal identity between dopamine and one algorithm.',
  },
  {
    id: 'dqn-benchmark',
    entityId: 'dqn',
    claim: t(
      'The 2015 DQN study evaluated 49 Atari games using a shared algorithm and architecture with separate training for each game.',
      'Die DQN-Studie von 2015 untersuchte 49 Atari-Spiele mit gemeinsamem Algorithmus und Architektur sowie gesondertem Training je Spiel.',
      'El estudio DQN de 2015 evaluó 49 juegos Atari con algoritmo y arquitectura comunes y entrenamiento separado para cada juego.',
    ),
    references: ['dqn-2015'],
    status: 'verified',
  },
  {
    id: 'dqn-stabilization',
    entityId: 'dqn',
    claim: t(
      'DQN combined deep action-value approximation with experience replay and a target network in the 2015 study.',
      'DQN kombinierte 2015 tiefe Handlungswertapproximation mit Erfahrungswiederholung und einem Zielnetz.',
      'DQN combinó aproximación profunda de valores, repetición de experiencias y red objetivo en el estudio de 2015.',
    ),
    references: ['dqn-2015'],
    status: 'verified',
  },
  {
    id: 'alphago-training',
    entityId: 'alphago',
    claim: t(
      'The 2016 AlphaGo system used human game examples and self-play, together with policy/value networks and tree search.',
      'AlphaGo nutzte 2016 menschliche Beispielpartien und Selbstspiel sowie Strategie-/Wertnetze und Baumsuche.',
      'AlphaGo utilizó en 2016 partidas humanas y autojuego, junto con redes de política y valor y búsqueda en árboles.',
    ),
    references: ['alphago-2016'],
    status: 'verified',
  },
  {
    id: 'alphago-zero-difference',
    entityId: 'alphago',
    claim: t(
      'The 2017 AlphaGo Zero system learned without human game examples; this is distinct from the 2016 system.',
      'AlphaGo Zero lernte 2017 ohne menschliche Beispielpartien; es unterscheidet sich vom System von 2016.',
      'AlphaGo Zero aprendió en 2017 sin ejemplos de partidas humanas; es distinto del sistema de 2016.',
    ),
    references: ['alphago-zero-2017', 'alphago-2016'],
    status: 'verified',
  },
  {
    id: 'predictive-model',
    entityId: 'predictive-coding',
    claim: t(
      'Rao and Ballard’s 1999 model uses feedback predictions and feedforward residual errors to explain selected visual response properties.',
      'Rao und Ballards Modell von 1999 nutzt rückgekoppelte Vorhersagen und aufsteigende Restfehler zur Erklärung ausgewählter visueller Antworteigenschaften.',
      'El modelo de Rao y Ballard de 1999 utiliza predicciones descendentes y errores ascendentes para explicar ciertas respuestas visuales.',
    ),
    references: ['rao-ballard-1999'],
    status: 'verified',
    editorialNotes:
      'The verified claim concerns what the model proposes, not experimental proof of a universal cortical mechanism.',
  },
  {
    id: 'transformer-origin',
    entityId: 'transformers',
    claim: t(
      'The 2017 Transformer paper introduced an attention-based encoder-decoder architecture evaluated on translation tasks.',
      'Der Transformer-Artikel von 2017 stellte eine aufmerksamkeitsbasierte Encoder-Decoder-Architektur vor, die an Übersetzungsaufgaben bewertet wurde.',
      'El artículo Transformer de 2017 presentó una arquitectura de codificador-decodificador basada en atención, evaluada en traducción.',
    ),
    references: ['transformer-2017'],
    status: 'verified',
  },
  {
    id: 'bert-masked-pretraining',
    entityId: 'self-supervised-learning',
    claim: t(
      'BERT’s 2018 preprint describes bidirectional Transformer pretraining using masked language modeling and subsequent task adaptation.',
      'Der BERT-Preprint von 2018 beschreibt bidirektionales Transformer-Vortraining mit maskierter Sprachmodellierung und anschließender Aufgabenanpassung.',
      'El preprint BERT de 2018 describe preentrenamiento Transformer bidireccional con modelado enmascarado y adaptación posterior.',
    ),
    references: ['bert-2018'],
    status: 'verified',
    editorialNotes:
      'BERT is the selected example, not a claimed inventor of self-supervised learning.',
  },
  {
    id: 'alphafold-publication',
    entityId: 'alphafold',
    claim: t(
      'The 2021 AlphaFold paper reports AlphaFold2 protein structure prediction following the CASP14 assessment in 2020.',
      'Der AlphaFold-Artikel von 2021 berichtet über AlphaFold2-Proteinstrukturvorhersage nach der CASP14-Bewertung von 2020.',
      'El artículo AlphaFold de 2021 describe predicción estructural con AlphaFold2 después de CASP14 en 2020.',
    ),
    references: ['alphafold-2021'],
    status: 'verified',
  },
  {
    id: 'chemistry-award-scope',
    entityId: 'alphafold',
    claim: t(
      'Hassabis and Jumper shared half the 2024 Chemistry Nobel for structure prediction; Baker received the other half for protein design.',
      'Hassabis und Jumper teilten die Hälfte des Chemienobelpreises 2024 für Strukturvorhersage; Baker erhielt die andere Hälfte für Proteinentwurf.',
      'Hassabis y Jumper compartieron la mitad del Nobel de Química de 2024 por predicción estructural; Baker recibió la otra mitad por diseño proteico.',
    ),
    references: ['nobel-chemistry-2024'],
    status: 'verified',
  },
  {
    id: 'foundation-term',
    entityId: 'foundation-models',
    claim: t(
      'The 2021 Stanford report introduced foundation models as a framing for broadly trained models adaptable to many downstream tasks.',
      'Der Stanford-Bericht von 2021 führte Basismodelle als Begriff für breit trainierte, an viele Folgeaufgaben anpassbare Modelle ein.',
      'El informe de Stanford de 2021 introdujo modelos fundacionales como marco para modelos amplios adaptables a muchas tareas.',
    ),
    references: ['foundation-2021'],
    status: 'verified',
  },
  {
    id: 'neuroai-agenda',
    entityId: 'neuroai',
    claim: t(
      'The 2023 NeuroAI perspective advocates collaboration between neuroscience and machine learning; it is an agenda rather than a settled theory.',
      'Die NeuroAI-Perspektive von 2023 fordert Zusammenarbeit zwischen Neurowissenschaft und maschinellem Lernen; sie ist ein Programm, keine abgeschlossene Theorie.',
      'La perspectiva NeuroAI de 2023 propone colaboración entre neurociencia y aprendizaje automático; es un programa, no una teoría establecida.',
    ),
    references: ['neuroai-2023'],
    status: 'verified',
  },
  {
    id: 'hh-biophysics',
    entityId: 'hodgkin-huxley',
    claim: t(
      'The 1952 Hodgkin-Huxley paper quantitatively models membrane currents and excitation based on squid giant-axon experiments.',
      'Der Hodgkin-Huxley-Artikel von 1952 modelliert Membranströme und Erregung quantitativ anhand von Versuchen am Tintenfisch-Riesenaxon.',
      'El artículo Hodgkin-Huxley de 1952 modela cuantitativamente corrientes y excitación con experimentos del axón gigante de calamar.',
    ),
    references: ['hodgkin-huxley-1952'],
    status: 'verified',
  },
];
