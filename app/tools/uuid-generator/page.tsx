'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function UuidGenerator() {

export const metadata = {
  title: "Free UUID Generator | Zion Tech Group",
  description: "",
};


  const [uuid, setUuid] = useState('');
  const generate = () => {
    // Use crypto.randomUUID if available, fallback to manual generation
    const newUuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : [
      Math.random().toString(16).slice(2, 10),
      Math.random().toString(16).slice(2, 6),
      '4' + Math.random().toString(16).slice(1, 4),
      ((parseInt(Math.random().toString(16).slice(1, 2), 16) & 0x3) | 0x8).toString(16) + Math.random().toString(16).slice(2, 4),
      Math.random().toString(16).slice(2, 14)
    ].join('-');
    setUuid(newUuid);
  };

  return (
    <main className="mx-auto max-w-3xl p-8">
      
      <h1 className="text-3xl font-bold mb-4">UUID v4 Generator</h1>
      <p className="mb-6 text-gray-300">Click the button to generate a random UUID (version 4). Perfect for quickly creating unique identifiers.</p>
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={generate}
          className="rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5 transform hover:scale-105"
        >
          Generate UUID
        </button>
        {uuid && (
          <p className="mt-4 text-lg font-mono text-indigo-600">{uuid}</p>
        )}
      </div>
    </main>
    );
  }