import type { HistoricalEntity } from '@/types/history';
export const complexityLevels = ['essentials', 'connections', 'expert'] as const;
export type Complexity = (typeof complexityLevels)[number];
const essentials = new Set([
  'golgi',
  'cajal',
  'neuron-doctrine',
  'mcculloch-pitts',
  'perceptron',
  'hubel-wiesel',
  'neocognitron',
  'backpropagation',
  'lenet',
  'imagenet',
  'alexnet',
  'neuroai',
  'turing',
  'hebb',
  'shannon',
  'cybernetics',
  'transformers',
  'foundation-models',
  'bayesian-inference',
  'boolean-algebra',
]);
const connections = new Set([
  'probability-theory',
  'analytical-engine',
  'lovelace-algorithmic-programming',
  'feedback-control',
  'predicate-logic',
  'markov-chains',
  'incompleteness',
  'lambda-calculus',
  'church-turing-thesis',
  'game-theory',
  'turing-test',
  'logic-theorist',
  'expert-systems',
  'bayesian-networks',
  'reinforcement-learning',
  'lstm',
  'neural-attention',
  'vae',
  'gan',
  'diffusion-models',
  'rlhf',
  'rag',
]);
export function minimumComplexity(entity: HistoricalEntity): Complexity {
  return essentials.has(entity.id)
    ? 'essentials'
    : !entity.research || connections.has(entity.id)
      ? 'connections'
      : 'expert';
}
export function atComplexity(entity: HistoricalEntity, level: Complexity = 'essentials') {
  return complexityLevels.indexOf(minimumComplexity(entity)) <= complexityLevels.indexOf(level);
}
export function levelStart(level: Complexity) {
  return level === 'expert' ? -400 : 1650;
}
export const complexityCopy = {
  en: {
    title: 'Atlas complexity',
    intro: 'Start small. Each level includes the one before it.',
    names: ['Essentials', 'Connections', 'Expert'],
    descriptions: [
      'A guided foundation for beginners and curious minds.',
      'More branches across disciplines for deeper exploration.',
      'The complete catalog, including research awaiting verification.',
    ],
    nodes: 'nodes',
    research: 'Research catalog',
    notice: 'Imported research: English original, pending source verification.',
  },
  de: {
    title: 'Komplexität des Atlas',
    intro: 'Klein anfangen. Jede Stufe enthält die vorherige.',
    names: ['Grundlagen', 'Verbindungen', 'Experten'],
    descriptions: [
      'Ein Einstieg für Neugierige und Anfänger.',
      'Weitere Zweige zwischen den Disziplinen erkunden.',
      'Der vollständige Katalog, einschließlich noch zu prüfender Forschung.',
    ],
    nodes: 'Knoten',
    research: 'Forschungskatalog',
    notice: 'Importierte Forschung: englisches Original, Quellenprüfung ausstehend.',
  },
  es: {
    title: 'Complejidad del atlas',
    intro: 'Empieza con poco. Cada nivel incluye el anterior.',
    names: ['Esencial', 'Conexiones', 'Experto'],
    descriptions: [
      'Una introducción para principiantes y personas curiosas.',
      'Más ramas entre disciplinas para profundizar.',
      'El catálogo completo, incluida investigación pendiente de verificación.',
    ],
    nodes: 'nodos',
    research: 'Catálogo de investigación',
    notice: 'Investigación importada: original en inglés, pendiente de verificar las fuentes.',
  },
};
