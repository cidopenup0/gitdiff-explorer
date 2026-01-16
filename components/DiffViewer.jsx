"use client";

import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';

function parseDiff(diffText) {
  const files = [];
  if (!diffText) return files;
  const lines = diffText.split('\n');
  let current = null;
  lines.forEach((line) => {
    if (line.startsWith('diff --git')) {
      const parts = line.split(' ');
      const fileA = parts[2]?.replace('a/', '') || '';
      current = { filePath: fileA, hunks: [] };
      files.push(current);
    } else if (line.startsWith('@@')) {
      if (!current) return;
      current.hunks.push({ header: line, lines: [] });
    } else if (current && current.hunks.length > 0) {
      current.hunks[current.hunks.length - 1].lines.push(line);
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
      ? 'diff-add text-green-700 dark:text-green-400'
      : symbol === '-'
      ? 'diff-del text-red-700 dark:text-red-400'
      : 'diff-context text-slate-800 dark:text-slate-200';
  return (
    <div className={cn('grid grid-cols-[52px_1fr] border-b border-slate-100/70 dark:border-slate-800/60', style)}>
      <div className="flex gap-2 border-r border-slate-100/80 px-2 py-1 font-mono text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span>{symbol}</span>
        <span>{index + 1}</span>
      </div>
      <pre className={cn(baseClass, 'px-3 py-1')}>{content}</pre>
    </div>
  );
}

export default function DiffViewer({ diff, selectedFile }) {
  const parsed = useMemo(() => parseDiff(diff), [diff]);
  const [collapsed, setCollapsed] = useState({});

  const filteredFiles = useMemo(() => {
    if (!selectedFile) return parsed;
    return parsed.filter(file => file.filePath === selectedFile);
  }, [parsed, selectedFile]);

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
        return (
          <div key={`${file.filePath}-${idx}`} className="overflow-hidden rounded-md border border-slate-200 dark:border-slate-800">
            <button
              className="flex w-full items-center justify-between bg-slate-50 px-3 py-2 text-left text-sm font-semibold text-slate-800 dark:bg-slate-900 dark:text-slate-100"
              onClick={() => setCollapsed((prev) => ({ ...prev, [file.filePath]: !isCollapsed }))}
            >
              <div className="flex items-center gap-2">
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="font-mono">{file.filePath}</span>
              </div>
              <span className="text-xs text-slate-500">{file.hunks.length} hunks</span>
            </button>
            {!isCollapsed && (
              <div className="bg-white dark:bg-slate-950">
                {file.hunks.map((hunk, hIdx) => (
                  <div key={`${file.filePath}-hunk-${hIdx}`} className="border-b border-slate-200 dark:border-slate-800">
                    <div className="bg-slate-100 px-3 py-1 font-mono text-[11px] text-slate-600 dark:bg-slate-900 dark:text-slate-400">{hunk.header}</div>
                    {hunk.lines.map((line, lIdx) => (
                      <Line key={`${file.filePath}-line-${hIdx}-${lIdx}`} line={line} index={lIdx} />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
