"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [result, setResult] = useState(0);

  useEffect(() => {
    // free API, no key needed
    fetch('https://api.exchangerate.host/latest')
      .then(res => res.json())
      .then(data => setRates(data.rates))
      .catch(() => setRates({}));
  }, []);

  const convert = () => {
    if (!rates[from] || !rates[to]) return;
    const usdAmount = amount / rates[from];
    const converted = usdAmount * rates[to];
    setResult(converted);
  };

  const currencyOptions = Object.keys(rates).sort();

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Head><title>Currency Converter</title></Head>
      <h1 className="text-3xl font-bold mb-4">Currency Converter</h1>
      <div className="mb-4">
        <input type="number" value={amount} onChange={e=>setAmount(parseFloat(e.target.value)||0)} className="border rounded p-1 mr-2" />
        <select value={from} onChange={e=>setFrom(e.target.value)} className="border rounded p-1 mr-2">
          {currencyOptions.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <span className="mx-2">→</span>
        <select value={to} onChange={e=>setTo(e.target.value)} className="border rounded p-1 mr-2">
          {currencyOptions.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={convert} className="px-4 py-2 bg-green-600 text-white rounded">Convert</button>
      </div>
      <div className="mt-2"><strong>Result:</strong> {result.toFixed(4)}</div>
      <div className="mt-8 text-center"><Link href="/free-tools-hub" className="text-sm text-green-400 hover:underline">← Back to Free Tools Hub</Link></div>
    </main>
  );
}
