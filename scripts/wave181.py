#!/usr/bin/env python3
"""Wave 181: Add 10 new services — focus on underrepresented categories"""
import json, re

JSON_PATH = 'app/data/servicesData.json'
TS_PATH = 'app/data/servicesData.ts'

NEW_SERVICES = [
  {
    "id": "cybersecurity-threat-intelligence-platform",
    "title": "Cybersecurity Threat Intelligence Platform",
    "description": "Real-time threat intelligence aggregation, analysis, and response. Monitor dark web, IOC feeds, and attack surface with AI-powered correlation.",
    "features": ["Dark web monitoring", "IOC aggregation and correlation", "Attack surface management", "Threat actor profiling", "Integration with SIEM/SOAR", "Automated alerting and triage", "Risk scoring", "Compliance mapping (MITRE ATT&CK)"],
    "benefits": ["Detect threats before they hit", "Reduce incident response time", "Proactive security posture", "Automated threat correlation"],
    "pricing": {"basic": "$799/mo", "pro": "$2,499/mo", "enterprise": "Custom"},
    "icon": "🛡️", "popular": True, "category": "cybersecurity", "industry": "Technology"
  },
  {
    "id": "fintech-fraud-detection-ai",
    "title": "AI-Powered Fraud Detection for Fintech",
    "description": "Real-time fraud detection for financial transactions. ML models trained on billions of transactions to detect anomalies, account takeover, and money laundering.",
    "features": ["Real-time transaction scoring", "Behavioral biometrics", "Account takeover detection", "AML/BSA compliance monitoring", "Integration with payment processors", "Case management workflow", "Explainable AI for regulators", "Custom rule engine"],
    "benefits": ["Reduce fraud losses by 80%", "Meet regulatory requirements", "Minimize false positives", "Scale without adding analysts"],
    "pricing": {"basic": "$1,999/mo", "pro": "$4,999/mo", "enterprise": "Custom"},
    "icon": "💳", "popular": True, "category": "fintech", "industry": "Finance"
  },
  {
    "id": "healthcare-it-telemedicine-platform",
    "title": "Telemedicine Platform for Healthcare IT",
    "description": "HIPAA-compliant telemedicine platform with video consultations, e-prescribing, patient scheduling, and EHR integration.",
    "features": ["HD video consultations", "HIPAA-compliant messaging", "E-prescribing (EPCS)", "Patient scheduling and reminders", "EHR/EMR integration", "Insurance verification", "Multi-language support", "Analytics dashboard"],
    "benefits": ["Expand patient reach", "Reduce no-show rates", "Streamline workflows", "Ensure HIPAA compliance"],
    "pricing": {"basic": "$399/mo", "pro": "$1,199/mo", "enterprise": "Custom"},
    "icon": "🏥", "popular": False, "category": "healthcare-it", "industry": "Healthcare"
  },
  {
    "id": "edtech-learning-management-system",
    "title": "AI-Enhanced Learning Management System",
    "description": "Modern LMS with AI-powered personalized learning paths, automated grading, engagement analytics, and content recommendations.",
    "features": ["AI personalized learning paths", "Automated grading and feedback", "Engagement analytics", "Content recommendation engine", "SCORM/xAPI compliance", "Live virtual classrooms", "Mobile learning app", "Integration with Zoom, Teams"],
    "benefits": ["Improve learning outcomes", "Reduce instructor workload", "Personalize at scale", "Increase completion rates"],
    "pricing": {"basic": "$199/mo", "pro": "$599/mo", "enterprise": "Custom"},
    "icon": "🎓", "popular": False, "category": "edtech", "industry": "Education"
  },
  {
    "id": "agritech-precision-farming",
    "title": "Precision Farming with AI & Drones",
    "description": "AI-powered precision agriculture platform. Drone imagery analysis, soil monitoring, crop health prediction, and yield optimization.",
    "features": ["Drone imagery analysis", "Soil sensor integration", "Crop health prediction", "Yield optimization", "Weather integration", "Irrigation automation", "Pest detection", "Farm management dashboard"],
    "benefits": ["Increase crop yields 20%", "Reduce water usage", "Early pest detection", "Data-driven decisions"],
    "pricing": {"basic": "$299/mo", "pro": "$899/mo", "enterprise": "Custom"},
    "icon": "🌾", "popular": False, "category": "agritech", "industry": "Agriculture"
  },
  {
    "id": "energy-tech-smart-grid-management",
    "title": "Smart Grid Energy Management",
    "description": "AI-powered smart grid management platform. Real-time energy monitoring, demand forecasting, renewable integration, and outage prediction.",
    "features": ["Real-time grid monitoring", "Demand forecasting", "Renewable energy integration", "Outage prediction and prevention", "Energy storage optimization", "Carbon footprint tracking", "Integration with IoT sensors", "Regulatory reporting"],
    "benefits": ["Reduce energy waste 30%", "Optimize renewable usage", "Prevent outages", "Meet sustainability goals"],
    "pricing": {"basic": "$1,499/mo", "pro": "$4,499/mo", "enterprise": "Custom"},
    "icon": "⚡", "popular": False, "category": "energy-tech", "industry": "Energy"
  },
  {
    "id": "logistics-tech-supply-chain-visibility",
    "title": "End-to-End Supply Chain Visibility",
    "description": "Real-time supply chain tracking and optimization. IoT integration, predictive analytics, route optimization, and supplier risk management.",
    "features": ["Real-time shipment tracking", "Predictive ETA", "Route optimization", "Supplier risk scoring", "Inventory optimization", "Integration with ERP/WMS", "Exception management", "Carbon tracking"],
    "benefits": ["Reduce logistics costs 25%", "Improve delivery times", "Mitigate supply risk", "End-to-end visibility"],
    "pricing": {"basic": "$599/mo", "pro": "$1,799/mo", "enterprise": "Custom"},
    "icon": "📦", "popular": False, "category": "logistics-tech", "industry": "Logistics"
  },
  {
    "id": "micro-saas-churn-prediction",
    "title": "ChurnGuard — SaaS Churn Prediction & Prevention",
    "description": "AI-powered churn prediction for SaaS. Identify at-risk customers, automate retention campaigns, and track health scores in real-time.",
    "features": ["AI churn prediction", "Customer health scoring", "Automated retention campaigns", "Integration with Stripe, HubSpot", "Cohort analysis", "Revenue impact forecasting", "Playbook automation", "NPS correlation"],
    "benefits": ["Reduce churn by 40%", "Increase LTV", "Automate retention", "Prioritize at-risk accounts"],
    "pricing": {"basic": "$99/mo", "pro": "$299/mo", "enterprise": "$799/mo"},
    "icon": "📉", "popular": True, "category": "micro-saas", "industry": "SaaS"
  },
  {
    "id": "ai-document-understanding-platform",
    "title": "AI Document Understanding Platform",
    "description": "Extract, classify, and understand any document type. OCR, NLP, and LLMs combined for invoices, contracts, forms, and handwritten notes.",
    "features": ["Multi-format OCR (PDF, images, scans)", "Intelligent document classification", "Key-value extraction", "Contract analysis", "Invoice processing", "Handwriting recognition", "Custom model training", "API and batch processing"],
    "benefits": ["Process documents 10x faster", "Reduce manual data entry", "Extract insights from unstructured data", "Scale without hiring"],
    "pricing": {"basic": "$199/mo", "pro": "$599/mo", "enterprise": "Custom"},
    "icon": "📄", "popular": True, "category": "ai", "industry": "Technology"
  },
  {
    "id": "retail-tech-personalization-engine",
    "title": "AI Retail Personalization Engine",
    "description": "Hyper-personalized shopping experiences. Product recommendations, dynamic pricing, customer segmentation, and omnichannel orchestration.",
    "features": ["Real-time product recommendations", "Dynamic pricing optimization", "Customer segmentation", "Omnichannel orchestration", "A/B testing framework", "Integration with Shopify, WooCommerce", "Inventory-aware recommendations", "Analytics dashboard"],
    "benefits": ["Increase conversion 35%", "Boost average order value", "Personalize at scale", "Unify online and offline"],
    "pricing": {"basic": "$399/mo", "pro": "$1,199/mo", "enterprise": "Custom"},
    "icon": "🛒", "popular": False, "category": "retail-tech", "industry": "Retail"
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
    ts = f.read()

def make_entry(svc):
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
    contactInfo: {{website:'/services/{svc['id']}', email:'kleber@ziontechgroup.com', phone:'+1 302 464 0950'}},
    icon: '{svc['icon']}', href: '/services/{svc['id']}', popular: {str(svc['popular']).lower()}, category: '{svc['category']}', industry: '{svc['industry']}',
  }}"""

# Map service category -> existing TS array name
cat_to_array = {
    'ai': 'additionalNewAiServices',
    'micro-saas': 'additionalNewMicroSaaS',
    'it': 'additionalNewItServices',
    'security': 'additionalNewSecurityServices',
    'cloud': 'additionalNewCloudServices',
    'data': 'additionalNewDataServices',
    'automation': 'newAutomationServices',
    'cybersecurity': 'additionalNewSecurityServices',
    'fintech': 'additionalNewDataServices',
    'healthcare-it': 'additionalNewItServices',
    'edtech': 'additionalNewItServices',
    'agritech': 'additionalNewDataServices',
    'energy-tech': 'additionalNewCloudServices',
    'logistics-tech': 'newAutomationServices',
    'retail-tech': 'additionalNewMicroSaaS',
}

by_array = {}
for s in NEW_SERVICES:
    arr = cat_to_array.get(s['category'], 'additionalNewAiServices')
    if arr not in by_array:
        by_array[arr] = []
    by_array[arr].append(s)

for array_name, services in by_array.items():
    entries = ',\n'.join(make_entry(s) for s in services)
    pattern = rf"(export const {array_name}: Service\[\] = \[.*?)\];"
    match = re.search(pattern, ts, re.DOTALL)
    if match:
        old_close = match.group(0)
        existing_block = match.group(1)
        if existing_block.rstrip().endswith(']'):
            new_close = f"{existing_block}\n{entries}\n];"
        else:
            new_close = f"{existing_block},\n{entries}\n];"
        ts = ts.replace(old_close, new_close, 1)
        print(f"  Added {len(services)} entries to {array_name}")
    else:
        print(f"  WARNING: Could not find {array_name}")

# Fix lone commas at end of file
lines = ts.split('\n')
new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    if line.strip() == ',' and i > 19000 and i > 0 and i < len(lines) - 1:
        prev = lines[i-1].strip()
        nxt = lines[i+1].strip()
        if prev.endswith('},') and nxt.startswith('{'):
            i += 1
            continue
    new_lines.append(line)
    i += 1

with open(TS_PATH, 'w') as f:
    f.write('\n'.join(new_lines))

print(f"TS updated with {len(NEW_SERVICES)} Wave 181 services")
