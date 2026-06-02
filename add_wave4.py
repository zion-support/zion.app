#!/usr/bin/env python3
"""Add 30 new highly differentiated services across all categories."""
import re

with open('app/data/servicesData.ts', 'r') as f:
    content = f.read()

def svc(cat, sid, title, desc, features, basic, pro, enterprise, icon, industry, popular):
    f = ','.join(f"'{x}'" for x in features)
    p = pricing.replace('$','\$') if 'pricing' in dir() else f"{{basic:'{basic}', pro:'{pro}', enterprise:'{enterprise}'}}"
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

# 30 new services
NEW = [
# AI (12)
svc('ai','ai-patient-triage-assistant','AI Patient Triage Assistant','AI-powered emergency department triage that analyzes symptoms, vitals, and history to prioritize patients. Reduces wait times by 35% and improves outcomes.',['Symptom analysis AI','Vital signs integration','Priority scoring','EHR integration','Real-time alerts'],'$1,999/mo','$5,999/mo','$19,999/mo','🏥','Healthcare',True),
svc('ai','ai-drug-interaction-checker','AI Drug Interaction Checker','Real-time drug interaction analysis using AI. Checks prescriptions against patient history, genomics, and latest research. Integrates with Epic and Cerner.',['Real-time interaction checking','Genomics integration','Prescription analysis','EHR integration','Alert management'],'$499/mo','$1,499/mo','$4,999/mo','💊','Healthcare',True),
svc('ai','ai-facial-recognition-access','AI Facical Recognition Access Control','Enterprise facial recognition for secure access control. 99.7% accuracy, anti-spoofing, and GDPR-compliant. Integrates with existing access control systems.',['99.7% recognition accuracy','Anti-spoofing detection','GDPR compliance','Access control integration','Visitor management'],'$299/mo','$899/mo','$2,999/mo','👤','Security',False),
svc('ai','ai-crop-yield-predictor','AI Crop Yield Predictor','Predict crop yields using satellite imagery, weather data, and soil sensors. Helps farmers optimize planting, irrigation, and harvesting for maximum yield.',['Satellite imagery analysis','Weather data integration','Soil sensor data','Yield prediction models','Irrigation optimization'],'$199/mo','$599/mo','$1,999/mo','🌾','Agriculture',True),
svc('ai','ai-wildlife-conservation-tracker','AI Wildlife Conservation Tracker','Track and protect endangered species using AI-powered camera traps, acoustic monitoring, and satellite tracking. Poaching prediction and habitat analysis.',['Camera trap AI','Acoustic monitoring','Satellite tracking','Poaching prediction','Habitat analysis'],'$399/mo','$1,199/mo','$3,999/mo','🦁','Conservation',False),
svc('ai','ai-ocean-predictor','AI Ocean & Weather Prediction Platform','Hyperlocal ocean and weather prediction for maritime, fishing, and coastal industries. AI models trained on satellite, buoy, and historical data.',['Hyperlocal weather prediction','Ocean current modeling','Storm tracking','Fishing zone optimization','Maritime route planning'],'$499/mo','$1,499/mo','$4,999/mo','🌊','Maritime',False),
svc('ai','ai-space-debris-tracker','AI Space Debris Tracking & Collision Avoidance','Track space debris and predict collision risks for satellites. AI analyzes radar, optical, and sensor data to provide early warnings and avoidance maneuvers.',['Debris tracking','Collision risk prediction','Avoidance maneuver planning','Satellite protection','Space situational awareness'],'$2,999/mo','$7,999/mo','$24,999/mo','🛰️','Aerospace',False),
svc('ai','ai-personalized-learning-path','AI Personalized Learning Path Generator','Create individualized learning paths for students and employees. AI assesses knowledge gaps, learning style, and goals to generate optimal curricula.',['Knowledge gap assessment','Learning style detection','Curriculum generation','Progress tracking','Certification management'],'$99/mo','$299/mo','$999/mo','🎓','Education',True),
svc('ai','ai-music-composer','AI Music Composition Studio','Compose original music for games, films, ads, and podcasts. AI generates royalty-free music in any style with full commercial licensing.',['Style-based composition','Royalty-free licensing','Commercial use rights','Multi-genre support','Custom mood/tempo'],'$49/mo','$149/mo','$499/mo','🎵','Media',False),
svc('ai','ai-sign-language-translator','AI Sign Language Translator','Real-time sign language translation using computer vision. Supports ASL, BSL, and ISL with 95% accuracy. Works on mobile and desktop.',['Real-time translation','ASL/BSL/ISL support','95% accuracy','Mobile and desktop','Video call integration'],'$199/mo','$599/mo','$1,999/mo','🤟','Accessibility',True),
svc('ai','ai-plant-disease-detector','AI Plant Disease Detector','Detect plant diseases from smartphone photos using AI. Identifies 500+ diseases across 100+ crop species with treatment recommendations.',['Photo-based detection','500+ disease database','Treatment recommendations','Crop species support','Offline mode'],'$29/mo','$99/mo','$299/mo','🌿','Agriculture',False),
svc('ai','ai-construction-site-safety','AI Construction Site Safety Monitor','AI-powered construction site safety monitoring using computer vision. Detects PPE violations, unsafe behavior, and hazards in real-time.',['PPE violation detection','Unsafe behavior alerts','Hazard identification','Real-time monitoring','Compliance reporting'],'$499/mo','$1,499/mo','$4,999/mo','🏗️','Construction',True),

# IT (6)
svc('it','it-hyperconverged-infrastructure','IT Hyperconverged Infrastructure Platform','Simplify data center operations with hyperconverged infrastructure. Compute, storage, and networking in one platform with unified management.',['Unified compute/storage/networking','Single-pane management','Auto-scaling','Built-in backup','Multi-cloud integration'],'$999/mo','$2,999/mo','$9,999/mo','🖥️','Technology',True),
svc('it','it-network-digital-twin','IT Network Digital Twin','Create a digital twin of your entire network for simulation and optimization. Test changes before deployment and predict failures before they happen.',['Network simulation','Change impact analysis','Failure prediction','Configuration optimization','Multi-vendor support'],'$799/mo','$2,499/mo','$7,999/mo','🌐','Technology',False),
svc('it','it-endpoint-detection-response','IT Endpoint Detection & Response (EDR)','Advanced endpoint protection with AI-driven threat detection. Real-time monitoring, automated response, and forensic investigation capabilities.',['AI threat detection','Real-time monitoring','Automated response','Forensic investigation','Threat hunting'],'$199/mo','$599/mo','$1,999/mo','🛡️','Security',True),
svc('it','it-unified-communications','IT Unified Communications Platform','Unified communications with video, voice, messaging, and collaboration. AI-powered transcription, translation, and meeting summaries.',['Video/voice/messaging','AI transcription','Real-time translation','Meeting summaries','Team collaboration'],'$99/mo','$299/mo','$999/mo','📞','Technology',False),
svc('it','it-low-code-integration','IT Low-Code Integration Platform','Connect any application with a visual integration designer. Pre-built connectors for 500+ apps with AI-powered mapping and transformation.',['Visual integration designer','500+ pre-built connectors','AI mapping','Data transformation','Error handling'],'$149/mo','$449/mo','$1,499/mo','🔌','Technology',True),
svc('it','it-it-service-management','IT Service Management (ITSM) Platform','Modern ITSM with AI-powered ticket routing, auto-resolution, and knowledge management. ITIL-aligned with self-service portal and SLA tracking.',['AI ticket routing','Auto-resolution','Knowledge management','ITIL alignment','SLA tracking'],'$199/mo','$599/mo','$1,999/mo','🎫','Technology',False),

# Cloud (4)
svc('cloud','cloud-container-security','Cloud Container Security Platform','Secure containers from build to runtime. Image scanning, runtime protection, and compliance monitoring for Kubernetes and Docker.',['Image vulnerability scanning','Runtime protection','Compliance monitoring','Kubernetes/Docker support','Admission control'],'$299/mo','$899/mo','$2,999/mo','📦','Technology',True),
svc('cloud','cloud-cloud-native-backup','Cloud-Native Backup & Recovery','Backup and recovery designed for cloud-native applications. Application-consistent backups with instant recovery and cross-cloud portability.',['Application-consistent backups','Instant recovery','Cross-cloud portability','Automated testing','Ransomware protection'],'$199/mo','$599/mo','$1,999/mo','💾','Technology',False),
svc('cloud','cloud-sustainability-tracker','Cloud Sustainability Tracker','Track and reduce your cloud carbon footprint. AI identifies optimization opportunities and generates sustainability reports for ESG compliance.',['Carbon footprint tracking','Optimization recommendations','ESG reporting','Multi-cloud support','Cost vs. carbon analysis'],'$149/mo','$449/mo','$1,499/mo','🌱','Technology',False),
svc('cloud','cloud-database-as-a-service','Cloud Database-as-a-Service (DBaaS)','Managed database service supporting PostgreSQL, MySQL, MongoDB, and Redis. Automated backups, scaling, and performance optimization.',['Multi-database support','Automated backups','Auto-scaling','Performance optimization','High availability'],'$99/mo','$299/mo','$999/mo','🗄️','Technology',True),

# Security (3)
svc('security','security-email-security-gateway','Security Email Security Gateway','AI-powered email security that blocks phishing, BEC, and zero-day attacks. Advanced threat protection with sandboxing and URL rewriting.',['Phishing detection','BEC prevention','Zero-day protection','URL rewriting','Sandboxing'],'$99/mo','$299/mo','$999/mo','📧','Security',True),
svc('security','security-data-loss-prevention','Security Data Loss Prevention (DLP)','AI-powered DLP that discovers, classifies, and protects sensitive data across endpoints, cloud, and email. Prevents data leaks with real-time enforcement.',['Data discovery and classification','Endpoint/cloud/email coverage','Real-time enforcement','Policy automation','Incident response'],'$199/mo','$599/mo','$1,999/mo','🔒','Security',False),
svc('security','security-penetration-testing-as-a-service','Security Penetration Testing as a Service','Automated penetration testing with AI-driven vulnerability discovery. Continuous testing with detailed remediation guidance and compliance reports.',['AI vulnerability discovery','Continuous testing','Remediation guidance','Compliance reporting','Expert validation'],'$499/mo','$1,499/mo','$4,999/mo','🔍','Security',True),

# Data (3)
svc('data','data-data-contracts','Data Data Contracts Platform','Enforce data quality and schema consistency across teams. Define, publish, and monitor data contracts with automated validation and alerting.',['Contract definition','Schema validation','Quality monitoring','Team collaboration','Version control'],'$199/mo','$599/mo','$1,999/mo','📋','Technology',True),
svc('data','data-feature-store','Data Feature Store for ML','Centralized feature store for machine learning. Feature discovery, versioning, and serving with point-in-time correctness for training and inference.',['Feature discovery','Version control','Point-in-time correctness','Training/serving consistency','Feature monitoring'],'$399/mo','$1,199/mo','$3,999/mo','🧪','Technology',False),
svc('data','data-data-catalog','Data Intelligent Data Catalog','AI-powered data catalog that automatically discovers, classifies, and documents data assets. Self-service search with data lineage and quality scores.',['Auto-discovery','AI classification','Data lineage','Quality scores','Self-service search'],'$299/mo','$899/mo','$2,999/mo','📚','Technology',True),

# Automation (2)
svc('automation','automation-intelligent-automation-hub','Automation Intelligent Automation Hub','Unify RPA, AI, and workflow automation in one platform. Orchestrate bots, APIs, and human tasks with intelligent routing and monitoring.',['RPA + AI + workflow unification','Bot orchestration','Intelligent routing','Human-in-the-loop','Monitoring and analytics'],'$399/mo','$1,199/mo','$3,999/mo','🤖','General',True),
svc('automation','automation-smart-document-workflow','Automation Smart Document Workflow','Automate document-centric workflows with AI. Intake, classify, extract, route, and approve documents with zero manual intervention.',['Document intake AI','Auto-classification','Data extraction','Routing and approval','Audit trail'],'$199/mo','$599/mo','$1,999/mo','📄','General',False),
]

def insert_before_close(content, marker, new_entries):
    idx = content.find(marker)
    if idx == -1: return content
    close_pos = content.find('];', idx)
    if close_pos == -1: return content
    if not content[close_pos-5:close_pos].strip().endswith(','):
        new_entries = ',' + new_entries
    return content[:close_pos] + new_entries + content[close_pos:]

content = insert_before_close(content, 'export const automationServices', '\n'.join([s for s in NEW if s.startswith("    category: 'automation'")]))
content = insert_before_close(content, 'export const dataServices', '\n'.join([s for s in NEW if s.startswith("    category: 'data'")]))
content = insert_before_close(content, 'export const securityServices', '\n'.join([s for s in NEW if s.startswith("    category: 'security'")]))
content = insert_before_close(content, 'export const cloudServices', '\n'.join([s for s in NEW if s.startswith("    category: 'cloud'")]))
content = insert_before_close(content, 'export const itServices', '\n'.join([s for s in NEW if s.startswith("    category: 'it'")]))
content = insert_before_close(content, 'export const aiServices', '\n'.join([s for s in NEW if s.startswith("    category: 'ai'")]))

with open('app/data/servicesData.ts', 'w') as f:
    f.write(content)

count = content.count("id:")
print(f"✅ Added {len(NEW)} new services. Total: {count}")
