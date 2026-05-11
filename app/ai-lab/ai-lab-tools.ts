export type AILabToolStatus = 'live' | 'experimental' | 'planned';

export type AILabToolId =
  | 'ai-site-evolution-advisor'
  | 'idea-to-feature-blueprint'
  | 'ai-rollout-blueprint'
  | 'ai-roi-ops-scorecard'
  | 'build-failure-explainer'
  | 'deployment-readiness-console'
  | 'implementation-readiness-checker'
  | 'ai-governance-risk-advisor'
  | 'autonomous-opportunity-radar'
  | 'autonomous-growth-loop-designer'
  | 'ai-experiment-designer'
  | 'autonomous-ai-experience-studio'
  | 'autonomous-deploy-optimizer'
  | 'autonomous-backlog-prioritizer'
  | 'autonomous-funnel-orchestrator'
  | 'autonomous-conversion-copilot'
  | 'autonomous-retention-playbook'
  | 'autonomous-incident-commander'
  | 'autonomous-rag-knowledge-workspace'
  | 'autonomous-media-prompt-studio'
  | 'autonomous-revenue-forecast-studio'
  | 'autonomous-agent-skill-orchestrator'
  | 'autonomous-experiment-priority-engine'
  | 'deploy-drift-dashboard'
  | 'autonomous-seo-audit-agent'
  | 'dynamic-api-monitoring'
  | 'ai-content-idea-generator'
  | 'ai-component-health-checker'
  | 'ai-workflow-status-dashboard'
  | 'ai-api-status-dashboard';

export interface AILabTool {
  id: AILabToolId;
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  status: AILabToolStatus;
  href: string;
  badge?: string;
}

export const AI_LAB_TOOLS: AILabTool[] = [
  {
    id: 'ai-site-evolution-advisor',
    slug: 'ai-site-evolution-advisor',
    title: 'AI Site Evolution Advisor',
    shortDescription:
      'Visualize how Zion’s autonomous agents are improving ziontechgroup.com and what they will optimize next.',
    category: 'Platform Intelligence',
    status: 'live',
    href: '/ai-lab/ai-site-evolution-advisor',
    badge: 'New',
  },
  {
    id: 'idea-to-feature-blueprint',
    slug: 'idea-to-feature-blueprint',
    title: 'AI Idea-to-Feature Blueprint',
    shortDescription:
      'Describe an idea and see how Zion’s autonomous platform would turn it into a live feature on the site.',
    category: 'Product Ideation',
    status: 'experimental',
    href: '/ai-lab/idea-to-feature-blueprint',
    badge: 'Experimental',
  },
  {
    id: 'ai-rollout-blueprint',
    slug: 'rollout-blueprint',
    title: 'AI Rollout Blueprint Generator',
    shortDescription:
      'Answer a few questions about your team and goals to generate a phased AI rollout plan powered by Zion modules.',
    category: 'Rollout Design',
    status: 'live',
    href: '/ai-lab/rollout-blueprint',
    badge: 'New',
  },
  {
    id: 'ai-roi-ops-scorecard',
    slug: 'roi-ops-scorecard',
    title: 'AI ROI & Ops Scorecard',
    shortDescription:
      'Estimate impact across revenue, operations, and experience, then see where AI will likely move the needle first.',
    category: 'Impact Modeling',
    status: 'experimental',
    href: '/ai-lab/roi-ops-scorecard',
    badge: 'Beta',
  },
  {
    id: 'deployment-readiness-console',
    slug: 'deployment-readiness-console',
    title: 'Deployment Readiness Console',
    shortDescription:
      'Inspect automation, UX, and link-health checks that gate autonomous deploys for ziontechgroup.com.',
    category: 'Platform Intelligence',
    status: 'live',
    href: '/ai-lab/deployment-readiness-console',
    badge: 'New',
  },
  {
    id: 'build-failure-explainer',
    slug: 'build-failure-explainer',
    title: 'AI Build Failure Explainer',
    shortDescription:
      'Paste a build log and get a deterministic, safe root-cause runbook for the most common failure classes.',
    category: 'DevOps Intelligence',
    status: 'live',
    href: '/ai-lab/build-failure-explainer',
    badge: 'New',
  },
  {
    id: 'implementation-readiness-checker',
    slug: 'implementation-readiness-checker',
    title: 'AI Implementation Readiness Checker',
    shortDescription:
      'Answer a few questions about your team, data, integrations, and governance to generate a readiness score and rollout path.',
    category: 'Rollout Readiness',
    status: 'live',
    href: '/ai-lab/implementation-readiness-checker',
    badge: 'New',
  },
  {
    id: 'ai-governance-risk-advisor',
    slug: 'ai-governance-risk-advisor',
    title: 'AI Governance & Risk Advisor',
    shortDescription:
      'For regulated teams: assess risk, audit readiness, and recommended governance modules before scaling AI use cases.',
    category: 'Governance & Risk',
    status: 'live',
    href: '/ai-lab/ai-governance-risk-advisor',
    badge: 'For regulated teams',
  },
  {
    id: 'autonomous-opportunity-radar',
    slug: 'autonomous-opportunity-radar',
    title: 'Autonomous Opportunity Radar',
    shortDescription:
      'Map your current metrics and constraints to a prioritized roadmap of AI automations, growth loops, and autonomous product upgrades.',
    category: 'Autonomous Strategy',
    status: 'live',
    href: '/ai-lab/autonomous-opportunity-radar',
    badge: 'New',
  },
  {
    id: 'autonomous-growth-loop-designer',
    slug: 'autonomous-growth-loop-designer',
    title: 'Autonomous Growth Loop Designer',
    shortDescription:
      'Design AI-driven acquisition, activation, and retention loops with projected impact, confidence, and automation readiness.',
    category: 'Growth Intelligence',
    status: 'live',
    href: '/ai-lab/autonomous-growth-loop-designer',
    badge: 'New',
  },
  {
    id: 'ai-experiment-designer',
    slug: 'ai-experiment-designer',
    title: 'AI Experiment Designer',
    shortDescription:
      'Define goals, guardrails, rollout cohorts, and success metrics to launch safer AI experiments faster.',
    category: 'Experimentation',
    status: 'live',
    href: '/ai-lab/ai-experiment-designer',
    badge: 'New',
  },
  {
    id: 'autonomous-ai-experience-studio',
    slug: 'autonomous-ai-experience-studio',
    title: 'Autonomous AI Experience Studio',
    shortDescription:
      'Prototype in-browser AI experiences with live confidence, autonomy, and rollout safety scoring.',
    category: 'In-Browser Intelligence',
    status: 'live',
    href: '/ai-lab/autonomous-ai-experience-studio',
    badge: 'New',
  },
  {
    id: 'autonomous-deploy-optimizer',
    slug: 'autonomous-deploy-optimizer',
    title: 'Autonomous Deploy Optimizer',
    shortDescription:
      'Model release risk, quality-gate coverage, and recovery playbooks to choose the safest high-velocity deploy path.',
    category: 'Deployment Intelligence',
    status: 'live',
    href: '/ai-lab/autonomous-deploy-optimizer',
    badge: 'New',
  },
  {
    id: 'autonomous-backlog-prioritizer',
    slug: 'autonomous-backlog-prioritizer',
    title: 'Autonomous Backlog Prioritizer',
    shortDescription:
      'Convert raw AI ideas into a weighted execution queue using impact, effort, confidence, and dependency risk scoring.',
    category: 'Delivery Intelligence',
    status: 'live',
    href: '/ai-lab/autonomous-backlog-prioritizer',
    badge: 'New',
  },
  {
    id: 'autonomous-funnel-orchestrator',
    slug: 'autonomous-funnel-orchestrator',
    title: 'Autonomous Funnel Orchestrator',
    shortDescription:
      'Design smarter CTA, social proof, and funnel actions with weighted impact and confidence scoring for faster growth decisions.',
    category: 'Conversion Intelligence',
    status: 'live',
    href: '/ai-lab/autonomous-funnel-orchestrator',
    badge: 'New',
  },
  {
    id: 'autonomous-conversion-copilot',
    slug: 'autonomous-conversion-copilot',
    title: 'Autonomous Conversion Copilot',
    shortDescription:
      'Prioritize conversion actions with weighted lift, confidence, and execution effort scoring for faster, safer growth decisions.',
    category: 'Conversion Intelligence',
    status: 'live',
    href: '/ai-lab/autonomous-conversion-copilot',
    badge: 'New',
  },
  {
    id: 'autonomous-retention-playbook',
    slug: 'autonomous-retention-playbook',
    title: 'Autonomous Retention Playbook',
    shortDescription:
      'Model churn risk and sequence lifecycle actions with confidence scoring to improve expansion and retention outcomes.',
    category: 'Retention Intelligence',
    status: 'live',
    href: '/ai-lab/autonomous-retention-playbook',
    badge: 'New',
  },
  {
    id: 'autonomous-incident-commander',
    slug: 'autonomous-incident-commander',
    title: 'Autonomous Incident Commander',
    shortDescription:
      'Run incident triage simulations with AI-suggested owner assignment, communication timelines, and rollback readiness.',
    category: 'Reliability Intelligence',
    status: 'live',
    href: '/ai-lab/autonomous-incident-commander',
    badge: 'New',
  },
  {
    id: 'autonomous-rag-knowledge-workspace',
    slug: 'autonomous-rag-knowledge-workspace',
    title: 'Autonomous RAG Knowledge Workspace',
    shortDescription:
      'Model document retrieval quality with deterministic citation confidence, source diversity, and answer safety scoring.',
    category: 'Knowledge Intelligence',
    status: 'live',
    href: '/ai-lab/autonomous-rag-knowledge-workspace',
    badge: 'New',
  },
  {
    id: 'autonomous-media-prompt-studio',
    slug: 'autonomous-media-prompt-studio',
    title: 'Autonomous Media Prompt Studio',
    shortDescription:
      'Design image and video prompt systems with style coherence, safety guardrails, and launch-readiness scoring.',
    category: 'Multimodal Intelligence',
    status: 'live',
    href: '/ai-lab/autonomous-media-prompt-studio',
    badge: 'New',
  },
  {
    id: 'autonomous-revenue-forecast-studio',
    slug: 'autonomous-revenue-forecast-studio',
    title: 'Autonomous Revenue Forecast Studio',
    shortDescription:
      'Model pipeline strength, automation coverage, and sales velocity to forecast deterministic revenue outcomes.',
    category: 'Revenue Intelligence',
    status: 'live',
    href: '/ai-lab/autonomous-revenue-forecast-studio',
    badge: 'New',
  },
  {
    id: 'autonomous-agent-skill-orchestrator',
    slug: 'autonomous-agent-skill-orchestrator',
    title: 'Autonomous Agent Skill Orchestrator',
    shortDescription:
      'Plan and score OpenClaw worker skill mixes, cadence, and risk tiers to accelerate autonomous app improvement safely.',
    category: 'OpenClaw Intelligence',
    status: 'live',
    href: '/ai-lab/autonomous-agent-skill-orchestrator',
    badge: 'New',
  },
  {
    id: 'autonomous-experiment-priority-engine',
    slug: 'autonomous-experiment-priority-engine',
    title: 'Autonomous Experiment Priority Engine',
    shortDescription:
      'Prioritize AI experiments by expected lift, confidence, and execution risk to accelerate autonomous app improvements.',
    category: 'Experiment Intelligence',
    status: 'live',
    href: '/ai-lab/autonomous-experiment-priority-engine',
    badge: 'New',
  },
  {
    id: 'deploy-drift-dashboard',
    slug: 'deploy-drift-dashboard',
    title: 'Deploy Drift Dashboard',
    shortDescription:
      'Track main-vs-live drift, latest deploy status, and route health to keep autonomous releases reliable.',
    category: 'Deployment Intelligence',
    status: 'live',
    href: '/ai-lab/deploy-drift-dashboard',
    badge: 'New',
  },
  {
    id: 'autonomous-seo-audit-agent',
    slug: 'autonomous-seo-audit-agent',
    title: 'Autonomous SEO Audit Agent',
    shortDescription:
      'Run AI-powered SEO audits with instant scoring for meta tags, content, performance, and actionable recommendations.',
    category: 'SEO Intelligence',
    status: 'live',
    href: '/ai-lab/autonomous-seo-audit-agent',
    badge: 'New',
  },
  {
    id: 'dynamic-api-monitoring',
    slug: 'dynamic-api-monitoring',
    title: 'Dynamic API Monitoring',
    shortDescription:
      'Real-time performance tracking across QA/staging/prod environments with automated alerting and optimization suggestions.',
    category: 'Platform Intelligence',
    status: 'live',
    href: '/ai-lab/dynamic-api-monitoring',
    badge: 'New',
  },
  {
    id: 'ai-content-idea-generator',
    slug: 'ai-content-idea-generator',
    title: 'AI Content Idea Generator',
    shortDescription:
      'Generate AI-powered content ideas for blogs, videos, social media, and more based on your topic or industry.',
    category: 'Content Intelligence',
    status: 'live',
    href: '/ai-lab/ai-content-idea-generator',
    badge: 'New',
  },
  {
    id: 'ai-component-health-checker',
    slug: 'ai-component-health-checker',
    title: 'AI Component Health Checker',
    shortDescription:
      'Real-time health monitoring for Zion autonomous AI components with uptime tracking and incident alerts.',
    category: 'Platform Intelligence',
    status: 'live',
    href: '/ai-lab/ai-component-health-checker',
    badge: 'New',
  },
  {
    id: 'ai-workflow-status-dashboard',
    slug: 'ai-workflow-status-dashboard',
    title: 'AI Workflow Status Dashboard',
    shortDescription:
      'Real-time GitHub Actions workflow monitoring for Zion autonomous pipelines with success rates and pipeline health.',
    category: 'Deployment Intelligence',
    status: 'live',
    href: '/ai-lab/ai-workflow-status-dashboard',
    badge: 'New',
  },
  {
    id: 'ai-api-status-dashboard',
    slug: 'ai-api-status-dashboard',
    title: 'AI API Status Dashboard',
    shortDescription:
      'Real-time API endpoint monitoring for Zion autonomous pipelines with health tracking and performance metrics.',
    category: 'Platform Intelligence',
    status: 'live',
    href: '/ai-lab/ai-api-status-dashboard',
    badge: 'New',
  },
];
