'use client';

import Head from 'next/head';
import Link from 'next/link';

export default function ApiMockPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <Head>
        <title>Free API Mock Tool | Zion Tech Group</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Free API Mocking</h1>
      <p className="mb-6 text-gray-300">
        Test HTTP requests without a backend using the free <a href="https://reqbin.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline">ReqBin</a> service.
      </p>
      <iframe
        src="https://reqbin.com/echo/get/json"
        className="w-full h-[500px] border border-slate-700 rounded"
        title="ReqBin API tester"
      />
      <div className="mt-8 text-center">
        <Link href="/free-tools" className="text-sm text-purple-400 hover:underline">← Back to Free Tools Hub</Link>
      </div>
    </main>
  );
}
