'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────

type LeadStatus = 'new' | 'contacted' | 'replied' | 'qualified' | 'converted' | 'lost';
type Priority = 'hot' | 'warm' | 'cold';
type CompanySize = 'SMB' | 'Mid-Market' | 'Enterprise';
type DecisionTimeline = 'Immediate' | '1-3 months' | '3-6 months' | '6+ months';
type BudgetRange = '$1K-$10K' | '$10K-$50K' | '$50K-$100K' | '$100K+';

interface Lead {
  id: string;
  company: string;
  contact: string;
  email: string;
  source: string;
  industry: string;
  status: LeadStatus;
  score: number;
  notes: string;
  dateFound: string;
  lastContact: string;
  services: string[];
  website?: string;
  painPoints?: string[];
  // Enrichment fields
  linkedin?: string;
  companySize?: CompanySize;
  budgetRange?: BudgetRange;
  decisionTimeline?: DecisionTimeline;
}

interface OutreachTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  industry?: string;
}

interface EmailActivity {
  id: string;
  recipient: string;
  subject: string;
  classification: string;
  timestamp: string;
  status: 'sent' | 'replied' | 'bounced';
}

interface GmailStatus {
  connected: boolean;
  tokenValid: boolean;
  lastSyncTime: string;
  emailsProcessedToday: number;
}

interface FilterPreset {
  id: string;
  name: string;
  filters: {
    status: string;
    industry: string;
    priority: string;
    dateFrom: string;
    dateTo: string;
  };
}

interface PipelineStage {
  label: string;
  count: number;
  total: number;
  color: string;
  avgDaysInStage: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPriority(score: number): Priority {
  if (score >= 80) return 'hot';
  if (score >= 60) return 'warm';
  return 'cold';
}

function getPriorityConfig(priority: Priority) {
  switch (priority) {
    case 'hot':
      return { emoji: '🔥', label: 'Hot', bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30' };
    case 'warm':
      return { emoji: '🌡️', label: 'Warm', bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30' };
    case 'cold':
      return { emoji: '❄️', label: 'Cold', bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' };
  }
}

function revenuePotential(lead: Lead): number {
  const base = lead.industry === 'FinTech' || lead.industry === 'Banking' ? 80000 :
    lead.industry === 'Healthcare' || lead.industry === 'Healthcare IT' ? 60000 :
    lead.industry === 'Cybersecurity' ? 70000 :
    lead.industry === 'Cloud' ? 50000 : 30000;
  return Math.round((lead.score / 100) * base);
}

// ─── Sample data ─────────────────────────────────────────────────────────────

const INDUSTRIES = ['all', 'SaaS', 'Healthcare', 'Retail', 'FinTech', 'Cloud', 'EdTech', 'Banking', 'Logistics', 'Healthcare IT', 'Retail/E-commerce', 'Cybersecurity', 'Insurance', 'Legal Tech', 'Real Estate Tech', 'Manufacturing', 'AI/Voice', 'AI/Chatbot', 'AI/Platform', 'Cloud/AI', 'Cloud/Monitoring', 'AI/Discovery'];

const MANUAL_LEADS: Lead[] = [
  { id: 'l001', company: 'TechStart Inc', contact: 'Sarah Chen', email: 'sarah@techstart.io', source: 'LinkedIn', industry: 'SaaS', status: 'new', score: 85, notes: 'Looking for AI chatbot solution', dateFound: '2026-06-10', lastContact: '', services: ['AI Chatbot Builder', 'AI Customer Support Copilot'], website: 'https://techstart.io', linkedin: 'https://linkedin.com/company/techstart', companySize: 'SMB', budgetRange: '$10K-$50K', decisionTimeline: '1-3 months' },
  { id: 'l002', company: 'MedFlow Health', contact: 'Dr. James Wilson', email: 'jwilson@medflow.com', source: 'Referral', industry: 'Healthcare', status: 'contacted', score: 92, notes: 'Needs patient scheduling AI + HIPAA compliance', dateFound: '2026-06-09', lastContact: '2026-06-11', services: ['AI Patient Scheduling', 'AI Clinical Trial Matching'], website: 'https://medflow.com', linkedin: 'https://linkedin.com/company/medflow', companySize: 'Mid-Market', budgetRange: '$50K-$100K', decisionTimeline: 'Immediate' },
  { id: 'l003', company: 'RetailMax Corp', contact: 'Maria Garcia', email: 'mgarcia@retailmax.com', source: 'LinkedIn', industry: 'Retail', status: 'replied', score: 78, notes: 'Interested in personalization engine', dateFound: '2026-06-08', lastContact: '2026-06-10', services: ['AI Retail Personalization', 'Subscription Analytics'], website: 'https://retailmax.com', linkedin: 'https://linkedin.com/company/retailmax', companySize: 'Enterprise', budgetRange: '$100K+', decisionTimeline: '3-6 months' },
  { id: 'l004', company: 'FinanceHub', contact: 'Robert Kim', email: 'rkim@financehub.io', source: 'LinkedIn', industry: 'FinTech', status: 'qualified', score: 95, notes: 'Ready to sign for fraud detection + financial close automation', dateFound: '2026-06-07', lastContact: '2026-06-11', services: ['AI Fraud Detection', 'AI Financial Close Automation'], website: 'https://financehub.io', linkedin: 'https://linkedin.com/company/financehub', companySize: 'Mid-Market', budgetRange: '$50K-$100K', decisionTimeline: 'Immediate' },
  { id: 'l005', company: 'CloudScale Systems', contact: 'Alex Turner', email: 'aturner@cloudscale.io', source: 'LinkedIn', industry: 'Cloud', status: 'new', score: 88, notes: 'Needs cloud cost optimization + DRaaS', dateFound: '2026-06-11', lastContact: '', services: ['Cloud Cost Optimization', 'DRaaS'], website: 'https://cloudscale.io', companySize: 'Enterprise', budgetRange: '$100K+', decisionTimeline: '1-3 months' },
  { id: 'l006', company: 'EduLearn Platform', contact: 'Lisa Park', email: 'lpark@edulearn.com', source: 'Referral', industry: 'EdTech', status: 'contacted', score: 82, notes: 'Looking for personalized learning platform', dateFound: '2026-06-09', lastContact: '2026-06-10', services: ['AI Personalized Learning', 'AI Form Builder'], website: 'https://edulearn.com', companySize: 'SMB', budgetRange: '$10K-$50K', decisionTimeline: '3-6 months' },
  { id: 'l007', company: 'SecureBank', contact: 'Michael Brown', email: 'mbrown@securebank.com', source: 'LinkedIn', industry: 'Banking', status: 'new', score: 90, notes: 'Needs MDR 24/7 + zero trust network', dateFound: '2026-06-11', lastContact: '', services: ['MDR 24/7', 'Zero Trust Network Access'], website: 'https://securebank.com', linkedin: 'https://linkedin.com/company/securebank', companySize: 'Enterprise', budgetRange: '$100K+', decisionTimeline: 'Immediate' },
  { id: 'l008', company: 'LogiTrans', contact: 'David Lee', email: 'dlee@logitrans.com', source: 'LinkedIn', industry: 'Logistics', status: 'contacted', score: 75, notes: 'Interested in supply chain risk intelligence', dateFound: '2026-06-08', lastContact: '2026-06-09', services: ['AI Supply Chain Risk', 'Predictive Maintenance IoT'], website: 'https://logitrans.com', companySize: 'Mid-Market', budgetRange: '$50K-$100K', decisionTimeline: '1-3 months' },
];

const DISCOVERED_LEADS: Lead[] = [
  { id: 'd001', company: 'HealthTech Solutions', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Healthcare IT', status: 'new', score: 72, notes: 'Healthcare IT company seeking AI solutions for patient analytics', dateFound: '2026-06-12', lastContact: '', services: ['AI Patient Scheduling', 'AI Clinical Trial Matching'], painPoints: ['EHR integration', 'patient data analytics', 'HIPAA compliance'], companySize: 'Mid-Market', budgetRange: '$50K-$100K', decisionTimeline: '1-3 months' },
  { id: 'd002', company: 'PayGuard Financial', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'FinTech', status: 'new', score: 68, notes: 'FinTech company exploring AI fraud detection and compliance automation', dateFound: '2026-06-12', lastContact: '', services: ['AI Fraud Detection', 'AI Financial Close Automation'], painPoints: ['fraud detection', 'compliance AI', 'AML'], companySize: 'SMB', budgetRange: '$10K-$50K', decisionTimeline: '3-6 months' },
  { id: 'd003', company: 'ShopSmart AI', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Retail/E-commerce', status: 'new', score: 65, notes: 'E-commerce platform looking for AI personalization and recommendation engine', dateFound: '2026-06-12', lastContact: '', services: ['AI Retail Personalization', 'Subscription Analytics'], painPoints: ['recommendation engine', 'churn prediction', 'dynamic pricing'], companySize: 'SMB', budgetRange: '$10K-$50K', decisionTimeline: '1-3 months' },
  { id: 'd004', company: 'EduVance Learning', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'EdTech', status: 'new', score: 63, notes: 'EdTech company seeking adaptive learning and automated grading solutions', dateFound: '2026-06-12', lastContact: '', services: ['AI Personalized Learning', 'AI Form Builder'], painPoints: ['personalized learning', 'automated grading', 'engagement AI'], companySize: 'SMB', budgetRange: '$1K-$10K', decisionTimeline: '3-6 months' },
  { id: 'd005', company: 'LogiFlow Systems', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Logistics', status: 'new', score: 61, notes: 'Logistics company exploring AI route optimization and demand forecasting', dateFound: '2026-06-12', lastContact: '', services: ['AI Supply Chain Risk', 'Predictive Maintenance IoT'], painPoints: ['route optimization', 'demand forecasting', 'predictive maintenance'], companySize: 'Mid-Market', budgetRange: '$10K-$50K', decisionTimeline: '6+ months' },
  { id: 'd006', company: 'MediCore Health', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Healthcare IT', status: 'new', score: 70, notes: 'Healthcare organization seeking clinical decision support AI', dateFound: '2026-06-12', lastContact: '', services: ['AI Clinical Trial Matching', 'AI Patient Scheduling'], painPoints: ['clinical decision support', 'AI diagnostics', 'operational efficiency'], companySize: 'Enterprise', budgetRange: '$100K+', decisionTimeline: '3-6 months' },
  { id: 'd007', company: 'FinSecure Global', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'FinTech', status: 'new', score: 67, notes: 'Financial services firm exploring AI risk assessment and credit scoring', dateFound: '2026-06-12', lastContact: '', services: ['AI Fraud Detection', 'AI Financial Close Automation'], painPoints: ['risk assessment', 'credit scoring', 'regulatory compliance'], companySize: 'Mid-Market', budgetRange: '$50K-$100K', decisionTimeline: '1-3 months' },
  { id: 'd008', company: 'RetailHub Pro', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Retail/E-commerce', status: 'new', score: 62, notes: 'Retail company seeking AI inventory management and customer segmentation', dateFound: '2026-06-12', lastContact: '', services: ['AI Retail Personalization', 'Subscription Analytics'], painPoints: ['inventory AI', 'customer segmentation', 'conversion optimization'], companySize: 'SMB', budgetRange: '$10K-$50K', decisionTimeline: '3-6 months' },
  { id: 'd009', company: 'LearnTech Academy', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'EdTech', status: 'new', score: 59, notes: 'Education platform looking for AI tutor and content generation', dateFound: '2026-06-12', lastContact: '', services: ['AI Personalized Learning', 'AI Form Builder'], painPoints: ['AI tutor', 'content generation', 'student analytics'], companySize: 'SMB', budgetRange: '$1K-$10K', decisionTimeline: '6+ months' },
  { id: 'd010', company: 'ChainSync Logistics', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Logistics', status: 'new', score: 58, notes: 'Supply chain company exploring predictive maintenance and risk intelligence', dateFound: '2026-06-12', lastContact: '', services: ['AI Supply Chain Risk', 'Predictive Maintenance IoT'], painPoints: ['predictive maintenance', 'supply chain visibility', 'risk intelligence'], companySize: 'Mid-Market', budgetRange: '$50K-$100K', decisionTimeline: '3-6 months' },
  { id: 'd011', company: 'CyberShield Inc', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Cybersecurity', status: 'new', score: 66, notes: 'Cybersecurity company seeking AI threat detection and SIEM solutions', dateFound: '2026-06-12', lastContact: '', services: ['MDR 24/7', 'Zero Trust Network Access'], painPoints: ['threat detection', 'SIEM AI', 'zero trust'], companySize: 'Mid-Market', budgetRange: '$50K-$100K', decisionTimeline: '1-3 months' },
  { id: 'd012', company: 'InsureTech Pro', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Insurance', status: 'new', score: 64, notes: 'Insurance company exploring AI claims processing and risk scoring', dateFound: '2026-06-12', lastContact: '', services: ['AI Fraud Detection', 'AI Financial Close Automation'], painPoints: ['claims automation', 'risk scoring', 'fraud detection'], companySize: 'SMB', budgetRange: '$10K-$50K', decisionTimeline: '3-6 months' },
  { id: 'd013', company: 'LegalAI Systems', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Legal Tech', status: 'new', score: 60, notes: 'Legal tech company seeking AI contract analysis and compliance', dateFound: '2026-06-12', lastContact: '', services: ['AI Document Processing Pipeline', 'AI Compliance Monitor'], painPoints: ['contract analysis', 'legal research AI', 'compliance'], companySize: 'SMB', budgetRange: '$10K-$50K', decisionTimeline: 'Immediate' },
  { id: 'd014', company: 'PropTech Valuations', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Real Estate Tech', status: 'new', score: 57, notes: 'Real estate tech company exploring AI property valuation and market prediction', dateFound: '2026-06-12', lastContact: '', services: ['AI Predictive Churn Analytics', 'Subscription Analytics'], painPoints: ['property valuation AI', 'market prediction', 'virtual tours'], companySize: 'SMB', budgetRange: '$1K-$10K', decisionTimeline: '6+ months' },
  { id: 'd015', company: 'FactoryAI Manufacturing', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Manufacturing', status: 'new', score: 69, notes: 'Manufacturing company seeking Industry 4.0 AI and predictive maintenance', dateFound: '2026-06-12', lastContact: '', services: ['Predictive Maintenance IoT', 'AI Supply Chain Risk'], painPoints: ['predictive maintenance', 'quality AI', 'digital twin'], companySize: 'Enterprise', budgetRange: '$100K+', decisionTimeline: '3-6 months' },
  { id: 'd016', company: 'MedVista Health Systems', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Healthcare IT', status: 'new', score: 71, notes: 'Healthcare IT provider exploring AI-powered clinical documentation and EHR optimization', dateFound: '2026-06-12', lastContact: '', services: ['AI Patient Scheduling', 'AI Clinical Trial Matching'], painPoints: ['EHR integration', 'clinical documentation AI', 'interoperability'], companySize: 'Enterprise', budgetRange: '$100K+', decisionTimeline: '3-6 months' },
  { id: 'd017', company: 'ClearPay FinTech', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'FinTech', status: 'new', score: 66, notes: 'Payment processing company seeking AI transaction monitoring and regulatory reporting automation', dateFound: '2026-06-12', lastContact: '', services: ['AI Fraud Detection', 'AI Financial Close Automation'], painPoints: ['transaction monitoring', 'regulatory reporting', 'payment fraud'], companySize: 'SMB', budgetRange: '$10K-$50K', decisionTimeline: '1-3 months' },
  { id: 'd018', company: 'StyleNest Commerce', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Retail/E-commerce', status: 'new', score: 64, notes: 'Fashion e-commerce platform looking for AI-driven product recommendations and visual search', dateFound: '2026-06-12', lastContact: '', services: ['AI Retail Personalization', 'Subscription Analytics'], painPoints: ['visual search', 'product recommendations', 'return rate reduction'], companySize: 'SMB', budgetRange: '$10K-$50K', decisionTimeline: '1-3 months' },
  { id: 'd019', company: 'SkillForge Academy', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'EdTech', status: 'new', score: 62, notes: 'Online learning platform seeking AI skill-gap analysis and adaptive curriculum generation', dateFound: '2026-06-12', lastContact: '', services: ['AI Personalized Learning', 'AI Form Builder'], painPoints: ['skill-gap analysis', 'curriculum automation', 'learner retention'], companySize: 'SMB', budgetRange: '$1K-$10K', decisionTimeline: '6+ months' },
  { id: 'd020', company: 'FreightWise Global', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Logistics', status: 'new', score: 60, notes: 'Freight forwarding company exploring AI shipment tracking and customs documentation automation', dateFound: '2026-06-12', lastContact: '', services: ['AI Supply Chain Risk', 'Predictive Maintenance IoT'], painPoints: ['shipment tracking', 'customs automation', 'carrier optimization'], companySize: 'Mid-Market', budgetRange: '$50K-$100K', decisionTimeline: '3-6 months' },
  { id: 'd021', company: 'SentinelOne Defense', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Cybersecurity', status: 'new', score: 73, notes: 'Cybersecurity firm seeking AI-powered endpoint detection and automated incident response', dateFound: '2026-06-12', lastContact: '', services: ['MDR 24/7', 'Zero Trust Network Access'], painPoints: ['endpoint detection', 'incident response automation', 'threat hunting'], companySize: 'Enterprise', budgetRange: '$100K+', decisionTimeline: 'Immediate' },
  { id: 'd022', company: 'PolicyBridge Insurance', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Insurance', status: 'new', score: 65, notes: 'Insurance brokerage exploring AI underwriting automation and customer risk profiling', dateFound: '2026-06-12', lastContact: '', services: ['AI Fraud Detection', 'AI Financial Close Automation'], painPoints: ['underwriting automation', 'risk profiling', 'policy administration'], companySize: 'Mid-Market', budgetRange: '$50K-$100K', decisionTimeline: '3-6 months' },
  { id: 'd023', company: 'LexiCounsel Partners', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Legal Tech', status: 'new', score: 58, notes: 'Legal tech startup seeking AI legal research automation and deposition summarization', dateFound: '2026-06-12', lastContact: '', services: ['AI Document Processing Pipeline', 'AI Compliance Monitor'], painPoints: ['legal research AI', 'deposition summarization', 'case law analysis'], companySize: 'SMB', budgetRange: '$1K-$10K', decisionTimeline: '3-6 months' },
  { id: 'd024', company: 'UrbanNest Realty Tech', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Real Estate Tech', status: 'new', score: 56, notes: 'PropTech company exploring AI rental price optimization and tenant screening automation', dateFound: '2026-06-12', lastContact: '', services: ['AI Predictive Churn Analytics', 'Subscription Analytics'], painPoints: ['rental pricing AI', 'tenant screening', 'property management automation'], companySize: 'SMB', budgetRange: '$1K-$10K', decisionTimeline: '6+ months' },
  { id: 'd025', company: 'PrecisionWorks Manufacturing', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Manufacturing', status: 'new', score: 67, notes: 'Industrial manufacturer seeking AI-powered quality inspection and production line optimization', dateFound: '2026-06-12', lastContact: '', services: ['Predictive Maintenance IoT', 'AI Supply Chain Risk'], painPoints: ['quality inspection AI', 'production optimization', 'defect detection'], companySize: 'Enterprise', budgetRange: '$100K+', decisionTimeline: '3-6 months' },
  { id: 'd026', company: 'HealthBridge Analytics', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Healthcare IT', status: 'new', score: 74, notes: 'Healthcare analytics firm exploring AI population health management and readmission prediction', dateFound: '2026-06-12', lastContact: '', services: ['AI Clinical Trial Matching', 'AI Patient Scheduling'], painPoints: ['population health AI', 'readmission prediction', 'care coordination'], companySize: 'Mid-Market', budgetRange: '$50K-$100K', decisionTimeline: '1-3 months' },
  { id: 'd027', company: 'VaultEdge Capital', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'FinTech', status: 'new', score: 63, notes: 'Wealth management platform seeking AI portfolio optimization and client risk assessment', dateFound: '2026-06-12', lastContact: '', services: ['AI Fraud Detection', 'AI Financial Close Automation'], painPoints: ['portfolio optimization', 'client risk assessment', 'regulatory compliance'], companySize: 'Mid-Market', budgetRange: '$50K-$100K', decisionTimeline: '3-6 months' },
  { id: 'd028', company: 'CartLoop Retail', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Retail/E-commerce', status: 'new', score: 61, notes: 'D2C brand platform exploring AI cart abandonment recovery and customer lifetime value prediction', dateFound: '2026-06-12', lastContact: '', services: ['AI Retail Personalization', 'Subscription Analytics'], painPoints: ['cart abandonment', 'CLV prediction', 'omnichannel personalization'], companySize: 'SMB', budgetRange: '$10K-$50K', decisionTimeline: '1-3 months' },
  { id: 'd029', company: 'BrightPath Education', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'EdTech', status: 'new', score: 59, notes: 'K-12 edtech company seeking AI attendance tracking and early intervention prediction', dateFound: '2026-06-12', lastContact: '', services: ['AI Personalized Learning', 'AI Form Builder'], painPoints: ['attendance tracking', 'early intervention', 'parent engagement'], companySize: 'SMB', budgetRange: '$1K-$10K', decisionTimeline: '6+ months' },
  { id: 'd030', company: 'PortLink Maritime', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Logistics', status: 'new', score: 57, notes: 'Maritime logistics company exploring AI port congestion prediction and vessel routing optimization', dateFound: '2026-06-12', lastContact: '', services: ['AI Supply Chain Risk', 'Predictive Maintenance IoT'], painPoints: ['port congestion', 'vessel routing', 'fuel optimization'], companySize: 'Mid-Market', budgetRange: '$50K-$100K', decisionTimeline: '6+ months' },
  { id: 'd031', company: 'CyberFortress Security', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Cybersecurity', status: 'new', score: 70, notes: 'Managed security provider seeking AI vulnerability prioritization and automated patch management', dateFound: '2026-06-12', lastContact: '', services: ['MDR 24/7', 'Zero Trust Network Access'], painPoints: ['vulnerability prioritization', 'patch management', 'security posture'], companySize: 'Mid-Market', budgetRange: '$50K-$100K', decisionTimeline: 'Immediate' },
  { id: 'd032', company: 'SureGuard Underwriters', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Insurance', status: 'new', score: 62, notes: 'Commercial insurance provider exploring AI claims adjudication and subrogation detection', dateFound: '2026-06-12', lastContact: '', services: ['AI Fraud Detection', 'AI Financial Close Automation'], painPoints: ['claims adjudication', 'subrogation detection', 'loss reserving'], companySize: 'Mid-Market', budgetRange: '$10K-$50K', decisionTimeline: '3-6 months' },
  { id: 'd033', company: 'ContractMind Legal', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Legal Tech', status: 'new', score: 55, notes: 'Contract lifecycle management platform seeking AI clause extraction and obligation tracking', dateFound: '2026-06-12', lastContact: '', services: ['AI Document Processing Pipeline', 'AI Compliance Monitor'], painPoints: ['clause extraction', 'obligation tracking', 'contract risk scoring'], companySize: 'SMB', budgetRange: '$1K-$10K', decisionTimeline: '6+ months' },
  { id: 'd034', company: 'HomeSphere PropTech', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Real Estate Tech', status: 'new', score: 54, notes: 'Smart home real estate platform exploring AI energy efficiency scoring and maintenance prediction', dateFound: '2026-06-12', lastContact: '', services: ['AI Predictive Churn Analytics', 'Subscription Analytics'], painPoints: ['energy scoring', 'maintenance prediction', 'smart home integration'], companySize: 'SMB', budgetRange: '$1K-$10K', decisionTimeline: '6+ months' },
  { id: 'd035', company: 'AutoMate Industrial', contact: 'Discovery', email: '', source: 'LinkedIn', industry: 'Manufacturing', status: 'new', score: 68, notes: 'Automotive parts manufacturer seeking AI robotic process automation and supply chain digitization', dateFound: '2026-06-12', lastContact: '', services: ['Predictive Maintenance IoT', 'AI Supply Chain Risk'], painPoints: ['robotic automation', 'supply chain digitization', 'yield optimization'], companySize: 'Enterprise', budgetRange: '$100K+', decisionTimeline: '3-6 months' },
  // ── Email Partnership Leads (auto-discovered from inbox) ──
  { id: 'e001', company: 'RetellAI', contact: 'Evy AI', email: 'support@retellai.com', source: 'Email Partnership', industry: 'AI/Voice', status: 'replied', score: 92, notes: 'Voice AI platform — partnership opportunity for conversational AI agents. Interested in agency partnership, white-label, co-development.', dateFound: '2026-06-12', lastContact: '2026-06-12', services: ['AI Voice Agent', 'AI Customer Support Copilot', 'AI Code Review Copilot'], website: 'https://retellai.com', companySize: 'Mid-Market', budgetRange: '$50K-$100K', decisionTimeline: '1-3 months' },
  { id: 'e002', company: 'Stammer.ai', contact: 'A.I. Chatbots', email: 'contact@stammer.ai', source: 'Email Partnership', industry: 'AI/Chatbot', status: 'replied', score: 88, notes: 'AI chatbot platform — partnership for conversational AI and voice-enabled solutions. Multiple email threads showing strong interest.', dateFound: '2026-06-12', lastContact: '2026-06-12', services: ['AI Chatbot Builder', 'AI Voice Agent', 'AI Customer Support Copilot'], website: 'https://stammer.ai', companySize: 'SMB', budgetRange: '$10K-$50K', decisionTimeline: '1-3 months' },
  { id: 'e003', company: 'BotPenguin', contact: 'Partnerships', email: 'contact@botpenguin.com', source: 'Email Partnership', industry: 'AI/Chatbot', status: 'replied', score: 85, notes: 'Chatbot platform with LATAM focus. Partnership opportunity for AI-powered chatbot solutions in Latin American market.', dateFound: '2026-06-12', lastContact: '2026-06-12', services: ['AI Chatbot Builder', 'AI Customer Support Copilot', 'AI Retail Personalization'], website: 'https://botpenguin.com', companySize: 'Mid-Market', budgetRange: '$10K-$50K', decisionTimeline: '1-3 months' },
  { id: 'e004', company: 'Rafay', contact: 'Mike McGuinness', email: 'mmcguinness@rafay.co', source: 'Email Partnership', industry: 'Cloud/AI', status: 'replied', score: 90, notes: 'Kubernetes and AI infrastructure platform. Partnership for AI infrastructure management and MLOps solutions.', dateFound: '2026-06-12', lastContact: '2026-06-12', services: ['Cloud Migration Assessment', 'DevOps Pipeline as a Service', 'MLOps Platform'], website: 'https://rafay.co', companySize: 'Enterprise', budgetRange: '$100K+', decisionTimeline: '1-3 months' },
  { id: 'e005', company: 'Datadog', contact: 'Partnerships', email: 'partners@datadog.zendesk.com', source: 'Email Partnership', industry: 'Cloud/Monitoring', status: 'replied', score: 94, notes: 'Monitoring and security platform. Partnership for AI-powered observability and monitoring solutions.', dateFound: '2026-06-12', lastContact: '2026-06-12', services: ['MDR 24/7', 'Zero Trust Network Access', 'AI Compliance Monitor'], website: 'https://datadoghq.com', companySize: 'Enterprise', budgetRange: '$100K+', decisionTimeline: '3-6 months' },
  { id: 'e006', company: 'Raynmaker', contact: 'Devon', email: 'devon@raynmaker.ai', source: 'Email Partnership', industry: 'AI/Discovery', status: 'replied', score: 87, notes: 'AI discovery platform. Scheduled discovery call. Interested in AI-powered search and discovery solutions.', dateFound: '2026-06-12', lastContact: '2026-06-12', services: ['AI Customer Support Copilot', 'AI Retail Personalization', 'AI Form Builder'], website: 'https://raynmaker.ai', companySize: 'SMB', budgetRange: '$10K-$50K', decisionTimeline: 'Immediate' },
  { id: 'e007', company: 'Pathors', contact: 'Partnerships', email: 'contact@pathors.com', source: 'Email Partnership', industry: 'AI/Platform', status: 'replied', score: 82, notes: 'AI platform partnership opportunity. Interested in co-development and integration.', dateFound: '2026-06-12', lastContact: '2026-06-12', services: ['AI Code Review Copilot', 'AI Compliance Monitor', 'AI Document Processing Pipeline'], website: 'https://pathors.com', companySize: 'SMB', budgetRange: '$10K-$50K', decisionTimeline: '3-6 months' },
  { id: 'e008', company: 'Cartesia', contact: 'Support', email: 'support@cartesia.ai', source: 'Email Partnership', industry: 'AI/Voice', status: 'replied', score: 86, notes: 'AI voice technology platform. Invited to join customer portal. Partnership potential for voice AI solutions.', dateFound: '2026-06-12', lastContact: '2026-06-12', services: ['AI Voice Agent', 'AI Customer Support Copilot'], website: 'https://cartesia.ai', companySize: 'Mid-Market', budgetRange: '$50K-$100K', decisionTimeline: '1-3 months' },
  { id: 'e009', company: 'Pictory', contact: 'Pickford', email: 'fin@pictory.intercom-mail.com', source: 'Email Partnership', industry: 'AI/Platform', status: 'replied', score: 89, notes: 'AI video generation platform. Interested in API access / white-label for embedding into our SMB solutions. Revenue share model possible.', dateFound: '2026-06-12', lastContact: '2026-06-12', services: ['AI Content Moderation', 'AI Retail Personalization'], website: 'https://pictory.ai', companySize: 'Mid-Market', budgetRange: '$50K-$100K', decisionTimeline: '1-3 months' },
  { id: 'e010', company: 'Awaz.ai', contact: 'João Marcos', email: 'joao.marcos@awazai.intercom-mail.com', source: 'Email Partnership', industry: 'AI/Voice', status: 'replied', score: 84, notes: 'AI voice/conversational AI platform. João reached out asking about partnership. Exploring white-label/reseller program for US SMB market.', dateFound: '2026-06-12', lastContact: '2026-06-12', services: ['AI Voice Agent', 'AI Chatbot Builder', 'AI Customer Support Copilot'], website: 'https://awazai.com', companySize: 'SMB', budgetRange: '$10K-$50K', decisionTimeline: '1-3 months' },
];

const ALL_LEADS: Lead[] = [...MANUAL_LEADS, ...DISCOVERED_LEADS];

const OUTREACH_TEMPLATES: OutreachTemplate[] = [
  { id: 't001', name: 'AI Services Introduction', subject: 'Custom AI Solutions for {{company}} — Free Proposal Inside', body: "Hi {{contact}},\n\nI noticed {{company}} is in the {{industry}} space. At Zion Tech Group, we build custom AI solutions that help companies like yours:\n\n• Reduce operational costs by 40-60%\n• Automate repetitive tasks with AI\n• Make data-driven decisions in real-time\n\nWe've helped similar companies implement:\n• {{services}}\n\nWould you be open to a 15-minute call this week to explore how AI could work for {{company}}?\n\nBest regards,\nKleber Garcia\nCEO, Zion Tech Group\n📱 +1 302 464 0950\n📧 kleber@ziontechgroup.com\n🌐 ziontechgroup.com", category: 'Introduction' },
  { id: 't002', name: 'Follow-Up After No Response', subject: 'Following up: AI solutions for {{company}}', body: "Hi {{contact}},\n\nI wanted to follow up on my previous email about AI solutions for {{company}}.\n\nI understand you're busy, so here's a quick summary:\n\n• {{services}}\n\nWe offer a free, no-obligation custom proposal. No strings attached.\n\nWould Thursday or Friday work for a brief 15-minute call?\n\nBest,\nKleber Garcia\nZion Tech Group\n📱 +1 302 464 0950", category: 'Follow-Up' },
  { id: 't003', name: 'Re-Engagement (30 days)', subject: '{{company}} + Zion Tech — New AI capabilities available', body: "Hi {{contact}},\n\nIt's been a while since we last connected. Since then, we've added several new capabilities for {{company}}:\n\n• AI Fraud Detection — reduce fraud losses by 85%\n• AI Financial Close Automation — close books in 2 days instead of 10\n• Cloud Cost Optimization — reduce cloud spend by 30-50%\n\nWould you like to see a quick demo?\n\nBest regards,\nKleber Garcia\nZion Tech Group", category: 'Re-Engagement' },
  { id: 't004', name: 'Qualified Lead — Proposal Request', subject: 'Custom Proposal for {{company}} — Ready to Review', body: "Hi {{contact}},\n\nThank you for your interest in our solutions for {{company}}.\n\nBased on our conversation, I've prepared a custom proposal covering:\n\n• {{services}}\n\nKey deliverables:\n✅ Custom implementation plan\n✅ ROI projection for your specific use case\n✅ Timeline and milestones\n✅ Pricing options (Basic / Pro / Enterprise)\n\nWould you like to schedule a call to walk through it?\n\nBest,\nKleber Garcia\nCEO, Zion Tech Group\n📱 +1 302 464 0950\n📧 kleber@ziontechgroup.com", category: 'Proposal' },
  { id: 't005', name: 'Healthcare AI Introduction', subject: '{{contact}}, AI solutions for {{company}} — 40% cost reduction possible', body: "Hi {{contact}},\n\nI noticed {{company}} is doing impactful work in {{industry}}. At Zion Tech Group, we help healthcare organizations like yours:\n\n• Reduce patient no-shows by 60% with AI scheduling\n• Automate clinical documentation (save 15+ hrs/week per physician)\n• Ensure HIPAA-compliant AI workflows\n\nWe've built custom AI solutions for similar organizations, including patient scheduling copilots, clinical trial matching engines, and medical billing automation.\n\nWould you be open to a 15-minute call this week?\n\nBest regards,\nKleber Garcia\nCEO, Zion Tech Group\n📱 +1 302 464 0950\n📧 kleber@ziontechgroup.com\n🌐 ziontechgroup.com", category: 'Introduction', industry: 'Healthcare' },
  { id: 't006', name: 'FinTech AI Introduction', subject: '{{company}} + AI fraud detection — reduce losses by 85%', body: "Hi {{contact}},\n\n{{company}} is in one of the fastest-moving sectors in tech. At Zion Tech Group, we build AI solutions specifically for FinTech companies:\n\n• Real-time fraud detection (85% reduction in losses)\n• Automated financial close (2 days instead of 10)\n• AI-powered credit risk scoring\n• Regulatory compliance automation\n\nWe've helped similar FinTechs implement these with measurable ROI within 90 days.\n\nWould a brief 15-minute call make sense this week?\n\nBest,\nKleber Garcia\nCEO, Zion Tech Group\n📱 +1 302 464 0950\n📧 kleber@ziontechgroup.com", category: 'Introduction', industry: 'FinTech' },
  { id: 't007', name: 'Retail/E-commerce AI Introduction', subject: 'Boost {{company}} revenue with AI personalization', body: "Hi {{contact}},\n\nE-commerce and retail companies are seeing 30-50% revenue increases with AI personalization. At Zion Tech Group, we build:\n\n• Product recommendation engines (like Amazon's)\n• Dynamic pricing optimization\n• Customer churn prediction\n• Inventory demand forecasting\n\nWe've helped similar {{industry}} companies implement these with clear ROI.\n\nWould you like to see a quick demo of what's possible for {{company}}?\n\nBest regards,\nKleber Garcia\nCEO, Zion Tech Group\n📱 +1 302 464 0950\n📧 kleber@ziontechgroup.com", category: 'Introduction', industry: 'Retail' },
  { id: 't008', name: 'EdTech AI Introduction', subject: 'Personalized learning AI for {{company}}', body: "Hi {{contact}},\n\nThe future of education is personalized. At Zion Tech Group, we build AI solutions for EdTech companies like {{company}}:\n\n• Adaptive learning paths (35% improvement in outcomes)\n• Automated grading and feedback\n• Student engagement prediction\n• Content recommendation engines\n\nWe'd love to show you what's possible. A 15-minute call?\n\nBest,\nKleber Garcia\nCEO, Zion Tech Group\n📱 +1 302 464 0950\n📧 kleber@ziontechgroup.com", category: 'Introduction', industry: 'EdTech' },
  { id: 't009', name: 'Logistics AI Introduction', subject: 'Cut {{company}} logistics costs with AI — 30% savings', body: "Hi {{contact}},\n\nLogistics companies are saving 30%+ on operations with AI. At Zion Tech Group, we build:\n\n• Route optimization (fuel savings up to 25%)\n• Predictive maintenance (reduce downtime 40%)\n• Demand forecasting\n• Supply chain risk intelligence\n\nWould {{company}} benefit from a quick exploration call this week?\n\nBest regards,\nKleber Garcia\nCEO, Zion Tech Group\n📱 +1 302 464 0950\n📧 kleber@ziontechgroup.com", category: 'Introduction', industry: 'Logistics' },
  { id: 't010', name: 'Cybersecurity AI Introduction', subject: '{{company}} + AI threat detection — 24/7 protection', body: "Hi {{contact}},\n\nCyber threats are evolving faster than ever. At Zion Tech Group, we build AI-powered security solutions:\n\n• Real-time threat detection (99.7% accuracy)\n• AI-powered SIEM with anomaly detection\n• Zero Trust Architecture implementation\n• 24/7 Managed Detection & Response\n\nWe've helped similar companies reduce breach response time by 80%.\n\nWould a security assessment call make sense?\n\nBest regards,\nKleber Garcia\nCEO, Zion Tech Group\n📱 +1 302 464 0950\n📧 kleber@ziontechgroup.com", category: 'Introduction', industry: 'Cybersecurity' },
  { id: 't011', name: 'Free AI Audit Offer', subject: 'Free AI readiness audit for {{company}}', body: "Hi {{contact}},\n\nI'm reaching out because we're offering a free AI Readiness Audit to select {{industry}} companies.\n\nThe audit covers:\n\n• Current technology stack assessment\n• AI opportunity identification (quick wins + long-term)\n• ROI estimation for top 3 AI use cases\n• Implementation roadmap\n\nNo cost, no obligation. Takes about 30 minutes to complete.\n\nWould {{company}} be interested?\n\nBest regards,\nKleber Garcia\nCEO, Zion Tech Group\n📱 +1 302 464 0950\n📧 kleber@ziontechgroup.com", category: 'Free Audit' },
  { id: 't012', name: 'Follow-Up #2 (7 days)', subject: '{{contact}}, quick question about {{company}} + AI', body: "Hi {{contact}},\n\nJust one quick question: Is {{company}} currently exploring any AI or automation initiatives?\n\nIf yes, I'd love to share what we're building for similar {{industry}} companies.\n\nIf no, no worries — I'll check back in a few months.\n\nEither way, happy to connect.\n\nBest,\nKleber Garcia\nZion Tech Group\n📱 +1 302 464 0950", category: 'Follow-Up' },
];

// ─── email Activity data ───────────────────────────────────────────────────

const EMAIL_ACTIVITY: EmailActivity[] = [
  { id: 'ea01', recipient: 'support@retellai.com', subject: 'Re: Voice AI Partnership Opportunity', classification: 'partnership', timestamp: '2026-06-12T11:05:00', status: 'sent' },
  { id: 'ea02', recipient: 'contact@stammer.ai', subject: 'Re: Voice AI Partnership Opportunity', classification: 'partnership', timestamp: '2026-06-12T11:06:00', status: 'sent' },
  { id: 'ea03', recipient: 'contact@botpenguin.com', subject: 'Re: Voice AI Partnership - LATAM Focus', classification: 'partnership', timestamp: '2026-06-12T11:07:00', status: 'sent' },
  { id: 'ea04', recipient: 'mmcguinness@rafay.co', subject: 'Re: Partnership Opportunity - AI Infrastructure', classification: 'partnership', timestamp: '2026-06-12T11:08:00', status: 'sent' },
  { id: 'ea05', recipient: 'partners@datadog.zendesk.com', subject: 'Re: Partnership Opportunity - AI Infrastructure Monitoring', classification: 'partnership', timestamp: '2026-06-12T11:09:00', status: 'sent' },
  { id: 'ea06', recipient: 'devon@raynmaker.ai', subject: 'Re: Raynmaker <> Zion Tech Group: AI Discovery Call', classification: 'meeting', timestamp: '2026-06-12T11:10:00', status: 'sent' },
  { id: 'ea07', recipient: 'contact@pathors.com', subject: 'Re: Partnership Opportunity - Pathors & Zion Tech Group', classification: 'partnership', timestamp: '2026-06-12T10:30:00', status: 'sent' },
  { id: 'ea08', recipient: 'sarah@techstart.io', subject: 'Custom AI Solutions for TechStart Inc', classification: 'Introduction', timestamp: '2026-06-12T09:15:00', status: 'sent' },
  { id: 'ea09', recipient: 'jwilson@medflow.com', subject: 'AI Solutions for MedFlow Health', classification: 'Introduction', timestamp: '2026-06-11T14:30:00', status: 'replied' },
  { id: 'ea10', recipient: 'mgarcia@retailmax.com', subject: 'Following up: AI solutions for RetailMax Corp', classification: 'Follow-Up', timestamp: '2026-06-11T10:00:00', status: 'replied' },
  { id: 'ea11', recipient: 'rkim@financehub.io', subject: 'Custom Proposal for FinanceHub', classification: 'Proposal', timestamp: '2026-06-10T16:45:00', status: 'sent' },
  { id: 'ea12', recipient: 'fin@pictory.intercom-mail.com', subject: 'Re: Voice AI Partnership - Zion Tech Group', classification: 'partnership', timestamp: '2026-06-12T19:12:00', status: 'sent' },
  { id: 'ea13', recipient: 'partners+noreply@datadoghq.com', subject: 'Re: AI Security Partnership - Zion Tech Group', classification: 'partnership', timestamp: '2026-06-12T19:12:30', status: 'sent' },
  { id: 'ea14', recipient: 'contact@stammer.ai', subject: 'Re: Partnership Discussion - Next Steps', classification: 'partnership', timestamp: '2026-06-12T19:13:00', status: 'sent' },
  { id: 'ea15', recipient: 'support@retellai.com', subject: 'Re: Partnership Discussion - White-Label Application', classification: 'partnership', timestamp: '2026-06-12T19:14:00', status: 'sent' },
  { id: 'ea16', recipient: 'joao.marcos@awazai.intercom-mail.com', subject: 'Re: Follow-up: Partnership Discussion', classification: 'partnership', timestamp: '2026-06-12T19:15:00', status: 'sent' },
  { id: 'ea17', recipient: 'obrigacoes@nibo.com.br', subject: 'Re: Novos documentos para Kleber (Protocolo 066110-1/26)', classification: 'document', timestamp: '2026-06-12T21:36:00', status: 'sent' },
];

const GMAIL_STATUS: GmailStatus = {
  connected: true,
  tokenValid: true,
  lastSyncTime: '2026-06-12T21:36:00',
  emailsProcessedToday: 17,
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  contacted: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  replied: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  qualified: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  converted: 'bg-green-500/20 text-green-300 border-green-500/30',
  lost: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const STATUS_LABELS: Record<string, string> = {
  new: '🆕 New',
  contacted: '📧 Contacted',
  replied: '💬 Replied',
  qualified: '✅ Qualified',
  converted: '🎉 Converted',
  lost: '❌ Lost',
};

const SMS = ['all', 'SaaS', 'Healthcare', 'Retail', 'FinTech', 'Cloud', 'EdTech', 'Banking', 'Logistics', 'Healthcare IT', 'Retail/E-commerce', 'Cybersecurity', 'Insurance', 'Legal Tech', 'Real Estate Tech', 'Manufacturing'] as const;

const QUICK_REPLY_TEMPLATES = [
  { label: 'Interested — Schedule Call', subject: 'Great! Let\'s Schedule a Call', body: 'Thanks for your interest! Would any of these times work for a quick 15-min call?\n\n• Today 3-5 PM\n• Tomorrow 10-12 PM\n\nBest,\nKleber Garcia' },
  { label: 'Send More Info', subject: 'More Details About Our AI Solutions', body: 'Happy to share more details! Here\'s an overview of what we can build for you:\n\n• Custom AI solution tailored to your needs\n• ROI projection document\n• Implementation timeline\n\nLet me know if you\'d like to schedule a deeper dive!\n\nBest,\nKleber Garcia' },
  { label: 'Not Right Now', subject: 'No Worries — Staying in Touch', body: 'Totally understand — timing isn\'t everything. I\'ll check back in a few weeks.\n\nIn the meantime, feel free to reach out if anything changes.\n\nBest,\nKleber Garcia' },
  { label: 'Wrong Contact', subject: 'Reaching the Right Person', body: 'Thanks for letting me know! Could you point me to the right person for AI/automation initiatives at your company?\n\nBest,\nKleber Garcia' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function LeadsControl() {
  const [leads, setLeads] = useState<Lead[]>(ALL_LEADS);
  const [filter, setFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'discovered' | 'templates' | 'stats' | 'email' | 'analytics' | 'partnerships'>('leads');
  const [currentTime, setCurrentTime] = useState('');
  const [composeTemplate, setComposeTemplate] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [showAddLead, setShowAddLead] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const [filterPresets, setFilterPresets] = useState<FilterPreset[]>([
    { id: 'p1', name: '🔥 Hot Leads', filters: { status: 'all', industry: 'all', priority: 'hot', dateFrom: '', dateTo: '' } },
    { id: 'p2', name: '🆕 New This Week', filters: { status: 'new', industry: 'all', priority: 'all', dateFrom: '2026-06-07', dateTo: '2026-06-12' } },
    { id: 'p3', name: '🏥 Healthcare', filters: { status: 'all', industry: 'Healthcare IT', priority: 'all', dateFrom: '', dateTo: '' } },
  ]);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    company: '', contact: '', email: '', industry: '', notes: '', services: [],
    website: '', linkedin: '', companySize: undefined, budgetRange: undefined, decisionTimeline: undefined,
  });
  const [bulkStatus, setBulkStatus] = useState<LeadStatus>('contacted');
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchQuery(''); const el = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]'); el?.focus(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'a' && e.shiftKey) { e.preventDefault(); const visible = activeTab === 'leads' ? manualLeads : discoveredLeads; setSelectedLeads(new Set(visible.map(l => l.id))); }
      if (e.key === 'Escape') { setSelectedLead(null); setShowAddLead(false); setShowBulkMenu(false); setShowPresets(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  // ── Clock ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const update = () => setCurrentTime(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour12: true, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      if (filter !== 'all' && l.status !== filter) return false;
      if (industryFilter !== 'all' && l.industry !== industryFilter) return false;
      if (priorityFilter !== 'all' && getPriority(l.score) !== priorityFilter) return false;
      if (dateFrom && l.dateFound < dateFrom) return false;
      if (dateTo && l.dateFound > dateTo) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return l.company.toLowerCase().includes(q) ||
          l.contact.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.industry.toLowerCase().includes(q) ||
          l.notes.toLowerCase().includes(q) ||
          l.services.some(s => s.toLowerCase().includes(q)) ||
          (l.website || '').toLowerCase().includes(q) ||
          (l.linkedin || '').toLowerCase().includes(q) ||
          (l.painPoints || []).some(p => p.toLowerCase().includes(q));
      }
      return true;
    });
  }, [leads, filter, industryFilter, priorityFilter, dateFrom, dateTo, searchQuery]);

  const manualLeads = filteredLeads.filter(l => l.id.startsWith('l'));
  const discoveredLeads = filteredLeads.filter(l => l.id.startsWith('d'));

  // ── Stats ───────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: leads.length,
    manual: leads.filter(l => l.id.startsWith('l')).length,
    discovered: leads.filter(l => l.id.startsWith('d')).length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    replied: leads.filter(l => l.status === 'replied').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    converted: leads.filter(l => l.status === 'converted').length,
    avgScore: Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length),
    hot: leads.filter(l => getPriority(l.score) === 'hot').length,
    warm: leads.filter(l => getPriority(l.score) === 'warm').length,
    cold: leads.filter(l => getPriority(l.score) === 'cold').length,
    totalRevenue: leads.reduce((s, l) => s + revenuePotential(l), 0),
    emailPartnerships: leads.filter(l => l.source === 'Email Partnership').length,
    partnershipReplied: leads.filter(l => l.source === 'Email Partnership' && (l.status === 'replied' || l.status === 'qualified' || l.status === 'converted')).length,
    partnershipRate: leads.filter(l => l.source === 'Email Partnership').length > 0
      ? Math.round((leads.filter(l => l.source === 'Email Partnership' && (l.status === 'replied' || l.status === 'qualified' || l.status === 'converted')).length / leads.filter(l => l.source === 'Email Partnership').length) * 100)
      : 0,
  }), [leads]);

  const pipelineStages: PipelineStage[] = useMemo(() => [
    { label: 'New', count: stats.new, total: stats.total, color: '#3b82f6', avgDaysInStage: 2 },
    { label: 'Contacted', count: stats.contacted, total: stats.total, color: '#f59e0b', avgDaysInStage: 3 },
    { label: 'Replied', count: stats.replied, total: stats.total, color: '#a855f7', avgDaysInStage: 5 },
    { label: 'Qualified', count: stats.qualified, total: stats.total, color: '#10b981', avgDaysInStage: 7 },
    { label: 'Converted', count: stats.converted, total: stats.total, color: '#22c55e', avgDaysInStage: 14 },
  ], [stats]);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const updateLeadStatus = useCallback((id: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status, lastContact: new Date().toISOString().split('T')[0] } : l));
  }, []);

  const toggleLeadSelection = useCallback((id: string) => {
    setSelectedLeads(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    const visible = activeTab === 'leads' ? manualLeads : discoveredLeads;
    const allSelected = visible.every(l => selectedLeads.has(l.id));
    if (allSelected) {
      setSelectedLeads(prev => {
        const next = new Set(prev);
        visible.forEach(l => next.delete(l.id));
        return next;
      });
    } else {
      setSelectedLeads(prev => {
        const next = new Set(prev);
        visible.forEach(l => next.add(l.id));
        return next;
      });
    }
  }, [activeTab, manualLeads, discoveredLeads, selectedLeads]);

  const openCompose = useCallback((lead: Lead, templateId?: string) => {
    setSelectedLead(lead);
    if (templateId) {
      const t = OUTREACH_TEMPLATES.find(t => t.id === templateId);
      if (t) {
        setComposeTemplate(templateId);
        setComposeSubject(t.subject.replace(/{{company}}/g, lead.company).replace(/{{contact}}/g, lead.contact).replace(/{{industry}}/g, lead.industry).replace(/{{services}}/g, lead.services.join(', ')));
        setComposeBody(t.body.replace(/{{company}}/g, lead.company).replace(/{{contact}}/g, lead.contact).replace(/{{industry}}/g, lead.industry).replace(/{{services}}/g, lead.services.join('\n• ')));
      }
    } else {
      setComposeTemplate('');
      setComposeSubject('');
      setComposeBody('');
    }
  }, []);

  const handleTemplateChange = useCallback((lead: Lead, templateId: string) => {
    const t = OUTREACH_TEMPLATES.find(t => t.id === templateId);
    if (t) {
      setComposeTemplate(templateId);
      setComposeSubject(t.subject.replace(/{{company}}/g, lead.company).replace(/{{contact}}/g, lead.contact).replace(/{{industry}}/g, lead.industry).replace(/{{services}}/g, lead.services.join(', ')));
      setComposeBody(t.body.replace(/{{company}}/g, lead.company).replace(/{{contact}}/g, lead.contact).replace(/{{industry}}/g, lead.industry).replace(/{{services}}/g, lead.services.join('\n• ')));
    }
  }, []);

  const handleQuickReply = useCallback((idx: number, lead: Lead) => {
    const tpl = QUICK_REPLY_TEMPLATES[idx];
    setSelectedLead(lead);
    setComposeTemplate('quick');
    setComposeSubject(tpl.subject.replace(/{{company}}/g, lead.company).replace(/{{contact}}/g, lead.contact));
    setComposeBody(tpl.body.replace(/{{company}}/g, lead.company).replace(/{{contact}}/g, lead.contact));
  }, []);

  const addLead = useCallback(() => {
    if (!newLead.company) return;
    const lead: Lead = {
      id: `l${Date.now()}`,
      company: newLead.company || '',
      contact: newLead.contact || 'TBD',
      email: newLead.email || '',
      source: 'Manual Entry',
      industry: newLead.industry || 'Other',
      status: 'new',
      score: 50,
      notes: newLead.notes || '',
      dateFound: new Date().toISOString().split('T')[0],
      lastContact: '',
      services: newLead.services || [],
      website: newLead.website || '',
      linkedin: newLead.linkedin || '',
      companySize: newLead.companySize,
      budgetRange: newLead.budgetRange,
      decisionTimeline: newLead.decisionTimeline,
    };
    setLeads(prev => [lead, ...prev]);
    setNewLead({ company: '', contact: '', email: '', industry: '', notes: '', services: [], website: '', linkedin: '', companySize: undefined, budgetRange: undefined, decisionTimeline: undefined });
    setShowAddLead(false);
  }, [newLead]);

  const bulkExport = useCallback(() => {
    const selectedList = leads.filter(l => selectedLeads.has(l.id));
    if (selectedList.length === 0) return;
    const rows = ['Company,Contact,Email,Industry,Score,Priority,Status,Services,Website,Company Size,Budget,Timeline'];
    selectedList.forEach(l => {
      rows.push(`"${l.company}","${l.contact}","${l.email}","${l.industry}",${l.score},"${getPriority(l.score)}","${l.status}","${l.services.join('; ')}","${l.website || ''}","${l.companySize || ''}","${l.budgetRange || ''}","${l.decisionTimeline || ''}"`);
    });
    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setSelectedLeads(new Set());
  }, [leads, selectedLeads]);

  const bulkStatusUpdate = useCallback(() => {
    if (selectedLeads.size === 0) return;
    setLeads(prev => prev.map(l => selectedLeads.has(l.id) ? { ...l, status: bulkStatus, lastContact: new Date().toISOString().split('T')[0] } : l));
    setShowBulkMenu(false);
    setSelectedLeads(new Set());
  }, [selectedLeads, bulkStatus]);

  const saveFilterPreset = useCallback(() => {
    const name = prompt('Preset name:');
    if (!name) return;
    setFilterPresets(prev => [...prev, {
      id: `p${Date.now()}`, name,
      filters: { status: filter, industry: industryFilter, priority: priorityFilter, dateFrom, dateTo },
    }]);
  }, [filter, industryFilter, priorityFilter, dateFrom, dateTo]);

  const loadFilterPreset = useCallback((preset: FilterPreset) => {
    setFilter(preset.filters.status);
    setIndustryFilter(preset.filters.industry);
    setPriorityFilter(preset.filters.priority);
    setDateFrom(preset.filters.dateFrom);
    setDateTo(preset.filters.dateTo);
    setShowPresets(false);
  }, []);

  const deleteFilterPreset = useCallback((id: string) => {
    setFilterPresets(prev => prev.filter(p => p.id !== id));
  }, []);

  // ── Email stats ────────────────────────────────────────────────────────────
  const today = '2026-06-12';
  const weekAgo = '2026-06-05';
  const emailsToday = EMAIL_ACTIVITY.filter(e => e.timestamp.startsWith(today)).length;
  const emailsThisWeek = EMAIL_ACTIVITY.filter(e => e.timestamp >= weekAgo).length;
  const emailByClassification = EMAIL_ACTIVITY.reduce<Record<string, number>>((acc, e) => { acc[e.classification] = (acc[e.classification] || 0) + 1; return acc; }, {});

  // ── Render helpers ─────────────────────────────────────────────────────────
  const renderLeadCard = (lead: Lead) => {
    const priority = getPriority(lead.score);
    const pConfig = getPriorityConfig(priority);
    const isSelected = selectedLeads.has(lead.id);

    return (
      <div key={lead.id} className={`bg-slate-900/80 border rounded-xl p-4 transition-all hover:border-amber-500/30 ${isSelected ? 'border-amber-500/60 ring-1 ring-amber-500/20' : 'border-slate-800/80'}`}>
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleLeadSelection(lead.id)}
            className="mt-1.5 w-4 h-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500/30 accent-amber-500"
          />
          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {lead.website ? (
                <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-slate-200 hover:text-amber-400 transition underline decoration-amber-400/30 underline-offset-2">{lead.company}</a>
              ) : (
                <h3 className="text-sm font-semibold text-slate-200">{lead.company}</h3>
              )}
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border ${STATUS_COLORS[lead.status]}`}>{STATUS_LABELS[lead.status]}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold border ${pConfig.bg} ${pConfig.text} ${pConfig.border}`}>{pConfig.emoji} {pConfig.label}</span>
              <span className="text-[9px] text-cyan-400 font-mono">Score: {lead.score}</span>
              {lead.companySize && <span className="text-[9px] bg-slate-700/50 text-slate-400 px-1.5 py-0.5 rounded">{lead.companySize}</span>}
              {lead.budgetRange && <span className="text-[9px] bg-green-500/10 text-green-300 px-1.5 py-0.5 rounded">{lead.budgetRange}</span>}
              {lead.decisionTimeline && <span className="text-[9px] bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded">⏱ {lead.decisionTimeline}</span>}
              <span className="text-[9px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{lead.source}</span>
            </div>

            {/* Contact info */}
            <div className="text-xs text-slate-400 mb-1">
              {lead.contact} {lead.email ? `· ${lead.email}` : ''} · {lead.industry}
              {lead.linkedin && <> · <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">LinkedIn</a></>}
            </div>

            {/* Notes */}
            <div className="text-xs text-slate-500 mb-2">{lead.notes}</div>

            {/* Pain points */}
            {lead.painPoints && lead.painPoints.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1">
                {lead.painPoints.map(p => (<span key={p} className="text-[9px] bg-red-500/10 text-red-300 px-1.5 py-0.5 rounded">⚠ {p}</span>))}
              </div>
            )}

            {/* Services */}
            <div className="flex flex-wrap gap-1 mb-2">
              {lead.services.map(s => (<span key={s} className="text-[9px] bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded">{s}</span>))}
            </div>

            {/* Quick reply row */}
            <div className="flex flex-wrap gap-1">
              {lead.status === 'new' && <button onClick={() => updateLeadStatus(lead.id, 'contacted')} className="text-[10px] bg-amber-600 text-white px-2 py-1 rounded-lg hover:bg-amber-500">📧 Contacted</button>}
              {lead.status === 'contacted' && <button onClick={() => updateLeadStatus(lead.id, 'replied')} className="text-[10px] bg-purple-600 text-white px-2 py-1 rounded-lg hover:bg-purple-500">💬 Replied</button>}
              {lead.status === 'replied' && <button onClick={() => updateLeadStatus(lead.id, 'qualified')} className="text-[10px] bg-emerald-600 text-white px-2 py-1 rounded-lg hover:bg-emerald-500">✅ Qualify</button>}
              {lead.status === 'qualified' && <button onClick={() => updateLeadStatus(lead.id, 'converted')} className="text-[10px] bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-500">🎉 Convert</button>}
              <button onClick={() => openCompose(lead, 't001')} className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded-lg hover:bg-slate-600">📧 Compose</button>
              {QUICK_REPLY_TEMPLATES.map((tpl, qi) => (
                <button key={qi} onClick={() => handleQuickReply(qi, lead)} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-lg hover:bg-slate-700 hover:text-slate-200" title={tpl.subject}>{tpl.label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── SVG Funnel Chart ───────────────────────────────────────────────────────
  const renderFunnelChart = () => {
    const stages = pipelineStages;
    const maxCount = Math.max(...stages.map(s => s.count), 1);
    const width = 500;
    const height = 280;
    const barHeight = 44;
    const gap = 8;
    const maxBarWidth = 420;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-lg mx-auto" style={{ maxHeight: `${height}px` }}>
        {stages.map((stage, i) => {
          const y = i * (barHeight + gap) + 10;
          const barW = Math.max(40, (stage.count / maxCount) * maxBarWidth);
          const x = (width - barW) / 2;
          const pct = stage.total > 0 ? Math.round((stage.count / stage.total) * 100) : 0;
          const convRate = i > 0 ? (stage.count / Math.max(stages[i - 1].count, 1) * 100).toFixed(0) : '—';

          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barHeight} rx={8} fill={stage.color} opacity={0.85} />
              <text x={width / 2} y={y + barHeight / 2 - 5} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{stage.label}</text>
              <text x={width / 2} y={y + barHeight / 2 + 10} textAnchor="middle" fill="white" fontSize="10" opacity={0.9}>{stage.count} leads · {pct}% · {stage.avgDaysInStage}d avg</text>
              {i > 0 && (
                <text x={width - 50} y={y + barHeight / 2 + 4} textAnchor="middle" fill="#94a3b8" fontSize="9">↑ {convRate}%</text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-amber-500/20">🎯</div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Leads Control Center</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Zion Tech Group · {currentTime || 'Loading...'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Gmail status indicator */}
            <div className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg border ${GMAIL_STATUS.connected && GMAIL_STATUS.tokenValid ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${GMAIL_STATUS.connected && GMAIL_STATUS.tokenValid ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              Gmail {GMAIL_STATUS.connected && GMAIL_STATUS.tokenValid ? 'Connected' : 'Disconnected'}
            </div>
            <Link href="/agents-monitoring" className="text-xs text-slate-400 hover:text-white transition border border-slate-700/60 rounded-lg px-3 py-1.5">📊 Dashboard</Link>
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition border border-slate-700/60 rounded-lg px-3 py-1.5">← Main Site</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Bar */}
        <section className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-11 gap-2 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'text-purple-400', border: 'border-purple-500/20' },
            { label: 'Manual', value: stats.manual, color: 'text-blue-400', border: 'border-blue-500/20' },
            { label: 'Discovered', value: stats.discovered, color: 'text-cyan-400', border: 'border-cyan-500/20' },
            { label: 'New', value: stats.new, color: 'text-blue-400', border: 'border-blue-500/20' },
            { label: 'Contacted', value: stats.contacted, color: 'text-amber-400', border: 'border-amber-500/20' },
            { label: 'Replied', value: stats.replied, color: 'text-purple-400', border: 'border-purple-500/20' },
            { label: 'Qualified', value: stats.qualified, color: 'text-emerald-400', border: 'border-emerald-500/20' },
            { label: 'Converted', value: stats.converted, color: 'text-green-400', border: 'border-green-500/20' },
            { label: '🔥 Hot', value: stats.hot, color: 'text-red-400', border: 'border-red-500/20' },
            { label: '🌡️ Warm', value: stats.warm, color: 'text-amber-400', border: 'border-amber-500/20' },
            { label: '❄️ Cold', value: stats.cold, color: 'text-blue-400', border: 'border-blue-500/20' },
          ].map((s, i) => (
            <div key={i} className={`bg-slate-900/80 border ${s.border} rounded-xl p-2.5 text-center`}>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[8px] text-slate-500 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-slate-900/40 rounded-lg p-1 border border-slate-800/40 overflow-x-auto">
          {([
            { id: 'leads' as const, label: `🎯 Manual (${manualLeads.length})` },
            { id: 'discovered' as const, label: `🔍 Discovered (${discoveredLeads.length})` },
            { id: 'templates' as const, label: `📧 Templates (${OUTREACH_TEMPLATES.length})` },
            { id: 'stats' as const, label: '📊 Pipeline' },
            { id: 'email' as const, label: '📬 Emails' },
            { id: 'analytics' as const, label: '📈 Analytics' },
            { id: 'partnerships' as const, label: `🤝 Partnerships (${leads.filter(l => l.source === 'Email Partnership').length})` },
          ]).map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 text-xs py-2 rounded-md transition font-medium whitespace-nowrap ${activeTab === tab.id ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Dashboard Overview (all tabs) ──────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-amber-400">{stats.total}</div>
            <div className="text-[9px] text-slate-500">Total Leads</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-blue-400">{stats.new}</div>
            <div className="text-[9px] text-slate-500">New</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-purple-400">{stats.replied}</div>
            <div className="text-[9px] text-slate-500">Replied</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-emerald-400">{stats.qualified}</div>
            <div className="text-[9px] text-slate-500">Qualified</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-cyan-400">{stats.emailPartnerships}</div>
            <div className="text-[9px] text-slate-500">Partnerships</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-pink-400">${(stats.totalRevenue / 1000).toFixed(0)}K</div>
            <div className="text-[9px] text-slate-500">Pipeline Value</div>
          </div>
        </div>

        {/* ── Lead Scoring Distribution ─────────────────────────────────────── */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 mb-6">
          <h3 className="text-xs font-semibold text-slate-300 mb-3">📊 Lead Score Distribution</h3>
          <div className="flex items-end gap-1 h-20">
            {(() => {
              const buckets = [
                { label: '0-20', min: 0, max: 20, color: 'bg-red-500' },
                { label: '21-40', min: 21, max: 40, color: 'bg-orange-500' },
                { label: '41-60', min: 41, max: 60, color: 'bg-amber-500' },
                { label: '61-80', min: 61, max: 80, color: 'bg-emerald-500' },
                { label: '81-100', min: 81, max: 100, color: 'bg-cyan-500' },
              ];
              const maxCount = Math.max(...buckets.map(b => leads.filter(l => l.score >= b.min && l.score <= b.max).length), 1);
              return buckets.map(b => {
                const count = leads.filter(l => l.score >= b.min && l.score <= b.max).length;
                const pct = (count / maxCount) * 100;
                return (
                  <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[9px] text-slate-400 font-bold">{count}</div>
                    <div className={"w-full rounded-t-sm transition-all " + b.color} style={{ height: Math.max(4, (pct / 100) * 64) + 'px', opacity: count > 0 ? 1 : 0.3 }} />
                    <div className="text-[8px] text-slate-500">{b.label}</div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* ── Conversion Funnel ─────────────────────────────────────────────── */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 mb-6">
          <h3 className="text-xs font-semibold text-slate-300 mb-3">🔄 Conversion Funnel</h3>
          <div className="space-y-2">
            {(() => {
              const stages = [
                { label: 'Total Leads', count: stats.total, color: 'bg-slate-500', pct: 100 },
                { label: 'Contacted', count: stats.contacted + stats.replied + stats.qualified + stats.converted, color: 'bg-blue-500', pct: stats.total > 0 ? ((stats.contacted + stats.replied + stats.qualified + stats.converted) / stats.total) * 100 : 0 },
                { label: 'Replied', count: stats.replied + stats.qualified + stats.converted, color: 'bg-purple-500', pct: stats.total > 0 ? ((stats.replied + stats.qualified + stats.converted) / stats.total) * 100 : 0 },
                { label: 'Qualified', count: stats.qualified + stats.converted, color: 'bg-emerald-500', pct: stats.total > 0 ? ((stats.qualified + stats.converted) / stats.total) * 100 : 0 },
                { label: 'Converted', count: stats.converted, color: 'bg-green-500', pct: stats.total > 0 ? (stats.converted / stats.total) * 100 : 0 },
              ];
              return stages.map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 w-20 shrink-0">{s.label}</span>
                  <div className="flex-1 h-6 bg-slate-800 rounded-full overflow-hidden">
                    <div className={"h-full rounded-full transition-all " + s.color} style={{ width: Math.max(2, s.pct) + '%' }} />
                  </div>
                  <span className="text-[10px] text-slate-300 w-12 text-right">{s.count} ({s.pct.toFixed(0)}%)</span>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* ── Follow-up Reminders ───────────────────────────────────────────── */}
        {(() => {
          const reminders = leads
            .filter(l => l.status !== 'converted' && l.status !== 'lost')
            .map(l => {
              const daysSince = l.lastContact ? Math.floor((Date.now() - new Date(l.lastContact).getTime()) / 86400000) : Math.floor((Date.now() - new Date(l.dateFound).getTime()) / 86400000);
              return { ...l, daysSince, urgent: daysSince >= 7 };
            })
            .filter(l => l.daysSince >= 3)
            .sort((a, b) => b.daysSince - a.daysSince)
            .slice(0, 5);
          if (reminders.length === 0) return null;
          return (
            <div className="bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <h3 className="text-xs font-semibold text-red-300 mb-3">⏰ Follow-up Reminders ({reminders.length})</h3>
              <div className="space-y-2">
                {reminders.map(l => (
                  <div key={l.id} className="flex items-center justify-between bg-slate-900/60 rounded-lg p-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{l.urgent ? '🔴' : '🟡'}</span>
                      <div>
                        <div className="text-[11px] font-semibold text-slate-200">{l.company}</div>
                        <div className="text-[9px] text-slate-500">{l.contact} · {l.industry} · Score: {l.score}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] text-slate-400">{l.daysSince}d ago</div>
                      <div className="text-[9px] text-slate-500">{l.lastContact || l.dateFound}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ── Kanban Board View ─────────────────────────────────────────────── */}
        {activeTab === 'leads' && manualLeads.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xs font-semibold text-slate-300">📋 Kanban Board</h3>
              <div className="flex-1" />
              <span className="text-[9px] text-slate-500">{manualLeads.length} leads</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {(['new', 'contacted', 'replied', 'qualified', 'converted', 'lost'] as LeadStatus[]).map(status => {
                const statusLeads = manualLeads.filter(l => l.status === status);
                const colors: Record<string, string> = { new: 'border-blue-500/30 bg-blue-500/5', contacted: 'border-amber-500/30 bg-amber-500/5', replied: 'border-purple-500/30 bg-purple-500/5', qualified: 'border-emerald-500/30 bg-emerald-500/5', converted: 'border-green-500/30 bg-green-500/5', lost: 'border-red-500/30 bg-red-500/5' };
                return (
                  <div key={status} className={`rounded-xl border ${colors[status]} p-2 min-h-[120px]`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold text-slate-300">{STATUS_LABELS[status]}</span>
                      <span className="text-[9px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{statusLeads.length}</span>
                    </div>
                    <div className="space-y-1.5">
                      {statusLeads.slice(0, 5).map(l => (
                        <div key={l.id} className="bg-slate-800/80 rounded-lg p-2 cursor-pointer hover:bg-slate-700/80 transition" onClick={() => { setSelectedLead(l); setActiveTab('leads'); }}>
                          <div className="text-[10px] font-semibold text-slate-200 truncate">{l.company}</div>
                          <div className="text-[8px] text-slate-500 truncate">{l.contact} · {l.industry}</div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[8px] text-cyan-400">{l.score}pts</span>
                            <span className="text-[7px] text-slate-600">{l.lastContact || 'no contact'}</span>
                          </div>
                        </div>
                      ))}
                      {statusLeads.length > 5 && <div className="text-[8px] text-slate-500 text-center">+{statusLeads.length - 5} more</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Leads / Discovered Tabs ──────────────────────────────────────── */}
        {(activeTab === 'leads' || activeTab === 'discovered') && (
          <div>
            {/* Search & Filters */}
            <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-3 mb-4">
              <div className="flex gap-2 mb-3 flex-wrap items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search across all fields... (⌘K)" className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 px-3 py-2 pl-8 placeholder-slate-500" />
                  <span className="absolute left-2.5 top-2 text-slate-500 text-xs">🔍</span>
                </div>
                <select value={industryFilter} onChange={e => setIndustryFilter(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 px-3 py-2">
                  {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind === 'all' ? 'All Industries' : ind}</option>)}
                </select>
                <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 px-3 py-2">
                  <option value="all">All Priorities</option>
                  <option value="hot">🔥 Hot (80+)</option>
                  <option value="warm">🌡️ Warm (60-79)</option>
                  <option value="cold">❄️ Cold (&lt;60)</option>
                </select>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 px-3 py-2" placeholder="From" title="Date from" />
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 px-3 py-2" placeholder="To" title="Date to" />
                <button onClick={() => setShowPresets(!showPresets)} className="text-[10px] bg-slate-700 text-slate-300 px-3 py-2 rounded-lg hover:bg-slate-600">💾 Presets</button>
                <button onClick={saveFilterPreset} className="text-[10px] bg-slate-700 text-slate-300 px-3 py-2 rounded-lg hover:bg-slate-600" title="Save current filters as preset">+ Save</button>
              </div>

              {/* Status filter row */}
              <div className="flex gap-1 flex-wrap items-center">
                {['all', 'new', 'contacted', 'replied', 'qualified', 'converted', 'lost'].map(s => (
                  <button key={s} onClick={() => setFilter(s)} className={`text-[10px] px-3 py-1.5 rounded-lg border transition ${filter === s ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'}`}>
                    {s === 'all' ? 'All' : STATUS_LABELS[s] || s}
                  </button>
                ))}
                <div className="flex-1" />

                {/* Bulk actions */}
                {selectedLeads.size > 0 && (
                  <div className="flex items-center gap-2 ml-2">
                    <span className="text-[10px] text-amber-400 font-semibold">{selectedLeads.size} selected</span>
                    <div className="relative">
                      <button onClick={() => setShowBulkMenu(!showBulkMenu)} className="text-[10px] bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-500">⚡ Bulk Actions ▾</button>
                      {showBulkMenu && (
                        <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-40 min-w-[180px]">
                          <div className="p-2 space-y-1">
                            <div className="text-[9px] text-slate-500 uppercase px-2 py-1">Change Status</div>
                            {(['contacted', 'replied', 'qualified', 'converted', 'lost'] as LeadStatus[]).map(s => (
                              <button key={s} onClick={() => { setBulkStatus(s); bulkStatusUpdate(); }} className="block w-full text-left text-[10px] text-slate-300 hover:bg-slate-700 px-2 py-1 rounded">→ {STATUS_LABELS[s]}</button>
                            ))}
                            <div className="border-t border-slate-700 my-1" />
                            <button onClick={bulkExport} className="block w-full text-left text-[10px] text-slate-300 hover:bg-slate-700 px-2 py-1 rounded">📥 Export Selected CSV</button>
                            <button onClick={() => setSelectedLeads(new Set())} className="block w-full text-left text-[10px] text-red-400 hover:bg-slate-700 px-2 py-1 rounded">✕ Clear Selection</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button onClick={() => setShowAddLead(true)} className="text-[10px] bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-500">+ Add Lead</button>
                <button onClick={bulkExport} className="text-[10px] bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-600">📥 Export CSV</button>
                {activeTab === 'discovered' && (
                  <button onClick={() => { setBulkStatus('contacted'); bulkStatusUpdate(); }} className="text-[10px] bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-500">📧 Mark All Contacted</button>
                )}
              </div>

              {/* Filter presets dropdown */}
              {showPresets && (
                <div className="mt-2 bg-slate-800/80 border border-slate-700 rounded-lg p-2">
                  <div className="text-[9px] text-slate-500 uppercase mb-1">Saved Presets</div>
                  <div className="flex flex-wrap gap-1">
                    {filterPresets.map(p => (
                      <div key={p.id} className="flex items-center gap-1">
                        <button onClick={() => loadFilterPreset(p)} className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded hover:bg-slate-600">{p.name}</button>
                        <button onClick={() => deleteFilterPreset(p.id)} className="text-[9px] text-red-400 hover:text-red-300">✕</button>
                      </div>
                    ))}
                    {filterPresets.length === 0 && <span className="text-[10px] text-slate-500">No presets saved yet</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Select all row */}
            {(activeTab === 'leads' ? manualLeads : discoveredLeads).length > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" checked={(activeTab === 'leads' ? manualLeads : discoveredLeads).every(l => selectedLeads.has(l.id))} onChange={toggleSelectAll} className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 accent-amber-500" />
                <span className="text-[10px] text-slate-500">Select all visible (⇧⌘A) · Esc to clear modals</span>
              </div>
            )}

            {/* Lead cards */}
            <div className="space-y-3">
              {(activeTab === 'leads' ? manualLeads : discoveredLeads).map(renderLeadCard)}
              {(activeTab === 'leads' ? manualLeads : discoveredLeads).length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <div className="text-4xl mb-3">🔍</div>
                  <div className="text-sm">No leads match your filters</div>
                  <div className="text-xs mt-1">Try adjusting your search or filters</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Templates Tab ───────────────────────────────────────────────── */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="flex gap-2 mb-4 flex-wrap">
              {['all', 'Introduction', 'Follow-Up', 'Re-Engagement', 'Proposal', 'Free Audit'].map(cat => (
                <button key={cat} className="text-[10px] px-3 py-1.5 rounded-lg border bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500">
                  {cat === 'all' ? 'All Templates' : cat}
                </button>
              ))}
            </div>
            {OUTREACH_TEMPLATES.map(t => (
              <div key={t.id} className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">{t.category}</span>
                  {t.industry && <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">{t.industry}</span>}
                  <h3 className="text-sm font-semibold text-slate-200">{t.name}</h3>
                </div>
                <div className="text-xs text-purple-300 font-mono mb-2 bg-slate-800/50 rounded px-3 py-1.5">Subject: {t.subject}</div>
                <pre className="text-xs text-slate-400 whitespace-pre-wrap font-sans leading-relaxed bg-slate-800/30 rounded-lg p-4">{t.body}</pre>
              </div>
            ))}
          </div>
        )}

        {/* ── Stats / Pipeline Tab ────────────────────────────────────────── */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* SVG Funnel */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Pipeline Funnel</h3>
              {renderFunnelChart()}
              <div className="grid grid-cols-5 gap-2 mt-4">
                {pipelineStages.map((stage, i) => (
                  <div key={i} className="text-center">
                    <div className="text-[10px] text-slate-400">{stage.label}</div>
                    <div className="text-sm font-bold" style={{ color: stage.color }}>{stage.count}</div>
                    <div className="text-[9px] text-slate-500">{stage.avgDaysInStage}d avg</div>
                    {i > 0 && (
                      <div className="text-[9px] text-emerald-400">
                        {stage.count / Math.max(pipelineStages[i - 1].count, 1) * 100 | 0}% conv.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Potential */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">💰 Revenue Potential</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-amber-400">${(stats.totalRevenue / 1000).toFixed(0)}K</div>
                  <div className="text-[10px] text-slate-500">Total Pipeline Value</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400">${(stats.totalRevenue * 0.15 / 1000).toFixed(0)}K</div>
                  <div className="text-[10px] text-slate-500">Est. at 15% Close Rate</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400">${(stats.totalRevenue * 0.3 / 1000).toFixed(0)}K</div>
                  <div className="text-[10px] text-slate-500">Est. at 30% Close Rate</div>
                </div>
              </div>
            </div>

            {/* Lead Generation Strategy */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-amber-300 mb-3">📋 Lead Generation Strategy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { title: '🔥 High-Priority (80+ score)', desc: 'Contact within 24h. Use Proposal template. Personalize with company-specific pain points.' },
                  { title: '📧 Cold Outreach Best Practices', desc: 'Research company first. Reference their recent news. Keep under 150 words. Specific CTA.' },
                  { title: '💬 Follow-Up Schedule', desc: 'Day 1: Initial. Day 3: Follow-up. Day 7: Re-engage. Day 14: Final. Then monthly nurture.' },
                  { title: '🎯 Conversion Tips', desc: 'Free proposal. Reference similar companies. ROI projection. <150 words. One clear CTA.' },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-900/60 rounded-lg p-3">
                    <div className="text-xs font-semibold text-slate-200">{s.title}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Email Activity Tab ─────────────────────────────────────────────── */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            {/* Gmail Status */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">📬 Gmail Integration</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className={`text-2xl font-bold ${GMAIL_STATUS.connected && GMAIL_STATUS.tokenValid ? 'text-emerald-400' : 'text-red-400'}`}>
                    {GMAIL_STATUS.connected && GMAIL_STATUS.tokenValid ? '✓' : '✗'}
                  </div>
                  <div className="text-[10px] text-slate-500">Connection</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400">{GMAIL_STATUS.emailsProcessedToday}</div>
                  <div className="text-[10px] text-slate-500">Processed Today</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{EMAIL_ACTIVITY.length}</div>
                  <div className="text-[10px] text-slate-500">Total Activities</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-amber-400">{GMAIL_STATUS.lastSyncTime}</div>
                  <div className="text-[10px] text-slate-500">Last Sync</div>
                </div>
              </div>
            </div>

            {/* Email Activity List */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Recent Email Activity</h3>
              <div className="space-y-3">
                {EMAIL_ACTIVITY.map(email => (
                  <div key={email.id} className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-200">{email.recipient}</span>
                        <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">{email.classification}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${email.status === 'sent' ? 'bg-emerald-500/20 text-emerald-300' : email.status === 'replied' ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300'}`}>
                          {email.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 truncate">{email.subject}</div>
                    </div>
                    <div className="text-[10px] text-slate-500 shrink-0 ml-4">{email.timestamp}</div>
                  </div>
                ))}
                {EMAIL_ACTIVITY.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <div className="text-3xl mb-2">📭</div>
                    <div className="text-sm">No email activity yet</div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-purple-300 mb-3">📞 Contact Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div><span className="text-slate-400">Mobile:</span> <span className="text-slate-200">+1 302 464 0950</span></div>
                <div><span className="text-slate-400">Email:</span> <span className="text-slate-200">kleber@ziontechgroup.com</span></div>
                <div className="md:col-span-2"><span className="text-slate-400">Address:</span> <span className="text-slate-200">364 E Main St STE 1008, Middletown, DE 19709</span></div>
              </div>
            </div>
          </div>
        )}

        {/* ── Partnerships Tab ─────────────────────────────────────────────────── */}
        {activeTab === 'partnerships' && (
          <div className="space-y-6">
            {/* Partnership Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {(() => {
                const p = leads.filter(l => l.source === 'Email Partnership');
                const stages = [
                  { label: 'Identified', status: 'new', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                  { label: 'Contacted', status: 'contacted', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                  { label: 'Replied', status: 'replied', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
                  { label: 'Qualified', status: 'qualified', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                  { label: 'Converted', status: 'converted', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                ];
                return stages.map(s => {
                  const count = p.filter(l => l.status === s.status).length;
                  return (
                    <div key={s.status} className={"rounded-lg p-4 text-center border " + s.bg}>
                      <div className={"text-3xl font-bold " + s.color}>{count}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{s.label}</div>
                      <div className="text-[9px] text-slate-600">{p.length > 0 ? Math.round((count / p.length) * 100) : 0}%</div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Partnership Health Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(() => {
                const p = leads.filter(l => l.source === 'Email Partnership');
                const avgScore = p.length > 0 ? Math.round(p.reduce((s, l) => s + l.score, 0) / p.length) : 0;
                const responded = p.filter(l => ['replied','qualified','converted'].includes(l.status)).length;
                const responseRate = p.length > 0 ? Math.round((responded / p.length) * 100) : 0;
                const totalBudget = p.reduce((s, l) => {
                  const b = l.budgetRange || '';
                  if (b.includes('100K+')) return s + 150000;
                  if (b.includes('50K-$100K')) return s + 75000;
                  if (b.includes('10K-$50K')) return s + 30000;
                  if (b.includes('1K-$10K')) return s + 5000;
                  return s + 25000;
                }, 0);
                const immediate = p.filter(l => l.decisionTimeline === 'Immediate').length;
                return [
                  { label: 'Avg Score', value: avgScore, color: 'text-amber-400', icon: '📊' },
                  { label: 'Response Rate', value: responseRate + '%', color: 'text-emerald-400', icon: '💬' },
                  { label: 'Total Budget', value: '$' + (totalBudget / 1000).toFixed(0) + 'K', color: 'text-cyan-400', icon: '💰' },
                  { label: 'Immediate', value: immediate, color: 'text-red-400', icon: '🔥' },
                ].map(m => (
                  <div key={m.label} className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 text-center">
                    <div className="text-lg mb-1">{m.icon}</div>
                    <div className={"text-xl font-bold " + m.color}>{m.value}</div>
                    <div className="text-[9px] text-slate-500">{m.label}</div>
                  </div>
                ));
              })()}
            </div>

            {/* Active Deals — Immediate + Hot */}
            <div className="bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/20 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-red-300 mb-3">🔥 Active Deals — Immediate Attention</h3>
              <div className="space-y-2">
                {leads.filter(l => l.source === 'Email Partnership' && (l.decisionTimeline === 'Immediate' || l.score >= 90)).sort((a, b) => b.score - a.score).map(l => (
                  <div key={l.id} className="bg-slate-900/60 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{l.score >= 90 ? '🔥' : '⚡'}</span>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{l.company} <span className="text-slate-500">·</span> {l.industry}</div>
                        <div className="text-[10px] text-slate-500">{l.contact} · {l.email} · Budget: {l.budgetRange || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-amber-400">{l.score}</div>
                      <div className="text-[9px] text-slate-500">{l.decisionTimeline}</div>
                    </div>
                  </div>
                ))}
                {leads.filter(l => l.source === 'Email Partnership' && (l.decisionTimeline === 'Immediate' || l.score >= 90)).length === 0 && (
                  <div className="text-center py-4 text-slate-500 text-sm">No urgent deals right now 🎉</div>
                )}
              </div>
            </div>

            {/* Partnership Leads List */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Partnership Leads ({leads.filter(l => l.source === 'Email Partnership').length})</h3>
              <div className="space-y-3">
                {leads.filter(l => l.source === 'Email Partnership').sort((a, b) => b.score - a.score).map(l => {
                  const statusColors: Record<string, string> = { new: 'bg-blue-500', contacted: 'bg-amber-500', replied: 'bg-purple-500', qualified: 'bg-emerald-500', converted: 'bg-green-500', lost: 'bg-red-500' };
                  const statusLabels: Record<string, string> = { new: '🆕 New', contacted: '📧 Contacted', replied: '💬 Replied', qualified: '✅ Qualified', converted: '🎉 Converted', lost: '❌ Lost' };
                  return (
                    <div key={l.id} className="bg-slate-800/50 rounded-lg p-4 hover:bg-slate-800/70 transition">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-slate-100">{l.company}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">{l.industry}</span>
                            <span className={"text-[9px] px-1.5 py-0.5 rounded " + (statusColors[l.status] ? 'text-white ' + statusColors[l.status] : 'bg-slate-600 text-slate-300')}>{statusLabels[l.status] || l.status}</span>
                            {l.website && <a href={l.website} target="_blank" rel="noopener" className="text-[10px] text-cyan-400 hover:underline">🌐 Website</a>}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">{l.contact} · {l.email}</div>
                          <div className="text-[11px] text-slate-500 mt-2 leading-relaxed">{l.notes}</div>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className="text-[9px] text-slate-500">Size: <span className="text-slate-300">{l.companySize || 'N/A'}</span></span>
                            <span className="text-[9px] text-slate-500">Budget: <span className="text-slate-300">{l.budgetRange || 'N/A'}</span></span>
                            <span className="text-[9px] text-slate-500">Timeline: <span className="text-slate-300">{l.decisionTimeline || 'N/A'}</span></span>
                            <span className="text-[9px] text-slate-500">Services: <span className="text-amber-300">{l.services.slice(0, 2).join(', ')}{l.services.length > 2 ? '...' : ''}</span></span>
                          </div>
                        </div>
                        <div className="text-right shrink-0 flex flex-col items-end gap-1">
                          <div className="text-lg font-bold text-amber-400">{l.score}</div>
                          <div className="text-[8px] text-slate-500 uppercase">Score</div>
                          <div className="text-[9px] text-slate-600 mt-1">{l.dateFound}</div>
                          <div className="text-[9px] text-slate-600">Last: {l.lastContact || '—'}</div>
                        </div>
                      </div>
                      {/* Quick Actions */}
                      <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center gap-2">
                        <button onClick={() => { navigator.clipboard.writeText(l.email || ''); }} className="text-[10px] px-2 py-1 rounded bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition">📋 Copy Email</button>
                        {l.email && <a href={"mailto:" + l.email + "?subject=Re: Partnership Discussion - Zion Tech Group"} className="text-[10px] px-2 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition">📧 Compose</a>}
                        {l.website && <a href={l.website} target="_blank" rel="noopener" className="text-[10px] px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition">🌐 Visit</a>}
                        <div className="flex-1" />
                        <button onClick={() => setLeads(prev => prev.map(lead => lead.id === l.id ? { ...lead, status: 'contacted' as LeadStatus, lastContact: new Date().toISOString().split('T')[0] } : lead))} className="text-[10px] px-2 py-1 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition">📧 Mark Contacted</button>
                        <button onClick={() => setLeads(prev => prev.map(lead => lead.id === l.id ? { ...lead, status: 'replied' as LeadStatus, lastContact: new Date().toISOString().split('T')[0] } : lead))} className="text-[10px] px-2 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition">💬 Mark Replied</button>
                        <button onClick={() => setLeads(prev => prev.map(lead => lead.id === l.id ? { ...lead, status: 'qualified' as LeadStatus } : lead))} className="text-[10px] px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition">✅ Qualify</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Partnership Email Activity */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">📨 Partnership Email Activity</h3>
              <div className="space-y-2">
                {EMAIL_ACTIVITY.filter(e => e.classification === 'partnership').map(email => (
                  <div key={email.id} className="bg-slate-800/50 rounded-lg p-3 flex items-center justify-between hover:bg-slate-800/70 transition">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-200">{email.recipient}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">{email.classification}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{email.subject}</div>
                    </div>
                    <div className="text-[9px] text-slate-500 shrink-0 ml-3">{email.timestamp.split('T')[1]?.slice(0, 5) || ''}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Analytics Tab ──────────────────────────────────────────────────── */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-amber-400">${(stats.totalRevenue / 1000).toFixed(0)}K</div>
                <div className="text-[10px] text-slate-500 mt-1">Pipeline Value</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-emerald-400">{stats.total > 0 ? ((stats.converted / stats.total) * 100).toFixed(1) : 0}%</div>
                <div className="text-[10px] text-slate-500 mt-1">Conversion Rate</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-cyan-400">${stats.total > 0 ? Math.round(stats.totalRevenue / stats.total / 1000) : 0}K</div>
                <div className="text-[10px] text-slate-500 mt-1">Avg Deal Size</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-purple-400">{stats.partnershipRate}%</div>
                <div className="text-[10px] text-slate-500 mt-1">Partnership Response</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-pink-400">{stats.avgScore}</div>
                <div className="text-[10px] text-slate-500 mt-1">Avg Lead Score</div>
              </div>
            </div>

            {/* Partnership Pipeline */}
            <div className="bg-slate-900/80 border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-purple-300 mb-4">🤝 Partnership Pipeline</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                {(() => {
                  const stages = [
                    { label: 'Identified', status: 'new', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                    { label: 'Contacted', status: 'contacted', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                    { label: 'Replied', status: 'replied', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
                    { label: 'Qualified', status: 'qualified', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                    { label: 'Converted', status: 'converted', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                  ];
                  const partnerships = leads.filter(l => l.source === 'Email Partnership');
                  return stages.map(s => {
                    const count = partnerships.filter(l => l.status === s.status).length;
                    return (
                      <div key={s.status} className={"rounded-lg p-3 text-center border " + s.bg}>
                        <div className={"text-2xl font-bold " + s.color}>{count}</div>
                        <div className="text-[10px] text-slate-500">{s.label}</div>
                      </div>
                    );
                  });
                })()}
              </div>
              <div className="space-y-2">
                {leads.filter(l => l.source === 'Email Partnership').sort((a, b) => b.score - a.score).map(l => {
                  const statusColors: Record<string, string> = { new: 'bg-blue-500', contacted: 'bg-amber-500', replied: 'bg-purple-500', qualified: 'bg-emerald-500', converted: 'bg-green-500', lost: 'bg-red-500' };
                  return (
                    <div key={l.id} className="flex items-center gap-3 bg-slate-800/40 rounded-lg p-3">
                      <div className={"w-2 h-2 rounded-full shrink-0 " + (statusColors[l.status] || 'bg-slate-500')} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-200">{l.company}</span>
                          <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">{l.industry}</span>
                          {l.website && <a href={l.website} target="_blank" rel="noopener" className="text-[9px] text-cyan-400 hover:underline">🌐</a>}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">{l.notes.slice(0, 80)}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-amber-400">{l.score}</div>
                        <div className="text-[9px] text-slate-500">{l.decisionTimeline}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lead Source Breakdown */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">📊 Lead Sources</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(() => {
                  const sources = ['LinkedIn', 'Referral', 'Cold Outreach', 'Email Partnership', 'Web Search', 'Conference', 'Manual Entry'];
                  const colors = ['text-blue-400', 'text-emerald-400', 'text-amber-400', 'text-purple-400', 'text-cyan-400', 'text-pink-400', 'text-slate-400'];
                  return sources.map((src, i) => {
                    const count = leads.filter(l => l.source === src).length;
                    if (count === 0) return null;
                    return (
                      <div key={i} className="bg-slate-800/50 rounded-lg p-4 text-center">
                        <div className={`text-2xl font-bold ${colors[i]}`}>{count}</div>
                        <div className="text-[10px] text-slate-500">{src}</div>
                        <div className="text-[9px] text-slate-600">{((count / leads.length) * 100).toFixed(0)}%</div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Industry Breakdown */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">🏭 Industry Breakdown</h3>
              <div className="space-y-2">
                {(() => {
                  const industries = [...new Set(leads.map(l => l.industry))];
                  return industries.map(ind => {
                    const count = leads.filter(l => l.industry === ind).length;
                    const pct = (count / leads.length) * 100;
                    return (
                      <div key={ind} className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 w-32 truncate">{ind}</span>
                        <div className="flex-1 h-5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: `${Math.max(5, pct)}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 w-16 text-right">{count} ({pct.toFixed(0)}%)</span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Follow-up Reminders */}
            <div className="bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/20 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-red-300 mb-4">⏰ Follow-up Reminders</h3>
              <div className="space-y-3">
                {leads
                  .filter(l => l.status !== 'converted' && l.status !== 'lost')
                  .map(l => {
                    const daysSince = l.lastContact ? Math.floor((Date.now() - new Date(l.lastContact).getTime()) / 86400000) : Math.floor((Date.now() - new Date(l.dateFound).getTime()) / 86400000);
                    const needsFollowUp = daysSince >= 3;
                    const urgency = daysSince >= 7 ? '🔴' : daysSince >= 3 ? '🟡' : '🟢';
                    return { ...l, daysSince, needsFollowUp, urgency };
                  })
                  .filter(l => l.needsFollowUp)
                  .sort((a, b) => b.daysSince - a.daysSince)
                  .slice(0, 10)
                  .map(l => (
                    <div key={l.id} className="bg-slate-900/60 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{l.urgency}</span>
                        <div>
                          <div className="text-xs font-semibold text-slate-200">{l.company}</div>
                          <div className="text-[10px] text-slate-500">{l.contact} · {l.industry} · Score: {l.score}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-slate-400">{l.daysSince}d ago</div>
                        <div className="text-[10px] text-slate-500">{l.lastContact || l.dateFound}</div>
                      </div>
                    </div>
                  ))}
                {leads.filter(l => {
                  const days = l.lastContact ? Math.floor((Date.now() - new Date(l.lastContact).getTime()) / 86400000) : Math.floor((Date.now() - new Date(l.dateFound).getTime()) / 86400000);
                  return days >= 3 && l.status !== 'converted' && l.status !== 'lost';
                }).length === 0 && (
                  <div className="text-center py-6 text-slate-500">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="text-sm">All leads are up to date!</div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Scoring Suggestions */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-purple-300 mb-4">🤖 AI Scoring Suggestions</h3>
              <div className="space-y-2 text-xs text-slate-400">
                <p>💡 <strong className="text-slate-300">Enterprise + Immediate timeline</strong> → Score 90+ (high intent)</p>
                <p>💡 <strong className="text-slate-300">$100K+ budget + 1-3 months</strong> → Score 85+ (qualified)</p>
                <p>💡 <strong className="text-slate-300">SMB + 6+ months</strong> → Score 50-60 (nurture)</p>
                <p>💡 <strong className="text-slate-300">Email Partnership source</strong> → +10 bonus (warm lead)</p>
                <p>💡 <strong className="text-slate-300">No contact in 7+ days</strong> → -10 penalty (decay)</p>
                <p>💡 <strong className="text-slate-300">Multiple pain points matched</strong> → +5 per match</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800/60 mt-8 py-6 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-xs">
            <div>
              <div className="text-slate-500 mb-1">📞 Mobile</div>
              <a href="tel:+13024640950" className="text-slate-300 hover:text-amber-400 transition">+1 302 464 0950</a>
            </div>
            <div>
              <div className="text-slate-500 mb-1">📧 Email</div>
              <a href="mailto:kleber@ziontechgroup.com" className="text-slate-300 hover:text-amber-400 transition">kleber@ziontechgroup.com</a>
            </div>
            <div>
              <div className="text-slate-500 mb-1">📍 Address</div>
              <span className="text-slate-300">364 E Main St STE 1008, Middletown, DE 19709</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-600">
            Zion Tech Group — Leads Control · {currentTime || '—'} · {stats.total} leads · {stats.discovered} discovered · {stats.emailPartnerships} partnerships · {stats.partnershipRate}% response rate
          </div>
        </div>
      </footer>

      {/* Floating Quick Add Button */}
      <button
        onClick={() => setShowAddLead(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white text-2xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-110 transition-all z-40 flex items-center justify-center"
        title="Quick Add Lead"
      >
        +
      </button>
    </div>
  );
}