
#!/usr/bin/env python3
"""Fix all single-quote escaping issues in servicesData.ts"""
import json, re, subprocess
from pathlib import Path
from collections import defaultdict

WORKDIR   = Path('/Users/klebergarciaalcatrao/zion.app')
JSON_FILE = WORKDIR / 'app' / 'data' / 'servicesData.json'
SD_OUT    = WORKDIR / 'app' / 'data' / 'servicesData.ts'
CAT_ORDER = ['ai','it','cloud','security','data','automation']

r = subprocess.run(['git','show','HEAD:app/data/servicesData.ts'],
                   capture_output=True, text=True, cwd=WORKDIR)
head_text = r.stdout

sdj = json.loads(JSON_FILE.read_text())
for s in sdj:
    if s.get('category') not in CAT_ORDER:
        s['category'] = next((p for p in CAT_ORDER if s['id'].startswith(p+'-')), 'ai')

json_cat = defaultdict(list)
for s in sdj: json_cat[s['category']].append(s)

# HEAD entries per stated category
head_matches = []
for m in re.finditer(r"id:\s*'([^']+)'", head_text):
    sid = m.group(1)
    ctx  = head_text[max(0,m.start()-300):m.start()]
    m2   = re.search(r"category:\s*'([a-z]+)'", ctx)
    c = m2.group(1) if (m2 and m2.group(1) in CAT_ORDER) else next((p for p in CAT_ORDER if sid.startswith(p+'-')), 'ai')
    head_matches.append((sid, c))

# Combined per category
combined = {}
for cat in CAT_ORDER:
    jmap = {}
    for s in json_cat[cat]: jmap[s['id'].replace('_','-').lower()] = s
    seen = {}
    for sid, hcat in head_matches:
        if hcat != cat: continue
        cid = sid.replace('_','-').lower()
        if cid in seen: continue
        seen[cid] = jmap.get(cid, {
            'id': sid, 'title': sid.replace('-',' ').title(),
            'description':'','icon':'★','href':f'/services/{sid}',
            'popular': False, 'features':[],'benefits':[],
            'pricing':{},'contactInfo':{},'category':cat
        })
    for cid, s in jmap.items():
        if cid not in seen: seen[cid] = s
    combined[cat] = sorted(seen.values(), key=lambda e: e.get('title','').lower())

# Fix single quotes for TS safety: use \\x27 or embed as-is if already in double-quoted strings
def ts(s):
    """Escape a Python string for safe use inside a single-quoted TS string literal."""
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', ' ').replace('\r', '')

def block(en):
    ind2='    '; ind3='      '
    cid,ttl,desc=en['id'],en['title'],en.get('description','')
    icon,href=en.get('icon',''),en.get('href','')
    pop=['false','true'][bool(en.get('popular'))]
    cat=en['category']
    feats=en.get('features',[]) or []
    bens =en.get('benefits',[]) or []
    pr   =en.get('pricing') or {}
    ci   =en.get('contactInfo') or {}
    L=['  {']
    L.append(f"    id: '{ts(cid)}',")
    L.append(f"    title: '{ts(ttl)}',")
    if desc: L.append(f"    description: '{ts(desc)}',")
    if icon: L.append(f"    icon: '{ts(icon)}',")
    if href: L.append(f"    href: '{ts(href)}',")
    L+=[f"    popular: {pop},",f"    category: '{cat}',"]
    if feats:
        L.append('    features: [')
        for f in feats[:8]: L.append(f"        '{ts(f)}',")
        L.append('    ],')
    if bens:
        L.append('    benefits: [')
        for b in bens[:6]: L.append(f"        '{ts(b)}',")
        L.append('    ],')
    if pr:
        b0=str(pr.get('basic','Custom'))
        p0=str(pr.get('pro','Custom'))
        e0=str(pr.get('enterprise','Custom'))
        L.append(f"    pricing: " + "{ basic: '"+ts(b0)+"', pro: '"+ts(p0)+"', enterprise: '"+ts(e0)+"' },")
    if ci:
        site=ci.get('website',f'/services/{cid}')
        em=ci.get('email','kleber@ziontechgroup.com')
        ph=ci.get('phone','+1 302 464 0950')
        L.append('    contactInfo: {')
        L.append(f"      website: '{ts(site)}',")
        L.append(f"      email: '{ts(em)}',")
        L.append(f"      phone: '{ts(ph)}',")
        L.append('    },')
    L.append('  },\n')
    return '\n'.join(L)

# Build file
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

for cat in CAT_ORDER:
    out.append(f"export const {cat}Services: Service[] = [")
    for en in combined[cat]:
        out.append(block(en))
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
# Verify
import re
ids=set(re.findall(r"id:\s*'([^']+)'", '\n'.join(out)))
print(f"Wrote: {len(out)} lines | Unique IDs: {len(ids)}")
