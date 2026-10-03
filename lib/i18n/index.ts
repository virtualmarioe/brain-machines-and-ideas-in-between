import { locales, type Locale } from '@/types/history';
export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
