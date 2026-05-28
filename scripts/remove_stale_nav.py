#!/usr/bin/env python3
"""remove_stale_nav.py — Remove nav entries whose /services/SID is not in servicesData.ts"""
import re, sys
from pathlib import Path

WORKDIR = Path('/Users/klebergarciaalcatrao/zion.app')
NAV  = WORKDIR / 'app' / 'constants' / 'navigation.ts'
SD   = WORKDIR / 'app' / 'data' / 'servicesData.ts'
BAK  = NAV.with_suffix('.ts.bak_v6')

sd_text  = SD.read_text()
nav_text = NAV.read_text()
BAK.write_text(nav_text)
print(f'[BAK] navigation.ts → {BAK.name}')

sd_ids  = set(re.findall(r"id:\s*'([^']+)'", sd_text))
nav_svc = set(re.findall(r"'/services/([^']+)'", nav_text))
stale   = nav_svc - sd_ids

print(f'Stale IDs to remove: {len(stale)}')

new_nav = nav_text
removed = 0
for sid in sorted(stale):
    pat = re.compile(
        r'[ \t]*\{[^}]*href: \'/' + re.escape(sid) + r'\'[^}]*\}',
        re.DOTALL
    )
    m = pat.search(new_nav)
    if m:
        new_nav = new_nav[:m.start()] + new_nav[m.end():]
        removed += 1

# Also remove multi-line variants:  { name: 'X',\n  href: '/SID' },
pat_multi = re.compile(
    r'[ \t]*\{[^}]*\n[^}]*href: \'/(?:services/)?([^\']+)\'[^}]*\}',
    re.DOTALL
)
# Re-run stale detection and remove any still found
still_stale = set(re.findall(r"'/services/([^']+)'", new_nav)) - sd_ids
for sid in sorted(still_stale):
    pat = re.compile(
        r'\{[^}]*href: \'/' + re.escape(sid) + r'\'[^}]*\}',
        re.DOTALL
    )
    m = pat.search(new_nav)
    if m:
        new_nav = new_nav[:m.start()] + new_nav[m.end():]
        removed += 1

# Collapse 3+ blank lines
new_nav = re.sub(r'\n{3,}', '\n\n', new_nav)

remaining = set(re.findall(r"'/services/([^']+)'", new_nav)) - sd_ids
print(f'Removed: {removed}  |  Remaining stale: {len(remaining)}')

if remaining:
    print(f'Still stale: {sorted(remaining)[:10]}')

if new_nav != nav_text:
    NAV.write_text(new_nav)
    print(f'[WROTE] navigation.ts stale entries removed ({len(new_nav):,} chars)')
else:
    print('[SKIP] No changes')
