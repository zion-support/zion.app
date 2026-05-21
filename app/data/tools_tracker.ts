// tools_tracker.ts — localStorage-based visits tracker (zero backend)
'use client';

const KEY = 'ztg_tool_visits';
const STORAGE_KEY = 'ztg_tool_visited';

function readAll(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
  catch { return {}; }
}
function writeAll(data: Record<string, number>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function pingTool(slug: string) {
  if (typeof window === 'undefined') return;
  // Once per session
  if (sessionStorage.getItem(STORAGE_KEY + '_' + slug)) return;
  sessionStorage.setItem(STORAGE_KEY + '_' + slug, '1');

  const data = readAll();
  data[slug] = (data[slug] || 0) + 1;
  writeAll(data);
}

export function getToolVisits(): Record<string, number> {
  return readAll();
}
