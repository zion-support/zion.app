import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import { ArrowRight, BookOpen, FileText, Megaphone } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

export const metadata = {
  title: 'News & Resources | Zion Tech Group',
  description:
    'Latest news, blog posts, press releases, and resources from Zion Tech Group. Stay updated on AI solutions, product updates, and industry insights.',
  alternates: { canonical: '/news' },
};

const featuredPosts = [
  {
    slug: 'agentic-ai-autonomous-agents-enterprise-2026',
    title: 'Agentic AI: Autonomous Agents in the Enterprise 2026',
    excerpt: 'How autonomous AI agents are transforming enterprise workflows and multi-step automation.',
    category: 'AI Trends',
  },
  {
    slug: 'ai-in-legal-professional-services-automating-contract-review',
    title: 'AI in Legal & Professional Services: Automating Contract Review',
    excerpt: 'Reduce document review time and surface risk clauses with AI-powered legal analysis.',
    category: 'Industry Guide',
  },
  {
    slug: 'how-to-calculate-ai-roi-a-framework-for-enterprise-decision-makers',
    title: 'How to Calculate AI ROI: A Framework for Enterprise Decision Makers',
    excerpt: 'Connect AI investments to measurable business outcomes with a practical ROI framework.',
    category: 'Business',
  },
  {
    slug: 'responsible-ai-practices-for-enterprise-deployment',
    title: 'Responsible AI Practices for Enterprise Deployment',
    excerpt: 'Deploy AI with governance, bias monitoring, and audit-ready workflows.',
    category: 'Governance',
  },
  {
    slug: 'the-future-of-work-how-ai-is-redefining-every-role-in-the-enterprise',
    title: 'The Future of Work: How AI Is Redefining Every Role',
    excerpt: 'How AI is reshaping roles across the enterprise and what leaders need to know.',
    category: 'Strategy',
  },
];

const resourceLinks = [
  {
    icon: BookOpen,
    title: 'Blog',
    description: 'Insights on AI implementation, engineering best practices, and technology strategy.',
    href: '/blog',
  },
  {
    icon: Megaphone,
    title: 'Press & announcements',
    description: 'Press releases, media kit, and company news for journalists and analysts.',
    href: '/press',
  },
  {
    icon: FileText,
    title: 'Case studies',
    description: 'Real outcomes from teams across industries deploying Zion AI solutions.',
    href: '/case-studies',
  },
];

export default function NewsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-16 left-1/4 h-[24rem] w-[24rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-6rem] h-[20rem] w-[20rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'News' }]} className="mb-6" />
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            News & resources
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Stay updated on AI solutions and insights
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Latest blog posts, press releases, and resources from Zion Tech Group. From implementation
            guides to industry trends and product updates — one place to stay informed.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/blog"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
            >
              Browse all blog posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="/press"
              className="inline-flex items-center rounded-xl border border-slate-500/80 bg-slate-900/60 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-purple-300/70 hover:text-white"
            >
              Press & media
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/65 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Latest from the blog
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Recent articles and guides
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Practical insights on AI implementation, industry use cases, and delivery best practices.
          </p>
          <div className="mt-8 space-y-5">
            {featuredPosts.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl border border-slate-700/70 bg-slate-950/65 p-5 transition hover:border-purple-400/40 hover:bg-slate-900/80"
              >
                <span className="rounded-full border border-slate-600/80 bg-slate-800/60 px-2.5 py-1 text-xs font-medium text-purple-200">
                  {post.category}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-white transition group-hover:text-purple-200">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{post.excerpt}</p>
                <span className="mt-3 inline-flex text-sm font-semibold text-purple-300 group-hover:text-purple-200">
                  Read more
                  <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
          <a
            href="/blog"
            className="mt-6 inline-flex items-center text-sm font-semibold text-purple-300 hover:text-purple-200"
          >
            View all blog posts
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-900/80 to-slate-950/70 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Resources
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Where to find what you need
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Blog insights, press releases, and real-world case studies — all in one place.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {resourceLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5 transition hover:-translate-y-1 hover:border-purple-400/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15">
                  <item.icon className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white transition group-hover:text-purple-200">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                <span className="mt-3 inline-flex text-sm font-semibold text-purple-300 group-hover:text-purple-200">
                  Visit
                  <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/40 via-fuchsia-900/30 to-pink-900/40 p-8 text-center shadow-2xl sm:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Get insights delivered
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200">
            Visit our blog for the latest articles on AI implementation, industry guides, and
            product updates. No signup required — just read and share.
          </p>
          <a
            href="/blog"
            className="mt-8 inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Go to blog
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
