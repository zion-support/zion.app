import ProductPageLayout from '../../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'AI Strategy & Roadmap | Zion Tech Group',
  description:
    'Align AI initiatives with business goals. Discovery workshops, use-case prioritization, vendor evaluation, and phased roadmaps for production AI at scale.',
  alternates: { canonical: '/ai-services/ai-strategy-roadmap' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'AI Strategy & Roadmap',
        category: 'Advanced AI Services',
        description:
          'Turn AI ambition into an executable plan. We run discovery workshops, prioritize use cases by impact and feasibility, evaluate vendors and build-vs-buy options, and deliver phased roadmaps with clear KPIs — so you move from pilot to scaled operations with confidence.',
        iconEmoji: '🗺️',
        features: [
          {
            title: 'Discovery & Opportunity Mapping',
            description:
              'Workshop-driven discovery to map AI opportunities to business outcomes. Identify high-impact use cases, data readiness, and technical constraints before committing budget.',
          },
          {
            title: 'Use-Case Prioritization',
            description:
              'Prioritize initiatives by ROI, feasibility, and strategic fit. Balance quick wins with long-term platform bets using a consistent scoring framework.',
          },
          {
            title: 'Vendor & Build-vs-Buy Evaluation',
            description:
              'Objective evaluation of foundation models, platforms, and build-vs-buy paths. Align technology choices with security, cost, and time-to-value requirements.',
          },
          {
            title: 'Phased Roadmap Design',
            description:
              'Multi-phase roadmaps with milestones, dependencies, and resource needs. From proof-of-concept through production scale with clear go/no-go criteria.',
          },
          {
            title: 'KPI & Success Metrics',
            description:
              'Define measurable success metrics and tracking plans for each phase. Connect AI deliverables to business KPIs stakeholders care about.',
          },
          {
            title: 'Governance & Risk Alignment',
            description:
              'Embed governance, compliance, and risk considerations into strategy from day one. EU AI Act, sector regulations, and internal policy alignment.',
          },
        ],
        useCases: [
          {
            title: 'Enterprise AI Portfolio Planning',
            description:
              'Design a portfolio of AI initiatives across departments with shared platform and governance.',
            icon: '📋',
          },
          {
            title: 'Pilot-to-Scale Transition',
            description:
              'Turn successful pilots into repeatable, scalable programs with clear handoff and ownership.',
            icon: '🚀',
          },
          {
            title: 'Executive & Board Alignment',
            description:
              'Communicate AI strategy, investment, and risk in language that aligns leadership and boards.',
            icon: '👔',
          },
        ],
        benefits: [
          'Clear prioritization so you invest in the right use cases first',
          'Reduced risk through structured discovery and evaluation',
          'Faster alignment across business, IT, and security',
          'Actionable roadmaps with milestones and ownership',
          'Governance built in, not bolted on',
          'Repeatable playbook for future AI initiatives',
        ],
        ctaLabel: 'Discuss AI Strategy',
        ctaHref: '/contact?topic=ai-strategy',
        secondaryCtaLabel: 'View AI Services',
        secondaryCtaHref: '/ai-services',
        breadcrumb: [
          { label: 'Home', href: '/' },
          { label: 'AI Services', href: '/ai-services' },
          { label: 'AI Strategy & Roadmap' },
        ],
      }}
    />
  );
}
