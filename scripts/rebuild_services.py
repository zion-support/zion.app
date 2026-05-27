
#!/usr/bin/env python3
"""
Rebuild servicesData.ts from HEAD + JSON, fixing all categorization, boolean,
and structural errors.  Outputs a clean, type-correct file.
"""
import json, re, subprocess
from pathlib import Path
from collections import defaultdict

WORKDIR   = Path('/Users/klebergarciaalcatrao/zion.app')
JSON_FILE = WORKDIR / 'app' / 'data' / 'servicesData.json'
SD_CLEAN  = WORKDIR / 'app' / 'data' / 'servicesData.clean.ts'
SD_OUT    = WORKDIR / 'app' / 'data' / 'servicesData.ts'
CAT_ORDER = ['ai', 'it', 'cloud', 'security', 'data', 'automation']

head_text = SD_CLEAN.read_text()
sdj = json.loads(JSON_FILE.read_text())

def canon(s): return s.replace('_','-').lower()

# ── infer reasonableness checks ─────────────────────────────────────────────
def infer_cat(sid):
    for p in CAT_ORDER:
        if sid.startswith(f'{p}-'): return p
    # fall back: AI prefix visible in many mixed entries
    return 'ai'

# ── gather HEAD entries per their REAL category in HEAD (not inferred) ─────
head_by_cat = defaultdict(list)
for m in re.finditer(r"id:\s*'([^']+)'", head_text):
    sid = m.group(1)
    ctx  = head_text[max(0,m.start()-300):m.start()]
    m2 = re.search(r"category:\s*'([a-z]+)'", ctx)
    if m2 and m2.group(1) in CAT_ORDER:
        c = m2.group(1)
    else:
        c = infer_cat(sid)
    head_by_cat[c].append(sid)

# ── JSON entries per category ───────────────────────────────────────────────
json_by_cat = defaultdict(list)
for s in sdj:
    json_by_cat[s['category']].append(s)

# ── combine: HEAD entries first, then JSON-only entries ────────────────────
combined = {}
for c in CAT_ORDER:
    seen = {}
    # HEAD entries
    for sid in head_by_cat[c]:
        cid = canon(sid)
        if cid in seen: continue
        found = next((s for s in json_by_cat[c] if canon(s['id'])==cid), None)
        seen[cid] = found or {
            'id': sid,
            'title': sid.replace('-',' ').title(),
            'description': '',
            'icon': '★',
            'href': f'/services/{sid}',
            'popular': False,
            'features': [],
            'benefits': [],
            'pricing': {},
            'contactInfo': {},
        }
    for s in json_by_cat[c]:
        if canon(s['id']) not in seen:
            seen[canon(s['id'])] = s
    combined[c] = sorted(seen.values(), key=lambda e: e['title'].lower())

totals = {c: len(combined[c]) for c in CAT_ORDER}
print(f"Final services: {totals}  (grand={sum(totals.values())})")

# ── format helpers ───────────────────────────────────────────────────────────
def esc(s):
    return s.replace("\\'","\\\\'").replace('"','\\"').replace('\n',' ')

def service_block(en, level=2):
    ind  = '  ' * level
    ind2 = '    ' * level
    cid  = en['id']
    ttl  = en['title']
    desc = en.get('description','')
    icon = en.get('icon','★')
    href = en.get('href','')
    pop  = 'true' if en.get('popular') else 'false'
    feats = en.get('features',[]) or []
    bens  = en.get('benefits',[])  or []
    pr    = en.get('pricing') or {}
    ci    = en.get('contactInfo') or {}
    cat   = en['category']

    L = []
    L.append(f"{ind}{{")
    L.append(f"{ind2}id: '{esc(cid)}',")
    L.append(f"{ind2}title: '{esc(ttl)}',")
    if desc:
        L.append(f"{ind2}description: '{esc(desc)}',")
    if icon:
        L.append(f"{ind2}icon: '{esc(icon)}',")
    if href:
        L.append(f"{ind2}href: '{esc(href)}',")
    L.append(f"{ind2}popular: {pop},")
    L.append(f"{ind2}category: '{cat}',")
    if feats:
        L.append(f"{ind2}features: [")
        for f in feats[:8]:
            L.append(f"{ind2}  '{esc(f)}',")
        L.append(f"{ind2}],")
    if bens:
        L.append(f"{ind2}benefits: [")
        for b in bens[:6]:
            L.append(f"{ind2}  '{esc(b)}',")
        L.append(f"{ind2}],")
    if pr:
        basic = str(pr.get('basic','Custom'))
        pro   = str(pr.get('pro','Custom'))
        ent   = str(pr.get('enterprise','Custom'))
        L.append(f"{ind2}pricing: {{ basic: '{esc(basic)}', pro: '{esc(pro)}', enterprise: '{esc(ent)}' }},")
    if ci:
        site = ci.get('website',f'/services/{cid}')
        eml  = ci.get('email','kleber@ziontechgroup.com')
        phn  = ci.get('phone','+1 302 464 0950')
        L.append(f"{ind2}contactInfo: {{")
        L.append(f"{ind2}  website: '{esc(site)}',")
        L.append(f"{ind2}  email: '{esc(eml)}',")
        L.append(f"{ind2}  phone: '{esc(phn)}',")
        L.append(f"{ind2}}},")
    L.append(f"{ind}}},")
    return '\n'.join(L)

# ── build output ─────────────────────────────────────────────────────────────
lines = []
lines.append("// Service data for AI and IT solutions — GENERATED")
lines.append("// Source: app/data/servicesData.json + HEAD servicesData.ts")
lines.append("export interface Service {")
lines.append("  id: string;")
lines.append("  title: string;")
lines.append("  description: string;")
lines.append("  features: string[];")
lines.append("  benefits: string[];")
lines.append("  pricing: {")
lines.append("    basic: string;")
lines.append("    pro: string;")
lines.append("    enterprise: string;")
lines.append("  };")
lines.append("  contactInfo: {")
lines.append("    website: string;")
lines.append("    email: string;")
lines.append("    phone: string;")
lines.append("  };")
lines.append("  icon: string;")
lines.append("  href: string;")
lines.append("  popular?: boolean;")
lines.append("  category: 'ai' | 'it' | 'cloud' | 'security' | 'data' | 'automation';")
lines.append("}")
lines.append("")
for cat in CAT_ORDER:
    arr_name = f"{cat}Services"
    entries  = combined[cat]
    lines.append(f"export const {arr_name}: Service[] = [")
    for en in entries:
        lines.append("  " + service_block(en, level=0))
    lines.append("];")
    lines.append("")
lines.append("export const itSolutions = itServices;")
lines.append("export const allServices: Service[] = [...aiServices, ...itServices];")
lines.append("")
lines.append("// Export as servicesData for backward compatibility")
lines.append("export const servicesData = {")
lines.append("  aiServices,")
lines.append("  itServices,")
lines.append("  itSolutions,")
lines.append("  allServices")
lines.append("}")
lines.append("export const getServiceById = (id: string): Service | undefined => {")
lines.append("  return allServices.find(s => s.id === id);")
lines.append("}")
lines.append("export const getServicesByCategory = (category: Service['category']): Service[] => {")
lines.append("  return allServices.filter(s => s.category === category);")
lines.append("}")
lines.append("export const getPopularServices = (): Service[] => {")
lines.append("  return allServices.filter(s => s.popular);")
lines.append("}")

out_text = '\n'.join(lines)
out_text = out_text.replace(",\n}]\n}", "}\n];\n}")  # fix any }] issue

# Write
SD_OUT.write_text(out_text)
print(f"\nWritten {len(out_text):,} chars to {SD_OUT}")
print(f"Lines: {len(lines):,}")

# Quick count check
id_count = len(re.findall(r"id:\s*'([^']+)'", out_text))
print(f"Service IDs in output: {id_count}")
