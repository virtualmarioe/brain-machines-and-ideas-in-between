'use client';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './node-preview.css';
import { placeBubble, type Point } from '@/lib/overlay-placement';
// Keyboard focus keeps its preview while smooth scrolling crosses other hover targets.
let keyboardAnchor: Element | null = null;
let pointerPoint: Point | null = null;
let dismissedPoint: Point | null = null;
type PreviewItem<T> = { item: T; key: string; anchor: Element; origin?: Point };
/** Hover and keyboard previews share positioning, dismissal, and persistence. */
export function useOverlayPreview<T>() {
  const id = useId();
  const [current, setCurrent] = useState<PreviewItem<T> | null>(null);
  const [closing, setClosing] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hovered = useRef<Element | null>(null);
  const focused = useRef<PreviewItem<T> | null>(null);
  const overCard = useRef(false);

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }
  const dismiss = useCallback((immediate = false) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
    if (exitTimer.current) clearTimeout(exitTimer.current);
    if (immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(null);
      setClosing(false);
    } else {
      setClosing(true);
      exitTimer.current = setTimeout(() => {
        setCurrent(null);
        setClosing(false);
      }, 150);
    }
    overCard.current = false;
    hovered.current = null;
    if (keyboardAnchor === focused.current?.anchor) keyboardAnchor = null;
    focused.current = null;
  }, []);
  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      if (!hovered.current && !overCard.current) {
        const focus = focused.current;
        if (focus?.anchor.isConnected && focus.anchor === document.activeElement) setCurrent(focus);
        else dismiss();
      }
    }, 220);
  }
  function show(item: T, key: string, anchor: Element, origin?: Point) {
    cancelClose();
    if (exitTimer.current) clearTimeout(exitTimer.current);
    setClosing(false);
    window.dispatchEvent(new CustomEvent('atlas-preview-open', { detail: id }));
    setCurrent({ item, key, anchor, origin });
  }
  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (exitTimer.current) clearTimeout(exitTimer.current);
      if (keyboardAnchor === focused.current?.anchor) keyboardAnchor = null;
    },
    [],
  );
  useEffect(() => {
    if (!current) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismissedPoint = pointerPoint;
        dismiss();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, dismiss]);

  useEffect(() => {
    const onOpen = (event: Event) => {
      if ((event as CustomEvent).detail !== id) dismiss(true);
    };
    window.addEventListener('atlas-preview-open', onOpen);
    return () => window.removeEventListener('atlas-preview-open', onOpen);
  }, [id, dismiss]);
  return {
    id,
    current,
    closing,
    dismiss,
    cardProps: {
      onPointerEnter(event: PointerEvent<Element>) {
        pointerPoint = { x: event.clientX, y: event.clientY };
        cancelClose();
        overCard.current = true;
      },
      onPointerMove(event: PointerEvent<Element>) {
        pointerPoint = { x: event.clientX, y: event.clientY };
      },
      onPointerLeave() {
        overCard.current = false;
        scheduleClose();
      },
    },
    triggerProps(item: T, key: string) {
      function fromPointer(event: PointerEvent<Element>) {
        if (event.pointerType === 'touch' || keyboardAnchor === document.activeElement) return;
        const point = { x: event.clientX, y: event.clientY };
        // Removing a card can expose another target beneath a stationary pointer.
        // Escape stays effective until the user actually moves the pointer.
        if (
          dismissedPoint &&
          Math.hypot(point.x - dismissedPoint.x, point.y - dismissedPoint.y) <= 2
        )
          return;
        dismissedPoint = null;
        pointerPoint = point;
        hovered.current = event.currentTarget;
        if (current?.anchor === event.currentTarget && !closing) return;
        show(
          item,
          key,
          event.currentTarget,
          event.currentTarget.tagName.toLowerCase() === 'path' ? point : undefined,
        );
      }
      return {
        'aria-describedby': current?.key === key ? id : undefined,
        onPointerEnter: fromPointer,
        onPointerMove: fromPointer,
        onPointerLeave(event: PointerEvent<Element>) {
          if (hovered.current === event.currentTarget) hovered.current = null;
          scheduleClose();
        },
        onFocus(event: FocusEvent<Element>) {
          if (!event.currentTarget.matches(':focus-visible')) return;
          keyboardAnchor = event.currentTarget;
          focused.current = { item, key, anchor: event.currentTarget };
          show(item, key, event.currentTarget);
        },
        onBlur(event: FocusEvent<Element>) {
          if (keyboardAnchor === event.currentTarget) keyboardAnchor = null;
          if (focused.current?.anchor === event.currentTarget) focused.current = null;
          scheduleClose();
        },
        onKeyDown(event: KeyboardEvent<Element>) {
          if (event.key === 'Escape') {
            dismissedPoint = pointerPoint;
            dismiss();
          }
        },
      };
    },
  };
}

export function PreviewCard<T>({
  preview,
  children,
  className = '',
  kind,
  forId,
}: {
  preview: ReturnType<typeof useOverlayPreview<T>>;
  children: ReactNode;
  className?: string;
  kind: string;
  forId: string;
}) {
  const card = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<ReturnType<typeof placeBubble>>(null);
  const current = preview.current;
  const dismiss = preview.dismiss;
  useEffect(() => {
    if (!current) return;
    let frame = 0;
    const anchor = current.anchor;
    const update = () => {
      frame = 0;
      if (!anchor.isConnected || anchor.getClientRects().length === 0) {
        dismiss(true);
        return;
      }
      if (!card.current) return;
      const rect = anchor.getBoundingClientRect();
      let reserved = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
      if (anchor instanceof SVGGraphicsElement) {
        // DOM bounds exclude the stroke, including the wider invisible hit target.
        const matrix = anchor.getScreenCTM();
        const style = getComputedStyle(anchor);
        const stroke = Number.parseFloat(style.strokeWidth) || 0;
        // Browser hit bounds conservatively include the possible miter extent.
        const join =
          style.strokeLinejoin === 'miter' ? Number.parseFloat(style.strokeMiterlimit) || 4 : 1;
        if (matrix && stroke) {
          const x = ((stroke * join) / 2) * Math.hypot(matrix.a, matrix.c);
          const y = ((stroke * join) / 2) * Math.hypot(matrix.b, matrix.d);
          reserved = {
            left: rect.left - x,
            top: rect.top - y,
            width: rect.width + 2 * x,
            height: rect.height + 2 * y,
          };
        }
      }
      if (!rect.width && !rect.height) {
        dismiss(true);
        return;
      }
      const viewport = window.visualViewport;
      let origin = current.origin;
      const dot = anchor.querySelector('circle');
      if (dot) {
        const bounds = dot.getBoundingClientRect();
        origin = { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
      }
      if (anchor instanceof SVGPathElement) {
        const p = anchor.getPointAtLength(anchor.getTotalLength() / 2);
        const matrix = anchor.getScreenCTM();
        if (matrix) {
          const transformed = new DOMPoint(p.x, p.y).matrixTransform(matrix);
          origin = { x: transformed.x, y: transformed.y };
        }
      }
      const result = placeBubble(
        reserved,
        { width: Math.min(384, window.innerWidth - 24), height: card.current.scrollHeight + 2 },
        {
          left: viewport?.offsetLeft ?? 0,
          top: viewport?.offsetTop ?? 0,
          width: viewport?.width ?? window.innerWidth,
          height: viewport?.height ?? window.innerHeight,
        },
        origin,
      );
      setPosition((previous) =>
        JSON.stringify(previous) === JSON.stringify(result) ? previous : result,
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(card.current!);
    resize.observe(anchor);
    const mutation = new MutationObserver(schedule);
    mutation.observe(anchor.closest('svg') ?? anchor.parentElement!, {
      attributes: true,
      subtree: true,
      attributeFilter: ['transform', 'd', 'viewBox', 'cx', 'cy', 'style'],
    });
    window.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutation.disconnect();
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
    };
  }, [current, dismiss]);

  if (!current) return null;
  const dx = position ? position.tip.x - position.base.x : 0;
  const dy = position ? position.tip.y - position.base.y : 0;
  return createPortal(
    <>
      {position && (
        <svg className="bubble-tail" aria-hidden="true" data-closing={preview.closing}>
          <path
            d={
              position.horizontal
                ? `M${position.base.x - 8},${position.base.y} Q${position.base.x},${position.base.y + dy * 0.5} ${position.tip.x},${position.tip.y} Q${position.base.x + 8},${position.base.y + dy * 0.35} ${position.base.x + 8},${position.base.y} Z`
                : `M${position.base.x},${position.base.y - 8} Q${position.base.x + dx * 0.5},${position.base.y} ${position.tip.x},${position.tip.y} Q${position.base.x + dx * 0.35},${position.base.y + 8} ${position.base.x},${position.base.y + 8} Z`
            }
          />
        </svg>
      )}
      <div
        ref={card}
        id={preview.id}
        role="tooltip"
        className={`node-preview glass-surface ${className}`}
        data-preview-for={forId}
        data-preview-kind={kind}
        data-closing={preview.closing}
        data-ready={!!position}
        data-side={position?.side}
        style={
          {
            left: position?.left ?? 12,
            top: position?.top ?? 12,
            width: position?.width,
            maxHeight: position?.maxHeight,
            visibility: position ? 'visible' : 'hidden',
            transformOrigin: position
              ? `${position.base.x - position.left}px ${position.base.y - position.top}px`
              : undefined,
            '--bubble-x': `${Math.max(-48, Math.min(48, dx))}px`,
            '--bubble-y': `${Math.max(-48, Math.min(48, dy))}px`,
          } as React.CSSProperties
        }
        {...preview.cardProps}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}
