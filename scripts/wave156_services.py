#!/usr/bin/env python3
"""Wave 156 - 15 new real, useful, diversified services."""
import json

SERVICES_JSON = 'app/data/servicesData.json'
SERVICES_TS = 'app/data/servicesData.ts'
E = "kleber@ziontechgroup.com"
P = "+1 302 464 0950"

NEW = [
    # ===== MICRO-SAAS (5) =====
    {
        "id": "micro-saas-ai-pricing-optimizer",
        "title": "AI Dynamic Pricing & Revenue Optimization",
        "category": "ai", "industry": "e-commerce", "icon": "💰", "popular": True,
        "pricing": {"basic": "$199/mo", "pro": "$599/mo", "enterprise": "Custom"},
        "description": "AI-powered dynamic pricing that maximizes revenue by adjusting prices in real-time based on demand, competition, inventory, and customer behavior.",
        "features": ["Real-time competitor price monitoring", "AI demand-based pricing algorithms", "A/B testing for price points", "Inventory-aware pricing rules", "Customer segment-specific pricing", "Integration with Shopify, Amazon, WooCommerce", "Revenue attribution and margin analytics", "Price elasticity modeling per product"],
        "benefits": ["Increase revenue by 15-25% with optimized pricing", "React to market changes in minutes, not days", "Maximize margins with AI-driven pricepoints", "Test pricing strategies risk-free"]
    },
    {
        "id": "micro-saas-ai-employee-scheduling",
        "title": "AI Employee Scheduling & Workforce Planning",
        "category": "ai", "industry": "hr-tech", "icon": "📅", "popular": False,
        "pricing": {"basic": "$8/employee/mo", "pro": "$15/employee/mo", "enterprise": "Custom"},
        "description": "AI-powered employee scheduling that optimizes shifts based on demand forecasts, employee preferences, skills, and labor law compliance.",
        "features": ["AI demand forecasting for staffing needs", "Auto-scheduling with employee preference matching", "Labor law compliance checking (breaks, overtime, minors)", "Shift swapping and open shift marketplace", "Time and attendance tracking", "Integration with payroll systems", "Mobile app for employees", "Analytics on labor costs and overtime"],
        "benefits": ["Reduce labor costs by 15%", "Eliminate scheduling conflicts automatically", "Ensure 100% labor law compliance", "Improve employee satisfaction with preference matching"]
    },
    {
        "id": "micro-saas-ai-knowledge-quality",
        "title": "AI Knowledge Base Quality & Freshness Monitor",
        "category": "ai", "industry": "productivity", "icon": "📚", "popular": False,
        "pricing": {"basic": "$99/mo", "pro": "$299/mo", "enterprise": "Custom"},
        "description": "AI that monitors your knowledge base for outdated, conflicting, or gaps in content. Automatically flags articles for review and suggests updates.",
        "features": ["AI content freshness scoring", "Automatic conflict detection between articles", "Gap analysis vs customer questions", "Integration with Confluence, Notion, Zendesk", "Automated article decay alerts", "AI-generated update suggestions", "Analytics on article usefulness", "Version comparison and change tracking"],
        "benefits": ["Keep 100% of KB articles up to date", "Reduce support tickets from outdated content", "Identify knowledge gaps before customers do", "Automate content review workflows"]
    },
    {
        "id": "micro-saas-ai-contract-comparison",
        "title": "AI Contract Comparison & Deviation Analysis",
        "category": "ai", "industry": "legal-tech", "icon": "📑", "popular": False,
        "pricing": {"basic": "$349/mo", "pro": "$999/mo", "enterprise": "Custom"},
        "description": "AI that compares contracts against your standard templates and flags deviations, risks, and missing clauses. Reduce legal review time by 80%.",
        "features": ["AI deviation detection vs standard templates", "Missing clause identification", "Risk scoring per deviation", "Bulk contract comparison", "Integration with DocuSign, SharePoint, Dropbox", "Negotiation history tracking", "Approval workflow automation", "Audit trail for all comparisons"],
        "benefits": ["80% faster contract review", "Catch risky deviations human reviewers miss", "Enforce standard terms automatically", "Track negotiation changes across versions"]
    },
    {
        "id": "micro-saas-ai-community-moderation",
        "title": "AI Community Moderation & Engagement Platform",
        "category": "ai", "industry": "technology", "icon": "👥", "popular": False,
        "pricing": {"basic": "$149/mo", "pro": "$449/mo", "enterprise": "Custom"},
        "description": "AI-powered community moderation that detects toxicity, spam, and policy violations while boosting healthy engagement. For forums, Discord, Slack, and social.",
        "features": ["Real-time toxicity and hate speech detection", "Spam and bot detection", "Policy violation flagging with context", "Engagement scoring and trending content ID", "Integration with Discord, Slack, Discourse, Reddit", "Automated warnings and escalation", "Community health dashboards", "Custom moderation rule builder"],
        "benefits": ["Moderate communities 24/7 without human moderators", "Detect toxic content with 98% accuracy", "Boost healthy engagement by 40%", "Scale community management as you grow"]
    },
    # ===== IT SERVICES (5) =====
    {
        "id": "it-mainframe-modernization",
        "title": "IT Mainframe Modernization & Migration",
        "category": "it", "industry": "technology", "icon": "🖥️", "popular": True,
        "pricing": {"basic": "$15,000/mo", "pro": "$35,000/mo", "enterprise": "Custom"},
        "description": "Modernize legacy mainframe applications to cloud-native platforms. Rehost, refactor, or replace COBOL, PL/I, and legacy systems with modern architectures.",
        "features": ["Mainframe assessment and modernization roadmap", "COBOL/PL/I to Java/Python conversion", "Data migration from DB2, IMS, VSAM", "API layer for legacy system integration", "Phased migration with zero downtime", "Automated code analysis and documentation", "Integration with AWS Mainframe Modernization, Azure", "Post-migration optimization and support"],
        "benefits": ["Reduce mainframe costs by 60%", "Eliminate COBOL skill dependency", "Modernize without business disruption", "Unlock legacy data for analytics and AI"]
    },
    {
        "id": "it-unified-communications",
        "title": "IT Unified Communications & Collaboration",
        "category": "it", "industry": "technology", "icon": "📞", "popular": True,
        "pricing": {"basic": "$12/user/mo", "pro": "$22/user/mo", "enterprise": "Custom"},
        "description": "Design and deploy unified communications with Teams, Zoom, or Cisco. Voice, video, messaging, and collaboration in one platform.",
        "features": ["Microsoft Teams / Zoom / Cisco deployment", "VoIP and PBX migration", "Video conferencing room design", "Contact center integration", "Unified messaging and presence", "Integration with CRM and business apps", "Network assessment and QoS configuration", "Training and change management"],
        "benefits": ["Reduce communication costs by 40%", "Improve collaboration across locations", "Consolidate vendors into one platform", "Enable seamless hybrid work"]
    },
    {
        "id": "it-data-migration",
        "title": "IT Data Migration & Database Consolidation",
        "category": "it", "industry": "technology", "icon": "🔄", "popular": False,
        "pricing": {"basic": "$5,000/mo", "pro": "$12,000/mo", "enterprise": "Custom"},
        "description": "End-to-end data migration services — from legacy databases to modern platforms. Zero-downtime migration with automated validation and rollback.",
        "features": ["Source system assessment and mapping", "ETL pipeline development and testing", "Zero-downtime migration execution", "Automated data validation and reconciliation", "Rollback planning and testing", "Integration with Oracle, SQL Server, MongoDB, PostgreSQL", "Performance optimization post-migration", "Documentation and knowledge transfer"],
        "benefits": ["Migrate with zero downtime", "Ensure 100% data accuracy with automated validation", "Reduce database costs by 40%", "Modernize without business disruption"]
    },
    {
        "id": "it-application-modernization",
        "title": "IT Application Modernization & Cloud-Native Dev",
        "category": "it", "industry": "technology", "icon": "⚡", "popular": False,
        "pricing": {"basic": "$8,000/mo", "pro": "$20,000/mo", "enterprise": "Custom"},
        "description": "Transform monolithic applications into cloud-native microservices. Containerization, API development, and CI/CD pipeline implementation.",
        "features": ["Application assessment and modernization strategy", "Monolith to microservices decomposition", "Containerization with Docker and Kubernetes", "API development and management", "CI/CD pipeline implementation", "Integration with AWS, Azure, GCP", "Automated testing and quality gates", "Performance optimization and monitoring"],
        "benefits": ["Deploy 10x faster with cloud-native architecture", "Reduce infrastructure costs by 50%", "Improve application resilience and scalability", "Enable continuous delivery and innovation"]
    },
    {
        "id": "it-compliance-automation",
        "title": "IT Compliance Automation & Continuous Auditing",
        "category": "security", "industry": "technology", "icon": "✅", "popular": True,
        "pricing": {"basic": "$3,000/mo", "pro": "$7,500/mo", "enterprise": "Custom"},
        "description": "Automate compliance for SOC 2, HIPAA, PCI DSS, ISO 27001, and GDPR. Continuous monitoring, evidence collection, and audit-ready reporting.",
        "features": ["Continuous compliance monitoring", "Automated evidence collection", "Policy enforcement and drift detection", "Audit-ready report generation", "Risk assessment and remediation tracking", "Multi-framework support (SOC 2, HIPAA, PCI, ISO, GDPR)", "Integration with AWS, Azure, GCP security tools", "Executive compliance dashboards"],
        "benefits": ["Reduce audit prep time by 80%", "Continuous compliance not point-in-time", "Automate evidence collection", "Pass audits with confidence"]
    },
    # ===== AI SERVICES (5) =====
    {
        "id": "ai-recommendation-engine",
        "title": "AI Recommendation Engine for E-Commerce & Media",
        "category": "ai", "industry": "e-commerce", "icon": "🎯", "popular": True,
        "pricing": {"basic": "$499/mo", "pro": "$1,499/mo", "enterprise": "Custom"},
        "description": "AI recommendation engine that delivers personalized product, content, and media recommendations. Increase conversion by 35% and engagement by 50%.",
        "features": ["Collaborative and content-based filtering", "Real-time personalization", "A/B testing for recommendation strategies", "Integration with Shopify, Magento, custom platforms", "Cold start handling for new users/items", "Multi-channel recommendations (web, email, mobile)", "Analytics on recommendation performance", "Custom model training for your catalog"],
        "benefits": ["35% increase in conversion rates", "50% higher engagement with personalized content", "Increase average order value by 20%", "Deliver Netflix-quality recommendations for your business"]
    },
    {
        "id": "ai-fraud-detection",
        "title": "AI Fraud Detection & Prevention Platform",
        "category": "ai", "industry": "finance", "icon": "🚨", "popular": True,
        "pricing": {"basic": "$1,999/mo", "pro": "$5,999/mo", "enterprise": "Custom"},
        "description": "Real-time AI fraud detection for payments, accounts, and transactions. Analyze patterns, device fingerprints, and behavioral biometrics to stop fraud before it happens.",
        "features": ["Real-time transaction scoring", "Behavioral biometrics and device fingerprinting", "Account takeover detection", "Synthetic identity fraud detection", "AML and sanctions screening", "Case management and investigation tools", "Integration with payment processors", "Regulatory reporting and audit trails"],
        "benefits": ["Block 99.5% of fraudulent transactions", "Reduce false positives by 60%", "Prevent account takeovers in real-time", "Meet AML and KYC compliance requirements"]
    },
    {
        "id": "ai-supply-chain-visibility",
        "title": "AI Supply Chain Visibility & Risk Management",
        "category": "ai", "industry": "supply-chain", "icon": "🔗", "popular": False,
        "pricing": {"basic": "$2,999/mo", "pro": "$7,999/mo", "enterprise": "Custom"},
        "description": "AI-powered supply chain visibility with real-time tracking, risk monitoring, and disruption prediction. See your entire supply chain in one dashboard.",
        "features": ["Real-time shipment tracking and ETA prediction", "Supplier risk scoring and monitoring", "Disruption prediction (weather, geopolitical, financial)", "Inventory optimization across the chain", "Integration with SAP, Oracle, Kinaxis", "What-if scenario modeling", "Sustainability and carbon tracking", "Executive supply chain dashboards"],
        "benefits": ["Predict disruptions 30 days in advance", "Reduce inventory costs by 25%", "Improve on-time delivery by 20%", "See your entire supply chain in one view"]
    },
    {
        "id": "ai-customer-segmentation",
        "title": "AI Customer Segmentation & Lifetime Value Prediction",
        "category": "ai", "industry": "marketing", "icon": "🎨", "popular": False,
        "pricing": {"basic": "$799/mo", "pro": "$2,499/mo", "enterprise": "Custom"},
        "description": "AI-powered customer segmentation that goes beyond demographics. Behavioral clustering, lifetime value prediction, and next-best-action for each segment.",
        "features": ["AI behavioral clustering and segmentation", "Customer lifetime value (LTV) prediction", "Churn risk scoring per segment", "Next-best-action recommendations", "Integration with CRM, CDP, and marketing automation", "Segment migration tracking", "A/B testing per segment", "Revenue attribution by segment"],
        "benefits": ["Increase marketing ROI by 40%", "Predict LTV with 90%+ accuracy", "Reduce churn with targeted retention", "Personalize at scale with AI segments"]
    },
    {
        "id": "ai-digital-twin",
        "title": "AI Digital Twin & Simulation Platform",
        "category": "ai", "industry": "manufacturing", "icon": "🏭", "popular": False,
        "pricing": {"basic": "$4,999/mo", "pro": "$12,000/mo", "enterprise": "Custom"},
        "description": "Create digital twins of physical assets, processes, and systems. Simulate scenarios, predict failures, and optimize operations with AI-powered simulation.",
        "features": ["3D digital twin modeling from CAD and IoT data", "Real-time sensor data integration", "Predictive simulation and what-if analysis", "Failure prediction and maintenance optimization", "Integration with SCADA, MES, and IoT platforms", "Custom physics-based and ML models", "Collaborative simulation environment", "Executive dashboards and reporting"],
        "benefits": ["Reduce unplanned downtime by 50%", "Optimize operations with virtual testing", "Predict failures 30 days in advance", "Simulate changes without disrupting production"]
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

for array_name, entries, next_export in [
    ('aiServices', ai_entries, 'export const itServices'),
    ('itServices', it_entries, 'export const cloudServices'),
    ('securityServices', sec_entries, 'export const dataServices'),
]:
    if not entries:
        continue
    arr_start = content.find(f'export const {array_name}')
    next_start = content.find(next_export, arr_start)
    close = content.rfind('];', arr_start, next_start) if next_start != -1 else content.rfind('];', arr_start)
    if close != -1:
        entries_str = ',\n' + ',\n'.join(make_ts_entry(e) for e in entries)
        content = content[:close] + entries_str + content[close:]
        print(f"  ✅ {array_name}: {len(entries)} entries")
    else:
        print(f"  ❌ {array_name}: closing not found")

with open(SERVICES_TS, 'w') as f:
    f.write(content)
