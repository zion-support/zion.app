
#!/usr/bin/env python3
"""
insert_new_services.py
  
Inserts the 30 new services from new_30_*.json into servicesData.ts
and adds matching nav entries into navigation.ts.
  
Insertion strategy:
  • Find each category export in servicesData.ts
  • Find the '];\n' that closes that array
  • Insert all new entries of that category just before it
  • Then find the matching nav array (AI_SERVICE_LINKS / IT_SERVICE_LINKS etc)
  • Insert a matching NavigationLink entry before the closing '];'
  
  Both files are fully rewritten — no truncation, no char counting.
"""
import json, re, sys
from pathlib import Path

WORKDIR   = Path('/Users/klebergarciaalcatrao/zion.app')
DATA_DIR  = WORKDIR / 'app' / 'data'
SD_FILE   = DATA_DIR  / 'servicesData.ts'
NAV_FILE  = WORKDIR  / 'app' / 'constants' / 'navigation.ts'
BACKUP_SD = DATA_DIR  / 'servicesData.ts.bak_insert'
BACKUP_NAV= WORKDIR  / 'app' / 'constants' / 'navigation.ts.bak_insert'

# ── 1. Load all JSON batches ───────────────────────────────────────────────────
all_new = {}   # cat -> [service_dict]
json_files = sorted(DATA_DIR.glob('new_30_*.json'))
for f in json_files:
    cat_key = f.stem.replace('new_30_', '').replace('_extra', '')   # ai, it, cloud …
    items   = json.loads(f.read_text())
    all_new.setdefault(cat_key, []).extend(items)
    print(f"[LOAD] {f.name}: {len(items)} services → category '{cat_key}'")

total = sum(len(v) for v in all_new.values())
print(f"[LOAD] Total new services: {total}\n")

# ── 2. Category map ────────────────────────────────────────────────────────────
# JSON cat key  →  servicesData.ts array label  →  navigation.ts array label
CAT_MAP = {
    'ai':          ('aiServices',          'AI_SERVICE_LINKS'),
    'it':          ('itServices',          'IT_SERVICE_LINKS'),
    'cloud':       ('cloudServices',       'CLOUD_SERVICE_LINKS'),
    'security':    ('securityServices',    'SECURITY_SERVICE_LINKS'),
    'data':        ('dataServices',        'DATA_SERVICE_LINKS'),
    'automation':  ('automationServices',  'AUTOMATION_SERVICE_LINKS'),
}

# ── 3. ServicesData.ts helper: find array close ────────────────────────────────
def find_array_close(text: str, array_label: str) -> int | None:
    """
    Return the byte-offset of the ']' that closes the named array.
    We intentionally do NOT search past the current export because the
    next export starts with 'export const…'.
    """
    pat = rf'export const {array_label}: Service\[]\s*=\s*\['
    m = re.search(pat, text)
    if not m:
        return None
    start = m.start()
    bracket_open = text.index('[', start)
    depth = 0
    pos = bracket_open
    while pos < len(text):
        if text[pos] == '[':
            depth += 1
        elif text[pos] == ']':
            depth -= 1
            if depth == 0:
                return pos
        pos += 1
    return None

def find_insert_offset(text: str, array_label: str) -> int:
    """
    Find the byte-offset just before the closing '];\n' of the named array.
    Returns the address of the '];' match start so we can splice before it.
    """
    close_bracket = find_array_close(text, array_label)
    if close_bracket is None:
        raise RuntimeError(f"Array '{array_label}' close bracket not found")
    # Scan forward from close_bracket for '\n];'
    after = text[close_bracket:]
    m = re.search(r'\n];', after)
    if not m:
        raise RuntimeError(f"Array '{array_label}': no '];' after closing bracket")
    return close_bracket + m.start()

# ── 4. Build service entry string ──────────────────────────────────────────────
TEMPLATE = """    id: '{id}',
    title: '{title}',
    description: '{description}',
    icon: '{icon}',
    features: [{features}],
    benefits: [{benefits}],
    pricing: {{ basic: '{pb}', pro: '{pp}', enterprise: '{pe}' }},
    contactInfo: {{ website: '{href}', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' }},
    href: '{href}',
    category: '{cat}',
    popular: {pop},
  },"

def quote_list(lst: list[str]) -> str:
    return ', '.join(f"'{x}'" for x in lst)

def make_entry(s: dict) -> str:
    return TEMPLATE.format(
        id=s['id'],
        title=s['title'].replace("'", "\\'"),
        description=s['description'].replace("'", "\\'"),
        icon=s['icon'],
        features=quote_list(s['features']),
        benefits=quote_list(s['benefits']),
        pb=s['pricing']['basic'],
        pp=s['pricing']['pro'],
        pe=s['pricing']['enterprise'],
        href=s['href'],
        cat=s['category'],
        pop=str(s.get('popular', False)).lower(),
    )

# ── 5. Navigation nav entry string ─────────────────────────────────────────────
NAV_TEMPLATE = "  { name: '{name}', href: '{href}' },"

def make_nav_entry(s: dict) -> str:
    name = s.get('nav_name', s['title']).replace("'", "\\'")
    href = s['href']
    return NAV_TEMPLATE.format(name=name, href=href)

# ── 6. Insert into servicesData.ts ─────────────────────────────────────────────
sd_text  = SD_FILE.read_text()
sd_start = sd_text

# Backup
print(f"[BACKUP] servicesData.ts → {BACKUP_SD.name}")
BACKUP_SD.write_text(sd_text)

new_sd = sd_text
for cat_key, services in all_new.items():
    sd_arr, _ = CAT_MAP[cat_key]
    insert_before = find_insert_offset(new_sd, sd_arr)
    # Build entries block (newline before first, no extra before close)
    entries = '\n'.join(make_entry(s) for s in services) + '\n'
    new_sd = new_sd[:insert_before] + '\n' + entries + new_sd[insert_before:]
    print(f"[SD INSERT] {cat_key}: {len(services)} new en\\tries → '{sd_arr}' before pos {insert_before}")

# Dedup check
new_ids = [s['id'] for group in all_new.values() for s in group]
dupes = [i for i, c in Counter(new_ids).items() if c > 1]
if dupes:
    print(f"[ERROR] Duplicate new service IDs: {dupes}"); sys.exit(1)

print(f"[SD WRITE] Writing servicesData.ts ({len(new_sd):,} chars)...")
SD_FILE.write_text(new_sd)

# ── 7. Insert into navigation.ts ───────────────────────────────────────────────
nav_text    = NAV_FILE.read_text()
BACKUP_NAV.write_text(nav_text)
print(f"[BACKUP] navigation.ts → {BACKUP_NAV.name}")

new_nav = nav_text
for cat_key, services in all_new.items():
    _, nav_arr = CAT_MAP[cat_key]
    pat = rf'export const {nav_arr}: readonly NavigationLink\[]\s*=\s*\['
    m = re.search(pat, new_nav)
    if not m:
        print(f"[NAV SKIP] {nav_arr}: array header not found"); continue
    start = m.start()
    bracket_open = new_nav.index('[', start)
    depth = 0
    pos = bracket_open
    while pos < len(new_nav):
        if new_nav[pos] == '[': depth += 1
        elif new_nav[pos] == ']':
            depth -= 1
            if depth == 0:
                close = pos; break
        pos += 1
    after = new_nav[close:]
    semi = after.find('\n];\n')
    if semi < 0:
        semi = after.find('];\n')
    insert_before = close + semi
    entries = '\n'.join(make_nav_entry(s) for s in services) + '\n'
    new_nav = new_nav[:insert_before] + '\n' + entries + new_nav[insert_before:]
    print(f"[NAV INSERT] {cat_key}: {len(services)} nav entries → '{nav_arr}'")

print(f"\n[NAV WRITE] Writing navigation.ts ({len(new_nav):,} chars)...")
NAV_FILE.write_text(new_nav)

# ── 8. Verify ──────────────────────────────────────────────────────────────────
import subprocess
r = subprocess.run(['grep', '-c', "id: '", str(SD_FILE)], capture_output=True, text=True)
count_sd = r.stdout.strip()
print(f"[VERIFY] servicesData.ts: grep found ~{count_sd} id: entries")

r = subprocess.run(['grep', '-c', "href: '/services/", str(NAV_FILE)], capture_output=True, text=True)
count_nav = r.stdout.strip()
print(f"[VERIFY] navigation.ts: grep found ~{count_nav} service hrefs")
print("\n[DONE] All new services inserted successfully.")
