#!/usr/bin/env python3
"""Wave 154 - 15 new real, useful, diversified services."""
import json

SERVICES_JSON = 'app/data/servicesData.json'
SERVICES_TS = 'app/data/servicesData.ts'
CONTACT = {"email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950", "address": "364 E Main St STE 1008, Middletown, DE 19709"}

NEW_SERVICES = [
    # ===== MICRO-SAAS (5) =====
    {
        "id": "micro-saas-ai-wellness-coach",
        "title": "AI Employee Wellness & Mental Health Platform",
        "category": "ai", "industry": "hr-tech", "icon": "🧘", "popular": True,
        "pricing": {"basic": "$12/employee/mo", "pro": "$24/employee/mo", "enterprise": "Custom"},
        "description": "AI-powered employee wellness platform with personalized mental health support, burnout prediction, meditation guidance, and anonymous counseling access. HIPAA compliant.",
        "features": ["AI burnout prediction from work patterns", "Personalized meditation and mindfulness", "Anonymous AI therapy chatbot", "EAP integration and referral tracking", "Manager dashboards (aggregated, anonymous)", "Crisis detection and escalation", "HIPAA/GDPR compliant infrastructure", "Integration with Slack, Teams, Workday"],
        "benefits": ["Reduce burnout by 40%", "Improve employee retention by 25%", "Decrease absenteeism by 30%", "Scale mental health support company-wide"]
    },
    {
        "id": "micro-saas-ai-payment-reconciliation",
        "title": "AI Payment Reconciliation & Cash Application",
        "category": "ai", "industry": "finance", "icon": "💳", "popular": False,
        "pricing": {"basic": "$399/mo", "pro": "$999/mo", "enterprise": "Custom"},
        "description": "Automate payment reconciliation with AI that matches payments to invoices across banks, payment gateways, and ERPs. Reduce reconciliation time by 95%.",
        "features": ["Multi-bank and gateway aggregation", "AI auto-matching to invoices", "Exception handling with smart suggestions", "Integration with SAP, NetSuite, QuickBooks", "Real-time reconciliation dashboard", "Audit trail and compliance reporting", "Cash application automation", "Dispute identification and routing"],
        "benefits": ["95% faster reconciliation", "Reduce unmatched items by 90%", "Improve cash flow visibility", "Eliminate manual matching errors"]
    },
    {
        "id": "micro-saas-ai-facility-management",
        "title": "AI Facility Management & Space Optimization",
        "category": "ai", "industry": "real-estate", "icon": "🏢", "popular": False,
        "pricing": {"basic": "$499/mo", "pro": "$1,499/mo", "enterprise": "Custom"},
        "description": "AI-powered facility management with occupancy sensors, predictive maintenance, and space optimization. Reduce facility costs by 25% while improving employee experience.",
        "features": ["Real-time occupancy tracking and heatmaps", "AI space utilization optimization", "Predictive maintenance for HVAC, elevators", "Workplace booking (desks, rooms, parking)", "Energy management and cost allocation", "Integration with IoT sensors and BMS", "Mobile app for employees and facility teams", "Spend analytics and vendor management"],
        "benefits": ["Reduce facility costs by 25%", "Optimize office space utilization to 85%", "Prevent equipment failures with AI predictions", "Improve workplace experience with smart booking"]
    },
    {
        "id": "micro-saas-ai-talent-marketplace",
        "title": "AI Talent Marketplace & Internal Mobility Platform",
        "category": "ai", "industry": "hr-tech", "icon": "🔗", "popular": False,
        "pricing": {"basic": "$19/employee/mo", "pro": "$39/employee/mo", "enterprise": "Custom"},
        "description": "AI-powered internal talent marketplace that matches employees to projects, mentors, and gigs based on skills, interests, and career goals. Increase internal mobility by 300%.",
        "features": ["AI skills inference from work history", "Project and gig matching algorithm", "Mentor-mentee matching", "Career path recommendations", "Learning recommendations matched to goals", "Integration with Workday, SAP SuccessFactors", "Analytics on internal mobility and retention", "Diversity-aware matching algorithms"],
        "benefits": ["300% increase in internal mobility", "Reduce external hiring costs by 40%", "Improve retention by matching growth opportunities", "Build skills-based organization"]
    },
    {
        "id": "micro-saas-ai-sustainability-tracker",
        "title": "AI Sustainability & ESG Compliance Tracker",
        "category": "ai", "industry": "energy", "icon": "🌱", "popular": True,
        "pricing": {"basic": "$999/mo", "pro": "$2,999/mo", "enterprise": "Custom"},
        "description": "AI-powered sustainability tracking and ESG compliance platform. Automate data collection, calculate carbon footprint, and generate reports for GRI, CDP, TCFD, and SASB frameworks.",
        "features": "Automated carbon footprint calculation,Scope 1/2/3 emissions tracking,ESG framework mapping (GRI, CDP, TCFD, SASB),Supply chain sustainability scoring,AI-powered reduction recommendations,Automated ESG report generation,Benchmarking against industry peers,Integration with ERP and utility providers".split(","),
        "benefits": ["Reduce ESG reporting time by 80%", "Identify carbon reduction opportunities", "Meet investor and regulatory ESG requirements", "Benchmark sustainability performance"]
    },
    # ===== IT SERVICES (5) =====
    {
        "id": "it-cloud-migration",
        "title": "IT Cloud Migration & Modernization Factory",
        "category": "it", "industry": "technology", "icon": "☁️", "popular": True,
        "pricing": {"basic": "$10,000/mo", "pro": "$25,000/mo", "enterprise": "Custom"},
        "description": "End-to-end cloud migration and application modernization. Rehost, re-platform, or refactor workloads to AWS, Azure, or GCP with zero downtime and automated testing.",
        "features": ["Cloud readiness assessment and roadmap", "Rehost, re-platform, refactor strategies", "Database migration with zero downtime", "Containerization and Kubernetes migration", "Automated testing and validation", "Cost optimization and FinOps", "Security and compliance validation", "Post-migration support and optimization"],
        "benefits": ["Migrate in half the time with automation", "Reduce cloud costs by 30% from day one", "Zero downtime during migration", "Modernize legacy apps for cloud-native"]
    },
    {
        "id": "it-digital-workplace",
        "title": "IT Digital Workplace & Employee Experience",
        "category": "it", "industry": "technology", "icon": "💼", "popular": True,
        "pricing": {"basic": "$8/user/mo", "pro": "$15/user/mo", "enterprise": "Custom"},
        "description": "Design and implement the modern digital workplace. From Microsoft 365 and Google Workspace to intranet, collaboration tools, and employee experience platforms.",
        "features": ["Microsoft 365 / Google Workspace deployment", "Intranet and employee portal development", "Collaboration tool selection and rollout", "Identity and access management", "Endpoint management and security", "Employee experience analytics", "Change management and training", "Integration with HR, ITSM, and business apps"],
        "benefits": ["Increase employee productivity by 25%", "Reduce IT support tickets by 40%", "Improve employee satisfaction scores", "Enable seamless hybrid work"]
    },
    {
        "id": "it-data-engineering",
        "title": "IT Data Engineering & Pipeline Development",
        "category": "it", "industry": "technology", "icon": "🔧", "popular": False,
        "pricing": {"basic": "$5,000/mo", "pro": "$12,000/mo", "enterprise": "Custom"},
        "description": "Build scalable data pipelines and engineering solutions. From batch ETL to real-time streaming, with data quality, governance, and observability built in.",
        "features": ["Batch and real-time ETL/ELT pipeline development", "Data quality framework and monitoring", "Data catalog and lineage implementation", "Streaming data with Kafka, Spark, Flink", "Data mesh and domain-oriented architecture", "Integration with Snowflake, Databricks, BigQuery", "Data pipeline observability and alerting", "Cost optimization for data infrastructure"],
        "benefits": ["Process data 10x faster with modern pipelines", "Ensure data quality with automated monitoring", "Reduce data infrastructure costs by 35%", "Enable self-service data for all teams"]
    },
    {
        "id": "it-blockchain-web3",
        "title": "IT Blockchain & Web3 Development",
        "category": "it", "industry": "technology", "icon": "⛓️", "popular": False,
        "pricing": {"basic": "$8,000/mo", "pro": "$20,000/mo", "enterprise": "Custom"},
        "description": "Enterprise blockchain and Web3 development. Smart contracts, DeFi protocols, NFT platforms, and decentralized applications on Ethereum, Solana, and enterprise chains.",
        "features": ["Smart contract development and auditing", "DeFi protocol design and implementation", "NFT marketplace and platform development", "Enterprise blockchain (Hyperledger, Corda)", "Tokenomics design and token launch", "Wallet and custody solutions", "Security audits and penetration testing", "Integration with existing enterprise systems"],
        "benefits": ["Launch blockchain products in weeks, not months", "Secure smart contracts with professional audits", "Tokenize assets for new revenue streams", "Build trust with transparent blockchain solutions"]
    },
    {
        "id": "it-observability-platform",
        "title": "IT Observability & Reliability Engineering",
        "category": "it", "industry": "technology", "icon": "📡", "popular": False,
        "pricing": {"basic": "$2,000/mo", "pro": "$5,000/mo", "enterprise": "Custom"},
        "description": "Implement full-stack observability with metrics, logs, and traces. SRE practices, SLO management, and incident response automation for 99.99% uptime.",
        "features": ["Full-stack observability (metrics, logs, traces)", "SLO/SLI definition and monitoring", "Automated incident detection and response", "Chaos engineering and resilience testing", "Integration with Datadog, Grafana, PagerDuty", "Runbook automation and self-healing", "Capacity planning and performance optimization", "Post-incident review and blameless culture"],
        "benefits": ["Achieve 99.99% uptime with proactive monitoring", "Reduce MTTR by 80% with automated response", "Prevent incidents with chaos engineering", "Optimize infrastructure costs with data-driven decisions"]
    },
    # ===== AI SERVICES (5) =====
    {
        "id": "ai-predictive-quality-control",
        "title": "AI Predictive Quality Control for Manufacturing",
        "category": "ai", "industry": "manufacturing", "icon": "🏭", "popular": True,
        "pricing": {"basic": "$3,999/mo", "pro": "$9,999/mo", "enterprise": "Custom"},
        "description": "AI-powered quality control that detects defects in real-time using computer vision. Predict quality issues before they occur and reduce scrap rates by 50%.",
        "features": ["Real-time computer vision defect detection", "Predictive quality analytics", "Root cause analysis for defects", "Integration with MES and SCADA systems", "Custom model training for your products", "Edge deployment for low-latency inspection", "Quality dashboards and trend analysis", "Automated rejection and routing"],
        "benefits": ["Reduce defect escape rate by 90%", "Cut scrap and rework costs by 50%", "Detect defects invisible to human inspectors", "Predict quality issues before they happen"]
    },
    {
        "id": "ai-multimodal-search",
        "title": "AI Multimodal Search & Discovery Platform",
        "category": "ai", "industry": "technology", "icon": "🔎", "popular": False,
        "pricing": {"basic": "$499/mo", "pro": "$1,499/mo", "enterprise": "Custom"},
        "description": "AI search that understands text, images, video, and audio. Find anything across your enterprise content with natural language queries and visual similarity search.",
        "features": ["Text, image, video, and audio search", "Natural language query understanding", "Visual similarity search", "Cross-language search and translation", "Integration with SharePoint, Confluence, Google Drive", "Custom embedding models for your domain", "Search analytics and relevance tuning", "API and embeddable search widgets"],
        "benefits": ["Find any content in seconds across all formats", "Increase knowledge reuse by 60%", "Support 100+ languages out of the box", "Embed intelligent search in any application"]
    },
    {
        "id": "ai-customer-intent-prediction",
        "title": "AI Customer Intent Prediction & Next-Best-Action",
        "category": "ai", "industry": "customer-success", "icon": "🎯", "popular": True,
        "pricing": {"basic": "$1,999/mo", "pro": "$4,999/mo", "enterprise": "Custom"},
        "description": "Predict customer intent in real-time across all touchpoints. AI analyzes behavior, sentiment, and context to recommend the next best action for every interaction.",
        "features": ["Real-time intent prediction across channels", "Next-best-action recommendations", "Behavioral pattern analysis", "Sentiment and emotion detection", "Integration with CRM, CDP, and marketing automation", "Journey orchestration and optimization", "A/B testing of recommended actions", "Revenue attribution and ROI tracking"],
        "benefits": ["Increase conversion by 30% with right-timed actions", "Reduce churn by predicting intent to leave", "Personalize every interaction at scale", "Measure ROI of every customer touchpoint"]
    },
    {
        "id": "ai-knowledge-graph-builder",
        "title": "AI Knowledge Graph & Entity Resolution Platform",
        "category": "ai", "industry": "technology", "icon": "🕸️", "popular": False,
        "pricing": {"basic": "$2,499/mo", "pro": "$6,999/mo", "enterprise": "Custom"},
        "description": "Build enterprise knowledge graphs that connect people, products, and data. AI-powered entity resolution, relationship discovery, and semantic search across silos.",
        "features": ["Automated entity extraction and resolution", "Relationship discovery across data sources", "Semantic search over knowledge graphs", "Integration with data warehouses and APIs", "Graph visualization and exploration", "Real-time graph updates and streaming", "Custom ontology and taxonomy support", "API for downstream applications"],
        "benefits": ["Connect siloed data into a unified knowledge graph", "Discover hidden relationships in your data", "Enable semantic search across all enterprise data", "Power recommendation and fraud detection systems"]
    },
    {
        "id": "ai-process-mining-optimizer",
        "title": "AI Process Mining & Optimization Platform",
        "category": "ai", "industry": "technology", "icon": "⚙️", "popular": False,
        "pricing": {"basic": "$1,499/mo", "pro": "$3,999/mo", "enterprise": "Custom"},
        "description": "AI-powered process mining that discovers, monitors, and optimizes business processes from event logs. Identify bottlenecks, deviations, and automation opportunities.",
        "features": ["Automated process discovery from event logs", "Conformance checking and deviation detection", "Bottleneck identification and root cause analysis", "Process simulation and what-if analysis", "Integration with SAP, Salesforce, ServiceNow", "Real-time process monitoring dashboards", "Automation opportunity identification", "Compliance and audit trail generation"],
        "benefits": ["Reduce process cycle time by 35%", "Identify automation opportunities worth millions", "Ensure compliance with automated conformance checking", "Optimize processes with data-driven insights"]
    },
]

def make_ts_entry(s):
    feats = json.dumps(s['features']) if isinstance(s['features'], list) else json.dumps(s['features'].split(','))
    return f"""  {{
    id: '{s['id']}',
    title: '{s['title']}',
    description: '{s['description']}',
    features: {feats},
    benefits: {json.dumps(s['benefits'])},
    pricing: {{ basic: '{s['pricing']['basic']}', pro: '{s['pricing']['pro']}', enterprise: '{s['pricing']['enterprise']}' }},
    contactInfo: {{ website: '/services/{s['id']}', email: '{CONTACT['email']}', phone: '{CONTACT['phone']}' }},
    icon: '{s['icon']}',
    href: '/services/{s['id']}',
    popular: {str(s['popular']).lower()},
    category: '{s['category']}',
    industry: '{s['industry']}',
  }}"""

# Update JSON
with open(SERVICES_JSON) as f:
    data = json.load(f)
existing_ids = {s['id'] for s in data}

added = 0
new_entries = []
for svc in NEW_SERVICES:
    if svc['id'] not in existing_ids:
        svc['contactInfo'] = {"website": f"/services/{svc['id']}", "email": CONTACT['email'], "phone": CONTACT['phone'], "address": CONTACT['address']}
        data.append(svc)
        new_entries.append(svc)
        added += 1
        print(f"  ADD: {svc['id']}")
    else:
        print(f"  SKIP: {svc['id']}")

with open(SERVICES_JSON, 'w') as f:
    json.dump(data, f, indent=2)
print(f"\nJSON: {added} added, total: {len(data)}")

# Update TS
with open(SERVICES_TS) as f:
    content = f.read()

ai_entries = [e for e in new_entries if e['category'] == 'ai']
it_entries = [e for e in new_entries if e['category'] == 'it']
sec_entries = [e for e in new_entries if e['category'] == 'security']

for array_name, entries, next_export in [
    ('aiServices', ai_entries, 'export const itServices'),
    ('itServices', it_entries, 'export const cloudServices'),
    ('securityServices', sec_entries, 'export const dataServices'),
]:
    if not entries:
        continue
    arr_start = content.find(f'export const {array_name}')
    next_start = content.find(next_export, arr_start)
    close = content.rfind('];', arr_start, next_start) if next_start != -1 else content.rfind('];', arr_start)
    if close != -1:
        entries_str = ',\n' + ',\n'.join(make_ts_entry(e) for e in entries)
        content = content[:close] + entries_str + content[close:]
        print(f"  ✅ {array_name}: {len(entries)} entries")
    else:
        print(f"  ❌ {array_name}: closing not found")

with open(SERVICES_TS, 'w') as f:
    f.write(content)
