"use client";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function CsvToTable() {
  const [csv, setCsv] = useState('');
  const [table, setTable] = useState<string[]>([]);

  const parse = () => {
    const lines = csv.split('\n').filter(l=>l.trim()!=='' );
    setTable(lines.map(l=> l.split(',')) );
  };

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Head><title>CSV to Table</title></Head>
      <h1 className="text-3xl font-bold mb-4">CSV to Table Converter</h1>
      <textarea value={csv} onChange={e=>setCsv(e.target.value)} placeholder="Enter CSV (comma separated)..." className="w-full h-48 p-3 border rounded" />
      <button onClick={parse} className="mt-2 px-4 py-2 bg-purple-600 text-white rounded">Convert</button>
      {table.length>0 && (
        <table className="mt-4 border-collapse w-full">
          <tbody>
            {table.map((row,i)=>(
              <tr key={i} className={i%2===0?'bg-gray-100':''}>
                {row.map((cell,j)=>(<td key={j} className="border p-2">{cell}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-8 text-center">
        <Link href="/free-tools-hub" className="text-sm text-purple-400 hover:underline">← Back to Free Tools Hub</Link>
      </div>
    </main>
  );
}
