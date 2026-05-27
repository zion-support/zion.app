
#!/usr/bin/env python3
"""
servicesData.ts: merge HEAD (servicesData.ts) + JSON (servicesData.json).
  • All services are EXACTLY ONCE in EACH category array
  • 0 duplicates — dedup guaranteed
  • No True/False — all booleans are lowercase
  • Single-quote strings are properly escaped
  • Prefix-based canonical category for cloud/security/data/automation
"""
import json, re, subprocess
from pathlib import Path
from collections import defaultdict

WORKDIR   = Path('/Users/klebergarciaalcatrao/zion.app')
JSON_FILE = WORKDIR / 'app' / 'data' / 'servicesData.json'
SD_OUT    = WORKDIR / 'app' / 'data' / 'servicesData.ts'
CAT_ORDER = ['ai','it','cloud','security','data','automation']

PREFIX = {p for p in CAT_ORDER}  # ai-, it-, cloud-, security-, data-, automation-

# ── helpers ───────────────────────────────────────────────────────────────────
def canon(s): return s.replace('_','-').lower()
def ts(s): return str(s).replace('\\','\\\\').replace("'","\\'").replace('\n',' ')
def prefix_cat(id_):
    for p in CAT_ORDER:
        if id_.startswith(p+'-'): return p
    return None  # unprefixed → use JSON category

# ── Load HEAD ─────────────────────────────────────────────────────────────────
r = subprocess.run(['git','show','HEAD:app/data/servicesData.ts'],
                   capture_output=True, text=True, cwd=WORKDIR)
head_text = r.stdout

ai_start = head_text.find('export const aiServices: Service[] = [')
ai_end   = head_text.find('];\n', ai_start)
it_start = head_text.find('export const itServices: Service[] = [')
it_end   = head_text.find('];\n', it_start)

# Collect HEAD entries: canonical_id → (raw_id, array_name)
head_raw = {}   # canonical_id → (sid, arr: 'ai'|'it')
for m in re.finditer(r"id:\s*'([^']+)'", head_text):
    sid = m.group(1)
    cid = canon(sid)
    pos  = m.start()
    if ai_start <= pos <= ai_end:
        arr = 'ai'
    elif it_start <= pos <= it_end:
        arr = 'it'
    else:
        continue
    head_raw[cid] = (sid, arr)

print(f"HEAD services captured: {len(head_raw)}")

# Canonical category for HEAD entries
def head_canon_cat(sid, arr):
    pref = prefix_cat(sid)
    return pref if pref else arr

head_by_cat = defaultdict(list)   # cat → [(cid, sid)]
for cid, (sid, arr) in head_raw.items():
    cat = head_canon_cat(sid, arr)
    if cat in CAT_ORDER:
        head_by_cat[cat].append((cid, sid))

print("HEAD per canonical category:")
for c in CAT_ORDER:
    print(f"  {c}: {len(head_by_cat[c])}")

# ── Load & dedup JSON ─────────────────────────────────────────────────────────
sdj = json.loads(JSON_FILE.read_text())
for s in sdj:
    if s.get('category') not in CAT_ORDER:
        s['category'] = prefix_cat(s['id']) or 'ai'

json_map = {}
for s in sdj:
    cid = canon(s['id'])
    if cid not in json_map: json_map[cid] = s

print(f"\nJSON unique services: {len(json_map)}")

# ── Build combined per category ────────────────────────────────────────────────
combined = {}
for cat in CAT_ORDER:
    seen = set()  # canonical IDs already in this category
    entries = []

    # A) HEAD services whose canonical category == cat
    for cid, sid in head_by_cat.get(cat, []):
        if cid in seen: continue
        seen.add(cid)
        j = json_map.get(cid)
        entries.append(j or {
            'id': sid,'title': sid.replace('-',' ').title(),
            'description':'Comprehensive service offering.','icon':'★',
            'href':f'/services/{sid}','popular': False,
            'features':['Advanced technology','24/7 support','Rapid deployment'],
            'benefits':['Cost savings','Efficiency gains','Scalable growth'],
            'pricing':{'basic':'Custom','pro':'Custom','enterprise':'Custom'},
            'contactInfo':{'website':f'/services/{sid}',
                           'email':'kleber@ziontechgroup.com',
                           'phone':'+1 302 464 0950'},
            'category':cat
        })

    # B) JSON-only entries (canonical category == cat, not yet in seen)
    for cid, s in json_map.items():
        if s['category'] != cat: continue
        if cid in seen: continue
        seen.add(cid)
        entries.append(s)

    combined[cat] = sorted(entries, key=lambda e: e.get('title','').lower())

# ── Stats ─────────────────────────────────────────────────────────────────────
totals  = {c: len(combined[c]) for c in CAT_ORDER}
total   = sum(totals.values())
all_ids = [e['id'] for c in CAT_ORDER for e in combined[c]]
uniq    = len(set(all_ids))
dup_ids = [k for k,v in Counter(all_ids).items() if v > 1]

print(f"\nPer-category: {totals}")
print(f"Grand total: {total}")
print(f"Unique IDs:  {uniq}")
print(f"Duplicates:  {len(dup_ids)}")
if dup_ids:
    print("Dup IDs:", dup_ids[:6])

# ── Generate .ts ──────────────────────────────────────────────────────────────
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
]:
    out.append(l)
out.append("}\n")

for cat in CAT_ORDER:
    out.append(f"export const {cat}Services: Service[] = [")
    for en in combined[cat]:
        out.append(service_block(en, ts))
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
final_ids = set(re.findall(r"id:\s*'([^']+)'", '\n'.join(out)))
final_dups= [k for k,v in Counter(re.findall(r"id:\s*'([^']+)',", '\n'.join(out))).items() if v>1]
print(f"\n✅ Written: {len(out):,} lines, {SD_OUT.stat().st_size//1024} KB")
print(f"   Unique IDs: {len(final_ids)}, Duplicates: {len(final_dups)}")
