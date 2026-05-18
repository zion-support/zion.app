// app/search/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { allServices, type Service } from '@/data/servicesData';

function getQuery() {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('q') || '';
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Service[]>([]);

  useEffect(() => {
    const q = getQuery();
    setQuery(q);
    if (q.trim()) {
      const filtered = allServices.filter(
        (s: Service) =>
          s.title.toLowerCase().includes(q.toLowerCase()) ||
          s.description.toLowerCase().includes(q.toLowerCase()) ||
          s.category.toLowerCase().includes(q.toLowerCase())
      );
      setResults(filtered);
    }
  }, []);

  const doSearch = (q: string) => {
    setQuery(q);
    if (q.trim()) {
      const filtered = allServices.filter(
        (s: Service) =>
          s.title.toLowerCase().includes(q.toLowerCase()) ||
          s.description.toLowerCase().includes(q.toLowerCase()) ||
          s.category.toLowerCase().includes(q.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
    window.history.pushState({}, '', `/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Search Services</h1>
      <p className="text-slate-400 mb-8">Find the perfect AI, IT, or Micro-SaaS solution for your needs.</p>

      <div className="mb-8">
        <input
          type="search"
          placeholder="Search AI services, IT solutions, automation..."
          value={query}
          onChange={(e) => doSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); doSearch(query); } }}
          autoFocus
          className="w-full px-5 py-4 rounded-2xl bg-slate-900/60 border border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-lg"
        />
      </div>

      {query && (
        <p className="text-slate-400 mb-6">
          {results.length} result{results.length !== 1 && 's'} for &ldquo;{query}&rdquo;
        </p>
      )}

      {results.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="glass-card"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">{service.icon}</span>
                <div>
                  <h3 className="font-semibold text-white text-sm">{service.title}</h3>
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2">{service.description}</p>
                  <span className="text-purple-400 text-xs mt-2 inline-block">View details →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg mb-4">No services match &ldquo;{query}&rdquo;</p>
          <Link href="/services" className="btn-primary">Browse All Services</Link>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg">Start typing to search 416+ services</p>
        </div>
      )}
    </div>
  );
}
