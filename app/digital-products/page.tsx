import Head from 'next/head';
import Link from 'next/link';

const products = [
  {
    name: 'AI‑Service Starter Guide',
    description: 'Step‑by‑step guide to launch your first AI service with Next.js.',
    price: '$9.99',
    gumroadUrl: 'https://gumroad.com/l/your‑product‑id', // replace with real Gumroad link
  },
  {
    name: 'Zion Tech Dashboard Template',
    description: 'Ready‑to‑use Tailwind + React dashboard template.',
    price: '$14.99',
    lemonSqueezyUrl: 'https://lemonsqueezy.com/checkout/your‑product‑id', // replace with real Lemon Squeezy link
  },
  {
    name: 'Prompt Engineering Cheat Sheet',
    description: 'Printable PDF with 50+ proven prompts for AI apps.',
    price: '$4.99',
    gumroadUrl: 'https://gumroad.com/l/your‑cheatsheet‑id',
  },
];

export default function DigitalProducts() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <Head>
        <title>Digital Products | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Digital Products</h1>
      <p className="mb-6 text-gray-300">
        Buy our curated digital products and accelerate your AI‑powered projects.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.name} className="rounded-xl border border-slate-700 bg-slate-900/50 p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-sm text-gray-400 flex-1">{product.description}</p>
            <p className="mt-4 text-2xl font-bold text-purple-400">{product.price}</p>
            <div className="mt-4 flex gap-3">
              {product.gumroadUrl && (
                <a
                  href={product.gumroadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-center text-white hover:bg-purple-500 transition"
                >
                  Buy on Gumroad
                </a>
              )}
              {product.lemonSqueezyUrl && (
                <a
                  href={product.lemonSqueezyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-lg bg-yellow-500 px-4 py-2 text-center text-black hover:bg-yellow-400 transition"
                >
                  Buy on Lemon Squeezy
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/monetization" className="text-sm text-purple-400 hover:underline">
          ← Back to Monetization Options
        </Link>
      </div>
    </main>
  );
}
