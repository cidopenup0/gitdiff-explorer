"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Moon, Sun, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function getStoredTheme() {
  if (typeof window === 'undefined') return 'light';
  return localStorage.getItem('theme') || 'light';
}

export default function Navbar() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = getStoredTheme();
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', next);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', next === 'dark');
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-slate-900 dark:text-slate-100 no-underline hover:no-underline">
          <GitBranch className="h-5 w-5" />
          <span className="text-sm font-semibold">GitDiff Explorer</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className={cn('border border-slate-200 dark:border-slate-800')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
