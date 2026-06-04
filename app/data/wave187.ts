// Wave 187 services — @tablet_kleber_bot
// 4 services across 4 categories (AI, Data, Cloud, Automation)

import { Service } from './serviceTypes';

export const wave187DataServices: Service[] = [
  {
    id: 'data-realtime-streaming-analytics',
    title: 'Data Real-Time Streaming Analytics Platform',
    description: 'Process and analyze millions of events per second with sub-second latency.',
    features: ['Millions of events/sec', 'Sub-second latency', 'SQL + Python analytics', 'Anomaly detection', 'Kafka connectors'],
    benefits: ['Real-time decisions', 'Instant anomaly detection'],
    pricing: { basic: '$499/mo', pro: '$1,499/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/data-realtime-streaming-analytics', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⚡', href: '/services/data-realtime-streaming-analytics', popular: true, category: 'data', industry: 'Finance',
  },
];

export const wave187CloudServices: Service[] = [
  {
    id: 'cloud-kubernetes-platform-service',
    title: 'Cloud Kubernetes Platform as a Service',
    description: 'Managed Kubernetes with auto-scrolling, service mesh, GitOps, multi-cluster management.',
    features: ['Multi-cloud clusters', 'Istio service mesh', 'GitOps delivery', 'Auto-scrolling', 'Cost dashboards'],
    benefits: ['80% less complexity', 'Multi-cloud portable'],
    pricing: { basic: '$299/mo', pro: '$799/mo', enterprise: '$2,499/mo' },
    contactInfo: { website: '/services/cloud-kubernetes-platform-service', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '☸️', href: '/services/cloud-kubernetes-platform-service', popular: true, category: 'cloud', industry: 'Technology',
  },
  {
    id: 'cloud-serverless-application-platform',
    title: 'Cloud Serverless Application Platform',
    description: 'Build serverless apps with auto-scrolling, event-driven architecture, API management, edge computing.',
    features: ['FaaS', 'Edge computing', 'API gateway', 'Event triggers', 'Observability'],
    benefits: ['Zero infra management', 'Pay-per-execution'],
    pricing: { basic: '$49/mo', pro: '$199/mo', enterprise: '$599/mo' },
    contactInfo: { website: '/services/cloud-serverless-application-platform', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '⚡', href: '/services/cloud-serverless-application-platform', popular: false, category: 'cloud', industry: 'Technology',
  },
];

export const wave187AutomationServices: Service[] = [
  {
    id: 'automation-robotic-process-automation',
    title: 'Automation Robotic Process Automation',
    description: 'Enterprise RPA that automates repetitive tasks with AI document understanding.',
    features: ['Visual workflow designer', 'AI documents', 'Citizen developer portal', '24/7 bots', 'ERP/CRM integration'],
    benefits: ['70% tasks automated', '99% fewer errors'],
    pricing: { basic: '$999/mo', pro: '$2,499/mo', enterprise: 'Custom' },
    contactInfo: { website: '/services/automation-robotic-process-automation', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🤖', href: '/services/automation-robotic-process-automation', popular: true, category: 'automation', industry: 'Finance',
  },
];

export const wave187HealthcareItServices: Service[] = [
  {
    id: 'healthcare-telehealth-platform',
    title: 'Healthcare Telehealth Platform',
    description: 'HIPAA-compliant telehealth with HD video, EHR integration, remote monitoring, scheduling.',
    features: ['HD video', 'EHR integration', 'Remote monitoring', 'Auto scheduling', 'HIPAA messaging'],
    benefits: ['300% more reach', '45% fewer no-shows'],
    pricing: { basic: '$399/mo', pro: '$999/mo', enterprise: '$2,999/mo' },
    contactInfo: { website: '/services/healthcare-telehealth-platform', email: 'commercial@ziontechgroup.com', phone: '+1 302 464 0950' },
    icon: '🏥', href: '/services/healthcare-telehealth-platform', popular: true, category: 'it', industry: 'Healthcare',
  },
];

export const wave187AiServices: Service[] = [];
export const wave187SecurityServices: Service[] = [];
export const wave187MicroSaasServices: Service[] = [];
