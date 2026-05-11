import type { AILabToolId } from './ai-lab-tools';

export type SiteHealthCategory =
  | 'performance'
  | 'accessibility'
  | 'seo'
  | 'security'
  | 'content'
  | 'navigation'
  | 'architecture';

export interface SiteHealthScore {
  category: SiteHealthCategory;
  score: number;
  trend: 'up' | 'down' | 'steady';
  summary: string;
}

export interface AIImprovementEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  area: SiteHealthCategory;
  source: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  area: SiteHealthCategory;
  suggestedBy: string;
}

export interface SiteEvolutionSnapshot {
  generatedAt: string;
  toolId: AILabToolId;
  overallHealthScore: number;
  healthBreakdown: SiteHealthScore[];
  recentImprovements: AIImprovementEvent[];
  topRecommendations: AIRecommendation[];
}

// In the future, this module can be updated by automation agents to ingest
// real JSON reports under automation/reports/*. For now, keep a deterministic,
// static snapshot so the UI is stable in all environments.
export const latestSiteEvolutionSnapshot: SiteEvolutionSnapshot = {
  generatedAt: new Date().toISOString(),
  toolId: 'ai-site-evolution-advisor',
  overallHealthScore: 88,
  healthBreakdown: [
    {
      category: 'performance',
      score: 90,
      trend: 'up',
      summary: 'Core Web Vitals and bundle size are trending in the right direction.',
    },
    {
      category: 'accessibility',
      score: 86,
      trend: 'steady',
      summary: 'Key journeys pass automated checks; some long-form pages still need polish.',
    },
    {
      category: 'seo',
      score: 84,
      trend: 'up',
      summary: 'Metadata coverage and internal linking continue to improve across product pages.',
    },
    {
      category: 'security',
      score: 92,
      trend: 'steady',
      summary: 'Security scanners report no critical issues on the marketing surface.',
    },
    {
      category: 'content',
      score: 87,
      trend: 'up',
      summary: 'Content freshness automation keeps blog and solution pages regularly updated.',
    },
    {
      category: 'navigation',
      score: 83,
      trend: 'up',
      summary: 'Navigation audits are steadily reducing dead ends and duplicate paths.',
    },
    {
      category: 'architecture',
      score: 89,
      trend: 'steady',
      summary: 'App structure and automation workflows remain healthy and well-factored.',
    },
  ],
  recentImprovements: [
    {
      id: 'improvement-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      title: 'Homepage services & content sync',
      description:
        'Homepage Core Services and Advanced AI sections were synchronized with the latest services catalog, ensuring new offerings are promoted automatically.',
      area: 'navigation',
      source: 'AI Front Page Services & Content workflow',
    },
    {
      id: 'improvement-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      title: 'Live UX layout refinements',
      description:
        'Layout design automation adjusted spacing and hierarchy on select solution pages to improve readability on mobile.',
      area: 'accessibility',
      source: 'AI Layout Design Automation pipeline',
    },
    {
      id: 'improvement-3',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      title: 'Content freshness sweep',
      description:
        'Content freshness agents refreshed several industry and product pages with updated positioning and links.',
      area: 'content',
      source: 'AI Content Freshness Agent',
    },
  ],
  topRecommendations: [
    {
      id: 'rec-1',
      title: 'Promote AI Lab tools on the homepage hero band',
      description:
        'Add a compact ribbon or callout in the hero to surface the newest AI Lab tools for high-intent visitors.',
      impact: 'high',
      area: 'navigation',
      suggestedBy: 'AI App Evolution Audit',
    },
    {
      id: 'rec-2',
      title: 'Deeper internal links from long-form blogs to product pages',
      description:
        'Strengthen the bridge between educational content and AI products by adding contextual CTAs inside long-form posts.',
      impact: 'medium',
      area: 'seo',
      suggestedBy: 'AI Content Health & SEO Audits',
    },
    {
      id: 'rec-3',
      title: 'Bundle heavier visuals behind lazy loading on secondary routes',
      description:
        'A few deep solution pages still load large hero visuals eagerly; convert to lazy-loaded or responsive images.',
      impact: 'medium',
      area: 'performance',
      suggestedBy: 'AI Performance Optimizer',
    },
  ],
};

