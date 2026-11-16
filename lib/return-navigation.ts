import type { Locale } from '@/types/history';
export const returnKey = 'atlas-session-return';
/** Only same-site atlas routes are valid resume destinations. */
export function atlasReturn(raw: string | null, locale: Locale) {
  const fallback = `/${locale}`;
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return fallback;
  try {
    const url = new URL(raw, 'https://atlas.invalid');
    if (url.origin !== 'https://atlas.invalid') return fallback;
    const parts = url.pathname.split('/');
    if (!['en', 'de', 'es'].includes(parts[1])) return fallback;
    if (
      parts.length !== 2 &&
      !(
        parts.length === 4 &&
        /^[a-z-]+$/.test(parts[2]) &&
        /^[a-z0-9-]+$/.test(parts[3]) &&
        !['about', 'research'].includes(parts[2])
      )
    )
      return fallback;
    parts[1] = locale;
    return `${parts.join('/')}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
