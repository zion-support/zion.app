#!/usr/bin/env python3
"""Wave 158 - 15 new real services."""
import json

SERVICES_JSON = 'app/data/servicesData.json'
SERVICES_TS = 'app/data/servicesData.ts'
E = "kleber@ziontechgroup.com"
P = "+1 302 464 0950"

NEW = [
    # MICRO-SAAS (5)
    {
        "id": "micro-saas-ai-menu-optimizer",
        "title": "AI Menu Engineering & Profit Optimizer",
        "category": "ai", "industry": "food-tech", "icon": "🍽️", "popular": False,
        "pricing": {"basic": "$149/mo", "pro": "$399/mo", "enterprise": "Custom"},
        "description": "AI-powered menu engineering for restaurants and food service. Analyzes sales data, food costs, and customer preferences to optimize menu pricing and layout for maximum profit.",
        "features": ["AI menu item profitability analysis", "Star/Puzzle/Plowhorse/Pet classification", "Dynamic pricing recommendations", "Food cost tracking and alerting", "Customer preference analysis from orders", "Integration with POS systems (Square, Toast, Clover)", "Menu A/B testing and simulation", "Seasonal menu optimization"],
        "benefits": ["Increase profit margins by 15-25%", "Identify hidden star items and costly dogs", "Optimize menu layout for higher check sizes", "Reduce food waste with demand prediction"]
    },
    {
        "id": "micro-saas-ai-fleet-optimizer",
        "title": "AI Fleet Management & Route Optimizer",
        "category": "ai", "industry": "logistics", "icon": "🚛", "popular": True,
        "pricing": {"basic": "$12/vehicle/mo", "pro": "$24/vehicle/mo", "enterprise": "Custom"},
        "description": "AI-powered fleet management with real-time route optimization, fuel savings, driver safety scoring, and predictive maintenance. Reduce fleet costs by 20%.",
        "features": ["Real-time GPS tracking and geofencing", "AI route optimization with traffic prediction", "Fuel consumption analysis and savings", "Driver safety scoring and coaching", "Predictive maintenance scheduling", "Integration with Samsara, Geotab, Verizon Connect", "Compliance (ELD, HOS, DVIR)", "Carbon emissions tracking and reporting"],
        "benefits": ["Reduce fuel costs by 20%", "Improve on-time delivery by 30%", "Lower accident rates with driver coaching", "Extend vehicle life with predictive maintenance"]
    },
    {
        "id": "micro-saas-ai-real-estate-valuation",
        "title": "AI Real Estate Valuation & Investment Analyzer",
        "category": "ai", "industry": "real-estate", "icon": "🏠", "popular": False,
        "pricing": {"basic": "$199/mo", "pro": "$599/mo", "enterprise": "Custom"},
        "description": "AI-powered property valuation and investment analysis. Instant appraisals, rental yield prediction, and market trend analysis for investors and agents.",
        "features": ["AI property valuation (AVM) with 95% accuracy", "Rental yield prediction and cash flow modeling", "Market trend analysis and forecasting", "Comparable sales analysis", "Integration with MLS, Zillow, Redfin", "Investment scoring and risk assessment", "Portfolio performance tracking", "Neighborhood scoring (schools, crime, appreciation)"],
        "benefits": ["Value properties instantly with AI", "Identify undervalued investment opportunities", "Predict rental income with 90% accuracy", "Track portfolio performance in real-time"]
    },
    {
        "id": "micro-saas-ai-personal-finance",
        "title": "AI Personal Finance Manager & Advisor",
        "category": "ai", "industry": "finance", "icon": "💵", "popular": True,
        "pricing": {"basic": "$9/mo", "pro": "$19/mo", "enterprise": "Custom"},
        "description": "AI-powered personal finance manager that categorizes spending, predicts cash flow, and provides personalized financial advice. Like having a financial advisor in your pocket.",
        "features": ["Automatic transaction categorization", "AI cash flow prediction and budgeting", "Bill negotiation and subscription optimization", "Savings goal tracking with AI recommendations", "Investment portfolio analysis", "Integration with banks via Plaid", "Credit score monitoring and improvement tips", "Tax optimization suggestions"],
        "benefits": ["Save 20% more with AI-optimized budgets", "Negotiate bills automatically", "Predict cash flow 30 days ahead", "Get personalized financial advice 24/7"]
    },
    {
        "id": "micro-saas-ai-learning-platform",
        "title": "AI Adaptive Learning & Training Platform",
        "category": "ai", "industry": "edtech", "icon": "🎓", "popular": False,
        "pricing": {"basic": "$15/user/mo", "pro": "$35/user/mo", "enterprise": "Custom"},
        "description": "AI-powered adaptive learning platform that personalizes training content for each learner. Used by companies for employee training and by educators for student success.",
        "features": ["AI content personalization per learner", "Knowledge gap identification", "Adaptive assessments and quizzes", "Learning path recommendations", "Integration with LMS (Canvas, Moodle, Cornerstone)", "Skills tracking and certification", "Engagement analytics and nudges", "Content authoring with AI assistance"],
        "benefits": ["Improve learning outcomes by 40%", "Reduce training time with personalized paths", "Identify skill gaps automatically", "Scale training without adding instructors"]
    },
    # IT SERVICES (5)
    {
        "id": "it-erp-implementation",
        "title": "IT ERP Implementation & Business Process Automation",
        "category": "it", "industry": "technology", "icon": "🏗️", "popular": True,
        "pricing": {"basic": "$10,000/mo", "pro": "$25,000/mo", "enterprise": "Custom"},
        "description": "End-to-end ERP implementation and business process automation. SAP, Oracle, NetSuite, or Microsoft Dynamics — from selection to go-live and optimization.",
        "features": ["ERP selection and vendor evaluation", "Business process analysis and redesign", "System configuration and customization", "Data migration and validation", "Integration with existing systems", "User training and change management", "Post-go-live support and optimization", "Ongoing managed services"],
        "benefits": ["Automate 80% of manual processes", "Reduce operational costs by 30%", "Real-time visibility across the business", "Scale without adding administrative headcount"]
    },
    {
        "id": "it-crm-implementation",
        "title": "IT CRM Implementation & Customer Data Platform",
        "category": "it", "industry": "technology", "icon": "🤝", "popular": True,
        "pricing": {"basic": "$3,000/mo", "pro": "$8,000/mo", "enterprise": "Custom"},
        "description": "CRM implementation and customer data platform setup. Salesforce, HubSpot, or Microsoft Dynamics — with custom workflows, integrations, and analytics.",
        "features": ["CRM selection and licensing optimization", "Custom object and workflow design", "Sales process automation", "Marketing automation integration", "Customer data platform (CDP) setup", "Integration with ERP, marketing, and support tools", "Custom dashboards and reporting", "User training and adoption programs"],
        "benefits": ["Increase sales productivity by 35%", "Unify customer data across all systems", "Automate sales and marketing workflows", "Improve customer retention with 360-degree view"]
    },
    {
        "id": "it-integration-platform",
        "title": "IT Integration Platform & API Management",
        "category": "it", "industry": "technology", "icon": "🔌", "popular": False,
        "pricing": {"basic": "$2,000/mo", "pro": "$5,000/mo", "enterprise": "Custom"},
        "description": "Connect all your systems with an integration platform. API management, data synchronization, and workflow automation across cloud and on-premises applications.",
        "features": ["Integration platform selection and setup", "API design, development, and management", "Data synchronization across systems", "Event-driven architecture implementation", "Integration with 500+ SaaS applications", "Monitoring and error handling", "Security and compliance for integrations", "Integration analytics and optimization"],
        "benefits": ["Connect all systems without custom code", "Automate data flow between applications", "Reduce integration costs by 60%", "Enable real-time data across the organization"]
    },
    {
        "id": "it-quality-assurance",
        "title": "IT Quality Assurance & Testing Automation",
        "category": "it", "industry": "technology", "icon": "🧪", "popular": False,
        "pricing": {"basic": "$3,000/mo", "pro": "$7,000/mo", "enterprise": "Custom"},
        "description": "Comprehensive QA and testing automation. From manual testing to full test automation with CI/CD integration. Ensure quality at speed.",
        "features": ["Test strategy and planning", "Test automation framework development", "Selenium, Cypress, Playwright automation", "Performance and load testing", "Security testing and vulnerability scanning", "CI/CD pipeline integration", "Test reporting and analytics", "Dedicated QA engineers and managers"],
        "benefits": ["Reduce testing time by 70% with automation", "Catch 95% of bugs before production", "Enable continuous delivery with confidence", "Reduce QA costs while improving quality"]
    },
    {
        "id": "it-disaster-recovery",
        "title": "IT Disaster Recovery & Business Continuity",
        "category": "it", "industry": "technology", "icon": "🛟", "popular": True,
        "pricing": {"basic": "$2,500/mo", "pro": "$6,000/mo", "enterprise": "Custom"},
        "description": "Comprehensive disaster recovery and business continuity planning. Ensure your business survives any disruption with tested DR plans and automated failover.",
        "features": ["Business impact analysis and risk assessment", "DR plan design and documentation", "Automated backup and replication", "Cloud-based DR site setup", "Regular DR testing and validation", "Failover and failback automation", "Communication plans and stakeholder notification", "Compliance alignment (ISO 22301, SOC 2)"],
        "benefits": ["Achieve RTO under 1 hour", "Test DR plans without disrupting production", "Meet compliance for business continuity", "Reduce downtime costs by 95%"]
    },
    # AI SERVICES (5)
    {
        "id": "ai-legal-document-drafter",
        "title": "AI Legal Document Drafting & Automation",
        "category": "ai", "industry": "legal-tech", "icon": "📝", "popular": True,
        "pricing": {"basic": "$349/mo", "pro": "$999/mo", "enterprise": "Custom"},
        "description": "AI-powered legal document drafting that generates contracts, NDAs, and legal letters from templates and natural language descriptions. Reduce drafting time by 90%.",
        "features": ["AI document generation from templates", "Natural language to contract conversion", "Clause library with 1000+ pre-approved clauses", "Redline and comparison tools", "Integration with DocuSign and CLM systems", "Custom template builder", "Version control and approval workflows", "Compliance checking against jurisdiction requirements"],
        "benefits": ["Draft legal documents 90% faster", "Reduce legal drafting costs by 70%", "Ensure consistency with approved clauses", "Scale legal operations without adding attorneys"]
    },
    {
        "id": "ai-crop-yield-predictor",
        "title": "AI Crop Yield Prediction & Precision Agriculture",
        "category": "ai", "industry": "agritech", "icon": "🌾", "popular": False,
        "pricing": {"basic": "$499/mo", "pro": "$1,499/mo", "enterprise": "Custom"},
        "description": "AI-powered precision agriculture with crop yield prediction, soil analysis, and irrigation optimization. Increase yields by 20% while reducing water and fertilizer use.",
        "features": ["Satellite and drone imagery analysis", "Crop yield prediction with weather integration", "Soil health monitoring and recommendations", "Irrigation optimization and scheduling", "Pest and disease early detection", "Integration with farm management software", "Field-level analytics and reporting", "Sustainability and carbon credit tracking"],
        "benefits": ["Increase crop yields by 20%", "Reduce water usage by 30%", "Detect pests and disease 2 weeks early", "Optimize fertilizer application with AI"]
    },
    {
        "id": "ai-drug-discovery",
        "title": "AI Drug Discovery & Molecular Design Platform",
        "category": "ai", "industry": "healthcare", "icon": "💊", "popular": False,
        "pricing": {"basic": "$9,999/mo", "pro": "$24,000/mo", "enterprise": "Custom"},
        "description": "AI-powered drug discovery that accelerates molecular design, predicts drug-target interactions, and identifies promising compounds. Reduce discovery timelines by 50%.",
        "features": ["AI molecular generation and optimization", "Drug-target interaction prediction", "ADMET (absorption, distribution, metabolism, excretion) prediction", "Virtual screening of compound libraries", "Protein structure prediction (AlphaFold integration)", "Clinical trial candidate prioritization", "Integration with LIMS and ELN systems", "Regulatory compliance documentation"],
        "benefits": ["Reduce drug discovery timelines by 50%", "Screen millions of compounds in hours", "Predict drug efficacy and safety earlier", "Lower R&D costs with AI-driven prioritization"]
    },
    {
        "id": "ai-autonomous-vehicles",
        "title": "AI Autonomous Vehicle Perception & Planning",
        "category": "ai", "industry": "automotive", "icon": "🚗", "popular": False,
        "pricing": {"basic": "$4,999/mo", "pro": "$12,000/mo", "enterprise": "Custom"},
        "description": "AI perception and planning stack for autonomous vehicles. Object detection, path planning, and decision-making for self-driving cars, trucks, and drones.",
        "features": ["Multi-sensor fusion (camera, LiDAR, radar)", "Real-time object detection and tracking", "Path planning and trajectory optimization", "Behavior prediction for other road users", "Simulation environment for testing", "Edge deployment on NVIDIA, Qualcomm platforms", "Safety validation and verification", "HD map integration and localization"],
        "benefits": ["Detect objects with 99.9% accuracy", "Plan safe paths in complex environments", "Test millions of scenarios in simulation", "Deploy to edge with real-time performance"]
    },
    {
        "id": "ai-quantum-computing",
        "title": "AI Quantum Computing & Optimization Services",
        "category": "ai", "industry": "technology", "icon": "⚛️", "popular": False,
        "pricing": {"basic": "$5,000/mo", "pro": "$15,000/mo", "enterprise": "Custom"},
        "description": "Quantum computing and quantum-inspired optimization for complex problems. Portfolio optimization, logistics, drug discovery, and cryptography with quantum advantage.",
        "features": ["Quantum algorithm design and implementation", "Quantum-inspired classical optimization", "Portfolio and risk optimization", "Supply chain and logistics optimization", "Quantum machine learning", "Integration with IBM Q, Google Cirq, Amazon Braket", "Hybrid quantum-classical workflows", "Quantum readiness assessment and roadmap"],
        "benefits": ["Solve optimization problems 1000x faster", "Find optimal solutions for NP-hard problems", "Prepare for quantum advantage in your industry", "Hybrid approach delivers value today"]
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
