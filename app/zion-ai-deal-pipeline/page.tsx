import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Deal Pipeline | Zion Tech Group',
  description:
    'Visualize and optimize sales pipeline with AI-powered forecasting, stage analysis, and win probability scoring.',
  alternates: { canonical: '/zion-ai-deal-pipeline' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Deal Pipeline',
        category: 'Growth',
        description:
          'Visualize and optimize sales pipeline with AI-powered forecasting, stage analysis, win probability scoring, and next-best-action so reps and managers focus on the right deals.',
        iconEmoji: '📈',
        features: [
          {
            title: 'Pipeline Visualization',
            description:
              'Kanban and list views of deals by stage. Filter by rep, segment, product, or value. Drill into deal history and activities.',
          },
          {
            title: 'Win Probability & Risk',
            description:
              'AI scores deal win probability and risk based on stage, engagement, and similar won/lost deals. Surface at-risk and stuck deals.',
          },
          {
            title: 'Forecasting',
            description:
              'Roll-up and commit forecasts with scenario modeling. Compare historical accuracy to improve predictability.',
          },
          {
            title: 'Stage & Velocity Analytics',
            description:
              'Track stage conversion, cycle time, and velocity. Identify bottlenecks and compare segments or reps.',
          },
          {
            title: 'CRM Integration',
            description:
              'Sync with Salesforce, HubSpot, or your CRM. Pipeline and forecasts stay current without manual export.',
          },
          {
            title: 'Governance & Audit',
            description:
              'Audit trail of stage changes and forecast submissions. Support for revenue recognition and board reporting.',
          },
        ],
        useCases: [
          {
            title: 'Pipeline Reviews',
            description:
              'Managers see deal health, risk, and next steps in one place. Reps get prioritized action lists so nothing slips.',
            icon: '👁️',
          },
          {
            title: 'Accurate Forecasting',
            description:
              'AI-assisted forecasts and scenario modeling. Track forecast accuracy over time and improve predictability.',
            icon: '📊',
          },
          {
            title: 'Deal Execution',
            description:
              'Reps know which deals need attention and what to do next. Reduce cycle time and improve win rates with consistent follow-up.',
            icon: '🎯',
          },
        ],
        benefits: [
          'Clear pipeline and deal health visibility',
          'More accurate forecasts and commit',
          'Faster cycle time and higher win rates',
          'CRM-synced pipeline and activities',
          'Audit and board-ready reporting',
        ],
        ctaLabel: 'Get Started with Zion AI Deal Pipeline',
      }}
    />
  );
}
