#!/usr/bin/env python3
"""
v2 — Build public/service-index.json from servicesData.ts by extracting each
service object individually using bracket-depth scanning.

For each {id:'...'} object found:
  - Walk forward until the closing } (depth=0)
  - Extract id, title, description, category, pricing, popular via regex
"""
import re, json, os
from datetime import datetime, timezone

DAT  = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                    'app', 'data', 'servicesData.ts')
OUT  = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                    'public', 'service-index.json')

ID_RE   = re.compile(r"id:\s*'([^']+)'")
TITLE_RE= re.compile(r"title:\s*'([^']+)'")
DESC_RE = re.compile(r"description:\s*'([^']+)'")
CAT_RE  = re.compile(r"category:\s*'(\w+)'")
BAS_RE  = re.compile(r"'basic':\s*'([^']*)'")
PRO_RE  = re.compile(r"'pro':\s*'([^']*)'")
ENT_RE  = re.compile(r"'enterprise':\s*'([^']*)'")
POP_RE  = re.compile(r"popular:\s*(true|false)")
FEAT_RE = re.compile(r"features:\s*\[([^\]]*)\]", re.DOTALL)
BENE_RE = re.compile(r"benefits:\s*\[([^\]]*)\]", re.DOTALL)

def main():
    content = open(DAT).read()
    services = []
    n = len(content)

    # Scan for every occurrence of id: in the file
    for m in ID_RE.finditer(content):
        sid = m.group(1)

        # Walk forward from this id to find object close
        # Object starts at  {   before the id
        start = content.rfind('{', max(0, m.start()-5), m.start()+1)
        if start < 0:
            start = m.start()

        # Walk forward tracking bracket depth
        depth = 0
        end = m.start()
        in_str = False
        str_ch = None
        for i in range(start, min(n, start+8000)):  # cap at 8KB per object
            c = content[i]
            if in_str:
                if c == '\\':
                    i += 1  # skip escaped char
                    continue
                if c == str_ch:
                    in_str = False
            else:
                if c in ("'", '"'):
                    in_str = True
                    str_ch = c
                elif c == '{':
                    depth += 1
                elif c == '}':
                    depth -= 1
                    if depth == 0:
                        end = i + 1
                        break
        if depth != 0:
            continue  # couldn't find close

        block = content[start:end]

        # Extract fields from block
        title_m = TITLE_RE.search(block)
        desc_m  = DESC_RE.search(block)
        cat_m   = CAT_RE.search(block)
        bas_m   = BAS_RE.search(block)
        pro_m   = PRO_RE.search(block)
        ent_m   = ENT_RE.search(block)
        pop_m   = POP_RE.search(block)

        if not cat_m:
            continue

        features, benefits = [], []
        fm = FEAT_RE.search(block)
        if fm:
            features = re.findall(r"'([^']+)'", fm.group(1))
        bm = BENE_RE.search(block)
        if bm:
            benefits = re.findall(r"'([^']+)'", bm.group(1))

        services.append({
            'id':         sid,
            'title':      (title_m or type('x', (), {'group': lambda s: ''})()).group(1).replace("'", "") if title_m else sid.replace('-', ' ').title(),
            'description': (desc_m.group(1) if desc_m else ''),
            'category':   cat_m.group(1),
            'features':   features,
            'benefits':   benefits,
            'basic':      (bas_m or type('x', (), {'group': lambda s: ''})()).group(1) if bas_m else '',
            'pro':        (pro_m.group(1) if pro_m else ''),
            'enterprise': (ent_m.group(1) if ent_m else ''),
            'popular':    (pop_m.group(1) == 'true') if pop_m else False,
        })

    # Deduplicate preserving order
    seen = {}
    uniq = []
    for s in services:
        if s['id'] not in seen:
            seen[s['id']] = True
            uniq.append(s)

    by_cat = {}
    for s in uniq:
        by_cat[s['category']] = by_cat.get(s['category'], 0) + 1

    index = {
        'generated': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
        'count':     len(uniq),
        'categories': dict(sorted(by_cat.items())),
        'services':  sorted(uniq, key=lambda x: x['id']),
    }

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w') as f:
        json.dump(index, f, indent=2)

    print(f"service-index.json: {len(uniq)} unique services → {OUT}")
    print(f"Categories: {dict(sorted(by_cat.items()))}")


if __name__ == '__main__':
    main()
