import Head from 'next/head';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Failed to subscribe');
    }
  };

  return (
    <main className="mx-auto max-w-4xl p-8">
      <Head>
        <title>Newsletter | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h1>
      <p className="mb-6">Stay updated with the latest AI insights, product releases, and industry news.</p>
      <form className="grid gap-4 max-w-md" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-xl border border-slate-600 bg-slate-900 px-4 py-2 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-500"
        >
          {status === 'submitting' ? 'Submitting…' : 'Subscribe'}
        </button>
        {status === 'success' && (
          <p className="text-green-600">Thank you for subscribing!</p>
        )}
        {status === 'error' && (
          <p className="text-red-600">{errorMsg}</p>
        )}
      </form>
    </main>
  );
}
