export interface NavigationLink {
  name: string;
  href: string;
}

export const PRIMARY_NAV_LINKS: NavigationLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Solutions', href: '/solutions' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
  { name: '⚡ AI Agents Live', href: '/agents-monitoring' },
  { name: 'Contact', href: '/contact' },
];

export const SOLUTION_LINKS: NavigationLink[] = [
  { name: 'AI Solutions', href: '/services?category=ai' },
  { name: 'Cloud Migration', href: '/services?category=cloud' },
  { name: 'Cybersecurity', href: '/services?category=security' },
  { name: 'Data Analytics', href: '/services?category=data' },
  { name: 'IT Services', href: '/services?category=it' },
  { name: 'Automation', href: '/services?category=automation' },
  { name: 'Micro-SaaS', href: '/services?category=micro-saas' },
  { name: 'DevOps', href: '/services?category=devops' },
];

export const RESOURCE_LINKS: NavigationLink[] = [
  { name: 'Blog', href: '/blog' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Proposals', href: '/proposals' },
  { name: 'Configurator', href: '/configurator' },
  { name: '⚡ AI Agent Dashboard', href: '/dashboard' },
  { name: '📊 Agent Monitoring', href: '/agents-monitoring' },
];

export const FEATURED_AI_SERVICE_LINKS: NavigationLink[] = [
  { name: 'AI Fraud Detection', href: '/services/ai-fraud-detection' },
  { name: 'AI Document Understanding', href: '/services/ai-document-understanding' },
  { name: 'AI Governance', href: '/services/ai-governance' },
  { name: 'AI Computer Vision', href: '/services/ai-computer-vision-inspection' },
  { name: 'AI Conversational Analytics', href: '/services/ai-conversational-analytics' },
  { name: 'Speech Recognition', href: '/services/speech-recognition' },
  { name: 'Data Observability', href: '/services/data-observability' },
  { name: 'Test Automation', href: '/services/test-automation' },
];
