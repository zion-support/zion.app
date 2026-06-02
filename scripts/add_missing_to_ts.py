import json, re

with open('/data/data/com.termux/files/home/zion-support.github.io/app/data/servicesData.ts') as f:
    ts_content = f.read()

with open('/data/data/com.termux/files/home/zion-support.github.io/app/data/servicesData.json') as f:
    json_services = json.load(f)

existing = set(re.findall(r"id:\s*'([^']*)'", ts_content))
missing = [s for s in json_services if s['id'] not in existing]
print(f"Adding {len(missing)} missing services")

entries = []
for s in missing:
    feats = ', '.join(f"'{f}'" for f in s.get('features', []))
    bens = ', '.join(f"'{b}'" for b in s.get('benefits', []))
    p = s.get('pricing', {})
    entry = f"  {{ id: '{s['id']}', title: '{s['title']}', description: '{s['description'][:200]}', features: [{feats}], benefits: [{bens}], pricing: {{ basic: '{p.get('basic','Contact')}', pro: '{p.get('pro','Contact')}', enterprise: '{p.get('enterprise','Custom')}' }}, contactInfo: {{ website: '/contact', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' }}, icon: '★', href: '{s.get('href','/services/'+s['id'])}', popular: {str(s.get('popular',False)).lower()}, category: '{s.get('category','ai')}', industry: '{s.get('industry','General')}' }},"
    entries.append(entry)

# Insert before the last '];' that closes allServices
last_close = ts_content.rfind('];\n\nexport')
if last_close == -1:
    last_close = ts_content.rfind('];')

new_content = ts_content[:last_close] + '\n' + '\n'.join(entries) + '\n' + ts_content[last_close:]

with open('/data/data/com.termux/files/home/zion-support.github.io/app/data/servicesData.ts', 'w') as f:
    f.write(new_content)

remaining = new_content.count('<<<<<<<') + new_content.count('=======')
print(f"Conflict markers: {remaining}")
print(f"Total services: {len(existing) + len(missing)}")
