'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

function markdownToHtml(md: string): string {
  let html = md;

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) => {
    const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<pre class="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm"><code>${escaped.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-rose-600 rounded px-1.5 py-0.5 text-sm font-mono">$1</code>');

  // Headings
  html = html.replace(/^######\s+(.+)$/gm, '<h6 class="text-sm font-semibold text-slate-700 mt-4 mb-2">$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5 class="text-base font-semibold text-slate-700 mt-4 mb-2">$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4 class="text-lg font-semibold text-slate-800 mt-5 mb-2">$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-xl font-bold text-slate-800 mt-6 mb-3">$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold text-slate-900 mt-6 mb-3">$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="text-3xl font-bold text-slate-900 mt-4 mb-4">$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del class="line-through text-slate-400">$1</del>');

  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote class="border-l-4 border-blue-400 pl-4 py-1 my-3 text-slate-600 italic bg-blue-50 rounded-r">$1</blockquote>');

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="my-6 border-t border-slate-200" />');

  // Unordered lists
  html = html.replace(/^[-*]\s+(.+)$/gm, '<li class="ml-6 list-disc text-slate-700 mb-1">$1</li>');

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-6 list-decimal text-slate-700 mb-1">$1</li>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-4" />');

  // Paragraphs — wrap remaining non-empty, non-tag lines
  html = html.split('\n').map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<')) return trimmed;
    return `<p class="text-slate-700 leading-relaxed mb-3">${trimmed}</p>`;
  }).join('\n');

  // Clean up consecutive empty lines
  html = html.replace(/\n{3,}/g, '\n\n');

  return html;
}

const SAMPLE = `# Welcome to Markdown Converter

This is a **live preview** of your *Markdown* content.

## Features

- Real-time conversion to HTML
- Styled output ready to copy
- Supports all common Markdown syntax

### Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Links and Emphasis

Visit [Zion AI Platform](https://zion.app) for more tools.

> This is a blockquote — great for callouts and notes.

---

1. First ordered item
2. Second ordered item
3. Third ordered item
`;

export default function MarkdownToHtmlConverter() {
  const [markdown, setMarkdown] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);

  const html = useCallback(() => markdownToHtml(markdown), [markdown]);
  const rawHtml = markdownToHtml(markdown);

  const copyHtml = () => {
    navigator.clipboard.writeText(rawHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHtml = () => {
    const fullDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Converted Document</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="max-w-3xl mx-auto px-6 py-10 bg-white">
${rawHtml}
</body>
</html>`;
    const blob = new Blob([fullDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/tools" className="text-sm text-blue-600 hover:underline">← Back to Tools</a>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📝</span>
            <h1 className="text-3xl font-bold text-slate-900">Markdown to HTML Converter</h1>
          </div>
          <p className="text-slate-600 max-w-2xl">
            Convert Markdown to styled HTML instantly with live preview. Copy the output or download as a complete HTML document.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h2 className="font-semibold text-slate-700">Markdown Input</h2>
              <button
                onClick={() => setMarkdown('')}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Clear
              </button>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-[500px] p-4 font-mono text-sm text-slate-800 bg-white rounded-b-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your Markdown here..."
              spellCheck={false}
            />
          </div>

          {/* Preview */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h2 className="font-semibold text-slate-700">HTML Preview</h2>
              <div className="flex gap-2">
                <button
                  onClick={copyHtml}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                    copied
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copied ? '✓ Copied!' : 'Copy HTML'}
                </button>
                <button
                  onClick={downloadHtml}
                  className="px-3 py-1 text-xs font-semibold rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                  Download .html
                </button>
              </div>
            </div>
            <div
              className="p-6 h-[500px] overflow-y-auto prose max-w-none"
              dangerouslySetInnerHTML={{ __html: html() }}
            />
          </div>
        </div>

        {/* Raw HTML output */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="font-semibold text-slate-700">Raw HTML Output</h2>
            <button
              onClick={copyHtml}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                copied
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-600 text-white hover:bg-slate-700'
              }`}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-600 bg-slate-50 rounded-b-2xl max-h-64">
            {rawHtml}
          </pre>
        </div>
      </div>
    </div>
  );
}
