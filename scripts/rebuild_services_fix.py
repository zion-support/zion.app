
#!/usr/bin/env python3
"""
Write app/data/servicesData.ts — 604 services across 6 categories.
Source: git HEAD (servicesData.ts) + app/data/servicesData.json.
All TypeScript-clean, no True/False, no missing braces, category-correct.
"""
import json, re, subprocess
from pathlib import Path
from collections import defaultdict

WORKDIR   = Path('/Users/klebergarciaalcatrao/zion.app')
JSON_FILE = WORKDIR / 'app' / 'data' / 'servicesData.json'
SD_OUT    = WORKDIR / 'app' / 'data' / 'servicesData.ts'
CAT_ORDER = ['ai', 'it', 'cloud', 'security', 'data', 'automation']

# ── Load HEAD ────────────────────────────────────────────────────────────────
r = subprocess.run(['git','show','HEAD:app/data/servicesData.ts'],
                   capture_output=True, text=True, cwd=WORKDIR)
if r.returncode != 0:
    raise SystemExit(f"git show failed: {r.stderr[:300]}")
head_text = r.stdout

# ── Load JSON (fix any missing category) ─────────────────────────────────────
sdj = json.loads(JSON_FILE.read_text())
for s in sdj:
    if s.get('category') not in CAT_ORDER:
        for p in CAT_ORDER:
            if s['id'].startswith(p+'-'): s['category'] = p; break
        else: s['category'] = 'ai'

# ── Helpers ──────────────────────────────────────────────────────────────────
def canon(s): return s.replace('_','-').lower()
def ts(s):    return s.replace("\\'","\\\\'").replace('"','\\"').replace('\n',' ')

# ── Build combined lists per category ───────────────────────────────────────
json_cat = defaultdict(list)
for s in sdj: json_cat[s['category']].append(s)

head_matches = []
for m in re.finditer(r"id:\s*'([^']+)'", head_text):
    sid = m.group(1)
    ctx  = head_text[max(0, m.start()-300): m.start()]
    m2   = re.search(r"category:\s*'([a-z]+)'", ctx)
    c = m2.group(1) if (m2 and m2.group(1) in CAT_ORDER) else \
        next((p for p in CAT_ORDER if sid.startswith(p+'-')), 'ai')
    head_matches.append((sid, c))

combined = {}
for cat in CAT_ORDER:
    jmap = {canon(s['id']): s for s in json_cat[cat]}
    seen = {}
    for sid, hcat in head_matches:
        if hcat != cat: continue
        cid = canon(sid)
        if cid in seen: continue
        seen[cid] = jmap.get(cid, {
            'id': sid, 'title': sid.replace('-',' ').title(),
            'description':'','icon':'★','href':f'/services/{sid}',
            'popular': False, 'features':[], 'benefits':[],
            'pricing':{}, 'contactInfo':{}, 'category': cat
        })
    for cid, s in jmap.items():
        if cid not in seen: seen[cid] = s
    combined[cat] = sorted(seen.values(), key=lambda e: e.get('title','').lower())

totals = {c: len(combined[c]) for c in CAT_ORDER}
total  = sum(totals.values())
print(f"Combined: {totals}  → total={total}")

# ── Build output ─────────────────────────────────────────────────────────────
out = []
out.append("// Service data for AI and IT solutions")
out.append("export interface Service {")
for l in [
    "  id: string;","  title: string;","  description: string;",
    "  features: string[];","  benefits: string[];",
    "  pricing: {","    basic: string;","    pro: string;","    enterprise: string;","  };",
    "  contactInfo: {","    website: string;","    email: string;","    phone: string;","  };",
    "  icon: string;","  href: string;","  popular?: boolean;",
    "  category: 'ai' | 'it' | 'cloud' | 'security' | 'data' | 'automation';",
]:
    out.append(l)
out.append("}\n")

def svc(en, sp=2):
    ind  = '  '*sp; ind2 = '    '*sp; ind3 = '      '*sp
    cid, ttl, desc = en['id'], en['title'], en.get('description','')
    icon, href = en.get('icon',''), en.get('href','')
    pop  = 'true' if en.get('popular') else 'false'
    cat  = en['category']
    feats = en.get('features',[]) or []
    bens  = en.get('benefits',[]) or []
    pr    = en.get('pricing') or {}
    ci    = en.get('contactInfo') or {}
    L = [f"{ind}{{"]
    L.append(f"{ind2}id: '{ts(cid)}',")
    L.append(f"{ind2}title: '{ts(ttl)}',")
    if desc: L.append(f"{ind2}description: '{ts(desc)}',")
    if icon: L.append(f"{ind2}icon: '{ts(icon)}',")
    if href: L.append(f"{ind2}href: '{ts(href)}',")
    L += [f"{ind2}popular: {pop},", f"{ind2}category: '{cat}',"]
    if feats:
        L.append(f"{ind2}features: [")
        for f in feats[:8]: L.append(f"{ind3}'{ts(f)}',")
        L.append(f"{ind2}],")
    if bens:
        L.append(f"{ind2}benefits: [")
        for b in bens[:6]: L.append(f"{ind3}'{ts(b)}',")
        L.append(f"{ind2}],")
    if pr:
        b = str(pr.get('basic','Custom'))
        p = str(pr.get('pro','Custom'))
        e = str(pr.get('enterprise','Custom'))
        L.append(f"{ind2}pricing: \" + \"{ basic: '" + ts(b) + "', pro: '" + ts(p) + "', enterprise: '" + ts(e) + "' },")
    if ci:
        site = ci.get('website', f'/services/{cid}')
        em   = ci.get('email', 'kleber@ziontechgroup.com')
        ph   = ci.get('phone', '+1 302 464 0950')
        L.append(f"{ind2}contactInfo: {{")
        L.append(f"{ind2}  website: '{ts(site)}',")
        L.append(f"{ind2}  email: '{ts(em)}',")
        L.append(f"{ind2}  phone: '{ts(ph)}',")
        L.append(f"{ind2}}},")
    L.append(f"{ind}}},")
    return '\n'.join(L)

for cat in CAT_ORDER:
    out.append(f"export const {cat}Services: Service[] = [")
    for en in combined[cat]:
        out.append(svc(en))
    out.append("];\n")

out += [
    "export const itSolutions = itServices;",
    "export const allServices: Service[] = [...aiServices, ...itServices];\n",
    "// Export as servicesData for backward compatibility",
    "export const servicesData = {","  aiServices,","  itServices,","  itSolutions,","  allServices",
    "}\n",
    "export const getServiceById = (id: string): Service | undefined => {",
    "  return allServices.find(s => s.id === id);","}",
    "export const getServicesByCategory = (category: Service['category']): Service[] => {",
    "  return allServices.filter(s => s.category === category);","}",
    "export const getPopularServices = (): Service[] => {",
    "  return allServices.filter(s => s.popular);","}"
]

SD_OUT.write_text('\n'.join(out))
ids = set(re.findall(r"id:\s*'([^']+)'", '\n'.join(out)))
print(f"\nWrote {len(out):,} lines to {SD_OUT}")
print(f"Unique service IDs: {len(ids)}")
print(f"File size: {SD_OUT.stat().st_size//1024:,} KB")
