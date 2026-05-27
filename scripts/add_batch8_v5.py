#!/usr/bin/env python3
"""
Wave 2: Insert Batch 8 services BEFORE each array's closing ];
"""
import re

FILE = '/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts'

with open(FILE, 'r') as f:
    content = f.read()

# Find section markers by line
lines = content.split('\n')

def find_line(start, marker):
    for i in range(start, len(lines)):
        if marker in lines[i]:
            return i
    return -1

def find_line_rev(start, marker):
    for i in range(start, -1, -1):
        if marker in lines[i]:
            return i
    return -1

# --- AI: Find the line "];" just before SECTION 2 ---
sec2_line = find_line(0, '// SECTION 2: IT SERVICES')
closing_line = find_line_rev(sec2_line, '];')
print(f"AI section: closing ]; at line {closing_line+1}, SECTION 2 at line {sec2_line+1}")

# Insert new services between closing_line and sec2_line
ai_new_lines = [
    '',
    '// ══════════════════════════════',
    '// NEW: AI Batch 8 Additions',
    '// ══════════════════════════════',
    '',
    '  {',
    "    id: 'ai-predictive-maintenance-2',",
    "    title: 'AI-Powered Predictive Maintenance',",
    "    subtitle: 'Reduce downtime by 45% with ML-based equipment failure prediction',",
    "    category: 'ai',",
    "    subcategory: 'Predictive Maintenance',",
    "    description: 'IoT sensor data analysis combined with machine learning models to predict equipment failures before they happen. Reduces unplanned downtime and extends asset lifespan.',",
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
    "    id: 'ai-energy-management-2',",
    "    title: 'AI Energy & Carbon Optimization',",
    "    subtitle: 'Intelligent energy management that cuts costs and carbon footprint by 30%+',",
    "    category: 'ai',",
    "    subcategory: 'Sustainability & Energy',",
    "    description: 'AI-driven energy management that optimizes consumption across buildings, manufacturing, and data centers with ESG reporting.',",
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
    '  }',
]

# Insert after the closing ] line, before blank lines and SECTION 2 header
new_lines = lines[:closing_line+1] + ['', ''] + ai_new_lines + ['', ''] + lines[sec2_line:]
content = '\n'.join(new_lines)
lines = content.split('\n')
print("AI batch 8 inserted")

# --- IT: Find the line "];" just before SECTION 3 ---
sec3_line = find_line(0, '// SECTION 3: MICRO SAAS')
closing_line = find_line_rev(sec3_line, '];')
print(f"IT section: closing ]; at line {closing_line+1}, SECTION 3 at line {sec3_line+1}")

it_new_lines = [
    '',
    '// ══════════════════════════════',
    '// NEW: IT Batch 8 Additions',
    '// ══════════════════════════════',
    '',
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
    '  }',
]

lines = content.split('\n')
sec3_line = find_line(0, '// SECTION 3: MICRO SAAS')
closing_line = find_line_rev(sec3_line, '];')
new_lines = lines[:closing_line+1] + ['', ''] + it_new_lines + ['', ''] + lines[sec3_line:]
content = '\n'.join(new_lines)
lines = content.split('\n')
print("IT batch 8 inserted")

# --- SAAS: Find the line "];" just before SECTION 4 ---
sec4_line = find_line(0, '// SECTION 4: IT CONSULTING')
closing_line = find_line_rev(sec4_line, '];')
print(f"SAAS section: closing ]; at line {closing_line+1}, SECTION 4 at line {sec4_line+1}")

saas_new_lines = [
    '',
    '// ══════════════════════════════',
    '// NEW: SAAS Batch 8 Additions',
    '// ══════════════════════════════',
    '',
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
    '  }',
]

sec4_line = find_line(0, '// SECTION 4: IT CONSULTING')
closing_line = find_line_rev(sec4_line, '];')
new_lines = lines[:closing_line+1] + ['', ''] + saas_new_lines + ['', ''] + lines[sec4_line:]
content = '\n'.join(new_lines)
lines = content.split('\n')
print("SAAS batch 8 inserted")

# --- Consulting: Find the line "];" just before COMBINED EXPORT ---
export_line = find_line(0, '// COMBINED EXPORT')
closing_line = find_line_rev(export_line, '];')
print(f"Consulting section: closing ]; at line {closing_line+1}, COMBINED EXPORT at line {export_line+1}")

consult_new_lines = [
    '',
    '// ══════════════════════════════',
    '// NEW: Consulting Batch 8 Additions',
    '// ══════════════════════════════',
    '',
    '  {',
    "    id: 'consult-mlops-2',",
    "    title: 'MLOps & AI Infrastructure Consulting',",
    "    subtitle: 'Build production-grade ML infrastructure with automated pipelines',",
    "    category: 'consulting',",
    "    subcategory: 'MLOps & AI Infrastructure',",
    "    description: 'Expert consulting to design and implement production-grade ML infrastructure including model registries, feature stores, automated pipelines, and governance frameworks.',",
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
    '  {',
    "    id: 'consult-cybersecurity-2',",
    "    title: 'Cybersecurity Assessment & Penetration Testing',",
    "    subtitle: 'Comprehensive security audits, vulnerability assessments, and penetration testing',",
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
    '  }',
]

export_line = find_line(0, '// COMBINED EXPORT')
closing_line = find_line_rev(export_line, '];')
new_lines = lines[:closing_line+1] + ['', ''] + consult_new_lines + ['', ''] + lines[export_line:]
content = '\n'.join(new_lines)

with open(FILE, 'w') as f:
    f.write(content)

# Verify braces
opens = content.count('{')
closes = content.count('}')
print("\n=== BATCH 8 COMPLETE ===")
print("Braces: opens=%d closes=%d delta=%d" % (opens, closes, opens - closes))