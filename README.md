# GitDiff Explorer

A Next.js (App Router) web app that looks and feels like GitHub to browse any local Git repository. It shows commit history, diffs, trees, and full file snapshots at any commit. Everything is plain JavaScript (no TypeScript).

## Features
- Validate any local Git repo path
- Paginated commit history with metadata
- Commit detail view with changed files and full unified diff
- Browse repository tree at any commit
- View file snapshots with syntax highlighting and copy-to-clipboard
- Graceful handling for binary or large files with a copyable Git download command
- Light/dark theme toggle, GitHub-inspired UI, Tailwind + shadcn-style components

## Stack
- Next.js App Router (JavaScript only)
- React, TailwindCSS, shadcn-style UI primitives
- highlight.js for code highlighting
- Git access via `child_process.spawn` (no shell exec)

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000 and enter a local repo path (e.g., `C:\projects\myrepo`).

## Notes
- Backend validates repo path, commit hash, and tree paths, and enforces diff (2MB) and blob (1MB preview) limits.
- Uses caching for repeated Git queries.
- Works entirely with local repositories; no network Git operations.
