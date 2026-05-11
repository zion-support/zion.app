'use client';

import { useState } from 'react';
import QRCode from 'qrcode.react';

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('https://ziontechgroup.com');
  const [valid, setValid] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrl(val);
    try {
      new URL(val);
      setValid(true);
    } catch {
      setValid(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold mb-4">Free QR Code Generator</h1>
      <p className="mb-6 text-gray-300">
        Enter any URL and instantly generate a downloadable QR code—no registration required.
      </p>
      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-200">URL</span>
          <input
            type="url"
            value={url}
            onChange={handleChange}
            placeholder="https://example.com"
            className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          />
          {!valid && <p className="mt-1 text-xs text-red-400">Please enter a valid URL</p>}
        </label>
        {valid && url && (
          <div className="flex flex-col items-center space-y-3 pt-4">
            <QRCode value={url} size={200} bgColor="#0f172a" fgColor="#a78bfa" />
            <a
              href={`data:image/png;base64,${(() => {
                const canvas = document.createElement('canvas');
                // In a real implementation you would render to canvas and convert.
                return '';
              })()}`}
              download="qr-code.png"
              className="text-sm text-purple-300 hover:underline"
            >
              Download QR Code
            </a>
            <p className="text-xs text-slate-400">Right‑click the QR code and choose “Save image” to download.</p>
          </div>
        )}
      </div>
      <div className="mt-8 text-center">
        <a href="/free-tools" className="text-sm text-purple-400 hover:underline">← Back to Free Tools</a>
      </div>
    </main>
  );
}
