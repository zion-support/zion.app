import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Customer Support Pro | Zion Tech Group',
  description:
    'Zion AI Customer Support Pro elevates customer interactions with AI-driven support, intelligent routing, and personalized engagement across every touchpoint.',
  alternates: { canonical: '/zion-ai-customer-support-pro' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Customer Support Pro',
        category: 'Customer Experience',
        description:
          'Zion AI Customer Support Pro elevates customer interactions with AI-driven support, intelligent routing, and personalized engagement across every touchpoint — so your team can scale service quality without scaling headcount.',
        iconEmoji: '💬',
        features: [
          {
            title: 'Tier-0 and Tier-1 automation',
            description:
              'Resolve high-volume, repetitive questions automatically while keeping clear handoff paths for complex or high-risk conversations.',
          },
          {
            title: 'Smart intent and routing',
            description:
              'Classify intent, sentiment, and priority in real time so conversations route to the right queues, teams, or SLAs.',
          },
          {
            title: 'Knowledge-backed responses',
            description:
              'Ground answers in your help center, playbooks, and policy docs with transparent source links and guardrails for regulated content.',
          },
          {
            title: 'Agent assist copilots',
            description:
              'Surface reply suggestions, next best actions, and related context directly inside your agent workspace for faster resolutions.',
          },
          {
            title: 'Quality and coaching insights',
            description:
              'Monitor handle time, CSAT, and conversation quality; flag improvement opportunities and coaching moments automatically.',
          },
          {
            title: 'Secure, enterprise-ready delivery',
            description:
              'Encryption, access controls, and audit trails aligned to SOC 2 and GDPR expectations for modern support operations.',
          },
        ],
        useCases: [
          {
            title: '24/7 self-service help center',
            description:
              'Offer instant answers across channels with AI that understands your knowledge base and escalates when customers need a human.',
            icon: '🌙',
          },
          {
            title: 'Hybrid agent + bot workflows',
            description:
              'Let AI collect context, authenticate users, and propose resolutions while agents handle edge cases with full conversation history.',
            icon: '🤝',
          },
          {
            title: 'Proactive retention and upsell',
            description:
              'Detect frustration, churn risk, or expansion signals in conversations and trigger playbooks that protect and grow revenue.',
            icon: '📈',
          },
        ],
        benefits: [
          'Reduced ticket volume and average handle time',
          'Higher CSAT and NPS from faster, consistent answers',
          'Better visibility into support demand and trends',
          'Stronger collaboration between AI and human agents',
          'Improved retention through proactive outreach',
          'Support operations ready for enterprise audits',
        ],
        breadcrumb: [
          { label: 'Home', href: '/' },
          { label: 'Solutions', href: '/solutions' },
          { label: 'Customer Experience Apps', href: '/solutions/ecommerce-retail' },
          { label: 'Zion AI Customer Support Pro' },
        ],
        caseStudy: {
          title: 'SaaS platform cuts support tickets by 40%',
          description:
            'A fast-growing SaaS company used Zion AI Customer Support Pro to automate FAQs, reduce backlog, and improve first-response times across regions.',
          ctaLabel: 'Explore support case studies',
        },
        ctaLabel: 'Start a Project with Zion AI Customer Support Pro',
        secondaryCtaLabel: 'View Pricing',
        secondaryCtaHref: '/pricing?source=zion-ai-customer-support-pro',
      }}
    />
  );
}
