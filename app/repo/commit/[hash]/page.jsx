"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import DiffViewer from '@/components/DiffViewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CopyButton from '@/components/CopyButton';
import { DiffSkeleton } from '@/components/LoadingState';
import { ArrowLeft, ChevronLeft, ChevronRight, File } from 'lucide-react';
import Link from 'next/link';

export default function CommitDetailsPage() {
  const { hash } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [repoPath, setRepoPath] = useState('');
  const [commit, setCommit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const pathFromUrl = searchParams.get('repoPath');
    const stored = typeof window !== 'undefined' ? localStorage.getItem('repoPath') : '';
    const path = pathFromUrl || stored;
    if (!path) {
      router.replace('/');
      return;
    }
    setRepoPath(path);
  }, [searchParams, router]);

  useEffect(() => {
    if (!repoPath || !hash) return;
    const fetchCommit = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/commit?repoPath=${encodeURIComponent(repoPath)}&hash=${hash}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load commit');
        setCommit(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCommit();
  }, [repoPath, hash]);

  if (!hash) return null;

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="space-y-4">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
      {loading && <DiffSkeleton />}
      {!loading && commit && (
        <div>
          {/* Commit Header */}
          <div className="mb-4 space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold">{commit.subject}</p>
              <Badge>{commit.hash.slice(0, 7)}</Badge>
              <CopyButton value={commit.hash} />
            </div>
            <div className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <p>
                <strong>Author:</strong> {commit.authorName} &lt;{commit.authorEmail}&gt; on {new Date(commit.date).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/repo/tree/${hash}?repoPath=${encodeURIComponent(repoPath)}`)}
                className="gap-2"
              >
                <File className="h-4 w-4" />
                Browse files at this commit
              </Button>
            </div>
          </div>

          {/* Sidebar + Content Layout */}
          <div className="flex gap-4">
            {/* Sidebar */}
            <div
              className={`transition-all duration-300 ${
                sidebarCollapsed ? 'w-10' : 'w-72'
              } flex-shrink-0`}
            >
              <div className="sticky top-20 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                {/* Sidebar Header */}
                <div className="flex items-center justify-center bg-slate-50 px-2 py-2 border-b border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                  {!sidebarCollapsed && (
                    <h2 className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex-1">
                      Changed Files ({commit.changedFiles.length})
                    </h2>
                  )}
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="rounded p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  >
                    {sidebarCollapsed ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Sidebar Content */}
                {!sidebarCollapsed && (
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    {commit.changedFiles.map((file, index) => (
                      <button
                        key={file.path}
                        onClick={() => setSelectedFile(file.path)}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 ${
                          selectedFile === file.path ? 'bg-blue-50 dark:bg-blue-950' : ''
                        } ${index !== commit.changedFiles.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}
                      >
                        <File className="h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <span
                            className={`flex-shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] uppercase ${
                              file.status === 'M'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                                : file.status === 'A'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : file.status === 'D'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {file.status}
                          </span>
                          <span className="truncate text-left" title={file.path}>
                            {file.path}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="min-w-0 flex-1">
              {selectedFile ? (
                <>
                  <div className="flex items-center gap-2">
                    {commit.diffTooLarge && <span className="text-xs text-slate-500">Diff truncated (over 2MB)</span>}
                  </div>
                  <DiffViewer diff={commit.diff} selectedFile={selectedFile} hash={hash} repoPath={repoPath} parentHash={commit.parentHash} />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-12 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">
                    Select a file from the sidebar to view its diff
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">(this is to reduce the lag on the website)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
