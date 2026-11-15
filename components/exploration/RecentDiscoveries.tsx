'use client';
import { useSyncExternalStore } from 'react';
import { entities } from '@/content';
import { experienceCopy as copy } from '@/content/translations/experience';
import type { Locale } from '@/types/history';
const key = 'atlas-recent-discoveries';
const eventName = 'atlas-recent-changed';
function snapshot() {
  try {
    return localStorage.getItem(key) || '[]';
  } catch {
    return '[]';
  }
}
function subscribe(callback: () => void) {
  window.addEventListener(eventName, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(eventName, callback);
    window.removeEventListener('storage', callback);
  };
}
export function recentIds(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? [
          ...new Set(
            parsed.filter(
              (id): id is string =>
                typeof id === 'string' && entities.some((entity) => entity.id === id),
            ),
          ),
        ].slice(0, 6)
      : [];
  } catch {
    return [];
  }
}
export function rememberDiscovery(id: string) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify([id, ...recentIds(snapshot()).filter((item) => item !== id)].slice(0, 6)),
    );
    window.dispatchEvent(new Event(eventName));
  } catch {
    /* Reading remains available without storage. */
  }
}
export default function RecentDiscoveries({
  locale,
  selected,
  onSelect,
}: {
  locale: Locale;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => '[]');
  const ids = recentIds(raw)
    .filter((id) => id !== selected)
    .slice(0, 5);
  if (!ids.length) return null;
  return (
    <details className="recent-discoveries">
      <summary>
        {copy.recent[locale]} · {ids.length}
      </summary>
      <nav aria-label={copy.recent[locale]}>
        {ids.map((id) => (
          <button key={id} onClick={() => onSelect(id)}>
            {entities.find((entity) => entity.id === id)!.title[locale]}
          </button>
        ))}
      </nav>
      <p>
        {copy.local[locale]}{' '}
        <button
          onClick={() => {
            try {
              localStorage.removeItem(key);
              window.dispatchEvent(new Event(eventName));
            } catch {
              /* Storage is optional. */
            }
          }}
        >
          {copy.clear[locale]}
        </button>
      </p>
    </details>
  );
}
