import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-lg bg-background-light-secondary dark:bg-background-dark-secondary', className)} />;
}
