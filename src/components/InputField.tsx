import React from 'react';

interface InputFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  prefix?: string;
  hint?: string;
  autoFocus?: boolean;
}

export function InputField({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  prefix,
  hint,
  autoFocus,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-slate-500 dark:text-slate-400 font-mono text-sm select-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition-all
            bg-white dark:bg-slate-800/60
            text-slate-900 dark:text-white
            placeholder:text-slate-400 dark:placeholder:text-slate-600
            ${prefix ? 'pl-7' : ''}
            ${
              error
                ? 'border-red-400 dark:border-red-500 focus:ring-2 focus:ring-red-400/30'
                : 'border-slate-200 dark:border-slate-700 focus:border-brand-400 dark:focus:border-brand-500 focus:ring-2 focus:ring-brand-400/20'
            }
          `}
        />
      </div>

      {hint && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-500">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 font-medium animate-fade-in">{error}</p>
      )}
    </div>
  );
}
