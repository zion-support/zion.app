
#!/usr/bin/env python3
"""
Rebuild servicesData.ts from HEAD+JSON.
Clean, correct typing, all categories, 500+ services.
"""
import json, re, sys
from pathlib import Path
from collections import defaultdict, Counter

WORKDIR   = Path('/Users/klebergarciaalcatrao/zion.app')
JSON_FILE = WORKDIR / 'app' / 'data' / 'servicesData.json'
SD_CLEAN  = WORKDIR / 'app' / 'data' / 'servicesData.clean.ts'
SD_OUT    = WORKDIR / 'app' / 'data' / 'servicesData.ts'
CAT_ORDER = ['ai', 'it', 'cloud', 'security', 'data', 'automation']

head_text = SD_CLEAN.read_text()
sdj       = json.loads(JSON_FILE.read_text())

def canon(s): return s.replace('_','-').lower()
def ts(s): return s.replace("\\'","\\\\'").replace('"','\\"').replace('\n',' ')
def infer_cat(sid):
    for p in CAT_ORDER:
        if sid.startswith(p+'-'): return p
    return 'ai'

# gather HEAD entries per THEIR STATED CATEGORY (not inferred)
head_by_cat = defaultdict(list)
for m in re.finditer(r"id:\s*'([^']+)'", head_text):
    sid = m.group(1)
    ctx  = head_text[max(0,m.start()-300):m.start()]
    m2   = re.search(r"category:\s*'([a-z]+)'", ctx)
    c = m2.group(1) if (m2 and m2.group(1) in CAT_ORDER) else infer_cat(sid)
    head_by_cat[c].append(sid)

# JSON by category
json_by_cat = defaultdict(list)
for s in sdj: json_by_cat[s['category']].append(s)

# combine
combined = {}
for c in CAT_ORDER:
    seen = {}
    for sid in head_by_cat[c]:
        cid = canon(sid)
        if cid in seen: continue
        found = next((s for s in json_by_cat[c] if canon(s['id'])==cid), None)
        seen[cid] = found or {
            'id': sid, 'title': sid.replace('-',' ').title(),
            'description':'', 'icon':'★', 'href': f'/services/{sid}',
            'popular': False, 'features':[], 'benefits':[],
            'pricing':{}, 'contactInfo':{}, 'category': c
        }
    for s in json_by_cat[c]:
        if canon(s['id']) not in seen:
            seen[canon(s['id'])] = s
    combined[c] = sorted(seen.values(), key=lambda e: e['title'].lower())

totals = {c:len(combined[c]) for c in CAT_ORDER}
print(f"Per-category: {totals}")
print(f"Grand total: {sum(totals.values())}")

def block(en, sp=2):
    ind  = '  '*sp
    ind2 = '    '*sp
    ind3 = '      '*sp
    cid,ttl,desc = en['id'],en['title'],en.get('description','')
    icon,href = en.get('icon',''),en.get('href','')
    pop,cat = 'true' if en.get('popular') else 'false', en['category']
    feats,bens = en.get('features',[]) or [], en.get('benefits',[]) or []
    pr, ci = en.get('pricing') or {}, en.get('contactInfo') or {}
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
        L.append(f"{ind2}pricing: " + "{ basic: '"+ts(b)+"', pro: '"+ts(p)+"', enterprise: '"+ts(e)+"' },")
    if ci:
        site = ci.get('website',f'/services/{cid}')
        em = ci.get('email','kleber@ziontechgroup.com')
        ph = ci.get('phone','+1 302 464 0950')
        L.append(f"{ind2}contactInfo: {{")
        L.append(f"{ind2}  website: '{ts(site)}',")
        L.append(f"{ind2}  email: '{ts(em)}',")
        L.append(f"{ind2}  phone: '{ts(ph)}',")
        L.append(f"{ind2}}},")
    L.append(f"{ind}}},")
    return '\n'.join(L)

out = []
out.append("// Service data for AI and IT solutions — GENERATED")
out.append("// Source: app/data/servicesData.json + HEAD servicesData.ts\n")

out.append("export interface Service {")
for line in [
    "  id: string;","  title: string;","  description: string;",
    "  features: string[];","  benefits: string[];",
    "  pricing: {","    basic: string;","    pro: string;","    enterprise: string;","  };",
    "  contactInfo: {","    website: string;","    email: string;","    phone: string;","  };",
    "  icon: string;","  href: string;","  popular?: boolean;",
    "  category: 'ai' | 'it' | 'cloud' | 'security' | 'data' | 'automation';",
]: out.append(line)
out.append("}\n")

for cat in CAT_ORDER:
    arr = f"{cat}Services"
    out.append(f"export const {arr}: Service[] = [")
    for en in combined[cat]:
        out.append(block(en))
    out.append("];\n")

out += [
    "export const itSolutions = itServices;",
    "export const allServices: Service[] = [...aiServices, ...itServices];\n",
    "// Export as servicesData for backward compatibility",
    "export const servicesData = {",
    "  aiServices,","  itServices,","  itSolutions,","  allServices",
    "}\n",
    "export const getServiceById = (id: string): Service | undefined => {",
    "  return allServices.find(s => s.id === id);",
    "}",
    "export const getServicesByCategory = (category: Service['category']): Service[] => {",
    "  return allServices.filter(s => s.category === category);",
    "}",
    "export const getPopularServices = (): Service[] => {",
    "  return allServices.filter(s => s.popular);",
    "}"
]

out_text = '\n'.join(out)
SD_OUT.write_text(out_text)

ids_written = re.findall(r"id:\s*'([^']+)'", out_text)
ids_unique  = Counter(ids_written)
cats_out    = Counter(re.findall(r"category:\s* '([a-z]+)'", out_text))
print(f"Written {len(out):,} lines to {SD_OUT}")
print(f"Total IDs: {len(ids_written)}, unique: {len(ids_unique)}")
print(f"Categories: {dict(cats_out)}")
print(f"File size: {SD_OUT.stat().st_size:,} bytes")
