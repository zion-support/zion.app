import ProductPageLayout from '../../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'AI Agents & Autonomous Workflows | Zion Tech Group',
  description:
    'Deploy autonomous AI agents that reason, plan, and act. Multi-step task execution, tool use, and human-in-the-loop controls for enterprise automation.',
  alternates: { canonical: '/ai-services/ai-agents-autonomous' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'AI Agents & Autonomous Workflows',
        category: 'Advanced AI Services',
        description:
          'Build and deploy AI agents that reason, plan, and execute multi-step tasks autonomously. Connect to tools, APIs, and data sources with human-in-the-loop controls for enterprise-grade automation.',
        iconEmoji: '🤖',
        features: [
          {
            title: 'Reasoning & Planning',
            description:
              'Agents that break complex goals into sub-tasks, prioritize steps, and adapt when conditions change. Transparent reasoning traces for audit and debugging.',
          },
          {
            title: 'Tool & API Integration',
            description:
              'Connect agents to CRM, ERP, databases, and custom APIs. Pre-built connectors for Salesforce, HubSpot, Slack, and 100+ enterprise tools.',
          },
          {
            title: 'Multi-Agent Orchestration',
            description:
              'Coordinate specialized agents for complex workflows. Hand off tasks between agents, aggregate results, and maintain context across long-running processes.',
          },
          {
            title: 'Human-in-the-Loop',
            description:
              'Configurable approval gates, escalation paths, and override controls. Agents propose actions; humans approve critical decisions before execution.',
          },
          {
            title: 'Memory & Context',
            description:
              'Persistent memory across sessions for personalized interactions. Summarize long conversations, retain user preferences, and maintain project context.',
          },
          {
            title: 'Observability & Safety',
            description:
              'Full execution logs, cost tracking, and anomaly detection. Guardrails prevent unintended actions and ensure agents stay within defined boundaries.',
          },
        ],
        useCases: [
          {
            title: 'Autonomous Customer Operations',
            description:
              'Agents that research issues, update records, schedule follow-ups, and escalate when needed — all within your existing systems.',
            icon: '🎧',
          },
          {
            title: 'Intelligent Process Automation',
            description:
              'End-to-end automation of multi-step workflows: data gathering, validation, approval routing, and system updates with minimal human intervention.',
            icon: '⚙️',
          },
          {
            title: 'Research & Analysis Assistants',
            description:
              'Agents that search sources, synthesize findings, draft reports, and flag gaps — accelerating due diligence, market research, and competitive intelligence.',
            icon: '🔍',
          },
        ],
        benefits: [
          'Reduce manual steps in complex workflows by 60%+',
          '24/7 autonomous execution with safety controls',
          'Seamless integration with existing tools and data',
          'Transparent reasoning for compliance and trust',
          'Scalable from pilot to enterprise deployment',
          'Built-in cost and performance monitoring',
        ],
        ctaLabel: 'Explore AI Agents',
        ctaHref: '/contact',
        secondaryCtaLabel: 'View AI Services',
        secondaryCtaHref: '/ai-services',
        breadcrumb: [
          { label: 'Home', href: '/' },
          { label: 'AI Services', href: '/ai-services' },
          { label: 'AI Agents & Autonomous Workflows' },
        ],
      }}
    />
  );
}
