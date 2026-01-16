import React from 'react';
import { cn } from '@/lib/utils';

const variants = {
  default:
    'bg-primary text-white hover:bg-primary-hover shadow-md hover:shadow-lg border-0 cursor-pointer transition-all duration-200',
  ghost: 'bg-transparent hover:bg-background-light-secondary dark:hover:bg-background-dark-secondary border border-transparent cursor-pointer transition-all duration-200 text-text-light dark:text-text-dark',
  outline: 'border-2 border-border-light dark:border-border-dark hover:bg-background-light-secondary dark:hover:bg-background-dark-secondary cursor-pointer transition-all duration-200 text-text-light dark:text-text-dark'
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
