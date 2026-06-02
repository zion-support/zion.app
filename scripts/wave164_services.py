import json, re

# 20 new services for Wave 164 - Real, useful, innovative services
new_services = [
  # AI Services (8)
  {
    "id": "ai-generative-ui-design-studio",
    "title": "AI Generative UI Design Studio",
    "description": "Generate production-ready UI components and full page layouts from natural language descriptions. Supports React, Vue, and Angular output with Tailwind CSS styling. Integrates with Figma for seamless designer-developer handoff.",
    "features": ["Natural language to UI component generation", "Multi-framework support (React, Vue, Angular)", "Tailwind CSS output with custom themes", "Figma plugin for bidirectional sync", "Design system consistency enforcement", "Accessibility compliance auto-check", "Responsive layout generation", "Component variant generation"],
    "benefits": ["10x faster UI prototyping", "Consistent design system adherence", "Reduced designer-developer handoff time", "Auto-accessible components"],
    "pricing": {"basic": "$149/mo", "pro": "$499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-generative-ui-design-studio", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🎨", "href": "/services/ai-generative-ui-design-studio", "popular": True, "category": "ai", "industry": "Technology"
  },
  {
    "id": "ai-multi-agent-orchestration-platform",
    "title": "AI Multi-Agent Orchestration Platform",
    "description": "Deploy, manage, and monitor fleets of autonomous AI agents that collaborate on complex tasks. Features agent-to-agent communication, task decomposition, result aggregation, and real-time observability dashboards.",
    "features": ["Visual agent workflow builder", "Agent-to-agent communication protocols", "Automatic task decomposition", "Result aggregation and consensus", "Real-time agent monitoring", "Token usage optimization", "Human-in-the-loop checkpoints", "Multi-model routing per agent"],
    "benefits": ["Automate complex multi-step workflows", "Reduce AI costs through intelligent routing", "Scale agent fleets on demand", "Full observability into agent decisions"],
    "pricing": {"basic": "$999/mo", "pro": "$2,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-multi-agent-orchestration-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🤖", "href": "/services/ai-multi-agent-orchestration-platform", "popular": True, "category": "ai", "industry": "Technology"
  },
  {
    "id": "ai-knowledge-graph-engine",
    "title": "AI Knowledge Graph Engine",
    "description": "Automatically build and query enterprise knowledge graphs from unstructured data. Extract entities, relationships, and insights from documents, databases, and APIs. Natural language querying with graph visualization.",
    "features": ["Automated entity extraction", "Relationship inference from unstructured data", "Natural language graph queries", "Interactive graph visualization", "Real-time graph updates", "SPARQL and Cypher query support", "Data source connectors (SQL, NoSQL, APIs)", "Graph embedding for ML pipelines"],
    "benefits": ["Discover hidden relationships in data", "Natural language access to complex data", "Improved search and recommendation", "Regulatory compliance through data lineage"],
    "pricing": {"basic": "$799/mo", "pro": "$2,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-knowledge-graph-engine", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🕸️", "href": "/services/ai-knowledge-graph-engine", "popular": False, "category": "ai", "industry": "Technology"
  },
  {
    "id": "ai-synthetic-data-generator",
    "title": "AI Synthetic Data Generator Pro",
    "description": "Generate statistically accurate synthetic datasets for ML training, testing, and compliance. Preserves statistical properties of real data while ensuring zero privacy risk. Supports tabular, time-series, text, and image data.",
    "features": ["Statistical fidelity preservation", "Privacy guarantee (differential privacy)", "Tabular, time-series, text, image generation", "Data quality scoring", "Schema-aware generation", "Bias detection and mitigation", "GDPR/HIPAA compliant by design", "API and SDK access"],
    "benefits": ["Eliminate privacy compliance risks", "Unlimited training data generation", "Balance underrepresented classes", "Accelerate ML development cycles"],
    "pricing": {"basic": "$399/mo", "pro": "$1,299/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-synthetic-data-generator", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🧬", "href": "/services/ai-synthetic-data-generator", "popular": False, "category": "ai", "industry": "Technology"
  },
  {
    "id": "ai-conversational-commerce-platform",
    "title": "AI Conversational Commerce Platform",
    "description": "AI-powered shopping assistant that engages customers via chat, voice, and messaging apps. Product recommendations, order management, and personalized offers through natural conversation. Integrates with Shopify, WooCommerce, and custom stores.",
    "features": ["Multi-channel deployment (web, WhatsApp, Instagram)", "Personalized product recommendations", "Order tracking and management", "Abandoned cart recovery via chat", "Multilingual support (50+ languages)", "Integration with major e-commerce platforms", "Customer sentiment analysis", "Revenue attribution tracking"],
    "benefits": ["Increase conversion rates by 35%", "Reduce cart abandonment by 25%", "24/7 automated customer engagement", "Personalized shopping experiences at scale"],
    "pricing": {"basic": "$299/mo", "pro": "$899/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-conversational-commerce-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🛒", "href": "/services/ai-conversational-commerce-platform", "popular": True, "category": "ai", "industry": "Retail"
  },
  {
    "id": "ai-regulatory-compliance-automation",
    "title": "AI Regulatory Compliance Automation",
    "description": "Automate compliance monitoring and reporting for GDPR, HIPAA, SOC2, PCI-DSS, and industry-specific regulations. Continuous control monitoring, automated evidence collection, and real-time compliance dashboards.",
    "features": ["Multi-framework compliance mapping", "Automated evidence collection", "Continuous control monitoring", "Risk scoring and prioritization", "Audit trail generation", "Policy document analysis", "Regulatory change tracking", "Executive compliance dashboards"],
    "benefits": ["Reduce compliance costs by 60%", "Eliminate manual evidence collection", "Real-time compliance visibility", "Faster audit preparation"],
    "pricing": {"basic": "$1,499/mo", "pro": "$4,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-regulatory-compliance-automation", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "📋", "href": "/services/ai-regulatory-compliance-automation", "popular": False, "category": "ai", "industry": "Legal"
  },
  {
    "id": "ai-video-content-intelligence",
    "title": "AI Video Content Intelligence Platform",
    "description": "Analyze video content at scale with scene detection, object recognition, transcription, sentiment analysis, and content moderation. Generate highlights, chapters, and searchable metadata for video libraries.",
    "features": ["Automatic scene detection and chaptering", "Object and face recognition", "Multi-language transcription and translation", "Content moderation and brand safety", "Sentiment and emotion analysis", "Highlight reel generation", "Searchable video metadata", "API and webhook integrations"],
    "benefits": ["Make video libraries fully searchable", "Automate content moderation", "Increase content discoverability", "Reduce manual video editing time"],
    "pricing": {"basic": "$499/mo", "pro": "$1,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-video-content-intelligence", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🎬", "href": "/services/ai-video-content-intelligence", "popular": False, "category": "ai", "industry": "Media"
  },
  {
    "id": "ai-predictive-customer-lifetime-value",
    "title": "AI Predictive Customer Lifetime Value Engine",
    "description": "Predict customer lifetime value (CLV) using advanced ML models that analyze behavioral patterns, transaction history, engagement metrics, and external signals. Enables data-driven acquisition spending and retention strategies.",
    "features": ["ML-based CLV prediction", "Behavioral pattern analysis", "Churn risk scoring", "Segment-specific value modeling", "Acquisition cost optimization", "Retention campaign targeting", "Real-time score updates", "CRM and marketing platform integrations"],
    "benefits": ["Optimize marketing spend allocation", "Identify high-value customers early", "Reduce churn through proactive retention", "Increase ROI on acquisition campaigns"],
    "pricing": {"basic": "$599/mo", "pro": "$1,799/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-predictive-customer-lifetime-value", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "💰", "href": "/services/ai-predictive-customer-lifetime-value", "popular": False, "category": "ai", "industry": "Marketing"
  },
  # IT Services (5)
  {
    "id": "it-edge-computing-platform",
    "title": "IT Edge Computing Platform",
    "description": "Deploy and manage applications at the edge with low-latency processing. Container orchestration, serverless functions, and data synchronization across edge locations. Ideal for IoT, retail, and real-time applications.",
    "features": ["Kubernetes-based edge orchestration", "Serverless edge functions", "Automatic data synchronization", "Edge-to-cloud tiered storage", "Zero-touch device provisioning", "Real-time monitoring and alerting", "OTA update management", "Multi-cloud edge deployment"],
    "benefits": ["Sub-10ms latency for critical apps", "Reduced bandwidth costs", "Improved reliability with offline capability", "Consistent deployment across edge locations"],
    "pricing": {"basic": "$799/mo", "pro": "$2,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/it-edge-computing-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "📡", "href": "/services/it-edge-computing-platform", "popular": True, "category": "it", "industry": "Technology"
  },
  {
    "id": "it-identity-governance-administration",
    "title": "IT Identity Governance & Administration (IGA)",
    "description": "Comprehensive identity governance with automated access reviews, role-based access control, privileged access management, and compliance reporting. Centralized identity lifecycle management across all enterprise systems.",
    "features": ["Automated access certifications", "Role-based access control (RBAC)", "Privileged access management", "Identity lifecycle automation", "Segregation of duties enforcement", "Compliance reporting (SOX, GDPR)", "Self-service access requests", "Integration with 200+ enterprise apps"],
    "benefits": ["Reduce access-related security risks", "Automate compliance reporting", "Streamline access requests", "Prevent privilege creep"],
    "pricing": {"basic": "$599/mo", "pro": "$1,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/it-identity-governance-administration", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🪪", "href": "/services/it-identity-governance-administration", "popular": False, "category": "it", "industry": "Technology"
  },
  {
    "id": "it-observability-as-a-service",
    "title": "IT Observability-as-a-Service (OaaS)",
    "description": "Full-stack observability platform covering metrics, logs, traces, and user experience. AI-powered anomaly detection, root cause analysis, and automated remediation. Unified dashboard for infrastructure, applications, and business metrics.",
    "features": ["Unified metrics, logs, and traces", "AI-powered anomaly detection", "Automated root cause analysis", "Real user monitoring (RUM)", "Synthetic monitoring", "Custom alerting and escalation", "Cost optimization insights", "OpenTelemetry native"],
    "benefits": ["Reduce MTTR by 80%", "Proactive issue detection", "Unified visibility across stacks", "Optimize cloud spending"],
    "pricing": {"basic": "$399/mo", "pro": "$1,299/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/it-observability-as-a-service", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "👁️", "href": "/services/it-observability-as-a-service", "popular": True, "category": "it", "industry": "Technology"
  },
  {
    "id": "it-sustainable-it-infrastructure",
    "title": "IT Sustainable IT Infrastructure Consulting",
    "description": "Green IT consulting to reduce carbon footprint of technology operations. Energy-efficient infrastructure design, carbon-aware workload scheduling, e-waste management, and sustainability reporting aligned with ESG goals.",
    "features": ["Carbon footprint assessment", "Energy-efficient architecture design", "Carbon-aware workload optimization", "E-waste management programs", "Green cloud migration strategy", "Sustainability KPI dashboards", "ESG reporting automation", "Renewable energy sourcing guidance"],
    "benefits": ["Reduce IT carbon footprint by 40%", "Lower energy costs", "Meet ESG reporting requirements", "Enhance brand sustainability image"],
    "pricing": {"basic": "$2,999/mo", "pro": "$7,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/it-sustainable-it-infrastructure", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🌿", "href": "/services/it-sustainable-it-infrastructure", "popular": False, "category": "it", "industry": "Technology"
  },
  {
    "id": "it-unified-communications-platform",
    "title": "IT Unified Communications Platform",
    "description": "All-in-one communications platform combining video conferencing, team messaging, phone system, and contact center. AI-powered features including real-time translation, meeting summaries, and sentiment analysis.",
    "features": ["HD video conferencing (1000+ participants)", "Team messaging with channels", "Cloud PBX phone system", "Contact center with AI routing", "Real-time translation (30+ languages)", "AI meeting summaries and action items", "Sentiment analysis for calls", "CRM and helpdesk integrations"],
    "benefits": ["Consolidate communication tools", "Reduce telecom costs by 50%", "Improve team collaboration", "Enhance customer experience"],
    "pricing": {"basic": "$199/mo", "pro": "$599/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/it-unified-communications-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "📞", "href": "/services/it-unified-communications-platform", "popular": False, "category": "it", "industry": "Technology"
  },
  # Micro-SaaS (4)
  {
    "id": "micro-saas-churn-prediction-saas",
    "title": "ChurnShield — Churn Prediction Micro-SaaS",
    "description": "Plug-and-play churn prediction for SaaS businesses. Connect your Stripe/Braintree account, and get AI-powered churn risk scores for every customer. Automated retention campaigns and win-back workflows.",
    "features": ["Stripe/Braintree native integration", "Per-customer churn risk scoring", "Automated retention email campaigns", "Win-back workflow builder", "Revenue impact forecasting", "Cohort analysis dashboard", "Slack/Teams alerts for at-risk accounts", "API for custom integrations"],
    "benefits": ["Reduce churn by 20-35%", "Automate retention efforts", "Identify at-risk accounts early", "Increase MRR retention"],
    "pricing": {"basic": "$99/mo", "pro": "$299/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/micro-saas-churn-prediction-saas", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🛡️", "href": "/services/micro-saas-churn-prediction-saas", "popular": True, "category": "micro-saas", "industry": "SaaS"
  },
  {
    "id": "micro-saas-feature-request-tracker",
    "title": "FeatureVault — Feature Request Tracker",
    "description": "Customer feedback and feature request management platform. Public roadmap, voting boards, and automatic categorization of feedback using AI. Integrates with Intercom, Zendesk, and Slack.",
    "features": ["Public roadmap with voting", "AI-powered feedback categorization", "Intercom/Zendesk/Slack integration", "Customer segmentation by plan", "Changelog and release notes", "Duplicate request merging", "ROI scoring for features", "Custom branding and domain"],
    "benefits": ["Prioritize features by customer demand", "Reduce support ticket volume", "Increase customer engagement", "Data-driven product decisions"],
    "pricing": {"basic": "$49/mo", "pro": "$149/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/micro-saas-feature-request-tracker", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🗳️", "href": "/services/micro-saas-feature-request-tracker", "popular": False, "category": "micro-saas", "industry": "SaaS"
  },
  {
    "id": "micro-saas-subscription-analytics",
    "title": "SubMetrics — Subscription Analytics Micro-SaaS",
    "description": "Real-time subscription analytics and financial metrics for SaaS businesses. MRR/ARR tracking, cohort analysis, revenue forecasting, and investor-ready reports. Connects to Stripe, Chargebee, and Recurly.",
    "features": ["Real-time MRR/ARR tracking", "Cohort retention analysis", "Revenue forecasting (ML-powered)", "Investor report generation", "Stripe/Chargebee/Recurly sync", "Custom metric dashboards", "Benchmarking against industry", "Multi-entity consolidation"],
    "benefits": ["Real-time financial visibility", "Investor-ready reports in one click", "Identify growth bottlenecks", "Benchmark against peers"],
    "pricing": {"basic": "$79/mo", "pro": "$249/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/micro-saas-subscription-analytics", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "📈", "href": "/services/micro-saas-subscription-analytics", "popular": True, "category": "micro-saas", "industry": "SaaS"
  },
  {
    "id": "micro-saas-white-label-helpdesk",
    "title": "DeskForge — White-Label Helpdesk",
    "description": "Fully white-label helpdesk solution for agencies and SaaS companies. Multi-brand support, AI-powered ticket routing, canned responses, and SLA management. Custom domain and branding included.",
    "features": ["Full white-label customization", "AI ticket routing and prioritization", "Multi-brand/multi-tenant support", "Canned response library", "SLA management and tracking", "Knowledge base builder", "Customer satisfaction surveys", "API and webhook support"],
    "benefits": ["Launch helpdesk under your brand", "Reduce support response time", "Scale support without hiring", "Improve customer satisfaction"],
    "pricing": {"basic": "$149/mo", "pro": "$449/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/micro-saas-white-label-helpdesk", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🎫", "href": "/services/micro-saas-white-label-helpdesk", "popular": False, "category": "micro-saas", "industry": "SaaS"
  },
  # Security Services (2)
  {
    "id": "security-supply-chain-security",
    "title": "Supply Chain Security Platform",
    "description": "End-to-end software supply chain security with SBOM generation, vulnerability scanning, dependency analysis, and compliance reporting. Protect against dependency confusion, typosquatting, and malicious packages.",
    "features": ["Automated SBOM generation", "Dependency vulnerability scanning", "Malicious package detection", "License compliance checking", "Dependency confusion prevention", "CI/CD pipeline integration", "Compliance reporting (EO 14028)", "Vendor risk assessment"],
    "benefits": ["Prevent supply chain attacks", "Automate compliance reporting", "Reduce vulnerability exposure", "Meet federal security requirements"],
    "pricing": {"basic": "$999/mo", "pro": "$2,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/security-supply-chain-security", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🔗", "href": "/services/security-supply-chain-security", "popular": False, "category": "security", "industry": "Technology"
  },
  {
    "id": "security-cloud-security-posture",
    "title": "Cloud Security Posture Management (CSPM)",
    "description": "Continuous cloud security posture assessment across AWS, Azure, and GCP. Misconfiguration detection, compliance benchmarking, and automated remediation. Real-time security score and drift detection.",
    "features": ["Multi-cloud assessment (AWS, Azure, GCP)", "Misconfiguration auto-remediation", "Compliance benchmarking (CIS, NIST, PCI)", "Real-time security score", "Drift detection and alerting", "Infrastructure-as-Code scanning", "Identity and access analysis", "Executive risk dashboards"],
    "benefits": ["Prevent cloud breaches from misconfigurations", "Continuous compliance monitoring", "Automated security remediation", "Unified multi-cloud visibility"],
    "pricing": {"basic": "$799/mo", "pro": "$2,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/security-cloud-security-posture", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "☁️", "href": "/services/security-cloud-security-posture", "popular": True, "category": "security", "industry": "Technology"
  },
  # Data Services (1)
  {
    "id": "data-data-mesh-platform",
    "title": "Data Mesh Platform",
    "description": "Implement data mesh architecture with domain-oriented data ownership, self-serve data infrastructure, federated governance, and data product marketplace. Transform centralized data teams into enabling platforms.",
    "features": ["Domain-oriented data ownership", "Self-serve data infrastructure", "Federated computational governance", "Data product marketplace", "Data contract enforcement", "Lineage and quality tracking", "API-first data access", "Multi-cloud deployment"],
    "benefits": ["Scale data teams without bottlenecks", "Improve data quality through ownership", "Faster time-to-insight", "Reduce data platform costs"],
    "pricing": {"basic": "$1,999/mo", "pro": "$5,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/data-data-mesh-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🕸️", "href": "/services/data-data-mesh-platform", "popular": False, "category": "data", "industry": "Technology"
  }
]

# Categorize
ai_svc = [s for s in new_services if s['category'] == 'ai']
it_svc = [s for s in new_services if s['category'] == 'it']
ms_svc = [s for s in new_services if s['category'] == 'micro-saas']
sec_svc = [s for s in new_services if s['category'] == 'security']
data_svc = [s for s in new_services if s['category'] == 'data']

print(f"New services: {len(new_services)}")
print(f"  AI: {len(ai_svc)}, IT: {len(it_svc)}, Micro-SaaS: {len(ms_svc)}, Security: {len(sec_svc)}, Data: {len(data_svc)}")

# 1. Add to servicesData.json
with open('app/data/servicesData.json') as f:
    existing = json.load(f)

existing_ids = {s['id'] for s in existing}
added = 0
for s in new_services:
    if s['id'] not in existing_ids:
        existing.append(s)
        added += 1

with open('app/data/servicesData.json', 'w') as f:
    json.dump(existing, f, indent=2)

print(f"Added {added} services to JSON (total: {len(existing)})")

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

# Build insertion text for each array
def build_entries(svcs):
    lines = []
    for i, s in enumerate(svcs):
        lines.append(make_ts_entry(s, last=(i == len(svcs)-1)))
    return '\n'.join(lines)

ai_entries = build_entries(ai_svc)
it_entries = build_entries(it_svc)
ms_entries = build_entries(ms_svc)
sec_entries = build_entries(sec_svc)
data_entries = build_entries(data_svc)

# 3. Insert into TS file
with open('app/data/servicesData.ts') as f:
    content = f.read()

# Insert AI entries before newAiServices closing
if ai_svc:
    # Find the last ] in newAiServices section
    marker = "export const newAiServices: Service[] = ["
    idx = content.index(marker)
    # Find the closing ]; after this marker
    close_idx = content.index("];", idx)
    # Check if there are existing entries
    section = content[idx:close_idx]
    if section.strip().endswith('['):
        # Empty array
        insert = "\n" + ai_entries + "\n"
    else:
        insert = ",\n" + ai_entries
    content = content[:close_idx] + insert + content[close_idx:]
    print(f"Inserted {len(ai_svc)} AI entries")

# Insert IT entries
if it_svc:
    marker = "export const newItServices: Service[] = ["
    idx = content.index(marker)
    close_idx = content.index("];", idx)
    section = content[idx:close_idx]
    if section.strip().endswith('['):
        insert = "\n" + it_entries + "\n"
    else:
        insert = ",\n" + it_entries
    content = content[:close_idx] + insert + content[close_idx:]
    print(f"Inserted {len(it_svc)} IT entries")

# Insert Micro-SaaS entries
if ms_svc:
    marker = "export const newMicroSaasServices: Service[] = ["
    idx = content.index(marker)
    close_idx = content.index("];", idx)
    section = content[idx:close_idx]
    if section.strip().endswith('['):
        insert = "\n" + ms_entries + "\n"
    else:
        insert = ",\n" + ms_entries
    content = content[:close_idx] + insert + content[close_idx:]
    print(f"Inserted {len(ms_svc)} Micro-SaaS entries")

# Insert Security entries
if sec_svc:
    marker = "export const newSecurityServices: Service[] = ["
    idx = content.index(marker)
    close_idx = content.index("];", idx)
    section = content[idx:close_idx]
    if section.strip().endswith('['):
        insert = "\n" + sec_entries + "\n"
    else:
        insert = ",\n" + sec_entries
    content = content[:close_idx] + insert + content[close_idx:]
    print(f"Inserted {len(sec_svc)} Security entries")

# Insert Data entries
if data_svc:
    marker = "export const newDataServices: Service[] = ["
    idx = content.index(marker)
    close_idx = content.index("];", idx)
    section = content[idx:close_idx]
    if section.strip().endswith('['):
        insert = "\n" + data_entries + "\n"
    else:
        insert = ",\n" + data_entries
    content = content[:close_idx] + insert + content[close_idx:]
    print(f"Inserted {len(data_svc)} Data entries")

with open('app/data/servicesData.ts', 'w') as f:
    f.write(content)

print("TS file updated successfully!")
