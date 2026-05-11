"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let id: NodeJS.Timeout | null = null;
    if (running) {
      id = setInterval(() => setTime(t => t + 10), 10);
    }
    return () => { if (id) clearInterval(id); };
  }, [running]);

  const start = () => setRunning(true);
  const stop = () => setRunning(false);
  const reset = () => { setRunning(false); setTime(0); };

  const format = (ms: number) => {
    const total = Math.floor(ms / 10);
    const cent = total % 100;
    const sec = Math.floor(total / 100) % 60;
    const min = Math.floor(total / 6000) % 60;
    const hrs = Math.floor(total / 360000);
    return `${hrs.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}.${cent.toString().padStart(2,'0')}`;
  };

  return (
    <main className="mx-auto max-w-md p-8 text-center">
      <Head><title>Stopwatch</title></Head>
      <h1 className="text-3xl font-bold mb-4">Stopwatch</h1>
      <div className="text-6xl font-mono mb-4">{format(time)}</div>
      <div className="space-x-4">
        <button onClick={start} disabled={running} className="px-4 py-2 bg-green-500 text-white rounded">Start</button>
        <button onClick={stop} disabled={!running} className="px-4 py-2 bg-red-500 text-white rounded">Stop</button>
        <button onClick={reset} className="px-4 py-2 bg-blue-500 text-white rounded">Reset</button>
      </div>
      <div className="mt-8 text-center">
        <Link href="/free-tools-hub" className="text-sm text-red-400 hover:underline">← Back to Free Tools Hub</Link>
      </div>
    </main>
  );
}
