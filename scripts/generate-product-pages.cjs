/**
 * Generates real content for all stub product pages using ProductPageLayout.
 * Run with: node scripts/generate-product-pages.cjs
 */
const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'app');

function isStubPage(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return (
    content.includes('Advanced solutions powered by cutting-edge technology') ||
    content.includes('Advanced solutions powered by cutting-edge')
  );
}

function walkDir(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', '.next', '.git'].includes(entry.name)) {
      files.push(...walkDir(fullPath));
    } else if (entry.name === 'page.tsx') {
      files.push(fullPath);
    }
  }
  return files;
}

function slugToTitle(slug) {
  return slug
    .replace(/^\//, '')
    .split('/')
    .pop()
    .replace(/-/g, ' ')
    .replace(/\bai\b/gi, 'AI')
    .replace(/\bml\b/gi, 'ML')
    .replace(/\bnlp\b/gi, 'NLP')
    .replace(/\biot\b/gi, 'IoT')
    .replace(/\bcrm\b/gi, 'CRM')
    .replace(/\bseo\b/gi, 'SEO')
    .replace(/\bapi\b/gi, 'API')
    .replace(/\bhr\b/gi, 'HR')
    .replace(/\bvr\b/gi, 'VR')
    .replace(/\bar\b/gi, 'AR')
    .replace(/\bci\b/gi, 'CI')
    .replace(/\bcd\b/gi, 'CD')
    .replace(/\bsla\b/gi, 'SLA')
    .replace(/\bgdpr\b/gi, 'GDPR')
    .replace(/\bsaas\b/gi, 'SaaS')
    .replace(/\bdevops\b/gi, 'DevOps')
    .replace(/\bcicd\b/gi, 'CI/CD')
    .replace(/\bpro\b/gi, 'Pro')
    .replace(/\bweb3\b/gi, 'Web3')
    .replace(/\bBI\b/gi, 'BI')
    .replace(/\bit\b/gi, 'IT')
    .replace(/\b5g\b/gi, '5G')
    .replace(/\b3d\b/gi, '3D')
    .replace(/^zion /i, 'Zion ')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1));
}

function categorize(slug) {
  const s = slug.toLowerCase();
  if (s.includes('security') || s.includes('cybersecurity') || s.includes('penetration') || s.includes('fraud') || s.includes('shield') || s.includes('compliance') || s.includes('gdpr') || s.includes('audit')) return { category: 'Security & Compliance', icon: '🛡️' };
  if (s.includes('devops') || s.includes('ci-cd') || s.includes('cicd') || s.includes('container') || s.includes('serverless') || s.includes('infrastructure') || s.includes('cloud') || s.includes('server') || s.includes('backup') || s.includes('disaster')) return { category: 'Cloud & Infrastructure', icon: '☁️' };
  if (s.includes('code') || s.includes('api') || s.includes('developer') || s.includes('web-dev') || s.includes('mobile-app') || s.includes('mobile-dev') || s.includes('software') || s.includes('low-code') || s.includes('landing-page')) return { category: 'Engineering & Development', icon: '⚙️' };
  if (s.includes('marketing') || s.includes('lead') || s.includes('social') || s.includes('seo') || s.includes('content') || s.includes('email') || s.includes('crm') || s.includes('sales') || s.includes('advertising')) return { category: 'Growth & Marketing', icon: '📈' };
  if (s.includes('analytics') || s.includes('data') || s.includes('database') || s.includes('visualization') || s.includes('intelligence') || s.includes('dashboard') || s.includes('monitor') || s.includes('performance') || s.includes('tracking')) return { category: 'Data & Analytics', icon: '📊' };
  if (s.includes('automation') || s.includes('workflow') || s.includes('process') || s.includes('robotic') || s.includes('scheduler') || s.includes('task')) return { category: 'Automation & Workflows', icon: '🔄' };
  if (s.includes('document') || s.includes('invoice') || s.includes('contract') || s.includes('legal') || s.includes('expense') || s.includes('inventory') || s.includes('project')) return { category: 'Operations & Productivity', icon: '📋' };
  if (s.includes('healthcare') || s.includes('medical') || s.includes('health') || s.includes('fitness')) return { category: 'Healthcare & Life Sciences', icon: '🏥' };
  if (s.includes('financial') || s.includes('fintech') || s.includes('investment') || s.includes('stock') || s.includes('insurance') || s.includes('banking') || s.includes('price')) return { category: 'Finance & Risk', icon: '💰' };
  if (s.includes('blockchain') || s.includes('web3') || s.includes('smart-contract')) return { category: 'Blockchain & Web3', icon: '⛓️' };
  if (s.includes('iot') || s.includes('edge') || s.includes('5g') || s.includes('smart-city') || s.includes('smart-home')) return { category: 'IoT & Edge Computing', icon: '📡' };
  if (s.includes('voice') || s.includes('speech') || s.includes('nlp') || s.includes('translation') || s.includes('translator') || s.includes('writing') || s.includes('meeting') || s.includes('chat')) return { category: 'Language & Communication', icon: '🗣️' };
  if (s.includes('image') || s.includes('video') || s.includes('vision') || s.includes('3d') || s.includes('ar-vr') || s.includes('augmented') || s.includes('virtual') || s.includes('holographic') || s.includes('logo') || s.includes('fashion') || s.includes('music')) return { category: 'Media & Creative', icon: '🎨' };
  if (s.includes('quantum') || s.includes('space') || s.includes('robotics') || s.includes('autonomous') || s.includes('neural') || s.includes('telepathic') || s.includes('digital-twin')) return { category: 'Emerging Technology', icon: '🚀' };
  if (s.includes('real-estate') || s.includes('property') || s.includes('ecommerce') || s.includes('supply-chain') || s.includes('manufacturing') || s.includes('transportation') || s.includes('learning') || s.includes('training') || s.includes('education')) return { category: 'Industry Solutions', icon: '🏢' };
  if (s.includes('hr') || s.includes('recruit') || s.includes('team') || s.includes('career') || s.includes('employee')) return { category: 'HR & Talent', icon: '👥' };
  if (s.includes('support') || s.includes('help') || s.includes('faq') || s.includes('community') || s.includes('customer')) return { category: 'Customer Experience', icon: '💬' };
  if (s.includes('micro-saas')) return { category: 'Micro SaaS', icon: '🧩' };
  if (s.includes('it-service') || s.includes('managed') || s.includes('consulting') || s.includes('it-support') || s.includes('it-solution') || s.includes('it-training') || s.includes('it-project')) return { category: 'IT Services', icon: '🖥️' };
  if (s.includes('network')) return { category: 'Networking', icon: '🌐' };
  if (s.includes('password')) return { category: 'Security & Compliance', icon: '🔑' };
  if (s.includes('term') || s.includes('privacy') || s.includes('cookie') || s.includes('sla')) return { category: 'Legal & Policies', icon: '📜' };
  if (s.includes('partner') || s.includes('investor') || s.includes('press') || s.includes('news') || s.includes('status') || s.includes('demo') || s.includes('resource') || s.includes('docs') || s.includes('sitemap') || s.includes('blog') || s.includes('test')) return { category: 'Company & Resources', icon: '🏛️' };
  return { category: 'AI Solutions', icon: '✨' };
}

function generateDescription(title, category) {
  const descs = {
    'Security & Compliance': `${title} provides enterprise-grade security controls, continuous monitoring, and compliance automation. Reduce risk exposure and accelerate audit readiness with AI-driven threat detection and policy enforcement.`,
    'Cloud & Infrastructure': `${title} delivers scalable cloud architecture, automated provisioning, and resilient infrastructure management. Move workloads to production faster with battle-tested deployment patterns and cost optimization.`,
    'Engineering & Development': `${title} accelerates software delivery with intelligent tooling, automated code analysis, and streamlined development workflows. Ship higher-quality code faster while reducing technical debt.`,
    'Growth & Marketing': `${title} empowers marketing and revenue teams with AI-driven campaign optimization, lead intelligence, and personalized outreach automation. Turn data into pipeline and pipeline into revenue.`,
    'Data & Analytics': `${title} transforms raw data into actionable intelligence with real-time dashboards, automated reporting, and predictive models. Make faster, more confident decisions backed by production-grade analytics.`,
    'Automation & Workflows': `${title} eliminates manual bottlenecks with intelligent process automation, event-driven orchestration, and cross-system integration. Reclaim operational capacity and reduce human error.`,
    'Operations & Productivity': `${title} streamlines day-to-day operations with smart document handling, task coordination, and automated business processes. Free your team to focus on strategic work.`,
    'Healthcare & Life Sciences': `${title} brings AI-powered intelligence to healthcare workflows, enabling faster diagnostics, better patient outcomes, and streamlined administrative processes while maintaining strict compliance.`,
    'Finance & Risk': `${title} applies AI to financial workflows for smarter forecasting, risk assessment, and operational efficiency. Automate routine analysis and surface insights that drive better financial decisions.`,
    'Blockchain & Web3': `${title} provides secure, transparent, and decentralized solutions for modern businesses. Build trust through immutable records, smart contract automation, and distributed ledger technology.`,
    'IoT & Edge Computing': `${title} connects physical operations with intelligent digital systems. Process sensor data at the edge, automate responses in real time, and gain visibility across distributed environments.`,
    'Language & Communication': `${title} enhances team communication and content workflows with AI-powered language processing, automated transcription, and intelligent translation across channels and languages.`,
    'Media & Creative': `${title} accelerates creative production with AI-assisted design, video generation, and content creation tools. Produce high-quality visual assets faster without sacrificing brand consistency.`,
    'Emerging Technology': `${title} explores the frontier of computing with advanced AI, simulation, and next-generation platforms. Position your team at the cutting edge while maintaining practical delivery standards.`,
    'Industry Solutions': `${title} delivers purpose-built AI solutions tailored to specific industry requirements. Accelerate digital transformation with domain-specific workflows, compliance controls, and operational intelligence.`,
    'HR & Talent': `${title} modernizes talent operations with AI-powered sourcing, screening, and workforce analytics. Hire faster, develop talent effectively, and make data-driven people decisions.`,
    'Customer Experience': `${title} elevates customer interactions with AI-driven support, intelligent routing, and personalized engagement across every touchpoint. Increase satisfaction while reducing response times.`,
    'Micro SaaS': `${title} offers a focused, lightweight SaaS solution that solves one problem exceptionally well. Deploy quickly, integrate easily, and scale as your needs grow without unnecessary complexity.`,
    'IT Services': `${title} provides expert IT management, strategic consulting, and technical support services. Keep your technology infrastructure running smoothly while focusing on business growth.`,
    'Networking': `${title} designs and manages robust network infrastructure for reliable connectivity, security, and performance. Build the foundation your applications and teams depend on.`,
    'Legal & Policies': `Information about our policies, terms, and legal commitments. We are transparent about how we operate, protect your data, and ensure fair business practices.`,
    'Company & Resources': `${title} provides resources, documentation, and information to help you get the most from Zion Tech Group services and products.`,
    'AI Solutions': `${title} combines AI intelligence with practical engineering to solve real business challenges. Deploy production-ready capabilities that integrate with your existing systems and deliver measurable results.`,
  };
  return descs[category] || descs['AI Solutions'];
}

function generateFeatures(title, category) {
  const featuresByCategory = {
    'Security & Compliance': [
      { title: 'Continuous Threat Monitoring', description: 'Real-time scanning and alerting across your attack surface with AI-powered anomaly detection and automated incident classification.' },
      { title: 'Compliance Automation', description: 'Automated evidence collection, policy enforcement, and audit trail generation for SOC 2, GDPR, HIPAA, and other frameworks.' },
      { title: 'Vulnerability Assessment', description: 'Systematic identification and prioritization of security weaknesses with risk-scored remediation recommendations.' },
      { title: 'Access Control Management', description: 'Fine-grained role-based access policies with continuous verification and least-privilege enforcement across systems.' },
      { title: 'Incident Response Playbooks', description: 'Pre-built and customizable response workflows that reduce mean time to resolution for security events.' },
      { title: 'Security Reporting', description: 'Executive dashboards and detailed technical reports that keep stakeholders informed and auditors satisfied.' },
    ],
    'Cloud & Infrastructure': [
      { title: 'Automated Provisioning', description: 'Infrastructure as Code templates that provision, configure, and validate cloud resources in minutes instead of days.' },
      { title: 'Cost Optimization', description: 'AI-driven analysis of resource utilization with actionable recommendations to reduce cloud spend without impacting performance.' },
      { title: 'High Availability Architecture', description: 'Multi-region deployment patterns with automatic failover, health checks, and self-healing capabilities.' },
      { title: 'Performance Monitoring', description: 'Real-time observability across compute, storage, and network layers with intelligent alerting and capacity forecasting.' },
      { title: 'Migration Planning', description: 'Structured assessment and migration frameworks that minimize downtime and risk during cloud transitions.' },
      { title: 'Security Hardening', description: 'Automated security baselines, encryption management, and compliance controls built into every deployment.' },
    ],
    'Engineering & Development': [
      { title: 'Intelligent Code Analysis', description: 'AI-powered static analysis that identifies bugs, security vulnerabilities, and performance issues before they reach production.' },
      { title: 'Automated Testing', description: 'Generate and run comprehensive test suites with intelligent coverage analysis and regression detection.' },
      { title: 'Development Acceleration', description: 'AI-assisted coding, refactoring suggestions, and boilerplate generation that speeds up delivery cycles.' },
      { title: 'Code Quality Metrics', description: 'Track technical debt, maintainability scores, and team velocity with actionable improvement recommendations.' },
      { title: 'CI/CD Integration', description: 'Seamless pipeline integration with automated quality gates, deployment verification, and rollback capabilities.' },
      { title: 'Documentation Generation', description: 'Automatically generate and maintain API docs, architecture diagrams, and onboarding guides from your codebase.' },
    ],
    'Growth & Marketing': [
      { title: 'Campaign Intelligence', description: 'AI-optimized campaign creation, A/B testing, and performance analysis that maximizes ROI across channels.' },
      { title: 'Lead Scoring & Routing', description: 'Behavioral and firmographic scoring models that prioritize high-intent prospects and route them to the right teams.' },
      { title: 'Personalization Engine', description: 'Dynamic content personalization across email, web, and ad channels based on user behavior and preferences.' },
      { title: 'Attribution Modeling', description: 'Multi-touch attribution that accurately maps the customer journey and identifies your highest-performing channels.' },
      { title: 'Audience Segmentation', description: 'AI-driven segmentation that groups prospects by behavior, intent signals, and lifecycle stage for targeted outreach.' },
      { title: 'Performance Analytics', description: 'Real-time dashboards tracking conversion rates, CAC, LTV, and pipeline velocity with predictive trend analysis.' },
    ],
    'Data & Analytics': [
      { title: 'Real-Time Dashboards', description: 'Live operational dashboards that surface key metrics, anomalies, and trends as they happen across your business.' },
      { title: 'Predictive Models', description: 'Machine learning models trained on your data to forecast outcomes, identify risks, and surface hidden opportunities.' },
      { title: 'Data Pipeline Automation', description: 'Automated ETL workflows that clean, transform, and load data from multiple sources into a unified analytics layer.' },
      { title: 'Self-Service Reporting', description: 'Empower teams to build their own reports and explore data with intuitive query builders and visualization tools.' },
      { title: 'Data Quality Monitoring', description: 'Continuous validation of data accuracy, completeness, and freshness with automated alerts on quality degradation.' },
      { title: 'Cross-System Integration', description: 'Connect data from CRM, ERP, marketing tools, and operational systems into a single source of truth.' },
    ],
    'Automation & Workflows': [
      { title: 'Visual Workflow Builder', description: 'Design complex automation flows with a drag-and-drop interface that connects triggers, conditions, and actions across systems.' },
      { title: 'Event-Driven Orchestration', description: 'React to business events in real time with intelligent routing, parallel processing, and conditional branching.' },
      { title: 'Error Handling & Recovery', description: 'Built-in retry logic, dead-letter queues, and self-healing mechanisms that keep workflows running reliably.' },
      { title: 'Cross-Platform Integration', description: 'Pre-built connectors for popular business tools with webhook support and custom API integration capabilities.' },
      { title: 'Audit Trail & Compliance', description: 'Full execution logging with immutable audit trails for regulatory compliance and operational debugging.' },
      { title: 'Performance Optimization', description: 'Analytics on workflow execution times, bottlenecks, and throughput with AI-suggested improvements.' },
    ],
    'Operations & Productivity': [
      { title: 'Smart Document Processing', description: 'Extract structured data from invoices, contracts, and forms using AI with high accuracy and configurable validation rules.' },
      { title: 'Task Coordination', description: 'Intelligent task assignment, priority management, and deadline tracking that keeps distributed teams aligned.' },
      { title: 'Process Standardization', description: 'Template-driven workflows that enforce best practices and reduce variability across operational processes.' },
      { title: 'Approval Automation', description: 'Configurable approval chains with escalation rules, SLA tracking, and mobile-friendly review interfaces.' },
      { title: 'Resource Planning', description: 'Capacity planning and resource allocation tools that optimize team utilization and project timelines.' },
      { title: 'Operational Reporting', description: 'Automated reports on throughput, cycle times, and quality metrics with trend analysis and forecasting.' },
    ],
  };

  const defaultFeatures = [
    { title: 'Production-Ready Architecture', description: 'Enterprise-grade infrastructure with high availability, horizontal scaling, and comprehensive monitoring built in from day one.' },
    { title: 'Intelligent Automation', description: 'AI-powered workflows that learn from patterns, adapt to changing conditions, and reduce manual intervention over time.' },
    { title: 'Seamless Integration', description: 'Connect with your existing tools, APIs, and data sources through pre-built connectors and flexible webhook support.' },
    { title: 'Real-Time Analytics', description: 'Live dashboards and reporting that give you instant visibility into performance, usage, and business impact.' },
    { title: 'Security & Compliance', description: 'Built-in security controls, encryption at rest and in transit, and compliance-ready audit trails for enterprise environments.' },
    { title: 'Customizable Workflows', description: 'Tailor processes, rules, and interfaces to match your specific business requirements without custom development.' },
  ];

  return featuresByCategory[category] || defaultFeatures;
}

function generateUseCases(title, category) {
  const useCasesByCategory = {
    'Security & Compliance': [
      { title: 'Regulatory Compliance', description: 'Automate evidence collection and policy enforcement to pass SOC 2, GDPR, and industry-specific audits faster.', icon: '📋' },
      { title: 'Threat Detection', description: 'Identify and respond to security incidents in real time with AI-powered monitoring and automated response playbooks.', icon: '🔍' },
      { title: 'Risk Assessment', description: 'Continuously evaluate your security posture and prioritize remediation based on actual business risk.', icon: '⚠️' },
    ],
    'Cloud & Infrastructure': [
      { title: 'Cloud Migration', description: 'Move workloads to the cloud with structured planning, minimal downtime, and validated deployment patterns.', icon: '🚀' },
      { title: 'Cost Reduction', description: 'Identify over-provisioned resources and optimize spending with data-driven rightsizing recommendations.', icon: '💰' },
      { title: 'Disaster Recovery', description: 'Build resilient architectures with automated failover, backup verification, and recovery testing.', icon: '🔄' },
    ],
    'Engineering & Development': [
      { title: 'Code Quality Improvement', description: 'Systematically reduce bugs and tech debt with automated review, testing, and refactoring recommendations.', icon: '✨' },
      { title: 'Faster Release Cycles', description: 'Accelerate delivery with automated pipelines, quality gates, and deployment verification.', icon: '⚡' },
      { title: 'Team Onboarding', description: 'Get new developers productive faster with auto-generated docs, architecture guides, and coding standards.', icon: '👥' },
    ],
    'Growth & Marketing': [
      { title: 'Pipeline Acceleration', description: 'Score and route leads automatically so your sales team focuses on the highest-value opportunities.', icon: '🎯' },
      { title: 'Campaign Optimization', description: 'Test, iterate, and scale marketing campaigns with AI-driven insights and automated performance tuning.', icon: '📊' },
      { title: 'Customer Retention', description: 'Identify churn risk early and trigger personalized re-engagement campaigns before customers leave.', icon: '🤝' },
    ],
    'Data & Analytics': [
      { title: 'Executive Reporting', description: 'Deliver polished, automated reports to leadership with KPIs, trends, and actionable recommendations.', icon: '📈' },
      { title: 'Operational Visibility', description: 'Monitor business health in real time across departments, teams, and product lines.', icon: '👁️' },
      { title: 'Predictive Planning', description: 'Forecast demand, revenue, and resource needs using ML models trained on your historical data.', icon: '🔮' },
    ],
    'Automation & Workflows': [
      { title: 'Process Digitization', description: 'Convert manual, paper-based processes into automated digital workflows with tracking and accountability.', icon: '📱' },
      { title: 'Cross-Team Coordination', description: 'Automate handoffs between departments with intelligent routing, notifications, and SLA tracking.', icon: '🔗' },
      { title: 'Compliance Workflows', description: 'Build auditable approval chains and documentation flows that satisfy regulatory requirements.', icon: '✅' },
    ],
    'Operations & Productivity': [
      { title: 'Document Automation', description: 'Process invoices, contracts, and forms automatically with AI extraction and validation.', icon: '📄' },
      { title: 'Resource Optimization', description: 'Balance workloads and allocate resources efficiently across projects and teams.', icon: '⚖️' },
      { title: 'Process Improvement', description: 'Identify operational bottlenecks and implement standardized workflows that improve throughput.', icon: '📐' },
    ],
  };

  const defaultUseCases = [
    { title: 'Operational Efficiency', description: `Deploy ${title} to automate routine tasks, reduce manual errors, and free your team to focus on strategic priorities.`, icon: '⚡' },
    { title: 'Scalable Growth', description: `Use ${title} to handle increasing complexity and volume without proportional headcount growth.`, icon: '📈' },
    { title: 'Data-Driven Decisions', description: `Leverage ${title} analytics and reporting to make faster, more confident decisions backed by real operational data.`, icon: '🎯' },
  ];

  return useCasesByCategory[category] || defaultUseCases;
}

function generateBenefits(title, category) {
  const benefitsByCategory = {
    'Security & Compliance': ['Reduced security incident response time', 'Automated compliance evidence collection', 'Continuous risk visibility', 'Lower audit preparation costs', 'Proactive threat detection', 'Simplified regulatory reporting'],
    'Cloud & Infrastructure': ['Reduced cloud infrastructure costs', 'Faster environment provisioning', 'Improved system reliability', 'Automated scaling under load', 'Simplified multi-cloud management', 'Production-grade security baselines'],
    'Engineering & Development': ['Faster code delivery cycles', 'Fewer production bugs', 'Reduced technical debt', 'Improved developer productivity', 'Consistent code quality standards', 'Automated documentation'],
    'Growth & Marketing': ['Higher lead conversion rates', 'Reduced customer acquisition costs', 'Improved campaign ROI', 'Faster pipeline velocity', 'Better audience targeting', 'Data-driven content strategy'],
    'Data & Analytics': ['Real-time operational visibility', 'Faster decision making', 'Improved forecast accuracy', 'Automated report generation', 'Cross-system data unification', 'Self-service analytics for teams'],
    'Automation & Workflows': ['Reduced manual processing time', 'Fewer human errors', 'Faster cross-team handoffs', 'Complete audit trail', 'Scalable process execution', 'Lower operational overhead'],
    'Operations & Productivity': ['Faster document processing', 'Improved task completion rates', 'Standardized business processes', 'Better resource utilization', 'Reduced operational bottlenecks', 'Clear accountability tracking'],
  };

  const defaultBenefits = ['Reduced operational costs', 'Faster time to value', 'Improved team productivity', 'Scalable architecture', 'Enterprise-grade security', 'Measurable ROI tracking'];
  return benefitsByCategory[category] || defaultBenefits;
}

function generatePageContent(route, filePath) {
  const title = slugToTitle(route);
  const { category, icon } = categorize(route);
  const description = generateDescription(title, category);
  const features = generateFeatures(title, category);
  const useCases = generateUseCases(title, category);
  const benefits = generateBenefits(title, category);

  const relativeImportPath = path.relative(
    path.dirname(filePath),
    path.join(APP_DIR, 'components', 'ProductPageLayout')
  ).replace(/\\/g, '/');

  const importPath = relativeImportPath.startsWith('.') ? relativeImportPath : './' + relativeImportPath;

  return `import ProductPageLayout from '${importPath}';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${title.replace(/'/g, "\\'")} | Zion Tech Group',
  description:
    '${description.substring(0, 155).replace(/'/g, "\\'")}',
  alternates: { canonical: '${route}' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: '${title.replace(/'/g, "\\'")}',
        category: '${category}',
        description:
          '${description.replace(/'/g, "\\'")}',
        iconEmoji: '${icon}',
        features: ${JSON.stringify(features, null, 10).replace(/\n/g, '\n        ')},
        useCases: ${JSON.stringify(useCases, null, 10).replace(/\n/g, '\n        ')},
        benefits: ${JSON.stringify(benefits)},
        ctaLabel: 'Get Started with ${title.replace(/'/g, "\\'")}',
      }}
    />
  );
}
`;
}

function main() {
  const allPages = walkDir(APP_DIR);
  let stubCount = 0;
  let updatedCount = 0;

  for (const pagePath of allPages) {
    if (!isStubPage(pagePath)) continue;
    stubCount++;

    const route = '/' + path.relative(APP_DIR, path.dirname(pagePath)).replace(/\\/g, '/');
    const newContent = generatePageContent(route, pagePath);

    fs.writeFileSync(pagePath, newContent, 'utf-8');
    updatedCount++;
  }

  console.log(`Found ${stubCount} stub pages.`);
  console.log(`Updated ${updatedCount} pages with real content.`);
}

main();
