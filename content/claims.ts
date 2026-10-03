import type { Claim, LocalizedText } from '@/types/history';

const t = (en: string, de: string, es: string): LocalizedText => ({ en, de, es });

export const claims: Claim[] = [
  {
    id: 'golgi-stain-date',
    entityId: 'golgi',
    claim: t(
      'Golgi described the black reaction in 1873 after work in Abbiategrasso.',
      'Golgi beschrieb die schwarze Reaktion 1873 nach Arbeiten in Abbiategrasso.',
      'Golgi describió la reacción negra en 1873 tras trabajar en Abbiategrasso.',
    ),
    references: ['golgi-pavia'],
    status: 'verified',
  },
  {
    id: 'golgi-cajal-nobel',
    entityId: 'golgi',
    claim: t(
      'Golgi and Cajal shared the 1906 Physiology or Medicine Nobel Prize.',
      'Golgi und Cajal teilten sich 1906 den Nobelpreis für Physiologie oder Medizin.',
      'Golgi y Cajal compartieron el Nobel de Fisiología o Medicina de 1906.',
    ),
    references: ['nobel-1906'],
    status: 'verified',
  },
  {
    id: 'cajal-barcelona-period',
    entityId: 'cajal',
    claim: t(
      'Cajal worked at the University of Barcelona from 1887 to 1892.',
      'Cajal arbeitete von 1887 bis 1892 an der Universität Barcelona.',
      'Cajal trabajó en la Universidad de Barcelona de 1887 a 1892.',
    ),
    references: ['cajal-barcelona'],
    status: 'verified',
  },
  {
    id: 'cajal-cells',
    entityId: 'cajal',
    claim: t(
      'Cajal defended the anatomical individuality of nerve cells.',
      'Cajal verteidigte die anatomische Eigenständigkeit der Nervenzellen.',
      'Cajal defendió la individualidad anatómica de las células nerviosas.',
    ),
    references: ['cajal-lecture'],
    status: 'verified',
  },
  {
    id: 'doctrine-collective',
    entityId: 'neuron-doctrine',
    claim: t(
      'The neuron doctrine developed through contributions from several anatomists; Waldeyer’s synthesis dates to 1891.',
      'Die Neuronenlehre entstand durch mehrere Anatomen; Waldeyers Synthese stammt von 1891.',
      'La doctrina neuronal reunió aportaciones de varios anatomistas; la síntesis de Waldeyer es de 1891.',
    ),
    references: ['neuron-history', 'cajal-lecture'],
    status: 'verified',
  },
  {
    id: 'mcculloch-formal-model',
    entityId: 'mcculloch-pitts',
    claim: t(
      'The 1943 paper connects idealized all-or-none activity to propositional logic.',
      'Die Arbeit von 1943 verbindet idealisierte Alles-oder-nichts-Aktivität mit Aussagenlogik.',
      'El artículo de 1943 relaciona actividad idealizada de todo o nada y lógica proposicional.',
    ),
    references: ['mcculloch-pitts-1943'],
    status: 'verified',
  },
  {
    id: 'perceptron-1958',
    entityId: 'perceptron',
    claim: t(
      'Rosenblatt’s perceptron paper appeared in Psychological Review in 1958.',
      'Rosenblatts Perzeptron-Artikel erschien 1958 in Psychological Review.',
      'El artículo de Rosenblatt sobre el perceptrón apareció en Psychological Review en 1958.',
    ),
    references: ['rosenblatt-1958'],
    status: 'verified',
  },
  {
    id: 'perceptron-boundary',
    entityId: 'perceptron',
    claim: t(
      'A single linear threshold unit cannot solve XOR on the original two inputs.',
      'Eine einzelne lineare Schwellwerteinheit kann XOR mit den beiden ursprünglichen Eingaben nicht lösen.',
      'Una sola unidad de umbral lineal no resuelve XOR con las dos entradas originales.',
    ),
    references: ['perceptron-course'],
    status: 'verified',
    editorialNotes:
      'Mathematical statement about the simplified demonstration, not every historical perceptron architecture.',
  },
  {
    id: 'hubel-wiesel-experiment',
    entityId: 'hubel-wiesel',
    claim: t(
      'The 1962 study investigated receptive fields in cat visual cortex.',
      'Die Studie von 1962 untersuchte rezeptive Felder im visuellen Kortex der Katze.',
      'El estudio de 1962 investigó campos receptivos en la corteza visual del gato.',
    ),
    references: ['hubel-wiesel-1962'],
    status: 'verified',
  },
  {
    id: 'hubel-wiesel-nobel',
    entityId: 'hubel-wiesel',
    claim: t(
      'Hubel and Wiesel jointly received one half of the 1981 Nobel Prize in Physiology or Medicine.',
      'Hubel und Wiesel erhielten gemeinsam die Hälfte des Nobelpreises für Physiologie oder Medizin von 1981.',
      'Hubel y Wiesel recibieron conjuntamente la mitad del Nobel de Fisiología o Medicina de 1981.',
    ),
    references: ['nobel-1981'],
    status: 'verified',
  },
  {
    id: 'neocognitron-inspiration',
    entityId: 'neocognitron',
    claim: t(
      'Fukushima explicitly related the Neocognitron to Hubel and Wiesel’s hierarchical model.',
      'Fukushima bezog das Neocognitron ausdrücklich auf Hubels und Wiesels hierarchisches Modell.',
      'Fukushima relacionó explícitamente el Neocognitrón con el modelo jerárquico de Hubel y Wiesel.',
    ),
    references: ['fukushima-1980'],
    status: 'verified',
  },
  {
    id: 'backprop-priority',
    entityId: 'backpropagation',
    claim: t(
      'Reverse-mode differentiation predates the 1986 Rumelhart, Hinton and Williams paper.',
      'Differentiation im Rückwärtsmodus ist älter als die Arbeit von Rumelhart, Hinton und Williams von 1986.',
      'La diferenciación inversa es anterior al artículo de Rumelhart, Hinton y Williams de 1986.',
    ),
    references: ['autodiff-history', 'rumelhart-1986'],
    status: 'verified',
  },
  {
    id: 'lenet-reference',
    entityId: 'lenet',
    claim: t(
      'The 1998 document-recognition paper describes LeNet-5 and gradient-based training.',
      'Der Artikel zur Dokumenterkennung von 1998 beschreibt LeNet-5 und gradientenbasiertes Training.',
      'El artículo de reconocimiento documental de 1998 describe LeNet-5 y entrenamiento con gradientes.',
    ),
    references: ['lecun-1998'],
    status: 'verified',
  },
  {
    id: 'imagenet-organization',
    entityId: 'imagenet',
    claim: t(
      'The 2009 ImageNet database uses WordNet structure and human verification of image labels.',
      'Die ImageNet-Datenbank von 2009 nutzt die WordNet-Struktur und menschliche Prüfung von Bildlabels.',
      'La base ImageNet de 2009 utiliza la estructura de WordNet y verificación humana de etiquetas.',
    ),
    references: ['imagenet-2009'],
    status: 'verified',
  },
  {
    id: 'alexnet-score',
    entityId: 'alexnet',
    claim: t(
      'The 2012 competition entry reported 15.3% top-five test error; the runner-up achieved 26.2%.',
      'Der Wettbewerbsbeitrag von 2012 berichtete 15,3 % Top-5-Testfehler; der Zweitplatzierte erreichte 26,2 %.',
      'La participación de 2012 registró un error top-5 del 15,3 %; el segundo puesto obtuvo el 26,2 %.',
    ),
    references: ['alexnet-2012'],
    status: 'verified',
    editorialNotes:
      'The winning competition entry combines multiple networks. Do not attribute 15.3% to a single network.',
  },
  {
    id: 'alexnet-architecture',
    entityId: 'alexnet',
    claim: t(
      'The core network architecture contains five convolutional and three fully connected layers.',
      'Die Kernarchitektur enthält fünf Faltungs- und drei vollständig verbundene Schichten.',
      'La arquitectura básica contiene cinco capas convolucionales y tres totalmente conectadas.',
    ),
    references: ['alexnet-2012'],
    status: 'verified',
  },
];
