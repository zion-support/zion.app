'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RotateCcw, Type, Sparkles } from 'lucide-react';

type Separator = '-' | '_';
type CaseStyle = 'lower' | 'upper' | 'camel' | 'pascal';

interface SlugOptions {
  separator: Separator;
  caseStyle: CaseStyle;
  removeStopWords: boolean;
  maxLength: number;
  trimNumbers: boolean;
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'up', 'about', 'into', 'over', 'after', 'is', 'it', 'as', 'be', 'was',
  'were', 'been', 'are', 'this', 'that', 'these', 'those', 'am', 'has', 'have', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can',
  'not', 'no', 'so', 'if', 'then', 'than', 'too', 'very', 'just', 'also',
]);

function generateSlug(text: string, options: SlugOptions): string {
  let slug = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[^a-zA-Z0-9\s\-_]/g, '') // remove special chars
    .replace(/[\s\-_]+/g, ' ') // normalize whitespace
    .trim();

  if (options.removeStopWords) {
    slug = slug
      .split(' ')
      .filter((word) => word && !STOP_WORDS.has(word.toLowerCase()))
      .join(' ');
  }

  if (options.trimNumbers) {
    slug = slug.replace(/\b\d+\b/g, '').replace(/\s+/g, ' ').trim();
  }

  const words = slug.split(/\s+/).filter(Boolean);

  switch (options.caseStyle) {
    case 'lower':
      return words.join(options.separator).toLowerCase().slice(0, options.maxLength);
    case 'upper':
      return words.join(options.separator).toUpperCase().slice(0, options.maxLength);
    case 'camel':
      return words
        .map((w, i) =>
          i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
        )
        .join('')
        .slice(0, options.maxLength);
    case 'pascal':
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('')
        .slice(0, options.maxLength);
    default:
      return words.join(options.separator).toLowerCase().slice(0, options.maxLength);
  }
}

const presets = [
  { label: 'Blog Post Title', input: 'How to Build Amazing Web Apps in 2026!' },
  { label: 'Product Name', input: 'Zion AI Platform — Enterprise Edition' },
  { label: 'French Text', input: 'Développement de logiciels pour débutants' },
  { label: 'With Emojis', input: '🚀 Launch Your Startup Today! 🎉' },
  { label: 'Mixed Case & Symbols', input: 'REST_API: Best Practices & Tips!!' },
];

export default function UrlSlugGenerator() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<SlugOptions>({
    separator: '-',
    caseStyle: 'lower',
    removeStopWords: false,
    maxLength: 80,
    trimNumbers: false,
  });

  const slug = input.trim() ? generateSlug(input, options) : '';

  const handleCopy = async () => {
    if (!slug) return;
    try {
      await navigator.clipboard.writeText(slug);
    } catch {
      const el = document.createElement('textarea');
      el.value = slug;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setCopied(false);
  };

  const handlePreset = (text: string) => {
    setInput(text);
    setCopied(false);
  };

  const updateOption = <K extends SlugOptions>(key: keyof K, value: unknown) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  // Generate all case variants
  const variants: Array<{ label: string; value: string }> = input.trim()
    ? [
        { label: 'lowercase', value: generateSlug(input, { ...options, caseStyle: 'lower' }) },
        { label: 'UPPERCASE', value: generateSlug(input, { ...options, caseStyle: 'upper' }) },
        { label: 'camelCase', value: generateSlug(input, { ...options, caseStyle: 'camel' }) },
        { label: 'PascalCase', value: generateSlug(input, { ...options, caseStyle: 'pascal' }) },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">URL Slug Generator</h1>
          <p className="mt-2 text-lg text-slate-600">
            Convert any text to clean, SEO-friendly URL slugs
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Presets */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-slate-600">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handlePreset(p.input)}
                  className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 hover:border-green-400 hover:bg-green-50 hover:text-green-700 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">Input Text</label>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); setCopied(false); }}
              placeholder="Enter your title, heading, or any text..."
              className="h-24 w-full resize-none rounded-xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-900 placeholder-slate-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          {/* Options */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Separator</label>
              <div className="flex gap-2">
                {(['-', '_'] as Separator[]).map((sep) => (
                  <button
                    key={sep}
                    onClick={() => updateOption('separator', sep)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-mono font-semibold transition ${
                      options.separator === sep
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sep === '-' ? 'dash (-)' : 'underscore (_)'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Case Style</label>
              <select
                value={options.caseStyle}
                onChange={(e) => updateOption('caseStyle', e.target.value as CaseStyle)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              >
                <option value="lower">lowercase</option>
                <option value="upper">UPPERCASE</option>
                <option value="camel">camelCase</option>
                <option value="pascal">PascalCase</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Max Length: {options.maxLength}
              </label>
              <input
                type="range"
                min={10}
                max={200}
                value={options.maxLength}
                onChange={(e) => updateOption('maxLength', Number(e.target.value))}
                className="w-full accent-green-600"
              />
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={options.removeStopWords}
                onChange={(e) => updateOption('removeStopWords', e.target.checked)}
                className="accent-green-600"
              />
              Remove stop words
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={options.trimNumbers}
                onChange={(e) => updateOption('trimNumbers', e.target.checked)}
                className="accent-green-600"
              />
              Remove standalone numbers
            </label>
          </div>

          {/* Output */}
          <div className="rounded-xl bg-green-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">Generated Slug</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!slug}
                  className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-40"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 rounded-md border border-green-300 bg-white px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-50"
                >
                  <RotateCcw className="h-3 w-3" />
                  Clear
                </button>
              </div>
            </div>
            <div className="rounded-lg border border-green-200 bg-white p-4">
              {slug ? (
                <code className="text-lg font-mono font-semibold text-slate-900 break-all">{slug}</code>
              ) : (
                <span className="text-sm text-slate-400">Your slug will appear here...</span>
              )}
            </div>
            {slug && (
              <p className="mt-2 text-xs text-green-700">
                {slug.length} characters · Preview: <code className="bg-green-100 px-1 rounded">/blog/{slug}</code>
              </p>
            )}
          </div>

          {/* All variants */}
          {variants.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold text-slate-700">All Case Variants</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {variants.map((v) => (
                  <div
                    key={v.label}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div>
                      <span className="text-xs font-medium text-slate-500">{v.label}</span>
                      <code className="mt-0.5 block text-sm font-mono text-slate-900 break-all">{v.value}</code>
                    </div>
                    <button
                      onClick={async () => {
                        try { await navigator.clipboard.writeText(v.value); } catch {
                          const el = document.createElement('textarea');
                          el.value = v.value;
                          document.body.appendChild(el);
                          el.select();
                          document.execCommand('copy');
                          document.body.removeChild(el);
                        }
                      }}
                      className="ml-2 shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <h3 className="flex items-center gap-1 text-sm font-semibold text-slate-700">
              <Type className="h-4 w-4" /> About URL Slugs
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              URL slugs are human-readable identifiers used in URLs. Best practices: use lowercase,
              separate words with hyphens, keep them short (3–5 words), remove stop words when possible,
              and avoid special characters. Good slugs improve SEO and user experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
