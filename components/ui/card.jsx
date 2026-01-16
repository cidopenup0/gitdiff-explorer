import React from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, children }) {
  return (
    <div className={cn('rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm', className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn('border-b border-slate-200 dark:border-slate-800 px-4 py-3', className)}>{children}</div>;
}

export function CardContent({ className, children }) {
  return <div className={cn('px-4 py-3', className)}>{children}</div>;
}
