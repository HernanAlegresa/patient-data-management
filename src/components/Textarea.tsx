import type { ChangeEvent } from 'react';

interface TextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

export function Textarea({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  disabled,
  rows = 4,
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-content">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          'w-full rounded-btn border px-3 py-2 text-sm text-content',
          'bg-surface-elevated placeholder:text-muted resize-none',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-error bg-error/5'
            : 'border-border hover:border-muted',
        ].join(' ')}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-error leading-tight">
          {error}
        </p>
      )}
    </div>
  );
}
