'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Zap, ArrowLeftRight, RotateCcw } from 'lucide-react';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  leftNum: number | null;
  rightNum: number | null;
  left: string;
  right: string;
}

function computeDiff(left: string, right: string): DiffLine[] {
  const leftLines = left.split('\n');
  const rightLines = right.split('\n');
  const result: DiffLine[] = [];

  const maxLen = Math.max(leftLines.length, rightLines.length);

  // Simple LCS-based diff
  const lcs = (a: string[], b: string[]): number[][] => {
    const m = a.length;
    const n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i]![j] = a[i - 1] === b[j - 1] ? (dp[i - 1]?.[j - 1] ?? 0) + 1 : Math.max(dp[i - 1]?.[j] ?? 0, dp[i]?.[j - 1] ?? 0);
      }
    }
    return dp;
  };

  const dp = lcs(leftLines, rightLines);
  let i = leftLines.length;
  let j = rightLines.length;
  const temp: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && leftLines[i - 1] === rightLines[j - 1]) {
      temp.unshift({
        type: 'unchanged',
        leftNum: i,
        rightNum: j,
        left: leftLines[i - 1] ?? '',
        right: rightLines[j - 1] ?? '',
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || (dp[i]?.[j - 1] ?? 0) >= (dp[i - 1]?.[j] ?? 0))) {
      temp.unshift({
        type: 'added',
        leftNum: null,
        rightNum: j,
        left: '',
        right: rightLines[j - 1] ?? '',
      });
      j--;
    } else {
      temp.unshift({
        type: 'removed',
        leftNum: i,
        rightNum: null,
        left: leftLines[i - 1] ?? '',
        right: '',
      });
      i--;
    }
  }

  return temp;
}

export default function DiffChecker() {
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side');

  const diffLines = useMemo(() => {
    if (!leftText && !rightText) return [];
    return computeDiff(leftText, rightText);
  }, [leftText, rightText]);

  const stats = useMemo(() => {
    const added = diffLines.filter((l) => l.type === 'added').length;
    const removed = diffLines.filter((l) => l.type === 'removed').length;
    const unchanged = diffLines.filter((l) => l.type === 'unchanged').length;
    return { added, removed, unchanged, total: diffLines.length };
  }, [diffLines]);

  const swapTexts = () => {
    const temp = leftText;
    setLeftText(rightText);
    setRightText(temp);
  };

  const clearAll = () => {
    setLeftText('');
    setRightText('');
  };

  const copyDiff = () => {
    const lines = diffLines.map((line) => {
      const prefix = line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  ';
      return prefix + (line.type === 'added' ? line.right : line.type === 'removed' ? line.left : line.left);
    });
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-teal-600/20 text-teal-300 px-4 py-2 rounded-full text-sm mb-4">
            <Zap className="w-4 h-4" />
            <span>Free Tool</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Text{' '}
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Diff Checker
            </span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Compare two blocks of text side-by-side. Instantly see additions, removals, and unchanged lines with color-coded highlighting.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <button
            onClick={swapTexts}
            className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm transition"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Swap
          </button>
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm transition"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={copyDiff}
            disabled={diffLines.length === 0}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Diff'}
          </button>
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1.5 rounded-md text-sm transition ${viewMode === 'side-by-side' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              Side by Side
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`px-3 py-1.5 rounded-md text-sm transition ${viewMode === 'unified' ? 'bg-teal-600 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              Unified
            </button>
          </div>
        </div>

        {/* Input Areas */}
        {viewMode === 'side-by-side' ? (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Original Text</label>
              <textarea
                value={leftText}
                onChange={(e) => setLeftText(e.target.value)}
                placeholder="Paste original text here..."
                className="w-full h-48 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 font-mono text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Modified Text</label>
              <textarea
                value={rightText}
                onChange={(e) => setRightText(e.target.value)}
                placeholder="Paste modified text here..."
                className="w-full h-48 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 font-mono text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
              />
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <textarea
                value={leftText}
                onChange={(e) => setLeftText(e.target.value)}
                placeholder="Paste original text here..."
                className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 font-mono text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
              />
              <textarea
                value={rightText}
                onChange={(e) => setRightText(e.target.value)}
                placeholder="Paste modified text here..."
                className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 font-mono text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
              />
            </div>
          </div>
        )}

        {/* Stats */}
        {diffLines.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg text-sm font-medium">
              +{stats.added} added
            </span>
            <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg text-sm font-medium">
              -{stats.removed} removed
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-400 px-3 py-1.5 rounded-lg text-sm font-medium">
              {stats.unchanged} unchanged
            </span>
          </div>
        )}

        {/* Diff Output */}
        {diffLines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
          >
            {viewMode === 'side-by-side' ? (
              <div className="grid md:grid-cols-2">
                <div className="border-r border-slate-700">
                  <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-700 text-sm text-slate-400 font-medium">Original</div>
                  <div className="font-mono text-sm overflow-x-auto">
                    {diffLines.map((line, i) => (
                      <div
                        key={`l-${i}`}
                        className={`px-4 py-0.5 flex ${
                          line.type === 'removed'
                            ? 'bg-red-500/10'
                            : line.type === 'added'
                            ? 'bg-slate-900/30 text-slate-600'
                            : ''
                        }`}
                      >
                        <span className="w-10 text-right pr-3 text-slate-600 select-none shrink-0">
                          {line.leftNum ?? ''}
                        </span>
                        <span
                          className={`whitespace-pre ${
                            line.type === 'removed' ? 'text-red-300' : line.type === 'added' ? 'text-slate-600' : 'text-slate-300'
                          }`}
                        >
                          {line.type === 'added' ? '' : line.left}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-700 text-sm text-slate-400 font-medium">Modified</div>
                  <div className="font-mono text-sm overflow-x-auto">
                    {diffLines.map((line, i) => (
                      <div
                        key={`r-${i}`}
                        className={`px-4 py-0.5 flex ${
                          line.type === 'added'
                            ? 'bg-green-500/10'
                            : line.type === 'removed'
                            ? 'bg-slate-900/30 text-slate-600'
                            : ''
                        }`}
                      >
                        <span className="w-10 text-right pr-3 text-slate-600 select-none shrink-0">
                          {line.rightNum ?? ''}
                        </span>
                        <span
                          className={`whitespace-pre ${
                            line.type === 'added' ? 'text-green-300' : line.type === 'removed' ? 'text-slate-600' : 'text-slate-300'
                          }`}
                        >
                          {line.type === 'removed' ? '' : line.right}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="font-mono text-sm overflow-x-auto">
                {diffLines.map((line, i) => {
                  if (line.type === 'unchanged') {
                    return (
                      <div key={i} className="px-4 py-0.5 flex text-slate-300">
                        <span className="w-10 text-right pr-3 text-slate-600 select-none shrink-0">{line.leftNum}</span>
                        <span className="w-6 text-center text-slate-600 shrink-0"> </span>
                        <span className="whitespace-pre">{line.left}</span>
                      </div>
                    );
                  }
                  if (line.type === 'removed') {
                    return (
                      <div key={i} className="px-4 py-0.5 flex bg-red-500/10 text-red-300">
                        <span className="w-10 text-right pr-3 text-red-500/50 select-none shrink-0">{line.leftNum}</span>
                        <span className="w-6 text-center text-red-400 shrink-0">-</span>
                        <span className="whitespace-pre">{line.left}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="px-4 py-0.5 flex bg-green-500/10 text-green-300">
                      <span className="w-10 text-right pr-3 text-green-500/50 select-none shrink-0">{line.rightNum}</span>
                      <span className="w-6 text-center text-green-400 shrink-0">+</span>
                      <span className="whitespace-pre">{line.right}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {diffLines.length === 0 && (leftText || rightText) && (
          <div className="text-center py-12 text-slate-400">
            <p>No differences found — the texts are identical.</p>
          </div>
        )}
      </div>
    </div>
  );
}
