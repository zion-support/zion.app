#!/usr/bin/env python3
"""Wave 157 - 15 new real services."""
import json

SERVICES_JSON = 'app/data/servicesData.json'
SERVICES_TS = 'app/data/servicesData.ts'
E = "kleber@ziontechgroup.com"
P = "+1 302 464 0950"

NEW = [
    # MICRO-SAAS (5)
    {
        "id": "micro-saas-ai-review-responder",
        "title": "AI Review Response & Reputation Manager",
        "category": "ai", "industry": "marketing", "icon": "⭐", "popular": True,
        "pricing": {"basic": "$99/mo", "pro": "$299/mo", "enterprise": "Custom"},
        "description": "AI that writes personalized responses to customer reviews across Google, Yelp, TripAdvisor, and 50+ platforms. Maintains brand voice and handles negative reviews with care.",
        "features": ["AI review response generation with brand voice", "Multi-platform monitoring (Google, Yelp, TripAdvisor, Amazon)", "Negative review escalation alerts", "Response approval workflows", "Competitor review benchmarking", "Review sentiment analytics", "Integration with CRM and reputation platforms", "Automatic review request campaigns"],
        "benefits": ["Respond to reviews 10x faster", "Improve ratings with consistent responses", "Catch negative reviews before they spread", "Maintain brand voice across all responses"]
    },
    {
        "id": "micro-saas-ai-workflow-automation",
        "title": "AI No-Code Workflow Automation Platform",
        "category": "ai", "industry": "productivity", "icon": "⚡", "popular": True,
        "pricing": {"basic": "$49/mo", "pro": "$149/mo", "enterprise": "Custom"},
        "description": "Build complex automations without code. AI suggests workflows based on your processes, connects 500+ apps, and optimizes flows over time.",
        "features": ["AI workflow suggestions from natural language", "500+ app integrations", "Conditional logic and branching", "Error handling and retry logic", "Scheduling and webhook triggers", "Analytics on automation performance", "Team collaboration and sharing", "Version history and rollback"],
        "benefits": ["Automate 10x faster with AI suggestions", "Connect all your tools without code", "Optimize workflows based on performance data", "Scale automations across the organization"]
    },
    {
        "id": "micro-saas-ai-predictive-maintenance-lite",
        "title": "AI Predictive Maintenance for Small Business",
        "category": "ai", "industry": "manufacturing", "icon": "🔧", "popular": False,
        "pricing": {"basic": "$199/mo", "pro": "$499/mo", "enterprise": "Custom"},
        "description": "Affordable AI predictive maintenance for small manufacturers and facilities. Predict equipment failures 2-4 weeks in advance using vibration, temperature, and usage data.",
        "features": ["Sensor data ingestion (vibration, temperature, humidity)", "AI failure prediction 2-4 weeks ahead", "Maintenance work order generation", "Spare parts inventory recommendations", "Mobile app for technicians", "Integration with CMMS systems", "Cost savings tracking and ROI", "Historical failure analysis"],
        "benefits": ["Prevent 80% of unexpected breakdowns", "Extend equipment life by 30%", "Reduce maintenance costs by 40%", "Affordable for small manufacturers"]
    },
    {
        "id": "micro-saas-ai-candidate-screening",
        "title": "AI Candidate Screening & Interview Platform",
        "category": "ai", "industry": "hr-tech", "icon": "👤", "popular": False,
        "pricing": {"basic": "$199/mo", "pro": "$499/mo", "enterprise": "Custom"},
        "description": "AI-powered candidate screening that analyzes resumes, conducts video interviews, and ranks candidates based on job requirements. Reduce screening time by 90%.",
        "features": ["AI resume parsing and ranking", "AI video interview analysis", "Skills assessment and testing", "Bias detection and mitigation", "Integration with Greenhouse, Lever, Workday", "Custom scoring rubrics", "Candidate experience analytics", "Diversity and inclusion reporting"],
        "benefits": ["Screen candidates 90% faster", "Reduce unconscious bias in hiring", "Improve quality of hire with AI matching", "Deliver better candidate experience"]
    },
    {
        "id": "micro-saas-ai-insurance-claims",
        "title": "AI Insurance Claims Processing Platform",
        "category": "ai", "industry": "insurance", "icon": "🏥", "popular": False,
        "pricing": {"basic": "$999/mo", "pro": "$2,499/mo", "enterprise": "Custom"},
        "description": "AI-powered insurance claims processing that automates document review, fraud detection, and payout calculation. Reduce claims processing time from days to hours.",
        "features": ["AI document intake and extraction", "Automated claims triage and routing", "Fraud detection with anomaly modeling", "Payout calculation and approval workflows", "Integration with policy admin systems", "Customer communication automation", "Regulatory compliance reporting", "Analytics on claims patterns and fraud"],
        "benefits": ["Process claims in hours instead of days", "Detect fraud with 95% accuracy", "Reduce claims processing costs by 60%", "Improve customer satisfaction with faster payouts"]
    },
    # IT SERVICES (5)
    {
        "id": "it-cybersecurity-operations",
        "title": "IT Cybersecurity Operations & Incident Response",
        "category": "security", "industry": "technology", "icon": "🛡️", "popular": True,
        "pricing": {"basic": "$5,000/mo", "pro": "$12,000/mo", "enterprise": "Custom"},
        "description": "24/7 cybersecurity operations with threat detection, incident response, and compliance monitoring. SOC-as-a-service for organizations of all sizes.",
        "features": ["24/7 security monitoring by certified analysts", "SIEM management and tuning", "Incident response with 15-minute SLA", "Threat intelligence integration", "Vulnerability scanning and management", "Compliance monitoring (SOC 2, HIPAA, PCI)", "Monthly security posture reports", "Tabletop exercises and IR planning"],
        "benefits": ["Enterprise-grade SOC for 1/10th the cost", "Detect and respond to threats in 15 minutes", "Meet compliance monitoring requirements", "Access certified security analysts 24/7"]
    },
    {
        "id": "it-microsoft-365",
        "title": "IT Microsoft 365 Deployment & Management",
        "category": "it", "industry": "technology", "icon": "📎", "popular": True,
        "pricing": {"basic": "$8/user/mo", "pro": "$15/user/mo", "enterprise": "Custom"},
        "description": "Complete Microsoft 365 deployment, migration, and management. Exchange, SharePoint, Teams, OneDrive, and security configuration.",
        "features": ["M365 licensing optimization and procurement", "Email migration from legacy systems", "SharePoint and OneDrive deployment", "Teams configuration and governance", "M365 security and compliance setup", "Intune device management", "User training and adoption programs", "Ongoing management and support"],
        "benefits": ["Optimize M365 licensing costs by 30%", "Migrate without business disruption", "Secure M365 with best-practice configuration", "Drive user adoption with training"]
    },
    {
        "id": "it-network-security",
        "title": "IT Network Security & Firewall Management",
        "category": "security", "industry": "technology", "icon": "🔥", "popular": False,
        "pricing": {"basic": "$2,000/mo", "pro": "$5,000/mo", "enterprise": "Custom"},
        "description": "Comprehensive network security with next-gen firewall management, intrusion detection/prevention, and network access control. 24/7 monitoring and management.",
        "features": ["Next-gen firewall deployment and management", "IDS/IPS configuration and tuning", "Network access control (NAC)", "DNS security and content filtering", "VPN and remote access management", "24/7 network security monitoring", "Integration with Cisco, Palo Alto, Fortinet", "Security incident response for network threats"],
        "benefits": ["Block advanced threats with AI-powered firewalls", "Detect intrusions in real-time", "Secure remote access for all employees", "Reduce network security costs with managed services"]
    },
    {
        "id": "it-server-management",
        "title": "IT Server Management & Infrastructure Monitoring",
        "category": "it", "industry": "technology", "icon": "🖧", "popular": False,
        "pricing": {"basic": "$500/server/mo", "pro": "$800/server/mo", "enterprise": "Custom"},
        "description": "24/7 server management with proactive monitoring, patching, backups, and performance optimization. For on-premises, cloud, and hybrid environments.",
        "features": ["24/7 server monitoring and alerting", "Automated patching and updates", "Performance optimization and tuning", "Backup verification and testing", "Capacity planning and forecasting", "OS and application management", "Integration with VMware, Hyper-V, AWS, Azure", "Monthly performance and health reports"],
        "benefits": ["Achieve 99.9% server uptime", "Proactively prevent issues before they impact", "Optimize server performance and costs", "Ensure backups are always verified and ready"]
    },
    {
        "id": "it-voip-telephony",
        "title": "IT VoIP & Business Telephony Solutions",
        "category": "it", "industry": "technology", "icon": "📞", "popular": False,
        "pricing": {"basic": "$15/user/mo", "pro": "$25/user/mo", "enterprise": "Custom"},
        "description": "Modern business telephony with VoIP, SIP trunking, and unified communications. Crystal-clear voice, video, and messaging for distributed teams.",
        "features": ["VoIP phone system deployment", "SIP trunking for cost savings", "Auto-attendant and call routing", "Voicemail-to-email and transcription", "Call recording and analytics", "Integration with CRM and helpdesk", "Mobile and desktop softphones", "911 and compliance configuration"],
        "benefits": ["Reduce phone costs by 60% with VoIP", "Enable work-from-anywhere with softphones", "Improve customer experience with smart routing", "Scale phone system without adding hardware"]
    },
    # AI SERVICES (5)
    {
        "id": "ai-clinical-trial-analytics",
        "title": "AI Clinical Trial Design & Analytics Platform",
        "category": "ai", "industry": "healthcare", "icon": "🧬", "popular": False,
        "pricing": {"basic": "$4,999/mo", "pro": "$12,000/mo", "enterprise": "Custom"},
        "description": "AI-powered clinical trial design, patient matching, and analytics. Accelerate drug discovery and improve trial success rates with predictive modeling.",
        "features": ["AI trial design optimization", "Patient recruitment and matching", "Adverse event prediction", "Biomarker discovery and analysis", "Real-time trial analytics dashboard", "Integration with EDC and CTMS systems", "Regulatory compliance (FDA, EMA)", "Predictive modeling for trial outcomes"],
        "benefits": ["Accelerate trial timelines by 30%", "Improve patient recruitment by 50%", "Predict adverse events before they occur", "Increase trial success rates with AI insights"]
    },
    {
        "id": "ai-smart-contract-auditor",
        "title": "AI Smart Contract Security Auditor",
        "category": "ai", "industry": "blockchain", "icon": "🔐", "popular": False,
        "pricing": {"basic": "$999/mo", "pro": "$2,999/mo", "enterprise": "Custom"},
        "description": "AI-powered smart contract security auditing for Ethereum, Solana, and EVM chains. Detect vulnerabilities, gas optimizations, and logic errors before deployment.",
        "features": ["Automated vulnerability detection", "Gas optimization recommendations", "Logic error and edge case identification", "DeFi protocol risk assessment", "Integration with Hardhat, Foundry, Remix", "Custom rule creation for your standards", "Audit report generation", "Continuous monitoring post-deployment"],
        "benefits": ["Audit smart contracts 10x faster", "Detect 95% of common vulnerabilities", "Optimize gas costs by 30%", "Prevent costly exploits with pre-deployment audits"]
    },
    {
        "id": "ai-predictive-inventory",
        "title": "AI Predictive Inventory & Demand Sensing",
        "category": "ai", "industry": "supply-chain", "icon": "📦", "popular": False,
        "pricing": {"basic": "$1,499/mo", "pro": "$3,999/mo", "enterprise": "Custom"},
        "description": "AI demand sensing that predicts what customers will buy before they order. Reduce stockouts by 80% and inventory costs by 25% with real-time demand signals.",
        "features": ["Real-time demand sensing from multiple signals", "AI forecasting with weather, events, social trends", "Automatic replenishment recommendations", "Multi-echelon inventory optimization", "Integration with ERP, WMS, and e-commerce platforms", "Promotion and seasonal planning", "Supplier collaboration portal", "Analytics on forecast accuracy and inventory health"],
        "benefits": ["Reduce stockouts by 80%", "Cut inventory costs by 25%", "Sense demand changes in real-time", "Automate replenishment decisions"]
    },
    {
        "id": "ai-emotion-detection",
        "title": "AI Emotion Detection & Customer Experience Analytics",
        "category": "ai", "industry": "customer-success", "icon": "😊", "popular": False,
        "pricing": {"basic": "$799/mo", "pro": "$2,499/mo", "enterprise": "Custom"},
        "description": "AI that detects customer emotions in real-time across voice, chat, and video. Improve customer experience by understanding how customers feel at every interaction.",
        "features": ["Real-time emotion detection from voice (calls)", "Text emotion analysis (chat, email, social)", "Video emotion analysis (facial expressions)", "Agent guidance based on detected emotions", "Integration with contact center platforms", "Customer journey emotion mapping", "Training recommendations for agents", "GDPR/privacy-compliant processing"],
        "benefits": ["Understand customer emotions at every touchpoint", "Improve CSAT by 20% with emotion-aware service", "Train agents with real emotion data", "Deliver empathetic customer experiences at scale"]
    },
    {
        "id": "ai-geospatial-analytics",
        "title": "AI Geospatial Analytics & Location Intelligence",
        "category": "ai", "industry": "technology", "icon": "🗺️", "popular": False,
        "pricing": {"basic": "$1,999/mo", "pro": "$4,999/mo", "enterprise": "Custom"},
        "description": "AI-powered geospatial analysis for site selection, logistics optimization, and market intelligence. Analyze satellite imagery, foot traffic, and geographic data.",
        "features": ["Site selection AI based on demographic and traffic data", "Foot traffic analysis and prediction", "Satellite imagery analysis", "Trade area and catchment analysis", "Integration with Google Maps, Esri, Mapbox", "Custom geospatial model training", "Real-time location analytics API", "Competitive location intelligence"],
        "benefits": ["Make data-driven location decisions", "Optimize delivery routes and logistics", "Understand market potential by geography", "Monitor assets and operations from satellite data"]
    },
]

def make_ts_entry(s):
    return f"""  {{
    id: '{s['id']}',
    title: '{s['title']}',
    description: '{s['description']}',
    features: {json.dumps(s['features'])},
    benefits: {json.dumps(s['benefits'])},
    pricing: {{ basic: '{s['pricing']['basic']}', pro: '{s['pricing']['pro']}', enterprise: '{s['pricing']['enterprise']}' }},
    contactInfo: {{ website: '/services/{s['id']}', email: '{E}', phone: '{P}' }},
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
for svc in NEW:
    if svc['id'] not in existing_ids:
        svc['contactInfo'] = {"website": f"/services/{svc['id']}", "email": E, "phone": P, "address": "364 E Main St STE 1008, Middletown, DE 19709"}
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

for array_name, entries, nxt in [
    ('aiServices', ai_entries, 'export const itServices'),
    ('itServices', it_entries, 'export const cloudServices'),
    ('securityServices', sec_entries, 'export const dataServices'),
]:
    if not entries:
        continue
    arr_start = content.find(f'export const {array_name}')
    next_start = content.find(nxt, arr_start)
    close = content.rfind('];', arr_start, next_start) if next_start != -1 else content.rfind('];', arr_start)
    if close != -1:
        entries_str = ',\n' + ',\n'.join(make_ts_entry(e) for e in entries)
        content = content[:close] + entries_str + content[close:]
        print(f"  ✅ {array_name}: {len(entries)} entries")
    else:
        print(f"  ❌ {array_name}: closing not found")

with open(SERVICES_TS, 'w') as f:
    f.write(content)
