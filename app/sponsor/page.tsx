import Head from 'next/head';

export default function Sponsor() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <Head>
        <title>Sponsor | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Become a Sponsor</h1>
      <p className="mb-6">Support Zion Tech Group through sponsorship. Your contributions help us maintain and expand our open‑source AI ecosystem.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <a
          href={process.env.PATREON_URL!}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-xl bg-orange-600 px-4 py-3 text-white hover:bg-orange-500"
        >
          Support on Patreon
        </a>
        <a
          href={process.env.OPEN_COLLECTIVE_URL!}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-xl bg-blue-700 px-4 py-3 text-white hover:bg-blue-600"
        >
          Donate via Open Collective
        </a>
        <a
          href={process.env.GITHUB_SPONSORS_URL!}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-xl bg-gray-800 px-4 py-3 text-white hover:bg-gray-700"
        >
          Sponsor on GitHub
        </a>
        <a
          href={process.env.PAYPAL_URL!}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-xl bg-purple-600 px-4 py-3 text-white hover:bg-purple-500"
        >
          Donate via PayPal
        </a>
      </div>
    </main>
  );
}
