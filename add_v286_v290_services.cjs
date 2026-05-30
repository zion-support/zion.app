// Add V286-V290 services to servicesData.json
const fs = require('fs');
const path = require('path');

const servicesPath = path.join(__dirname, 'app/data/servicesData.json');
const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

const contactInfo = {
  phone: '+1 302 464 0950',
  email: 'kleber@ziontechgroup.com',
  address: '364 E Main St STE 1008, Middletown DE 19709'
};

const newServices = [
  // V286-V290 Email Intelligence Services
  {
    id: 'v286-language-style-adapter',
    name: 'V286 Language Style Adapter',
    description: 'AI-powered email style adaptation that detects communication preferences and adjusts tone automatically',
    category: 'ai',
    price: 89,
    features: ['Style detection (formal/casual/technical)', 'Tone adaptation', 'Learning from communications', 'Reply-all enforcement'],
    longDescription: 'Advanced AI that analyzes recipient communication patterns and automatically adapts your email style for maximum effectiveness. Learns from successful interactions to improve over time.',
    benefits: ['Increase response rates by 40%', 'Build stronger relationships', 'Professional communication across cultures', 'Save time on email crafting'],
    contactInfo
  },
  {
    id: 'v287-engagement-analytics',
    name: 'V287 Email Engagement Analytics',
    description: 'Comprehensive email performance tracking with A/B testing and optimal send time identification',
    category: 'data',
    price: 129,
    features: ['Open rate tracking', 'Response time analysis', 'A/B testing', 'Optimal send times', 'Reply-all enforcement'],
    longDescription: 'Data-driven email optimization platform that tracks engagement metrics, identifies patterns, and provides actionable insights to improve your email effectiveness.',
    benefits: ['Boost open rates by 35%', 'Optimize send timing', 'Data-backed decisions', 'Continuous improvement'],
    contactInfo
  },
  {
    id: 'v288-security-sentinel',
    name: 'V288 Email Security Sentinel',
    description: 'Enterprise-grade email security with advanced phishing detection and malware protection',
    category: 'security',
    price: 199,
    features: ['Phishing detection', 'Malware scanning', 'SPF/DKIM/DMARC validation', 'Link analysis', 'Safe email reply-all'],
    longDescription: 'Military-grade email security that protects your organization from sophisticated phishing attacks, malware, and social engineering threats with real-time scanning and threat intelligence.',
    benefits: ['Block 99.9% of threats', 'Protect sensitive data', 'Compliance ready', 'Zero-day protection'],
    contactInfo
  },
  {
    id: 'v289-auto-responder-ai',
    name: 'V289 Intelligent Auto-Responder',
    description: 'Context-aware automated email responses with smart escalation for complex inquiries',
    category: 'ai',
    price: 149,
    features: ['Context-aware responses', 'Routine inquiry handling', 'Smart escalation', 'Learning system', 'Reply-all enforcement'],
    longDescription: 'AI-powered auto-responder that understands email context, provides relevant automated responses for routine inquiries, and intelligently escalates complex issues to the right team members.',
    benefits: ['24/7 customer service', 'Reduce response time by 80%', 'Handle 70% of inquiries automatically', 'Improve customer satisfaction'],
    contactInfo
  },
  {
    id: 'v290-performance-predictor',
    name: 'V290 Email Performance Predictor',
    description: 'Pre-send email optimization with success prediction and improvement suggestions',
    category: 'ai',
    price: 159,
    features: ['Success prediction', 'Subject line optimization', 'Content improvement', 'Response forecasting', 'Reply-all enforcement'],
    longDescription: 'Predictive analytics platform that analyzes your email before sending, predicts success metrics, and provides actionable suggestions to maximize engagement and response rates.',
    benefits: ['Predict success with 85% accuracy', 'Improve open rates by 45%', 'Optimize before sending', 'Data-driven email strategy'],
    contactInfo
  },
  
  // Additional Micro SaaS Services
  {
    id: 'smart-meeting-scheduler',
    name: 'Smart Meeting Scheduler Pro',
    description: 'AI-powered meeting scheduling that finds optimal times across multiple timezones',
    category: 'micro-saas',
    price: 49,
    features: ['Multi-timezone support', 'Calendar integration', 'Conflict detection', 'Automated reminders', 'Reply-all for meeting invites'],
    longDescription: 'Intelligent scheduling platform that analyzes participant availability across timezones, suggests optimal meeting times, and handles all the coordination automatically.',
    benefits: ['Save 5+ hours per week', 'Eliminate scheduling conflicts', 'Global team coordination', 'Professional meeting experience'],
    contactInfo
  },
  {
    id: 'document-signature-hub',
    name: 'Document Signature Hub',
    description: 'Secure electronic signature platform with workflow automation and compliance tracking',
    category: 'micro-saas',
    price: 79,
    features: ['E-signatures', 'Workflow automation', 'Audit trails', 'Template library', 'Multi-party signing'],
    longDescription: 'Enterprise-grade electronic signature solution with automated workflows, compliance tracking, and seamless integration with your existing document management systems.',
    benefits: ['Close deals 10x faster', 'Legally binding signatures', 'Complete audit trails', 'Reduce paper costs by 90%'],
    contactInfo
  },
  {
    id: 'team-knowledge-base',
    name: 'Team Knowledge Base AI',
    description: 'AI-powered knowledge management that learns from team communications',
    category: 'micro-saas',
    price: 99,
    features: ['Auto-knowledge extraction', 'Smart search', 'Team collaboration', 'Version control', 'Email integration'],
    longDescription: 'Intelligent knowledge base that automatically extracts insights from team emails, documents, and conversations, making institutional knowledge searchable and accessible.',
    benefits: ['Reduce onboarding time by 60%', 'Prevent knowledge loss', 'Improve team productivity', 'Single source of truth'],
    contactInfo
  },
  
  // Additional IT Services
  {
    id: 'cloud-infrastructure-monitor',
    name: 'Cloud Infrastructure Monitor Pro',
    description: 'Comprehensive cloud monitoring with predictive alerts and cost optimization',
    category: 'it',
    price: 299,
    features: ['Multi-cloud support', 'Predictive alerts', 'Cost optimization', 'Performance monitoring', 'Security scanning'],
    longDescription: 'Enterprise cloud monitoring platform that provides real-time visibility across AWS, Azure, and GCP with AI-powered predictive alerts and automated cost optimization.',
    benefits: ['Reduce cloud costs by 30%', 'Prevent outages', 'Optimize performance', '24/7 monitoring'],
    contactInfo
  },
  {
    id: 'devops-automation-suite',
    name: 'DevOps Automation Suite',
    description: 'End-to-end DevOps automation with CI/CD pipelines and infrastructure as code',
    category: 'it',
    price: 399,
    features: ['CI/CD pipelines', 'Infrastructure as Code', 'Automated testing', 'Deployment automation', 'Monitoring integration'],
    longDescription: 'Complete DevOps automation platform that streamlines your entire software delivery lifecycle from code commit to production deployment with built-in security and compliance.',
    benefits: ['Deploy 100x faster', 'Reduce errors by 95%', 'Automated compliance', 'Developer productivity boost'],
    contactInfo
  },
  {
    id: 'network-security-ops',
    name: 'Network Security Operations Center',
    description: '24/7 network security monitoring with threat detection and incident response',
    category: 'it',
    price: 599,
    features: ['24/7 monitoring', 'Threat detection', 'Incident response', 'Vulnerability scanning', 'Compliance reporting'],
    longDescription: 'Managed security operations center that provides continuous network monitoring, advanced threat detection, and rapid incident response to protect your critical infrastructure.',
    benefits: ['Detect threats in minutes', 'Expert security team', 'Compliance ready', 'Peace of mind'],
    contactInfo
  },
  
  // Additional AI Services
  {
    id: 'ai-content-generator',
    name: 'AI Content Generator Pro',
    description: 'AI-powered content creation for marketing, documentation, and communications',
    category: 'ai',
    price: 179,
    features: ['Blog posts', 'Marketing copy', 'Documentation', 'Email campaigns', 'Multi-language support'],
    longDescription: 'Advanced AI content generation platform that creates high-quality, engaging content for any purpose while maintaining your brand voice and style guidelines.',
    benefits: ['Create content 10x faster', 'Consistent brand voice', 'SEO-optimized', 'Multi-format output'],
    contactInfo
  },
  {
    id: 'ai-data-analyst',
    name: 'AI Data Analyst',
    description: 'Automated data analysis and insights generation with natural language queries',
    category: 'ai',
    price: 249,
    features: ['Natural language queries', 'Automated insights', 'Data visualization', 'Predictive analytics', 'Report generation'],
    longDescription: 'AI-powered data analysis platform that transforms raw data into actionable insights through natural language queries, automated reporting, and predictive analytics.',
    benefits: ['Make data-driven decisions', 'Save analyst time', 'Discover hidden patterns', 'Automated reporting'],
    contactInfo
  },
  {
    id: 'ai-customer-support',
    name: 'AI Customer Support Assistant',
    description: 'Intelligent customer support with ticket routing and automated resolution',
    category: 'ai',
    price: 199,
    features: ['Ticket routing', 'Auto-resolution', 'Sentiment analysis', 'Knowledge base integration', 'Multi-channel support'],
    longDescription: 'AI-powered customer support platform that automatically routes tickets, resolves common issues, and provides intelligent assistance across all support channels.',
    benefits: ['Resolve 60% of tickets automatically', 'Reduce response time', 'Improve CSAT scores', '24/7 support coverage'],
    contactInfo
  },
  
  // More Micro SaaS
  {
    id: 'invoice-automation',
    name: 'Invoice Automation Pro',
    description: 'Automated invoicing with smart payment reminders and accounting integration',
    category: 'micro-saas',
    price: 59,
    features: ['Auto-invoicing', 'Payment reminders', 'Accounting sync', 'Multi-currency', 'Tax calculation'],
    longDescription: 'Streamline your billing process with automated invoice generation, intelligent payment reminders, and seamless integration with popular accounting platforms.',
    benefits: ['Get paid 2x faster', 'Reduce admin time', 'Improve cash flow', 'Professional invoices'],
    contactInfo
  },
  {
    id: 'project-time-tracker',
    name: 'Project Time Tracker AI',
    description: 'AI-powered time tracking with automatic categorization and project insights',
    category: 'micro-saas',
    price: 39,
    features: ['Auto time tracking', 'Project categorization', 'Productivity insights', 'Team analytics', 'Billing integration'],
    longDescription: 'Intelligent time tracking that automatically categorizes your work, provides productivity insights, and generates accurate billing reports for clients.',
    benefits: ['Track time effortlessly', 'Bill accurately', 'Improve productivity', 'Client transparency'],
    contactInfo
  },
  {
    id: 'social-media-manager',
    name: 'Social Media Manager AI',
    description: 'AI-powered social media management with content scheduling and analytics',
    category: 'micro-saas',
    price: 89,
    features: ['Content scheduling', 'AI content generation', 'Analytics dashboard', 'Multi-platform', 'Engagement tracking'],
    longDescription: 'Comprehensive social media management platform with AI-powered content creation, intelligent scheduling, and detailed analytics across all major platforms.',
    benefits: ['Grow audience 3x faster', 'Save 10+ hours per week', 'Data-driven strategy', 'Consistent posting'],
    contactInfo
  },
  
  // More IT Services
  {
    id: 'database-optimization',
    name: 'Database Optimization Service',
    description: 'Expert database performance tuning and optimization for MySQL, PostgreSQL, and MongoDB',
    category: 'it',
    price: 449,
    features: ['Performance tuning', 'Query optimization', 'Index analysis', 'Scaling strategy', '24/7 monitoring'],
    longDescription: 'Professional database optimization service that improves query performance, reduces latency, and ensures your databases scale efficiently with your business growth.',
    benefits: ['10x faster queries', 'Reduce infrastructure costs', 'Expert DBA support', 'Proactive monitoring'],
    contactInfo
  },
  {
    id: 'api-management-platform',
    name: 'API Management Platform',
    description: 'Complete API lifecycle management with security, analytics, and developer portal',
    category: 'it',
    price: 349,
    features: ['API gateway', 'Security policies', 'Usage analytics', 'Developer portal', 'Rate limiting'],
    longDescription: 'Enterprise API management platform that provides complete control over your API ecosystem with built-in security, comprehensive analytics, and a self-service developer portal.',
    benefits: ['Monetize your APIs', 'Secure API access', 'Developer experience', 'Usage insights'],
    contactInfo
  },
  
  // More AI Services
  {
    id: 'ai-video-analytics',
    name: 'AI Video Analytics Platform',
    description: 'Computer vision and video analytics for security, retail, and manufacturing',
    category: 'ai',
    price: 499,
    features: ['Object detection', 'People counting', 'Behavior analysis', 'Anomaly detection', 'Real-time alerts'],
    longDescription: 'Advanced video analytics platform powered by computer vision AI that provides real-time insights for security monitoring, retail optimization, and manufacturing quality control.',
    benefits: ['Improve security', 'Optimize operations', 'Reduce losses', 'Data-driven decisions'],
    contactInfo
  },
  {
    id: 'ai-translation-service',
    name: 'AI Translation Service Pro',
    description: 'Professional AI translation with human review for 100+ languages',
    category: 'ai',
    price: 129,
    features: ['100+ languages', 'Human review', 'Industry terminology', 'API access', 'Batch processing'],
    longDescription: 'Professional translation service combining AI technology with human expertise to deliver accurate, context-aware translations for business documents, websites, and applications.',
    benefits: ['Global reach', 'Professional quality', 'Fast turnaround', 'Cost-effective'],
    contactInfo
  },
  
  // Additional services to reach 27+
  {
    id: 'compliance-management',
    name: 'Compliance Management Platform',
    description: 'Automated compliance tracking for GDPR, HIPAA, SOC 2, and more',
    category: 'micro-saas',
    price: 299,
    features: ['Multi-framework support', 'Automated audits', 'Evidence collection', 'Risk assessment', 'Continuous monitoring'],
    longDescription: 'Comprehensive compliance management platform that automates evidence collection, tracks requirements across multiple frameworks, and provides continuous compliance monitoring.',
    benefits: ['Achieve compliance 5x faster', 'Reduce audit costs', 'Continuous compliance', 'Risk mitigation'],
    contactInfo
  },
  {
    id: 'hr-automation-suite',
    name: 'HR Automation Suite',
    description: 'Complete HR workflow automation from hiring to offboarding',
    category: 'micro-saas',
    price: 199,
    features: ['Applicant tracking', 'Onboarding automation', 'Performance reviews', 'Time-off management', 'Document management'],
    longDescription: 'End-to-end HR automation platform that streamlines every aspect of human resources from recruitment and onboarding to performance management and offboarding.',
    benefits: ['Reduce HR admin by 70%', 'Improve employee experience', 'Compliance automation', 'Data-driven HR'],
    contactInfo
  },
  {
    id: 'sales-pipeline-optimizer',
    name: 'Sales Pipeline Optimizer AI',
    description: 'AI-powered sales pipeline management with predictive analytics',
    category: 'ai',
    price: 279,
    features: ['Pipeline analytics', 'Deal prediction', 'Activity tracking', 'Email integration', 'Revenue forecasting'],
    longDescription: 'Intelligent sales pipeline management that uses AI to predict deal outcomes, identify at-risk opportunities, and provide actionable insights to close more deals.',
    benefits: ['Close 40% more deals', 'Accurate forecasting', 'Pipeline visibility', 'Sales team productivity'],
    contactInfo
  },
  {
    id: 'backup-disaster-recovery',
    name: 'Backup & Disaster Recovery',
    description: 'Enterprise backup and disaster recovery with automated failover',
    category: 'it',
    price: 499,
    features: ['Automated backups', 'Disaster recovery', 'Failover automation', 'Data encryption', 'Compliance ready'],
    longDescription: 'Enterprise-grade backup and disaster recovery solution with automated failover, ensuring business continuity and data protection with minimal RTO and RPO.',
    benefits: ['99.99% data protection', 'Fast recovery', 'Compliance ready', 'Peace of mind'],
    contactInfo
  },
  {
    id: 'email-marketing-automation',
    name: 'Email Marketing Automation Pro',
    description: 'Advanced email marketing with AI-powered personalization and analytics',
    category: 'ai',
    price: 149,
    features: ['Email campaigns', 'AI personalization', 'A/B testing', 'Analytics', 'Automation workflows'],
    longDescription: 'Powerful email marketing platform with AI-driven personalization, advanced segmentation, and comprehensive analytics to maximize your email marketing ROI.',
    benefits: ['Increase conversions by 50%', 'Personalized at scale', 'Data-driven campaigns', 'Automated workflows'],
    contactInfo
  },
  {
    id: 'customer-feedback-platform',
    name: 'Customer Feedback Platform',
    description: 'Collect and analyze customer feedback with AI-powered insights',
    category: 'micro-saas',
    price: 119,
    features: ['Survey creation', 'NPS tracking', 'Sentiment analysis', 'Action items', 'Integration hub'],
    longDescription: 'Comprehensive customer feedback platform that collects, analyzes, and acts on customer insights with AI-powered sentiment analysis and automated action item generation.',
    benefits: ['Improve customer satisfaction', 'Data-driven improvements', 'Reduce churn', 'Customer-centric culture'],
    contactInfo
  },
  {
    id: 'it-asset-management',
    name: 'IT Asset Management Pro',
    description: 'Complete IT asset lifecycle management with automated discovery',
    category: 'it',
    price: 249,
    features: ['Asset discovery', 'Lifecycle management', 'License tracking', 'Cost optimization', 'Compliance reporting'],
    longDescription: 'Enterprise IT asset management solution that provides complete visibility into your IT infrastructure with automated discovery, lifecycle tracking, and cost optimization.',
    benefits: ['Reduce IT costs by 25%', 'License compliance', 'Asset visibility', 'Optimize spending'],
    contactInfo
  }
];

// Add new services to existing array
services.push(...newServices);

// Write back to file
fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));

console.log(`Added ${newServices.length} new services. Total: ${services.length} services`);
