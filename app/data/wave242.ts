import { Service } from './serviceTypes';

// =============================================================================
// Wave 242 — Services
// =============================================================================
// AI Services (2)
export const wave242AiServices: Service[] = [
  {
    id: 'ai-powered-personalized-learning-edtech-platform',
    title: 'AI-Powered Personalized Learning & EdTech Platform',
    description:
      'Adaptive learning paths, knowledge gap analysis, automated assessments, and progress tracking powered by AI to deliver personalized education experiences at scale.',
    features: [
      'Adaptive learning paths that dynamically adjust content difficulty, pacing, and format based on individual student performance, engagement patterns, and learning style preferences',
      'Knowledge gap analysis engine that identifies specific topics where students struggle, maps prerequisite dependencies, and recommends targeted remediation to close gaps before they compound',
      'Automated assessment system that generates personalized quizzes, evaluates open-ended responses with NLP, and provides instant feedback with actionable improvement suggestions',
      'Progress tracking dashboards with granular learning analytics, competency mastery visualization, time-on-task metrics, and predictive performance forecasting for students and educators',
      'Content recommendation engine that surfaces relevant learning materials, practice exercises, and supplementary resources aligned to each student\'s current knowledge state and goals',
      'Integration layer connecting with popular LMS platforms, student information systems, and video conferencing tools for seamless adoption into existing educational workflows',
    ],
    benefits: [
      'Improve student outcomes by 40% through personalized learning experiences that adapt to each learner\'s pace, style, and knowledge gaps in real time',
      'Reduce instructor workload by automating assessment generation, grading, and progress reporting so educators can focus on teaching and mentoring',
      'Scale personalized education to thousands of students simultaneously without proportional increases in teaching staff or infrastructure costs',
      'Identify at-risk students early through predictive analytics that flag declining performance patterns before they result in course failures',
      'Increase student engagement and completion rates with gamified progress tracking and content recommendations that keep learners motivated and on track',
    ],
    pricing: {
      basic: '$6/student/mo',
      pro: '$12/student/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-powered-personalized-learning-edtech-platform',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'school',
    href: '/services/ai-powered-personalized-learning-edtech-platform',
    popular: true,
    category: 'ai',
    industry: 'Education/EdTech',
    stage: 'published',
  },
  {
    id: 'ai-food-safety-quality-inspection',
    title: 'AI Food Safety & Quality Inspection',
    description:
      'Computer vision food inspection, contamination detection, expiry prediction, and compliance reporting powered by AI to ensure food safety and quality at scale.',
    features: [
      'Computer vision food inspection using high-resolution cameras and deep learning models to detect visual defects, foreign objects, discoloration, and packaging anomalies on production lines',
      'Contamination detection system that identifies biological, chemical, and physical contaminants including bacteria, mold, metal fragments, and plastic debris with 99.5% accuracy',
      'Expiry prediction engine analyzing production data, storage conditions, ingredient profiles, and environmental factors to forecast product shelf life with precise date recommendations',
      'Compliance reporting dashboard that automatically generates audit-ready reports aligned with FDA, FSMA, HACCP, and international food safety standards with full traceability',
      'Real-time alert system that triggers immediate notifications when contamination or quality deviations are detected, enabling rapid response and product holds before shipment',
      'Batch tracking and traceability module linking inspection data to specific production batches, suppliers, and distribution channels for end-to-end supply chain visibility',
    ],
    benefits: [
      'Reduce food safety incidents by 90% through AI-powered inspection that catches defects and contaminants human inspectors miss due to fatigue or speed constraints',
      'Minimize product waste and recalls with early detection that prevents contaminated products from reaching consumers and triggering costly regulatory actions',
      'Ensure regulatory compliance with automated reporting that eliminates manual documentation errors and prepares audit trails for FDA and international inspections',
      'Optimize product shelf life with AI-driven expiry predictions that reduce unnecessary waste while maintaining safety margins and consumer trust',
      'Scale quality inspection capacity without adding headcount by automating visual checks that process thousands of items per minute with consistent accuracy',
    ],
    pricing: {
      basic: '$1,299/mo',
      pro: '$3,499/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/ai-food-safety-quality-inspection',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'food-apple',
    href: '/services/ai-food-safety-quality-inspection',
    category: 'ai',
    industry: 'Food & Beverage',
    stage: 'published',
  },
];

// IT Services (1)
export const wave242ItServices: Service[] = [
  {
    id: 'database-performance-tuning-optimization',
    title: 'Database Performance Tuning & Optimization',
    description:
      'Query optimization, index management, replication setup, and capacity planning for high-performance database infrastructure across all major database platforms.',
    features: [
      'Query optimization service that analyzes slow-running queries, identifies inefficient execution plans, and rewrites SQL statements to reduce response times by up to 80%',
      'Index management automation that recommends optimal index structures, removes redundant indexes wasting storage, and implements composite indexes for complex query patterns',
      'Replication setup and configuration for high-availability architectures including master-slave, multi-master, and distributed database topologies with automatic failover',
      'Capacity planning analysis that models current growth trends, forecasts storage and compute requirements, and recommends scaling strategies to prevent performance bottlenecks',
      'Database health monitoring with real-time dashboards tracking query latency, connection pool utilization, cache hit rates, storage I/O, and lock contention across all database instances',
      'Performance audit service delivering comprehensive assessments with prioritized optimization recommendations, benchmark comparisons, and implementation roadmaps tailored to your workload',
    ],
    benefits: [
      'Achieve 10x faster query performance through expert optimization that eliminates full table scans, reduces I/O overhead, and maximizes index utilization',
      'Ensure 99.99% database availability with properly configured replication, automated failover, and disaster recovery testing that minimizes downtime risk',
      'Reduce infrastructure costs by 30-50% through rightsizing recommendations and storage optimization that eliminates over-provisioning without sacrificing performance',
      'Scale confidently with capacity planning that accurately forecasts resource needs and prevents costly emergency scaling events during traffic spikes',
      'Free your engineering team from database tuning expertise requirements so they can focus on building products instead of firefighting database performance issues',
    ],
    pricing: {
      basic: '$799/mo',
      pro: '$1,999/mo',
      enterprise: 'Custom',
    },
    contactInfo: {
      website: '/services/database-performance-tuning-optimization',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'database-cog',
    href: '/services/database-performance-tuning-optimization',
    popular: true,
    category: 'it',
    industry: 'Database Administration',
    stage: 'published',
  },
];

// Micro-SaaS Services (2)
export const wave242MicroSaasServices: Service[] = [
  {
    id: 'micro-saas-waitlist-booking-queue',
    title: 'Micro-SaaS Waitlist & Booking Queue',
    description:
      'Virtual waiting room, queue management, priority booking, and SMS notifications for service businesses to manage customer flow and reduce no-shows.',
    features: [
      'Virtual waiting room with real-time queue position display, estimated wait times, and customer progress tracking accessible via web or mobile browser without app downloads',
      'Queue management dashboard for staff with drag-and-drop prioritization, walk-in handling, appointment integration, and multi-location queue coordination from a single interface',
      'Priority booking system allowing VIP customers, members, or premium subscribers to reserve spots, skip ahead, or receive preferential scheduling with configurable rules',
      'SMS and email notification engine that alerts customers when their turn approaches, confirms bookings, sends reminders, and handles cancellations with automatic next-in-line promotion',
      'Analytics and reporting suite tracking average wait times, no-show rates, peak hours, customer throughput, and service completion times to optimize staffing and scheduling',
      'Embeddable widget and API for seamless integration with existing booking systems, CRM platforms, website check-in flows, and digital signage displays',
    ],
    benefits: [
      'Reduce customer no-shows by 40% with automated reminders and real-time notifications that keep customers informed and engaged while they wait',
      'Improve customer satisfaction with transparent wait times and queue visibility that eliminates the frustration of indefinite waiting and uncertain service expectations',
      'Optimize staff utilization with data-driven scheduling that matches workforce allocation to predicted customer flow patterns and peak demand periods',
      'Increase revenue capture by converting walk-ins into scheduled bookings and reducing customer abandonment that occurs with unmanaged wait times',
      'Deploy queue management in hours with embeddable widgets and pre-built integrations that eliminate the need for custom development or infrastructure changes',
    ],
    pricing: {
      basic: '$39/mo',
      pro: '$89/mo',
      enterprise: '$199/mo',
    },
    contactInfo: {
      website: '/services/micro-saas-waitlist-booking-queue',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'account-clock',
    href: '/services/micro-saas-waitlist-booking-queue',
    category: 'micro-saas',
    industry: 'Hospitality/Healthcare',
    stage: 'published',
  },
  {
    id: 'micro-saas-pricing-discount-manager',
    title: 'Micro-SaaS Pricing & Discount Manager',
    description:
      'Dynamic pricing rules, discount codes, tiered pricing, and promotion analytics for e-commerce and retail businesses to maximize revenue and conversion rates.',
    features: [
      'Dynamic pricing engine that automatically adjusts product prices based on demand, inventory levels, competitor pricing, time of day, and customer segment with configurable rules and guardrails',
      'Discount code management system supporting percentage discounts, fixed amounts, buy-one-get-one, bundle pricing, and usage-limited codes with expiration dates and per-customer limits',
      'Tiered pricing builder creating volume-based price breaks, wholesale tiers, and customer group pricing with automatic tier assignment based on order history or account type',
      'Promotion analytics dashboard tracking discount redemption rates, revenue impact, customer acquisition cost per promotion, and ROI comparison across all active campaigns',
      'A/B testing framework for pricing experiments that runs parallel pricing strategies, measures conversion impact, and identifies optimal price points with statistical confidence',
      'Integration hub connecting with major e-commerce platforms, payment processors, and ERP systems for real-time price synchronization and unified promotion management',
    ],
    benefits: [
      'Increase average order value by 25% through intelligent tiered pricing and bundle promotions that incentivize larger purchases without eroding margins',
      'Reduce pricing errors and conflicts with centralized discount management that prevents overlapping promotions and ensures consistent pricing across all sales channels',
      'Optimize promotion spend with analytics that reveal which discounts drive genuine new revenue versus simply giving away margin to customers who would have purchased anyway',
      'Respond to market conditions in real time with dynamic pricing that captures demand surges during peak periods and maintains competitiveness during slow periods',
      'Simplify pricing operations with automated rule enforcement that eliminates manual price updates and reduces the risk of costly pricing mistakes across large catalogs',
    ],
    pricing: {
      basic: '$29/mo',
      pro: '$69/mo',
      enterprise: '$149/mo',
    },
    contactInfo: {
      website: '/services/micro-saas-pricing-discount-manager',
      email: 'kleber@ziontechgroup.com',
      phone: '+1 302 464 0950',
    },
    icon: 'tag-multiple',
    href: '/services/micro-saas-pricing-discount-manager',
    category: 'micro-saas',
    industry: 'E-Commerce/Retail',
    stage: 'published',
  },
];
