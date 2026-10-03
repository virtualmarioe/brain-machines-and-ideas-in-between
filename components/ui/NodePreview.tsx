'use client';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent, PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { domains, t } from '@/content/translations/ui';
import type { HistoricalEntity, Locale, LocationReference } from '@/types/history';
import './node-preview.css';

const labels = {
  place: { en: 'Research location', de: 'Forschungsort', es: 'Lugar de investigación' },
  institution: { en: 'Institution', de: 'Institution', es: 'Institución' },
  country: { en: 'Country', de: 'Land', es: 'País' },
  coordinates: {
    en: 'Approximate coordinates',
    de: 'Ungefähre Koordinaten',
    es: 'Coordenadas aproximadas',
  },
  year: { en: 'At this location', de: 'An diesem Ort', es: 'En este lugar' },
  hint: {
    en: 'Select the discovery to read more. Esc closes this preview.',
    de: 'Entdeckung für weitere Details auswählen. Esc schließt die Vorschau.',
    es: 'Selecciona el descubrimiento para leer más. Esc cierra esta vista previa.',
  },
};

const countryCodes: Record<string, string> = {
  'United States': 'US',
  'United Kingdom': 'GB',
  Canada: 'CA',
  Italy: 'IT',
  Spain: 'ES',
  Japan: 'JP',
  Switzerland: 'CH',
  Germany: 'DE',
  France: 'FR',
};

type PreviewItem = {
  entity: HistoricalEntity;
  location?: LocationReference;
  anchor: Element;
};

/** Shared hover and keyboard-focus behavior for SVG nodes. */
export function useNodePreview() {
  const id = useId();
  const [current, setCurrent] = useState<PreviewItem | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hovered = useRef<Element | null>(null);
  const focused = useRef<PreviewItem | null>(null);
  const overCard = useRef(false);

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }
  const dismiss = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
    setCurrent(null);
    overCard.current = false;
    hovered.current = null;
    focused.current = null;
  }, []);
  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      if (!hovered.current && !overCard.current) {
        const focus = focused.current;
        setCurrent(
          focus?.anchor.isConnected && focus.anchor === document.activeElement ? focus : null,
        );
      }
    }, 220);
  }
  function show(entity: HistoricalEntity, anchor: Element, location?: LocationReference) {
    cancelClose();
    setCurrent({ entity, anchor, location });
  }
  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );
  useEffect(() => {
    if (!current) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismiss();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, dismiss]);

  return {
    id,
    current,
    dismiss,
    cardProps: {
      onPointerEnter() {
        cancelClose();
        overCard.current = true;
      },
      onPointerLeave() {
        overCard.current = false;
        scheduleClose();
      },
    },
    nodeProps(entity: HistoricalEntity, location?: LocationReference) {
      return {
        'aria-describedby':
          current?.entity.id === entity.id && current.location === location ? id : undefined,
        onPointerEnter(event: PointerEvent<Element>) {
          if (event.pointerType === 'touch') return;
          hovered.current = event.currentTarget;
          show(entity, event.currentTarget, location);
        },
        onPointerLeave(event: PointerEvent<Element>) {
          if (hovered.current === event.currentTarget) hovered.current = null;
          scheduleClose();
        },
        onFocus(event: FocusEvent<Element>) {
          if (!event.currentTarget.matches(':focus-visible')) return;
          focused.current = { entity, anchor: event.currentTarget, location };
          show(entity, event.currentTarget, location);
        },
        onBlur(event: FocusEvent<Element>) {
          if (focused.current?.anchor === event.currentTarget) focused.current = null;
          scheduleClose();
        },
        onKeyDown(event: KeyboardEvent<Element>) {
          if (event.key === 'Escape') dismiss();
        },
      };
    },
  };
}

export function NodePreview({
  preview,
  locale,
}: {
  preview: ReturnType<typeof useNodePreview>;
  locale: Locale;
}) {
  const card = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 0, top: 0, ready: false });
  const current = preview.current;
  const dismiss = preview.dismiss;
  useEffect(() => {
    if (!current) return;
    let frame: number;
    // Nodes can move while focused, during panning, resizing, or scrolling.
    const update = () => {
      if (!current.anchor.isConnected) {
        dismiss();
        return;
      }
      if (card.current) {
        const anchor = current.anchor.getBoundingClientRect();
        const bounds = card.current.getBoundingClientRect();
        const viewport = window.visualViewport;
        const viewLeft = viewport?.offsetLeft ?? 0;
        const viewTop = viewport?.offsetTop ?? 0;
        const viewWidth = viewport?.width ?? window.innerWidth;
        const viewHeight = viewport?.height ?? window.innerHeight;
        const left = Math.max(
          viewLeft + 12,
          Math.min(
            anchor.left + anchor.width / 2 - bounds.width / 2,
            viewLeft + viewWidth - bounds.width - 12,
          ),
        );
        const below = anchor.bottom + 10;
        const top = Math.max(
          viewTop + 12,
          Math.min(
            below + bounds.height <= viewTop + viewHeight - 12
              ? below
              : anchor.top - bounds.height - 10,
            viewTop + viewHeight - bounds.height - 12,
          ),
        );
        setPosition((previous) =>
          previous.left === left && previous.top === top && previous.ready
            ? previous
            : { left, top, ready: true },
        );
      }
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [current, dismiss]);

  if (!current) return null;
  const { entity, location } = current;
  const country = location?.name.includes(',')
    ? location.name.split(',').at(-1)!.trim()
    : undefined;
  const countryName =
    country && countryCodes[country]
      ? new Intl.DisplayNames([locale], { type: 'region' }).of(countryCodes[country])
      : country;
  const coordinate = (value: number, axis: 'lat' | 'lon') =>
    `${Math.abs(value).toLocaleString(locale, { maximumFractionDigits: 2 })}° ${axis === 'lat' ? (value < 0 ? 'S' : 'N') : value < 0 ? (locale === 'es' ? 'O' : 'W') : locale === 'de' ? 'O' : 'E'}`;

  return createPortal(
    <div
      ref={card}
      id={preview.id}
      role="tooltip"
      className={`node-preview domain-${entity.domain}`}
      data-preview-for={entity.id}
      data-preview-kind={location ? 'map' : 'graph'}
      style={{
        left: position.left,
        top: position.top,
        visibility: position.ready ? 'visible' : 'hidden',
      }}
      {...preview.cardProps}
    >
      <div className="node-preview-meta">
        <span>{entity.startDate.slice(0, 4)}</span>
        <span>{domains[entity.domain][locale]}</span>
      </div>
      <h3>{entity.title[locale]}</h3>
      <p className="node-preview-description">{entity.shortDescription[locale]}</p>
      {location && (
        <dl className="node-preview-geography">
          <div>
            <dt>{labels.place[locale]}</dt>
            <dd>{location.name}</dd>
          </div>
          <div>
            <dt>{labels.institution[locale]}</dt>
            <dd>{location.institution}</dd>
          </div>
          {countryName && (
            <div>
              <dt>{labels.country[locale]}</dt>
              <dd>{countryName}</dd>
            </div>
          )}
          <div>
            <dt>{labels.coordinates[locale]}</dt>
            <dd>
              {coordinate(location.lat, 'lat')}, {coordinate(location.lon, 'lon')}
            </dd>
          </div>
          {location.year && (
            <div>
              <dt>{labels.year[locale]}</dt>
              <dd>{location.year}</dd>
            </div>
          )}
        </dl>
      )}
      {location && entity.editorialNotes && (
        <p className="node-preview-note">
          <strong>{t('editorialNote', locale)}: </strong>
          {entity.editorialNotes[locale]}
        </p>
      )}
      <p className="node-preview-hint">{labels.hint[locale]}</p>
    </div>,
    document.body,
  );
}
