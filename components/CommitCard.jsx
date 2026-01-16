"use client";

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { relativeTimeFromNow, cn } from '@/lib/utils';

export default function CommitCard({ commit, repoPath }) {
  return (
    <Card className="hover:border-slate-300 dark:hover:border-slate-700">
      <CardContent className="flex flex-col gap-1 py-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/repo/commit/${commit.hash}?repoPath=${encodeURIComponent(repoPath)}`}
            className="text-sm font-semibold text-blue-700 hover:underline dark:text-blue-400"
          >
            {commit.message}
          </Link>
          <Badge className="font-mono">{commit.shortHash}</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
          <span>{commit.authorName}</span>
          <span className="h-1 w-1 rounded-full bg-slate-400" aria-hidden />
          <span>{relativeTimeFromNow(commit.date)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
