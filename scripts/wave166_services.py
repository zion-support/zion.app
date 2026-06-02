#!/usr/bin/env python3
"""Wave 166 — Add 15 new high-quality services."""
import json

WAVE = 166
PREFIX = f"wave{WAVE}"

NEW_SERVICES = [
  # === MICRO-SAAS (5) ===
  {
    "id": "micro-saas-meeting-notes-ai",
    "title": "MeetingMind — AI Meeting Notes Micro-SaaS",
    "description": "AI-powered meeting notes and action item extraction. Integrates with Zoom, Google Meet, and Teams to automatically transcribe, summarize, and extract action items from meetings. Share notes with one click.",
    "features": ["Auto-transcribe meetings (Zoom, Meet, Teams)", "AI summary with key decisions", "Action item extraction and assignment", "Search across all meeting notes", "Integration with Slack, Notion, Asana", "Speaker identification", "Custom note templates", "Export to PDF, Markdown, DOCX"],
    "benefits": ["Never take manual meeting notes", "Find any decision in seconds", "Automatic action item tracking", "10x faster meeting follow-up"],
    "pricing": {"basic": "$39/mo", "pro": "$119/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/micro-saas-meeting-notes-ai", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🎙️", "href": "/services/micro-saas-meeting-notes-ai", "popular": True, "category": "micro-saas", "industry": "Productivity"
  },
  {
    "id": "micro-saas-lead-scoring-engine",
    "title": "LeadForge — Lead Scoring Micro-SaaS",
    "description": "AI-powered lead scoring for sales teams. Analyze website activity, email engagement, firmographics, and social signals to rank leads by conversion probability. Integrates with HubSpot, Salesforce, and Pipedrive.",
    "features": ["Multi-signal lead scoring", "Website visit tracking", "Email engagement analytics", "Firmographic enrichment", "CRM integration (HubSpot, Salesforce, Pipedrive)", "Custom scoring models", "Real-time score updates", "Sales alerts for hot leads"],
    "benefits": ["Increase conversion rates by 35%", "Prioritize high-value leads", "Reduce sales cycle time", "Data-driven lead qualification"],
    "pricing": {"basic": "$79/mo", "pro": "$249/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/micro-saas-lead-scoring-engine", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🎯", "href": "/services/micro-saas-lead-scoring-engine", "popular": True, "category": "micro-saas", "industry": "Sales"
  },
  {
    "id": "micro-saas-customer-onboarding",
    "title": "Onboardly — Customer Onboarding Micro-SaaS",
    "description": "Interactive customer onboarding platform with guided tours, checklists, and progress tracking. Reduce time-to-value and improve activation rates with automated onboarding flows.",
    "features": ["Interactive product tours", "Onboarding checklists", "Progress tracking dashboard", "Email drip campaigns", "In-app messaging", "Milestone celebrations", "Integration with Intercom, Segment", "Custom branding"],
    "benefits": ["Improve activation rates by 40%", "Reduce onboarding time", "Increase customer satisfaction", "Automate onboarding workflows"],
    "pricing": {"basic": "$59/mo", "pro": "$179/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/micro-saas-customer-onboarding", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🚀", "href": "/services/micro-saas-customer-onboarding", "popular": False, "category": "micro-saas", "industry": "SaaS"
  },
  {
    "id": "micro-saas-social-media-scheduler",
    "title": "PostPilot — Social Media Scheduler Micro-SaaS",
    "description": "Multi-platform social media scheduling with AI content suggestions, optimal posting times, and analytics. Supports Instagram, Twitter/X, LinkedIn, Facebook, and TikTok.",
    "features": ["Multi-platform scheduling (6 platforms)", "AI content suggestions", "Optimal posting time detection", "Hashtag recommendations", "Analytics and engagement tracking", "Team collaboration", "Content calendar view", "Bulk upload and scheduling"],
    "benefits": ["Save 10+ hours/week on social media", "Increase engagement with optimal timing", "AI-powered content ideas", "Unified social media management"],
    "pricing": {"basic": "$49/mo", "pro": "$149/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/micro-saas-social-media-scheduler", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "📱", "href": "/services/micro-saas-social-media-scheduler", "popular": True, "category": "micro-saas", "industry": "Marketing"
  },
  {
    "id": "micro-saas-form-builder",
    "title": "FormCraft — Form Builder Micro-SaaS",
    "description": "Drag-and-drop form builder with 100+ templates, conditional logic, payment collection, and analytics. Create surveys, registrations, orders, and lead capture forms without code.",
    "features": ["Drag-and-drop form builder", "100+ templates", "Conditional logic", "Payment collection (Stripe, PayPal)", "Analytics and conversion tracking", "Custom branding", "Zapier/Make integration", "Multi-step forms with progress"],
    "benefits": ["Build forms in minutes", "Increase form completion rates", "Collect payments seamlessly", "Integrate with existing tools"],
    "pricing": {"basic": "$29/mo", "pro": "$89/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/micro-saas-form-builder", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "📋", "href": "/services/micro-saas-form-builder", "popular": False, "category": "micro-saas", "industry": "Productivity"
  },

  # === AI SERVICES (5) ===
  {
    "id": "ai-financial-forecasting-engine",
    "title": "AI Financial Forecasting Engine",
    "description": "Enterprise financial forecasting powered by ML. Predict revenue, cash flow, expenses, and key financial metrics with scenario modeling. Integrates with ERP and accounting systems.",
    "features": ["Revenue forecasting (ML models)", "Cash flow prediction", "Expense trend analysis", "Scenario modeling (best/worst/base)", "Budget vs actual analysis", "Integration with QuickBooks, SAP, Oracle", "Executive dashboard", "Custom KPI tracking"],
    "benefits": ["Improve forecast accuracy by 40%", "Data-driven financial planning", "Identify financial risks early", "Board-ready reports"],
    "pricing": {"basic": "$1,499/mo", "pro": "$4,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-financial-forecasting-engine", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "📊", "href": "/services/ai-financial-forecasting-engine", "popular": True, "category": "ai", "industry": "Finance"
  },
  {
    "id": "ai-quality-assurance-automation",
    "title": "AI Quality Assurance Automation",
    "description": "Automated software testing with AI. Generate test cases from requirements, detect visual regressions, predict failure-prone areas, and auto-heal broken tests. Integrates with CI/CD pipelines.",
    "features": ["AI test case generation from requirements", "Visual regression detection", "Test failure prediction", "Auto-healing test scripts", "API test automation", "Integration with Jest, Selenium, Playwright", "Test coverage analytics", "Flaky test detection"],
    "benefits": ["Reduce testing time by 70%", "Catch bugs before production", "Self-healing test suites", "Improve test coverage"],
    "pricing": {"basic": "$799/mo", "pro": "$2,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-quality-assurance-automation", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🧪", "href": "/services/ai-quality-assurance-automation", "popular": False, "category": "ai", "industry": "Technology"
  },
  {
    "id": "ai-accessibility-compliance-auditor",
    "title": "AI Accessibility Compliance Auditor",
    "description": "Automated WCAG 2.1/2.2 compliance auditing for websites and applications. Detect accessibility violations, generate remediation guidance, and monitor compliance over time. ADA and Section 508 compliance reports.",
    "features": ["Automated WCAG 2.1/2.2 scanning", "Violation detection with severity levels", "Remediation code suggestions", "Screen reader simulation", "Keyboard navigation testing", "Compliance reports (ADA, Section 508)", "Continuous monitoring", "Integration with CI/CD"],
    "benefits": ["Avoid accessibility lawsuits", "Improve user experience for all", "Automated compliance monitoring", "Reduce manual audit costs by 80%"],
    "pricing": {"basic": "$399/mo", "pro": "$1,299/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-accessibility-compliance-auditor", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "♿", "href": "/services/ai-accessibility-compliance-auditor", "popular": True, "category": "ai", "industry": "Technology"
  },
  {
    "id": "ai-predictive-maintenance-iiot",
    "title": "AI Predictive Maintenance IIoT Platform",
    "description": "Industrial IoT predictive maintenance for manufacturing and energy. Sensor data analysis, anomaly detection, remaining useful life prediction, and automated work order generation.",
    "features": ["Vibration analysis and anomaly detection", "Thermal imaging analysis", "Remaining useful life prediction", "Automated work order generation", "CMMS/EPA integration", "Digital twin visualization", "Mobile technician app", "Historical failure analysis"],
    "benefits": ["Reduce unplanned downtime by 60%", "Extend asset lifespan by 25%", "Optimize spare parts inventory", "Increase production efficiency"],
    "pricing": {"basic": "$2,999/mo", "pro": "$7,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-predictive-maintenance-iiot", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🏭", "href": "/services/ai-predictive-maintenance-iiot", "popular": False, "category": "ai", "industry": "Manufacturing"
  },
  {
    "id": "ai-citation-generation-platform",
    "title": "AI Citation Generation Platform",
    "description": "Automatic citation generation and management for academic and professional writing. Supports APA, MLA, Chicago, Harvard, and Vancouver styles. Reference management with duplicate detection.",
    "features": ["Auto-generate citations from URLs, DOIs, ISBNs", "9 citation styles (APA, MLA, Chicago, etc.)", "Reference library management", "Duplicate detection", "Browser extension for one-click capture", "Collaborative bibliography", "Word/Google Docs plugin", "Batch import (BibTeX, RIS)"],
    "benefits": ["Save hours on citation formatting", "Never miss a citation requirement", "Consistent formatting guarantee", "Collaborative research support"],
    "pricing": {"basic": "$19/mo", "pro": "$59/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-citation-generation-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "📑", "href": "/services/ai-citation-generation-platform", "popular": False, "category": "ai", "industry": "Education"
  },

  # === IT SERVICES (3) ===
  {
    "id": "it-database-performance-optimization",
    "title": "IT Database Performance Optimization",
    "description": "Expert database performance tuning for PostgreSQL, MySQL, MongoDB, and SQL Server. Query optimization, index strategy, schema redesign, and automated performance monitoring.",
    "features": ["Query performance analysis", "Index optimization strategy", "Schema redesign recommendations", "Connection pooling configuration", "Slow query identification", "Automated performance alerts", "Capacity planning", "Migration assessment"],
    "benefits": ["Improve query performance 10x", "Reduce database costs by 30%", "Prevent performance degradation", "Expert-level optimization without hiring DBA"],
    "pricing": {"basic": "$499/mo", "pro": "$1,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/it-database-performance-optimization", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🗄️", "href": "/services/it-database-performance-optimization", "popular": False, "category": "it", "industry": "Technology"
  },
  {
    "id": "it-cloud-native-transformation",
    "title": "IT Cloud-Native Transformation Service",
    "description": "End-to-end cloud-native transformation: containerization, microservices decomposition, CI/CD pipeline setup, and Kubernetes adoption. From legacy monolith to cloud-native architecture.",
    "features": ["Monolith decomposition consulting", "Containerization (Docker)", "Kubernetes deployment", "CI/CD pipeline setup", "Infrastructure as Code (Terraform)", "Service mesh implementation", "Observability stack setup", "Team training and enablement"],
    "benefits": ["Modernize legacy applications at scale", "Improve deployment frequency 10x", "Reduce infrastructure costs", "Enable team autonomy"],
    "pricing": {"basic": "$4,999/mo", "pro": "$14,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/it-cloud-native-transformation", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "☁️", "href": "/services/it-cloud-native-transformation", "popular": True, "category": "it", "industry": "Technology"
  },
  {
    "id": "it-application-modernization",
    "title": "IT Application Modernization Service",
    "description": "Modernize legacy applications from mainframe, client-server, and monolithic architectures. Lift-and-shift, re-platform, or re-architect based on business needs and ROI analysis.",
    "features": ["Legacy application assessment", "Modernization roadmap (Gartner 5 Rs)", "Mainframe migration", "Desktop to web conversion", "API layer creation", "Database modernization", "Testing and validation", "Knowledge transfer"],
    "benefits": ["Extend legacy application life", "Reduce maintenance costs by 50%", "Improve user experience", "Enable digital transformation"],
    "pricing": {"basic": "$7,999/mo", "pro": "$19,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/it-application-modernization", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🔧", "href": "/services/it-application-modernization", "popular": False, "category": "it", "industry": "Technology"
  },

  # === SECURITY SERVICES (2) ===
  {
    "id": "security-threat-intelligence-platform",
    "title": "Security Threat Intelligence Platform",
    "description": "Real-time threat intelligence aggregation, analysis, and alerting. Correlate threats across sources, automate indicator enrichment, and integrate with SIEM/SOAR for automated response.",
    "features": ["Multi-source threat intelligence aggregation", "IOC enrichment and context", "Threat actor profiling", "Vulnerability prioritization", "SIEM/SOAR integration", "Custom threat feeds", "Executive threat briefings", "MITRE ATT&CK mapping"],
    "benefits": ["Detect threats proactively", "Reduce alert fatigue by 60%", "Automate threat response", "Stay ahead of emerging threats"],
    "pricing": {"basic": "$1,499/mo", "pro": "$4,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/security-threat-intelligence-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🎯", "href": "/services/security-threat-intelligence-platform", "popular": False, "category": "security", "industry": "Technology"
  },
  {
    "id": "security-identity-threat-detection",
    "title": "Security Identity Threat Detection & Response (ITDR)",
    "description": "Protect identities from compromise with AI-powered threat detection. Detect credential theft, privilege escalation, anomalous authentication, and lateral movement across cloud and on-premises.",
    "features": ["Credential theft detection", "Anomalous authentication analysis", "Privilege escalation alerts", "Session hijacking detection", "Lateral movement tracking", "Integration with Azure AD, Okta, Ping", "Automated response playbooks", "Forensic timeline reconstruction"],
    "benefits": ["Prevent identity-based attacks", "Detect compromised credentials in minutes", "Automated threat response", "Meet zero-trust requirements"],
    "pricing": {"basic": "$999/mo", "pro": "$2,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/security-identity-threat-detection", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🆔", "href": "/services/security-identity-threat-detection", "popular": True, "category": "security", "industry": "Technology"
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

# Build wave arrays
wave_arrays = {}
for cat_key, var_suffix in [('ai','AiServices'),('it','ItServices'),('micro-saas','MicroSaasServices'),
                             ('security','SecurityServices'),('cloud','CloudServices'),
                             ('data','DataServices'),('automation','AutomationServices')]:
    svcs = by_cat.get(cat_key, [])
    if svcs:
        wave_arrays[f"{PREFIX}{var_suffix}"] = svcs

# Write to TS file
with open('app/data/servicesData.ts') as f:
    content = f.read()

# Insert before allServices
wave_ts = ""
for var_name, svcs in wave_arrays.items():
    entries = build_entries(svcs)
    wave_ts += f"\nexport const {var_name}: Service[] = [\n{entries}\n];\n\n"

all_services_marker = "\nexport const allServices: Service[] = ["
content = content.replace(all_services_marker, wave_ts + all_services_marker)

# Add spreads to allServices (after last wave spread)
spread_lines = []
for var_name in wave_arrays:
    spread_lines.append(f"  ...{var_name},")

insert_after = "  ...wave165CloudServices,\n"
new_spreads = ''.join(l + '\n' for l in spread_lines)
content = content.replace(insert_after, insert_after + new_spreads)

with open('app/data/servicesData.ts', 'w') as f:
    f.write(content)

print(f"TS arrays: {', '.join(wave_arrays.keys())}")
print("Done!")
