// Service data for AI and IT solutions
export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  benefits: string[];
  pricing: {
    basic: string;
    pro: string;
    enterprise: string;
  }
  contactInfo: {
    website: string;
    email: string;
    phone: string;
  }
  icon: string;
  href: string;
  popular?: boolean;
  category: 'ai' | 'it' | 'cloud' | 'security' | 'data' | 'automation';
}


export const aiServices: Service[] = [  {
    id: 'ai-agent-tool-builder',
    title: 'AI Agent Tool Builder',
    description: 'Visual no-code tool builder for LLM agents: define function-calling tools, MCP server scaffolding, OpenAPI wrapper, and sandbox test harness.',
    icon: '★',
    features: ['Drag-drop tool schema builder', 'MCP server scaffold + OpenAPI wrapper', 'Sandbox execution harness per tool', 'Multi-model compatibility (OpenAI/Anthropic/Google)'],
    benefits: ['Build tools for agents in hours, not weeks', 'MCP first = compatible with Claude/Copilot/GPTs', 'Sandbox test = no production risk', 'Function-calling = deterministic tool invoke'],
    pricing: {'basic': '1999', 'pro': '4999', 'enterprise': '14999'},
    contactInfo: { website: '/services/ai-agent-tool-builder', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-agent-tool-builder',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-vision-quality-inspection',
    title: 'Computer Vision Quality Inspection',
    description: 'Manufacturing/production line defect detection via camera feed YOLO/RT-DETR inference, real-time alarms, and SPC (Statistical Process Control) shift reports.',
    icon: '★',
    features: ['YOLOv8/RT-DETR model fine-tune on your SKU', 'Inference on edge device <30ms per frame', 'Real-time alarm + MES work-order auto-create', 'SPC chart + shift defect trend report'],
    benefits: ['Catch production defects before they ship', 'Edge inference = no network round-trip delay', 'MES integration = no manual data entry', 'Catch more defects = lower scrap cost'],
    pricing: {'basic': '4999', 'pro': '11999', 'enterprise': '34999'},
    contactInfo: { website: '/services/ai-vision-quality-inspection', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-vision-quality-inspection',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-voice-to-action-platform',
    title: 'Voice-to-Action Platform',
    description: 'ASR (speech-to-text) + LLM intent extraction + action execution: schedule meetings, create tickets, run queries — all via natural voice.',
    icon: '★',
    features: ['ASR (Whisper/Deepgram) multi-language', 'Intent extraction + slot-filling via LLM', 'Connector library (calendar/CRM/ticketing)', 'Privacy-first: on-prem ASR + LLM option'],
    benefits: ['Replace manual data entry with voice', 'Multi-language = global team adoption', 'On-prem ASR/LLM = zero data leaves your network', 'API-first connectors = extend to any tool'],
    pricing: {'basic': '2499', 'pro': '5999', 'enterprise': '17999'},
    contactInfo: { website: '/services/ai-voice-to-action-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-voice-to-action-platform',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-customer-success-predictor',
    title: 'Customer Success Predictor',
    description: 'Early churn signal detection via usage analytics + support ticket sentiment; auto-create retention playbook per at-risk account.',
    icon: '★',
    features: ['Usage analytics churn signal (feature adoption)', 'Support ticket sentiment per account', 'Auto-created retention playbook per at-risk account', 'CSM engagement score card per tier cohort'],
    benefits: ['Proactively retain customers before they churn', 'Shared context across CSM + engineering + product', 'Retention playbook = no more fire-drill', 'Churn signal visible in real-time'],
    pricing: {'basic': '1999', 'pro': '4999', 'enterprise': '14999'},
    contactInfo: { website: '/services/ai-customer-success-predictor', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-customer-success-predictor',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-knowledge-graph-builder',
    title: 'Knowledge Graph Builder',
    description: 'Auto-build entity/relation graph from unstructured docs + structured DBs; SPARQL/GraphQL query; graph-visualisation frontend.',
    icon: '★',
    features: ['NER (Named Entity Recognition) + relation extraction', 'Graph schema auto-generated from data', 'SPARQL + GraphQL dual query layer', 'Neo4j/TypeDB graph store + schema management'],
    benefits: ['Hidden connections revealed across all your data', 'Graph query = complex questions in seconds', 'Build knowledge graph in days not months', 'Graph visualisation = executive-ready insight'],
    pricing: {'basic': '3499', 'pro': '7999', 'enterprise': '24999'},
    contactInfo: { website: '/services/ai-knowledge-graph-builder', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-knowledge-graph-builder',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-caption-subtitle-generator',
    title: 'Caption & Subtitle Generator',
    description: 'Multi-language ASR translation, caption formatting, SRT/VTT/WebVTT export with lip-sync timing alignment for video.',
    icon: '★',
    features: ['Multi-language ASR transcription (50+ languages)', 'LLM translation + cultural localisation', 'SRT/VTT/WebVTT + lip-sync time-align', 'Auto-highlight key quote phrases per transcript'],
    benefits: ['Add captions to 500 videos in one weekend', '50+ languages = global audience reach', 'Comply with local accessibility regulations', 'Auto-highlight = better viewer engagement'],
    pricing: {'basic': '799', 'pro': '1999', 'enterprise': '5999'},
    contactInfo: { website: '/services/ai-caption-subtitle-generator', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-caption-subtitle-generator',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-marketing-copy-generator',
    title: 'AI Marketing Copy Generator',
    description: 'Multi-format copy engine: SEO blog, ad headline, landing page, LinkedIn post, email sequence — brand-voice tuned per company.',
    icon: '★',
    features: ['10+ output formats (blog/ad/landing/LinkedIn/email)', 'Brand voice training on your tone/guidelines', 'SEO brief + outline + draft in one pass', 'Human-in-loop review + approval workflow'],
    benefits: ['Write content 10x faster with brand-voice', 'SEO brief + outline + draft = zero writer block', 'Consistent voice across all 10+ formats', 'Approval workflow = content quality gate'],
    pricing: {'basic': '399', 'pro': '999', 'enterprise': '2999'},
    contactInfo: { website: '/services/ai-marketing-copy-generator', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-marketing-copy-generator',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-code-migration-assistant',
    title: 'AI Code Migration Assistant',
    description: 'Automated major-version migration: React 18→19, Python 3.9→3.12, Rails 6→7, with AST-wrapped diff PR and regression test suit.',
    icon: '★',
    features: ['AST-level code transformation (no regex hacks)', 'Breaking-change detection + PR diff per file', 'Regression test suite auto-generated per migration', 'Manual-approval gate per PR (human-in-loop)'],
    benefits: ['Migrate framework major-version in days not weeks', 'AST transform = safe, not search-replace', 'Regression test = confidence before merging', 'PR per file = audit trail of every change'],
    pricing: {'basic': '3499', 'pro': '6999', 'enterprise': '19999'},
    contactInfo: { website: '/services/ai-code-migration-assistant', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-code-migration-assistant',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-product-analytics-insights',
    title: 'Product Analytics & AI Insights',
    description: 'Auto-insights engine: conversion funnel anomaly, feature-adoption cohort, retention waterfall, session replay auto-clip per insight.',
    icon: '★',
    features: ['Conversion funnel anomaly per step', 'Feature-adoption cohort heatmap', 'Retention waterfall (D1/D7/D30/D90)', 'Session replay auto-clip per anomaly insight'],
    benefits: ['Product insights before you even ask', 'Funnel anomaly = know before user complains', 'Session replay = spot the UX bug instantly', 'Retention waterfall shows where users leave'],
    pricing: {'basic': '1999', 'pro': '4999', 'enterprise': '14999'},
    contactInfo: { website: '/services/ai-product-analytics-insights', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-product-analytics-insights',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-autonomous-code-deployment',
    title: 'Autonomous Code Deployment Agent',
    description: 'Code-review finder, security scan (SAST/DAST), test-retry, feature-flag gate, rollback on error-rate spike, chat-notification on completion.',
    icon: '★',
    features: ['Code-review finder (comment on PR per pattern)', 'Security scan (CodeQL + Snyk + Trivy)', 'Auto-retry flaky test up to 3x', 'Feature-flag gate auto-enable on green CI', 'Rollback automatic on error-rate spike'],
    benefits: ['Ship every commit to prod without manual gate', 'Review comments = faster merge review', 'Rollback on error spike = zero incident blast', 'Notifications = team always in-the-loop'],
    pricing: {'basic': '4999', 'pro': '11999', 'enterprise': '29999'},
    contactInfo: { website: '/services/ai-autonomous-code-deployment', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-autonomous-code-deployment',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-predictive-supply-chain-optimizer',
    title: 'Predictive Supply Chain Optimizer',
    description: 'Demand forecasting XGBoost/LightGBM, inventory reorder point SDE, route optimisation OR-Tools, and supplier risk scoring per vendor.',
    icon: '★',
    features: ['Demand forecast XGBoost/LightGBM per SKU', 'Safety-stock SDE (service-level, lead-time)', 'Route optimisation OR-Tools per order-batch', 'Supplier risk score per vendor/region/country'],
    benefits: ['Reduce stock-outs 30%, reduce overstock', 'Reorder point auto-updated per lead-time', 'Route optimisation saves 15-20% logistics cost', 'Supplier risk score = pre-empt disruption before it hits'],
    pricing: {'basic': '4999', 'pro': '11999', 'enterprise': '34999'},
    contactInfo: { website: '/services/ai-predictive-supply-chain-optimizer', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-predictive-supply-chain-optimizer',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-predictive-fraud-detection-streaming',
    title: 'Streaming Fraud Detection (Real-Time)',
    description: 'Real-time fraud scoring on Kafka event stream: feature engineering IsolationForest + XGBoost alert/block with feedback loop for model retrain.',
    icon: '★',
    features: ['Kafka event stream feature engineering', 'IsolationForest + XGBoost stacked fraud score', 'Online feature store for low-latency inference', 'Feedback loop model retrain pipeline'],
    benefits: ['Block fraud in real-time, not batch', 'Low-latency inference <50ms per transaction', 'Feedback loop = model improves every day', 'Feature store = fast inference, no ETL lag'],
    pricing: {'basic': '4999', 'pro': '11999', 'enterprise': '34999'},
    contactInfo: { website: '/services/ai-predictive-fraud-detection-streaming', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-predictive-fraud-detection-streaming',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-reinforcement-learning-optimiser',
    title: 'Reinforcement Learning Optimiser',
    description: 'RL-based continuous optimisation for resource scheduling, pricing, content delivery, manufacturing control, and inventory replenishment policies.',
    icon: '★',
    features: ['PPO/SAC RL fine-tune on your KPI objective', 'Simulation environment without touching production', 'Policy deployment via feature-flag rollout', 'Online drift detector + retrain trigger'],
    benefits: ['Optimise continuously, not just on batch', 'RL finds non-obvious policies humans miss', 'Sim-first = zero production risk', 'Rollout feature-flag = test policy revenue-safe'],
    pricing: {'basic': '4999', 'pro': '11999', 'enterprise': '34999'},
    contactInfo: { website: '/services/ai-reinforcement-learning-optimiser', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-reinforcement-learning-optimiser',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-machine-translation-quality',
    title: 'Machine Translation Quality Engine',
    description: 'Neural MT post-editing quality scoring (COMET/HYENA), terminology enforcement, auto-edit suggestion, and translation memory browser.',
    icon: '★',
    features: ['COMET/HYENA quality scoring per segment', 'Terminology enforcement dictionary', 'Auto-edit suggestion (Neural MT post-editing)', 'Translation memory browser per language pair'],
    benefits: ['Post-editing effort reduced 40-60%', 'Quality scoring = know what to skip', 'Terminology enforced = consistent translations', 'Translation memory = no duplicate work'],
    pricing: {'basic': '1599', 'pro': '3799', 'enterprise': '11999'},
    contactInfo: { website: '/services/ai-machine-translation-quality', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-machine-translation-quality',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-meeting-assistant-pro',
    title: 'AI Meeting Assistant Pro',
    description: 'Live transcription, action-item extraction, decision-log compiler, sentiment tracker, and auto-sync to Asana/Slack/Done with calendar.',
    icon: '★',
    features: ['Live transcription (OpenAI Whisper Real-time)', 'Action-item extraction + assignment', 'Decision-log compiler per meeting', 'Sentiment tracker per participant + aggregate'],
    benefits: ['Never miss an action item again', 'Decision log = writable history per team', 'Sentiment tracker = spot team health trends early', 'Auto-sync = no manual post-meeting admin'],
    pricing: {'basic': '1799', 'pro': '3999', 'enterprise': '11999'},
    contactInfo: { website: '/services/ai-meeting-assistant-pro', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-meeting-assistant-pro',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-content-moderation-platform',
    title: 'AI Content Moderation Platform',
    description: 'Multi-modal moderation (text/image/video): NSFW, hate-speech, PII, copyright, brand-safety classifier; moderation queue + human-review.',
    icon: '★',
    features: ['Text/image/video multi-modal classifier', 'NSFW + hate-speech + PII + copyright tagging', 'Auto-approve with confidence score threshold', 'Moderation queue + human-review escalations'],
    benefits: ['Auto-moderate UGC at scale, no human bottleneck', 'NSFW/hate-speech caught before published', 'PII detected = prevent data breach in UGC', 'Approve high-confidence = spend less human-review time'],
    pricing: {'basic': '1999', 'pro': '4999', 'enterprise': '14999'},
    contactInfo: { website: '/services/ai-content-moderation-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-content-moderation-platform',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-personalisation-engine-realtime',
    title: 'Real-Time Personalisation Engine',
    description: 'Session-based recommendation: collaborative-filtering + LLM cold-start description; auto A/B homepage variant; JSON recommendation API.',
    icon: '★',
    features: ['Session-based collaborative-filtering per user', 'LLM cold-start description for new/no-history users', 'Auto A/B variant per homepage/checkout/product', 'JSON recommendation API (endpoint per user/context)'],
    benefits: ['Personalise homepage/product listings per visitor', 'LLM = cold-start, no collaborative-filtering history', 'A/B variant = win more, not just testing', 'API = plug personalisation into any frontend'],
    pricing: {'basic': '3499', 'pro': '7499', 'enterprise': '21999'},
    contactInfo: { website: '/services/ai-personalisation-engine-realtime', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-personalisation-engine-realtime',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-autonomous-qa-engineering',
    title: 'Autonomous QA Engineering Platform',
    description: 'Auto-generate comprehensive E2E tests from user session replay; auto-fix flaky selectors; run tests on every PR; auto-open bug ticket on fail.',
    icon: '★',
    features: ['E2E test auto-generation from session replay', 'Auto-fix flaky selector on retry (best-match)', 'Run full E2E suite per PR + auto-open Jira', 'Flake budget SLA gate per PR'],
    benefits: ['QA engineers 10x test coverage writing zero tests', 'Flaky tests auto-fixed = stable build', 'Auto-open Jira on fail = zero manual effort', 'Branch coverage measurable every PR'],
    pricing: {'basic': '2499', 'pro': '5999', 'enterprise': '17999'},
    contactInfo: { website: '/services/ai-autonomous-qa-engineering', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-autonomous-qa-engineering',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-spatial-computing-3d-scene',
    title: 'Spatial Computing 3D Scene Generator',
    description: 'Text/Image 3D scene via Gaussian Splatting/LRM; real-time viewer in browser via Three.js; FBX/GLTF/OBJ export for game/VR pipeline.',
    icon: '★',
    features: ['Text/Image 3D scene Gaussian Splatting/LRM', 'Real-time browser viewer via Three.js', 'Object decomposition + physics export', 'FBX/GLTF/OBJ export + textures baked'],
    benefits: ['Generate 3D scene in minutes from text prompt', 'No 3D art skills needed — describe in words', 'Realtime browser viewer = immediate iteration', 'Export to Unity/Unreal/blender game engine'],
    pricing: {'basic': '2999', 'pro': '6999', 'enterprise': '19999'},
    contactInfo: { website: '/services/ai-spatial-computing-3d-scene', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-spatial-computing-3d-scene',
    category: 'ai',
    popular: false,
  },
  {
    id: 'ai-computer-vision-shelf-monitoring',
    title: 'Computer Vision Shelf Monitoring',
    description: 'Retail shelf stock-out detection, facings count, planogram compliance, and out-of-stock alert to store manager via Slack/POS.',
    icon: '★',
    features: ['YOLOv8/RT-DETR shelf item detection', 'Stock-out detection per SKU per camera', 'Facings count + planogram compliance score', 'Slack/POS out-of-stock alert auto-create ticket'],
    benefits: ['Out-of-stock alert before customer asks', 'Restock automatically by exception not patrol', 'Planogram compliance tracked per store', 'Shelf analytics = physical retail finally digitised'],
    pricing: {'basic': '3499', 'pro': '7999', 'enterprise': '24999'},
    contactInfo: { website: '/services/ai-computer-vision-shelf-monitoring', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/ai-computer-vision-shelf-monitoring',
    category: 'ai',
    popular: false,
  },

{
    id: 'advanced-ai-enterprise-intelligence-hub',
    title: 'Advanced AI & Enterprise Intelligence Hub',
    description: 'Unify generative AI, autonomous agents, multimodal intelligence, RAG, governance, observability, and enterprise copilots into a single advanced AI ...',
    features: ['Unified Advanced AI Fabric', 'Enterprise-Grade Governance & Trust', 'Cross-Provider Model Orchestration', 'Production-Ready RAG & Knowledge Systems', 'Enterprise Copilots and Assistants', 'End-to-End Observability & MLOps'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/advanced-ai-enterprise-intelligence-hub', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🧠',
    href: '/services/advanced-ai-enterprise-intelligence-hub',
    category: 'ai'
  }
,
{
    id: 'ai-accessibility-auditor',
    title: 'AI Accessibility Auditor',
    description: `Automated WCAG 2.1 AA compliance scans for websites & apps with screen-reader simulation, color contrast testing, and keyboard navigation checks.`,
    features: ["Full-page accessibility scoring", "Component-level issue mapping", "Remediation code snippets", "Automated PDF accessibility check"],
    benefits: ["Avoid ADA lawsuit risks", "Improve SEO through accessibility", "Enhance UX for all users"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/ai-services/ai-accessibility-auditor',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '♿',
    href: '/services/ai-accessibility-auditor',
    category: 'ai'
  }
,
{
    id: 'ai-accessibility-optimizer',
    title: 'AI Accessibility Content Optimizer',
    description: `Suggests alt-text for images, transcript generation for videos, and semantic HTML improvements to boost accessibility and SEO simultaneously.`,
    features: ["Auto-alt-text for images", "Video transcript with speaker IDs", "Readability scoring", "WCAG 2.1 AA gap analysis"],
    benefits: ["Improves Google Lighthouse scores", "Meets legal compliance", "Enhances user experience"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/ai-services/ai-accessibility-optimizer',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔧',
    href: '/services/ai-accessibility-optimizer',
    category: 'ai'
  }
,
{
    id: 'ai-agentic-workflows',
    title: 'AI Agentic Workflow Automation',
    description: 'Autonomous AI agents that plan, execute, and monitor multi-step business workflows — from data gathering to decision execution with human-in-the-loop oversight.',
    features: ['Multi-agent orchestration with role specialization', 'Natural language workflow design', 'Human-in-the-loop approval gates', 'Self-healing workflows with error recovery', 'Real-time monitoring dashboards', 'Integration with 200+ enterprise tools'],
    benefits: ['Replace 70% of repetitive operational workflows', '24/7 autonomous execution without human intervention', 'Faster workflow creation with natural language design', 'Seamless integration with existing tool stack'],
    pricing: { basic: '399', pro: '899', enterprise: '2499' },
    contactInfo: { website: '/ai-services/ai-agentic-workflows', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🤖',
    href: '/services/ai-agentic-workflows',
    category: 'ai'
  }
,
{
    id: 'ai-aiops-anomaly-detection',
    title: 'AI-AIOps Anomaly Detection',
    description: `Detects infrastructure anomalies (CPU, memory, error rates) before they cause outages using unsupervised learning and seasonal decomposition.`,
    features: ["Metric anomaly scoring", "Correlation across services", "Predictive alerting (30 min lead)", "Integration with PagerDuty & Slack"],
    benefits: ["Catches issues 85% faster than thresholds", "Reduces MTTR by 30%", "Prevents revenue-impacting downtime"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/ai-services/ai-aiops-anomaly-detection',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📈',
    href: '/services/ai-aiops-anomaly-detection',
    category: 'ai'
  }
,
{
    id: 'ai-analytics',
    title: 'AI Analytics & BI',
    description: 'Transform your data into actionable insights with our advanced AI analytics platform.',
    features: [
      'Real-time data processing',
      'Predictive analytics',
      'Custom dashboards',
      'Automated reporting',
      'Machine learning models'
    ],
    benefits: [
      'Increased efficiency',
      'Better decision making',
      'Cost reduction',
      'Competitive advantage'
    ],
    pricing: {
      basic: '299',
      pro: '599',
      enterprise: '1299'
    },
    contactInfo: {
      website: '/data-analytics',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📊',
    href: '/services/ai-analytics',
    popular: true,
    category: 'ai'
  }
,
{
    id: 'ai-automated-reporting',
    title: 'Automated Reporting Engine',
    description: `Turn raw data into formatted PDF/PPT reports with natural language summaries. Schedule distributions to stakeholders.`,
    features: ["Natural language summaries", "Custom templates (PDF, PPT)", "Scheduled distribution", "Drill-down charts", "Email & Slack delivery"],
    benefits: ["Save 20+ hours/month on reporting", "Ensure consistent formatting", "Deliver insights faster"],
    pricing: {"basic":"149","pro":"399","enterprise":"999"},
    contactInfo: {
      website: '/ai-services/ai-automated-reporting',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📊',
    href: '/services/ai-automated-reporting',
    category: 'ai'
  }
,
{
    id: 'ai-automation',
    title: 'AI Automation',
    description: 'Streamline your business processes with intelligent automation solutions.',
    features: [
      'Workflow automation',
      'Document processing',
      'Email automation',
      'Task scheduling',
      'Process optimization'
    ],
    benefits: [
      'Time savings',
      'Reduced errors',
      'Scalable processes',
      'Improved productivity'
    ],
    pricing: {
      basic: '199',
      pro: '399',
      enterprise: '899'
    },
    contactInfo: {
      website: '/ai-services/process-automation',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🤖',
    href: '/services/ai-automation',
    category: 'ai'
  }
,
{
    id: 'ai-bdr-sdr',
    title: 'AI BDR/SDR Agent',
    description: 'Autonomous AI Business Development & Sales Development Representative: prospect, qualify, email, book meetings, and nurture leads 24/7 without human intervention.',
    features: [
      'Lead research & enrichment (LinkedIn, company data)',
      'Personalized cold email & LinkedIn outreach',
      'Intent signal detection & prioritization',
      'Automated meeting booking (Calendly integration)',
      'CRM sync (HubSpot, Salesforce)'
    ],
    benefits: [
      'Generate 50+ qualified meetings/month',
      '80% lower cost-per-lead vs human BDRs',
      '24/7 prospecting across timezones',
      'Scalable outbound engine'
    ],
    pricing: {
      basic: '699',
      pro: '1299',
      enterprise: '3499'
    },
    contactInfo: {
      website: '/ai-services/ai-bdr-sdr-agent',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📧',
    href: '/services/ai-bdr-sdr',
    category: 'ai'
  },
  {
    id: 'ai-bom-procurement',
    title: 'AI BOM & Procurement Optimiser',
    description: 'Multi-tier bill-of-materials analyser. Optimises part sourcing, predicts shortages, recommends alternative components, and benchmarks against global market pricing for manufacturing.',
    features: [
      'Multi-tier BOM parsing',
      'Supplier intelligence and scoring',
      'Alternative component finder',
      'Global price benchmarking',
      'Lead-time and supply-risk prediction',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$499',
      pro: '$998',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-bom-procurement',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '🏭',
    href: '/services/ai-bom-procurement',
    category: 'ai',
  },
  {
    id: 'ai-brand-voice-guardian',
    title: 'AI Brand Voice Guardian',
    description: 'Maintain consistent brand voice. AI audits existing content, generates tone guidelines, and rewrites copy in real time to match your brand persona across every channel.',
    features: [
      'Tone profiling from existing content',
      'Multi-channel voice adapter',
      'Brand guideline document generator',
      'Competitor tone comparison',
      'Real-time style enforcement',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$149',
      pro: '$298',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-brand-voice-guardian',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '🎤',
    href: '/services/ai-brand-voice-guardian',
    category: 'ai',
  }
,
{
    id: 'ai-call-center-voice-analytics',
    title: 'AI Call Center Voice Analytics',
    description: 'Real-time call transcription, sentiment analysis, agent coaching insights, and compliance monitoring for contact centers.',
    features: [
      'Real-time speech-to-text transcription',
      'Sentiment & emotion detection',
      'Agent compliance monitoring (PCI, GDPR)',
      'Automated coaching suggestions',
      'Keyword & topic trend analysis'
    ],
    benefits: [
      'Improve CSAT scores by 25%',
      'Reduce agent onboarding time by 50%',
      'Automated compliance evidence collection',
      'Identify upsell opportunities in real-time'
    ],
    pricing: {
      basic: '299',
      pro: '699',
      enterprise: '1899'
    },
    contactInfo: {
      website: '/ai-services/ai-call-center-voice-analytics',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📞',
    href: '/services/ai-call-center-voice-analytics',
    category: 'ai'
  },
  {
    id: 'ai-campaign-predictor',
    title: 'AI Campaign Performance Predictor',
    description: 'Predict campaign outcomes before launch. Forecast CTR, conversion rate, and ROAS using historical targeting data and creative asset features.',
    features: [
      'ROAS and CTR forecasting',
      'A/B test simulation engine',
      'Audience segment scoring',
      'Creative asset feature extractor',
      'Multi-touch attribution model',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$249',
      pro: '$498',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-campaign-predictor',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '📈',
    href: '/services/ai-campaign-predictor',
    category: 'ai',
  }
,
{
    id: 'ai-chatbot-builder-pro',
    title: 'AI Chatbot Builder Pro',
    description: 'Build intelligent, multi-channel chatbots with RAG-powered knowledge bases, workflow automation, and seamless human handoff.',
    features: ['RAG-powered knowledge base from your docs', 'Multi-channel — website, WhatsApp, Slack, Teams', 'Visual drag-and-drop flow designer', 'Smart human handoff with context transfer', 'Analytics — resolution rates, satisfaction, trends', 'Continuous learning from unanswered questions'],
    benefits: ['70%+ automatic resolution rate', 'Multi-channel from single builder', 'Continuous self-improvement', 'Seamless human handoff', 'Built-in analytics dashboard', 'No-code visual flow designer'],
    pricing: { basic: '99', pro: '299', enterprise: '699' },
    contactInfo: { website: '/ai-services/ai-chatbot-builder-pro', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🤖',
    href: '/services/ai-chatbot-builder-pro',
    category: 'ai'
  }
,
{
    id: 'ai-chatbot-omnichannel',
    title: 'AI Omnichannel Chatbot',
    description: 'Unified AI assistant across website chat, Messenger, WhatsApp, SMS, and voice. Context-aware conversations with seamless human handoff.',
    features: [
      'Multichannel conversation orchestration',
      'Context memory across channels',
      'Fallback to live agents with full context',
      'Built-in analytics & conversation flows',
      'CRM & helpdesk integration'
    ],
    benefits: [
      '80% of queries resolved without human',
      'Consistent CX across all touchpoints',
      'Reduced agent handle time by 50%',
      '24/7/365 availability'
    ],
    pricing: {
      basic: '399',
      pro: '899',
      enterprise: '2499'
    },
    contactInfo: {
      website: '/ai-services/ai-omnichannel-chatbot',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '💬',
    href: '/services/ai-chatbot-omnichannel',
    category: 'ai'
  },
  {
    id: 'ai-code-assistant-enterprise',
    title: 'AI Code Assistant (Enterprise)',
    description: 'Private, fine-tuned AI coding copilot trained on your internal repositories with role-based access and SOC 2 compliance.',
    features: [
      'Private fine-tuned model',
      'Repo-aware completions',
      'Security scanning integrations',
      'Role-based access',
      'On-prem or VPC deployment'
    ],
    benefits: [
      '3x faster feature dev',
      'IP never leaves your infra',
      'Company-specific patterns',
      'SOC 2 compliant'
    ],
    pricing: {
      basic: '29',
      pro: '79',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/services/ai-code-assistant-enterprise',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '⌨️',
    href: '/services/ai-code-assistant-enterprise',
    category: 'ai'
  }
,
{
    id: 'ai-code-audit-security',
    title: 'AI Code Audit & Security Scanner',
    description: 'Comprehensive static analysis powered by AI: detect vulnerabilities, code smells, license compliance issues, and security anti-patterns before they reach production.',
    features: [
      'Static Application Security Testing (SAST)',
      'Secrets & credential leakage detection',
      'Dependency vulnerability scanning',
      'License compliance & risk assessment',
      'Remediation guidance with code suggestions'
    ],
    benefits: [
      'Prevent 95% of critical vulnerabilities',
      'Automated compliance reporting (SOC2, ISO)',
      'Reduce manual code review time by 70%',
      'Shift-left security integration'
    ],
    pricing: {
      basic: '199',
      pro: '499',
      enterprise: '1499'
    },
    contactInfo: {
      website: '/ai-services/ai-code-audit-security',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔒',
    href: '/services/ai-code-audit-security',
    category: 'ai'
  }
,
{
    id: 'ai-code-migration',
    title: 'AI Code Migration & Legacy Modernization',
    description: 'AI-powered legacy code analysis, automated migration planning, and assisted code transformation from COBOL, mainframe, and legacy frameworks to modern cloud-native stacks.',
    features: ['Legacy code analysis and dependency mapping', 'Automated migration plan generation', 'AI-assisted code transformation and refactoring', 'Test case generation for migrated systems', 'Risk assessment and rollback planning'],
    benefits: ['Reduce migration costs by 60%', 'Accelerate modernization timelines by 3x', 'Preserve business logic during transformation', 'Minimize production disruption'],
    pricing: { basic: '2999', pro: '5999', enterprise: '14999' },
    contactInfo: { website: '/ai-services/ai-code-migration', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💻',
    href: '/services/ai-code-migration',
    category: 'ai'
  }
,
{
    id: 'ai-code-migration-modernization',
    title: 'AI Code Migration & Modernization',
    description: 'Automatically migrate legacy codebases to modern frameworks (COBOL → Java, jQuery → React, Python 2 → Python 3) with AI-assisted refactoring.',
    features: ['Automated code translation', 'Dependency analysis and mapping', 'Test generation and validation', 'Incremental migration planning', 'Code quality scoring post-migration'],
    benefits: ['Reduce migration effort by 60%', 'Minimize business disruption', 'Modernize without complete rewrites', 'Maintain security and compliance'],
    pricing: { basic: '2999', pro: '7499', enterprise: '19999' },
    contactInfo: { website: '/ai-services/ai-code-migration-modernization', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⚙️',
    href: '/services/ai-code-migration-modernization',
    category: 'ai'
  }
,
{
    id: 'ai-code-review-assistant',
    title: 'AI Code Review Assistant',
    description: 'Automated code review with AI: detect bugs, security flaws, performance anti-patterns, and suggest fixes with before/after diffs.',
    features: [
      'Static analysis with deep learning',
      'Security vulnerability detection',
      'Performance optimization suggestions',
      'Code style & best practice enforcement',
      'GitHub/GitLab/Bitbucket PR integration'
    ],
    benefits: [
      'Catch 80% of bugs before QA',
      'Reduce review cycles by 60%',
      'Onboard juniors faster with AI mentoring',
      'Maintain consistent code quality'
    ],
    pricing: {
      basic: '249',
      pro: '599',
      enterprise: '1699'
    },
    contactInfo: {
      website: '/ai-services/ai-code-review-assistant',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '👨\u200d💻',
    href: '/services/ai-code-review-assistant',
    category: 'ai'
  }
,
{
    id: 'ai-code-reviewer-pro',
    title: 'AI Code Reviewer Pro',
    description: 'Automated code review that catches bugs, security issues, performance problems, and style violations before production.',
    features: ['Deep code analysis across 50+ languages', 'OWASP Top 10 vulnerability scanning', 'Performance suggestions with benchmarks', 'Team coding standards enforcement', 'PR integration — GitHub, GitLab, Bitbucket', 'Custom rules engine for team-specific checks'],
    benefits: ['Catch 80% of bugs before production', 'Automated security vulnerability scanning', 'PR integration with inline comments', 'Team custom rules enforcement', 'Reduces senior review time by 60%', 'Supports 50+ programming languages'],
    pricing: { basic: '69', pro: '199', enterprise: '499' },
    contactInfo: { website: '/ai-services/ai-code-reviewer-pro', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔍',
    href: '/services/ai-code-reviewer-pro',
    category: 'ai'
  }
,
{
    id: 'ai-codebase-doc-generator',
    title: 'AI Codebase Documentation Generator',
    description: `Automatically generates architecture diagrams, API docs, and README files by analyzing your Git repository and code dependencies.`,
    features: ["Interactive dependency graph", "Auto-updated API endpoint docs", "Change-log highlighting", "Developer onboarding checklist"],
    benefits: ["Cuts documentation time by 80%", "Keeps docs in sync with code", "Eases new hire ramp-up"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/ai-services/ai-codebase-doc-generator',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📚',
    href: '/services/ai-codebase-doc-generator',
    category: 'ai'
  }
,
{
    id: 'ai-competitive-intel-engine',
    title: 'AI Competitive Intel Engine',
    description: `Tracks competitors' pricing changes, feature launches, hiring patterns, and customer reviews to deliver weekly strategic insights.`,
    features: ["Price monitoring across 50+ sources", "Feature gap analysis vs your product", "Hiring intent detection (e.g. 'hiring 20 engineers')", "Sentiment on competitor brands"],
    benefits: ["Informs pricing strategy", "Prioritizes product roadmap", "Anticipates competitor moves"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/ai-services/ai-competitive-intel-engine',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔍',
    href: '/services/ai-competitive-intel-engine',
    category: 'ai'
  }
,
{
    id: 'ai-competitor-intelligence',
    title: 'Competitor Intelligence Engine',
    description: `Automated competitor tracking: pricing changes, feature releases, marketing campaigns from 10K+ sources. Weekly digest + real-time alerts.`,
    features: ["Daily web crawls", "Feature matrix auto-update", "Sentiment tracking", "Alert rules & thresholds", "Export to PDF/PPT"],
    benefits: ["Always know competitor moves", "Price with confidence", "Identify market gaps"],
    pricing: {"basic":"299","pro":"699","enterprise":"1999"},
    contactInfo: {
      website: '/ai-services/ai-competitor-intelligence',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🎯',
    href: '/services/ai-competitor-intelligence',
    category: 'ai'
  }
,
{
    id: 'ai-compliance',
    title: 'AI Compliance & Regulatory',
    description: 'Automated compliance monitoring, risk assessment, and audit trail management for GDPR, HIPAA, SOC 2, and more.',
    features: [
      'Automated policy generation',
      'Real-time compliance monitoring',
      'Risk assessment scoring',
      'Audit trail & reporting',
      'Regulatory change alerts'
    ],
    benefits: [
      'Continuous compliance assurance',
      'Reduced audit preparation time by 70%',
      'Automated risk scoring',
      'Multi-framework coverage'
    ],
    pricing: {
      basic: '449',
      pro: '999',
      enterprise: '2499'
    },
    contactInfo: {
      website: '/ai-services/ai-compliance',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🛡️',
    href: '/services/ai-compliance',
    category: 'ai'
  },
  {
    id: 'ai-compliance-generator',
    title: 'AI Privacy Policy & Compliance Generator',
    description: 'Generate compliant privacy policies, cookie banners, and consent management frameworks for GDPR, CCPA, HIPAA, and SOC 2 with one-click multi-version export.',
    features: [
      'Multi-jurisdiction template engine',
      'Cookie banner and consent builder',
      'Policy version history and diff',
      'Consent audit log',
      'Legal review export package',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$179',
      pro: '$358',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-compliance-generator',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '🔒',
    href: '/services/ai-compliance-generator',
    category: 'ai',
  }
,
{
    id: 'ai-computer-vision',
    title: 'AI Computer Vision',
    description: 'Image recognition, object detection, quality inspection, and visual search powered by deep learning models trained on your domain data.',
    features: ['Image classification & object detection', 'Visual quality inspection & defect detection', 'OCR + layout analysis', 'Visual search & similarity matching', 'Edge deployment for real-time inference'],
    benefits: ['Automated visual inspection at scale', '99%+ defect detection accuracy', 'Reduce QC labor costs by 80%', 'Real-time inference on edge devices'],
    pricing: { basic: '449', pro: '899', enterprise: '2199' },
    contactInfo: { website: '/ai-services/ai-computer-vision', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '👁️',
    href: '/services/ai-computer-vision',
    category: 'ai'
  }
,
{
    id: 'ai-content-generation',
    title: 'AI Content Generation',
    description: 'Generate high-quality blog posts, social media content, ad copy, product descriptions, and email campaigns powered by advanced LLMs.',
    features: [
      'Blog post & article generation',
      'Social media content creation',
      'SEO-optimized copywriting',
      'Ad copy & landing page text',
      'Brand voice customization'
    ],
    benefits: [
      '10x content production speed',
      'Consistent brand messaging',
      'SEO-optimized output',
      'Reduced content creation costs'
    ],
    pricing: {
      basic: '149',
      pro: '349',
      enterprise: '799'
    },
    contactInfo: {
      website: '/ai-services/ai-content-generation',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '✍️',
    href: '/services/ai-content-generation',
    category: 'ai'
  }
,
{
    id: 'ai-content-localization',
    title: 'AI Content Localization & Cultural Adaptation',
    description: 'Enterprise-grade content localization with context-aware translation, cultural nuance adaptation, brand voice preservation, and multi-market compliance.',
    features: ['Context-aware Neural Machine Translation (100+ languages)', 'Cultural adaptation and localization QA', 'Brand voice consistency across markets', 'Automated regulatory compliance checking', 'CMS and marketing platform integrations'],
    benefits: ['Launch in 50+ markets simultaneously', 'Reduce localization costs by 70%', 'Maintain brand integrity across cultures', 'Meet local regulatory requirements automatically'],
    pricing: { basic: '449', pro: '999', enterprise: '2299' },
    contactInfo: { website: '/ai-services/ai-content-localization', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🌍',
    href: '/services/ai-content-localization',
    category: 'ai'
  }
,
{
    id: 'ai-content-moderation',
    title: 'AI Content Moderation Platform',
    description: 'Automated content review for user-generated platforms — detect spam, harassment, and policy violations across text, image, and video.',
    features: ['Multi-modal content analysis', 'Custom policy rule engine', 'Real-time moderation workflows', 'Appeal and escalation handling', 'Compliance audit logging'],
    benefits: ['Moderate 99% of content automatically', 'Reduce review team costs by 75%', 'Maintain community safety standards', 'Scale to millions of posts daily'],
    pricing: { basic: '399', pro: '999', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-content-moderation', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🛡️',
    href: '/services/ai-content-moderation',
    category: 'ai'
  }
,
{
    id: 'ai-contract-analyzer-pro',
    title: 'Contract Analyzer Pro',
    description: `Automated legal contract review with risk scoring, clause extraction, and compliance checking against 200+ global regulations.`,
    features: ["Risk scoring 0\u2013100", "Clause extraction & classification", "Compliance matrix (GDPR, CCPA, HIPAA)", "Redline suggestions", "Audit trail"],
    benefits: ["Cut contract review time from hours to minutes", "Never miss a risky clause again", "Standardize across legal team"],
    pricing: {"basic":"199","pro":"499","enterprise":"1299"},
    contactInfo: {
      website: '/ai-services/ai-contract-analyzer-pro',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📜',
    href: '/services/ai-contract-analyzer-pro',
    category: 'ai'
  }
,
{
    id: 'ai-contract-manager',
    title: 'AI Contract Manager',
    description: 'End-to-end contract lifecycle management: AI-powered drafting, review, clause library, obligation tracking, and renewal alerts.',
    features: [
      'Smart clause library & assembly',
      'Obligation & deadline tracking',
      'Risk scoring & non-standard clause flagging',
      'Automated renewal & expiration alerts',
      'Integration with DocuSign & Adobe Sign'
    ],
    benefits: [
      'Cut contract cycle time by 70%',
      'Never miss a renewal again',
      'Reduce legal review burden',
      'Standardize contract terms'
    ],
    pricing: {
      basic: '599',
      pro: '1399',
      enterprise: '3999'
    },
    contactInfo: {
      website: '/ai-services/ai-contract-manager',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📝',
    href: '/services/ai-contract-manager',
    category: 'ai'
  }
,
{
    id: 'ai-contract-review',
    title: 'AI Contract Review Assistant',
    description: `Automatically reviews legal contracts, flags risky clauses, suggests amendments, and benchmarks against industry standards.`,
    features: ["Clause risk scoring (1-10)", "Comparison with 200K+ public contracts", "AI-suggested redlines", "Compliance checklist generation"],
    benefits: ["Cuts review time from hours to minutes", "Catches 95% of standard risks", "Reduces outside counsel dependency"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/ai-services/ai-contract-review',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📝',
    href: '/services/ai-contract-review',
    category: 'ai'
  }
,
{
    id: 'ai-customer-360',
    title: 'Customer 360 Unified Profile',
    description: `Aggregate all customer data (CRM, support, usage, billing) into single timeline. AI suggests next best action per customer.`,
    features: ["Data unification (10+ sources)", "Timeline view", "Next-best-action recommendations", "Segment builder", "Predictive CLV"],
    benefits: ["Know customer context instantly", "Personalize every interaction", "Identify at-risk accounts early"],
    pricing: {"basic":"299","pro":"699","enterprise":"1799"},
    contactInfo: {
      website: '/ai-services/ai-customer-360',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '👤',
    href: '/services/ai-customer-360',
    category: 'ai'
  }
,
{
    id: 'ai-customer-sentiment-analytics',
    title: 'AI Customer Sentiment Analytics',
    description: 'Real-time sentiment analysis across reviews, surveys, social media, and support interactions to drive proactive customer experience improvements.',
    features: ['Multi-channel sentiment tracking', 'Emotion intensity scoring', 'Trend detection and alerting', 'Competitor sentiment benchmarking', 'Actionable insight generation'],
    benefits: ['Predict customer churn 30 days early', 'Identify brand perception shifts', 'Prioritize CX improvements', 'Benchmark against competitors'],
    pricing: { basic: '349', pro: '799', enterprise: '1999' },
    contactInfo: { website: '/ai-services/ai-customer-sentiment-analytics', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💭',
    href: '/services/ai-customer-sentiment-analytics',
    category: 'ai'
  }
,
{
    id: 'ai-customer-sentiment-tracker',
    title: 'AI Customer Sentiment Tracker',
    description: `Monitors support tickets, reviews, social mentions, and surveys to produce a real-time Net Promoter Score (NPS) and emotion heatmap.`,
    features: ["Multi-channel aggregation (email, chat, social)", "Emotion classification (8 categories)", "Trend alerts for sentiment drops", "Root-cause topic clustering"],
    benefits: ["Detect brand crises within hours", "Identify at-risk accounts proactively", "Measure campaign impact on sentiment"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/ai-services/ai-customer-sentiment-tracker',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📊',
    href: '/services/ai-customer-sentiment-tracker',
    category: 'ai'
  }
,
{
    id: 'ai-customer-support',
    title: 'AI Customer Support',
    description: '24/7 AI-powered customer service with intelligent ticket routing, auto-resolution, and sentiment analysis.',
    features: [
      'AI chatbot with human handoff',
      'Smart ticket routing & prioritization',
      'Sentiment analysis & escalation',
      'Knowledge base auto-sync',
      'Multi-channel support (email, chat, social)'
    ],
    benefits: [
      'Round-the-clock support availability',
      'Reduced support costs by up to 60%',
      'Improved customer satisfaction (CSAT)',
      'Faster resolution times'
    ],
    pricing: {
      basic: '499',
      pro: '999',
      enterprise: '2499'
    },
    contactInfo: {
      website: '/ai-services/ai-customer-support',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '💬',
    href: '/services/ai-customer-support',
    popular: true,
    category: 'ai'
  }
,
{
     id: 'ai-customer-support-agent',
     title: 'AI Customer Support Agent',
     description: "Fully automated 24/7 customer support using RAG + LLMs: answer FAQs, troubleshoot issues, process returns, and escalate complex tickets with context handoff.",
     features: [
       'Multilingual support (50+ languages)',
       'Integrations: Zendesk, Intercom, Salesforce',
       'Document retrieval from knowledge base (RAG)',
       'Sentiment-aware responses & escalation',
       'Analytics: resolution rate, CSAT impact'
     ],
     benefits: [
       'Cut support costs by 70%',
       'Instant responses (sub-second)',
       '80%+ ticket deflection from humans',
       'Always-on coverage across timezones'
     ],
     pricing: { basic: '299', pro: '799', enterprise: '2499' },
     contactInfo: { website: '/ai-services/ai-customer-support-agent', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '🤖',
     href: '/services/ai-customer-support-agent',
     category: 'ai'
   }
,
{
    id: 'ai-cyber-threat-hunting',
    title: 'AI Cyber Threat Hunting & Incident Response',
    description: 'Proactive threat detection using advanced AI behavioral analysis, anomaly detection, and automated incident response orchestration for enterprises under constant attack.',
    features: ['24/7 AI-powered threat hunting across network endpoints', 'Behavioral anomaly detection & zero-day identification', 'Automated incident response playbooks', 'Threat intelligence correlation & enrichment', 'Forensic analysis & root-cause reconstruction', 'Compliance reporting for SOC 2, ISO 27001, NIST'],
    benefits: ['Detect threats 10x faster than manual SOC teams', 'Reduce mean time to response (MTTR) by 70%', 'Proactive defense against emerging attack vectors', 'Automated compliance audit trail generation'],
    pricing: { basic: '799', pro: '1799', enterprise: '3999' },
    contactInfo: { website: '/ai-services/ai-cyber-threat-hunting', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔒',
    href: '/services/ai-cyber-threat-hunting',
    category: 'ai'
  }
,
{
    id: 'ai-devops-chatbot',
    title: 'AI DevOps Chatbot',
    description: 'Natural language interface to your infrastructure: ask for logs, deployments, metrics, and incidents; get instant answers and auto-remediation suggestions.',
    features: [
      'Natural language queries over logs & metrics',
      'Incident root cause summarization',
      'Automated runbook execution (via chat)',
      'Slack/MS Teams integration',
      'Access control & audit logging'
    ],
    benefits: [
      'Reduce MTTR by 50%',
      'Empower juniors to troubleshoot like seniors',
      'Eliminate context switching between tools',
      'Document tribal knowledge automatically'
    ],
    pricing: {
      basic: '299',
      pro: '699',
      enterprise: '1999'
    },
    contactInfo: {
      website: '/ai-services/ai-devops-chatbot',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🤖',
    href: '/services/ai-devops-chatbot',
    category: 'ai'
  }
,
{
    id: 'ai-document-intelligence',
    title: 'AI Document Intelligence',
    description: 'End-to-end intelligent document processing with 99%+ accuracy OCR, classification, field-level data extraction, and automated workflow triggers.',
    features: ['99%+ accuracy AI-powered OCR', 'Intelligent document classification', 'Field-level structured data extraction', 'ERP/CRM validation & reconciliation', 'Automated approval workflow triggers'],
    benefits: ['Eliminate 90% of manual data entry', 'Process documents 50x faster', 'ERP-ready structured output', 'Immutable audit trail'],
    pricing: { basic: '449', pro: '999', enterprise: '2499' },
    contactInfo: { website: '/ai-services/ai-document-intelligence', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📄',
    href: '/services/ai-document-intelligence',
    popular: true,
    category: 'ai'
  },
  {
    id: 'ai-document-qa',
    title: 'AI Document Q&A Engine',
    description: 'Upload PDFs, Word docs, and spreadsheets; ask natural language questions and get instant cited answers with multi-document cross-referencing and role-based access control.',
    features: [
      'Multi-format PDF/Word/Sheets ingest',
      'Natural language query with citations',
      'Cross-document comparison view',
      'Role-based access and audit log',
      'Snippet-level answer provenance',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$299',
      pro: '$598',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-document-qa',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '📄',
    href: '/services/ai-document-qa',
    category: 'ai',
  }
,
{
     id: 'ai-driven-api-design-assistant',
     title: 'AI-Driven API Design Assistant',
     description: 'Design, document, and validate APIs using natural language specs; auto-generate OpenAPI/Swagger definitions, SDKs, and mock servers.',
     features: [
       'Natural language to OpenAPI 3.0 spec',
       'Schema validation & best practice linting',
       'Auto-generated client SDKs (10+ languages)',
       'Mock server with configurable responses',
       'Breaking change detection across versions'
     ],
     benefits: [
       'Design APIs 5x faster with AI guidance',
       'Ensure consistency & backward compatibility',
       'Ship SDKs automatically for all platforms',
       'Reduce design review cycles'
     ],
     pricing: { basic: '0', pro: '149', enterprise: '599' },
     contactInfo: { website: '/ai-services/ai-driven-api-design-assistant', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '🔗',
     href: '/services/ai-driven-api-design-assistant',
     category: 'ai'
   }
,
{
     id: 'ai-driven-customer-segmentation',
     title: 'AI-Driven Customer Segmentation & Persona Engine',
     description: 'Cluster your customer base into meaningful personas using behavioral data, purchase history, and engagement patterns; deliver personalized marketing automatically.',
     features: [
       'K-means + hierarchical clustering models',
       'Dynamic segment recalculation (daily/weekly)',
       'Persona profiles with predictive scores',
       'Export to CRM/CDP (Segment, HubSpot)',
       'Campaign performance tracking per segment'
     ],
     benefits: [
       'Increase conversion rates by 35%',
       'Reduce churn with targeted retention offers',
       'Discover hidden high-value niches',
       'Automate personalized messaging'
     ],
     pricing: { basic: '399', pro: '999', enterprise: '3299' },
     contactInfo: { website: '/ai-services/ai-driven-customer-segmentation', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '🎯',
     href: '/services/ai-driven-customer-segmentation',
     category: 'ai'
   }
,
{
    id: 'ai-drug-discovery',
    title: 'AI Drug Discovery & Molecular Design',
    description: 'Accelerate pharmaceutical R&D with AI-powered molecular simulation, target identification, toxicity prediction, and clinical trial optimization.',
    features: ['De novo molecular design with generative AI', 'Protein-ligand binding affinity prediction', 'ADMET toxicity and pharmacokinetics modeling', 'Clinical trial cohort matching and optimization', 'Multi-target drug candidate screening'],
    benefits: ['Reduce drug discovery timelines from 12 to 4 years', 'Cut R&D costs by 60% with AI-guided candidate selection', 'Predict toxicity before expensive animal studies', 'Increase first-in-human trial success rates'],
    pricing: { basic: '2999', pro: '6999', enterprise: '16999' },
    contactInfo: { website: '/ai-services/ai-drug-discovery', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💊',
    href: '/services/ai-drug-discovery',
    category: 'ai'
  }
,
{
    id: 'ai-education-tutor',
    title: 'AI 1:1 Tutor for K–12 & Higher Ed',
    description: `Personalized learning companion that adapts to student's pace, identifies knowledge gaps, and provides Socratic questioning to deepen understanding.`,
    features: ["Curriculum-aligned (Common Core, IB, AP)", "Progress dashboards for parents/teachers", "Multilingual support (25 languages)", "Plagiarism-resistant homework assistance"],
    benefits: ["Improves test scores by 1\u20132 letter grades", "Reduces teacher workload", "Provides equitable access to tutoring"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/ai-services/ai-education-tutor',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🎓',
    href: '/services/ai-education-tutor',
    category: 'ai'
  }
,
{
    id: 'ai-email-campaign-generator',
    title: 'Email Campaign Generator',
    description: `End-to-end email marketing: Generate sequences, personalize per recipient, A/B test subject lines, optimize send times.`,
    features: ["Multi-email sequence generation", "Personalization tokens", "Subject line A/B testing", "Send-time optimization", "Deliverability monitoring"],
    benefits: ["Launch campaigns in hours not weeks", "30%+ open rates via AI optimization", "Scale to 100K+ subscribers"],
    pricing: {"basic":"149","pro":"399","enterprise":"999"},
    contactInfo: {
      website: '/ai-services/ai-email-campaign-generator',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📧',
    href: '/services/ai-email-campaign-generator',
    category: 'ai'
  }
,
{
    id: 'ai-email-marketing',
    title: 'AI Email Marketing',
    description: 'Intelligent email campaigns with AI-powered subject lines, send-time optimization, dynamic content, and advanced segmentation.',
    features: [
      'AI subject line & copy generator',
      'Send-time optimization per subscriber',
      'Dynamic content personalization',
      'Advanced behavioral segmentation',
      'A/B/n automated testing'
    ],
    benefits: [
      '35% higher open rates',
      '50% higher click-through rates',
      'Automated campaign workflows',
      'Revenue attribution tracking'
    ],
    pricing: {
      basic: '199',
      pro: '449',
      enterprise: '999'
    },
    contactInfo: {
      website: '/ai-services/ai-email-marketing',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📧',
    href: '/services/ai-email-marketing',
    category: 'ai'
  }
,
{
    id: 'ai-employee-experience',
    title: 'AI Employee Experience Platform',
    description: 'End-to-end employee lifecycle automation from AI-powered onboarding to performance management, engagement tracking, and retention prediction.',
    features: ['Automated onboarding workflow orchestration', 'Personalized training & development paths', 'Sentiment & engagement tracking', 'AI-powered retention risk prediction', 'Buddy & mentor matching algorithms'],
    benefits: ['50% faster onboarding to productivity', 'Proactive retention risk detection', 'Eliminate IT/HR coordination overhead', 'Personalized growth plans per employee'],
    pricing: { basic: '299', pro: '699', enterprise: '1599' },
    contactInfo: { website: '/ai-services/ai-employee-experience', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🤝',
    href: '/services/ai-employee-experience',
    category: 'ai'
  }
,
{
    id: 'ai-energy-optimization',
    title: 'AI Energy Optimization & Sustainability',
    description: 'AI-driven energy consumption optimization for buildings, data centers, and manufacturing — reduce costs, meet ESG targets, and automate sustainability reporting.',
    features: ['AI-powered energy load forecasting and optimization', 'HVAC, lighting, and power system automated control', 'Carbon emissions tracking with ESG reporting', 'Peer benchmarking and efficiency gap analysis', 'Renewable energy integration recommendations', 'Real-time cost savings dashboard'],
    benefits: ['Reduce energy costs by 25-40%', 'Automate ESG and sustainability reporting', 'Meet regulatory carbon reduction targets', 'Predict equipment failures before they waste energy'],
    pricing: { basic: '549', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-energy-optimization', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⚡',
    href: '/services/ai-energy-optimization',
    category: 'ai'
  }
,
{
    id: 'ai-ethics-audit-1',
    title: 'AI Ethics Audit & Bias Assessment',
    description: 'Independent AI ethics audits examining your AI systems for bias, fairness, transparency, and regulatory compliance. Includes algorithmic impact assessments, bias testing across protected classes, and governance framework design.',
    features: [
      'Algorithmic bias detection across race, gender, age, and geography',
      'Model interpretability and explainability analysis (XAI)',
      'EU AI Act compliance assessment and readiness',
      'AI impact assessment for high-risk applications',
      'Fairness metrics evaluation (demographic parity, equalized odds)',
      'AI governance framework design (NIST AI RMF, OECD)',
      'Transparency report and model card documentation',
      'Stakeholder engagement and AI literacy workshops',
    ],
    benefits: [
      'Demonstrate responsible AI to regulators and stakeholders',
      'Prevent PR disasters from biased AI outputs',
      'Build customer trust through AI transparency',
      'Stay ahead of global AI regulation requirements',
    ],
    pricing: {
      basic: '$7,999/project',
      pro: '$24,999/project',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/ai-ethics-audit-1',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🧠',
    href: '/services/ai-ethics-audit-1',
    category: 'ai'
  }
,
{
    id: 'ai-ethics-governance',
    title: 'AI Ethics, Safety & Governance Framework',
    description: 'Comprehensive AI governance framework with bias detection, model explainability, audit trails, and regulatory compliance for responsible AI deployment.',
    features: ['Automated bias detection across training data and model outputs', 'Model interpretability and explainability (SHAP/LIME integration)', 'AI ethics board policy generation and compliance tracking', 'Regulatory compliance automation (EU AI Act, NIST AI RMF)', 'Continuous monitoring and audit log generation'],
    benefits: ['Deploy AI responsibly with regulatory confidence', 'Reduce AI-related legal and reputational risks', 'Build stakeholder and customer trust in AI systems', 'Stay ahead of emerging AI regulations globally'],
    pricing: { basic: '799', pro: '1899', enterprise: '4499' },
    contactInfo: { website: '/ai-services/ai-ethics-governance', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⚖️',
    href: '/services/ai-ethics-governance',
    category: 'ai'
  },
  {
    id: 'ai-expense-audit',
    title: 'AI Expense Categorisation & Audit',
    description: 'ML engine auto-categorises business expenses by GL code, flags policy violations, and generates audit-ready reports for your finance team.',
    features: [
      'Auto-categorisation by GL code',
      'Policy violation alerting',
      'Audit trail with full export',
      'QuickBooks, Xero, NetSuite integrations',
      'Custom rules engine per organisation',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$199',
      pro: '$398',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-expense-audit',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '🧾',
    href: '/services/ai-expense-audit',
    category: 'ai',
  }
,
{
    id: 'ai-financial-forecasting',
    title: 'AI Financial Forecasting & Planning',
    description: 'Revenue forecasting, cash flow prediction, and budget optimization using AI models trained on your historical and market data.',
    features: ['Revenue and expense forecasting', 'Cash flow prediction models', 'Scenario planning and simulation', 'Budget variance analysis', 'Automated financial reporting'],
    benefits: ['Reduce forecast errors by 40%', 'Improve budget accuracy', 'Enable proactive cash management', 'Support strategic decisions with data'],
    pricing: { basic: '899', pro: '2199', enterprise: '5999' },
    contactInfo: { website: '/ai-services/ai-financial-forecasting', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📊',
    href: '/services/ai-financial-forecasting',
    category: 'ai'
  }
,
{
    id: 'ai-financial-fraud-detection',
    title: 'AI Financial Fraud Detection & Prevention',
    description: 'Real-time transaction monitoring with deep learning anomaly detection, customer behavior profiling, and automated case management for banking and fintech.',
    features: ['Real-time transaction scoring & blocking', 'Deep learning behavioral anomaly detection', 'Customer risk profiling with dynamic baselines', 'Automated case management with evidence bundling', 'False positive reduction with adaptive learning', 'Regulatory reporting (BSA, AML, SAR) automation'],
    benefits: ['Catch 99.7% of fraudulent transactions in real time', 'Reduce false positives by 75% with adaptive models', 'Automate suspicious activity reporting', 'Lower fraud losses by 80% on average'],
    pricing: { basic: '799', pro: '1899', enterprise: '4499' },
    contactInfo: { website: '/ai-services/ai-fraud-detection', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🛡️',
    href: '/services/ai-financial-fraud-detection',
    category: 'ai'
  }
,
{
     id: 'ai-for-code-migration',
     title: 'AI-Assisted Code Migration & Refactoring',
     description: 'Automate legacy codebase modernization: convert jQuery to React, Python 2 to 3, AngularJS to modern frameworks with semantic-preserving transformations.',
     features: [
       'Language-to-language AST-based translation',
       'Preserve business logic & edge cases',
       'Interactive migration playground (preview changes)',
       'Test generation for migrated functions',
       'Gradual cutover strategy planning'
     ],
     benefits: [
       'Reduce migration project timeline by 75%',
       'Minimize regression risk via automated tests',
       'Lower cost vs. manual rewrite',
       'De-risk technical modernization'
     ],
     pricing: { basic: '2499', pro: '5999', enterprise: '19999' },
     contactInfo: { website: '/ai-services/ai-for-code-migration', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '🔀',
     href: '/services/ai-for-code-migration',
     category: 'ai'
   }
,
{
    id: 'ai-fraud-detection',
    title: 'AI Fraud Detection',
    description: 'Real-time fraud prevention using ML anomaly detection, behavioral analysis, and rule-based scoring for transactions and user activity.',
    features: [
      'Real-time transaction scoring',
      'Behavioral biometrics analysis',
      'Anomaly pattern detection',
      'Chargeback prediction & prevention',
      'AML/KYC compliance screening'
    ],
    benefits: [
      '99.5% fraud detection accuracy',
      'Reduced false positives by 60%',
      'Regulatory compliance automation',
      'Real-time alerting & blocking'
    ],
    pricing: {
      basic: '599',
      pro: '1299',
      enterprise: '3499'
    },
    contactInfo: {
      website: '/ai-services/ai-fraud-detection',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔐',
    href: '/services/ai-fraud-detection',
    category: 'ai'
  }
,
{
    id: 'ai-fraud-detection-finance',
    title: 'AI Fraud Detection for Finance',
    description: `Real-time transaction monitoring for banks, fintechs, and accounting firms with explainable AI decisions and SAR report generation.`,
    features: ["Rule-based plus ML hybrid model", "Explainable decision reasons (XAI)", "Adaptive learning from investigator feedback", "Automatic SAR filing templates"],
    benefits: ["Reduces false positives by 40%", "Meets FinCEN requirements", "Detects novel fraud patterns"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/ai-services/ai-fraud-detection-finance',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🛡️',
    href: '/services/ai-fraud-detection-finance',
    category: 'ai'
  }
,
{
    id: 'ai-fraud-detection-real-time',
    title: 'Real-Time Fraud Detection',
    description: `ML models trained on transaction data to detect anomalies in milliseconds. Adaptive learning reduces false positives over time.`,
    features: ["Real-time scoring (<50ms)", "Adaptive thresholds", "Case management dashboard", "Investigation tools", "PCI DSS compliant"],
    benefits: ["Catch fraud before it happens", "Reduce false positives by 40%", "Save millions in chargebacks"],
    pricing: {"basic":"399","pro":"899","enterprise":"2499"},
    contactInfo: {
      website: '/ai-services/ai-fraud-detection-real-time',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🛡️',
    href: '/services/ai-fraud-detection-real-time',
    category: 'ai'
  }
,
{
    id: 'ai-gen-app-dev-1',
    title: 'AI-Powered Application Development',
    description: 'End-to-end development service for building production-ready AI applications — from LLM-powered chatbots and RAG systems to multi-agent workflows and AI-native products.',
    features: [
      'LLM application architecture and design',
      'RAG (Retrieval-Augmented Generation) implementation',
      'Multi-agent system design and orchestration (LangChain, LangGraph, CrewAI)',
      'Vector database selection and optimization (Pinecone, Weaviate, Qdrant)',
      'Prompt engineering and fine-tuning workflows',
      'AI safety, guardrails, and output validation',
      'Scalable deployment with cost optimization',
      'Evaluation frameworks and A/B testing for AI outputs',
    ],
    benefits: [
      'Go from idea to production AI app in weeks, not months',
      'Leverage the latest LLM advances without the R&D burden',
      'Build AI features that scale to millions of users',
      'Reduce hallucinations and improve accuracy with RAG',
    ],
    pricing: {
      basic: '$4,999/mo',
      pro: '$14,999/mo',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/ai-gen-app-dev-1',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🧠',
    href: '/services/ai-gen-app-dev-1',
    category: 'ai'
  },
  {
    id: 'ai-grant-matcher',
    title: 'AI Grant & Funding Opportunity Matcher',
    description: 'AI scans 50,000+ government, foundation, and corporate grant opportunities. Matches your organisation profile and auto-drafts tailored proposals in minutes.',
    features: [
      '50,000+ opportunity database',
      'Auto-draft tailored proposals',
      'Deadline and eligibility tracker',
      'Submission pipeline dashboard',
      'Grant success analytics',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$399',
      pro: '$798',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-grant-matcher',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '💰',
    href: '/services/ai-grant-matcher',
    category: 'ai',
  }
,
{
    id: 'ai-hr-assistant',
    title: 'AI HR Assistant',
    description: 'Intelligent HR automation for recruitment, onboarding, employee engagement, and policy Q&A using conversational AI.',
    features: [
      'AI resume screening & ranking',
      'Automated interview scheduling',
      'Employee onboarding chatbot',
      'Policy Q&A knowledge base',
      'Engagement & sentiment tracking'
    ],
    benefits: [
      '70% faster hiring pipeline',
      'Reduced HR administrative load',
      'Improved candidate experience',
      'Better employee retention insights'
    ],
    pricing: {
      basic: '299',
      pro: '699',
      enterprise: '1599'
    },
    contactInfo: {
      website: '/ai-services/ai-hr-assistant',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '👥',
    href: '/services/ai-hr-assistant',
    category: 'ai'
  }
,
{
    id: 'ai-intelligent-routing',
    title: 'AI Intelligent Document Processing & Routing',
    description: 'Automated document intake with AI extraction, classification, and intelligent routing to the right team or workflow — invoices, claims, applications, and contracts.',
    features: ['OCR + AI document understanding (99.5% accuracy)', 'Intelligent document classification and tagging', 'Automated data extraction to structured formats', 'Smart routing to teams based on content', 'Integration with RPA for downstream automation'],
    benefits: ['Eliminate 90% of manual data entry', 'Reduce document processing time from hours to seconds', 'Improve data accuracy and compliance', 'Seamless integration with existing ERP/CRM'],
    pricing: { basic: '349', pro: '799', enterprise: '1799' },
    contactInfo: { website: '/ai-services/ai-intelligent-routing', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📋',
    href: '/services/ai-intelligent-routing',
    category: 'ai'
  },
  {
    id: 'ai-job-description-kit',
    title: 'AI Job Description & Interview Kit',
    description: 'Create bias-free, inclusive job descriptions tailored to your role. Auto-generate scoring rubrics and EEOC/ADA compliant interview questions.',
    features: [
      'Bias detection and inclusive language',
      'Interview question generator with rubrics',
      'Role and level templates',
      'ATS-ready export',
      'EEOC and ADA compliance check',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$99',
      pro: '$198',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-job-description-kit',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '📋',
    href: '/services/ai-job-description-kit',
    category: 'ai',
  }
,
{
    id: 'ai-knowledge-base-agent',
    title: 'AI Knowledge Base & Knowledge Graph Agent',
    description: 'Turn your documents, wikis, and internal data into an intelligent, queryable knowledge graph with conversational AI search and automated content synchronization.',
    features: [
      'Multi-source document ingestion (PDF, DOC, Confluence, Notion)',
      'Semantic search with natural language queries',
      'Automated knowledge graph construction',
      'Answer citation & source linking',
      'Real-time sync with source systems'
    ],
    benefits: [
      'Cut research time by 80%',
      'Eliminate knowledge silos',
      'Onboard new hires 3x faster',
      'Maintain a single source of truth'
    ],
    pricing: {
      basic: '299',
      pro: '699',
      enterprise: '1999'
    },
    contactInfo: {
      website: '/ai-services/ai-knowledge-base-agent',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📚',
    href: '/services/ai-knowledge-base-agent',
    category: 'ai'
  }
,
{
    id: 'ai-knowledge-graph-builder',
    title: 'Knowledge Graph Builder',
    description: `Automatically structure unstructured data into queryable knowledge graph. Entity extraction, relationship mapping, semantic search.`,
    features: ["Entity extraction (NER)", "Relationship inference", "Semantic search", "Graph visualization", "REST API + GraphQL"],
    benefits: ["Find any fact in seconds", "Surface hidden connections", "Power AI agents with your data"],
    pricing: {"basic":"199","pro":"499","enterprise":"1299"},
    contactInfo: {
      website: '/ai-services/ai-knowledge-graph-builder',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🕸️',
    href: '/services/ai-knowledge-graph-builder',
    category: 'ai'
  }
,
{
    id: 'ai-knowledge-management',
    title: 'AI Knowledge Management',
    description: 'Centralize organizational knowledge with AI-powered semantic search, auto-tagging, content gap detection, and intelligent Q&A across your document corpus.',
    features: ['Semantic search across all documents', 'Auto-tagging & intelligent categorization', 'Knowledge gap detection', 'AI Q&A over internal documents', 'Content lifecycle & freshness monitoring'],
    benefits: ['Reduce time-to-information by 75%', 'Eliminate duplicate content creation', 'Preserve institutional knowledge', 'Automated freshness alerts'],
    pricing: { basic: '199', pro: '499', enterprise: '1199' },
    contactInfo: { website: '/ai-services/ai-knowledge-management', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🧠',
    href: '/services/ai-knowledge-management',
    popular: true,
    category: 'ai'
  },
  {
    id: 'ai-lead-enricher',
    title: 'AI Lead Richness Scorer & Enricher',
    description: 'Score every inbound and outbound lead on fit, intent, and priority. Auto-enrich records with 50+ data providers including LinkedIn, Crunchbase, and Clearbit.',
    features: [
      'Fit and intent scoring model',
      '50+ data provider enrichment',
      'CRM native sync Salesforce and HubSpot',
      'Priority queue routing',
      'Enrichment history audit trail',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$249',
      pro: '$498',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-lead-enricher',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '🔍',
    href: '/services/ai-lead-enricher',
    category: 'ai',
  }
,
{
    id: 'ai-lead-generation',
    title: 'AI Lead Generation & Enrichment',
    description: 'Automatically discover, qualify, and enrich B2B leads with web scraping, firmographic scoring, and intent signal detection.',
    features: ['Automated lead discovery from public sources', 'Firmographic enrichment — revenue, tech stack, contacts', 'Intent signal — hiring, mentions, website visits', 'CRM auto-sync to Salesforce, HubSpot, Pipedrive', 'Personalized outreach — email, LinkedIn, sequences', 'ML-powered lead quality scoring and ranking'],
    benefits: ['5x more qualified leads per month', 'Save 15 hours/week on enrichment', 'Intent targeting increases conversion 3x', 'Seamless CRM integration', 'ML-powered scoring models', 'Personalized outreach at scale'],
    pricing: { basic: '149', pro: '449', enterprise: '999' },
    contactInfo: { website: '/ai-services/ai-lead-generation', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎯',
    href: '/services/ai-lead-generation',
    popular: true,
    category: 'ai'
  }
,
{
    id: 'ai-legal-contract-redaction',
    title: 'AI Legal Contract Redaction',
    description: `Automatically redacts PII, trade secrets, and privileged information from legal documents before sharing or discovery.`,
    features: ["Entity recognition (PII, PHI, PCI)", "Custom redaction rules per jurisdiction", "Audit trail of redactions", "Secure workspace with encryption"],
    benefits: ["Prevents data leaks during M&A", "Speeds up e-discovery", "Ensures GDPR/CCPA compliance"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/ai-services/ai-legal-contract-redaction',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔒',
    href: '/services/ai-legal-contract-redaction',
    category: 'ai'
  }
,
{
    id: 'ai-legal-doc-review',
    title: 'AI Legal Document Review',
    description: 'Accelerate legal document analysis with AI: extract clauses, flag risks, summarize contracts, and generate due diligence reports in minutes.',
    features: [
      'Contract clause extraction & classification',
      'Risk flagging & compliance checking',
      'Document summarization (NLP)',
      'Due diligence report generation',
      'Multi-language support (20+ languages)'
    ],
    benefits: [
      '90% faster document review',
      'Reduce missed clauses by 95%',
      'Lower outside counsel spend',
      'Standardize review across matters'
    ],
    pricing: {
      basic: '399',
      pro: '899',
      enterprise: '2499'
    },
    contactInfo: {
      website: '/ai-services/ai-legal-doc-review',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '⚖️',
    href: '/services/ai-legal-doc-review',
    category: 'ai'
  }
,
{
    id: 'ai-legal-document-analysis',
    title: 'AI Legal Document Analysis & Contract Review',
    description: 'Automated legal document review, clause extraction, risk assessment, and contract comparison powered by advanced NLP trained on legal corpora.',
    features: ['Intelligent clause extraction and classification', 'Risk scoring and compliance flagging', 'Contract comparison and gap analysis', 'Legal precedent research automation', 'Multi-language contract processing'],
    benefits: ['Reduce legal review time by 80%', 'Catch hidden risks before signing', 'Standardize contract terminology', 'Accelerate M&A due diligence'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-legal-doc-analysis', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⚖️',
    href: '/services/ai-legal-document-analysis',
    category: 'ai'
  }
,
{
    id: 'ai-marketing-copy-generator',
    title: 'AI Marketing Copy Generator',
    description: 'Generate high-converting ad copy, email campaigns, social posts, and landing page content in your brand voice across 30+ languages.',
    features: [
      'Brand voice training & style guide adherence',
      'A/B variant generation',
      'SEO-optimized blog & ad copy',
      'Social media captions, hashtags',
      'Image-to-caption & video-to-description'
    ],
    benefits: [
      'Produce 50x content variations instantly',
      'Maintain consistent brand voice',
      'Reduce copywriter dependency',
      'Global reach with native-language copy'
    ],
    pricing: {
      basic: '199',
      pro: '499',
      enterprise: '1399'
    },
    contactInfo: {
      website: '/ai-services/ai-marketing-copy-generator',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '✍️',
    href: '/services/ai-marketing-copy-generator',
    category: 'ai'
  }
,
{
    id: 'ai-media-monitoring',
    title: 'AI Media & News Monitoring',
    description: `Tracks global news, podcasts, and video transcripts for brand mentions, sentiment shifts, and crisis signals in real time.`,
    features: ["100K+ sources monitored", "Multilingual sentiment", "Trending topic detection", "Custom keyword & competitor alerts"],
    benefits: ["Early crisis detection", "Measure PR campaign reach", "Identify influencer opportunities"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/ai-services/ai-media-monitoring',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📰',
    href: '/services/ai-media-monitoring',
    category: 'ai'
  }
,
{
    id: 'ai-medical-imaging',
    title: 'AI Medical Imaging & Diagnostics',
    description: 'FDA-ready AI diagnostic support for radiology, pathology, and dermatology — detect anomalies, prioritize cases, and assist radiologists with second-opinion AI.',
    features: ['Deep learning anomaly detection in X-rays, CT, MRI', 'Pathology slide analysis and classification', 'Dermatological lesion assessment', 'Triage and workload prioritization', 'HIPAA-compliant deployment with audit trails'],
    benefits: ['Reduce diagnostic errors by 40%', 'Prioritize critical cases automatically', 'Extend specialist reach to underserved areas', 'Seamless PACS/EHR integration'],
    pricing: { basic: '999', pro: '2499', enterprise: '5999' },
    contactInfo: { website: '/ai-services/ai-medical-imaging', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🏥',
    href: '/services/ai-medical-imaging',
    category: 'ai'
  },
  {
    id: 'ai-meeting-notes-summary',
    title: 'AI Meeting Notes & Summary Platform',
    description: 'Auto-record, transcribe, and summarise every meeting with action items, decisions, and speaker attribution. Integrates with Zoom, Teams, Google Meet, and Slack.',
    features: [
      'Real-time transcription with speaker diarisation',
      'Action item and decision extraction',
      'Multi-platform calendar sync',
      'Shareable branded summary packs',
      'Slack and email distribution',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$349',
      pro: '$698',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-meeting-notes-summary',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '🤖',
    href: '/services/ai-meeting-notes-summary',
    category: 'ai',
  },
  {
    id: 'ai-meeting-preread',
    title: 'AI Meeting Pre-read Generator',
    description: 'AI analyses your calendar, gathers Slack threads and CRM context, then auto-generates a structured meeting pre-read with agenda, talking points, and decision log.',
    features: [
      'Auto-agenda from calendar invite',
      'Context assembly from Slack/CRM',
      'Decision log and action tracker',
      'Stakeholder routing by role',
      'Brand template for pre-reads',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$149',
      pro: '$298',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-meeting-preread',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '📑',
    href: '/services/ai-meeting-preread',
    category: 'ai',
  }
,
{
    id: 'ai-mental-health-chatbot',
    title: 'AI Mental Health Companion',
    description: `Empathetic, HIPAA-compliant chatbot providing CBT-based support, mood tracking, and crisis escalation to licensed professionals.`,
    features: ["Mood journal with trends", "Personalized coping strategies", "Crisis keyword detection to human handoff", "Weekly mental health reports"],
    benefits: ["24/7 anonymous support", "Reduces therapy wait times", "Scalable early intervention"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/ai-services/ai-mental-health-chatbot',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🧠',
    href: '/services/ai-mental-health-chatbot',
    category: 'ai'
  },
  {
    id: 'ai-newsletter-engagement',
    title: 'AI Newsletter Engagement Analyser',
    description: 'Deep analytics for email newsletters: which topics drive opens, optimal send times, subscriber churn prediction, and A/B headline wire-frame suggestions.',
    features: [
      'Open-rate and click prediction',
      'Churn alerting by subscriber cohort',
      'Topic performance clustering',
      'A/B headline suggestion engine',
      'Subscriber segmentation builder',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$129',
      pro: '$258',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-newsletter-engagement',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '📧',
    href: '/services/ai-newsletter-engagement',
    category: 'ai',
  }
,
{
    id: 'ai-personalization-engine',
    title: 'AI Personalization & Recommendation Engine',
    description: 'Real-time personalization for websites, apps, and e-commerce — dynamic content, product recommendations, pricing, and messaging tailored to each visitor.',
    features: ['Real-time visitor behavior tracking and profiling', 'Dynamic content serving based on user segments', 'Cross-channel personalized messaging', 'AI-powered product recommendation engine', 'A/B/n testing with multi-armed bandit optimization', 'Revenue attribution and ROI measurement'],
    benefits: ['Increase conversion rates by 35-50%', 'Personalize every visitor experience in real time', 'Optimize product discovery for e-commerce', 'Measure personalization ROI with attribution modeling'],
    pricing: { basic: '349', pro: '799', enterprise: '1899' },
    contactInfo: { website: '/ai-services/ai-personalization-engine', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '✨',
    href: '/services/ai-personalization-engine',
    category: 'ai'
  }
,
{
    id: 'ai-personalized-learning',
    title: 'AI Personalized Learning Platform',
    description: 'Adaptive learning paths powered by AI: skill gap analysis, micro-lesson generation, progress tracking, and competency-based assessments.',
    features: [
      'Skill assessment & gap analysis',
      'Personalized learning path generation',
      'Auto-generated micro-lessons (5–10 min)',
      'Progress analytics & leaderboards',
      'Integration with LMS (SCORM, xAPI)'
    ],
    benefits: [
      'Increase training completion rates by 60%',
      'Reduce training development time by 80%',
      'Personalize at scale for 1000s of employees',
      'Maintain compliance certifications'
    ],
    pricing: {
      basic: '299',
      pro: '799',
      enterprise: '2499'
    },
    contactInfo: {
      website: '/ai-services/ai-personalized-learning',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🎓',
    href: '/services/ai-personalized-learning',
    category: 'ai'
  },
  {
    id: 'ai-post-purchase-care',
    title: 'AI Post-Purchase Customer Care Agent',
    description: 'Proactive post-purchase support agent that monitors order status, delivery delays, and product issues — resolving 80% of cases before human escalation.',
    features: [
      'Order and shipment tracking',
      'Proactive outreach on delays',
      'RMA and return automation',
      'Self-service resolution portal',
      'SLA monitoring and alerting',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$349',
      pro: '$698',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-post-purchase-care',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '🛒',
    href: '/services/ai-post-purchase-care',
    category: 'ai',
  }
,
{
     id: 'ai-powered-incident-postmortem',
     title: 'AI-Powered Incident Postmortem Generator',
     description: 'Automatically generate blameless postmortem reports from incident data: timeline reconstruction, root cause hypothesis, action items, and status tracking.',
     features: [
       'Timeline assembly from logs/metrics/alerts',
       'Root cause inference via causal graph',
       'Impact quantification (users, revenue, SLA)',
       'Auto-generated action items with owners',
       'Follow-up tracking & closure verification'
     ],
     benefits: [
       'Write postmortems in 10 minutes vs. hours',
       'Consistent structure & quality across teams',
       'Identify systemic issues faster',
       'Improve reliability documentation'
     ],
     pricing: { basic: '299', pro: '699', enterprise: '1999' },
     contactInfo: { website: '/ai-services/ai-powered-incident-postmortem', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '📝',
     href: '/services/ai-powered-incident-postmortem',
     category: 'ai'
   }
,
{
     id: 'ai-powered-log-anomaly-detection',
     title: 'AI-Powered Log Anomaly Detection',
     description: 'Automatically detect unusual patterns, spikes, and errors in logs using unsupervised ML; reduce alert fatigue and surface issues before they cause outages.',
     features: [
       'Unsupervised clustering of log events',
       'Real-time anomaly scoring per time-series',
       'Seamless integration with ELK/Prometheus',
       'Alert suppression & correlation',
       'Root-cause hinting via pattern matching'
     ],
     benefits: [
       'Detect incidents 30+ minutes before monitoring',
       'Reduce false positive alerts by 80%',
       'Shorten MTTR with actionable insights',
       'Discover silent failures & edge cases'
     ],
     pricing: { basic: '299', pro: '699', enterprise: '1899' },
     contactInfo: { website: '/ai-services/ai-powered-log-anomaly-detection', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '📈',
     href: '/services/ai-powered-log-anomaly-detection',
     category: 'ai'
   }
,
{
     id: 'ai-powered-passwordless-auth',
     title: 'AI-Powered Passwordless Authentication',
     description: 'Behavioral biometrics & risk-based authentication: continuous fraud detection using device fingerprinting, typing patterns, and anomaly detection without passwords.',
     features: [
       'Behavioral biometrics (keystroke dynamics, mouse movements)',
       'Device & location risk scoring',
       'Step-up authentication for anomalies',
       'FIDO2/WebAuthn integration',
       'Compliance: NIST 800-63B, PSD2 SCA'
     ],
     benefits: [
       'Eliminate phishing & password fatigue',
       'Reduce authentication friction for users',
       'Meet modern security standards without complexity',
       'Lower support cost for password resets'
     ],
     pricing: { basic: '299', pro: '799', enterprise: '2499' },
     contactInfo: { website: '/ai-services/ai-powered-passwordless-auth', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '🔑',
     href: '/services/ai-powered-passwordless-auth',
     category: 'ai'
   }
,
{
     id: 'ai-powered-pr-drafting',
     title: 'AI-Powered PR Drafting & Description',
     description: 'Automatically generate PR titles, descriptions, and changelog entries from commit history and diff analysis; link to JIRA tickets and update documentation.',
     features: [
       'Intelligent diff summarization',
       'JIRA/GitHub issue linking & status updates',
       'Changelog entry drafting per semantic version',
       'Reviewer recommendation based on ownership',
       'Auto-update of API docs & README diffs'
     ],
     benefits: [
       'Consistent, high-quality PR descriptions',
       'Save 15+ minutes per PR on documentation',
       'Keep changelogs and releases up-to-date',
       'Improve code review context and velocity'
     ],
     pricing: { basic: '0', pro: '99', enterprise: '399' },
     contactInfo: { website: '/ai-services/ai-powered-pr-drafting', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '📦',
     href: '/services/ai-powered-pr-drafting',
     category: 'ai'
   }
,
{
     id: 'ai-powered-question-answering',
     title: 'Enterprise AI Question Answering (Internal Knowledge)',
     description: 'Chatbot that answers employee questions from internal docs: HR policies, engineering runbooks, sales playbooks; cite sources, track unanswered queries.',
     features: [
       'RAG over private document corpus',
       'Source citation & confidence scores',
       'Multi-department bots (HR, Eng, Sales, Support)',
       'Feedback loop to improve answers',
       'Analytics: most-asked questions, gaps in docs'
     ],
     benefits: [
       'Reduce internal support tickets by 50%',
       'Onboard new hires instantly with accurate answers',
       'Keep institutional knowledge accessible',
       'Identify undocumented processes'
     ],
     pricing: { basic: '299', pro: '799', enterprise: '2299' },
     contactInfo: { website: '/ai-services/ai-powered-question-answering', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '💬',
     href: '/services/ai-powered-question-answering',
     category: 'ai'
   }
,
{
     id: 'ai-powered-seo-optimizer',
     title: 'AI-Powered SEO Content Optimizer',
     description: 'Real-time SEO analysis and content optimization: auto-suggest keywords, restructure sentences for readability, generate meta tags, and audit for E-E-A-T signals.',
     features: [
       'On-page SEO scoring (0-100)',
       'Competitor gap analysis',
       'Automated meta title/description generation',
       'Readability improvement suggestions',
       'Schema.org structured data suggestions'
     ],
     benefits: [
       'Increase organic traffic by 40% within 3 months',
       'Outrank competitors on target keywords',
       'Ensure Google E-E-A-T compliance',
       'Automate technical SEO fixes'
     ],
     pricing: { basic: '99', pro: '299', enterprise: '999' },
     contactInfo: { website: '/ai-services/ai-powered-seo-optimizer', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '🔍',
     href: '/services/ai-powered-seo-optimizer',
     category: 'ai'
   }
,
{
     id: 'ai-powered-tech-debt-quantifier',
     title: 'AI-Powered Tech Debt Quantifier',
     description: 'Automatically identify, classify, and quantify technical debt: code complexity, duplication, outdated deps, test gaps, and architectural violations with remediation cost estimates.',
     features: [
       'Static code analysis + complexity heatmaps',
       'Dependency vulnerability & EOL detection',
       'Duplicate code detection with CloneDR',
       'Architecture rule validation (dependency cycles)',
       'Remediation effort estimation (person-days)'
     ],
     benefits: [
       'Make tech debt visible to leadership',
       'Prioritize refactoring by cost vs. risk',
       'Justify modernization budgets with data',
       'Track debt reduction over time'
     ],
     pricing: { basic: '299', pro: '799', enterprise: '2399' },
     contactInfo: { website: '/ai-services/ai-powered-tech-debt-quantifier', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '🗑️',
     href: '/services/ai-powered-tech-debt-quantifier',
     category: 'ai'
   }
,
{
     id: 'ai-powered-test-generation',
     title: 'AI-Powered Test Suite Generator',
     description: 'Automatically generate comprehensive unit, integration, and E2E tests from code, requirements, or user stories with high coverage and maintainability.',
     features: [
       'White-box test generation from source code',
       'Black-box tests from BDD/Gherkin specs',
       'E2E test generation via Puppeteer/Playwright',
       'Coverage gap analysis & prioritizing',
       'Test flake detection & stabilization'
     ],
     benefits: [
       'Achieve 80%+ code coverage automatically',
       'Ship features faster without manual test writing',
       'Catch regressions before production',
       'Reduce QA manual testing effort by 90%'
     ],
     pricing: { basic: '0', pro: '199', enterprise: '799' },
     contactInfo: { website: '/ai-services/ai-powered-test-generation', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '🧪',
     href: '/services/ai-powered-test-generation',
     category: 'ai'
   }
,
{
     id: 'ai-powered-ui-generator',
     title: 'AI-Powered UI Generator (Text-to-UI)',
     description: 'Turn natural language descriptions into production-ready React/Next.js components with Tailwind styling; customize variants, states, and accessibility attributes via chat.',
     features: [
       'Natural language to JSX/TSX component generation',
       'Tailwind CSS class application',
       'Responsive breakpoint handling',
       'A11y attributes (aria-* roles & labels)',
       'Export to Figma/Storybook format'
     ],
     benefits: [
       'Ship UI 10x faster',
       'Maintain design consistency automatically',
       'Reduce frontend dev iteration cycles',
       'Prototypes in minutes, not days'
     ],
     pricing: { basic: '0', pro: '149', enterprise: '699' },
     contactInfo: { website: '/ai-services/ai-powered-ui-generator', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '🎨',
     href: '/services/ai-powered-ui-generator',
     category: 'ai'
   }
,
  {
    id: 'ai-prd-story-gen',
    title: 'AI PRD & User Story Generator',
    description: 'Transform vague feature requests into comprehensive Product Requirements Documents with acceptance criteria, user flows, and ready-for-engineering technical specs.',
    features: [
      'Auto-PRD first-draft generator',
      'User story with acceptance criteria boilerplate',
      'Mermaid user-flow diagrams',
      'Development effort estimation',
      'Notion and Linear one-click sync',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$299',
      pro: '$598',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-prd-story-gen',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '📐',
    href: '/services/ai-prd-story-gen',
    category: 'ai',
  }
,
{
    id: 'ai-predictive-maintenance',
    title: 'AI Predictive Maintenance & Asset Monitoring',
    description: 'IoT-enabled predictive maintenance that monitors equipment health in real time, predicts failures before they happen, and optimizes maintenance schedules to reduce downtime.',
    features: ['IoT sensor data ingestion & real-time monitoring', 'ML-based remaining useful life (RUL) prediction', 'Anomaly detection for early fault signatures', 'Automated maintenance scheduling & work order generation', 'Fleet-wide asset health dashboards', 'Integration with CMMS, SAP, and ERP systems'],
    benefits: ['Reduce unplanned downtime by 40-60%', 'Extend equipment lifespan by 20-30%', 'Cut maintenance costs by 25% through optimization', 'Eliminate expensive emergency repairs'],
    pricing: { basic: '499', pro: '1199', enterprise: '2799' },
    contactInfo: { website: '/ai-services/ai-predictive-maintenance', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⚙️',
    href: '/services/ai-predictive-maintenance',
    category: 'ai'
  }
,
{
    id: 'ai-predictive-maintenance-factory',
    title: 'Predictive Maintenance for Manufacturing',
    description: `IoT sensor fusion + ML to predict equipment failures 7–30 days in advance. Reduces downtime by 50%, extends asset life.`,
    features: ["Vibration & thermal analysis", "Failure mode classification", "Maintenance scheduling", "Parts inventory forecasting", "OEE dashboards"],
    benefits: ["Avoid unplanned downtime", "Extend equipment lifespan", "Optimize maintenance crew"],
    pricing: {"basic":"499","pro":"1099","enterprise":"2999"},
    contactInfo: {
      website: '/ai-services/ai-predictive-maintenance-factory',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🏭',
    href: '/services/ai-predictive-maintenance-factory',
    category: 'ai'
  }
,
{
    id: 'ai-predictive-workforce-planning',
    title: 'AI Predictive Workforce Planning',
    description: 'Forecast hiring needs, optimize team composition, and predict attrition risk with AI-powered HR analytics and workforce modeling.',
    features: ['Attrition risk prediction', 'Skills gap analysis', 'Optimal team composition', 'Seasonal demand forecasting', 'Succession planning guidance'],
    benefits: ['Reduce unplanned turnover by 35%', 'Optimize hiring budget allocation', 'Build resilient teams', 'Accelerate strategic planning'],
    pricing: { basic: '599', pro: '1299', enterprise: '3499' },
    contactInfo: { website: '/ai-services/ai-predictive-workforce-planning', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '👥',
    href: '/services/ai-predictive-workforce-planning',
    category: 'ai'
  }
,
{
    id: 'ai-presentation-maker',
    title: 'AI Presentation & Pitch Deck Maker',
    description: 'Generate polished presentations, pitch decks, and reports from outlines with data visualization, templates, and speaker notes.',
    features: ['Document-to-slide conversion from any file', 'Smart data visualization — auto charts, graphs', 'AI-generated speaker notes and timing cues', 'Brand-consistent — apply company guidelines', 'Multi-format export — PowerPoint, Google Slides, PDF', 'Real-time collaboration with team editing'],
    benefits: ['Create presentations 10x faster', 'Professional design without designers', 'Data-driven visualizations', 'Brand consistency across teams', 'Speaker notes automatically included', 'Multi-format export options'],
    pricing: { basic: '39', pro: '129', enterprise: '349' },
    contactInfo: { website: '/ai-services/ai-presentation-maker', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📊',
    href: '/services/ai-presentation-maker',
    category: 'ai'
  }
,
{
    id: 'ai-realtime-translation',
    title: 'Real-Time Translation Engine',
    description: `Sub-200ms speech-to-text and text-to-speech translation across 70+ languages with dialect preservation.`,
    features: ["70+ languages & dialects", "Sub-200ms latency", "Speaker diarization", "Custom glossary per client", "REST + WebSocket APIs"],
    benefits: ["Break language barriers in global meetings", "Instant customer support in any language", "Reduce translation costs by 90%"],
    pricing: {"basic":"149","pro":"399","enterprise":"999"},
    contactInfo: {
      website: '/ai-services/ai-realtime-translation',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🌐',
    href: '/services/ai-realtime-translation',
    category: 'ai'
  }
,
{
    id: 'ai-regulatory-compliance-monitor',
    title: 'AI Regulatory Compliance Monitor',
    description: 'Continuous regulatory change monitoring across 150+ jurisdictions with automated impact analysis, gap detection, and compliance report generation for financial services and healthcare.',
    features: ['150+ jurisdiction regulatory change tracking', 'AI-powered impact analysis on existing operations', 'Automated compliance gap detection', 'Real-time deadline and filing alerts', 'Audit-ready evidence collection', 'Integration with GRC platforms'],
    benefits: ['Never miss a regulatory deadline again', 'Reduce compliance research time by 90%', 'Automated reporting for SOC 2, HIPAA, GDPR', 'Proactive risk mitigation before violations occur'],
    pricing: { basic: '699', pro: '1599', enterprise: '3999' },
    contactInfo: { website: '/ai-services/ai-regulatory-compliance', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📜',
    href: '/services/ai-regulatory-compliance-monitor',
    category: 'ai'
  }
,
{
    id: 'ai-retail-recommendation-engine',
    title: 'AI Retail Recommendation Engine',
    description: `Product recommendation engine for e-commerce that increases AOV by 15–25% using collaborative filtering, basket analysis, and real-time behavior.`,
    features: ["Real-time personalization", "A/B testing built-in", "Cross-sell & upsell suggestions", "Seasonal trend integration"],
    benefits: ["Boosts average order value", "Reduces cart abandonment", "Increases customer LTV"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/ai-services/ai-retail-recommendation-engine',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🛒',
    href: '/services/ai-retail-recommendation-engine',
    category: 'ai'
  }
,
{
    id: 'ai-revenue-ops',
    title: 'AI Revenue Operations (RevOps)',
    description: 'Unify sales, marketing, and customer success data with AI-driven attribution, forecasting, and go-to-market (GTM) optimization.',
    features: [
      'Cross-channel attribution modeling',
      'Pipeline health scoring & prediction',
      'Customer churn prediction',
      'GTM motion analysis & recommendation',
      'Integration with Salesforce, HubSpot, Marketo'
    ],
    benefits: [
      'Increase forecast accuracy to >95%',
      'Identify at-risk accounts early',
      'Optimize marketing spend allocation',
      'Align GTM teams on one data source'
    ],
    pricing: {
      basic: '799',
      pro: '1699',
      enterprise: '4599'
    },
    contactInfo: {
      website: '/ai-services/ai-revenue-ops',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📈',
    href: '/services/ai-revenue-ops',
    category: 'ai'
  }
,
{
    id: 'ai-revenue-optimization',
    title: 'AI Revenue Optimization & Pricing Intelligence',
    description: 'Dynamic pricing engine powered by machine learning — analyze competitor pricing, demand elasticity, customer segments, and market conditions to maximize revenue in real time.',
    features: ['ML-driven dynamic pricing models', 'Competitor price monitoring & alerts', 'Customer segment willingness-to-pay analysis', 'Demand forecasting & inventory alignment', 'A/B price testing & revenue attribution', 'Multi-channel price synchronization'],
    benefits: ['Increase revenue by 15-30% through optimized pricing', 'Reduce price-setting time from weeks to minutes', 'Real-time competitor price intelligence', 'Data-driven pricing decisions across all channels'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-revenue-optimization', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📈',
    href: '/services/ai-revenue-optimization',
    category: 'ai'
  }
,
{
    id: 'ai-revenue-optimizer',
    title: 'Revenue Optimization Engine',
    description: `AI-driven pricing, upsell recommendations, and churn prediction. Analyzes customer behavior, market trends to maximize LTV.`,
    features: ["Dynamic pricing engine", "Churn prediction (90-day)", "Upsell recommendations", "Cohort analysis", "Revenue attribution"],
    benefits: ["Increase revenue 15\u201325%", "Reduce churn by 30%", "Price optimally"],
    pricing: {"basic":"349","pro":"799","enterprise":"2199"},
    contactInfo: {
      website: '/ai-services/ai-revenue-optimizer',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '💰',
    href: '/services/ai-revenue-optimizer',
    category: 'ai'
  }
,
{
    id: 'ai-robotics-integration',
    title: 'AI Robotics Integration & Autonomous Systems',
    description: 'AI integration for industrial and commercial robotics — computer vision navigation, autonomous task planning, human-robot collaboration, and fleet management.',
    features: ['Computer vision for robot navigation and obstacle avoidance', 'Autonomous task planning with reinforcement learning', 'Human-robot collaboration and safety monitoring', 'Multi-robot fleet management and coordination', 'Edge AI deployment for low-latency real-time control'],
    benefits: ['Automate complex physical workflows with AI robotics', 'Improve workplace safety with intelligent monitoring', 'Scale robot fleet operations without proportional overhead', 'Reduce cycle times by 40% with autonomous optimization'],
    pricing: { basic: '1499', pro: '3499', enterprise: '7999' },
    contactInfo: { website: '/ai-services/ai-robotics-integration', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🤖',
    href: '/services/ai-robotics-integration',
    category: 'ai'
  }
,
{
    id: 'ai-sales-intelligence',
    title: 'AI Sales Intelligence',
    description: 'Boost revenue with AI-driven lead scoring, pipeline prediction, deal insights, and automated outreach sequencing.',
    features: [
      'Predictive lead scoring (0-100)',
      'Sales pipeline forecasting',
      'Deal risk detection & alerts',
      'Automated email sequences',
      'Competitive intelligence briefs'
    ],
    benefits: [
      'Higher conversion rates',
      'Shorter sales cycles',
      'Data-driven deal prioritization',
      'Revenue forecasting accuracy'
    ],
    pricing: {
      basic: '399',
      pro: '799',
      enterprise: '1999'
    },
    contactInfo: {
      website: '/ai-services/ai-sales-intelligence',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📈',
    href: '/services/ai-sales-intelligence',
    popular: true,
    category: 'ai'
  }
,
{
    id: 'ai-sentiment-analysis',
    title: 'AI Sentiment Analysis & Brand Monitoring',
    description: 'Real-time brand perception tracking across social media, reviews, news, and forums. Understand customer emotion at scale and act on insights before they become crises.',
    features: ['Multi-platform social listening (X, Reddit, TikTok, news)', 'Emotion-level sentiment scoring (joy, anger, fear, trust)', 'Brand mention clustering & trending topic detection', 'Influencer identification & partnership scoring', 'Crisis early-warning system with alert triage', 'Competitor sentiment benchmarking & gap analysis'],
    benefits: ['Identify PR crises 2-3 days before mainstream pickup', 'Quantify brand health with actionable metrics', 'Discover micro-influencers in your niche organically', 'Competitor sentiment intelligence for positioning'],
    pricing: { basic: '349', pro: '799', enterprise: '1899' },
    contactInfo: { website: '/ai-services/ai-sentiment-analysis', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💬',
    href: '/services/ai-sentiment-analysis',
    category: 'ai'
  }
,
{
    id: 'ai-seo-optimizer',
    title: 'AI SEO Content Optimizer',
    description: 'Real-time SEO analysis and content optimization: keyword suggestions, meta tag generation, readability scoring, and content gap analysis.',
    features: [
      'On-page SEO audit & recommendations',
      'Automated meta title & description generation',
      'Readability & grammar improvement',
      'Competitor content gap analysis',
      'Internal linking suggestions'
    ],
    benefits: [
      'Rank higher in search results',
      'Increase organic traffic by 40%',
      'Reduce content optimization time by 80%',
      'Stay ahead of algorithm updates'
    ],
    pricing: {
      basic: '199',
      pro: '499',
      enterprise: '1299'
    },
    contactInfo: {
      website: '/ai-services/ai-seo-optimizer',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔍',
    href: '/services/ai-seo-optimizer',
    category: 'ai'
  },
  {
    id: 'ai-social-scheduler',
    title: 'AI Social Scheduler & Content Composer',
    description: 'Generate, schedule, and analyse social posts across LinkedIn, X/Twitter, Instagram, and TikTok. AI suggests optimal posting times per audience segment.',
    features: [
      'Multi-platform publishing queue',
      'AI caption and hashtag writer',
      'Optimal timing engine per channel',
      'Engagement analytics dashboard',
      'A/B post variant testing',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$79',
      pro: '$158',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-social-scheduler',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '📱',
    href: '/services/ai-social-scheduler',
    category: 'ai',
  }
,
{
    id: 'ai-social-sentiment-tracker',
    title: 'Social Sentiment Tracker',
    description: `Monitor brand sentiment across Twitter, Reddit, news, forums in real-time. Crisis detection alerts before issues go viral.`,
    features: ["30+ data sources", "Sentiment scoring (-100 to +100)", "Crisis detection", "Influencer identification", "Competitor benchmark"],
    benefits: ["Protect brand reputation proactively", "Understand customer feelings", "Measure campaign impact"],
    pricing: {"basic":"199","pro":"499","enterprise":"1299"},
    contactInfo: {
      website: '/ai-services/ai-social-sentiment-tracker',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📢',
    href: '/services/ai-social-sentiment-tracker',
    category: 'ai'
  }
,
{
    id: 'ai-spatial-computing',
    title: 'AI Spatial Computing & AR/VR Analytics',
    description: 'AI-powered spatial computing platform for augmented and virtual reality experiences — 3D scene understanding, gesture recognition, and immersive analytics.',
    features: ['Real-time 3D scene reconstruction and understanding', 'AI-driven gesture and gaze tracking', 'Spatial audio processing and acoustic mapping', 'Immersive analytics dashboard creation', 'Cross-platform AR/VR deployment (Vision Pro, Quest, HoloLens)'],
    benefits: ['Create next-generation immersive experiences', 'Enable spatial data visualization for complex datasets', 'Reduce training costs with VR simulations', 'Bridge physical and digital workspaces'],
    pricing: { basic: '899', pro: '2199', enterprise: '4999' },
    contactInfo: { website: '/ai-services/ai-spatial-computing', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🥽',
    href: '/services/ai-spatial-computing',
    category: 'ai'
  }
,
{
    id: 'ai-speech-voice-solutions',
    title: 'AI Speech & Voice Solutions',
    description: 'Enterprise-grade speech technology including high-accuracy transcription, AI voice cloning, real-time translation, voice biometrics, and conversational AI for customer service.',
    features: ['99.2% accuracy speech-to-text in 60+ languages', 'Real-time voice translation for live meetings', 'Voice cloning for personalized brand audio content', 'Voice biometrics for secure identity verification', 'Conversational IVR with natural language understanding', 'Meeting transcription with speaker diarization & summaries'],
    benefits: ['Automate call center transcription at scale', 'Provide multilingual support without hiring translators', 'Secure authentication via voice fingerprinting', 'Create branded audio content with AI voice cloning'],
    pricing: { basic: '279', pro: '649', enterprise: '1599' },
    contactInfo: { website: '/ai-services/ai-speech-voice-solutions', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎙️',
    href: '/services/ai-speech-voice-solutions',
    category: 'ai'
  }
,
{
    id: 'ai-supply-chain',
    title: 'AI Supply Chain Optimization',
    description: 'Predictive demand forecasting, inventory optimization, and supplier risk management powered by machine learning.',
    features: [
      'Demand forecasting (ARIMA + ML)',
      'Inventory optimization & reorder points',
      'Supplier risk scoring & monitoring',
      'Logistics route optimization',
      'Real-time shipment tracking'
    ],
    benefits: [
      '30% reduction in inventory costs',
      'Improved demand forecast accuracy by 45%',
      'Proactive supplier risk mitigation',
      'Faster delivery times'
    ],
    pricing: {
      basic: '449',
      pro: '899',
      enterprise: '2199'
    },
    contactInfo: {
      website: '/ai-services/ai-supply-chain',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📦',
    href: '/services/ai-supply-chain',
    category: 'ai'
  }
,
{
    id: 'ai-supply-chain-intelligence',
    title: 'AI Supply Chain Intelligence',
    description: 'End-to-end supply chain visibility with predictive disruption alerts, multi-tier vendor risk scoring, and AI-driven cost optimization.',
    features: ['Real-time multi-tier visibility', 'Predictive disruption alerts', 'Vendor risk assessment', 'Cost optimization engine', 'Scenario simulation and planning'],
    benefits: ['Reduce disruption by 50%', 'Optimize inventory costs', 'Strengthen vendor relationships', 'Enable proactive planning'],
    pricing: { basic: '1299', pro: '2999', enterprise: '7999' },
    contactInfo: { website: '/ai-services/ai-supply-chain-intelligence', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔗',
    href: '/services/ai-supply-chain-intelligence',
    category: 'ai'
  }
,
{
    id: 'ai-supply-chain-optimizer',
    title: 'AI Supply Chain Optimization & Demand Forecasting',
    description: 'End-to-end supply chain intelligence with ML demand forecasting, inventory optimization, supplier risk scoring, and logistics route planning.',
    features: ['ML-powered demand forecasting at SKU level', 'Multi-echelon inventory optimization', 'Supplier risk intelligence and monitoring', 'Logistics route optimization with cost modeling', 'Carbon footprint tracking and reduction'],
    benefits: ['Reduce inventory carrying costs by 25%', 'Improve forecast accuracy by 35%', 'Prevent supply disruptions with early warnings', 'Optimize logistics spend across modes'],
    pricing: { basic: '699', pro: '1599', enterprise: '3499' },
    contactInfo: { website: '/ai-services/ai-supply-chain-optimizer', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📦',
    href: '/services/ai-supply-chain-optimizer',
    category: 'ai'
  }
,
{
    id: 'ai-supply-chain-predictor',
    title: 'AI Supply Chain Predictor',
    description: `Predicts supply chain disruptions 14–30 days in advance using multi-source data: weather, geopolitical events, shipping delays, and supplier health scores.`,
    features: ["Demand forecasting with 94% accuracy", "Alternative routing suggestions", "Supplier risk scoring", "Real-time anomaly alerts"],
    benefits: ["Reduces stockouts by 35%", "Cuts expedited shipping costs by 22%", "Improves supplier negotiation leverage"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/ai-services/ai-supply-chain-predictor',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🚢',
    href: '/services/ai-supply-chain-predictor',
    category: 'ai'
  }
,
{
    id: 'ai-supply-chain-visibility',
    title: 'AI Supply Chain Visibility Platform',
    description: 'End-to-end supply chain monitoring with AI-driven anomaly detection, predictive ETAs, and automated disruption alerts across suppliers, logistics, and inventory.',
    features: [
      'Real-time shipment tracking & ETA prediction',
      'Supplier risk scoring & early warning',
      'Inventory anomaly detection',
      'Automated disruption alerts (Slack/email)',
      'Root cause analysis & recommendation engine'
    ],
    benefits: [
      '85% on-time delivery improvement',
      '50% reduction in stockouts',
      '30% lower safety stock needs',
      'Proactive disruption mitigation'
    ],
    pricing: {
      basic: '549',
      pro: '1099',
      enterprise: '2799'
    },
    contactInfo: {
      website: '/ai-services/ai-supply-chain-visibility',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🚢',
    href: '/services/ai-supply-chain-visibility',
    category: 'ai'
  }
,
{
    id: 'ai-supply-demand-planner',
    title: 'AI Supply & Demand Planner',
    description: 'Demand forecasting, inventory optimization, and replenishment planning with AI-driven scenario modeling for manufacturing and retail.',
    features: [
      'Demand forecasting (SKU-level, multi-channel)',
      'Inventory optimization & safety stock calc',
      'Automatic purchase order suggestions',
      'What-if scenario modeling',
      'Supplier lead time prediction'
    ],
    benefits: [
      'Reduce stockouts by 60%',
      'Lower inventory carrying costs by 30%',
      ' Improve order fill rate to >98%',
      'Respond faster to demand shocks'
    ],
    pricing: {
      basic: '599',
      pro: '1299',
      enterprise: '3599'
    },
    contactInfo: {
      website: '/ai-services/ai-supply-demand-planner',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📦',
    href: '/services/ai-supply-demand-planner',
    category: 'ai'
  }
,
{
    id: 'ai-sustainability-carbon-tracker',
    title: 'AI Sustainability & Carbon Tracker',
    description: `Automatically calculates organizational carbon footprint from operational data (energy, travel, cloud usage) and suggests reduction strategies.`,
    features: ["Integration with AWS/GCP carbon APIs", "Travel emission estimation from calendars", "Supply chain scope 3 modeling", "Regulatory reporting templates (ESG)"],
    benefits: ["Achieve ESG reporting compliance", "Identify top emission sources", "Set science-based reduction targets"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/ai-services/ai-sustainability-carbon-tracker',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🌱',
    href: '/services/ai-sustainability-carbon-tracker',
    category: 'ai'
  }
,
{
     id: 'ai-sustainable-ops',
     title: 'AI for Sustainable Operations (Green AI)',
     description: 'Optimize compute & cloud resource usage to reduce carbon footprint: model carbon-aware scheduling, energy profiling, and sustainability reporting.',
     features: [
       'Carbon intensity forecasting per region',
       'Job scheduling to low-carbon time windows',
       'Resource right-sizing recommendations',
       'Sustainability KPI dashboards',
       'Compliance with ESG reporting standards'
     ],
     benefits: [
       'Reduce cloud carbon emissions by 40%',
       'Lower cost via energy optimization',
       'Meet corporate sustainability goals',
       'Public sustainability reporting for PR'
     ],
     pricing: { basic: '199', pro: '499', enterprise: '1499' },
     contactInfo: { website: '/ai-services/ai-sustainable-ops', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '🌱',
     href: '/services/ai-sustainable-ops',
     category: 'ai'
   }
,
{
    id: 'ai-talent-acquisition',
    title: 'AI Talent Acquisition & Hiring Intelligence',
    description: 'End-to-end AI recruiting platform — candidate sourcing, resume screening, bias-free scoring, interview scheduling, and predictive hiring success modeling.',
    features: ['Multi-platform AI candidate sourcing', 'Bias-free resume scoring & ranking', 'Automated interview scheduling & coordination', 'Predictive hiring success modeling', 'Competitor talent mapping & intelligence', 'DEI analytics & reporting dashboard'],
    benefits: ['Reduce time-to-hire by 60% with AI sourcing', 'Eliminate unconscious bias in screening', 'Predict candidate retention probability before hiring', 'Access passive candidates through intelligent mapping'],
    pricing: { basic: '449', pro: '999', enterprise: '2299' },
    contactInfo: { website: '/ai-services/ai-talent-acquisition', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎯',
    href: '/services/ai-talent-acquisition',
    category: 'ai'
  }
,
{
    id: 'ai-talent-acquisition-platform',
    title: 'AI Talent Acquisition Platform',
    description: `End-to-end recruiting: resume parsing, candidate matching, interview scheduling, bias detection. Integrates with Greenhouse, Lever.`,
    features: ["Resume parsing & scoring", "Candidate-job fit matching", "Automated interview scheduling", "Bias detection", "Offer management"],
    benefits: ["Hire 40% faster", "Reduce bias in hiring", "Improve candidate quality"],
    pricing: {"basic":"249","pro":"599","enterprise":"1499"},
    contactInfo: {
      website: '/ai-services/ai-talent-acquisition-platform',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '👥',
    href: '/services/ai-talent-acquisition-platform',
    category: 'ai'
  }
,
{
    id: 'ai-testing-qa',
    title: 'AI Testing & Quality Assurance',
    description: 'Automated test generation, visual regression testing, and AI-powered bug detection that adapts to your application code and learns from failures.',
    features: ['Auto-generated test cases from user journeys', 'Visual regression testing across browsers', 'AI bug detection with root-cause suggestions', 'Performance testing & bottleneck analysis', 'Self-healing test scripts'],
    benefits: ['Reduce QA effort by 70%', 'Catch regressions before production', 'Self-healing tests reduce maintenance', 'Cross-browser visual consistency'],
    pricing: { basic: '349', pro: '749', enterprise: '1799' },
    contactInfo: { website: '/ai-services/ai-testing-qa', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🧪',
    href: '/services/ai-testing-qa',
    category: 'ai'
  },
  {
    id: 'ai-training-data-platform',
    title: 'AI Training Data Platform',
    description: 'End-to-end data labeling, annotation, versioning, and quality validation platform for computer vision, NLP, and LLM fine-tuning datasets at any scale.',
    features: [
      'Labeling workforce + tools',
      'Active learning loop',
      'Dataset versioning',
      'Consensus / quality scoring',
      'Synthetic data generation'
    ],
    benefits: [
      'Label datasets 5x faster',
      'Active learning cuts labeling cost 60%',
      'Trace dataset lineage',
      'Consistent annotation quality'
    ],
    pricing: {
      basic: '99',
      pro: '399',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/services/ai-training-data-platform',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🏷️',
    href: '/services/ai-training-data-platform',
    category: 'ai'
  }
,
{
    id: 'ai-translation-services',
    title: 'AI Translation & Localization',
    description: 'Enterprise translation engine with 100+ language support, context-aware Neural MT, terminology management, and human review workflows.',
    features: ['100+ language Neural Machine Translation', 'Domain-specific model fine-tuning', 'Translation memory & glossary integration', 'Quality scoring & consistency checks', 'API integration for real-time translation'],
    benefits: ['80% reduction in translation costs', '10x faster content localization', 'Brand-consistent terminology', 'Built-in QA workflow'],
    pricing: { basic: '249', pro: '599', enterprise: '1499' },
    contactInfo: { website: '/ai-services/ai-translation-services', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🌐',
    href: '/services/ai-translation-services',
    category: 'ai'
  }
,
{
    id: 'ai-video-analytics',
    title: 'AI Video Analytics',
    description: 'Real-time video content analysis for security, retail insights, and operational intelligence using computer vision.',
    features: [
      'Real-time object detection & tracking',
      'People counting & heatmaps',
      'License plate recognition (ANPR)',
      'Behavioral anomaly detection',
      'Privacy-blur compliance mode'
    ],
    benefits: [
      'Enhanced security monitoring',
      'Retail customer behavior insights',
      'Automated incident detection',
      'Regulatory compliance (GDPR/CCPA)'
    ],
    pricing: {
      basic: '549',
      pro: '1199',
      enterprise: '2999'
    },
    contactInfo: {
      website: '/ai-services/ai-video-analytics',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🎥',
    href: '/services/ai-video-analytics',
    category: 'ai'
  }
,
{
    id: 'ai-video-generation',
    title: 'AI Video Generation & Editing',
    description: 'Create professional videos from text prompts with voiceover, B-roll, transitions, and brand styling — produce enterprise-grade content in minutes.',
    features: ['Text-to-video AI engine with scene generation', 'AI voiceover in 50+ languages with subtitles', 'Brand kit — colors, logos, auto-applied', 'Video editing timeline with AI-assisted cuts', 'Multi-platform export — YouTube, TikTok, Reels', 'Template marketplace — 500+ pre-built designs'],
    benefits: ['Reduce video production time by 90%', 'Eliminate need for video editors for routine content', '50+ language voiceover', 'Consistent brand presentation', 'Multi-format export', 'Built-in editing suite'],
    pricing: { basic: '59', pro: '199', enterprise: '499' },
    contactInfo: { website: '/ai-services/ai-video-generation', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎬',
    href: '/services/ai-video-generation',
    category: 'ai'
  }
,
{
    id: 'ai-video-generator',
    title: 'AI Video Generator & Editor',
    description: 'Generate professional videos from text prompts or scripts: auto-scene composition, voiceover, subtitles, and multi-format export (MP4, GIF, Reels).',
    features: [
      'Text-to-video generation (diffusion + GANs)',
      'Auto storyboard & scene composition',
      'AI voiceover with 50+ languages',
      'Built-in captions & subtitles',
      'Export for social (9:16, 1:1, 16:9)'
    ],
    benefits: [
      'Produce 10x faster than manual editing',
      'No filming or editing experience needed',
      'Consistent brand style across videos',
      'Scale video content for marketing'
    ],
    pricing: {
      basic: '399',
      pro: '999',
      enterprise: '2999'
    },
    contactInfo: {
      website: '/ai-services/ai-video-generator',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🎬',
    href: '/services/ai-video-generator',
    category: 'ai'
  }
,
{
    id: 'ai-visual-inspection',
    title: 'AI Visual Inspection & Quality Control',
    description: 'Computer vision-powered quality control for manufacturing: detect defects, classify product flaws, and ensure consistent quality on the production line.',
    features: [
      'Defect detection (scratches, dents, misalignments)',
      'Real-time inspection at line speed',
      'Anomaly detection on novel defect types',
      'Self-learning model improvement',
      'Integration with PLCs & MES systems'
    ],
    benefits: [
      'Reduce defect escape rate by 90%',
      'Lower QC labor costs by 60%',
      'Real-time quality dashboard',
      'Continuous model improvement'
    ],
    pricing: {
      basic: '599',
      pro: '1399',
      enterprise: '3999'
    },
    contactInfo: {
      website: '/ai-services/ai-visual-inspection',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '👁️',
    href: '/services/ai-visual-inspection',
    category: 'ai'
  }
,
{
    id: 'ai-voice-agent',
    title: 'AI Voice Agent (Phone)',
    description: 'Human-like conversational AI for phone calls: inbound customer service, outbound sales calls, appointment scheduling, and support ticket creation.',
    features: [
      'Natural language understanding (NLU)',
      'Real-time speech synthesis & recognition',
      'Call routing & handoff to humans',
      'CRM integration (auto-log calls)',
      'Compliance recording & transcription'
    ],
    benefits: [
      'Handle 80% of calls without human agents',
      'Reduce call center costs by 70%',
      '24/7 availability across timezones',
      'Consistent, compliant call handling'
    ],
    pricing: {
      basic: '599',
      pro: '1499',
      enterprise: '4999'
    },
    contactInfo: {
      website: '/ai-services/ai-voice-agent',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📱',
    href: '/services/ai-voice-agent',
    category: 'ai'
  }
,
{
    id: 'ai-voice-agent-platform',
    title: 'AI Voice Agent Platform',
    description: 'Deploy conversational AI voice agents for customer service, outbound calls, appointment scheduling, and lead qualification with natural speech.',
    features: ['Natural voice synthesis', 'Real-time speech recognition', 'Multi-language support', 'CRM integration', 'Call analytics and scoring'],
    benefits: ['Handle 10x more calls', '24/7 customer availability', 'Reduce labor costs by 60%', 'Qualify leads automatically'],
    pricing: { basic: '499', pro: '1199', enterprise: '3999' },
    contactInfo: { website: '/ai-services/ai-voice-agent-platform', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎙️',
    href: '/services/ai-voice-agent-platform',
    category: 'ai'
  }
,
{
    id: 'ai-voice-assistant',
    title: 'AI Voice Assistant',
    description: 'Enterprise-grade voice AI with natural language understanding, multi-language support, and seamless CRM integration.',
    features: [
      'Natural language voice processing',
      'Multi-language support (50+ languages)',
      'CRM & ERP integration',
      'Real-time transcription & analytics',
      'Custom wake words & voice branding'
    ],
    benefits: [
      'Handle 80% of routine calls automatically',
      '24/7 multilingual support',
      'Seamless CRM workflow integration',
      'Reduced call center costs'
    ],
    pricing: {
      basic: '349',
      pro: '799',
      enterprise: '1999'
    },
    contactInfo: {
      website: '/ai-services/ai-voice-assistant',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🎙️',
    href: '/services/ai-voice-assistant',
    category: 'ai'
  }
,
{
    id: 'ai-voice-assistant-pro',
    title: 'Voice Assistant Pro',
    description: `Custom voice assistants for brands: wake-word detection, natural-language task execution, multi-turn dialog. Deploy on-premise or cloud.`,
    features: ["Custom wake-word training", "Task execution", "Multi-turn context", "On-premise deployment", "Twilio/Asterisk integration"],
    benefits: ["Automate 60% of inbound calls", "24/7 support without agents", "Consistent brand experience"],
    pricing: {"basic":"249","pro":"649","enterprise":"1699"},
    contactInfo: {
      website: '/ai-services/ai-voice-assistant-pro',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📞',
    href: '/services/ai-voice-assistant-pro',
    category: 'ai'
  }
,
{
    id: 'ai-voice-cloning',
    title: 'AI Voice Cloning & Synthesis',
    description: 'Clone any voice with 30 seconds of audio for voiceovers, podcasts, audiobooks, and interactive voice applications.',
    features: ['Voice cloning from 30s audio sample', 'Emotion and tone control — adjust pitch, rate, emphasis', 'Real-time audio streaming for voice assistants', 'Multi-speaker conversation generation', 'Studio-quality audio with noise reduction', 'Ethical consent tracking and ownership verification'],
    benefits: ['Studio-quality from 30 seconds of audio', '50+ languages and dialects', 'Real-time streaming capability', 'Reduce voice talent costs by 80%', 'Ethical consent management', 'Custom emotion and tone controls'],
    pricing: { basic: '79', pro: '249', enterprise: '599' },
    contactInfo: { website: '/ai-services/ai-voice-cloning', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🗣️',
    href: '/services/ai-voice-cloning',
    category: 'ai'
  }
,
{
    id: 'ai-voice-cloning-marketing',
    title: 'AI Voice Cloning for Marketing',
    description: `Clone your brand spokesperson's voice to produce personalized video ads, podcast intros, and multilingual marketing content.`,
    features: ["Voice clone with 5 min sample", "Emotion & tone control", "30+ language output", "Bulk video rendering API"],
    benefits: ["Reduces voiceover costs by 70%", "Scales personalized campaigns", "Maintains brand consistency"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/ai-services/ai-voice-cloning-marketing',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🎙️',
    href: '/services/ai-voice-cloning-marketing',
    category: 'ai'
  }
,
{
    id: 'ai-agent-safety-evaluation',
    title: 'Ai Agent Safety Evaluation',
    description: '',
    features: ['AI-powered automation', 'Enterprise integration', 'Real-time analytics'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-agent-safety-evaluation', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🤖',
    href: '/services/ai-agent-safety-evaluation',
    category: 'ai'
  }
,
{
    id: 'ai-agents-autonomous',
    title: 'AI Agents & Autonomous Workflows',
    description: 'Deploy autonomous AI agents that reason, plan, and act. Multi-step task execution, tool use, and human-in-the-loop controls for enterprise automation.',
    features: ['Reasoning & Planning', 'Tool & API Integration', 'Multi-Agent Orchestration', 'Human-in-the-Loop', 'Memory & Context', 'Observability & Safety'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-agents-autonomous', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🤖',
    href: '/services/ai-agents-autonomous',
    category: 'ai'
  }
,
{
    id: 'ai-context-engineering-enterprise',
    title: 'Ai Context Engineering Enterprise',
    description: '',
    features: ['AI-powered automation', 'Enterprise integration', 'Real-time analytics'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-context-engineering-enterprise', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🤖',
    href: '/services/ai-context-engineering-enterprise',
    category: 'ai'
  }
,
{
    id: 'ai-copilot-enterprise',
    title: 'AI Copilot & Enterprise Assistants',
    description: 'Deploy AI copilots and enterprise assistants that augment human work. Context-aware, role-specific AI embedded in your tools and workflows.',
    features: ['Context-Aware Assistance', 'Role-Specific Intelligence', 'Embedded in Your Tools', 'Controlled & Governed', 'Learning & Improvement', 'Multi-Modal Interaction'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-copilot-enterprise', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '👤',
    href: '/services/ai-copilot-enterprise',
    category: 'ai'
  }
,
{
    id: 'ai-edge-realtime-inference',
    title: 'AI Edge & Real-Time Inference',
    description: 'Deploy AI at the edge and in real time. Low-latency inference, on-device models, and streaming pipelines for mission-critical applications.',
    features: ['Edge-Deployed Models', 'Real-Time Streaming Pipelines', 'Hybrid Cloud-Edge Orchestration', 'Model Optimization & Quantization', 'Low-Latency APIs', 'Observability at the Edge'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-edge-realtime-inference', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⚡',
    href: '/services/ai-edge-realtime-inference',
    category: 'ai'
  }
,
{
    id: 'ai-finetuning-alignment-pipelines',
    title: 'Ai Finetuning Alignment Pipelines',
    description: '',
    features: ['AI-powered automation', 'Enterprise integration', 'Real-time analytics'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-finetuning-alignment-pipelines', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🤖',
    href: '/services/ai-finetuning-alignment-pipelines',
    category: 'ai'
  }
,
{
    id: 'ai-foundation-models-custom-training',
    title: 'AI Foundation Models & Custom Training',
    description: 'Train and deploy custom foundation models. Domain-specific pretraining, fine-tuning, and model adaptation for enterprise AI with full data sovereig...',
    features: ['Domain-Specific Pretraining', 'Efficient Fine-Tuning & Adaptation', 'Alignment & Safety Training', 'Continuous Learning Pipelines', 'Model Compression & Export', 'Data Pipeline & Curation'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-foundation-models-custom-training', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🏗️',
    href: '/services/ai-foundation-models-custom-training',
    category: 'ai'
  }
,
{
    id: 'ai-governance-trust',
    title: 'AI Governance & Trust',
    description: 'Enterprise AI governance, compliance, and risk management. Policy enforcement, bias detection, audit trails, and responsible AI frameworks for regu...',
    features: ['Policy & Guardrail Enforcement', 'Bias & Fairness Monitoring', 'Audit Trails & Traceability', 'Model Risk Management', 'Regulatory Compliance', 'Responsible AI Frameworks'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-governance-trust', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⚖️',
    href: '/services/ai-governance-trust',
    category: 'ai'
  }
,
{
    id: 'ai-integration-apis',
    title: 'AI Integration & APIs',
    description: 'Integrate AI into existing systems with unified APIs, event-driven pipelines, and enterprise connectors. One integration layer across LLMs, agents,...',
    features: ['Unified AI API Layer', 'Enterprise Connectors', 'Event-Driven Pipelines', 'Structured Outputs & Orchestration', 'Security & Access Control', 'Observability & Versioning'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-integration-apis', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔌',
    href: '/services/ai-integration-apis',
    category: 'ai'
  }
,
{
    id: 'ai-memory-agents-long-horizon',
    title: 'Ai Memory Agents Long Horizon',
    description: '',
    features: ['AI-powered automation', 'Enterprise integration', 'Real-time analytics'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-memory-agents-long-horizon', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🤖',
    href: '/services/ai-memory-agents-long-horizon',
    category: 'ai'
  }
,
{
    id: 'ai-model-orchestration',
    title: 'AI Model Orchestration',
    description: 'Multi-model AI orchestration, routing, and fallback. Optimize cost, latency, and quality by routing requests to the right model for each task.',
    features: ['Intelligent Model Routing', 'Fallback & Resilience', 'Cost & Latency Optimization', 'Unified API Layer', 'A/B Testing & Evaluation', 'Observability & Analytics'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-model-orchestration', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎛️',
    href: '/services/ai-model-orchestration',
    category: 'ai'
  }
,
{
    id: 'ai-multimodal-intelligence',
    title: 'AI Multimodal Intelligence',
    description: 'Enterprise multimodal AI for text, video, images, and audio. Unified understanding across data types for document analysis, video insights, and int...',
    features: ['Unified Multimodal Understanding', 'Video Intelligence', 'Image & Visual Analysis', 'Document-to-Insight Pipelines', 'Real-Time & Batch Processing', 'Enterprise Security & Compliance'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-multimodal-intelligence', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎬',
    href: '/services/ai-multimodal-intelligence',
    category: 'ai'
  }
,
{
    id: 'ai-observability-mlops',
    title: 'AI Observability & MLOps',
    description: 'Monitor, debug, and optimize AI systems at scale. End-to-end observability for LLMs, agents, and ML pipelines with tracing, evaluation, and cost an...',
    features: ['End-to-End Tracing', 'Quality & Safety Evaluation', 'Cost & Usage Analytics', 'MLOps Pipeline Management', 'Debugging & Root Cause', 'Compliance & Audit'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-observability-mlops', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📡',
    href: '/services/ai-observability-mlops',
    category: 'ai'
  }
,
{
    id: 'ai-rag-knowledge-systems',
    title: 'AI RAG & Knowledge Systems',
    description: 'Enterprise retrieval-augmented generation (RAG) for accurate, grounded AI. Connect LLMs to your knowledge bases, documents, and real-time data with...',
    features: ['Intelligent Retrieval', 'Source Attribution & Citations', 'Knowledge Graph Integration', 'Real-Time Data Grounding', 'Chunking & Embedding Strategies', 'Evaluation & Continuous Improvement'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-rag-knowledge-systems', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📚',
    href: '/services/ai-rag-knowledge-systems',
    category: 'ai'
  }
,
{
    id: 'ai-regulated-industries',
    title: 'AI for Regulated Industries',
    description: 'AI solutions built for healthcare, finance, legal, and government. HIPAA, SOC 2, GDPR, and EU AI Act–ready with audit trails and human oversight.',
    features: ['Regulatory-First Architecture', 'Human-in-the-Loop & Oversight', 'Bias & Fairness Monitoring', 'Documentation & Transparency', 'Sector-Specific Workflows', 'Vendor & Model Governance'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-regulated-industries', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🏛️',
    href: '/services/ai-regulated-industries',
    category: 'ai'
  }
,
{
    id: 'ai-security-responsible-ai',
    title: 'AI Security & Responsible AI',
    description: 'Secure AI systems and responsible deployment. Adversarial robustness, prompt injection defense, data privacy, and AI safety controls for enterprise...',
    features: ['Adversarial Robustness & Red-Teaming', 'Prompt & Input Guardrails', 'Data Privacy & Confidentiality', 'Model Supply Chain Security', 'Fairness & Bias Mitigation', 'Incident Response & Recovery'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-security-responsible-ai', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🛡️',
    href: '/services/ai-security-responsible-ai',
    category: 'ai'
  }
,
{
    id: 'ai-strategy-roadmap',
    title: 'AI Strategy & Roadmap',
    description: 'Align AI initiatives with business goals. Discovery workshops, use-case prioritization, vendor evaluation, and phased roadmaps for production AI at...',
    features: ['Discovery & Opportunity Mapping', 'Use-Case Prioritization', 'Vendor & Build-vs-Buy Evaluation', 'Phased Roadmap Design', 'KPI & Success Metrics', 'Governance & Risk Alignment'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/ai-strategy-roadmap', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🗺️',
    href: '/services/ai-strategy-roadmap',
    category: 'ai'
  }
,
{
     id: 'automated-data-labeling',
     title: 'Automated Data Labeling for Computer Vision & NLP',
     description: 'Scale data labeling 100x with AI-assisted annotation: pre-label images, text, and audio; human-in-the-loop review; export to COCO, Pascal VOC, JSONL.',
     features: [
       'Pre-labeling with foundation models (CLIP, YOLO)',
       'Active learning to prioritize ambiguous samples',
       'Collaborative annotation workspace',
       'Quality metrics & consensus scoring',
       'Export to all major ML data formats'
     ],
     benefits: [
       'Label 10,000 images in hours, not weeks',
       'Reduce labeling cost by 90%',
       'Improve model accuracy with high-quality labels',
       'Iterate on training data faster'
     ],
     pricing: { basic: '199', pro: '599', enterprise: '1799' },
     contactInfo: { website: '/ai-services/automated-data-labeling', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '🏷️',
     href: '/services/automated-data-labeling',
     category: 'ai'
   }
,
{
     id: 'autonomous-code-review-agent',
     title: 'Autonomous Code Review Agent',
     description: 'AI-powered code review bot that analyzes pull requests for security flaws, performance antipatterns, style violations, and architectural drift across JavaScript/TypeScript, Python, and Go.',
     features: [
       'Static analysis + LLM-based reasoning',
       'Security vulnerability scoring (CWE, OWASP)',
       'Auto-suggested patches via diffs',
       'Custom rule engine per team standards',
       'CI/CD integration (GitHub Actions, GitLab CI)'
     ],
     benefits: [
       'Catch 90%+ of bugs before merge',
       'Reduce code review time by 60%',
       'Enforce consistent standards automatically',
       'Onboard new developers faster'
     ],
     pricing: { basic: '0', pro: '199', enterprise: '899' },
     contactInfo: { website: '/ai-services/autonomous-code-review-agent', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '👩‍💻',
     href: '/services/autonomous-code-review-agent',
     category: 'ai'
   }
,
{
    id: 'autonomous-growth-intelligence',
    title: 'Autonomous Growth Intelligence',
    description: 'Design AI-powered acquisition, conversion, retention, and expansion loops with measurable impact models and deployment-safe execution plans.',
    features: ['Growth Opportunity Mapping', 'Conversion System Design', 'Retention & Expansion Playbooks', 'Autonomous Experimentation', 'Growth Data Foundation', 'Executive Growth Dashboard'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/autonomous-growth-intelligence', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📈',
    href: '/services/autonomous-growth-intelligence',
    category: 'ai'
  }
,
{
    id: 'business-intelligence',
    title: 'Business Intelligence',
    description: 'Business Intelligence transforms raw data into actionable intelligence with real-time dashboards, automated reporting, and predictive models. Make ...',
    features: ['AI-powered automation', 'Enterprise integration', 'Real-time analytics'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/business-intelligence', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📊',
    href: '/services/business-intelligence',
    category: 'ai'
  },
  {
    id: 'computer-vision-inspection',
    title: 'Computer Vision Quality Inspection',
    description: 'Auto-train Custom vision models for manufacturing quality control: surface defect detection, assembly verification, and real-time conveyor-belt inspection.',
    features: [
      'No-code model training',
      'Edge deployment option',
      'Anomaly detection mode',
      'Conveyor integration SDK',
      'Defect classification export'
    ],
    benefits: [
      'Zero missed defect rate',
      'Inspector fatigue eliminated',
      'ROI positive in 3 months',
      'Training data built-in'
    ],
    pricing: {
      basic: '499',
      pro: '1499',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/services/computer-vision-inspection',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔬',
    href: '/services/computer-vision-inspection',
    category: 'ai'
  }
,
{
    id: 'content-generation',
    title: 'Content Generation',
    description: 'Content Generation empowers marketing and revenue teams with AI-driven campaign optimization, lead intelligence, and personalized outreach automati...',
    features: ['AI-powered automation', 'Enterprise integration', 'Real-time analytics'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/content-generation', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📈',
    href: '/services/content-generation',
    category: 'ai'
  }
,
{
    id: 'customer-experience',
    title: 'Customer Experience',
    description: 'Customer Experience elevates customer interactions with AI-driven support, intelligent routing, and personalized engagement across every touchpoint...',
    features: ['AI-powered automation', 'Enterprise integration', 'Real-time analytics'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/customer-experience', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💬',
    href: '/services/customer-experience',
    category: 'ai'
  }
,
{
    id: 'document-processing',
    title: 'Document Processing',
    description: 'Document Processing eliminates manual bottlenecks with intelligent process automation, event-driven orchestration, and cross-system integration. Re...',
    features: ['AI-powered automation', 'Enterprise integration', 'Real-time analytics'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/document-processing', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔄',
    href: '/services/document-processing',
    category: 'ai'
  }
,
{
    id: 'energy-management',
    title: 'Energy Management',
    description: 'Energy Management combines AI intelligence with practical engineering to solve real business challenges. Deploy production-ready capabilities that ...',
    features: ['AI-powered automation', 'Enterprise integration', 'Real-time analytics'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/energy-management', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '✨',
    href: '/services/energy-management',
    category: 'ai'
  }
,
{
    id: 'fraud-detection',
    title: 'Fraud Detection',
    description: 'Fraud Detection provides enterprise-grade security controls, continuous monitoring, and compliance automation. Reduce risk exposure and accelerate ...',
    features: ['AI-powered automation', 'Enterprise integration', 'Real-time analytics'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/fraud-detection', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🛡️',
    href: '/services/fraud-detection',
    category: 'ai'
  },
  {
    id: 'generative-ai-copywriting',
    title: 'AI Copywriting & Content Studio',
    description: 'Brand-tuned AI content generation for blogs, ads, emails, and social posts with tone control, SEO scoring, and content calendar automation.',
    features: [
      'Brand voice tuning',
      'SEO content scoring',
      'Multi-format output',
      'Content calendar integration',
      'Plagiarism & fact checking'
    ],
    benefits: [
      'Write 5x more content',
      'SEO-optimized by default',
      'Brand voice consistent',
      'Content calendar on autopilot'
    ],
    pricing: {
      basic: '29',
      pro: '99',
      enterprise: '499'
    },
    contactInfo: {
      website: '/services/generative-ai-copywriting',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '✍️',
    href: '/services/generative-ai-copywriting',
    category: 'ai'
  },
  {
    id: 'generative-ai-legal-review',
    title: 'Generative AI Legal Document Review',
    description: 'AI contract review that highlights risks, suggests clauses, compares against playbooks, and redlines in your firms style — cutting document review time 80%.',
    features: [
      'Risk clause highlighting',
      'Playbook clause matching',
      'Redline suggestion engine',
      'Multi-doc comparison',
      'Workflow routing'
    ],
    benefits: [
      'Review contracts 5x faster',
      'Catch risks humans miss',
      'Consistent legal standards',
      'Junior lawyer productivity +200%'
    ],
    pricing: {
      basic: '99',
      pro: '349',
      enterprise: '1499'
    },
    contactInfo: {
      website: '/services/generative-ai-legal-review',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '⚖️',
    href: '/services/generative-ai-legal-review',
    category: 'ai'
  },
  {
    id: 'generative-ai-summarization',
    title: 'Generative AI Document Summarizer',
    description: 'Enterprise document summarization engine: ingest PDFs, Word docs, and transcripts to generate executive briefs, meeting notes, and compliance abstracts.',
    features: [
      'Multi-format document ingest',
      'Configurable summary length',
      'Citation-backed extraction',
      'Compliance abstract templates',
      'Bulk processing API'
    ],
    benefits: [
      'Read 100-page reports in 60s',
      'Automatic meeting minutes',
      'Citation-backed accuracy',
      'Reduce review time 80%'
    ],
    pricing: {
      basic: '0',
      pro: '59',
      enterprise: '399'
    },
    contactInfo: {
      website: '/services/generative-ai-summarization',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📄',
    href: '/services/generative-ai-summarization',
    category: 'ai'
  },
  {
    id: 'generative-ai-video-editor',
    title: 'Generative AI Video Editor',
    description: 'AI-powered video editor: auto-transcribe, auto-caption, text-to-speech voiceover, background removal, and one-click social media resizing.',
    features: [
      'Auto-transcription + captions',
      'Text-to-speech voiceover',
      'Background removal',
      'AI scene description',
      'One-click aspect ratio resize'
    ],
    benefits: [
      'Edit video 10x faster',
      'No video editing experience needed',
      'Repurpose videos for all platforms',
      'Auto brand-consistent captions'
    ],
    pricing: {
      basic: '15',
      pro: '49',
      enterprise: '199'
    },
    contactInfo: {
      website: '/services/generative-ai-video-editor',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🎬',
    href: '/services/generative-ai-video-editor',
    category: 'ai'
  },
  {
    id: 'generative-ai-voice-agent',
    title: 'Generative AI Voice Agent',
    description: '24/7 AI voice agents for inbound support, outbound lead qualification, and appointment booking with natural voice and real-time CRM sync.',
    features: [
      'Natural TTS + STT',
      'Multi-lingual support',
      'Real-time CRM sync',
      'Sentiment analysis',
      'Call analytics dashboard'
    ],
    benefits: [
      'Handle 80% of calls autonomously',
      'Reduce support costs 70%',
      'Available 24/7 in any language',
      'Full conversation analytics'
    ],
    pricing: {
      basic: '299',
      pro: '799',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/services/generative-ai-voice-agent',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🎙️',
    href: '/services/generative-ai-voice-agent',
    category: 'ai'
  }
,
{
     id: 'generative-data-synthesis',
     title: 'Generative Data Synthesis for Model Training',
     description: 'Create synthetic tabular, image, or text datasets to augment training data, balance classes, or simulate rare scenarios while preserving statistical fidelity.',
     features: [
       'Tabular data synthesis (CTGAN, TVAE)',
       'Image synthesis with diffusion models',
       'Privacy-preserving synthetic data (DP-SGD)',
       'Data augmentation pipelines',
       'Quality metrics (KSTest, coverage)'
     ],
     benefits: [
       'Bootstrap ML projects with limited data',
       'Balance underrepresented classes',
       'Protect PII while retaining data utility',
       'Simulate extreme scenarios for stress testing'
     ],
     pricing: { basic: '499', pro: '1199', enterprise: '3599' },
     contactInfo: { website: '/ai-services/generative-data-synthesis', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '🌀',
     href: '/services/generative-data-synthesis',
     category: 'ai'
   }
,
{
     id: 'generative-ux-research-synthesis',
     title: 'Generative UX Research Synthesis',
     description: 'Turn raw user interviews, survey responses, and usability test recordings into structured insights, personas, and actionable recommendations using AI.',
     features: [
       'Transcript summarization & theme extraction',
       'Sentiment analysis across user segments',
       'Automatic persona generation with quotes',
       'Journey map creation from session data',
       'Priority ranking of pain points'
     ],
     benefits: [
       'Analyze 100+ hours of user research in minutes',
       'Uncover hidden pain points automatically',
       'Create deliverables without manual synthesis',
       'Make user-centric decisions faster'
     ],
     pricing: { basic: '199', pro: '599', enterprise: '1899' },
     contactInfo: { website: '/ai-services/generative-ux-research-synthesis', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '👥',
     href: '/services/generative-ux-research-synthesis',
     category: 'ai'
   }
,
{
    id: 'generative-ai-enterprise',
    title: 'Generative AI Enterprise',
    description: 'Enterprise-scale generative AI for content, code, and data. Deploy secure, governed LLM workflows with custom models, RAG, and fine-tuning for prod...',
    features: ['Secure LLM Deployment', 'RAG & Knowledge Grounding', 'Custom Model Fine-Tuning', 'Multi-Modal Generation', 'Governance & Compliance', 'Cost & Performance Optimization'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/generative-ai-enterprise', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🧠',
    href: '/services/generative-ai-enterprise',
    category: 'ai'
  }
,
{
    id: 'hr-analytics',
    title: 'HR Analytics',
    description: 'HR Analytics transforms raw data into actionable intelligence with real-time dashboards, automated reporting, and predictive models. Make faster, m...',
    features: ['AI-powered automation', 'Enterprise integration', 'Real-time analytics'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/hr-analytics', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📊',
    href: '/services/hr-analytics',
    category: 'ai'
  }
,
{
     id: 'legal-doc-review-ai',
     title: 'AI Legal Document Review & Risk Analysis',
     description: 'Accelerate legal contract review by 80%: extract obligations, flag risks, suggest clauses, and compare against playbooks using LLMs fine-tuned on legal corpora.',
     features: [
       'Clause extraction & classification (liability, IP, termination)',
       'Risk scoring per clause (high/medium/low)',
       'Deviation detection from standard templates',
       'Redline suggestions with rationale',
       'Multi-jurisdiction compliance checks'
     ],
     benefits: [
       'Review NDAs in minutes instead of hours',
       'Reduce external legal spend by 60%',
       'Never miss risky clauses again',
       'Scale legal review across hundreds of contracts'
     ],
     pricing: { basic: '499', pro: '1299', enterprise: '4999' },
     contactInfo: { website: '/ai-services/legal-doc-review-ai', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '⚖️',
     href: '/services/legal-doc-review-ai',
     category: 'ai'
   }
,
{
    id: 'marketing-automation',
    title: 'Marketing Automation',
    description: 'Marketing Automation empowers marketing and revenue teams with AI-driven campaign optimization, lead intelligence, and personalized outreach automa...',
    features: ['AI-powered automation', 'Enterprise integration', 'Real-time analytics'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/marketing-automation', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📈',
    href: '/services/marketing-automation',
    category: 'ai'
  }
,
{
     id: 'meeting-ai-assistant',
     title: 'Meeting AI Assistant (Record, Transcribe, Summarize)',
     description: "Automatic meeting assistant that records, transcribes with speaker ID, generates action items, decisions, and summaries; integrates with Zoom, Teams, Google Meet.",
     features: [
       'Cloud recording & real-time transcription',
       'Speaker identification & diarization',
       'Action item extraction with assignees',
       'Decision log & key quote highlights',
       'Sync to Notion/Confluence/ClickUp'
     ],
     benefits: [
       'Never miss an action item again',
       'Reduce meeting follow-up time by 80%',
       'Search across all past meeting transcripts',
       'Onboard new team members with context'
     ],
     pricing: { basic: '0', pro: '99', enterprise: '399' },
     contactInfo: { website: '/ai-services/meeting-ai-assistant', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '🎙️',
     href: '/services/meeting-ai-assistant',
     category: 'ai'
   }
,
{
    id: 'mlops-platform',
    title: 'MLOps Platform',
    description: 'End-to-end ML lifecycle platform: experiment tracking, model registry, CI/CD for ML, feature store, and monitoring dashboards.',
    features: [
      'Experiment tracking',
      'Model registry & version',
      'ML pipeline CI/CD',
      'Feature store',
      'Model drift monitoring'
    ],
    benefits: [
      'Ship ML models 10x faster',
      'Track every experiment',
      'Automate retraining',
      'No vendor lock-in'
    ],
    pricing: {
      basic: '0',
      pro: '149',
      enterprise: '899'
    },
    contactInfo: {
      website: '/services/mlops-platform',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🤖',
    href: '/services/mlops-platform',
    category: 'ai'
  },
  {
    id: 'object-detection-surveillance',
    title: 'Object Detection Surveillance',
    description: 'Real-time AI video analytics for security cameras: person/vehicle detection, loitering alerts, license plate recognition, and behavior anomaly flagging.',
    features: [
      'Person/vehicle/package detect',
      'Loitering & perimeter alerts',
      'License plate recognition',
      'Behavior anomaly flagging',
      'Privacy blur option'
    ],
    benefits: [
      'AI monitors 1000s of cameras',
      'Zero missed incidents',
      'Reduce security headcount 60%',
      'Privacy-compliant blur'
    ],
    pricing: {
      basic: '99',
      pro: '399',
      enterprise: '1999'
    },
    contactInfo: {
      website: '/services/object-detection-surveillance',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📹',
    href: '/services/object-detection-surveillance',
    category: 'ai'
  }
,
{
     id: 'predictive-churn-risk',
     title: 'Predictive Churn Risk Scoring',
     description: 'Machine learning model to predict which customers will churn with 90%+ accuracy; trigger retention workflows before cancellation.',
     features: [
       'Feature engineering from usage & billing data',
       'Gradient boosting & survival analysis models',
       'Risk score per account (1-100)',
       'Automated retention offer triggers',
       'Dashboard with cohort analysis'
     ],
     benefits: [
       'Reduce monthly churn by 25%',
       'Target retention spend efficiently',
       'Identify at-risk accounts before they leave',
       'Improve LTV prediction accuracy'
     ],
     pricing: { basic: '299', pro: '799', enterprise: '2799' },
     contactInfo: { website: '/ai-services/predictive-churn-risk', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
     icon: '📉',
     href: '/services/predictive-churn-risk',
     category: 'ai'
   }
,
{
    id: 'predictive-maintenance',
    title: 'Predictive Maintenance',
    description: 'Predictive Maintenance combines AI intelligence with practical engineering to solve real business challenges. Deploy production-ready capabilities ...',
    features: ['AI-powered automation', 'Enterprise integration', 'Real-time analytics'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/predictive-maintenance', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '✨',
    href: '/services/predictive-maintenance',
    category: 'ai'
  }
,
{
    id: 'quality-assurance',
    title: 'Quality Assurance',
    description: 'Quality Assurance combines AI intelligence with practical engineering to solve real business challenges. Deploy production-ready capabilities that ...',
    features: ['AI-powered automation', 'Enterprise integration', 'Real-time analytics'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/quality-assurance', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '✨',
    href: '/services/quality-assurance',
    category: 'ai'
  }
,
{
    id: 'supply-chain',
    title: 'Supply Chain',
    description: 'Supply Chain delivers purpose-built AI solutions tailored to specific industry requirements. Accelerate digital transformation with domain-specific...',
    features: ['AI-powered automation', 'Enterprise integration', 'Real-time analytics'],
    benefits: ['Reduce operational costs', 'Accelerate decision-making', 'Scale seamlessly', 'Meet compliance requirements'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/ai-services/supply-chain', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🏢',
    href: '/services/supply-chain',
    category: 'ai'
  },
  {
    id: 'vector-database',
    title: 'Vector Database',
    description: 'Managed vector database for RAG pipelines, semantic search, and similarity queries with hybrid filtering, autoscaling, and multi-modal indexing.',
    features: [
      'HNSW + IVF index types',
      'Hybrid scalar + vector filter',
      'Multi-modal embeddings',
      'Autoscaling replicas',
      'REST + gRPC + SDK'
    ],
    benefits: [
      'RAG in production < 10ms',
      'Semantic search at scale',
      'No infra management',
      'Multi-cloud available'
    ],
    pricing: {
      basic: '0',
      pro: '99',
      enterprise: '899'
    },
    contactInfo: {
      website: '/services/vector-database',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🧬',
    href: '/services/vector-database',
    category: 'ai'
  },

  {id:'ai-cultural-fit-screener',title:'AI Cultural Fit Screener',description:'AI evaluates resume+behavioral vs your company values: culture-fit score, behavioral alignment scoring, red-flag indicators before interview, auto short-list explanation.',features:['Value-alignment scoring per candidate','Behavioral flag detection','Culture-card comparison vs new hire baseline','Auto short-list per candidate + hiring manager'],benefits:['Reduce bad-hire cost from culture mismatch','Automatic short-list rationale per HR+HM'],pricing:{basic:'29',pro:'99',enterprise:'299'},contactInfo:{website:'/services/ai-cultural-fit-screener',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-cultural-fit-screener',category:'ai'},
  {id:'ai-document-classifier',title:'AI Document Classifier',description:'Auto-classifies invoices contracts NDAs receipts resumes medical records: routes to correct workflow extracts key fields attaches metadata search tags.',features:['99-doc ocr nlp classification','Key field extraction per doc type','Workflow queue routing + SLA tagging','Metadata + search tags auto-attached'],benefits:['Cut document intake 80%','Zero mis-filed compliance queue docs'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-document-classifier',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'AI',href:'/services/ai-document-classifier',category:'ai'},
  {id:'ai-drug-interaction-checker',title:'AI Drug Interaction Checker',description:'Real-time 50K+ prescription/OTC interaction checker: contraindications pregnancy risk triggers prescriber alert + pharmacy workflow patient counseling sheet.',features:['50K+ drug interaction database','Pregnancy weight renal dosing adj','Prescriber + pharmacy workflow alert','Printable patient counseling sheet'],benefits:['65% adverse drug event reduction','Pharmacist workflow time cut 50%'],pricing:{basic:'149',pro:'499',enterprise:'1999'},contactInfo:{website:'/services/ai-drug-interaction-checker',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-drug-interaction-checker',category:'ai'},
  {id:'ai-education-adaptive-tutor',title:'AI Adaptive Tutoring System',description:'Personalized K-12 adaptive: adjusts difficulty by mastery scaffolds strugglers accelerates high performers curriculum-standard tagged problems.',features:['Mastery-level adaptive engine','Scaffold strugglers + accelerate performers','Curriculum-standard problem tagging','Parent+teacher mastery heat-map'],benefits:['2 letter grade improvement','Tutoring cost cut 90%'],pricing:{basic:'14',pro:'49',enterprise:'199'},contactInfo:{website:'/services/ai-education-adaptive-tutor',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-education-adaptive-tutor',category:'ai'},
  {id:'ai-fedrisk-compliance',title:'AI FedRAMP Compliance Assistant',description:'Maps your control implementations to FedRAMP Rev 5 generates POA&M tracks continuous monitoring artifacts auto-generates audit evidence bundles readiness gap report.',features:['FedRAMP Rev 5 control mapping','POA&M auto-generation + monthly tracking','Continuous monitoring artifact creation','Audit evidence bundle per annual assessment'],benefits:['FedRAMP audit prep 75% faster','Continuous monitoring without manual spreadsheets','Pass ATO with reduced assessor findings'],pricing:{basic:'199',pro:'699',enterprise:'2499'},contactInfo:{website:'/services/ai-fedrisk-compliance',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-fedrisk-compliance',category:'ai'},
  {id:'ai-fullstack-test-generator',title:'AI Full-Stack Test Generator',description:'Reads source code + OpenAPI + DB schema produces unit + integration + E2E tests: React/Vue component API endpoint DB constraint auth flow 90%+ coverage.',features:['Source + schema + OpenAPI ingestion','Unit + integration + E2E auto-gen','90%+ line coverage without manual writing','CI/CD pipeline + flaky test auto-retry'],benefits:['QA engineering overhead cut 60%','Higher quality with less test code maintained'],pricing:{basic:'79',pro:'299',enterprise:'999'},contactInfo:{website:'/services/ai-fullstack-test-generator',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-fullstack-test-generator',category:'ai'},
  {id:'ai-growth-intelligence',title:'AI Growth Intelligence Platform',description:'Scans 10K+ growth levers: pricing positioning channel mix funnel competitor moves. ML ranks highest-ROI experiments per your stage market unit economics.',features:['10K+ lever scoring','Experiment ROI ranking per stage','Competitor signal + gap detection','GTM strategy auto-draft per priority lever'],benefits:['Higher-ROI experiments 5x faster','Data-backed GTM replaces opinion roadmap'],pricing:{basic:'199',pro:'699',enterprise:'2499'},contactInfo:{website:'/services/ai-growth-intelligence',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-growth-intelligence',category:'ai'},
  {id:'ai-insurance-pricing',title:'AI Insurance Pricing Advisor',description:'ML pricing model for underwriters: ingests claim history risk factors market data produces per-risk pricing with confidence interval exposure summary benchmark vs competitors.',features:['Per-risk ML pricing model','Confidence interval + exposure summary','Market rate benchmarking vs competitors','Underwriter explainability per recommendation'],benefits:['Reduce underpricing loss 12-18%','Cut manual quote time 70%','Eliminate inconsistent pricing between UWs'],pricing:{basic:'99',pro:'399',enterprise:'1499'},contactInfo:{website:'/services/ai-insurance-pricing',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-insurance-pricing',category:'ai'},
  {id:'ai-job-matcher',title:'AI Job Matcher & Career Path',description:'Two-sided AI: job seeker resume vs all open roles + candidate profile vs employer requirements. Fit scores gap analysis interview prep salary benchmark.',features:['Two-sided job + candidate fit scoring','Gap analysis + interview prep','Salary benchmark + offer comparison','Employer short-list with fit rankings'],benefits:['Candidate finds right role 3x faster','Employer reduce bad-hire with quantified fit score'],pricing:{basic:'19',pro:'69',enterprise:'249'},contactInfo:{website:'/services/ai-job-matcher',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-job-matcher',category:'ai'},
  {id:'ai-legal-research',title:'AI Legal Research Engine',description:'LLM legal research: semantic search across case law statutes regulations SEC filings patents. Produces cited answers source attribution alerts law changes per jurisdiction.',features:['Semantic search case law+statutes+regs','Source attribution + citation per answer','Law change alerts per jurisdiction','Memo export per research session'],benefits:['Reduce legal research time 80%','Stay current without manual watching'],pricing:{basic:'99',pro:'349',enterprise:'1499'},contactInfo:{website:'/services/ai-legal-research',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-legal-research',category:'ai'},
  {id:'ai-omnichannel-chatbot',title:'AI Omnichannel Chatbot Platform',description:'Unified chatbot across 20+ channels: website WhatsApp Instagram SMS phone call Slack Teams. Shared conversation context handoff routing brand voice per channel.',features:['20+ channel unified inbox','Shared conversation context per customer','Human handoff with full context preserved','Channel-consistent brand voice tuning'],benefits:['One bot covers all your channels','No context reset between touchpoints'],pricing:{basic:'49',pro:'199',enterprise:'899'},contactInfo:{website:'/services/ai-omnichannel-chatbot',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-omnichannel-chatbot',category:'ai'},
  {id:'ai-pdf-engine',title:'AI PDF Document Engine',description:'Batch PDF ingest extract transform: table layout OCR handwriting form auto-fill export DOCX CSV JSON 99%+ layout fidelity 1000-pages-per-hour.',features:['Table + layout + structure extraction','OCR handwriting recognition','Form auto-fill export DOCX CSV JSON','Batch + queue 1000 pages per hour'],benefits:['Extract structured data from scanned PDFs in seconds','Cut PDF-to-database pipeline dev time 80%'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-pdf-engine',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-pdf-engine',category:'ai'},
  {id:'ai-predictive-churn',title:'AI Predictive Churn & Retention',description:'Predicts customer churn 30-90 days before event: ML ingests product usage behavior support tickets NPS scores contract data produces ranked at-risk list recommended retention.',features:['Predict churn 30-90 days before event','Feature importance per customer','Recommended retention action per at-risk account','CLV-adjusted retention spend optimization'],benefits:['Reduce churn rate 15-25%','Focus retention spend on highest-CLV accounts'],pricing:{basic:'99',pro:'349',enterprise:'1299'},contactInfo:{website:'/services/ai-predictive-churn',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-predictive-churn',category:'ai'},
  {id:'ai-procurement',title:'AI Procurement Intelligence',description:'Auto-sources suppliers compares prices negotiates contracts tracks delivery and manages supplier risk: e-procurement spend analysis contract mgmt supplier scorecards.',features:['Auto-sourcing + supplier matching','Price comparison + contract negotiation','Delivery tracking + SLA monitoring','Supplier risk scoring + scorecard'],benefits:['Cut procurement cycle 50%','Reduce maverick spend by 20%','Better terms via data-backed negotiation'],pricing:{basic:'99',pro:'349',enterprise:'1499'},contactInfo:{website:'/services/ai-procurement',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-procurement',category:'ai'},
  {id:'ai-project-planning',title:'AI Project Planning & Scheduling',description:'PM-grade AI: scope→WBS→resource allocation→critical path→risk register→milestone tracking. Syncs to Jira Asana Monday auto-updates when scope changes.',features:['Scope to WBS auto-generation','Resource allocation + critical path analysis','Risk register + contingency recommendation','Sync Jira Asana Monday'],benefits:['Plan complex projects 3x faster','Auto-update plan when scope changes without manual rework'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-project-planning',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-project-planning',category:'ai'},
  {id:'ai-real-estate-valuation',title:'AI Real Estate Valuation & Analytics',description:'Automated AVM: comps zoning property features market trends confidence interval risk score comparable sales report for residential and commercial real estate.',features:['Automated AVM ML model','Confidence interval + risk score','Comparable sales per property','Commercial lease + cap rate valuation'],benefits:['Cut appraisal time 80%','Confidence intervals reduce manual reviewer cycles','Commercial valuation no commissioned appraiser needed'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-real-estate-valuation',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-real-estate-valuation',category:'ai'},
  {id:'ai-red-team-automation',title:'AI Red Team Automation',description:'Automated adversary simulation: C2 beaconing lateral movement privilege escalation data exfiltration mapped to MITRE ATT&CK auto-remediation playbooks continuous on-env testing.',features:['MITRE ATT&CK mapped adversary simulation','C2 + lateral movement + priv esc','Auto-remediation playbook per finding','Continuous testing on actual environment'],benefits:['Find access gaps before attackers','ATT&CK coverage score per environment','Continuous vs annual pentest snapshot'],pricing:{basic:'149',pro:'599',enterprise:'2499'},contactInfo:{website:'/services/ai-red-team-automation',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-red-team-automation',category:'ai'},
  {id:'ai-retail-personalization',title:'AI Retail Personalization Engine',description:'Offline + online retail: shopper behavior scoring real-time offer personalization inventory allocation basket optimization store labor scheduling per SKU.',features:['Shopper behavior scoring per SKU','Real-time offer personalization','Inventory allocation + OOS prevention','Basket size + store labor optimization'],benefits:['Conversion lift 20-40%','Real-time relevancy beats static catalog'],pricing:{basic:'99',pro:'349',enterprise:'1499'},contactInfo:{website:'/services/ai-retail-personalization',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-retail-personalization',category:'ai'},
  {id:'ai-roadmap-strategy',title:'AI Strategy & Roadmap Consulting',description:'Executive AI strategy: opportunity assessment model selection custom vs off-the-shelf stack design data readiness audit pilot roadmap prioritization 90-day win plan.',features:['Opportunity assessment per process','AI model + stack selection','Data readiness audit','90-day roadmap + first-win per exec approval'],benefits:['Executive AI strategy in 4 wks not 4 months','Avoid costly wrong-model decisions from vendor bias'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-roadmap-strategy',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-roadmap-strategy',category:'ai'},
  {id:'ai-rpa-automation',title:'AI Robotic Process Automation (RPA)',description:'Web desktop mobile RPA: automates mouse keyboard form data entry ERP tax portal batch processing screen-scrape scheduler audit log per bot.',features:['Desktop + web + mobile RPA','ERP / tax portal connector','Screen-scrape + form fill + readback','Scheduler + audit log per bot'],benefits:['Automate 200+ hrs of repetitive work per FTE','Non-engineers audit every bot action'],pricing:{basic:'9',pro:'39',enterprise:'149'},contactInfo:{website:'/services/ai-rpa-automation',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-rpa-automation',category:'ai'},
  {id:'ai-resume-optimizer',title:'AI Resume Optimizer',description:'AI reads your resume vs JD: scores ATS compatibility rewrites bullet points quantifies achievements fills keyword gaps produces one-click export + cover letter draft.',features:['ATS keyword scoring (JD vs resume)','Bullet-point rewrite per role','Achievement quantification suggestions','One-click PDF + cover letter export'],benefits:['Get 2x more interview callbacks','ATS pass rate at top-tier employers','Save 3 hrs per application'],pricing:{basic:'29',pro:'99',enterprise:'299'},contactInfo:{website:'/services/ai-resume-optimizer',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-resume-optimizer',category:'ai'},
  {id:'ai-rx-prior-auth',title:'Rx Prior-Auth Automation',description:'Automated prior authorization: eligibility check formulary check code auto-populate payer portal submission clinical note attach outcome tracking denial tracking remittance per payer analytics.',features:['Eligibility + formulary real-time check','Payer portal auto-submit clinical note attach','Denial tracking + rework automation','Analytics per payer approval time + rate'],benefits:['Cut prior-auth admin 80%','Zero manual data entry to payer portals','Track denial rates per payer and trend'],pricing:{basic:'49',pro:'199',enterprise:'749'},contactInfo:{website:'/services/ai-rx-prior-auth',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-rx-prior-auth',category:'ai'},
  {id:'ai-sales-coach',title:'AI Sales Coach & Call Analysis',description:'Real-time analysis: talk-listen ratio objection handling competitor mention pricing signal detection recommended next-step per call stage with CRM auto-scorecard team leaderboard.',features:['Real-time talk-listen + objection detection','Recommended next-step per call stage','CRM scorecard + follow-up task auto-created','Team leaderboard + best-practice highlight'],benefits:['Improve win-rate 25%+ from real-time coaching','Cut onboarding for new reps by 50%','Coach the whole team not just 1:1'],pricing:{basic:'29',pro:'99',enterprise:'399'},contactInfo:{website:'/services/ai-sales-coach',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-sales-coach',category:'ai'},
  {id:'ai-social-scheduler',title:'AI Social Media Scheduler & Planner',description:'AI content calendar: generates 30-day brand-voice plans auto-drafts posts across 6 platforms schedules optimal publish time reviews engagement data auto-adjusts.',features:['30-day brand-voice plan auto-gen','Auto-draft 6 platform post variants','Optimal time per platform + audience','Performance review + next plan adjustment'],benefits:['Cut social media time 75%','Month-long content in 2 hours','Never miss a key posting window'],pricing:{basic:'19',pro:'79',enterprise:'299'},contactInfo:{website:'/services/ai-social-scheduler',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-social-scheduler',category:'ai'},
  {id:'ai-tts-voice-clone',title:'AI Voice Clone + Text-to-Speech Engine',description:'Zero-shot voice clone (30 sec sample) prosody matching across 80+ languages: reads any script with brand tone for narration audiobooks courses voice at scale.',features:['Zero-shot voice clone (30 sec sample)','80+ language prosody matching','Emotion + pacing per brand voice','Batch production for script libraries'],benefits:['Cut narration cost 50x over studio actors','Consistent brand voice across all content'],pricing:{basic:'29',pro:'149',enterprise:'599'},contactInfo:{website:'/services/ai-tts-voice-clone',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/ai-tts-voice-clone',category:'ai'},
  {id:'brand-monitoring',title:'Brand Monitoring & Fake Domain Detection',description:'Scans global DNS+WHOIS+SSL cert feeds 24/7 for lookalike typosquatting phishing domains targeting your brand. Auto-generates registrar takedown request sent to DNS provider.',features:['Global scan DNS+WHOIS+SSL 24/7','Typosquat + lookalike domain detection','Auto-takedown to registrars + DNS','Alert + dashboard per new domain registered'],benefits:['Stop brand impersonation before scale','Registrar takedowns auto-sent per incident'],pricing:{basic:'29',pro:'99',enterprise:'299'},contactInfo:{website:'/services/brand-monitoring',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/brand-monitoring',category:'ai'},
  {id:'predictive-lead-scoring',title:'Predictive Lead Scoring Model',description:'ML lead scoring: technographics intent signals website pages email engagement ABM data produces rank-ordered lead score with explanation per scoring dimension per lead toward target ICP.',features:['Technographics + intent signal + web engagement','ML model per ICP scoring dimension','ABM target list auto-generated per score tier','CRM sync Salesforce HubSpot Pipedrive'],benefits:['Sales focus on highest-intent leads only','Score explanation per rep for outreach personalization','Cut cold outreach volume 60%'],pricing:{basic:'29',pro:'99',enterprise:'349'},contactInfo:{website:'/services/predictive-lead-scoring',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'ai',href:'/services/predictive-lead-scoring',category:'ai'},
  {id:'ai-conversation-intelligence',title:'Conversation Intelligence & Call Coach',description:'Call transcript analysis: talk-listen ratio, sentiment, intent signals, competitor mentions, pricing cues, action item extraction, CRM autofill, team leaderboard coaching.',features:['Per-call sentiment + intent heatmap','Talk-listen ratio scoring','CRM auto-logging + deal stage update','Competitor mention + pricing cue detection','Personalized rep coaching tip per call'],benefits:['Cut time to productive rep by 50%','Win-rate +15-25% from conversation coaching','CRM data auto-populated no manual entry','Coach entire team at scale with call data'],pricing:{basic:'49',pro:'149',enterprise:'499'},contactInfo:{website:'/services/ai-conversation-intelligence',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/ai-conversation-intelligence',category:'ai'},
  {id:'ai-content-localization',title:'AI Content Localization Engine',description:'Translate and culturally adapt website copy, product catalogs, marketing emails, and documentation into 50+ languages while maintaining brand tone, SEO keywords, and legal compliance per target market.',features:['50+ language translation + cultural adaptation','Brand voice lock consistent tone per guide','SEO keyword transfer to target language','Glossary + term approval workflow','Multi-channel output: web, email, docs'],benefits:['Go global in days not months with consistent quality','Cut localization costs 80% vs agencies','Maintain brand voice in every market','SEO-optimized per-region output'],pricing:{basic:'99',pro:'299',enterprise:'999'},contactInfo:{website:'/services/ai-content-localization',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/ai-content-localization',category:'ai'},
  {id:'ai-legal-redline',title:'AI Legal Document Redlining & Review',description:'Automated contract review against playbooks: flag risky clauses, missing obligations, fee anomalies, and unfavorable T&Cs. Generates redlines + executive summary per document type (MSA, SOW, NDA, EULA).',features:['Clause risk scoring vs your playbook','Missing obligation auto-detection','Fee/price anomaly flagging','Redline stub generation per clause','Executive summary + risk digest'],benefits:['Reduce contract review time 80%','Catch hidden risk clauses before signature','Standardize playbook adherence across contracts','Free senior counsel bandwidth for high-value deals'],pricing:{basic:'299',pro:'799',enterprise:'2499'},contactInfo:{website:'/services/ai-legal-redline',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/ai-legal-redline',category:'ai'},
  {id:'ai-fraud-pattern-analyzer',title:'AI Fraud Pattern Analyzer',description:'Deep behavioral profiling: baseline per user then alerts on anomalous patterns — login geography, transaction velocity, amount/type deviation, withdrawn account signals. Links across accounts to detect ring fraud.',features:['Per-user behavior baseline engine','Multi-signal anomaly scoring','Cross-account ring detection','Geo-velocity + device fingerprint trigger','Slack/PagerDuty webhook for SOC integration'],benefits:['Reduce false-positive fraud alerts by 70%','Catch ring fraud across multiple accounts','Real-time alert to investigation workflow','Minimize customer friction from false blocks'],pricing:{basic:'199',pro:'599',enterprise:'1999'},contactInfo:{website:'/services/ai-fraud-pattern-analyzer',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/ai-fraud-pattern-analyzer',category:'ai'},
  {id:'ai-knowledge-graph',title:'AI Knowledge Graph Builder',description:'Ingest internal docs, wikis, tickets, and code — extract entity relations, build searchable knowledge graph. Surfaces hidden connections: which team owns what, what service is blocked by which team.',features:['Entity extraction + relation graph build','Semantic search across full graph','Impact analysis: what breaks if team X leaves','Auto-updating from new documents + PRs','GraphQL API for custom integrations'],benefits:['Ship onboarding AI that knows your whole org','Surface hidden dependencies before outages','Cut tribal-knowledge lookup time 80%','Build AI that answers complex cross-repo questions'],pricing:{basic:'149',pro:'449',enterprise:'1499'},contactInfo:{website:'/services/ai-knowledge-graph',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/ai-knowledge-graph',category:'ai'},
  {id:'ai-meeting-summarizer-pro',title:'AI Meeting Summarizer & Action Tracker',description:'Record + transcribe with speaker diarization. AI summary: decisions made, action items, owners, deadlines, topic timeline. Auto-pushes to Slack/Asana/Notion/Jira + recurring meeting agenda builder.',features:['Live transcription with speaker diarization','AI summary: decisions + action items + owners','Auto-push to Slack/Asana/Notion/Jira','Recurring meeting agenda from past topics','Sentiment + engagement score per participant'],benefits:['Cut manual meeting notes to zero','No action item lost auto-tracked to completion','Build meeting intelligence over time'],pricing:{basic:'29',pro:'99',enterprise:'399'},contactInfo:{website:'/services/ai-meeting-summarizer-pro',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/ai-meeting-summarizer-pro',category:'ai'},
  {id:'ai-product-analytics',title:'AI Product Analytics & Anomaly Detection',description:'Continuous product analytics: feature adoption funnels, cohort analysis, anomaly detection on key metrics. ML-powered alert when a feature drops in adoption.',features:['Feature adoption funnel per cohort','Anomaly detection on all key metrics','Auto-generated insight weekly reports','Revenue-impact scoring per anomaly','Alert threshold auto-tuning per metric history'],benefits:['Catch feature regressions before revenue impact','Ship product changes with full observability','Reduce time-to-insight from hours to seconds','No black-box analytics — explain every alert'],pricing:{basic:'199',pro:'499',enterprise:'1499'},contactInfo:{website:'/services/ai-product-analytics',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/ai-product-analytics',category:'ai'},
  {id:'ai-revenue-clarity',title:'AI Revenue Clarity & Forecasting',description:'Ingest pipeline, CRM custom objects, deal stages. ML forecasts: probability-adjusted revenue by rep, team, region. Detect stalled deals. Auto-generate pipeline coverage report.',features:['Pipeline ingestion from CRM + custom objects','Revenue forecast probability-adjusted','Stalled-deal early-warning detection','Pipeline coverage score per rep','Revenue-at-risk breakdown per stage'],benefits:['Forecast pipeline revenue within 10% accuracy','Catch stalled deals 2-3 weeks earlier','Remove forecast guesswork with probability-weighted view','Daily pipeline clarity for sales leadership'],pricing:{basic:'99',pro:'349',enterprise:'1099'},contactInfo:{website:'/services/ai-revenue-clarity',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/ai-revenue-clarity',category:'ai'},
  {id:'ai-sentiment-brand-pulse',title:'AI Sentiment & Brand Pulse Monitor',description:'Monitor brand mentions across social, reviews, news, forums. Sentiment trend analysis per region, product, issue. Alert on sentiment spike. Generate weekly brand health executive summary.',features:['Multi-source brand mention ingestion','Sentiment scoring per region + product','Issue spike alert + anomaly detect','Weekly brand health executive summary','Competitor sentiment comparison view'],benefits:['Detect brand crisis within hours not days','Track NPS drivers at scale from unstructured data','Cut brand research from weeks to real-time','Catch product issues before they go viral'],pricing:{basic:'79',pro:'259',enterprise:'799'},contactInfo:{website:'/services/ai-sentiment-brand-pulse',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/ai-sentiment-brand-pulse',category:'ai'},
  {id:'ai-vision-quality-inspection',title:'AI Vision Quality Inspection',description:'Real-time industrial quality inspection: detect defects, scratches, misalignments, dimensional variances on production line via camera. High-speed continuous inspection pass/fail auto-routing.',features:['Multi-angle camera + multi-defect model','Real-time inference sub-50ms latency','Defect heatmap overlay on captured image','Integration with PLC/SCADA/line controller','Pass/fail auto-route to rework or reject'],benefits:['Reduce QC manual labor 90%','100% inspection coverage — no sampling','Catch defects before customer receives','Sub-50ms inference for high-speed production lines'],pricing:{basic:'999',pro:'2499',enterprise:'7999'},contactInfo:{website:'/services/ai-vision-quality-inspection',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/ai-vision-quality-inspection',category:'ai'},
  {id:'predictive-lead-scoring',title:'Predictive Lead Scoring Model',description:'ML lead scoring: technographics, intent signals, web engagement, and ABM data produce a rank-ordered lead score with explanation per scoring dimension. Syncs to Salesforce, HubSpot, and Pipedrive.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/predictive-lead-scoring',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/predictive-lead-scoring',category:'ai'},
  {id:'invoice-ai-automation',title:'AI Invoice Processing & Auto-Posting',description:'Invoice automation: three-way PO matching, OCR line-item extraction, GL coding by vendor and line item, approval workflow per threshold, and ERP auto-post to NetSuite, SAP, or QuickBooks with zero human touch.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/invoice-ai-automation',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/invoice-ai-automation',category:'ai'},
  {id:'doc-intelligence-v2',title:'Intelligent Document Processing v2',description:'Intelligent document processing: layout-aware OCR, handwriting recognition, table extraction, and form auto-fill. Handles invoices, contracts, medical records, and tax forms at 1000 pages per hour via REST.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/doc-intelligence-v2',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/doc-intelligence-v2',category:'ai'},
  {id:'brand-monitoring',title:'Brand Monitoring & Fake Domain Detection',description:'Global DNS, WHOIS, and SSL cert scan 24/7 for lookalike and typosquatting domains targeting your brand. Auto-generates registrar takedown requests with alert and dashboard per newly registered domain.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/brand-monitoring',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/brand-monitoring',category:'ai'},
  {id:'ai-vision-quality-inspection',title:'AI Vision Quality Inspection',description:'Real-time industrial quality inspection: detects defects, scratches, misalignments, and dimensional variances on the production line via camera. High-speed continuous inspection with pass-fail auto-routing.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-vision-quality-inspection',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-vision-quality-inspection',category:'ai'},
  {id:'ai-tts-voice-clone',title:'AI Voice Clone + Text-to-Speech Engine',description:'Zero-shot voice clone: a 30-second audio sample generates a brand-voice clone across 80+ languages. Reads any script with matched prosody for narration, audiobooks, and courses — a consistent brand voice at scale.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-tts-voice-clone',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-tts-voice-clone',category:'ai'},
  {id:'ai-threat-hunting',title:'AI Threat Hunting & Investigation',description:'AI-assisted threat hunting: hypothesis-driven search across SIEM, EDR, network, and cloud logs. Auto-generates hunting queries, correlates anomalies, and produces confirmed incidents with remediation steps.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-threat-hunting',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-threat-hunting',category:'ai'},
  {id:'ai-sentiment-brand-pulse',title:'AI Sentiment & Brand Pulse Monitor',description:'Monitor brand mentions across social, reviews, news, and forums. Sentiment trend per region, product, and issue. Alert on sentiment spike. Weekly brand health executive summary with competitor sentiment comparison.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-sentiment-brand-pulse',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-sentiment-brand-pulse',category:'ai'},
  {id:'ai-sales-coach',title:'AI Sales Coach & Call Analysis',description:'Real-time call analysis: talk-listen ratio, objection handling, competitor mention, pricing signal detection. Recommended next-step per call stage, CRM auto-scorecard, and a team leaderboard of best practices.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-sales-coach',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-sales-coach',category:'ai'},
  {id:'ai-rpa-automation',title:'AI Robotic Process Automation (RPA)',description:'Web, desktop, and mobile RPA: automates mouse and keyboard and form data entry into ERP systems, tax portals, and batch processes. Screen-scrape, scheduler, and audit log per bot. Non-engineers can audit every bot action.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-rpa-automation',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-rpa-automation',category:'ai'},
  {id:'ai-roadmap-strategy',title:'AI Strategy & Roadmap Consulting',description:'Executive AI strategy: opportunity assessment, model selection, custom versus off-the-shelf stack design, data readiness audit, pilot prioritisation, and a 90-day win plan ready for C-level approval.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-roadmap-strategy',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-roadmap-strategy',category:'ai'},
  {id:'ai-revenue-clarity',title:'AI Revenue Clarity & Forecasting',description:'Ingests pipeline, CRM custom objects, and deal stages. ML forecasts probability-adjusted revenue by rep, team, and region. Detects stalled deals and auto-generates pipeline coverage score per rep.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-revenue-clarity',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-revenue-clarity',category:'ai'},
  {id:'ai-retail-personalization',title:'AI Retail Personalization Engine',description:'Offline and online retail: shopper behaviour scoring, real-time offer personalisation, inventory allocation, out-of-stock prevention, basket size optimisation, and store labour scheduling per SKU.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-retail-personalization',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-retail-personalization',category:'ai'},
  {id:'ai-resume-optimizer',title:'AI Resume Optimizer',description:'AI reads resume vs job description: scores ATS compatibility, rewrites bullet points, quantifies achievements, fills keyword gaps. Produces a one-click PDF export and a cover letter draft per application.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-resume-optimizer',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-resume-optimizer',category:'ai'},
  {id:'ai-red-team-automation',title:'AI Red Team Automation',description:'Automated adversary simulation: C2 beaconing, lateral movement, privilege escalation, and data exfiltration mapped to MITRE ATT&CK. Auto-remediation playbooks and continuous on-environment testing.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-red-team-automation',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-red-team-automation',category:'ai'},
  {id:'ai-real-estate-valuation',title:'AI Real Estate Valuation & Analytics',description:'Automated AVM: ingests comps, zoning, property features, and market trends to produce confidence intervals, risk scores, and a comparable sales report. Covers residential and commercial with cap-rate valuation.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-real-estate-valuation',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-real-estate-valuation',category:'ai'},
  {id:'ai-project-planning',title:'AI Project Planning & Scheduling',description:'PM-grade AI: scope to WBS to resource allocation to critical path to risk register to milestone tracking. Syncs to Jira, Asana, and Monday.com. Auto-updates the plan when scope changes.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-project-planning',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-project-planning',category:'ai'},
  {id:'ai-product-analytics',title:'AI Product Analytics & Anomaly Detection',description:'Continuous product analytics: feature adoption funnels, cohort breakdowns, anomaly detection on DAU, MAU, and revenue. ML-powered alert when a feature regresses and auto-generated weekly insight reports.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-product-analytics',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-product-analytics',category:'ai'},
  {id:'ai-procurement',title:'AI Procurement Intelligence',description:'Auto-sources suppliers, compares prices, negotiates contracts, tracks delivery, and manages supplier risk. E-procurement spend analysis, contract management, supplier scorecards, and rogue-spend alerts.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-procurement',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-procurement',category:'ai'},
  {id:'ai-predictive-churn',title:'AI Predictive Churn & Retention',description:'Predicts customer churn 30-90 days before cancellation via an ML model trained on product usage, support tickets, NPS scores, and contract data. Produces a ranked at-risk list with a recommended retention action per account.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-predictive-churn',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-predictive-churn',category:'ai'},
  {id:'ai-pdf-engine',title:'AI PDF Document Engine',description:'Batch PDF ingest, extract, and transform via table layout OCR, handwriting recognition, form auto-fill, and export to DOCX, CSV, or JSON. 99%+ layout fidelity at 1000 pages per hour throughput via REST or webhook.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-pdf-engine',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-pdf-engine',category:'ai'},
  {id:'ai-omnichannel-chatbot',title:'AI Omnichannel Chatbot Platform',description:'One unified bot across 20+ channels: website, WhatsApp, Instagram, SMS, phone call, Slack, and Teams. Shared conversation context per customer, human handoff with full context preserved, channel-consistent brand voice.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-omnichannel-chatbot',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-omnichannel-chatbot',category:'ai'},
  {id:'ai-meeting-summarizer-pro',title:'AI Meeting Summarizer & Action Tracker',description:'Records and transcribes meetings with speaker diarisation. AI summary captures decisions made, action items with owners and due dates, topic timeline. Auto-pushes to Slack, Asana, Notion, and Jira plus a recurring agenda builder.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-meeting-summarizer-pro',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-meeting-summarizer-pro',category:'ai'},
  {id:'ai-legal-research',title:'AI Legal Research Engine',description:'LLM legal research with semantic search across case law, statutes, regulations, SEC filings, and patents. Cited answers with source attribution, law-change alerts per jurisdiction, memo export per research session.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-legal-research',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-legal-research',category:'ai'},
  {id:'ai-legal-redline',title:'AI Legal Document Redlining & Review',description:'Automated contract review against your playbook: flags risky clauses, missing obligations, fee anomalies, and unfavorable T&Cs. Generates redline stubs and an executive summary per MSA, SOW, NDA, or EULA document type.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-legal-redline',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-legal-redline',category:'ai'},
  {id:'ai-knowledge-graph',title:'AI Knowledge Graph Builder',description:'Ingests internal docs, wikis, tickets, and code to extract entity relations and build a searchable knowledge graph. Surfaces hidden dependencies: which team owns what, what service is blocked by which team.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-knowledge-graph',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-knowledge-graph',category:'ai'},
  {id:'ai-job-matcher',title:'AI Job Matcher & Career Path',description:'Two-sided AI: job-seeker resume matched against all open roles, employer candidate profiles matched against job requirements. Fit scores, gap analysis, interview prep, salary benchmark, employer shortlist rankings.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-job-matcher',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-job-matcher',category:'ai'},
  {id:'ai-insurance-pricing',title:'AI Insurance Pricing Advisor',description:'ML-powered insurance pricing advisor: ingests claim history, risk factors, market data to produce per-risk ML pricing model with confidence interval, exposure summary, and benchmark vs competitor rates.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-insurance-pricing',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-insurance-pricing',category:'ai'},
  {id:'ai-growth-intelligence',title:'AI Growth Intelligence Platform',description:'Scans 10K+ growth levers: pricing, positioning, channel mix, funnel, competitor moves. ML ranks highest-ROI experiments per your stage, market, and unit economics. Auto-drafts GTM strategy per priority lever.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-growth-intelligence',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-growth-intelligence',category:'ai'},
  {id:'ai-fullstack-test-generator',title:'AI Full-Stack Test Generator',description:'Reads source code + OpenAPI spec + DB schema and generates unit, integration, and E2E tests for React and Vue components, API endpoints, DB constraints, and auth flows. Targets 90%+ coverage without manual writing.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-fullstack-test-generator',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-fullstack-test-generator',category:'ai'},
  {id:'ai-fraud-pattern-analyzer',title:'AI Fraud Pattern Analyzer',description:'Deep behavioural profiling for fraud: per-user baseline then alerts on anomalous login geography, transaction velocity, amount/type deviation, withdrawn-account signals. Cross-account ring fraud detection.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-fraud-pattern-analyzer',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-fraud-pattern-analyzer',category:'ai'},
  {id:'ai-fedrisk-compliance',title:'AI FedRAMP Compliance Assistant',description:'Maps your cloud and SaaS controls to FedRAMP Rev 5: auto-generates POA&M, tracks continuous monitoring artifacts, produces audit evidence bundles, and delivers readiness gap report before the assessor arrives.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-fedrisk-compliance',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-fedrisk-compliance',category:'ai'},
  {id:'ai-education-adaptive-tutor',title:'AI Adaptive Tutoring System',description:'K-12 adaptive tutoring: mastery-level engine scaffolds strugglers and accelerates performers. Curriculum-standard tagged problems, parent-teacher mastery heatmap. 2-letter-grade improvement validated.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-education-adaptive-tutor',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-education-adaptive-tutor',category:'ai'},
  {id:'ai-drug-interaction-checker',title:'AI Drug Interaction Checker',description:'Real-time 50K+ prescription and OTC interaction checker: contraindications, pregnancy risk alerts, renal dosing adjustments, prescriber and pharmacy workflow alerts, printable patient counseling sheet.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-drug-interaction-checker',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-drug-interaction-checker',category:'ai'},
  {id:'ai-document-classifier',title:'AI Document Classifier',description:'Auto-classifies 99+ document types (invoices, contracts, NDAs, receipts, resumes): routes to correct workflow, extracts key fields, attaches metadata and ACL tags, triggers approval queues.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-document-classifier',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-document-classifier',category:'ai'},
  {id:'ai-cultural-fit-screener',title:'AI Cultural Fit Screener',description:'AI evaluates candidates against your values and behavioral blueprint: culture-fit score, red-flag detection before interview, comparison against top-performing employees, auto-shortlist rationale.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-cultural-fit-screener',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-cultural-fit-screener',category:'ai'},
  {id:'ai-conversation-intelligence',title:'Conversation Intelligence & Call Coach',description:'Call transcript AI: talk-listen ratio, sentiment heatmap, intent detection, competitor mention flagging, pricing cue detection. CRM auto-logging, deal stage update, personalized rep coaching per call.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-conversation-intelligence',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-conversation-intelligence',category:'ai'},
  {id:'ai-cloud-cost-optimizer',title:'AI Cloud Cost Optimizer',description:'ML-powered cloud cost optimizer: continuously rightsizes VMs, containers, serverless across AWS/GCP/Azure — reducing cloud spend 30-50% with zero manual intervention via smart scaling policies.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-cloud-cost-optimizer',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-cloud-cost-optimizer',category:'ai'},
];

export const itServices: Service[] = [  {
    id: 'it-endpoint-management-macos-windows',
    title: 'Endpoint Management (macOS & Windows)',
    description: 'Unified MDM for macOS and Windows: Zero-touch enrolment, OS update enforcement, full-disk encryption, compliance, remote wipe.',
    icon: '★',
    features: ['Zero-touch (DEP/Autopilot) + self-enrol portal', 'OS update enforcement patch policy', 'Full-disk encryption + TLS 1.3 VPN settings', 'Remote wipe + lost-device-geofence'],
    benefits: ['Onboard 1000 endpoints in one afternoon', 'No manual image builds — DEP does the work', 'Security baseline enforced at enrolment', 'Compliance dashboard per device/team'],
    pricing: {'basic': '1499', 'pro': '3499', 'enterprise': '9999'},
    contactInfo: { website: '/services/it-endpoint-management-macos-windows', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/it-endpoint-management-macos-windows',
    category: 'it',
    popular: false,
  },
  {
    id: 'it-identity-access-management-sso',
    title: 'Identity & Access Management (SSO/MFA)',
    description: 'SSO (SAML 2.0/OIDC), adaptive MFA (TOTP/WebAuthn/risk-based), SCIM auto-provision/revoke, JIT privileged-access.',
    icon: '★',
    features: ['SSO (SAML 2.0 + OIDC) for all SaaS apps', 'Adaptive MFA (TOTP/WebAuthn/risk-based)', 'SCIM auto-provision + de-provision per hire/fire', 'JIT privileged-access, session recorded'],
    benefits: ['One password for every app, no helpdesk reset', 'MFA adaptive = frictionless for low-risk', 'SCIM = no stale accounts or manual sync', 'Least-privilege by default, just-in-time allow'],
    pricing: {'basic': '799', 'pro': '1999', 'enterprise': '5999'},
    contactInfo: { website: '/services/it-identity-access-management-sso', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/it-identity-access-management-sso',
    category: 'it',
    popular: false,
  },
  {
    id: 'it-cloud-cost-management-platform',
    title: 'Cloud Cost Management Platform',
    description: 'Multi-cloud cost visibility, rightsizing recommendations, RI/SA coverage gap, budget alert, chargeback/showback per team.',
    icon: '★',
    features: ['Multi-cloud cost break-down (EC2/RDS/Lambda etc.)', 'Rightsizing recommendation engine (>50% CPU idle)', 'RI/SA coverage gap alert + expiry tracker', 'Chargeback/showback per team/project'],
    benefits: ['Reduce cloud spend 30-40% with no effort', 'Prevent over-provisioned cluster always running', 'Never miss a RI/SA renewal deadline', 'Cloud spend allocated fairly each month'],
    pricing: {'basic': '1499', 'pro': '3499', 'enterprise': '9999'},
    contactInfo: { website: '/services/it-cloud-cost-management-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/it-cloud-cost-management-platform',
    category: 'it',
    popular: false,
  },
  {
    id: 'it-network-firewall-next-generation',
    title: 'Next-Generation Firewall',
    description: 'Layer-7 NGFW with IDS/IPS, deep packet inspection, SSL decryption, geo-IP block, zero-day threat feed, and cloud-firewall auto-sync.',
    icon: '★',
    features: ['Layer-7 IDS/IPS with Suricata rules', 'Deep packet inspection + SSL/TLS decryption', 'Threat intelligence feed (10K+ IOC feed)', 'Cloud firewall auto-sync (AWS/Azure/GCP)'],
    benefits: ['Detect and block advanced network attacks', 'Inspect HTTPS traffic, not just port 443', 'Geo-block + zero-day feed always fresh', 'Cloud firewall config = single pane of glass'],
    pricing: {'basic': '2999', 'pro': '6999', 'enterprise': '19999'},
    contactInfo: { website: '/services/it-network-firewall-next-generation', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/it-network-firewall-next-generation',
    category: 'it',
    popular: false,
  },
  {
    id: 'it-devops-platform-toolchain',
    title: 'DevOps Platform & Unified Toolchain',
    description: 'One DevOps portal: CI/CD, artifact repo, Terraform Cloud, GitOps ops config, artifact SBOM, and full audit log per pipeline.',
    icon: '★',
    features: ['CI/CD pipelines per repo/branch', 'Artifact registry + SBOM auto-generated', 'Terraform Cloud/Enterprise workspace sync', 'Unified ops audit log per pipeline build'],
    benefits: ['Unify 12 tools into 1 DevOps portal', 'CI/CD + registry + infra in one unified UI', 'Terraform state managed, zero drift', 'Full audit trail meets compliance every time'],
    pricing: {'basic': '2499', 'pro': '5999', 'enterprise': '17999'},
    contactInfo: { website: '/services/it-devops-platform-toolchain', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/it-devops-platform-toolchain',
    category: 'it',
    popular: false,
  },
  {
    id: 'it-help-desk-glucidex',
    title: 'IT Help Desk (AI-Powered)',
    description: 'AI triage + KB auto-resolution, ticket routing, asset CMDB auto-link, and agent copilot with runbook-snippet suggestion per ticket.',
    icon: '★',
    features: ['AI triage auto-categorise ticket', 'KB article suggestion per ticket similarity', 'Auto-routing to correct team/queue', 'Agent copilot with runbook snippet per ticket'],
    benefits: ['50%+ self-serve without human agent', 'Triage time from minutes to seconds', 'Categorise ticket = correct queue on first try', 'Agent copilot = fewer escalations, faster close'],
    pricing: {'basic': '299', 'pro': '799', 'enterprise': '2499'},
    contactInfo: { website: '/services/it-help-desk-glucidex', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/it-help-desk-glucidex',
    category: 'it',
    popular: false,
  },
  {
    id: 'it-remote-collaboration-suites',
    title: 'Remote Collaboration Suite',
    description: 'Video meetings, persistent team chat, screen/annotation, whiteboard, file sharing, and calendar sync across 15+ SaaS tools.',
    icon: '★',
    features: ['HD video meetings + network adaptivity', 'Persistent team chat + threaded topic', 'In-meeting whiteboard + live annotation', 'Calendar sync + async video update per thread'],
    benefits: ['Distributed teams collaborate seamlessly', 'HD video with no manual bandwidth config', 'Weekly async update replaces all-hands', 'Screen share + annotation without leaving app'],
    pricing: {'basic': '99', 'pro': '249', 'enterprise': '999'},
    contactInfo: { website: '/services/it-remote-collaboration-suites', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/it-remote-collaboration-suites',
    category: 'it',
    popular: false,
  },
  {
    id: 'it-backup-disaster-recovery',
    title: 'Backup & Disaster Recovery Platform',
    description: 'Image-level backup (filesystem/DB/bare-metal), continuous replication with RPO sub-15 min, one-click full restore drill per server.',
    icon: '★',
    features: ['Image-level block/snapshot incremental backup', 'Continuous replication RPO sub-15 min', 'One-click bare-metal restore = confirmed drill', 'Test-restore sandbox per schedule, no production impact'],
    benefits: ['Recover from any disaster in minutes, not hours', 'RPO 0 with continuous replication', 'Drill restores quarterly = confidence in DR', 'No more backup tape management headaches'],
    pricing: {'basic': '1999', 'pro': '4999', 'enterprise': '14999'},
    contactInfo: { website: '/services/it-backup-disaster-recovery', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/it-backup-disaster-recovery',
    category: 'it',
    popular: false,
  },
  {
    id: 'it-e-commerce-platform-advisor',
    title: 'E-Commerce Platform Advisor',
    description: 'Platform selection, headless storefront implementation, payments integration, and Shopify/BigCommerce/Salesforce Commerce migration guidance.',
    icon: '★',
    features: ['Platform selection (Shopify/BigCommerce/Salesforce)', 'Headless storefront (Next.js/Hydrogen)', 'Payment integration (Stripe/Square/PayPal)', 'Migration plan minimise downtime maximise SEO transfer'],
    benefits: ['Launch e-commerce platform in 30 days', 'Headless = best-of-breed frontend + backend', 'Personalised product recommendations', 'Migration plan maximises SEO equity preserved'],
    pricing: {'basic': '3999', 'pro': '9999', 'enterprise': '29999'},
    contactInfo: { website: '/services/it-e-commerce-platform-advisor', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/it-e-commerce-platform-advisor',
    category: 'it',
    popular: false,
  },
  {
    id: 'it-business-intelligence-cockpit',
    title: 'Business Intelligence Cockpit',
    description: 'Executive BI dashboard connecting ERP/CRM/HRIS: revenue run-rate, headcount cost, CAC/LTV, NRR, runway, and scenario modelling.',
    icon: '★',
    features: ['Automated data connection ERP/CRM/HRIS/ADP', 'Executive KPI cards + drill-through detail', 'Scenario modelling (what-if sliders)', 'Scheduled PDF/email executive pack per week'],
    benefits: ['Executive team gets answers without analyst', 'KPI drill-through without manual Excel', 'Scenario modelling shows impact before it happens', 'Replace 10 manual Excel reports automatically'],
    pricing: {'basic': '2499', 'pro': '5999', 'enterprise': '17999'},
    contactInfo: { website: '/services/it-business-intelligence-cockpit', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/it-business-intelligence-cockpit',
    category: 'it',
    popular: false,
  },

{
    id: 'accessibility-compliance',
    title: 'Accessibility & WCAG Compliance',
    description: 'Automated WCAG 2.2 auditing, AI-powered remediation suggestions, screen reader simulation, and continuous accessibility compliance monitoring.',
    features: ['WCAG 2.2 AA/AAA automated auditing', 'Screen reader simulation & navigation testing', 'Auto-generated remediation code snippets', 'Color contrast & typography analysis', 'Continuous CI/CD accessibility gates'],
    benefits: ['Reduce ADA lawsuit risk substantially', 'Improve UX for all users', 'Automated compliance reporting', 'Proactive CI/CD testing integration'],
    pricing: { basic: '999', pro: '2499', enterprise: '5999' },
    contactInfo: { website: '/services/accessibility-compliance', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '♿',
    href: '/services/accessibility-compliance',
    category: 'it'
  }
,
{
    id: 'ai-it-helpdesk',
    title: 'AI IT Helpdesk & Support',
    description: 'Automated Tier-1 IT support for employees: password resets, software installs, device troubleshooting, and knowledge base search.',
    features: [
      'Automated ticket creation & routing',
      'Knowledge base search with semantic understanding',
      'Password reset & MFA enrollment automation',
      'Software request fulfillment workflows',
      'Hardware troubleshooting decision trees'
    ],
    benefits: [
      'Resolve 70% of tickets without human agent',
      'Reduce helpdesk staffing costs by 60%',
      'Instant employee support 24/7',
      'Consistent, documented resolutions'
    ],
    pricing: {
      basic: '299',
      pro: '699',
      enterprise: '1899'
    },
    contactInfo: {
      website: '/services/ai-it-helpdesk',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🖥️',
    href: '/services/ai-it-helpdesk',
    category: 'ai'
   }
,
{
    id: 'api-gateway-management',
    title: 'API Gateway & Management',
    description: 'Secure, scale, and monitor your APIs with enterprise-grade gateway management, rate limiting, and developer portal.',
    features: [
      'Unified API gateway',
      'Rate limiting & quotas',
      'API key management',
      'Developer portal',
      'Analytics & tracing'
    ],
    benefits: [
      'Monetize API access',
      'Reduce security risk',
      'Accelerate integration',
      'Full API observability'
    ],
    pricing: {
      basic: '199',
      pro: '699',
      enterprise: '2499'
    },
    contactInfo: {
      website: '/services/api-gateway-management',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔌',
    href: '/services/api-gateway-management',
    category: 'it'
  }
,
{
    id: 'api-integration',
    title: 'API Development & Integration',
    description: 'Custom API design, development, and integration — REST, GraphQL, Webhooks, and third-party service connectors.',
    features: [
      'RESTful & GraphQL API design',
      'Third-party API integrations',
      'Webhook architecture & event systems',
      'API gateway & rate limiting',
      'API documentation & versioning (OpenAPI/Swagger)'
    ],
    benefits: [
      'Seamless system interoperability',
      'Reduced development time by 50%',
      'Future-proof API architecture',
      'Automated API documentation'
    ],
    pricing: {
      basic: '1499',
      pro: '3999',
      enterprise: '8999'
    },
    contactInfo: {
      website: '/services/api-integration',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔗',
    href: '/services/api-integration',
    category: 'it'
  }
,
{
    id: 'api-management-gateway',
    title: 'API Management & Developer Gateway',
    description: 'Full-lifecycle API management: gateway, developer portal, analytics, monetization, and security (OAuth, JWT, rate limiting) for your API products.',
    features: [
      'High-performance API gateway (10k+ RPS)',
      'Developer self-service portal',
      'Analytics: usage, latency, errors',
      'API monetization & billing integration',
      'Security: OAuth2, JWT validation, rate limiting'
    ],
    benefits: [
      'Launch API products 5x faster',
      'Monitor & debug API issues in real-time',
      'Protect backend services from abuse',
      'Revenue stream from API usage'
    ],
    pricing: {
      basic: '499',
      pro: '1199',
      enterprise: '3599'
    },
    contactInfo: {
      website: '/services/api-management-gateway',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔌',
    href: '/services/api-management-gateway',
    category: 'it'
  },
  {
    id: 'apm-application-performance',
    title: 'APM Application Performance',
    description: 'Deep-dive application performance monitoring with distributed tracing, slow query dashboards, error tracking, and SLO/SLI burn-rate alerting.',
    features: [
      'Distributed traces per request',
      'Slow query / endpoint dashboard',
      'Error tracking with stack',
      'SLO burn-rate alerting',
      'Service map dependency view'
    ],
    benefits: [
      'Find slow requests in seconds',
      'Link errors to deploys',
      'Meet SLO reliability targets',
      'Reduce MTTR by 60%'
    ],
    pricing: {
      basic: '0',
      pro: '99',
      enterprise: '699'
    },
    contactInfo: {
      website: '/services/apm-application-performance',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📈',
    href: '/services/apm-application-performance',
    category: 'it'
  }
,
{
    id: 'cloud-cost-ai-optimizer',
    title: 'AI Cloud Cost Optimizer',
    description: 'Continuously analyze cloud spend (AWS, Azure, GCP) and automatically implement cost-saving actions: rightsizing, reserved instances, spot instance switching, and idle resource cleanup.',
    features: [
      'Multi-cloud cost aggregation & normalization',
      'AI-driven rightsizing recommendations',
      'Automated RI/SP purchase optimization',
      'Idle resource detection & auto-cleanup',
      'Anomaly detection & budget alerts'
    ],
    benefits: [
      'Save 30-40% on cloud spend',
      'Zero upfront engineering effort',
      'Prevent cost overruns proactively',
      'Detailed cost attribution by team/project'
    ],
    pricing: {
      basic: '299',
      pro: '699',
      enterprise: '1999'
    },
    contactInfo: {
      website: '/services/cloud-cost-ai-optimizer',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '💸',
    href: '/services/cloud-cost-ai-optimizer',
    category: 'it'
  }
,
{
    id: 'cloud-finops-1',
    title: 'Cloud FinOps & Cost Intelligence',
    description: 'Comprehensive cloud cost management service combining automated tooling, reserved instance optimization, anomaly detection, and organizational FinOps culture to reduce cloud spend by 30-40% without performance impact.',
    features: [
      'Multi-cloud cost visibility and chargeback/showback',
      'AI-driven rightsizing recommendations',
      'Automated reserved instance and savings plan optimization',
      'Real-time cost anomaly detection and budget alerts',
      'Kubernetes cost optimization (HPA, node optimization)',
      'Tag governance and resource ownership tracking',
      'FinOps maturity assessment and roadmap',
      'Monthly cost optimization reviews and savings tracking',
    ],
    benefits: [
      'Reduce cloud spend by 30-40% sustainably',
      'Eliminate cloud waste and orphaned resources',
      'Allocate costs accurately to teams and projects',
      'Build a culture of cloud cost awareness',
    ],
    pricing: {
      basic: '$999/mo',
      pro: '$3,499/mo',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/cloud-finops-1',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '💻',
    href: '/services/cloud-finops-1',
    category: 'it'
  }
,
{
    id: 'cyber-threat-intelligence',
    title: 'AI Cyber Threat Intelligence Platform',
    description: 'Proactive threat intelligence gathering, analysis, and prioritization from dark web, exploit feeds, and threat actor TTPs to stay ahead of attacks.',
    features: [
      'Automated threat feed ingestion (50+ sources)',
      'AI-driven threat prioritization (impact scoring)',
      'IOC & TTP matching against your environment',
      'Dark web monitoring for leaked credentials',
      'Executive threat briefings & reporting'
    ],
    benefits: [
      'Reduce mean time to detect (MTTD) by 70%',
      'Prevent credential-based attacks',
      'Prioritize fixes based on actual risk',
      'Compliance-ready audit trails'
    ],
    pricing: {
      basic: '599',
      pro: '1399',
      enterprise: '3999'
    },
    contactInfo: {
      website: '/services/cyber-threat-intelligence',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🛡️',
    href: '/services/cyber-threat-intelligence',
    category: 'it'
  }
,
{
    id: 'data-warehouse-modernization',
    title: 'AI Data Warehouse Modernization',
    description: 'Modernize legacy data warehouses (Oracle, Teradata, on-prem) to cloud-native solutions (Snowflake, BigQuery, Redshift) with AI-assisted schema mapping and migration validation.',
    features: [
      'Legacy schema extraction & analysis',
      'AI-powered schema mapping to target',
      'Automated ETL/ELT pipeline generation',
      'Data lineage & impact analysis',
      'Post-migration validation & reconciliation'
    ],
    benefits: [
      '60% faster migration timelines',
      'Zero data loss guarantee',
      '50% lower TCO vs traditional consultancies',
      'Future-proof cloud-native architecture'
    ],
    pricing: {
      basic: '1499',
      pro: '3499',
      enterprise: '9999'
    },
    contactInfo: {
      website: '/services/data-warehouse-modernization',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🗄️',
    href: '/services/data-warehouse-modernization',
    category: 'it'
  }
,
{
    id: 'database-optimization',
    title: 'Database Optimization & Management',
    description: 'Database performance tuning, query optimization, migration, and high-availability clustering for PostgreSQL, MySQL, MongoDB, and more.',
    features: [
      'Query performance analysis & optimization',
      'Database schema design & migration',
      'High-availability & replication setup',
      'Automated backup & disaster recovery',
      'Index optimization & caching strategies'
    ],
    benefits: [
      'Up to 10x query performance improvement',
      'Zero data loss with automated backups',
      '99.99% database uptime',
      'Cost-efficient resource utilization'
    ],
    pricing: {
      basic: '1499',
      pro: '3499',
      enterprise: '7999'
    },
    contactInfo: {
      website: '/services/database-optimization',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🗄️',
    href: '/services/database-optimization',
    category: 'data'
  },
  {
    id: 'db-migration-service',
    title: 'Database Migration Service',
    description: 'Homogeneous and heterogeneous database migrations — on-prem to cloud, between engines (Oracle→Postgres, MySQL→CockroachDB) with zero-downtime cutovers.',
    features: [
      'Homogeneous + heterogeneous moves',
      'Online replication with CDC',
      'Schema compatibility analyzer',
      'Rollback automation',
      'Performance validation'
    ],
    benefits: [
      'Zero-downtime cutover',
      'Any engine supported',
      'No vendor lock',
      'Validated in dry-run first'
    ],
    pricing: {
      basic: '99',
      pro: '399',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/services/db-migration-service',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔄',
    href: '/services/db-migration-service',
    category: 'it'
  }
,
{
    id: 'devops-gen-ai-ci-cd',
    title: 'Generative AI for DevOps & CI/CD',
    description: 'AI-powered DevOps: auto-generate CI/CD pipelines, infrastructure-as-code, deployment scripts, and incident runbooks from natural language specifications.',
    features: [
      'Natural language to pipeline generation',
      'IaC template creation (Terraform, CloudFormation)',
      'Automated incident runbook drafting',
      'Self-healing deployment rollbacks',
      'Performance anomaly detection & tuning'
    ],
    benefits: [
      'Reduce pipeline setup time by 85%',
      'Eliminate configuration drift',
      'Faster incident resolution (MTTR)',
      'Consistent infrastructure standards'
    ],
    pricing: {
      basic: '499',
      pro: '1099',
      enterprise: '3299'
    },
    contactInfo: {
      website: '/services/devops-gen-ai-ci-cd',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔄',
    href: '/services/devops-gen-ai-ci-cd',
    category: 'it'
  }
,
{
    id: 'endpoint-management',
    title: 'Unified Endpoint Management (UEM)',
    description: 'Manage and secure all devices (laptops, mobile, IoT) from a single dashboard: enrollment, policy enforcement, patch management, and remote wipe.',
    features: [
      'Cross-platform device enrollment (Windows, macOS, iOS, Android, Linux)',
      'Automated patch & update deployment',
      'Endpoint detection & response (EDR)',
      'Application whitelisting & app catalog',
      'Remote lock, wipe, and geofencing'
    ],
    benefits: [
      'Reduce endpoint management overhead by 80%',
      'Enforce security policy compliance automatically',
      'Fast incident response across device fleet',
      'Support BYOD securely'
    ],
    pricing: {
      basic: '299',
      pro: '699',
      enterprise: '1999'
    },
    contactInfo: {
      website: '/services/endpoint-management',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '💻',
    href: '/services/endpoint-management',
    category: 'it'
  }
,
{
    id: 'enterprise-backup-dr',
    title: 'Enterprise Backup & Disaster Recovery',
    description: 'Comprehensive data protection with automated backups, instant recovery, ransomware protection, and geo-redundant storage.',
    features: ['Automated backup scheduling', 'Point-in-time recovery', 'Ransomware detection and isolation', 'Geo-redundant replication', 'Compliance-ready retention policies'],
    benefits: ['Achieve 99.99% data durability', 'Meet RPO/RTO SLA targets', 'Protect against ransomware', 'Ensure business continuity'],
    pricing: { basic: '299', pro: '799', enterprise: '2499' },
    contactInfo: { website: '/services/enterprise-backup-dr', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💾',
    href: '/services/enterprise-backup-dr',
    category: 'it'
  }
,
{
    id: 'etl-pipeline-optimization',
    title: 'ETL Pipeline Optimization & Modernization',
    description: 'Accelerate and stabilize data pipelines (batch & streaming): refactor legacy ETL, migrate to Airflow/DBT, add observability, and reduce cost.',
    features: [
      'Pipeline bottleneck analysis & profiling',
      'Code refactoring & parallelization',
      'Migration to cloud-native (Glue, Dataflow, Flink)',
      'Data quality checks & anomaly detection',
      'Cost optimization (spot instances, auto-scaling)'
    ],
    benefits: [
      'Cut pipeline runtime by 70%',
      'Reduce data engineering maintenance burden',
      'Improve data freshness & reliability',
      'Lower cloud processing costs'
    ],
    pricing: {
      basic: '899',
      pro: '2099',
      enterprise: '5999'
    },
    contactInfo: {
      website: '/services/etl-pipeline-optimization',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔄',
    href: '/services/etl-pipeline-optimization',
    category: 'it'
  }
,
{
    id: 'incident-response-retainer',
    title: 'Incident Response Retainer (IR)',
    description: '24/7 on-call incident response for security breaches, ransomware, and major outages: forensic analysis, containment, eradication, and recovery.',
    features: [
      '24/7 on-call IR team (SANS-certified)',
      'Forensic evidence collection & chain of custody',
      'Containment & eradication planning',
      'Post-incident root cause analysis (RCA)',
      'Executive communication & regulatory reporting'
    ],
    benefits: [
      'Minimize breach impact & downtime',
      'Meet regulatory reporting deadlines (72h)',
      'Preserve evidence for legal action',
      'Build long-term resilience with RCA'
    ],
    pricing: {
      basic: '2499',
      pro: '5999',
      enterprise: '19999'
    },
    contactInfo: {
      website: '/services/incident-response-retainer',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🚑',
    href: '/services/incident-response-retainer',
    category: 'it'
   }
,
{
    id: 'it-apisec-testing',
    title: 'API Security Testing',
    description: `Automated security scans for REST, GraphQL, and gRPC APIs. Detects OWASP API Top 10 vulnerabilities and provides remediation code snippets.`,
    features: ["DAST + SCA for APIs", "Authentication flaw detection", "Rate-limiting & throttling tests", "CI/CD pipeline integration"],
    benefits: ["Prevents data breaches via API", "Meets PCI & HIPAA API requirements", "Finds bugs before production"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/services/it-apisec-testing',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔐',
    href: '/services/it-apisec-testing',
    category: 'it'
  },
  {
    id: 'it-asset-lifecycle',
    title: 'IT Asset Lifecycle Manager',
    description: 'Track hardware and software assets from procurement to disposal. Auto-discovery, compliance tracking, depreciation schedules, and end-of-life automation in one dashboard.',
    features: [
      'Auto-discovery of network assets',
      'Compliance and licence tracking',
      'Depreciation schedule engine',
      'End-of-life automation',
      'Audit-ready reporting',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$149',
      pro: '$298',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/it-asset-lifecycle',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '💻',
    href: '/services/it-asset-lifecycle',
    category: 'it',
  }
,
{
    id: 'it-automated-incident-response',
    title: 'Automated Incident Response (SOAR)',
    description: `Security Orchestration, Automation & Response platform that auto-remediates 40% of Tier-1 incidents using playbooks and AI decisioning.`,
    features: ["Pre-built playbooks (phishing, malware, IAM)", "Integration with 200+ security tools", "Case management & audit trail", "AI-assisted triage suggestions"],
    benefits: ["Cuts incident response time from hours to minutes", "Reduces SOC analyst fatigue", "Improves compliance posture"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/services/it-automated-incident-response',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🚨',
    href: '/services/it-automated-incident-response',
    category: 'it'
  }
,
{
    id: 'it-blockchain-development',
    title: 'Blockchain Development & Smart Contract Auditing',
    description: 'End-to-end blockchain solution development — smart contract creation, security auditing, tokenomics design, and Web3 integration for enterprises.',
    features: ['Smart contract development and deployment', 'Formal verification and security auditing', 'Tokenomics and governance design', 'DeFi protocol integration and development', 'Enterprise blockchain consulting and strategy'],
    benefits: ['Launch secure blockchain products faster', 'Prevent exploits with formal verification', 'Access decentralized finance opportunities', 'Enterprise-grade blockchain integration'],
    pricing: { basic: '4999', pro: '9999', enterprise: '24999' },
    contactInfo: { website: '/services/blockchain-development', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⛓️',
    href: '/services/it-blockchain-development',
    category: 'it'
  }
,
{
    id: 'it-business-continuity-dr',
    title: 'Business Continuity & Disaster Recovery',
    description: `Automated backup, replication, and failover orchestration across cloud and on-premise. RPOs as low as 15 seconds, RTOs under 5 minutes.`,
    features: ["Application-consistent backups", "Cross-region replication", "Automated failover testing", "DR runbook automation", "Compliance (ISO 27001, SOC 2)"],
    benefits: ["Guaranteed uptime", "Minimize data loss", "Pass DR audits"],
    pricing: {"basic":"349","pro":"799","enterprise":"2099"},
    contactInfo: {
      website: '/services/it-business-continuity-dr',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔄',
    href: '/services/it-business-continuity-dr',
    category: 'it'
  },
  {
    id: 'it-change-risk-analyser',
    title: 'IT Change Risk Analyser',
    description: 'Assess change request risk using historical data, blast-radius modelling, and ML-predicted outage probability. Integrates with ServiceNow and Jira change management.',
    features: [
      'Blast-radius graph builder',
      'ML-predicted outage probability',
      'Change approval workflow',
      'Historical change success rate',
      'SLA impact calculator',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$229',
      pro: '$458',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/it-change-risk-analyser',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '⚡',
    href: '/services/it-change-risk-analyser',
    category: 'it',
  },
  {
    id: 'it-cloud-compliance-scanner',
    title: 'IT Cloud Compliance Scanner',
    description: 'Continuous cloud infrastructure compliance scanning for AWS, Azure, and GCP against CIS, NIST, HIPAA, and PCI-DSS benchmarks.',
    features: [
      'CIS and NIST benchmark library',
      'Multi-cloud account scanning',
      'NIST 800-53 and HIPAA profiles',
      'Continuous daily compliance scans',
      'Auto-generated remediation tickets',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$179',
      pro: '$358',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/it-cloud-compliance-scanner',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '☁️',
    href: '/services/it-cloud-compliance-scanner',
    category: 'it',
  }
,
{
    id: 'it-cloud-native-storage',
    title: 'Cloud-Native Storage Optimizer',
    description: `Automated storage tiering, snapshot management, and cost optimization for AWS S3, EBS, Azure Blob, GCP Cloud Storage.`,
    features: ["Lifecycle policy automation", "Intelligent tiering (Intelligent-Tiering, Glacier)", "Snapshot retention policies", "Cost anomaly detection", "Capacity forecasting"],
    benefits: ["Reduce storage costs by 60%", "Never run out of space", "Optimize performance tiers"],
    pricing: {"basic":"149","pro":"399","enterprise":"999"},
    contactInfo: {
      website: '/services/it-cloud-native-storage',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '💾',
    href: '/services/it-cloud-native-storage',
    category: 'it'
  }
,
{
    id: 'it-consulting',
    title: 'IT Strategy & Digital Transformation Consulting',
    description: 'Strategic technology consulting — digital transformation roadmaps, tech stack evaluation, and CTO-as-a-service.',
    features: [
      'Technology stack assessment & recommendations',
      'Digital transformation roadmap',
      'CTO-as-a-service (fractional)',
      'Vendor evaluation & selection',
      'Technical due diligence for M&A'
    ],
    benefits: [
      'Data-driven technology decisions',
      'Reduce wasted spend on wrong tools',
      'Accelerate digital transformation by 2x',
      'Access to C-level technical expertise'
    ],
    pricing: {
      basic: '2499',
      pro: '5999',
      enterprise: '14999'
    },
    contactInfo: {
      website: '/services/it-consulting',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '💡',
    href: '/services/it-consulting',
    category: 'it'
  }
,
{
    id: 'it-data-lakehouse-governance',
    title: 'Data Lakehouse Governance',
    description: `Metadata management, lineage tracking, and access controls for Delta Lake, Apache Iceberg, or Snowflake environments.`,
    features: ["Automated data catalog", "Column-level lineage", "Policy-based access control (RBAC/ABAC)", "Quality scorecard per dataset"],
    benefits: ["Accelerates data discovery", "Ensures regulatory compliance (GDPR, CCPA)", "Reduces data swamp risk"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/services/it-data-lakehouse-governance',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🗄️',
    href: '/services/it-data-lakehouse-governance',
    category: 'it'
  }
,
{
    id: 'it-data-warehouse-modernization',
    title: 'Data Warehouse Modernization',
    description: `Migration from legacy data warehouses (Oracle, Teradata) to modern cloud-native stacks (Snowflake, BigQuery, Databricks) with zero downtime.`,
    features: ["Schema conversion tools", "ETL/ELT pipeline rebuild", "Query optimization", "Training for data team"],
    benefits: ["Lowers TCO by 40\u201360%", "Enables self-service analytics", "Scales compute & storage independently"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/services/it-data-warehouse-modernization',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🏢',
    href: '/services/it-data-warehouse-modernization',
    category: 'it'
  }
,
{
    id: 'it-devsecops-1',
    title: 'DevSecOps & Security Automation',
    description: 'Embed security into CI/CD pipelines with automated SAST, DAST, SCA, container scanning, and infrastructure-as-code security checks — shifting security left without slowing delivery.',
    features: [
      'Automated SAST/DAST scanning in CI/CD',
      'Software composition analysis (SCA) for dependencies',
      'Container and Kubernetes security scanning',
      'Infrastructure-as-code security validation (Terraform, CloudFormation)',
      'Secrets detection and rotation automation',
      'SBOM generation and vulnerability tracking',
      'Threat modeling automation',
      'Compliance-as-code policy enforcement',
    ],
    benefits: [
      'Catch vulnerabilities 10x earlier and 100x cheaper',
      'Automate compliance evidence collection',
      'Deploy faster with confidence, not fear',
      'Reduce security incident risk by 80%',
    ],
    pricing: {
      basic: '$1,499/mo',
      pro: '$4,999/mo',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/it-devsecops-1',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '💻',
    href: '/services/it-devsecops-1',
    category: 'it'
  }
,
{
    id: 'it-digital-workplace-platform',
    title: 'Digital Workplace Platform',
    description: `Unified intranet, collaboration, and employee apps (Microsoft 365 + Google Workspace + Slack) with streamlined onboarding and automated license management.`,
    features: ["Self-service IT catalog", "Automated employee lifecycle (joiner/mover/leaver)", "License optimization engine", "Employee sentiment surveys"],
    benefits: ["Reduces SaaS sprawl", "Cuts license costs by 20%", "Improves employee satisfaction"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/services/it-digital-workplace-platform',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '💼',
    href: '/services/it-digital-workplace-platform',
    category: 'it'
  }
,
{
    id: 'it-disaster-recovery',
    title: 'Disaster Recovery & Business Continuity',
    description: 'Comprehensive disaster recovery planning, automated failover systems, and business continuity solutions ensuring zero data loss and minimal downtime for mission-critical operations.',
    features: ['RTO/RPO analysis & recovery strategy design', 'Multi-region backup & replication automation', 'Automated failover testing & validation', 'Runbook creation & disaster response playbooks', 'Continuous compliance monitoring for DR readiness'],
    benefits: ['Guarantee 99.99% uptime with automated failover', 'Reduce recovery time from days to minutes', 'Pass compliance DR audits on first attempt', 'Protect brand reputation with always-on services'],
    pricing: { basic: '699', pro: '1599', enterprise: '3499' },
    contactInfo: { website: '/services/disaster-recovery', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔄',
    href: '/services/it-disaster-recovery',
    category: 'cloud'
  }
,
{
    id: 'it-edge-computing-deploy',
    title: 'Edge Computing Deployment',
    description: `Deploys containerized workloads to global edge locations (Cloudflare Workers, Fastly Compute, AWS Lambda@Edge) for sub-10ms latency.`,
    features: ["Multi-provider edge orchestration", "Edge cache strategy design", "Local data residency compliance", "Edge function monitoring"],
    benefits: ["Reduces API latency by 60\u201380%", "Improves global user experience", "Lowers origin server load"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/services/it-edge-computing-deploy',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🌍',
    href: '/services/it-edge-computing-deploy',
    category: 'it'
  }
,
{
    id: 'it-edge-computing-orchestration',
    title: 'Edge Computing Orchestration',
    description: `Deploy and manage containerized workloads across distributed edge nodes. Auto-scaling, zero-trust networking, and offline sync for true edge-native applications.`,
    features: ["Multi-cluster management", "GitOps-driven deployment", "Edge-native storage", "Offline-first sync", "Observability across regions"],
    benefits: ["Sub-10ms latency for local users", "Reduce cloud egress costs by 70%", "Operate\u54ea\u6015\u7f51\u7edc\u4e2d\u65ad"],
    pricing: {"basic":"349","pro":"799","enterprise":"2099"},
    contactInfo: {
      website: '/services/it-edge-computing-orchestration',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🌍',
    href: '/services/it-edge-computing-orchestration',
    category: 'it'
  }
,
{
    id: 'it-endpoint-detection-response',
    title: 'Managed Endpoint Detection & Response (EDR)',
    description: `24/7 monitored EDR service with threat hunting, ransomware rollback, and 15-minute SLA for critical alerts. Includes managed SOC.`,
    features: ["Next-gen antivirus (NGAV)", "Behavior-based threat detection", "Incident response playbooks", "Quarterly threat hunting reports"],
    benefits: ["Blocks 99% of endpoint attacks", "Ransomware recovery within hours", "Frees internal IT from security chores"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/services/it-endpoint-detection-response',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🛡️',
    href: '/services/it-endpoint-detection-response',
    category: 'it'
  }
,
{
    id: 'it-esg-compliance-automation',
    title: 'ESG Compliance Automation',
    description: `Automates ESG data collection from 100+ systems (cloud, HR, facilities) and generates SEC, EU CSRD, and SFDR reports.`,
    features: ["Carbon footprint calculation engine", "Diversity metrics dashboard", "Governance policy tracker", "Report generation (XBRL support)"],
    benefits: ["Saves 200+ manual hours per reporting cycle", "Ensures regulatory alignment", "Improves ESG ratings"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/services/it-esg-compliance-automation',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🌍',
    href: '/services/it-esg-compliance-automation',
    category: 'it'
  }
,
{
    id: 'it-identity-governance',
    title: 'Identity Governance & Administration',
    description: `Centralized IGA: lifecycle management, access certifications, separation-of-duties policies. Integrates with Active Directory, Okta, Azure AD.`,
    features: ["Provisioning/deprovisioning workflows", "Access certification campaigns", "SoD policy engine", "Role mining & optimization", "SOD analytics"],
    benefits: ["Eliminate orphaned accounts", "Pass SOX audits", "Reduce access risk"],
    pricing: {"basic":"249","pro":"599","enterprise":"1499"},
    contactInfo: {
      website: '/services/it-identity-governance',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔑',
    href: '/services/it-identity-governance',
    category: 'it'
  }
,
{
    id: 'it-iot-device-management',
    title: 'Enterprise IoT Device Management',
    description: `Provision, monitor, and secure 10K+ IoT devices (sensors, cameras, gateways) from a single dashboard with OTA updates and zero-touch enrollment.`,
    features: ["Device inventory & health monitoring", "Remote command & control", "Firmware OTA scheduling", "Geofencing & alerting"],
    benefits: ["Reduces device management overhead by 70%", "Ensures firmware consistency", "Detects rogue devices"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/services/it-iot-device-management',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📱',
    href: '/services/it-iot-device-management',
    category: 'it'
  }
,
{
    id: 'it-itil-service-management',
    title: 'ITIL Service Management (ITSM) Platform',
    description: 'Full ITIL-aligned service management with AI-powered ticketing, change management automation, CMDB discovery, and self-service portal for enterprise IT operations.',
    features: ['AI-powered incident classification & routing', 'Automated change approval workflows', 'Service catalog & self-service portal', 'CMDB auto-discovery & dependency mapping', 'SLA monitoring & escalation engine', 'Knowledge base integration with AI search'],
    benefits: ['Reduce ticket resolution time by 50%', 'Eliminate change-related outages with automated validation', 'Empower users with self-service capabilities', 'Maintain accurate service dependency maps'],
    pricing: { basic: '499', pro: '1099', enterprise: '2499' },
    contactInfo: { website: '/services/itil-service-management', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📋',
    href: '/services/it-itil-service-management',
    category: 'it'
  }
,
{
    id: 'it-kubernetes-multicloud',
    title: 'Kubernetes Multi-Cloud Management',
    description: `Deploy and manage Kubernetes clusters across AWS, GCP, Azure, and on-prem with a single control plane. Includes GitOps and policy enforcement.`,
    features: ["Cluster lifecycle automation", "Cost allocation per namespace", "Security policy as code (OPA/Gatekeeper)", "Cross-cloud service mesh"],
    benefits: ["Avoids vendor lock-in", "Optimizes spend by 30%", "Standardizes deployments"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/services/it-kubernetes-multicloud',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '☸️',
    href: '/services/it-kubernetes-multicloud',
    category: 'it'
  }
,
{
    id: 'it-legacy-app-containerization',
    title: 'Legacy App Containerization',
    description: `Migrate monoliths and legacy apps to Docker/Kubernetes with minimal code changes. Automated dependency analysis and service extraction.`,
    features: ["Automated dependency mapping", "Service extraction recommendations", "StatefulSet migration", "Database connection pooling", "Blue-green deployment"],
    benefits: ["Modernize without rewrite", "Reduce infrastructure costs", "Enable CI/CD for legacy"],
    pricing: {"basic":"399","pro":"899","enterprise":"2299"},
    contactInfo: {
      website: '/services/it-legacy-app-containerization',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🐳',
    href: '/services/it-legacy-app-containerization',
    category: 'it'
  }
,
{
    id: 'it-low-code-platform-integration',
    title: 'Low-Code Platform Integration',
    description: `Build & integrate internal tools on Retool, Tooljet, or internal platforms. Pre-built connectors to 200+ SaaS APIs and custom SQL/NoSQL builders.`,
    features: ["Drag-and-drop UI builder", "Role-based access controls", "Audit logging", "One-click deployment"],
    benefits: ["Empowers non-developers to build tools", "Reduces internal dev backlog by 40%", "Standardizes tooling across teams"],
    pricing: {"basic":"299","pro":"799","enterprise":"2499"},
    contactInfo: {
      website: '/services/it-low-code-platform-integration',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🧩',
    href: '/services/it-low-code-platform-integration',
    category: 'it'
  }
,
{
    id: 'it-mainframe-modernization',
    title: 'Mainframe Modernization Service',
    description: `Rehost, replatform, or refactor COBOL/PL1 applications to cloud. Automated code conversion, database migration, and cutover planning.`,
    features: ["Automated COBOL to Java/TS conversion", "Database migration (DB2 \u2192 PostgreSQL)", "Replatform to Azure/AWS mainframe alternatives", "Cutover orchestration", "Regression testing suite"],
    benefits: ["Reduce mainframe TCO by 70%", "Modernize at your own pace", "Keep business logic intact"],
    pricing: {"basic":"599","pro":"1299","enterprise":"3499"},
    contactInfo: {
      website: '/services/it-mainframe-modernization',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🖥️',
    href: '/services/it-mainframe-modernization',
    category: 'it'
  }
,
{
    id: 'it-multi-cloud-cost-governance',
    title: 'Multi-Cloud Cost Governance',
    description: `Unified cost visibility and policy enforcement across AWS, Azure, GCP. budgets, alerts, rightsizing recommendations, and chargeback/showback.`,
    features: ["Multi-cloud ingestion", "Budget thresholds & alerts", "Rightsizing AI", "Tag compliance enforcement", "Department chargeback"],
    benefits: ["Prevent cost overruns", "Save 25%+ on cloud spend", "Align finance & engineering"],
    pricing: {"basic":"199","pro":"499","enterprise":"1299"},
    contactInfo: {
      website: '/services/it-multi-cloud-cost-governance',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '💸',
    href: '/services/it-multi-cloud-cost-governance',
    category: 'it'
  }
,
{
    id: 'it-multi-cloud-networking',
    title: 'Multi-Cloud Networking',
    description: `Global SD-WAN with direct cloud interconnect (AWS Direct Connect, Azure ExpressRoute). Secure, performant, and centrally managed.`,
    features: ["Global backbone (100+ PoPs)", "Direct cloud connects", "Zero-trust network access", "WAN optimization", "Central policy management"],
    benefits: ["Predictable performance", "Secure remote access", "Reduce MPLS costs"],
    pricing: {"basic":"399","pro":"899","enterprise":"2399"},
    contactInfo: {
      website: '/services/it-multi-cloud-networking',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🌐',
    href: '/services/it-multi-cloud-networking',
    category: 'it'
  }
,
{
    id: 'it-observability-1',
    title: 'AI-Powered Observability & SRE',
    description: 'Comprehensive observability platform combining metrics, logs, traces, and AI-powered anomaly detection to achieve proactive reliability and reduce MTTR to minutes.',
    features: [
      'Unified observability (metrics, logs, traces, profiles)',
      'AI-powered anomaly detection and root cause analysis',
      'Automated incident classification and routing',
      'SLO/SLI management with error budget tracking',
      'Predictive alerting — detect issues before users do',
      'Runbook automation and remediation playbooks',
      'Dashboard builder with natural language queries',
      'Integration with PagerDuty, OpsGenie, Slack, and more',
    ],
    benefits: [
      'Reduce MTTR from hours to minutes',
      'Catch anomalies humans would miss',
      'Eliminate alert fatigue with smart grouping',
      'Maintain 99.99% uptime with proactive reliability',
    ],
    pricing: {
      basic: '$999/mo',
      pro: '$3,499/mo',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/it-observability-1',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '💻',
    href: '/services/it-observability-1',
    category: 'it'
  }
,
{
    id: 'it-observability-platform',
    title: 'Observability Platform & SRE Consulting',
    description: 'End-to-end observability implementation with distributed tracing, log aggregation, metrics collection, and Site Reliability Engineering best practices.',
    features: ['Unified observability stack (Prometheus, Grafana, Jaeger)', 'Custom SLO/SLI definition and dashboard creation', 'Incident management with automated runbooks', 'Chaos engineering and resilience testing', 'SRE consulting and reliability maturity assessment'],
    benefits: ['Reduce MTTR by 60% with intelligent alerting', 'Eliminate alert fatigue with smart correlation', 'Proactive issue detection before user impact', 'Build engineering team reliability practices'],
    pricing: { basic: '1299', pro: '2999', enterprise: '6999' },
    contactInfo: { website: '/services/observability-platform', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📊',
    href: '/services/it-observability-platform',
    category: 'cloud'
  }
,
{
    id: 'it-observability-unified',
    title: 'Unified Observability Platform',
    description: `Single pane of glass for logs, metrics, traces, and profiles. Powered by OpenTelemetry, with AI-assisted root cause analysis.`,
    features: ["OpenTelemetry auto-instrumentation", "Log aggregation & search", "Distributed tracing", "Profiling (CPU/memory)", "AI RCA (root cause)"],
    benefits: ["Reduce MTTR by 70%", "Cut monitoring tool sprawl", "Proactive anomaly detection"],
    pricing: {"basic":"299","pro":"699","enterprise":"1799"},
    contactInfo: {
      website: '/services/it-observability-unified',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📈',
    href: '/services/it-observability-unified',
    category: 'it'
  }
,
{
    id: 'it-pcii-compliance-suite',
    title: 'PCI DSS Compliance Suite',
    description: `Automated PCI DSS v4.0 compliance monitoring, evidence collection, and reporting. Pre-built controls for 400+ requirements.`,
    features: ["Control mapping (PCI DSS 4.0)", "Automated evidence collection", "Vulnerability scanning integration", "Quarterly assessment workflow", "Executive dashboards"],
    benefits: ["Achieve compliance 10x faster", "Reduce audit costs", "Continuous monitoring"],
    pricing: {"basic":"299","pro":"699","enterprise":"1799"},
    contactInfo: {
      website: '/services/it-pcii-compliance-suite',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '💳',
    href: '/services/it-pcii-compliance-suite',
    category: 'it'
  }
,
{
    id: 'it-platform-engineering-1',
    title: 'Internal Developer Platform (IDP) Engineering',
    description: 'Design and build an Internal Developer Platform (IDP) that provides self-service capabilities for developers — spinning up environments, deploying applications, and managing infrastructure through golden paths.',
    features: [
      'Self-service environment provisioning (Backstage, Port, or custom)',
      'Golden path templates for common architectures',
      'Internal API marketplace and service catalog',
      'Automated deployment pipelines per service type',
      'Developer portal with documentation and onboarding',
      'Abstractions over cloud services for simplicity',
      'Usage tracking and cost attribution per team',
      'Platform observability and SLO management',
    ],
    benefits: [
      'Reduce time-to-first-deploy from weeks to hours',
      'Empower developers to self-serve without ops bottlenecks',
      'Standardize best practices across all teams',
      'Improve developer satisfaction and retention',
    ],
    pricing: {
      basic: '$2,999/mo',
      pro: '$8,999/mo',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/it-platform-engineering-1',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '💻',
    href: '/services/it-platform-engineering-1',
    category: 'it'
  }
,
{
    id: 'it-sam-platform',
    title: 'IT Service Asset & Configuration Management',
    description: 'Complete IT asset discovery, configuration mapping, and dependency visualization for cloud and on-prem environments.',
    features: [
      'Automated discovery of servers, cloud resources, IoT devices',
      'Configuration item (CI) relationship mapping',
      'Change impact analysis',
      'License compliance & inventory tracking',
      'Integration with ITSM tools (ServiceNow, Jira)'
    ],
    benefits: [
      'Reduce unplanned downtime by 40%',
      'Accelerate change planning with dependency graphs',
      'Maintain software license compliance',
      'Single source of truth for CMDB'
    ],
    pricing: {
      basic: '599',
      pro: '1399',
      enterprise: '3999'
    },
    contactInfo: {
      website: '/services/it-sam-platform',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🗺️',
    href: '/services/it-sam-platform',
    category: 'it'
  }
,
{
    id: 'it-sap-integration-hub',
    title: 'SAP Integration Hub',
    description: `Pre-built connectors for SAP ERP, S/4HANA, SuccessFactors, and Ariba. Real-time sync, IDoc/BAPI support, and error handling out of the box.`,
    features: ["SAP ERP BAPI/IDoc adapters", "SuccessFactors sync", "Ariba network integration", "Error reconciliation dashboard", "SAP-certified connectors"],
    benefits: ["Integrate SAP in days not months", "Eliminate manual data entry", "Real-time business visibility"],
    pricing: {"basic":"499","pro":"1099","enterprise":"2799"},
    contactInfo: {
      website: '/services/it-sap-integration-hub',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🏢',
    href: '/services/it-sap-integration-hub',
    category: 'it'
  }
,
{
    id: 'it-secrets-management',
    title: 'Secrets Management as a Service',
    description: `Centralized secrets vault with automatic rotation, audit logs, and Just-In-Time access. Integrates with Kubernetes, VSphere, and cloud providers.`,
    features: ["Vault as a service", "Auto-rotation (certificates, keys)", "Just-In-Time access approvals", "Audit trail & reporting", "K8s operator"],
    benefits: ["Eliminate hardcoded secrets", "Meet compliance requirements", "Reduce breach blast radius"],
    pricing: {"basic":"199","pro":"499","enterprise":"1299"},
    contactInfo: {
      website: '/services/it-secrets-management',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔐',
    href: '/services/it-secrets-management',
    category: 'it'
  }
,
{
    id: 'it-secure-file-transfer',
    title: 'Secure File Transfer (MFT)',
    description: `Managed file transfer with end-to-end encryption, audit trails, and automated scheduling. Supports SFTP, FTPS, AS2, and HTTPS.`,
    features: ["PGP/GPG encryption", "AS2 protocol support", "Workflow automation", "Compliance reports (HIPAA, PCI)", "Detailed audit logs"],
    benefits: ["Secure B2B exchanges", "Automate file-based integrations", "Pass audits with ease"],
    pricing: {"basic":"199","pro":"499","enterprise":"1199"},
    contactInfo: {
      website: '/services/it-secure-file-transfer',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📁',
    href: '/services/it-secure-file-transfer',
    category: 'it'
  }
,
{
    id: 'it-serverless-api-gateway',
    title: 'Serverless API Gateway',
    description: `Fully managed API gateway with rate limiting, auth, caching, and transformation. Pay-per-request pricing, auto-scaling to millions of RPS.`,
    features: ["JWT/OAuth validation", "Request/response transformation", "Response caching (Redis)", "Rate limiting & quotas", "WebSocket support"],
    benefits: ["Zero ops overhead", "Scale automatically", "Cut API management costs by 80%"],
    pricing: {"basic":"149","pro":"399","enterprise":"999"},
    contactInfo: {
      website: '/services/it-serverless-api-gateway',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🚪',
    href: '/services/it-serverless-api-gateway',
    category: 'it'
  },
  {
    id: 'it-service-catalog-builder',
    title: 'IT Service Catalog Builder',
    description: 'Drag-and-drop service catalog designer for ITSM teams. Auto-generates from CMDB data, supports multi-language publication, and integrates with ServiceNow and Jira.',
    features: [
      'Drag-and-drop catalogue designer',
      'CMDB auto-import and sync',
      'Multi-language service description',
      'Self-service portal embed',
      'Version history and approval',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$189',
      pro: '$378',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/it-service-catalog-builder',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '🛒',
    href: '/services/it-service-catalog-builder',
    category: 'it',
  }
,
{
    id: 'it-service-desk-automation',
    title: 'IT Service Desk Automation',
    description: 'AI-powered IT service management with intelligent ticket routing, auto-resolution, self-service portals, and SLA monitoring.',
    features: ['Intelligent ticket classification', 'Auto-resolution engine', 'Self-service knowledge base', 'SLA monitoring and escalation', 'Performance analytics'],
    benefits: ['Resolve 40% of tickets automatically', 'Reduce average response time by 60%', 'Improve end-user satisfaction', 'Lower IT support costs'],
    pricing: { basic: '499', pro: '1199', enterprise: '3499' },
    contactInfo: { website: '/services/it-service-desk-automation', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎧',
    href: '/services/it-service-desk-automation',
    category: 'it'
  },
  {
    id: 'it-vendor-contract-mgmt',
    title: 'IT Vendor & Contract Management',
    description: 'Centralise IT vendor contracts, SLAs, and renewal dates. AI monitors terms, flags expiring agreements, and automates renewal workflows with configurable approval chains.',
    features: [
      'Central contract repository',
      'Automated renewal alerts',
      'SLA tracking dashboard',
      'Configurable approval workflows',
      'Vendor spend analytics',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$279',
      pro: '$558',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/it-vendor-contract-mgmt',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '📝',
    href: '/services/it-vendor-contract-mgmt',
    category: 'it',
  },
  {
    id: 'it-vendor-trust-portal',
    title: 'IT Vendor Risk & Trust Portal',
    description: 'Continuous vendor monitoring with security scorecards, financial health tracking, contract expiry alerts, and automated periodic vendor reassessments.',
    features: [
      'Security and compliance scorecard',
      'Financial health monitoring',
      'Contract expiry alerting',
      'Periodic self-assessment workflow',
      'Task action feed per vendor',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$259',
      pro: '$518',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/it-vendor-trust-portal',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '🛡️',
    href: '/services/it-vendor-trust-portal',
    category: 'it',
  }
,
{
    id: 'it-zero-trust-1',
    title: 'Zero Trust Security Implementation',
    description: 'Complete Zero Trust architecture implementation — from identity and access management to network microsegmentation, device trust, and continuous verification across your entire infrastructure.',
    features: [
      'Zero Trust maturity assessment and roadmap',
      'Identity-aware proxy deployment (BeyondCorp model)',
      'Network microsegmentation design and implementation',
      'Multi-factor authentication everywhere (MFA/SSO)',
      'Device trust and endpoint verification',
      'Least-privilege access policy design',
      'Continuous authentication and session management',
      'Zero Trust for remote workforce and third-party access',
    ],
    benefits: [
      'Eliminate lateral movement for attackers',
      'Replace vulnerable VPN with modern secure access',
      'Meet compliance requirements (NIST 800-207, CISA Zero Trust)',
      'Reduce breach blast radius by 90%',
    ],
    pricing: {
      basic: '$3,999/mo',
      pro: '$12,999/mo',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/it-zero-trust-1',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '💻',
    href: '/services/it-zero-trust-1',
    category: 'it'
  }
,
{
    id: 'kubernetes-management',
    title: 'Container Orchestration & Kubernetes Management',
    description: 'Expert Kubernetes deployment, scaling, monitoring, and optimization for containerized applications with GitOps-driven workflows.',
    features: ['Cluster design and deployment', 'Auto-scaling configuration', 'Service mesh implementation', 'CI/CD pipeline integration', 'Cost optimization and rightsizing'],
    benefits: ['Reduce infrastructure costs by 35%', 'Enable zero-downtime deployments', 'Scale from hundreds to thousands of pods', 'Streamline developer workflows'],
    pricing: { basic: '999', pro: '2499', enterprise: '6999' },
    contactInfo: { website: '/services/kubernetes-management', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🐳',
    href: '/services/kubernetes-management',
    category: 'it'
  }
,
{
    id: 'legacy-system-modernization',
    title: 'Legacy System Modernization & Re-Platforming',
    description: 'Migrate from legacy mainframes, monoliths, or outdated tech stacks to cloud-native microservices with minimal business disruption.',
    features: [
      'System analysis & dependency discovery',
      'Strangler fig pattern migration planning',
      'Database migration with CDC (change data capture)',
      'API gateway & service mesh setup',
      'Cut-over planning & rollback strategy'
    ],
    benefits: [
      'Reduce TCO by up to 70%',
      'Improve system scalability & agility',
      'Eliminate vendor lock-in & EOL risks',
      'Modern developer experience (CI/CD, containers)'
    ],
    pricing: {
      basic: '2499',
      pro: '5999',
      enterprise: '19999'
    },
    contactInfo: {
      website: '/services/legacy-system-modernization',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🏗️',
    href: '/services/legacy-system-modernization',
    category: 'it'
  },
  {
    id: 'log-aggregation-platform',
    title: 'Log Aggregation & Search',
    description: 'Centralized log collection, structured indexing, and full-text search across all servers, containers, and services with retention policies and alerting.',
    features: [
      'Structured + unstructured logs',
      'Full-text search with filters',
      'Retention policy tiers',
      'Log-based alerting',
      'OpenTelemetry compatible'
    ],
    benefits: [
      'One search bar for all logs',
      'Fast pace troubleshooting',
      'Meet audit log retention',
      'Lower log storage cost'
    ],
    pricing: {
      basic: '0',
      pro: '49',
      enterprise: '399'
    },
    contactInfo: {
      website: '/services/log-aggregation-platform',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📋',
    href: '/services/log-aggregation-platform',
    category: 'it'
  }
,
{
    id: 'low-code-platform-customization',
    title: 'Low-Code Platform Customization & Integration',
    description: 'Extend and integrate your low-code platforms (Retool, Appian, Power Apps, OutSystems) with custom components, APIs, and enterprise system connectors.',
    features: [
      'Custom UI component development',
      'Enterprise system connectors (SAP, Oracle, legacy)',
      'API Gateway & middleware integration',
      'Performance optimization & caching',
      'Security hardening & audit logging'
    ],
    benefits: [
      'Extend low-code app capabilities by 10x',
      'Seamless integration with legacy systems',
      'Reduce custom dev time by 70%',
      'Enterprise-grade security & compliance'
    ],
    pricing: {
      basic: '399',
      pro: '899',
      enterprise: '2499'
    },
    contactInfo: {
      website: '/services/low-code-platform-customization',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🧩',
    href: '/services/low-code-platform-customization',
    category: 'it'
  },
  {
    id: 'mainframe-modernization',
    title: 'Mainframe Modernization',
    description: 'Migrate legacy COBOL, PL/I, and JCL workloads to cloud-native microservices with automated refactoring, data migration, and parallel-run validation.',
    features: [
      'COBOL → Java/Python transpiler',
      'Automated data migration',
      'Parallel run validation',
      'Mainframe emulator for testing',
      'Gradual cutover strategy'
    ],
    benefits: [
      'Cut mainframe costs 90%',
      'Modern language stack',
      'No business disruption',
      'Zero data loss migration'
    ],
    pricing: {
      basic: 'Custom',
      pro: 'Custom',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/services/mainframe-modernization',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🖥️',
    href: '/services/mainframe-modernization',
    category: 'it'
  }
,
{
    id: 'managed-soc-threat-intelligence',
    title: 'Managed SOC & Threat Intelligence',
    description: '24/7 Security Operations Center with AI-enhanced threat detection, incident response, and proactive threat hunting.',
    features: ['24/7 security monitoring', 'AI-powered threat detection', 'Incident response automation', 'Proactive threat hunting', 'Compliance reporting'],
    benefits: ['Detect threats in real-time', 'Reduce mean response time to minutes', 'Meet SOC 2 and ISO 27001 requirements', 'Protect against zero-day attacks'],
    pricing: { basic: '1999', pro: '4999', enterprise: '12999' },
    contactInfo: { website: '/services/managed-soc-threat-intelligence', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔒',
    href: '/services/managed-soc-threat-intelligence',
    category: 'it'
  }
,
{
    id: 'network-architecture-sdwan',
    title: 'Network Architecture & SD-WAN',
    description: 'Design, deploy, and manage enterprise networks with SD-WAN, zero-trust architecture, and intelligent traffic optimization.',
    features: ['SD-WAN design and deployment', 'Network performance monitoring', 'Zero-trust segmentation', 'Traffic optimization policies', 'Multi-site connectivity management'],
    benefits: ['Reduce WAN costs by 50%', 'Improve application performance', 'Secure remote workforce access', 'Simplify multi-cloud networking'],
    pricing: { basic: '799', pro: '1999', enterprise: '5499' },
    contactInfo: { website: '/services/network-architecture-sdwan', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🌐',
    href: '/services/network-architecture-sdwan',
    category: 'it'
  },
  {
    id: 'network-performance-monitoring',
    title: 'Network Performance Monitoring',
    description: 'End-to-end network monitoring with synthetic probes, flow analysis (NetFlow/IPFIX), path visualization, and outage alerting for hybrid infrastructure.',
    features: [
      'Synthetic HTTP/TCP probes',
      'NetFlow/IPFIX analysis',
      'Network path visualization',
      'BGP monitoring',
      'SLA breach alerting'
    ],
    benefits: [
      'Detect outages before users',
      'Network topology map',
      'SLA credit automation',
      'Capacity planning reports'
    ],
    pricing: {
      basic: '49',
      pro: '199',
      enterprise: '999'
    },
    contactInfo: {
      website: '/services/network-performance-monitoring',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📊',
    href: '/services/network-performance-monitoring',
    category: 'it'
  }
,
{
    id: 'nodejs-performance-tuning',
    title: 'Node.js Performance Tuning & Profiling',
    description: 'Deep performance optimization for Node.js applications: event loop analysis, memory leak detection, concurrency tuning, and scalability architecture review.',
    features: [
      'Event loop delay monitoring & troubleshooting',
      'Memory profiling & leak detection',
      'CPU & I/O bottleneck analysis',
      'Cluster & worker threads optimization',
      'Garbage collection tuning'
    ],
    benefits: [
      'Improve request throughput by 3–5x',
      'Reduce latency p99 by 60%',
      'Lower cloud compute costs (fewer instances)',
      'Prevent runtime crashes in production'
    ],
    pricing: {
      basic: '699',
      pro: '1599',
      enterprise: '4599'
    },
    contactInfo: {
      website: '/services/nodejs-performance-tuning',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🟢',
    href: '/services/nodejs-performance-tuning',
    category: 'it'
  }
,
{
    id: 'observability-platform',
    title: 'Full-Stack Observability Platform',
    description: 'Unified logs, metrics, traces, and distributed tracing with AI-powered anomaly detection and automated root-cause analysis for microservices.',
    features: [
      'Log aggregation & full-text search (ELK-compatible)',
      'Metrics collection & dashboards (Prometheus/Grafana)',
      'Distributed tracing (OpenTelemetry)',
      'AI-driven anomaly detection & alerting',
      'SLO/SLI tracking & error budget burn rate'
    ],
    benefits: [
      'Reduce MTTR by 65%',
      'Proactive issue detection before customers notice',
      'Unified view across clouds & on-prem',
      'Data-driven reliability engineering'
    ],
    pricing: {
      basic: '499',
      pro: '1199',
      enterprise: '3299'
    },
    contactInfo: {
      website: '/services/observability-platform',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📊',
    href: '/services/observability-platform',
    category: 'it'
  },
  {
    id: 'patch-management',
    title: 'Patch Management',
    description: 'Automated OS, firmware, and application patching across Windows, Linux, and macOS fleets with compliance reporting and rollback.',
    features: [
      'Multi-OS patch support',
      'Automated scheduling',
      'Pre-deployment testing',
      'Compliance reports',
      'One-click rollback'
    ],
    benefits: [
      'Patch 10k devices overnight',
      '99% patch compliance',
      'Zero unplanned downtime',
      'Meet PCI DSS requirement'
    ],
    pricing: {
      basic: '4',
      pro: '9',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/services/patch-management',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔧',
    href: '/services/patch-management',
    category: 'it'
  }
,
{
    id: 'quantum-ready-security',
    title: 'Quantum-Ready Cryptography & Security Assessment',
    description: 'Prepare for the post-quantum era: assess cryptographic exposure, migrate to quantum-resistant algorithms (PQC), and implement hybrid security solutions.',
    features: [
      'Cryptographic inventory & quantum risk assessment',
      'PQC algorithm migration planning',
      'Hybrid RSA/PQC implementation guidance',
      'Code & dependency remediation',
      'Executive briefing & compliance roadmap'
    ],
    benefits: [
      'Future-proof against quantum attacks',
      'Meet emerging NIST PQC standards',
      'Protect long-lived sensitive data',
      'Stay ahead of regulatory requirements'
    ],
    pricing: {
      basic: '1499',
      pro: '3499',
      enterprise: '9999'
    },
    contactInfo: {
      website: '/services/quantum-ready-security',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔐',
    href: '/services/quantum-ready-security',
    category: 'it'
  }
,
{
    id: 'remote-it-support',
    title: 'Remote IT Support & Helpdesk Outsourcing',
    description: '24/7 outsourced IT helpdesk and desktop support for distributed workforces: remote troubleshooting, incident management, and user onboarding.',
    features: [
      '24/7/365 Tier-1/2 support (phone, chat, email)',
      'Remote desktop access & fix (TeamViewer, AnyDesk)',
      'Onboarding/offboarding automation',
      'Incident ticketing & SLA management',
      'Knowledge base & self-service portal'
    ],
    benefits: [
      'Eliminate in-house helpdesk hiring',
      'Reduce incident resolution time by 50%',
      'Improve employee satisfaction (ESAT)',
      'Global coverage across timezones'
    ],
    pricing: {
      basic: '499',
      pro: '1199',
      enterprise: '3499'
    },
    contactInfo: {
      website: '/services/remote-it-support',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🎧',
    href: '/services/remote-it-support',
    category: 'it'
  }
,
{
    id: 'saas-development',
    title: 'SaaS Product Development',
    description: 'Full-stack SaaS development from concept to launch — MVP, scaling, and product-market fit optimization.',
    features: [
      'MVP rapid prototyping (4-6 weeks)',
      'Full-stack architecture design',
      'User authentication & RBAC',
      'Payment integration (Stripe, Paddle)',
      'Analytics & usage tracking built-in'
    ],
    benefits: [
      'Go from idea to launch in weeks',
      'Scalable multi-tenant architecture',
      'Built-in billing & subscription management',
      'Post-launch support & iteration'
    ],
    pricing: {
      basic: '4999',
      pro: '12999',
      enterprise: '29999'
    },
    contactInfo: {
      website: '/services/saas-development',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🚀',
    href: '/services/saas-development',
    category: 'it'
  }
,
{
    id: 'soc-as-a-service',
    title: 'Security Operations Center as a Service (SOCaaS)',
    description: '24/7 managed security monitoring, threat hunting, incident response, and compliance reporting — no need to build your own SOC.',
    features: [
      '24/7 security monitoring (SIEM)',
      'Threat hunting & proactive investigation',
      'Incident response (IR) on call',
      'Compliance reporting (PCI-DSS, HIPAA, GDPR)',
      'Regular executive security briefings'
    ],
    benefits: [
      'Enterprise-grade security without the headcount',
      'Detect & respond to threats in minutes, not days',
      'Pass compliance audits with ease',
      'Predictable monthly cost vs. unpredictable breaches'
    ],
    pricing: {
      basic: '1499',
      pro: '3499',
      enterprise: '9999'
    },
    contactInfo: {
      website: '/services/soc-as-a-service',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🚨',
    href: '/services/soc-as-a-service',
    category: 'it'
  }
,
{
    id: 'vulnerability-assessment-penetration-testing',
    title: 'Vulnerability Assessment & Penetration Testing',
    description: 'Proactive security testing: automated vulnerability scanning, manual pen-testing, exploit validation, and remediation guidance for web, mobile, and network.',
    features: [
      'Automated vulnerability scanning (DAST, SCA, SAST)',
      'Manual penetration testing (white/grey/black box)',
      'Exploit validation & risk scoring',
      'Remediation guidance & proof-of-concept fixes',
      'Compliance reports (PCI-DSS, HIPAA, SOC2)'
    ],
    benefits: [
      'Discover 95%+ of security gaps',
      'Prioritize fixes by exploitability & impact',
      'Meet compliance audit requirements',
      'Reduce security incident rate'
    ],
    pricing: {
      basic: '1999',
      pro: '4999',
      enterprise: '14999'
    },
    contactInfo: {
      website: '/services/vulnerability-assessment-penetration-testing',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🧐',
    href: '/services/vulnerability-assessment-penetration-testing',
    category: 'it'
  },
  {id:'chaos-engineering-svc',title:'Chaos Engineering & Resilience Testing',description:'Proactive chaos experiments: inject failures (latency, pod kill, DB disconnect) on non-production to validate recovery paths. Auto-generate incident response playbooks from results.',features:['Automated chaos experiment runner (Litmus/Chaos Monkey)','Failure scenario library: network, pod, DB, region','Auto-generated recovery playbook','Blast-radius analysis + dependency mapping','Resilience scorecard + monthly score trend'],benefits:['Prevent outages before they hit production','Prove recovery SLAs against reality','Build team muscle memory for incident response','Attain 99.99%+ uptime confidence'],pricing:{basic:'299',pro:'749',enterprise:'2499'},contactInfo:{website:'/services/chaos-engineering-svc',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/chaos-engineering-svc',category:'it'},
  {id:'cloud-native-app-dev',title:'Cloud-Native Application Development',description:'Full-stack cloud-native: containerized microservices, event-driven architecture, Kubernetes, CI/CD from code to production with OpenTelemetry observability from day one.',features:['Kubernetes-native microservice architecture','Event-driven: Kafka/NATS/PubSub patterns','Auto-generated Helm charts + ArgoCD','Distributed tracing OpenTelemetry from bootstrap','GitOps deploy pipeline per environment'],benefits:['Ship production-ready cloud-native apps 4x faster','Reduce production incidents with built-in observability','No vendor lock portable cloud-agnostic','Automated infra provisioning no manual Terraform'],pricing:{basic:'4999',pro:'14999',enterprise:'49999'},contactInfo:{website:'/services/cloud-native-app-dev',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/cloud-native-app-dev',category:'it'},
  {id:'container-security-lifecycle',title:'Container & Kubernetes Security',description:'Full container security: registry scanning (Trivy/Clair), runtime protection (Falco), OPA admission controllers, SBOM attestation per build.',features:['Registry vuln scanning (Trivy)','Runtime behavior monitoring (Falco)','OPA admission policy engine','SBOM attestation per image','SLSA Level 3+ supply chain attestation'],benefits:['Block container escapes before production','SBOM-ready for EO 14028 compliance','API-level attack prevention via OPA','Continuous supply chain protection'],pricing:{basic:'199',pro:'599',enterprise:'1999'},contactInfo:{website:'/services/container-security-lifecycle',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/container-security-lifecycle',category:'it'},
  {id:'edge-computing-deploy',title:'Edge Computing & Edge AI Deployment',description:'Deploy distributed edge workloads: CDN edge functions, edge ML inference, IoT pipelines, regional failover with 10-50ms p99 latency and per-edge-node observability.',features:['Multi-edge provider: Cloudflare/Fastly/Akamai','Edge function CI/CD','Edge ML inference (TFLite/ONNX Runtime)','Regional failover + sticky routing','Per-node observability + alert threshold'],benefits:['P99 under 100ms global','Edge ML inference sub-50ms','24/7 remote worker edge cluster management','Data residency compliance by region'],pricing:{basic:'699',pro:'1899',enterprise:'5999'},contactInfo:{website:'/services/edge-computing-deploy',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/edge-computing-deploy',category:'it'},
  {id:'evm-smart-contract-audit',title:'EVM Smart Contract Audit',description:'Comprehensive audit: static analysis (Slither), manual line-by-line review, fuzz testing (Foundry), formal verification for critical invariants, post-audit re-audit.',features:['Static analysis + re-entrancy + overflow checks','Manual line-by-line expert review','Fuzz + invariant testing (Foundry)','Formal verification for critical invariants','Post-fix re-audit within 72 hours'],benefits:['Deploy with confidence, $500M+ in protected TVL','Catch re-entrancy + overflow before mainnet','30-day post-audit fix window included','Support: Ethereum, BSC, Polygon, Arbitrum'],pricing:{basic:'4999',pro:'14999',enterprise:'49999'},contactInfo:{website:'/services/evm-smart-contract-audit',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/evm-smart-contract-audit',category:'it'},
  {id:'legacy-app-refactor',title:'Legacy App Refactoring & Strangler Fig',description:'Strangler fig: reverse-engineer monolith deps, incrementally migrate bounded contexts to modern services with feature-flags, dual-run validation, rollback at every step.',features:['Strangler fig incremental migration plan','Gradual bounded-context extraction per sprint','Dual-run production validation + canary','Feature-flag cutover per module','Anti-corruption layer per legacy interface'],benefits:['Migrate monolith without big-bang rewrite','Zero downtime during multi-year migration','Business value delivered incrementally','Legacy runs parallel until fully replaced'],pricing:{basic:'4999',pro:'14999',enterprise:'49999'},contactInfo:{website:'/services/legacy-app-refactor',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/legacy-app-refactor',category:'it'},
  {id:'mainframe-modernization',title:'Mainframe Modernization & Offload',description:'Strategic mainframe offload: identify batch jobs, APIs, transactional workloads for migration. Replatform Java/COBOL to containers with CDC dual-write during transition.',features:['Workload profiling + migration priority ranking','Automated COBOL/PL1 to Java transpilation','Dual-write CDC from mainframe to cloud','Anti-corruption layer for new consumers','Hybrid deployment, zero cut-over window'],benefits:['Reduce mainframe licensing costs up to 70%','Modernize with zero big-bang rewrite','Mainframe parallel until fully offloaded','Accelerate mainframe talent productivity'],pricing:{basic:'14999',pro:'49999',enterprise:'149999'},contactInfo:{website:'/services/mainframe-modernization',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/mainframe-modernization',category:'it'},
  {id:'observability-platform',title:'Observability Platform Engineering',description:'Full observability stack: Prometheus/Grafana metrics, OpenTelemetry/Jaeger/Tempo traces, Loki/ELK logs, AI alerting, SLO/SLI dashboard per service.',features:['OpenTelemetry instrumentation standard lib','Prometheus + Grafana metrics','Jaeger/Tempo distributed tracing','Loki/ELK structured logging','SLO burn-rate + auto-tuning alert threshold'],benefits:['Sub-5min MTTR on production incidents','No alert storms with AI-based alert management','Unified observability data layer no silos','SLO-driven engineering culture'],pricing:{basic:'1999',pro:'4999',enterprise:'14999'},contactInfo:{website:'/services/observability-platform',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/observability-platform',category:'it'},
  {id:'performance-engineering',title:'Performance Engineering as a Service',description:'Proactive performance: synthetic monitoring (Playwright), load testing (k6/Gatling), flame-graph CI gate, production profiling, quarterly roadmap review.',features:['Synthetic browser + API monitoring (Playwright)','Continuous load testing in CI pipeline','Flame-graph regression gate per PR','Production profiling (pyroscope/parca)','Quarterly performance roadmap per architecture'],benefits:['Catch performance regressions before production','Sub-200ms p90 response time SLA commitment','Reduce production performance incidents 80%','Continuous performance culture vs one-time audit'],pricing:{basic:'349',pro:'949',enterprise:'2999'},contactInfo:{website:'/services/performance-engineering',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/performance-engineering',category:'it'},
  {id:'tech-writing-docs',title:'Technical Writing & Developer Documentation',description:'Developer-first docs: OpenAPI reference, SDK guides with runnable code snippets, architecture decision records, changelog from git, embedded Swagger UI.',features:['OpenAPI auto-generated per route with examples','SDK docs with runnable JS/Python/Go code','Architecture decision records from PR discussion','Changelog auto-generated from git tags + commits','Interactive API explorer (Swagger UI) embedded'],benefits:['Developers onboard in hours not days','Cut support tickets from unclear docs','Self-service DX reduces sales friction','Docs stay in sync with code no stale docs'],pricing:{basic:'149',pro:'499',enterprise:'1499'},contactInfo:{website:'/services/tech-writing-docs',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/tech-writing-docs',category:'it'},
  {id:'tech-writing-docs',title:'Technical Writing & Developer Documentation',description:'AI-augmented technical writing: auto-generates API reference docs, architecture decision records, runbooks, and changelogs from code diffs. Keeps public docs in sync with every push.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/tech-writing-docs',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/tech-writing-docs',category:'it'},
  {id:'reliability-sre',title:'Reliability Platform & SRE Enablement',description:'SRE as a Service: SLO and SLI and SLA design, error-budget management, incident command, postmortem facilitation, and runbook automation. 99.9% uptime guarantee for regulated digital services.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/reliability-sre',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/reliability-sre',category:'it'},
  {id:'performance-engineering',title:'Performance Engineering as a Service',description:'Application performance engineering: load testing via JMeter or k6, frontend Web Vitals, APM via New Relic or Datadog, database query optimisation, CDN audit, and a performance budget for every release.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/performance-engineering',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/performance-engineering',category:'it'},
  {id:'legacy-app-refactor',title:'Legacy App Refactoring & Strangler Fig',description:'Legacy application refactoring: strangler-fig pattern decomposition, anti-pattern detection, automated test coverage lift, incremental migration, and blue-green production rollout with automatic rollback.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/legacy-app-refactor',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/legacy-app-refactor',category:'it'},
  {id:'k8s-gitops-enterprise',title:'Kubernetes GitOps Enterprise Platform',description:'Enterprise Kubernetes with GitOps: ArgoCD or Flux continuous delivery, OPA or Gatekeeper policy enforcement, cluster fleet management, cost allocation, namespace quotas, and image scanning — all via Git commits.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/k8s-gitops-enterprise',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/k8s-gitops-enterprise',category:'it'},
  {id:'event-driven-architecture',title:'Event-Driven Architecture (EDA) Platform',description:'Design and implement event-driven microservices: Apache Kafka or Pulsar event mesh, schema registry, CQRS plus event sourcing patterns, exactly-once delivery, and replay and replay-sanitise pipelines.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/event-driven-architecture',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/event-driven-architecture',category:'it'},
  {id:'devsecops-pipeline',title:'DevSecOps Pipeline Automation',description:'Security-baked CI/CD pipeline: SAST, DAST, secrets scanning, container image signing, SBOM generation, and penetration-test gates. Enforces policy as code before every production deployment.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/devsecops-pipeline',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/devsecops-pipeline',category:'it'},
];

export const cloudServices: Service[] = [  {
    id: 'cloud-ai-mlops-platform',
    title: 'AI/MLOps Cloud Platform',
    description: 'Managed Kubernetes GPU clusters, model registry (MLflow), distributed training orchestrator, LLM serving vLLM/TGI, and GPU auto-scaling.',
    icon: '★',
    features: ['Managed GPU K8s cluster (A100/H100)', 'Model registry (MLflow) + experiment tracker', 'Distributed training (PyTorch DDP/DeepSpeed)', 'vLLM/TGI serving auto-scale 0-to-N'],
    benefits: ['Deploy an LLM inference platform in days', 'GPU cluster managed, no K8s on-call burnout', 'Auto-scale from 0 to burst demand', 'Focus on models, not infrastructure'],
    pricing: {'basic': '4999', 'pro': '14999', 'enterprise': '49999'},
    contactInfo: { website: '/services/cloud-ai-mlops-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/cloud-ai-mlops-platform',
    category: 'cloud',
    popular: false,
  },
  {
    id: 'cloud-edge-computing-global',
    title: 'Global Edge Computing Network',
    description: 'Low-latency edge compute with Cloudflare Workers, KV storage, D1 SQL, R2 object store, and edge-geo routing across 300+ cities.',
    icon: '★',
    features: ['Edge compute in 300+ cities (Cloudflare Workers)', 'Edge KV/D1/R2 storage region-local', 'Geo-based routing + smart fallback', 'Edge cache purge Webhook/API'],
    benefits: ['Sub-50ms TTFB for global users', 'Serve traffic nearest the user always', 'Reduce origin load 60-90%', 'Deploy once, run globally'],
    pricing: {'basic': '1499', 'pro': '3499', 'enterprise': '9999'},
    contactInfo: { website: '/services/cloud-edge-computing-global', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/cloud-edge-computing-global',
    category: 'cloud',
    popular: false,
  },
  {
    id: 'cloud-zero-trust-access-platform',
    title: 'Zero Trust Access Platform',
    description: 'Identity-first zero trust: device posture check, per-session access policy, micro-VPN per-app access, continuous auth risk scoring.',
    icon: '★',
    features: ['Identity-verified per-session auth (OIDC/SAML)', 'Device posture check before granting access', 'Per-app micro-segmented VPN access', 'Continuous risk score per session (anomaly detector)'],
    benefits: ['Replace VPN — access apps directly', 'Least-privilege by default, not after breach', 'Device compliance verified per session', 'Zero-trust audit trail for every grant'],
    pricing: {'basic': '1999', 'pro': '4999', 'enterprise': '14999'},
    contactInfo: { website: '/services/cloud-zero-trust-access-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/cloud-zero-trust-access-platform',
    category: 'cloud',
    popular: false,
  },
  {
    id: 'cloud-gitops-enterprise-platform',
    title: 'GitOps Enterprise Platform',
    description: 'Full GitOps on Kubernetes: ArgoCD + Argo Rollouts (canary/blue-green), Terraform provisioning, Kyverno admission policy, automated drift remediation.',
    icon: '★',
    features: ['ArgoCD GitOps synced per environment', 'Argo Rollouts progressive delivery (canary/blue-green)', 'Terraform EKS/GKE/AKS provisioning', 'Kyverno admission policies + OPA-Gatekeeper', 'Drift auto-remediation reconciler'],
    benefits: ['GitOps audit trail, no manual kubectl', 'Progressive delivery canary/blue-green', 'Zero-drift enforced by reconciler', 'Policy-as-code = compliance-by-configuration'],
    pricing: {'basic': '999', 'pro': '2999', 'enterprise': '9999'},
    contactInfo: { website: '/services/cloud-gitops-enterprise-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/cloud-gitops-enterprise-platform',
    category: 'cloud',
    popular: false,
  },
  {
    id: 'cloud-blob-intelligent-tiering',
    title: 'Intelligent Blob Storage Tiering',
    description: 'Auto lifecycle tiering hot→cool→archive; S3-compatible API; point-in-time restore; cross-region replication; cost dashboard.',
    icon: '★',
    features: ['S3-compatible API (v4 signature)', 'Hot→Cool→Archive auto-tier policy', 'Point-in-time restore (last 90 days)', 'Cross-region async replication + failover'],
    benefits: ['Reduce storage cost 60-80% with auto-tier', 'RPO 0 with cross-region replication', 'Never pay for Cold archive until retrieved', 'Restore any version in one API call'],
    pricing: {'basic': '299', 'pro': '799', 'enterprise': '2499'},
    contactInfo: { website: '/services/cloud-blob-intelligent-tiering', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/cloud-blob-intelligent-tiering',
    category: 'cloud',
    popular: false,
  },
  {
    id: 'cloud-observability-stack',
    title: 'Observability Stack as a Service',
    description: 'Pre-integrated Prometheus+Grafana+Loki+Tempo stack with 400+ dashboards, alert rules pre-built, and PagerDuty/OpsGenie on-call.',
    icon: '★',
    features: ['Prometheus + Thanos long-term store', 'Grafana OSS with 400+ dashboards', 'Loki logs + Tempo traces (shared tenant ID)', 'Pre-built alert rules per service/database', 'PagerDuty/OpsGenie on-call routing'],
    benefits: ['Observability in one afternoon, not weeks', '400+ dashboards = zero from-scratch', 'Standardise alerting across all teams', 'Full logs+metrics+traces correlation'],
    pricing: {'basic': '2499', 'pro': '5999', 'enterprise': '17999'},
    contactInfo: { website: '/services/cloud-observability-stack', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/cloud-observability-stack',
    category: 'cloud',
    popular: false,
  },
  {
    id: 'cloud-api-gateway-enterprise',
    title: 'Enterprise API Gateway',
    description: 'Unified API gateway: JWT/OAuth2 auth, rate-limit, circuit-breaker, request/response transform, analytics, multi-tenant API key mgmt.',
    icon: '★',
    features: ['JWT/OAuth2/API-Key auth per route', 'Rate-limit (token-bucket) + circuit-breaker', 'Request/response transform + header injection', 'Multi-tenant API key management + analytics'],
    benefits: ['One gateway, all backend services secure', 'Centralise auth, rate-limit, logging', 'Per-tenant analytics without touching services', 'Micro-service orchestration in one config'],
    pricing: {'basic': '2499', 'pro': '5999', 'enterprise': '19999'},
    contactInfo: { website: '/services/cloud-api-gateway-enterprise', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/cloud-api-gateway-enterprise',
    category: 'cloud',
    popular: false,
  },
  {
    id: 'cloud-container-registry-trivy-scan',
    title: 'Container Registry + Trivy Scan',
    description: 'Private container registry with built-in Trivy CVE scanning, SBOM generation, image signing, and promotion pipeline (dev→staging→prod).',
    icon: '★',
    features: ['OCI-compliant private container registry', 'Trivy CVE scan gate (fail on CRITICAL)', 'SBOM (SPDX/CycloneDX) per image', 'Cosign image signing + policy gate', 'Registry mirror + geo-replication'],
    benefits: ['Only signed, CVE-free images deploy to prod', 'Catch vulnerabilities in CI, not in prod', 'Meet supply-chain security requirements', 'Geo-replicate registry images ready globally'],
    pricing: {'basic': '499', 'pro': '1299', 'enterprise': '3999'},
    contactInfo: { website: '/services/cloud-container-registry-trivy-scan', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/cloud-container-registry-trivy-scan',
    category: 'cloud',
    popular: false,
  },
  {
    id: 'cloud-serverless-framework-deploy',
    title: 'Serverless Framework Deployment',
    description: 'Infrastructure-as-code for Serverless Framework: multi-stage (dev/staging/prod), CI/CD integration, DynamoDB/Lambda/API Gateway resources.',
    icon: '★',
    features: ['Serverless Framework YAML generator', 'Multi-stage variable layering per env', 'CI/CD GitHub Actions + automated deploy', 'DynamoDB/Lambda/API Gateway pre-built blueprints'],
    benefits: ['Deploy serverless infra in one afternoon', 'No manual console click deployments', 'Same infra config across all environments', 'Cost track per stage via cost-allocation tags'],
    pricing: {'basic': '1499', 'pro': '3499', 'enterprise': '9999'},
    contactInfo: { website: '/services/cloud-serverless-framework-deploy', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/cloud-serverless-framework-deploy',
    category: 'cloud',
    popular: false,
  },
  {
    id: 'cloud-storage-lifecycle-policy',
    title: 'Cloud Storage Lifecycle & Compliance',
    description: 'S3/GCS/Azure Blob lifecycle: retention policy, litigation hold, WORM locking, legal export, and SaaS-data export automation.',
    icon: '★',
    features: ['WORM retention policy per bucket', 'Litigation hold (no-delete, no-overwrite)', 'Automated encrypted export to SaaS tools', 'Automated lifecycle rule change review'],
    benefits: ['Comply with SOX/21 CFR Part 11 forever', 'Meet legal hold without manual blocklists', 'Automated evidence export for audit', 'Sleep well knowing data cannot disappear'],
    pricing: {'basic': '999', 'pro': '2499', 'enterprise': '7999'},
    contactInfo: { website: '/services/cloud-storage-lifecycle-policy', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/cloud-storage-lifecycle-policy',
    category: 'cloud',
    popular: false,
  },

{
    id: 'api-development',
    title: 'API Development & Integration',
    description: 'Design, build, and manage high-performance APIs that connect systems, enable automation, and power digital products at enterprise scale.',
    features: ['Enterprise-grade implementation', '24/7 monitoring', 'Compliance-ready'],
    benefits: ['Reduced risk', 'Faster response', 'Audit-ready', 'Lower costs'],
    pricing: { basic: '899', pro: '1999', enterprise: '4499' },
    contactInfo: { website: '/services/api-development', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔌',
    href: '/services/api-development',
    category: 'cloud'
  }
,
{
    id: 'backup-disaster-recovery',
    title: 'Backup & Disaster Recovery',
    description: 'Enterprise backup solutions with automated disaster recovery, RPO/RSL guarantees, geo-redundant storage, and instant failover for zero data loss.',
    features: ['Enterprise-grade implementation', '24/7 monitoring', 'Compliance-ready'],
    benefits: ['Reduced risk', 'Faster response', 'Audit-ready', 'Lower costs'],
    pricing: { basic: '1,999', pro: '4,999', enterprise: 'Custom' },
    contactInfo: { website: '/services/backup-disaster-recovery', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💾',
    href: '/services/backup-disaster-recovery',
    category: 'cloud'
  },
  {
    id: 'cdn-edge-cache',
    title: 'CDN & Edge Cache',
    description: 'Global content delivery network with smart caching, image optimization, DDoS mitigation, and sub-50ms TTFB for static and dynamic assets.',
    features: [
      '300+ global edge PoPs',
      'Smart caching rules',
      'Automatic image optimization',
      'DDoS mitigation included',
      'Edge-side includes'
    ],
    benefits: [
      '< 50ms TTFB globally',
      '90% less origin load',
      'SEO + Core Web Vitals boost',
      'Built-in DDoS protection'
    ],
    pricing: {
      basic: '0',
      pro: '29',
      enterprise: '799'
    },
    contactInfo: {
      website: '/services/cdn-edge-cache',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🌐',
    href: '/services/cdn-edge-cache',
    category: 'cloud'
  },
  {
    id: 'cloud-bom-visualiser',
    title: 'Cloud BOM & Dependency Visualiser',
    description: 'Map every cloud dependency from DNS records and load balancers to container images and Lambda layers. Visual graph with change impact analysis.',
    features: [
      'Full dependency graph visualisation',
      'Change impact analysis',
      'Real-time configuration drift alerts',
      'Kubernetes resource aware',
      'Export to SVG and PDF',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$179',
      pro: '$358',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/cloud-bom-visualiser',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '🔗',
    href: '/services/cloud-bom-visualiser',
    category: 'cloud',
  },
  {
    id: 'cloud-cost-anomaly-detector',
    title: 'Cloud Cost Anomaly Detector',
    description: 'AI-powered cloud cost anomaly detection with root-cause attribution, budget forecasting, and auto-generated cost-reduction playbooks.',
    features: [
      'ML anomaly detection',
      'Root-cause attribution',
      'Budget forecasting',
      'Cost-reduction recommendations',
      'AWS/Azure/GCP unified view'
    ],
    benefits: [
      'Catch bill shock before it happens',
      'Save 20-40% on cloud spend',
      'AI recommends optimizations',
      'No more manual cost reviews'
    ],
    pricing: {
      basic: '0',
      pro: '99',
      enterprise: '599'
    },
    contactInfo: {
      website: '/services/cloud-cost-anomaly-detector',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📉',
    href: '/services/cloud-cost-anomaly-detector',
    category: 'cloud'
  }
,
{
    id: 'cloud-cost-optimization-service',
    title: 'Cloud Cost Optimization (FinOps)',
    description: 'ML-driven cloud cost optimization across AWS, Azure, and GCP with right-sizing recommendations, reserved instance optimization, and anomaly detection.',
    features: ['Multi-cloud unified cost visibility', 'ML-driven instance right-sizing', 'Reserved instance & savings plan optimizer', 'Idle resource detection & cleanup', 'Showback/chargeback automation'],
    benefits: ['Average 35% cloud cost reduction', 'Cross-cloud spend optimization', 'Real-time anomaly detection alerts', 'Executive-ready FinOps dashboards'],
    pricing: { basic: '499', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/services/cloud-cost-optimization', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💰',
    href: '/services/cloud-cost-optimization-service',
    category: 'cloud'
  }
,
{
    id: 'cloud-migration',
    title: 'Cloud Migration & Modernization',
    description: 'Seamless migration to AWS, Azure, or GCP with zero downtime, cost optimization, and infrastructure-as-code automation.',
    features: [
      'Multi-cloud migration planning',
      'Zero-downtime migration execution',
      'Cost optimization & right-sizing',
      'Infrastructure-as-Code (Terraform/Pulumi)',
      'Post-migration performance tuning'
    ],
    benefits: [
      'Up to 40% cost savings on cloud spend',
      '99.99% uptime SLA during migration',
      'Eliminate technical debt',
      'Scalable cloud-native architecture'
    ],
    pricing: {
      basic: '1999',
      pro: '4999',
      enterprise: '9999'
    },
    contactInfo: {
      website: '/services/cloud-migration',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '☁️',
    href: '/services/cloud-migration',
    popular: true,
    category: 'cloud'
  },
  {
    id: 'cloud-migration-readiness',
    title: 'Cloud Migration Readiness Score',
    description: 'Assess on-prem and multi-cloud workloads across 6 readiness dimensions: performance, cost, security, operability, resiliency, and team skill.',
    features: [
      '6-dimension readiness scorecard',
      'Migration wave planner',
      'TCO comparison analysis',
      'Skill gap heat map',
      'Executive dashboard and PDF report',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$249',
      pro: '$498',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/cloud-migration-readiness',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '📊',
    href: '/services/cloud-migration-readiness',
    category: 'cloud',
  },
  {
    id: 'cloud-storage-tiering',
    title: 'Cloud Storage Tiering Intelligence',
    description: 'AI-driven storage tiering engine that automatically moves infrequently accessed data to cheaper tiers with SLA-monitored cold retrieval performance.',
    features: [
      'Automatic hot-to-cold tiering',
      'SLA-monitored cold retrieval',
      'Multi-cloud S3, GCS, Azure Blob',
      'Per-team cost attribution',
      'Tiering policy dashboard',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$189',
      pro: '$378',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/cloud-storage-tiering',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '🗄️',
    href: '/services/cloud-storage-tiering',
    category: 'cloud',
  }
,
{
    id: 'cybersecurity-audit',
    title: 'Cybersecurity Audit',
    description: 'Professional cybersecurity audit services by Zion Tech Group. Advanced AI and technology solutions.',
    features: ['Enterprise-grade implementation', '24/7 monitoring', 'Compliance-ready'],
    benefits: ['Reduced risk', 'Faster response', 'Audit-ready', 'Lower costs'],
    pricing: { basic: '899', pro: '1999', enterprise: '4499' },
    contactInfo: { website: '/services/cybersecurity-audit', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔹',
    href: '/services/cybersecurity-audit',
    category: 'cloud'
  }
,
{
    id: 'data-pipeline-architecture',
    title: 'Data Pipeline Architecture & Engineering',
    description: 'Build robust data pipelines with Kafka, Spark, Airflow for real-time and batch processing at enterprise scale.',
    features: ['Enterprise-grade implementation', '24/7 monitoring', 'Compliance-ready'],
    benefits: ['Reduced risk', 'Faster response', 'Audit-ready', 'Lower costs'],
    pricing: { basic: '3,999', pro: '9,999', enterprise: 'Custom' },
    contactInfo: { website: '/services/data-pipeline-architecture', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔧',
    href: '/services/data-pipeline-architecture',
    category: 'cloud'
  }
,
{
    id: 'devops-consulting',
    title: 'DevOps Consulting & Implementation',
    description: 'End-to-end DevOps transformation with CI/CD pipeline setup, infrastructure as code, container orchestration, and team training.',
    features: ['Enterprise-grade implementation', '24/7 monitoring', 'Compliance-ready'],
    benefits: ['Reduced risk', 'Faster response', 'Audit-ready', 'Lower costs'],
    pricing: { basic: '2,499', pro: '7,999', enterprise: 'Custom' },
    contactInfo: { website: '/services/devops-consulting', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⚙️',
    href: '/services/devops-consulting',
    category: 'cloud'
  }
,
{
    id: 'digital-workplace',
    title: 'Digital Workplace Solutions',
    description: 'Modern workplace technology stack with collaboration tools, secure remote access, AI assistants, and unified communications for distributed teams.',
    features: ['Enterprise-grade implementation', '24/7 monitoring', 'Compliance-ready'],
    benefits: ['Reduced risk', 'Faster response', 'Audit-ready', 'Lower costs'],
    pricing: { basic: '1,999', pro: '4,999', enterprise: 'Custom' },
    contactInfo: { website: '/services/digital-workplace', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🏢',
    href: '/services/digital-workplace',
    category: 'cloud'
  },
  {
    id: 'disaster-recovery-platform',
    title: 'Disaster Recovery Platform',
    description: 'Automated backup, cross-region replication, and RTO/RPO-tested failover orchestration for VMs, databases, and containers across clouds.',
    features: [
      'Automated cross-region replication',
      'RTO/RPO testing dashboard',
      'VM & DB & container backup',
      'One-click failover drills',
      'Air-gapped backup storage'
    ],
    benefits: [
      'RTO < 15 minutes guaranteed',
      'Meet ISO 22301 BCP',
      'Tested quarterly',
      'Never pay ransom fees'
    ],
    pricing: {
      basic: '99',
      pro: '399',
      enterprise: '2499'
    },
    contactInfo: {
      website: '/services/disaster-recovery-platform',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🚨',
    href: '/services/disaster-recovery-platform',
    category: 'cloud'
  }
,
{
    id: 'disaster-recovery-services',
    title: 'Disaster Recovery & Business Continuity',
    description: 'Enterprise DR planning, backup automation, geo-redundant infrastructure, and rapid business continuity solutions.',
    features: ['Enterprise-grade implementation', '24/7 monitoring', 'Compliance-ready'],
    benefits: ['Reduced risk', 'Faster response', 'Audit-ready', 'Lower costs'],
    pricing: { basic: '2,999', pro: '8,999', enterprise: 'Custom' },
    contactInfo: { website: '/services/disaster-recovery-services', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔄',
    href: '/services/disaster-recovery-services',
    category: 'cloud'
  },
  {
    id: 'edge-computing-platform',
    title: 'Edge Computing Platform',
    description: 'Deploy microservices at the network edge for sub-10ms latency, offline operation, and data sovereignty compliance.',
    features: [
      'Global edge network',
      'Container-based deploys',
      'Offline-first sync',
      'Data residency controls',
      'Edge ML inference'
    ],
    benefits: [
      'Near-zero latency',
      'Works offline',
      'GDPR data residency',
      'Lower bandwidth costs'
    ],
    pricing: {
      basic: '349',
      pro: '999',
      enterprise: '3999'
    },
    contactInfo: {
      website: '/services/edge-computing-platform',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📡',
    href: '/services/edge-computing-platform',
    category: 'cloud'
  }
,
{
    id: 'endpoint-management',
    title: 'Endpoint Device Management (MDM)',
    description: 'Centralized management of all endpoints — laptops, mobile devices, IoT — with automated patching, application deployment, and security policy enfor...',
    features: ['Enterprise-grade implementation', '24/7 monitoring', 'Compliance-ready'],
    benefits: ['Reduced risk', 'Faster response', 'Audit-ready', 'Lower costs'],
    pricing: { basic: '1,999', pro: '4,999', enterprise: 'Custom' },
    contactInfo: { website: '/services/endpoint-management', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📱',
    href: '/services/endpoint-management',
    category: 'cloud'
  },
  {
    id: 'fn-finops-platform',
    title: 'FinOps Cloud Governance',
    description: 'Cloud financial governance platform with budget alerts, right-sizing recommendations, resource tagging enforcement, and chargeback/showback reporting.',
    features: [
      'Real-time budget alerts',
      'Auto right-sizing engine',
      'Resource tagging enforcement',
      'Chargeback + showback reports',
      'Multi-cloud cost view'
    ],
    benefits: [
      'Reduce cloud waste 30-50%',
      'No more bill shocks',
      'Enforce budget guardrails',
      'FinOps Foundation aligned'
    ],
    pricing: {
      basic: '0',
      pro: '149',
      enterprise: '799'
    },
    contactInfo: {
      website: '/services/fn-finops-platform',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '💰',
    href: '/services/fn-finops-platform',
    category: 'cloud'
  }
,
{
    id: 'identity-access-management',
    title: 'Identity & Access Management (IAM)',
    description: 'Enterprise IAM with SSO, MFA, privileged access management, and automated provisioning for secure, frictionless access across all applications.',
    features: ['Enterprise-grade implementation', '24/7 monitoring', 'Compliance-ready'],
    benefits: ['Reduced risk', 'Faster response', 'Audit-ready', 'Lower costs'],
    pricing: { basic: '1,999', pro: '4,999', enterprise: 'Custom' },
    contactInfo: { website: '/services/identity-access-management', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔑',
    href: '/services/identity-access-management',
    category: 'cloud'
  }
,
{
    id: 'it-5g-network-deployment',
    title: '5G Network Planning & Deployment',
    description: 'End-to-end 5G network architecture, RF planning, edge computing integration, and private 5G deployment for enterprise campuses and industrial IoT.',
    features: ['5G network architecture and RF planning', 'Private 5G network deployment for campuses', 'Edge computing integration with 5G infrastructure', 'Network slicing design and implementation', 'Industrial IoT connectivity and optimization'],
    benefits: ['Ultra-low latency for mission-critical applications', 'Massive IoT device connectivity at scale', 'Secure private networks off public infrastructure', 'Future-proof connectivity for digital transformation'],
    pricing: { basic: '9999', pro: '19999', enterprise: '49999' },
    contactInfo: { website: '/services/5g-network-deployment', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📶',
    href: '/services/it-5g-network-deployment',
    category: 'cloud'
  }
,
{
    id: 'it-api-management',
    title: 'API Management Platform & Developer Portal',
    description: 'Comprehensive API management - gateway, developer portal, monetization, analytics, and lifecycle management for enterprise API programs.',
    features: ['API gateway with rate limiting', 'Developer portal with docs and SDKs', 'Lifecycle management', 'Monetization', 'Real-time analytics'],
    benefits: ['Accelerate API adoption', 'Monetize APIs', 'Protect backends', 'Track performance'],
    pricing: { basic: '1499', pro: '3299', enterprise: '7499' },
    contactInfo: { website: '/services/api-management', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔌',
    href: '/services/it-api-management',
    category: 'cloud'
  }
,
{
    id: 'it-backup-disaster-recovery',
    title: 'Backup & Disaster Recovery Solutions',
    description: 'Enterprise-grade backup, replication, and disaster recovery — automated backups, immutable storage, multi-region replication, and one-click failover.',
    features: ['Automated incremental and full backup scheduling', 'Immutable backup storage (WORM) for ransomware protection', 'Multi-region replication for geographic redundancy', 'One-click disaster recovery with tested failover scripts', 'Compliance reporting and backup integrity verification'],
    benefits: ['Guarantee RPO of minutes, RTO of hours', 'Protect against ransomware with immutable backups', 'Meet all regulatory data retention requirements', 'Eliminate backup failures with automated monitoring'],
    pricing: { basic: '599', pro: '1299', enterprise: '2999' },
    contactInfo: { website: '/services/backup-recovery', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '💾',
    href: '/services/it-backup-disaster-recovery',
    category: 'cloud'
  }
,
{
    id: 'it-capacity-planning',
    title: 'IT Capacity Planning & Resource Forecasting',
    description: 'AI-driven capacity planning that forecasts compute, storage, and network requirements based on growth patterns and workload trends across your infrastructure.',
    features: ['Predictive capacity forecasting with ML models', 'Workload trend analysis and seasonal pattern detection', 'Cloud vs on-prem cost comparison modeling', 'Automated right-sizing recommendations', 'Budget impact simulation for capacity decisions'],
    benefits: ['Eliminate surprise capacity crises with early warnings', 'Optimize infrastructure spend by 25-40%', 'Plan capacity with 95% forecast accuracy', 'Make data-driven budget decisions'],
    pricing: { basic: '799', pro: '1799', enterprise: '3999' },
    contactInfo: { website: '/services/capacity-planning', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📊',
    href: '/services/it-capacity-planning',
    category: 'cloud'
  }
,
{
    id: 'it-database-as-a-service',
    title: 'Database-as-a-Service & Managed Data Platforms',
    description: 'Fully managed databases - PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch with automated backups, scaling, and AI-powered optimization.',
    features: ['Multi-engine provisioning', 'Automated backups and PITR', 'AI query optimization', 'Auto-scaling and HA', 'Encryption and compliance'],
    benefits: ['No DBA overhead needed', '99.99% uptime SLA', 'Optimize queries automatically', 'Scale effortlessly'],
    pricing: { basic: '799', pro: '1899', enterprise: '4499' },
    contactInfo: { website: '/services/database-as-a-service', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🗄️',
    href: '/services/it-database-as-a-service',
    category: 'cloud'
  }
,
{
    id: 'it-edge-computing-solutions',
    title: 'Edge Computing & IoT Infrastructure',
    description: 'Deploy compute closer to your data sources with edge computing architecture — low-latency processing, distributed AI inference, and resilient IoT device management.',
    features: ['Edge server deployment & configuration', 'Container orchestration at the edge (K3s, KubeEdge)', 'IoT device provisioning & lifecycle management', 'Low-latency AI inference on edge hardware', 'Offline-first data synchronization with cloud'],
    benefits: ['Sub-10ms response times for critical applications', 'Reduce cloud data transfer costs by 60%', 'Operate autonomously during network outages', 'Scale IoT deployments to thousands of devices'],
    pricing: { basic: '1299', pro: '2999', enterprise: '6499' },
    contactInfo: { website: '/services/edge-computing', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📡',
    href: '/services/it-edge-computing-solutions',
    category: 'cloud'
  }
,
{
    id: 'it-kubernetes-management',
    title: 'Container Orchestration & Kubernetes Management',
    description: 'Enterprise Kubernetes deployment, management, and optimization — multi-cluster orchestration, GitOps workflows, and service mesh implementation.',
    features: ['Multi-cluster Kubernetes orchestration', 'GitOps deployment pipelines with ArgoCD', 'Service mesh implementation (Istio, Linkerd)', 'Automated scaling and self-healing', 'Cost optimization and resource right-sizing'],
    benefits: ['Reduce infrastructure costs by 40%', 'Zero-downtime deployments with blue-green', 'Accelerate developer velocity 3x', 'Enterprise-grade reliability and observability'],
    pricing: { basic: '799', pro: '1799', enterprise: '3999' },
    contactInfo: { website: '/services/kubernetes-management', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🐳',
    href: '/services/it-kubernetes-management',
    category: 'cloud'
  }
,
{
    id: 'it-microservices-architecture',
    title: 'Microservices Architecture & API Gateway Design',
    description: 'Design and implement scalable microservices architectures with API gateways, service discovery, distributed tracing, and event-driven communication patterns.',
    features: ['Domain-driven service decomposition', 'API gateway design and implementation (Kong, APISIX)', 'Service mesh deployment (Istio, Linkerd)', 'Distributed tracing and observability', 'Event-driven architecture with message brokers'],
    benefits: ['Independent deployment and scaling per service', 'Reduced blast radius for failures', 'Technology polyglotism for optimal tooling', 'Accelerated development velocity with team autonomy'],
    pricing: { basic: '1999', pro: '4999', enterprise: '12999' },
    contactInfo: { website: '/services/microservices-architecture', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🧩',
    href: '/services/it-microservices-architecture',
    category: 'cloud'
  }
,
{
    id: 'it-network-automation',
    title: 'Network Automation & SD-WAN Management',
    description: 'Automated network configuration, monitoring, and optimization with SD-WAN, intent-based networking, and AI-driven performance management.',
    features: ['Intent-based network configuration automation', 'SD-WAN deployment and centralized management', 'AI-driven traffic routing and QoS optimization', 'Automated compliance checks and security policy enforcement', 'Network performance monitoring with predictive alerts'],
    benefits: ['Reduce network change errors by 80%', 'Optimize WAN costs by 40-60% with SD-WAN', 'Automate repetitive network administration tasks', 'Proactively address performance degradations'],
    pricing: { basic: '999', pro: '2299', enterprise: '5499' },
    contactInfo: { website: '/services/network-automation', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🌐',
    href: '/services/it-network-automation',
    category: 'cloud'
  }
,
{
    id: 'it-platform-engineering',
    title: 'Platform Engineering & Internal Developer Portal',
    description: 'Build internal developer platforms with self-service infrastructure provisioning, golden paths, and developer experience optimization to accelerate team productivity.',
    features: ['Internal developer platform (IDP) deployment', 'Self-service infrastructure provisioning', 'Golden path templates and scaffolding', 'Developer experience metrics and optimization', 'Integration with existing CI/CD pipelines'],
    benefits: ['Reduce developer onboarding time by 80%', 'Eliminate infrastructure request bottleneck', 'Standardize best practices across teams', 'Accelerate feature delivery by 2-3x'],
    pricing: { basic: '2499', pro: '5499', enterprise: '12999' },
    contactInfo: { website: '/services/platform-engineering', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🛠️',
    href: '/services/it-platform-engineering',
    category: 'cloud'
  }
,
{
    id: 'it-serverless-architecture',
    title: 'Serverless Architecture & Function-as-a-Service',
    description: 'Design and migrate to serverless architectures - automatic scaling, pay-per-use pricing, and zero infrastructure management across AWS Lambda, Azure, and GCP Cloud Run.',
    features: ['Serverless architecture design and migration', 'Cold start optimization', 'Event-driven architecture', 'Cost monitoring and function optimization', 'Multi-cloud serverless deployment'],
    benefits: ['Reduce infrastructure costs by 80%', 'No server management', 'Auto-scaling', 'Pay per compute execution'],
    pricing: { basic: '1799', pro: '3999', enterprise: '8999' },
    contactInfo: { website: '/services/serverless-architecture', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '☁️',
    href: '/services/it-serverless-architecture',
    category: 'cloud'
  }
,
{
    id: 'it-voice-infrastructure',
    title: 'Voice Infrastructure & Contact Center Solutions',
    description: 'Modern contact center infrastructure - SIP trunking, IVR design, call routing, quality monitoring, and AI agent assistance.',
    features: ['SIP and VoIP infrastructure', 'Intelligent routing and IVR', 'Call quality monitoring', 'AI agent assistance', 'Omnichannel integration'],
    benefits: ['Reduce voice costs by 40%', 'Improve CSAT with smart routing', 'Call analytics insights', 'CRM integration ready'],
    pricing: { basic: '1299', pro: '2899', enterprise: '6499' },
    contactInfo: { website: '/services/voice-infrastructure', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📞',
    href: '/services/it-voice-infrastructure',
    category: 'cloud'
  }
,
{
    id: 'it-wireless-network-design',
    title: 'Wireless Network Design & Optimization',
    description: 'Enterprise Wi-Fi and wireless infrastructure design, site surveys, RF optimization, and capacity planning for campuses, warehouses, and smart buildings.',
    features: ['Predictive and on-site RF surveys', 'Capacity planning and density optimization', 'IoT and sensor network design', 'Seamless roaming and load balancing', 'Security hardening (WPA3, 802.1X, NAC)'],
    benefits: ['Eliminate dead zones with precision design', 'Support 10,000+ concurrent devices per site', 'Seamless IoT and traditional device integration', 'Future-proof for Wi-Fi 6E and Wi-Fi 7'],
    pricing: { basic: '2999', pro: '7499', enterprise: '18999' },
    contactInfo: { website: '/services/wireless-network', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📡',
    href: '/services/it-wireless-network-design',
    category: 'cloud'
  }
,
{
    id: 'it-asset-management',
    title: 'IT Asset Management & Lifecycle',
    description: 'Complete IT asset lifecycle management from procurement to disposal with automated discovery and license tracking.',
    features: ['Enterprise-grade implementation', '24/7 monitoring', 'Compliance-ready'],
    benefits: ['Reduced risk', 'Faster response', 'Audit-ready', 'Lower costs'],
    pricing: { basic: '799', pro: '1,999', enterprise: 'Custom' },
    contactInfo: { website: '/services/it-asset-management', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📦',
    href: '/services/it-asset-management',
    category: 'cloud'
  }
,
{
    id: 'it-service-desk',
    title: 'IT Service Desk & Help Desk',
    description: 'Multi-channel IT support with AI-powered ticket triage, self-service portals, SLA management, and automated resolution for 60%+ of common issues.',
    features: ['Enterprise-grade implementation', '24/7 monitoring', 'Compliance-ready'],
    benefits: ['Reduced risk', 'Faster response', 'Audit-ready', 'Lower costs'],
    pricing: { basic: '1,999', pro: '4,999', enterprise: 'Custom' },
    contactInfo: { website: '/services/it-service-desk', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🎧',
    href: '/services/it-service-desk',
    category: 'cloud'
  },
  {
    id: 'load-balancer-service',
    title: 'Intelligent Load Balancer',
    description: 'Layer 4 and Layer 7 load balancing with health checks, sticky sessions, rate limiting, WAF included, and auto-scaling across regions.',
    features: [
      'L4 + L7 simultaneous',
      'Health check + failover',
      'Rate limiting + WAF built-in',
      'Session stickiness config',
      'Anycast global routing'
    ],
    benefits: [
      'Zero downtime during failover',
      'Bots blocked at the edge',
      'Global users get nearest PoP',
      'Upstream costs drop'
    ],
    pricing: {
      basic: '9',
      pro: '49',
      enterprise: '399'
    },
    contactInfo: {
      website: '/services/load-balancer-service',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '⚖️',
    href: '/services/load-balancer-service',
    category: 'cloud'
  }
,
{
    id: 'managed-soc-security',
    title: 'Managed SOC & Security Operations',
    description: '24/7 Security Operations Center services with AI-powered threat detection, incident response, and continuous monitoring for your entire infrastruct...',
    features: ['Enterprise-grade implementation', '24/7 monitoring', 'Compliance-ready'],
    benefits: ['Reduced risk', 'Faster response', 'Audit-ready', 'Lower costs'],
    pricing: { basic: '1,999', pro: '4,999', enterprise: 'Custom' },
    contactInfo: { website: '/services/managed-soc-security', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🛡️',
    href: '/services/managed-soc-security',
    category: 'cloud'
  }
,
{
    id: 'mobile-development',
    title: 'Mobile App Development',
    description: 'Build cross-platform and native mobile applications with AI-powered features, offline-first architecture, and enterprise-grade security.',
    features: ['Enterprise-grade implementation', '24/7 monitoring', 'Compliance-ready'],
    benefits: ['Reduced risk', 'Faster response', 'Audit-ready', 'Lower costs'],
    pricing: { basic: '899', pro: '1999', enterprise: '4499' },
    contactInfo: { website: '/services/mobile-development', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '📱',
    href: '/services/mobile-development',
    category: 'cloud'
  }
,
{
    id: 'network-infrastructure',
    title: 'Enterprise Network Infrastructure',
    description: 'Design, deploy, and manage enterprise-grade networks with SD-WAN, wireless optimization, zero-trust architecture, and real-time performance monitor...',
    features: ['Enterprise-grade implementation', '24/7 monitoring', 'Compliance-ready'],
    benefits: ['Reduced risk', 'Faster response', 'Audit-ready', 'Lower costs'],
    pricing: { basic: '1,999', pro: '4,999', enterprise: 'Custom' },
    contactInfo: { website: '/services/network-infrastructure', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🌐',
    href: '/services/network-infrastructure',
    category: 'cloud'
  }
,
{
    id: 'network-security-operations',
    title: 'Network Security Operations Center',
    description: '24/7 network security monitoring, threat detection, incident response, and vulnerability management.',
    features: ['Enterprise-grade implementation', '24/7 monitoring', 'Compliance-ready'],
    benefits: ['Reduced risk', 'Faster response', 'Audit-ready', 'Lower costs'],
    pricing: { basic: '4,999', pro: '12,999', enterprise: 'Custom' },
    contactInfo: { website: '/services/network-security-operations', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🛡️',
    href: '/services/network-security-operations',
    category: 'cloud'
  },
  {
    id: 'virtual-private-cloud',
    title: 'Virtual Private Cloud',
    description: 'Dedicated VPC with custom CIDR, isolated network topology, private subnet routing, VPC peering, and cross-VPC transit across any cloud provider.',
    features: [
      'Custom CIDR and VPC design',
      'Private subnet with no internet',
      'VPC peering & transit gateway',
      'Centralized network routing',
      'DDoS with clean traffic'
    ],
    benefits: [
      'Isolated network perimeter',
      'Meet strict compliance needs',
      'Cross-cloud private links',
      'Full network control'
    ],
    pricing: {
      basic: '299',
      pro: '999',
      enterprise: '4999'
    },
    contactInfo: {
      website: '/services/virtual-private-cloud',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🌐',
    href: '/services/virtual-private-cloud',
    category: 'cloud'
  },
  {id:'aws-serverless-migration',title:'AWS Serverless Migration',description:'Migrate EC2/S3 apps to serverless: Lambda + API Gateway + DynamoDB event-driven. Schema migration dual-write zero-downtime cutover — saves compute costs 60-80%.',features:['Event-driven refactoring (SNS/SQS/Lambda)','DynamoDB single-table pattern design','Lambda cold-start + provisioned concurrency','Dual-write validation during migration window','RTO/RPO dashboard per migrated workload'],benefits:['60-80% compute cost reduction vs EC2','Zero-downtime cutover with dual-write','Auto-scale 0 to 10k RPS no cluster provisioning','Serverless ops overhead near-zero'],pricing:{basic:'2499',pro:'7499',enterprise:'24999'},contactInfo:{website:'/services/aws-serverless-migration',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/aws-serverless-migration',category:'cloud'},
  {id:'cspm-cloud-posture',title:'Cloud Security Posture Management (CSPM)',description:'Continuous cloud posture: IAM overprivilege, misconfigured S3, exposed RDS, public subnets. Drift detection + auto-remediation via Terraform per AWS/GCP/Azure.',features:['Multi-cloud IAM + resource posture scanner','Misconfiguration auto-remediation (Terraform)','Drift detection from desired baseline','Compliance report (SOC 2/ISO 27001/PCI DSS)','Risk scoring per resource + alert on threshold'],benefits:['Fix cloud misconfig in minutes not manually','Prevent data breach from open S3 buckets','Continuous compliance no manual audit report','Drift auto-remediated before attacker leverages'],pricing:{basic:'149',pro:'399',enterprise:'1299'},contactInfo:{website:'/services/cspm-cloud-posture',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/cspm-cloud-posture',category:'cloud'},
  {id:'ai-cloud-cost-optimizer',title:'AI Cloud Cost Optimizer',description:'Continuously analyze cloud spend (AWS, Azure, GCP) and auto-implement cost-saving: rightsizing, reserved instances, spot switching, idle cleanup, anomaly detection.',features:['Multi-cloud cost aggregation + normalization','AI-driven rightsizing recommendations','Automated RI/SP purchase optimization','Idle resource detection + auto-cleanup','Anomaly detection + budget alerts'],benefits:['Save 30-40% on cloud spend','Zero upfront engineering effort','Prevent cost overruns proactively','Cost attribution by team/project'],pricing:{basic:'149',pro:'349',enterprise:'1199'},contactInfo:{website:'/services/ai-cloud-cost-optimizer',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/ai-cloud-cost-optimizer',category:'cloud'},
  {id:'gcp-data-analytics-platform',title:'GCP Data Analytics Platform',description:'End-to-end GCP analytics: BigQuery, Dataflow, Pub/Sub streaming, Looker dashboards. GCS Delta Lakehouse with partition pruning and auto-clustering.',features:['BigQuery + partition-cluster auto-tuning','Dataflow batch + streaming pipelines','Pub/Sub to BigQuery streaming ingestion','Looker Studio + Looker dashboards','GCS Delta Lakehouse (Iceberg/Delta)'],benefits:['Start analytics in days not months','Serverless no cluster management','Real-time + batch from single pipeline','Pay-per-query no over-provisioned cluster'],pricing:{basic:'1999',pro:'5999',enterprise:'19999'},contactInfo:{website:'/services/gcp-data-analytics-platform',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/gcp-data-analytics-platform',category:'cloud'},
  {id:'hybrid-multi-cloud-net',title:'Hybrid Multi-Cloud Networking',description:'Unified networking across private DC + public clouds: VPC peering, VPN/Direct Connect/Interconnect, centralized routing, cloud firewall, Istio/Linkerd cross-cloud mesh.',features:['Cross-cloud VPC peering + VPN mesh','Transit Gateway/Cloud Router centralized routing','Cloud firewall + centralized egress','Istio/Linkerd cross-cloud service mesh','Centralized observability per cross-cloud request'],benefits:['Single networking control plane across all clouds','Avoid cloud lock-in by design','Private connectivity sub-2ms intra-cloud','Cross-cloud failover DR sub-minute RPO/RTO'],pricing:{basic:'4499',pro:'12999',enterprise:'44999'},contactInfo:{website:'/services/hybrid-multi-cloud-net',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/hybrid-multi-cloud-net',category:'cloud'},
  {id:'k8s-gitops-enterprise',title:'Kubernetes GitOps Enterprise Platform',description:'Full GitOps on Kubernetes: ArgoCD + Argo Rollouts (canary/blue-green), Terraform provisioning, Kyverno admission policy, automated drift remediation.',features:['ArgoCD GitOps synchronization per environment','Argo Rollouts progressive delivery canary/blue-green','Terraform (EKS/GKE/AKS) provisioning','Kyverno admission policy engine','Drift auto-remediation reconciler'],benefits:['GitOps audit trail, no manual kubectl','Progressive delivery canary/blue-green','Zero-drift enforced by reconciler','Policy-as-code compliance-by-configuration'],pricing:{basic:'999',pro:'2999',enterprise:'9999'},contactInfo:{website:'/services/k8s-gitops-enterprise',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/k8s-gitops-enterprise',category:'cloud'},
  {id:'reliability-sre',title:'Reliability Platform & SRE Enablement',description:'SRE platform: SLO/SLI framework, error budget tracking, On-Call (PagerDuty/OpsGenie), escalation policy, runbook auto-generation, MTTD/MTTR dashboard.',features:['Error budget policy + burn rate alerting','On-Call rotation (PagerDuty/OpsGenie)','Auto-generated incident runbook per alert type','MTTD/MTTR dashboard per team/service','Post-incident review template + reminder scheduler'],benefits:['99.9%+ uptime SLA with error budget discipline','Reduce MTTD/MTTR by 60% with on-call playbooks','Team SRE coaching, not just platform tools','Incident review institutionalizes learning'],pricing:{basic:'699',pro:'1899',enterprise:'5999'},contactInfo:{website:'/services/reliability-sre',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/reliability-sre',category:'cloud'},
  {id:'serverless-api-platform',title:'Serverless API Production Platform',description:'Production serverless API: API Gateway + Lambda, OpenAPI-first gateway, per-route WAF+Shield, distributed tracing, CI/CD spec-to-gateway pipeline.',features:['API Gateway + Lambda per route','OpenAPI-first gateway from spec','Per-route WAF + Shield DDoS protection','X-Ray distributed tracing per request','CI/CD spec-driven deploy pipeline'],benefits:['Auto-scale 0 to 10k RPS','Per-route WAF, no shared firewall','Route-level monitoring + tracing','SLA: 99.99% zero infra management'],pricing:{basic:'499',pro:'1299',enterprise:'3999'},contactInfo:{website:'/services/serverless-api-platform',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/serverless-api-platform',category:'cloud'},
  {id:'sovereign-cloud-hosting',title:'Sovereign & Regulated Cloud Hosting',description:'Deploy to sovereign cloud regions (AWS GovCloud, Azure Government, GCP for Canada/Germany) with compliance audit-ready (FedRAMP, ITAR, CJIS, HIPAA, PCI, GDPR).',features:['Sovereign region deployment (GovCloud/Government)','Data residency enforcement per region','Compliance audit framework (FedRAMP/ITAR/CJIS/HIPAA)','Regional failover within same sovereign zone','Immutable access log audit trail'],benefits:['Deploy in FedRAMP/ITAR/CJIS-compliant clouds','Meet sovereign data residency requirements','Cross-region failover within sovereign boundary','Pre-configured compliance per regulated industry'],pricing:{basic:'4999',pro:'14999',enterprise:'49999'},contactInfo:{website:'/services/sovereign-cloud-hosting',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/sovereign-cloud-hosting',category:'cloud'},
  {id:'zero-trust-network-access',title:'Zero-Trust Network Access (ZTNA)',description:'Zero-trust identity-aware proxy: every connection authenticated per user/device/context. Granular per-app policies, micro-segmentation, session recording.',features:['Identity-aware proxy (IAM to ZTNA gateway)','Per-user + per-device + per-context access policy','Micro-segmentation per app/resource sensitivity','Session recording + threat analytics','Continuous trust evaluation re-auth on risk'],benefits:['Zero implicit trust — all connections authenticated','Block lateral movement from compromised device','Granular per-resource access without VPN','Meet NIST SP 800-207 Zero Trust requirements'],pricing:{basic:'299',pro:'799',enterprise:'2499'},contactInfo:{website:'/services/zero-trust-network-access',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/zero-trust-network-access',category:'cloud'},
  {id:'sovereign-cloud-hosting',title:'Sovereign & Regulated Cloud Hosting',description:'Sovereign cloud hosting: data residency guaranteed within a single country or region, fully air-gapped from global internet egress, blockchain-based audit trail for data access. Compliant with FedRAMP High and IL4.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/sovereign-cloud-hosting',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/sovereign-cloud-hosting',category:'cloud'},
  {id:'serverless-api-platform',title:'Serverless API Production Platform',description:'Serverless API platform: auto-generates REST and GraphQL APIs from your database schema, handles auth, rate limiting, caching, and observability. Deploys to Vercel, Netlify, or AWS in under 60 seconds per API.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/serverless-api-platform',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/serverless-api-platform',category:'cloud'},
  {id:'hybrid-multi-cloud-net',title:'Hybrid Multi-Cloud Networking',description:'Unified networking across AWS, GCP, Azure, and on-prem. Centralised route table, cross-cloud VPC peering, shared firewall policy, DDoS scrubbing, bandwidth aggregation, and a single-pane traffic dashboard.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/hybrid-multi-cloud-net',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/hybrid-multi-cloud-net',category:'cloud'},
  {id:'gcp-data-analytics-platform',title:'GCP Data Analytics Platform',description:'End-to-end data analytics on Google Cloud: BigQuery ELT, Dataflow streaming pipelines, Looker dashboards, Vertex AI model deployment. Migrates from legacy data warehouses to cloud-native.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/gcp-data-analytics-platform',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/gcp-data-analytics-platform',category:'cloud'},
  {id:'edge-computing-deploy',title:'Edge Computing & Edge AI Deployment',description:'Edge computing deployment platform: deploys inferencing, API gateways, and data pipelines to 200-plus edge locations (Cloudflare Workers, Fastly Compute, AWS Wavelength, Akamai EdgeWorkers) with zero configuration.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/edge-computing-deploy',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/edge-computing-deploy',category:'cloud'},
  {id:'cspm-cloud-posture',title:'Cloud Security Posture Management (CSPM)',description:'Cloud Security Posture Management: continuously scans AWS, GCP, and Azure configs against CIS, NIST, and custom guardrails. Auto-remediation of misconfigurations, drift detection, and risk scoring per resource.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/cspm-cloud-posture',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/cspm-cloud-posture',category:'cloud'},
  {id:'cloud-native-app-dev',title:'Cloud-Native Application Development',description:'Cloud-native application development on Kubernetes: 12-factor patterns, service mesh (Istio or Linkerd), GitOps CI/CD, and observability by default. Delivers production-grade microservices in four to six weeks.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/cloud-native-app-dev',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/cloud-native-app-dev',category:'cloud'},
  {id:'aws-serverless-migration',title:'AWS Serverless Migration',description:'End-to-end serverless migration on AWS: Lambda, API Gateway, DynamoDB, SNS/SQS. Refactors monoliths to event-driven microservices, builds CI/CD pipelines, and provides cost comparison before and after migration.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/aws-serverless-migration',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/aws-serverless-migration',category:'cloud'},
];

export const securityServices: Service[] = [  {
    id: 'security-threat-intelligence-platform',
    title: 'Threat Intelligence Platform',
    description: 'Curated IOC/IOA feed, TI graph, MITRE ATT&CK mapping, automated SIEM rule generation, and TI alert enrichment pipeline.',
    icon: '★',
    features: ['5000+ IOC feed (IP/Domain/URL/Hash)', 'MITRE ATT&CK technique coverage matrix', 'Auto-generate SIEM rule per new IOC', 'TI enrichment API for alert enrichment pipeline'],
    benefits: ['Context-rich alerts without manual TI lookup', 'Map every alert to MITRE technique for hunt', 'Feed freshness = actionable TI', 'Zero false-positive noise from curated IOC'],
    pricing: {'basic': '1999', 'pro': '4999', 'enterprise': '14999'},
    contactInfo: { website: '/services/security-threat-intelligence-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/security-threat-intelligence-platform',
    category: 'security',
    popular: false,
  },
  {
    id: 'security-identity-governance-igac',
    title: 'Identity Governance & Administration (IGA)',
    description: 'Automated access review, SoD policy check, certification campaign, identity auto-provisioning/revocation, and entitlement analytics.',
    icon: '★',
    features: ['Automated access-review campaign per user/role', 'SoD (Segregation of Duties) rule engine', 'Auto-provision/revoke via SCIM API', 'Entitlement analytics + orphaned-access detection'],
    benefits: ['Pass SOX/PCI access review on time', 'Eliminate excessive-access risk automatically', 'Reduces admin overhead on IAM team', 'Remove orphaned accounts before they are exploited'],
    pricing: {'basic': '2999', 'pro': '6999', 'enterprise': '19999'},
    contactInfo: { website: '/services/security-identity-governance-igac', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/security-identity-governance-igac',
    category: 'security',
    popular: false,
  },
  {
    id: 'security-network-segmentation-zero-trust',
    title: 'Network Segmentation & Zero Trust',
    description: 'Micro-segmentation policy design per workload, East-West traffic policy enforcement, and SIEM policy-deployment rollback alert.',
    icon: '★',
    features: ['Service/workload inventory (K8s/VM/CNI)', 'East-West micro-segmentation policy designer', 'Policy deployment + rollback alert', 'Policy coverage heat-map per namespace'],
    benefits: ['Lateral movement blocked at network layer', 'East-West traffic inspected, not just perimeter', 'Contain breach blast radius to one pod', 'Policy as code = versioned + auditable'],
    pricing: {'basic': '2499', 'pro': '5999', 'enterprise': '17999'},
    contactInfo: { website: '/services/security-network-segmentation-zero-trust', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/security-network-segmentation-zero-trust',
    category: 'security',
    popular: false,
  },
  {
    id: 'security-cloud-threat-detection',
    title: 'Cloud Threat Detection & Response',
    description: 'CloudTrail/CloudAudit log analytics, IAM anomaly detection (impossible travel, priv-esc pattern), GuardDuty integration, auto-remediation.',
    icon: '★',
    features: ['CloudTrail/Azure Activity/Stackdriver log stream', 'IAM anomaly patterns (impossible travel/priv-esc)', 'GuardDuty/Defender/Sentinel alert normalisation', 'Auto-remediation via Terraform/IaC config push'],
    benefits: ['Detect cloud compromise in hours not months', 'Shorten cloud IR cycle from days to hours', 'Contain cloud breach before lateral movement', 'Automate common remediation, no human needed'],
    pricing: {'basic': '1999', 'pro': '4999', 'enterprise': '14999'},
    contactInfo: { website: '/services/security-cloud-threat-detection', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/security-cloud-threat-detection',
    category: 'security',
    popular: false,
  },
  {
    id: 'security-vulnerability-management-pra',
    title: 'Proactive Remediation (PRM)',
    description: 'Asset inventory, CVE prioritisation by EPSS/CVSS/business criticality, SLA-gated fix workflow, and remediation effectiveness report.',
    icon: '★',
    features: ['Asset inventory per business criticality tier', 'CVE prioritisation: EPSS + CVSS + exposure', 'SLA-gated fix workflow (critical = 48h)', 'Remediation effectiveness (MTTR per tier)'],
    benefits: ['Fix 80% high-risk CVEs in SLA window', 'Prioritise by exploitability, not just severity', 'Tie remediation SLA to business impact', 'Track team MTTR to prove improvement'],
    pricing: {'basic': '1999', 'pro': '4999', 'enterprise': '14999'},
    contactInfo: { website: '/services/security-vulnerability-management-pra', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/security-vulnerability-management-pra',
    category: 'security',
    popular: false,
  },
  {
    id: 'security-privacy-program-automation',
    title: 'Privacy Program Automation',
    description: 'DPIA/LIA workflow, consent receipt ledger, DSAR ticketing + fulfilment SLA tracker, and automated GDPR/CCPA disclosure.',
    icon: '★',
    features: ['DPIAs/LIAs auto-route per data type', 'Consent receipt ledger + preference store', 'DSAR ticketing + fulfilment SLA tracker', 'Automated data subject disclosure PDF'],
    benefits: ['Pass privacy audit in days not months', 'Cut DSAR fulfilment time from weeks to days', 'Maintain consent compliance forever', 'Privacy operations scale without hiring'],
    pricing: {'basic': '2499', 'pro': '5999', 'enterprise': '17999'},
    contactInfo: { website: '/services/security-privacy-program-automation', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/security-privacy-program-automation',
    category: 'security',
    popular: false,
  },
  {
    id: 'security-api-security-gateway',
    title: 'API Security Gateway',
    description: 'OAuth2/JWT/SAML auth, OWASP Top-10 attack detection, schema drift alert, bot detection, per-endpoint threat score card.',
    icon: '★',
    features: ['OAuth2/JWT/SAML auth per route/group', 'OWASP Top-10 attack pattern detection', 'Schema drift alert + active API inventory', 'Bot detection + anomaly scoring per IP/UA'],
    benefits: ['Block API attacks before they reach service', 'OWASP Top-10 compliance per endpoint', 'Schema drift alert before breaking client', 'Automated API inventory = no shadow API'],
    pricing: {'basic': '2999', 'pro': '6999', 'enterprise': '19999'},
    contactInfo: { website: '/services/security-api-security-gateway', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/security-api-security-gateway',
    category: 'security',
    popular: false,
  },
  {
    id: 'security-secrets-management-vault',
    title: 'Secrets Management & Vault',
    description: 'HashiCorp Vault with dynamic secrets, lease/rotation, cross-cluster replication, and full audit trail with SOC 2 Type II evidence pack.',
    icon: '★',
    features: ['HashiCorp Vault managed cluster (HA)', 'Dynamic secrets (DB/cloud/SSH/K8s)', 'Lease auto-rotation per secret-type', 'Full audit log + SOC 2 Type II evidence report'],
    benefits: ['Rotate all secrets automatically forever', 'Short-lived dynamic = reduced blast radius', 'Dynamic secrets = no more credential sprawl', 'SOC 2 Type II evidence = pass audit every time'],
    pricing: {'basic': '1999', 'pro': '4999', 'enterprise': '14999'},
    contactInfo: { website: '/services/security-secrets-management-vault', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/security-secrets-management-vault',
    category: 'security',
    popular: false,
  },
  {
    id: 'security-security-awareness-training',
    title: 'Security Awareness Training Platform',
    description: 'Phishing simulation, training modules per role, compliance quiz tracking, gamified leaderboard, and risk scoring per employee/team.',
    icon: '★',
    features: ['Phishing simulation (template library 200+)', 'Role-based security training modules', 'Compliance quiz tracking + certificate', 'Gamified leaderboard per team/department'],
    benefits: ['Reduce click-through rate on phishing 70%+', 'Document annual security training', 'Gamify security = higher engagement', 'Risk scorecard per employee/team'],
    pricing: {'basic': '99', 'pro': '249', 'enterprise': '999'},
    contactInfo: { website: '/services/security-security-awareness-training', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/security-security-awareness-training',
    category: 'security',
    popular: false,
  },
  {
    id: 'security-compliance-audit-platform',
    title: 'Compliance & Audit Automation',
    description: 'SOC 2 Type II evidence collection, control-test automation, GRC Evidence Vault, continuous monitoring dashboard, and auditor-ready report.',
    icon: '★',
    features: ['SOC 2 Type II evidence auto-collection', 'Control-test automation (30+ pre-built tests)', 'GRC Evidence Vault (versioned, immutable)', 'Continuous monitoring dashboard per control'],
    benefits: ['SOC 2 audit in days, not months', 'Evidence auto-collected, no manual screenshots', 'Control test results = real-time audit', 'Spend hours on audit, not weeks gathering evidence'],
    pricing: {'basic': '3499', 'pro': '7999', 'enterprise': '24999'},
    contactInfo: { website: '/services/security-compliance-audit-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/security-compliance-audit-platform',
    category: 'security',
    popular: false,
  },

  {
    id: 'automated-pen-testing',
    title: 'Automated Penetration Testing',
    description: 'Continuous, automated penetration testing of web apps, APIs, and infrastructure with CVE scanning, exploitable-path reporting, and fix verification.',
    features: [
      'Automated OWASP Top 10 scans',
      'API security testing',
      'Infrastructure CVE scan',
      'Exploitable-path chain reports',
      'Remediation ticket integration'
    ],
    benefits: [
      'Test continuously, not quarterly',
      'Find zero-days before attackers',
      'PCI DSS Requirement 11 met',
      'Track fix progress live'
    ],
    pricing: {
      basic: '499',
      pro: '1499',
      enterprise: '4999'
    },
    contactInfo: {
      website: '/services/automated-pen-testing',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🕷️',
    href: '/services/automated-pen-testing',
    category: 'security'
  },
  {
    id: 'container-security-runtime',
    title: 'Container Security Runtime',
    description: 'Kubernetes-aware container security with image scanning, admission control, runtime threat detection, secret scanning, and CVSS scoring in CI/CD pipelines.',
    features: [
      'Image vulnerability scan',
      'K8s admission control',
      'Runtime threat detection',
      'Secret scanning (registry + env)',
      'SBOM generation on push'
    ],
    benefits: [
      'Zero vulnerable images deploy',
      'Detect zero-days in K8s runtime',
      'Prevent secret exfiltration',
      'SBOM meets SBOM Executive Order'
    ],
    pricing: {
      basic: '0',
      pro: '19',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/services/container-security-runtime',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🐳',
    href: '/services/container-security-runtime',
    category: 'security'
  }
,
{
    id: 'cybersecurity',
    title: 'Cybersecurity & Penetration Testing',
    description: 'Comprehensive security assessments, vulnerability management, and incident response to protect your digital assets.',
    features: [
      'Network & web application penetration testing',
      'Vulnerability scanning & remediation',
      'Security awareness training',
      'Incident response & forensics',
      'Compliance audits (SOC 2, ISO 27001)'
    ],
    benefits: [
      'Identify critical vulnerabilities before attackers',
      'Meet regulatory compliance requirements',
      'Reduce breach risk by 90%',
      '24/7 threat monitoring'
    ],
    pricing: {
      basic: '2499',
      pro: '5999',
      enterprise: '14999'
    },
    contactInfo: {
      website: '/services/cybersecurity',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔒',
    href: '/services/cybersecurity',
    popular: true,
    category: 'security'
  },
  {
    id: 'digital-rights-management',
    title: 'Digital Rights Management',
    description: 'Protect digital assets with AES-256 encryption, watermarking, usage restrictions, and access revocation for IP-sensitive document sharing.',
    features: [
      'AES-256 at-rest encryption',
      'Dynamic watermarking',
      'Usage restrictions (view/print)',
      'Access revocation',
      'Audit trail'
    ],
    benefits: [
      'Prevent IP theft',
      'Watermark sensitive docs',
      'Revoke access instantly',
      'Prove compliance'
    ],
    pricing: {
      basic: '49',
      pro: '149',
      enterprise: '599'
    },
    contactInfo: {
      website: '/services/digital-rights-management',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔒',
    href: '/services/digital-rights-management',
    category: 'security'
  },
  {
    id: 'iam-identity-platform',
    title: 'IAM & Identity Platform',
    description: 'Cloud-native identity and access management with SSO, MFA, SCIM provisioning, and compliance reporting for enterprise.',
    features: [
      'SSO / SAML / OIDC',
      'MFA / TOTP / WebAuthn',
      'SCIM auto-provisioning',
      'RBAC + ABAC policies',
      'Audit & compliance logs'
    ],
    benefits: [
      'Reduce breach risk',
      'Zero-trust access',
      'SOC 2 / ISO ready',
      'Eliminate VPN sprawl'
    ],
    pricing: {
      basic: '9',
      pro: '29',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/services/iam-identity-platform',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔐',
    href: '/services/iam-identity-platform',
    category: 'security'
  }
,
{
    id: 'it-identity-access-management',
    title: 'Identity & Access Management (IAM) Platform',
    description: 'Enterprise IAM with SSO, MFA, PAM, and automated access provisioning across cloud and on-premise systems — Zero Trust-ready identity governance.',
    features: ['Single sign-on (SSO) with 5000+ app integrations', 'Adaptive multi-factor authentication with risk scoring', 'Privileged access management (PAM) with session recording', 'Automated access provisioning and de-provisioning', 'Identity governance with access certification workflows'],
    benefits: ['Reduce access-related incidents by 90%', 'Achieve 100% compliance with identity best practices', 'Eliminate orphaned accounts and access creep', 'Seamless experience with frictionless SSO for users'],
    pricing: { basic: '999', pro: '2499', enterprise: '5999' },
    contactInfo: { website: '/services/iam-platform', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔑',
    href: '/services/it-identity-access-management',
    category: 'security'
  }
,
{
    id: 'it-incident-response',
    title: 'Incident Response & Security Operations Center',
    description: '24/7 SOC and incident response - threat detection, investigation, containment, recovery with automated playbooks and forensics.',
    features: ['24/7 monitoring', 'Auto detection and classification', 'Response playbook automation', 'Digital forensics', 'Executive reporting'],
    benefits: ['Reduce MTTD by 80%', 'Automated containment', 'Compliance-ready docs', 'Expert IR on demand'],
    pricing: { basic: '2999', pro: '6499', enterprise: '14999' },
    contactInfo: { website: '/services/incident-response', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🚨',
    href: '/services/it-incident-response',
    category: 'security'
  }
,
{
    id: 'it-network-security-monitoring',
    title: 'Network Security Monitoring & SIEM',
    description: 'Real-time network traffic analysis, threat correlation, and centralized Security Information and Event Management (SIEM) for enterprises requiring continuous security posture visibility.',
    features: ['24/7 network traffic monitoring & flow analysis', 'Centralized SIEM with log aggregation', 'Threat correlation engine with automated alerting', 'Custom dashboard & compliance reporting', 'Integration with firewalls, IDS/IPS, and endpoint protection'],
    benefits: ['Detect lateral movement within minutes, not months', 'Centralize security visibility across all infrastructure', 'Reduce alert fatigue with intelligent correlation', 'Meet regulatory requirements with automated reports'],
    pricing: { basic: '899', pro: '1999', enterprise: '4499' },
    contactInfo: { website: '/services/network-security-monitoring', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🛡️',
    href: '/services/it-network-security-monitoring',
    category: 'security'
  }
,
{
    id: 'it-penetration-testing',
    title: 'Penetration Testing & Vulnerability Assessment',
    description: 'Comprehensive security testing — network, web application, API, and social engineering assessments with detailed remediation reports and retesting.',
    features: ['Black-box and white-box penetration testing', 'Web application and API security testing', 'Social engineering and phishing simulations', 'Wireless and network infrastructure testing', 'Detailed remediation reports with retesting'],
    benefits: ['Identify vulnerabilities before attackers do', 'Meet PCI-DSS, HIPAA, and SOC 2 testing requirements', 'Reduce attack surface with actionable reports', 'Validate security controls effectiveness'],
    pricing: { basic: '2999', pro: '5999', enterprise: '12999' },
    contactInfo: { website: '/services/penetration-testing', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔓',
    href: '/services/it-penetration-testing',
    category: 'security'
  }
,
{
    id: 'it-quantum-readiness',
    title: 'Quantum Computing Readiness Assessment',
    description: 'Evaluate your organization quantum readiness, identify cryptographic vulnerabilities, and develop migration strategies for post-quantum security standards.',
    features: ['Post-quantum cryptography assessment', 'Quantum vulnerability scanning across systems', 'NIST PQC migration roadmap development', 'Quantum-safe encryption implementation', 'Executive quantum risk briefing and training'],
    benefits: ['Prepare for quantum computing threats proactively', 'Comply with emerging NIST PQC standards', 'Protect long-lived encrypted data from harvest-now-decrypt-later', 'Position as quantum-ready enterprise leader'],
    pricing: { basic: '3499', pro: '7999', enterprise: '18999' },
    contactInfo: { website: '/services/quantum-readiness', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔮',
    href: '/services/it-quantum-readiness',
    category: 'security'
  }
,
{
    id: 'it-zero-trust-architecture',
    title: 'Zero Trust Security Architecture',
    description: 'Implement Zero Trust principles across your enterprise — identity verification, micro-segmentation, least-privilege access, and continuous authentication for every request.',
    features: ['Identity & Access Management (IAM) modernization', 'Micro-segmentation of network workloads', 'Continuous adaptive risk & trust assessment', 'Device posture checking & conditional access', 'Privileged Access Management (PAM) integration'],
    benefits: ['Eliminate implicit trust across the network', 'Reduce breach impact with micro-segmentation', 'Meet CISA Zero Trust maturity requirements', 'Secure hybrid and remote workforces uniformly'],
    pricing: { basic: '1499', pro: '3499', enterprise: '7999' },
    contactInfo: { website: '/services/zero-trust-architecture', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🔐',
    href: '/services/it-zero-trust-architecture',
    category: 'security'
  },
  {
    id: 'passwordless-auth',
    title: 'Passwordless Authentication',
    description: 'Eliminate password-based attacks with biometric, magic link, and hardware key authentication. Passwordless by default with fallback options.',
    features: [
      'Biometric auth (Face ID/Touch ID)',
      'Magic link email login',
      'Hardware key (YubiKey) support',
      'Risk-based step-up auth',
      'Session management'
    ],
    benefits: [
      'Eliminate 80% of breaches',
      'Better UX than passwords',
      'NIST SP 800-63B compliant',
      'Hassle-free user onboarding'
    ],
    pricing: {
      basic: '0',
      pro: '19',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/services/passwordless-auth',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔑',
    href: '/services/passwordless-auth',
    category: 'security'
  },
  {
    id: 'payment-compliance-gateway',
    title: 'Payment Compliance Gateway',
    description: 'PCI-DSS Level 1 certified payment gateway adapter with tokenization, 3D Secure 2, fraud scoring, and settlement reconciliation.',
    features: [
      'PCI-DSS L1 certified',
      'Tokenization & vaulting',
      '3D Secure 2 support',
      'Adaptive fraud scoring',
      'Multi-currency settlement'
    ],
    benefits: [
      'Never handle raw card numbers',
      '3DS2 reduces chargebacks 60%',
      'Fraud scoring with ML',
      'Pass SAQ A in one hour'
    ],
    pricing: {
      basic: '0',
      pro: '1.2',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/services/payment-compliance-gateway',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '💳',
    href: '/services/payment-compliance-gateway',
    category: 'security'
  },
  {
    id: 'privileged-access-management',
    title: 'Privileged Access Management',
    description: 'Just-in-time elevated access, session recording, and credential vaulting for admin, SSH, and database accounts across cloud and on-premise.',
    features: [
      'Just-in-time access grants',
      'Session recording & auditing',
      'Credential vaulting',
      'Break-glass account emergency access',
      'Cross-cloud vault sync'
    ],
    benefits: [
      'Eliminate standing privileges',
      'Audit all admin sessions',
      'Meet SOX requirements',
      'Reduce insider threat'
    ],
    pricing: {
      basic: '149',
      pro: '499',
      enterprise: '2499'
    },
    contactInfo: {
      website: '/services/privileged-access-management',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🪪',
    href: '/services/privileged-access-management',
    category: 'security'
  },
  {
    id: 'security-bas-platform',
    title: 'Security Breach & Attack Simulation Platform',
    description: 'Automated adversary emulation: APT29, ransomware, insider-threat vectors. Subject your defences to realistic attack chains and measure D&R effectiveness against MITRE ATT&CK.',
    features: [
      'APT29 and MITRE ATT&CK emulation',
      'Ransomware attack simulation',
      'Purple team collaborative workspace',
      'Executive risk scoring report',
      'Detection and response metrics',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$599',
      pro: '$1198',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/security-bas-platform',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '🧪',
    href: '/services/security-bas-platform',
    category: 'security',
  },
  {
    id: 'security-log-orchestration',
    title: 'Security Log Orchestration & Correlation',
    description: 'Ingest logs from 200+ sources, normalise at scale, and run correlation rules across the full attack chain. Reduces alert fatigue with context-enriched triage views.',
    features: [
      '200+ log source connectors',
      'Log parsing and normalisation',
      'Correlation rule engine',
      'Alert deduplication and enrichment',
      'Forensic timeline with drill-down',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$499',
      pro: '$998',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/security-log-orchestration',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '🔍',
    href: '/services/security-log-orchestration',
    category: 'security',
  },
  {
    id: 'siem-security-platform',
    title: 'SIEM Security Platform',
    description: 'Cloud-native SIEM with real-time event correlation, MITRE ATT&CK tracking, UEBA behavioral baselines, and automated incident ticketing for SOC teams.',
    features: [
      'Real-time log correlation',
      'MITRE ATT&CK grid view',
      'UEBA - user behavior analytics',
      'Automated incident tickets',
      'Compliance dashboards'
    ],
    benefits: [
      'Detect breaches in minutes',
      '500M+ events/day handled',
      'Reduce SOC alert noise 80%',
      'Meet SOX / HIPAA mandates'
    ],
    pricing: {
      basic: '199',
      pro: '699',
      enterprise: '2999'
    },
    contactInfo: {
      website: '/services/siem-security-platform',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔭',
    href: '/services/siem-security-platform',
    category: 'security'
  }
,
{
    id: 'zero-trust-access',
    title: 'Zero Trust Access Gateway',
    description: 'Replace traditional VPN with continuous identity-verified access — least-privilege, device-aware, audit-logged connections to every app for hybrid and remote-first enterprises.',
    features: [
      'Identity-verified every request',
      'Continuous risk evaluation',
      'Least-privilege micro-perimeters',
      'Device posture checking',
      'Full access audit log'
    ],
    benefits: [
      'Eliminate VPN attack surface',
      'No network-level blast radius',
      'Works from anywhere, any device',
      'SOC 2 / ISO 27001 ready'
    ],
    pricing: {
      basic: '14',
      pro: '39',
      enterprise: 'Custom'
    },
    contactInfo: {
      website: '/services/zero-trust-access',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🛡️',
    href: '/services/zero-trust-access',
    category: 'security'
  },

  {id:'it-managed-soc',title:'Managed SOC + Threat Intelligence as a Service',description:'24x7 managed SOC: SIEM event correlation threat hunting from 50+ feeds incident response managed alert triage monthly executive cyber risk report compliance evidence B2B enterprise.',features:['24x7 SIEM + correlation + threat hunting','50+ threat-intel feeds + IOC auto-block','Incident response + managed alert triage','Monthly exec cyber risk report + trend dashboard'],benefits:['24x7 threat coverage without internal soc headcount','IOC auto-block reduces incident dwell time'],pricing:{basic:'149',pro:'499',enterprise:'1999'},contactInfo:{website:'/services/it-managed-soc',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'security',href:'/services/it-managed-soc',category:'security'},
  {id:'ai-threat-hunting',title:'AI Threat Hunting & Investigation',description:'AI-powered threat hunting: automated hypothesis generation and validation across SIEM + EDR + netflow + endpoint logs. MITRE ATT&CK TTP mapping, heatmap per hunt.',features:['Automated hypothesis generation per environment','MITRE ATT&CK TTP mapping + IOC enrichment','Cross-tool: SIEM + EDR + netflow correlation','Threat hunt report + evidence trail per hunt','Repeat hunt — same scenario on new environment'],benefits:['Hunt 10x faster with AI-generated hypotheses','Continuous coverage, no ad-hoc hunts','Eliminate false positives with correlation','Build hunt library — reuse TTPs across environments'],pricing:{basic:'999',pro:'2999',enterprise:'9999'},contactInfo:{website:'/services/ai-threat-hunting',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/ai-threat-hunting',category:'security'},
  {id:'attack-surface-management',title:'Attack Surface Management (ASM)',description:'Continuous external attack surface discovery: internet-facing assets, domains, IPs, subdomains, APIs, TLS certs, shadow IT. Continuous monitoring. Attack vector prioritization.',features:['Continuous internet-facing asset discovery','Domain/IP/subdomain + API enumeration','Shadow-IT detection from DNS + cert transparency','Attack vector prioritization: exploit + impact','Instant alert on new/misconfigured asset'],benefits:['Know your attack surface — no blind spots','Catch shadow IT before attackers find it','Prioritize by real exploitability','Continuous asset inventory no manual scan'],pricing:{basic:'399',pro:'999',enterprise:'3499'},contactInfo:{website:'/services/attack-surface-management',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/attack-surface-management',category:'security'},
  {id:'enterprise-dlp',title:'Enterprise Data Loss Prevention (DLP)',description:'Prevent data exfiltration at rest, in transit, in-use: endpoint DLP, network DLP, cloud DLP (S3/GDrive/SharePoint/Box). Content inspection + policy enforcement + remediation.',features:['Endpoint + Network + Cloud DLP unified','Content inspection by PII/PHI/PCI/confidential','Policy: block/quarantine/alert per class','Cloud DLP: S3/GDrive/SharePoint/Box/OneDrive','Incident remediation workflow, one-click'],benefits:['Prevent data breach before data leaves perimeter','Meet GDPR/CCPA/HIPAA protection','Cloud data protection across all SaaS','Alert + remediate in seconds not hours'],pricing:{basic:'499',pro:'1299',enterprise:'3999'},contactInfo:{website:'/services/enterprise-dlp',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/enterprise-dlp',category:'security'},
  {id:'devsecops-pipeline',title:'DevSecOps Pipeline Automation',description:'Security in CI/CD: SAST (Semgrep/CodeQL), SCA (Snyk/OSV), DAST (ZAP), IaC (Checkov/Terrascan), secret scanning (Gitleaks), container scanning (Trivy), policy-as-code gate per PR.',features:['SAST (Semgrep/CodeQL) per PR','SCA for NPM/PyPI/Pip/Gradle (Snyk/OSV)','DAST (OWASP ZAP) staging scan','IaC scanning (Checkov/Terrascan) per PR','Secret scanning (Gitleaks) + container (Trivy)'],benefits:['Security gates block merge before production','Shift-left — catch vulns in PR not prod','Result aggregation + triage dashboard','No security as an afterthought'],pricing:{basic:'399',pro:'1099',enterprise:'3499'},contactInfo:{website:'/services/devsecops-pipeline',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/devsecops-pipeline',category:'security'},
  {id:'misp-threat-intel',title:'MISP Threat Intelligence Platform',description:'Private MISP TI platform: automated feed ingestion (OTX/Abuse.ch/Feodo/URLhaus), STIX/TAXII sharing, SIEM playbook sync, custom indicator lifecycle management.',features:['Private MISP on AWS/GCP/Azure','Automated feed ingestion via STIX/TAXII','Indicator lifecycle (create/update/expire)','Partner sharing via TAXII/STIX','SIEM integration (Splunk/QRadar/Sentinel)'],benefits:['Private TI — no third-party data exfiltration','Share TI with ISACs via STIX/TAXII','Auto-process feeds, no manual upload','Correlate TI indicators across all your tools'],pricing:{basic:'1499',pro:'3999',enterprise:'12499'},contactInfo:{website:'/services/misp-threat-intel',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/misp-threat-intel',category:'security'},
  {id:'managed-edr-siem',title:'Managed EDR + SIEM SOC Service',description:'24/7 managed detection: EDR (CrowdStrike/SentinelOne) + SIEM (Splunk/QRadar/Sentinel), managed SOC tier 1/2 triage, kill-chain containment, executive monthly threat report.',features:['EDR deployment + 24/7 managed tuning','SIEM log aggregation + correlation rules','SOC Tier-1/2 triage with analyst SLA','Automated kill-chain containment','Monthly executive threat report + KPI dashboard'],benefits:['24/7 SOC coverage without hiring 24/7','Containment time under 15 minutes','Monthly threat report readable by execs','Reduce false positives with AI-assisted triage'],pricing:{basic:'1499',pro:'3999',enterprise:'13999'},contactInfo:{website:'/services/managed-edr-siem',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/managed-edr-siem',category:'security'},
  {id:'pentest-redteam',title:'Penetration Testing & Red Team',description:'Full-scope pentest: external, internal, web app, API, mobile, IoT + full MITRE ATT&CK adversary-emulation red team. Findings report with PoC + remediation guidance.',features:['External + Internal network pentest','Web app/API/mobile/IoT scope included','Full MITRE ATT&CK adversary-emulation','Executive + technical findings report + PoC','Remediation guidance per CVE/severity'],benefits:['Know your real exposure before attackers exploit','Red team validates blue team detective coverage','Comprehensive PoC, no guesswork','Executive report for board-level risk'],pricing:{basic:'7999',pro:'19999',enterprise:'49999'},contactInfo:{website:'/services/pentest-redteam',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/pentest-redteam',category:'security'},
  {id:'privacy-program',title:'Privacy Program & Data Governance',description:'Full privacy program: data mapping, discovery, inventory, classification, consent management, DSAR automation, PIAs, DPO support, regulatory reporting (GDPR/CCPA/PIPEDA/CPC).',features:['Data mapping + inventory + classification','Consent management platform (web + mobile)','DSAR automation (discover/collect/redact/deliver)','Privacy impact assessment per workflow','Regulatory privacy report multi-jurisdiction'],benefits:['Meet GDPR/CCPA/PIPEDA end-to-end','DSAR response within 30 days automated','Privacy program without hiring full-time DPO','Continuous data discovery no manual inventory'],pricing:{basic:'2499',pro:'6999',enterprise:'24999'},contactInfo:{website:'/services/privacy-program',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/privacy-program',category:'security'},
  {id:'ransomware-recovery',title:'Ransomware Recovery & IR for Insurers',description:'Ransomware IR + recovery: forensic analysis, containment, payment negotiation assistance, clean restore from immutable backup, SLA-backed segmentation, post-incident hardening.',features:['24/7 ransomware IR hotline activation','Network segmentation + isolation within hours','Immutable backup verify + clean restore','Payment negotiation via IR firm','Post-incident hardening + preventive controls'],benefits:['Ransomware response in hours not days','Immutable backup verify SLA-backed','Negotiation support — no paying alone under stress','Hardening prevents recurrence'],pricing:{basic:'4999',pro:'14999',enterprise:'49999'},contactInfo:{website:'/services/ransomware-recovery',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/ransomware-recovery',category:'security'},
  {id:'software-supply-chain-sec',title:'Software Supply Chain Security',description:'End-to-end supply chain: SBOM generation+attestation, dependency verification, code-signing (SLSA L3+), vulnerability patch management, artifact provenance tracking.',features:['SBOM + provenance per build (SPDX/CycloneDX)','SLSA Level 3+ attestation per release','Dependency verification + vuln patch automation','Code-signing pipeline integrity verification','Supply chain dashboard per upstream risk'],benefits:['Meet EO 14028 / SSDF supply chain requirements','SBOM+attest per build — audit-ready','Patch critical upstream before zero-day','Supply chain visibility no blind trust'],pricing:{basic:'399',pro:'1099',enterprise:'3499'},contactInfo:{website:'/services/software-supply-chain-sec',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/software-supply-chain-sec',category:'security'},
  {id:'zero-trust-network-access',title:'Zero-Trust Network Access (ZTNA)',description:'Zero-trust network access platform with continuous identity verification, per-application micro-segmentation, device posture checks, and real-time session termination on anomaly.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/zero-trust-network-access',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/zero-trust-network-access',category:'security'},
  {id:'software-supply-chain-sec',title:'Software Supply Chain Security',description:'Software supply chain security: SBOM generation, dependency vulnerability scanning via Snyk or OSS Index, artifact signing via Sigstore, provenance attestation, CI/CD admission control, and compliance reporting.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/software-supply-chain-sec',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/software-supply-chain-sec',category:'security'},
  {id:'ransomware-recovery',title:'Ransomware Recovery & IR for Insurers',description:'Ransomware recovery as a service: immutable, air-gapped backups, point-in-time restore, forensics capture, and cross-cloud replication. Restores in under four hours even for encrypted scenes.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ransomware-recovery',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ransomware-recovery',category:'security'},
  {id:'privacy-program',title:'Privacy Program & Data Governance',description:'Privacy program management: data inventory and mapping, DPIA automation, DSAR request fulfilment, consent management, and breach-notification workflow. Built on OneTrust and TrustArc patterns, bare-metal free.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/privacy-program',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/privacy-program',category:'security'},
  {id:'pentest-redteam',title:'Penetration Testing & Red Team',description:'Continuous penetration testing and red team: authenticated and unauthenticated web, mobile, and API testing, social engineering, and physical security. Automated scheduling, CISO-friendly PDF reports, and remediation tracking.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/pentest-redteam',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/pentest-redteam',category:'security'},
  {id:'misp-threat-intel',title:'MISP Threat Intelligence Platform',description:'MISP threat-intelligence platform: STIX and TAXII ingestion, IOC enrichment, correlation across 10-plus feeds, custom TTP collection, automated cyber kill-chain mapping, and a threat brief for the SOC.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/misp-threat-intel',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/misp-threat-intel',category:'security'},
  {id:'managed-edr-siem',title:'Managed EDR + SIEM SOC Service',description:'Unified Managed EDR plus SIEM: endpoint telemetry, behavioural analytics, threat hunting, log correlation, and threat-intel feeds. Deployed via agent or network sensor with 24-7 monitoring and IR included.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/managed-edr-siem',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/managed-edr-siem',category:'security'},
  {id:'it-managed-soc',title:'Managed SOC + Threat Intelligence as a Service',description:'24-7 managed Security Operations Center: threat hunting, log aggregation, SIEM correlation, incident response, and threat-intel feeds. Tier-1.5 coverage at 40% of in-house SOC cost.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/it-managed-soc',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/it-managed-soc',category:'security'},
  {id:'evm-smart-contract-audit',title:'EVM Smart Contract Audit',description:'Automated smart contract audit for EVM chains: static analysis via Slither, symbolic execution via Mythril, fuzzing via Echidna, and AI vulnerability pattern matching. Covers Ethereum, BSC, Polygon, Arbitrum, and Base.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/evm-smart-contract-audit',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/evm-smart-contract-audit',category:'security'},
  {id:'enterprise-dlp',title:'Enterprise Data Loss Prevention (DLP)',description:'Enterprise Data Loss Prevention: monitors 200-plus channels including email, web upload, cloud storage, endpoint copy-paste, Slack, and Teams. Classifies PII, PHI, PCI, and confidential content. Auto-blocks or encrypts.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/enterprise-dlp',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/enterprise-dlp',category:'security'},
  {id:'container-security-lifecycle',title:'Container & Kubernetes Security',description:'Container security from build to runtime: image scanning for CVEs, secrets, and misconfiguration, plus registry admission control, runtime threat detection, Kubernetes audit-log analysis, and drift prevention.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/container-security-lifecycle',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/container-security-lifecycle',category:'security'},
  {id:'compliance-automation-engine',title:'Compliance Automation Engine',description:'Rule-based compliance engine that embeds regulatory logic into your data pipelines and APIs. Automates access reviews, entitlement certifications, policy violation detection, and remediation tracking.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/compliance-automation-engine',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/compliance-automation-engine',category:'security'},
  {id:'compliance-automation',title:'Compliance Automation',description:'Compliance automation platform: maps your controls to SOC 2, ISO 27001, HIPAA, PCI-DSS, and GDPR. Auto-generates evidence, provides continuous monitoring, and produces pre-built audit reports for faster certification.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/compliance-automation',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/compliance-automation',category:'security'},
  {id:'attack-surface-management',title:'Attack Surface Management (ASM)',description:'Continuous external attack surface monitoring: internet-facing asset discovery, exposure scoring, CVE correlation, and threat-intel enrichment. Prioritises remediations by exploitability and business criticality.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/attack-surface-management',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/attack-surface-management',category:'security'},
];

export const dataServices: Service[] = [  {
    id: 'data-analytics-engineering-platform',
    title: 'Analytics Engineering Platform',
    description: 'dbt core orchestration, lineage graph, semantic layer, freshness SLAs, and an in-browser model explorer for SQL analysts.',
    icon: '★',
    features: ['dbt model orchestration + Freshness SLA', 'Column-level lineage graph UI', 'Semantic Layer (Looker/dbt-metricflow)', 'In-browser SQL editor + scheduler'],
    benefits: ['Build analytics layer in weeks, not months', 'Trust data via automated freshness SLA', 'Lineage root-cause in one click', 'Analysts self-serve without data-eng on-call'],
    pricing: {'basic': '1999', 'pro': '4999', 'enterprise': '14999'},
    contactInfo: { website: '/services/data-analytics-engineering-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/data-analytics-engineering-platform',
    category: 'data',
    popular: false,
  },
  {
    id: 'data-real-time-operational-analytics',
    title: 'Real-Time Operational Analytics',
    description: 'Sub-second analytics on operational DB change streams: CDC Kafka Flink aggregations → Superset/Metabase dashboards.',
    icon: '★',
    features: ['PostgreSQL/BigQuery/Snowflake CDC ingestion', 'Flink SQL window aggregations (sub-second)', 'Role-based Superset/Metabase dashboard', 'Latency SLA alert per dashboard'],
    benefits: ['Answer operational questions in seconds', 'Decision latency goes from hours to seconds', 'Self-service dashboards without ETL rebuild', 'Real-time KPIs in every team meeting'],
    pricing: {'basic': '2999', 'pro': '6999', 'enterprise': '19999'},
    contactInfo: { website: '/services/data-real-time-operational-analytics', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/data-real-time-operational-analytics',
    category: 'data',
    popular: false,
  },
  {
    id: 'data-data-reconciliation-engine',
    title: 'Data Reconciliation Engine',
    description: 'Automated record matching across source-of-truth systems with fuzzy/phonetic/ML matching and a reconciliation dispute UI.',
    icon: '★',
    features: ['Deterministic + fuzzy + phonetic matching', 'Embedding model for compound record matching', 'Bulk-match upload + reason-code dispute UI', 'Reconciliation history + export report'],
    benefits: ['Eliminate hours of manual spreadsheet matching', 'Reduce dispute cycles with reason-code UI', 'Audit-compliant matching audit trail', 'Reuse rules across ERP/CRM/CDP domains'],
    pricing: {'basic': '999', 'pro': '2599', 'enterprise': '7999'},
    contactInfo: { website: '/services/data-data-reconciliation-engine', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/data-data-reconciliation-engine',
    category: 'data',
    popular: false,
  },
  {
    id: 'data-pii-scanner-classifier',
    title: 'PII Scanner & Classifier',
    description: 'Column-level PII detection (name/SSN/email/phone/address) across data warehouses, with automatic masking policies and compliance report.',
    icon: '★',
    features: ['Column-level regex + ML pattern detection', 'Auto-generate dynamic data masking policies', 'Compliance report (GDPR/CCPA/HIPAA)', 'Alert on PII touching new table/column'],
    benefits: ['Comply with GDPR/CCPA without manual audit', 'Prevent PII data leak before it happens', 'Auto-mask PII in non-prod environments', 'One-click compliance audit report'],
    pricing: {'basic': '899', 'pro': '2199', 'enterprise': '6999'},
    contactInfo: { website: '/services/data-pii-scanner-classifier', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/data-pii-scanner-classifier',
    category: 'data',
    popular: false,
  },
  {
    id: 'data-document-vector-search',
    title: 'Document Intelligence + Vector Search',
    description: 'Chunk embed store in vector DB; hybrid BM25 + dense retrieval; semantic reranking; per-tenant document isolation.',
    icon: '★',
    features: ['Multi-format ingest (PDF/DOCX/PPTX/EML)', 'Parse + semantic chunk + sentence embed', 'Hybrid BM25+DPR retrieval + cross-encoder rerank', 'Per-tenant namespace ACL in vector DB'],
    benefits: ['Semantic search across all enterprise docs', 'Get answers, not just keyword matches', 'Keep docs isolated per customer/tenant', 'Build a RAG/QA pipeline in days'],
    pricing: {'basic': '1499', 'pro': '3499', 'enterprise': '9999'},
    contactInfo: { website: '/services/data-document-vector-search', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/data-document-vector-search',
    category: 'data',
    popular: false,
  },
  {
    id: 'data-log-analytics-platform',
    title: 'Log Analytics & SIP Platform',
    description: 'Petabyte-scale log ingestion, structured parsing, Grafana/Loki/Tempo correlation, and retention tiered hot/warm/cold.',
    icon: '★',
    features: ['Grafana Loki index + LogQL query', 'Log parsing via grok/JSON/regex pipeline', 'Trace correlation via OpenTelemetry span ID', 'Hot/warm/cold tiered retention policy'],
    benefits: ['Query petabyte logs in seconds', 'Find root-cause faster with log+metric+span', 'Archive logs cheaply, query recent fast', 'Pay-per-GB ingested, no cluster overhead'],
    pricing: {'basic': '1599', 'pro': '3799', 'enterprise': '11999'},
    contactInfo: { website: '/services/data-log-analytics-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/data-log-analytics-platform',
    category: 'data',
    popular: false,
  },
  {
    id: 'data-predictive-maintenance-timeseries',
    title: 'Predictive Maintenance (Time-Series)',
    description: 'Sensor TS ingestion, anomaly detection (IsolationForest/Prophet), failure-prediction XGBoost, and work-order auto-creation.',
    icon: '★',
    features: ['Sensor TS ingestion + Pandas validation', 'Anomaly detector (IsolationForest + Prophet)', 'Failure risk scoring XGBoost per asset', 'Auto-created CMMS work-order on threshold'],
    benefits: ['Reduce unplanned downtime 30-50%', 'Schedule maintenance before failure', 'Extend asset life with timely care', 'CMMS integration, no siloed alerts'],
    pricing: {'basic': '2199', 'pro': '4999', 'enterprise': '14999'},
    contactInfo: { website: '/services/data-predictive-maintenance-timeseries', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/data-predictive-maintenance-timeseries',
    category: 'data',
    popular: false,
  },
  {
    id: 'data-geospatial-analytics-engine',
    title: 'Geospatial Analytics Engine',
    description: 'Location intelligence: PostGIS spatial queries, tile-based heatmaps, delivery-route optimisation, and geofence-triggered alerts.',
    icon: '★',
    features: ['PostGIS spatial index + SRID auto-detect', 'Tile-based cluster heatmap (deck.gl/Mapbox)', 'OSRM/Valhalla route optimisation per order', 'Geofence trigger alert per asset/customer'],
    benefits: ['Optimise last-mile delivery routes 20%+', 'Detect spatial patterns heatmap-visually', 'Trigger real-time alerts on geofence exit', 'One map layer for all location decisions'],
    pricing: {'basic': '1799', 'pro': '4199', 'enterprise': '12999'},
    contactInfo: { website: '/services/data-geospatial-analytics-engine', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/data-geospatial-analytics-engine',
    category: 'data',
    popular: false,
  },
  {
    id: 'data-feature-store-platform',
    title: 'Feature Store Platform',
    description: 'Centralised ML feature store with online (Redis) + offline (Snowflake/BigQuery) stores, point-in-time correctness, feature lineage, SDK.',
    icon: '★',
    features: ['Offline store (Snowflake/BigQuery/Parquet)', 'Online store (Redis low-latency <50ms)', 'Point-in-time correctness per feature', 'Feature lineage + SDK (Python/Java)'],
    benefits: ['Eliminate training-serving skew', 'Feature reuse across 10+ ML models', 'Point-in-time correctness = reliable ML', 'Feature governance = compliant ML'],
    pricing: {'basic': '2499', 'pro': '5999', 'enterprise': '17999'},
    contactInfo: { website: '/services/data-feature-store-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/data-feature-store-platform',
    category: 'data',
    popular: false,
  },
  {
    id: 'data-event-sourcing-platform',
    title: 'Event Sourcing & CQRS Platform',
    description: 'Append-only event log per aggregate, projection workers per read-model, snapshot compaction, and Kafka-compatible event bus.',
    icon: '★',
    features: ['Append-only event log per aggregate ID', 'Projection worker auto-subscribes to topics', 'Snapshot compaction for long-lived aggregates', 'Read-model API (GraphQL/REST) per projection'],
    benefits: ['Full audit trail of every state change', 'Replay events to regenerate any read-model', 'Event replay = cheap time-travel debugging', 'Scale write throughput independently of read'],
    pricing: {'basic': '2999', 'pro': '6999', 'enterprise': '19999'},
    contactInfo: { website: '/services/data-event-sourcing-platform', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    href: '/services/data-event-sourcing-platform',
    category: 'data',
    popular: false,
  },

  {
    id: 'batch-etl-platform',
    title: 'Batch ETL Platform',
    description: 'Visual ETL/ELT builder with 400+ connectors, scheduled or event-triggered pipelines, schema drift handling, and data quality checks.',
    features: [
      '400+ pre-built connectors',
      'Visual pipeline builder',
      'Schema drift auto-handling',
      'Data quality assertions',
      'Incremental extraction'
    ],
    benefits: [
      'Build pipelines in hours',
      'No pipeline rewrites on schema change',
      'Built-in data validation',
      'Reduce engineering burden'
    ],
    pricing: {
      basic: '99',
      pro: '399',
      enterprise: '1999'
    },
    contactInfo: {
      website: '/services/batch-etl-platform',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '⚙️',
    href: '/services/batch-etl-platform',
    category: 'data'
  },
  {
    id: 'data-cost-finops',
    title: 'Data Cost Governance & FinOps',
    description: 'Track per-table, per-query cloud data spend. AI recommends materialised views, query optimisation, and warehouse right-sizing to lower your bill by 20-40%.',
    features: [
      'Per-query and per-table cost tracing',
      'AI rightsizing recommendations',
      'Materialised view recommendations',
      'Tag-based cost governance',
      'Chargeback and showback exports',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$279',
      pro: '$558',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/data-cost-finops',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '💵',
    href: '/services/data-cost-finops',
    category: 'data',
  }
,
{
    id: 'data-engineering',
    title: 'Data Engineering & ETL Pipelines',
    description: 'Build robust data pipelines, ETL/ELT workflows, and data lake architectures for real-time and batch processing.',
    features: [
      'ETL/ELT pipeline design & deployment',
      'Data lake & warehouse architecture',
      'Real-time stream processing (Kafka, Spark)',
      'Data quality monitoring & validation',
      'Schema evolution & versioning'
    ],
    benefits: [
      'Unified data platform',
      '50% faster data delivery',
      'Automated data quality checks',
      'Scalable to petabyte volumes'
    ],
    pricing: {
      basic: '2999',
      pro: '6999',
      enterprise: '15999'
    },
    contactInfo: {
      website: '/services/data-engineering',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔧',
    href: '/services/data-engineering',
    category: 'data'
  },
  {
    id: 'data-governance-platform',
    title: 'Data Governance & Catalog',
    description: 'Unified data catalog, lineage tracking, and policy enforcement engine for regulated industries with automated compliance.',
    features: [
      'Automated data catalog',
      'End-to-end lineage',
      'PII auto-classification',
      'Policy enforcement engine',
      'GDPR / CCPA compliance'
    ],
    benefits: [
      'Audit-ready in days',
      'Find any dataset in seconds',
      'Prevent PII leaks',
      'Meet regulatory mandates'
    ],
    pricing: {
      basic: '499',
      pro: '1299',
      enterprise: '4999'
    },
    contactInfo: {
      website: '/services/data-governance-platform',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📋',
    href: '/services/data-governance-platform',
    category: 'data'
  },
  {
    id: 'data-lakehouse',
    title: 'Data Lakehouse Platform',
    description: 'Unified platform combining data lake flexibility with data warehouse performance — ACID transactions, time travel, and open-table format support.',
    features: [
      'Open-table format (Iceberg)',
      'ACID transactions',
      'Time-travel queries',
      'Schema evolution',
      'Separation of compute/storage'
    ],
    benefits: [
      'Single platform for all data',
      'Schema-aware without locks',
      'Time travel for compliance',
      '50% lower storage cost'
    ],
    pricing: {
      basic: '0',
      pro: '499',
      enterprise: '1999'
    },
    contactInfo: {
      website: '/services/data-lakehouse',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🏔️',
    href: '/services/data-lakehouse',
    category: 'data'
  },
  {
    id: 'data-observability-monitor',
    title: 'Data Observability & Quality Monitor',
    description: 'Column-level freshness, volume, distribution drift, and schema-change detection across every pipeline and warehouse table with auto-generated lineage.',
    features: [
      'Column freshness and volume checks',
      'Distribution drift detection',
      'Schema-change alerting',
      'End-to-end lineage viewer',
      'Quality SLA dashboards',
    ],
    benefits: [
      'Increased efficiency',
      'Professional-grade quality',
      'Cost savings',
      'Rapid implementation',
    ],
    pricing: {
      basic: '$349',
      pro: '$698',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/data-observability-monitor',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: '📊',
    href: '/services/data-observability-monitor',
    category: 'data',
  },
  {
    id: 'data-sync-engineering',
    title: 'Data Sync & Change Capture',
    description: 'Change data capture (CDC) sync engine that replicates real-time changes from Postgres, MySQL, MongoDB, and Snowflake to any destination with schema evolution.',
    features: [
      'CDC from 10+ databases',
      'Schema evolution handled',
      'Exactly-once delivery',
      'Conflict resolution config',
      'Backfill historical data'
    ],
    benefits: [
      'Keep all stores in sync',
      'ELT pipelines in minutes',
      'No custom CDC code',
      'SDN-driven conflict resolution'
    ],
    pricing: {
      basic: '0',
      pro: '99',
      enterprise: '699'
    },
    contactInfo: {
      website: '/services/data-sync-engineering',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔄',
    href: '/services/data-sync-engineering',
    category: 'data'
  },
  {
    id: 'etl-streaming-pipeline',
    title: 'Streaming ETL Pipeline',
    description: 'Sub-second streaming data pipelines with exactly-once delivery, windowed aggregations, schema evolution, and native connectors for Kafka, Pulsar, and Kinesis.',
    features: [
      'Exactly-once delivery guarantee',
      'Windowed aggregations',
      'Schema evolution auto-handle',
      'Kafka / Kinesis connectors',
      'SQL-based transformation'
    ],
    benefits: [
      'Real-time analytics < 1s',
      'No data loss or duplicates',
      'Schema changes handled gracefully',
      'Petaflops scale'
    ],
    pricing: {
      basic: '99',
      pro: '399',
      enterprise: '2499'
    },
    contactInfo: {
      website: '/services/etl-streaming-pipeline',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🌊',
    href: '/services/etl-streaming-pipeline',
    category: 'data'
  }
,
{
    id: 'it-data-mesh-implementation',
    title: 'Data Mesh & Modern Data Platform Architecture',
    description: 'Implement data mesh architecture with domain-oriented data ownership, self-serve data infrastructure, and federated computational governance.',
    features: ['Domain-oriented data product design', 'Self-serve data platform implementation', 'Federated computational governance framework', 'Data quality and lineage automation', 'Multi-cloud data lakehouse architecture'],
    benefits: ['Break down data silos with domain ownership', 'Scale analytics across the organization', 'Improve data quality with automated checks', 'Reduce data engineering bottleneck by 70%'],
    pricing: { basic: '2999', pro: '6999', enterprise: '16999' },
    contactInfo: { website: '/services/data-mesh', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🗄️',
    href: '/services/it-data-mesh-implementation',
    category: 'data'

  },

  {
    id:'data-engineering',title:'Data Engineering Pipeline Platform',description:'ELT + transformation quality checks observability alerting: Airbyte Fivetran style dbt transformations Great Expectations quality checks SLAs per pipeline.',features:['Ingestion + ELT + transformation','Quality checks + Great Expectations','SLA monitoring + alerting per pipeline','Observability alerting per pipeline run'],benefits:['Build data pipelines 2x faster','Catch pipeline failures before dashboard stakeholders notice'],pricing:{basic:'99',pro:'349',enterprise:'1299'},contactInfo:{website:'/services/data-engineering',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'data',href:'/services/data-engineering',category:'data'},
  {id:'ai-data-quality-engine',title:'AI Data Quality & Enforcement Engine',description:'Continuous data quality at pipeline scale: automated profiling, statistical anomaly detection, schema drift + auto-fix. GE/Soda/DBT quality gates prevent bad data flowing to warehouse.',features:['Automated profiling + anomaly scoring per column','Schema drift detect + alert on threshold','GE/Soda/DBT quality gate integration','Auto-fix recommendation per anomaly type','Quality scorecard per data product + owner'],benefits:['Catch data quality issues before analytics run','Zero bad-data — quality gates block bad data','Data quality as-code in version control','Quality scorecard per team accountability + incentive'],pricing:{basic:'299',pro:'799',enterprise:'2499'},contactInfo:{website:'/services/ai-data-quality-engine',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/ai-data-quality-engine',category:'data'},
  {id:'ai-etl-pipeline-builder',title:'AI ETL Pipeline Builder',description:'Natural language ETL builder: describe source, target, transformation — AI generates production-ready dbt/Glue/Dataflow pipeline. Auto-tests, docs, type-map.',features:['NL to ETL: dbt/Glue/Dataflow','Auto-generated transform tests + documentation','Schema mapping + type coercion per column','Schedule + alert (Airflow/Step/Cloud Scheduler)','CLI + UI — iterate pipeline in minutes'],benefits:['Build ETL pipelines 10x faster than hand-coding','Zero manual type-mapping per column','Auto-tested pipelines — no deploy without tests','Non-engineers build pipelines via NL interface'],pricing:{basic:'149',pro:'449',enterprise:'1499'},contactInfo:{website:'/services/ai-etl-pipeline-builder',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/ai-etl-pipeline-builder',category:'data'},
  {id:'analytics-attribution-mix',title:'Analytics Attribution & Marketing Mix Modeling',description:'Multi-touch attribution (first/last/linear/time-decay/position-based) + marketing mix modeling. CAC, LTV, ROAS per channel, campaign, cohort. Recommended budget allocation.',features:['Multi-touch attribution per channel/campaign','Marketing mix modeling per campaign period','CAC/LTV/ROAS per campaign + cohort','Channel optimal budget allocation rec','Weekly executive report + monthly deep-dive'],benefits:['Know true ROI per channel, not just last-click','Identify highest-ROI channels before overspending','Cut CPA by 20-40% by reallocating spend','Board-level marketing metrics transparent attribution'],pricing:{basic:'199',pro:'699',enterprise:'2299'},contactInfo:{website:'/services/analytics-attribution-mix',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/analytics-attribution-mix',category:'data'},
  {id:'data-product-catalog-svc',title:'Data Product Catalog & Lineage',description:'Auto-discover data assets from warehouse/lakehouse/BI. Business glossary auto-linked. Column-level lineage: table to report to dashboard. Auto-generated data contracts per product.',features:['Auto-discover assets (warehouse + lakehouse + BI)','Business glossary auto-linked to actual columns','Column-level lineage: table to report to dashboard','Auto-generated data contract per published product','Data quality SLA enforced per data product'],benefits:['Find right dataset in 60 seconds not hours','Column-level lineage — trace any metric to source','Data contracts enforce schema stability','Automated catalog discovery no manual upload'],pricing:{basic:'299',pro:'799',enterprise:'2499'},contactInfo:{website:'/services/data-product-catalog-svc',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/data-product-catalog-svc',category:'data'},
  {id:'data-science-platform',title:'Data Science Platform (Managed)',description:'Managed data science on Kubernetes: MLflow tracking, model registry, managed feature store, KServe/Seldon inference, model CI/CD, GPU scheduling. Batch + real-time inference.',features:['MLflow experiment tracking + model registry','Managed feature store (Feast) auto-provisioned','KServe/Seldon batch + real-time inference','Model CI/CD per training run + gate before prod','GPU scheduling per experiment, no queue'],benefits:['Ship ML models in days not weeks','Track every experiment without losing results','Feature store serves sub-10ms at 10k QPS','Model versioning + canary rollout, no manual deploy'],pricing:{basic:'1499',pro:'3999',enterprise:'12999'},contactInfo:{website:'/services/data-science-platform',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/data-science-platform',category:'data'},
  {id:'feature-engineering-platform',title:'Feature Engineering Platform',description:'Feature store as-a-service: feature definition registry, feature pipeline orchestration, online + offline serving, point-in-time correctness, model drift detection.',features:['Feature definition registry per team','Offline feature compute (dbt/SQL transforms)','Online feature serving sub-10ms (Feast/Redis)','Point-in-time correctness validation','Model drift detect + alert on distribution shift'],benefits:['Eliminate training-serving skew','No duplicate code between training and serving','Ship ML faster — features ready-made','Feature importance tracking — know what drives model'],pricing:{basic:'999',pro:'2499',enterprise:'7999'},contactInfo:{website:'/services/feature-engineering-platform',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/feature-engineering-platform',category:'data'},
  {id:'graph-database-analytics',title:'Graph Database & Analytics',description:'Graph database: fraud rings, social networks, knowledge graphs, recommendation engine. Neo4j + GDS — community detection, centrality, shortest-path, link prediction, visual dashboard.',features:['Neo4j cluster + GDS (community/pagerank)','Knowledge graph from internal docs + relations','Relationship query builder UI','Shortest-path + link-prediction for recommendations','Visual graph explorer + dashboard'],benefits:['Detect fraud rings + suspicious connection networks','Recommendation by graph traversal','Knowledge graph for org/tech-dependency','Graph queries in ms even at 100M+ nodes'],pricing:{basic:'799',pro:'2499',enterprise:'7999'},contactInfo:{website:'/services/graph-database-analytics',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/graph-database-analytics',category:'data'},
  {id:'observability-lakehouse',title:'Observability Data Lakehouse',description:'Unified observability: metrics, traces, logs, events in one Iceberg-format lakehouse. OpenMetadata catalog, standard SQL across all signals. Retention hours to years per data class.',features:['Metrics + traces + logs + events in single Iceberg format','OpenMetadata catalog + lineage per signal type','Standard SQL query across all observability data','Per-signal retention (hours to years)','Built-in aggregations + rollups for dashboarding'],benefits:['No siloed observability tools','Query traces with SQL, join with business context','Single storage no duplication','Years of retention at commodity storage cost'],pricing:{basic:'699',pro:'1999',enterprise:'6999'},contactInfo:{website:'/services/observability-lakehouse',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/observability-lakehouse',category:'data'},
  {id:'self-service-analytics',title:'Self-Service Analytics Platform',description:'Self-service analytics for business analysts: semantic layer + named metric layer, NL to SQL, dashboard builder, governance + lineage. No SQL required by end user.',features:['Semantic layer — named metrics single source of truth','NL to SQL per business question','Dashboard builder (no SQL required)','Semantic model governance + approval workflow','Row/column-level security per user/group'],benefits:['Analyst self-service, no data-eng bottleneck','Named metric layer — no metric definition disputes','SQL from English, no query writing','Governed self-service, not open raw access'],pricing:{basic:'699',pro:'1999',enterprise:'5999'},contactInfo:{website:'/services/self-service-analytics',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/self-service-analytics',category:'data'},
  {id:'streaming-realtime-analytics',title:'Real-Time Streaming Analytics',description:'Sub-second analytics on event streams: Kafka/Redpanda/PubSub to Flink/Spark — sessionization, windowed aggregates, anomaly detection. Sub-second refresh dashboard.',features:['Multi-broker: Kafka/Redpanda + connectors','Flink/Spark Streaming windowed aggregation','Sub-second event to alert latency','Anomaly detection per metric stream (Z-score)','Grafana/Looker real-time dashboard'],benefits:['Real-time fraud detection sub-second','Session analytics for product usage real-time','No warehouse ETL lag','Event-time + watermarked, no late-arrival skew'],pricing:{basic:'999',pro:'2999',enterprise:'9999'},contactInfo:{website:'/services/streaming-realtime-analytics',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/streaming-realtime-analytics',category:'data'},
  {id:'streaming-realtime-analytics',title:'Real-Time Streaming Analytics',description:'Real-time streaming analytics on Kafka, Kinesis, or Pulsar: windowed aggregations, anomaly detection, sessionisation, and feature engineering. Outputs to dashboard, alert, ML feature store, or warehouse.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/streaming-realtime-analytics',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/streaming-realtime-analytics',category:'data'},
  {id:'self-service-analytics',title:'Self-Service Analytics Platform',description:'Self-service analytics platform for business teams: point-and-click query builder, semantic search on data, and pre-built dashboard templates. Democratises data access without dependency on data engineering.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/self-service-analytics',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/self-service-analytics',category:'data'},
  {id:'observability-lakehouse',title:'Observability Data Lakehouse',description:'Unified lakehouse for finance and operations data: real-time ingestion from ERPs, CRMs, and billing systems. Self-service via SQL, ML-ready features, and governed access with row-level policies.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/observability-lakehouse',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/observability-lakehouse',category:'data'},
  {id:'graph-database-analytics',title:'Graph Database & Analytics',description:'Graph database with time-series analytics: Neo4j plus TimescaleDB hybrid. Entity resolution, relationship traversal at billion-edge scale, time-decayed path scoring, and built-in visualisation and exploration.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/graph-database-analytics',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/graph-database-analytics',category:'data'},
  {id:'feature-engineering-platform',title:'Feature Engineering Platform',description:'Automated feature engineering: 200-plus transformation ops, feature store with online and offline serving, feature freshness monitoring, drift detection, and feature lineage. SQL and Python API, Feast-compatible.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/feature-engineering-platform',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/feature-engineering-platform',category:'data'},
  {id:'data-science-platform',title:'Data Science Platform (Managed)',description:'Managed data science platform: collaborative notebooks, experiment tracking, model registry, one-click deployment. Supports Python, R, and Scala with GPU scheduling and a pre-built algorithm library.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/data-science-platform',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/data-science-platform',category:'data'},
  {id:'data-product-catalog-svc',title:'Data Product Catalog & Lineage',description:'Data product catalog with lineage, quality scores, SLA tracking, and self-service discovery. Auto-tags PII, PHI, and PCI fields, enforces data access policies, and generates auto-documentation per dataset.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/data-product-catalog-svc',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/data-product-catalog-svc',category:'data'},
  {id:'analytics-attribution-mix',title:'Analytics Attribution & Marketing Mix Modeling',description:'Marketing attribution platform: first-touch, last-touch, multi-touch, and data-driven attribution across paid, organic, social, email, and offline channels. MMM plus geo-lift experiments for causal ROI measurement.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/analytics-attribution-mix',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/analytics-attribution-mix',category:'data'},
  {id:'ai-etl-pipeline-builder',title:'AI ETL Pipeline Builder',description:'Visual ETL builder with AI: drag-and-drop transforms, auto-generated DAGs via Airflow or Prefect, schema drift handling, incremental load optimisation, one-click deployment to your data warehouse.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-etl-pipeline-builder',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-etl-pipeline-builder',category:'data'},
  {id:'ai-data-quality-engine',title:'AI Data Quality & Enforcement Engine',description:'Automated data quality: schema drift detection, completeness scoring, anomaly flagging per field, lineage tracing, auto-generated SLAs per table and pipeline.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-data-quality-engine',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-data-quality-engine',category:'data'},
];

export const automationServices: Service[] = [
  {
    id: 'ai-office-automation',
    title: 'AI-Powered Office Automation',
    description: 'AI copilot for office workflows: document classification, contract parsing, email triage, invoice data extraction, and workflow routing — all with no-code builder.',
    features: [
      'Document classification AI',
      'Contract key clause extraction',
      'Email triage + auto-response',
      'Invoice data extraction',
      'No-code workflow builder'
    ],
    benefits: [
      'Save 10+ hrs/employee/week',
      'Eliminate manual data entry',
      'Consistent document handling',
      'Ramp new staff 3x faster'
    ],
    pricing: {
      basic: '29',
      pro: '99',
      enterprise: '499'
    },
    contactInfo: {
      website: '/services/ai-office-automation',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🏢',
    href: '/services/ai-office-automation',
    category: 'automation'
  },
  {
    id: 'ai-self-healing-infra',
    title: 'AI Self-Healing Infrastructure',
    description: 'Autonomous infrastructure remediation engine that detects anomalies, diagnoses root cause, and applies fixes — rollback guaranteed — without human intervention.',
    features: [
      'Anomaly detection per host',
      'Auto root-cause diagnosis',
      'Auto-remediation playbooks',
      'Change-freeze awareness',
      'Full audit trail'
    ],
    benefits: [
      'Reduce pager alerts 70%',
      'Fix issues before escalation',
      'Zero unplanned restarts',
      'MTTR < 2 minutes'
    ],
    pricing: {
      basic: '0',
      pro: '149',
      enterprise: '899'
    },
    contactInfo: {
      website: '/services/ai-self-healing-infra',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🏥',
    href: '/services/ai-self-healing-infra',
    category: 'automation'
  }
,
{
    id: 'devops-cicd',
    title: 'DevOps & CI/CD Automation',
    description: 'End-to-end CI/CD pipelines, container orchestration, GitOps workflows, and site reliability engineering.',
    features: [
      'Automated CI/CD pipeline setup (GitHub Actions, GitLab CI)',
      'Kubernetes orchestration & management',
      'Infrastructure as Code (Terraform, Ansible)',
      '24/7 site reliability monitoring',
      'Blue-green & canary deployments'
    ],
    benefits: [
      'Deploy 10x faster with zero downtime',
      'Automated testing & quality gates',
      'Reduced operational overhead by 60%',
      'Self-healing infrastructure'
    ],
    pricing: {
      basic: '1999',
      pro: '4499',
      enterprise: '9999'
    },
    contactInfo: {
      website: '/services/devops-cicd',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '⚙️',
    href: '/services/devops-cicd',
    popular: true,
    category: 'automation'
  },
  {
    id: 'event-driven-orchestration',
    title: 'Event-Driven Orchestration',
    description: 'Serverless workflow engine with durable execution, retries, and visual DAG designer for complex multi-service business processes.',
    features: [
      'Visual DAG designer',
      'Durable execution',
      'Automatic retries & DLQ',
      'Saga pattern support',
      'Webhook triggers'
    ],
    benefits: [
      'Ship complex flows fast',
      'Never lose events',
      'Visual debugging',
      'No infra to manage'
    ],
    pricing: {
      basic: '0',
      pro: '199',
      enterprise: '899'
    },
    contactInfo: {
      website: '/services/event-driven-orchestration',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '⚡',
    href: '/services/event-driven-orchestration',
    category: 'automation'
  }
,
{
    id: 'it-automation-orchestrator',
    title: 'IT Automation & Orchestration Platform',
    description: 'Enterprise IT automation platform with workflow orchestration, infrastructure provisioning, configuration management, and self-healing system capabilities.',
    features: ['Infrastructure automation with Terraform and Ansible', 'Workflow orchestration across IT systems', 'Self-healing infrastructure with event-driven automation', 'Compliance enforcement and drift detection', 'Centralized automation catalog and governance'],
    benefits: ['Reduce manual IT operations by 80%', 'Eliminate configuration drift across environments', 'Accelerate service provisioning from days to minutes', 'Maintain compliance with automated enforcement'],
    pricing: { basic: '1499', pro: '3499', enterprise: '7999' },
    contactInfo: { website: '/services/automation-orchestrator', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⚙️',
    href: '/services/it-automation-orchestrator',
    category: 'automation'
  }
,
{
    id: 'it-digital-twin-platform',
    title: 'Digital Twin & IoT Platform Development',
    description: 'Build real-time digital replicas of physical systems — factory floors, supply chains, and smart cities with predictive simulation and optimization capabilities.',
    features: ['3D digital twin modeling and visualization', 'Real-time IoT sensor data ingestion and mapping', 'Predictive simulation and what-if scenario analysis', 'Integration with CAD, BIM, and ERP systems', 'Automated alerts and anomaly detection'],
    benefits: ['Simulate changes before real-world implementation', 'Reduce operational downtime by 40%', 'Optimize resource allocation with predictive modeling', 'Unified visibility across complex physical-digital systems'],
    pricing: { basic: '5999', pro: '12999', enterprise: '29999' },
    contactInfo: { website: '/services/digital-twin-platform', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🏗️',
    href: '/services/it-digital-twin-platform',
    category: 'automation'
  },
  {
    id: 'low-code-workflow-builder',
    title: 'Low-Code Workflow Builder',
    description: 'Drag-and-drop workflow automation builder connecting SaaS apps, databases, and custom code with approval gates and error handling.',
    features: [
      'Visual drag-and-drop builder',
      '1000+ integrations',
      'Approval gates & branching',
      'Error handling & retries',
      'Built-in audit log'
    ],
    benefits: [
      'Automate without engineers',
      'Ship workflows in one day',
      'Business users self-serve',
      'Audit-ready execution logs'
    ],
    pricing: {
      basic: '29',
      pro: '99',
      enterprise: '499'
    },
    contactInfo: {
      website: '/services/low-code-workflow-builder',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🧩',
    href: '/services/low-code-workflow-builder',
    category: 'automation'
  }
,
{
    id: 'monitoring-observability',
    title: 'Monitoring & Observability',
    description: 'Full-stack monitoring with real-time dashboards, alerting, log aggregation, and distributed tracing for your entire infrastructure.',
    features: [
      'Real-time dashboards & custom metrics',
      'Proactive alerting (PagerDuty, OpsGenie)',
      'Centralized log aggregation (ELK/Loki)',
      'Distributed tracing (Jaeger, OpenTelemetry)',
      'Uptime monitoring from 20+ global locations'
    ],
    benefits: [
      'Mean time to detection (MTTD) reduced by 80%',
      'Proactive issue resolution',
      'Single pane of glass for all services',
      'Capacity planning insights'
    ],
    pricing: {
      basic: '999',
      pro: '2499',
      enterprise: '5999'
    },
    contactInfo: {
      website: '/services/monitoring-observability',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📡',
    href: '/services/monitoring-observability',
    category: 'automation'
  },
  {
    id: 'queue-messaging-platform',
    title: 'Queue & Messaging Platform',
    description: 'High-throughput message queue with pub/sub patterns, message replay, dead-letter queues, and exactly-once delivery guarantees.',
    features: [
      'Pub/sub + point-to-point',
      'Exactly-once delivery',
      'Dead-letter queue',
      'Message replay',
      'Multi-region replication'
    ],
    benefits: [
      'Decouple services safely',
      'Handle traffic spikes',
      'Guaranteed delivery',
      'Replay history for recovery'
    ],
    pricing: {
      basic: '0',
      pro: '49',
      enterprise: '499'
    },
    contactInfo: {
      website: '/services/queue-messaging-platform',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📮',
    href: '/services/queue-messaging-platform',
    category: 'automation'
  }
,
{
    id: 'supply-chain-management-service',
    title: 'Supply Chain Management Platform',
    description: 'End-to-end supply chain orchestration with AI demand forecasting, multi-modal route optimization, supplier risk scoring, and real-time disruption response.',
    features: ['AI-driven demand forecasting', 'Multi-modal route optimization', 'Supplier risk intelligence & monitoring', 'Automated disruption response playbooks', 'Warehouse operations AI optimization'],
    benefits: ['40% reduction in stockouts', '25% lower logistics costs', 'Real-time supplier risk alerts', 'Sustainability & carbon tracking'],
    pricing: { basic: '899', pro: '1999', enterprise: '4499' },
    contactInfo: { website: '/services/supply-chain-management', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🚛',
    href: '/services/supply-chain-management-service',
    category: 'automation'
  },
  {
    id: 'supply-chain-visibility',
    title: 'Supply Chain Visibility',
    description: 'Real-time end-to-end supply chain control tower with GPS tracking, customs status, inventory forecasting, and disruption alerting across all carriers.',
    features: [
      'Real-time GPS tracking',
      'Customs status sync',
      'Demand forecasting ML',
      'Disruption alerting',
      'Multi-carrier dashboard'
    ],
    benefits: [
      'See every shipment live',
      'Anticipate delays before they cost',
      'Reduce expedited freight spend',
      'Improve customer satisfaction'
    ],
    pricing: {
      basic: '199',
      pro: '699',
      enterprise: '2999'
    },
    contactInfo: {
      website: '/services/supply-chain-visibility',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📦',
    href: '/services/supply-chain-visibility',
    category: 'automation'
  },

  {
    id:'compliance-automation',title:'Compliance Automation Platform',description:'End-to-end SOC2 HIPAA PCI GDPR: policy builder approval workflow evidence collection rule engine periodic review scheduling report generation per framework.',features:['Policy builder + approval workflow','Evidence collection + rule engine','Periodic review scheduling + reminders','Report export per framework SOC2 HIPAA PCI GDPR'],benefits:['Cut compliance admin 70%','Evidence bundles per audit type','Continuous monitoring vs snapshot'],pricing:{basic:'79',pro:'299',enterprise:'1299'},contactInfo:{website:'/services/compliance-automation',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'automation',href:'/services/compliance-automation',category:'automation'},
  {id:'marketing-automation',title:'Marketing Automation & Orchestration',description:'Orchestrates customer journey across email sms push in-app web: behavioral trigger sequences A/B test personalization segments ROI attribution per funnel stage per channel.',features:['Multi-channel journey orchestration','Behavioral trigger sequences + A/B','Lead scoring + segment personalization','ROI attribution per channel + funnel stage'],benefits:['Cut martech integration overhead 80%','Single customer journey replaces point tools'],pricing:{basic:'49',pro:'199',enterprise:'899'},contactInfo:{website:'/services/marketing-automation',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'automation',href:'/services/marketing-automation',category:'automation'},
  {id:'rx-prior-auth',title:'Rx Prior-Auth Automation',description:'Automated prior authorization: eligibility check formulary check code auto-populate payer portal submission clinical note attach denial tracking remittance per payer analytics dashboard.',features:['Eligibility + formulary real-time check','Payer portal auto-submit + note attach','Denial tracking + rework automation','Analytics per payer approval time + rate'],benefits:['Cut prior-auth admin 80%','Zero manual data entry to payer portals','Track denial rates per payer and trend'],pricing:{basic:'49',pro:'199',enterprise:'749'},contactInfo:{website:'/services/rx-prior-auth',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'automation',href:'/services/rx-prior-auth',category:'automation'},
  {id:'workflow-automation',title:'Workflow Automation & Integration Platform',description:'Low-code workflow builder: connect 500+ apps Zaps custom logic conditional branching retry error handling webhook triggers scheduling and approvals — replaces manual copy-paste.',features:['500+ app pre-built connectors','Conditional branching + retry logic','Webhook + scheduling + approval steps','Audit log + execution history per workflow'],benefits:['Replace manual copy-paste between tools','Non-engineers can build automated workflows'],pricing:{basic:'19',pro:'79',enterprise:'349'},contactInfo:{website:'/services/workflow-automation',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'automation',href:'/services/workflow-automation',category:'automation'},
  {id:'agentic-workflow-orchestrator',title:'Agentic Workflow Orchestrator',description:'Orchestrate multi-agent AI workflows: DAG of agents with routing, handoff, conditional branches, state persistence, retry logic, human-review gates. LangGraph/Semantic Kernel backend.',features:['Multi-agent workflow DAG editor (visual + code)','Agent handoff + state persistence','Conditional branching + retry policy per step','Human-review gate per critical node','Audit trail per agent + cost tracking'],benefits:['Build complex workflows in hours not weeks','Human-in-the-loop for safe production','State persistence — agents resume from checkpoint','Audit trail full observability'],pricing:{basic:'299',pro:'899',enterprise:'2999'},contactInfo:{website:'/services/agentic-workflow-orchestrator',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/agentic-workflow-orchestrator',category:'automation'},
  {id:'bpa-process-analysis',title:'Business Process Analysis (BPA)',description:'Process discovery + event log mining, variant discovery, bottleneck detection, automation opportunity scoring. Output: BPMN design + automation ROI per task.',features:['Process event log mining + variant discovery','Bottleneck + wait-time per activity','Automation opportunity ROAS scoring','Target BPMN process design','Automation ROI per identified opportunity'],benefits:['Know where to automate first — data-driven','Optimize before automating','Prioritize by ROI','Process mining without $80k Celonis'],pricing:{basic:'499',pro:'1499',enterprise:'4999'},contactInfo:{website:'/services/bpa-process-analysis',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/bpa-process-analysis',category:'automation'},
  {id:'compliance-automation-engine',title:'Compliance Automation Engine',description:'Automated compliance: evidence collection, policy-as-code (OPA/Cloud Custodian), audit report generation, continuous drift detection (SOC 2/ISO 27001/PCI DSS/HIPAA/FedRAMP).',features:['Policy-as-code scanning per resource (OPA)','Automated evidence collection per control','SOC 2 / ISO 27001 audit report generation','Continuous drift detection + alert','One-click audit package for CPA auditor'],benefits:['SOC 2 audit in weeks not months','Continuous monitoring auto-collected evidence','One-click audit package for auditor','Drift alert — remediate before audit gap'],pricing:{basic:'499',pro:'1499',enterprise:'4999'},contactInfo:{website:'/services/compliance-automation-engine',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/compliance-automation-engine',category:'automation'},
  {id:'doc-intelligence-v2',title:'Intelligent Document Processing v2',description:'Multi-modal document processing: invoices, contracts, receipts, forms via LayoutLM. Entity extraction, validation, anomaly detection, auto-post to ERP/PMS, approval workflow.',features:['Multi-modal LayoutLM/DocFormer parsing','Entity extraction + validation + anomaly detect','Auto-post to ERP/PMS (NetSuite/SAP/QuickBooks)','Exception routing — high-confidence auto-approve','Training pipeline improve on your documents'],benefits:['Invoice processing 90% automated','Doc AI reviews 1000 docs/hr','Zero manual data entry — ERP auto-posted','High-confidence path auto-routes no human wait'],pricing:{basic:'99',pro:'349',enterprise:'1199'},contactInfo:{website:'/services/doc-intelligence-v2',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/doc-intelligence-v2',category:'automation'},
  {id:'event-driven-architecture',title:'Event-Driven Architecture (EDA) Platform',description:'EDA platform: AsyncAPI schema registry, Kafka/Pulsar broker, producer/consumer SDK, event replay + compaction, saga orchestration for multi-step transactions.',features:['AsyncAPI schema registry per domain event','Kafka/Pulsar per environment','Producer/consumer SDK per language','Event replay + compaction per topic','Saga orchestration for distributed transactions'],benefits:['Decouple microservices — event not RPC-coupled','Event replay — re-process for new features','Saga pattern without 2PC','Backward-compatible schema evolution'],pricing:{basic:'2499',pro:'7499',enterprise:'24999'},contactInfo:{website:'/services/event-driven-architecture',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/event-driven-architecture',category:'automation'},
  {id:'invoice-ai-automation',title:'AI Invoice Processing & Auto-Posting',description:'End-to-end invoice: OCR extraction, line-item validation, PO matching, duplicate detection, approval workflow, ERP posting (NetSuite/SAP/QuickBooks/Xero).',features:['Multi-vendor invoice OCR extraction','Line-item validation + PO matching','Duplicate detection + invoice aging','3-way match approval per vendor tier','Auto-post to ERP (NetSuite/SAP/QuickBooks/Xero)'],benefits:['Invoice processing 90% automated 80% time saved','3-way match auto-validates PO receipt','Duplicates caught, no double-pay','ERP auto-posts, no manual GL entry'],pricing:{basic:'99',pro:'299',enterprise:'999'},contactInfo:{website:'/services/invoice-ai-automation',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/invoice-ai-automation',category:'automation'},
  {id:'low-code-workflow-builder',title:'Low-Code Workflow Automation',description:'Visual low-code builder: drag-drop trigger/action/condition nodes, 500+ connectors, webhook/cron triggers, SLA approval gates, full audit trail per execution.',features:['Visual drag-drop workflow builder','500+ app/service connector library','Condition branches + SLA approval node','Webhook + cron + event triggers','Audit trail + retry + dead-letter queue'],benefits:['Cross-app automation without developer per use-case','500+ connectors — no custom integration','Non-devs build sophisticated workflows','Reusable workflow templates per department'],pricing:{basic:'29',pro:'79',enterprise:'299'},contactInfo:{website:'/services/low-code-workflow-builder',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/low-code-workflow-builder',category:'automation'},
  {id:'marketing-automation-svc',title:'Marketing Automation Platform',description:'Full marketing automation: lead scoring, nurture campaigns, A/B test + auto-optimize, multi-channel (email/SMS/push/social/ads), CRM sync, customer journey per segment.',features:['Lead scoring + nurture per segment','Multi-channel orchestration: email/SMS/push/ads','Campaign A/B test + auto-optimize per winner','Attribution + analytics per campaign','CRM sync + customer journey canvas'],benefits:['Nurture 10x more leads without headcount','Single customer view across all channels','AB test auto-optimize — continuous improvement','Attribution per touchpoint prove ROI'],pricing:{basic:'99',pro:'349',enterprise:'1099'},contactInfo:{website:'/services/marketing-automation-svc',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/marketing-automation-svc',category:'automation'},
  {id:'observability-aiops',title:'AIOps: Observability Automation',description:'AIOps: anomaly detection, log-based alerting, AI RCA, runbook auto-generation, incident correlation, auto-severity, self-healing remediation, MTTR tracking.',features:['Anomaly detection per metric/log/trace','Log-based alert pattern — alert less signal more','AI RCA correlating across signals','Auto-generated runbook per incident type','Self-healing action per whitelisted scenario'],benefits:['Cut alert volume 80% — signal no noise','Reduce MTTR by 60% with AI RCA','Self-healing resolves before on-call','Runbook auto-generated institutional knowledge'],pricing:{basic:'499',pro:'1499',enterprise:'4999'},contactInfo:{website:'/services/observability-aiops',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/observability-aiops',category:'automation'},
  {id:'predictive-maintenance',title:'Predictive Maintenance for Industrial Assets',description:'IoT sensor to ML to maintenance: vibration, temperature, pressure, acoustic telemetry. Degradation model per asset, failure probability, recommended maintenance window.',features:['IoT: vibration/temp/pressure/acoustic','Degradation model per asset class + serial','Failure probability + RUL estimate','Recommended maintenance window + parts checklist','ERP/CMMS integration (SAP/Skf/Maintenance)'],benefits:['Reduce unplanned downtime by 40%','Schedule before failure, no emergency repair','Extend asset life by 20%','Condition-based replaces costly routine maintenance'],pricing:{basic:'2499',pro:'6999',enterprise:'24999'},contactInfo:{website:'/services/predictive-maintenance',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'★',href:'/services/predictive-maintenance',category:'automation'},
  {id:'workflow-automation',title:'Security Automation',description:'Visual workflow automation: no-code and low-code designer, 500-plus pre-built connectors, event-driven triggers, conditional routing, and approval workflows. Replaces Zapier and Make for enterprise scale with SLA.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/workflow-automation',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/workflow-automation',category:'automation'},
  {id:'rx-prior-auth',title:'Rx Prior-Auth Automation',description:'Automated pharmacy prior-authorisation: real-time formulary and eligibility check via payer APIs, auto-populates CMS-1500 fields, submits to the payer portal, tracks outcome, and produces denial analytics.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/rx-prior-auth',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/rx-prior-auth',category:'automation'},
  {id:'observability-aiops',title:'AIOps: Observability Automation',description:'AIOps observability platform: distributed tracing, metrics aggregation, log indexing, AI-powered anomaly detection, root-cause analysis, and alert correlation. Replaces Datadog and New Relic at 60% cost.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/observability-aiops',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/observability-aiops',category:'automation'},
  {id:'marketing-automation-svc',title:'Marketing Automation Platform',description:'Enterprise marketing automation: email, SMS, in-app, web personalisation, lead scoring, ABM playbooks, journey orchestration, and attribution. Integrates with Salesforce, HubSpot, Segment, and Google Ads.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/marketing-automation-svc',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/marketing-automation-svc',category:'automation'},
  {id:'chaos-engineering-svc',title:'Chaos Engineering & Resilience Testing',description:'Managed chaos engineering: automated fault injection — latency, kill, network partition, resource exhaustion — across staging and production. Gamedays with safety rails, blast-radius analysis, and auto-remediation.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/chaos-engineering-svc',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/chaos-engineering-svc',category:'automation'},
  {id:'bpa-process-analysis',title:'Business Process Analysis (BPA)',description:'Business process analysis: process mining, bottleneck identification, automation opportunity scoring, and as-is versus to-be simulation. Recommends RPA or code-automation candidates ranked by time and cost savings.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/bpa-process-analysis',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/bpa-process-analysis',category:'automation'},
  {id:'ai-rx-prior-auth',title:'Rx Prior-Auth Automation',description:'Automated pharmacy prior-authorisation: real-time formulary and eligibility check via payer APIs, auto-populates CMS-1500 fields, submits to the payer portal, tracks outcome, and produces denial analytics.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/ai-rx-prior-auth',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/ai-rx-prior-auth',category:'automation'},
  {id:'agentic-workflow-orchestrator',title:'Agentic Workflow Orchestrator',description:'Orchestrate multi-agent AI workflows as a directed graph: research+code+analysis+write agents with routing rules, quality gates, human-in-the-loop approval, and full audit trail.',features:['Intelligent automation and orchestration','Enterprise-grade integration','Real-time monitoring and alerts','Scalable multi-tenant architecture'],benefits:['Reduce operational costs','Accelerate time-to-market','Maintain enterprise compliance','Scale proportionally with growth'],pricing:{basic:'49',pro:'199',enterprise:'799'},contactInfo:{website:'/services/agentic-workflow-orchestrator',email:'kleber@ziontechgroup.com',phone:'+1 302 464 0950'},icon:'◆',href:'/services/agentic-workflow-orchestrator',category:'automation'},
];

export const itSolutions = itServices;
export const allServices: Service[] = [...aiServices, ...itServices, ...cloudServices, ...securityServices, ...dataServices, ...automationServices];

// Export as servicesData for backward compatibility
export const servicesData = {
  aiServices,
  itServices,
  itSolutions,
  allServices
}

export const getPopularServices = (): Service[] => {
  return allServices.filter(service => service.popular);
}