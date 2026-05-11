import Link from 'next/link';
/* eslint-disable */
import Metadata from 'next';
import CaseStudiesClient from './CaseStudiesClient';

export const metadata = {
  title: 'Case Studies',
  description:
    'Real-world results from AI implementations across growth, engineering, and operations. See how teams use Zion Tech Group to deliver measurable outcomes.',
  alternates: { canonical: '/case-studies' },
};

const caseStudies = [
  {
    title: 'SaaS Platform Reduces Support Volume by 40% with AI Chatbot',
    industry: 'Technology',
    result: '40% fewer support tickets',
    description:
      'A mid-market SaaS company deployed Zion AI Chatbot Builder to handle tier-1 support inquiries, freeing their team to focus on complex escalations.',
    apps: ['AI Chatbot Builder', 'AI Customer Support Pro'],
    icon: '💬',
  },
  {
    title: 'Ecommerce Brand Increases Revenue 28% with Predictive Lead Scoring',
    industry: 'Ecommerce',
    result: '28% revenue increase',
    description:
      'An ecommerce brand used AI Lead Scoring and Email Marketing Pro to prioritize high-intent shoppers and personalize outreach at scale.',
    apps: ['AI Lead Scoring', 'AI Email Marketing Pro'],
    icon: '📈',
  },
  {
    title: 'Fintech Startup Passes SOC 2 Audit in 8 Weeks',
    industry: 'Financial Services',
    result: 'SOC 2 in 8 weeks',
    description:
      'A Series A fintech company used Zion Compliance Manager and Security Shield to establish controls and pass their first SOC 2 audit ahead of schedule.',
    apps: ['Compliance Manager', 'Security Shield'],
    icon: '🔒',
  },
  {
    title: 'Logistics Company Cuts Fulfillment Planning Time by 60%',
    industry: 'Supply Chain',
    result: '60% faster planning',
    description:
      'A regional logistics provider deployed the Supply Chain Optimizer to automate demand forecasting and reduce bottlenecks in fulfillment scheduling.',
    apps: ['Supply Chain Optimizer', 'AI Predictive Analytics'],
    icon: '🚚',
  },
  {
    title: 'Engineering Team Ships 3x Faster with AI Code Review',
    industry: 'Technology',
    result: '3x deployment frequency',
    description:
      'A 40-person engineering team integrated AI Code Reviewer and DevOps Automation to catch issues earlier and streamline their release cycle.',
    apps: ['AI Code Reviewer', 'DevOps Automation'],
    icon: '⚙️',
  },
  {
    title: 'Healthcare Provider Modernizes Records Workflow',
    industry: 'Healthcare',
    result: '75% less manual entry',
    description:
      'A multi-location healthcare provider used AI Document Processor and Medical Records Manager to digitize intake workflows and reduce manual data entry.',
    apps: ['AI Document Processor', 'Medical Records Manager'],
    icon: '🏥',
  },
  {
    title: 'Media Studio Cuts Content Production Time 50%',
    industry: 'Media & Entertainment',
    result: '50% faster production',
    description:
      'A content production studio used Content Studio and AI Video Generator to automate asset creation and repurpose content across channels.',
    apps: ['Content Studio', 'AI Video Generator'],
    icon: '🎬',
  },
  {
    title: 'Retail Chain Improves Inventory Accuracy 35%',
    industry: 'Retail',
    result: '35% fewer stockouts',
    description:
      'A regional retail chain deployed Smart Inventory Manager and AI Supply Chain Optimizer to align demand with supply and reduce out-of-stock incidents.',
    apps: ['Smart Inventory Manager', 'AI Supply Chain Optimizer'],
    icon: '🛒',
  },
  {
    title: 'Insurance Firm Automates Claims Processing 45%',
    industry: 'Insurance',
    result: '45% faster claims',
    description:
      'An insurance carrier used AI Document Processor and AI Fraud Detector to streamline claims intake and reduce manual review cycles.',
    apps: ['AI Document Processor', 'AI Fraud Detector'],
    icon: '🛡️',
  },
  {
    title: 'Pharma Accelerates Trial Data Analysis 60%',
    industry: 'Pharmaceuticals',
    result: '60% faster analysis',
    description:
      'A life sciences company deployed AI Document Analyzer and AI Report Generator to automate regulatory submissions and trial data summaries.',
    apps: ['AI Document Analyzer', 'AI Report Generator'],
    icon: '🧪',
  },
  {
    title: 'Telecom Reduces Network Outages 40% with Predictive Maintenance',
    industry: 'Telecommunications',
    result: '40% fewer outages',
    description:
      'A regional telecom operator deployed AI Predictive Maintenance and AI Data Pipeline to monitor infrastructure proactively and reduce unplanned downtime.',
    apps: ['AI Predictive Maintenance', 'AI Data Pipeline'],
    icon: '📡',
  },
  {
    title: 'Auto Manufacturer Streamlines Parts Supply Chain 45%',
    industry: 'Automotive',
    result: '45% faster replenishment',
    description:
      'An automotive OEM used AI Supply Chain Optimizer and Smart Inventory Manager to align parts demand with supplier lead times and reduce stockouts.',
    apps: ['AI Supply Chain Optimizer', 'Smart Inventory Manager'],
    icon: '🚗',
  },
  {
    title: 'Aerospace Supplier Cuts Document Review Time 50%',
    industry: 'Aerospace & Defense',
    result: '50% faster review',
    description:
      'An aerospace components supplier used AI Document Processor and AI Contract Analyzer to automate compliance documentation and reduce manual review cycles for ITAR-sensitive materials.',
    apps: ['AI Document Processor', 'AI Contract Analyzer'],
    icon: '✈️',
  },
  {
    title: 'Shipping Line Reduces Port Delays 35%',
    industry: 'Maritime & Shipping',
    result: '35% fewer delays',
    description:
      'A regional shipping line deployed AI Supply Chain Optimizer and AI Predictive Maintenance to improve vessel scheduling, cargo forecasting, and port coordination.',
    apps: ['AI Supply Chain Optimizer', 'AI Predictive Maintenance'],
    icon: '🚢',
  },
  {
    title: 'Food Distributor Cuts Waste 30% with Demand Forecasting',
    industry: 'Food & Beverage',
    result: '30% less waste',
    description:
      'A regional food distributor used AI Sales Predictor and Smart Inventory Manager to improve demand forecasting and reduce perishable stock write-offs.',
    apps: ['AI Sales Predictor', 'Smart Inventory Manager'],
    icon: '🍽️',
  },
  {
    title: 'Oil Refinery Reduces Unplanned Downtime 25%',
    industry: 'Oil & Gas',
    result: '25% fewer outages',
    description:
      'An oil refinery deployed AI Predictive Maintenance and AI Data Pipeline to enable proactive equipment monitoring and automate compliance reporting.',
    apps: ['AI Predictive Maintenance', 'AI Data Pipeline'],
    icon: '🛢️',
  },
  {
    title: 'Bank Cuts Fraud Losses 35% with AI Transaction Monitoring',
    industry: 'Banking & Capital Markets',
    result: '35% fewer fraud incidents',
    description:
      'A regional bank deployed AI Fraud Detector and AI Risk Assessor to enable real-time transaction monitoring and adaptive fraud scoring.',
    apps: ['AI Fraud Detector', 'AI Risk Assessor'],
    icon: '🏛️',
  },
  {
    title: 'Waste Operator Improves Recycling Efficiency 40%',
    industry: 'Environmental & Waste',
    result: '40% higher recovery rate',
    description:
      'A municipal waste operator used AI Predictive Analytics and AI Data Pipeline to optimize route planning and material sorting workflows.',
    apps: ['AI Predictive Analytics', 'AI Data Pipeline'],
    icon: '♻️',
  },
  {
    title: 'Gaming Platform Cuts Toxic Content 55% with AI Moderation',
    industry: 'Gaming & Esports',
    result: '55% fewer policy violations',
    description:
      'A multiplayer gaming platform deployed AI Content Moderator and AI Fraud Detector to automate moderation queues and reduce fraudulent account activity.',
    apps: ['AI Content Moderator', 'AI Fraud Detector'],
    icon: '🎮',
  },
  {
    title: 'Solar Operator Improves Forecast Accuracy 30%',
    industry: 'Renewable Energy',
    result: '30% better forecasting',
    description:
      'A regional solar operator used AI Predictive Analytics and AI Energy Manager to optimize production forecasting and grid balancing decisions.',
    apps: ['AI Predictive Analytics', 'AI Energy Manager'],
    icon: '☀️',
  },
  {
    title: 'Gym Chain Increases Member Retention 35%',
    industry: 'Sports & Fitness',
    result: '35% higher retention',
    description:
      'A regional gym chain deployed AI Customer Sentiment Tracker and AI Chatbot Builder to personalize member engagement and reduce churn through proactive outreach.',
    apps: ['AI Customer Sentiment Tracker', 'AI Chatbot Builder'],
    icon: '🏃',
  },
  {
    title: 'CPG Brand Improves Demand Forecast Accuracy 40%',
    industry: 'Consumer Goods',
    result: '40% better forecasting',
    description:
      'A consumer packaged goods brand used AI Sales Predictor and Smart Inventory Manager to align production with retail demand and reduce excess inventory.',
    apps: ['AI Sales Predictor', 'Smart Inventory Manager'],
    icon: '📦',
  },
  {
    title: 'Fleet Operator Cuts Route Costs 28% with AI Optimization',
    industry: 'Transportation & Fleet',
    result: '28% lower routing costs',
    description:
      'A regional fleet operator deployed AI Supply Chain Optimizer and AI Scheduling Assistant to optimize delivery routes and driver allocation across multiple depots.',
    apps: ['AI Supply Chain Optimizer', 'AI Scheduling Assistant'],
    icon: '🚛',
  },
  {
    title: 'Marketing Agency Improves Campaign ROI 45%',
    industry: 'Marketing & Advertising',
    result: '45% higher ROI',
    description:
      'A digital marketing agency used AI Marketing Automation and Smart Analytics Dashboard to automate attribution modeling and optimize ad spend allocation across channels.',
    apps: ['AI Marketing Automation', 'Smart Analytics Dashboard'],
    icon: '📢',
  },
  {
    title: 'Chemical Producer Cuts Batch Defects 32% with AI Quality Assurance',
    industry: 'Chemicals & Materials',
    result: '32% fewer defects',
    description:
      'A specialty chemicals manufacturer deployed AI Quality Assurance and Compliance Manager to automate batch traceability and reduce non-conformance incidents.',
    apps: ['AI Quality Assurance', 'Compliance Manager'],
    icon: '🧪',
  },
  {
    title: 'Semiconductor Fab Improves Yield 18% with Predictive Analytics',
    industry: 'Electronics & Semiconductors',
    result: '18% higher yield',
    description:
      'A semiconductor fab used AI Predictive Maintenance and AI Data Pipeline to correlate equipment signals with yield outcomes and reduce variability.',
    apps: ['AI Predictive Maintenance', 'AI Data Pipeline'],
    icon: '🔌',
  },
  {
    title: 'Satellite Operator Cuts Ground Station Downtime 22%',
    industry: 'Space & Satellite',
    result: '22% fewer outages',
    description:
      'A regional satellite operator deployed AI Predictive Maintenance and AI Data Pipeline to monitor ground station equipment proactively and optimize scheduling and maintenance windows.',
    apps: ['AI Predictive Maintenance', 'AI Data Pipeline'],
    icon: '🛰️',
  },
  {
    title: 'Apparel Brand Improves Seasonal Forecast Accuracy 38%',
    industry: 'Textiles & Apparel',
    result: '38% better forecasting',
    description:
      'A global apparel brand used AI Sales Predictor and Smart Inventory Manager to align production with retail demand and reduce excess inventory across seasonal collections.',
    apps: ['AI Sales Predictor', 'Smart Inventory Manager'],
    icon: '👕',
  },
  {
    title: 'Veterinary Clinic Reduces No-Shows 33% with AI Scheduling',
    industry: 'Veterinary & Animal Health',
    result: '33% fewer no-shows',
    description:
      'A multi-location veterinary clinic deployed AI Scheduling Assistant and AI Chatbot Builder to automate appointment reminders and rescheduling, improving show rates and reducing scheduling gaps.',
    apps: ['AI Scheduling Assistant', 'AI Chatbot Builder'],
    icon: '🐾',
  },
  {
    title: 'HVAC Company Improves Dispatch Efficiency 42%',
    industry: 'Home Services',
    result: '42% faster dispatch',
    description:
      'A regional HVAC contractor used AI Scheduling Assistant and AI Supply Chain Optimizer to optimize technician routing and parts availability for same-day service calls.',
    apps: ['AI Scheduling Assistant', 'AI Supply Chain Optimizer'],
    icon: '🔧',
  },
  {
    title: 'Accounting Firm Automates Document Processing 50%',
    industry: 'Accounting & Tax Services',
    result: '50% faster processing',
    description:
      'A mid-size CPA firm deployed AI Document Processor and AI Accounting Assistant to streamline client intake, reconciliation workflows, and report generation, reducing manual data entry and accelerating month-end close.',
    apps: ['AI Document Processor', 'AI Accounting Assistant'],
    icon: '📒',
  },
  {
    title: 'Wholesale Distributor Improves Inventory Accuracy 35%',
    industry: 'Wholesale & Distribution',
    result: '35% fewer stockouts',
    description:
      'A regional wholesale distributor used AI Supply Chain Optimizer and Smart Inventory Manager to align demand with replenishment cycles across multiple warehouse locations, reducing out-of-stock incidents and improving fill rates.',
    apps: ['AI Supply Chain Optimizer', 'Smart Inventory Manager'],
    icon: '📦',
  },
  {
    title: 'Staffing Agency Cuts Time-to-Fill 38%',
    industry: 'Staffing & Recruiting',
    result: '38% faster placements',
    description:
      'A mid-size staffing agency deployed AI Recruitment Pro and AI Talent Analytics to automate candidate screening, pipeline prioritization, and client reporting, reducing time-to-fill while improving placement quality.',
    apps: ['AI Recruitment Pro', 'AI Talent Analytics'],
    icon: '👥',
  },
  {
    title: 'Property Manager Reduces Work Order Backlog 42%',
    industry: 'Facilities & Property Management',
    result: '42% less backlog',
    description:
      'A commercial property manager used AI Scheduling Assistant and AI Predictive Maintenance to automate work order routing, technician scheduling, and preventive maintenance planning across a multi-building portfolio.',
    apps: ['AI Scheduling Assistant', 'AI Predictive Maintenance'],
    icon: '🏢',
  },
  {
    title: 'Asset Manager Automates Client Reporting 45%',
    industry: 'Asset Management & Investment',
    result: '45% faster reports',
    description:
      'A mid-size wealth management firm deployed AI Document Analyzer and AI Report Generator to streamline portfolio commentary, regulatory filings, and client-facing reports, reducing manual compilation time and improving consistency.',
    apps: ['AI Document Analyzer', 'AI Report Generator'],
    icon: '📊',
  },
  {
    title: 'Restaurant Group Cuts Food Waste 28% with Demand Forecasting',
    industry: 'Restaurants & Food Service',
    result: '28% less waste',
    description:
      'A regional restaurant group with 12 locations used AI Sales Predictor and Smart Inventory Manager to align prep schedules with foot traffic patterns, reducing perishable waste and improving cost margins.',
    apps: ['AI Sales Predictor', 'Smart Inventory Manager'],
    icon: '🍴',
  },
  {
    title: 'Packaging Manufacturer Cuts Defect Rate 28% with AI Quality Assurance',
    industry: 'Packaging & Materials',
    result: '28% fewer defects',
    description:
      'A packaging materials producer deployed AI Quality Assurance and Supply Chain Optimizer to automate batch traceability and reduce non-conformance incidents across multiple production lines.',
    apps: ['AI Quality Assurance', 'Supply Chain Optimizer'],
    icon: '📦',
  },
  {
    title: '3PL Provider Improves Pick Accuracy 40% with Smart Inventory',
    industry: 'Warehousing & 3PL',
    result: '40% fewer pick errors',
    description:
      'A third-party logistics provider used Smart Inventory Manager and Workflow Automation to optimize warehouse operations, pick-and-pack workflows, and carrier coordination across five fulfillment centers.',
    apps: ['Smart Inventory Manager', 'Workflow Automation'],
    icon: '🏭',
  },
  {
    title: 'Law Firm Cuts Contract Review Time 50% with AI Analysis',
    industry: 'Legal & Professional Services',
    result: '50% faster review',
    description:
      'A mid-size law firm deployed AI Contract Analyzer and AI Document Processor to automate due diligence, surface risk clauses, and streamline client intake across M&A and commercial transactions.',
    apps: ['AI Contract Analyzer', 'AI Document Processor'],
    icon: '⚖️',
  },
  {
    title: 'University Improves Course Completion 35% with Adaptive Learning',
    industry: 'Education & Training',
    result: '35% higher completion',
    description:
      'A regional university used AI Knowledge Base and AI Survey Builder to deliver personalized learning paths, automate assessment workflows, and generate engagement analytics for learners across online programs.',
    apps: ['AI Knowledge Base', 'AI Survey Builder'],
    icon: '🎓',
  },
  {
    title: 'Real Estate Firm Automates Lease Review 55%',
    industry: 'Real Estate',
    result: '55% faster lease review',
    description:
      'A property management company used AI Contract Analyzer and AI Document Processor to automate lease abstraction and compliance checks across a 500-property portfolio.',
    apps: ['AI Contract Analyzer', 'AI Document Processor', 'Compliance Manager'],
    icon: '🏠',
  },
  {
    title: 'Accounting Firm Cuts Tax Prep Time 45%',
    industry: 'Accounting',
    result: '45% faster tax prep',
    description:
      'A mid-size accounting firm deployed AI Document Processor and AI Report Generator to automate data extraction from client documents and generate draft tax schedules.',
    apps: ['AI Document Processor', 'AI Report Generator', 'Invoice Genius'],
    icon: '📊',
  },
  {
    title: 'Veterinary Clinic Reduces No-Shows 33%',
    industry: 'Veterinary',
    result: '33% fewer no-shows',
    description:
      'A multi-location veterinary practice used AI Chatbot Builder and AI Scheduling Assistant to send automated reminders and allow online rescheduling.',
    apps: ['AI Chatbot Builder', 'AI Scheduling Assistant', 'AI Customer Support Pro'],
    icon: '🐾',
  },
  {
    title: 'Apparel Brand Improves Seasonal Forecast 38%',
    industry: 'Textiles & Apparel',
    result: '38% better forecasts',
    description:
      'A fashion brand deployed AI Sales Predictor and Smart Inventory Manager to improve demand forecasting for seasonal collections and reduce overstock.',
    apps: ['AI Sales Predictor', 'Smart Inventory Manager', 'AI Marketing Automation'],
    icon: '👗',
  },
  {
    title: 'Chemical Producer Cuts Batch Defects 32%',
    industry: 'Chemicals',
    result: '32% fewer defects',
    description:
      'A specialty chemicals manufacturer used AI Quality Assurance and AI Data Pipeline to monitor production parameters and detect anomalies in real time.',
    apps: ['AI Quality Assurance', 'AI Data Pipeline', 'AI Predictive Analytics'],
    icon: '⚗️',
  },
  {
    title: 'Semiconductor Fab Improves Yield 18%',
    industry: 'Electronics',
    result: '18% yield improvement',
    description:
      'A semiconductor foundry deployed AI Predictive Analytics and AI Quality Assurance to optimize process parameters and reduce wafer defects.',
    apps: ['AI Predictive Analytics', 'AI Quality Assurance', 'AI Data Pipeline'],
    icon: '🔌',
  },
  {
    title: 'Fleet Operator Cuts Route Costs 28%',
    industry: 'Transportation',
    result: '28% cost reduction',
    description:
      'A logistics fleet used Supply Chain Optimizer and AI Predictive Maintenance to optimize routes and reduce fuel and maintenance costs.',
    apps: ['Supply Chain Optimizer', 'AI Predictive Maintenance', 'AI Data Pipeline'],
    icon: '🚛',
  },
  {
    title: 'Agency Improves Campaign ROI 45%',
    industry: 'Marketing',
    result: '45% higher ROI',
    description:
      'A digital marketing agency used AI Marketing Automation and AI Customer Sentiment Tracker to personalize campaigns and optimize ad spend.',
    apps: ['AI Marketing Automation', 'AI Customer Sentiment Tracker', 'AI Sales Predictor'],
    icon: '📣',
  },
  {
    title: 'Law Firm Automates Contract Review 50%',
    industry: 'Legal',
    result: '50% faster review',
    description:
      'A mid-size law firm deployed AI Contract Analyzer and AI Document Processor to automate initial contract review and flag high-risk clauses for attorney attention.',
    apps: ['AI Contract Analyzer', 'AI Document Processor', 'Compliance Manager'],
    icon: '⚖️',
  },
  {
    title: 'University Improves Adaptive Learning 35%',
    industry: 'Education',
    result: '35% better outcomes',
    description:
      'A university used AI-powered learning analytics and AI Chatbot Builder to personalize course content and provide 24/7 student support.',
    apps: ['AI Chatbot Builder', 'AI Document Processor', 'AI Report Generator'],
    icon: '🎓',
  },
  {
    title: 'Restaurant Group Cuts Food Waste 30%',
    industry: 'Restaurants',
    result: '30% less waste',
    description:
      'A multi-location restaurant group deployed AI Sales Predictor and Smart Inventory Manager to optimize ordering and reduce spoilage.',
    apps: ['AI Sales Predictor', 'Smart Inventory Manager', 'AI Data Pipeline'],
    icon: '🍽️',
  },
  {
    title: 'Packaging Company Improves Quality 25%',
    industry: 'Packaging',
    result: '25% fewer defects',
    description:
      'A packaging manufacturer used AI Quality Assurance and AI Predictive Maintenance to detect defects in real time and prevent equipment failures.',
    apps: ['AI Quality Assurance', 'AI Predictive Maintenance', 'AI Data Pipeline'],
    icon: '📦',
  },
  {
    title: '3PL Provider Cuts Fulfillment Time 40%',
    industry: 'Warehousing',
    result: '40% faster fulfillment',
    description:
      'A third-party logistics provider deployed Supply Chain Optimizer and Smart Inventory Manager to optimize pick paths and reduce order cycle time.',
    apps: ['Supply Chain Optimizer', 'Smart Inventory Manager', 'AI Data Pipeline'],
    icon: '🏭',
  },
  {
    title: 'Mining Operation Improves Safety Incidents 35%',
    industry: 'Mining',
    result: '35% fewer incidents',
    description:
      'A mining company deployed AI Predictive Maintenance and AI Data Pipeline to monitor equipment health and predict failures before they caused safety events.',
    apps: ['AI Predictive Maintenance', 'AI Data Pipeline', 'AI Report Generator'],
    icon: '⛏️',
  },
  {
    title: 'Construction Firm Reduces Rework 30%',
    industry: 'Construction',
    result: '30% less rework',
    description:
      'A general contractor used AI Document Processor and AI Quality Assurance to automate plan review and catch design conflicts before construction.',
    apps: ['AI Document Processor', 'AI Quality Assurance', 'AI Contract Analyzer'],
    icon: '🏗️',
  },
  {
    title: 'Hotel Chain Improves Occupancy 25%',
    industry: 'Hospitality',
    result: '25% higher occupancy',
    description:
      'A hotel group deployed AI Sales Predictor and AI Customer Sentiment Tracker to optimize pricing and personalize guest communications.',
    apps: ['AI Sales Predictor', 'AI Customer Sentiment Tracker', 'AI Chatbot Builder'],
    icon: '🏨',
  },
  {
    title: 'Non-Profit Automates Donor Outreach 40%',
    industry: 'Non-Profit',
    result: '40% more donor engagement',
    description:
      'A non-profit used AI Email Marketing Pro and AI Customer Support Pro to personalize donor communications and automate stewardship workflows.',
    apps: ['AI Email Marketing Pro', 'AI Customer Support Pro', 'AI Report Generator'],
    icon: '🤝',
  },
  {
    title: 'Beauty Brand Improves Customer Retention 35%',
    industry: 'Beauty & Wellness',
    result: '35% better retention',
    description:
      'A beauty brand deployed AI Customer Sentiment Tracker and AI Chatbot Builder to personalize recommendations and provide 24/7 product support.',
    apps: ['AI Customer Sentiment Tracker', 'AI Chatbot Builder', 'AI Marketing Automation'],
    icon: '💄',
  },
  {
    title: 'Pharma Company Automates Regulatory Submissions 50%',
    industry: 'Pharmaceuticals',
    result: '50% faster submissions',
    description:
      'A pharmaceutical company used AI Document Analyzer and AI Report Generator to automate regulatory document preparation and submission workflows.',
    apps: ['AI Document Analyzer', 'AI Report Generator', 'Compliance Manager'],
    icon: '🧪',
  },
  {
    title: 'Bank Improves Fraud Detection 45%',
    industry: 'Banking',
    result: '45% fewer fraud losses',
    description:
      'A regional bank deployed AI Fraud Detector and AI Data Pipeline to analyze transaction patterns and flag suspicious activity in real time.',
    apps: ['AI Fraud Detector', 'AI Data Pipeline', 'Compliance Manager'],
    icon: '🏦',
  },
  {
    title: 'Utility Company Reduces Outages 30%',
    industry: 'Energy & Utilities',
    result: '30% fewer outages',
    description:
      'An electric utility used AI Predictive Maintenance and AI Data Pipeline to monitor grid assets and predict failures before they caused outages.',
    apps: ['AI Predictive Maintenance', 'AI Data Pipeline', 'AI Report Generator'],
    icon: '⚡',
  },
  {
    title: 'Airlines Cuts Delay Costs 25%',
    industry: 'Aviation',
    result: '25% lower delay costs',
    description:
      'An airline deployed AI Predictive Analytics and Supply Chain Optimizer to optimize crew scheduling and parts availability across hubs.',
    apps: ['AI Predictive Analytics', 'Supply Chain Optimizer', 'AI Data Pipeline'],
    icon: '✈️',
  },
  {
    title: 'Grocery Chain Improves Fresh Produce Forecasting 40%',
    industry: 'Retail',
    result: '40% less waste',
    description:
      'A grocery chain used AI Sales Predictor and Smart Inventory Manager to improve demand forecasting for perishables and reduce spoilage.',
    apps: ['AI Sales Predictor', 'Smart Inventory Manager', 'AI Data Pipeline'],
    icon: '🥬',
  },
  {
    title: 'Recruiting Firm Cuts Time-to-Fill 35%',
    industry: 'Staffing',
    result: '35% faster placements',
    description:
      'A staffing agency deployed AI Talent Analytics and AI Chatbot Builder to screen candidates and automate initial outreach at scale.',
    apps: ['AI Talent Analytics', 'AI Chatbot Builder', 'AI Document Processor'],
    icon: '👔',
  },
  {
    title: 'Publishing House Automates Manuscript Review 55%',
    industry: 'Publishing',
    result: '55% faster review',
    description:
      'A publishing company used AI Document Processor and AI Report Generator to automate initial manuscript screening and generate editorial reports.',
    apps: ['AI Document Processor', 'AI Report Generator', 'AI Content Moderation'],
    icon: '📚',
  },
  {
    title: 'Fitness Chain Increases Class Attendance 28%',
    industry: 'Sports & Fitness',
    result: '28% higher attendance',
    description:
      'A fitness chain used AI Scheduling Assistant and AI Email Marketing Pro to personalize class reminders and reduce no-shows.',
    apps: ['AI Scheduling Assistant', 'AI Email Marketing Pro', 'AI Chatbot Builder'],
    icon: '🏋️',
  },
  {
    title: 'Insurance Broker Improves Quote Accuracy 40%',
    industry: 'Insurance',
    result: '40% fewer quote errors',
    description:
      'An insurance brokerage used AI Document Processor and Compliance Manager to automate data extraction from applications and reduce manual entry errors.',
    apps: ['AI Document Processor', 'Compliance Manager', 'AI Report Generator'],
    icon: '📋',
  },
  {
    title: 'Construction Company Cuts Change Order Processing 50%',
    industry: 'Construction',
    result: '50% faster change orders',
    description:
      'A general contractor used AI Document Processor and AI Contract Analyzer to automate change order review and approval workflows across multiple projects.',
    apps: ['AI Document Processor', 'AI Contract Analyzer', 'Workflow Automation'],
    icon: '🏗️',
  },
  {
    title: 'Warehouse Operator Improves Pick Accuracy 45%',
    industry: 'Warehousing',
    result: '45% fewer pick errors',
    description:
      'A distribution center deployed AI-powered pick path optimization and barcode verification to reduce mispicks and improve order accuracy.',
    apps: ['Supply Chain Optimizer', 'Smart Inventory Manager', 'AI Data Pipeline'],
    icon: '📦',
  },
  {
    title: 'Airlines Cuts Crew Scheduling Time 60%',
    industry: 'Aviation',
    result: '60% faster scheduling',
    description:
      'An airline used AI to optimize crew assignments across hubs, reducing manual scheduling effort and improving crew utilization.',
    apps: ['AI Predictive Analytics', 'Supply Chain Optimizer', 'AI Data Pipeline'],
    icon: '✈️',
  },
  {
    title: 'Retailer Improves Personalization ROI 35%',
    industry: 'Retail',
    result: '35% higher personalization ROI',
    description:
      'A multi-brand retailer deployed AI Lead Scoring and AI Marketing Automation to personalize recommendations and increase conversion rates.',
    apps: ['AI Lead Scoring', 'AI Marketing Automation', 'AI Customer Sentiment Tracker'],
    icon: '🛒',
  },
  {
    title: 'University Improves Student Outcomes 28%',
    industry: 'Education',
    result: '28% better outcomes',
    description:
      'A university used AI to personalize learning paths and identify at-risk students early, improving retention and graduation rates.',
    apps: ['AI Document Processor', 'AI Report Generator', 'AI Chatbot Builder'],
    icon: '📚',
  },
  {
    title: 'Streaming Platform Cuts Content Moderation Costs 55%',
    industry: 'Media & Entertainment',
    result: '55% lower moderation costs',
    description:
      'A streaming platform deployed AI Content Moderation and AI Document Processor to automate review of user-generated content while maintaining quality.',
    apps: ['AI Content Moderation', 'AI Document Processor', 'AI Fraud Detector'],
    icon: '🎬',
  },
  {
    title: 'Biotech Firm Accelerates Trial Recruitment 40%',
    industry: 'Pharmaceuticals',
    result: '40% faster recruitment',
    description:
      'A biotech company used AI to match patients to clinical trials and automate pre-screening, reducing time to full enrollment.',
    apps: ['AI Document Analyzer', 'AI Report Generator', 'AI Chatbot Builder'],
    icon: '🧪',
  },
  {
    title: 'Logistics Provider Cuts Last-Mile Costs 32%',
    industry: 'Logistics',
    result: '32% lower last-mile costs',
    description:
      'A last-mile delivery provider deployed AI Route Optimizer and AI Fleet Management to optimize routes and reduce fuel and labor costs.',
    apps: ['AI Route Optimizer', 'AI Fleet Management', 'Supply Chain Optimizer'],
    icon: '🚚',
  },
  {
    title: 'Manufacturer Improves OEE 22%',
    industry: 'Manufacturing',
    result: '22% higher OEE',
    description:
      'A discrete manufacturer used AI Predictive Maintenance and AI Quality Insights to reduce unplanned downtime and improve first-pass yield.',
    apps: ['AI Predictive Maintenance', 'AI Quality Insights', 'AI Data Pipeline'],
    icon: '🏭',
  },
  {
    title: 'SaaS Company Cuts Churn 28%',
    industry: 'Technology & SaaS',
    result: '28% lower churn',
    description:
      'A B2B SaaS company deployed AI Customer Success and AI Customer Sentiment Tracker to identify at-risk accounts and personalize outreach.',
    apps: ['AI Customer Success', 'AI Customer Sentiment Tracker', 'AI Chatbot Builder'],
    icon: '💻',
  },
  {
    title: 'Aerospace Supplier Cuts Document Review 55%',
    industry: 'Aerospace & Defense',
    result: '55% faster document review',
    description:
      'An aerospace supplier used AI Document Processor and AI Contract Analyzer to automate technical document review and compliance checks across supply chain documentation.',
    apps: ['AI Document Processor', 'AI Contract Analyzer', 'Compliance Manager'],
    icon: '✈️',
  },
  {
    title: 'Defense Contractor Improves Security Clearance 45%',
    industry: 'Aerospace & Defense',
    result: '45% faster clearances',
    description:
      'A defense contractor deployed AI Document Processor and AI Report Generator to automate background check document processing and reduce clearance turnaround time.',
    apps: ['AI Document Processor', 'AI Report Generator', 'AI Data Pipeline'],
    icon: '🔒',
  },
  {
    title: 'Telecom Reduces Network Outages 40%',
    industry: 'Telecommunications',
    result: '40% fewer outages',
    description:
      'A telecom operator deployed AI Predictive Maintenance and AI Data Pipeline to monitor network equipment and predict failures before they impacted customers.',
    apps: ['AI Predictive Maintenance', 'AI Data Pipeline', 'AI Report Generator'],
    icon: '📡',
  },
  {
    title: 'Retailer Improves Demand Forecast Accuracy 32%',
    industry: 'Retail',
    result: '32% better forecasts',
    description:
      'A multi-channel retailer used AI Sales Predictor and Smart Inventory Manager to unify demand signals and improve seasonal planning across stores and e-commerce.',
    apps: ['AI Sales Predictor', 'Smart Inventory Manager', 'AI Data Pipeline'],
    icon: '📊',
  },
  {
    title: 'Oil Refinery Cuts Unplanned Downtime 28%',
    industry: 'Oil & Gas',
    result: '28% less downtime',
    description:
      'An oil refinery deployed AI Predictive Maintenance and AI Data Pipeline to monitor critical equipment and schedule maintenance during planned shutdowns.',
    apps: ['AI Predictive Maintenance', 'AI Data Pipeline', 'AI Report Generator'],
    icon: '⛽',
  },
  {
    title: 'FinTech Startup Cuts Loan Processing Time 65%',
    industry: 'FinTech',
    result: '65% faster processing',
    description:
      'A digital lender used AI Document Processor and AI Contract Analyzer to automate income verification and document extraction, reducing time-to-decision from days to hours.',
    apps: ['AI Document Processor', 'AI Contract Analyzer', 'AI Fraud Detection'],
    icon: '💳',
  },
  {
    title: 'PropTech Platform Improves Valuation Accuracy 22%',
    industry: 'Real Estate Tech',
    result: '22% better accuracy',
    description:
      'A property technology company deployed AI Sales Predictor and AI Data Pipeline to improve automated valuations and reduce manual appraisals.',
    apps: ['AI Sales Predictor', 'AI Data Pipeline', 'AI Report Generator'],
    icon: '🏘️',
  },
  {
    title: 'EdTech Company Personalizes Learning Paths 45%',
    industry: 'EdTech',
    result: '45% better engagement',
    description:
      'An education technology provider used AI Chatbot Builder and learning analytics to personalize course recommendations and improve student completion rates.',
    apps: ['AI Chatbot Builder', 'AI Document Processor', 'AI Report Generator'],
    icon: '📚',
  },
  {
    title: 'GovTech Agency Automates Permit Review 50%',
    industry: 'Government',
    result: '50% faster permits',
    description:
      'A municipal agency deployed AI Document Processor and Compliance Manager to automate permit application review and reduce citizen wait times.',
    apps: ['AI Document Processor', 'Compliance Manager', 'AI Contract Analyzer'],
    icon: '🏛️',
  },
  {
    title: 'Climate Tech Firm Improves Carbon Reporting 40%',
    industry: 'Climate Tech',
    result: '40% faster reporting',
    description:
      'A sustainability software company used AI Data Pipeline and AI Report Generator to automate carbon data collection and ESG report generation.',
    apps: ['AI Data Pipeline', 'AI Report Generator', 'AI Document Processor'],
    icon: '🌍',
  },
  {
    title: 'InsurTech Automates Claims Triage 55%',
    industry: 'InsurTech',
    result: '55% faster triage',
    description:
      'An insurance technology provider deployed AI Document Processor and AI Fraud Detection to automate claims classification and route complex cases to specialists.',
    apps: ['AI Document Processor', 'AI Fraud Detection', 'AI Contract Analyzer'],
    icon: '🛡️',
  },
  {
    title: 'Mining Company Cuts Equipment Downtime 32%',
    industry: 'Mining & Natural Resources',
    result: '32% less downtime',
    description:
      'A mining operator deployed AI Predictive Maintenance and AI Data Pipeline to monitor haul trucks and processing equipment, scheduling maintenance during planned shutdowns.',
    apps: ['AI Predictive Maintenance', 'AI Data Pipeline', 'AI Report Generator'],
    icon: '⛏️',
  }
];

const industries = Array.from(new Set(caseStudies.map((s) => s.industry))).sort();

export default function CaseStudiesPage() {
  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 right-[-8rem] h-[24rem] w-[24rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[-6rem] h-[22rem] w-[22rem] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 pb-8 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
            Case Studies
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Real Results from Real Teams
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            See how organizations across industries are using Zion Tech Group solutions to
            drive measurable business outcomes.
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CaseStudiesClient caseStudies={caseStudies} industries={industries} />
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/40 via-fuchsia-900/30 to-pink-900/40 p-8 text-center shadow-2xl sm:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Be Our Next Success Story?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200">
            Tell us about your goals and we will map a practical plan to get there.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/contact"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Start a Conversation
            </a>
            <a
              href="/solutions"
              className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore Solutions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
