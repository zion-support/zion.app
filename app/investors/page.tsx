import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Investors | Zion Tech Group',
  description:
    'Investor hub for Zion Tech Group — strategy, traction, business model, and governance for current and prospective investors.',
  alternates: { canonical: '/investors' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Investors',
        category: 'Company & Resources',
        description:
          'This hub gives current and prospective investors a clear view of how Zion Tech Group builds, sells, and scales AI solutions — from product strategy and market positioning to delivery model, risk posture, and long‑term roadmap.',
        iconEmoji: '🏛️',
        features: [
          {
            title: 'Strategy & product roadmap',
            description:
              'High-level view of how Zion combines production-ready AI apps, engineering services, and automation bundles into a cohesive long-term platform strategy.',
          },
          {
            title: 'Market opportunity & positioning',
            description:
              'Context on the markets we serve, how solution tracks map to buyer needs, and where Zion is differentiated versus generic tooling and point solutions.',
          },
          {
            title: 'Traction & adoption signals',
            description:
              'Snapshot of app library breadth, industry coverage, and common rollout patterns that indicate where customers are finding the most value today.',
          },
          {
            title: 'Business & revenue model',
            description:
              'Overview of how pilots, platform plans, and professional services work together — including how value is captured across engagements and bundles.',
          },
          {
            title: 'Risk, governance & compliance',
            description:
              'How security-by-default delivery, compliance support, and responsible AI practices reduce execution and regulatory risk for Zion and its customers.',
          },
          {
            title: 'Operating model & delivery engine',
            description:
              'Insight into the remote-first, outcome-driven delivery model that powers repeatable pilots, scale rollouts, and ongoing optimization.',
          },
        ],
        useCases: [
          {
            title: 'Diligence & thesis building',
            description:
              'Use this page alongside product routes and case studies to understand how Zion creates value, mitigates risk, and fits into broader AI and infrastructure portfolios.',
            icon: '📘',
          },
          {
            title: 'Board & stakeholder briefings',
            description:
              'Give boards and leadership teams a concise view of strategy, traction, and roadmap without needing to reconstruct the story from individual product pages.',
            icon: '🏛️',
          },
          {
            title: 'Fundraising & co-investor conversations',
            description:
              'Share a consistent narrative about the platform, target markets, and operating model when discussing Zion with co-investors or LPs.',
            icon: '🤝',
          },
          {
            title: 'Portfolio value creation planning',
            description:
              'Identify where Zion solutions can compound value across a portfolio — from cost reduction and risk management to net-new revenue initiatives.',
            icon: '📈',
          },
        ],
        benefits: [
          'Clear articulation of Zion’s product, platform, and services strategy.',
          'Transparency into go-to-market motion, delivery model, and how value is captured.',
          'Context on traction signals across solution tracks and industry verticals.',
          'Confidence in Zion’s security, compliance, and responsible AI posture.',
          'Faster diligence cycles with curated entry points into routes, case studies, and pricing.',
          'Shared language for board, LP, and leadership conversations about Zion.',
        ],
        ctaLabel: 'Talk to Investor Relations',
        ctaHref: '/contact?topic=investors',
      }}
    />
  );
}
