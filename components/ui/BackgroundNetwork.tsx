'use client';
import { useState, type CSSProperties } from 'react';
import { categorical } from '@/lib/colors';

const colors = Object.values(categorical);

const points = Array.from({ length: 48 }, (_, i) => ({
  x: (i % 8) * 175 + 35 + Math.sin(i * 7) * 48,
  y: Math.floor(i / 8) * 180 + 25 + Math.cos(i * 11) * 48,
}));
const labels = {
  en: ['Pause background motion', 'Resume background motion'],
  de: ['Hintergrundbewegung pausieren', 'Hintergrundbewegung fortsetzen'],
  es: ['Pausar movimiento del fondo', 'Reanudar movimiento del fondo'],
};
export default function BackgroundNetwork({ locale }: { locale: string }) {
  const [paused, setPaused] = useState(false);
  const copy = labels[locale as keyof typeof labels] ?? labels.en;
  return (
    <>
      <div className="background-network" aria-hidden="true" data-paused={paused}>
        <svg viewBox="0 0 1300 1000" preserveAspectRatio="xMidYMid slice" focusable="false">
          <g className="network-drift">
            {points.flatMap((a, i) =>
              points
                .slice(i + 1)
                .map((b, offset) =>
                  Math.hypot(a.x - b.x, a.y - b.y) < 240 ? (
                    <line key={`${i}-${offset}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                  ) : null,
                ),
            )}
            {points.map((p, i) => (
              <g
                key={i}
                className="network-node"
                transform={`translate(${p.x} ${p.y})`}
                style={
                  {
                    color: colors[i % colors.length],
                    '--pulse-duration': `${48 + ((i * 7) % 29)}s`,
                    '--pulse-delay': `${-((i * 19.37) % (48 + ((i * 7) % 29)))}s`,
                  } as CSSProperties
                }
              >
                <circle className="network-node-ring" r={(i % 5 === 0 ? 3.5 : 2) * 3.3} />
                <circle className="network-node-core" r={(i % 5 === 0 ? 3.5 : 2) * 1.5} />
              </g>
            ))}
          </g>
        </svg>
      </div>
      <button
        className="background-motion-toggle"
        onClick={() => setPaused(!paused)}
        aria-label={copy[paused ? 1 : 0]}
        title={copy[paused ? 1 : 0]}
      >
        <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span>
      </button>
    </>
  );
}
