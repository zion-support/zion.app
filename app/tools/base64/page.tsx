"use client";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode"|"decode">("encode");

  const convert = () => {
    try {
      if (mode === "encode") {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
    } catch (e) {
      setOutput("Invalid input for decoding");
    }
  };

  return (
    <main className="mx-auto max-w-2xl p-8">
      <Head><title>Base64 Encoder/Decoder</title></Head>
      <h1 className="text-3xl font-bold mb-4">Base64 Encoder/Decoder</h1>
      <div className="flex gap-2 mb-4">
        <button onClick={()=>setMode("encode")} className={`px-3 py-1 rounded ${mode==="encode"?"bg-blue-600 text-white":"bg-gray-200"}`}>Encode</button>
        <button onClick={()=>setMode("decode")} className={`px-3 py-1 rounded ${mode==="decode"?"bg-blue-600 text-white":"bg-gray-200"}`}>Decode</button>
      </div>
      <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter text..." className="w-full h-32 p-2 border rounded mb-2" />
      <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white rounded">Convert</button>
      <textarea readOnly value={output} placeholder="Result" className="w-full h-32 p-2 border rounded mt-4 bg-gray-50" />
      <div className="mt-4">
        <Link href="/free-tools-hub" className="text-sm text-blue-400 hover:underline">← Back to Free Tools Hub</Link>
      </div>
    </main>
  );
}