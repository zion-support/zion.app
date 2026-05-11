"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

function parseIngredient(line: string) {
  const match = line.trim().match(/^(\d+(?:\.\d+)?\s*)?([\w-]+)?\s*(.*)$/i);
  if (!match) return null;
  const amount = match[1] ? parseFloat(match[1].trim()) : null;
  const unit = match[2] ? match[2].trim() : '';
  const rest = match[3].trim();
  return { amount, unit, rest };
}

export default function RecipeConverter() {
  const [servings, setServings] = useState(2);
  const [targetServings, setTargetServings] = useState(4);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    const factor = targetServings / servings;
    const lines = input.split('\n').map(l=>{
      const parsed = parseIngredient(l);
      if (!parsed) return l;
      if (parsed.amount === null) return l;
      const newAmt = parsed.amount * factor;
      return `${newAmt.toFixed(2)} ${parsed.unit} ${parsed.rest}`;
    });
    setOutput(lines.join('\n'));
  };

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Head><title>Recipe Converter</title></Head>
      <h1 className="text-3xl font-bold mb-4">Recipe Converter</h1>
      <div className="mb-4">
        <label className="mr-2">Original servings:</label>
        <input type="number" value={servings} onChange={e=>setServings(parseInt(e.target.value)||1)} className="border rounded p-1 mr-4" />
        <label className="mr-2">Target servings:</label>
        <input type="number" value={targetServings} onChange={e=>setTargetServings(parseInt(e.target.value)||1)} className="border rounded p-1 mr-2" />
        <button onClick={convert} className="px-4 py-2 bg-purple-600 text-white rounded">Convert</button>
      </div>
      <div className="mb-4">
        <label>Ingredients (one per line):</label>
        <textarea value={input} onChange={e=>setInput(e.target.value)} className="w-full h-48 p-3 border rounded" placeholder="e.g.\n2 cups flour\n1.5 tsp salt" />
      </div>
      <div className="mb-4">
        <label>Converted:</label>
        <pre className="p-3 bg-gray-100 rounded whitespace-pre-wrap">{output}</pre>
      </div>
      <div className="mt-8 text-center">
        <Link href="/free-tools-hub" className="text-sm text-purple-400 hover:underline">← Back to Free Tools Hub</Link>
      </div>
    </main>
  );
}
