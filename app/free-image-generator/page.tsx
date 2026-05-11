import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ImageGenerator() {
  const [url, setUrl] = useState('https://picsum.photos/800/600');
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = url;
    img.onload = () => setError(false);
    img.onerror = () => setError(true);
  }, [url]);

  const regenerate = () => {
    setUrl(`https://picsum.photos/800/600?random=${Math.random()}`);
  };

  return (
    <main className="mx-auto max-w-5xl p-8">
      <Head>
        <title>Free Image Generator | Zion Tech Group</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Free Random Image Generator</h1>
      <p className="mb-6 text-gray-300">Generate free high‑resolution images with a single click.</p>
      <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 shadow-2xl shadow-purple-700/20">
        <div className="flex flex-col items-center space-y-4">
          <img src={url} alt="Random" className="rounded" style={{ maxWidth: '100%' }} />
          {error && <p className="text-sm text-red-400">Failed to load image. Try again.</p>}
          <button onClick={regenerate} className="inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-pink-500">
            Generate New
          </button>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Link href="/free-tools" className="text-sm text-purple-400 hover:underline">← Back to Free Tools Hub</Link>
      </div>
    </main>
  );
}
