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
    <nav className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
      <Link href={`/repo/tree/${hash}?repoPath=${encodeURIComponent(repoPath)}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400">
        <Home className="h-3.5 w-3.5" />
        root
      </Link>
      {paths.map((p, idx) => (
        <React.Fragment key={p.path}>
          <span className="text-slate-400">/</span>
          {idx === paths.length - 1 ? (
            <span className="text-slate-800 dark:text-slate-100">{p.name}</span>
          ) : (
            <Link
              href={`/repo/tree/${hash}/${p.path}?repoPath=${encodeURIComponent(repoPath)}`}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              {p.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
