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
    const rings = trails.map((path) =>
      Array.from(path.parentElement!.querySelectorAll<SVGCircleElement>('.map-arrival-ring')),
    );
    let frame = 0;
    let elapsed = 0;
    let last = 0;
    let visible = true;
    const flight = 1100;
    const arrival = 2100; // Three 1500ms rings, staggered by 300ms.
    const interval = flight + arrival;
    const finish = Math.max(0, trails.length - 1) * interval + flight + arrival;
    const cycle = finish + 2500 + 1200;
    const resetNodes = () => {
      svg.querySelectorAll<SVGCircleElement>('.map-node-border').forEach((node) => {
        node.style.stroke = '';
        node.style.fill = '';
        node.style.strokeWidth = '';
      });
    };
    const staticView = () => {
      resetNodes();
      trails.forEach((path, i) => {
        path.style.strokeDasharray = '';
        path.style.strokeDashoffset = '';
        path.style.opacity = '';
        heads[i].style.opacity = '0';
        rings[i].forEach((ring) => {
          ring.style.opacity = '0';
        });
      });
    };
    const tick = (now: number) => {
      if (last && visible && !document.hidden) elapsed += Math.min(now - last, 100) * 0.7;
      last = now;
      if (!visible || document.hidden) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const time = elapsed % cycle;
      const fade = 1 - Math.max(0, (time - finish - 2500) / 1200);
      resetNodes();
      trails.forEach((path, i) => {
        const progress = Math.max(0, Math.min(1, (time - i * interval) / flight));
        path.style.strokeDasharray = '1';
        path.style.strokeDashoffset = String(1 - progress);
        path.style.opacity = String(progress === 0 ? 0 : 0.65 * fade);
        const arrivalAge = time - i * interval - flight;
        if (arrivalAge >= 0 && arrivalAge < arrival) {
          const strength = 1 - arrivalAge / arrival;
          const target = path.parentElement!.dataset.target;
          const color = getComputedStyle(path).stroke;
          svg.querySelectorAll<SVGGElement>('[data-entities]').forEach((marker) => {
            if (!marker.dataset.entities?.split(' ').includes(target ?? '')) return;
            const node = marker.querySelector<SVGCircleElement>('.map-node-border');
            if (!node) return;
            node.style.stroke = `color-mix(in srgb, ${color} ${strength * 100}%, var(--neutral-secondary))`;
            node.style.fill = `color-mix(in srgb, ${color} ${strength * 40}%, ${node.getAttribute('fill')})`;
            node.style.strokeWidth = String(
              Number(node.getAttribute('stroke-width')) + strength * 2,
            );
          });
        }
        rings[i].forEach((ring, index) => {
          const age = time - i * interval - flight - index * 300;
          const growth = Math.max(0, Math.min(1, age / 1500));
          const radius = Number(ring.dataset.radius);
          ring.setAttribute('r', String(radius * (1 + 2 * growth)));
          // A small offset gives each expanding ring an eccentric center.
          ring.setAttribute(
            'transform',
            `translate(${radius * growth * 0.2 * (index - 1)} ${-radius * growth * 0.15 * index})`,
          );
          ring.style.opacity = age >= 0 && age < 1500 ? String(0.75 * (1 - growth) * fade) : '0';
        });
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
