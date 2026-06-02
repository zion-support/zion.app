import json, re

json_path = '/data/data/com.termux/files/home/zion-support.github.io/app/data/servicesData.json'
ts_path = '/data/data/com.termux/files/home/zion-support.github.io/app/data/servicesData.ts'

with open(json_path) as f:
    json_services = json.load(f)

with open(ts_path, 'r') as f:
    ts_content = f.read()

existing_ids = set(re.findall(r"id:\s*'([^']+)'", ts_content))
new_services = [s for s in json_services if s['id'] not in existing_ids]
print(f"New services to add: {len(new_services)}")

entries = []
for s in new_services:
    feats = ', '.join(f"'{f}'" for f in s.get('features', []))
    bens = ', '.join(f"'{b}'" for b in s.get('benefits', []))
    p = s.get('pricing', {})
    entry = "  {\n"
    entry += f"    id: '{s['id']}',\n"
    entry += f"    title: '{s['title']}',\n"
    entry += f"    description: '{s['description'][:200]}',\n"
    entry += f"    features: [{feats}],\n"
    entry += f"    benefits: [{bens}],\n"
    entry += f"    pricing: {{ basic: '{p.get('basic','Contact')}', pro: '{p.get('pro','Contact')}', enterprise: '{p.get('enterprise','Custom')} }},\n"
    entry += f"    contactInfo: {{ website: '/contact', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' }},\n"
    entry += f"    icon: '★',\n"
    entry += f"    href: '{s.get('href','/services/'+s['id'])}',\n"
    entry += f"    popular: {str(s.get('popular',False)).lower()},\n"
    entry += f"    category: '{s.get('category','ai')}',\n"
    entry += f"    industry: '{s.get('industry','General')}',\n"
    entry += "  },"
    entries.append(entry)

# Insert before the closing ];
insert_point = ts_content.rfind('];\n\nexport const getServiceById')
if insert_point == -1:
    insert_point = ts_content.rfind('];\n')

new_content = ts_content[:insert_point] + '\n' + '\n'.join(entries) + '\n' + ts_content[insert_point:]

with open(ts_path, 'w') as f:
    f.write(new_content)

print(f"Added {len(entries)} services to servicesData.ts")
print(f"Total TS services now: {len(existing_ids) + len(entries)}")
