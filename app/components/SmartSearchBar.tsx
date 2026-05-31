'use client';
export default function SmartSearchBar({ placeholder, onSearch }: { placeholder?: string; onSearch?: (q: string) => void }) {
  return <input type="search" placeholder={placeholder || 'Search...'} onChange={e => onSearch?.(e.target.value)} />;
}
