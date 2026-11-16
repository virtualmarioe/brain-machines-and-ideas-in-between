'use client';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { useTheme } from '@/components/theme/useTheme';
import { AtlasMark } from '@/components/ui/Icon';
import { t } from '@/content/translations/ui';
import { complexityCopy } from '@/lib/complexity';
import { siteCopy as copy } from '@/content/translations/site-experience';
import { atlasReturn, returnKey } from '@/lib/return-navigation';
import type { Locale } from '@/types/history';
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}
function snapshot() {
  try {
    return sessionStorage.getItem(returnKey);
  } catch {
    return null;
  }
}
export function ResumeLink({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const saved = useSyncExternalStore(subscribe, snapshot, () => null);
  return <Link href={atlasReturn(saved, locale)}>{children}</Link>;
}
export default function SectionHeader({
  locale,
  section,
}: {
  locale: Locale;
  section: 'about' | 'research';
}) {
  const [theme, setTheme] = useTheme();
  const saved = useSyncExternalStore(subscribe, snapshot, () => null);
  return (
    <header className="section-header">
      <Link className="section-brand" href={atlasReturn(saved, locale)}>
        <AtlasMark />
        <span>{t('brand', locale)}</span>
      </Link>
      <nav aria-label={copy.navigate[locale]}>
        <Link href={atlasReturn(saved, locale)}>{copy.resume[locale]} →</Link>
        <Link
          href={`/${locale}/research`}
          aria-current={section === 'research' ? 'page' : undefined}
        >
          {complexityCopy[locale].research}
        </Link>
        <Link href={`/${locale}/about`} aria-current={section === 'about' ? 'page' : undefined}>
          {t('about', locale)}
        </Link>
      </nav>
      <div className="section-settings">
        <nav aria-label={t('language', locale)}>
          {(['en', 'de', 'es'] as const).map((language) => (
            <Link
              key={language}
              href={`/${language}/${section}`}
              lang={language}
              aria-current={language === locale ? 'true' : undefined}
            >
              {{ en: 'English', de: 'Deutsch', es: 'Español' }[language]}
            </Link>
          ))}
        </nav>
        <label>
          <span className="sr-only">{t('theme', locale)}</span>
          <select value={theme} onChange={(event) => setTheme(event.target.value)}>
            {(['system', 'light', 'dark'] as const).map((value) => (
              <option key={value} value={value}>
                {t(value, locale)}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}
