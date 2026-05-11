// Service data for AI and IT solutions
export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  benefits: string[];
  pricing: {
    basic: string;
    pro: string;
    enterprise: string;
  }
  contactInfo: {
    website: string;
    email: string;
    phone: string;
  }
  icon: string;
  href: string;
  popular?: boolean;
  category: 'ai' | 'it' | 'cloud' | 'security' | 'data' | 'automation';
}

export const aiServices: Service[] = [
  {
    id: 'ai-analytics',
    title: 'AI Analytics & BI',
    description: 'Transform your data into actionable insights with our advanced AI analytics platform.',
    features: [
      'Real-time data processing',
      'Predictive analytics',
      'Custom dashboards',
      'Automated reporting',
      'Machine learning models'
    ],
    benefits: [
      'Increased efficiency',
      'Better decision making',
      'Cost reduction',
      'Competitive advantage'
    ],
    pricing: {
      basic: '299',
      pro: '599',
      enterprise: '1299'
    },
    contactInfo: {
      website: '/data-analytics',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📊',
    href: '/data-analytics',
    popular: true,
    category: 'ai'
  },
  {
    id: 'ai-automation',
    title: 'AI Automation',
    description: 'Streamline your business processes with intelligent automation solutions.',
    features: [
      'Workflow automation',
      'Document processing',
      'Email automation',
      'Task scheduling',
      'Process optimization'
    ],
    benefits: [
      'Time savings',
      'Reduced errors',
      'Scalable processes',
      'Improved productivity'
    ],
    pricing: {
      basic: '199',
      pro: '399',
      enterprise: '899'
    },
    contactInfo: {
      website: '/ai-services/process-automation',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🤖',
    href: '/ai-services/process-automation',
    category: 'ai'
  }
];

export const itServices: Service[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Build modern, responsive websites and web applications that drive results.',
    features: [
      'Responsive design',
      'SEO optimization',
      'Performance optimization',
      'Cross-browser compatibility',
      'Mobile-first approach'
    ],
    benefits: [
      'Better user experience',
      'Higher conversion rates',
      'Mobile accessibility',
      'Search engine visibility'
    ],
    pricing: {
      basic: '2999',
      pro: '5999',
      enterprise: '12999'
    },
    contactInfo: {
      website: '/web-development',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🌐',
    href: '/web-development',
    popular: true,
    category: 'it'
  },
  {
    id: 'cloud-infrastructure',
    title: 'Cloud Infrastructure',
    description: 'Scalable and secure cloud solutions for modern businesses.',
    features: [
      'Cloud migration',
      'Infrastructure as Code',
      'Auto-scaling',
      'Security compliance',
      '24/7 monitoring'
    ],
    benefits: [
      'Scalable resources',
      'Cost optimization',
      'High availability',
      'Security compliance'
    ],
    pricing: {
      basic: '1999',
      pro: '3999',
      enterprise: '7999'
    },
    contactInfo: {
      website: '/cloud-infrastructure',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '☁️',
    href: '/cloud-infrastructure',
    popular: true,
    category: 'it'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Comprehensive security solutions to protect your digital assets.',
    features: [
      'Security audits',
      'Threat monitoring',
      'Incident response',
      'Compliance management',
      'Security training'
    ],
    benefits: [
      'Data protection',
      'Regulatory compliance',
      'Risk mitigation',
      'Business continuity'
    ],
    pricing: {
      basic: '3999',
      pro: '6999',
      enterprise: '14999'
    },
    contactInfo: {
      website: '/cybersecurity',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔒',
    href: '/cybersecurity',
    category: 'it'
  },
  {
    id: 'data-engineering',
    title: 'Data Engineering',
    description: 'Build robust data pipelines, warehouses, and real-time streaming architectures at scale.',
    features: [
      'ETL/ELT pipeline design',
      'Real-time streaming',
      'Data warehouse architecture',
      'Data lake & lakehouse',
      'Data quality monitoring'
    ],
    benefits: [
      'Reliable data pipelines',
      'Faster time-to-insight',
      'Reduced data quality issues',
      'Scalable data architecture'
    ],
    pricing: {
      basic: '2499',
      pro: '4999',
      enterprise: '9999'
    },
    contactInfo: {
      website: '/it-services/data-engineering',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔗',
    href: '/it-services/data-engineering',
    popular: true,
    category: 'data'
  },
  {
    id: 'api-development',
    title: 'API Development & Integration',
    description: 'Design and build high-performance APIs that connect systems and power digital products.',
    features: [
      'RESTful API design',
      'GraphQL implementation',
      'API gateway management',
      'Third-party integration',
      'Webhook & event systems'
    ],
    benefits: [
      'Faster integrations',
      'Reusable API patterns',
      'Improved reliability',
      'Enterprise-grade security'
    ],
    pricing: {
      basic: '1999',
      pro: '3999',
      enterprise: '8999'
    },
    contactInfo: {
      website: '/it-services/api-development',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '🔌',
    href: '/it-services/api-development',
    category: 'it'
  },
  {
    id: 'mobile-development',
    title: 'Mobile App Development',
    description: 'Cross-platform and native mobile apps with AI-powered features and offline-first architecture.',
    features: [
      'Cross-platform (React Native/Flutter)',
      'Native iOS & Android',
      'Offline-first architecture',
      'AI-powered features',
      'Push notifications & engagement'
    ],
    benefits: [
      'Faster time-to-market',
      'Native performance',
      'Reliable offline experiences',
      'AI-powered personalization'
    ],
    pricing: {
      basic: '4999',
      pro: '9999',
      enterprise: '19999'
    },
    contactInfo: {
      website: '/it-services/mobile-development',
      email: 'commercial@ziontechgroup.com',
      phone: '+1 302 464 0950'
    },
    icon: '📱',
    href: '/it-services/mobile-development',
    popular: true,
    category: 'it'
  }
];

// Add itSolutions as alias for itServices
export const itSolutions = itServices;

export const allServices: Service[] = [...aiServices, ...itServices];
// Export as servicesData for backward compatibility
export const servicesData = {
  aiServices,
  itServices,
  itSolutions,
  allServices
}
export const getServiceById = (id: string): Service | undefined => {
  return allServices.find(service => service.id === id);
}
export const getServicesByCategory = (category: Service['category']): Service[] => {
  return allServices.filter(service => service.category === category);
}
export const getPopularServices = (): Service[] => {
  return allServices.filter(service => service.popular);
}