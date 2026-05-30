const fs = require('fs');

// Read existing services
const servicesPath = 'app/data/servicesData.json';
const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

// Contact information
const contactInfo = {
  phone: '+1 302 464 0950',
  email: 'kleber@ziontechgroup.com',
  address: '364 E Main St STE 1008, Middletown DE 19709'
};

// New services for V276-V280
const newServices = [
  // V276 Email Localization
  {
    id: 'email-localization-engine-v276',
    name: 'Email Localization Engine V276',
    description: 'Automatically translate emails to recipient preferred languages with cultural context adaptation and locale-specific formatting',
    category: 'email-intelligence',
    price: 199,
    icon: '🌐',
    features: ['Multi-language translation', 'Cultural context adaptation', 'Locale-specific formatting', 'Reply-all enforcement']
  },
  {
    id: 'multilingual-translation-service',
    name: 'Multilingual Translation Service',
    description: 'Professional translation services for 100+ languages with AI-powered accuracy and human review',
    category: 'ai',
    price: 149,
    icon: '🗣️',
    features: ['100+ languages', 'AI + human review', 'Industry-specific terminology', 'Fast turnaround']
  },
  {
    id: 'cultural-adaptation-platform',
    name: 'Cultural Adaptation Platform',
    description: 'Adapt content for different cultures with sensitivity analysis and cultural context optimization',
    category: 'ai',
    price: 179,
    icon: '🎭',
    features: ['Cultural sensitivity analysis', 'Context optimization', 'Regional adaptation', 'Bias detection']
  },
  {
    id: 'locale-formatting-suite',
    name: 'Locale Formatting Suite',
    description: 'Automatically format dates, times, numbers, and currencies according to local conventions',
    category: 'automation',
    price: 89,
    icon: '📅',
    features: ['Date/time formatting', 'Number formatting', 'Currency conversion', '150+ locales']
  },
  {
    id: 'global-communication-hub',
    name: 'Global Communication Hub',
    description: 'Unified platform for managing multilingual communications across global teams',
    category: 'micro-saas',
    price: 249,
    icon: '🌍',
    features: ['Team collaboration', 'Language preferences', 'Translation memory', 'Workflow automation']
  },
  
  // V277 Email Template Intelligence
  {
    id: 'email-template-intelligence-v277',
    name: 'Email Template Intelligence V277',
    description: 'AI-powered template suggestions with dynamic content personalization and performance analytics',
    category: 'email-intelligence',
    price: 189,
    icon: '📝',
    features: ['Smart template suggestions', 'Dynamic personalization', 'Performance tracking', 'Reply-all enforcement']
  },
  {
    id: 'dynamic-content-personalization',
    name: 'Dynamic Content Personalization',
    description: 'Automatically personalize email content based on recipient data and behavior',
    category: 'ai',
    price: 159,
    icon: '🎯',
    features: ['Behavior-based personalization', 'Dynamic content blocks', 'A/B testing', 'Performance analytics']
  },
  {
    id: 'template-performance-analytics',
    name: 'Template Performance Analytics',
    description: 'Track and analyze template performance with detailed metrics and optimization insights',
    category: 'data',
    price: 129,
    icon: '📊',
    features: ['Open rate tracking', 'Click-through analysis', 'Conversion metrics', 'Optimization recommendations']
  },
  {
    id: 'smart-template-builder',
    name: 'Smart Template Builder',
    description: 'Drag-and-drop template builder with AI suggestions and responsive design',
    category: 'micro-saas',
    price: 199,
    icon: '🎨',
    features: ['Drag-and-drop editor', 'AI suggestions', 'Responsive design', 'Template library']
  },
  {
    id: 'email-automation-templates',
    name: 'Email Automation Templates',
    description: 'Pre-built automation workflows for common email scenarios',
    category: 'automation',
    price: 119,
    icon: '⚙️',
    features: ['Pre-built workflows', 'Customizable triggers', 'Multi-step sequences', 'Integration support']
  },
  
  // V278 Email Automation Orchestrator
  {
    id: 'email-automation-orchestrator-v278',
    name: 'Email Automation Orchestrator V278',
    description: 'Orchestrate complex email workflows with multi-step automation and conditional logic',
    category: 'email-intelligence',
    price: 299,
    icon: '🔄',
    features: ['Multi-step workflows', 'Conditional logic', 'CRM integration', 'Reply-all enforcement']
  },
  {
    id: 'workflow-automation-platform',
    name: 'Workflow Automation Platform',
    description: 'Build and manage complex business workflows with visual designer',
    category: 'automation',
    price: 399,
    icon: '🔧',
    features: ['Visual workflow designer', 'Conditional branching', 'API integrations', 'Real-time monitoring']
  },
  {
    id: 'conditional-logic-engine',
    name: 'Conditional Logic Engine',
    description: 'Advanced conditional logic for automated decision making',
    category: 'ai',
    price: 179,
    icon: '🧠',
    features: ['Rule-based decisions', 'Multi-condition logic', 'Dynamic variables', 'Decision trees']
  },
  {
    id: 'crm-integration-hub',
    name: 'CRM Integration Hub',
    description: 'Connect email automation with popular CRM systems',
    category: 'integration',
    price: 149,
    icon: '🔗',
    features: ['Salesforce integration', 'HubSpot integration', 'Custom API support', 'Data sync']
  },
  {
    id: 'multi-step-sequencer',
    name: 'Multi-Step Sequencer',
    description: 'Create complex multi-step email sequences with timing controls',
    category: 'automation',
    price: 229,
    icon: '⏱️',
    features: ['Sequential steps', 'Time delays', 'Branching paths', 'Performance tracking']
  },
  
  // V279 Email Design Optimizer
  {
    id: 'email-design-optimizer-v279',
    name: 'Email Design Optimizer V279',
    description: 'AI-powered design optimization for mobile responsiveness and accessibility compliance',
    category: 'email-intelligence',
    price: 219,
    icon: '🎨',
    features: ['Mobile optimization', 'Accessibility compliance', 'Design recommendations', 'Reply-all enforcement']
  },
  {
    id: 'mobile-responsiveness-tester',
    name: 'Mobile Responsiveness Tester',
    description: 'Test and optimize email designs for all mobile devices',
    category: 'testing',
    price: 139,
    icon: '📱',
    features: ['Device simulation', 'Responsive testing', 'Performance metrics', 'Optimization tips']
  },
  {
    id: 'accessibility-compliance-checker',
    name: 'Accessibility Compliance Checker',
    description: 'Ensure emails meet WCAG accessibility standards',
    category: 'compliance',
    price: 169,
    icon: '♿',
    features: ['WCAG compliance', 'Screen reader testing', 'Color contrast analysis', 'Fix recommendations']
  },
  {
    id: 'email-design-analyzer',
    name: 'Email Design Analyzer',
    description: 'Analyze email designs for best practices and optimization opportunities',
    category: 'ai',
    price: 149,
    icon: '🔍',
    features: ['Design analysis', 'Best practice checks', 'Optimization suggestions', 'Performance scoring']
  },
  {
    id: 'responsive-email-builder',
    name: 'Responsive Email Builder',
    description: 'Build responsive emails that look great on all devices',
    category: 'micro-saas',
    price: 189,
    icon: '📧',
    features: ['Responsive templates', 'Drag-and-drop', 'Preview modes', 'Export options']
  },
  
  // V280 Email Predictive Analytics
  {
    id: 'email-predictive-analytics-v280',
    name: 'Email Predictive Analytics V280',
    description: 'Predict email outcomes with ML-powered analytics for open rates, response times, and churn risk',
    category: 'email-intelligence',
    price: 349,
    icon: '📈',
    features: ['Outcome prediction', 'Churn risk detection', 'Revenue attribution', 'Reply-all enforcement']
  },
  {
    id: 'predictive-open-rate-analyzer',
    name: 'Predictive Open Rate Analyzer',
    description: 'Predict email open rates before sending with ML models',
    category: 'ai',
    price: 179,
    icon: '📊',
    features: ['ML predictions', 'Feature analysis', 'Optimization tips', 'Historical comparison']
  },
  {
    id: 'customer-churn-predictor',
    name: 'Customer Churn Predictor',
    description: 'Detect at-risk customers from email patterns and behavior',
    category: 'ai',
    price: 299,
    icon: '⚠️',
    features: ['Churn detection', 'Risk scoring', 'Early warning alerts', 'Retention recommendations']
  },
  {
    id: 'revenue-attribution-platform',
    name: 'Revenue Attribution Platform',
    description: 'Attribute revenue to email campaigns with multi-touch attribution models',
    category: 'data',
    price: 399,
    icon: '💰',
    features: ['Multi-touch attribution', 'Revenue tracking', 'ROI analysis', 'Campaign performance']
  },
  {
    id: 'email-performance-forecaster',
    name: 'Email Performance Forecaster',
    description: 'Forecast email campaign performance with predictive models',
    category: 'ai',
    price: 249,
    icon: '🔮',
    features: ['Performance forecasting', 'Scenario modeling', 'Trend analysis', 'Goal tracking']
  },
  {
    id: 'response-time-optimizer',
    name: 'Response Time Optimizer',
    description: 'Optimize email response times with predictive analytics',
    category: 'automation',
    price: 159,
    icon: '⏰',
    features: ['Response prediction', 'Optimal timing', 'Priority routing', 'Performance tracking']
  }
];

// Add contact info to all new services
newServices.forEach(service => {
  service.contactInfo = contactInfo;
});

// Add new services to existing array
services.push(...newServices);

// Write back to file
fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));

console.log(`✅ Added ${newServices.length} new services. Total: ${services.length}`);
