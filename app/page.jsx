"use client";

import React from 'react';
import RepoInput from '@/components/RepoInput';
import { Button } from '@/components/ui/button';
import { ArrowRight, GitBranch, ShieldCheck, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-x-20 top-10 h-64 bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-emerald-500/15 blur-3xl" />
        <div className="absolute inset-x-32 bottom-0 h-80 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24">
        <header className="flex flex-col gap-10 md:grid md:grid-cols-[1.2fr_1fr] md:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-white/10">
              <Sparkles className="h-3.5 w-3.5" />
              GitDiff Explorer
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl text-slate-50">
                A calm way to browse commits, diffs, and history.
              </h1>
              <p className="max-w-2xl text-base text-slate-200/80 md:text-lg">
                Point to any local repository and get a GitHub-quality view of commits, diffs, and file snapshots—without leaving your machine.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200/70">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10">
                <GitBranch className="h-4 w-4 text-emerald-300" />
                Up to 1000 commits searchable instantly
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Local-only, no data leaves your machine
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button size="lg" className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold">
                Start exploring
                <ArrowRight className="h-4 w-4" />
              </Button>
              <span className="text-sm text-slate-300">Paste a repo path below to begin.</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-emerald-500/5 backdrop-blur">
            <div className="mb-4 flex items-center justify-between text-sm text-slate-200/80">
              <span className="font-semibold text-slate-50">Repository</span>
              <span className="text-xs text-slate-300/70">Works with local paths</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 shadow-inner shadow-black/30">
              <RepoInput />
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-200/70">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px] shadow-emerald-400/20" />
              Real-time diff viewer, commit search, sidebar filters, and file snapshots.
            </div>
          </div>
        </header>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 backdrop-blur"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-50">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-200/75">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-14 grid gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-inner shadow-black/30 md:grid-cols-[1.1fr_1fr]">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300/80">Workflow</p>
            <h2 className="text-2xl font-semibold text-slate-50">Three steps to clarity</h2>
            <p className="text-sm text-slate-200/75">Stay oriented with clean navigation, focused context, and instant previews.</p>
          </div>
          <div className="grid gap-3 text-sm text-slate-100">
            {steps.map((step, idx) => (
              <div key={step.title} className="flex items-start gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-sm font-semibold text-emerald-200 ring-1 ring-emerald-500/25">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-slate-50">{step.title}</div>
                  <div className="text-slate-200/75">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const features = [
  {
    title: 'Diffs without noise',
    desc: 'Sidebars, file filters, and syntax highlighting keep big changes understandable.',
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: 'Search any commit',
    desc: 'Query up to 1000 commits locally with fast pagination and zero network calls.',
    icon: <GitBranch className="h-5 w-5" />,
  },
  {
    title: 'Stay private',
    desc: 'Everything runs on your machine. No uploads, no telemetry, just your repo.',
    icon: <ShieldCheck className="h-5 w-5" />,
  },
];

const steps = [
  {
    title: 'Paste a repository path',
    desc: 'Point to any local Git repo—no setup, no auth prompts.',
  },
  {
    title: 'Browse commits and diffs',
    desc: 'Use the sidebar, search, and pagination to stay oriented in large histories.',
  },
  {
    title: 'Drill into files fast',
    desc: 'Open trees or blobs at any commit with syntax-highlighted previews.',
  },
];
