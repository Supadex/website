import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl select-none focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer';

    const variants = {
      primary:
        'bg-white text-black hover:bg-neutral-200 dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-sm',
      secondary:
        'bg-white/10 text-white hover:bg-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 border border-white/5',
      outline:
        'border border-white/15 text-white/90 hover:bg-white/5 hover:border-white/25 dark:text-white dark:hover:bg-white/5',
      ghost:
        'text-neutral-400 hover:text-white hover:bg-white/5 dark:text-neutral-400 dark:hover:text-white',
      danger:
        'bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25',
      success:
        'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg h-8',
      md: 'text-sm px-4 py-2 gap-2 rounded-xl h-10',
      lg: 'text-base px-5 py-2.5 gap-2.5 rounded-xl h-12',
      icon: 'h-10 w-10 p-0 rounded-xl flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
