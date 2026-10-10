'use client';
import ComplexityControl from './exploration/ComplexityControl';
import {
  atComplexity,
  minimumComplexity,
  complexityLevels,
  levelStart,
  complexityCopy,
} from '@/lib/complexity';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { entities, relationships, references } from '@/content';
import { domains, relationLabels, t } from '@/content/translations/ui';
import { chronological, traverse, yearOf, displayYear, formatYear } from '@/lib/graph';
import { searchEntities } from '@/lib/search';
import { traceTargets, extendTrail } from '@/lib/traces';
import {
  explorationUrl,
  localeFromPath,
  parseExploration,
  type ExplorationState,
} from '@/lib/exploration';
import type { Domain, HistoricalEntity, HistoricalRelationship, Locale } from '@/types/history';
import IdeaGraph from './graph/IdeaGraph';
import WorldMap from './map/WorldMap';
import Timeline, { MAX_YEAR } from './timeline/Timeline';
import EntityPanel from './content/EntityPanel';
import ReferenceList from './content/ReferenceList';
import Modal from './ui/Modal';
import { AtlasMark, Icon } from './ui/Icon';
import { useTheme } from './theme/useTheme';
import { useCompactLayout } from './navigation/useCompactLayout';
import { usePageMetadata } from './navigation/usePageMetadata';
import { journeyText as journey } from '@/content/translations/journeys';
import SearchResults from './exploration/SearchResults';
import TraceJourney from './exploration/TraceJourney';
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
  const [focusPath, setFocusPath] = useState(true);
  const [theme, setTheme] = useTheme();
  const compact = useCompactLayout();
  const [demo, setDemo] = useState<HistoricalEntity['demo']>();
  const [edge, setEdge] = useState<HistoricalRelationship | null>(null);
  const locale = state.locale;
  const story = storyIds.filter((id) => entities.some((e) => e.id === id));
  const chapter = Math.max(0, story.indexOf(state.selected));
  useEffect(() => {
    const onPop = (event: PopStateEvent) => {
      const parts = window.location.pathname.split('/');
      const isTrace = parts[2] === 'trace';
      const route = entities.find(
        (e) => e.slug === (isTrace ? traceTargets[parts[3]] || parts[3] : parts[3]),
      );
      // Atlas entries share one interactive view. Handle their restoration before
      // the router can remount a stale route and overwrite a subsequent selection.
      const atlasPath = parts.length === 2 || Boolean(route);
      if (!event.state?.atlasNavigation || !atlasPath) return;
      event.stopImmediatePropagation();
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
    window.history.replaceState(
      { ...window.history.state, atlasNavigation: true },
      '',
      window.location.href,
    );
    window.addEventListener('popstate', onPop, true);
    return () => window.removeEventListener('popstate', onPop, true);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  function update(patch: Partial<ExplorationState>, push = false) {
    const next = { ...state, ...patch };
    if (state.mode === 'story' && story.includes(state.selected)) next.story = state.selected;
    const matching = searchEntities(entities, next.query, next.locale, references).filter(
      (e) =>
        atComplexity(e, next.level) &&
        (next.domain === 'all' || e.domain === next.domain) &&
        (next.category === 'all' || e.type === next.category) &&
        yearOf(e) >= next.from &&
        yearOf(e) <= next.to,
    );
    if (matching.length && !matching.some((e) => e.id === next.selected))
      next.selected = chronological(matching)[0].id;
    if (next.mode === 'story' && !story.includes(next.selected)) next.mode = 'explore';
    if (next.mode === 'story') next.story = next.selected;
    setState(next);
    const url = explorationUrl(next, entities);
    if (push) window.history.pushState({ atlasNavigation: true }, '', url);
    else window.history.replaceState({ atlasNavigation: true }, '', url);
  }
  function select(id: string) {
    const entity = entities.find((e) => e.id === id);
    if (!entity) return;
    update(
      {
        selected: id,
        level:
          complexityLevels[
            Math.max(
              complexityLevels.indexOf(state.level),
              complexityLevels.indexOf(minimumComplexity(entity)),
            )
          ],
        ...(state.mode === 'trace'
          ? {
              trail: extendTrail(
                state.trail?.length ? state.trail : [state.selected],
                id,
                relationships,
              ),
            }
          : {}),
        category: state.category === 'person' && entity.type !== 'person' ? 'all' : state.category,
        query: searchEntities([entity], state.query, locale, references).length ? state.query : '',
        domain: state.domain === 'all' || state.domain === entity.domain ? state.domain : 'all',
        from: Math.min(state.from, yearOf(entity)),
        to: Math.max(state.to, yearOf(entity)),
      },
      true,
    );
  }
  function switchMode(mode: ExplorationState['mode'], id = state.selected) {
    update(
      {
        mode,
        selected:
          mode === 'story'
            ? story.includes(state.story ?? '')
              ? state.story!
              : story.includes(id)
                ? id
                : story[0]
            : id,
        ...(mode === 'story' || mode === 'trace'
          ? {
              category: 'all',
              domain: 'all',
              query: '',
              from: levelStart(state.level),
              to: MAX_YEAR,
              scope: 'all',
            }
          : {}),
        ...(mode === 'trace' ? { trail: [id] } : {}),
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
          atComplexity(e, state.level) &&
          (state.domain === 'all' || e.domain === state.domain) &&
          (state.category === 'all' || e.type === state.category) &&
          yearOf(e) >= state.from &&
          yearOf(e) <= state.to,
      ),
    [state.level, state.query, state.domain, state.category, state.from, state.to, locale],
  );
  const selected = filtered.find((e) => e.id === state.selected) ?? filtered[0];
  usePageMetadata(locale, selected, state.mode);
  const trail = state.trail?.at(-1) === selected?.id ? state.trail : selected ? [selected.id] : [];
  const focusIds =
    state.mode === 'trace' && focusPath
      ? new Set(trail.length > 1 ? trail : [...traverse(selected?.id ?? '', relationships, 1)])
      : undefined;
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
      if (state.mode === 'trace') {
        for (const node of state.trail ?? []) path.add(node);
        for (const node of traverse(id, relationships, 1)) path.add(node);
      }
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
  }, [
    filtered,
    selected,
    state.scope,
    state.mode,
    state.context,
    state.category,
    state.trail,
    compact,
  ]);
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
      from: levelStart(state.level),
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
              from: levelStart(state.level),
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
              onClick={() => switchMode(mode)}
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
          <Link className="about-button" aria-label={t('about', locale)} href={`/${locale}/about`}>
            ?
          </Link>
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
                from: levelStart(state.level),
                to: MAX_YEAR,
              })
            }
          >
            {t('startStory', locale)}
            <Icon name="arrow" />
          </button>
        </section>
        <ComplexityControl
          level={state.level}
          locale={locale}
          onChange={(level) =>
            update(
              {
                level,
                from: levelStart(level),
                to: MAX_YEAR,
                scope: 'all',
                query: '',
                domain: 'all',
                category: 'all',
                mode: 'explore',
                trail: [],
              },
              true,
            )
          }
        />
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
          <section key="story" className="story-banner mode-guide" aria-labelledby="mode-title">
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
          <section key="trace" className="trace-banner mode-guide" aria-labelledby="mode-title">
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
              <select value={state.selected} onChange={(e) => switchMode('trace', e.target.value)}>
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
          <section key="explore" className="explore-banner mode-guide" aria-labelledby="mode-title">
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
        {selected && (
          <section className="journey-context" aria-label={journey.orientation[locale]}>
            <span>
              {t(state.mode, locale)} / {displayYear(selected)}
            </span>
            <strong>{selected.title[locale]}</strong>
            {state.mode !== 'trace' && (
              <button onClick={() => switchMode('trace')}>{journey.trace[locale]}</button>
            )}
            {state.mode === 'trace' && (
              <button onClick={() => switchMode('explore')}>{journey.explore[locale]}</button>
            )}
            {state.mode !== 'story' && state.story && (
              <button onClick={() => switchMode('story')}>{journey.resume[locale]}</button>
            )}
            <nav className="view-links" aria-label={journey.orientation[locale]}>
              <a
                href="#graph-view"
                onClick={() =>
                  document
                    .querySelector<HTMLDetailsElement>('#graph-view')
                    ?.setAttribute('open', '')
                }
              >
                {t('graph', locale)}
              </a>
              <a
                href="#map-view"
                onClick={() =>
                  document.querySelector<HTMLDetailsElement>('#map-view')?.setAttribute('open', '')
                }
              >
                {t('map', locale)}
              </a>
              <a href="#timeline-view">{t('timeline', locale)}</a>
            </nav>
          </section>
        )}
        {(state.query ||
          state.domain !== 'all' ||
          state.category !== 'all' ||
          state.from !== levelStart(state.level) ||
          state.to !== MAX_YEAR) && (
          <nav className="filter-summary" aria-label={journey.filters[locale]}>
            <strong>{journey.filters[locale]}</strong>
            {state.query && (
              <button
                aria-label={`${journey.remove[locale]}: ${state.query}`}
                onClick={() => update({ query: '' })}
              >
                {state.query} ×
              </button>
            )}
            {state.domain !== 'all' && (
              <button onClick={() => update({ domain: 'all' })}>
                {domains[state.domain][locale]} ×
              </button>
            )}
            {state.category !== 'all' && (
              <button onClick={() => update({ category: 'all' })}>{t('persons', locale)} ×</button>
            )}
            {(state.from !== levelStart(state.level) || state.to !== MAX_YEAR) && (
              <button onClick={() => update({ from: levelStart(state.level), to: MAX_YEAR })}>
                {formatYear(state.from)}–{formatYear(state.to)} ×
              </button>
            )}
            {filtered.length > 0 && <button onClick={resetFilters}>{journey.clear[locale]}</button>}
          </nav>
        )}
        {state.query.trim() && filtered.length > 0 && (
          <SearchResults
            results={filtered}
            locale={locale}
            onSelect={select}
            onTrace={(id) => switchMode('trace', id)}
            onQuery={(query) => update({ query, mode: 'explore' })}
          />
        )}
        {state.mode === 'trace' && selected && (
          <TraceJourney
            entity={selected}
            locale={locale}
            trail={trail}
            onSelect={select}
            onEdge={setEdge}
            focus={focusPath}
            onFocus={setFocusPath}
          />
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
                  {t('persons', locale)} (
                  {
                    entities.filter((e) => e.type === 'person' && atComplexity(e, state.level))
                      .length
                  }
                  )
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
                <small>{entities.filter((e) => atComplexity(e, state.level)).length}</small>
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
                  <small>
                    {
                      entities.filter((e) => e.domain === domain && atComplexity(e, state.level))
                        .length
                    }
                  </small>
                </button>
              ))}
            </div>
            <div className="sidebar-discoveries">
              <h2 className="eyebrow">{t('milestones', locale)}</h2>
              <div className="discovery-list">
                {(state.query ? filtered : chronological(filtered)).map((entity) => (
                  <button
                    key={entity.id}
                    className={`discovery-item domain-${entity.domain} ${selected?.id === entity.id ? 'selected' : ''}`}
                    aria-pressed={selected?.id === entity.id}
                    onClick={() => select(entity.id)}
                  >
                    <span className="discovery-date">{displayYear(entity)}</span>
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
                <details
                  id="graph-view"
                  className="visualization-frame"
                  open={compact ? undefined : true}
                >
                  <summary>
                    <Icon name="network" size={18} />
                    {t('graph', locale)}
                    <span>+</span>
                  </summary>
                  <IdeaGraph
                    focusIds={focusIds}
                    compact={compact}
                    entities={graphEntities}
                    relationships={graphEdges}
                    selected={selected.id}
                    locale={locale}
                    onSelect={select}
                    onEdge={setEdge}
                  />
                </details>
                <details
                  id="map-view"
                  className="visualization-frame"
                  open={compact ? undefined : true}
                >
                  <summary>
                    <Icon name="globe" size={18} />
                    {t('map', locale)}
                    <span>+</span>
                  </summary>
                  <WorldMap
                    onEdge={setEdge}
                    nobel={state.nobel}
                    entities={filtered}
                    relationships={relationships.filter(
                      (edge) =>
                        filtered.some((entity) => entity.id === edge.source) &&
                        filtered.some((entity) => entity.id === edge.target),
                    )}
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
              {state.level !== 'expert' && (
                <button
                  className="primary-button"
                  onClick={() => update({ level: 'expert', from: -400, to: MAX_YEAR }, true)}
                >
                  {complexityCopy[locale].names[2]} · {entities.length}{' '}
                  {complexityCopy[locale].nodes}
                </button>
              )}
              <button className="primary-button" onClick={resetFilters}>
                {t('clear', locale)}
              </button>
            </div>
          )}
        </div>
        <Timeline
          entities={searchEntities(entities, state.query, locale, references).filter(
            (e) =>
              atComplexity(e, state.level) &&
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
        <Link href={`/${locale}/about`}>
          {t('about', locale)} <Icon name="external" size={12} />
        </Link>
        <span>350 BCE → 2026</span>
      </footer>
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
