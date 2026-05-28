#!/usr/bin/env python3
"""v3 — handle multi-line AND single-line service objects in servicesData.ts"""
import re

NAV = '/Users/klebergarciaalcatrao/zion.app/app/constants/navigation.ts'
DAT = '/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts'

nav      = open(NAV).read()
content  = open(DAT).read()

data_ids = set(re.findall(r"\bid:\s*'([^']+)'", content))
nav_ids  = set(re.findall(r"href: '/services/([^']+)'", nav))
stale    = sorted(nav_ids - data_ids)
missing  = sorted(data_ids - nav_ids)

print(f"Stale: {len(stale)}  |  Missing: {len(missing)}")

# ── Category lookup (handles BOTH formats) ───────────────────────────────────
meta = {}
cur_id = None
for line in content.split('\n'):
    m1 = re.match(r"\s*id:\s*'([^']+)'", line)
    m2 = re.search(r",id:\s*'([^']+)'", line) or re.search(r"\{id:\s*'([^']+)'", line)
    if m1 or m2:
        cur_id = (m1 or m2).group(1)
    mt = re.search(r"title:'([^']+)'", line)
    mc = re.search(r"category:'([^']+)'", line)
    if cur_id:
        if mt and 'title' not in meta.get(cur_id, {}):
            meta.setdefault(cur_id, {})['title'] = mt.group(1)
        if mc:
            meta.setdefault(cur_id, {})['category'] = mc.group(1)
            cur_id = None

# Count category coverage
cats_found = {info.get('category','?') for info in meta.values()}
unmatched = [m for m in missing if not meta.get(m, {}).get('category')]
print(f"Meta entries: {len(meta)}  |  Categories: {cats_found}  |  Unmatched: {len(unmatched)}")
if unmatched:
    print("Unmatched IDs:", unmatched[:10])

# ── STEP 1: Remove stale lines ────────────────────────────────────────────────
new_lines = []
for line in nav.split('\n'):
    if not any(f"/services/{sid}" in line for sid in stale):
        new_lines.append(line)
nav = '\n'.join(new_lines)
nav = re.sub(r'\n{3,}', '\n\n', nav)
print(f"Removed stale lines ✓")

# ── STEP 2: Insert missing into CORRECT category blocks ──────────────────────
blocks = {
    'AI_SERVICE_LINKS':         'ai',
    'IT_SERVICE_LINKS':         'it',
    'CLOUD_SERVICE_LINKS':      'cloud',
    'SECURITY_SERVICE_LINKS':   'security',
    'DATA_SERVICE_LINKS':       'data',
    'AUTOMATION_SERVICE_LINKS': 'automation',
}

by_cat = {v: [] for v in blocks.values()}
for mid in missing:
    info  = meta.get(mid, {})
    cat   = info.get('category', mid.split('-')[0])
    title = info.get('title', mid.replace('-', ' ').title())
    if cat in by_cat:
        by_cat[cat].append((mid, f"  {{ name: '{title}', href: '/services/{mid}' }},\n"))
    else:
        # Last-resort fallback: prefix-based
        pfx = mid.split('-')[0]
        if pfx in by_cat:
            by_cat[pfx].append((mid, f"  {{ name: '{title}', href: '/services/{mid}' }},\n"))

total = 0
for const_name, pfx in blocks.items():
    entries = sorted(by_cat.get(pfx, []), key=lambda x: x[0])
    if not entries:
        continue
    pat  = rf'export const {const_name}.*?\n\];'
    m    = re.search(pat, nav, re.DOTALL)
    if not m:
        print(f"  WARN: {const_name} block not found for {'+'.join(e[0] for e in entries)}")
        continue
    btn  = m.group(0)
    pos  = btn.rfind('\n];')
    text = ''.join(e for _, e in entries)
    nav  = nav[:m.start()] + btn[:pos] + text + '\n];' + nav[m.end():]
    total += len(entries)
    print(f"  {const_name} ({pfx}): +{len(entries)}")

print(f"Total inserted: {total}")

# ── VERIFY ───────────────────────────────────────────────────────────────────
final_ids = set(re.findall(r"href: '/services/([^']+)'", nav))
print(f"\nNAV service hrefs: {len(final_ids)}")
print(f"Still stale:      {len(final_ids - data_ids)}")
print(f"Still missing:    {len(data_ids - final_ids)}")

open(NAV, 'w').write(nav)
print("Written ✓")
