import { atComplexity, minimumComplexity, levelStart, type Complexity } from './complexity';
import type { Domain, HistoricalEntity, Locale } from '@/types/history';
import { isLocale } from './i18n';
export interface ExplorationState {
  selected: string;
  level: Complexity;
  story?: string;
  trail?: string[];
  mode: 'explore' | 'story' | 'trace';
  query: string;
  domain: Domain | 'all';
  category: 'all' | 'person';
  from: number;
  to: number;
  scope: 'all' | '1' | '2' | 'ancestry';
  nobel: boolean;
  context: boolean;
  locale: Locale;
}
export function parseExploration(
  params: URLSearchParams,
  locale: Locale,
  entities: HistoricalEntity[],
  routeId?: string,
): ExplorationState {
  const requested = [routeId, params.get('node')]
    .map((id) => entities.find((e) => e.id === id))
    .find(Boolean);
  const rawLevel = params.get('level');
  const level: Complexity =
    rawLevel === 'connections' || rawLevel === 'expert' || rawLevel === 'essentials'
      ? rawLevel
      : requested
        ? minimumComplexity(requested)
        : 'essentials';
  const available = entities.filter((e) => atComplexity(e, level));
  const category = params.get('category') === 'person' ? 'person' : 'all';
  const candidates =
    category === 'person' ? available.filter((e) => e.type === 'person') : available;
  const selected =
    [routeId, params.get('node'), 'hubel-wiesel', candidates[0]?.id, entities[0]?.id].find((id) =>
      candidates.some((e) => e.id === id),
    ) ?? entities[0]?.id;
  const from = Number(params.get('from') ?? levelStart(level)),
    to = Number(params.get('to') ?? 2026);
  const validRange =
    params.get('from') !== '' &&
    Number.isFinite(from) &&
    Number.isFinite(to) &&
    from >= -400 &&
    to <= 2026 &&
    to - from >= 4;
  const mode = params.get('mode'),
    domain = params.get('domain'),
    scope = params.get('scope');
  return {
    selected,
    level,
    ...(entities.some((e) => e.id === params.get('story')) ? { story: params.get('story')! } : {}),
    ...(params.get('trail')
      ? {
          trail: [
            ...new Set(
              params
                .get('trail')!
                .split(',')
                .filter((id) => entities.some((e) => e.id === id)),
            ),
          ].slice(0, 35),
        }
      : {}),
    locale,
    category,
    mode: mode === 'story' || mode === 'trace' ? mode : 'explore',
    query: (params.get('q') || '').slice(0, 200),
    domain: ['neuroscience', 'mathematics', 'computing', 'learning', 'neuroai'].includes(
      domain || '',
    )
      ? (domain as Domain)
      : 'all',
    from: validRange ? Math.round(from) : levelStart(level),
    to: validRange ? Math.round(to) : 2026,
    scope: scope === '1' || scope === '2' || scope === 'ancestry' ? scope : 'all',
    nobel: params.get('nobel') === '1',
    context: params.get('context') === '1',
  };
}
export function explorationUrl(state: ExplorationState, entities: HistoricalEntity[]) {
  const entity = entities.find((e) => e.id === state.selected);
  const params = new URLSearchParams();
  if (state.level !== 'essentials') params.set('level', state.level);
  if (state.story) params.set('story', state.story);
  if (state.trail?.length) params.set('trail', state.trail.join(','));
  if (state.mode !== 'explore') params.set('mode', state.mode);
  if (state.query) params.set('q', state.query);
  if (state.category === 'person') params.set('category', 'person');
  if (state.domain !== 'all') params.set('domain', state.domain);
  if (state.from !== levelStart(state.level)) params.set('from', String(state.from));
  if (state.to !== 2026) params.set('to', String(state.to));
  if (state.scope !== 'all') params.set('scope', state.scope);
  if (state.nobel) params.set('nobel', '1');
  if (state.context) params.set('context', '1');
  return `/${state.locale}/${entity?.type || 'event'}/${entity?.slug || ''}${params.size ? '?' + params.toString() : ''}`;
}
export function localeFromPath(path: string): Locale {
  const segment = path.split('/')[1];
  return isLocale(segment) ? segment : 'en';
}
