'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RotateCcw, ArrowLeftRight, Plus, Minus, RefreshCw } from 'lucide-react';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'changed';
  path: string;
  leftValue?: string;
  rightValue?: string;
}

function deepDiff(left: unknown, right: unknown, path = ''): DiffLine[] {
  const results: DiffLine[] = [];

  if (left === right) {
    if (path) results.push({ type: 'unchanged', path, leftValue: JSON.stringify(left), rightValue: JSON.stringify(right) });
    return results;
  }

  if (left === null || left === undefined) {
    results.push({ type: 'added', path: path || '(root)', rightValue: JSON.stringify(right) });
    return results;
  }
  if (right === null || right === undefined) {
    results.push({ type: 'removed', path: path || '(root)', leftValue: JSON.stringify(left) });
    return results;
  }

  if (typeof left !== typeof right || Array.isArray(left) !== Array.isArray(right)) {
    results.push({ type: 'changed', path: path || '(root)', leftValue: JSON.stringify(left), rightValue: JSON.stringify(right) });
    return results;
  }

  if (typeof left === 'object' && typeof right === 'object') {
    const leftObj = left as Record<string, unknown>;
    const rightObj = right as Record<string, unknown>;

    if (Array.isArray(left) && Array.isArray(right)) {
      const maxLen = Math.max(left.length, right.length);
      for (let i = 0; i < maxLen; i++) {
        const childPath = `${path}[${i}]`;
        if (i >= left.length) {
          results.push({ type: 'added', path: childPath, rightValue: JSON.stringify(right[i]) });
        } else if (i >= right.length) {
          results.push({ type: 'removed', path: childPath, leftValue: JSON.stringify(left[i]) });
        } else {
          results.push(...deepDiff(left[i], right[i], childPath));
        }
      }
      return results;
    }

    const allKeys = new Set([...Object.keys(leftObj), ...Object.keys(rightObj)]);
    for (const key of allKeys) {
      const childPath = path ? `${path}.${key}` : key;
      if (!(key in leftObj)) {
        results.push({ type: 'added', path: childPath, rightValue: JSON.stringify(rightObj[key]) });
      } else if (!(key in rightObj)) {
        results.push({ type: 'removed', path: childPath, leftValue: JSON.stringify(leftObj[key]) });
      } else {
        results.push(...deepDiff(leftObj[key], rightObj[key], childPath));
      }
    }
    return results;
  }

  results.push({ type: 'changed', path: path || '(root)', leftValue: JSON.stringify(left), rightValue: JSON.stringify(right) });
  return results;
}

function countChanges(diffs: DiffLine[]) {
  return {
    added: diffs.filter((d) => d.type === 'added').length,
    removed: diffs.filter((d) => d.type === 'removed').length,
    changed: diffs.filter((d) => d.type === 'changed').length,
    unchanged: diffs.filter((d) => d.type === 'unchanged').length,
  };
}

const EXAMPLE_LEFT = `{
  "name": "zion-app",
  "version": "1.0.0",
  "dependencies": {
    "next": "14.2.0",
    "react": "18.2.0",
    "tailwindcss": "3.4.0"
  },
  "features": ["ai-tools", "automation"]
}`;

const EXAMPLE_RIGHT = `{
  "name": "zion-app",
  "version": "1.1.0",
  "dependencies": {
    "next": "15.0.0",
    "react": "18.2.0",
    "tailwindcss": "3.4.0",
    "framer-motion": "11.0.0"
  },
  "features": ["ai-tools", "automation", "color-converter"]
}`;

type Filter = 'all' | 'added' | 'removed' | 'changed';

export default function JsonDiffViewer() {
  const [leftInput, setLeftInput] = useState('');
  const [rightInput, setRightInput] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [copied, setCopied] = useState(false);

  const { diffs, counts } = useMemo(() => {
    if (!leftInput.trim() || !rightInput.trim()) return { diffs: [] as DiffLine[], counts: { added: 0, removed: 0, changed: 0, unchanged: 0 } };
    try {
      const left = JSON.parse(leftInput);
      const right = JSON.parse(rightInput);
      setError('');
      const d = deepDiff(left, right);
      return { diffs: d, counts: countChanges(d) };
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      return { diffs: [] as DiffLine[], counts: { added: 0, removed: 0, changed: 0, unchanged: 0 } };
    }
  }, [leftInput, rightInput]);

  const filteredDiffs = filter === 'all' ? diffs : diffs.filter((d) => d.type === filter);

  const loadExample = () => {
    setLeftInput(EXAMPLE_LEFT);
    setRightInput(EXAMPLE_RIGHT);
    setError('');
  };

  const swapInputs = () => {
    setLeftInput(rightInput);
    setRightInput(leftInput);
  };

  const copyDiff = () => {
    const text = filteredDiffs.map((d) => {
      const prefix = d.type === 'added' ? '+' : d.type === 'removed' ? '-' : d.type === 'changed' ? '~' : ' ';
      return `${prefix} ${d.path}: ${d.type === 'removed' ? d.leftValue : d.type === 'added' ? d.rightValue : `${d.leftValue} → ${d.rightValue}`}`;
    }).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const totalChanges = counts.added + counts.removed + counts.changed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            JSON Diff Viewer
          </h1>
          <p className="text-gray-400 text-lg">
            Compare two JSON objects and see structural differences at a glance
          </p>
        </motion.div>

        {/* Input Areas */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
              <button onClick={loadExample} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
                <RefreshCw className="w-3 h-3" /> Load Example
              </button>
              <button onClick={swapInputs} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
                <ArrowLeftRight className="w-3 h-3" /> Swap
              </button>
              <button
                onClick={() => { setLeftInput(''); setRightInput(''); setError(''); }}
                className="text-xs text-gray-400 hover:text-gray-300 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Left (Original)</label>
              <textarea
                value={leftInput}
                onChange={(e) => setLeftInput(e.target.value)}
                placeholder='{\n  "key": "value"\n}'
                className="w-full h-64 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                spellCheck={false}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Right (Modified)</label>
              <textarea
                value={rightInput}
                onChange={(e) => setRightInput(e.target.value)}
                placeholder='{\n  "key": "new_value"\n}'
                className="w-full h-64 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                spellCheck={false}
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </motion.div>

        {/* Stats Bar */}
        {diffs.length > 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 bg-gray-800/30 border border-gray-700/50 rounded-xl p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-4">
                {[
                  { key: 'all' as Filter, label: 'All', count: diffs.length, color: 'text-gray-300' },
                  { key: 'added' as Filter, label: 'Added', count: counts.added, color: 'text-green-400' },
                  { key: 'removed' as Filter, label: 'Removed', count: counts.removed, color: 'text-red-400' },
                  { key: 'changed' as Filter, label: 'Changed', count: counts.changed, color: 'text-yellow-400' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      filter === tab.key
                        ? 'bg-gray-700/50 text-white'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {tab.key === 'added' && <Plus className="w-3.5 h-3.5 text-green-400" />}
                    {tab.key === 'removed' && <Minus className="w-3.5 h-3.5 text-red-400" />}
                    <span className={tab.color}>{tab.count}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">
                  {totalChanges === 0 ? '✅ Identical' : `${totalChanges} difference${totalChanges !== 1 ? 's' : ''}`}
                </span>
                <button onClick={copyDiff} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Diff Results */}
        {filteredDiffs.length > 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/20 border border-gray-700/50 rounded-xl overflow-hidden"
          >
            <div className="divide-y divide-gray-700/30">
              {filteredDiffs.map((diff, i) => (
                <div
                  key={i}
                  className={`px-5 py-3 font-mono text-sm ${
                    diff.type === 'added'
                      ? 'bg-green-500/5 border-l-4 border-l-green-500'
                      : diff.type === 'removed'
                      ? 'bg-red-500/5 border-l-4 border-l-red-500'
                      : diff.type === 'changed'
                      ? 'bg-yellow-500/5 border-l-4 border-l-yellow-500'
                      : 'border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`shrink-0 w-5 text-center font-bold ${
                        diff.type === 'added'
                          ? 'text-green-400'
                          : diff.type === 'removed'
                          ? 'text-red-400'
                          : diff.type === 'changed'
                          ? 'text-yellow-400'
                          : 'text-gray-600'
                      }`}
                    >
                      {diff.type === 'added' ? '+' : diff.type === 'removed' ? '-' : diff.type === 'changed' ? '~' : ' '}
                    </span>
                    <span className="text-purple-300 shrink-0">{diff.path}</span>
                    <span className="text-gray-600">:</span>
                    {diff.type === 'changed' ? (
                      <span className="flex-1 min-w-0">
                        <span className="text-red-400 line-through mr-2 break-all">{diff.leftValue}</span>
                        <span className="text-gray-600 mr-2">→</span>
                        <span className="text-green-400 break-all">{diff.rightValue}</span>
                      </span>
                    ) : diff.type === 'removed' ? (
                      <span className="text-red-400 flex-1 min-w-0 break-all">{diff.leftValue}</span>
                    ) : diff.type === 'added' ? (
                      <span className="text-green-400 flex-1 min-w-0 break-all">{diff.rightValue}</span>
                    ) : (
                      <span className="text-gray-500 flex-1 min-w-0 break-all">{diff.leftValue}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {diffs.length === 0 && !error && !leftInput && !rightInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16 text-gray-500"
          >
            <ArrowLeftRight className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">Paste two JSON objects to compare</p>
            <p className="text-sm">
              Or{' '}
              <button onClick={loadExample} className="text-purple-400 hover:text-purple-300 underline">
                load an example
              </button>
            </p>
          </motion.div>
        )}

        {totalChanges === 0 && leftInput && rightInput && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">✅</div>
            <p className="text-lg text-green-400 font-semibold">JSON objects are identical!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
