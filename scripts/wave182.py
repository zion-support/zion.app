#!/usr/bin/env python3
"""Wave 182: Add 10 new services — construction-tech, manufacturing-tech, it-services, ai-services, + more"""
import json, re

JSON_PATH = 'app/data/servicesData.json'
TS_PATH = 'app/data/servicesData.ts'

NEW_SERVICES = [
  {
    "id": "construction-tech-bim-management",
    "title": "BIM Management Platform for Construction",
    "description": "Building Information Modeling management for construction teams. 3D model collaboration, clash detection, version control, and field-to-office synchronization.",
    "features": ["3D BIM model collaboration", "Automated clash detection", "Version control and audit trail", "Field-to-office sync", "Progress tracking with 4D simulation", "Integration with Autodesk, Trimble", "RFIs and submittal management", "Safety compliance tracking"],
    "benefits": ["Reduce rework by 30%", "Detect clashes before construction", "Real-time field progress", "Single source of truth for all teams"],
    "pricing": {"basic": "$499/mo", "pro": "$1,499/mo", "enterprise": "Custom"},
    "icon": "🏗️", "popular": True, "category": "construction-tech", "industry": "Construction"
  },
  {
    "id": "manufacturing-tech-digital-twin",
    "title": "Digital Twin for Manufacturing",
    "description": "Create digital twins of manufacturing assets. Real-time simulation, predictive maintenance, process optimization, and what-if scenario modeling.",
    "features": ["Real-time asset digital twins", "Predictive maintenance simulation", "Process optimization", "What-if scenario modeling", "Integration with IoT sensors", "3D visualization integration", "OEE tracking and improvement", "Integration with Siemens, GE Digital"],
    "benefits": ["Reduce unplanned downtime 45%", "Optimize processes digitally", "Predict failures before they occur", "Improve OEE by 20%"],
    "pricing": {"basic": "$2,999/mo", "pro": "$8,999/mo", "enterprise": "Custom"},
    "icon": "🔄", "popular": True, "category": "manufacturing-tech", "industry": "Manufacturing"
  },
  {
    "id": "ai-services-model-observability",
    "title": "AI Model Observability Platform",
    "description": "Monitor AI models in production. Drift detection, performance tracking, bias monitoring, and alerting for ML pipelines.",
    "features": ["Model drift detection", "Performance tracking and alerting", "Bias and fairness monitoring", "A/B test result analysis", "Feature importance tracking", "Integration with MLflow, Weights & Biases", "Automated retraining triggers", "Model explainability dashboard"],
    "benefits": ["Detect model degradation early", "Ensure fair and unbiased models", "Automate model retraining", "Full production visibility"],
    "pricing": {"basic": "$399/mo", "pro": "$1,199/mo", "enterprise": "Custom"},
    "icon": "👁️", "popular": True, "category": "ai-services", "industry": "Technology"
  },
  {
    "id": "it-services-asset-management",
    "title": "IT Asset Management Platform",
    "description": "Comprehensive IT asset lifecycle management. Hardware and software tracking, license compliance, procurement workflows, and disposal management.",
    "features": ["Hardware asset tracking", "Software license management", "Procurement workflows", "Auto-discovery of network assets", "Compliance and audit reports", "Integration with ServiceNow, Jira", "Lifecycle cost analysis", "Disposal and recycling tracking"],
    "benefits": ["Eliminate license violations", "Reduce IT spend by 20%", "Full asset visibility", "Automated compliance reporting"],
    "pricing": {"basic": "$199/mo", "pro": "$599/mo", "enterprise": "Custom"},
    "icon": "💻", "popular": False, "category": "it-services", "industry": "Technology"
  },
  {
    "id": "agritech-irrigation-optimization",
    "title": "AI Smart Irrigation Optimization",
    "description": "AI-powered irrigation control. Soil moisture monitoring, weather-adaptive scheduling, water usage optimization, and crop-specific recommendations.",
    "features": ["Soil moisture sensor integration", "Weather-adaptive scheduling", "Water usage optimization", "Crop-specific recommendations", "Remote valve control", "Integration with Rainbird, Hunter", "Water cost tracking", "Drought response automation"],
    "benefits": ["Reduce water usage 35%", "Lower irrigation costs", "Improve crop yields", "Remote monitoring and control"],
    "pricing": {"basic": "$99/mo", "pro": "$299/mo", "enterprise": "$899/mo"},
    "icon": "💧", "popular": False, "category": "agritech", "industry": "Agriculture"
  },
  {
    "id": "ai-services-rag-as-a-service",
    "title": "RAG as a Service — Knowledge Retrieval API",
    "description": "Plug-and-play Retrieval Augmented Generation. Upload documents, get a chatbot API. No ML team required.",
    "features": ["Document upload and indexing", "Automatic chunking and embedding", "REST and WebSocket APIs", "Custom knowledge bases", "Source citation in responses", "Integration with OpenAI, Claude, Llama", "Usage analytics", "GDPR-compliant data handling"],
    "benefits": ["Build AI chatbots in minutes", "No ML expertise required", "Source-grounded responses", "Scale without infrastructure"],
    "pricing": {"basic": "$149/mo", "pro": "$449/mo", "enterprise": "$1,499/mo"},
    "icon": "🧠", "popular": True, "category": "ai-services", "industry": "Technology"
  },
  {
    "id": "it-services-saml-sso",
    "title": "SAML/SSO Identity Provider",
    "description": "Enterprise Single Sign-On and identity management. SAML, OIDC, MFA, and directory integration for seamless access control.",
    "features": ["SAML 2.0 and OIDC support", "Multi-factor authentication", "Directory sync (LDAP, AD, SCIM)", "Conditional access policies", "User provisioning and deprovisioning", "Integration with Okta, Azure AD, Google Workspace", "Session management", "Compliance reporting (SOC2, HIPAA)"],
    "benefits": ["One login for all apps", "Reduce password tickets 80%", "Enforce MFA everywhere", "Meet compliance requirements"],
    "pricing": {"basic": "$299/mo", "pro": "$899/mo", "enterprise": "Custom"},
    "icon": "🔐", "popular": False, "category": "it-services", "industry": "Technology"
  },
  {
    "id": "construction-tech-safety-monitoring",
    "title": "AI Construction Safety Monitoring",
    "description": "AI-powered construction site safety. PPE detection, hazard identification, incident prediction, and compliance reporting with computer vision.",
    "features": ["PPE detection (hard hat, vest, gloves)", "Hazard zone monitoring", "Incident prediction", "Integration with security cameras", "Real-time alerts to safety officers", "Compliance reporting", "Worker proximity alerts", "Integration with Procore, Autodesk Build"],
    "benefits": ["Reduce safety incidents 50%", "Automated compliance", "Real-time hazard alerts", "Protect workers proactively"],
    "pricing": {"basic": "$599/mo", "pro": "$1,799/mo", "enterprise": "Custom"},
    "icon": "🦺", "popular": True, "category": "construction-tech", "industry": "Construction"
  },
  {
    "id": "manufacturing-tech-quality-vision",
    "title": "Computer Vision Quality Inspection",
    "description": "AI visual inspection for manufacturing lines. Defect detection, measurement verification, and pass/fail classification at production speed.",
    "features": ["Real-time defect detection", "Dimensional measurement", "Pass/fail classification", "Integration with cameras and PLCs", "Custom defect model training", "Production line dashboard", "Defect trend analysis", "Integration with Cognex, Keyence"],
    "benefits": ["Inspect 100% of production", "Detect defects humans miss", "Reduce scrap and rework", "Measure at production speed"],
    "pricing": {"basic": "$1,999/mo", "pro": "$5,999/mo", "enterprise": "Custom"},
    "icon": "🔍", "popular": False, "category": "manufacturing-tech", "industry": "Manufacturing"
  },
  {
    "id": "agritech-greenhouse-automation",
    "title": "AI Greenhouse Climate Control",
    "description": "AI-powered greenhouse automation. Climate optimization, lighting control, CO2 management, and yield prediction for controlled environment agriculture.",
    "features": ["Temperature and humidity optimization", "Lighting schedule automation", "CO2 level management", "Yield prediction models", "Energy cost optimization", "Integration with Priva, Argus", "Disease risk alerts", "Harvest timing recommendations"],
    "benefits": ["Increase yield 25%", "Reduce energy costs 30%", "Optimize growing conditions 24/7", "Predict harvest dates accurately"],
    "pricing": {"basic": "$199/mo", "pro": "$599/mo", "enterprise": "$1,499/mo"},
    "icon": "🏠", "popular": False, "category": "agritech", "industry": "Agriculture"
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

# Map to existing TS arrays
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
    'construction-tech': 'additionalNewConstructionTechServices',
    'manufacturing-tech': 'additionalNewManufacturingTechServices',
    'it-services': 'additionalNewItServicesServices',
    'ai-services': 'additionalNewAiServicesServices',
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
        block = match.group(1)
        if block.rstrip().endswith(']'):
            new_close = f"{block}\n{entries}\n];"
        else:
            new_close = f"{block},\n{entries}\n];"
        ts = ts.replace(old_close, new_close, 1)
        print(f"  Added {len(services)} to {array_name}")
    else:
        # Array doesn't exist — create it before allServices
        print(f"  WARNING: {array_name} not found, creating new")
        new_array = f"\nexport const {array_name}: Service[] = [\n{entries}\n];\n"
        # Insert before allServices
        ts = ts.replace(
            "export const allServices: Service[] = [",
            new_array + "export const allServices: Service[] = ["
        )
        # Add to allServices spread
        ts = ts.replace(
            "].filter((s): s is Service => s !== undefined);",
            f"  ...{array_name},\n].filter((s): s is Service => s !== undefined);"
        )

# Fix lone commas
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

print(f"TS updated with {len(NEW_SERVICES)} Wave 182 services")
