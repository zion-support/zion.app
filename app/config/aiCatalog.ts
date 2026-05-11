import { AI_LAB_TOOLS } from '../ai-lab/ai-lab-tools';

export type HomepageCatalogItem = {
  badge: string;
  title: string;
  description: string;
  href: string;
};

export type HomepageLiveNowItem = {
  href: string;
  badge: string;
  title: string;
  description: string;
};

export type HomepageHeroCta = {
  href: string;
  label: string;
  className: string;
};

const STATIC_CATALOG_ITEMS: HomepageCatalogItem[] = [
  {
    badge: 'AI services',
    title: 'Advanced AI Services',
    description: 'Enterprise-grade delivery for agents, RAG, multimodal, and AI governance.',
    href: '/ai-services',
  },
  {
    badge: 'Automation',
    title: 'Autonomous Improvement Engine',
    description: 'Continuous quality and app evolution pipelines with deployment-safe checks.',
    href: '/automation',
  },
  {
    badge: 'Deployment',
    title: 'App Evolution Cycles',
    description: 'Automated audits and implementation loops for fast, measurable improvements.',
    href: '/automation#app-improvement',
  },
  {
    badge: 'Growth',
    title: 'Autonomous Growth Intelligence',
    description: 'Design measurable acquisition, conversion, retention, and expansion systems with AI.',
    href: '/ai-services/autonomous-growth-intelligence',
  },
];

const HOMEPAGE_LAB_IDS = [
  'autonomous-opportunity-radar',
  'autonomous-growth-loop-designer',
  'ai-experiment-designer',
  'autonomous-ai-experience-studio',
  'autonomous-rag-knowledge-workspace',
  'autonomous-media-prompt-studio',
  'autonomous-conversion-copilot',
  'autonomous-deploy-optimizer',
  'autonomous-agent-skill-orchestrator',
  'autonomous-experiment-priority-engine',
  'autonomous-revenue-forecast-studio',
  'dynamic-api-monitoring',
] as const;

export function getHomepageAICatalogItems(): HomepageCatalogItem[] {
  const liveById = new Map(AI_LAB_TOOLS.filter((tool) => tool.status === 'live').map((tool) => [tool.id, tool]));
  const liveLabItems: HomepageCatalogItem[] = [];
  for (const id of HOMEPAGE_LAB_IDS) {
    const tool = liveById.get(id);
    if (!tool) continue;
    liveLabItems.push({
      badge: `${tool.category}`,
      title: tool.title,
      description: tool.shortDescription,
      href: tool.href,
    });
  }

  return [...liveLabItems, ...STATIC_CATALOG_ITEMS];
}

const LIVE_NOW_IDS = [
  'autonomous-ai-experience-studio',
  'autonomous-growth-loop-designer',
  'autonomous-conversion-copilot',
  'autonomous-retention-playbook',
  'autonomous-backlog-prioritizer',
  'autonomous-incident-commander',
  'autonomous-rag-knowledge-workspace',
  'autonomous-media-prompt-studio',
  'autonomous-agent-skill-orchestrator',
  'autonomous-experiment-priority-engine',
  'autonomous-revenue-forecast-studio',
  'dynamic-api-monitoring',
  'deploy-drift-dashboard',
] as const;

const HERO_CTA_IDS = [
  'autonomous-opportunity-radar',
  'autonomous-growth-loop-designer',
  'autonomous-conversion-copilot',
  'autonomous-retention-playbook',
  'autonomous-deploy-optimizer',
  'autonomous-rag-knowledge-workspace',
  'autonomous-media-prompt-studio',
  'autonomous-agent-skill-orchestrator',
  'autonomous-experiment-priority-engine',
  'autonomous-revenue-forecast-studio',
  'dynamic-api-monitoring',
  'deploy-drift-dashboard',
] as const;

const HERO_CTA_CLASSES = [
  'rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50',
  'rounded-lg border border-cyan-300 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800 hover:bg-cyan-100',
  'rounded-lg border border-pink-300 bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-800 hover:bg-pink-100',
  'rounded-lg border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-100',
  'rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100',
] as const;

export function getHomepageHeroCtas(): HomepageHeroCta[] {
  const liveById = new Map(AI_LAB_TOOLS.filter((tool) => tool.status === 'live').map((tool) => [tool.id, tool]));
  const ctas: HomepageHeroCta[] = [];
  for (const [index, id] of HERO_CTA_IDS.entries()) {
    const tool = liveById.get(id);
    if (!tool) continue;
    ctas.push({
      href: tool.href,
      label: `Open ${tool.title.replace(/^Autonomous\s+/u, '')}`,
      className: HERO_CTA_CLASSES[index] ?? HERO_CTA_CLASSES[0],
    });
  }
  return ctas;
}

export function getHomepageLiveNowItems(): HomepageLiveNowItem[] {
  const liveById = new Map(AI_LAB_TOOLS.filter((tool) => tool.status === 'live').map((tool) => [tool.id, tool]));
  const items: HomepageLiveNowItem[] = [];
  for (const id of LIVE_NOW_IDS) {
    const tool = liveById.get(id);
    if (!tool) continue;
    items.push({
      href: tool.href,
      badge: tool.badge ?? 'Live',
      title: tool.title,
      description: tool.shortDescription,
    });
  }
  return items;
}

