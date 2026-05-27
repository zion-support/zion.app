
#!/usr/bin/env python3
"""Remove 70 stale nav entries that have no corresponding service in servicesData.ts."""
from pathlib import Path
import re
from collections import defaultdict

WORKDIR = Path('/Users/klebergarciaalcatrao/zion.app')
NAV = WORKDIR / 'app' / 'constants' / 'navigation.ts'
SD  = WORKDIR / 'app' / 'data' / 'servicesData.ts'

nav_text = NAV.read_text()
ts_text  = SD.read_text()

def canon(s): return s.replace('_', '-').lower()

# Stale: in nav but NOT in TS
nav_hrefs = re.findall(r"href:\s*'([^']+)'", nav_text)
stale_hrefs = set()
stalecanon = set()
ts_canon = {canon(t) for t in re.findall(r"id:\s*'([^']+)',", ts_text)}

for h in nav_hrefs:
    if '/services/' not in h: continue
    sid = h.split('/services/')[1]
    if canon(sid) not in ts_canon:
        stale_hrefs.add(sid)
        stalecanon.add(canon(sid))

print(f"Stale entries to remove: {len(stale_hrefs)}")

# For each entry in the nav arrays, remove entire entry blocks that have stale hrefs
ARR_NAMES = [
    'AI_SERVICE_LINKS', 'IT_SERVICE_LINKS', 'CLOUD_SERVICE_LINKS',
    'SECURITY_SERVICE_LINKS', 'DATA_SERVICE_LINKS', 'AUTOMATION_SERVICE_LINKS',
]

new_lines = []
removed = 0
in_service_array = False
skip_this_entry = False

for line in nav_text.splitlines(keepends=True):
    # Check if this line is the start of a service entry with a stale href
    stripped = line.strip()
    if any(stale_href in line for stale_href in stale_hrefs):
        # Check if this is a service entry line (has name and href)
        if "href: '/services/" in line and re.search(r"name:\s*'[^']+',", line):
            skip_this_entry = True
            removed += 1
            continue
        elif "href: '/services/" in line and re.search(r"name:\s*'[^']+',", line):
            skip_this_entry = True
            removed += 1
            continue
    if skip_this_entry:
        # Skip until we hit the end of the entry (ends with },\n or similar)
        if stripped in ('},', '}'):
            skip_this_entry = False
            continue
        continue
    new_lines.append(line)

result = ''.join(new_lines)
NAV.write_text(result)
print(f"Removed {removed} service entries")
print(f"New nav size: {len(result.splitlines())} lines")
