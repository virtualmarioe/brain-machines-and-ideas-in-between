export const locales = ['en', 'de', 'es'] as const;
export type Locale = (typeof locales)[number];
export type LocalizedText = Record<Locale, string>;
export type EntityType =
  | 'person'
  | 'concept'
  | 'publication'
  | 'experiment'
  | 'institution'
  | 'location'
  | 'dataset'
  | 'algorithm'
  | 'architecture'
  | 'technology'
  | 'event'
  | 'field'
  | 'award';
export type Domain = 'neuroscience' | 'mathematics' | 'computing' | 'learning' | 'neuroai';
export type RelationshipType =
  | 'direct-inspiration'
  | 'mathematical-formalization'
  | 'biological-inspiration'
  | 'methodological-enabler'
  | 'implementation'
  | 'dataset-dependency'
  | 'conceptual-analogy'
  | 'historical-context'
  | 'extension'
  | 'challenge';
export interface Reference {
  id: string;
  type: 'paper' | 'book' | 'archive' | 'website' | 'nobel' | 'review';
  title: string;
  authors: string[];
  year: number;
  url: string;
  doi?: string;
  accessedAt: string;
  yearKind?: 'publication' | 'award' | 'access';
  notes?: string;
}
export interface LocationReference {
  name: string;
  institution: string;
  lat: number;
  lon: number;
  year?: number;
}
export interface MediaAsset {
  id: string;
  type: 'image' | 'diagram';
  src: string;
  alt: LocalizedText;
  caption: LocalizedText;
  creator: string;
  sourceUrl?: string;
  license: 'public-domain' | 'cc0' | 'cc-by' | 'cc-by-sa' | 'custom' | 'unknown';
  attribution?: string;
}
export const conceptDemoKinds = [
  'staining',
  'logic',
  'hebbian',
  'tape',
  'stored-program',
  'entropy',
  'feedback',
  'symbolic',
  'xor',
  'memory',
  'sampling',
  'planning',
  'reward',
  'prediction',
  'attention',
  'masking',
  'geometry',
  'transfer',
  'membrane',
] as const;
export type ConceptDemoKind = (typeof conceptDemoKinds)[number];
export const distinctKinds = [
  'arbor',
  'synapse',
  'orientation',
  'sharing',
  'rectifier',
  'digits',
  'q-update',
  'surprise',
  'replay',
  'tree-search',
  'representations',
] as const;
export type DistinctKind = (typeof distinctKinds)[number];
export const demoKinds = [
  'perceptron',
  'convolution',
  'backpropagation',
  ...conceptDemoKinds,
  ...distinctKinds,
] as const;
export type DemoKind = (typeof demoKinds)[number];

export interface HistoricalEntity {
  id: string;
  slug: string;
  type: EntityType;
  title: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  technical: LocalizedText;
  startDate: string;
  endDate?: string;
  domain: Domain;
  locations: LocationReference[];
  people: string[];
  references: string[];
  tags: string[];
  status: 'verified' | 'needs-review' | 'historically-disputed';
  research?: { originalLanguage: 'en'; dateLabel: string; catalogId: string };
  editorialNotes?: LocalizedText;
  media?: MediaAsset[];
  demo?: DemoKind;
  nobel?: { year: number; reference: string; label: LocalizedText };
}
export interface HistoricalRelationship {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  description: LocalizedText;
  evidence: string[];
  confidence: 'high' | 'medium' | 'low';
  disputed?: boolean;
}
export interface Claim {
  id: string;
  entityId: string;
  claim: LocalizedText;
  references: string[];
  status: 'verified' | 'needs-review' | 'disputed';
  editorialNotes?: string;
}
