'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SiteBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Reusable breadcrumb component with:
 *  - schema.org BreadcrumbList JSON-LD for SEO
 *  - WAI-ARIA `aria-label="Breadcrumb"` landmark
 *  - '/' separators between items
 *  - Responsive truncation: on mobile (<768px), shows first + last 2 items
 *    with an ellipsis for skipped items and text truncation on long labels
 *  - Last item rendered as plain text (no link) with `aria-current="page"`
 */
export default function SiteBreadcrumbs({ items, className = '' }: SiteBreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  // JSON-LD structured data for Google / schema.org
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => {
      const entry: Record<string, unknown> = {
        '@type': 'ListItem',
        position: i + 1,
        name: item.label,
      };
      if (item.href) {
        entry.item = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}${item.href}`;
      }
      return entry;
    }),
  };

  // Mobile truncation: show first item, then last 2 (skip the middle ones)
  const needsTruncation = items.length > 4;
  const mobileVisibleIndices = new Set<number>();

  if (needsTruncation) {
    // Show first item + the last 2 items on mobile
    mobileVisibleIndices.add(0);
    mobileVisibleIndices.add(items.length - 2);
    mobileVisibleIndices.add(items.length - 1);
  }

  const showEllipsisAtIndex = needsTruncation ? 1 : -1;

  return (
    <>
      {/* JSON-LD structured data — primary source for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className={`w-full ${className}`}>
        <ol
          className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            const isHiddenMobile =
              needsTruncation && !mobileVisibleIndices.has(i);
            const isEllipsisTarget = showEllipsisAtIndex === i;

            return (
              <li
                key={`bc-${i}`}
                className={`flex items-center ${
                  isHiddenMobile ? 'hidden md:flex' : 'flex'
                }`}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {/* Separator (except for first item) */}
                {i > 0 && (
                  <span
                    className="mx-1.5 text-gray-400 dark:text-gray-500 select-none shrink-0"
                    aria-hidden="true"
                  >
                    /
                  </span>
                )}

                {/* Ellipsis indicator for skipped items on mobile */}
                {isEllipsisTarget && (
                  <span
                    className="md:hidden text-gray-400 dark:text-gray-500 px-0.5 select-none"
                    aria-hidden="true"
                  >
                    &hellip;
                  </span>
                )}

                {/* If this is the ellipsis target, the label is hidden on mobile but visible on desktop */}
                {isEllipsisTarget && (
                  <span className="hidden md:inline">
                    {renderItem(item, isLast)}
                  </span>
                )}

                {/* Normal rendering: hidden on mobile if truncated, always visible on desktop */}
                {!isEllipsisTarget && renderItem(item, isLast)}

                {/* schema.org position meta */}
                <meta itemProp="position" content={`${i + 1}`} />
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );

  function renderItem(item: BreadcrumbItem, isLast: boolean) {
    if (isLast || !item.href) {
      return (
        <span
          className="truncate max-w-[120px] md:max-w-[200px] text-gray-800 dark:text-gray-100 font-medium"
          aria-current={isLast ? 'page' : undefined}
          itemProp="name"
        >
          {item.label}
        </span>
      );
    }

    return (
      <Link
        href={item.href}
        className="truncate max-w-[120px] md:max-w-[200px] text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors"
        itemProp="item"
      >
        <span itemProp="name">{item.label}</span>
      </Link>
    );
  }
}