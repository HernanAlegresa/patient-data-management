import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
}

export function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-card bg-surface-elevated border border-border px-5 py-3 shadow-lg"
    >
      <span
        className={[
          'size-2 rounded-full shrink-0',
          type === 'success' ? 'bg-success' : 'bg-error',
        ].join(' ')}
        aria-hidden="true"
      />
      <p className={['text-sm font-medium', type === 'success' ? 'text-success' : 'text-error'].join(' ')}>
        {message}
      </p>
    </div>
  );
}
