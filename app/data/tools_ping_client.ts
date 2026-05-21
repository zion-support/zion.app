// tools_ping_client.ts — fire-and-forget page-view ping for /tools/* pages
'use client';

const seen = new Set<string>();

export function pingTool(slug: string) {
  if (typeof window === 'undefined') return;
  if (seen.has(slug)) return;
  seen.add(slug);
  sessionStorage.setItem('tp_' + slug, '1');
  fetch('/api/tools/ping', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool: slug }),
  }).catch(() => {});
}
