"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import CodeBlock from '@/components/CodeBlock';
import { Skeleton } from '@/components/ui/skeleton';
import CopyButton from '@/components/CopyButton';
import Link from 'next/link';

export default function BlobPage() {
  const { hash, path = [] } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [repoPath, setRepoPath] = useState('');
  const [blob, setBlob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fullPath = Array.isArray(path) ? path.join('/') : path;

  useEffect(() => {
    const pathFromUrl = searchParams.get('repoPath');
    const stored = typeof window !== 'undefined' ? localStorage.getItem('repoPath') : '';
    const p = pathFromUrl || stored;
    if (!p) {
      router.replace('/');
      return;
    }
    setRepoPath(p);
  }, [searchParams, router]);

  useEffect(() => {
    if (!repoPath || !hash) return;
    const fetchBlob = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/blob?repoPath=${encodeURIComponent(repoPath)}&hash=${hash}&path=${encodeURIComponent(fullPath)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load file');
        setBlob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlob();
  }, [repoPath, hash, fullPath]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="font-mono text-sm text-slate-800 dark:text-slate-100">{fullPath}</h1>
          <p className="text-xs text-slate-500">{blob?.content?.split('\n').length || 0} lines - <strong>Commit: {hash?.slice(0, 7)}</strong> </p>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton value={blob?.content || ''} />
          <Link
            href={`/repo/tree/${hash}/${fullPath.split('/').slice(0, -1).join('/')}?repoPath=${encodeURIComponent(repoPath)}`}
            className="text-xs text-blue-600 hover:underline dark:text-blue-400"
          >
            Back to folder
          </Link>
        </div>
      </div>
      {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
      {loading && <Skeleton className="h-64 w-full" />}
      {!loading && blob && (
        <div className="rounded-md border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <span>Size: {blob.size ? `${blob.size} bytes` : 'unknown'}</span>
            {blob.tooLarge && <span className="text-red-500">File too large to preview (&gt;1MB)</span>}
            {blob.isBinary && <span className="text-amber-500">Binary file - download via git</span>}
          </div>
          <div className="p-3">
            {blob.tooLarge ? (
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <p>This file exceeds the 1MB preview limit.</p>
                <div className="flex items-center gap-2">
                  <span>Copy git download command:</span>
                  <CopyButton value={`git show ${hash}:${fullPath} > ${fullPath.split('/').pop() || 'file'}`} />
                </div>
              </div>
            ) : blob.isBinary ? (
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <p>Binary file preview is disabled.</p>
                <div className="flex items-center gap-2">
                  <span>Copy git download command:</span>
                  <CopyButton value={`git show ${hash}:${fullPath} > ${fullPath.split('/').pop() || 'file'}`} />
                </div>
              </div>
            ) : (
              <CodeBlock content={blob.content} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
