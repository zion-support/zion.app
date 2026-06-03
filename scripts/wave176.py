#!/usr/bin/env python3
"""Wave 176: Add 10 new services"""
import json, re

JSON_PATH = 'app/data/servicesData.json'
TS_PATH = 'app/data/servicesData.ts'

NEW_SERVICES = [
  {
    "id": "ai-customer-intent-prediction",
    "title": "AI Customer Intent Prediction Engine",
    "description": "Predict customer purchase intent in real-time using behavioral signals, browsing patterns, and historical data. Power personalized offers and reduce cart abandonment.",
    "features": ["Real-time intent scoring", "Behavioral signal analysis", "Cross-channel data unification", "Lookalike audience modeling", "API for e-commerce platforms", "Integration with Shopify, WooCommerce, Magento", "Live intent dashboards", "Automated offer triggering"],
    "benefits": ["Increase conversions by 28%", "Reduce cart abandonment", "Personalize shopping experiences", "Optimize ad spend"],
    "pricing": {"basic": "$499/mo", "pro": "$1,499/mo", "enterprise": "Custom"},
    "icon": "🎯", "popular": True, "category": "ai", "industry": "E-Commerce"
  },
  {
    "id": "ai-insurance-claims-automation",
    "title": "AI Insurance Claims Automation",
    "description": "End-to-end insurance claims processing with AI. Document extraction, fraud detection, damage assessment via photos, and automated adjudication for faster payouts.",
    "features": ["OCR document extraction", "Photo-based damage assessment", "Fraud scoring engine", "Automated adjudication rules", "Policy coverage matching", "Integration with Guidewire, Duck Creek", "Regulatory compliance checks", "Customer self-service portal"],
    "benefits": ["Reduce claims processing time by 70%", "Lower fraud losses", "Improve customer satisfaction", "Cut operational costs"],
    "pricing": {"basic": "$2,999/mo", "pro": "$8,999/mo", "enterprise": "Custom"},
    "icon": "🛡️", "popular": False, "category": "ai", "industry": "Insurance"
  },
  {
    "id": "ai-localization-engine",
    "title": "AI Content Localization Engine",
    "description": "Go beyond translation — adapt content for local markets with AI. Cultural nuance detection, imagery adaptation, and brand voice consistency across 50+ languages.",
    "features": ["Cultural nuance detection", "Image and icon adaptation", "Brand voice preservation", "Glossary and style guide support", "Integration with CMS (Contentful, Strapi)", "In-context preview", "Quality scoring per locale", "Continuous learning from native reviewers"],
    "benefits": ["Launch in new markets 3x faster", "Avoid cultural missteps", "Consistent brand voice globally", "Reduce localization costs by 50%"],
    "pricing": {"basic": "$599/mo", "pro": "$1,799/mo", "enterprise": "Custom"},
    "icon": "🌍", "popular": False, "category": "ai", "industry": "Technology"
  },
  {
    "id": "ai-predictive-quality-assurance",
    "title": "AI Predictive Quality Assurance",
    "description": "Predict manufacturing defects before they happen using sensor data and ML models. Integrate with IoT platforms and MES for real-time quality control.",
    "features": ["Sensor data anomaly detection", "Defect prediction models", "Root cause analysis", "Integration with Siemens MindSphere, AWS IoT", "Real-time quality dashboards", "Custom ML model training", "Batch quality forecasting", "Alerting and escalation workflows"],
    "benefits": ["Reduce defect rates by 40%", "Minimize scrap and rework", "Ensure consistent product quality", "Compliance-ready reporting"],
    "pricing": {"basic": "$1,499/mo", "pro": "$4,499/mo", "enterprise": "Custom"},
    "icon": "🏭", "popular": False, "category": "ai", "industry": "Manufacturing"
  },
  {
    "id": "micro-saas-feature-request-voting",
    "title": "FeatureVote — Feature Request Voting Board",
    "description": "Public feature request board with voting, status tracking, and roadmap publishing. Help product teams prioritize based on real customer demand.",
    "features": ["Public voting board", "Duplicate detection and merging", "Status tracking (planned, in-progress, done)", "Public roadmap publishing", "Integration with Intercom, Slack, Zendesk", "Admin moderation tools", "Email notifications for voters", "Embeddable widget"],
    "benefits": ["Build what customers actually want", "Reduce support ticket volume", "Transparent product roadmap", "Increase customer engagement"],
    "pricing": {"basic": "$29/mo", "pro": "$99/mo", "enterprise": "$299/mo"},
    "icon": "🗳️", "popular": True, "category": "micro-saas", "industry": "SaaS"
  },
  {
    "id": "micro-saas-usage-based-cost-calculator",
    "title": "CostLens — Usage-Based Cost Calculator",
    "description": "Interactive pricing calculator widget for usage-based SaaS. Real-time cost estimation, scenario comparison, and embed in any site with one script tag.",
    "features": ["Drag-and-drop calculator builder", "Real-time cost updates", "Scenario comparison tables", "Embeddable JavaScript widget", "Currency conversion", "Integration with Stripe billing", "PDF export for proposals", "Analytics on calculator usage"],
    "benefits": ["Increase pricing page conversions", "Reduce sales cycle length", "Self-service pricing transparency", "Better lead qualification"],
    "pricing": {"basic": "$49/mo", "pro": "$149/mo", "enterprise": "$399/mo"},
    "icon": "💲", "popular": False, "category": "micro-saas", "industry": "SaaS"
  },
  {
    "id": "it-green-computing-consulting",
    "title": "Green Computing & Carbon-Neutral IT Consulting",
    "description": "Sustainability-first IT consulting. Carbon footprint assessment, green cloud migration strategies, and regulatory compliance for ESG reporting.",
    "features": ["IT carbon footprint assessment", "Green cloud migration roadmap", "Energy-efficient architecture design", "ESG compliance reporting (GRI, CDP)", "Vendor sustainability scoring", "Carbon offset integration", "Green SLA frameworks", "Executive sustainability dashboards"],
    "benefits": ["Meet ESG regulatory requirements", "Reduce cloud costs by 20%", "Attract sustainability-conscious customers", "Future-proof IT operations"],
    "pricing": {"basic": "$2,499/mo", "pro": "$7,499/mo", "enterprise": "Custom"},
    "icon": "🌿", "popular": False, "category": "it", "industry": "Technology"
  },
  {
    "id": "security-iot-device-security",
    "title": "IoT Device Security Platform",
    "description": "Secure IoT device fleets with continuous monitoring, firmware vulnerability detection, and automated patch management for industrial and consumer IoT.",
    "features": ["Device inventory and classification", "Firmware vulnerability scanning", "Behavioral anomaly detection", "Automated patch management", "Network segmentation recommendations", "Compliance for IEC 62443, NIST", "Integration with AWS IoT, Azure IoT Hub", "Real-time threat intelligence feeds"],
    "benefits": ["Prevent IoT botnet recruitment", "Ensure firmware integrity", "Meet IoT security compliance", "Reduce breach risk across device fleets"],
    "pricing": {"basic": "$999/mo", "pro": "$2,999/mo", "enterprise": "Custom"},
    "icon": "🔐", "popular": False, "category": "security", "industry": "IoT"
  },
  {
    "id": "cloud-database-optimization",
    "title": "Cloud Database Performance Optimization",
    "description": "Automated database performance tuning for cloud-native workloads. Query optimization, index recommendations, and cost-rightsizing across RDS, Cloud SQL, and Cosmos DB.",
    "features": ["Query performance analysis", "Automated index recommendations", "Cost-rightsizing alerts", "Slow query detection and fixing", "Support for PostgreSQL, MySQL, MongoDB, Redis", "Integration with AWS, GCP, Azure", "Anomaly detection on query patterns", "Weekly optimization reports"],
    "benefits": ["Reduce database costs by 35%", "Improve query performance", "Eliminate manual tuning", "Prevent production incidents"],
    "pricing": {"basic": "$349/mo", "pro": "$999/mo", "enterprise": "Custom"},
    "icon": "🗄️", "popular": False, "category": "cloud", "industry": "Technology"
  },
  {
    "id": "data-consent-management-platform",
    "title": "Data Consent Management Platform",
    "description": "Enterprise consent and preference management for GDPR, CCPA, and LGPD compliance. Unified consent collection, audit trails, and real-time enforcement.",
    "features": ["Consent collection banners", "Preference center for users", "Consent audit trails", "Cross-domain consent syncing", "Real-time enforcement APIs", "Integration with analytics and marketing tools", "Automated data subject request processing", "Multi-regulation support (GDPR, CCPA, LGPD, POPIA)"],
    "benefits": ["Achieve regulatory compliance", "Avoid fines up to 4% of revenue", "Build customer trust", "Automate DSAR workflows"],
    "pricing": {"basic": "$299/mo", "pro": "$899/mo", "enterprise": "Custom"},
    "icon": "📋", "popular": False, "category": "data", "industry": "Legal"
  },
]

# ── Update JSON ───────────────────────────────────────────────────
with open(JSON_PATH, 'r') as f:
    existing = json.load(f)

existing_ids = {s['id'] for s in existing}
added = 0
for svc in NEW_SERVICES:
    if svc['id'] not in existing_ids:
        entry = {
            "id": svc["id"],
            "title": svc["title"],
            "description": svc["description"],
            "features": svc["features"],
            "benefits": svc["benefits"],
            "pricing": svc["pricing"],
            "contactInfo": {
                "website": f"/services/{svc['id']}",
                "email": "kleber@ziontechgroup.com",
                "phone": "+1 302 464 0950"
            },
            "icon": svc["icon"],
            "href": f"/services/{svc['id']}",
            "popular": svc["popular"],
            "category": svc["category"],
            "industry": svc["industry"]
        }
        existing.append(entry)
        added += 1

with open(JSON_PATH, 'w') as f:
    json.dump(existing, f, indent=2, ensure_ascii=False)

print(f"JSON: Added {added} services. Total: {len(existing)}")

# ── Update TS ─────────────────────────────────────────────────────
with open(TS_PATH, 'r') as f:
    ts_content = f.read()

def make_ts_entry(svc):
    feats = json.dumps(svc['features'])
    benefits = json.dumps(svc['benefits'])
    pricing = json.dumps(svc['pricing'])
    return f"""  {{
    id: '{svc['id']}',
    title: '{svc['title']}',
    description: '{svc['description']}',
    features: {feats},
    benefits: {benefits},
    pricing: {pricing},
    contactInfo: {{"website": "/services/{svc['id']}", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"}},
    icon: '{svc['icon']}', href: '/services/{svc['id']}', popular: {str(svc['popular']).lower()}, category: '{svc['category']}', industry: '{svc['industry']}',
  }}"""

ai_svcs = [s for s in NEW_SERVICES if s['category'] == 'ai']
ms_svcs = [s for s in NEW_SERVICES if s['category'] == 'micro-saas']
it_svcs = [s for s in NEW_SERVICES if s['category'] == 'it']
sec_svcs = [s for s in NEW_SERVICES if s['category'] == 'security']
cloud_svcs = [s for s in NEW_SERVICES if s['category'] == 'cloud']
data_svcs = [s for s in NEW_SERVICES if s['category'] == 'data']

def make_array(name, svcs):
    entries = ',\n'.join(make_ts_entry(s) for s in svcs)
    return f"export const {name}: Service[] = [\n{entries}\n];\n\n"

new_ts = ""
for label, svcs in [("wave176AiServices", ai_svcs), ("wave176MicroSaasServices", ms_svcs),
                     ("wave176ItServices", it_svcs), ("wave176SecurityServices", sec_svcs),
                     ("wave176CloudServices", cloud_svcs), ("wave176DataServices", data_svcs)]:
    if svcs:
        new_ts += make_array(label, svcs)

# Insert arrays before the allServices definition
insert_marker = "export const allServices: Service[] = ["
if insert_marker in ts_content:
    ts_content = ts_content.replace(insert_marker, new_ts + insert_marker)
else:
    print("WARNING: Could not find allServices marker!")
    exit(1)

# Add spreads before wave176 spreads (maintain order — find wave175 or first wave spread)
spread_lines = []
for label in ["wave176AiServices", "wave176MicroSaasServices", "wave176ItServices",
              "wave176SecurityServices", "wave176CloudServices", "wave176DataServices"]:
    if label.replace("wave176", "").lower() in [s['category'].replace("-","") for s in NEW_SERVICES if s['category'] in label]:
        spread_lines.append(f"  ...{label},")

# Simpler: just check which arrays exist
spread_map = {"wave176AiServices": ai_svcs, "wave176MicroSaasServices": ms_svcs,
              "wave176ItServices": it_svcs, "wave176SecurityServices": sec_svcs,
              "wave176CloudServices": cloud_svcs, "wave176DataServices": data_svcs}
for label, svcs in spread_map.items():
    if svcs:
        spread_lines.append(f"  ...{label},")

spread_block = "\n".join(spread_lines) + "\n"
# Insert before the first wave spread line
first_spread = "  ...wave175AiServices,"
if first_spread in ts_content:
    ts_content = ts_content.replace(first_spread, spread_block + first_spread)
else:
    # Try wave163 or any earlier wave
    for marker in ["  ...wave163AiServices,", "  ...wave164AiServices,"]:
        if marker in ts_content:
            ts_content = ts_content.replace(marker, spread_block + marker)
            break
    else:
        print("WARNING: Could not find spread marker!")
        exit(1)

with open(TS_PATH, 'w') as f:
    f.write(ts_content)

print(f"TS: Added arrays for {len(NEW_SERVICES)} services")
