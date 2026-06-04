// Wave 185 services - OWL
// 4 new services across 4 categories

import { Service } from './serviceTypes';

export const wave185MicroSaasServices: Service[] = [
  {
    id: 'microsaas-project-management',
    title: 'ProjectHub - Project Management',
    category: 'micro-saas',
    industry: 'Productivity',
    description: 'Intuitive project management platform with Kanban boards, Gantt charts, time tracking, and team collaboration features. Built for small to mid-size teams.',
    features: ["Kanban Boards", "Gantt Charts", "Time Tracking", "Team Collaboration", "Custom Workflows"],
    benefits: ["Improve team productivity", "Visualize project progress", "Streamline collaboration"],
    pricing: {"basic": "$19/mo", "pro": "$49/mo", "enterprise": "$99/mo"},
    contactInfo: {"website": "https://ziontechgroup.com", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    icon: "project",
    href: "/services/microsaas-project-management",
    stage: "published",
  },
  {
    id: 'microsaas-customer-portal',
    title: 'ClientPortal - Customer Portal',
    category: 'micro-saas',
    industry: 'Customer Success',
    description: 'White-label customer portal with ticket management, knowledge base, billing overview, and self-service options. Reduces support load while improving customer satisfaction.',
    features: ["Ticket Management", "Knowledge Base", "Billing Overview", "Self-service Options", "Custom Branding"],
    benefits: ["Reduce support tickets 40%", "Improve customer satisfaction", "White-label ready"],
    pricing: {"basic": "$39/mo", "pro": "$99/mo", "enterprise": "$199/mo"},
    contactInfo: {"website": "https://ziontechgroup.com", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    icon: "portal",
    href: "/services/microsaas-customer-portal",
    stage: "published",
  },
];

export const wave185CloudServices: Service[] = [
  {
    id: 'cloud-cost-optimization',
    title: 'Cloud Cost Optimization Service',
    category: 'cloud',
    industry: 'FinOps',
    description: 'Expert cloud cost optimization service including resource right-sizing, reserved instance planning, waste elimination, and FinOps governance implementation.',
    features: ["Resource Right-sizing", "Reserved Instance Planning", "Waste Elimination", "FinOps Governance", "Monthly Reporting"],
    benefits: ["Reduce cloud costs 40%", "Optimize resource usage", "Implement FinOps practices"],
    pricing: {"basic": "$1,500/mo", "pro": "$4,000/mo", "enterprise": "Custom"},
    contactInfo: {"website": "https://ziontechgroup.com", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    icon: "cost",
    href: "/services/cloud-cost-optimization",
    stage: "published",
  },
];

export const wave185DataServices: Service[] = [
  {
    id: 'data-data-lake-platform',
    title: 'Data Lake Platform',
    category: 'data',
    industry: 'Data Engineering',
    description: 'Managed data lake platform with ingestion, cataloging, governance, and analytics capabilities. Supports structured and semi-structured data at scale.',
    features: ["Data Ingestion", "Data Cataloging", "Data Governance", "Analytics Integration", "Schema Management"],
    benefits: ["Centralize data storage", "Enable analytics at scale", "Govern data access"],
    pricing: {"basic": "$499/mo", "pro": "$1,499/mo", "enterprise": "Custom"},
    contactInfo: {"website": "https://ziontechgroup.com", "email": "kleber@ziontechgroup.com", "phone": "+1 302 464 0950"},
    icon: "lake",
    href: "/services/data-data-lake-platform",
    stage: "published",
  },
];
