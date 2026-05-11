'use client';

import { useState } from 'react';
import Link from 'next/link';

type AppCollectionLink = {
  name: string;
  href: string;
};

type AppCollection = {
  title: string;
  description: string;
  icon: string;
  links: AppCollectionLink[];
};

export default function AppCollectionGrid({
  collections,
}: {
  collections: AppCollection[];
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {collections.map((collection) => {
        const isExpanded = expanded === collection.title;
        const visibleLinks = isExpanded ? collection.links : collection.links.slice(0, 4);

        return (
          <div
            key={collection.title}
            className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5 shadow-lg shadow-black/20"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{collection.title}</h3>
              <span className="text-2xl">{collection.icon}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">{collection.description}</p>
            <ul className="mt-4 space-y-2">
              {visibleLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-300 transition hover:text-purple-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            {collection.links.length > 4 && (
              <button
                type="button"
                onClick={() => setExpanded(isExpanded ? null : collection.title)}
                className="mt-3 text-xs font-semibold text-purple-300 transition hover:text-purple-200"
              >
                {isExpanded
                  ? 'Show less'
                  : `+${collection.links.length - 4} more`}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
