#!/usr/bin/env python3
"""
Wave 2 Enhancement: Add new services, new pages, update home page.
"""
import re

FILE = '/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts'

with open(FILE, 'r') as f:
    content = f.read()

# =====================================================
# BATCH 8: AI SERVICES (4 new: total AI will go from ~56 to ~60)
# =====================================================
ai_batch8 = r'''
  {
    id: 'ai-predictive-maintenance-2',
    title: 'AI-Powered Predictive Maintenance',
    subtitle: 'Reduce downtime by 45% with machine learning-based equipment failure prediction',
    category: 'ai',
    subcategory: 'Predictive Maintenance',
    description: 'IoT sensor data analysis combined with machine learning models to predict equipment failures before they happen. Reduces unplanned downtime, extends asset lifespan, and optimizes maintenance schedules for manufacturing, energy, and logistics operations.',
    features: [
      'Real-time sensor data ingestion from industrial IoT devices',
      'Anomaly detection using autoencoders and time-series analysis',
      'Remaining useful life (RUL) prediction models',
      'Automated maintenance work order generation',
      'Digital twin integration for simulation and what-if analysis',
      'Multi-site asset fleet management dashboard',
      'Integration with SCADA, ERP, and CMMS systems',
      'Predictive alerts with configurable confidence thresholds'
    ],
    benefits: [
      'Reduce unplanned downtime by up to 45%',
      'Lower maintenance costs by 25-30%',
      'Extend equipment lifespan by 20%+',
      'Transition from reactive to predictive maintenance culture'
    ],
    pricing: { Starter: '$2,499/mo', Professional: '$6,499/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'ai-recommendation-engine-2',
    title: 'AI Recommendation Engine',
    subtitle: 'Personalized product and content recommendations that increase revenue by 18-35%',
    category: 'ai',
    subcategory: 'Recommendation Systems',
    description: 'Deep learning-powered recommendation engine for e-commerce, media, and SaaS platforms. Supports collaborative filtering, content-based, hybrid, and real-time contextual recommendations with A/B testing built in.',
    features: [
      'Real-time collaborative and content-based filtering',
      'Deep neural network models for cold-start problem solving',
      'Contextual recommendations (time, location, device, session)',
      'A/B testing framework with statistical significance analysis',
      'Cross-sell and upsell optimization algorithms',
      'Explainable AI showing "why this was recommended"',
      'API-first architecture for easy integration',
      'Performance dashboard with conversion and revenue tracking'
    ],
    benefits: [
      'Increase average order value by 15-25%',
      'Boost conversion rates with personalized experiences',
      'Reduce bounce rates with relevant content suggestions',
      'Continuous learning from user behavior improves over time'
    ],
    pricing: { Starter: '$1,999/mo', Professional: '$4,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'ai-identity-verification-2',
    title: 'AI-Powered Identity Verification',
    subtitle: 'Real-time KYC and identity verification with liveness detection and document analysis',
    category: 'ai',
    subcategory: 'Identity & Security',
    description: 'Automated identity verification pipeline that validates government-issued IDs, performs facial recognition with liveness detection, and screens against global watchlists. Compliant with KYC, AML, and eIDAS regulations.',
    features: [
      'ID document scanning and validation for 190+ countries',
      'Facial recognition with anti-spoofing liveness detection',
      'Watchlist screening against OFAC, EU sanctions, and PEP lists',
      'Age verification and restricted access control',
      'Real-time verification in under 3 seconds',
      'Audit trail with tamper-proof verification records',
      'Configurable risk scoring engine',
      'API and SDK for mobile and web integration'
    ],
    benefits: [
      'Reduce manual verification workload by 90%',
      'Achieve regulatory compliance with automated KYC/AML',
      'Prevent fraud with multi-factor biometric verification',
      'Onboard users 5x faster than manual processes'
    ],
    pricing: { Starter: '$0.50/verification', Professional: 'Custom volume pricing', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'ai-energy-management-2',
    title: 'AI Energy & Carbon Optimization',
    subtitle: 'Intelligent energy management that cuts costs and carbon footprint by 30%+',
    category: 'ai',
    subcategory: 'Sustainability & Energy',
    description: 'AI-driven energy management platform that optimizes consumption across buildings, manufacturing, and data centers. Predicts usage patterns, automates HVAC and lighting, and provides carbon accounting with ESG reporting capabilities.',
    features: [
      'Real-time energy consumption monitoring across all facilities',
      'ML-based demand forecasting with weather and occupancy data',
      'Automated HVAC, lighting, and equipment scheduling',
      'Peak demand prediction and load shifting optimization',
      'Carbon emissions tracking and ESG compliance reporting',
      'Solar and renewable energy integration optimization',
      'Anomaly detection for energy waste and equipment malfunction',
      'ROI dashboard showing savings vs. investment timeline'
    ],
    benefits: [
      'Reduce energy costs by 20-40%',
      'Achieve ESG and sustainability compliance targets',
      'Extend equipment life through intelligent scheduling',
      'Real-time visibility into carbon footprint across operations'
    ],
    pricing: { Starter: '$1,299/mo', Professional: '$3,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  }'''

# Insert AI batch 8 before the itServices section marker
ai_pattern = r'(\s+},\n\];\n\n// ={60,}\n// SECTION 2: IT SERVICES)'
ai_replacement = ai_batch8 + r'\n\1'
content, count1 = re.subn(ai_pattern, ai_replacement, content, count=1)
print("AI Batch 8: %s (matches=%d)" % ("SUCCESS" if count1 == 1 else "FAILED", count1))

# =====================================================
# BATCH 8: IT SERVICES (3 new)
# =====================================================
it_batch8 = r'''
  {
    id: 'it-data-mesh-2',
    title: 'Data Mesh Architecture Implementation',
    subtitle: 'Decentralized data ownership with domain-oriented data products and self-serve infrastructure',
    category: 'it',
    subcategory: 'Data Architecture',
    description: 'Implement a data mesh architecture that distributes data ownership across business domains, enables self-serve data platforms, and federates computational governance. Move from monolithic data lakes to domain-oriented data products.',
    features: [
      'Domain-oriented data product design and implementation',
      'Self-serve data platform with data discovery catalog',
      'Federated computational governance framework',
      'Data mesh observability and quality monitoring',
      'Cross-domain data product interoperability standards',
      'Automated data pipeline generation from domain schemas',
      'Data contract management and schema evolution',
      'Integration with existing data lakehouse infrastructure'
    ],
    benefits: [
      'Eliminate data bottlenecks and reduce time-to-insight by 60%',
      'Scale data teams without centralized bottlenecks',
      'Improve data quality through domain ownership accountability',
      'Accelerate data product delivery from months to weeks'
    ],
    pricing: { Starter: '$9,999/project', Professional: '$29,999/project', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'it-sre-platform-2',
    title: 'Site Reliability Engineering Platform',
    subtitle: 'Production-grade SRE platform with automated incident response and error budget management',
    category: 'it',
    subcategory: 'Site Reliability',
    description: 'Comprehensive SRE platform implementing Google SRE best practices — error budgets, SLO/SLI/SLA management, automated incident response, chaos engineering, and production observability at scale.',
    features: [
      'SLO/SLI/SLA definition and automated tracking',
      'Error budget policy engine with automated alerting',
      'Automated incident classification and response playbooks',
      'Chaos engineering framework for resilience testing',
      'Production readiness review automation',
      'Dependency mapping and blast radius analysis',
      'Post-incident review automation with action tracking',
      'On-call management and escalation automation'
    ],
    benefits: [
      'Achieve 99.99%+ uptime with systematic reliability engineering',
      'Reduce MTTR (Mean Time To Recovery) by 70%',
      'Make reliability decisions based on data, not intuition',
      'Free engineers to focus on features instead of firefighting'
    ],
    pricing: { Starter: '$2,499/mo', Professional: '$7,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'it-ml-ops-2',
    title: 'MLOps & Model Lifecycle Management',
    subtitle: 'End-to-end MLOps platform for model versioning, deployment, monitoring, and governance',
    category: 'it',
    subcategory: 'MLOps',
    description: 'Production MLOps platform that manages the entire machine learning lifecycle — from experiment tracking and model registry to automated deployment, monitoring, and retraining pipelines.',
    features: [
      'Experiment tracking with MLflow, Weights & Biases integration',
      'Model registry with version control and lineage tracking',
      'Automated CI/CD pipeline for model deployment (Blue/Green, Canary)',
      'Model monitoring with data drift and concept drift detection',
      'Feature store with online/offline serving',
      'A/B testing framework for model comparison in production',
      'Model explainability and bias detection dashboards',
      'Role-based access control and audit trails for model governance'
    ],
    benefits: [
      'Deploy models 10x faster with standardized pipelines',
      'Maintain model accuracy with automated drift detection',
      'Ensure regulatory compliance with full model lineage',
      'Reduce MLOps infrastructure costs by 40% with managed tooling'
    ],
    pricing: { Starter: '$1,499/mo', Professional: '$4,499/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  }'''

# Insert IT batch 8 before the saasSolutions section
it_pattern = r'(\s+},\n\];\n\n// ={60,}\n// SECTION 3: MICRO SAAS)'
it_replacement = it_batch8 + r'\n\1'
content, count2 = re.subn(it_pattern, it_replacement, content, count=1)
print("IT Batch 8: %s (matches=%d)" % ("SUCCESS" if count2 == 1 else "FAILED", count2))

# =====================================================
# BATCH 8: MICRO SAAS (3 new)
# =====================================================
saas_batch8 = r'''
  {
    id: 'saas-hr-automation-2',
    title: 'AI-Powered HR Automation Suite',
    subtitle: 'Automate hiring, onboarding, performance reviews, and employee engagement with AI',
    category: 'saas',
    subcategory: 'HR & Recruitment Automation',
    description: 'Comprehensive HR automation platform that uses AI to streamline recruitment, automate onboarding workflows, conduct performance analytics, and measure employee engagement — reducing administrative overhead by 70%.',
    features: [
      'AI-powered resume screening and candidate ranking',
      'Automated interview scheduling with multi-calendar sync',
      'Onboarding checklist automation with document management',
      'Continuous performance tracking with 360-degree feedback',
      'Employee engagement pulse surveys with AI sentiment analysis',
      'Predictive attrition risk scoring',
      'Payroll integration and benefits administration',
      'Compliance management with labor law tracking across jurisdictions'
    ],
    benefits: [
      'Reduce time-to-hire by 50%',
      'Cut HR administrative workload by 70%',
      'Improve employee retention with predictive analytics',
      'Ensure labor compliance across multiple jurisdictions'
    ],
    pricing: { Starter: '$149/mo', Professional: '$399/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'saas-social-media-2',
    title: 'AI Social Media Management Platform',
    subtitle: 'Intelligent social media scheduling, content creation, and performance analytics across all channels',
    category: 'saas',
    subcategory: 'Social Media Marketing',
    description: 'AI-powered social media management that auto-generates posts, optimizes posting schedules, monitors brand mentions, analyzes competitor strategies, and provides ROI attribution — all from a single unified dashboard.',
    features: [
      'AI content generation for posts, captions, and hashtags',
      'Intelligent scheduling optimized by audience activity patterns',
      'Cross-platform management (LinkedIn, Instagram, X, Facebook, TikTok)',
      'Real-time social listening and brand mention monitoring',
      'Competitor analysis with share-of-voice tracking',
      'Sentiment analysis on comments and mentions',
      'Automated comment responses with brand voice consistency',
      'ROI attribution with UTM tracking and conversion analytics'
    ],
    benefits: [
      'Save 10+ hours per week on social media management',
      'Increase engagement by 40% with AI-optimized content',
      'Respond to mentions and comments in real-time',
      'Prove social media ROI with detailed attribution reporting'
    ],
    pricing: { Starter: '$49/mo', Professional: '$149/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'saas-customer-success-2',
    title: 'Customer Success Automation Platform',
    subtitle: 'Proactive customer health scoring, automated outreach, and churn prevention powered by AI',
    category: 'saas',
    subcategory: 'Customer Success',
    description: 'AI-driven customer success platform that monitors product usage, calculates health scores, triggers automated interventions, and identifies expansion opportunities — reducing churn and increasing net revenue retention.',
    features: [
      'Automated customer health scoring based on product usage signals',
      'Churn prediction with 90-day advance warning system',
      'Automated playbooks for at-risk accounts (emails, tasks, alerts)',
      'Upsell and cross-sell opportunity identification',
      'Customer journey mapping with milestone tracking',
      'NPS/CSAT survey automation with response analysis',
      'Executive dashboards with account-level and portfolio-level views',
      'Integration with Salesforce, HubSpot, and Intercom'
    ],
    benefits: [
      'Reduce customer churn by 30%+ with early intervention',
      'Increase net revenue retention to 120%+',
      'Scale customer success without proportional headcount',
      'Turn customer data into actionable insights automatically'
    ],
    pricing: { Starter: '$199/mo', Professional: '$599/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  }'''

# Insert SAAS batch 8 before the consultingServices section
saas_pattern = r'(\s+},\n\];\n\n// ={60,}\n// SECTION 4: IT CONSULTING)'
saas_replacement = saas_batch8 + r'\n\1'
content, count3 = re.subn(saas_pattern, saas_replacement, content, count=1)
print("SAAS Batch 8: %s (matches=%d)" % ("SUCCESS" if count3 == 1 else "FAILED", count3))

# =====================================================
# BATCH 8: CONSULTING (2 new)
# =====================================================
consult_batch8 = r'''
  {
    id: 'consult-mlops-2',
    title: 'MLOps & AI Infrastructure Consulting',
    subtitle: 'Build production-grade ML infrastructure with automated pipelines and governance',
    category: 'consulting',
    subcategory: 'MLOps & AI Infrastructure',
    description: 'Expert consulting to design and implement production-grade ML infrastructure including model registries, feature stores, automated pipelines, experiment tracking, and governance frameworks. Based on industry best practices from Google, Meta, and Netflix.',
    features: [
      'ML infrastructure architecture assessment and design',
      'Model registry and feature store implementation',
      'Automated ML pipeline design (CI/CD for models)',
      'Experiment tracking and reproducibility framework',
      'Model monitoring, drift detection, and alerting',
      'Data versioning and lineage tracking implementation',
      'Kubernetes-based ML workload orchestration',
      'ML governance framework with audit trails and compliance'
    ],
    benefits: [
      'Deploy ML models reliably with repeatable pipelines',
      'Reduce time from experiment to production by 80%',
      'Ensure model compliance and auditability',
      'Build internal ML engineering capabilities for the long term'
    ],
    pricing: { Starter: '$12,999/project', Professional: '$39,999/project', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'consult-cybersecurity-2',
    title: 'Cybersecurity Assessment & Penetration Testing',
    subtitle: 'Comprehensive security audits, vulnerability assessments, and penetration testing for enterprise environments',
    category: 'consulting',
    subcategory: 'Cybersecurity',
    description: 'Expert cybersecurity consulting including network penetration testing, application security assessments, cloud security audits, and compliance readiness evaluations. Delivers actionable remediation roadmaps with prioritized vulnerabilities and risk ratings.',
    features: [
      'External and internal network penetration testing',
      'Web application and API security assessment (OWASP Top 10)',
      'Cloud infrastructure security audit (AWS/Azure/GCP)',
      'Social engineering and phishing simulation campaigns',
      'Wireless network and physical security assessments',
      'Compliance gap analysis (SOC 2, ISO 27001, PCI-DSS, HIPAA)',
      'Red team/blue team exercise coordination',
      'Detailed remediation roadmap with CVSS-scored findings'
    ],
    benefits: [
      'Identify critical vulnerabilities before attackers do',
      'Meet compliance requirements for SOC 2, ISO 27001, PCI-DSS',
      'Reduce breach risk with prioritized remediation plans',
      'Build a culture of security awareness across your organization'
    ],
    pricing: { Starter: '$9,999/project', Professional: '$29,999/project', Enterprise: 'Custom' },
    contactUrl: '/contact'
  }'''

consult_pattern = r'(\s+},\n\];\n\n// ={60,}\n// COMBINED EXPORT)'
consult_replacement = consult_batch8 + r'\n\1'
content, count4 = re.subn(consult_pattern, consult_replacement, content, count=1)
print("Consulting Batch 8: %s (matches=%d)" % ("SUCCESS" if count4 == 1 else "FAILED", count4))

with open(FILE, 'w') as f:
    f.write(content)

print("\n=== SERVICE BATCH 8 ADDITION COMPLETE ===")
print("AI: %s, IT: %s, SAAS: %s, Consulting: %s" % (count1, count2, count3, count4))