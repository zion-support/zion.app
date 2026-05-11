import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Cloud Infrastructure | Zion Tech Group',
  description:
    'Cloud Infrastructure services deliver scalable architecture, auto-scaling, IaC, and cost optimization. Modernize and manage workloads across clouds.',
  alternates: { canonical: '/cloud-infrastructure' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Cloud Infrastructure',
        category: 'Cloud & Infrastructure',
        description:
          'Cloud Infrastructure services help you design, deploy, and operate scalable, resilient systems. From migration and modernization to multi-cloud orchestration, we deliver infrastructure that supports growth while controlling costs and complexity.',
        iconEmoji: '☁️',
        features: [
          {
            title: 'Auto-Scaling & Elasticity',
            description:
              'Automatically scale compute, storage, and network resources based on demand. Handle traffic spikes without over-provisioning or manual intervention.',
          },
          {
            title: 'Infrastructure as Code',
            description:
              'Define and version infrastructure with Terraform, Pulumi, or CloudFormation. Reproducible environments, peer-reviewed changes, and drift detection.',
          },
          {
            title: 'Monitoring & Observability',
            description:
              'Unified dashboards for metrics, logs, and traces across clouds. Intelligent alerting, anomaly detection, and capacity forecasting.',
          },
          {
            title: 'Cost Optimization',
            description:
              'Right-sizing recommendations, reserved instance planning, and spot/preemptible strategies. Reduce spend without sacrificing performance or reliability.',
          },
          {
            title: 'Multi-Cloud Architecture',
            description:
              'Design for AWS, Azure, GCP, or hybrid setups. Avoid vendor lock-in while leveraging best-of-breed services from each provider.',
          },
          {
            title: 'Security & Compliance',
            description:
              'Network segmentation, encryption at rest and in transit, and automated compliance checks. Meet SOC2, HIPAA, and industry requirements.',
          },
        ],
        useCases: [
          {
            title: 'Migration & Modernization',
            description:
              'Lift-and-shift or refactor legacy workloads to the cloud. Minimize downtime with phased migration and validation at each stage.',
            icon: '🚀',
          },
          {
            title: 'Multi-Cloud Strategy',
            description:
              'Distribute workloads across providers for resilience, cost arbitrage, or regulatory needs. Unified management and consistent operations.',
            icon: '🌐',
          },
          {
            title: 'Disaster Recovery',
            description:
              'Automated backup, replication, and failover across regions. Test recovery procedures regularly and meet RTO/RPO targets.',
            icon: '🔄',
          },
        ],
        benefits: [
          'Reduced infrastructure costs through optimization',
          'Better reliability with auto-healing and failover',
          'Faster provisioning with IaC and automation',
          'Improved security posture and compliance readiness',
          'Scalability to handle growth and spikes',
          'Simplified operations with unified tooling',
        ],
        ctaLabel: 'Get Started with Cloud Infrastructure',
      }}
    />
  );
}
