import Head from 'next/head';
import Link from 'next/link';

export default function Monetization() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <Head>
        <title>Monetization | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Monetization Options</h1>
      <p className="mb-6">Explore various ways to support and gain access to Zion Tech Group services.</p>
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/donate" className="block rounded-xl border border-slate-700 bg-slate-900/50 p-6 text-center transition hover:bg-slate-800">
          <h2 className="text-2xl font-semibold mb-2">Donate</h2>
          <p className="text-sm">Help us maintain free tools and open-source projects.</p>
        </Link>
        <Link href="/sponsor" className="block rounded-xl border border-slate-700 bg-slate-900/50 p-6 text-center transition hover:bg-slate-800">
          <h2 className="text-2xl font-semibold mb-2">Sponsor via GitHub</h2>
          <p className="text-sm">Support us on GitHub Sponsors and get early access.</p>
        </Link>
        <Link href="/newsletter" className="block rounded-xl border border-slate-700 bg-slate-900/50 p-6 text-center transition hover:bg-slate-800">
          <h2 className="text-2xl font-semibold mb-2">Newsletter</h2>
          <p className="text-sm">Subscribe for updates, tips, and offers.</p>
        </Link>
        <Link href="/support" className="block rounded-xl border border-slate-700 bg-slate-900/50 p-6 text-center transition hover:bg-slate-800">
          <h2 className="text-2xl font-semibold mb-2">Support</h2>
          <p className="text-sm">Donate via PayPal or Ko-fi.</p>
        </Link>
      </div>
    </main>
  );
}
