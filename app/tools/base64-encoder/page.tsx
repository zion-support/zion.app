'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Base64Encoder() {

export const metadata = {
  title: "Base64 Encoder/Decoder",
  description: "",
};


  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const encode = () => setOutput(btoa(input));
  const decode = () => setOutput(atob(output));
  return (
    <main className="mx-auto max-w-3xl p-8">
      
      <h1 className="text-3xl font-bold mb-4">Base64 Encoder/Decoder</h1>
      <textarea value={input} onChange={e=>setInput(e.target.value)} className="w-full h-32 p-3 border rounded" placeholder="Input text..."></textarea>
      <div className="flex space-x-2 mt-2">
        <button onClick={encode} className="px-4 py-2 bg-purple-600 text-white rounded">Encode</button>
        <button onClick={decode} className="px-4 py-2 bg-purple-600 text-white rounded">Decode</button>
      </div>
      <textarea value={output} readOnly className="w-full h-32 p-3 mt-4 border rounded" placeholder="Output..."></textarea>
      <div className="mt-8 text-center"><Link href="/free-tools" className="text-sm text-purple-400 hover:underline">← Back to Free Tools Hub</Link></div>
    </main>  );
}