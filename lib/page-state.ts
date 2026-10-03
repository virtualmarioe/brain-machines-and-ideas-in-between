import { entities } from '@/content';
import { parseExploration } from '@/lib/exploration';
import type { Locale } from '@/types/history';
export function pageState(
  locale: Locale,
  search: Record<string, string | string[] | undefined>,
  id?: string,
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(search))
    if (typeof value === 'string') params.set(key, value);
  return parseExploration(params, locale, entities, id);
}
