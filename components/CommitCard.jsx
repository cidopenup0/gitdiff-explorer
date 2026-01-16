"use client";

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { relativeTimeFromNow, cn } from '@/lib/utils';

export default function CommitCard({ commit, repoPath }) {
  return (
    <Card className="hover:border-primary transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="flex flex-col gap-2 py-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/repo/commit/${commit.hash}?repoPath=${encodeURIComponent(repoPath)}`}
            className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors no-underline hover:underline"
          >
            {commit.message}
          </Link>
          <Badge className="font-mono text-xs bg-background-light-secondary dark:bg-background-dark-secondary text-text-light-secondary dark:text-text-dark-secondary border border-border-light dark:border-border-dark">{commit.shortHash}</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-light-secondary dark:text-text-dark-secondary">
          <span>{commit.authorName}</span>
          <span className="h-1 w-1 rounded-full bg-border-light-hover dark:bg-border-dark-hover" aria-hidden />
          <span>{relativeTimeFromNow(commit.date)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
