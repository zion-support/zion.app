'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RotateCcw, Search, AlertCircle, Info } from 'lucide-react';

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

const COMMON_PATTERNS = [
  { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'g' },
  { name: 'URL', pattern: 'https?://[\\w.-]+(?:\\.[a-zA-Z]{2,})(?:/[\\w./?%&=-]*)?', flags: 'gi' },
  { name: 'IPv4', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g' },
  { name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}', flags: 'g' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])', flags: 'g' },
  { name: 'Hex Color', pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b', flags: 'gi' },
  { name: 'HTML Tag', pattern: '<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>.*?</\\1>', flags: 'gs' },
  { name: 'Slug', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', flags: '' },
  { name: 'UUID', pattern: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', flags: 'gi' },
  { name: 'Credit Card', pattern: '\\b(?:\\d[ -]*?){13,19}\\b', flags: 'g' },
];

const SAMPLE_TEXT = `Contact us at hello@example.com or support@zion.app
Visit https://example.com/docs for documentation
Server IP: 192.168.1.1, Phone: (555) 123-4567
Date: 2026-03-30, Colors: #ff5733, #3498db
UUID: 550e8400-e29b-41d4-a716-446655440000`;

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState(SAMPLE_TEXT);
  const [copied, setCopied] = useState(false);

  const { matches, error, highlightedText } = useMemo(() => {
    if (!pattern) {
      return { matches: [] as MatchResult[], error: null, highlightedText: testText };
    }

    try {
      const regex = new RegExp(pattern, flags);
      const results: MatchResult[] = [];
      let match: RegExpExecArray | null;

      if (flags.includes('g') || flags.includes('y')) {
        while ((match = regex.exec(testText)) !== null) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testText);
        if (match) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      // Build highlighted text
      if (results.length === 0) {
        return { matches: results, error: null, highlightedText: testText };
      }

      let highlighted = '';
      let lastIndex = 0;
      const sortedMatches = [...results].sort((a, b) => a.index - b.index);

      for (const m of sortedMatches) {
        highlighted += escapeHtml(testText.slice(lastIndex, m.index));
        highlighted += `<mark class="bg-yellow-200 text-yellow-900 rounded px-0.5">${escapeHtml(m.match)}</mark>`;
        lastIndex = m.index + m.match.length;
      }
      highlighted += escapeHtml(testText.slice(lastIndex));

      return { matches: results, error: null, highlightedText: highlighted };
    } catch (e) {
      return {
        matches: [] as MatchResult[],
        error: (e as Error).message,
        highlightedText: testText,
      };
    }
  }, [pattern, flags, testText]);

  const handleCopy = useCallback(async () => {
    const code = `const regex = new RegExp('${pattern}', '${flags}');`;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [pattern, flags]);

  const applyPreset = useCallback((preset: (typeof COMMON_PATTERNS)[0]) => {
    setPattern(preset.pattern);
    setFlags(preset.flags);
  }, []);

  const reset = useCallback(() => {
    setPattern('');
    setFlags('g');
    setTestText(SAMPLE_TEXT);
  }, []);

  const toggleFlag = useCallback((flag: string) => {
    setFlags((prev) => (prev.includes(flag) ? prev.replace(flag, '') : prev + flag));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-white">
              <Search className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Regex Tester</h1>
          </div>
          <p className="text-slate-600">
            Test regular expressions against text with real-time match highlighting, capture group inspection, and common pattern presets.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pattern Input */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
            {/* Regex Pattern */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pattern</label>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="text-slate-400 font-mono text-lg">/</span>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Enter regex pattern..."
                  className="flex-1 bg-transparent font-mono text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  spellCheck={false}
                  autoComplete="off"
                />
                <span className="text-slate-400 font-mono text-lg">/</span>
                <span className="text-violet-600 font-mono text-sm font-semibold">{flags || '-'}</span>
              </div>
              {error && (
                <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}
            </div>

            {/* Flags */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Flags</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  { flag: 'g', label: 'Global', desc: 'Find all matches' },
                  { flag: 'i', label: 'Case Insensitive', desc: 'Ignore case' },
                  { flag: 'm', label: 'Multiline', desc: '^ and $ match line boundaries' },
                  { flag: 's', label: 'DotAll', desc: '. matches newlines' },
                  { flag: 'u', label: 'Unicode', desc: 'Enable unicode matching' },
                ].map(({ flag, label, desc }) => (
                  <button
                    key={flag}
                    onClick={() => toggleFlag(flag)}
                    title={desc}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      flags.includes(flag)
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span className="font-mono">{flag}</span> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Text */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Test String</label>
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                rows={8}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-y"
                placeholder="Paste text to test against..."
                spellCheck={false}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!pattern}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy as JS'}
              </button>
              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
            {/* Highlighted Text */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Highlighted Text</label>
                <span className="text-xs font-semibold text-violet-600">
                  {matches.length} match{matches.length !== 1 ? 'es' : ''}
                </span>
              </div>
              <div
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 whitespace-pre-wrap break-words min-h-[120px] max-h-[300px] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: highlightedText }}
              />
            </div>

            {/* Match Details */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Match Details</label>
              {matches.length === 0 ? (
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                  <Info className="w-4 h-4" />
                  {pattern ? 'No matches found' : 'Enter a pattern to see matches'}
                </div>
              ) : (
                <div className="mt-3 max-h-[300px] overflow-y-auto space-y-2">
                  {matches.map((m, i) => (
                    <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Match {i + 1}</span>
                        <span className="text-xs text-slate-400 font-mono">index: {m.index}</span>
                      </div>
                      <div className="mt-1 font-mono text-sm text-violet-700 break-all bg-violet-50 px-2 py-1 rounded">
                        {m.match || <span className="text-slate-400 italic">empty string</span>}
                      </div>
                      {m.groups.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs font-semibold text-slate-500">Groups:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {m.groups.map((g, gi) => (
                              <span
                                key={gi}
                                className="rounded bg-amber-100 px-2 py-0.5 text-xs font-mono text-amber-800"
                              >
                                ${gi + 1}: {g || 'undefined'}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Reference */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Quick Reference</label>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {[
                  ['.', 'Any character'],
                  ['\\d', 'Digit [0-9]'],
                  ['\\w', 'Word char [a-zA-Z0-9_]'],
                  ['\\s', 'Whitespace'],
                  ['\\b', 'Word boundary'],
                  ['^', 'Start of string'],
                  ['$', 'End of string'],
                  ['*', '0 or more'],
                  ['+', '1 or more'],
                  ['?', '0 or 1'],
                  ['{n,m}', 'n to m times'],
                  ['[abc]', 'Character class'],
                  ['(…)', 'Capture group'],
                  ['(?:…)', 'Non-capturing group'],
                ].map(([symbol, desc]) => (
                  <div key={symbol as string} className="flex items-center gap-1.5 py-0.5">
                    <code className="text-violet-600 font-mono font-semibold">{symbol}</code>
                    <span className="text-slate-500">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Common Patterns */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Common Patterns</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {COMMON_PATTERNS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm hover:border-amber-300 hover:bg-amber-50 transition group"
              >
                <span className="text-sm font-semibold text-slate-900 group-hover:text-amber-800">{preset.name}</span>
                <code className="mt-1 block text-xs text-slate-400 font-mono truncate group-hover:text-amber-600">
                  {preset.pattern}
                </code>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
