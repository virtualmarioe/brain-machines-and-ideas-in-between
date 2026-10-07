'use client';
import { useEffect, useRef, useState } from 'react';
import { t } from '@/content/translations/ui';
import type { Locale } from '@/types/history';
import { Icon } from './Icon';
export default function Modal({
  title,
  locale,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  locale: Locale;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const [closing, setClosing] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function close() {
    if (closing) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClose();
      return;
    }
    setClosing(true);
    exitTimer.current = setTimeout(onClose, 140);
  }
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(
    typeof document === 'undefined' ? null : (document.activeElement as HTMLElement),
  );
  useEffect(() => {
    const dialog = ref.current;
    const returnTarget = opener.current;
    window.dispatchEvent(new CustomEvent('atlas-preview-open'));
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
      dialog?.close();
      document.body.style.overflow = previous;
      returnTarget?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal glass-surface ${wide ? 'modal-wide' : ''}`}
      aria-labelledby="modal-title"
      data-closing={closing}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal-header">
        <h2 id="modal-title">{title}</h2>
        <button autoFocus className="icon-button" aria-label={t('close', locale)} onClick={close}>
          <Icon name="close" />
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </dialog>
  );
}
