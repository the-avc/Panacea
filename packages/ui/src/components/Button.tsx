import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
      md: 'px-4 py-2 text-sm font-medium gap-2',
      lg: 'px-6 py-3 text-base font-semibold gap-2.5',
    };

    const variantStyles = {
      primary:
        'bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-950 focus:ring-navy-500 border border-transparent shadow-sm',
      secondary:
        'bg-gray-100 text-navy-900 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-400 border border-gray-200',
      outline:
        'bg-transparent text-navy-900 hover:bg-navy-50 border border-navy-300 focus:ring-navy-500',
      danger:
        'bg-burgundy-700 text-white hover:bg-burgundy-800 active:bg-burgundy-900 focus:ring-burgundy-500 border border-transparent shadow-sm',
      ghost:
        'bg-transparent text-navy-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-navy-500 border border-transparent',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
