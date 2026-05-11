import Head from 'next/head';
import Link from 'next/link';

export default function Donate() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <Head>
        <title>Donate | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Support Zion Tech Group</h1>
      <p className="mb-6">Your contribution helps us keep building free, open‑source AI tools and services.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <a
          href={process.env.PAYPAL_URL!}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-xl bg-purple-600 px-4 py-3 text-white hover:bg-purple-500"
        >
          Donate via PayPal
        </a>
        <a
          href={process.env.KO_FI_URL!}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-xl bg-pink-600 px-4 py-3 text-white hover:bg-pink-500"
        >
          Donate via Ko‑fi
        </a>
        <a
          href={process.env.AMAZON_AF_LINK!}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-xl bg-yellow-600 px-4 py-3 text-white hover:bg-yellow-500"
        >
          Buy Our Merch on Amazon
        </a>
        <Link href="/" className="flex items-center justify-center rounded-xl bg-gray-700 px-4 py-3 text-white hover:bg-gray-600">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
