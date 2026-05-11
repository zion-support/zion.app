'use client';

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState('# Welcome to the Markdown Preview\n\nType some *markdown* on the left pane to see the rendered output.');

  return (
    <main className="mx-auto max-w-5xl p-8">
      <Head>
        <title>Free Markdown Preview | Zion Tech Group</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Markdown Preview Tool</h1>
      <p className="text-gray-300 mb-6">Paste or type Markdown on the left, and see the rendered HTML on the right. Perfect for documentation, notes, or quick cheatsheets.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-80 p-4 bg-slate-900 text-white font-mono rounded border border-slate-700"
          spellCheck={false}
        />
        <div className="p-4 bg-slate-900 rounded border border-slate-700 overflow-auto h-80">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Link href="/free-tools" className="text-sm text-purple-400 hover:underline">← Back to Free Tools Hub</Link>
      </div>
    </main>
  );
}
