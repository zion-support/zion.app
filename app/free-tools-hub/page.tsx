import Head from 'next/head';
import Link from 'next/link';

const categories = [
  {
    title: 'Free Developer Tools',
    desc: 'Essential tools for coding, testing, and deployment.',
    href: '/free-tools',
    icon: '🛠️',
  },
  {
    title: 'Free Resources & Tutorials',
    desc: 'Curated learning materials, templates, and guides.',
    href: '/free-resources',
    icon: '📚',
  },
  {
    title: 'Affiliate Offers',
    desc: 'Free tier credits and discounts from top cloud & AI providers.',
    href: '/ai-affiliate',
    icon: '🤝',
  },
  {
    title: 'Digital Products',
    desc: 'Premium digital goods sold via Gumroad, Lemon Squeezy, etc.',
    href: '/digital-products',
    icon: '🛒',
  },
  {
    title: 'Sponsorship',
    desc: 'Support Zion Tech Group via GitHub Sponsors, Patreon, and more.',
    href: '/sponsor',
    icon: '💖',
  },
];

export default function FreeToolsHub() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <Head>
        <title>Free Tools Hub | Zion Tech Group</title>
      </Head>
      <h1 className="text-4xl font-bold mb-4">Free Tools Hub</h1>
      <p className="mb-10 text-lg text-gray-300">
        Your launchpad for free tools, resources, and monetization opportunities—all in one place.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="group block rounded-2xl border border-slate-700 bg-slate-900/50 p-6 transition-colors hover:border-purple-500 hover:bg-slate-800/60"
          >
            <div className="mb-3 text-4xl">{c.icon}</div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-purple-400">{c.title}</h2>
            <p className="text-sm text-gray-400">{c.desc}</p>
          </Link>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link href="/" className="text-sm text-purple-400 hover:underline">← Back to Home</Link>
      </div>
    </main>
  );
}
