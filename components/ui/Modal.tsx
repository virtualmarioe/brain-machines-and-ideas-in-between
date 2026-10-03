'use client';
import { useEffect, useRef } from 'react';
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
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(
    typeof document === 'undefined' ? null : (document.activeElement as HTMLElement),
  );
  useEffect(() => {
    const dialog = ref.current;
    const returnTarget = opener.current;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = previous;
      returnTarget?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? 'modal-wide' : ''}`}
      aria-labelledby="modal-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-header">
        <h2 id="modal-title">{title}</h2>
        <button autoFocus className="icon-button" aria-label={t('close', locale)} onClick={onClose}>
          <Icon name="close" />
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </dialog>
  );
}
