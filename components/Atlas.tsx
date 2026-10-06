'use client';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { entities, relationships, references } from '@/content';
import { domains, relationLabels, t } from '@/content/translations/ui';
import { chronological, traverse, yearOf } from '@/lib/graph';
import { searchEntities } from '@/lib/search';
import { traceTargets } from '@/lib/traces';
import {
  explorationUrl,
  localeFromPath,
  parseExploration,
  type ExplorationState,
} from '@/lib/exploration';
import type { Domain, HistoricalEntity, HistoricalRelationship, Locale } from '@/types/history';
import IdeaGraph from './graph/IdeaGraph';
import WorldMap from './map/WorldMap';
import Timeline, { MAX_YEAR, MIN_YEAR } from './timeline/Timeline';
import EntityPanel from './content/EntityPanel';
import ReferenceList from './content/ReferenceList';
import Modal from './ui/Modal';
import { AtlasMark, Icon } from './ui/Icon';
import { useTheme } from './theme/useTheme';
import { useCompactLayout } from './navigation/useCompactLayout';
import { usePageMetadata } from './navigation/usePageMetadata';
const ScientificDemo = dynamic(() => import('./interactive/ScientificDemo'));
const storyIds = [
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
];
export default function Atlas({ initialState }: { initialState: ExplorationState }) {
  const [state, setState] = useState(initialState);
  const [theme, setTheme] = useTheme();
  const compact = useCompactLayout();
  const [dialog, setDialog] = useState<'about' | null>(null);
  const [demo, setDemo] = useState<HistoricalEntity['demo']>();
  const [edge, setEdge] = useState<HistoricalRelationship | null>(null);
  const locale = state.locale;
  const story = storyIds.filter((id) => entities.some((e) => e.id === id));
  const chapter = Math.max(0, story.indexOf(state.selected));
  useEffect(() => {
    const onPop = () => {
      const parts = window.location.pathname.split('/');
      const isTrace = parts[2] === 'trace';
      const route = entities.find(
        (e) => e.slug === (isTrace ? traceTargets[parts[3]] || parts[3] : parts[3]),
      );
      setState(
        parseExploration(
          new URLSearchParams(
            isTrace
              ? `${window.location.search.replace(/^\?/, '')}&mode=trace`
              : window.location.search,
          ),
          localeFromPath(window.location.pathname),
          entities,
          route?.id,
        ),
      );
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  function update(patch: Partial<ExplorationState>, push = false) {
    const next = { ...state, ...patch };
    const matching = searchEntities(entities, next.query, next.locale, references).filter(
      (e) =>
        (next.domain === 'all' || e.domain === next.domain) &&
        (next.category === 'all' || e.type === next.category) &&
        yearOf(e) >= next.from &&
        yearOf(e) <= next.to,
    );
    if (matching.length && !matching.some((e) => e.id === next.selected))
      next.selected = chronological(matching)[0].id;
    if (next.mode === 'story' && !story.includes(next.selected)) next.mode = 'explore';
    setState(next);
    const url = explorationUrl(next, entities);
    if (push) window.history.pushState(null, '', url);
    else window.history.replaceState(null, '', url);
  }
  function select(id: string) {
    const entity = entities.find((e) => e.id === id);
    if (!entity) return;
    update(
      {
        selected: id,
        category: state.category === 'person' && entity.type !== 'person' ? 'all' : state.category,
        query: searchEntities([entity], state.query, locale, references).length ? state.query : '',
        domain: state.domain === 'all' || state.domain === entity.domain ? state.domain : 'all',
        from: Math.min(state.from, yearOf(entity)),
        to: Math.max(state.to, yearOf(entity)),
      },
      true,
    );
  }
  function chooseTheme(value: string) {
    setTheme(value);
  }
  const filtered = useMemo(
    () =>
      searchEntities(entities, state.query, locale, references).filter(
        (e) =>
          (state.domain === 'all' || e.domain === state.domain) &&
          (state.category === 'all' || e.type === state.category) &&
          yearOf(e) >= state.from &&
          yearOf(e) <= state.to,
      ),
    [state.query, state.domain, state.category, state.from, state.to, locale],
  );
  const selected = filtered.find((e) => e.id === state.selected) ?? filtered[0];
  usePageMetadata(locale, selected, state.mode);
  const graphEntities = useMemo(() => {
    const id = selected?.id;
    if (!id) return [];
    if (state.mode === 'trace' || state.scope === 'ancestry') {
      const path = traverse(
        id,
        relationships.filter((r) => state.context || r.type !== 'historical-context'),
        Infinity,
        'before',
      );
      return filtered.filter((e) => path.has(e.id));
    }
    if (state.scope !== 'all' || (compact && state.category !== 'person')) {
      const path = traverse(
        id,
        relationships.filter((r) => state.context || r.type !== 'historical-context'),
        state.scope === 'all' ? 1 : Number(state.scope),
      );
      return filtered.filter((e) => path.has(e.id));
    }
    return filtered;
  }, [filtered, selected, state.scope, state.mode, state.context, state.category, compact]);
  const graphIds = new Set(graphEntities.map((e) => e.id));
  const graphEdges = relationships.filter(
    (r) =>
      graphIds.has(r.source) &&
      graphIds.has(r.target) &&
      (state.context || r.type !== 'historical-context'),
  );
  function resetFilters() {
    update({
      category: 'all',
      domain: 'all',
      query: '',
      from: MIN_YEAR,
      to: MAX_YEAR,
      scope: 'all',
    });
  }
  const readingPanel = selected ? (
    <EntityPanel
      key={selected.id}
      entity={selected}
      locale={locale}
      onSelect={select}
      onDemo={setDemo}
      nobel={state.nobel}
    />
  ) : null;
  return (
    <div className="atlas-shell" data-mode={state.mode}>
      <a href="#discoveries" className="skip-link">
        {t('skip', locale)}
      </a>
      <header className="site-header">
        <a
          className="brand"
          href={`/${locale}`}
          onClick={(event) => {
            event.preventDefault();
            update({
              mode: 'explore',
              category: 'all',
              domain: 'all',
              query: '',
              from: MIN_YEAR,
              to: MAX_YEAR,
              scope: 'all',
            });
          }}
        >
          <AtlasMark />
          <span>
            {t('brand', locale)}
            <small>{t('tagline', locale)}</small>
          </span>
        </a>
        <nav className="primary-nav" aria-label={t('modeNavigation', locale)}>
          {(['story', 'explore', 'trace'] as const).map((mode) => (
            <button
              key={mode}
              className={state.mode === mode ? 'active' : ''}
              aria-pressed={state.mode === mode}
              title={t(`${mode}Purpose`, locale)}
              onClick={() =>
                update({
                  mode,
                  ...(mode === 'story'
                    ? {
                        selected: story[0],
                        from: MIN_YEAR,
                        to: MAX_YEAR,
                        query: '',
                        category: 'all' as const,
                        domain: 'all' as const,
                        scope: 'all' as const,
                      }
                    : mode === 'trace'
                      ? {
                          category: 'all' as const,
                          query: '',
                          domain: 'all' as const,
                          from: MIN_YEAR,
                          to: MAX_YEAR,
                        }
                      : {}),
                })
              }
            >
              <Icon
                name={mode === 'story' ? 'book' : mode === 'trace' ? 'network' : 'globe'}
                size={18}
              />
              {t(mode, locale)}
            </button>
          ))}
        </nav>
        <div className="header-settings">
          <label className="language-select">
            <Icon name="globe" size={16} />
            <span className="sr-only">{t('language', locale)}</span>
            <select
              aria-label={t('language', locale)}
              value={locale}
              onChange={(e) => update({ locale: e.target.value as Locale })}
            >
              <option value="en">EN</option>
              <option value="de">DE</option>
              <option value="es">ES</option>
            </select>
          </label>
          <label className="theme-select">
            <span className="sr-only">{t('theme', locale)}</span>
            <select
              aria-label={t('theme', locale)}
              value={theme}
              onChange={(e) => chooseTheme(e.target.value)}
            >
              {(['system', 'light', 'dark'] as const).map((value) => (
                <option key={value} value={value}>
                  {t(value, locale)}
                </option>
              ))}
            </select>
          </label>
          <button
            className="about-button"
            aria-label={t('about', locale)}
            onClick={() => setDialog('about')}
          >
            ?
          </button>
        </div>
      </header>
      <main>
        <section className="intro">
          <div>
            <p className="eyebrow">{t('eyebrow', locale)}</p>
            <h1>{t('title', locale)}</h1>
            <p className="intro-copy">{t('introduction', locale)}</p>
          </div>
          <button
            className="story-start"
            onClick={() =>
              update({
                mode: 'story',
                selected: story[0],
                category: 'all',
                domain: 'all',
                query: '',
                from: MIN_YEAR,
                to: MAX_YEAR,
              })
            }
          >
            {t('startStory', locale)}
            <Icon name="arrow" />
          </button>
        </section>
        <div className="atlas-toolbar">
          <label className="search-field">
            <Icon name="search" />
            <input
              type="search"
              aria-label={t('searchLabel', locale)}
              placeholder={t('search', locale)}
              value={state.query}
              onChange={(e) => update({ query: e.target.value, mode: 'explore' })}
            />
          </label>
          <div className="toolbar-right">
            <span className="result-count" aria-live="polite">
              {filtered.length.toString().padStart(2, '0')} <span>{t('count', locale)}</span>
            </span>
            <label className="scope-select">
              <span className="sr-only">{t('scope', locale)}</span>
              <select
                aria-label={t('scope', locale)}
                value={state.scope}
                onChange={(e) => update({ scope: e.target.value as ExplorationState['scope'] })}
              >
                <option value="all">{t('everything', locale)}</option>
                <option value="1">{t('oneHop', locale)}</option>
                <option value="2">{t('twoHop', locale)}</option>
                <option value="ancestry">{t('ancestry', locale)}</option>
              </select>
            </label>
          </div>
        </div>
        {state.mode === 'story' && (
          <section className="story-banner mode-guide" aria-labelledby="mode-title">
            <div>
              <p className="mode-purpose">
                <Icon name="book" />
                {t('storyPurpose', locale)}
              </p>
              <span className="eyebrow">
                {t('chapter', locale)} {String(chapter + 1).padStart(2, '0')} / {story.length}
              </span>
              <h2 id="mode-title">{t('storyTitle', locale)}</h2>
              <p className="mode-description">{t('storyHelp', locale)}</p>
            </div>
            <div className="story-chapter-controls">
              <progress
                className="story-progress"
                max={story.length}
                value={chapter + 1}
                aria-label={t('chapter', locale)}
              />
              <div className="story-pagination">
                <button
                  disabled={chapter === 0}
                  onClick={() => select(story[chapter - 1])}
                  aria-label={t('previous', locale)}
                >
                  ←
                </button>
                <span>{entities.find((e) => e.id === story[chapter])?.title[locale]}</span>
                <button
                  disabled={chapter === story.length - 1}
                  onClick={() => select(story[chapter + 1])}
                >
                  {t('next', locale)} <Icon name="arrow" size={16} />
                </button>
              </div>
            </div>
          </section>
        )}
        {state.mode === 'trace' && (
          <section className="trace-banner mode-guide" aria-labelledby="mode-title">
            <div>
              <p className="mode-purpose">
                <Icon name="network" />
                {t('tracePurpose', locale)}
              </p>
              <h2 id="mode-title">{t('traceTitle', locale)}</h2>
              <p>{t('traceHelp', locale)}</p>
            </div>
            <label>
              {t('traceTarget', locale)}
              <select value={state.selected} onChange={(e) => select(e.target.value)}>
                {chronological(entities).map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title[locale]}
                  </option>
                ))}
              </select>
            </label>
          </section>
        )}
        {state.mode === 'explore' && (
          <section className="explore-banner mode-guide" aria-labelledby="mode-title">
            <div>
              <p className="mode-purpose">
                <Icon name="globe" />
                {t('explorePurpose', locale)}
              </p>
              <h2 id="mode-title">{t('exploreTitle', locale)}</h2>
              <p className="mode-description">{t('exploreHelp', locale)}</p>
            </div>
            <ol className="explore-steps">
              <li>{t('exploreSelect', locale)}</li>
              <li>{t('exploreConnect', locale)}</li>
              <li>{t('exploreEvidence', locale)}</li>
            </ol>
          </section>
        )}
        <div className="atlas-workspace" id="discoveries">
          <aside className="discovery-sidebar">
            <div className="node-category">
              <label htmlFor="node-category">{t('nodeCategory', locale)}</label>
              <select
                id="node-category"
                value={state.category}
                onChange={(event) =>
                  update({
                    category: event.target.value as ExplorationState['category'],
                    scope: 'all',
                    mode: 'explore',
                  })
                }
              >
                <option value="all">{t('allDiscoveries', locale)}</option>
                <option value="person">
                  {t('persons', locale)} ({entities.filter((e) => e.type === 'person').length})
                </option>
              </select>
              {state.category === 'person' && <p>{t('personDates', locale)}</p>}
            </div>
            <div className="domain-filters">
              <h2 className="eyebrow">{t('domains', locale)}</h2>
              <button
                aria-pressed={state.domain === 'all'}
                className={state.domain === 'all' ? 'active' : ''}
                onClick={() => update({ domain: 'all' })}
              >
                <span className="all-dot">◉</span>
                {t('all', locale)}
                <small>{entities.length}</small>
              </button>
              {Object.entries(domains).map(([domain, label]) => (
                <button
                  key={domain}
                  className={`domain-${domain} ${state.domain === domain ? 'active' : ''}`}
                  aria-pressed={state.domain === domain}
                  onClick={() => update({ domain: domain as Domain })}
                >
                  <i />
                  {label[locale]}
                  <small>{entities.filter((e) => e.domain === domain).length}</small>
                </button>
              ))}
            </div>
            <div className="sidebar-discoveries">
              <h2 className="eyebrow">{t('milestones', locale)}</h2>
              <div className="discovery-list">
                {chronological(filtered).map((entity) => (
                  <button
                    key={entity.id}
                    className={`discovery-item domain-${entity.domain} ${selected?.id === entity.id ? 'selected' : ''}`}
                    aria-pressed={selected?.id === entity.id}
                    onClick={() => select(entity.id)}
                  >
                    <span className="discovery-date">{yearOf(entity)}</span>
                    <span>{entity.title[locale]}</span>
                    <i />
                  </button>
                ))}
              </div>
            </div>
            <div className="layer-controls">
              <h2 className="eyebrow">{t('layers', locale)}</h2>
              <label>
                <input
                  type="checkbox"
                  checked={state.nobel}
                  onChange={(e) => update({ nobel: e.target.checked })}
                />
                <span>◇ {t('nobel', locale)}</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={state.context}
                  onChange={(e) => update({ context: e.target.checked })}
                />
                <span>↝ {t('context', locale)}</span>
              </label>
            </div>
          </aside>
          {filtered.length > 0 && selected ? (
            <>
              {state.mode === 'story' && readingPanel}
              <div className="visualization-column">
                <details className="visualization-frame" open={compact ? undefined : true}>
                  <summary>
                    <Icon name="network" size={18} />
                    {t('graph', locale)}
                    <span>+</span>
                  </summary>
                  <IdeaGraph
                    compact={compact}
                    entities={graphEntities}
                    relationships={graphEdges}
                    selected={selected.id}
                    locale={locale}
                    onSelect={select}
                    onEdge={setEdge}
                  />
                </details>
                <details className="visualization-frame" open={compact ? undefined : true}>
                  <summary>
                    <Icon name="globe" size={18} />
                    {t('map', locale)}
                    <span>+</span>
                  </summary>
                  <WorldMap
                    onEdge={setEdge}
                    nobel={state.nobel}
                    entities={graphEntities}
                    relationships={graphEdges}
                    selected={selected.id}
                    locale={locale}
                    onSelect={select}
                  />
                </details>
              </div>
              {state.mode !== 'story' && readingPanel}
            </>
          ) : (
            <div className="empty-state">
              <Icon name="search" size={32} />
              <h2>{t('noResults', locale)}</h2>
              <p>{t('emptyTimeline', locale)}</p>
              <button className="primary-button" onClick={resetFilters}>
                {t('clear', locale)}
              </button>
            </div>
          )}
        </div>
        <Timeline
          entities={searchEntities(entities, state.query, locale, references).filter(
            (e) =>
              (state.domain === 'all' || e.domain === state.domain) &&
              (state.category === 'all' || e.type === state.category),
          )}
          selected={selected?.id || ''}
          range={[state.from, state.to]}
          onRange={(range) => update({ from: range[0], to: range[1] })}
          onSelect={select}
          locale={locale}
          nobel={state.nobel}
        />
        <section className="open-question">
          <div>
            <span className="eyebrow">NEUROAI / ∞</span>
            <h2>{t('openQuestions', locale)}</h2>
          </div>
          <p>{t('question', locale)}</p>
        </section>
      </main>
      <footer>
        <span>{t('footer', locale)}</span>
        <button onClick={() => setDialog('about')}>
          {t('about', locale)} <Icon name="external" size={12} />
        </button>
        <span>1873 → 2026</span>
      </footer>
      {dialog && (
        <Modal title={t('about', locale)} locale={locale} onClose={() => setDialog(null)}>
          <p>{t('aboutText', locale)}</p>
          <p>{t('nobelNote', locale)}</p>
          <p className="muted">
            {t('map', locale)}: Natural Earth, {t('publicDomain', locale)}.{' '}
            <a
              href="https://www.naturalearthdata.com/about/terms-of-use/"
              target="_blank"
              rel="noreferrer"
            >
              Natural Earth
            </a>
          </p>
        </Modal>
      )}
      {demo && (
        <Modal
          title={t('experiment', locale)}
          locale={locale}
          onClose={() => setDemo(undefined)}
          wide
        >
          <ScientificDemo kind={demo} locale={locale} />
        </Modal>
      )}
      {edge && (
        <Modal title={t('connection', locale)} locale={locale} onClose={() => setEdge(null)}>
          <span className="eyebrow">{relationLabels[edge.type][locale]}</span>
          <h3>
            {entities.find((e) => e.id === edge.source)?.title[locale]} →{' '}
            {entities.find((e) => e.id === edge.target)?.title[locale]}
          </h3>
          <p>{edge.description[locale]}</p>
          <p className="evidence-confidence">
            {t('confidence', locale)}: {t(edge.confidence, locale)}
          </p>
          {edge.disputed && <p className="editorial-note">{t('disputed', locale)}</p>}
          <ReferenceList ids={edge.evidence} locale={locale} />
        </Modal>
      )}
    </div>
  );
}
