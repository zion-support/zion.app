#!/usr/bin/env python3
"""
Wave 2: Batch 8 Services
Insert new services into each array BEFORE its closing ];
Process from BOTTOM to TOP so line numbers stay valid.
"""

FILE = '/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts'

with open(FILE, 'r') as f:
    lines = f.readlines()

# Find all "];" lines that are followed (after blank/comment lines) by a section header
# Returns list of (close_line_index, section_name) sorted by line number
def find_section_boundaries(lines):
    boundaries = []
    for i in range(len(lines)):
        if lines[i].strip() == '];':
            # Look ahead for a section header within next 8 lines
            for j in range(i+1, min(i+10, len(lines))):
                stripped = lines[j].strip()
                if 'SECTION 2' in stripped:
                    boundaries.append((i, j, 'SECTION 2: AI'))
                    break
                elif 'SECTION 3' in stripped:
                    boundaries.append((i, j, 'SECTION 3: IT'))
                    break
                elif 'SECTION 4' in stripped:
                    boundaries.append((i, j, 'SECTION 4: SAAS'))
                    break
                elif 'COMBINED EXPORT' in stripped:
                    boundaries.append((i, j, 'COMBINED EXPORT: Consulting'))
                    break
    return boundaries

boundaries = find_section_boundaries(lines)
print("Found boundaries:")
for close_idx, header_idx, name in boundaries:
    print(f"  {name}: ]; at line {close_idx+1}, header at line {header_idx+1}")

# Sort by line number descending (bottom to top)
boundaries.sort(key=lambda x: x[0], reverse=True)

# ─────────────────────────────────────────────
# Define new services for each section
# ─────────────────────────────────────────────

def make_ai_services():
    return [
        '// ══════════════════════════════',
        '// NEW: AI Batch 8 Additions',
        '// ══════════════════════════════',
        '  {',
        "    id: 'ai-energy-management-2',",
        "    title: 'AI Energy & Carbon Optimization',",
        "    subtitle: 'Intelligent energy management that cuts costs and carbon footprint by 30%+',",
        "    category: 'ai',",
        "    subcategory: 'Sustainability & Energy',",
        "    description: 'AI-driven energy management platform optimizing consumption across buildings, manufacturing, and data centers with ESG reporting.',",
        '    features: [',
        "      'Real-time energy consumption monitoring across all facilities',",
        "      'ML-based demand forecasting with weather and occupancy data',",
        "      'Automated HVAC, lighting, and equipment scheduling',",
        "      'Peak demand prediction and load shifting optimization',",
        "      'Carbon emissions tracking and ESG compliance reporting',",
        "      'Solar and renewable energy integration optimization'",
        '    ],',
        '    benefits: [',
        "      'Reduce energy costs by 20-40%',",
        "      'Achieve ESG and sustainability compliance targets',",
        "      'Extend equipment life through intelligent scheduling'",
        '    ],',
        "    pricing: { Starter: '$1,299/mo', Professional: '$3,999/mo', Enterprise: 'Custom' },",
        "    contactUrl: '/contact'",
        '  },',
        '  {',
        "    id: 'ai-identity-verification-2',",
        "    title: 'AI-Powered Identity Verification',",
        "    subtitle: 'Real-time KYC and identity verification with liveness detection',",
        "    category: 'ai',",
        "    subcategory: 'Identity & Security',",
        "    description: 'Automated identity verification pipeline with liveness detection and global watchlist screening.',",
        '    features: [',
        "      'ID document scanning and validation for 190+ countries',",
        "      'Facial recognition with anti-spoofing liveness detection',",
        "      'Watchlist screening against OFAC, EU sanctions, and PEP lists',",
        "      'Age verification and restricted access control',",
        "      'Real-time verification in under 3 seconds',",
        "      'Audit trail with tamper-proof verification records'",
        '    ],',
        '    benefits: [',
        "      'Reduce manual verification workload by 90%',",
        "      'Achieve regulatory compliance with automated KYC/AML',",
        "      'Onboard users 5x faster than manual processes'",
        '    ],',
        "    pricing: { Starter: '$0.50/verification', Professional: 'Custom volume pricing', Enterprise: 'Custom' },",
        "    contactUrl: '/contact'",
        '  },',
        '  {',
        "    id: 'ai-recommendation-engine-2',",
        "    title: 'AI Recommendation Engine',",
        "    subtitle: 'Personalized recommendations that increase revenue by 18-35%',",
        "    category: 'ai',",
        "    subcategory: 'Recommendation Systems',",
        "    description: 'Deep learning-powered recommendation engine for e-commerce, media, and SaaS platforms.',",
        '    features: [',
        "      'Real-time collaborative and content-based filtering',",
        "      'Deep neural network models for cold-start problem solving',",
        "      'Contextual recommendations based on time, location, and device',",
        "      'A/B testing framework with statistical significance analysis',",
        "      'Cross-sell and upsell optimization algorithms',",
        "      'Explainable AI showing \"why this was recommended\"',",
        "      'API-first architecture for easy integration'",
        '    ],',
        '    benefits: [',
        "      'Increase average order value by 15-25%',",
        "      'Boost conversion rates with personalized experiences',",
        "      'Continuous learning from user behavior improves over time'",
        '    ],',
        "    pricing: { Starter: '$1,999/mo', Professional: '$4,999/mo', Enterprise: 'Custom' },",
        "    contactUrl: '/contact'",
        '  },',
        '  {',
        "    id: 'ai-predictive-maintenance-2',",
        "    title: 'AI-Powered Predictive Maintenance',",
        "    subtitle: 'Reduce downtime by 45% with ML-based equipment failure prediction',",
        "    category: 'ai',",
        "    subcategory: 'Predictive Maintenance',",
        "    description: 'IoT sensor data analysis combined with ML to predict equipment failures.',",
        '    features: [',
        "      'Real-time sensor data ingestion from industrial IoT devices',",
        "      'Anomaly detection using autoencoders and time-series analysis',",
        "      'Remaining useful life (RUL) prediction models',",
        "      'Automated maintenance work order generation',",
        "      'Digital twin integration for simulation and what-if analysis',",
        "      'Multi-site asset fleet management dashboard',",
        "      'Integration with SCADA, ERP, and CMMS systems'",
        '    ],',
        '    benefits: [',
        "      'Reduce unplanned downtime by up to 45%',",
        "      'Lower maintenance costs by 25-30%',",
        "      'Extend equipment lifespan by 20%+'",
        '    ],',
        "    pricing: { Starter: '$2,499/mo', Professional: '$6,499/mo', Enterprise: 'Custom' },",
        "    contactUrl: '/contact'",
        '  },',
        '',
    ]

def make_it_services():
    return [
        '// ══════════════════════════════',
        '// NEW: IT Batch 8 Additions',
        '// ══════════════════════════════',
        '  {',
        "    id: 'it-data-mesh-2',",
        "    title: 'Data Mesh Architecture Implementation',",
        "    subtitle: 'Decentralized data ownership with domain-oriented data products',",
        "    category: 'it',",
        "    subcategory: 'Data Architecture',",
        "    description: 'Implement a data mesh architecture that distributes data ownership across business domains.',",
        '    features: [',
        "      'Domain-oriented data product design and implementation',",
        "      'Self-serve data platform with data discovery catalog',",
        "      'Federated computational governance framework',",
        "      'Data mesh observability and quality monitoring',",
        "      'Automated data pipeline generation from domain schemas',",
        "      'Data contract management and schema evolution'",
        '    ],',
        '    benefits: [',
        "      'Eliminate data bottlenecks and reduce time-to-insight by 60%',",
        "      'Scale data teams without centralized bottlenecks',",
        "      'Accelerate data product delivery from months to weeks'",
        '    ],',
        "    pricing: { Starter: '$9,999/project', Professional: '$29,999/project', Enterprise: 'Custom' },",
        "    contactUrl: '/contact'",
        '  },',
        '  {',
        "    id: 'it-sre-platform-2',",
        "    title: 'Site Reliability Engineering Platform',",
        "    subtitle: 'Production-grade SRE with automated incident response',",
        "    category: 'it',",
        "    subcategory: 'Site Reliability',",
        "    description: 'Comprehensive SRE platform implementing Google SRE best practices.',",
        '    features: [',
        "      'SLO/SLI/SLA definition and automated tracking',",
        "      'Error budget policy engine with automated alerting',",
        "      'Automated incident classification and response playbooks',",
        "      'Chaos engineering framework for resilience testing',",
        "      'Production readiness review automation',",
        "      'Dependency mapping and blast radius analysis',",
        "      'Post-incident review automation with action tracking'",
        '    ],',
        '    benefits: [',
        "      'Achieve 99.99%+ uptime with systematic reliability engineering',",
        "      'Reduce MTTR by 70%',",
        "      'Free engineers to focus on features instead of firefighting'",
        '    ],',
        "    pricing: { Starter: '$2,499/mo', Professional: '$7,999/mo', Enterprise: 'Custom' },",
        "    contactUrl: '/contact'",
        '  },',
        '  {',
        "    id: 'it-ml-ops-2',",
        "    title: 'MLOps & Model Lifecycle Management',",
        "    subtitle: 'End-to-end MLOps for model versioning, deployment, and monitoring',",
        "    category: 'it',",
        "    subcategory: 'MLOps',",
        "    description: 'Production MLOps platform managing the entire ML lifecycle.',",
        '    features: [',
        "      'Experiment tracking with MLflow and Weights & Biases integration',",
        "      'Model registry with version control and lineage tracking',",
        "      'Automated CI/CD pipeline for model deployment (Blue/Green, Canary)',",
        "      'Model monitoring with data drift and concept drift detection',",
        "      'Feature store with online/offline serving',",
        "      'Model explainability and bias detection dashboards'",
        '    ],',
        '    benefits: [',
        "      'Deploy ML models reliably with repeatable pipelines',",
        "      'Reduce time from experiment to production by 80%',",
        "      'Ensure model compliance and auditability'",
        '    ],',
        "    pricing: { Starter: '$1,499/mo', Professional: '$4,499/mo', Enterprise: 'Custom' },",
        "    contactUrl: '/contact'",
        '  },',
        '',
    ]

def make_saas_services():
    return [
        '// ══════════════════════════════',
        '// NEW: SAAS Batch 8 Additions',
        '// ══════════════════════════════',
        '  {',
        "    id: 'saas-hr-automation-2',",
        "    title: 'AI-Powered HR Automation Suite',",
        "    subtitle: 'Automate hiring, onboarding, performance reviews with AI',",
        "    category: 'saas',",
        "    subcategory: 'HR & Recruitment Automation',",
        "    description: 'Comprehensive HR automation platform using AI to streamline recruitment, onboarding, and performance analytics.',",
        '    features: [',
        "      'AI-powered resume screening and candidate ranking',",
        "      'Automated interview scheduling with multi-calendar sync',",
        "      'Onboarding checklist automation with document management',",
        "      'Continuous performance tracking with 360-degree feedback',",
        "      'Predictive attrition risk scoring',",
        "      'Employee engagement pulse surveys with AI sentiment analysis'",
        '    ],',
        '    benefits: [',
        "      'Reduce time-to-hire by 50%',",
        "      'Cut HR administrative workload by 70%',",
        "      'Improve employee retention with predictive analytics'",
        '    ],',
        "    pricing: { Starter: '$149/mo', Professional: '$399/mo', Enterprise: 'Custom' },",
        "    contactUrl: '/contact'",
        '  },',
        '  {',
        "    id: 'saas-social-media-2',",
        "    title: 'AI Social Media Management Platform',",
        "    subtitle: 'Intelligent social media scheduling, content creation, and analytics',",
        "    category: 'saas',",
        "    subcategory: 'Social Media Marketing',",
        "    description: 'AI-powered social media management that auto-generates posts and optimizes schedules.',",
        '    features: [',
        "      'AI content generation for posts, captions, and hashtags',",
        "      'Intelligent scheduling optimized by audience activity patterns',",
        "      'Cross-platform management (LinkedIn, Instagram, X, Facebook, TikTok)',",
        "      'Real-time social listening and brand mention monitoring',",
        "      'Competitor analysis with share-of-voice tracking',",
        "      'Sentiment analysis on comments and mentions'",
        '    ],',
        '    benefits: [',
        "      'Save 10+ hours per week on social media management',",
        "      'Increase engagement by 40% with AI-optimized content',",
        "      'Prove social media ROI with detailed attribution reporting'",
        '    ],',
        "    pricing: { Starter: '$49/mo', Professional: '$149/mo', Enterprise: 'Custom' },",
        "    contactUrl: '/contact'",
        '  },',
        '  {',
        "    id: 'saas-customer-success-2',",
        "    title: 'Customer Success Automation Platform',",
        "    subtitle: 'Proactive health scoring and churn prevention powered by AI',",
        "    category: 'saas',",
        "    subcategory: 'Customer Success',",
        "    description: 'AI-driven customer success platform monitoring usage, health scores, and expansion opportunities.',",
        '    features: [',
        "      'Automated customer health scoring based on product usage signals',",
        "      'Churn prediction with 90-day advance warning system',",
        "      'Automated playbooks for at-risk accounts (emails, tasks, alerts)',",
        "      'Upsell and cross-sell opportunity identification',",
        "      'NPS/CSAT survey automation with response analysis',",
        "      'Integration with Salesforce, HubSpot, and Intercom'",
        '    ],',
        '    benefits: [',
        "      'Reduce customer churn by 30%+ with early intervention',",
        "      'Increase net revenue retention to 120%+',",
        "      'Scale customer success without proportional headcount'",
        '    ],',
        "    pricing: { Starter: '$199/mo', Professional: '$599/mo', Enterprise: 'Custom' },",
        "    contactUrl: '/contact'",
        '  },',
        '',
    ]

def make_consulting_services():
    return [
        '// ══════════════════════════════',
        '// NEW: Consulting Batch 8 Additions',
        '// ══════════════════════════════',
        '  {',
        "    id: 'consult-cybersecurity-2',",
        "    title: 'Cybersecurity Assessment & Penetration Testing',",
        "    subtitle: 'Comprehensive security audits and penetration testing',",
        "    category: 'consulting',",
        "    subcategory: 'Cybersecurity',",
        "    description: 'Expert cybersecurity consulting including network pen testing, application security assessments, cloud security audits, and compliance readiness evaluations.',",
        '    features: [',
        "      'External and internal network penetration testing',",
        "      'Web application and API security assessment (OWASP Top 10)',",
        "      'Cloud infrastructure security audit (AWS/Azure/GCP)',",
        "      'Social engineering and phishing simulation campaigns',",
        "      'Compliance gap analysis (SOC 2, ISO 27001, PCI-DSS, HIPAA)',",
        "      'Red team/blue team exercise coordination',",
        "      'Detailed remediation roadmap with CVSS-scored findings'",
        '    ],',
        '    benefits: [',
        "      'Identify critical vulnerabilities before attackers do',",
        "      'Meet compliance requirements for SOC 2, ISO 27001, PCI-DSS',",
        "      'Reduce breach risk with prioritized remediation plans',",
        "      'Build a culture of security awareness'",
        '    ],',
        "    pricing: { Starter: '$9,999/project', Professional: '$29,999/project', Enterprise: 'Custom' },",
        "    contactUrl: '/contact'",
        '  },',
        '  {',
        "    id: 'consult-mlops-2',",
        "    title: 'MLOps & AI Infrastructure Consulting',",
        "    subtitle: 'Build production-grade ML infrastructure with automated pipelines',",
        "    category: 'consulting',",
        "    subcategory: 'MLOps & AI Infrastructure',",
        "    description: 'Expert consulting to design and implement production-grade ML infrastructure.',",
        '    features: [',
        "      'ML infrastructure architecture assessment and design',",
        "      'Model registry and feature store implementation',",
        "      'Automated CI/CD pipeline for model deployment',",
        "      'Model monitoring with data drift and concept drift detection',",
        "      'Data versioning and lineage tracking implementation',",
        "      'Kubernetes-based ML workload orchestration',",
        "      'ML governance framework with audit trails and compliance'",
        '    ],',
        '    benefits: [',
        "      'Deploy ML models reliably with repeatable pipelines',",
        "      'Reduce time from experiment to production by 80%',",
        "      'Ensure model compliance and auditability'",
        '    ],',
        "    pricing: { Starter: '$12,999/project', Professional: '$39,999/project', Enterprise: 'Custom' },",
        "    contactUrl: '/contact'",
        '  },',
        '',
    ]

# ─────────────────────────────────────────────
# Now do the insertions bottom-to-top
# ─────────────────────────────────────────────

services_map = {
    'SECTION 2: AI': make_ai_services,
    'SECTION 3: IT': make_it_services,
    'SECTION 4: SAAS': make_saas_services,
    'COMBINED EXPORT: Consulting': make_consulting_services,
}

for close_idx, header_idx, name in boundaries:
    maker = services_map[name]
    new_lines_list = maker()
    # Insert the new lines right after the ]; line (at index close_idx+1)
    for offset, nl in enumerate(new_lines_list):
        lines.insert(close_idx + 1 + offset, nl + '\n')
    print(f"{name}: inserted {len(new_lines_list)} lines after line {close_idx+1}")

# ── Update home page stats ──
with open(FILE.replace('servicesData.ts', 'page.tsx'), 'r') as f:
    home = f.read()
if '159+' in home:
    home = home.replace('159+', '172+')
    print("Updated home page: 159+ -> 172+")
if '138+' in home:
    home = home.replace('138+', '169+')
    print("Updated home page: 138+ -> 169+")
with open(FILE.replace('servicesData.ts', 'page.tsx'), 'w') as f:
    f.write(home)

# ── Write and verify ──
with open(FILE, 'w') as f:
    f.writelines(lines)

content = ''.join(lines)
opens = content.count('{')
closes = content.count('}')
print(f"\nBraces: opens={opens}, closes={closes}, delta={opens-closes}")

ai_count = content.count("category: 'ai'")
it_count = content.count("category: 'it'")
saas_count = content.count("category: 'saas'")
consult_count = content.count("category: 'consulting'")
print(f"Services - AI: {ai_count}, IT: {it_count}, SAAS: {saas_count}, Consulting: {consult_count}")
print(f"Total services: {ai_count + it_count + saas_count + consult_count}")