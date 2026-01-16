import React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, children, variant = 'default' }) {
  const styles = {
    default: 'bg-background-light-secondary text-text-light dark:bg-background-dark-secondary dark:text-text-dark border-border-light dark:border-border-dark',
    accent: 'bg-primary-light text-primary dark:bg-primary/20 dark:text-primary border-primary/20 dark:border-primary/30',
    success: 'bg-success/10 text-success dark:bg-success/20 dark:text-success border-success/20 dark:border-success/30'
  };
  return (
    <span className={cn('inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold', styles[variant], className)}>
      {children}
    </span>
  );
}
