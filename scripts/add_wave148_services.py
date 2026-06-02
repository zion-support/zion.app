#!/usr/bin/env python3
"""Add Wave 148 services: more real micro-SaaS, IT, and AI solutions."""
import json
import os

SERVICES_FILE = os.path.join(os.path.dirname(__file__), '..', 'app', 'data', 'servicesData.json')
CONTACT = {"website": "https://ziontechgroup.com", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"}

new_services = [
    # === MICRO-SAAS (5) ===
    {
        "id": "micro-saas-ai-resume-builder",
        "title": "Micro-SaaS AI Resume Builder & ATS Optimizer",
        "description": "AI-powered resume builder that optimizes for ATS systems, tailors content to job descriptions, and provides real-time scoring. Increases interview callback rates by 3x.",
        "features": ["AI content optimization for ATS keywords", "Job description matching with gap analysis", "Real-time resume scoring (0-100)", "Multi-format export (PDF, DOCX, LinkedIn)", "Cover letter generator with personalization", "Interview question predictor based on job req"],
        "benefits": ["3x more interview callbacks", "Pass 95% of ATS filters", "Tailor resume in minutes not hours", "Professional templates for 50+ industries"],
        "pricing": {"basic": "$19/mo", "pro": "$49/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "📝", "href": "/services/micro-saas-ai-resume-builder",
        "popular": True, "category": "micro-saas", "industry": "hr-tech", "stage": "published"
    },
    {
        "id": "micro-saas-smart-invoice-factoring",
        "title": "Micro-SaaS Smart Invoice Factoring Platform",
        "description": "AI-driven invoice factoring marketplace that connects businesses with instant liquidity. Automated risk assessment, dynamic pricing, and same-day funding for B2B invoices.",
        "features": ["AI credit risk scoring for invoice buyers", "Dynamic factoring rates based on risk profile", "Same-day funding via ACH/wire", "Automated invoice verification and fraud detection", "Real-time dashboard with cash flow forecasting", "Integration with QuickBooks, Xero, NetSuite"],
        "benefits": ["Get cash in 24 hours vs 30-90 days", "AI-optimized rates save 15-30% vs competitors", "No personal guarantee required", "Scale funding as revenue grows"],
        "pricing": {"basic": "1.5% fee", "pro": "1.0% fee", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "💰", "href": "/services/micro-saas-smart-invoice-factoring",
        "popular": False, "category": "micro-saas", "industry": "fintech", "stage": "published"
    },
    {
        "id": "micro-saas-ai-legal-assistant",
        "title": "Micro-SaaS AI Legal Assistant for SMBs",
        "description": "AI legal assistant that drafts contracts, reviews NDAs, generates privacy policies, and answers legal questions. Not a replacement for lawyers — a force multiplier for small businesses.",
        "features": ["Contract drafting from templates + AI customization", "NDA review with risk flagging and redlines", "Privacy policy and terms of service generator", "Legal Q&A chatbot trained on US business law", "Document comparison (original vs modified)", "E-signature integration with audit trail"],
        "benefits": ["Save $10K+/year on routine legal work", "Draft contracts in minutes not days", "Catch risky clauses before signing", "Always up-to-date with current regulations"],
        "pricing": {"basic": "$79/mo", "pro": "$199/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "⚖️", "href": "/services/micro-saas-ai-legal-assistant",
        "popular": True, "category": "micro-saas", "industry": "legal-tech", "stage": "published"
    },
    {
        "id": "micro-saas-ai-survey-analyzer",
        "title": "Micro-SaaS AI Survey & Feedback Analyzer",
        "description": "Advanced survey platform with AI-powered open-ended response analysis, sentiment tracking, and automated insight generation. Turns qualitative feedback into actionable data.",
        "features": ["AI open-ended response categorization", "Sentiment analysis with emotion detection", "Trend tracking across survey waves", "Automated insight reports with recommendations", "Multi-language support (40+ languages)", "Integration with Slack, Teams, email"],
        "benefits": ["Analyze 10,000 open-ended responses in seconds", "Track sentiment trends over time", "Automatically generate executive summaries", "Close the loop with action item tracking"],
        "pricing": {"basic": "$49/mo", "pro": "$149/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "📊", "href": "/services/micro-saas-ai-survey-analyzer",
        "popular": False, "category": "micro-saas", "industry": "analytics", "stage": "published"
    },
    {
        "id": "micro-saas-ai-pricing-optimizer",
        "title": "Micro-SaaS AI Dynamic Pricing Optimizer",
        "description": "AI-powered pricing optimization for e-commerce and SaaS. Analyzes competitor pricing, demand elasticity, and customer segments to recommend optimal prices that maximize revenue.",
        "features": ["Competitor price monitoring across 50+ sources", "Demand elasticity modeling per product", "A/B testing framework for price experiments", "Customer segment-based pricing recommendations", "Revenue impact simulation before changes", "Integration with Shopify, WooCommerce, Stripe"],
        "benefits": ["Increase revenue 5-15% with optimized pricing", "React to market changes in real-time", "Data-driven pricing decisions not guesswork", "Test prices before committing"],
        "pricing": {"basic": "$99/mo", "pro": "$299/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "💲", "href": "/services/micro-saas-ai-pricing-optimizer",
        "popular": True, "category": "micro-saas", "industry": "ecommerce", "stage": "published"
    },
    # === IT SERVICES (5) ===
    {
        "id": "it-soc-as-a-service",
        "title": "IT Security Operations Center as a Service (SOCaaS)",
        "description": "24/7 managed security operations center without the $2M+ price tag. Full SIEM, threat detection, incident response, and compliance monitoring delivered as a service.",
        "features": ["24/7/365 monitoring by certified security analysts", "SIEM deployment and management (Splunk, Sentinel, Elastic)", "Threat detection with custom correlation rules", "Incident response with 15-min critical alert SLA", "Vulnerability management and patch prioritization", "Compliance reporting (SOC 2, HIPAA, PCI DSS, ISO 27001)"],
        "benefits": ["Enterprise SOC at 1/5 the cost of building in-house", "Detect and respond to threats in under 15 minutes", "Meet compliance requirements without dedicated staff", "Scale security as you grow"],
        "pricing": {"basic": "$3,500/mo", "pro": "$7,500/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "🛡️", "href": "/services/it-soc-as-a-service",
        "popular": True, "category": "security", "industry": "technology", "stage": "published"
    },
    {
        "id": "it-devops-transformation",
        "title": "IT DevOps Transformation Service",
        "description": "End-to-end DevOps transformation including CI/CD pipeline design, infrastructure as code, containerization, and SRE practices. Reduce deployment time from weeks to minutes.",
        "features": ["CI/CD pipeline design and implementation", "Infrastructure as Code (Terraform, Pulumi)", "Container orchestration (Kubernetes, Docker)", "SRE practices and SLI/SLO definition", "Monitoring and observability stack setup", "Developer experience optimization"],
        "benefits": ["Deploy 100x faster with automated pipelines", "Reduce infrastructure costs by 40%", "Improve system reliability to 99.99%", "Free developers from operational burden"],
        "pricing": {"basic": "$15,000 project", "pro": "$45,000 project", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "⚙️", "href": "/services/it-devops-transformation",
        "popular": True, "category": "it", "industry": "technology", "stage": "published"
    },
    {
        "id": "it-it-asset-management",
        "title": "IT Asset Management & Lifecycle Service",
        "description": "Comprehensive IT asset management covering hardware, software, and cloud resources. Track, optimize, and plan refresh cycles for your entire technology estate.",
        "features": ["Automated asset discovery and inventory", "Software license management and optimization", "Hardware lifecycle tracking and refresh planning", "Cloud resource inventory and cost optimization", "Compliance and audit reporting", "Integration with ITSM, CMDB, and procurement"],
        "benefits": ["Reduce software license costs by 20-30%", "Eliminate ghost assets and shelfware", "Plan refresh cycles with data-driven insights", "Pass audits with complete asset visibility"],
        "pricing": {"basic": "$2,000/mo", "pro": "$5,000/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "📦", "href": "/services/it-it-asset-management",
        "popular": False, "category": "it", "industry": "technology", "stage": "published"
    },
    {
        "id": "it-email-security-gateway",
        "title": "IT Email Security Gateway & Anti-Phishing",
        "description": "Advanced email security gateway that blocks phishing, BEC, malware, and spam with AI-powered threat detection. Protects against the #1 attack vector for businesses.",
        "features": ["AI-powered phishing and BEC detection", "Sandboxing for attachment analysis", "DMARC/DKIM/SPF enforcement and monitoring", "Email encryption and DLP policies", "Impersonation protection for executives", "Incident response automation for compromised accounts"],
        "benefits": ["Block 99.9% of phishing attempts", "Prevent BEC fraud with AI analysis", "Meet email compliance requirements", "Reduce email security management by 80%"],
        "pricing": {"basic": "$3/user/mo", "pro": "$6/user/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "📧", "href": "/services/it-email-security-gateway",
        "popular": True, "category": "security", "industry": "technology", "stage": "published"
    },
    {
        "id": "it-hybrid-cloud-networking",
        "title": "IT Hybrid Cloud Networking & SD-WAN",
        "description": "Design and implement hybrid cloud networking with SD-WAN, SASE, and zero-trust principles. Connect on-prem, cloud, and remote workers with enterprise-grade security.",
        "features": ["SD-WAN design and deployment", "SASE architecture (SD-WAN + SSE + ZTNA)", "Multi-cloud network connectivity", "Network segmentation and micro-segmentation", "Performance monitoring and optimization", "Disaster recovery network failover"],
        "benefits": ["Reduce WAN costs by 50% with SD-WAN", "Secure remote work with zero-trust access", "Sub-100ms latency for cloud applications", "Automated failover for business continuity"],
        "pricing": {"basic": "$10,000 setup", "pro": "$25,000 setup", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "🌐", "href": "/services/it-hybrid-cloud-networking",
        "popular": False, "category": "it", "industry": "technology", "stage": "published"
    },
    # === AI SERVICES (5) ===
    {
        "id": "ai-code-review-assistant",
        "title": "AI Code Review Assistant",
        "description": "AI-powered code review that catches bugs, security vulnerabilities, and performance issues before merge. Integrates with GitHub, GitLab, and Bitbucket PRs.",
        "features": ["Automated PR review with inline comments", "Security vulnerability detection (OWASP Top 10)", "Performance anti-pattern identification", "Code style and best practice enforcement", "Test coverage analysis and suggestions", "Custom rule engine for team standards"],
        "benefits": ["Catch 80% of bugs before human review", "Reduce code review time by 60%", "Enforce security standards automatically", "Onboard new developers faster"],
        "pricing": {"basic": "$15/developer/mo", "pro": "$35/developer/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "👨‍💻", "href": "/services/ai-code-review-assistant",
        "popular": True, "category": "ai", "industry": "technology", "stage": "published"
    },
    {
        "id": "ai-customer-support-copilot",
        "title": "AI Customer Support Copilot",
        "description": "AI copilot for support agents that suggests responses, auto-summarizes tickets, and routes inquiries to the right team. Reduces average handle time by 40% while improving CSAT.",
        "features": ["Real-time response suggestions based on knowledge base", "Automatic ticket summarization and categorization", "Smart routing to best-qualified agent", "Sentiment-aware tone adjustment", "Multi-language support (50+ languages)", "Integration with Zendesk, Intercom, Freshdesk"],
        "benefits": ["Reduce handle time by 40%", "Improve first-contact resolution by 25%", "Consistent quality across all agents", "Scale support without adding headcount"],
        "pricing": {"basic": "$49/agent/mo", "pro": "$99/agent/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "🎧", "href": "/services/ai-customer-support-copilot",
        "popular": True, "category": "ai", "industry": "technology", "stage": "published"
    },
    {
        "id": "ai-demand-forecasting",
        "title": "AI Demand Forecasting & Inventory Optimization",
        "description": "ML-powered demand forecasting that analyzes seasonality, trends, promotions, and external factors to predict demand with 95%+ accuracy. Optimize inventory and reduce stockouts.",
        "features": ["Multi-variable demand forecasting (seasonality, trends, events)", "Promotion and campaign impact modeling", "External factor integration (weather, economic indicators)", "Inventory optimization with safety stock calculations", "Automated reorder point recommendations", "What-if scenario planning"],
        "benefits": ["95%+ forecast accuracy", "Reduce stockouts by 60%", "Lower inventory carrying costs by 25%", "Optimize working capital with data-driven ordering"],
        "pricing": {"basic": "$1,999/mo", "pro": "$4,999/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "📈", "href": "/services/ai-demand-forecasting",
        "popular": True, "category": "ai", "industry": "retail", "stage": "published"
    },
    {
        "id": "ai-accessibility-auditor",
        "title": "AI Accessibility Auditor & Remediation",
        "description": "AI-powered web accessibility auditing that scans sites for WCAG 2.1/2.2 violations, provides remediation guidance, and auto-fixes common issues. Ensure ADA and Section 508 compliance.",
        "features": ["Automated WCAG 2.1/2.2 compliance scanning", "AI-powered remediation suggestions", "Auto-fix for common accessibility issues", "Screen reader simulation and testing", "PDF and document accessibility checking", "Compliance reporting and VPAT generation"],
        "benefits": ["Avoid ADA lawsuits (up to $75K per violation)", "Reach 15% more users with accessible design", "Automate 80% of accessibility testing", "Generate compliance documentation automatically"],
        "pricing": {"basic": "$199/mo", "pro": "$499/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "♿", "href": "/services/ai-accessibility-auditor",
        "popular": False, "category": "ai", "industry": "technology", "stage": "published"
    },
    {
        "id": "ai-video-analytics-platform",
        "title": "AI Video Analytics & Content Moderation",
        "description": "Real-time video analytics platform for content moderation, object detection, and behavioral analysis. Powers safe user-generated content and intelligent surveillance.",
        "features": ["Real-time content moderation (violence, nudity, hate)", "Object and scene detection in video streams", "Facial recognition with privacy controls", "Behavioral anomaly detection", "Automated video tagging and transcription", "Live stream monitoring with sub-second latency"],
        "benefits": ["Moderate 100% of video content automatically", "Reduce content moderation costs by 90%", "Detect threats in real-time", "Scale video operations without adding reviewers"],
        "pricing": {"basic": "$2,499/mo", "pro": "$6,999/mo", "enterprise": "Custom"},
        "contactInfo": CONTACT, "icon": "🎥", "href": "/services/ai-video-analytics-platform",
        "popular": True, "category": "ai", "industry": "media", "stage": "published"
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
