// CMP-014
import { forwardRef } from 'react';
import type { ForwardedRef } from 'react';
import { cn } from '@/lib/utils';

type BaseInputProps = {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  id?: string;
};

type InputProps = BaseInputProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    as?: 'input';
  };

type TextareaProps = BaseInputProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: 'textarea';
  };

type SelectProps = BaseInputProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    as: 'select';
    children: React.ReactNode;
  };

type FieldProps = InputProps | TextareaProps | SelectProps;

const fieldBaseClasses =
  'w-full rounded-[6px] border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-900 transition-colors duration-150 ease-out ' +
  'placeholder:text-gray-400 ' +
  'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 ' +
  'disabled:bg-canvas disabled:cursor-not-allowed';

const fieldErrorClasses = 'border-danger focus:border-danger focus:ring-danger/20';

const InputField = forwardRef(function InputField(
  {
    label,
    error,
    hint,
    required,
    id,
    as,
    className,
    ...rest
  }: FieldProps,
  ref: ForwardedRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
) {
  const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={fieldId}
          className="text-sm font-medium text-gray-900"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {as === 'textarea' ? (
        <textarea
          ref={ref as ForwardedRef<HTMLTextAreaElement>}
          id={fieldId}
          className={cn(
            fieldBaseClasses,
            'min-h-[120px] resize-vertical',
            error && fieldErrorClasses,
            className,
          )}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : as === 'select' ? (
        <select
          ref={ref as ForwardedRef<HTMLSelectElement>}
          id={fieldId}
          className={cn(
            fieldBaseClasses,
            error && fieldErrorClasses,
            className,
          )}
          {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
        />
      ) : (
        <input
          ref={ref as ForwardedRef<HTMLInputElement>}
          id={fieldId}
          className={cn(
            fieldBaseClasses,
            error && fieldErrorClasses,
            className,
          )}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && (
        <p
          role="alert"
          className="animate-[fadeIn_150ms_ease-out] text-xs text-danger"
        >
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
});

const Input = forwardRef<HTMLInputElement, Omit<InputProps, 'as'>>(
  ({ label, error, hint, required, id, className, ...rest }, ref) => {
    const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={fieldId} className="text-sm font-medium text-gray-900">
            {label}
            {required && (
              <span className="ml-0.5 text-danger" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={fieldId}
          className={cn(
            fieldBaseClasses,
            error && fieldErrorClasses,
            className,
          )}
          {...rest}
        />
        {error && (
          <p role="alert" className="animate-[fadeIn_150ms_ease-out] text-xs text-danger">
            {error}
          </p>
        )}
        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { InputField, Input };
export type { InputProps, TextareaProps, SelectProps };
