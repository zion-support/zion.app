import re, json, os
from collections import defaultdict

WORKDIR = '/Users/klebergarciaalcatrao/zion.app'
src = open(f'{WORKDIR}/app/data/servicesData.ts').read()

ID_RX   = re.compile(r"id:\s*'([^']+)'", re.MULTILINE)
TITLE_RX = re.compile(r"title:\s*'([^']+)'")
CAT_RX   = re.compile(r"category:\s*'(\w+)'")

def extract_block(src, match_pos):
    """Find '{' before match_pos (within 10 chars), walk forward to matching '}'."""
    start = src.rfind('{', max(0, match_pos - 10), match_pos)
    if start < 0:
        start = match_pos
    depth = 0
    in_str = False
    str_ch = None
    for i in range(start, min(start + 8000, len(src))):
        c = src[i]
        if in_str:
            if c == '\\':
                i += 1
                continue
            if c == str_ch:
                in_str = False
            continue
        if c in ("'", '"'):
            in_str = True
            str_ch = c
            continue
        if c == '{':
            depth += 1
            continue
        if c == '}':
            depth -= 1
            if depth == 0:
                return src[start:i+1]
    return None

# collect all per-ID
records = {}   # id -> {title, category, block}
dupes_list = []

for m in ID_RX.finditer(src):
    bid = m.group(1)
    block = extract_block(src, m.start())
    if block is None:
        continue
    # Determine actual id (could appear multiple times in block)
    im = ID_RX.search(block)
    actual_id = im.group(1) if im else bid
    title = TITLE_RX.search(block)
    cat = CAT_RX.search(block)
    if actual_id in records:
        dupes_list.append(actual_id)
    else:
        records[actual_id] = {
            'title': title.group(1) if title else actual_id,
            'category': cat.group(1) if cat else 'ai',
            'block': block,
        }

print(f"Total extracted blocks: {len(records)}")
print(f"Duplicate IDs seen again: {len(set(dupes_list))} → {sorted(set(dupes_list))}")

# Which arrays?
arrays = ['aiServices','itServices','cloudServices','securityServices','dataServices','automationServices']
ranges = {}
for arr in arrays:
    k = f'export const {arr}: Service[] = ['
    i = src.find(k)
    depth = 0
    started = False
    for j in range(i + len(k) - 1, len(src)):
        if src[j] == '[':
            depth += 1
            started = True
        elif src[j] == ']':
            depth -= 1
        if started and depth == 0:
            ranges[arr] = (i, j)
            break

# Classify each record into its array
cat_dist = defaultdict(list)
for sid, rec in records.items():
    # Find the byte position of this block's first '{'
    pos = src.find(rec['block'][:50])  # approximate position
    in_arr = 'OUTSIDE'
    for arr, (as_, ae) in ranges.items():
        if as_ <= pos < ae:
            in_arr = arr
            break
    cat_dist[in_arr].append(sid)

print("\nArray distribution:")
total_cat = 0
for arr, ids in {k: v for k, v in sorted(cat_dist.items(), key=lambda x: str(x[0]))}.items():
    print(f"  {arr}: {len(ids)}")
    total_cat += len(ids)
print(f"  TOTAL: {total_cat}")

# Load build index for comparison
idx_path = f'{WORKDIR}/out/service-index.json'
idx = json.load(open(idx_path))
in_json = {s['id'] for s in idx['services']}
print(f"\nservice-index.json: {len(in_json)} services")

only_json = in_json - set(records.keys())
only_records = set(records.keys()) - in_json
print(f"Only in JSON: {len(only_json)} → {sorted(only_json)[:15]}")
print(f"Only in records (in src but not JSON): {len(only_records)} → {sorted(only_records)[:15]}")
