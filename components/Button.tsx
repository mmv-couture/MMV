import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Material Design Button with Loading State
 * Inspired by Flutter's ElevatedButton and TextButton
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    loadingText = 'Chargement...',
    icon,
    fullWidth = false,
    children,
    disabled,
    className = '',
    ...props
  }, ref) => {
    const baseClasses = `
      inline-flex items-center justify-center gap-2
      font-semibold rounded-lg
      transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-offset-2
      active:scale-95
    `;

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const variantClasses = {
      primary: `
        bg-gradient-to-r from-orange-600 to-orange-700
        hover:from-orange-700 hover:to-orange-800
        text-white shadow-md hover:shadow-lg
        focus:ring-orange-500
      `,
      secondary: `
        bg-gray-200 dark:bg-gray-700
        hover:bg-gray-300 dark:hover:bg-gray-600
        text-gray-900 dark:text-white
        focus:ring-gray-500
      `,
      success: `
        bg-gradient-to-r from-green-600 to-emerald-700
        hover:from-green-700 hover:to-emerald-800
        text-white shadow-md hover:shadow-lg
        focus:ring-green-500
      `,
      danger: `
        bg-gradient-to-r from-red-600 to-rose-700
        hover:from-red-700 hover:to-rose-800
        text-white shadow-md hover:shadow-lg
        focus:ring-red-500
      `,
      warning: `
        bg-gradient-to-r from-amber-600 to-orange-700
        hover:from-amber-700 hover:to-orange-800
        text-white shadow-md hover:shadow-lg
        focus:ring-amber-500
      `
    };

    return (
      <button
        ref={ref}
        {...props}
        disabled={disabled || isLoading}
        className={`
          ${baseClasses}
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4">
              <LoadingSpinner size="sm" />
            </div>
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            {icon && <span>{icon}</span>}
            <span>{children}</span>
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
