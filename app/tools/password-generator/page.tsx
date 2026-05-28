"use client";
import { useState } from "react";
import Link from "next/link";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export default function PasswordGenerator() {

export const metadata = {
  title: "Random Password Generator",
  description: "",
};


  const [pwd, setPwd] = useState("");
  const generate = (len = 12) => {
    let result = "";
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPwd(result);
  };
  return (
    <main className="mx-auto max-w-md p-8 text-center">
      
      <h1 className="text-3xl font-bold mb-4">Random Password Generator</h1>
      {pwd && <p className="font-mono text-lg mb-4">{pwd}</p>}
      <button onClick={()=>generate()} className="px-4 py-2 bg-indigo-600 text-white rounded">Generate</button>
      <div className="mt-8"><Link href="/free-tools-hub" className="text-sm text-indigo-400 hover:underline">← Back to Free Tools Hub</Link></div>
    </main>
  );
}
