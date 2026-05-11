import ProductPageLayout from '../../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'AI Observability & MLOps | Zion Tech Group',
  description:
    'Monitor, debug, and optimize AI systems at scale. End-to-end observability for LLMs, agents, and ML pipelines with tracing, evaluation, and cost analytics.',
  alternates: { canonical: '/ai-services/ai-observability-mlops' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'AI Observability & MLOps',
        category: 'Advanced AI Services',
        description:
          'Run AI in production with full visibility. Trace every request, evaluate quality and safety, monitor costs and latency, and debug issues before they impact users. Enterprise-grade observability for LLMs, agents, and ML pipelines.',
        iconEmoji: '📡',
        features: [
          {
            title: 'End-to-End Tracing',
            description:
              'Trace requests across models, RAG steps, tool calls, and agents. See full execution graphs, token usage, and latency breakdowns for every inference.',
          },
          {
            title: 'Quality & Safety Evaluation',
            description:
              'Run automated evaluations for relevance, hallucination, toxicity, and PII. Compare model versions and prompts with consistent metrics and guardrails.',
          },
          {
            title: 'Cost & Usage Analytics',
            description:
              'Track spend by model, team, and use case. Set budgets and alerts. Optimize costs with usage dashboards and recommendations.',
          },
          {
            title: 'MLOps Pipeline Management',
            description:
              'Version models, manage experiments, and automate training and deployment. Integrate with CI/CD for reproducible, auditable releases.',
          },
          {
            title: 'Debugging & Root Cause',
            description:
              'Reproduce failures with full context. Inspect inputs, outputs, and intermediate steps. Identify drift and regressions before they reach production.',
          },
          {
            title: 'Compliance & Audit',
            description:
              'Retain logs and traces for compliance. Support SOC 2, GDPR, and AI Act requirements with searchable audit trails and export.',
          },
        ],
        useCases: [
          {
            title: 'Production LLM Monitoring',
            description:
              'Ensure reliability and quality of customer-facing AI. Catch regressions, track latency SLAs, and reduce cost per query.',
            icon: '🔍',
          },
          {
            title: 'Agent & RAG Debugging',
            description:
              'Understand why agents took specific actions. Debug RAG retrieval and grounding issues with step-by-step traces.',
            icon: '🤖',
          },
          {
            title: 'Model & Prompt Experimentation',
            description:
              'A/B test models and prompts with consistent evaluation. Ship winning configurations with confidence.',
            icon: '🧪',
          },
        ],
        benefits: [
          'Faster incident resolution with full request traces',
          'Lower cost through usage visibility and optimization',
          'Higher quality with automated evaluation and guardrails',
          'Compliance-ready audit logs and retention',
          'Seamless integration with existing ML and data stacks',
          'Scale from pilot to enterprise without observability gaps',
        ],
        ctaLabel: 'Explore AI Observability',
        ctaHref: '/contact',
        secondaryCtaLabel: 'View AI Services',
        secondaryCtaHref: '/ai-services',
        breadcrumb: [
          { label: 'Home', href: '/' },
          { label: 'AI Services', href: '/ai-services' },
          { label: 'AI Observability & MLOps' },
        ],
      }}
    />
  );
}
