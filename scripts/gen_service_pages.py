#!/usr/bin/env python3
"""Generate static service detail pages for ALL services in servicesData.json"""
import json, os

base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out_services = os.path.join(base, 'out', 'services')

with open(os.path.join(base, 'app/data/servicesData.json')) as f:
    services = json.load(f)

TPL = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} | Zion Tech Group</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="https://ziontechgroup.com/services/{id}/">
<meta http-equiv="refresh" content="0;url=/services/"/>
</head>
<body>
<main style="max-width:800px;margin:0 auto;padding:2rem;font-family:system-ui,sans-serif;color:#1e293b">
<h1>{title}</h1>
<p style="color:#64748b">{desc}</p>
<h2>Key Features</h2>
<ul>{features}</ul>
<h2>Benefits</h2>
<ul>{benefits}</ul>
<h2>Pricing</h2>
<p><strong>Basic:</strong> {basic} &nbsp;|&nbsp; <strong>Pro:</strong> {pro} &nbsp;|&nbsp; <strong>Enterprise:</strong> {enterprise}</p>
<h2>Get Started</h2>
<p>Contact us to get started with {title}:</p>
<p>📞 +1 302 464 0950<br>
✉ <a href="mailto:kleber@ziontechgroup.com">kleber@ziontechgroup.com</a><br>
📍 364 E Main St STE 1008, Middletown, DE 19709<br>
🌐 <a href="https://ziontechgroup.com">ziontechgroup.com</a></p>
<p><a href="/services/">← Back to All Services</a></p>
</main>
</body>
</html>"""

generated = 0
skipped = 0
for s in services:
    svc_dir = os.path.join(out_services, s['id'])
    index_file = os.path.join(svc_dir, 'index.html')
    
    # Always regenerate to ensure latest data
    os.makedirs(svc_dir, exist_ok=True)
    
    features = ''.join(f'<li>{f}</li>' for f in s.get('features', []))
    benefits = ''.join(f'<li>{b}</li>' for b in s.get('benefits', []))
    pricing = s.get('pricing', {})
    
    html = TPL.format(
        title=s['title'], desc=s['description'], id=s['id'],
        features=features, benefits=benefits,
        basic=pricing.get('basic', 'Contact us for pricing'),
        pro=pricing.get('pro', 'Contact us for pricing'),
        enterprise=pricing.get('enterprise', 'Custom pricing')
    )
    
    with open(index_file, 'w') as f:
        f.write(html)
    generated += 1

print(f"Generated {generated} service detail pages")
print(f"Total service directories: {len([d for d in os.listdir(out_services) if os.path.isdir(os.path.join(out_services, d))])}")
