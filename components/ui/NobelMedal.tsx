import { useId } from 'react';

/** Photograph of George D. Snell's Nobel medal, from The Jackson Laboratory archive. */
export default function NobelMedal({ size = 22, x, y }: { size?: number; x?: number; y?: number }) {
  const clip = useId().replaceAll(':', '');
  const diameter = size * 0.7;
  return (
    <svg
      className="nobel-medal"
      width={diameter}
      height={diameter}
      x={x}
      y={y}
      viewBox="32 24 328 328"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clip}>
          <circle cx="196" cy="188" r="164" />
        </clipPath>
        <linearGradient id={`${clip}-glint`}>
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff8dc" stopOpacity=".3" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <image
        href="/images/nobel-medal-front.jpg"
        width="400"
        height="381"
        clipPath={`url(#${clip})`}
      />
      <g clipPath={`url(#${clip})`}>
        <g className="nobel-medal-glint">
          <path d="M-130 24H-70L30 352H-30Z" fill={`url(#${clip}-glint)`} />
        </g>
      </g>
    </svg>
  );
}
