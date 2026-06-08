export interface NavigationLink {
  name: string;
  href: string;
}

export const PRIMARY_NAV_LINKS: NavigationLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Solutions', href: '/solutions' },
  { name: 'Pricing', href: '/pricing' },
  { name: '⚡ AI Agents', href: '/agents-monitoring' },
  { name: 'Contact', href: '/contact' },
];

export const SOLUTION_LINKS: NavigationLink[] = [
  { name: 'AI Services', href: '/services/?category=ai' },
  { name: 'IT Services', href: '/services/?category=it' },
  { name: 'Cloud & DevOps', href: '/services/?category=cloud' },
  { name: 'Cybersecurity', href: '/services/?category=security' },
  { name: 'Data & Analytics', href: '/services/?category=data' },
  { name: 'Micro-SaaS', href: '/services/?category=micro-saas' },
  { name: 'Automation', href: '/services/?category=automation' },
  { name: 'All Services', href: '/services' },
];

export const RESOURCE_LINKS: NavigationLink[] = [
  { name: '🤖 Agent Monitoring', href: '/agents-monitoring' },
  { name: '📊 System Status', href: '/status' },
  { name: '📖 Blog', href: '/blog' },
  { name: '📚 Academy', href: '/academy' },
  { name: '❓ FAQ', href: '/faq' },
  { name: 'ℹ️ About Us', href: '/about' },
  { name: '🤝 Partners', href: '/partners' },
];

export const FEATURED_AI_SERVICE_LINKS: NavigationLink[] = [
  { name: 'AI Document Processing', href: '/services/ai-document-processing' },
  { name: 'AI Predictive Analytics', href: '/services/ai-predictive-analytics' },
  { name: 'AI Fraud Detection', href: '/services/ai-fraud-detection' },
  { name: 'AI Customer 360', href: '/services/ai-customer-360' },
  { name: 'AI Code Review', href: '/services/ai-code-quality-security-scan' },
  { name: 'AI Legal Document Review', href: '/services/ai-legal-document-review-contract-analysis' },
  { name: 'All AI Services →', href: '/services/?category=ai' },
];
