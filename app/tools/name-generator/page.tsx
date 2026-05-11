"use client";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

const firstNames = ["Liam","Emma","Noah","Olivia","Ava","Isabella","Sophia","Mia","Charlotte","Amelia"]; 
const lastNames = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez"];

export default function NameGenerator() {
  const [name, setName] = useState('');
  const generate = () => {
    const f = firstNames[Math.floor(Math.random()*firstNames.length)];
    const l = lastNames[Math.floor(Math.random()*lastNames.length)];
    setName(`${f} ${l}`);
  };
  return (
    <main className="mx-auto max-w-md p-8 text-center">
      <Head><title>Random Name Generator</title></Head>
      <h1 className="text-3xl font-bold mb-4">Random Name Generator</h1>
      {name && <p className="text-xl mb-4">{name}</p>}
      <button onClick={generate} className="px-4 py-2 bg-green-600 text-white rounded">Generate</button>
      <div className="mt-8"><Link href="/free-tools-hub" className="text-sm text-green-400 hover:underline">← Back to Free Tools Hub</Link></div>
    </main>
  );
}
