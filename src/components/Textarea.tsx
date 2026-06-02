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
  required?: boolean;
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
  required,
}: TextareaProps) {
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
      {/*
        The wrapper (not the textarea itself) owns the border, radius,
        background, and interactive states. overflow-hidden clips the
        native vertical scrollbar — which has straight edges — to the
        rounded corners; without this, the scrollbar visibly cuts the
        top-right and bottom-right corners of the field.

        Focus/hover/disabled states bubble up from the inner textarea
        via focus-within: and has-[textarea:disabled]: so the visible
        chrome reacts correctly even though it's on the parent element.
      */}
      <div
        className={[
          'rounded-btn border bg-surface overflow-hidden',
          'transition-colors duration-150',
          'focus-within:ring-2 focus-within:ring-identity focus-within:border-identity',
          'has-[textarea:disabled]:cursor-not-allowed has-[textarea:disabled]:opacity-50',
          error
            ? 'border-error bg-error/5'
            : 'border-border hover:border-muted',
        ].join(' ')}
      >
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-required={required || undefined}
          className="block w-full bg-transparent px-3 py-2 text-sm text-content placeholder:text-muted resize-none focus:outline-none"
        />
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-error leading-tight">
          {error}
        </p>
      )}
    </div>
  );
}
