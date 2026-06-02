#!/usr/bin/env python3
"""Add 20 new services to existing arrays."""
import re

with open('app/data/servicesData.ts', 'r') as f:
    content = f.read()

def svc(cat, sid, title, desc, features, basic, pro, enterprise, icon, industry, popular):
    f = ','.join(f"'{x}'" for x in features)
    return f"""  {{
    id: '{sid}',
    title: '{title}',
    description: '{desc}',
    features: [{f}],
    benefits: [],
    pricing: {{basic:'{basic}', pro:'{pro}', enterprise:'{enterprise}'}},
    contactInfo: {{website:'/services/{sid}', email:'kleber@ziontechgroup.com', phone:'+1 302 464 0950'}},
    icon: '{icon}',
    href: '/services/{sid}',
    popular: {'true' if popular else 'false'},
    category: '{cat}',
    industry: '{industry}',
  }},"""

NEW = [
svc('ai','ai-patient-triage-assistant','AI Patient Triage Assistant','AI-powered emergency department triage that analyzes symptoms, vitals, and history to prioritize patients. Reduces wait times by 35%.',['Symptom analysis AI','Vital signs integration','Priority scoring','EHR integration','Real-time alerts'],'$1,999/mo','$5,999/mo','$19,999/mo','🏥','Healthcare',True),
svc('ai','ai-plant-disease-detector','AI Plant Disease Detector','Detect plant diseases from smartphone photos using AI. Identifies 500+ diseases across 100+ crop species with treatment recommendations.',['Photo-based detection','500+ disease database','Treatment recommendations','Crop species support','Offline mode'],'$29/mo','$99/mo','$299/mo','🌿','Agriculture',False),
svc('ai','ai-construction-site-safety','AI Construction Site Safety Monitor','AI-powered construction site safety monitoring using computer vision. Detects PPE violations, unsafe behavior, and hazards in real-time.',['PPE violation detection','Unsafe behavior alerts','Hazard identification','Real-time monitoring','Compliance reporting'],'$499/mo','$1,499/mo','$4,999/mo','🏗️','Construction',True),
svc('ai','ai-crop-yield-predictor','AI Crop Yield Predictor','Predict crop yields using satellite imagery, weather data, and soil sensors. Helps farmers optimize planting, irrigation, and harvesting.',['Satellite imagery analysis','Weather data integration','Soil sensor data','Yield prediction models','Irrigation optimization'],'$199/mo','$599/mo','$1,999/mo','🌾','Agriculture',True),
svc('it','it-hyperconverged-infrastructure','IT Hyperconverged Infrastructure Platform','Simplify data center operations with hyperconverged infrastructure. Compute, storage, and networking in one platform with unified management.',['Unified compute/storage/networking','Single-pane management','Auto-scaling','Built-in backup','Multi-cloud integration'],'$999/mo','$2,999/mo','$9,999/mo','🖥️','Technology',True),
svc('it','it-digital-workspace-platform','IT Digital Workspace Platform','Unified digital workspace with virtual desktop, app virtualization, and secure access. Supports BYOD and remote work with zero-trust security.',['Virtual desktop infrastructure','App virtualization','Zero-trust access','BYOD support','Compliance reporting'],'$199/mo','$599/mo','$1,999/mo','💻','Technology',False),
svc('cloud','cloud-container-security','Cloud Container Security Platform','Secure containers from build to runtime. Image scanning, runtime protection, and compliance monitoring for Kubernetes and Docker.',['Image vulnerability scanning','Runtime protection','Compliance monitoring','Kubernetes/Docker support','Admission control'],'$299/mo','$899/mo','$2,999/mo','📦','Technology',True),
svc('cloud','cloud-sustainability-tracker','Cloud Sustainability Tracker','Track and reduce your cloud carbon footprint. AI identifies optimization opportunities and generates sustainability reports for ESG compliance.',['Carbon footprint tracking','Optimization recommendations','ESG reporting','Multi-cloud support','Cost vs. carbon analysis'],'$149/mo','$449/mo','$1,499/mo','🌱','Technology',False),
svc('security','security-email-security-gateway','Security Email Security Gateway','AI-powered email security that blocks phishing, BEC, and zero-day attacks. Advanced threat protection with sandboxing and URL rewriting.',['Phishing detection','BEC prevention','Zero-day protection','URL rewriting','Sandboxing'],'$99/mo','$299/mo','$999/mo','📧','Security',True),
svc('security','security-penetration-testing','Security Penetration Testing as a Service','Automated penetration testing with AI-driven vulnerability discovery. Continuous testing with detailed remediation guidance and compliance reports.',['AI vulnerability discovery','Continuous testing','Remediation guidance','Compliance reporting','Expert validation'],'$499/mo','$1,499/mo','$4,999/mo','🔍','Security',True),
svc('data','data-contracts','Data Data Contracts Platform','Enforce data quality and schema consistency across teams. Define, publish, and monitor data contracts with automated validation and alerting.',['Contract definition','Schema validation','Quality monitoring','Team collaboration','Version control'],'$199/mo','$599/mo','$1,999/mo','📋','Technology',True),
svc('data','data-catalog','Data Intelligent Data Catalog','AI-powered data catalog that automatically discovers, classifies, and documents data assets. Self-service search with data lineage and quality scores.',['Auto-discovery','AI classification','Data lineage','Quality scores','Self-service search'],'$299/mo','$899/mo','$2,999/mo','📚','Technology',False),
svc('automation','automation-intelligent-hub','Automation Intelligent Automation Hub','Unify RPA, AI, and workflow automation in one platform. Orchestrate bots, APIs, and human tasks with intelligent routing and monitoring.',['RPA + AI + workflow unification','Bot orchestration','Intelligent routing','Human-in-the-loop','Monitoring and analytics'],'$399/mo','$1,199/mo','$3,999/mo','🤖','General',True),
svc('automation','automation-smart-document','Automation Smart Document Workflow','Automate document-centric workflows with AI. Intake, classify, extract, route, and approve documents with zero manual intervention.',['Document intake AI','Auto-classification','Data extraction','Routing and approval','Audit trail'],'$199/mo','$599/mo','$1,999/mo','📄','General',False),
svc('ai','ai-sign-language-translator','AI Sign Language Translator','Real-time sign language translation using computer vision. Supports ASL, BSL, and ISL with 95% accuracy on mobile and desktop.',['Real-time translation','ASL/BSL/ISL support','95% accuracy','Mobile and desktop','Video call integration'],'$199/mo','$599/mo','$1,999/mo','🤟','Accessibility',True),
svc('ai','ai-music-composer','AI Music Composition Studio','Compose original music for games, films, ads, and podcasts. AI generates royalty-free music in any style with full commercial licensing.',['Style-based composition','Royalty-free licensing','Commercial use rights','Multi-genre support','Custom mood/tempo'],'$49/mo','$149/mo','$499/mo','🎵','Media',False),
svc('it','it-it-service-management','IT Service Management (ITSM) Platform','Modern ITSM with AI-powered ticket routing, auto-resolution, and knowledge management. ITIL-aligned with self-service portal and SLA tracking.',['AI ticket routing','Auto-resolution','Knowledge management','ITIL alignment','SLA tracking'],'$199/mo','$599/mo','$1,999/mo','🎫','Technology',False),
svc('cloud','cloud-draas','Cloud DRaaS - Disaster Recovery as a Service','Managed disaster recovery in the cloud with automated failover, continuous replication, and one-click testing. RPO under 15 minutes.',['Automated failover','Continuous replication','One-click DR testing','RPO < 15 min','Multi-region support'],'$499/mo','$1,499/mo','$4,999/mo','🔄','General',False),
svc('data','data-feature-store','Data Feature Store for ML','Centralized feature store for machine learning. Feature discovery, versioning, and serving with point-in-time correctness for training and inference.',['Feature discovery','Version control','Point-in-time correctness','Training/serving consistency','Feature monitoring'],'$399/mo','$1,199/mo','$3,999/mo','🧪','Technology',False),
svc('security','security-breach-notification','Security Breach Notification Automation','Automate breach notification compliance across GDPR, CCPA, and state laws. AI determines requirements and generates required documents.',['Breach assessment AI','Notification requirement analysis','Document generation','Victim communication','Regulatory compliance'],'$199/mo','$599/mo','$1,999/mo','🔔','Legal',True),
]

def insert_before_close(content, marker, new_entries):
    idx = content.find(marker)
    if idx == -1:
        print(f"WARNING: {marker} not found")
        return content
    # Find the last ]; before the next export
    next_export = content.find('\nexport const', idx + 1)
    close_pos = content.rfind('];', idx, next_export)
    if close_pos == -1:
        # Try finding just ];
        close_pos = content.find('];', idx)
    if close_pos == -1:
        print(f"WARNING: no ]; for {marker}")
        return content
    
    # Check if we need a comma
    line_before = content[close_pos-10:close_pos]
    needs_comma = not line_before.rstrip().endswith(',') and not line_before.rstrip().endswith('{')
    
    if needs_comma:
        new_entries = ',' + new_entries
    
    return content[:close_pos] + new_entries + content[close_pos:]

# Apply in reverse order
for cat in ['automation', 'data', 'security', 'cloud', 'it', 'ai']:
    cat_entries = '\n'.join([s for s in NEW if f"category: '{cat}'" in s])
    if cat_entries:
        content = insert_before_close(content, f'export const {cat}Services', cat_entries)

with open('app/data/servicesData.ts', 'w') as f:
    f.write(content)

count = content.count("id:")
print(f"✅ Added {len(NEW)} new services. Total: {count}")
