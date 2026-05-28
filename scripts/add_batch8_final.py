#!/usr/bin/env python3
"""
Wave 2: Insert Batch 8 services into each array BEFORE its closing ];
Insertions done from BOTTOM to TOP so line numbers stay valid.
"""

FILE = '/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts'

with open(FILE, 'r') as f:
    lines = f.readlines()

# Helper: insert lines before a given line index
def insert_before(lines, before_idx, new_lines):
    for i, nl in enumerate(new_lines):
        lines.insert(before_idx + i, nl + '\n')
    return lines

# ── 4. CONSULTING: Insert before line 4995 (]); after line 4994 ──
consult_new = [
    '// ══════════════════════════════',
    '// NEW: Consulting Batch 8',
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
    "    description: 'Expert consulting to design and implement production-grade ML infrastructure including model registries and automated pipelines.',",
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
lines = insert_before(lines, 4995, consult_new)
print("Consulting: inserted 2 services before line 4995")

# ── 3. SAAS: Original line 4332 ];  now shifted by 19 ──
saas_offset = 19
saas_close_line = 4332 + saas_offset

saas_new = [
    '// ══════════════════════════════',
    '// NEW: SAAS Batch 8',
    '// ══════════════════════════════',
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
    '',
]
lines = insert_before(lines, saas_close_line, saas_new)
print(f"SAAS: inserted 3 services before line {saas_close_line}")

# ── 2. IT: Original line 2963 ];  now shifted by 19 + 27 = 46 ──
it_offset = 46
it_close_line = 2963 + it_offset

it_new = [
    '// ══════════════════════════════',
    '// NEW: IT Batch 8',
    '// ══════════════════════════════',
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
    '',
]
lines = insert_before(lines, it_close_line, it_new)
print(f"IT: inserted 3 services before line {it_close_line}")

# ── 1. AI: Original line 1748 ];  now shifted by 46 + 30 = 76 ──
ai_offset = 76
ai_close_line = 1748 + ai_offset

ai_new = [
    '// ══════════════════════════════',
    '// NEW: AI Batch 8',
    '// ══════════════════════════════',
    '  {',
    "    id: 'ai-energy-management-2',",
    "    title: 'AI Energy & Carbon Optimization',",
    "    subtitle: 'Intelligent energy management that cuts costs and carbon footprint by 30%+',",
    "    category: 'ai',",
    "    subcategory: 'Sustainability & Energy',",
    "    description: 'AI-driven energy management that optimizes consumption across buildings and data centers.',",
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
    "    description: 'Deep learning-powered recommendation engine for e-commerce and media platforms.',",
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
lines = insert_before(lines, ai_close_line, ai_new)
print(f"AI: inserted 4 services before line {ai_close_line}")

# ── Update service counts on home page ──
home_file = '/Users/klebergarciaalcatrao/zion.app/app/page.tsx'
with open(home_file, 'r') as f:
    home = f.read()
if '159+' in home:
    home = home.replace('159+', '172+')
    print("Updated home page: 159+ -> 172+")
if '138+' in home:
    home = home.replace('138+', '169+')
    print("Updated home page: 138+ -> 169+")

with open(home_file, 'w') as f:
    f.write(home)

# Write the updated services file
with open(FILE, 'w') as f:
    f.writelines(lines)

# Verify braces
content = ''.join(lines)
opens = content.count('{')
closes = content.count('}')
print(f"\nBraces: opens={opens}, closes={closes}, delta={opens-closes}")

# Count services per category
ai_count = content.count("category: 'ai'")
it_count = content.count("category: 'it'")
saas_count = content.count("category: 'saas'")
consult_count = content.count("category: 'consulting'")
print(f"Services - AI: {ai_count}, IT: {it_count}, SAAS: {saas_count}, Consulting: {consult_count}")
print(f"Total new: {ai_count + it_count + saas_count + consult_count}")