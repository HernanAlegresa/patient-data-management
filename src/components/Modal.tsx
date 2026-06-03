import { useEffect, useLayoutEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // useLayoutEffect — runs before the browser paints so the scrollbar
  // compensation is already applied on the first frame the modal is visible.
  // useEffect would fire after paint, causing a one-frame layout shift.
  useLayoutEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement;
    // Measure before hiding overflow; afterwards the scrollbar is gone and
    // the measurement would return 0.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      // Prevent content reflow when scrollbar disappears.
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      // Expose as a CSS var so the overlay and fixed elements (FAB) can
      // shift their own right-edge by the same amount, keeping everything
      // on the same horizontal axis as the content.
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    }
    getFocusableElements(dialogRef.current)[0]?.focus();
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.removeProperty('--scrollbar-width');
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [isOpen, onClose]);

  function handleTabKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Tab') return;
    const focusable = getFocusableElements(dialogRef.current);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  if (!isOpen) return null;

  return (
    <div
      // Inline paddingRight: the overlay is fixed left-0 right-0 (full viewport),
      // so without compensation it centers the dialog at viewport/2. The card list
      // centers via mx-auto within viewport − scrollbar_width. Adding the scrollbar
      // width to the right padding shifts the overlay's center to match the content's,
      // keeping modal and cards on the same axis.
      style={{ paddingRight: 'calc(1rem + var(--scrollbar-width, 0px))' }}
      className="fixed top-[var(--header-height)] left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[1.5px] p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex w-full max-w-lg max-h-[90vh] flex-col rounded-card bg-surface shadow-floating"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleTabKey}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-5 py-4">
          {/*
            Title is a content slot. We expose only the id (for aria-labelledby
            on the dialog) and the heading semantics; typography and layout of
            the title belong to each consumer. This keeps Modal agnostic of
            domain concerns (per the project's separation rules) and lets
            consumers compose richer headers (e.g. avatar + name + subtitle)
            without fighting opinionated defaults.
          */}
          <h2
            id={titleId}
            className="min-w-0 flex-1"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="shrink-0 rounded-btn p-1.5 text-muted transition-colors hover:bg-background hover:text-content"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
