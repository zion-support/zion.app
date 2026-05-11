"use client";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

function randomHex(): string {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

export default function ColorGenerator() {
  const [color, setColor] = useState(randomHex());

  const generate = () => setColor(randomHex());

  return (
    <main className="mx-auto max-w-3xl p-8 text-center">
      <Head><title>Random Color Generator</title></Head>
      <h1 className="text-3xl font-bold mb-4">Random Color Generator</h1>
      <div className="p-6 rounded" style={{backgroundColor:color, color:'#fff'}}>
        <h2 className="text-2xl">{color}</h2>
      </div>
      <button onClick={generate} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Generate</button>
      <div className="mt-8 text-center">
        <Link href="/free-tools-hub" className="text-sm text-indigo-400 hover:underline">← Back to Free Tools Hub</Link>
      </div>
    </main>
  );
}
