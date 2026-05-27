'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavLinkItemProps } from './types';

export function NavLink({ link, onNavigate }: NavLinkItemProps) {
  const pathname = usePathname();
  const active = link.href === '/'
    ? pathname === '/'
    : pathname.startsWith(link.href);
  return (
    <Link
      href={link.href}
      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'text-purple-400 bg-purple-500/10'
          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
      }`}
      onClick={onNavigate}
    >
      {link.name}
    </Link>
  );
}

export function DropdownItem({ link, onNavigate }: NavLinkItemProps) {
  const pathname = usePathname();
  const active = link.href === '/'
    ? pathname === '/'
    : pathname.startsWith(link.href);
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
        active
          ? 'text-purple-400 bg-purple-500/10'
          : 'text-slate-300 hover:text-white hover:bg-slate-800'
      }`}
    >
      {link.name}
    </Link>
  );
}