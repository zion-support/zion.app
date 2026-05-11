'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, FileCode, Minus, Maximize2, RotateCcw } from 'lucide-react';

function minifyHTML(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s+>/g, '>')
    .replace(/<\s+/g, '<')
    .trim();
}

function beautifyHTML(html: string, indent: string): string {
  let result = '';
  let level = 0;
  const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

  // Simple tokenizer approach
  const tokens = html.split(/(<[^>]+>)/g).filter(Boolean);

  for (const token of tokens) {
    if (token.startsWith('</')) {
      level = Math.max(0, level - 1);
      result += indent.repeat(level) + token.trim() + '\n';
    } else if (token.startsWith('<')) {
      const tagName = token.match(/<([^\s/>]+)/)?.[1]?.toLowerCase() || '';
      const isSelfClose = token.endsWith('/>') || voidTags.has(tagName);
      result += indent.repeat(level) + token.trim() + '\n';
      if (!isSelfClose) level++;
    } else {
      const trimmed = token.trim();
      if (trimmed) {
        result += indent.repeat(level) + trimmed + '\n';
      }
    }
  }
  return result.trim();
}

function getStats(html: string) {
  const tags = (html.match(/<[a-zA-Z][^>]*>/g) || []).length;
  const comments = (html.match(/<!--[\s\S]*?-->/g) || []).length;
  const elements = new Set(
    (html.match(/<\/?([a-zA-Z][a-zA-Z0-9]*)/g) || []).map((t) => t.replace(/<\/?/, '').toLowerCase()),
  );
  return { size: new Blob([html]).size, tags, comments, uniqueElements: elements.size };
}

export default function HTMLMinifierBeautifier() {
  const [input, setInput] = useState('<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n    <meta charset="utf-8">\n  </head>\n  <body>\n    <h1>Hello World</h1>\n    <p>This is a sample paragraph.</p>\n  </body>\n</html>');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'minify' | 'beautify' | null>(null);

  const inputStats = getStats(input);

  const handleMinify = useCallback(() => {
    setOutput(minifyHTML(input));
    setMode('minify');
  }, [input]);

  const handleBeautify = useCallback(() => {
    const indent = ' '.repeat(indentSize);
    setOutput(beautifyHTML(input, indent));
    setMode('beautify');
  }, [input, indentSize]);

  const handleReset = () => {
    setInput('');
    setOutput('');
    setMode(null);
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const savingsPercent = mode === 'minify' && inputStats.size > 0
    ? Math.round((1 - new Blob([output]).size / inputStats.size) * 100)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/20">
              <FileCode className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">HTML Minifier / Beautifier</h1>
            <p className="mt-2 text-slate-600">Minify for production or beautify for readability — with live stats</p>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 flex flex-wrap items-center gap-3"
        >
          <button
            onClick={handleMinify}
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 transition"
          >
            <Minus className="h-4 w-4" />
            Minify
          </button>
          <button
            onClick={handleBeautify}
            className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 transition"
          >
            <Maximize2 className="h-4 w-4" />
            Beautify
          </button>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Indent</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(parseInt(e.target.value))}
              className="rounded border-slate-200 text-sm text-slate-700 focus:border-orange-500 focus:ring-orange-500"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>Tab</option>
            </select>
          </div>
          <button
            onClick={handleReset}
            className="ml-auto flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <RotateCcw className="h-4 w-4" />
            Clear
          </button>
        </motion.div>

        {/* Input Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-4 flex flex-wrap gap-3 text-xs"
        >
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
            Input: <strong>{inputStats.size.toLocaleString()}</strong> bytes
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
            Tags: <strong>{inputStats.tags}</strong>
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
            Unique elements: <strong>{inputStats.uniqueElements}</strong>
          </span>
          {savingsPercent !== null && savingsPercent > 0 && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
              Saved {savingsPercent}%
            </span>
          )}
        </motion.div>

        {/* Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid gap-4 md:grid-cols-2"
        >
          {/* Input */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Input HTML</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your HTML here..."
              className="h-96 w-full resize-none bg-white px-4 py-3 font-mono text-sm text-slate-800 focus:outline-none"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Output {mode ? `(${mode})` : ''}
              </span>
              {output && (
                <button
                  onClick={copyOutput}
                  className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              placeholder={mode ? 'Processing...' : 'Click Minify or Beautify to process...'}
              className="h-96 w-full resize-none bg-slate-50 px-4 py-3 font-mono text-sm text-slate-800 focus:outline-none"
              spellCheck={false}
            />
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">How it works</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4">
              <h3 className="font-semibold text-orange-900">Minify</h3>
              <p className="mt-1 text-sm text-orange-800/80">
                Strips HTML comments, collapses whitespace, and removes unnecessary spaces between tags.
                Ideal for production builds to reduce file size and improve page load speed.
              </p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
              <h3 className="font-semibold text-amber-900">Beautify</h3>
              <p className="mt-1 text-sm text-amber-800/80">
                Formats HTML with consistent indentation and line breaks. Makes messy or minified code
                readable again. Supports 2-space, 4-space, and tab indentation.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
