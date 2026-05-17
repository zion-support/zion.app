#!/usr/bin/env python3
"""
Fix: Add any remaining missing services to both files.
"""
import os

ZION_PATH = '/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts'
GIT_PATH = '/Users/klebergarciaalcatrao/app/data/servicesData.ts'

# ═══════════════════════════════════════════════════════════════════
# Missing from zion.app (newer schema): IT services + 2 AI services
# ═══════════════════════════════════════════════════════════════════

missing_ai_zion = [
    {
        "id": "ai-gen-app-dev-1",
        "title": "AI-Powered Application Development",
        "subtitle": "Build production-ready AI apps with LLM orchestration, RAG, and agent frameworks",
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
    }
]

missing_it_zion = [
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


def format_ai_svc(svc):
    return f"""  {{
    id: '{svc['id']}',
    title: '{svc['title']}',
    subtitle: '{svc['subtitle']}',
    category: '{svc['category']}',
    subcategory: '{svc['subcategory']}',
    description: `{svc['description']}`
    features: [
{chr(10).join('      ' + repr(f) + ',' for f in svc['features'])}
    ],
    benefits: [
{chr(10).join('      ' + repr(b) + ',' for b in svc['benefits'])}
    ],
    pricing: {{
      Starter: '{svc['pricing']['Starter']}',
      Professional: '{svc['pricing']['Professional']}',
      Enterprise: '{svc['pricing']['Enterprise']}'
    }},
    contactUrl: '{svc['contactUrl']}'
  }}"""


def format_it_svc(svc):
    return f"""  {{
    id: '{svc['id']}',
    title: '{svc['title']}',
    subtitle: '{svc['subtitle']}',
    description: `{svc['description']}`,
    features: [
{chr(10).join('      ' + repr(f) + ',' for f in svc['features'])}
    ],
    benefits: [
{chr(10).join('      ' + repr(b) + ',' for b in svc['benefits'])}
    ],
    pricing: {{
      Starter: '{svc['pricing']['Starter']}',
      Professional: '{svc['pricing']['Professional']}',
      Enterprise: '{svc['pricing']['Enterprise']}'
    }},
    contactUrl: '{svc['contactUrl']}'
  }}"""


def fix_zion_app():
    """Fix zion.app file - add missing AI and IT services"""
    with open(ZION_PATH, 'r') as f:
        content = f.read()

    original = content

    # Find the last category: 'ai' block and insert before its closing }
    # Then insert before ]; of aiServices array
    # Strategy: find "export const itServices" and insert before it

    # Add missing AI services before the itServices export
    if "export const itServices" in content:
        ai_block = ""
        for svc in missing_ai_zion:
            ai_block += ",\n" + format_ai_svc(svc)

        content = content.replace(
            "export const itServices",
            ai_block + ",\n\nexport const itServices"
        )

    # Add missing IT services before itSolutions export
    if "export const itSolutions" in content:
        it_block = ""
        for svc in missing_it_zion:
            it_block += ",\n" + format_it_svc(svc)

        content = content.replace(
            "export const itSolutions",
            it_block + ",\n\nexport const itSolutions"
        )

    if content != original:
        with open(ZION_PATH, 'w') as f:
            f.write(content)
        print(f"✅ Fixed zion.app file")
    else:
        print("⚠️ No changes to zion.app (already complete?)")

    # Verify
    with open(ZION_PATH, 'r') as f:
        new_content = f.read()

    for svc in missing_ai_zion + missing_it_zion:
        if svc['id'] in new_content:
            print(f"  ✅ {svc['id']} present")
        else:
            print(f"  ❌ {svc['id']} MISSING")


def fix_git_tracked():
    """Fix git-tracked file - add missing IT services"""
    with open(GIT_PATH, 'r') as f:
        content = f.read()

    original = content

    # Check which new IT services are missing
    missing_ids = []
    for svc in missing_it_zion:
        if svc['id'].replace('_1', '') not in content and svc['id'] not in content:
            missing_ids.append(svc)

    if not missing_ids:
        print("All IT services already in git-tracked file")
        return

    # Format for old schema
    def format_old(svc):
        lines = []
        lines.append("  {")
        lines.append(f'    id: \'{svc["id"]}\',')
        lines.append(f'    title: \'{svc["title"]}\',')
        lines.append(f"    description: '{svc['description'].replace(chr(96), chr(39))}',")
        lines.append("    features: [")
        for f in svc['features']:
            lines.append(f"      '{f}',")
        lines.append("    ],")
        lines.append("    benefits: [")
        for b in svc['benefits']:
            lines.append(f"      '{b}',")
        lines.append("    ],")
        lines.append("    pricing: {")
        # Use basic/pro/enterprise keys
        p = svc['pricing']
        # Strip $ and /mo or /project
        def clean_price(val):
            return val.replace('$', '').replace('/mo', '').replace('/project', '').replace('Custom', 'Custom')
        lines.append(f"      basic: '{clean_price(p['Starter'])}',")
        lines.append(f"      pro: '{clean_price(p['Professional'])}',")
        lines.append(f"      enterprise: '{clean_price(p['Enterprise'])}'")
        lines.append("    },")
        lines.append("    contactInfo: {")
        lines.append(f"      website: '/{svc['id']}',")
        lines.append("      email: 'commercial@ziontechgroup.com',")
        lines.append("      phone: '+1 302 464 0950'")
        lines.append("    },")
        icon = {'it': '💻', 'cloud': '☁️'}.get(svc['category'], '🔧')
        lines.append(f"    icon: '{icon}',")
        lines.append(f"    href: '/{svc['id']}',")
        lines.append(f"    category: '{svc['category']}'")
        lines.append("  }")
        return "\n".join(lines)

    new_block = ""
    for svc in missing_ids:
        new_block += format_old(svc) + ",\n\n"

    # Insert before the closing of itServices array:
    # Pattern: "  }\n];\nexport const itSolutions"
    pattern = "  }\n];\nexport const itSolutions"
    if pattern in content:
        content = content.replace(pattern, new_block + "  }\n];\nexport const itSolutions")

    if content != original:
        with open(GIT_PATH, 'w') as f:
            f.write(content)
        print(f"✅ Fixed git-tracked file - added {len(missing_ids)} IT services")
    else:
        print("⚠️ No changes to git-tracked file")


if __name__ == '__main__':
    fix_zion_app()
    fix_git_tracked()
    print("\n✅ All fixes complete!")