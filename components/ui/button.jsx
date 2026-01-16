import React from 'react';
import { cn } from '@/lib/utils';

const variants = {
  default:
    'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer',
  ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent cursor-pointer',
  outline: 'border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
};

const sizes = {
  sm: 'h-8 px-2 text-xs',
  md: 'h-10 px-3 text-sm',
  lg: 'h-11 px-4 text-sm'
};

export const Button = React.forwardRef(function Button({ className, variant = 'default', size = 'md', ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant] || variants.default,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    />
  );
});
