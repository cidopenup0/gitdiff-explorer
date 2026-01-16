"use client";

import React from 'react';
import Link from 'next/link';
import { Folder, File } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function FileTree({ items, hash, pathSegments = [], repoPath }) {
  const basePath = pathSegments.join('/');
  const sorted = [...items].sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'tree' ? -1 : 1;
  });

  return (
    <div className="rounded-xl bg-card-light dark:bg-card-dark border-2 border-border-light dark:border-border-dark shadow-sm overflow-hidden">
      <div className="p-6 space-y-4">
        <Breadcrumbs hash={hash} segments={pathSegments} repoPath={repoPath} />
        <div className="space-y-1">
          {sorted.map((entry) => {
            const fullPath = basePath ? `${basePath}/${entry.name}` : entry.name;
            if (entry.type === 'tree') {
              return (
                <Link
                  key={entry.path}
                  href={`/repo/tree/${hash}/${fullPath}?repoPath=${encodeURIComponent(repoPath)}`}
                  className="flex items-center gap-3 px-4 py-3 text-base hover:bg-background-light-secondary dark:hover:bg-background-dark-secondary rounded-lg transition-all duration-200 no-underline group"
                >
                  <Folder className="h-5 w-5 text-warning" />
                  <span className="text-text-light dark:text-text-dark font-medium group-hover:text-primary transition-colors">{entry.name}</span>
                </Link>
              );
            }
            return (
              <Link
                key={entry.path}
                href={`/repo/blob/${hash}/${fullPath}?repoPath=${encodeURIComponent(repoPath)}`}
                className="flex items-center gap-3 px-4 py-3 text-base hover:bg-background-light-secondary dark:hover:bg-background-dark-secondary rounded-lg transition-all duration-200 no-underline group"
              >
                <File className="h-5 w-5 text-text-light-secondary dark:text-text-dark-secondary" />
                <span className="text-text-light dark:text-text-dark font-medium group-hover:text-primary transition-colors">{entry.name}</span>
              </Link>
            );
          })}
          {sorted.length === 0 && <div className="px-4 py-3 text-base text-text-light-secondary dark:text-text-dark-secondary">Empty folder</div>}
        </div>
      </div>
    </div>
  );
}
