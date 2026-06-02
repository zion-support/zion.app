#!/usr/bin/env python3
"""Wave 165 — Add 20 new high-quality services and register them in allServices."""
import json, re

WAVE = 165
PREFIX = f"wave{WAVE}"

# 20 new real, useful, innovative services
NEW_SERVICES = [
  # === AI SERVICES (8) ===
  {
    "id": "ai-autonomous-research-assistant",
    "title": "AI Autonomous Research Assistant",
    "description": "AI agent that autonomously conducts deep research across academic papers, patents, news, and databases. Produces cited reports, literature reviews, and competitive intelligence briefs. Supports 50+ data sources including PubMed, arXiv, Google Patents, and SEC filings.",
    "features": ["Autonomous multi-source research", "Academic paper analysis (PubMed, arXiv)", "Patent landscape mapping", "Competitive intelligence reports", "Auto-citation and bibliography", "Natural language query to structured report", "Scheduled monitoring and alerts", "Export to Word, PDF, LaTeX"],
    "benefits": ["10x faster literature reviews", "Never miss relevant patents or papers", "Data-driven competitive insights", "Reduce research costs by 70%"],
    "pricing": {"basic": "$499/mo", "pro": "$1,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-autonomous-research-assistant", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🔬", "href": "/services/ai-autonomous-research-assistant", "popular": True, "category": "ai", "industry": "Research"
  },
  {
    "id": "ai-emotion-recognition-platform",
    "title": "AI Emotion Recognition Platform",
    "description": "Real-time emotion and sentiment analysis from facial expressions, voice tone, and text. Used for customer experience optimization, market research, and mental health screening. GDPR-compliant with on-device processing option.",
    "features": ["Facial emotion detection (7 basic emotions)", "Voice tone and prosody analysis", "Text sentiment and emotion detection", "Real-time streaming API", "On-device processing for privacy", "Emotion timeline visualization", "Demographic-aware analysis", "Integration with video conferencing tools"],
    "benefits": ["Understand customer emotions in real-time", "Improve product experience with emotional data", "Mental health screening support", "Privacy-first architecture"],
    "pricing": {"basic": "$799/mo", "pro": "$2,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-emotion-recognition-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "😊", "href": "/services/ai-emotion-recognition-platform", "popular": False, "category": "ai", "industry": "Technology"
  },
  {
    "id": "ai-smart-contract-auditor",
    "title": "AI Smart Contract Auditor",
    "description": "Automated security auditing for blockchain smart contracts. Detects reentrancy, overflow, access control, and logic vulnerabilities across Solidity, Rust (Solana), and Vyper. Generates detailed audit reports with severity ratings.",
    "features": ["Vulnerability detection (100+ patterns)", "Multi-chain support (Ethereum, Solana, Polygon)", "Gas optimization suggestions", "Access control analysis", "Formal verification integration", "Auto-generated audit reports", "CI/CD pipeline integration", "Remediation code suggestions"],
    "benefits": ["Prevent costly smart contract exploits", "10x faster than manual audits", "Continuous monitoring for new vulnerabilities", "Meet security audit requirements"],
    "pricing": {"basic": "$1,999/mo", "pro": "$5,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-smart-contract-auditor", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "⛓️", "href": "/services/ai-smart-contract-auditor", "popular": True, "category": "ai", "industry": "Blockchain"
  },
  {
    "id": "ai-workforce-planning-optimizer",
    "title": "AI Workforce Planning Optimizer",
    "description": "AI-powered workforce planning and optimization platform. Forecast staffing needs, optimize schedules, predict attrition, and plan succession. Integrates with HRIS, ATS, and payroll systems.",
    "features": ["Demand forecasting by role and location", "Optimal shift scheduling", "Attrition prediction with risk scores", "Succession planning recommendations", "Skills gap analysis", "Compensation benchmarking", "Integration with Workday, BambooHR, ADP", "Diversity and inclusion analytics"],
    "benefits": ["Reduce hiring costs by 30%", "Improve employee retention", "Optimize labor spend", "Data-driven workforce decisions"],
    "pricing": {"basic": "$1,299/mo", "pro": "$3,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-workforce-planning-optimizer", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "👥", "href": "/services/ai-workforce-planning-optimizer", "popular": False, "category": "ai", "industry": "HR"
  },
  {
    "id": "ai-code-documentation-generator",
    "title": "AI Code Documentation Generator",
    "description": "Automatically generate comprehensive documentation from source code. Produces API docs, inline comments, README files, architecture diagrams, and changelogs. Supports 30+ programming languages.",
    "features": ["Auto-generate API documentation", "Inline comment generation", "Architecture diagram extraction", "README and changelog generation", "Multi-language support (30+)", "Swagger/OpenAPI spec generation", "Integration with GitHub, GitLab, Bitbucket", "Custom documentation templates"],
    "benefits": ["Always up-to-date documentation", "Reduce documentation time by 90%", "Improve code onboarding", "Consistent documentation style"],
    "pricing": {"basic": "$199/mo", "pro": "$599/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-code-documentation-generator", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "📚", "href": "/services/ai-code-documentation-generator", "popular": True, "category": "ai", "industry": "Technology"
  },
  {
    "id": "ai-supply-chain-digital-twin",
    "title": "AI Supply Chain Digital Twin",
    "description": "Create a virtual replica of your entire supply chain for simulation, optimization, and risk management. Model scenarios, predict disruptions, and optimize inventory across the network in real-time.",
    "features": ["Full supply chain modeling", "Real-time simulation engine", "Disruption prediction and alerting", "Inventory optimization across nodes", "What-if scenario analysis", "Supplier risk scoring", "Carbon footprint tracking", "Integration with ERP and WMS"],
    "benefits": ["Reduce supply chain disruptions by 50%", "Optimize inventory costs", "Data-driven scenario planning", "Improve sustainability metrics"],
    "pricing": {"basic": "$2,999/mo", "pro": "$7,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-supply-chain-digital-twin", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🔄", "href": "/services/ai-supply-chain-digital-twin", "popular": False, "category": "ai", "industry": "Supply Chain"
  },
  {
    "id": "ai-personalized-learning-platform",
    "title": "AI Personalized Learning Platform",
    "description": "Adaptive learning platform that creates personalized curricula based on individual learning styles, goals, and progress. AI tutors, skill assessments, and spaced repetition for corporate training and education.",
    "features": ["Adaptive curriculum generation", "AI tutoring with Socratic method", "Skill gap analysis", "Spaced repetition scheduling", "Multi-modal content (video, text, interactive)", "Progress analytics dashboard", "LMS integration (SCORM, xAPI)", "Certification tracking"],
    "benefits": ["3x faster skill acquisition", "Personalized at scale", "Reduce training costs", "Measurable skill improvement"],
    "pricing": {"basic": "$399/mo", "pro": "$1,299/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-personalized-learning-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🎓", "href": "/services/ai-personalized-learning-platform", "popular": True, "category": "ai", "industry": "Education"
  },
  {
    "id": "ai-energy-optimization-platform",
    "title": "AI Energy Optimization Platform",
    "description": "Optimize energy consumption across buildings, factories, and data centers using AI. Predict demand, optimize HVAC, manage renewables, and reduce carbon emissions. Real-time monitoring with automated control.",
    "features": ["Demand forecasting by zone", "HVAC optimization (20-40% savings)", "Renewable energy management", "Carbon emissions tracking", "Anomaly detection for equipment", "Utility bill analysis", "Integration with BMS and SCADA", "ESG reporting automation"],
    "benefits": ["Reduce energy costs by 25-40%", "Meet carbon reduction targets", "Predict and prevent equipment failures", "Automated ESG compliance"],
    "pricing": {"basic": "$999/mo", "pro": "$3,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-energy-optimization-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "⚡", "href": "/services/ai-energy-optimization-platform", "popular": False, "category": "ai", "industry": "Energy"
  },

  # === IT SERVICES (5) ===
  {
    "id": "it-service-mesh-platform",
    "title": "IT Service Mesh Platform",
    "description": "Enterprise service mesh for microservices communication, security, and observability. mTLS encryption, traffic management, circuit breaking, and distributed tracing across Kubernetes clusters.",
    "features": ["Automatic mTLS encryption", "Traffic routing and canary deployments", "Circuit breaking and retry policies", "Distributed tracing (OpenTelemetry)", "Multi-cluster federation", "Zero-trust network policies", "Performance dashboards", "Istio/Linkerd compatibility"],
    "benefits": ["Secure microservices communication", "Zero-downtime deployments", "Full observability across services", "Simplify multi-cluster management"],
    "pricing": {"basic": "$1,499/mo", "pro": "$4,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/it-service-mesh-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🕸️", "href": "/services/it-service-mesh-platform", "popular": False, "category": "it", "industry": "Technology"
  },
  {
    "id": "it-data-warehouse-modernization",
    "title": "IT Data Warehouse Modernization",
    "description": "Migrate legacy data warehouses to modern cloud-native architectures (Snowflake, BigQuery, Redshift, Databricks). Schema migration, ETL modernization, performance optimization, and cost analysis.",
    "features": ["Legacy warehouse assessment", "Automated schema migration", "ETL/ELT pipeline modernization", "Performance benchmarking", "Cost comparison analysis", "Data validation and reconciliation", "Dbt integration", "Training and knowledge transfer"],
    "benefits": ["Reduce warehouse costs by 40%", "Improve query performance 10x", "Modern data stack adoption", "Self-service analytics enablement"],
    "pricing": {"basic": "$4,999/mo", "pro": "$12,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/it-data-warehouse-modernization", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🏗️", "href": "/services/it-data-warehouse-modernization", "popular": False, "category": "it", "industry": "Technology"
  },
  {
    "id": "it-incident-management-platform",
    "title": "IT Incident Management Platform",
    "description": "End-to-end incident management with AI-powered triage, auto-remediation, and post-incident analysis. Integrates with monitoring tools, creates runbooks, and tracks SLA compliance.",
    "features": ["AI-powered incident triage", "Auto-remediation runbooks", "Multi-channel alerting (PagerDuty, Slack, Teams)", "Incident timeline reconstruction", "Post-incident review automation", "SLA tracking and reporting", "War room collaboration", "Integration with 100+ monitoring tools"],
    "benefits": ["Reduce MTTR by 70%", "Automate repetitive incident response", "Improve SLA compliance", "Learn from every incident"],
    "pricing": {"basic": "$599/mo", "pro": "$1,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/it-incident-management-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🚨", "href": "/services/it-incident-management-platform", "popular": True, "category": "it", "industry": "Technology"
  },
  {
    "id": "it-quantum-safe-cryptography",
    "title": "IT Quantum-Safe Cryptography Migration",
    "description": "Prepare your infrastructure for the post-quantum era. Cryptographic inventory, vulnerability assessment, and migration to NIST-approved quantum-resistant algorithms. Compliance with CNSA 2.0 timeline.",
    "features": ["Cryptographic inventory and assessment", "Quantum vulnerability scoring", "NIST PQC algorithm migration", "TLS and certificate modernization", "Crypto-agility framework", "Compliance reporting (CNSA 2.0)", "Hybrid certificate deployment", "Zero-downtime migration"],
    "benefits": ["Future-proof against quantum attacks", "Meet CNSA 2.0 compliance deadlines", "Identify crypto vulnerabilities", "Seamless migration with no downtime"],
    "pricing": {"basic": "$2,999/mo", "pro": "$8,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/it-quantum-safe-cryptography", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🔐", "href": "/services/it-quantum-safe-cryptography", "popular": False, "category": "it", "industry": "Technology"
  },
  {
    "id": "it-digital-workplace-platform",
    "title": "IT Digital Workplace Platform",
    "description": "Unified digital workplace combining intranet, collaboration, knowledge management, and employee experience. AI-powered search, personalized feeds, and integration with Microsoft 365 and Google Workspace.",
    "features": ["AI-powered enterprise search", "Personalized content feeds", "Knowledge base with AI Q&A", "Employee onboarding workflows", "MS 365 and Google Workspace integration", "Analytics and engagement metrics", "Mobile-first design", "Custom branding and theming"],
    "benefits": ["Improve employee productivity by 25%", "Reduce information silos", "Enhance employee engagement", "Unified digital employee experience"],
    "pricing": {"basic": "$299/mo", "pro": "$899/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/it-digital-workplace-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "💼", "href": "/services/it-digital-workplace-platform", "popular": False, "category": "it", "industry": "Technology"
  },

  # === MICRO-SAAS (4) ===
  {
    "id": "micro-saas-review-management",
    "title": "ReviewPulse — Review Management Micro-SaaS",
    "description": "Multi-platform review management for local businesses. Monitor, respond, and analyze reviews from Google, Yelp, TripAdvisor, and industry-specific sites. AI-generated responses and sentiment trends.",
    "features": ["Multi-platform review monitoring", "AI-generated response suggestions", "Sentiment trend analysis", "Competitor review benchmarking", "Review request automation", "Star rating tracking", "Custom reporting and alerts", "Multi-location management"],
    "benefits": ["Improve online reputation", "Save 10+ hours/week on review management", "Increase review volume by 40%", "Data-driven reputation insights"],
    "pricing": {"basic": "$59/mo", "pro": "$179/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/micro-saas-review-management", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "⭐", "href": "/services/micro-saas-review-management", "popular": True, "category": "micro-saas", "industry": "Local Business"
  },
  {
    "id": "micro-saas-contract-management",
    "title": "ContractForge — Contract Management Micro-SaaS",
    "description": "Contract lifecycle management for small and medium businesses. Template library, e-signatures, renewal tracking, and AI-powered clause analysis. Integrates with CRM and accounting software.",
    "features": ["Contract template library", "E-signature (legally binding)", "Renewal and expiration alerts", "AI clause risk analysis", "Obligation tracking", "Approval workflows", "Integration with HubSpot, Salesforce, QuickBooks", "Audit trail and version history"],
    "benefits": ["Never miss a contract renewal", "Reduce contract risk with AI analysis", "Speed up contract cycles by 60%", "Centralized contract repository"],
    "pricing": {"basic": "$89/mo", "pro": "$279/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/micro-saas-contract-management", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "📝", "href": "/services/micro-saas-contract-management", "popular": False, "category": "micro-saas", "industry": "Legal"
  },
  {
    "id": "micro-saas-employee-engagement",
    "title": "PulseCheck — Employee Engagement Micro-SaaS",
    "description": "Real-time employee engagement platform with pulse surveys, eNPS tracking, recognition programs, and action planning. AI-powered insights to improve retention and culture.",
    "features": ["Pulse surveys (custom and templates)", "eNPS tracking and benchmarking", "Peer-to-peer recognition", "AI-powered action suggestions", "Manager coaching insights", "Integration with Slack, Teams, HRIS", "Anonymous feedback channel", "Custom engagement dashboards"],
    "benefits": ["Improve employee retention by 20%", "Identify engagement risks early", "Data-driven culture decisions", "Boost team morale and productivity"],
    "pricing": {"basic": "$49/mo", "pro": "$149/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/micro-saas-employee-engagement", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "💚", "href": "/services/micro-saas-employee-engagement", "popular": False, "category": "micro-saas", "industry": "HR"
  },
  {
    "id": "micro-saas-invoice-generator",
    "title": "InvoiceFlow — Invoice Generator Micro-SaaS",
    "description": "Professional invoice and payment collection for freelancers and small businesses. Custom templates, recurring invoices, payment tracking, and automatic late payment reminders. Multi-currency and tax support.",
    "features": ["Custom invoice templates", "Recurring invoice automation", "Payment tracking dashboard", "Automatic late payment reminders", "Multi-currency support", "Tax calculation (VAT, GST, Sales Tax)", "Stripe/PayPal payment integration", "Expense and time tracking"],
    "benefits": ["Get paid 2x faster", "Automate invoicing workflows", "Professional brand image", "Accurate tax compliance"],
    "pricing": {"basic": "$29/mo", "pro": "$89/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/micro-saas-invoice-generator", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🧾", "href": "/services/micro-saas-invoice-generator", "popular": True, "category": "micro-saas", "industry": "Finance"
  },

  # === SECURITY SERVICES (2) ===
  {
    "id": "security-deception-technology-platform",
    "title": "Security Deception Technology Platform",
    "description": "Deploy decoys, honeypots, and deception grids across your network to detect intruders early. Real-time alerts when attackers interact with decoys. Forensic capture of attack techniques and tools.",
    "features": ["Automated decoy deployment", "Honeypots for common services (SSH, HTTP, DB)", "Deception tokens (fake credentials, files)", "Real-time attack alerts", "Forensic session capture", "MITRE ATT&CK mapping", "Integration with SIEM/SOAR", "Threat intelligence feeds"],
    "benefits": ["Detect threats weeks earlier", "Zero false positives", "Understand attacker TTPs", "Validate detection capabilities"],
    "pricing": {"basic": "$1,999/mo", "pro": "$5,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/security-deception-technology-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🎭", "href": "/services/security-deception-technology-platform", "popular": False, "category": "security", "industry": "Technology"
  },
  {
    "id": "security-data-loss-prevention",
    "title": "Security Data Loss Prevention (DLP) Suite",
    "description": "Comprehensive DLP covering endpoints, network, cloud, and email. Identify, classify, and protect sensitive data with AI-powered content inspection. Automated policy enforcement and incident response.",
    "features": ["AI-powered content classification", "Endpoint DLP agent", "Cloud DLP (SaaS and IaaS)", "Email DLP with encryption", "USB and device control", "Automated policy enforcement", "Incident investigation workflows", "Regulatory compliance (GDPR, HIPAA, PCI)"],
    "benefits": ["Prevent data breaches from insider threats", "Automate compliance enforcement", "Protect IP and trade secrets", "Reduce data exposure risk"],
    "pricing": {"basic": "$799/mo", "pro": "$2,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/security-data-loss-prevention", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🛡️", "href": "/services/security-data-loss-prevention", "popular": True, "category": "security", "industry": "Technology"
  },

  # === CLOUD SERVICES (1) ===
  {
    "id": "cloud-cost-optimization-service",
    "title": "Cloud Cost Optimization-as-a-Service",
    "description": "Continuous cloud cost optimization across AWS, Azure, and GCP. AI-driven recommendations for reserved instances, spot usage, right-sizing, and waste elimination. FinOps dashboard with chargeback reporting.",
    "features": ["Multi-cloud cost analysis", "Reserved instance planning", "Spot instance orchestration", "Right-sizing recommendations", "Waste detection (idle resources)", "FinOps chargeback reports", "Budget alerts and forecasting", "Kubernetes cost allocation"],
    "benefits": ["Reduce cloud spend by 30-50%", "Automated cost optimization", "FinOps team enablement", "Real-time cost visibility"],
    "pricing": {"basic": "$499/mo", "pro": "$1,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/cloud-cost-optimization-service", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "💸", "href": "/services/cloud-cost-optimization-service", "popular": True, "category": "cloud", "industry": "Technology"
  },
]

# Categorize
by_cat = {}
for s in NEW_SERVICES:
    c = s['category']
    by_cat.setdefault(c, []).append(s)

for c, svcs in by_cat.items():
    print(f"  {c}: {len(svcs)}")

# 1. Add to JSON
with open('app/data/servicesData.json') as f:
    existing = json.load(f)
existing_ids = {s['id'] for s in existing}
added = 0
for s in NEW_SERVICES:
    if s['id'] not in existing_ids:
        existing.append(s)
        added += 1
with open('app/data/servicesData.json', 'w') as f:
    json.dump(existing, f, indent=2)
print(f"JSON: +{added} services (total: {len(existing)})")

# 2. Generate TS entries
def make_ts_entry(s, last=False):
    comma = '' if last else ','
    return f"""  {{
    id: '{s['id']}',
    title: '{s['title']}',
    description: '{s['description']}',
    features: {json.dumps(s['features'])},
    benefits: {json.dumps(s['benefits'])},
    pricing: {json.dumps(s['pricing'])},
    contactInfo: {json.dumps(s['contactInfo'])},
    icon: '{s['icon']}', href: '{s['href']}', popular: {str(s.get('popular', False)).lower()}, category: '{s['category']}', industry: '{s['industry']}',
  }}{comma}"""

def build_entries(svcs):
    return '\n'.join(make_ts_entry(s, last=(i==len(svcs)-1)) for i,s in enumerate(svcs))

# Build all wave arrays
wave_arrays = {}
for cat_key, var_suffix in [('ai','AiServices'),('it','ItServices'),('micro-saas','MicroSaasServices'),
                             ('security','SecurityServices'),('cloud','CloudServices'),
                             ('data','DataServices'),('automation','AutomationServices')]:
    svcs = by_cat.get(cat_key, [])
    if svcs:
        wave_arrays[f"{PREFIX}{var_suffix}"] = svcs

# Write wave arrays to TS file
with open('app/data/servicesData.ts') as f:
    content = f.read()

# Insert wave arrays before the allServices line
wave_ts = ""
for var_name, svcs in wave_arrays.items():
    entries = build_entries(svcs)
    wave_ts += f"\nexport const {var_name}: Service[] = [\n{entries}\n];\n\n"

# Insert before allServices
all_services_marker = "\nexport const allServices: Service[] = ["
content = content.replace(all_services_marker, wave_ts + all_services_marker)

# Add spreads to allServices
spread_lines = []
for var_name in wave_arrays:
    spread_lines.append(f"  ...{var_name},")

# Find the last spread line in allServices and add after it
insert_after = "  ...wave162AutomationServices,\n"
new_spreads = ''.join(l + '\n' for l in spread_lines)
content = content.replace(insert_after, insert_after + new_spreads)

with open('app/data/servicesData.ts', 'w') as f:
    f.write(content)

print(f"TS arrays created: {', '.join(wave_arrays.keys())}")
print("All done!")
