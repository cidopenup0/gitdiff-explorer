# Git Snapshot Explorer

A clean, fast web app to explore local Git repositories. Browse commits, view diffs, and inspect files at any commit with a GitHub-like interface.

## Features

- Browse commit history with full metadata
- View unified diffs for any commit
- Explore repository structure at any point in time
- View file snapshots with syntax highlighting
- Light/dark theme toggle
- Clean, minimal UI

## Tech Stack

- Next.js App Router
- React + TailwindCSS
- highlight.js for code syntax highlighting
- Git operations via Node.js child_process

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 and enter a local Git repository path (e.g., `C:\projects\myrepo` or `/home/user/projects/myrepo`)

## How It Works

- Enter a valid local Git repository path
- Browse the commit history with pagination and search
- Click any commit to view its changes
- Use the diff/old/new viewers to inspect file changes
- Navigate the repository tree at any point in history

## Limits

- Diff preview: 2MB max
- File preview: 1MB max
- Binary files: Git download command provided
