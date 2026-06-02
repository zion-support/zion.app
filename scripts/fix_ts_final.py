import json, re

base = '/data/data/com.termux/files/home/zion-support.github.io'

with open(f'{base}/app/data/servicesData.ts') as f:
    ts = f.read()

with open(f'{base}/app/data/servicesData.json') as f:
    json_services = json.load(f)

existing = set(re.findall(r"id:\s*'([^']*)'", ts))
missing = [s for s in json_services if s['id'] not in existing]
print(f"Adding {len(missing)} services to TS")

# Generate simple entries
entries = []
for s in missing:
    # Escape any single quotes in description
    desc = s['description'][:200].replace("'", "\\'")
    title = s['title'].replace("'", "\\'")
    feats = ', '.join(f"'{f}'" for f in s.get('features', []))
    bens = ', '.join(f"'{b}'" for b in s.get('benefits', []))
    p = s.get('pricing', {})
    entry = f"  {{ id: '{s['id']}', title: '{title}', description: '{desc}', features: [{feats}], benefits: [{bens}], pricing: {{ basic: '{p.get('basic','Contact')}', pro: '{p.get('pro','Contact')}', enterprise: '{p.get('enterprise','Custom')}' }}, contactInfo: {{ website: '/contact', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' }}, icon: '★', href: '{s.get('href','/services/'+s['id'])}', popular: {str(s.get('popular',False)).lower()}, category: '{s.get('category','ai')}', industry: '{s.get('industry','General')}' }},"
    entries.append(entry)

# Find the last '];' before 'export const getServiceById'
insert_point = ts.rfind('];\n\nexport const getServiceById')
if insert_point == -1:
    insert_point = ts.rfind('];')

new_ts = ts[:insert_point] + '\n' + '\n'.join(entries) + '\n' + ts[insert_point:]

with open(f'{base}/app/data/servicesData.ts', 'w') as f:
    f.write(new_ts)

# Verify
remaining = new_ts.count('<<<<<<< HEAD')
print(f"Conflict markers: {remaining}")
print(f"Total services: {len(existing) + len(missing)}")
