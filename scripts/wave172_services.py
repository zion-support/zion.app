#!/usr/bin/env python3
"""Wave 172 — 10 new services (AI/Cloud/Data niche focus)."""
import json

WAVE = 172
PREFIX = f"wave{WAVE}"

SERVICES = [
  # AI (4)
  {"id":"ai-mental-wellness-coach","title":"AI Mental Wellness Coach","description":"AI-powered mental wellness and resilience coaching for employees. Personalized coping strategies, mood tracking, and crisis support with human escalation paths.","features":["Personalized wellness plans","Mood tracking and journaling","CBT-based coping strategies","Stress level monitoring","Sleep quality insights","Crisis detection and escalation","Integration with Slack and Teams","Anonymous and confidential"],"benefits":["Reduce employee burnout by 30%","Improve mental health support","Confidential 24/7 support","Reduce absenteeism"],"pricing":{"basic":"$299/mo","pro":"$899/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/ai-mental-wellness-coach","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🧠","href":"/services/ai-mental-wellness-coach","popular":True,"category":"ai","industry":"HR"},
  {"id":"ai-document-translation-platform","title":"AI Document Translation Platform","description":"Enterprise document translation with AI. Translate contracts, manuals, and marketing materials while preserving formatting, terminology, and legal accuracy.","features":["Document format preservation","Industry-specific terminology","100+ language pairs","Legal and medical translation","Terminology management","Translation memory","API and plugin for CMS/WMS","Human review workflow"],"benefits":["Translate 10x faster than human","Ensure terminology consistency","Preserve document formatting","Scale localization operations"],"pricing":{"basic":"$399/mo","pro":"$1,299/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/ai-document-translation-platform","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🌐","href":"/services/ai-document-translation-platform","popular":False,"category":"ai","industry":"Technology"},
  {"id":"ai-customer-churn-prevention","title":"AI Customer Churn Prevention Platform","description":"Predict and prevent customer churn with AI. Behavioral analysis, early warning alerts, automated retention campaigns, and win-back workflows.","features":["Churn risk scoring","Behavioral anomaly detection","Automated retention campaigns","Win-back workflow builder","Revenue impact forecasting","Integration with CRM and billing","Health score dashboards","Cohort analysis"],"benefits":["Reduce churn by 25%","Identify at-risk accounts early","Automate retention efforts","Protect revenue"],"pricing":{"basic":"$599/mo","pro":"$1,799/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/ai-customer-churn-prevention","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🛡️","href":"/services/ai-customer-churn-prevention","popular":True,"category":"ai","industry":"Customer Success"},
  {"id":"ai-product-description-generator","title":"AI Product Description Generator","description":"Generate compelling, SEO-optimized product descriptions for e-commerce. Maintain brand voice, optimize for conversions, and scale content creation.","features":["SEO-optimized descriptions","Brand voice customization","Bulk generation (SKU-level)","A/B testing suggestions","Multi-language output","Integration with Shopify, WooCommerce, Magento","Custom templates and guidelines","Performance analytics"],"benefits":["10x faster product listing","Improve SEO rankings","Maintain brand consistency","Scale catalog content"],"pricing":{"basic":"$99/mo","pro":"$299/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/ai-product-description-generator","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"✍️","href":"/services/ai-product-description-generator","popular":False,"category":"ai","industry":"E-commerce"},
  # Cloud (3)
  {"id":"cloud-hybrid-connectivity-platform","title":"Hybrid Cloud Connectivity Platform","description":"Secure, high-performance connectivity between on-premises and cloud environments. SD-WAN, dedicated connections, and network optimization for hybrid architectures.","features":["Multi-cloud connectivity","SD-WAN integration","Dedicated network paths","Traffic optimization","Encryption in transit","Integration with AWS Direct Connect, Azure ExpressRoute","Network monitoring and analytics","Automated failover"],"benefits":["Optimize hybrid cloud performance","Reduce network costs","Improve reliability","Secure data transit"],"pricing":{"basic":"$999/mo","pro":"$2,999/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/cloud-hybrid-connectivity-platform","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🔌","href":"/services/cloud-hybrid-connectivity-platform","popular":False,"category":"cloud","industry":"Technology"},
  {"id":"cloud-container-security-platform","title":"Container Security Platform","description":"End-to-end security for containerized workloads. Image scanning, runtime protection, network policy enforcement, and compliance monitoring for Kubernetes.","features":["Container image scanning","Runtime threat detection","Network policy enforcement","Secrets management","CIS benchmark compliance","Integration with ECR, GCR, ACR","Admission control","Vulnerability prioritization"],"benefits":["Shift security left","Protect containers at runtime","Meet compliance requirements","Reduce vulnerability exposure"],"pricing":{"basic":"$799/mo","pro":"$2,499/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/cloud-container-security-platform","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"📦","href":"/services/cloud-container-security-platform","popular":True,"category":"cloud","industry":"Technology"},
  {"id":"cloud-finops-management","title":"Cloud FinOps Management Platform","description":"Financial operations for cloud spend. Multi-cloud cost allocation, showback/chargeback, budget management, and optimization recommendations with FinOps best practices.","features":["Multi-cloud cost allocation","Showback and chargeback","Budget management and alerts","Savings recommendations","Reserved instance planning","Kubernetes cost allocation","Integration with AWS, Azure, GCP billing","FinOps maturity assessment"],"benefits":["Reduce cloud waste by 35%","Transparent cost allocation","Optimize reserved capacity","FinOps team enablement"],"pricing":{"basic":"$499/mo","pro":"$1,499/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/cloud-finops-management","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"💰","href":"/services/cloud-finops-management","popular":True,"category":"cloud","industry":"Technology"},
  # Data (3)
  {"id":"data-data-quality-platform","title":"Data Quality Management Platform","description":"Automated data quality monitoring and remediation. Rule-based validation, anomaly detection, and data profiling for trustworthy analytics and AI.","features":["Automated data profiling","Rule-based validation","Anomaly detection","Data quality scoring","Remediation workflows","Integration with data warehouses","Custom quality dimensions","Quality trend dashboards"],"benefits":["Ensure data trustworthiness","Catch quality issues early","Automate data monitoring","Improve analytics accuracy"],"pricing":{"basic":"$599/mo","pro":"$1,799/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/data-data-quality-platform","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"✅","href":"/services/data-data-quality-platform","popular":False,"category":"data","industry":"Technology"},
  {"id":"data-data-catalog-governance","title":"AI Data Catalog & Governance Platform","description":"Automated data catalog with AI-powered classification, lineage tracking, and governance policies. Discover, understand, and govern data assets across the enterprise.","features":["Automated data discovery","AI classification and tagging","Data lineage tracking","Access policy enforcement","PII detection and masking","Integration with data warehouses and lakes","Business glossary","Data stewardship workflows"],"benefits":["Discover all data assets automatically","Ensure data governance compliance","Track data lineage end-to-end","Enable self-service analytics"],"pricing":{"basic":"$999/mo","pro":"$2,999/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/data-data-catalog-governance","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"📖","href":"/services/data-data-catalog-governance","popular":False,"category":"data","industry":"Technology"},
  {"id":"data-change-data-capture","title":"Change Data Capture (CDC) Platform","description":"Real-time change data capture for databases. Stream data changes to data lakes, warehouses, and applications with low latency and minimal source impact.","features":["Real-time CDC for all major databases","Sub-second latency","Minimal source system impact","Schema evolution handling","Integration with Kafka, Snowflake, Databricks","Exactly-once delivery","Monitoring and alerting","Cloud and on-premises deployment"],"benefits":["Real-time data synchronization","Minimal impact on source systems","Enable event-driven architectures","Keep all systems in sync"],"pricing":{"basic":"$799/mo","pro":"$2,499/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/data-change-data-capture","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🔄","href":"/services/data-change-data-capture","popular":False,"category":"data","industry":"Technology"},
]

# Categorize
by_cat = {}
for s in SERVICES:
    c = s.get('category','?')
    by_cat.setdefault(c, []).append(s)

for c, svcs in by_cat.items():
    print(f"  {c}: {len(svcs)}")

# 1. Add to JSON
with open('app/data/servicesData.json') as f:
    existing = json.load(f)
existing_ids = {s['id'] for s in existing}
added = 0
for s in SERVICES:
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
                             ('data','DataServices'),('automation','AutomationServices'),
                             ('healthcare-it','HealthcareItServices'),('fintech','FintechServices'),
                             ('retail-tech','RetailTechServices'),('manufacturing-tech','ManufacturingTechServices'),
                             ('edtech','EdtechServices'),('agritech','AgritechServices'),
                             ('construction-tech','ConstructionTechServices'),('energy-tech','EnergyTechServices'),
                             ('logistics-tech','LogisticsTechServices'),('cybersecurity','CybersecurityServices')]:
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

# Add spreads
spread_lines = [f"  ...{n}," for n in wave_arrays]
insert_after = "  ...wave171CybersecurityServices,\n"
new_spreads = ''.join(l + '\n' for l in spread_lines)
content = content.replace(insert_after, insert_after + new_spreads)

with open('app/data/servicesData.ts', 'w') as f:
    f.write(content)

print(f"TS arrays: {', '.join(wave_arrays.keys())}")
print("Done!")
