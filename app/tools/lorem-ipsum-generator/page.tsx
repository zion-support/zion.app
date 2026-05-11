'use client';
import { useState } from 'react';

export default function LoremIpsumGenerator() {
  const [text, setText] = useState('');

  const generate = () => {
    const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += words[Math.floor(Math.random() * words.length)] + ' ';
    }
    setText(result);
  };

  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Lorem Ipsum Generator</h2>
      <div className="flex items-center justify-center gap-4">
        <button onClick={generate} className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition">Generate</button>
        <button onClick={() => setText('')} className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700">Clear</button>
      </div>
      <div className="mt-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-32 rounded-lg border border-slate-200 px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          placeholder="Click generate to create placeholder text..."
        />
      </div>
    </div>
  );
}
