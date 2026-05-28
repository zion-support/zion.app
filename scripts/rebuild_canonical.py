
#!/usr/bin/env python3
"""
Rebuild servicesData.ts with canonical category per ID prefix.
ai-* → aiServices only; it-* → itServices only; etc.
No duplicates. Clean TS. Full 504+ services.
"""
import json, re, subprocess
from pathlib import Path
from collections import defaultdict, Counter

WORKDIR   = Path('/Users/klebergarciaalcatrao/zion.app')
JSON_FILE = WORKDIR / 'app' / 'data' / 'servicesData.json'
SD_OUT    = WORKDIR / 'app' / 'data' / 'servicesData.ts'
CAT_ORDER = ['ai','it','cloud','security','data','automation']

# ── helpers ───────────────────────────────────────────────────────────────────
def canon(s): return s.replace('_','-').lower()
def ts(s):
    return str(s).replace('\\','\\\\').replace("'","\\'").replace('\n',' ').replace('\r','')
def infer_cat(sid):
    for p in CAT_ORDER:
        if sid.startswith(p+'-'): return p
    return 'ai'

# ── Load HEAD ─────────────────────────────────────────────────────────────────
r = subprocess.run(['git','show','HEAD:app/data/servicesData.ts'],
                   capture_output=True, text=True, cwd=WORKDIR)
head_text = r.stdout

# ── Load JSON ─────────────────────────────────────────────────────────────────
sdj = json.loads(JSON_FILE.read_text())
for s in sdj:
    if s.get('category') not in CAT_ORDER:
        s['category'] = infer_cat(s['id'])

json_cat = defaultdict(list)
for s in sdj: json_cat[s['category']].append(s)

# ── Parse HEAD ────────────────────────────────────────────────────────────────
# Collect ALL HEAD service IDs with their STOPPED category
# Canonical category = PREFIX of the ID (not whatever mis-categorization exists in HEAD)
head_services = {}  # canonical_id → {id, cat}
for m in re.finditer(r"id:\s*'([^']+)'", head_text):
    sid = m.group(1)
    cid = canon(sid)
    cat = infer_cat(sid)   # ALWAYS use prefix as canonical
    if cid not in head_services:
        head_services[cid] = {'id': sid, 'cat': cat}

print(f"HEAD services (canonical): {len(head_services)}")

# ── Count per category in HEAD ────────────────────────────────────────────────
head_cat_counts = defaultdict(int)
for info in head_services.values():
    head_cat_counts[info['cat']] += 1

# What's missing from JSON? We'll fill from HEAD data
json_map_global = {canon(s['id']): s for s in sdj}

# ── Build combined per category ───────────────────────────────────────────────
used_ids = set()            # global guard — each service goes into ONE category
head_canon_ids = set(head_services.keys())
combined = {}
for cat in CAT_ORDER:
    seen = {}  # canonical_id → entry (per-category guard)

    # A) JSON entries that declare canonical category == cat (not already used)
    for s in json_cat[cat]:
        cid = canon(s['id'])
        if cid in used_ids or cid in seen: continue
        if cid in head_canon_ids: continue    # will be handled by step B
        seen[cid] = s

    # B) HEAD services with canonical category == cat (priority over JSON)
    for cid, info in head_services.items():
        if info['cat'] != cat: continue
        if cid in seen or cid in used_ids: continue
        json_e = json_map_global.get(cid)
        seen[cid] = json_e or {
            'id': info['id'], 'title': info['id'].replace('-', ' ').title(),
            'description': 'Comprehensive service offering.',
            'icon': '★', 'href': f"/services/{info['id']}",
            'popular': False,
            'features': ['Core features', 'Advanced solutions', '24/7 support'],
            'benefits': ['Cost savings', 'Improved efficiency', 'Scalable growth'],
            'pricing': {'basic': 'Custom', 'pro': 'Custom', 'enterprise': 'Custom'},
            'contactInfo': {
                'website': f"/services/{info['id']}",
                'email': 'kleber@ziontechgroup.com',
                'phone': '+1 302 464 0950'
            },
            'category': cat
        }

    combined[cat] = sorted(seen.values(), key=lambda e: e.get('title', '').lower())
    used_ids.update(seen.keys())   # global guard — prevents same ID in another category

# ── Stats ─────────────────────────────────────────────────────────────────────
totals = {c: len(combined[c]) for c in CAT_ORDER}
total  = sum(totals.values())
all_ids = [e['id'] for c in CAT_ORDER for e in combined[c]]
dup_ids = [k for k, v in Counter(all_ids).items() if v > 1]

print(f"Per-category: {totals}")
print(f"Grand total: {total}")
print(f"Unique IDs: {len(set(all_ids))}")
print(f"Duplicates: {len(dup_ids)}")
if dup_ids:
    print("DUPLICATE IDs:", dup_ids[:5])

# ── Build .ts file ────────────────────────────────────────────────────────────
def block(en):
    ind2, ind3 = '  ', '    '
    cid, ttl, desc = en['id'], en['title'], en.get('description') or ''
    icon, href = en.get('icon') or '◆', en.get('href') or f'/services/{cid}'
    pop = 'true' if en.get('popular') else 'false'
    cat = en['category']
    feats = en.get('features') or []
    bens  = en.get('benefits') or []
    pr    = en.get('pricing') or {}
    ci    = en.get('contactInfo') or {}
    L = ['  {']
    L.append(f"    id: '{ts(cid)}',")
    L.append(f"    title: '{ts(ttl)}',")
    L.append(f"    description: '{ts(desc) or cid.replace('-',' ').title() + ' — comprehensive managed service with expert support and proven delivery methodology.'}',")
    L.append(f"    icon: '{ts(icon)}',")
    L.append(f"    href: '{ts(href)}',")
    L += [f"    popular: {pop},", f"    category: '{cat}',"]
    # features & benefits are REQUIRED by Service interface — always emit
    if not feats:
        feats = ['Core functionality', 'Professional support', 'Scalable deployment']
    L.append('    features: [')
    for f in feats[:8]: L.append(f"        '{ts(f)}',")
    L.append('    ],')
    if not bens:
        bens = ['Increased efficiency', 'Cost reduction', 'Improved workflow']
    L.append('    benefits: [')
    for b in bens[:6]: L.append(f"        '{ts(b)}',")
    L.append('    ],')
    # pricing — always output (required)
    pr = pr or {'basic': 'Custom', 'pro': 'Custom', 'enterprise': 'Custom'}
    b0 = str(pr.get('basic','Custom'))
    p0 = str(pr.get('pro','Custom'))
    e0 = str(pr.get('enterprise','Custom'))
    L.append("    pricing: " + "{ basic: '" + ts(b0) + "', pro: '" + ts(p0) + "', enterprise: '" + ts(e0) + "' },")
    # contactInfo — always output (required)
    ci = ci or {}
    L.append('    contactInfo: {')
    L.append(f"        website: '{ts(ci.get('website', f'/services/{cid}'))}',")
    L.append(f"        email: '{ts(ci.get('email','kleber@ziontechgroup.com'))}',")
    L.append(f"        phone: '{ts(ci.get('phone','+1 302 464 0950'))}',")
    L.append('    },')
    L.append('  },\n')
    return '\n'.join(L)

out = []
out.append("// Service data for AI and IT solutions")
out.append("export interface Service {")
for l in [
    "  id: string;", "  title: string;", "  description: string;",
    "  features: string[];", "  benefits: string[];",
    "  pricing: {", "    basic: string;", "    pro: string;", "    enterprise: string;", "  };",
    "  contactInfo: {", "    website: string;", "    email: string;", "    phone: string;", "  };",
    "  icon: string;", "  href: string;", "  popular?: boolean;",
    "  category: 'ai' | 'it' | 'cloud' | 'security' | 'data' | 'automation';",
]: out.append(l)
out.append("}\n")

for cat in CAT_ORDER:
    out.append(f"export const {cat}Services: Service[] = [")
    for en in combined[cat]: out.append(block(en))
    out.append("];\n")

out += [
    "export const itSolutions = itServices;",
    "export const allServices: Service[] = [...aiServices, ...itServices];\n",
    "// Export as servicesData for backward compatibility",
    "export const servicesData = {",
    "  aiServices,", "  itServices,", "  itSolutions,", "  allServices",
    "}\n",
    "export const getServiceById = (id: string): Service | undefined => {",
    "  return allServices.find(s => s.id === id);",
    "}",
    "export const getServicesByCategory = (category: Service['category']): Service[] => {",
    "  return allServices.filter(s => s.category === category);",
    "}",
    "export const getPopularServices = (): Service[] => {",
    "  return allServices.filter(s => s.popular);",
    "}",
]

SD_OUT.write_text('\n'.join(out))

# Verify
final_ids = set(re.findall(r"id:\s*'([^']+)'", '\n'.join(out)))
final_dups = [k for k,v in Counter(re.findall(r"id:\s*'([^']+)',", '\n'.join(out))).items() if v > 1]
print(f"\n✅ Written: {len(out)} lines, {SD_OUT.stat().st_size//1024} KB")
print(f"   Unique service IDs: {len(final_ids)}")
print(f"   Duplicates remaining: {len(final_dups)}")
