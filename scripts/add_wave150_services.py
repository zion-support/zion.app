#!/usr/bin/env python3
"""Add Wave 150 services."""
import json, os

SERVICES_FILE = os.path.join(os.path.dirname(__file__), '..', 'app', 'data', 'servicesData.json')
CONTACT = {"website": "https://ziontechgroup.com", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"}

new_services = [
    # MICRO-SAAS (5)
    {
        "id": "micro-saas-ai-review-aggregator",
        "title": "Micro-SaaS AI Review Aggregator & Response Manager",
        "description": "Aggregate reviews from Google, Yelp, Amazon, Trustpilot, and 20+ platforms into one dashboard. AI analyzes sentiment, generates response drafts, and tracks review trends.",
        "features": ["Multi-platform review aggregation (20+ sources)", "AI sentiment and topic analysis", "Auto-generated response drafts", "Competitor review benchmarking", "Review request automation via email/SMS", "Alert system for negative reviews"],
        "benefits": ["Manage all reviews from one place", "Respond 5x faster with AI drafts", "Improve ratings with proactive requests", "Benchmark against competitors"],
        "pricing": {"basic": "$59/mo", "pro": "$149/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "⭐", "href": "/services/micro-saas-ai-review-aggregator",
        "popular": True, "category": "micro-saas", "industry": "marketing", "stage": "published"
    },
    {
        "id": "micro-saas-ai-hiring-pipeline",
        "title": "Micro-SaaS AI Hiring Pipeline & ATS",
        "description": "Lightweight AI-powered applicant tracking system for SMBs. Smart resume parsing, candidate scoring, interview scheduling, and offer management — all in one affordable platform.",
        "features": ["AI resume parsing and candidate scoring", "Smart job description generator", "Automated interview scheduling", "Candidate communication templates", "Offer letter generation and e-signature", "Diversity and compliance reporting"],
        "benefits": ["Reduce time-to-hire by 50%", "Screen 100 resumes in minutes", "Eliminate scheduling back-and-forth", "Affordable for small businesses"],
        "pricing": {"basic": "$99/mo", "pro": "$249/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "👥", "href": "/services/micro-saas-ai-hiring-pipeline",
        "popular": True, "category": "micro-saas", "industry": "hr-tech", "stage": "published"
    },
    {
        "id": "micro-saas-ai-inventory-forecaster",
        "title": "Micro-SaaS AI Inventory Forecaster",
        "description": "AI inventory forecasting for e-commerce and retail. Predicts demand, optimizes reorder points, and prevents stockouts while minimizing carrying costs.",
        "features": ["ML demand forecasting per SKU", "Automated reorder point calculation", "Seasonal trend detection", "Supplier lead time tracking", "Multi-location inventory optimization", "Integration with Shopify, WooCommerce, Amazon"],
        "benefits": ["Reduce stockouts by 70%", "Lower carrying costs by 25%", "Optimize cash flow tied up in inventory", "Scale inventory without adding planners"],
        "pricing": {"basic": "$79/mo", "pro": "$199/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "📦", "href": "/services/micro-saas-ai-inventory-forecaster",
        "popular": False, "category": "micro-saas", "industry": "retail", "stage": "published"
    },
    {
        "id": "micro-saas-ai-meeting-minutes",
        "title": "Micro-SaaS AI Meeting Minutes & Action Tracker",
        "description": "AI meeting assistant that transcribes, summarizes, and tracks action items from video calls. Integrates with Zoom, Teams, and Google Meet. Never lose an action item again.",
        "features": ["Real-time transcription for Zoom, Teams, Meet", "AI summary with key decisions and action items", "Automatic action item assignment with deadlines", "Searchable meeting archive", "Integration with project management tools", "Multi-language support (30+ languages)"],
        "benefits": ["Capture 100% of meeting decisions", "Track action items automatically", "Search past meetings in seconds", "Reduce meeting follow-up time by 80%"],
        "pricing": {"basic": "$15/user/mo", "pro": "$30/user/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "📝", "href": "/services/micro-saas-ai-meeting-minutes",
        "popular": True, "category": "micro-saas", "industry": "productivity", "stage": "published"
    },
    {
        "id": "micro-saas-ai-customer-portal",
        "title": "Micro-SaaS AI Customer Self-Service Portal",
        "description": "White-label customer portal with AI chatbot, knowledge base, ticket management, and account management. Reduce support tickets by 40% with self-service.",
        "features": ["AI chatbot trained on your knowledge base", "Self-service account management", "Ticket creation and tracking", "Knowledge base with smart search", "Custom branding and white-labeling", "Integration with Zendesk, Intercom, Salesforce"],
        "benefits": ["Reduce support tickets by 40%", "24/7 self-service for customers", "Improve CSAT with instant answers", "Launch in days not months"],
        "pricing": {"basic": "$199/mo", "pro": "$499/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "🏢", "href": "/services/micro-saas-ai-customer-portal",
        "popular": False, "category": "micro-saas", "industry": "technology", "stage": "published"
    },
    # IT SERVICES (5)
    {
        "id": "it-compliance-automation",
        "title": "IT Compliance Automation & Audit Readiness",
        "description": "Automate compliance for SOC 2, HIPAA, PCI DSS, ISO 27001, and GDPR. Continuous monitoring, evidence collection, and audit-ready reporting.",
        "features": ["Continuous compliance monitoring", "Automated evidence collection", "Policy management and enforcement", "Audit-ready report generation", "Risk assessment and remediation tracking", "Multi-framework support (SOC 2, HIPAA, PCI, ISO, GDPR)"],
        "benefits": ["Reduce audit prep time by 80%", "Continuous compliance not point-in-time", "Automate evidence collection", "Pass audits with confidence"],
        "pricing": {"basic": "$3,000/mo", "pro": "$7,500/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "📋", "href": "/services/it-compliance-automation",
        "popular": True, "category": "security", "industry": "technology", "stage": "published"
    },
    {
        "id": "it-database-optimization",
        "title": "IT Database Optimization & Performance Tuning",
        "description": "Expert database optimization for PostgreSQL, MySQL, MongoDB, SQL Server, and Oracle. Improve query performance by 10x, reduce costs, and ensure high availability.",
        "features": ["Query performance analysis and optimization", "Index strategy review and implementation", "Schema optimization and normalization", "Replication and high availability setup", "Migration planning and execution", "24/7 monitoring and alerting"],
        "benefits": ["10x faster query performance", "Reduce database costs by 40%", "Eliminate downtime with HA setup", "Scale databases without re-architecture"],
        "pricing": {"basic": "$2,500/mo", "pro": "$5,000/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "🗄️", "href": "/services/it-database-optimization",
        "popular": False, "category": "it", "industry": "technology", "stage": "published"
    },
    {
        "id": "it-api-management",
        "title": "IT API Management & Gateway Service",
        "description": "Full API lifecycle management with gateway, developer portal, analytics, and security. Design, publish, monitor, and monetize APIs at scale.",
        "features": ["API gateway with rate limiting and caching", "Developer portal with documentation", "API analytics and usage monitoring", "OAuth 2.0 / JWT security", "Versioning and lifecycle management", "Monetization and billing integration"],
        "benefits": ["Launch APIs in days not months", "Monitor usage and performance in real-time", "Monetize APIs with built-in billing", "Secure APIs with enterprise-grade auth"],
        "pricing": {"basic": "$1,500/mo", "pro": "$4,000/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "🔌", "href": "/services/it-api-management",
        "popular": True, "category": "it", "industry": "technology", "stage": "published"
    },
    {
        "id": "it-endpoint-management",
        "title": "IT Endpoint Management & MDM",
        "description": "Unified endpoint management for laptops, desktops, mobile devices, and IoT. Deploy software, enforce policies, and secure all devices from one console.",
        "features": ["Unified endpoint management (Windows, Mac, iOS, Android)", "Software deployment and patch management", "Device compliance and policy enforcement", "Remote troubleshooting and support", "Asset inventory and lifecycle management", "Integration with Intune, Jamf, SCCM"],
        "benefits": ["Manage all devices from one console", "Reduce endpoint security risks by 90%", "Automate software deployment", "Scale device management without adding staff"],
        "pricing": {"basic": "$4/device/mo", "pro": "$8/device/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "💻", "href": "/services/it-endpoint-management",
        "popular": False, "category": "it", "industry": "technology", "stage": "published"
    },
    {
        "id": "it-log-management",
        "title": "IT Log Management & SIEM",
        "description": "Centralized log management with real-time analysis, correlation, and alerting. Ingest logs from any source and detect threats, anomalies, and operational issues.",
        "features": ["Centralized log collection from any source", "Real-time log analysis and correlation", "Custom alerting and dashboards", "Compliance reporting (SOC 2, HIPAA, PCI)", "Long-term log retention and archiving", "Integration with 200+ data sources"],
        "benefits": ["Detect threats in real-time", "Meet compliance log retention requirements", "Troubleshoot issues 10x faster", "Centralize all logs in one platform"],
        "pricing": {"basic": "$500/mo", "pro": "$1,500/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "📊", "href": "/services/it-log-management",
        "popular": True, "category": "it", "industry": "technology", "stage": "published"
    },
    # AI SERVICES (5)
    {
        "id": "ai-translation-platform",
        "title": "AI Translation & Localization Platform",
        "description": "Enterprise AI translation platform with 100+ language pairs, domain-specific models, and human-in-the-loop review. Translate documents, websites, and apps at scale.",
        "features": ["AI translation for 100+ language pairs", "Domain-specific models (legal, medical, tech)", "Human-in-the-loop review workflow", "Website and app localization", "Translation memory and glossary management", "API for real-time translation"],
        "benefits": ["Translate 10x faster than human translators", "95%+ accuracy with domain models", "Reduce translation costs by 80%", "Localize products for global markets"],
        "pricing": {"basic": "$199/mo", "pro": "$499/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "🌍", "href": "/services/ai-translation-platform",
        "popular": True, "category": "ai", "industry": "technology", "stage": "published"
    },
    {
        "id": "ai-cyber-threat-intelligence",
        "title": "AI Cyber Threat Intelligence Platform",
        "description": "AI-powered threat intelligence platform that aggregates, analyzes, and contextualizes threat data from 100+ sources. Proactively identify threats targeting your organization.",
        "features": ["Threat intelligence aggregation (100+ sources)", "AI threat correlation and prioritization", "Dark web monitoring for leaked credentials", "IOC enrichment and context", "Automated threat briefings", "Integration with SIEM, SOAR, and firewalls"],
        "benefits": ["Identify threats before they hit", "Reduce threat research time by 90%", "Proactive defense with dark web monitoring", "Contextualized alerts reduce false positives"],
        "pricing": {"basic": "$2,999/mo", "pro": "$7,999/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "🕵️", "href": "/services/ai-cyber-threat-intelligence",
        "popular": True, "category": "security", "industry": "technology", "stage": "published"
    },
    {
        "id": "ai-employee-engagement",
        "title": "AI Employee Engagement & Retention Platform",
        "description": "AI platform that measures employee engagement in real-time, predicts flight risk, and recommends retention actions. Pulse surveys, sentiment analysis, and manager coaching.",
        "features": ["Real-time engagement monitoring", "AI flight risk prediction", "Automated pulse surveys with sentiment analysis", "Manager coaching recommendations", "Benchmarking against industry standards", "Integration with HRIS and communication tools"],
        "benefits": ["Reduce turnover by 25%", "Identify at-risk employees 6 months early", "Data-driven retention strategies", "Improve employee satisfaction scores"],
        "pricing": {"basic": "$5/employee/mo", "pro": "$10/employee/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "💡", "href": "/services/ai-employee-engagement",
        "popular": False, "category": "ai", "industry": "hr-tech", "stage": "published"
    },
    {
        "id": "ai-smart-contract-management",
        "title": "AI Smart Contract Lifecycle Management",
        "description": "AI-powered contract management with automated drafting, clause extraction, risk analysis, and renewal tracking. Manage the entire contract lifecycle in one platform.",
        "features": ["AI contract drafting from templates", "Clause extraction and risk analysis", "Obligation tracking and alerts", "Renewal and expiration management", "Contract comparison (original vs amended)", "Integration with CRM and procurement"],
        "benefits": ["Draft contracts 10x faster", "Catch risky clauses automatically", "Never miss a renewal deadline", "Reduce contract management costs by 60%"],
        "pricing": {"basic": "$499/mo", "pro": "$1,299/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "📄", "href": "/services/ai-smart-contract-management",
        "popular": True, "category": "ai", "industry": "legal-tech", "stage": "published"
    },
    {
        "id": "ai-personalization-engine",
        "title": "AI Personalization & Customer Experience Engine",
        "description": "Real-time personalization engine for websites, apps, and email. AI analyzes user behavior to deliver personalized content, product recommendations, and experiences.",
        "features": ["Real-time behavioral analysis", "Personalized product recommendations", "Dynamic content personalization", "A/B testing and optimization", "Cross-channel personalization (web, email, app)", "Privacy-compliant tracking (GDPR, CCPA)"],
        "benefits": ["Increase conversion by 30%", "Improve customer lifetime value by 20%", "Deliver 1:1 experiences at scale", "Privacy-compliant personalization"],
        "pricing": {"basic": "$999/mo", "pro": "$2,999/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "🎯", "href": "/services/ai-personalization-engine",
        "popular": True, "category": "ai", "industry": "marketing", "stage": "published"
    }
]

with open(SERVICES_FILE, 'r') as f:
    existing = json.load(f)

existing_ids = {s['id'] for s in existing}
added = 0
for svc in new_services:
    if svc['id'] not in existing_ids:
        existing.append(svc)
        existing_ids.add(svc['id'])
        added += 1
        print(f"  + {svc['id']}")
    else:
        print(f"  ~ SKIP: {svc['id']}")

with open(SERVICES_FILE, 'w') as f:
    json.dump(existing, f, indent=2)

print(f"\n✅ Added {added} new services. Total: {len(existing)}")
