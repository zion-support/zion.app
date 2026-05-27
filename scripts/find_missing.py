
from pathlib import Path
from collections import Counter
import json, re

WORKDIR = Path('/Users/klebergarciaalcatrao/zion.app')
text = (WORKDIR / 'app' / 'data' / 'servicesData.ts').read_text()
sdj = json.loads((WORKDIR / 'app' / 'data' / 'servicesData.json').read_text())

ts_done = set(re.findall(r"id:\s*'([^']+)'", text))
j_ids = {s['id'] for s in sdj}

def canon(id):
    return id.replace('_', '-').lower()

ts_kebab = {canon(t) for t in ts_done}

missing = [s for s in sdj if canon(s['id']) not in ts_kebab]
cat_counts = Counter(s['category'] for s in missing)
print("Missing by category:", dict(cat_counts))
print(f"Total missing: {len(missing)}")

alloc = {'it': 8, 'security': 7, 'cloud': 6, 'automation': 4, 'data': 3, 'ai': 2}
to_add = []
for cat, n in sorted(alloc.items()):
    batch = [s for s in missing if s['category'] == cat][:n]
    to_add.extend(batch)

print(f"\nSelected to add: {len(to_add)}")
[print(f"  [{s['category']}] {s['id']}: {s['title'][:60]}") for s in to_add[:15]]

# Write JSON file
out_path = WORKDIR / 'app' / 'data' / 'new_services_30.json'
out_path.write_text(json.dumps(to_add, indent=2))
print(f"\nWritten to: {out_path}")
print(f"File size: {out_path.stat().st_size:,} bytes")
