"use client";

import React from 'react';
import RepoInput from '@/components/RepoInput';
import { GitBranch } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-20 px-4">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mb-14">
        <div className="flex items-center justify-center mb-10">
          <div className="rounded-3xl bg-primary-light dark:bg-primary/20 p-8">
            <GitBranch className="h-10 w-10 text-primary" strokeWidth={2} />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-text-light dark:text-text-dark mb-6 tracking-tight">
          Explore Git History
        </h1>
        
        <p className="text-lg md:text-xl text-text-light-secondary dark:text-text-dark-secondary leading-relaxed max-w-2xl mx-auto">
          Browse commits, view diffs, and explore file<br />snapshots from your local Git repositories
        </p>
      </div>

      {/* Repository Input */}
      <div className="w-full max-w-2xl mb-12">
        <RepoInput />
      </div>
    </div>
  );
}
