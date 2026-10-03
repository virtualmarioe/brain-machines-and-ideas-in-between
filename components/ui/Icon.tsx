export function Icon({
  name,
  size = 18,
}: {
  name:
    | 'search'
    | 'arrow'
    | 'close'
    | 'sun'
    | 'moon'
    | 'network'
    | 'globe'
    | 'book'
    | 'external'
    | 'reset'
    | 'chevron';
  size?: number;
}) {
  const paths: Record<typeof name, string> = {
    search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    arrow: 'M4 12h16m-6-6 6 6-6 6',
    close: 'm6 6 12 12M6 18 18 6',
    sun: 'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
    moon: 'M20 15A9 9 0 0 1 9 3a9 9 0 1 0 11 12',
    network:
      'M6 6l12 2-7 11L6 6m0 0L2 14m9 5 11-2M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0m12 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-7 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
    globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M3 12h18M12 3c-5 5-5 13 0 18 5-5 5-13 0-18',
    book: 'M12 5v16M3 3l9 2 9-2v16l-9 2-9-2V3',
    external: 'M14 3h7v7m0-7L10 14M10 3H3v18h18v-7',
    reset: 'M3 10a9 9 0 1 1 1 8M3 3v7h7',
    chevron: 'm9 5 7 7-7 7',
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
export function AtlasMark() {
  return (
    <svg
      width="36"
      height="40"
      viewBox="0 0 36 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <path d="M18 34V18m0 3L7 12 5 3m2 9L2 9m16 9L28 9l3-7m-3 7 6 2M18 21 14 8l2-6m-2 6L9 4m9 22 12-7 4 1M18 30 7 23l-5 1m16 10-7 4m7-4 7 4" />
      <circle cx="18" cy="26" r="4" fill="currentColor" />
    </svg>
  );
}
