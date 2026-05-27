import re, json, subprocess
from pathlib import Path
from collections import Counter

WORKDIR  = Path('/Users/klebergarciaalcatrao/zion.app')
DATA_DIR = WORKDIR / 'app' / 'data'
SD_FILE  = DATA_DIR / 'servicesData.ts'
NAV_FILE = WORKDIR / 'app' / 'constants' / 'navigation.ts'
BAK_SD   = SD_FILE.with_suffix('.ts.bak_v4')
BAK_NAV  = NAV_FILE.with_suffix('.ts.bak_v4')

# ── 1. Load services ──────────────────────────────────────────────────────────
all_new = {}
for f in sorted(DATA_DIR.glob('new_30_*.json')):
    cat = f.stem.replace('new_30_','').replace('_extra','')
    all_new.setdefault(cat, []).extend(json.loads(f.read_text()))

gap = all_new.pop('close_gap', [])
for s in gap:
    sid = s['href'].split('/')[-1]
    if   sid.startswith('cloud'):      cat = 'cloud'
    elif sid.startswith('data'):       cat = 'data'
    elif sid.startswith('automation'): cat = 'automation'
    else: cat = 'cloud'
    all_new.setdefault(cat, []).append(s)

total = sum(len(v) for v in all_new.values())
dup_check = [x for v in all_new.values() for x in (s['id'] for s in v)]
dupes = [i for i,c in Counter(dup_check).items() if c > 1]
if dupes:
    print(f'ERROR: duplicates {dupes}'); exit(1)
print(f'Total: {total}  cats: {dict((k,len(v)) for k,v in all_new.items())}')

# ── 2. Templates ───────────────────────────────────────────────────────────────
SD_ template lines - avoid braces in f-string via .format()
TPL_SD = (
    "    id: '{id}',\n"
    "    title: '{title}',\n"
    "    description: '{desc}',\n"
    "    icon: '{icon}',\n"
    "    features: [{features}],\n"
    "    benefits: [{benefits}],\n"
    "    pricing: {{ basic: '{pb}', pro: '{pp}', enterprise: '{pe}' }},\n"
    "    contactInfo: {{ website: '{href}', email: 'kleber@ziontechgroup.com',\n"
    "                    phone: '+1 302 464 0950' }},\n"
    "    href: '{href}',\n"
    "    category: '{cat}',\n"
    "    popular: {pop},\n"
    "  },\n"
)
TPL_NAV = "  {{ name: '{name}',    href: '{href}' }},\n"
TPL_NAV_FORMAT = "  {{ name: '{}', href: '{}' }},\n"   # will use str.format()

def qlist(lst):
    return ', '.join("'" + x.replace("'", "\\'") + "'" for x in lst)

def fmt_sd(s):
    return TPL_SD.format(
        id=s['id'],
        title=s['title'].replace("'", "\\'"),
        desc =s['description'].replace("'", "\\'"),
        icon=s['icon'],
        features=qlist(s['features']),
        benefits=qlist(s['benefits']),
        pb=s['pricing']['basic'], pp=s['pricing']['pro'], pe=s['pricing']['enterprise'],
        href=s['href'], cat=s['category'],
        pop=str(s.get('popular', False)).lower()
    )

def fmt_nav(s):
    return TPL_NAV_FORMAT.format(
        s.get('nav_name', s['title']).replace("'", "\\'"),
        s['href']
    )
