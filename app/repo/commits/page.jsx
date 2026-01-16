"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CommitCard from '@/components/CommitCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CommitListSkeleton } from '@/components/LoadingState';
import { ArrowLeft, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const PAGE_SIZE = 10;

export default function CommitsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [repoPath, setRepoPath] = useState('');
  const [commits, setCommits] = useState([]);
  const [allCommits, setAllCommits] = useState([]);
  const [filteredCommits, setFilteredCommits] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCommits, setTotalCommits] = useState(null);

  useEffect(() => {
    const pathFromUrl = searchParams.get('repoPath');
    const stored = typeof window !== 'undefined' ? localStorage.getItem('repoPath') : '';
    const path = pathFromUrl || stored;
    if (!path) {
      router.replace('/');
      return;
    }
    setRepoPath(path);
    
    // Fetch total commit count
    const fetchTotalCommits = async () => {
      try {
        const res = await fetch(`/api/commits?repoPath=${encodeURIComponent(path)}&limit=10000&skip=0`);
        const data = await res.json();
        if (res.ok) {
          setTotalCommits(data.length >= 10000 ? '10000+' : data.length);
        }
      } catch (err) {
        console.error('Failed to fetch total commits:', err);
      }
    };
    fetchTotalCommits();
  }, [searchParams, router]);

  useEffect(() => {
    if (!repoPath) return;
    const fetchCommits = async () => {
      setLoading(true);
      setError(null);
      try {
        // When searching, fetch more commits (up to 1000) once
        const limit = searchQuery.trim() ? 1000 : PAGE_SIZE;
        const skip = searchQuery.trim() ? 0 : page * PAGE_SIZE;
        const res = await fetch(`/api/commits?repoPath=${encodeURIComponent(repoPath)}&limit=${limit}&skip=${skip}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load commits');
        
        if (searchQuery.trim()) {
          // Store all fetched commits for filtering
          setAllCommits(data);
        } else {
          // Normal pagination - show current page
          setCommits(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCommits();
  }, [repoPath, searchQuery.trim() ? searchQuery : page]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCommits([]);
      return;
    }
    // Filter commits based on search query
    const filtered = allCommits.filter((commit) =>
      commit.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCommits(filtered);
    setPage(0); // Reset to first page when search changes
  }, [searchQuery, allCommits]);

  // Paginate filtered results for display
  useEffect(() => {
    if (searchQuery.trim()) {
      const startIdx = page * PAGE_SIZE;
      const endIdx = startIdx + PAGE_SIZE;
      setCommits(filteredCommits.slice(startIdx, endIdx));
    }
  }, [page, filteredCommits, searchQuery]);

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(0, p - 1));
  const firstPage = () => setPage(0);
  const lastPage = () => {
    const pages = searchQuery.trim() 
      ? Math.ceil(filteredCommits.length / PAGE_SIZE)
      : totalPages;
    if (pages !== null) {
      setPage(pages - 1);
    }
  };

  const totalPages = searchQuery.trim()
    ? Math.ceil(filteredCommits.length / PAGE_SIZE)
    : (totalCommits !== null && typeof totalCommits === 'number' 
        ? Math.ceil(totalCommits / PAGE_SIZE) 
        : null);

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Commits</h1>
          {totalCommits !== null && (
            <span className="pt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
              {totalCommits} total
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search commits..."
              className="w-64 pl-9"
            />
          </div>
          {searchQuery.trim() ? (
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {filteredCommits.length} result{filteredCommits.length !== 1 ? 's' : ''} 
              {totalPages > 1 && ` - Page ${page + 1} of ${totalPages}`}
            </div>
          ) : (
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {totalPages !== null ? `Page ${page + 1} of ${totalPages}` : `Page ${page + 1}`}
            </div>
          )}
          <Button variant="outline" size="sm" disabled={page === 0} onClick={firstPage} aria-label="First page">
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled={page === 0} onClick={prevPage} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled={totalPages === null || page + 1 >= totalPages} onClick={nextPage} aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled={totalPages === null || page + 1 >= totalPages} onClick={lastPage} aria-label="Last page">
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {loading && <CommitListSkeleton />}
      {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
      {!loading && !error && (
        <div className="space-y-3">
          {commits.map((c) => (
            <CommitCard key={c.hash} commit={c} repoPath={repoPath} />
          ))}
          {commits.length === 0 && searchQuery.trim() && (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <p className="text-sm">No results found for "{searchQuery}"</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          )}
          {commits.length === 0 && !searchQuery.trim() && (
            <div className="text-sm text-slate-500">No commits found.</div>
          )}
        </div>
      )}
    </div>
  );
}
