#!/usr/bin/env python3
"""Add Carol's Wave 174 services (70) to servicesData.json"""
import json, re

JSON_PATH = 'app/data/servicesData.json'
WAVE174_PATH = 'app/data/wave174.ts'

with open(JSON_PATH) as f:
    existing = json.load(f)

existing_ids = {s['id'] for s in existing}

with open(WAVE174_PATH) as f:
    content = f.read()

# Extract all service IDs
ids = re.findall(r"id: '(w174-[^']+)'", content)
print(f"Found {len(ids)} service IDs in wave174.ts")

added = 0
for svc_id in ids:
    if svc_id in existing_ids:
        continue
    
    # Find the service block — from { before id to }, after industry
    # Use a balanced brace approach
    id_pos = content.find(f"id: '{svc_id}'")
    if id_pos < 0:
        print(f"  WARNING: Could not find {svc_id}")
        continue
    
    # Find the opening { before this id
    brace_start = content.rfind('{', 0, id_pos)
    # Find the closing }, after this id
    # Count braces to find the matching close
    depth = 0
    pos = brace_start
    while pos < len(content):
        if content[pos] == '{':
            depth += 1
        elif content[pos] == '}':
            depth -= 1
            if depth == 0:
                brace_end = pos
                break
        pos += 1
    else:
        print(f"  WARNING: Unbalanced braces for {svc_id}")
        continue
    
    block = content[brace_start:brace_end+1]
    
    def extract_str(field):
        m = re.search(rf"{field}:\s*'([^']*?)'", block)
        return m.group(1) if m else ''
    
    def extract_arr(field):
        m = re.search(rf"{field}:\s*\[([^\]]*)\]", block, re.DOTALL)
        if not m:
            return []
        return re.findall(r"'([^']*?)'", m.group(1))
    
    def extract_pricing():
        m = re.search(r'pricing:\s*\{([^}]+)\}', block)
        if not m:
            return {"basic": "Contact", "pro": "Contact", "enterprise": "Custom"}
        p = m.group(1)
        basic = re.search(r"basic:\s*'([^']*?)'", p)
        pro = re.search(r"pro:\s*'([^']*?)'", p)
        enterprise = re.search(r"enterprise:\s*'([^']*?)'", p)
        return {
            "basic": basic.group(1) if basic else "Contact",
            "pro": pro.group(1) if pro else "Contact",
            "enterprise": enterprise.group(1) if enterprise else "Custom"
        }
    
    title = extract_str('title')
    desc = extract_str('description')
    features = extract_arr('features')
    benefits = extract_arr('benefits')
    pricing = extract_pricing()
    icon = extract_str('icon')
    category = extract_str('category')
    industry = extract_str('industry')
    popular_val = extract_str('popular')
    popular = popular_val.lower() == 'true' if popular_val else False
    
    entry = {
        "id": svc_id,
        "title": title,
        "description": desc,
        "features": features,
        "benefits": benefits,
        "pricing": pricing,
        "contactInfo": {
            "website": f"/services/{svc_id}",
            "email": "kleber@ziontechgroup.com",
            "phone": "+1 302 464 0950"
        },
        "icon": icon,
        "href": f"/services/{svc_id}",
        "popular": popular,
        "category": category,
        "industry": industry
    }
    existing.append(entry)
    added += 1

with open(JSON_PATH, 'w') as f:
    json.dump(existing, f, indent=2, ensure_ascii=False)

print(f"Added {added} services from wave174.ts to JSON")
print(f"JSON total: {len(existing)}")
