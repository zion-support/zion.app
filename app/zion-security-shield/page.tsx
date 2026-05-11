import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion Security Shield | Zion Tech Group',
  description:
    'Zion Security Shield provides enterprise-grade security controls, continuous monitoring, and compliance automation. Reduce risk exposure and accelerate aud',
  alternates: { canonical: '/zion-security-shield' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion Security Shield',
        category: 'Security & Compliance',
        description:
          'Zion Security Shield provides enterprise-grade security controls, continuous monitoring, and compliance automation. Reduce risk exposure and accelerate audit readiness with AI-driven threat detection and policy enforcement.',
        iconEmoji: '🛡️',
        features: [
                  {
                            "title": "Continuous Threat Monitoring",
                            "description": "Real-time scanning and alerting across your attack surface with AI-powered anomaly detection and automated incident classification."
                  },
                  {
                            "title": "Compliance Automation",
                            "description": "Automated evidence collection, policy enforcement, and audit trail generation for SOC 2, GDPR, HIPAA, and other frameworks."
                  },
                  {
                            "title": "Vulnerability Assessment",
                            "description": "Systematic identification and prioritization of security weaknesses with risk-scored remediation recommendations."
                  },
                  {
                            "title": "Access Control Management",
                            "description": "Fine-grained role-based access policies with continuous verification and least-privilege enforcement across systems."
                  },
                  {
                            "title": "Incident Response Playbooks",
                            "description": "Pre-built and customizable response workflows that reduce mean time to resolution for security events."
                  },
                  {
                            "title": "Security Reporting",
                            "description": "Executive dashboards and detailed technical reports that keep stakeholders informed and auditors satisfied."
                  }
        ],
        useCases: [
                  {
                            "title": "Regulatory Compliance",
                            "description": "Automate evidence collection and policy enforcement to pass SOC 2, GDPR, and industry-specific audits faster.",
                            "icon": "📋"
                  },
                  {
                            "title": "Threat Detection",
                            "description": "Identify and respond to security incidents in real time with AI-powered monitoring and automated response playbooks.",
                            "icon": "🔍"
                  },
                  {
                            "title": "Risk Assessment",
                            "description": "Continuously evaluate your security posture and prioritize remediation based on actual business risk.",
                            "icon": "⚠️"
                  }
        ],
        benefits: ["Reduced security incident response time","Automated compliance evidence collection","Continuous risk visibility","Lower audit preparation costs","Proactive threat detection","Simplified regulatory reporting"],
        ctaLabel: 'Get Started with Zion Security Shield',
      }}
    />
  );
}
