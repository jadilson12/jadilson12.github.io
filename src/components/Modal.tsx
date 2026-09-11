/* oxlint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- Native dialog handles Escape via cancel; this click handler only dismisses its backdrop. */
'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';

export default function Modal({
  title,
  children,
  onClose,
  side,
  closeAt,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  side?: 'left' | 'right';
  closeAt?: number;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.documentElement.style.overflow;
    dialog?.showModal();
    document.documentElement.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.documentElement.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  useEffect(() => {
    if (!closeAt) return;
    const media = window.matchMedia(`(min-width: ${closeAt}px)`);
    const handleChange = () => {
      if (media.matches) onClose();
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [closeAt, onClose]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={event => {
        event.preventDefault();
        onClose();
      }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
      className={`site-modal border border-dark-700 bg-dark-900 text-dark-50 shadow-2xl p-0 ${side ? `fixed inset-y-0 m-0 h-dvh max-h-dvh w-[min(90vw,24rem)] ${side === 'right' ? 'left-auto right-0' : 'left-0 right-auto'}` : 'fixed inset-0 m-auto max-h-[90dvh] w-[min(95vw,72rem)] max-w-none rounded-xl'}`}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-dark-700 bg-dark-900 px-4 py-3">
        <h2 id={titleId} className="text-lg font-semibold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Fechar ${title.toLowerCase()}`}
          className="min-h-11 min-w-11 rounded-lg bg-dark-800 text-2xl hover:bg-dark-700"
        >
          ×
        </button>
      </div>
      <div className="p-4">{children}</div>
    </dialog>
  );
}
