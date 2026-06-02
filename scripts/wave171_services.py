#!/usr/bin/env python3
"""Wave 171 — 15 new services targeting underserved categories."""
import json

WAVE = 171
PREFIX = f"wave{WAVE}"

SERVICES = [
  # Agritech (2)
  {"id":"agritech-crop-disease-detection","title":"AI Crop Disease Detection Platform","description":"Detect crop diseases, pest infestations, and nutrient deficiencies from drone and smartphone imagery. Early detection saves 20-40% of crop yield.","features":["Drone imagery analysis","Smartphone photo diagnosis","500+ disease recognition","Pest identification","Nutrient deficiency detection","Treatment recommendations","Weather-integrated risk alerts","Farm management dashboard"],"benefits":["Detect diseases 2 weeks early","Reduce crop loss by 30%","Optimize pesticide use","Increase yield predictability"],"pricing":{"basic":"$199/mo","pro":"$599/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/agritech-crop-disease-detection","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🌾","href":"/services/agritech-crop-disease-detection","popular":True,"category":"agritech","industry":"Agriculture"},
  {"id":"agritech-livestock-monitoring","title":"AI Livestock Health Monitoring","description":"IoT and AI-powered livestock health monitoring. Track animal behavior, detect illness early, monitor feeding patterns, and optimize breeding programs.","features":["Behavioral anomaly detection","Illness early warning","Feeding pattern analysis","Breeding optimization","GPS tracking and geofencing","Integration with farm management software","Veterinary alert system","Herds analytics dashboard"],"benefits":["Reduce livestock mortality by 25%","Early disease detection","Optimize feed costs","Improve breeding outcomes"],"pricing":{"basic":"$299/mo","pro":"$899/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/agritech-livestock-monitoring","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🐄","href":"/services/agritech-livestock-monitoring","popular":False,"category":"agritech","industry":"Agriculture"},
  # Construction Tech (2)
  {"id":"construction-project-management-ai","title":"AI Construction Project Management","description":"AI-powered construction project management with schedule optimization, resource allocation, risk prediction, and progress tracking using drone and camera imagery.","features":["Schedule optimization (CPM/PERT)","Resource allocation AI","Risk prediction and mitigation","Drone progress tracking","Safety violation detection","Budget forecasting","Subcontractor management","Integration with Procore, PlanGrid"],"benefits":["Reduce project delays by 30%","Improve safety compliance","Optimize resource utilization","Real-time progress visibility"],"pricing":{"basic":"$999/mo","pro":"$2,999/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/construction-project-management-ai","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🏗️","href":"/services/construction-project-management-ai","popular":True,"category":"construction-tech","industry":"Construction"},
  {"id":"construction-bim-platform","title":"AI BIM Collaboration Platform","description":"AI-enhanced Building Information Modeling platform. Clash detection, design optimization, cost estimation, and 4D/5D BIM with real-time collaboration.","features":["Automated clash detection","Design optimization AI","Cost estimation from BIM models","4D/5D BIM visualization","Real-time multi-user collaboration","Code compliance checking","Material quantity takeoffs","Integration with Revit, ArchiCAD"],"benefits":["Reduce design conflicts by 80%","Accurate cost estimation","Faster design iterations","Improved collaboration"],"pricing":{"basic":"$799/mo","pro":"$2,499/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/construction-bim-platform","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🏢","href":"/services/construction-bim-platform","popular":False,"category":"construction-tech","industry":"Construction"},
  # Energy Tech (2)
  {"id":"energy-smart-grid-management","title":"AI Smart Grid Management Platform","description":"AI-powered smart grid management for utilities. Load forecasting, demand response optimization, renewable integration, and outage prediction.","features":["Load forecasting (ML models)","Demand response optimization","Renewable energy integration","Outage prediction and prevention","Grid stability monitoring","Electric vehicle charging optimization","Integration with SCADA/ADMS","Regulatory compliance reporting"],"benefits":["Reduce grid outages by 40%","Optimize renewable energy usage","Improve grid stability","Reduce operational costs"],"pricing":{"basic":"$4,999/mo","pro":"$14,999/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/energy-smart-grid-management","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"⚡","href":"/services/energy-smart-grid-management","popular":True,"category":"energy-tech","industry":"Energy"},
  {"id":"energy-carbon-capture-optimization","title":"AI Carbon Capture Optimization","description":"Optimize carbon capture and storage operations with AI. Process optimization, monitoring, and reporting for industrial carbon capture facilities.","features":["Process optimization AI","CO2 capture efficiency monitoring","Storage integrity monitoring","Carbon credit verification","Regulatory reporting automation","Integration with DCS/SCADA","Predictive maintenance for capture equipment","Lifecycle analysis"],"benefits":["Increase capture efficiency by 15%","Reduce operating costs","Automate carbon credit reporting","Ensure regulatory compliance"],"pricing":{"basic":"$3,999/mo","pro":"$12,999/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/energy-carbon-capture-optimization","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🌿","href":"/services/energy-carbon-capture-optimization","popular":False,"category":"energy-tech","industry":"Energy"},
  # Logistics Tech (2)
  {"id":"logistics-fleet-management-ai","title":"AI Fleet Management Platform","description":"AI-powered fleet management with route optimization, fuel management, driver safety monitoring, and predictive maintenance for commercial fleets.","features":["Route optimization (real-time)","Fuel consumption analysis","Driver safety scoring","Predictive vehicle maintenance","ELD compliance tracking","Integration with telematics devices","Cargo tracking and condition monitoring","Fleet utilization analytics"],"benefits":["Reduce fuel costs by 20%","Improve driver safety","Optimize fleet utilization","Reduce maintenance costs"],"pricing":{"basic":"$499/mo","pro":"$1,499/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/logistics-fleet-management-ai","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🚛","href":"/services/logistics-fleet-management-ai","popular":True,"category":"logistics-tech","industry":"Logistics"},
  {"id":"logistics-warehouse-robotics","title":"AI Warehouse Robotics Platform","description":"Orchestrate autonomous mobile robots (AMRs) for warehouse operations. Pick-and-place, inventory counting, and goods-to-person fulfillment optimization.","features":["AMR fleet orchestration","Pick path optimization","Inventory counting robots","Goods-to-person fulfillment","Integration with WMS (Manhattan, Blue Yonder)","Real-time inventory accuracy","Labor planning optimization","Safety zone management"],"benefits":["Increase picking efficiency by 3x","Reduce labor costs by 40%","Improve inventory accuracy to 99.9%","Scale operations without hiring"],"pricing":{"basic":"$2,999/mo","pro":"$8,999/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/logistics-warehouse-robotics","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🤖","href":"/services/logistics-warehouse-robotics","popular":False,"category":"logistics-tech","industry":"Logistics"},
  # Cybersecurity (2)
  {"id":"cybersecurity-zero-trust-architecture","title":"Zero Trust Architecture Implementation","description":"End-to-end zero trust architecture design and implementation. Identity verification, micro-segmentation, continuous monitoring, and policy enforcement.","features":["Identity-centric security","Micro-segmentation","Continuous verification","Policy engine (ABAC/RBAC)","Device trust scoring","Network traffic analysis","Integration with existing infrastructure","Compliance mapping (NIST 800-207)"],"benefits":["Eliminate implicit trust","Reduce attack surface by 80%","Meet zero trust compliance requirements","Improve security posture"],"pricing":{"basic":"$4,999/mo","pro":"$14,999/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/cybersecurity-zero-trust-architecture","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🔒","href":"/services/cybersecurity-zero-trust-architecture","popular":True,"category":"cybersecurity","industry":"Technology"},
  {"id":"cybersecurity-security-awareness-training","title":"AI Security Awareness Training Platform","description":"AI-powered cybersecurity awareness training with personalized learning paths, phishing simulations, and behavior analytics. Reduce human-related security incidents by 70%.","features":["Personalized training paths","AI-generated phishing simulations","Behavior analytics and risk scoring","Gamification and leaderboards","Integration with HRIS and email","Compliance tracking (PCI, HIPAA, GDPR)","Custom content creation","Executive reporting"],"benefits":["Reduce phishing click rates by 70%","Personalized training for each employee","Automate compliance tracking","Measure security culture improvement"],"pricing":{"basic":"$199/mo","pro":"$599/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/cybersecurity-security-awareness-training","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🎓","href":"/services/cybersecurity-security-awareness-training","popular":False,"category":"cybersecurity","industry":"Technology"},
  # AI (3) - fresh niches
  {"id":"ai-intellectual-property-management","title":"AI Intellectual Property Management","description":"AI-powered IP management for patents, trademarks, and copyrights. Prior art search, infringement detection, portfolio analysis, and renewal management.","features":["Prior art search (global patent databases)","Infringement detection and monitoring","Patent portfolio analysis","Trademark watch and enforcement","Renewal and maintenance tracking","Competitive IP landscape","Integration with patent offices","Valuation and monetization insights"],"benefits":["Reduce IP search time by 80%","Identify infringement early","Optimize IP portfolio value","Automate renewal management"],"pricing":{"basic":"$999/mo","pro":"$2,999/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/ai-intellectual-property-management","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"💡","href":"/services/ai-intellectual-property-management","popular":False,"category":"ai","industry":"Legal"},
  {"id":"ai-sports-analytics-platform","title":"AI Sports Analytics Platform","description":"AI-powered sports performance analysis for teams and athletes. Video analysis, performance prediction, injury prevention, and scouting optimization.","features":["Video analysis and tracking","Performance prediction models","Injury risk assessment","Scouting and recruitment analytics","Tactical analysis","Fan engagement analytics","Integration with wearables and GPS","Custom dashboards for coaches"],"benefits":["Improve team performance","Reduce injury rates by 25%","Data-driven recruitment","Enhance fan engagement"],"pricing":{"basic":"$799/mo","pro":"$2,499/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/ai-sports-analytics-platform","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"⚽","href":"/services/ai-sports-analytics-platform","popular":False,"category":"ai","industry":"Sports"},
  {"id":"ai-music-generation-platform","title":"AI Music Generation Platform","description":"AI-powered music creation for content creators, advertisers, and game developers. Generate royalty-free music, soundtracks, and sound effects from text descriptions.","features":["Text-to-music generation","Style and mood control","Royalty-free licensing","Soundtrack generation for video","Sound effects library","Custom model training","Integration with DAWs and video editors","Commercial usage rights"],"benefits":["Create music instantly","No copyright concerns","Customize to brand and mood","Reduce music licensing costs"],"pricing":{"basic":"$99/mo","pro":"$299/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/ai-music-generation-platform","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🎵","href":"/services/ai-music-generation-platform","popular":True,"category":"ai","industry":"Media"},
  # Micro-SaaS (2) - fresh niches
  {"id":"micro-saas-nps-platform","title":"NPS Pro — Net Promoter Score Micro-SaaS","description":"NPS survey and feedback management for customer success teams. Automated surveys, trend analysis, and closed-loop follow-up workflows.","features":["Automated NPS surveys","Real-time score tracking","Segmented analysis","Closed-loop follow-up workflows","Integration with CRM and helpdesk","Custom survey templates","Benchmarking against industry","Executive dashboards"],"benefits":["Track customer loyalty in real-time","Identify detractors before they churn","Close the feedback loop automatically","Benchmark against industry standards"],"pricing":{"basic":"$39/mo","pro":"$119/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/micro-saas-nps-platform","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"📊","href":"/services/micro-saas-nps-platform","popular":True,"category":"micro-saas","industry":"Customer Success"},
  {"id":"micro-saas-url-shortener-analytics","title":"LinkForge — URL Shortener & Analytics Micro-SaaS","description":"Branded URL shortener with advanced analytics. Link tracking, QR codes, retargeting pixels, and team collaboration for marketing teams.","features":["Branded short domains","Click analytics and geolocation","QR code generation","Retargeting pixel integration","Team collaboration","Link expiration and password protection","API and Zapier integration","Custom link aliases"],"benefits":["Track every click with detail","Branded links build trust","Retarget visitors with ads","Team link management"],"pricing":{"basic":"$19/mo","pro":"$59/mo","enterprise":"Custom"},"contactInfo":{"website":"/services/micro-saas-url-shortener-analytics","email":"kleber@ziontechgroup.com","phone":"+1 302 464 0950"},"icon":"🔗","href":"/services/micro-saas-url-shortener-analytics","popular":False,"category":"micro-saas","industry":"Marketing"},
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

# Add spreads to allServices
spread_lines = []
for var_name in wave_arrays:
    spread_lines.append(f"  ...{var_name},")

insert_after = "  ...wave170AiServices,\n"
new_spreads = ''.join(l + '\n' for l in spread_lines)
content = content.replace(insert_after, insert_after + new_spreads)

with open('app/data/servicesData.ts', 'w') as f:
    f.write(content)

print(f"TS arrays: {', '.join(wave_arrays.keys())}")
print("Done!")
