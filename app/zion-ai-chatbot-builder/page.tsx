import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Chatbot Builder | Zion Tech Group',
  description:
    'Build and deploy production-ready AI chatbots for support, sales, and internal teams — grounded in your knowledge base with human handoff, analytics, and secure integrations.',
  alternates: { canonical: '/zion-ai-chatbot-builder' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Chatbot Builder',
        category: 'Language & Communication',
        description:
          'Zion AI Chatbot Builder lets you launch branded AI assistants that resolve common requests, capture rich context, and route complex conversations to the right humans — all grounded in your documentation, policies, and product data.',
        iconEmoji: '🗣️',
        features: [
          {
            title: 'Omnichannel, branded experiences',
            description:
              'Deploy chatbots across web, in-app, and support portals with a consistent brand voice, reusable components, and centralized configuration.',
          },
          {
            title: 'Knowledge-grounded answers',
            description:
              'Connect to your docs, help center, and internal playbooks so responses are grounded in approved content with source links and citations.',
          },
          {
            title: 'Human handoff and routing',
            description:
              'Escalate to live agents with full conversation context, tags, and priority signals so humans can focus on high-impact conversations.',
          },
          {
            title: 'Workflow and ticket automation',
            description:
              'Trigger tickets, tasks, and CRM updates directly from conversations using no-code workflows and flexible webhooks.',
          },
          {
            title: 'Analytics and quality loops',
            description:
              'Monitor conversation quality, deflection rates, CSAT, and missed-intent topics to continuously improve flows and training data.',
          },
          {
            title: 'Security and compliance controls',
            description:
              'Role-based access, data retention controls, audit trails, and safe-guardrails for regulated industries and high-trust environments.',
          },
        ],
        useCases: [
          {
            title: 'Self-service customer support',
            description:
              'Deflect repetitive tickets by answering account, billing, and troubleshooting questions 24/7 while keeping clear escalation paths for complex issues.',
            icon: '💬',
          },
          {
            title: 'Sales and pre-sales assistance',
            description:
              'Guide prospects through pricing, product fit, and integration questions, then hand qualified opportunities to your sales team with full context.',
            icon: '📈',
          },
          {
            title: 'Internal knowledge assistant',
            description:
              'Give employees a single place to ask questions about policies, runbooks, and architecture diagrams so onboarding and day-to-day work move faster.',
            icon: '🧠',
          },
        ],
        benefits: [
          'Lower support volume without sacrificing quality',
          'Faster first-response and resolution times',
          'More qualified, context-rich sales conversations',
          'Less time spent searching internal documentation',
          'Enterprise-ready security and compliance posture',
          'Clear analytics for deflection, CSAT, and ROI',
        ],
        breadcrumb: [
          { label: 'Home', href: '/' },
          { label: 'Solutions', href: '/solutions' },
          { label: 'Customer Experience Apps', href: '/solutions/ecommerce-retail' },
          { label: 'Zion AI Chatbot Builder' },
        ],
        caseStudy: {
          title: 'SaaS platform reduces support volume by 40%',
          description:
            'A B2B SaaS company used Zion AI Chatbot Builder to automate tier-1 requests, cut average handle time, and free agents to focus on complex escalations.',
          ctaLabel: 'View support case studies',
        },
        ctaLabel: 'Start a Project with Zion AI Chatbot Builder',
        secondaryCtaLabel: 'View Pricing',
        secondaryCtaHref: '/pricing?source=zion-ai-chatbot-builder',
      }}
    />
  );
}
