'use client';
import { useEffect, type RefObject } from 'react';

/** Animate SVG geometry directly without rerendering the map on every frame. */
export function useConnectionAnimation(
  ref: RefObject<SVGSVGElement | null>,
  sequence: string,
  enabled: boolean,
) {
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const trails = Array.from(svg.querySelectorAll<SVGPathElement>('.map-connection-trail'));
    const heads = Array.from(svg.querySelectorAll<SVGCircleElement>('.map-connection-head'));
    let frame = 0;
    let elapsed = 0;
    let last = 0;
    let visible = true;
    const flight = 1100;
    const interval = 650;
    const finish = Math.max(0, trails.length - 1) * interval + flight;
    const cycle = finish + 2500 + 1200;
    const staticView = () =>
      trails.forEach((path, i) => {
        path.style.strokeDasharray = '';
        path.style.strokeDashoffset = '';
        path.style.opacity = '';
        heads[i].style.opacity = '0';
      });
    const tick = (now: number) => {
      if (last && visible && !document.hidden) elapsed += Math.min(now - last, 100);
      last = now;
      if (!visible || document.hidden) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const time = elapsed % cycle;
      const fade = 1 - Math.max(0, (time - finish - 2500) / 1200);
      trails.forEach((path, i) => {
        const progress = Math.max(0, Math.min(1, (time - i * interval) / flight));
        path.style.strokeDasharray = '1';
        path.style.strokeDashoffset = String(1 - progress);
        path.style.opacity = String(progress === 0 ? 0 : 0.65 * fade);
        const head = heads[i];
        head.style.opacity = progress > 0 && progress < 1 ? '1' : '0';
        if (progress > 0 && progress < 1) {
          const point = path.getPointAtLength(path.getTotalLength() * progress);
          head.setAttribute('cx', String(point.x));
          head.setAttribute('cy', String(point.y));
        }
      });
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      staticView();
      last = 0;
      if (enabled && !motion.matches && trails.length) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(svg);
    motion.addEventListener('change', start);
    start();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener('change', start);
      staticView();
    };
  }, [ref, sequence, enabled]);
}
