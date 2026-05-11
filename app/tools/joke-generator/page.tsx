"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function JokeGenerator() {
  const [joke, setJoke] = useState<{setup:string, punchline:string}|null>(null);
  const [loading, setLoading] = useState(false);

  const fetchJoke = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://official-joke-api.appspot.com/random_joke');
      const data = await res.json();
      setJoke({setup: data.setup, punchline: data.punchline});
    } catch (e) {
      setJoke({setup:'Error fetching joke', punchline:''});
    }
    setLoading(false);
  };

  useEffect(() => { fetchJoke(); }, []);

  return (
    <main className="mx-auto max-w-2xl p-8 text-center">
      <Head><title>Random Joke Generator</title></Head>
      <h1 className="text-3xl font-bold mb-4">Random Joke</h1>
      {loading ? <p>Loading...</p> : joke && (
        <div className="mb-4">
          <p className="font-medium">{joke.setup}</p>
          <p className="mt-2 text-lg">{joke.punchline}</p>
        </div>
      )}
      <button onClick={fetchJoke} className="px-4 py-2 bg-indigo-600 text-white rounded">Another Joke</button>
      <div className="mt-8">
        <Link href="/free-tools-hub" className="text-sm text-indigo-400 hover:underline">← Back to Free Tools Hub</Link>
      </div>
    </main>
  );
}
