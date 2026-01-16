"use client";

import React from 'react';
import Link from 'next/link';
import { Folder, File } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function FileTree({ items, hash, pathSegments = [], repoPath }) {
  const basePath = pathSegments.join('/');
  const sorted = [...items].sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'tree' ? -1 : 1;
  });

  return (
    <Card>
      <CardContent className="space-y-3 py-4">
        <Breadcrumbs hash={hash} segments={pathSegments} repoPath={repoPath} />
        <div className="divide-y divide-slate-200 rounded-md border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {sorted.map((entry) => {
            const fullPath = basePath ? `${basePath}/${entry.name}` : entry.name;
            if (entry.type === 'tree') {
              return (
                <Link
                  key={entry.path}
                  href={`/repo/tree/${hash}/${fullPath}?repoPath=${encodeURIComponent(repoPath)}`}
                  className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Folder className="h-4 w-4 text-amber-500" />
                  <span>{entry.name}</span>
                </Link>
              );
            }
            return (
              <Link
                key={entry.path}
                href={`/repo/blob/${hash}/${fullPath}?repoPath=${encodeURIComponent(repoPath)}`}
                className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <File className="h-4 w-4 text-slate-500" />
                <span>{entry.name}</span>
              </Link>
            );
          })}
          {sorted.length === 0 && <div className="px-3 py-2 text-sm text-slate-500">Empty folder</div>}
        </div>
      </CardContent>
    </Card>
  );
}
