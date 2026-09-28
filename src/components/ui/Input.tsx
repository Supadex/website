import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, leftIcon, rightIcon, rightElement, disabled, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-neutral-400">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full bg-[#181A20] dark:bg-[#181A20] light:bg-[#F1F3F5] text-white dark:text-white light:text-neutral-900 text-sm rounded-xl px-3.5 py-2.5 outline-none border border-white/[0.08] dark:border-white/[0.08] transition-all duration-150 placeholder:text-neutral-500 focus:border-white/30 focus:ring-1 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              (rightIcon || rightElement) && 'pr-12',
              error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-neutral-400">
              {rightIcon}
            </div>
          )}
          {rightElement && (
            <div className="absolute right-2 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-400">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-neutral-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';
