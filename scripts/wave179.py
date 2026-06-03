#!/usr/bin/env python3
"""Wave 179: Add 10 new services — emerging tech niches"""
import json, re

JSON_PATH = 'app/data/servicesData.json'
TS_PATH = 'app/data/servicesData.ts'

NEW_SERVICES = [
  {
    "id": "ai-agent-orchestration-platform",
    "title": "AI Agent Orchestration Platform",
    "description": "Build, deploy, and manage autonomous AI agents. Multi-agent workflows, tool integration, memory management, and human-in-the-loop controls.",
    "features": ["Visual agent builder", "Multi-agent coordination", "Tool and API integration", "Memory and context management", "Human-in-the-loop checkpoints", "Integration with LangChain, CrewAI", "Monitoring and tracing", "Version control for agents"],
    "benefits": ["Build agentic apps 10x faster", "Coordinate complex workflows", "Safe autonomous operation", "Full observability"],
    "pricing": {"basic": "$299/mo", "pro": "$899/mo", "enterprise": "Custom"},
    "icon": "🎭", "popular": True, "category": "ai", "industry": "Technology"
  },
  {
    "id": "ai-climate-risk-analytics",
    "title": "AI Climate Risk Analytics",
    "description": "Assess climate-related financial and operational risks using AI. Physical risk modeling, transition risk analysis, and TCFD-compliant reporting.",
    "features": ["Physical risk modeling (flood, fire, storm)", "Transition risk analysis", "Carbon footprint forecasting", "TCFD and ISSB compliance reporting", "Integration with geospatial data", "Scenario analysis (1.5°C, 2°C, 3°C)", "Portfolio risk scoring", "Executive dashboards"],
    "benefits": ["Meet climate disclosure requirements", "Protect assets from physical risks", "Identify transition opportunities", "Investor-grade climate data"],
    "pricing": {"basic": "$1,999/mo", "pro": "$5,999/mo", "enterprise": "Custom"},
    "icon": "🌡️", "popular": False, "category": "ai", "industry": "Finance"
  },
  {
    "id": "micro-saas-churn-prediction",
    "title": "ChurnGuard — Churn Prediction & Prevention",
    "description": "AI-powered churn prediction for SaaS. Identify at-risk accounts, automate retention playbooks, and track health scores in real-time.",
    "features": ["ML churn prediction", "Health score automation", "Retention playbook engine", "Integration with Stripe, HubSpot, Intercom", "Cohort analysis", "Revenue impact forecasting", "Automated outreach triggers", "Executive churn dashboards"],
    "benefits": ["Reduce churn by 30%", "Automate retention efforts", "Prioritize at-risk accounts", "Increase LTV"],
    "pricing": {"basic": "$99/mo", "pro": "$299/mo", "enterprise": "$799/mo"},
    "icon": "🛡️", "popular": False, "category": "micro-saas", "industry": "SaaS"
  },
  {
    "id": "micro-saas-subscription-analytics",
    "title": "SubMetrics — Subscription Analytics",
    "description": "SaaS subscription analytics and forecasting. MRR/ARR tracking, cohort analysis, expansion revenue, and churn waterfall with AI-powered insights.",
    "features": ["MRR/ARR tracking and forecasting", "Cohort analysis", "Expansion and contraction tracking", "Churn waterfall analysis", "Integration with Stripe, Recurly, Chargebee", "Benchmarking against industry", "Revenue recognition", "Board-ready reports"],
    "benefits": ["Understand revenue drivers", "Accurate forecasting", "Investor-ready metrics", "Data-driven growth decisions"],
    "pricing": {"basic": "$49/mo", "pro": "$149/mo", "enterprise": "$399/mo"},
    "icon": "📈", "popular": False, "category": "micro-saas", "industry": "SaaS"
  },
  {
    "id": "it-digital-experience-monitoring",
    "title": "Digital Experience Monitoring (DEM)",
    "description": "Monitor end-user experience across devices, networks, and applications. Synthetic monitoring, real user monitoring, and AI-powered root cause analysis.",
    "features": ["Synthetic monitoring", "Real user monitoring (RUM)", "AI root cause analysis", "Network path analysis", "Integration with Datadog, New Relic", "Mobile app performance", "SLA tracking and alerting", "Executive experience dashboards"],
    "benefits": ["Detect issues before users complain", "Reduce MTTR by 60%", "Optimize user experience", "Meet SLA commitments"],
    "pricing": {"basic": "$399/mo", "pro": "$1,199/mo", "enterprise": "Custom"},
    "icon": "👁️", "popular": False, "category": "it", "industry": "Technology"
  },
  {
    "id": "security-breach-simulation",
    "title": "Breach Simulation & Attack Surface Management",
    "description": "Continuously simulate attacks and map your attack surface. Automated red teaming, exposure prioritization, and remediation guidance.",
    "features": ["Automated breach simulation", "Attack surface mapping", "Continuous red teaming", "Exposure prioritization", "Integration with CrowdStrike, SentinelOne", "Remediation guidance", "Compliance mapping", "Executive risk reports"],
    "benefits": ["Find vulnerabilities before attackers", "Prioritize remediation", "Continuous security validation", "Board-ready risk reports"],
    "pricing": {"basic": "$1,499/mo", "pro": "$4,499/mo", "enterprise": "Custom"},
    "icon": "🎯", "popular": False, "category": "security", "industry": "Technology"
  },
  {
    "id": "cloud-sovereign-cloud",
    "title": "Sovereign Cloud Deployment",
    "description": "Deploy and manage sovereign cloud infrastructure. Data residency compliance, local cloud providers, and hybrid architectures for regulated industries.",
    "features": ["Data residency compliance", "Local cloud provider integration", "Hybrid architecture design", "Compliance automation (GDPR, LGPD, POPIA)", "Integration with local providers", "Encryption and key management", "Audit and reporting", "Migration from public cloud"],
    "benefits": ["Meet data sovereignty laws", "Avoid regulatory penalties", "Local performance optimization", "Hybrid flexibility"],
    "pricing": {"basic": "$2,999/mo", "pro": "$8,999/mo", "enterprise": "Custom"},
    "icon": "🏛️", "popular": False, "category": "cloud", "industry": "Technology"
  },
  {
    "id": "data-data-contracts-enforcement",
    "title": "Data Contracts Enforcement Engine",
    "description": "Automated data contract enforcement across your data mesh. Schema validation, quality checks, SLA monitoring, and breach notifications.",
    "features": ["Schema validation and evolution", "Quality rule enforcement", "SLA monitoring and alerting", "Data contract versioning", "Integration with dbt, Great Expectations", "Breach notifications", "Lineage tracking", "Owner accountability"],
    "benefits": ["Ensure data quality at scale", "Automate governance", "Reduce data incidents", "Enable data mesh architecture"],
    "pricing": {"basic": "$599/mo", "pro": "$1,799/mo", "enterprise": "Custom"},
    "icon": "📋", "popular": False, "category": "data", "industry": "Technology"
  },
  {
    "id": "ai-neuromorphic-computing",
    "title": "Neuromorphic Computing Platform",
    "description": "Leverage neuromorphic hardware for ultra-low-power AI inference. Spiking neural networks, edge AI, and brain-inspired computing for IoT and robotics.",
    "features": ["Spiking neural network development", "Neuromorphic hardware integration", "Ultra-low-power inference", "Edge AI deployment", "Integration with Intel Loihi, IBM TrueNorth", "Simulation tools", "Model conversion from traditional NN", "Research collaboration platform"],
    "benefits": ["100x lower power consumption", "Real-time edge inference", "Brain-inspired computing", "Next-gen AI hardware"],
    "pricing": {"basic": "Custom", "pro": "Custom", "enterprise": "Custom"},
    "icon": "🧠", "popular": False, "category": "ai", "industry": "Technology"
  },
  {
    "id": "automation-governance-risk-compliance",
    "title": "GRC Automation Platform",
    "description": "Automate governance, risk, and compliance. Policy management, risk assessment, control testing, and regulatory reporting in a single platform.",
    "features": ["Policy management and distribution", "Risk assessment automation", "Control testing and evidence collection", "Regulatory reporting (SOX, GDPR, HIPAA)", "Integration with ServiceNow, SAP", "Audit workflow management", "Risk heat maps", "Board reporting dashboards"],
    "benefits": ["Reduce compliance costs by 50%", "Automate audit preparation", "Real-time risk visibility", "Meet regulatory deadlines"],
    "pricing": {"basic": "$999/mo", "pro": "$2,999/mo", "enterprise": "Custom"},
    "icon": "⚖️", "popular": False, "category": "automation", "industry": "Technology"
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
    'automation': 'newAutomationServices',
}

for cat, array_name in cat_to_array.items():
    if cat not in by_cat:
        continue
    entries = ',\n'.join(make_entry(s) for s in by_cat[cat])
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
        print(f"  Added {len(by_cat[cat])} entries to {array_name}")
    else:
        print(f"  WARNING: Could not find {array_name}")

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

print(f"TS updated with {len(NEW_SERVICES)} Wave 179 services")
