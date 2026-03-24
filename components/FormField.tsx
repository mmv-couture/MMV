import React from 'react';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  variant?: 'outlined' | 'filled';
}

/**
 * Material Design Form Field
 * Follows Flutter TextField patterns
 */
const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ 
    label, 
    error, 
    hint,
    icon,
    variant = 'outlined',
    className = '',
    disabled = false,
    ...props 
  }, ref) => {
    const hasError = !!error;

    const baseClasses = `
      w-full px-4 py-3 rounded-lg 
      transition-all duration-200
      focus:outline-none focus:ring-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const outlinedClasses = `
      border-2 
      ${hasError 
        ? 'border-red-500 focus:ring-red-200' 
        : 'border-gray-300 dark:border-gray-600 focus:ring-orange-200'
      }
      bg-white dark:bg-gray-900
      text-gray-900 dark:text-gray-100
    `;

    const filledClasses = `
      border-b-2 border-x-0 border-t-0
      ${hasError 
        ? 'border-b-red-500 focus:ring-red-200' 
        : 'border-b-gray-300 dark:border-b-gray-600 focus:ring-orange-200'
      }
      bg-gray-100 dark:bg-gray-800
      text-gray-900 dark:text-gray-100
    `;

    const variantClasses = variant === 'outlined' ? outlinedClasses : filledClasses;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            {...props}
            disabled={disabled}
            className={`
              ${baseClasses}
              ${variantClasses}
              ${icon ? 'pl-12' : ''}
              ${className}
            `}
          />

          {hasError && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
