"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Check, AlertTriangle, Loader2 } from 'lucide-react';
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
    <div className="w-full">
      <div className="flex gap-3 mb-4">
        <Input
          value={repoPath}
          onChange={(e) => setRepoPath(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="C:/projects/my-repo"
          autoComplete="off"
          className="flex-1 h-14 px-5 text-base bg-background-light dark:bg-background-dark-secondary border-2 border-border-light dark:border-border-dark rounded-xl focus:border-primary dark:focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-text-light dark:text-text-dark placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary"
        />
        <Button 
          onClick={validateRepo} 
          disabled={!repoPath || loading} 
          type="button" 
          className="h-14 px-10 bg-primary hover:bg-primary-hover disabled:bg-text-light-secondary dark:disabled:bg-text-dark-secondary disabled:cursor-not-allowed disabled:opacity-60 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
            </>
          ) : (
            <>
              Browse
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>
      
      {status?.type === 'success' && (
        <div className="flex items-center gap-2 text-sm font-medium text-success px-4 py-2 rounded-lg bg-success/10">
          <Check className="h-4 w-4" /> {status.message}
        </div>
      )}
      {status?.type === 'error' && (
        <div className="flex items-center gap-2 text-sm font-medium text-danger px-4 py-2 rounded-lg bg-danger/10">
          <AlertTriangle className="h-4 w-4" /> {status.message}
        </div>
      )}
    </div>
  );
}
