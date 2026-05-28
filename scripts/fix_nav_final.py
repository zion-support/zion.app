#!/usr/bin/env python3
"""Fix navigation.ts: remove stale, insert missing, 100% sync with servicesData.ts"""
import re, os

def main():
    NAV = '/Users/klebergarciaalcatrao/zion.app/app/constants/navigation.ts'
    DAT = '/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts'
    
    nav = open(NAV).read()
    content = open(DAT).read()
    
    all_ids = set(re.findall(r"\bid:\s*'([^']+)'", content))
    nav_set = set(re.findall(r"href: '/services/([^']+)'", nav))
    
    stale   = sorted(nav_set - all_ids)
    missing = sorted(all_ids - nav_set)
    
    print(f"Nav stale  : {len(stale)}")
    print(f"Nav missing: {len(missing)}")
    
    # Titles lookup
    titles = {}
    cur_id = None
    for line in content.split('\n'):
        m = re.match(r"^\s+id:\s*'([^']+)'", line)
        if m: cur_id = m.group(1)
        m2 = re.match(r"^\s+title:\s*'([^']+)'", line)
        if m2 and cur_id:
            titles[cur_id] = m2.group(1)
            cur_id = None
    
    # --- STEP 1: REMOVE stale entries ---
    removed = 0
    for sid in stale:
        # Remove lines containing this stale href
        new_lines = []
        for line in nav.split('\n'):
            if f"/services/{sid}" not in line:
                new_lines.append(line)
            else:
                removed += 1
        nav = '\n'.join(new_lines)
    
    # Reduce triple-blank lines to double
    nav = re.sub(r'\n{3,}', '\n\n', nav)
    print(f"Removed {removed} stale lines")
    
    # --- STEP 2: INSERT missing entries ---
    blocks = {
        'ai':         'AI_SERVICE_LINKS',
        'it':         'IT_SERVICE_LINKS',
        'cloud':      'CLOUD_SERVICE_LINKS',
        'security':   'SECURITY_SERVICE_LINKS',
        'data':       'DATA_SERVICE_LINKS',
        'automation': 'AUTOMATION_SERVICE_LINKS',
    }
    by_cat = {c: [] for c in blocks}
    for mid in missing:
        cat = mid.split('-')[0]
        if cat in by_cat:
            title = titles.get(mid, mid.replace('-', ' ').title())
            by_cat[cat].append((mid, f"  {{ name: '{title}', href: '/services/{mid}' }},\n"))
    
    inserted = 0
    for cat, entries in by_cat.items():
        if not entries:
            continue
        const_name = blocks[cat]
        
        # Find the block: export const CONST_NAME = [
        pattern = rf'export const {const_name}.*?\n\];'
        m = re.search(pattern, nav, re.DOTALL)
        if not m:
            print(f"  SKIP {const_name}: block not found!")
            continue
        
        block_text = m.group(0)
        insert_before = '\n];'
        pos = block_text.rfind(insert_before)
        
        new_entries = ''.join(e for _, e in sorted(entries, key=lambda x: x[0]))
        new_block = block_text[:pos] + new_entries + insert_before
        
        nav = nav[:m.start()] + new_block + nav[m.end():]
        inserted += len(entries)
        print(f"  Inserted {len(entries)} into {const_name}")
    
    print(f"Total inserted: {inserted}")
    
    # --- VERIFY ---
    final_ids = set(re.findall(r"href: '/services/([^']+)'", nav))
    final_stale   = sorted(final_ids - all_ids)
    final_missing = sorted(all_ids - final_ids)
    print(f"\nPOST-FIX: service hrefs={len(final_ids)}, stale={len(final_stale)}, missing={len(final_missing)}")
    
    open(NAV, 'w').write(nav)
    print(f"\nWrote {NAV}")

if __name__ == '__main__':
    main()
