"use client";
import { useState } from "react";
import Link from "next/link";

export default function QRCodeGenerator() {

export const metadata = {
  title: "QR Code Generator",
  description: "",
};


  const [text, setText] = useState("https://example.com");
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;

  return (
    <main className="mx-auto max-w-md p-8 text-center">
      
      <h1 className="text-3xl font-bold mb-4">QR Code Generator</h1>
      <input
        type="text"
        value={text}
        onChange={e=>setText(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Enter text or URL"
      />
      <img src={url} alt="QR Code" className="mx-auto mb-4" />
      <div><Link href="/free-tools-hub" className="text-sm text-blue-400 hover:underline">← Back to Free Tools Hub</Link></div>
    </main>
  );
}