"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Moon, Sun, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border-light dark:border-border-dark bg-background-light/95 backdrop-blur-md dark:bg-background-dark/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-text-light dark:text-text-dark no-underline hover:no-underline group">
          <div className="rounded-xl bg-primary p-2.5 shadow-sm">
            <GitBranch className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold tracking-tight">GitDiff Explorer</span>
        </Link>
        <div className="flex items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="rounded-lg hover:bg-background-light-secondary dark:hover:bg-background-dark-secondary text-text-light dark:text-text-dark transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
