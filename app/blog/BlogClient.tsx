'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

type BlogPostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  icon: string;
};

type BlogClientProps = {
  posts: BlogPostMeta[];
  categories: string[];
};

export default function BlogClient({ posts, categories }: BlogClientProps) {
  const [selected, setSelected] = useState('');

  const syncFromHash = useCallback(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const category = params.get('category') ?? '';
    setSelected(category);
  }, []);

  useEffect(() => {
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [syncFromHash]);

  const setFilter = (category: string) => {
    setSelected(category);
    const hash = category ? `category=${encodeURIComponent(category)}` : '';
    window.history.replaceState(null, '', hash ? `#${hash}` : window.location.pathname);
  };

  const filtered = selected === '' ? posts : posts.filter((p) => p.category === selected);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <button
          type="button"
          onClick={() => setFilter('')}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
            !selected
              ? 'border border-purple-400/40 bg-purple-500/15 text-purple-100'
              : 'border border-slate-700 bg-slate-900/75 text-slate-200 hover:border-purple-400/40 hover:bg-purple-500/10'
          }`}
          aria-pressed={!selected}
        >
          All
        </button>
        {categories.map((category) => {
          const isActive = selected === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                isActive
                  ? 'border border-purple-400/40 bg-purple-500/15 text-purple-100'
                  : 'border border-slate-700 bg-slate-900/75 text-slate-200 hover:border-purple-400/40 hover:bg-purple-500/10'
              }`}
              aria-pressed={isActive}
            >
              {category}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((post) => (
          <article
            key={post.slug}
            className="group rounded-2xl border border-slate-700/70 bg-slate-900/65 p-6 transition hover:-translate-y-1 hover:border-purple-400/60 hover:shadow-xl hover:shadow-purple-500/10"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-xl border border-slate-700 bg-slate-950/70 p-2 text-3xl">
                {post.icon}
              </span>
              <span className="rounded-full border border-slate-600 bg-slate-800/70 px-3 py-1 text-xs font-medium text-slate-300">
                {post.category}
              </span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white transition group-hover:text-purple-300">
              {post.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{post.excerpt}</p>
            <div className="mt-4 flex items-center justify-between border-t border-slate-700/70 pt-4">
              <span className="text-xs text-slate-400">{post.date}</span>
              <span className="text-xs text-slate-400">{post.readTime}</span>
            </div>
            <a
              href={`/blog/${post.slug}`}
              className="mt-3 inline-block text-sm font-semibold text-purple-300"
            >
              Read article →
            </a>
          </article>
        ))}
      </div>
    </>
  );
}
