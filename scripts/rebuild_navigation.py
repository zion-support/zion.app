#!/usr/bin/env python3
"""
Fresh navigation.ts generator.
Keeps non-service arrays from git HEAD.
Replaces all service arrays with data drawn from servicesData.ts.
"""
import re, subprocess, sys
from pathlib import Path
from collections import defaultdict

WORKDIR = Path('/Users/klebergarciaalcatrao/zion.app')
SD_FILE  = WORKDIR / 'app' / 'data' / 'servicesData.ts'
NAV_FILE = WORKDIR / 'app' / 'constants' / 'navigation.ts'

CAT_ORDER    = ['ai','it','cloud','security','data','automation']
ARRAY_NAMES  = ['AI_SERVICE_LINKS','IT_SERVICE_LINKS','CLOUD_SERVICE_LINKS',
                'SECURITY_SERVICE_LINKS','DATA_SERVICE_LINKS','AUTOMATION_SERVICE_LINKS']
CAT_TO_ARRAY = {
    'ai':'AI_SERVICE_LINKS','it':'IT_SERVICE_LINKS','cloud':'CLOUD_SERVICE_LINKS',
    'security':'SECURITY_SERVICE_LINKS','data':'DATA_SERVICE_LINKS',
    'automation':'AUTOMATION_SERVICE_LINKS',
}

# ── 1: Load all complete services ─────────────────────────────────────────────
def load_services():
    content = SD_FILE.read_text()
    id_positions = [(m.start(), m.group(1)) for m in re.finditer(r"id:\s*'([^']+)'", content)]
    def find_block(pos):
        search = content.rfind('{', max(0,pos-500), pos)
        if search == -1: return None
        depth = 0; in_str = False; str_ch = None
        for i in range(search, min(search+3000, len(content))):
            c = content[i]
            if in_str:
                if c == '\\': i += 1; continue
                if c == str_ch: in_str = False; continue
            if c in ('"', "'"): in_str = True; str_ch = c; continue
            if c == '{': depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0: return content[search:i+1]
        return None
    services = {}
    for pos, sid in id_positions:
        if sid in services: continue
        block = find_block(pos)
        if not block: continue
        if not re.search(r"features:\s*\[", block): continue
        if not re.search(r"benefits:\s*\[", block): continue
        cat_m   = re.search(r"category:\s*'([^']+)'", block)
        title_m = re.search(r"title:\s*'([^']+)'", block)
        services[sid] = {
            'title':    title_m.group(1) if title_m else sid.replace('-',' ').title(),
            'category': cat_m.group(1)   if cat_m   else 'ai',
        }
    return services

services = load_services()
cat_map = defaultdict(list)
for sid, info in services.items():
    if info['category'] in CAT_TO_ARRAY:
        cat_map[info['category']].append((sid, info['title']))

for cat in CAT_ORDER:
    print(f"  {CAT_TO_ARRAY[cat]}: {len(cat_map[cat])} services")

# ── 2: Read git HEAD nav (preserve preamble arrays exactly) ───────────────────
head_nav_raw = subprocess.run(
    ['git','show','HEAD:app/constants/navigation.ts'],
    capture_output=True, text=True, cwd=WORKDIR).stdout

# We will replace ONLY these arrays: AI_SERVICE_LINKS + 5 new category arrays
# Everything else (PRIMARY_NAV_LINKS, SOLUTION_LINKS, RESOURCE_LINKS,
#   FEATURED_AI_SERVICE_LINKS, FEATURED_PRODUCT_LINKS, AUTOMATION_LINKS,
#   PRODUCT_LINKS, footer links) stays EXACTLY as-is from HEAD

REPLACE_ARRAYS = ARRAY_NAMES  # we'll replace all 6 (AI fresh, others new)

def esc(s): return str(s).replace("'","\\'").replace("\\","\\\\")

def build_array(arr_name, items):
    entries = '\n'.join(
        f"  {{ name: '{esc(title)}', href: '/services/{esc(sid)}' }},"
        for sid, title in sorted(items)
    )
    return f"export const {arr_name}: readonly NavigationLink[] = [\n{entries}\n];"

# Find all service-array sections in base nav and their line ranges for replacement tracking
# We'll do a full rewrite of the file
new_nav_lines = head_nav_raw.split('\n')
# Find where each replace-array starts and ends
array_name_ranges = {}  # name -> (start_line_idx, end_line_idx exclusive)
for name in REPLACE_ARRAYS:
    pos = head_nav_raw.find(f"export const {name}:")
    if pos < 0:
        print(f"  {name}: NOT in HEAD — will append at end")
        array_name_ranges[name] = None
        continue
    # Find the = [ position
    eq_open = head_nav_raw.find("= [", pos)
    # Scan for the matching ] at depth 0
    depth = 0; in_str = False; str_ch = None; close_pos = None
    for i in range(eq_open+2, min(eq_open+100000, len(head_nav_raw))):
        c = head_nav_raw[i]
        if in_str:
            if c == '\\': i += 1; continue
            if c == str_ch: in_str = False; continue
        if c in ('"', "'"): in_str = True; str_ch = c; continue
        if c == '[': depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                close_pos = i; break
    if close_pos is None:
        print(f"  ERROR: {name} array unclosed!")
        sys.exit(1)
    start_line = head_nav_raw[:pos].count('\n')
    end_line   = head_nav_raw[:close_pos+2].count('\n')
    array_name_ranges[name] = (start_line, end_line + 1)  # line indices (exclusive end)
    print(f"  {name}: lines {start_line+1}-{end_line+1} ({end_line-start_line} lines)")

# Replace from bottom to top so earlier line numbers don't shift
new_lines = head_nav_raw.split('\n')
for name in [n for n in REPLACE_ARRAYS if array_name_ranges.get(n) is not None][::-1]:
    s, e = array_name_ranges[name]
    service_list = list(cat_map.get(
        {v:k for k,v in CAT_TO_ARRAY.items()}[name], []))
    new_block = build_array(name, service_list)
    block_lines = new_block.split('\n')
    new_lines[s:e] = block_lines

# Add any REPLACE_ARRAYS that were NOT in HEAD (append at end)
for name in REPLACE_ARRAYS:
    if array_name_ranges.get(name) is None:
        service_list = list(cat_map.get(
            {v:k for k,v in CAT_TO_ARRAY.items()}[name], []))
        new_block = build_array(name, service_list)
        new_lines += new_block.split('\n')
        print(f"  {name}: appended (was missing from HEAD)")

final_nav = '\n'.join(new_lines)
NAV_FILE.write_text(final_nav + '\n')
print(f"\nWritten {len(final_nav)} chars, {len(new_lines)} lines")

# Verify
fn = NAV_FILE.read_text()
fn_ids = set(re.findall(r"/services/([^']+)'", fn))
sv_ids = set(re.findall(r"id:\s*'([^']+)'", SD_FILE.read_text()))
print(f"Nav: {len(fn_ids)} | Services: {len(sv_ids)}")

miss = sv_ids - fn_ids
if miss:
    print(f"  ❌ Missing: {sorted(miss)[:10]}")
else:
    print("  ✅ All services in nav")

dup_decls = {name: len(re.findall(rf"export const {name}:", fn)) for name in REPLACE_ARRAYS}
for name, cnt in dup_decls.items():
    print(f"  {name}: {cnt} declaration(s) {'✅' if cnt == 1 else '❌ DUP'}")
