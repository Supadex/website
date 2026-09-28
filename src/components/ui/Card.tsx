import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'elevated' | 'glass' | 'interactive';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'surface', ...props }, ref) => {
    const variants = {
      surface: 'bg-[#111317] dark:bg-[#111317] light:bg-white border border-white/[0.07] dark:border-white/[0.07] shadow-sm',
      elevated: 'bg-[#181A20] dark:bg-[#181A20] light:bg-[#F1F3F5] border border-white/[0.1] dark:border-white/[0.1] shadow-md',
      glass: 'bg-white/[0.03] dark:bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]',
      interactive: 'bg-[#111317] dark:bg-[#111317] border border-white/[0.07] hover:border-white/20 transition-all duration-200 cursor-pointer',
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-2xl p-5 overflow-hidden', variants[variant], className)}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight text-white dark:text-white light:text-neutral-900', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-4 border-t border-white/[0.05]', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';
