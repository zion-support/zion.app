#!/usr/bin/env python3
"""Wave 177: Add 10 new services"""
import json

JSON_PATH = 'app/data/servicesData.json'
TS_PATH = 'app/data/servicesData.ts'

NEW_SERVICES = [
  {
    "id": "ai-predictive-maintenance-iiot",
    "title": "AI Predictive Maintenance for IIoT",
    "description": "Predict industrial equipment failures before they happen using IIoT sensor data and ML. Reduce unplanned downtime and extend asset life across manufacturing, energy, and utilities.",
    "features": ["Vibration analysis", "Thermal anomaly detection", "Oil analysis prediction", "Remaining useful life estimation", "Integration with PTC ThingWorx, Siemens MindSphere", "Work order auto-generation", "Spare parts forecasting", "Maintenance scheduling optimization"],
    "benefits": ["Reduce unplanned downtime by 50%", "Extend asset life by 20%", "Lower maintenance costs", "Improve safety compliance"],
    "pricing": {"basic": "$1,999/mo", "pro": "$5,999/mo", "enterprise": "Custom"},
    "icon": "🔧", "popular": True, "category": "ai", "industry": "Manufacturing"
  },
  {
    "id": "ai-cybersecurity-threat-hunting",
    "title": "AI Cybersecurity Threat Hunting Platform",
    "description": "Proactively hunt for advanced threats using AI-driven behavioral analytics, anomaly detection, and automated investigation playbooks across endpoints, network, and cloud.",
    "features": ["Behavioral analytics (UEBA)", "Network traffic analysis", "Endpoint detection and response", "Automated threat investigation", "MITRE ATT&CK mapping", "Integration with Splunk, Sentinel, CrowdStrike", "Threat intelligence correlation", "Incident timeline reconstruction"],
    "benefits": ["Detect threats 10x faster", "Reduce dwell time to hours", "Automate Tier-1 investigation", "Meet SOC 2 and ISO 27001 requirements"],
    "pricing": {"basic": "$2,499/mo", "pro": "$7,499/mo", "enterprise": "Custom"},
    "icon": "🛡️", "popular": True, "category": "ai", "industry": "Cybersecurity"
  },
  {
    "id": "micro-saas-customer-health-score",
    "title": "HealthScore — Customer Health Scoring",
    "description": "Real-time customer health scoring for SaaS. Combine product usage, support tickets, NPS, and billing data into a single health score with automated playbooks for at-risk accounts.",
    "features": ["Composite health scoring", "Product usage tracking", "Support ticket sentiment analysis", "NPS and CSAT integration", "Automated playbooks for at-risk accounts", "Integration with Salesforce, HubSpot, Intercom", "Churn prediction alerts", "Executive health dashboards"],
    "benefits": ["Reduce churn by 25%", "Prioritize CSM efforts", "Early warning for at-risk accounts", "Data-driven retention strategy"],
    "pricing": {"basic": "$79/mo", "pro": "$249/mo", "enterprise": "$599/mo"},
    "icon": "💓", "popular": False, "category": "micro-saas", "industry": "SaaS"
  },
  {
    "id": "micro-saas-internal-wiki",
    "title": "WikiBase — Internal Knowledge Wiki",
    "description": "Modern internal wiki with AI-powered search, auto-documentation, and team collaboration. Replace Confluence with a faster, smarter knowledge base.",
    "features": ["AI-powered search and answers", "Auto-documentation from code", "Real-time collaboration", "Version history and rollback", "Integration with Slack, GitHub, Jira", "Custom templates and workflows", "Access control and permissions", "Analytics on knowledge gaps"],
    "benefits": ["Find answers 5x faster", "Reduce onboarding time", "Keep documentation alive", "Single source of truth"],
    "pricing": {"basic": "$19/mo", "pro": "$59/mo", "enterprise": "$199/mo"},
    "icon": "📚", "popular": False, "category": "micro-saas", "industry": "Productivity"
  },
  {
    "id": "it-enterprise-architecture",
    "title": "Enterprise Architecture as a Service",
    "description": "Strategic enterprise architecture consulting and tooling. Technology roadmap, application portfolio rationalization, and target architecture design for digital transformation.",
    "features": ["Application portfolio assessment", "Technology roadmap development", "Target architecture design", "Integration architecture planning", "TOGAF and ArchiMate frameworks", "Cloud readiness assessment", "Cost-benefit analysis", "Executive presentation decks"],
    "benefits": ["Align IT with business strategy", "Reduce technical debt", "Optimize technology spend", "Accelerate digital transformation"],
    "pricing": {"basic": "$4,999/mo", "pro": "$14,999/mo", "enterprise": "Custom"},
    "icon": "🏛️", "popular": False, "category": "it", "industry": "Technology"
  },
  {
    "id": "security-zero-trust-architecture",
    "title": "Zero Trust Architecture Implementation",
    "description": "End-to-end Zero Trust implementation. Identity verification, micro-segmentation, continuous monitoring, and policy enforcement across hybrid cloud and on-prem.",
    "features": ["Identity-centric security", "Micro-segmentation design", "Continuous verification", "Policy engine deployment", "Integration with Zscaler, Palo Alto, Cloudflare", "Device trust scoring", "Least-privilege access automation", "Compliance mapping (NIST 800-207)"],
    "benefits": ["Eliminate implicit trust", "Reduce attack surface by 80%", "Meet compliance requirements", "Secure hybrid workforce"],
    "pricing": {"basic": "$3,999/mo", "pro": "$11,999/mo", "enterprise": "Custom"},
    "icon": "🔒", "popular": False, "category": "security", "industry": "Technology"
  },
  {
    "id": "cloud-finops-platform",
    "title": "Cloud FinOps Platform",
    "description": "Comprehensive FinOps platform for cloud cost management. Showback/chargeback, reserved instance optimization, waste detection, and unit economics tracking.",
    "features": ["Multi-cloud cost visibility", "Showback and chargeback", "RI and Savings Plans optimization", "Waste detection and auto-remediation", "Unit economics (cost per customer, per feature)", "Integration with AWS, GCP, Azure billing", "Budget alerts and forecasting", "Executive cost dashboards"],
    "benefits": ["Reduce cloud spend by 30%", "Eliminate waste automatically", "Business-aligned cost decisions", "Accurate forecasting"],
    "pricing": {"basic": "$499/mo", "pro": "$1,499/mo", "enterprise": "Custom"},
    "icon": "💰", "popular": True, "category": "cloud", "industry": "Technology"
  },
  {
    "id": "data-realtime-streaming-platform",
    "title": "Real-Time Data Streaming Platform",
    "description": "Managed real-time data streaming with Apache Kafka, Flink, and change data capture. Ingest, process, and serve data in milliseconds for event-driven architectures.",
    "features": ["Managed Kafka clusters", "Stream processing with Flink", "Change data capture (Debezium)", "Schema registry and evolution", "Exactly-once processing guarantees", "Integration with 100+ sources and sinks", "Monitoring and alerting", "Auto-scaling"],
    "benefits": ["Process data in milliseconds", "Eliminate batch delays", "Event-driven architecture made easy", "Scale without ops burden"],
    "pricing": {"basic": "$999/mo", "pro": "$2,999/mo", "enterprise": "Custom"},
    "icon": "⚡", "popular": False, "category": "data", "industry": "Technology"
  },
  {
    "id": "ai-digital-twin-simulation",
    "title": "AI Digital Twin & Simulation Platform",
    "description": "Create and run digital twins of physical assets, processes, and entire facilities. AI-powered simulation for what-if analysis, optimization, and predictive planning.",
    "features": ["3D asset modeling", "Physics-based simulation", "AI-powered what-if analysis", "Real-time sensor integration", "Scenario comparison and optimization", "Integration with Unity, NVIDIA Omniverse", "Predictive planning dashboards", "API for custom integrations"],
    "benefits": ["Optimize operations without physical risk", "Test changes in simulation first", "Predict outcomes with AI accuracy", "Reduce planning cycles by 60%"],
    "pricing": {"basic": "$2,999/mo", "pro": "$8,999/mo", "enterprise": "Custom"},
    "icon": "🪞", "popular": False, "category": "ai", "industry": "Manufacturing"
  },
  {
    "id": "automation-intelligent-document-processing",
    "title": "Intelligent Document Processing (IDP)",
    "description": "AI-powered document processing for invoices, contracts, forms, and claims. OCR, NLP, and ML combined for touchless document workflows.",
    "features": ["Multi-format OCR (PDF, images, scans)", "NLP entity extraction", "Classification and routing", "Validation and exception handling", "Integration with SAP, Oracle, Workday", "Human-in-the-loop review", "Audit trail and compliance", "Custom model training"],
    "benefits": ["Process documents 10x faster", "Reduce manual data entry by 90%", "Improve accuracy and compliance", "Scale without adding headcount"],
    "pricing": {"basic": "$599/mo", "pro": "$1,799/mo", "enterprise": "Custom"},
    "icon": "📄", "popular": False, "category": "automation", "industry": "Technology"
  },
]

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

# Also add to TS
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

by_cat = {}
for s in NEW_SERVICES:
    cat = s['category']
    if cat not in by_cat:
        by_cat[cat] = []
    by_cat[cat].append(s)

cat_to_array = {
    'ai': 'additionalNewAiServices',
    'micro-saas': 'additionalNewMicroSaaS',
    'it': 'additionalNewItServices',
    'security': 'additionalNewSecurityServices',
    'cloud': 'additionalNewCloudServices',
    'data': 'additionalNewDataServices',
    'automation': 'additionalNewAutomationServices',
}

for cat, array_name in cat_to_array.items():
    if cat not in by_cat:
        continue
    entries = ',\n'.join(make_entry(s) for s in by_cat[cat])
    import re as re2
    pattern = rf"(export const {array_name}: Service\[\] = \[.*?)\];"
    match = re2.search(pattern, ts, re2.DOTALL)
    if match:
        old_close = match.group(0)
        existing_block = match.group(1)
        if existing_block.rstrip().endswith(']'):
            new_close = f"{existing_block}\n{entries}\n];"
        else:
            new_close = f"{existing_block},\n{entries}\n];"
        ts = ts.replace(old_close, new_close, 1)
        print(f"  Added {len(by_cat[cat])} entries to {array_name}")
    else:
        print(f"  WARNING: Could not find {array_name}")

# Fix any lone commas we introduced
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

print(f"TS updated with {len(NEW_SERVICES)} Wave 177 services")
