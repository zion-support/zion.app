'use client';

import Head from 'next/head';
import Link from 'next/link';

export default function FeedbackPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <Head>
        <title>Feedback | Zion Tech Group</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Share Your Feedback</h1>
      <p className="mb-6 text-gray-300">
        Help us improve! Use the free Google Form below to submit your thoughts, suggestions, or report any issues.
      </p>
      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
        <iframe
          src="https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true"
          width="100%"
          height="600"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="Feedback Form"
        >
          Loading…
        </iframe>
      </div>
      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-purple-400 hover:underline">← Back to Home</Link>
      </div>
    </main>
  );
}