#!/usr/bin/env python3
"""Add Wave 136-139 services (824 -> 848)."""
import json

with open('/data/data/com.termux/files/home/zion-support.github.io/app/data/servicesData.json', 'r') as f:
    services = json.load(f)

CONTACT = {"website": "/contact", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"}

def svc(id, title, desc, features, benefits, pricing, icon, category, popular, industry, href):
    return {"id": id, "title": title, "description": desc, "features": features, "benefits": benefits, "pricing": pricing, "contactInfo": CONTACT, "icon": icon, "href": href, "popular": popular, "category": category, "industry": industry}

new = [
    # Wave 136 — Micro-SaaS (5)
    svc("micro-saas-ai-resume-builder",
        "AI Resume & Cover Letter Builder",
        "AI-powered resume and cover letter builder with ATS optimization, industry-specific templates, and real-time scoring. Analyzes job descriptions to tailor applications automatically.",
        ["ATS optimization scoring", "Job description analysis", "Industry-specific templates", "Cover letter generation", "Skills gap analysis", "LinkedIn profile optimization", "Multi-format export (PDF, Word, LaTeX)", "Version history"],
        ["3x more interview callbacks", "ATS pass-through rate 95%+", "Personalized for each application", "50+ industry templates"],
        {"basic": "$49/mo", "pro": "$149/mo", "enterprise": "Custom"}, "📄", "micro-saas", True, "HR Tech",
        "/services/micro-saas-ai-resume-builder"),

    svc("micro-saas-white-label-sso",
        "White-Label SSO & Identity Provider",
        "Embeddable single sign-on solution for SaaS platforms. Multi-tenant identity management, social login, MFA, and self-service branding for your customers.",
        ["Multi-tenant SSO", "Social login (Google, Apple, GitHub)", "MFA/TOTP/SMS", "Custom branding per tenant", "SCIM provisioning", "Audit logs", "SAML 2.0 / OIDC", "Self-service admin portal"],
        ["Reduce auth dev time by 80%", "Enterprise-grade security", "White-label ready", "SOC 2 compliant"],
        {"per-mau": "$0.10/MAU", "flat": "$399/mo", "enterprise": "Custom"}, "🔐", "micro-saas", False, "Security",
        "/services/micro-saas-white-label-sso"),

    svc("micro-saas-employee-engagement",
        "Employee Engagement & Pulse Survey Platform",
        "Real-time employee sentiment tracking, pulse surveys, eNPS scoring, action planning, and AI-driven insights. Integrates with Slack, Teams, and HRIS systems.",
        ["Pulse surveys", "eNPS scoring", "AI sentiment analysis", "Action planning", "Slack/Teams integration", "Anonymous feedback", "Benchmarking", "Manager dashboards"],
        ["25% lower turnover", "Real-time sentiment", "AI-powered insights", "Manager action plans"],
        {"per-employee": "$3/emp/mo", "flat": "$499/mo", "enterprise": "Custom"}, "💬", "micro-saas", True, "HR Tech",
        "/services/micro-saas-employee-engagement"),

    svc("micro-saas-revenue-analytics",
        "SaaS Revenue Analytics & Metrics",
        "Comprehensive SaaS metrics dashboard with MRR/ARR tracking, cohort analysis, churn prediction, LTV calculation, and investor-ready reporting.",
        ["MRR/ARR tracking", "Cohort analysis", "Churn prediction", "LTV calculation", "Revenue forecasting", "Investor reports", "Segmentation", "API access"],
        ["Investor-ready reports", "Predict churn 6 months ahead", "LTV optimization", "Benchmark comparisons"],
        {"starter": "$199/mo", "growth": "$599/mo", "enterprise": "Custom"}, "💰", "micro-saas", True, "SaaS",
        "/services/micro-saas-revenue-analytics"),

    svc("micro-saas-review-management",
        "AI Review Management & Reputation Platform",
        "Aggregate, analyze, and respond to reviews across Google, Yelp, Amazon, and 50+ platforms. AI-generated responses, sentiment analysis, and competitive benchmarking.",
        ["50+ review platforms", "AI response generation", "Sentiment analysis", "Competitive benchmarking", "Review request automation", "Alert management", "Reporting dashboard", "Team collaboration"],
        ["40% more positive responses", "Unified dashboard", "Time savings", "Reputation insights"],
        {"starter": "$299/mo", "professional": "$899/mo", "enterprise": "Custom"}, "⭐", "micro-saas", False, "Marketing",
        "/services/micro-saas-review-management"),

    # Wave 136 — IT Services (5)
    svc("it-sre-as-a-service",
        "SRE as a Service",
        "Dedicated Site Reliability Engineering team for your infrastructure. SLO management, incident response, capacity planning, chaos engineering, and reliability best practices.",
        ["SLO definition/management", "Incident response", "Capacity planning", "Chaos engineering", "Error budget tracking", "Reliability reviews", "On-call management", "Post-mortems"],
        ["99.99% reliability target", "MTTR reduced by 60%", "Error budget culture", "Proactive reliability"],
        {"team": "$8,000/mo", "dedicated": "$15,000/mo", "enterprise": "Custom"}, "⚙️", "it", True, "DevOps",
        "/services/it-sre-as-a-service"),

    svc("it-database-as-a-service",
        "Managed Database Service",
        "Fully managed databases — PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch. Automated backups, scaling, patching, monitoring, and query optimization.",
        ["Multi-engine support", "Auto-scaling", "Automated backups", "Query optimization", "Monitoring/alerts", "Patching", "Read replicas", "Point-in-time recovery"],
        ["Zero-downtime scaling", "Automated management", "Expert optimization", "Cost optimization"],
        {"starter": "$299/mo", "professional": "$999/mo", "enterprise": "Custom"}, "🗄️", "it", True, "Data",
        "/services/it-database-as-a-service"),

    svc("it-api-management-platform",
        "API Management & Gateway",
        "Full API lifecycle management — design, publish, secure, monitor, and monetize APIs. Developer portal, rate limiting, analytics, and versioning.",
        ["API design/design", "Developer portal", "Rate limiting", "API analytics", "Monetization", "Versioning", "Security policies", "Mock testing"],
        ["10x faster API delivery", "Developer self-service", "Monetization insights", "Enterprise security"],
        {"starter": "$499/mo", "professional": "$1,799/mo", "enterprise": "Custom"}, "🔌", "it", False, "Technology",
        "/services/it-api-management-platform"),

    svc("it-it-asset-management",
        "IT Asset Management & Discovery",
        "Automated IT asset discovery, inventory, lifecycle management, and software license optimization. CMDB, compliance tracking, and cost optimization.",
        ["Auto-discovery", "CMDB", "License optimization", "Lifecycle management", "Compliance tracking", "Cost optimization", "Integration (ServiceNow, JAMF)", "Reporting"],
        ["30% license cost savings", "Full asset visibility", "Compliance automation", "Lifecycle optimization"],
        {"per-asset": "$2/asset/mo", "flat": "$799/mo", "enterprise": "Custom"}, "🖥️", "it", True, "IT Operations",
        "/services/it-it-asset-management"),

    svc("it-dr-as-a-service",
        "Disaster Recovery as a Service",
        "Cloud-based disaster recovery with automated failover, continuous replication, and regular DR testing. RPO/RTO guarantees with multi-region support.",
        ["Automated failover", "Continuous replication", "Regular DR testing", "Multi-region support", "RPO/RTO guarantees", "Compliance reporting", "Runbook automation", "24/7 NOC"],
        ["Minutes not hours recovery", "Zero data loss", "Compliance ready", "24/7 monitoring"],
        {"starter": "$999/mo", "professional": "$3,999/mo", "enterprise": "Custom"}, "🔄", "it", True, "Cloud",
        "/services/it-dr-as-a-service"),

    # Wave 137 — AI Services (5)
    svc("ai-computer-vision-manufacturing",
        "Computer Vision for Manufacturing",
        "Automated visual inspection, defect detection, quality control, and process monitoring using AI computer vision. Works with existing cameras and IoT sensors.",
        ["Defect detection", "Visual inspection", "Quality classification", "Process monitoring", "Anomaly detection", "OCR/barcode reading", "Safety compliance", "Real-time alerts"],
        ["99.5% detection accuracy", "100x faster than manual", "Zero-defect target", "Safety compliance"],
        {"pilot": "$10,000", "production": "$3,500/mo", "enterprise": "Custom"}, "👁️", "ai", True, "Manufacturing",
        "/services/ai-computer-vision-manufacturing"),

    svc("ai-conversational-search",
        "Conversational Enterprise Search",
        "AI-powered search that understands natural language questions. Searches across documents, databases, emails, and apps to find and synthesize answers.",
        ["Natural language search", "Multi-source search", "Answer synthesis", "Source citations", "Personalized results", "Conversational follow-ups", "Access control", "Analytics"],
        ["100x faster information finding", "Find anything instantly", "Answer synthesis", "Full source citations"],
        {"starter": "$499/mo", "professional": "$1,799/mo", "enterprise": "Custom"}, "🔍", "ai", True, "Technology",
        "/services/ai-conversational-search"),

    svc("ai-customer-churn-prediction",
        "Customer Churn Prediction & Prevention",
        "Predict which customers are at risk of leaving, understand why, and trigger automated retention campaigns. Integrates with CRM, billing, and support systems.",
        ["Churn scoring", "Root cause analysis", "Automated retention campaigns", "Win-back offers", "CRM integration", "Health scoring", "Early warning alerts", "What-if analysis"],
        ["40% reduction in churn", "Predictive 6+ months ahead", "Automated retention", "Actionable insights"],
        {"per-contact": "$0.50/contact/mo", "flat": "$999/mo", "enterprise": "Custom"}, "🎯", "ai", True, "SaaS",
        "/services/ai-customer-churn-prediction"),

    svc("ai-document-generation",
        "AI Document Generation Platform",
        "Auto-generate contracts, proposals, reports, and emails from templates and data. Conditional logic, data merging, e-signature, and lifecycle management.",
        ["Template library", "Data merging", "Conditional logic", "E-signature", "Version control", "Approval workflows", "Multi-format export", "Analytics"],
        ["90% faster document creation", "Error-free generation", "Template management", "Legal compliance"],
        {"starter": "$299/mo", "professional": "$999/mo", "enterprise": "Custom"}, "📝", "ai", True, "Legal",
        "/services/ai-document-generation"),

    svc("ai-voice-agent-platform",
        "AI Voice Agent Platform",
        "Build and deploy AI voice agents for inbound and outbound calls. Natural conversations, intent recognition, CRM integration, and real-time call analytics.",
        ["Outbound calling", "Inbound answering", "Intent recognition", "CRM integration", "Call analytics", "Voice cloning", "Multi-language (40+)", "Sentiment analysis"],
        ["80% call automation", "Natural conversations", "24/7 availability", "Multi-language"],
        {"per-minute": "$0.07/min", "flat": "$1,999/mo", "enterprise": "Custom"}, "📞", "ai", True, "Technology",
        "/services/ai-voice-agent-platform"),

    # Wave 137 — Industry (5)
    svc("insurance-ai-claims-processor",
        "Insurance AI Claims Processor",
        "End-to-end claims processing with AI — intake, fraud detection, damage assessment, adjudication, and payment. Reduces processing time from weeks to minutes.",
        ["Automated intake", "Fraud detection", "Damage assessment", "Adjudication", "Payment processing", "Customer communication", "Compliance", "Analytics"],
        ["80% faster processing", "Fraud detection 95%+", "Customer satisfaction", "Cost reduction"],
        {"starter": "$1,999/mo", "professional": "$5,999/mo", "enterprise": "Custom"}, "🏥", "ai", True, "Insurance",
        "/services/insurance-ai-claims-processor"),

    svc("logistics-route-optimizer",
        "Logistics Route Optimizer",
        "AI-powered route optimization for delivery fleets. Real-time traffic, driver hours, vehicle capacity, and customer preferences for optimal routing.",
        ["Route optimization", "Real-time traffic", "Driver hours tracking", "Vehicle capacity", "Customer preferences", "Proof of delivery", "Fleet tracking", "Analytics"],
        ["25% fuel savings", "40% more deliveries", "Customer satisfaction", "Driver efficiency"],
        {"per-vehicle": "$49/vehicle/mo", "flat": "$999/mo", "enterprise": "Custom"}, "🚚", "ai", True, "Logistics",
        "/services/logistics-route-optimizer"),

    svc("real-estate-ai-valuation",
        "Real Estate AI Valuation Platform",
        "Automated property valuations using AI — market analysis, comparable sales, rental yield prediction, and investment scoring for residential and commercial real estate.",
        ["Automated valuations", "Market analysis", "Comparable sales", "Rental yield", "Investment scoring", "Portfolio analysis", "Trend prediction", "Risk assessment"],
        ["Instant valuations", "Market insights", "Investment decisions", "Portfolio optimization"],
        {"per-report": "$29", "unlimited": "$499/mo", "enterprise": "Custom"}, "🏠", "ai", True, "Real Estate",
        "/services/real-estate-ai-valuation"),

    svc("education-adaptive-learning",
        "Adaptive Learning Platform",
        "AI-powered personalized learning that adapts to each student's pace, style, and level. Content recommendations, progress tracking, and automated assessment.",
        ["Personalized paths", "Adaptive content", "Progress tracking", "Auto-assessment", "Content recommendation", "Learning analytics", "Parent/teacher dashboards", "Multi-language"],
        ["3x faster learning", "90%+ completion", "Personalized engagement", "Teacher insights"],
        {"per-student": "$10/student/mo", "unlimited": "$1,999/mo", "enterprise": "Custom"}, "🎓", "ai", True, "Education",
        "/services/education-adaptive-learning"),

    svc("agritech-precision-farming",
        "Precision Agriculture Platform",
        "AI-powered precision farming with satellite imagery, soil analysis, crop health monitoring, yield prediction, and automated irrigation scheduling.",
        ["Satellite imagery", "Soil analysis", "Crop health", "Yield prediction", "Irrigation scheduling", "Pest detection", "Weather integration", "Farm analytics"],
        ["20% higher yields", "30% less water", "Pest early warning", "Cost optimization"],
        {"per-hectare": "$5/hectare/mo", "farm": "$299/mo", "enterprise": "Custom"}, "🌾", "ai", True, "Agriculture",
        "/services/agritech-precision-farming"),
]

services.extend(new)

with open('/data/data/com.termux/files/home/zion-support.github.io/app/data/servicesData.json', 'w') as f:
    json.dump(services, f, indent=2, ensure_ascii=False)

print(f"Added {len(new)} services. Total: {len(services)}")
