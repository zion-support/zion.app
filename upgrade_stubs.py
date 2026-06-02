#!/usr/bin/env python3
"""Fill stub services with real descriptions and features based on their ID/title"""

import re

# Map of stub service IDs to real descriptions and features
STUB_UPGRADES = {
    'ai-3d-asset-generator': {
        'description': 'Generate production-ready 3D models and assets from text descriptions or reference images. Outputs GLTF, USDZ, and OBJ formats with automatic LOD generation.',
        'features': ["Text-to-3D model generation", "Automatic LOD level creation", "PBR material application", "Multi-format export (GLTF/USDZ/OBJ)", "Batch generation with style consistency"],
        'icon': '🧊',
        'industry': 'E-Commerce',
    },
    'ai-ad-copy-generator': {
        'description': 'Create high-converting ad copy for Google, Meta, and LinkedIn campaigns with A/B variations, character limit compliance, and performance prediction scoring.',
        'features': ["Multi-platform ad copy generation", "A/B variant creation", "Character limit compliance", "Performance prediction scoring", "Brand voice enforcement"],
        'icon': '📝',
        'industry': 'Marketing',
    },
    'ai-api-orchestration-layer': {
        'description': 'Intelligently route, cache, and compose API calls across multiple providers with automatic failover, rate limiting, and response transformation.',
        'features': ["Smart API routing and load balancing", "Response caching with TTL management", "Automatic failover and retry", "Request/response transformation", "Rate limiting and quota management"],
        'icon': '🔌',
        'industry': 'Technology',
    },
    'ai-bug-to-issue-router': {
        'description': 'Automatically classify bug reports, route them to the right team, and create pre-filled issue tickets with severity scoring and suggested assignees.',
        'features': ["Automatic bug classification and routing", "Severity scoring from description", "Suggested assignee based on component", "Pre-filled Jira/GitHub issue creation", "Duplicate detection and linking"],
        'icon': '🐛',
        'industry': 'Technology',
    },
    'ai-code-reviewer': {
        'description': 'AI-powered code review that catches bugs, security issues, and style violations before merge. Provides fix suggestions and learning from team feedback.',
        'features': ["Bug and security issue detection", "Style and convention enforcement", "Fix suggestion generation", "Learning from team review feedback", "PR comment integration"],
        'icon': '👀',
        'industry': 'Technology',
    },
    'ai-competitive-price-tracker': {
        'description': 'Monitor competitor pricing in real-time across marketplaces and direct sites. AI-powered price positioning recommendations and margin impact analysis.',
        'features': ["Competitor price monitoring", "Marketplace scraping and aggregation", "Price positioning recommendations", "Margin impact analysis", "Automated repricing suggestions"],
        'icon': '💲',
        'industry': 'E-Commerce',
    },
    'ai-credit-underwriting': {
        'description': 'Augment credit decisions with AI-driven risk scoring using alternative data sources. Explainable models for regulatory compliance with bias auditing.',
        'features': ["Alternative data risk scoring", "Explainable decision models", "Regulatory compliance reporting", "Model bias auditing tools", "Approval probability estimation"],
        'icon': '🏦',
        'industry': 'Finance',
    },
    'ai-cro-optimizer': {
        'description': 'AI-powered conversion rate optimization that automatically tests headlines, CTAs, layouts, and form designs. Statistical significance tracking and revenue impact measurement.',
        'features': ["Automated A/B/n test generation", "Headline and CTA optimization", "Form design improvement", "Statistical significance tracking", "Revenue impact measurement"],
        'icon': '📈',
        'industry': 'Marketing',
    },
    'ai-dashboard-designer': {
        'description': 'Auto-generate optimized BI dashboards from data schemas with smart widget selection, layout heuristics, and color accessibility compliance.',
        'features': ["Schema-aware widget generation", "Smart layout heuristics", "Color accessibility compliance", "Interactive drill-down design", "Export to Tableau/PowerBI/Looker"],
        'icon': '📊',
        'industry': 'General',
    },
    'ai-data-quality-fabric': {
        'description': 'Weave data quality checks into every stage of your data pipeline. Automatic profiling, anomaly detection, and remediation suggestions for clean, trustworthy data.',
        'features': ["Automatic data profiling", "Pipeline-stage quality checks", "Anomaly detection with drift monitoring", "Remediation suggestion engine", "Quality score certification"],
        'icon': '✨',
        'industry': 'Technology',
    },
    'ai-data-quality-guardian': {
        'description': 'Protect downstream analytics from bad data with continuous quality monitoring, schema drift detection, and automated quarantine of suspicious records.',
        'features': ["Continuous quality monitoring", "Schema drift detection and alerting", "Automated record quarantine", "Data quality SLA tracking", "Incident linkage to root cause"],
        'icon': '🛡️',
        'industry': 'Finance',
    },
    'ai-deepfake-detection': {
        'description': 'Detect AI-generated deepfakes in images, video, and audio with multi-signal analysis. Provides confidence scores and artifact visualization for human verification.',
        'features': ["Multi-modal deepfake detection", "Confidence score and artifact visualization", "Image, video, and audio analysis", "Forensic metadata examination", "API for real-time screening"],
        'icon': '🔎',
        'industry': 'General',
    },
    'ai-digital-twin-platform': {
        'description': 'Create and maintain digital twins of physical assets and processes. Real-time synchronization with IoT data and predictive simulation for optimization.',
        'features': ["IoT-synchronized digital twin creation", "Predictive simulation engine", "What-if scenario modeling", "Performance optimization recommendations", "3D visualization and monitoring"],
        'icon': '🔄',
        'industry': 'Manufacturing',
    },
    'ai-drug-discovery-platform': {
        'description': 'Accelerate drug discovery with AI-powered molecular screening, ADMET prediction, and clinical trial optimization. Reduce time-to-candidate by 60%.',
        'features': ["Molecular property prediction", "ADMET profiling and optimization", "Clinical trial design assistance", "Literature mining and knowledge graph", "Target identification and validation"],
        'icon': '💊',
        'industry': 'Healthcare',
    },
    'ai-dyslexia-assist': {
        'description': 'AI reading and writing assistant for people with dyslexia. Real-time text simplification, font optimization, and speech-to-text with grammar correction.',
        'features': ["Real-time text simplification", "Dyslexia-friendly font rendering", "Speech-to-text with grammar correction", "Reading pace tracking", "Multilingual support"],
        'icon': '📖',
        'industry': 'Education',
    },
    'ai-ecommerce-smart-search': {
        'description': 'Semantic product search that understands intent, synonyms, and visual similarity. Boosts conversion by showing the right products even for vague queries.',
        'features': ["Semantic intent understanding", "Visual similarity search", "Synonym and typo tolerance", "Personalized ranking", "Zero-result rescue suggestions"],
        'icon': '🔍',
        'industry': 'E-Commerce',
    },
    'ai-exam-proctoring': {
        'description': 'AI-powered remote exam proctoring with gaze tracking, multiple-face detection, and audio monitoring. Reduces cheating with real-time alerts and post-session review.',
        'features': ["Gaze and attention tracking", "Multiple face detection", "Audio environment monitoring", "Real-time alert generation", "Post-session review and reporting"],
        'icon': '🎓',
        'industry': 'Education',
    },
    'ai-feature-store': {
        'description': 'Centralized feature store for ML models with online/offline serving, feature versioning, point-in-time correctness, and automatic feature discovery from data pipelines.',
        'features': ["Online and offline feature serving", "Feature versioning and lineage", "Point-in-time correctness guarantees", "Automatic feature discovery", "Feature monitoring and drift detection"],
        'icon': '🗄️',
        'industry': 'Technology',
    },
    'ai-federated-learning': {
        'description': 'Train ML models across distributed datasets without moving data. Privacy-preserving federated learning with differential privacy and secure aggregation.',
        'features': ["Cross-organization model training", "Differential privacy guarantees", "Secure aggregation protocols", "Heterogeneous data handling", "Model convergence monitoring"],
        'icon': '🔐',
        'industry': 'Healthcare',
    },
    'ai-form-filler-intelligence': {
        'description': 'AI-powered intelligent form filling that learns from past entries, validates data in real-time, and auto-completes complex multi-step forms across web applications.',
        'features': ["Learning from past form entries", "Real-time validation and correction", "Multi-step form orchestration", "Cross-form field inference", "Browser extension integration"],
        'icon': '✍️',
        'industry': 'General',
    },
}

with open('app/data/servicesData.ts', 'r') as f:
    content = f.read()

count = 0
for sid, upgrade in STUB_UPGRADES.items():
    # Find the service block by ID
    id_pattern = f"id: '{sid}',"
    id_pos = content.find(id_pattern)
    if id_pos == -1:
        print(f"⚠️  Not found: {sid}")
        continue
    
    # Replace description
    desc_pattern = "description: 'Service description.',"
    # Find this pattern near the ID
    search_area = content[id_pos:id_pos+500]
    if desc_pattern in search_area:
        # Replace the description
        old_desc = desc_pattern
        new_desc = f"description: '{upgrade['description']}',"
        # Find exact position
        pos = content.find(old_desc, id_pos)
        if pos != -1 and pos < id_pos + 500:
            content = content[:pos] + new_desc + content[pos+len(old_desc):]
    
    # Replace features
    feat_pattern = "features: ['Core functionality','Professional support','Scalable deployment'],"
    search_area = content[id_pos:id_pos+600]
    if feat_pattern in search_area:
        pos = content.find(feat_pattern, id_pos)
        if pos != -1 and pos < id_pos + 600:
            feat_strs = [f"'{f}'" for f in upgrade['features']]
            new_feat = f"features: [{','.join(feat_strs)}],"
            content = content[:pos] + new_feat + content[pos+len(feat_pattern):]
    
    count += 1

with open('app/data/servicesData.ts', 'w') as f:
    f.write(content)

print(f"✅ Upgraded {count} stub services with real descriptions")
