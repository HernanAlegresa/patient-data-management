import type { ChangeEvent } from 'react';

interface InputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export function Input({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  disabled,
  required,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-content">
        {label}
        {required && (
          <span className="ml-0.5 text-error" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-required={required || undefined}
        className={[
          'w-full rounded-btn border px-3 py-2 text-sm text-content',
          'bg-surface placeholder:text-muted',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-identity focus:border-identity',
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
