#!/usr/bin/env python3
"""Properly insert new services into each category array before their closing ];"""
import re, json
from pathlib import Path
from collections import defaultdict

WORKDIR = Path('/Users/klebergarciaalcatrao/zion.app')
SD_FILE  = WORKDIR / 'app' / 'data' / 'servicesData.ts'
JSON_FILE = WORKDIR / 'app' / 'data' / 'servicesData.json'

src = SD_FILE.read_text()
existing_ids = set(re.findall(r"id:\s*'([^']+)'", src))
print(f"Existing TS IDs before: {len(existing_ids)}")

# ── Load new services from JSON files ──────────────────────────────────────────────────
new_by_cat = defaultdict(list)
for fname, cat in [('new_services_ai.json','ai'),('new_services_it.json','it'),('new_services_cloud.json','cloud'),
                    ('new_services_security.json','security'),('new_services_data.json','data'),('new_services_automation.json','automation')]:
    f = WORKDIR / 'app' / 'data' / fname
    if f.exists():
        for item in json.loads(f.read_text()):
            if item['id'] not in existing_ids:
                new_by_cat[cat].append(item)

for cat, items in new_by_cat.items():
    print(f"  {cat}: {len(items)} new services to add")

# ── Format services as TS objects ─────────────────────────────────────────────────
def fmt(svc):
    p = svc['pricing'] if isinstance(svc.get('pricing'), dict) else {'basic': svc.get('basic','0'), 'pro': svc.get('pro','0'), 'enterprise': svc.get('enterprise','0')}
    ci = {"website": f"/services/{svc['id']}", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"}
    pop = 'true' if svc.get('popular', False) else 'false'
    return (
        f"\n  {{\n"
        f"    id: '{svc['id']}',\n"
        f"    title: '{svc['title']}',\n"
        f"    description: '{svc['description']}',\n"
        f"    icon: '\\u2605',\n"
        f"    features: {json.dumps(svc['features'])},\n"
        f"    benefits: {json.dumps(svc['benefits'])},\n"
        f"    pricing: {json.dumps(p)},\n"
        f"    contactInfo: {json.dumps(ci)},\n"
        f"    href: '/services/{svc['id']}',\n"
        f"    category: '{svc['arr'] if 'arr' in svc else svc.get('category','')}',\n"
        f"    popular: {pop},\n"
        f"  }},"
    )

# ── Find closing ]; of each category array and insert ───────────────────────
# Strategy: for each category, find its export marker, then scan forward
# to find the LAST "];\n" before the next "export const" — that's the end of the array
arr_markers = {
    'ai':        'export const aiServices',
    'it':        'export const itServices',
    'cloud':     'export const cloudServices',
    'security':  'export const securityServices',
    'data':      'export const dataServices',
    'automation':'export const automationServices',
}

inserted_count = 0
new_src = src
for cat, marker in arr_markers.items():
    items = new_by_cat.get(cat, [])
    if not items:
        continue
    
    # Find position of this category's export
    search_start = new_src.find(marker)
    if search_start == -1:
        print(f"  {cat}: MARKER NOT FOUND")
        continue
    
    # The array body starts after the first '[' 
    arr_start = new_src.find('[', search_start)
    if arr_start == -1:
        print(f"  {cat}: OPENING BRACKET NOT FOUND")
        continue
    
    # Find the closing '];' — scan from arr_start to find the matching outer ]
    depth = 0
    pos = arr_start
    while pos < len(new_src):
        if new_src[pos] == '[':  # open includes [[], [{}]]
            depth += 1
        elif new_src[pos] == ']':
            depth -= 1
            if depth == 0:
                # Check if followed by optional whitespace and ';'
                rest = new_src[pos:].lstrip(']')
                is_end = rest.startswith(';') or '\n' in rest[:pos+20]
                # Accept if it's a standalone ]; or followed by }; — the former has more whitespace chars or \n
                if is_end:
                    insert_at = pos  # right after the closing ]
                    entries_text = ''.join(fmt(item) for item in items) + '\n'
                    new_src = new_src[:insert_at] + entries_text + new_src[insert_at:]
                    inserted_count += len(items)
                    print(f"  {cat}: inserted {len(items)} at char {insert_at}")
                    break
                else:
                    pass  # keep looking
        pos += 1
    else:
        print(f"  {cat}: could NOT find array end")

print(f"\nTotal inserted: {inserted_count}")
final_ids = set(re.findall(r"id:\s*'([^']+)'", new_src))
print(f"Total unique IDs after: {len(final_ids)}")

# Also update servicesData.json
jdata = json.loads(JSON_FILE.read_text())
jmap = {s['id']: s for s in jdata}
json_added = 0
for cat_items in new_by_cat.values():
    for item in cat_items:
        jmap[item['id']] = {
            'id': item['id'], 'title': item['title'], 'description': item['description'],
            'icon': '★', 'features': item['features'], 'benefits': item['benefits'],
            'pricing': item.get('pricing', {'basic': item.get('basic','0'), 'pro': item.get('pro','0'), 'enterprise': item.get('enterprise','0')}),
            'contactInfo': {'website': f"/services/{item['id']}", 'email': 'kleber@ziontechgroup.com', 'phone': '+1 302 464 0950'},
            'href': f"/services/{item['id']}",
            'category': item.get('category', cat_items[0].get('category','') if cat_items else ''),
            'popular': item.get('popular', False)
        }
        json_added += 1

with JSON_FILE.open('w') as f:
    json.dump(list(jmap.values()), f, indent=2)
print(f"Added {json_added} to servicesData.json (total: {len(jmap)})")

# Write
SD_FILE.write_text(new_src)
inserted_final = set(re.findall(r"id:\s*'([^']+)'", new_src))
print(f"\nFinal servicesData.ts unique IDs: {len(inserted_final)}")
