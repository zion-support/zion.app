'use client';

export default function Breadcrumb({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400">
      {items.map((item, index) => (
        <>
          <a
            href={item.href || '#'}
            className="hover:text-slate-200 transition-colors"
          >
            {item.label}
          </a>
          {index < items.length - 1 && <span> › </span>}
        </>
      ))}
    </nav>
  );
}