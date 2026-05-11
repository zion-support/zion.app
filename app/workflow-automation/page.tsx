import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Workflow Automation | Zion Tech Group',
  description:
    'Workflow Automation eliminates manual bottlenecks with intelligent process automation, event-driven orchestration, and cross-system integration. Reclaim op',
  alternates: { canonical: '/workflow-automation' },
};

export default function Page() {
  return (
    <ProductPageLayout
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Automation', href: '/automation' },
        { label: 'Workflow Automation' },
      ]}
      data={{
        title: 'Workflow Automation',
        category: 'Automation & Workflows',
        description:
          'Workflow Automation eliminates manual bottlenecks with intelligent process automation, event-driven orchestration, and cross-system integration. Reclaim operational capacity and reduce human error.',
        iconEmoji: '🔄',
        features: [
                  {
                            "title": "Visual Workflow Builder",
                            "description": "Design complex automation flows with a drag-and-drop interface that connects triggers, conditions, and actions across systems."
                  },
                  {
                            "title": "Event-Driven Orchestration",
                            "description": "React to business events in real time with intelligent routing, parallel processing, and conditional branching."
                  },
                  {
                            "title": "Error Handling & Recovery",
                            "description": "Built-in retry logic, dead-letter queues, and self-healing mechanisms that keep workflows running reliably."
                  },
                  {
                            "title": "Cross-Platform Integration",
                            "description": "Pre-built connectors for popular business tools with webhook support and custom API integration capabilities."
                  },
                  {
                            "title": "Audit Trail & Compliance",
                            "description": "Full execution logging with immutable audit trails for regulatory compliance and operational debugging."
                  },
                  {
                            "title": "Performance Optimization",
                            "description": "Analytics on workflow execution times, bottlenecks, and throughput with AI-suggested improvements."
                  }
        ],
        useCases: [
                  {
                            "title": "Process Digitization",
                            "description": "Convert manual, paper-based processes into automated digital workflows with tracking and accountability.",
                            "icon": "📱"
                  },
                  {
                            "title": "Cross-Team Coordination",
                            "description": "Automate handoffs between departments with intelligent routing, notifications, and SLA tracking.",
                            "icon": "🔗"
                  },
                  {
                            "title": "Compliance Workflows",
                            "description": "Build auditable approval chains and documentation flows that satisfy regulatory requirements.",
                            "icon": "✅"
                  }
        ],
        benefits: ["Reduced manual processing time","Fewer human errors","Faster cross-team handoffs","Complete audit trail","Scalable process execution","Lower operational overhead"],
        ctaLabel: 'Get Started with Workflow Automation',
      }}
    />
  );
}
