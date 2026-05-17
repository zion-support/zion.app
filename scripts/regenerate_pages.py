#!/usr/bin/env python3
"""
Regenerate ALL service pages from servicesData.ts
- Brace-matching parser (no regex gaps)
- Robust per-field extraction using quoted-string capture
- Deduplication
- Href normalization to filesystem paths
"""
import re, json
from pathlib import Path

def extract_array_content(src, name):
    # Matches: export const name[: Service[]]? = [content];
    m = re.search(rf'export const {re.escape(name)}\s*:\s*Service\[\]\s*=\s*\[([\s\S]*?)\];', src, re.DOTALL)
    return m.group(1) if m else ''

def parse_blocks(arr_content):
    blocks, depth, start, in_str, str_char = [], 0, 0, False, None
    for i, c in enumerate(arr_content):
        if in_str:
            if c == '\\' and i+1 < len(arr_content) and arr_content[i+1] == str_char:
                i += 1; continue
            if c == str_char: in_str = False
            continue
        if c in ("'", '"', '`'):
            in_str, str_char = True, c; continue
        if c == '{':
            if depth == 0: start = i
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0: blocks.append(arr_content[start:i+1])
    return blocks

def extract_props(block):
    res = {'features': [], 'benefits': []}
    # Single-quoted or double-quoted simple string fields
    for field in ('id','href','icon','category','title','description'):
        # Captures value inside single or double quotes
        m = re.search(rf"{field}\s*:\s*['\"]([^'\"]+)['\"]", block)
        if m:
            res[field] = m.group(1)
    # features & benefits arrays (multi-line)
    for arr_field in ('features','benefits'):
        m = re.search(rf"{arr_field}\s*:\s*\[([\s\S]*?)\]\s*(?:,|}})", block)
        if m:
            inner = m.group(1)
            items = re.findall(r"'([^']+)'", inner) + re.findall(r'"([^"]+)"', inner)
            res[arr_field] = items
    # pricing JSON object
    pm = re.search(r'pricing\s*:\s*\{([\s\S]*?)\}(?=\s*(?:,|}))', block)
    if pm:
        try:
            res['pricing'] = json.loads('{' + pm.group(1) + '}')
        except:
            res['pricing'] = {}
    return res

# ── Main ──────────────────────────────────────────────────────────────────────
root = Path('.')
with open('app/data/servicesData.ts', 'r', encoding='utf-8') as f:
    source = f.read()

ai_blocks = parse_blocks(extract_array_content(source, 'aiServices'))
it_blocks = parse_blocks(extract_array_content(source, 'itServices'))
all_blocks = [(b,'ai') for b in ai_blocks] + [(b,'it') for b in it_blocks]

seen = set()
services = []
for blk, cat in all_blocks:
    p = extract_props(blk)
    if not p.get('id') or not p.get('href'): continue
    if p['id'] in seen: continue
    seen.add(p['id'])
    # Normalize href
    href = p['href']
    if not href.startswith('/'): href = '/' + href
    p['href'] = href
    p['category'] = cat
    services.append(p)

print(f"✅ Parsed {len(services)} unique services")

# ── Page template ────────────────────────────────────────────────────────────
page_tpl = """export const metadata = {{
  title: "{title} | Zion Tech Group",
  description: "{desc}"
}};

import ServiceLayout from '@/app/components/ServiceLayout';
import {{ servicesData }} from '@/app/data/servicesData';

export default function {ComponentName}Page() {{
  const service = servicesData.find(s => s.id === '{sid}');
  if (!service) return <div>Service not found</div>;

  return (
    <ServiceLayout
      icon={{service.icon}}
      title={{service.title}}
      description={{service.description}}
      category={{service.category}}
      features={{service.features}}
      benefits={{service.benefits}}
      pricing={{service.pricing}}
      href={{service.href}}
      contactPhone="+1 302 464 0950"
      contactEmail="kleber@ziontechgroup.com"
      contactAddress="364 E Main St STE 1008, Middletown, DE 19709"
    />
  );
}}
"""

def comp_name(sid):
    return ''.join(x.capitalize() for x in sid.split('-'))

generated, skipped = 0, 0
for s in services:
    dir_type = 'ai-services' if s['category'] == 'ai' else 'it-services'
    # Derive path from href: /ai-services/foo-bar -> ai-services/foo-bar
    href_clean = s['href'].lstrip('/').replace('/', '-')
    href_clean = re.sub(r'[^a-z0-9-_]', '', href_clean.lower())
    out_dir = root / 'app' / dir_type / href_clean
    out_file = out_dir / 'page.tsx'

    content = page_tpl.format(
        title=s['title'],
        desc=s['description'].replace('"', ''),
        ComponentName=comp_name(s['id']),
        sid=s['id']
    )
    out_dir.mkdir(parents=True, exist_ok=True)
    if not out_file.exists() or out_file.read_text() != content:
        out_file.write_text(content, encoding='utf-8')
        generated += 1
    else:
        skipped += 1

print(f"✅ Generated {generated} updated pages ({skipped} unchanged)")
print(f"📊 Total services: {len(services)}")
