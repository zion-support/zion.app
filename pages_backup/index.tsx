import Link from 'next/link';
import { Server } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white">Free Tools Directory</h1>
        <p className="text-slate-300">Welcome to the free tools directory.</p>
        <Link href="/free-business-tools">Free Business Tools</Link>
      </div>
    </div>
  );
}