"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

export default function QuoteOfTheDay() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');

  const fetchQuote = async () => {
    try {
      const res = await fetch('https://api.quotable.io/random');
      const data = await res.json();
      setQuote(data.content);
      setAuthor(data.author);
    } catch (e) {
      setQuote('Unable to fetch quote');
      setAuthor('');
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Head><title>Quote of the Day</title></Head>
      <h1 className="text-3xl font-bold mb-4">Quote of the Day</h1>
      <blockquote className="border-l-4 pl-4 italic mb-4">{quote}</blockquote>
      {author && <p className="text-right mb-4">— {author}</p>}
      <button onClick={fetchQuote} className="px-4 py-2 bg-teal-600 text-white rounded">New Quote</button>
      <div className="mt-8 text-center">
        <Link href="/free-tools-hub" className="text-sm text-teal-400 hover:underline">← Back to Free Tools Hub</Link>
      </div>
    </main>
  );
}
