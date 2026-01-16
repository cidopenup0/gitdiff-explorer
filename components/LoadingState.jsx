"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function CommitListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, idx) => (
        <Skeleton key={idx} className="h-16 w-full" />
      ))}
    </div>
  );
}

export function DiffSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, idx) => (
        <Skeleton key={idx} className="h-6 w-full" />
      ))}
    </div>
  );
}
