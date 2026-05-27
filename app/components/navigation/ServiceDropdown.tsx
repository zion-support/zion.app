'use client';

import Link from 'next/link';
import type { ServiceDropdownProps } from './types';

export function ServiceDropdown({ open, onClose }: ServiceDropdownProps) {
  if (!open) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-[700px] rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl shadow-purple-500/10 p-4 animate-in fade-in-0 zoom-in-95 backdrop-blur-md max-h-[85vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-3">
        {/* AI & Automation */}
        <div>
          <Link
            href="/services/?category=ai"
            onClick={onClose}
            className="block px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-purple-400">🧠 AI & Automation</div>
            <div className="text-[11px] text-slate-400 mt-0.5">ML, NLP, CV, RPA, agents</div>
          </Link>
        </div>
        {/* IT & Infrastructure */}
        <div>
          <Link
            href="/services/?category=it"
            onClick={onClose}
            className="block px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-colors"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400">🖥️ IT & Infrastructure</div>
            <div className="text-[11px] text-slate-400 mt-0.5">DevOps, SRE, networking, security</div>
          </Link>
        </div>
        {/* Cloud & DevOps */}
        <div>
          <Link
            href="/services/?category=cloud"
            onClick={onClose}
            className="block px-3 py-2 rounded-lg bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-500/20 hover:border-sky-500/40 transition-colors"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-sky-400">☁️ Cloud & DevOps</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Kubernetes, CI/CD, migrations</div>
          </Link>
        </div>
        {/* Security */}
        <div>
          <Link
            href="/services/?category=security"
            onClick={onClose}
            className="block px-3 py-2 rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 hover:border-red-500/40 transition-colors"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-red-400">🔐 Security & Compliance</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Penetration testing, IAM, SIEM</div>
          </Link>
        </div>
        {/* Data */}
        <div>
          <Link
            href="/services/?category=data"
            onClick={onClose}
            className="block px-3 py-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-500/40 transition-colors"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-green-400">📊 Data & Analytics</div>
            <div className="text-[11px] text-slate-400 mt-0.5">ETL, BI, data lakes, streaming</div>
          </Link>
        </div>
        {/* Automation */}
        <div>
          <Link
            href="/services/?category=automation"
            onClick={onClose}
            className="block px-3 py-2 rounded-lg bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 hover:border-pink-500/40 transition-colors"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-pink-400">🤖 Automation</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Workflows, RPA, process mining</div>
          </Link>
        </div>
      </div>

      {/* Featured actions */}
      <div className="border-t border-slate-800 my-3 pt-3 flex items-center gap-2">
        <Link
          href="/services/"
          onClick={onClose}
          className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors border border-purple-500/20"
        >
          Browse All Services →
        </Link>
        <Link
          href="/ai-services/"
          onClick={onClose}
          className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 transition-colors border border-pink-500/20"
        >
          AI Services Hub →
        </Link>
        <Link
          href="/tools/"
          onClick={onClose}
          className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors border border-purple-500/20"
        >
          Free Tools →
        </Link>
      </div>
    </div>
  );
}