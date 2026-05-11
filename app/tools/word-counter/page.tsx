"use client";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function WordCounter() {
  const [text, setText] = useState('');
  const [count, setCount] = useState(0);

  const countWords = () => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    setCount(words.length);
  };

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Head><title>Word Counter</title></Head>
      <h1 className="text-3xl font-bold mb-4">Word Counter</h1>
      <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-48 p-3 border rounded" placeholder="Paste your text here"/>\n      <div className="mt-4">
        <button onClick={countWords} className="px-4 py-2 bg-indigo-600 text-white rounded">Count Words</button>
        <span className="ml-4"><strong>Count:</strong> {count}</span>
      </div>
      <div className="mt-8 text-center">
        <Link href="/free-tools-hub" className="text-sm text-indigo-400 hover:underline">← Back to Free Tools Hub</Link>
      </div>
    </main>
  );
}
