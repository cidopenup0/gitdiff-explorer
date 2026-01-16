"use client";

import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

export function Breadcrumbs({ hash, segments = [], repoPath }) {
  const paths = [];
  segments.forEach((seg, idx) => {
    const path = segments.slice(0, idx + 1).join('/');
    paths.push({ name: seg, path });
  });

  return (
    <nav className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-dark-secondary pb-4 border-b-2 border-border-light dark:border-border-dark">
      <Link href={`/repo/tree/${hash}?repoPath=${encodeURIComponent(repoPath)}`} className="inline-flex items-center gap-2 text-primary hover:text-primary-hover transition-colors no-underline">
        <Home className="h-4 w-4" />
        <span className="font-semibold">root</span>
      </Link>
      {paths.map((p, idx) => (
        <React.Fragment key={p.path}>
          <span className="text-text-light-secondary dark:text-text-dark-secondary">/</span>
          {idx === paths.length - 1 ? (
            <span className="text-text-light dark:text-text-dark font-semibold">{p.name}</span>
          ) : (
            <Link
              href={`/repo/tree/${hash}/${p.path}?repoPath=${encodeURIComponent(repoPath)}`}
              className="text-primary hover:text-primary-hover font-semibold transition-colors no-underline hover:underline"
            >
              {p.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
