"use client";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function LoremIpsum() {
  const [count, setCount] = useState(150);
  const [text, setText] = useState('');

  const generate = () => {
    const words = [];
    const wordList = [
      "lorem", "ipsum", "dolor", "sit", "amet", "consectetur",
      "adipiscing", "elit", "sed", "do", "tempor", "incididunt",
      "ut", "labore", "et", "dolore", "magna", "aliqua"
    ];
    for (let i = 0; i < count; i++) {
      const word = wordList[Math.floor(Math.random() * wordList.length)];
      words.push(word);
    }
    setText(words.join(' '));
  };

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Head>
        <title>Lorem Ipsum Generator</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Lorem Ipsum Generator</h1>
      <p className="mb-4">Generate random Lorem Ipsum text.</p>
      <div className="mb-4">
        <label className="block mb-1">Number of words:</label>
        <input type="number" min="10" max="1000" value={count} onChange={e=>setCount(parseInt(e.target.value))} className="border rounded p-2" />
      </div>
      <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded">Generate</button>
      <textarea value={text} readOnly className="w-full h-32 mt-4 p-3 border rounded" placeholder="Generated ipsum will appear here" />
      <div className="mt-8 text-center">
        <Link href="/free-tools" className="text-sm text-blue-400 hover:underline">← Back to Free Tools Hub</Link>
      </div>
    </main>
  );
}
