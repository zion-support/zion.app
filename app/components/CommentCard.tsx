// app/components/CommentCard.tsx — Reusable inline component for comment / status cards
'use client';
import type { ReactNode } from 'react';

export interface CommentCardProps {
  header: string;
  children?: ReactNode;
  status?: 'ok' | 'warn' | 'fail' | 'neutral';
  badge?: string;
}

const STATUS_ICON: Record<string, string> = {
  ok:    '✅',
  warn:  '⚠️',
  fail:  '❌',
  neutral: '›',
};
const STATUS_COLOR: Record<string, string> = {
  ok:    'border-emerald-500/40 bg-emerald-500/10',
  warn:  'border-yellow-500/40   bg-yellow-500/10',
  fail:  'border-red-500/40      bg-red-500/10',
  neutral: 'border-slate-700 bg-slate-900/60',
};

export default function CommentCard({ header, children, status = 'neutral', badge }: CommentCardProps) {
  return (
    <div className={`border rounded-xl p-5 transition ${STATUS_COLOR[status]}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{STATUS_ICON[status]}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{header}</h3>
            {badge && (
              <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">{badge}</span>
            )}
          </div>
          {children && <div className="text-slate-400 text-sm mt-1">{children}</div>}
        </div>
      </div>
    </div>
  );
}
