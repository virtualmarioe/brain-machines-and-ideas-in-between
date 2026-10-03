'use client';
import { useSyncExternalStore } from 'react';
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('atlas-theme-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('atlas-theme-change', callback);
  };
}
function snapshot() {
  try {
    const value = localStorage.getItem('atlas-theme');
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
}
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, snapshot, () => 'system');
  function setTheme(value: string) {
    try {
      localStorage.setItem('atlas-theme', value);
    } catch {}
    document.documentElement.dataset.theme = value;
    window.dispatchEvent(new Event('atlas-theme-change'));
  }
  return [theme, setTheme] as const;
}
