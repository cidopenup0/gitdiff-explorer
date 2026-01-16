import React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, children, variant = 'default' }) {
  const styles = {
    default: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
    accent: 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100',
    success: 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100'
  };
  return (
    <span className={cn('inline-flex items-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium', styles[variant], className)}>
      {children}
    </span>
  );
}
