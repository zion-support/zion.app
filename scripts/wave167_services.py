#!/usr/bin/env python3
"""Wave 167 — Add 15 new services (Cloud, Data, Automation focus)."""
import json

WAVE = 167
PREFIX = f"wave{WAVE}"

NEW_SERVICES = [
  # === CLOUD SERVICES (4) ===
  {
    "id": "cloud-multi-cloud-orchestration",
    "title": "Multi-Cloud Orchestration Platform",
    "description": "Unified orchestration across AWS, Azure, and GCP. Deploy, manage, and monitor workloads from a single control plane. Infrastructure as Code with drift detection and auto-remediation.",
    "features": ["Single pane of glass for AWS, Azure, GCP", "Infrastructure as Code (Terraform/Pulumi)", "Drift detection and auto-remediation", "Cost optimization across clouds", "Compliance policy enforcement", "Multi-cloud Kubernetes management", "Disaster recovery orchestration", "Role-based access control"],
    "benefits": ["Reduce multi-cloud complexity", "Optimize cloud spend across providers", "Ensure compliance everywhere", "Faster disaster recovery"],
    "pricing": {"basic": "$1,999/mo", "pro": "$5,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/cloud-multi-cloud-orchestration", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "☁️", "href": "/services/cloud-multi-cloud-orchestration", "popular": True, "category": "cloud", "industry": "Technology"
  },
  {
    "id": "cloud-serverless-platform",
    "title": "Serverless Application Platform",
    "description": "Build and deploy serverless applications with auto-scaling, pay-per-execution pricing, and built-in observability. Supports Node.js, Python, Go, and Rust runtimes.",
    "features": ["Auto-scaling serverless functions", "Pay-per-execution pricing", "Multi-runtime support (Node, Python, Go, Rust)", "Built-in API gateway", "Distributed tracing", "Edge deployment", "Environment management", "CI/CD integration"],
    "benefits": ["Zero infrastructure management", "Pay only for what you use", "Instant scaling to millions of requests", "Faster time to market"],
    "pricing": {"basic": "$199/mo", "pro": "$599/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/cloud-serverless-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "⚡", "href": "/services/cloud-serverless-platform", "popular": False, "category": "cloud", "industry": "Technology"
  },
  {
    "id": "cloud-data-lake-platform",
    "title": "Cloud Data Lake Platform",
    "description": "Managed data lake solution on AWS S3, Azure Data Lake, or GCP Cloud Storage. Schema-on-read, data catalog, governance, and integration with analytics engines.",
    "features": ["Multi-cloud data lake deployment", "Schema-on-read support", "Automated data catalog", "Data governance and lineage", "Integration with Spark, Presto, Athena", "Encryption at rest and in transit", "Lifecycle management policies", "Cost-optimized storage tiers"],
    "benefits": ["Centralize all data in one place", "Reduce data lake management overhead", "Enable self-service analytics", "Ensure data governance"],
    "pricing": {"basic": "$999/mo", "pro": "$2,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/cloud-data-lake-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🏞️", "href": "/services/cloud-data-lake-platform", "popular": False, "category": "cloud", "industry": "Technology"
  },
  {
    "id": "cloud-disaster-recovery-service",
    "title": "Cloud Disaster Recovery-as-a-Service (DRaaS)",
    "description": "Automated disaster recovery for cloud and hybrid environments. Continuous replication, automated failover, and regular DR testing. RPO under 15 minutes, RTO under 1 hour.",
    "features": ["Continuous data replication", "Automated failover and failback", "Regular DR testing (non-disruptive)", "Multi-region deployment", "RPO < 15 min, RTO < 1 hour", "Compliance reporting", "Runbook automation", "24/7 monitoring"],
    "benefits": ["Meet business continuity requirements", "Automated DR testing", "Minimize data loss and downtime", "Reduce DR infrastructure costs"],
    "pricing": {"basic": "$1,499/mo", "pro": "$4,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/cloud-disaster-recovery-service", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🔄", "href": "/services/cloud-disaster-recovery-service", "popular": True, "category": "cloud", "industry": "Technology"
  },

  # === DATA SERVICES (4) ===
  {
    "id": "data-real-time-streaming-platform",
    "title": "Real-Time Data Streaming Platform",
    "description": "Managed Apache Kafka/Pulsar platform for real-time data streaming. Event sourcing, stream processing, and real-time analytics with sub-second latency.",
    "features": ["Managed Kafka/Pulsar clusters", "Schema registry", "Stream processing (Kafka Streams, Flink)", "Real-time dashboards", "Exactly-once delivery", "Auto-scaling partitions", "Dead letter queues", "Integration with 100+ connectors"],
    "benefits": ["Real-time data processing at scale", "Reduce streaming infrastructure complexity", "Event-driven architecture enablement", "Sub-second latency analytics"],
    "pricing": {"basic": "$799/mo", "pro": "$2,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/data-real-time-streaming-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🌊", "href": "/services/data-real-time-streaming-platform", "popular": True, "category": "data", "industry": "Technology"
  },
  {
    "id": "data-master-data-management",
    "title": "Master Data Management (MDM) Platform",
    "description": "Centralized master data management for customers, products, suppliers, and more. Data quality, matching, merging, and governance across all enterprise systems.",
    "features": ["Golden record creation", "Data matching and merging", "Data quality scoring", "Hierarchy management", "Workflow-based stewardship", "Integration with ERP, CRM, SCM", "Data governance policies", "Audit trail and lineage"],
    "benefits": ["Single source of truth for master data", "Improve data quality by 80%", "Reduce data duplication", "Enable 360-degree customer view"],
    "pricing": {"basic": "$1,999/mo", "pro": "$5,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/data-master-data-management", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "👑", "href": "/services/data-master-data-management", "popular": False, "category": "data", "industry": "Technology"
  },
  {
    "id": "data-dataops-platform",
    "title": "DataOps Platform",
    "description": "Automate data pipeline development, testing, and deployment. Version control for data, automated testing, monitoring, and CI/CD for data engineering teams.",
    "features": ["Data pipeline version control", "Automated data testing", "Pipeline CI/CD", "Data quality monitoring", "Lineage tracking", "Integration with dbt, Airflow, Spark", "Environment management", "Cost and performance analytics"],
    "benefits": ["Ship data products faster", "Catch data quality issues early", "Reproducible data pipelines", "Data team productivity boost"],
    "pricing": {"basic": "$599/mo", "pro": "$1,799/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/data-dataops-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🔧", "href": "/services/data-dataops-platform", "popular": False, "category": "data", "industry": "Technology"
  },
  {
    "id": "data-synthetic-data-platform",
    "title": "Synthetic Data Platform for AI Training",
    "description": "Generate realistic synthetic data for AI/ML training while preserving privacy. Supports tabular, text, image, and time-series data with statistical fidelity guarantees.",
    "features": ["Tabular synthetic data generation", "Text data synthesis", "Image synthesis (GANs)", "Time-series generation", "Statistical fidelity validation", "Privacy guarantee (differential privacy)", "Bias detection and mitigation", "API and SDK access"],
    "benefits": ["Unlimited training data without privacy risk", "Balance underrepresented classes", "Accelerate ML development", "GDPR/HIPAA compliant data"],
    "pricing": {"basic": "$499/mo", "pro": "$1,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/data-synthetic-data-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🧬", "href": "/services/data-synthetic-data-platform", "popular": False, "category": "data", "industry": "Technology"
  },

  # === AUTOMATION SERVICES (4) ===
  {
    "id": "automation-intelligent-document-processing",
    "title": "Intelligent Document Processing (IDP)",
    "description": "AI-powered document processing for invoices, contracts, forms, and receipts. OCR, NLP extraction, validation, and integration with ERP and accounting systems.",
    "features": ["OCR with 99%+ accuracy", "AI field extraction", "Document classification", "Validation rules engine", "ERP/Accounting integration", "Human-in-the-loop review", "Batch processing", "Custom document templates"],
    "benefits": ["Reduce document processing time by 85%", "Eliminate manual data entry", "Improve accuracy and compliance", "Scale without hiring"],
    "pricing": {"basic": "$399/mo", "pro": "$1,299/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/automation-intelligent-document-processing", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "📄", "href": "/services/automation-intelligent-document-processing", "popular": True, "category": "automation", "industry": "Technology"
  },
  {
    "id": "automation-business-process-mining",
    "title": "Business Process Mining Platform",
    "description": "Discover, monitor, and optimize business processes from event logs. Identify bottlenecks, deviations, and optimization opportunities with AI-powered process intelligence.",
    "features": ["Process discovery from event logs", "Conformance checking", "Bottleneck identification", "Root cause analysis", "Process simulation", "Real-time process monitoring", "Integration with SAP, Salesforce, ServiceNow", "Custom KPI dashboards"],
    "benefits": ["Identify process inefficiencies", "Reduce process cycle time by 30%", "Ensure compliance with standard processes", "Data-driven process optimization"],
    "pricing": {"basic": "$1,499/mo", "pro": "$4,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/automation-business-process-mining", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "⛏️", "href": "/services/automation-business-process-mining", "popular": False, "category": "automation", "industry": "Technology"
  },
  {
    "id": "automation-robotic-process-automation",
    "title": "Robotic Process Automation (RPA) Platform",
    "description": "Enterprise RPA platform for automating repetitive tasks. No-code bot builder, AI-powered screen understanding, and orchestration across desktop and web applications.",
    "features": ["No-code bot builder", "AI screen understanding", "Desktop and web automation", "Centralized bot orchestration", "Exception handling workflows", "Credential vault", "Audit trail and compliance", "Integration with 100+ applications"],
    "benefits": ["Automate 80% of repetitive tasks", "Reduce operational costs by 40%", "Improve accuracy to 99.9%", "Scale automation without coding"],
    "pricing": {"basic": "$799/mo", "pro": "$2,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/automation-robotic-process-automation", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🤖", "href": "/services/automation-robotic-process-automation", "popular": True, "category": "automation", "industry": "Technology"
  },
  {
    "id": "automation-api-integration-platform",
    "title": "API Integration Platform (iPaaS)",
    "description": "Integration Platform as a Service for connecting applications, data, and APIs. 500+ pre-built connectors, visual workflow builder, and real-time data synchronization.",
    "features": ["500+ pre-built connectors", "Visual integration builder", "Real-time and batch sync", "Data transformation engine", "Error handling and retry", "API management gateway", "Custom connector SDK", "Monitoring and alerting"],
    "benefits": ["Connect any application without code", "Reduce integration time by 70%", "Real-time data synchronization", "Enterprise-grade reliability"],
    "pricing": {"basic": "$299/mo", "pro": "$899/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/automation-api-integration-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🔗", "href": "/services/automation-api-integration-platform", "popular": False, "category": "automation", "industry": "Technology"
  },

  # === AI SERVICES (3) ===
  {
    "id": "ai-conversational-ai-platform",
    "title": "Conversational AI Platform",
    "description": "Build and deploy AI-powered conversational agents for customer service, sales, and internal support. Multi-language, multi-channel, with human handoff and analytics.",
    "features": ["No-code conversation builder", "Multi-language support (50+)", "Omnichannel deployment (web, WhatsApp, SMS)", "Human handoff with context", "Intent classification", "Sentiment analysis", "Conversation analytics", "Integration with CRM and helpdesk"],
    "benefits": ["Reduce support costs by 60%", "24/7 automated customer service", "Consistent customer experience", "Scalable without hiring"],
    "pricing": {"basic": "$499/mo", "pro": "$1,499/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-conversational-ai-platform", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "💬", "href": "/services/ai-conversational-ai-platform", "popular": True, "category": "ai", "industry": "Technology"
  },
  {
    "id": "ai-predictive-analytics-suite",
    "title": "Predictive Analytics Suite",
    "description": "Enterprise predictive analytics with AutoML. Build, deploy, and monitor ML models for forecasting, classification, and anomaly detection without data science expertise.",
    "features": ["AutoML model training", "Time series forecasting", "Classification and regression", "Anomaly detection", "Model explainability (SHAP)", "A/B testing framework", "Model monitoring and drift detection", "Integration with BI tools"],
    "benefits": ["Democratize predictive analytics", "Reduce model development time by 80%", "Production-ready ML without data scientists", "Continuous model monitoring"],
    "pricing": {"basic": "$999/mo", "pro": "$2,999/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-predictive-analytics-suite", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🔮", "href": "/services/ai-predictive-analytics-suite", "popular": False, "category": "ai", "industry": "Technology"
  },
  {
    "id": "ai-natural-language-search",
    "title": "Natural Language Search Engine",
    "description": "AI-powered search that understands natural language queries. Semantic search, auto-summarization, and question-answering over documents, databases, and knowledge bases.",
    "features": ["Semantic search (vector embeddings)", "Natural language question answering", "Auto-summarization of results", "Multi-language support", "Document and database indexing", "Relevance tuning", "Search analytics", "API and widget deployment"],
    "benefits": ["Find information 10x faster", "Natural language instead of keywords", "Summarized answers not just links", "Improve knowledge discovery"],
    "pricing": {"basic": "$399/mo", "pro": "$1,299/mo", "enterprise": "Custom"},
    "contactInfo": {"website": "/services/ai-natural-language-search", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    "icon": "🔍", "href": "/services/ai-natural-language-search", "popular": True, "category": "ai", "industry": "Technology"
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

# Add spreads to allServices
spread_lines = []
for var_name in wave_arrays:
    spread_lines.append(f"  ...{var_name},")

insert_after = "  ...wave166SecurityServices,\n"
new_spreads = ''.join(l + '\n' for l in spread_lines)
content = content.replace(insert_after, insert_after + new_spreads)

with open('app/data/servicesData.ts', 'w') as f:
    f.write(content)

print(f"TS arrays: {', '.join(wave_arrays.keys())}")
print("Done!")
