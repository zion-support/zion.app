'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Activity, Shield, AlertTriangle, Info } from 'lucide-react';

function calculateEntropy(text: string): number {
  if (!text) return 0;
  const freq: Record<string, number> = {};
  for (const ch of text) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  const len = text.length;
  let entropy = 0;
  for (const ch in freq) {
    const p = freq[ch] / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

function getCharsetSize(text: string): number {
  let size = 0;
  if (/[a-z]/.test(text)) size += 26;
  if (/[A-Z]/.test(text)) size += 26;
  if (/[0-9]/.test(text)) size += 10;
  if (/[^a-zA-Z0-9]/.test(text)) size += 33;
  return size || 1;
}

function getEntropyRating(entropy: number): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  advice: string;
} {
  if (entropy < 2)
    return {
      label: 'Very Low',
      color: 'text-rose-700',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      icon: <AlertTriangle className="h-5 w-5 text-rose-500" />,
      advice: 'Extremely predictable. Easily guessable or brute-forced.',
    };
  if (entropy < 3)
    return {
      label: 'Low',
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
      advice: 'Low diversity. Vulnerable to pattern-based attacks.',
    };
  if (entropy < 4)
    return {
      label: 'Moderate',
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      icon: <Info className="h-5 w-5 text-amber-500" />,
      advice: 'Moderate diversity. Could be stronger for sensitive use.',
    };
  if (entropy < 5)
    return {
      label: 'Good',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      icon: <Shield className="h-5 w-5 text-emerald-500" />,
      advice: 'Good diversity. Suitable for most general purposes.',
    };
  return {
    label: 'Excellent',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: <Shield className="h-5 w-5 text-green-500" />,
    advice: 'Excellent randomness. Hard to predict or brute-force.',
  };
}

function analyzeText(text: string) {
  const charCount = text.length;
  const entropy = calculateEntropy(text);
  const charsetSize = getCharsetSize(text);
  const bruteForceBits = charCount > 0 ? Math.log2(Math.pow(charsetSize, charCount)) : 0;
  const uniqueChars = new Set(text).size;
  const uniqueRatio = charCount > 0 ? uniqueChars / charCount : 0;

  // Character distribution
  const freq: Record<string, number> = {};
  for (const ch of text) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  const topChars = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Pattern detection
  const patterns: string[] = [];
  if (/^(.)\1+$/.test(text)) patterns.push('All identical characters');
  if (/^(012|123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(text))
    patterns.push('Sequential characters detected');
  if (/^(qwerty|asdf|zxcv|password|1234|admin)/i.test(text)) patterns.push('Common keyboard/password pattern');
  if (charCount > 0 && uniqueChars === 1) patterns.push('Single character repeated');
  if (charCount >= 4 && uniqueRatio < 0.25) patterns.push('Very low character diversity');

  // Character class breakdown
  const lower = (text.match(/[a-z]/g) || []).length;
  const upper = (text.match(/[A-Z]/g) || []).length;
  const digits = (text.match(/[0-9]/g) || []).length;
  const special = (text.match(/[^a-zA-Z0-9]/g) || []).length;
  const whitespace = (text.match(/\s/g) || []).length;

  return {
    charCount,
    entropy,
    charsetSize,
    bruteForceBits,
    uniqueChars,
    uniqueRatio,
    topChars,
    patterns,
    classes: { lower, upper, digits, special, whitespace },
  };
}

const EXAMPLES = [
  { label: 'Password "abc123"', value: 'abc123' },
  { label: 'Strong password', value: 'kX9#mP2$vL7!qR4@' },
  { label: 'English sentence', value: 'The quick brown fox jumps over the lazy dog.' },
  { label: 'Random hex (32)', value: 'a3f7b2c9d1e84f6a0b5c3d7e9f1a2b4c' },
  { label: 'UUID', value: '550e8400-e29b-41d4-a716-446655440000' },
  { label: 'Base64 blob', value: 'SGVsbG8gV29ybGQhIFRoaXMgaXMgYSB0ZXN0Lg==' },
  { label: 'Repeating', value: 'aaaaaaaaaa' },
  { label: 'Binary', value: '010101010101010101010101' },
];

export default function StringEntropyAnalyzer() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const analysis = useMemo(() => analyzeText(input), [input]);
  const rating = getEntropyRating(analysis.entropy);

  const copyValue = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">String Entropy Analyzer</h1>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Analyze the randomness, diversity, and information density of any string. Useful for password strength assessment,
              data quality checks, and security audits.
            </p>
          </div>

          {/* Input */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-slate-800">Input String</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a string, password, hash, or any text to analyze..."
              className="h-28 w-full resize-y rounded-xl border border-slate-300 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => setInput(ex.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 transition hover:border-amber-300 hover:bg-amber-50"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {input.length > 0 && (
            <>
              {/* Entropy Rating Card */}
              <div className={`mb-6 rounded-2xl border ${rating.borderColor} ${rating.bgColor} p-6 shadow-sm`}>
                <div className="flex items-center gap-3">
                  {rating.icon}
                  <div>
                    <p className={`text-lg font-bold ${rating.color}`}>
                      Entropy: {analysis.entropy.toFixed(3)} bits/char — {rating.label}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{rating.advice}</p>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Characters</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-slate-900">{analysis.charCount}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Unique chars</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-slate-900">
                    {analysis.uniqueChars}
                    <span className="ml-1 text-sm text-slate-400">({(analysis.uniqueRatio * 100).toFixed(0)}%)</span>
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Charset size</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-slate-900">{analysis.charsetSize}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Brute-force bits</p>
                  <div className="flex items-center gap-2">
                    <p className="mt-1 font-mono text-2xl font-bold text-slate-900">{analysis.bruteForceBits.toFixed(1)}</p>
                    <button
                      onClick={() => copyValue(analysis.bruteForceBits.toFixed(1), 'bits')}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100"
                    >
                      {copied === 'bits' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Character Class Breakdown */}
              <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-slate-800">Character Class Breakdown</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Lowercase (a-z)', count: analysis.classes.lower, color: 'bg-blue-500' },
                    { label: 'Uppercase (A-Z)', count: analysis.classes.upper, color: 'bg-violet-500' },
                    { label: 'Digits (0-9)', count: analysis.classes.digits, color: 'bg-emerald-500' },
                    { label: 'Special chars', count: analysis.classes.special, color: 'bg-amber-500' },
                    { label: 'Whitespace', count: analysis.classes.whitespace, color: 'bg-slate-400' },
                  ].map((cls) => (
                    <div key={cls.label} className="flex items-center gap-3">
                      <span className="w-32 text-xs font-medium text-slate-600">{cls.label}</span>
                      <div className="flex-1">
                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${cls.color}`}
                            style={{
                              width: analysis.charCount > 0 ? `${(cls.count / analysis.charCount) * 100}%` : '0%',
                            }}
                          />
                        </div>
                      </div>
                      <span className="w-16 text-right font-mono text-xs text-slate-700">
                        {cls.count} ({analysis.charCount > 0 ? ((cls.count / analysis.charCount) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Characters */}
              {analysis.topChars.length > 0 && (
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-sm font-semibold text-slate-800">Most Frequent Characters</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.topChars.map(([ch, count]) => (
                      <div
                        key={ch}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5"
                      >
                        <span className="font-mono text-sm font-bold text-slate-800">
                          {ch === ' ' ? '␣' : ch === '\n' ? '↵' : ch === '\t' ? '⇥' : ch}
                        </span>
                        <span className="text-xs text-slate-500">
                          ×{count} ({((count / analysis.charCount) * 100).toFixed(0)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pattern Warnings */}
              {analysis.patterns.length > 0 && (
                <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-800">
                    <AlertTriangle className="h-4 w-4" /> Pattern Warnings
                  </h3>
                  <ul className="space-y-1">
                    {analysis.patterns.map((p) => (
                      <li key={p} className="text-sm text-orange-700">
                        • {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Entropy Scale */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-slate-800">Entropy Reference Scale</h3>
                <div className="space-y-2">
                  {[
                    { range: '< 2.0 bits', label: 'Very Low', desc: 'Single charset, predictable', color: 'bg-rose-500' },
                    { range: '2.0 – 2.9', label: 'Low', desc: 'Limited charset, some patterns', color: 'bg-orange-500' },
                    { range: '3.0 – 3.9', label: 'Moderate', desc: 'Mixed charset, moderate diversity', color: 'bg-amber-500' },
                    { range: '4.0 – 4.9', label: 'Good', desc: 'Good diversity, strong for most uses', color: 'bg-emerald-500' },
                    { range: '≥ 5.0', label: 'Excellent', desc: 'Full charset, near-maximum randomness', color: 'bg-green-500' },
                  ].map((s) => (
                    <div key={s.range} className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${s.color}`} />
                      <span className="w-20 font-mono text-xs text-slate-600">{s.range}</span>
                      <span className="w-20 text-xs font-semibold text-slate-800">{s.label}</span>
                      <span className="text-xs text-slate-500">{s.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
