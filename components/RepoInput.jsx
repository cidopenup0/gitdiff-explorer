"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Check, AlertTriangle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RepoInput() {
  const [repoPath, setRepoPath] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateRepo = async () => {
    if (!repoPath || loading) return;
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/validate?repoPath=${encodeURIComponent(repoPath)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Validation failed');
      localStorage.setItem('repoPath', data.repoPath);
      setStatus({ type: 'success', message: 'Repository validated.' });
      router.push(`/repo/commits?repoPath=${encodeURIComponent(data.repoPath)}`);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      validateRepo();
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Select a Git repository</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Enter a local path to a Git worktree (example: C:\\projects\\myrepo).</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={repoPath}
          onChange={(e) => setRepoPath(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="C:/projects/myrepo"
          autoComplete="off"
        />
        <div className="flex items-center gap-2">
          <Button onClick={validateRepo} disabled={!repoPath || loading} type="button">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Validate Repo'}
          </Button>
          {status?.type === 'success' && (
            <div className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
              <Check className="h-4 w-4" /> {status.message}
            </div>
          )}
          {status?.type === 'error' && (
            <div className="inline-flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" /> {status.message}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
