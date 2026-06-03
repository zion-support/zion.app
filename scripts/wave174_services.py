#!/usr/bin/env python3
"""Wave 174 — 10 new services."""
import json

WAVE = 174
PREFIX = f"wave{WAVE}"

SERVICES = [
  {"id":"ai-supply-chain-sustainability","title":"AI Supply Chain Sustainability Platform","description":"Measure, monitor, and improve supply chain sustainability. Carbon footprint tracking, supplier ESG scoring, and circular economy optimization.","features":["Scope 1/2/3 carbon tracking","Supplier ESG scoring","Circular economy optimization","Sustainability reporting (GRI, CDP)","Integration with procurement systems","What-if scenario modeling","Benchmarking","Regulatory compliance"],"benefits":["Meet ESG requirements","Reduce carbon footprint","Optimize sustainable sourcing","Improve brand reputation"],"pricing":{"basic":"$1,499/mo","pro":"$4,499/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/ai-supply-chain-sustainability","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🌱","href":"/services/ai-supply-chain-sustainability","popular":False,"category":"ai","industry":"Supply Chain"},
  {"id":"ai-talent-retention-platform","title":"AI Talent Retention Platform","description":"Predict and prevent employee attrition with AI. Analyze engagement, compensation, and career progression to identify flight risks.","features":["Attrition risk prediction","Compensation benchmarking","Career path recommendations","Manager effectiveness scoring","Engagement survey analysis","Automated retention campaigns","HRIS/ATS integration","Retention ROI analytics"],"benefits":["Reduce attrition by 20%","Save on replacement costs","Improve engagement","Data-driven retention"],"pricing":{"basic":"$999/mo","pro":"$2,999/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/ai-talent-retention-platform","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"👥","href":"/services/ai-talent-retention-platform","popular":True,"category":"ai","industry":"HR"},
  {"id":"ai-oil-gas-predictive-analytics","title":"AI Oil & Gas Predictive Analytics","description":"Predictive analytics for oil and gas operations. Reservoir modeling, production optimization, and equipment failure prediction.","features":["Reservoir simulation","Production optimization","Equipment failure prediction","Pipeline integrity monitoring","Environmental impact prediction","SCADA/DCS integration","Drilling optimization","Reserve estimation"],"benefits":["Increase production by 10%","Reduce unplanned downtime","Optimize drilling","Meet environmental regulations"],"pricing":{"basic":"$4,999/mo","pro":"$14,999/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/ai-oil-gas-predictive-analytics","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🛢️","href":"/services/ai-oil-gas-predictive-analytics","popular":False,"category":"ai","industry":"Energy"},
  {"id":"ai-telecom-network-optimization","title":"AI Telecom Network Optimization","description":"AI-powered telecom network optimization for 5G and legacy networks. Traffic prediction, capacity planning, and automated fault detection.","features":["Traffic prediction","5G optimization","Capacity planning AI","Automated fault detection","Self-healing networks","QoS optimization","OSS/BSS integration","Subscriber experience analytics"],"benefits":["Improve network performance","Reduce churn","Optimize capital spending","Enable autonomous networks"],"pricing":{"basic":"$3,999/mo","pro":"$12,999/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/ai-telecom-network-optimization","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"📡","href":"/services/ai-telecom-network-optimization","popular":False,"category":"ai","industry":"Telecom"},
  {"id":"ai-government-citizen-services","title":"AI Citizen Services Platform","description":"AI-powered citizen services for government agencies. Chatbots, form processing, case management, and automated eligibility determination.","features":["Citizen service chatbots","Form processing automation","Case management","Eligibility determination","Multi-language support","Integration with legacy government systems","Accessibility compliance","Analytics and reporting"],"benefits":["Improve citizen experience","Reduce processing times by 70%","Increase accessibility","Reduce operational costs"],"pricing":{"basic":"$2,999/mo","pro":"$8,999/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/ai-government-citizen-services","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🏛️","href":"/services/ai-government-citizen-services","popular":False,"category":"ai","industry":"Government"},
  {"id":"it-managed-detection-response","title":"Managed Detection & Response (MDR) Service","description":"24/7 managed threat detection and response. Expert SOC analysts combine with AI to monitor, detect, investigate, and respond to threats.","features":["24/7 monitoring","AI-powered detection","Expert SOC analysts","Threat investigation","Incident response","Integration with existing security tools","Threat intelligence","Executive reporting"],"benefits":["24/7 expert monitoring","Reduce MTTR by 80%","Augment existing security team","Enterprise-grade detection"],"pricing":{"basic":"$4,999/mo","pro":"$14,999/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/it-managed-detection-response","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🛡️","href":"/services/it-managed-detection-response","popular":True,"category":"it","industry":"Technology"},
  {"id":"security-vulnerability-management","title":"Vulnerability Management Platform","description":"Comprehensive vulnerability management with risk-based prioritization, automated remediation workflows, and compliance reporting.","features":["Continuous vulnerability scanning","Risk-based prioritization (CVSS + context)","Automated remediation workflows","Compliance reporting (PCI, HIPAA)","Integration with ITSM","Attack surface management","Patch management","Executive dashboards"],"benefits":["Reduce vulnerability exposure","Prioritize by actual risk","Automate remediation","Meet compliance requirements"],"pricing":{"basic":"$799/mo","pro":"$2,499/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/security-vulnerability-management","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🔍","href":"/services/security-vulnerability-management","popular":False,"category":"security","industry":"Technology"},
  {"id":"cloud-cloud-migration-service","title":"Cloud Migration Assessment & Execution","description":"End-to-end cloud migration services. Assessment, planning, execution, and optimization for migrating workloads to AWS, Azure, or GCP.","features":["Application portfolio assessment","Migration strategy (6 Rs)","Automated migration tools","Data migration","Testing and validation","Cost optimization","Training and knowledge transfer","Post-migration support"],"benefits":["Reduce migration risk","Optimize cloud costs","Minimize downtime","Accelerate time to cloud"],"pricing":{"basic":"$9,999/mo","pro":"$29,999/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/cloud-cloud-migration-service","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"☁️","href":"/services/cloud-cloud-migration-service","popular":True,"category":"cloud","industry":"Technology"},
  {"id":"cloud-multi-cloud-kubernetes","title":"Multi-Cloud Kubernetes Platform","description":"Managed Kubernetes across AWS EKS, Azure AKS, and GCP GKE. Unified control plane, security policies, and observability.","features":["Unified multi-cloud K8s management","Policy enforcement","Observability across clusters","Auto-scaling","Service mesh integration","Backup and disaster recovery","Cost allocation","Developer self-service"],"benefits":["Consistent K8s across clouds","Centralized security policies","Reduce operational overhead","Enable developer productivity"],"pricing":{"basic":"$1,499/mo","pro":"$4,499/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/cloud-multi-cloud-kubernetes","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"☸️","href":"/services/cloud-multi-cloud-kubernetes","popular":False,"category":"cloud","industry":"Technology"},
  {"id":"micro-saas-survey-platform","title":"SurveyPro — Survey Platform Micro-SaaS","description":"Advanced survey platform with AI-powered insights, sentiment analysis, and executive dashboards. For market research, customer feedback, and employee engagement.","features":["AI-powered survey builder","Sentiment analysis","Executive dashboards","Integration with CRM and HRIS","Custom branding","Multi-language support","Advanced analytics","API access"],"benefits":["Get insights faster","AI-powered analysis","Professional surveys","Integration with existing tools"],"pricing":{"basic":"$49/mo","pro":"$149/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/micro-saas-survey-platform","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"📊","href":"/services/micro-saas-survey-platform","popular":True,"category":"micro-saas","industry":"Marketing"},
]

by_cat = {}
for s in SERVICES:
    c = s.get('category','?')
    by_cat.setdefault(c, []).append(s)
for c, svcs in by_cat.items():
    print(f"  {c}: {len(svcs)}")

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

with open('app/data/servicesData.ts') as f:
    content = f.read()

wave_ts = ""
for var_name, svcs in wave_arrays.items():
    entries = build_entries(svcs)
    wave_ts += f"\nexport const {var_name}: Service[] = [\n{entries}\n];\n\n"

all_services_marker = "\nexport const allServices: Service[] = ["
content = content.replace(all_services_marker, wave_ts + all_services_marker)

spread_lines = [f"  ...{n}," for n in wave_arrays]
insert_after = "  ...wave173SecurityServices,\n"
new_spreads = ''.join(l + '\n' for l in spread_lines)
content = content.replace(insert_after, insert_after + new_spreads)

with open('app/data/servicesData.ts', 'w') as f:
    f.write(content)

print(f"TS arrays: {', '.join(wave_arrays.keys())}")
print("Done!")
