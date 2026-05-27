#!/usr/bin/env python3
"""Add new innovative services to servicesData.ts"""
import re

with open('/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts', 'r') as f:
    content = f.read()

# ═══════════════════════════════════════════════════════
# NEW AI SERVICES
# ═══════════════════════════════════════════════════════
new_ai_services = '''
  {
    id: 'ai-digitaltwin-1',
    title: 'Digital Twin Simulation & Optimization',
    subtitle: 'Create virtual replicas of physical assets, processes, and systems for real-time simulation',
    category: 'ai',
    subcategory: 'Digital Twin',
    description: 'Build digital twins of manufacturing lines, supply chains, buildings, or infrastructure. Run what-if simulations, predict failures, and optimize operations in a risk-free virtual environment.',
    features: [
      '3D visualization of physical assets and processes',
      'Real-time sensor data synchronization',
      'Predictive maintenance simulation',
      'What-if scenario modeling',
      'Process optimization recommendations',
      'Integration with IoT and SCADA systems',
      'Collaborative virtual walkthroughs',
      'Lifecycle tracking and comparison'
    ],
    benefits: [
      'Reduce physical prototyping costs by 50-70%',
      'Predict and prevent equipment failures',
      'Optimize processes without production disruption',
      'Accelerate product development cycles by 40%'
    ],
    pricing: { Starter: '$3,999/mo', Professional: '$8,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'ai-autonomous-1',
    title: 'Autonomous Business Process Orchestrator',
    subtitle: 'End-to-end automation of complex business processes with self-healing capabilities',
    category: 'ai',
    subcategory: 'Autonomous Systems',
    description: 'Deploy AI orchestrators that autonomously manage multi-step business processes — from order fulfillment to vendor management — with self-correction and exception handling.',
    features: [
      'Multi-step process automation with branching logic',
      'Self-healing and automatic retry on failures',
      'Cross-system orchestration (ERP, CRM, WMS)',
      'Real-time process monitoring and bottleneck detection',
      'Human escalation for edge cases',
      'Continuous process optimization via reinforcement learning',
      'SLA tracking and compliance enforcement',
      'Natural language process definition'
    ],
    benefits: [
      'Automate 95%+ of order-to-cash cycles',
      'Reduce process cycle times by 80%',
      'Self-correcting operations with minimal human intervention',
      'Scale operations 10x without proportional headcount'
    ],
    pricing: { Starter: '$4,999/mo', Professional: '$12,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'ai-quantum-1',
    title: 'Quantum Computing Readiness & Hybrid Algorithms',
    subtitle: 'Prepare your organization for quantum advantage with quantum-ready algorithms and hybrid computing',
    category: 'ai',
    subcategory: 'Quantum Computing',
    description: 'Quantum computing consulting and hybrid algorithm development — identify quantum-advantage use cases, build quantum-ready systems, and run hybrid classical-quantum workloads.',
    features: [
      'Quantum readiness assessment and roadmap',
      'Hybrid classical-quantum algorithm design',
      'Quantum chemistry and materials simulation',
      'Optimization problem formulation for quantum solvers',
      'Qiskit, Cirq, and PennyLane integration',
      'Cloud quantum access (IBM, AWS Braket, Azure)',
      'Post-quantum cryptography assessment',
      'Quantum ML pipeline development'
    ],
    benefits: [
      'Gain first-mover advantage in quantum computing',
      'Solve optimization problems 1000x faster',
      'Future-proof encryption against quantum threats',
      'Access quantum hardware without in-house expertise'
    ],
    pricing: { Starter: '$4,999/mo', Professional: '$14,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'ai-predictive-1',
    title: 'Predictive Maintenance & Asset Intelligence',
    subtitle: 'Predict equipment failures before they happen with multi-sensor AI analytics',
    category: 'ai',
    subcategory: 'Predictive Maintenance',
    description: 'Industrial-grade predictive maintenance using vibration analysis, thermal imaging, acoustic monitoring, and machine learning to predict failures weeks in advance.',
    features: [
      'Multi-sensor data fusion (vibration, thermal, acoustic)',
      'Remaining useful life (RUL) estimation',
      'Automated work order generation',
      'Failure mode classification and root cause analysis',
      'Condition-based maintenance scheduling',
      'Digital twin integration for simulation',
      'Mobile inspection app with AR overlays',
      'Fleet-wide asset health dashboard'
    ],
    benefits: [
      'Reduce unplanned downtime by 50-70%',
      'Extend equipment lifespan by 20-40%',
      'Cut maintenance costs by 25-30%',
      'Eliminate catastrophic equipment failures'
    ],
    pricing: { Starter: '$2,499/mo', Professional: '$6,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'ai-sustainability-1',
    title: 'AI for Climate & Environmental Monitoring',
    subtitle: 'Real-time environmental monitoring and climate risk assessment powered by AI',
    category: 'ai',
    subcategory: 'Environmental AI',
    description: 'Monitor air quality, water quality, deforestation, and climate risks using satellite imagery, IoT sensors, and AI-powered analytics for ESG compliance and environmental protection.',
    features: [
      'Satellite imagery analysis for land use changes',
      'Air and water quality sensor network analytics',
      'Carbon sequestration measurement and verification',
      'Climate risk scoring for assets and supply chains',
      'Biodiversity monitoring and species detection',
      'Pollution source identification',
      'Automated EPA and regulatory reporting',
      'Real-time environmental alerting system'
    ],
    benefits: [
      'Achieve ESG and sustainability compliance',
      'Detect environmental violations before penalties',
      'Quantify and reduce environmental footprint',
      'Generate revenue through carbon credit verification'
    ],
    pricing: { Starter: '$1,999/mo', Professional: '$5,499/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  }
];'''

# ═══════════════════════════════════════════════════════
# NEW IT SERVICES
# ═══════════════════════════════════════════════════════
new_it_services = '''
  {
    id: 'it-zero-trust-1',
    title: 'Zero Trust Security as a Service',
    subtitle: 'Implement end-to-end zero trust architecture for identity, devices, and applications',
    category: 'it',
    subcategory: 'Zero Trust Security',
    description: 'Comprehensive zero trust implementation — micro-segmentation, identity-aware proxies, continuous verification, and least-privilege access across your entire infrastructure.',
    features: [
      'Identity-aware proxy deployment (Zscaler, Cloudflare)',
      'Micro-segmentation for workloads and applications',
      'Continuous authentication and device trust scoring',
      'Policy engine for least-privilege access',
      'Network traffic inspection and threat detection',
      'Integration with IAM and SIEM systems',
      'Compliance automation (SOC 2, HIPAA, PCI)',
      '24/7 managed zero trust operations'
    ],
    benefits: [
      'Eliminate lateral movement for attackers',
      'Reduce breach blast radius by 90%',
      'Meet compliance requirements seamlessly',
      'Enable secure remote work at scale'
    ],
    pricing: { Starter: '$3,999/mo', Professional: '$8,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'it-finops-1',
    title: 'Cloud FinOps & Cost Optimization',
    subtitle: 'Maximize cloud ROI with intelligent cost management, rightsizing, and spend governance',
    category: 'it',
    subcategory: 'Cloud FinOps',
    description: 'Full-spectrum cloud financial management — cost visibility, waste elimination, reserved instance optimization, and automated governance policies to control cloud spend.',
    features: [
      'Multi-cloud cost visibility dashboard',
      'Automated rightsizing recommendations',
      'Reserved instance and savings plan optimization',
      'Anomaly detection for spend spikes',
      'Tag enforcement and allocation governance',
      'Showback/chargeback reporting',
      'Automated shutdown of idle resources',
      'Cost anomaly alerting workflows'
    ],
    benefits: [
      'Reduce cloud costs by 25-40%',
      'Eliminate cloud waste and orphaned resources',
      'Predict and budget cloud spend accurately',
      'Governance without slowing innovation'
    ],
    pricing: { Starter: '$1,499/mo', Professional: '$3,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'it-gitops-1',
    title: 'GitOps Platform & Developer Experience',
    subtitle: 'Streamline developer workflows with GitOps practices and internal developer platforms',
    category: 'it',
    subcategory: 'GitOps & Developer Platform',
    description: 'Build and manage an Internal Developer Platform (IDP) with GitOps principles — self-service deployments, golden pipelines, and developer productivity tooling.',
    features: [
      'ArgoCD / FluxGitOps workflow setup',
      'Internal developer portal (Backstage)',
      'Golden pipeline templates for CI/CD',
      'Self-service environment provisioning',
      'Kubernetes workload management',
      'Policy as Code (OPA Gatekeeper)',
      'Developer experience (DX) metrics',
      'Onboarding automation for new services'
    ],
    benefits: [
      'Deploy to production in minutes, not days',
      'Standardize deployments across teams',
      'Reduce operational toil by 60%',
      'Improve developer satisfaction and retention'
    ],
    pricing: { Starter: '$2,499/mo', Professional: '$6,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'it-sre-1',
    title: 'Site Reliability Engineering (SRE)',
    subtitle: 'Build and maintain highly reliable, scalable systems with SRE best practices',
    category: 'it',
    subcategory: 'Site Reliability Engineering',
    description: 'SRE services — SLO definition, error budget management, chaos engineering, incident management, toil reduction, and reliability improvement across your production systems.',
    features: [
      'SLO/SLI definition and monitoring',
      'Error budget tracking and alerting',
      'Chaos engineering program (Gremlin, Litmus)',
      'Incident command and post-mortem facilitation',
      'Toil identification and automation',
      'Capacity planning and load testing',
      'Runbook creation and automation',
      'Reliability review for major changes'
    ],
    benefits: [
      'Achieve 99.99%+ uptime targets',
      'Reduce incident frequency by 60%',
      'Faster incident resolution (MTTD/MTTR)',
      'Proactive vs. reactive operations culture'
    ],
    pricing: { Starter: '$3,499/mo', Professional: '$8,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  }'''

# ═══════════════════════════════════════════════════════
# NEW MICRO SAAS SOLUTIONS
# ═══════════════════════════════════════════════════════
new_saas_services = '''
  {
    id: 'saas-pwa-1',
    title: 'Progressive Web App (PWA) Builder',
    subtitle: 'Build app-like PWAs from your existing website — no app store required',
    category: 'saas',
    subcategory: 'App Builder',
    description: 'Turn any website into a fast, offline-capable, installable progressive web app. Push notifications, home screen presence, and native-like experience without app store submission.',
    features: [
      'One-click PWA conversion from any URL',
      'Offline mode with service worker caching',
      'Push notification engine',
      'Splash screen and manifest customization',
      'App-like navigation and gestures',
      'Background sync for data freshness',
      'Analytics and engagement tracking',
      'Multi-domain support for agencies'
    ],
    benefits: [
      'Reach users without app store friction',
      '3x faster load times vs. native apps',
      'Work offline and on low-quality networks',
      'Push notifications boost re-engagement by 3x'
    ],
    pricing: { Starter: '$299/mo', Professional: '$799/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'saas-datashare-1',
    title: 'Secure Client Data Sharing Portal',
    subtitle: 'Share and receive sensitive documents with clients through encrypted, branded portals',
    category: 'saas',
    subcategory: 'Data Sharing',
    description: 'Create branded, secure portals for sharing sensitive documents with clients — with granular permissions, audit trails, and automatic expiration.',
    features: [
      'Branded upload/download portals',
      'End-to-end encryption (AES-256)',
      'Granular access controls and permissions',
      'Document watermarking and DRM',
      'Automatic link expiration and revocation',
      'Audit trail with download tracking',
      'Large file support (up to 5GB)',
      'Integration with CRM and email systems'
    ],
    benefits: [
      'Eliminate insecure email attachments',
      'Track when and how clients access documents',
      'Professional branded experience for clients',
      'Meet compliance requirements for data handling'
    ],
    pricing: { Starter: '$199/mo', Professional: '$499/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'saas-testimonial-1',
    title: 'Social Proof & Testimonial Engine',
    subtitle: 'Collect, manage, and display customer reviews, testimonials, and social proof across your marketing channels',
    category: 'saas',
    subcategory: 'Social Proof',
    description: 'Automate collection of customer reviews and testimonials, display them with beautiful widgets, and leverage social proof to increase conversions across your website and marketing.',
    features: [
      'Automated review request emails after purchase',
      'Multi-platform review aggregation (Google, Trustpilot, Facebook)',
      'Customizable review widgets for websites',
      'Video testimonial collection and hosting',
      'Review moderation and approval workflow',
      'AI-powered review sentiment analysis',
      'Display rules (targeting by page, product, audience)',
      'Fake review detection and filtering'
    ],
    benefits: [
      'Increase conversion rates by 15-30%',
      'Automate testimonial collection process',
      'Build trust with new prospects',
      'Centralize all social proof in one dashboard'
    ],
    pricing: { Starter: '$149/mo', Professional: '$399/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'saas-forms-1',
    title: 'Intelligent Form & Survey Platform',
    subtitle: 'Build smart forms with conditional logic, AI analysis, and automated follow-ups',
    category: 'saas',
    subcategory: 'Forms & Surveys',
    description: 'Create dynamic, intelligent forms and surveys with conditional logic, AI-powered response analysis, automated follow-up workflows, and CRM integration.',
    features: [
      'Drag-and-drop form builder with conditional logic',
      'AI-powered response analysis and summarization',
      'Automated follow-up emails based on responses',
      'CRM integration (Salesforce, HubSpot)',
      'Multi-step and conversational form formats',
      'A/B testing for form optimization',
      'Payment collection within forms',
      'Advanced analytics and submission tracking'
    ],
    benefits: [
      'Capture 40%+ more qualified leads',
      'Automate lead qualification with smart routing',
      'Reduce manual data review time by 80%',
      'Improve response rates with conversational forms'
    ],
    pricing: { Starter: '$99/mo', Professional: '$299/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  }
];'''

# ═══════════════════════════════════════════════════════
# NEW CONSULTING SERVICES
# ═══════════════════════════════════════════════════════
new_consulting_services = '''
  {
    id: 'consult-responsible-ai-1',
    title: 'AI Ethics & Responsible AI Consulting',
    subtitle: 'Build ethical, fair, and transparent AI systems with governance frameworks and bias audits',
    category: 'consulting',
    subcategory: 'AI Ethics',
    description: 'Ensure your AI systems are fair, transparent, and accountable. Includes bias auditing, explainability consulting, AI governance design, and regulatory compliance for responsible AI.',
    features: [
      'Algorithmic bias detection and remediation',
      'AI explainability and transparency frameworks',
      'AI ethics policy and governance design',
      'Fairness testing across demographics',
      'AI impact assessments',
      'Regulatory compliance (EU AI Act, NIST AI RMF)',
      'Stakeholder engagement and AI literacy training',
      'Responsible AI maturity assessment'
    ],
    benefits: [
      'Build trust with customers and regulators',
      'Avoid reputational damage from biased AI',
      'Meet EU AI Act and upcoming global regulations',
      'Competitive advantage through ethical AI'
    ],
    pricing: { Starter: '$4,999/project', Professional: '$14,999/project', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'consult-green-1',
    title: 'Green IT & Sustainable Technology Consulting',
    subtitle: 'Reduce your technology carbon footprint and align IT with ESG goals',
    category: 'consulting',
    subcategory: 'Green IT',
    description: 'Green IT consulting — optimize infrastructure for energy efficiency, implement sustainable technology practices, and achieve carbon-neutral IT operations.',
    features: [
      'IT carbon footprint measurement and reporting',
      'Server and data center optimization',
      'Sustainable cloud migration strategies',
      'E-waste reduction and responsible disposal',
      'Energy-efficient architecture design',
      'Renewable energy integration for IT',
      'ESG-compliant technology procurement',
      'Green software development practices'
    ],
    benefits: [
      'Reduce IT energy costs by 20-35%',
      'Achieve carbon-neutral IT operations',
      'Meet ESG and sustainability reporting requirements',
      'Attract environmentally-conscious customers and talent'
    ],
    pricing: { Starter: '$3,999/mo', Professional: '$9,999/mo', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'consult-llm-1',
    title: 'LLM Integration & Prompt Engineering Consulting',
    subtitle: 'Expert consulting to integrate large language models into your products and workflows',
    category: 'consulting',
    subcategory: 'LLM Consulting',
    description: 'Strategic consulting for integrating large language models (GPT-4, Claude, Gemini, open-source) into your products, internal tools, and customer-facing applications.',
    features: [
      'LLM technology assessment and selection',
      'Prompt engineering and prompt library design',
      'RAG system architecture and implementation',
      'Fine-tuning strategy and execution',
      'Cost optimization for LLM usage',
      'Safety, guardrails, and content filtering',
      'Custom LLM training with proprietary data',
      'Multi-model orchestration design'
    ],
    benefits: [
      'Identify the optimal LLM for your use cases',
      'Reduce LLM API costs by 40-60%',
      'Build production-ready AI features fast',
      'Ensure safety and compliance in AI outputs'
    ],
    pricing: { Starter: '$4,999/project', Professional: '$14,999/project', Enterprise: 'Custom' },
    contactUrl: '/contact'
  },
  {
    id: 'consult-web3-1',
    title: 'Web3 & DeFi Strategy Consulting',
    subtitle: 'Navigate the decentralized future with expert Web3 and DeFi advisory',
    category: 'consulting',
    subcategory: 'Web3 / DeFi',
    description: 'Strategic consulting for blockchain adoption, DeFi protocol development, DAO governance, tokenomics design, and digital asset strategy.',
    features: [
      'Blockchain adoption strategy and assessment',
      'DeFi protocol audit and risk assessment',
      'DAO governance design and implementation',
      'Tokenomics modeling and token launch support',
      'NFT strategy and digital asset monetization',
      'Smart contract security review',
      'Metaverse and digital identity strategy',
      'Web3 regulatory compliance guidance'
    ],
    benefits: [
      'Navigate complex and evolving Web3 landscape',
      'Launch blockchain projects with confidence',
      'Mitigate risks in DeFi and token economics',
      'Stay compliant with evolving crypto regulations'
    ],
    pricing: { Starter: '$4,999/project', Professional: '$14,999/project', Enterprise: 'Custom' },
    contactUrl: '/contact'
  }'''

# ═══════════════════════════════════════════════════════
# INSERT ALL NEW SERVICES
# ═══════════════════════════════════════════════════════

# 1. Insert new AI services before the closing of aiServices array
# Find: the last ai service entry closing and the "];" of aiServices
# The AI section ends with:  contactUrl: '/contact'\n  },\n];
ai_insert_point = content.rfind('    contactUrl: \'/contact\'\n  },\n];', 0, content.find('// ═══════════════════════════════════════════════════════\n// SECTION 2'))
if ai_insert_point == -1:
    # Fallback: find the AI section closing bracket
    ai_insert_point = content.find('];\n\n// ═══════════════════════════════════════════════════════\n// SECTION 2')
    if ai_insert_point == -1:
        raise Exception("Could not find AI section closing")

content = content[:ai_insert_point] + new_ai_services + '\n' + content[ai_insert_point:]

# 2. Insert new IT services before the closing of itServices array
it_insert_point = content.find('];\n\n// ═══════════════════════════════════════════════════════\n// SECTION 3')
if it_insert_point == -1:
    raise Exception("Could not find IT section closing")

content = content[:it_insert_point] + new_it_services + '\n' + content[it_insert_point:]

# 3. Insert new SAAS services before the closing of saasSolutions array
saas_insert_point = content.find('];\n\n// ═══════════════════════════════════════════════════════\n// SECTION 4')
if saas_insert_point == -1:
    raise Exception("Could not find SAAS section closing")

content = content[:saas_insert_point] + new_saas_services + '\n' + content[saas_insert_point:]

# 4. Insert new consulting services before the closing of consultingServices array
consult_insert_point = content.rfind('];\n\n// ═══════════════════════════════════════════════════════\n// COMBINED EXPORT')
if consult_insert_point == -1:
    raise Exception("Could not find Consulting section closing")

content = content[:consult_insert_point] + new_consulting_services + '\n' + content[consult_insert_point:]

with open('/Users/klebergarciaalcatrao/zion.app/app/data/servicesData.ts', 'w') as f:
    f.write(content)

print("Services added successfully!")
print(f"File length: {len(content)} chars, {content.count(chr(10))} lines")
print(f"AI services blocks: {content.count('ai-digitaltwin-1') + content.count('ai-autonomous-1') + content.count('ai-quantum-1') + content.count('ai-predictive-1') + content.count('ai-sustainability-1')} new")
print(f"IT services blocks: {content.count('it-zero-trust-1') + content.count('it-finops-1') + content.count('it-gitops-1') + content.count('it-sre-1')} new")
print(f"SAAS blocks: {content.count('saas-pwa-1') + content.count('saas-datashare-1') + content.count('saas-testimonial-1') + content.count('saas-forms-1')} new")
print(f"Consulting blocks: {content.count('consult-responsible-ai-1') + content.count('consult-green-1') + content.count('consult-llm-1') + content.count('consult-web3-1')} new")