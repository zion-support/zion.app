#!/usr/bin/env python3
"""Extract service objects from servicesData.ts and write servicesData.json."""
import json, re, sys

path = sys.argv[1] if len(sys.argv) > 1 else 'app/data/servicesData.ts'
with open(path) as f:
    content = f.read()

# Match each category array: aiServices, itServices, etc.
cat_pat = r'(?:export\s+)?const\s+(\w+)\s*(?::\s*\w+)?\s*=\s*\[([\s\S]*?)\]\s*;'
all_services = []
seen_ids = set()

for m in re.finditer(cat_pat, content):
    cat_name = m.group(1)
    inner = content[m.start(2):m.end(2)]
    
    depth = 0
    start = None
    abs_start = m.start(2)
    abs_end = m.end(2)
    
    for i, c in enumerate(inner):
        if c == '{':
            if depth == 0: start = i + abs_start
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0 and start is not None:
                obj_str = content[start:i+abs_start+1].strip().rstrip(',')
                try:
                    obj = eval(obj_str)
                    if isinstance(obj, dict) and 'id' in obj and obj['id'] not in seen_ids:
                        all_services.append(obj)
                        seen_ids.add(obj['id'])
                except Exception:
                    pass

print(f'Extracted {len(all_services)} unique services')
with open('app/data/servicesData.json', 'w') as f:
    json.dump(all_services, f, indent=2)
print(f'Wrote servicesData.json')
