"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import FileTree from '@/components/FileTree';
import { Skeleton } from '@/components/ui/skeleton';

export default function TreePage() {
  const { hash, path = [] } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [repoPath, setRepoPath] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const fetchTree = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentPath = Array.isArray(path) ? path.join('/') : path;
        const res = await fetch(`/api/tree?repoPath=${encodeURIComponent(repoPath)}&hash=${hash}&path=${encodeURIComponent(currentPath)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load tree');
        setEntries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTree();
  }, [repoPath, hash, path]);

  const currentSegments = Array.isArray(path) ? path : [];

  return (
    <div className="space-y-4">
      {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
      {loading && <Skeleton className="h-40 w-full" />}
      {!loading && !error && <FileTree items={entries} hash={hash} pathSegments={currentSegments} repoPath={repoPath} />}
    </div>
  );
}
