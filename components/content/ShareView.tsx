'use client';
import { useState } from 'react';
import { siteCopy as copy } from '@/content/translations/site-experience';
import type { Locale } from '@/types/history';
export default function ShareView({ locale }: { locale: Locale }) {
  const [result, setResult] = useState<'copied' | 'copyFailed' | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className="share-view">
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setResult(null);
          try {
            await navigator.clipboard.writeText(window.location.href);
            setResult('copied');
          } catch {
            setResult('copyFailed');
          } finally {
            setBusy(false);
          }
        }}
      >
        {copy.share[locale]} ↗
      </button>
      <span role="status">{result ? copy[result][locale] : ''}</span>
    </div>
  );
}
