import type { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS } from '@/data/blogPosts';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Insights on AI, automation, enterprise IT, and digital transformation from the Zion Tech Group team.',
  alternates: { canonical: '/blog/' },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00Z');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export default function BlogIndexPage() {
  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* JSON-LD: Blog + BreadcrumbList */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Zion Tech Group Blog',
            description:
              'Insights on AI, automation, enterprise IT, and digital transformation from the Zion Tech Group team.',
            url: 'https://ziontechgroup.com/blog',
            publisher: {
              '@type': 'Organization',
              name: 'Zion Tech Group',
              url: 'https://ziontechgroup.com',
            },
            blogPosts: BLOG_POSTS.slice(0, 10).map((p) => ({
              '@type': 'BlogPosting',
              headline: p.title,
              url: `https://ziontechgroup.com/blog/${p.slug}`,
            })),
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ziontechgroup.com' },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://ziontechgroup.com/blog' },
              ],
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Zion Tech Group Blog',
            description:
              'Insights on AI, automation, enterprise IT, and digital transformation from the Zion Tech Group team.',
            url: 'https://ziontechgroup.com/blog',
            publisher: {
              '@type': 'Organization',
              name: 'Zion Tech Group',
              logo: { '@type': 'ImageObject', url: 'https://ziontechgroup.com/logo.png' },
            },
            inLanguage: 'en-US',
          }),
        }}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 left-[-10rem] h-[32rem] w-[32rem] rounded-full bg-purple-500/15 blur-3xl" />
        <div className="absolute right-[-12rem] top-32 h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <header className="mb-16 text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
            Insights &amp; Resources
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5">
            Zion Tech Group Blog
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {BLOG_POSTS.length} articles on AI, enterprise automation, IT infrastructure,
            cloud architecture and digital transformation from the experts at Zion Tech Group.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map(({ slug, title, excerpt, category, date }) => (
            <Link
              key={slug}
              href={`/blog/${slug}`}
              className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-purple-500/40 hover:bg-slate-800/60 transition-all duration-200 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="rounded-full border border-purple-400/40 bg-purple-500/15 px-2.5 py-0.5 text-[11px] font-medium text-purple-200">
                  {category}
                </span>
                <time className="text-[11px] text-slate-500">{formatDate(date)}</time>
              </div>
              <h2 className="text-base font-semibold text-white leading-snug group-hover:text-purple-200 transition-colors mb-2">
                {title}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-3 flex-1">
                {excerpt}
              </p>
              <span className="text-sm font-medium text-purple-400 group-hover:text-purple-300 transition-colors">
                Read more →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/contact/"
            className="inline-flex items-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-base font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Get Free Consultation →
          </Link>
        </div>
      </div>
    </div>
  );
}
