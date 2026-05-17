#!/usr/bin/env python3
"""
Add new innovative micro-SaaS, IT, and AI services to both versions of servicesData.ts.
File 1: /Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts  (newer schema)
File 2: /Users/klebergarciaalcatrao/app/data/servicesData.ts           (older schema, git-tracked)
"""
import re, os, sys

# ═══════════════════════════════════════════════════════════════════════
# NEW SERVICES DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

# --- NEW AI SERVICES (newer schema for zion.app) ---
new_ai_services = [
    {
        "id": "ai-compliance-automation",
        "title": "AI-Powered Compliance Automation",
        "subtitle": "Automate regulatory compliance monitoring and reporting across frameworks",
        "category": "ai",
        "subcategory": "Compliance Automation",
        "description": "Automated compliance monitoring for SOC 2, HIPAA, GDPR, PCI DSS, and ISO 27001. Continuously scans systems, generates evidence, and flags violations in real-time.",
        "features": [
            "Automated evidence collection across 50+ cloud services",
            "Real-time compliance drift detection and alerting",
            "Pre-built policy templates for SOC 2, HIPAA, GDPR, PCI DSS",
            "AI-powered gap analysis with remediation playbooks",
            "Audit-ready report generation in minutes",
            "Continuous control monitoring with screenshot proof",
            "Integration with GRC platforms (Drata, Vanta, Secureframe)",
            "Regulatory change tracking and impact assessment"
        ],
        "benefits": [
            "Cut audit prep time by 90%",
            "Maintain continuous compliance instead of point-in-time snapshots",
            "Reduce compliance operating costs by 60%",
            "Avoid costly compliance violations with real-time monitoring"
        ],
        "pricing": {"Starter": "$499/mo", "Professional": "$1,999/mo", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "ai-voice-agent-studio",
        "title": "AI Voice Agent Studio",
        "subtitle": "Build and deploy custom AI voice agents for customer service and operations",
        "category": "ai",
        "subcategory": "Voice AI",
        "description": "Design, train, and deploy natural-sounding AI voice agents that handle customer calls, bookings, and support with human-level conversation quality.",
        "features": [
            "No-code voice agent builder with drag-and-drop flow designer",
            "Real-time voice cloning and custom TTS voices",
            "Multi-language support (50+ languages)",
            "Context-aware conversation with memory across calls",
            "Seamless human handoff with warm transfers",
            "CRM integration (Salesforce, HubSpot, Zendesk)",
            "Call analytics and sentiment tracking dashboard",
            "IVR replacement with natural conversation routing"
        ],
        "benefits": [
            "Handle 10,000+ calls simultaneously 24/7",
            "Reduce call center costs by up to 80%",
            "Consistent, professional customer experience every time",
            "Deploy new voice agents in hours, not months"
        ],
        "pricing": {"Starter": "$999/mo", "Professional": "$3,999/mo", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "ai-code-review-mentor",
        "title": "AI Code Review & Mentoring Platform",
        "subtitle": "Instant, context-aware code reviews that teach developers to write better code",
        "category": "ai",
        "subcategory": "Developer Tools",
        "description": "AI-powered code review that goes beyond linting — understands context, architecture, security, and performance, providing educational explanations that improve your team over time.",
        "features": [
            "Deep contextual code analysis beyond static analysis",
            "Security vulnerability detection with OWASP mapping",
            "Performance anti-pattern identification",
            "Educational explanations for every suggestion",
            "Architecture-level feedback and design pattern recommendations",
            "Custom rules engine for team coding standards",
            "PR auto-review with approval-gated merging",
            "Integration with GitHub, GitLab, Bitbucket, and Azure DevOps"
        ],
        "benefits": [
            "Catch bugs and security issues before merge",
            "Level up junior developers with inline teaching",
            "Reduce code review cycle time by 70%",
            "Enforce consistent coding standards across teams"
        ],
        "pricing": {"Starter": "$299/mo", "Professional": "$799/mo", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "ai-financial-forecasting",
        "title": "AI Financial Forecasting & FP&A",
        "subtitle": "Intelligent financial planning, budgeting, and forecasting powered by machine learning",
        "category": "ai",
        "subcategory": "Finance & FP&A",
        "description": "AI-driven financial forecasting that learns from your historical data, market trends, and business patterns to deliver more accurate revenue, expense, and cash flow predictions.",
        "features": [
            "Automated revenue forecasting with scenario modeling",
            "Expense pattern detection and anomaly alerts",
            "Cash flow prediction with 13-week rolling forecast",
            "Variance analysis with AI-generated explanations",
            "Board-ready financial dashboards and reports",
            "Integration with QuickBooks, Xero, NetSuite, SAP",
            "Monte Carlo simulation for risk-adjusted projections",
            "Real-time budget vs. actual tracking"
        ],
        "benefits": [
            "Improve forecast accuracy by 30-50%",
            "Reduce FP&A team workload by 60%",
            "Make data-driven decisions with confidence intervals",
            "Identify financial risks weeks before they materialize"
        ],
        "pricing": {"Starter": "$1,499/mo", "Professional": "$4,999/mo", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "ai-recruitment-intelligence",
        "title": "AI Recruitment Intelligence Platform",
        "subtitle": "End-to-end AI-powered recruiting with bias-free candidate matching and predictive hiring",
        "category": "ai",
        "subcategory": "HR & Recruitment",
        "description": "Intelligent recruiting platform that uses AI to source, screen, rank, and match candidates to open roles — reducing bias and time-to-hire while improving quality of hire.",
        "features": [
            "AI-powered resume parsing and skill extraction",
            "Bias-free candidate scoring and ranking",
            "Predictive candidate-job fit modeling",
            "Automated outreach and interview scheduling",
            "Talent pool analytics and market benchmarking",
            "Diversity and inclusion dashboards",
            "Integration with LinkedIn, Indeed, and ATS platforms",
            "Offer letter generation and negotiation guidance"
        ],
        "benefits": [
            "Reduce time-to-hire from 42 days to 12 days",
            "Improve hire retention by 35% with better matching",
            "Eliminate unconscious bias in screening",
            "Build a talent pipeline that's always warm and ready"
        ],
        "pricing": {"Starter": "$999/mo", "Professional": "$2,999/mo", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "ai-research-assistant",
        "title": "AI Research & Knowledge Synthesis Agent",
        "subtitle": "Automated research agent that reads thousands of sources and synthesizes actionable intelligence briefs",
        "category": "ai",
        "subcategory": "Knowledge Management",
        "description": "An AI research agent that ingests market reports, academic papers, news feeds, and internal documents to produce structured intelligence briefs, competitive analyses, and trend reports on demand.",
        "features": [
            "Automated deep research across web, academic, and proprietary sources",
            "Structured intelligence brief generation (executive summaries)",
            "Competitive analysis and market landscape mapping",
            "Citation tracking with source verification",
            "Custom research workflows and automated reporting schedules",
            "Knowledge graph construction from research findings",
            "Multi-format export (PDF, slide decks, wiki entries)",
            "Integration with internal knowledge bases and Slack"
        ],
        "benefits": [
            "Compress 40 hours of research into 15 minutes",
            "Never miss a critical industry development",
            "Build institutional knowledge at scale",
            "Make better decisions with structured, cited intelligence"
        ],
        "pricing": {"Starter": "$1,999/mo", "Professional": "$4,999/mo", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "ai-sustainability-deep",
        "title": "AI Sustainability & ESG Intelligence Platform",
        "subtitle": "Measure, manage, and report your environmental impact with AI-driven sustainability analytics",
        "category": "ai",
        "subcategory": "Sustainability & ESG",
        "description": "Comprehensive ESG management platform that uses AI to measure carbon footprint, analyze supply chain sustainability, generate regulatory reports (CSRD, SEC, TCFD), and identify reduction opportunities.",
        "features": [
            "Automated carbon accounting across Scope 1, 2, and 3 emissions",
            "AI-powered supply chain sustainability scoring",
            "Regulatory report generation (CSRD, SEC climate, TCFD)",
            "Energy consumption optimization recommendations",
            "Sustainability KPI tracking and benchmarking",
            "Lifecycle assessment automation",
            "Waste and circular economy optimization",
            "Stakeholder and investor ESG reporting portal"
        ],
        "benefits": [
            "Meet mandatory ESG disclosure requirements",
            "Reduce carbon footprint by 15-25% with AI recommendations",
            "Win contracts requiring sustainability commitments",
            "Turn sustainability from cost center to competitive advantage"
        ],
        "pricing": {"Starter": "$1,299/mo", "Professional": "$3,999/mo", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    }
]

# --- NEW CONSULTING SERVICES (newer schema for zion.app) ---
new_consulting_services = [
    {
        "id": "consult-quantum-1",
        "title": "Quantum Computing Readiness & Strategy",
        "subtitle": "Prepare your organization for the quantum era with strategic planning and use case identification",
        "category": "consulting",
        "subcategory": "Quantum Computing",
        "description": "Strategic consulting to assess quantum computing readiness, identify use cases in optimization, cryptography, and drug discovery, and build a quantum-ready roadmap for your organization.",
        "features": [
            "Quantum readiness assessment and maturity scoring",
            "Quantum use case identification and prioritization",
            "Post-quantum cryptography migration planning",
            "Quantum cloud platform selection (AWS Braket, Azure Quantum, IBM Q)",
            "Proof-of-concept design and execution",
            "Quantum talent acquisition and training strategy",
            "Hybrid classical-quantum architecture design",
            "Quantum advantage benchmarking framework"
        ],
        "benefits": [
            "Get ahead of quantum disruption before competitors",
            "Protect cryptographic infrastructure from quantum threats",
            "Identify $10M+ optimization opportunities quantum can unlock",
            "Build quantum literacy across your technical teams"
        ],
        "pricing": {"Starter": "$9,999/project", "Professional": "$29,999/project", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "consult-datascience-1",
        "title": "Data Science Center of Excellence (CoE) Setup",
        "subtitle": "Stand up a world-class data science function with the right people, processes, and platform",
        "category": "consulting",
        "subcategory": "Data Science",
        "description": "End-to-end consulting to establish or transform your data science organization — from hiring strategy and team structure to platform selection, MLOps, and governance.",
        "features": [
            "Data science talent strategy and recruitment support",
            "Team structure design (centralized vs. embedded vs. hub-and-spoke)",
            "MLOps platform selection and implementation",
            "Model lifecycle governance framework",
            "Feature store and experiment tracking setup",
            "Data science workflow standardization",
            "Executive dashboards for model ROI tracking",
            "Continuous learning and upskilling program design"
        ],
        "benefits": [
            "Build a data science team that delivers real business value",
            "Avoid common pitfalls that cause 85% of DS projects to fail",
            "Accelerate time-to-value from data science investments",
            "Create a scalable foundation for AI and ML maturity"
        ],
        "pricing": {"Starter": "$7,999/project", "Professional": "$24,999/project", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "consult-web3-blockchain-1",
        "title": "Web3 & Blockchain Strategy Consulting",
        "subtitle": "Navigate the decentralized future with strategic blockchain consulting and implementation",
        "category": "consulting",
        "subcategory": "Blockchain & Web3",
        "description": "Expert consulting on blockchain technology strategy, decentralized application (dApp) architecture, token economy design, and integration of Web3 capabilities into existing enterprise systems.",
        "features": [
            "Blockchain technology assessment and platform selection",
            "Use case identification and feasibility analysis",
            "Smart contract architecture and security review",
            "Token economy and governance model design",
            "DeFi protocol integration strategy",
            "NFT strategy for brand and customer engagement",
            "Decentralized identity (DID) implementation planning",
            "Web3 regulatory compliance guidance"
        ],
        "benefits": [
            "Leverage blockchain for transparency, trust, and efficiency",
            "Explore new revenue models through tokenization",
            "Stay ahead of the decentralized economy curve",
            "Reduce blockchain project risk with expert guidance"
        ],
        "pricing": {"Starter": "$5,999/project", "Professional": "$19,999/project", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "consult-digital-twin-1",
        "title": "Digital Twin Strategy & Implementation",
        "subtitle": "Build virtual replicas of physical assets, processes, and systems for simulation and optimization",
        "category": "consulting",
        "subcategory": "Digital Twin",
        "description": "Strategic consulting for designing and implementing digital twins of manufacturing processes, supply chains, buildings, and infrastructure for real-time monitoring, simulation, and predictive optimization.",
        "features": [
            "Digital twin readiness and feasibility assessment",
            "IoT sensor and data infrastructure planning",
            "3D modeling and simulation platform selection",
            "Real-time data integration architecture",
            "Predictive maintenance model design",
            "Scenario simulation and what-if analysis",
            "Digital twin governance and versioning",
            "Integration with existing ERP/MES/SCADA systems"
        ],
        "benefits": [
            "Predict failures before they happen — save millions",
            "Optimize operations without disrupting production",
            "Reduce physical prototyping costs by up to 70%",
            "Enable data-driven decision-making across operations"
        ],
        "pricing": {"Starter": "$12,999/project", "Professional": "$39,999/project", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "consult-green-tech-1",
        "title": "Green IT & Sustainable Technology Consulting",
        "subtitle": "Reduce your technology carbon footprint while saving money and improving performance",
        "category": "consulting",
        "subcategory": "Green IT",
        "description": "Consulting to optimize your IT infrastructure for sustainability — reducing energy consumption, e-waste, and carbon emissions while improving efficiency and meeting ESG goals.",
        "features": [
            "IT carbon footprint assessment and baseline measurement",
            "Data center optimization and right-sizing",
            "Workload migration to carbon-aware cloud regions",
            "Energy-efficient hardware refresh planning",
            "E-waste reduction and responsible disposal strategy",
            "Green software engineering practices",
            "Carbon-aware scheduling and demand response",
            "Sustainability reporting and ESG compliance support"
        ],
        "benefits": [
            "Reduce IT energy costs by 20-40%",
            "Meet ESG and sustainability commitments",
            "Attract ESG-conscious customers and investors",
            "Future-proof against tightening environmental regulations"
        ],
        "pricing": {"Starter": "$5,999/project", "Professional": "$19,999/project", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "consult-edge-computing-1",
        "title": "Edge Computing Strategy & Deployment",
        "subtitle": "Bring computation closer to where data is generated for ultra-low latency and bandwidth savings",
        "category": "consulting",
        "subcategory": "Edge Computing",
        "description": "Strategic consulting for deploying edge computing infrastructure to reduce latency, improve reliability, and enable real-time processing for IoT, manufacturing, retail, and autonomous systems.",
        "features": [
            "Edge computing assessment and use case prioritization",
            "Edge architecture design (AWS Wavelength, Azure Edge, custom)",
            "Latency-sensitive application design",
            "Edge-to-cloud data orchestration strategy",
            "5G integration and network optimization",
            "Edge security and zero-trust at the edge",
            "Container and Kubernetes at the edge (K3s, KubeEdge)",
            "Monitoring and management of distributed edge nodes"
        ],
        "benefits": [
            "Achieve sub-10ms latency for critical applications",
            "Reduce bandwidth costs by processing data locally",
            "Enable real-time AI inference at the edge",
            "Improve reliability when cloud connectivity is limited"
        ],
        "pricing": {"Starter": "$7,999/project", "Professional": "$24,999/project", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    }
]

# --- NEW IT SERVICES (newer schema for zion.app) ---
new_it_services = [
    {
        "id": "it-devsecops-1",
        "title": "DevSecOps & Security Automation",
        "subtitle": "Integrate security into every stage of your software delivery pipeline",
        "category": "it",
        "subcategory": "Security Automation",
        "description": "Embed security into CI/CD pipelines with automated SAST, DAST, SCA, container scanning, and infrastructure-as-code security checks — shifting security left without slowing delivery.",
        "features": [
            "Automated SAST/DAST scanning in CI/CD",
            "Software composition analysis (SCA) for dependencies",
            "Container and Kubernetes security scanning",
            "Infrastructure-as-code security validation (Terraform, CloudFormation)",
            "Secrets detection and rotation automation",
            "SBOM generation and vulnerability tracking",
            "Threat modeling automation",
            "Compliance-as-code policy enforcement"
        ],
        "benefits": [
            "Catch vulnerabilities 10x earlier and 100x cheaper",
            "Automate compliance evidence collection",
            "Deploy faster with confidence, not fear",
            "Reduce security incident risk by 80%"
        ],
        "pricing": {"Starter": "$1,499/mo", "Professional": "$4,999/mo", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "it-platform-engineering-1",
        "title": "Internal Developer Platform (IDP) Engineering",
        "subtitle": "Build a self-service developer platform that boosts engineering productivity by 40%",
        "category": "it",
        "subcategory": "Platform Engineering",
        "description": "Design and build an Internal Developer Platform (IDP) that provides self-service capabilities for developers — spinning up environments, deploying applications, and managing infrastructure through golden paths.",
        "features": [
            "Self-service environment provisioning (Backstage, Port, or custom)",
            "Golden path templates for common architectures",
            "Internal API marketplace and service catalog",
            "Automated deployment pipelines per service type",
            "Developer portal with documentation and onboarding",
            "Abstractions over cloud services for simplicity",
            "Usage tracking and cost attribution per team",
            "Platform observability and SLO management"
        ],
        "benefits": [
            "Reduce time-to-first-deploy from weeks to hours",
            "Empower developers to self-serve without ops bottlenecks",
            "Standardize best practices across all teams",
            "Improve developer satisfaction and retention"
        ],
        "pricing": {"Starter": "$2,999/mo", "Professional": "$8,999/mo", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "it-observability-1",
        "title": "AI-Powered Observability & SRE",
        "subtitle": "Next-generation observability with AI-driven anomaly detection and automated incident response",
        "category": "it",
        "subcategory": "Observability & SRE",
        "description": "Comprehensive observability platform combining metrics, logs, traces, and AI-powered anomaly detection to achieve proactive reliability and reduce MTTR to minutes.",
        "features": [
            "Unified observability (metrics, logs, traces, profiles)",
            "AI-powered anomaly detection and root cause analysis",
            "Automated incident classification and routing",
            "SLO/SLI management with error budget tracking",
            "Predictive alerting — detect issues before users do",
            "Runbook automation and remediation playbooks",
            "Dashboard builder with natural language queries",
            "Integration with PagerDuty, OpsGenie, Slack, and more"
        ],
        "benefits": [
            "Reduce MTTR from hours to minutes",
            "Catch anomalies humans would miss",
            "Eliminate alert fatigue with smart grouping",
            "Maintain 99.99% uptime with proactive reliability"
        ],
        "pricing": {"Starter": "$999/mo", "Professional": "$3,499/mo", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "ai-gen-app-dev-1",
        "title": "AI-Powered Application Development",
        "subtitle": "Build production-ready AI-powered applications with LLM orchestration, RAG, and agent frameworks",
        "category": "ai",
        "subcategory": "GenAI Application Development",
        "description": "End-to-end development service for building production-ready AI applications — from LLM-powered chatbots and RAG systems to multi-agent workflows and AI-native products.",
        "features": [
            "LLM application architecture and design",
            "RAG (Retrieval-Augmented Generation) implementation",
            "Multi-agent system design and orchestration (LangChain, LangGraph, CrewAI)",
            "Vector database selection and optimization (Pinecone, Weaviate, Qdrant)",
            "Prompt engineering and fine-tuning workflows",
            "AI safety, guardrails, and output validation",
            "Scalable deployment with cost optimization",
            "Evaluation frameworks and A/B testing for AI outputs"
        ],
        "benefits": [
            "Go from idea to production AI app in weeks, not months",
            "Leverage the latest LLM advances without the R&D burden",
            "Build AI features that scale to millions of users",
            "Reduce hallucinations and improve accuracy with RAG"
        ],
        "pricing": {"Starter": "$4,999/mo", "Professional": "$14,999/mo", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "ai-ethics-audit-1",
        "title": "AI Ethics Audit & Bias Assessment",
        "subtitle": "Comprehensive AI ethics audits ensuring your AI systems are fair, transparent, and trustworthy",
        "category": "ai",
        "subcategory": "AI Ethics & Governance",
        "description": "Independent AI ethics audits examining your AI systems for bias, fairness, transparency, and regulatory compliance. Includes algorithmic impact assessments, bias testing across protected classes, and governance framework design.",
        "features": [
            "Algorithmic bias detection across race, gender, age, and geography",
            "Model interpretability and explainability analysis (XAI)",
            "EU AI Act compliance assessment and readiness",
            "AI impact assessment for high-risk applications",
            "Fairness metrics evaluation (demographic parity, equalized odds)",
            "AI governance framework design (NIST AI RMF, OECD)",
            "Transparency report and model card documentation",
            "Stakeholder engagement and AI literacy workshops"
        ],
        "benefits": [
            "Demonstrate responsible AI to regulators and stakeholders",
            "Prevent PR disasters from biased AI outputs",
            "Build customer trust through AI transparency",
            "Stay ahead of global AI regulation requirements"
        ],
        "pricing": {"Starter": "$7,999/project", "Professional": "$24,999/project", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "cloud-finops-1",
        "title": "Cloud FinOps & Cost Intelligence",
        "subtitle": "Bring financial accountability to cloud spend with automated cost optimization and FinOps practices",
        "category": "it",
        "subcategory": "Cloud FinOps",
        "description": "Comprehensive cloud cost management service combining automated tooling, reserved instance optimization, anomaly detection, and organizational FinOps culture to reduce cloud spend by 30-40% without performance impact.",
        "features": [
            "Multi-cloud cost visibility and chargeback/showback",
            "AI-driven rightsizing recommendations",
            "Automated reserved instance and savings plan optimization",
            "Real-time cost anomaly detection and budget alerts",
            "Kubernetes cost optimization (HPA, node optimization)",
            "Tag governance and resource ownership tracking",
            "FinOps maturity assessment and roadmap",
            "Monthly cost optimization reviews and savings tracking"
        ],
        "benefits": [
            "Reduce cloud spend by 30-40% sustainably",
            "Eliminate cloud waste and orphaned resources",
            "Allocate costs accurately to teams and projects",
            "Build a culture of cloud cost awareness"
        ],
        "pricing": {"Starter": "$999/mo", "Professional": "$3,499/mo", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    },
    {
        "id": "it-zero-trust-1",
        "title": "Zero Trust Security Implementation",
        "subtitle": "Architect and implement Zero Trust security for your entire digital infrastructure",
        "category": "it",
        "subcategory": "Zero Trust Security",
        "description": "Complete Zero Trust architecture implementation — from identity and access management to network microsegmentation, device trust, and continuous verification across your entire infrastructure.",
        "features": [
            "Zero Trust maturity assessment and roadmap",
            "Identity-aware proxy deployment (BeyondCorp model)",
            "Network microsegmentation design and implementation",
            "Multi-factor authentication everywhere (MFA/SSO)",
            "Device trust and endpoint verification",
            "Least-privilege access policy design",
            "Continuous authentication and session management",
            "Zero Trust for remote workforce and third-party access"
        ],
        "benefits": [
            "Eliminate lateral movement for attackers",
            "Replace vulnerable VPN with modern secure access",
            "Meet compliance requirements (NIST 800-207, CISA Zero Trust)",
            "Reduce breach blast radius by 90%"
        ],
        "pricing": {"Starter": "$3,999/mo", "Professional": "$12,999/mo", "Enterprise": "Custom"},
        "contactUrl": "/contact"
    }
]

# ═══════════════════════════════════════════════════════════════════════
# FUNCTIONS TO FORMAT SERVICES
# ═══════════════════════════════════════════════════════════════════════

def format_service_new_schema(svc, indent="  "):
    """Format a service for the newer schema (zion.app)"""
    lines = []
    lines.append(f"{indent}{{")
    lines.append(f'{indent}  id: \'{svc["id"]}\',')
    lines.append(f'{indent}  title: \'{svc["title"]}\',')
    lines.append(f'{indent}  subtitle: \'{svc["subtitle"]}\',')
    lines.append(f"{indent}  category: '{svc['category']}',")
    lines.append(f"{indent}  subcategory: '{svc['subcategory']}',")
    lines.append(f'{indent}  description: `{svc["description"]}`')
    
    # Features
    lines.append(f"{indent}  features: [")
    for feat in svc["features"]:
        lines.append(f'    \'{feat}\',')
    lines.append(f"{indent}  ],")
    
    # Benefits
    lines.append(f"{indent}  benefits: [")
    for ben in svc["benefits"]:
        lines.append(f'    \'{ben}\',')
    lines.append(f"{indent}  ],")
    
    # Pricing
    lines.append(f"{indent}  pricing: {{")
    for key, val in svc["pricing"].items():
        lines.append(f'    {key}: \'{val}\',')
    lines.append(f"{indent}  }},")
    
    lines.append(f'{indent}  contactUrl: \'{svc["contactUrl"]}\'')
    lines.append(f"{indent}}}")
    return "\n".join(lines)


def format_service_old_schema(svc, indent="  "):
    """Format a service for the older schema (git-tracked)"""
    lines = []
    lines.append(f"{indent}{{")
    lines.append(f'    id: \'{svc["id"]}\',')
    lines.append(f'    title: \'{svc["title"]}\',')
    lines.append(f"    description: '{svc['description']}',")

    # Features
    lines.append(f"    features: [")
    for feat in svc["features"]:
        lines.append(f"      '{feat}',")
    lines.append(f"    ],")

    # Benefits
    lines.append(f"    benefits: [")
    for ben in svc["benefits"]:
        lines.append(f"      '{ben}',")
    lines.append(f"    ],")

    # Pricing (basic/pro/enterprise)
    lines.append(f"    pricing: {{")
    p = svc["pricing"]
    # Map Starter->basic, Professional->pro
    basic = p.get("Starter", p.get("basic", ""))
    pro = p.get("Professional", p.get("pro", ""))
    ent = p.get("Enterprise", p.get("enterprise", ""))
    lines.append(f"      basic: '{basic}',")
    lines.append(f"      pro: '{pro}',")
    lines.append(f"      enterprise: '{ent}'")
    lines.append(f"    }},")

    # Contact info
    lines.append(f"    contactInfo: {{")
    lines.append(f"      website: '/{svc['id']}',")
    lines.append(f"      email: 'commercial@ziontechgroup.com',")
    lines.append(f"      phone: '+1 302 464 0950'")
    lines.append(f"    }},")

    # Icon - pick based on category
    icon_map = {
        "ai": "🧠", "it": "💻", "saas": "🚀", "cloud": "☁️",
        "security": "🔒", "data": "📊", "automation": "⚡"
    }
    icon = icon_map.get(svc["category"], "🔧")
    lines.append(f"    icon: '{icon}',")
    lines.append(f"    href: '/{svc['id']}',")

    if svc.get("popular"):
        lines.append(f"    popular: true,")

    # Category mapping for old schema
    cat = svc["category"]
    if cat == "it":
        pass  # keep 'it'
    elif cat == "ai":
        pass  # keep 'ai'
    else:
        cat = "it"  # default fallback
    lines.append(f"    category: '{cat}'")
    lines.append(f"  }}")
    return "\n".join(lines)


# ═══════════════════════════════════════════════════════════════════════
# MODIFY ZION.APP FILE (newer schema)
# ═══════════════════════════════════════════════════════════════════════

def modify_zion_app_file():
    path = '/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts'
    with open(path, 'r') as f:
        content = f.read()
    
    lines = content.split('\n')
    
    # Find the last AI service and insert new AI services after it
    # Last AI section ends near "category: 'ai'\n  }\n];\n"
    # Find the last "category: 'ai'" in the AI block
    last_ai_idx = -1
    for i in range(len(lines)):
        if "category: 'ai'" in lines[i]:
            last_ai_idx = i
    
    # Find the closing ] after last AI
    ai_close_idx = -1
    for i in range(last_ai_idx + 1, len(lines)):
        if lines[i].strip() == '];':
            ai_close_idx = i
            break
    
    if ai_close_idx > 0:
        # Insert new AI services before the closing ]
        new_ai_code = []
        for svc in new_ai_services:
            new_ai_code.append(",")
            new_ai_code.append("")
            new_ai_code.append(format_service_new_schema(svc))
        new_ai_str = "\n".join(new_ai_code)
        
        # Insert before the closing ];
        lines.insert(ai_close_idx, new_ai_str)
        content = "\n".join(lines)
    
    # Find the end of the consulting section and add new consulting services
    # Find the last consulting entry
    last_consult_idx = -1
    for i in range(len(lines)):
        if "category: 'consulting'" in lines[i]:
            last_consult_idx = i
    
    if last_consult_idx > 0:
        # Find the closing }] of the consulting array
        consult_close = -1
        for i in range(last_consult_idx + 1, len(lines)):
            if lines[i].strip() == '},' or lines[i].strip() == '}':
                # Check if next meaningful line is a closing bracket or another service
                for j in range(i+1, min(len(lines), i+5)):
                    stripped = lines[j].strip()
                    if stripped == '];':
                        consult_close = i
                        break
                    elif stripped.startswith('{'):
                        break
            if consult_close > 0:
                break
        
        if consult_close > 0:
            new_consult_code = []
            for svc in new_consulting_services:
                new_consult_code.append(",")
                new_consult_code.append("")
                new_consult_code.append(format_service_new_schema(svc))
            new_consult_str = "\n".join(new_consult_code)
            lines2 = content.split('\n')
            lines2.insert(consult_close, new_consult_str)
            content = "\n".join(lines2)
    
    with open(path, 'w') as f:
        f.write(content)
    
    print(f"✅ Updated zion.app/servicesData.ts")


# ═══════════════════════════════════════════════════════════════════════
# MODIFY GIT-TRACKED FILE (older schema)
# ═══════════════════════════════════════════════════════════════════════

def modify_git_tracked_file():
    path = '/Users/klebergarciaalcatrao/app/data/servicesData.ts'
    with open(path, 'r') as f:
        content = f.read()
    
    # Find last IT service (before itSolutions) and insert new IT services
    # The IT array closes at line 5484 with ];\nexport const itSolutions
    
    # Insert new IT services before the ]; that closes itServices array
    new_it_code = []
    for svc in new_it_services:
        new_it_code.append("")
        new_it_code.append(format_service_old_schema(svc))
        new_it_code.append(",")
    new_it_str = "\n".join(new_it_code)
    
    # Replace pattern: find the last IT service entry closing with }\n];\n
    # The file ends with the IT service closing, then ];
    # Pattern: insert before "  }\n];\nexport const itSolutions"
    
    marker = "    category: 'it'\n  }\n];\nexport const itSolutions"
    
    if marker in content:
        new_content = content.replace(
            marker,
            new_it_str + ",\n  }\n];\nexport const itSolutions"
        )
        # Verify replacement happened
        if new_content == content:
            print("⚠️ No changes made to git-tracked file")
        else:
            with open(path, 'w') as f:
                f.write(new_content)
            print(f"✅ Updated git-tracked app/data/servicesData.ts")
    else:
        # Try alternative patterns
        print("⚠️ Could not find IT closing marker in git-tracked file")
        # Let's print what's around line 5480-5485
        lines = content.split('\n')
        for i in range(5475, min(len(lines), 5490)):
            print(f"  {i+1}: {lines[i]}")


# ═══════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════

if __name__ == '__main__':
    modify_zion_app_file()
    modify_git_tracked_file()
    print("✅ All modifications complete")