// app/api/tools/ping/route.ts — lightweight tools usage tracker (no auth needed)
import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_PATH = join(process.cwd(), '..', '..', 'data', 'tools-usage.json');

interface Stat {
  page: string;
  window: string;   // YYYY-MM-DD (the day of the visit)
  count: number;
}
type UsageData = Record<string, Stat>;

function load(): UsageData {
  try { return JSON.parse(readFileSync(DATA_PATH, 'utf-8')); }
  catch { return {}; }
}
function save(d: UsageData) {
  mkdirSync(join(DATA_PATH, '..'), { recursive: true });
  writeFileSync(DATA_PATH, JSON.stringify(d, null, 2));
}

export async function GET() {
  return NextResponse.json(load());
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Record<string, string>;
  const slug = (body.tool || body.page || '').replace(/^\//, '').replace(/\/$/, '');
  if (!slug) return NextResponse.json({ error: 'tool or page required' }, { status: 400 });

  const today = new Date().toISOString().slice(0, 10);
  const id   = `${slug}__${today}`;
  const data = load();

  if (!data[id]) data[id] = { page: slug, window: today, count: 0 };
  data[id].count += 1;
  save(data);
  return NextResponse.json({ ok: true, tool: slug, total: data[id].count });
}
