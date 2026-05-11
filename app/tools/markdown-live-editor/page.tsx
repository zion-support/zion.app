'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, Copy, Download, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

const DEFAULT_MARKDOWN = `# Welcome to Markdown Live Editor

Write your markdown on the **left**, see the preview on the **right**.

## Features

- 📝 Live preview as you type
- 🎨 Syntax highlighting for code blocks
- 📋 Copy HTML or download as file
- 🔍 Full-screen mode for editor or preview

## Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}! Welcome to Zion.\`;
}

console.log(greet('Developer'));
\`\`\`

## Task List

- [x] Create the editor
- [x] Add live preview
- [ ] Write amazing content

## Table Example

| Feature | Status | Priority |
|---------|--------|----------|
| Live Preview | ✅ Done | High |
| Export HTML | ✅ Done | Medium |
| Dark Mode | ✅ Done | Low |

## Blockquote

> "The best way to predict the future is to invent it."
> — Alan Kay

## Links & Images

Visit [Zion Tech Group](https://ziontechgroup.com) for more AI tools.

---

*Start editing to see the magic happen!* 🚀
`;

function parseMarkdown(md: string): string {
  let html = md;

  // Escape HTML (but not our markdown)
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="bg-slate-900 rounded-lg p-4 my-3 overflow-x-auto text-sm"><code class="language-${lang || 'text'} text-emerald-300">${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-700 text-rose-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

  // Headers
  html = html.replace(/^#### (.+)$/gm, '<h4 class="text-base font-semibold text-slate-200 mt-4 mb-2">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-slate-200 mt-5 mb-2">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-6 mb-3">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-4 mb-4">$1</h1>');

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="border-slate-600 my-6" />');

  // Bold & italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em class="text-slate-100">$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-100">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em class="text-slate-300">$1</em>');

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del class="text-slate-500">$1</del>');

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-indigo-500 pl-4 my-3 text-slate-400 italic">$1</blockquote>');

  // Task lists
  html = html.replace(/^- \[x\] (.+)$/gm, '<div class="flex items-center gap-2 my-1"><input type="checkbox" checked disabled class="w-4 h-4 rounded" /><span class="text-slate-300 line-through opacity-70">$1</span></div>');
  html = html.replace(/^- \[ \] (.+)$/gm, '<div class="flex items-center gap-2 my-1"><input type="checkbox" disabled class="w-4 h-4 rounded" /><span class="text-slate-300">$1</span></div>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li class="text-slate-300 ml-4 list-disc">$1</li>');
  html = html.replace(/^\* (.+)$/gm, '<li class="text-slate-300 ml-4 list-disc">$1</li>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="text-slate-300 ml-4 list-decimal">$1</li>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-indigo-400 hover:text-indigo-300 underline" target="_blank" rel="noopener">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-3" />');

  // Tables
  html = html.replace(/\n(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)+)/g, (_, header, separator, body) => {
    const headers = header.split('|').filter((c: string) => c.trim()).map((c: string) =>
      `<th class="px-4 py-2 text-left text-sm font-semibold text-slate-200 border-b border-slate-600">${c.trim()}</th>`
    ).join('');
    const rows = body.trim().split('\n').map((row: string) => {
      const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) =>
        `<td class="px-4 py-2 text-sm text-slate-300">${c.trim()}</td>`
      ).join('');
      return `<tr class="border-b border-slate-700/50 hover:bg-slate-700/20">${cells}</tr>`;
    }).join('');
    return `<div class="overflow-x-auto my-4"><table class="w-full border border-slate-600 rounded-lg overflow-hidden"><thead class="bg-slate-800"><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
  });

  // Paragraphs - wrap remaining text lines
  const lines = html.split('\n');
  const result: string[] = [];
  let inBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed.startsWith('<h') ||
      trimmed.startsWith('<pre') ||
      trimmed.startsWith('<blockquote') ||
      trimmed.startsWith('<li') ||
      trimmed.startsWith('<div') ||
      trimmed.startsWith('<hr') ||
      trimmed.startsWith('<table') ||
      trimmed.startsWith('<tr') ||
      trimmed.startsWith('<thead') ||
      trimmed.startsWith('<tbody') ||
      trimmed.startsWith('</') ||
      trimmed === ''
    ) {
      result.push(line);
      if (trimmed.startsWith('<pre')) inBlock = true;
      if (trimmed.startsWith('</pre>')) inBlock = false;
    } else if (!inBlock) {
      result.push(`<p class="text-slate-300 my-2 leading-relaxed">${line}</p>`);
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

export default function MarkdownLiveEditor() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const renderedHtml = parseMarkdown(markdown);

  const copyHtml = useCallback(() => {
    navigator.clipboard.writeText(renderedHtml.replace(/ class="[^"]*"/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [renderedHtml]);

  const downloadMd = useCallback(() => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  }, [markdown]);

  const downloadHtml = useCallback(() => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Markdown Document</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
    pre { background: #1e293b; padding: 1rem; border-radius: 8px; overflow-x: auto; }
    code { background: #334155; padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.875rem; }
    blockquote { border-left: 4px solid #6366f1; padding-left: 1rem; color: #94a3b8; font-style: italic; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.5rem 1rem; border: 1px solid #475569; text-align: left; }
    th { background: #1e293b; }
    a { color: #818cf8; }
    img { max-width: 100%; border-radius: 8px; }
  </style>
</head>
<body>
${renderedHtml.replace(/ class="[^"]*"/g, '')}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  }, [renderedHtml]);

  const resetEditor = () => setMarkdown(DEFAULT_MARKDOWN);

  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const charCount = markdown.length;
  const lineCount = markdown.split('\n').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-600/20 text-emerald-300 px-4 py-2 rounded-full text-sm mb-4">
            <FileText className="w-4 h-4" />
            <span>Free Tool</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Markdown{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Live Editor
            </span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Write markdown with instant live preview. Supports headers, code blocks, tables, task lists,
            blockquotes, and more. Export as HTML or Markdown.
          </p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-xl border border-slate-700 p-3 mb-4 flex flex-wrap items-center gap-3"
        >
          {/* View mode toggle */}
          <div className="flex bg-slate-900/50 rounded-lg overflow-hidden">
            {[
              { mode: 'editor' as const, icon: FileText, label: 'Editor' },
              { mode: 'split' as const, icon: Eye, label: 'Split' },
              { mode: 'preview' as const, icon: Eye, label: 'Preview' },
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-sm font-medium transition ${
                  viewMode === mode
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Stats */}
          <div className="flex gap-4 text-xs text-slate-500">
            <span>{lineCount} lines</span>
            <span>{wordCount} words</span>
            <span>{charCount} chars</span>
          </div>

          {/* Actions */}
          <button
            onClick={copyHtml}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-slate-700"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy HTML'}
          </button>
          <button
            onClick={downloadMd}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-slate-700"
          >
            <Download className="w-4 h-4" />
            .md
          </button>
          <button
            onClick={downloadHtml}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-slate-700"
          >
            <Download className="w-4 h-4" />
            .html
          </button>
          <button
            onClick={resetEditor}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </motion.div>

        {/* Editor / Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`grid gap-4 ${viewMode === 'split' ? 'md:grid-cols-2' : 'grid-cols-1'}`}
        >
          {/* Editor */}
          {(viewMode === 'editor' || viewMode === 'split') && (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 border-b border-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-slate-300">Markdown</span>
              </div>
              <textarea
                ref={editorRef}
                value={markdown}
                onChange={e => setMarkdown(e.target.value)}
                className="flex-1 w-full min-h-[500px] bg-transparent text-slate-300 p-4 text-sm font-mono resize-none focus:outline-none placeholder-slate-500"
                placeholder="Start writing markdown..."
                spellCheck={false}
              />
            </div>
          )}

          {/* Preview */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 border-b border-slate-700 flex items-center gap-2">
                <Eye className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-medium text-slate-300">Preview</span>
              </div>
              <div
                className="flex-1 p-4 overflow-y-auto min-h-[500px]"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </div>
          )}
        </motion.div>

        {/* Markdown cheatsheet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6 bg-slate-800/50 rounded-xl border border-slate-700 p-4"
        >
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Quick Reference</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {[
              { syntax: '# Heading 1', desc: 'Headers' },
              { syntax: '**bold**', desc: 'Bold text' },
              { syntax: '*italic*', desc: 'Italic text' },
              { syntax: '`code`', desc: 'Inline code' },
              { syntax: '```code block```', desc: 'Code block' },
              { syntax: '[text](url)', desc: 'Links' },
              { syntax: '- item', desc: 'Bullet list' },
              { syntax: '1. item', desc: 'Numbered list' },
              { syntax: '- [x] task', desc: 'Task list' },
              { syntax: '> quote', desc: 'Blockquote' },
              { syntax: '---', desc: 'Horizontal rule' },
              { syntax: '| col | col |', desc: 'Table' },
            ].map(({ syntax, desc }) => (
              <div key={syntax} className="bg-slate-900/50 rounded-lg p-2.5">
                <code className="text-emerald-400 font-mono">{syntax}</code>
                <p className="text-slate-500 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
