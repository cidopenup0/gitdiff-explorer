import React from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, children }) {
  return (
    <div className={cn('rounded-xl border-2 border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark transition-all duration-200', className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn('border-b-2 border-border-light dark:border-border-dark px-6 py-5', className)}>{children}</div>;
}

export function CardContent({ className, children }) {
  return <div className={cn('px-6 py-5', className)}>{children}</div>;
}
