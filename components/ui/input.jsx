import React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-xl border-2 border-border-light bg-background-light px-4 py-2 text-sm transition-all duration-200 placeholder:text-text-light-secondary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary dark:border-border-dark dark:bg-background-dark-secondary dark:text-text-dark dark:placeholder:text-text-dark-secondary',
        className
      )}
      {...props}
    />
  );
});
