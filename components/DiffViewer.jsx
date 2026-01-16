"use client";

import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Plus, Minus, Eye, FileDiff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CodeBlock from '@/components/CodeBlock';
import CopyButton from '@/components/CopyButton';

function parseDiff(diffText) {
  const files = [];
  if (!diffText) return files;
  const lines = diffText.split('\n');
  let current = null;
  lines.forEach((line) => {
    if (line.startsWith('diff --git')) {
      const parts = line.split(' ');
      const fileA = parts[2]?.replace('a/', '') || '';
      current = { filePath: fileA, hunks: [], additions: 0, deletions: 0 };
      files.push(current);
    } else if (line.startsWith('@@')) {
      if (!current) return;
      current.hunks.push({ header: line, lines: [] });
    } else if (current && current.hunks.length > 0) {
      current.hunks[current.hunks.length - 1].lines.push(line);
      if (line[0] === '+') current.additions++;
      if (line[0] === '-') current.deletions++;
    }
  });
  return files;
}

function Line({ line, index }) {
  const symbol = line[0];
  const content = line.slice(1);
  const baseClass = 'whitespace-pre font-mono text-xs';
  const style =
    symbol === '+'
      ? 'diff-add text-success'
      : symbol === '-'
      ? 'diff-del text-danger'
      : 'diff-context text-text-light dark:text-text-dark';
  return (
    <div className={cn('grid grid-cols-[52px_1fr] border-b border-border-light dark:border-border-dark', style)}>
      <div className="flex gap-2 border-r border-border-light dark:border-border-dark px-2 py-1 font-mono text-[11px] text-text-light-secondary dark:text-text-dark-secondary">
        <span>{symbol}</span>
        <span>{index + 1}</span>
      </div>
      <pre className={cn(baseClass, 'px-3 py-1')}>{content}</pre>
    </div>
  );
}

export default function DiffViewer({ diff, selectedFile, hash, repoPath, parentHash }) {
  const parsed = useMemo(() => parseDiff(diff), [diff]);
  const [collapsed, setCollapsed] = useState({});
  const [viewMode, setViewMode] = useState({}); // 'diff', 'old', or 'new'
  const [fileContent, setFileContent] = useState({});
  const [loading, setLoading] = useState({});

  const filteredFiles = useMemo(() => {
    if (!selectedFile) return parsed;
    return parsed.filter(file => file.filePath === selectedFile);
  }, [parsed, selectedFile]);

  const fetchFileContent = async (filePath, version) => {
    const key = `${filePath}-${version}`;
    if (fileContent[key]) {
      setViewMode(prev => ({ ...prev, [filePath]: version }));
      return;
    }

    if (!hash || !repoPath) {
      console.error('Missing hash or repoPath');
      return;
    }

    setLoading(prev => ({ ...prev, [key]: true }));
    try {
      // For 'old', use parent commit hash, for 'new' use current hash
      const commitHash = version === 'old' ? parentHash : hash;
      if (version === 'old' && !parentHash) {
        console.error('No parent commit available');
        setLoading(prev => ({ ...prev, [key]: false }));
        return;
      }
      
      console.log('Fetching blob:', { commitHash, filePath, version });
      const res = await fetch(`/api/blob?repoPath=${encodeURIComponent(repoPath)}&hash=${commitHash}&path=${encodeURIComponent(filePath)}`);
      const data = await res.json();
      
      console.log('Blob response:', { ok: res.ok, data });
      
      if (!res.ok) {
        console.error('Blob fetch failed:', data?.error);
        throw new Error(data?.error || 'Failed to load file');
      }
      
      setFileContent(prev => ({ ...prev, [key]: data }));
      setViewMode(prev => ({ ...prev, [filePath]: version }));
    } catch (err) {
      console.error('Error fetching file:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  if (!diff) {
    return <div className="text-sm text-slate-600 dark:text-slate-400">No diff available.</div>;
  }

  if (selectedFile && filteredFiles.length === 0) {
    return <div className="text-sm text-slate-600 dark:text-slate-400">No diff found for selected file.</div>;
  }

  return (
    <div className="space-y-4">
      {filteredFiles.map((file, idx) => {
        const isCollapsed = collapsed[file.filePath];
        const mode = viewMode[file.filePath] || 'diff';
        const contentKey = `${file.filePath}-${mode}`;
        const isLoadingContent = loading[contentKey];

        return (
          <div key={`${file.filePath}-${idx}`} className="overflow-hidden rounded-md border border-slate-200 dark:border-slate-800">
            <div className="flex w-full items-center justify-between bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 dark:bg-slate-900 dark:text-slate-100">
              <button
                className="flex items-center gap-2 flex-1"
                onClick={() => setCollapsed((prev) => ({ ...prev, [file.filePath]: !isCollapsed }))}
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="font-mono">{file.filePath}</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-background-secondary dark:bg-background-dark rounded-lg">
                  <button
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      mode === 'old' 
                        ? 'bg-danger text-white' 
                        : 'text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light dark:hover:text-text-dark hover:bg-background-light-secondary dark:hover:bg-background-dark-secondary'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchFileContent(file.filePath, 'old');
                    }}
                    disabled={isLoadingContent}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <Minus className="h-3 w-3" />
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      mode === 'diff' 
                        ? 'bg-primary text-white' 
                        : 'text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light dark:hover:text-text-dark hover:bg-background-light-secondary dark:hover:bg-background-dark-secondary'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewMode(prev => ({ ...prev, [file.filePath]: 'diff' }));
                    }}
                  >
                    <FileDiff className="h-4 w-4" />
                  </button>
                  <button
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      mode === 'new' 
                        ? 'bg-success text-white' 
                        : 'text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light dark:hover:text-text-dark hover:bg-background-light-secondary dark:hover:bg-background-dark-secondary'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchFileContent(file.filePath, 'new');
                    }}
                    disabled={isLoadingContent}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="gap-1 bg-success/10 text-success border-success/30">
                    <Plus className="h-3 w-3" />
                    {file.additions}
                  </Badge>
                  <Badge variant="outline" className="gap-1 bg-danger/10 text-danger border-danger/30">
                    <Minus className="h-3 w-3" />
                    {file.deletions}
                  </Badge>
                </div>
              </div>
            </div>
            {!isCollapsed && (
              <div className="bg-white dark:bg-slate-950">
                {mode === 'diff' && file.hunks.map((hunk, hIdx) => (
                  <div key={`${file.filePath}-hunk-${hIdx}`} className="border-b border-slate-200 dark:border-slate-800">
                    <div className="bg-slate-100 px-3 py-1 font-mono text-[11px] text-slate-600 dark:bg-slate-900 dark:text-slate-400">{hunk.header}</div>
                    {hunk.lines.map((line, lIdx) => (
                      <Line key={`${file.filePath}-line-${hIdx}-${lIdx}`} line={line} index={lIdx} />
                    ))}
                  </div>
                ))}
                {mode !== 'diff' && (
                  <div>
                    {isLoadingContent ? (
                      <div className="text-center text-sm text-slate-500 p-4">Loading...</div>
                    ) : fileContent[contentKey] ? (
                      <div>
                        <div className="flex items-center justify-between bg-slate-100 px-3 py-2 border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {mode === 'old' ? 'Previous version' : 'Current version'}
                          </span>
                          <CopyButton value={fileContent[contentKey].content} />
                        </div>
                        <div className="p-4">
                          <CodeBlock content={fileContent[contentKey].content} language={fileContent[contentKey].language} />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-sm text-slate-500 p-4">
                        Click Old or New to view file content
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
