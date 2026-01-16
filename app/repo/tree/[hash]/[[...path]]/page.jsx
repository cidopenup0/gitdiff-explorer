"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import FileTree from '@/components/FileTree';
import { Skeleton } from '@/components/ui/skeleton';

export default function TreePage() {
  const { hash, path = [] } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasLoadedOnce = useRef(false);

  // Get repoPath once without causing re-renders
  const repoPath = useMemo(() => {
    const pathFromUrl = searchParams.get('repoPath');
    const stored = typeof window !== 'undefined' ? localStorage.getItem('repoPath') : '';
    return pathFromUrl || stored;
  }, [searchParams]);

  useEffect(() => {
    if (!repoPath) {
      router.replace('/');
      return;
    }

    if (!hash) return;

    const fetchTree = async () => {
      // Don't set loading on subsequent loads to prevent flickering
      if (!hasLoadedOnce.current) {
        setLoading(true);
      }
      setError(null);
      try {
        const currentPath = Array.isArray(path) ? path.join('/') : (typeof path === 'string' ? path : '');
        const res = await fetch(`/api/tree?repoPath=${encodeURIComponent(repoPath)}&hash=${hash}&path=${encodeURIComponent(currentPath)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load tree');
        setEntries(data);
        hasLoadedOnce.current = true;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTree();
  }, [repoPath, hash, path, router]);

  const currentSegments = Array.isArray(path) ? path : [];

  if (loading && !hasLoadedOnce.current) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
      {!error && <FileTree items={entries} hash={hash} pathSegments={currentSegments} repoPath={repoPath} />}
    </div>
  );
}
