'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search as SearchIcon, ArrowRight, Layers, FileText, Building2, Package } from 'lucide-react';
import { AI_SERVICE_LINKS } from '../constants/navigation';
import Breadcrumb from '../components/Breadcrumb';

type SearchableItem = {
  name: string;
  href: string;
  group: string;
};

const resourceLinks: SearchableItem[] = [
  { name: 'Solutions', href: '/solutions', group: 'Pages' },
  { name: 'FAQ', href: '/faq', group: 'Pages' },
  { name: 'Services', href: '/services', group: 'Pages' },
  { name: 'Products', href: '/products', group: 'Pages' },
  { name: 'AI Services', href: '/ai-services', group: 'Pages' },
  { name: 'Industries', href: '/industries', group: 'Pages' },
  { name: 'Innovation Bundles', href: '/innovation-bundles', group: 'Pages' },
  { name: 'Pricing', href: '/pricing', group: 'Pages' },
  { name: 'Blog', href: '/blog', group: 'Pages' },
  { name: 'Case Studies', href: '/case-studies', group: 'Pages' },
  { name: 'Consultation', href: '/consultation', group: 'Pages' },
  { name: 'Micro SAAS Services', href: '/micro-saas-services', group: 'Pages' },
  { name: 'Automation', href: '/automation', group: 'Pages' },
  { name: 'About', href: '/about', group: 'Pages' },
  { name: 'Careers', href: '/careers', group: 'Pages' },
  { name: 'Community', href: '/community', group: 'Pages' },
  { name: 'Contact', href: '/contact', group: 'Pages' },
];

const browseCategories = [
  { label: 'Industry Solutions', href: '/industries', icon: Building2 },
  { label: 'AI Products & Apps', href: '/products', icon: Layers },
  { label: 'Innovation Bundles', href: '/innovation-bundles', icon: Package },
  { label: 'Case Studies', href: '/case-studies', icon: FileText },
];

const allItems: SearchableItem[] = [
  ...resourceLinks,
  ...AI_SERVICE_LINKS.map((link) => ({
    name: link.name,
    href: link.href,
    group: 'AI Services',
  })),
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams?.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    const path = value.trim() ? `/search?q=${encodeURIComponent(value.trim())}` : '/search';
    router.replace(path, { scroll: false });
  };

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return allItems;
    return allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.href.toLowerCase().includes(normalizedQuery) ||
        item.group.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 left-1/3 h-[24rem] w-[24rem] rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-3xl px-4 pb-8 pt-20 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} className="mb-6" />
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Search
          </h1>
          <p className="mt-4 text-slate-300">
            Find pages, AI services, products, and resources across Zion Tech Group. Search by name, category, or keyword.
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Browse by Industries, Products, or Case Studies — or type to filter results instantly.
          </p>
          <div className="mt-6 rounded-xl border border-slate-700/70 bg-slate-900/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-purple-300">Tips</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-300">
              <li>• Type part of a page name (e.g., &quot;chatbot&quot;, &quot;healthcare&quot;) to narrow results</li>
              <li>• Use category links below to browse by Industry, Products, or Case Studies</li>
              <li>• Results update as you type — no need to press Enter</li>
            </ul>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-400">Popular searches</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <a
                href="/search?q=chatbot"
                className="rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 transition hover:border-purple-400/50 hover:text-white"
              >
                Chatbot
              </a>
              <a
                href="/search?q=automation"
                className="rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 transition hover:border-purple-400/50 hover:text-white"
              >
                Automation
              </a>
              <a
                href="/search?q=healthcare"
                className="rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 transition hover:border-purple-400/50 hover:text-white"
              >
                Healthcare
              </a>
              <a
                href="/search?q=pricing"
                className="rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 transition hover:border-purple-400/50 hover:text-white"
              >
                Pricing
              </a>
              <a
                href="/search?q=document"
                className="rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 transition hover:border-purple-400/50 hover:text-white"
              >
                Document
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <label className="block">
            <span className="sr-only">Search</span>
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search pages, services, or solutions..."
                className="w-full rounded-xl border border-slate-600/80 bg-slate-900/80 py-4 pl-12 pr-4 text-sm text-slate-100 placeholder:text-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                autoFocus
              />
            </div>
          </label>
          <p className="mt-2 text-right text-xs text-slate-400">
            {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-3xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold text-slate-300">Browse by category</p>
          <div className="flex flex-wrap gap-3">
            {browseCategories.map((cat) => (
              <a
                key={cat.href}
                href={cat.href}
                className="flex items-center gap-2 rounded-xl border border-slate-700/70 bg-slate-900/65 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-purple-400/50 hover:text-white"
              >
                <cat.icon className="h-4 w-4 text-purple-400" />
                {cat.label}
                <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
              </a>
            ))}
          </div>
        </div>

        {results.length > 0 ? (
          <div className="space-y-2">
            {results.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/70 bg-slate-900/65 px-5 py-4 transition hover:border-purple-400/50 hover:bg-slate-900/80"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{item.group}</p>
                </div>
                <span className="rounded-md border border-slate-700 bg-slate-950/70 px-2 py-0.5 text-[11px] text-slate-300">
                  {item.href}
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/65 p-8 text-center">
            <p className="text-lg font-semibold text-white">No results found</p>
            <p className="mt-2 text-sm text-slate-300">
              Try different keywords or{' '}
              <a href="/contact" className="font-medium text-purple-300 hover:text-purple-200">
                contact us
              </a>{' '}
              for help.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
