import Head from 'next/head';
import Link from 'next/link';

export default function CalendarPage() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <Head>
        <title>Free Calendar Invite | Zion Tech Group</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Schedule a Free Discovery Call</h1>
      <p className="mb-6 text-gray-300">Use the button below to choose a convenient time via Calendly’s free tier.</p>
      <div className="flex justify-center">
        <a
          href="https://calendly.com/your-account-1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-pink-500"
        >
          Schedule a Call
        </a>
      </div>
      <div className="mt-8 text-center">
        <Link href="/free-tools" className="text-sm text-purple-400 hover:underline">← Back to Free Tools Hub</Link>
      </div>
    </main>
  );
}
