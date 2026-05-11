'use client';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function JsonFormatter() {
  const [input, setInput] = useState('{}');
  const [output, setOutput] = useState('');
  const format = () => {
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj, null, 2));
    } catch (e) {
      setOutput('Invalid JSON');
    }
  };
  return (
    <main className="mx-auto max-w-3xl p-8">
      <Head><title>JSON Formatter</title></Head>
      <h1 className="text-3xl font-bold mb-4">JSON Formatter</h1>
      <textarea value={input} onChange={e=>setInput(e.target.value)} className="w-full h-32 p-3 border rounded" placeholder="Paste raw JSON"></textarea>
      <div className="mt-2 flex space-x-2">
        <button onClick={format} className="px-4 py-2 bg-purple-600 text-white rounded">Format</button>
      </div>
      <textarea value={output} readOnly className="w-full h-32 p-3 mt-4 border rounded" placeholder="Formatted JSON"></textarea>
      <div className="mt-8 text-center"><Link href="/free-tools" className="text-sm text-purple-400 hover:underline">← Back to Free Tools Hub</Link></div>
    </main>
  );
}