#!/usr/bin/env python3
"""Wave 175 — 10 new services."""
import json

WAVE = 175
PREFIX = f"wave{WAVE}"

SERVICES = [
  {"id":"ai-email-personalization-engine","title":"AI Email Personalization Engine","description":"Hyper-personalize marketing emails with AI. Dynamic content, subject line optimization, send-time optimization, and automated A/B testing for higher open and conversion rates.","features":["Dynamic content insertion","AI subject line optimization","Send-time optimization","Automated A/B testing","Audience segmentation AI","Integration with Mailchimp, Klaviyo, HubSpot","Personalization analytics","Spam score checking"],"benefits":["Increase open rates by 35%","Improve click-through rates","Automate email optimization","Scale personalization"],"pricing":{"basic":"$199/mo","pro":"$599/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/ai-email-personalization-engine","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"📧","href":"/services/ai-email-personalization-engine","popular":True,"category":"ai","industry":"Marketing"},
  {"id":"ai-contract-risk-analyzer","title":"AI Contract Risk Analyzer","description":"Analyze contract risk with AI. Identify unfavorable clauses, missing provisions, and compliance gaps. Compare against industry benchmarks and internal standards.","features":["Clause-level risk scoring","Missing provision detection","Compliance gap analysis","Industry benchmark comparison","Redline suggestions","Integration with CLM systems","Custom risk models","Executive risk summaries"],"benefits":["Reduce contract risk exposure","Speed up contract review","Ensure compliance","Standardize risk assessment"],"pricing":{"basic":"$799/mo","pro":"$2,499/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/ai-contract-risk-analyzer","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"📝","href":"/services/ai-contract-risk-analyzer","popular":False,"category":"ai","industry":"Legal"},
  {"id":"ai-warehouse-picking-optimization","title":"AI Warehouse Picking Optimization","description":"Optimize warehouse picking routes and batch assignments with AI. Reduce picker travel time, increase throughput, and improve order accuracy.","features":["Pick path optimization","Batch order optimization","Slotting optimization","Real-time order prioritization","Integration with WMS (Manhattan, Blue Yonder)","Labor planning","Performance analytics","Pick-by-voice and pick-by-light support"],"benefits":["Reduce pick time by 30%","Increase throughput by 25%","Improve order accuracy","Optimize labor allocation"],"pricing":{"basic":"$999/mo","pro":"$2,999/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/ai-warehouse-picking-optimization","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"📦","href":"/services/ai-warehouse-picking-optimization","popular":False,"category":"ai","industry":"Logistics"},
  {"id":"ai-deepfake-detection-enterprise","title":"AI Deepfake Detection Enterprise","description":"Enterprise-grade deepfake detection for images, video, and audio. Real-time API for content moderation, identity verification, and fraud prevention.","features":["Image manipulation detection","Video deepfake detection","Audio deepfake detection","Real-time API (< 200ms)","Batch processing","Integration with social media platforms","Confidence scores with explanations","Custom model training"],"benefits":["Prevent deepfake fraud","Automate content moderation","Verify identity in video calls","Protect brand reputation"],"pricing":{"basic":"$1,999/mo","pro":"$5,999/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/ai-deepfake-detection-enterprise","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🎭","href":"/services/ai-deepfake-detection-enterprise","popular":True,"category":"ai","industry":"Cybersecurity"},
  {"id":"micro-saas-onboarding-checklist","title":"OnboardFlow — Onboarding Checklist Micro-SaaS","description":"Interactive onboarding checklists for SaaS products. Drag-and-drop builder, progress tracking, and integration with Intercom, Pendo, and Segment.","features":["Drag-and-drop checklist builder","Progress tracking","Conditional logic","Integration with Intercom, Pendo, Segment","Custom branding","Analytics and completion rates","API access","Multi-language support"],"benefits":["Increase activation rates by 40%","Reduce onboarding time","Visual progress motivates users","Track completion analytics"],"pricing":{"basic":"$29/mo","pro":"$89/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/micro-saas-onboarding-checklist","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"✅","href":"/services/micro-saas-onboarding-checklist","popular":True,"category":"micro-saas","industry":"SaaS"},
  {"id":"micro-saas-churn-analytics","title":"Churnlytics — Churn Analytics Micro-SaaS","description":"Predict and prevent SaaS churn with AI. Connect Stripe/Braintree, get churn risk scores, automated retention campaigns, and revenue impact forecasting.","features":["Stripe/Braintree integration","Per-customer churn risk scoring","Automated retention campaigns","Win-back workflows","Revenue impact forecasting","Cohort analysis","Slack/Teams alerts","API access"],"benefits":["Reduce churn by 25%","Identify at-risk accounts early","Automate retention efforts","Forecast revenue impact"],"pricing":{"basic":"$49/mo","pro":"$149/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/micro-saas-churn-analytics","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"📉","href":"/services/micro-saas-churn-analytics","popular":False,"category":"micro-saas","industry":"SaaS"},
  {"id":"cloud disaster recovery testing","title":"Automated DR Testing Platform","description":"Automate disaster recovery testing with AI. Non-disruptive testing, automated failover validation, and compliance reporting for DR readiness.","features":["Non-disruptive DR testing","Automated failover validation","Recovery time measurement","Compliance reporting","Integration with AWS, Azure, GCP DR services","Regular scheduled testing","Remediation recommendations","Executive readiness dashboards"],"benefits":["Ensure DR readiness","Automate compliance testing","Reduce MTTR","Validate recovery procedures"],"pricing":{"basic":"$999/mo","pro":"$2,999/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/cloud-disaster-recovery-testing","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🔄","href":"/services/cloud-disaster-recovery-testing","popular":False,"category":"cloud","industry":"Technology"},
  {"id":"security-siem-platform","title":"Cloud-Native SIEM Platform","description":"Modern SIEM with AI-powered threat detection, automated correlation, and cloud-native architecture. Replace legacy SIEM with scalable, intelligent security analytics.","features":["AI-powered threat detection","Automated correlation rules","Cloud-native architecture","Integration with 300+ data sources","SOAR integration","Compliance reporting","Custom detection rules","Threat intelligence feeds"],"benefits":["Detect threats faster","Reduce alert fatigue","Cloud-native scalability","Replace legacy SIEM"],"pricing":{"basic":"$1,999/mo","pro":"$5,999/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/security-siem-platform","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🔍","href":"/services/security-siem-platform","popular":True,"category":"security","industry":"Technology"},
  {"id":"data-data-contract-platform","title":"Data Contract Platform","description":"Define, enforce, and monitor data contracts between producers and consumers. Ensure data quality, schema consistency, and ownership across the organization.","features":["Data contract definition","Schema enforcement","Quality monitoring","Data ownership tracking","Integration with data pipelines","Violation alerting","Contract versioning","Stakeholder collaboration"],"benefits":["Ensure data quality","Prevent schema breakages","Clear data ownership","Enable data mesh"],"pricing":{"basic":"$799/mo","pro":"$2,499/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/data-data-contract-platform","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"📋","href":"/services/data-data-contract-platform","popular":False,"category":"data","industry":"Technology"},
  {"id":"ai-legal-e-discovery","title":"AI Legal E-Discovery Platform","description":"AI-powered electronic discovery for legal teams. Document review, privilege detection, and case strategy analytics with predictive coding.","features":["Predictive coding","Privilege detection","Document clustering","Concept search","Relevance ranking","Integration with legal hold systems","Production and redaction tools","Case analytics"],"benefits":["Reduce document review time by 80%","Lower e-discovery costs","Improve review accuracy","Scale legal team capacity"],"pricing":{"basic":"$1,499/mo","pro":"$4,499/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/ai-legal-e-discovery","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"⚖️","href":"/services/ai-legal-e-discovery","popular":False,"category":"ai","industry":"Legal"},
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
insert_after = "  ...wave174CloudServices,\n"
new_spreads = ''.join(l + '\n' for l in spread_lines)
content = content.replace(insert_after, insert_after + new_spreads)

with open('app/data/servicesData.ts', 'w') as f:
    f.write(content)

print(f"TS arrays: {', '.join(wave_arrays.keys())}")
print("Done!")
