import Head from 'next/head';

export default function Support() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <Head>
        <title>Support | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Support Zion Tech Group</h1>
      <p className="mb-6">Your contributions help keep the platform running. Choose a preferred method:</p>
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
          Support on Ko‑fi
        </a>
      </div>
    </main>
  );
}
