'use client';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './node-preview.css';
type PreviewItem<T> = { item: T; key: string; anchor: Element };
/** Hover and keyboard previews share positioning, dismissal, and persistence. */
export function useOverlayPreview<T>() {
  const id = useId();
  const [current, setCurrent] = useState<PreviewItem<T> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hovered = useRef<Element | null>(null);
  const focused = useRef<PreviewItem<T> | null>(null);
  const overCard = useRef(false);

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }
  const dismiss = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
    setCurrent(null);
    overCard.current = false;
    hovered.current = null;
    focused.current = null;
  }, []);
  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      if (!hovered.current && !overCard.current) {
        const focus = focused.current;
        setCurrent(
          focus?.anchor.isConnected && focus.anchor === document.activeElement ? focus : null,
        );
      }
    }, 220);
  }
  function show(item: T, key: string, anchor: Element) {
    cancelClose();
    window.dispatchEvent(new CustomEvent('atlas-preview-open', { detail: id }));
    setCurrent({ item, key, anchor });
  }
  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );
  useEffect(() => {
    if (!current) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismiss();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, dismiss]);

  useEffect(() => {
    const onOpen = (event: Event) => {
      if ((event as CustomEvent).detail !== id) dismiss();
    };
    window.addEventListener('atlas-preview-open', onOpen);
    return () => window.removeEventListener('atlas-preview-open', onOpen);
  }, [id, dismiss]);
  return {
    id,
    current,
    dismiss,
    cardProps: {
      onPointerEnter() {
        cancelClose();
        overCard.current = true;
      },
      onPointerLeave() {
        overCard.current = false;
        scheduleClose();
      },
    },
    triggerProps(item: T, key: string) {
      return {
        'aria-describedby': current?.key === key ? id : undefined,
        onPointerEnter(event: PointerEvent<Element>) {
          if (event.pointerType === 'touch') return;
          hovered.current = event.currentTarget;
          show(item, key, event.currentTarget);
        },
        onPointerLeave(event: PointerEvent<Element>) {
          if (hovered.current === event.currentTarget) hovered.current = null;
          scheduleClose();
        },
        onFocus(event: FocusEvent<Element>) {
          if (!event.currentTarget.matches(':focus-visible')) return;
          focused.current = { item, key, anchor: event.currentTarget };
          show(item, key, event.currentTarget);
        },
        onBlur(event: FocusEvent<Element>) {
          if (focused.current?.anchor === event.currentTarget) focused.current = null;
          scheduleClose();
        },
        onKeyDown(event: KeyboardEvent<Element>) {
          if (event.key === 'Escape') dismiss();
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
  const [position, setPosition] = useState({ left: 0, top: 0, ready: false });
  const current = preview.current;
  const dismiss = preview.dismiss;
  useEffect(() => {
    if (!current) return;
    let frame: number;
    // Nodes can move while focused, during panning, resizing, or scrolling.
    const update = () => {
      if (!current.anchor.isConnected || current.anchor.getClientRects().length === 0) {
        dismiss();
        return;
      }
      if (card.current) {
        const anchor = current.anchor.getBoundingClientRect();
        const bounds = card.current.getBoundingClientRect();
        const viewport = window.visualViewport;
        const viewLeft = viewport?.offsetLeft ?? 0;
        const viewTop = viewport?.offsetTop ?? 0;
        const viewWidth = viewport?.width ?? window.innerWidth;
        const viewHeight = viewport?.height ?? window.innerHeight;
        const left = Math.max(
          viewLeft + 12,
          Math.min(
            anchor.left + anchor.width / 2 - bounds.width / 2,
            viewLeft + viewWidth - bounds.width - 12,
          ),
        );
        const below = anchor.bottom + 10;
        const top = Math.max(
          viewTop + 12,
          Math.min(
            below + bounds.height <= viewTop + viewHeight - 12
              ? below
              : anchor.top - bounds.height - 10,
            viewTop + viewHeight - bounds.height - 12,
          ),
        );
        setPosition((previous) =>
          previous.left === left && previous.top === top && previous.ready
            ? previous
            : { left, top, ready: true },
        );
      }
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [current, dismiss]);

  if (!current) return null;
  return createPortal(
    <div
      ref={card}
      id={preview.id}
      role="tooltip"
      className={`node-preview glass-surface ${className}`}
      data-preview-for={forId}
      data-preview-kind={kind}
      style={{
        left: position.left,
        top: position.top,
        visibility: position.ready ? 'visible' : 'hidden',
      }}
      {...preview.cardProps}
    >
      {children}
    </div>,
    document.body,
  );
}
