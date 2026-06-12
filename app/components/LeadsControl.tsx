'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Lead {
  id: string;
  company: string;
  contact: string;
  email: string;
  source: string;
  industry: string;
  status: 'new' | 'contacted' | 'replied' | 'qualified' | 'converted' | 'lost';
  score: number;
  notes: string;
  dateFound: string;
  lastContact: string;
  services: string[];
  website?: string;
  painPoints?: string[];
}

interface OutreachTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  industry?: string;
}

// Original manual leads
const MANUAL_LEADS: Lead[] = [
  { id: 'l001', company: 'TechStart Inc', contact: 'Sarah Chen', email: 'sarah@techstart.io', source: 'LinkedIn', industry: 'SaaS', status: 'new', score: 85, notes: 'Looking for AI chatbot solution', dateFound: '2026-06-10', lastContact: '', services: ['AI Chatbot Builder', 'AI Customer Support Copilot'] },
  { id: 'l002', company: 'MedFlow Health', contact: 'Dr. James Wilson', email: 'jwilson@medflow.com', source: 'Web Search', industry: 'Healthcare', status: 'contacted', score: 92, notes: 'Needs patient scheduling AI + HIPAA compliance', dateFound: '2026-06-09', lastContact: '2026-06-11', services: ['AI Patient Scheduling', 'AI Clinical Trial Matching'] },
  { id: 'l003', company: 'RetailMax Corp', contact: 'Maria Garcia', email: 'mgarcia@retailmax.com', source: 'Cold Outreach', industry: 'Retail', status: 'replied', score: 78, notes: 'Interested in personalization engine', dateFound: '2026-06-08', lastContact: '2026-06-10', services: ['AI Retail Personalization', 'Subscription Analytics'] },
  { id: 'l004', company: 'FinanceHub', contact: 'Robert Kim', email: 'rkim@financehub.io', source: 'Referral', industry: 'FinTech', status: 'qualified', score: 95, notes: 'Ready to sign for fraud detection + financial close automation', dateFound: '2026-06-07', lastContact: '2026-06-11', services: ['AI Fraud Detection', 'AI Financial Close Automation'] },
  { id: 'l005', company: 'CloudScale Systems', contact: 'Alex Turner', email: 'aturner@cloudscale.io', source: 'LinkedIn', industry: 'Cloud', status: 'new', score: 88, notes: 'Needs cloud cost optimization + DRaaS', dateFound: '2026-06-11', lastContact: '', services: ['Cloud Cost Optimization', 'DRaaS'] },
  { id: 'l006', company: 'EduLearn Platform', contact: 'Lisa Park', email: 'lpark@edulearn.com', source: 'Web Search', industry: 'EdTech', status: 'contacted', score: 82, notes: 'Looking for personalized learning platform', dateFound: '2026-06-09', lastContact: '2026-06-10', services: ['AI Personalized Learning', 'AI Form Builder'] },
  { id: 'l007', company: 'SecureBank', contact: 'Michael Brown', email: 'mbrown@securebank.com', source: 'Conference', industry: 'Banking', status: 'new', score: 90, notes: 'Needs MDR 24/7 + zero trust network', dateFound: '2026-06-11', lastContact: '', services: ['MDR 24/7', 'Zero Trust Network Access'] },
  { id: 'l008', company: 'LogiTrans', contact: 'David Lee', email: 'dlee@logitrans.com', source: 'Cold Outreach', industry: 'Logistics', status: 'contacted', score: 75, notes: 'Interested in supply chain risk intelligence', dateFound: '2026-06-08', lastContact: '2026-06-09', services: ['AI Supply Chain Risk', 'Predictive Maintenance IoT'] },
];

// Auto-discovered prospects from lead finder
const DISCOVERED_LEADS: Lead[] = [
  { id: 'd001', company: 'HealthTech Solutions', contact: 'Discovery', email: '', source: 'Web Search', industry: 'Healthcare IT', status: 'new', score: 72, notes: 'Healthcare IT company seeking AI solutions for patient analytics', dateFound: '2026-06-12', lastContact: '', services: ['AI Patient Scheduling', 'AI Clinical Trial Matching'], painPoints: ['EHR integration', 'patient data analytics', 'HIPAA compliance'] },
  { id: 'd002', company: 'PayGuard Financial', contact: 'Discovery', email: '', source: 'Web Search', industry: 'FinTech', status: 'new', score: 68, notes: 'FinTech company exploring AI fraud detection and compliance automation', dateFound: '2026-06-12', lastContact: '', services: ['AI Fraud Detection', 'AI Financial Close Automation'], painPoints: ['fraud detection', 'compliance AI', 'AML'] },
  { id: 'd003', company: 'ShopSmart AI', contact: 'Discovery', email: '', source: 'Web Search', industry: 'Retail/E-commerce', status: 'new', score: 65, notes: 'E-commerce platform looking for AI personalization and recommendation engine', dateFound: '2026-06-12', lastContact: '', services: ['AI Retail Personalization', 'Subscription Analytics'], painPoints: ['recommendation engine', 'churn prediction', 'dynamic pricing'] },
  { id: 'd004', company: 'EduVance Learning', contact: 'Discovery', email: '', source: 'Web Search', industry: 'EdTech', status: 'new', score: 63, notes: 'EdTech company seeking adaptive learning and automated grading solutions', dateFound: '2026-06-12', lastContact: '', services: ['AI Personalized Learning', 'AI Form Builder'], painPoints: ['personalized learning', 'automated grading', 'engagement AI'] },
  { id: 'd005', company: 'LogiFlow Systems', contact: 'Discovery', email: '', source: 'Web Search', industry: 'Logistics', status: 'new', score: 61, notes: 'Logistics company exploring AI route optimization and demand forecasting', dateFound: '2026-06-12', lastContact: '', services: ['AI Supply Chain Risk', 'Predictive Maintenance IoT'], painPoints: ['route optimization', 'demand forecasting', 'predictive maintenance'] },
  { id: 'd006', company: 'MediCore Health', contact: 'Discovery', email: '', source: 'Web Search', industry: 'Healthcare IT', status: 'new', score: 70, notes: 'Healthcare organization seeking clinical decision support AI', dateFound: '2026-06-12', lastContact: '', services: ['AI Clinical Trial Matching', 'AI Patient Scheduling'], painPoints: ['clinical decision support', 'AI diagnostics', 'operational efficiency'] },
  { id: 'd007', company: 'FinSecure Global', contact: 'Discovery', email: '', source: 'Web Search', industry: 'FinTech', status: 'new', score: 67, notes: 'Financial services firm exploring AI risk assessment and credit scoring', dateFound: '2026-06-12', lastContact: '', services: ['AI Fraud Detection', 'AI Financial Close Automation'], painPoints: ['risk assessment', 'credit scoring', 'regulatory compliance'] },
  { id: 'd008', company: 'RetailHub Pro', contact: 'Discovery', email: '', source: 'Web Search', industry: 'Retail/E-commerce', status: 'new', score: 62, notes: 'Retail company seeking AI inventory management and customer segmentation', dateFound: '2026-06-12', lastContact: '', services: ['AI Retail Personalization', 'Subscription Analytics'], painPoints: ['inventory AI', 'customer segmentation', 'conversion optimization'] },
  { id: 'd009', company: 'LearnTech Academy', contact: 'Discovery', email: '', source: 'Web Search', industry: 'EdTech', status: 'new', score: 59, notes: 'Education platform looking for AI tutor and content generation', dateFound: '2026-06-12', lastContact: '', services: ['AI Personalized Learning', 'AI Form Builder'], painPoints: ['AI tutor', 'content generation', 'student analytics'] },
  { id: 'd010', company: 'ChainSync Logistics', contact: 'Discovery', email: '', source: 'Web Search', industry: 'Logistics', status: 'new', score: 58, notes: 'Supply chain company exploring predictive maintenance and risk intelligence', dateFound: '2026-06-12', lastContact: '', services: ['AI Supply Chain Risk', 'Predictive Maintenance IoT'], painPoints: ['predictive maintenance', 'supply chain visibility', 'risk intelligence'] },
  { id: 'd011', company: 'CyberShield Inc', contact: 'Discovery', email: '', source: 'Web Search', industry: 'Cybersecurity', status: 'new', score: 66, notes: 'Cybersecurity company seeking AI threat detection and SIEM solutions', dateFound: '2026-06-12', lastContact: '', services: ['MDR 24/7', 'Zero Trust Network Access'], painPoints: ['threat detection', 'SIEM AI', 'zero trust'] },
  { id: 'd012', company: 'InsureTech Pro', contact: 'Discovery', email: '', source: 'Web Search', industry: 'Insurance', status: 'new', score: 64, notes: 'Insurance company exploring AI claims processing and risk scoring', dateFound: '2026-06-12', lastContact: '', services: ['AI Fraud Detection', 'AI Financial Close Automation'], painPoints: ['claims automation', 'risk scoring', 'fraud detection'] },
  { id: 'd013', company: 'LegalAI Systems', contact: 'Discovery', email: '', source: 'Web Search', industry: 'Legal Tech', status: 'new', score: 60, notes: 'Legal tech company seeking AI contract analysis and compliance', dateFound: '2026-06-12', lastContact: '', services: ['AI Document Processing Pipeline', 'AI Compliance Monitor'], painPoints: ['contract analysis', 'legal research AI', 'compliance'] },
  { id: 'd014', company: 'PropTech Valuations', contact: 'Discovery', email: '', source: 'Web Search', industry: 'Real Estate Tech', status: 'new', score: 57, notes: 'Real estate tech company exploring AI property valuation and market prediction', dateFound: '2026-06-12', lastContact: '', services: ['AI Predictive Churn Analytics', 'Subscription Analytics'], painPoints: ['property valuation AI', 'market prediction', 'virtual tours'] },
  { id: 'd015', company: 'FactoryAI Manufacturing', contact: 'Discovery', email: '', source: 'Web Search', industry: 'Manufacturing', status: 'new', score: 69, notes: 'Manufacturing company seeking Industry 4.0 AI and predictive maintenance', dateFound: '2026-06-12', lastContact: '', services: ['Predictive Maintenance IoT', 'AI Supply Chain Risk'], painPoints: ['predictive maintenance', 'quality AI', 'digital twin'] },
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

const INDUSTRIES = ['all', 'SaaS', 'Healthcare', 'Retail', 'FinTech', 'Cloud', 'EdTech', 'Banking', 'Logistics', 'Healthcare IT', 'Retail/E-commerce', 'Cybersecurity', 'Insurance', 'Legal Tech', 'Real Estate Tech', 'Manufacturing'];

export default function LeadsControl() {
  const [leads, setLeads] = useState<Lead[]>(ALL_LEADS);
  const [filter, setFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'discovered' | 'templates' | 'stats'>('leads');
  const [currentTime, setCurrentTime] = useState('');
  const [composeTemplate, setComposeTemplate] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({ company: '', contact: '', email: '', industry: '', notes: '', services: [] });

  useEffect(() => {
    const update = () => setCurrentTime(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour12: true, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredLeads = leads.filter(l => {
    if (filter !== 'all' && l.status !== filter) return false;
    if (industryFilter !== 'all' && l.industry !== industryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return l.company.toLowerCase().includes(q) || l.contact.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.industry.toLowerCase().includes(q);
    }
    return true;
  });

  const manualLeads = filteredLeads.filter(l => l.id.startsWith('l'));
  const discoveredLeads = filteredLeads.filter(l => l.id.startsWith('d'));

  const stats = {
    total: leads.length,
    manual: leads.filter(l => l.id.startsWith('l')).length,
    discovered: leads.filter(l => l.id.startsWith('d')).length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    replied: leads.filter(l => l.status === 'replied').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    converted: leads.filter(l => l.status === 'converted').length,
    avgScore: Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length),
    highScore: leads.filter(l => l.score >= 80).length,
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status, lastContact: new Date().toISOString().split('T')[0] } : l));
  };

  const openCompose = (lead: Lead, templateId?: string) => {
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
  };

  const handleTemplateChange = (lead: Lead, templateId: string) => {
    const t = OUTREACH_TEMPLATES.find(t => t.id === templateId);
    if (t) {
      setComposeTemplate(templateId);
      setComposeSubject(t.subject.replace(/{{company}}/g, lead.company).replace(/{{contact}}/g, lead.contact).replace(/{{industry}}/g, lead.industry).replace(/{{services}}/g, lead.services.join(', ')));
      setComposeBody(t.body.replace(/{{company}}/g, lead.company).replace(/{{contact}}/g, lead.contact).replace(/{{industry}}/g, lead.industry).replace(/{{services}}/g, lead.services.join('\n• ')));
    }
  };

  const addLead = () => {
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
    };
    setLeads(prev => [lead, ...prev]);
    setNewLead({ company: '', contact: '', email: '', industry: '', notes: '', services: [] });
    setShowAddLead(false);
  };

  const bulkAction = (action: string) => {
    const visibleIds = (activeTab === 'leads' ? manualLeads : discoveredLeads).map(l => l.id);
    if (action === 'export') {
      const csv = 'Company,Contact,Email,Industry,Score,Status,Services\n' +
        visibleIds.map(id => {
          const l = leads.find(x => x.id === id);
          return l ? `"${l.company}","${l.contact}","${l.email}","${l.industry}",${l.score},"${l.status}","${l.services.join('; ')}"` : '';
        }).filter(Boolean).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (action === 'mark-contacted') {
      setLeads(prev => prev.map(l => visibleIds.includes(l.id) && l.status === 'new' ? { ...l, status: 'contacted' as const, lastContact: new Date().toISOString().split('T')[0] } : l));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
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
            <Link href="/agents-monitoring" className="text-xs text-slate-400 hover:text-white transition border border-slate-700/60 rounded-lg px-3 py-1.5">📊 Dashboard</Link>
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition border border-slate-700/60 rounded-lg px-3 py-1.5">← Main Site</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Bar */}
        <section className="grid grid-cols-3 md:grid-cols-10 gap-2 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'text-purple-400', border: 'border-purple-500/20' },
            { label: 'Manual', value: stats.manual, color: 'text-blue-400', border: 'border-blue-500/20' },
            { label: 'Discovered', value: stats.discovered, color: 'text-cyan-400', border: 'border-cyan-500/20' },
            { label: 'New', value: stats.new, color: 'text-blue-400', border: 'border-blue-500/20' },
            { label: 'Contacted', value: stats.contacted, color: 'text-amber-400', border: 'border-amber-500/20' },
            { label: 'Replied', value: stats.replied, color: 'text-purple-400', border: 'border-purple-500/20' },
            { label: 'Qualified', value: stats.qualified, color: 'text-emerald-400', border: 'border-emerald-500/20' },
            { label: 'Converted', value: stats.converted, color: 'text-green-400', border: 'border-green-500/20' },
            { label: 'High Score', value: stats.highScore, color: 'text-amber-400', border: 'border-amber-500/20' },
            { label: 'Avg Score', value: stats.avgScore, color: 'text-cyan-400', border: 'border-cyan-500/20' },
          ].map((s, i) => (
            <div key={i} className={`bg-slate-900/80 border ${s.border} rounded-xl p-2.5 text-center`}>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[8px] text-slate-500 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-slate-900/40 rounded-lg p-1 border border-slate-800/40">
          {([
            { id: 'leads' as const, label: `🎯 Manual Leads (${manualLeads.length})` },
            { id: 'discovered' as const, label: `🔍 Discovered (${discoveredLeads.length})` },
            { id: 'templates' as const, label: `📧 Templates (${OUTREACH_TEMPLATES.length})` },
            { id: 'stats' as const, label: '📊 Pipeline' },
          ]).map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 text-xs py-2 rounded-md transition font-medium ${activeTab === tab.id ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leads Tab */}
        {(activeTab === 'leads' || activeTab === 'discovered') && (
          <div>
            <div className="flex gap-2 mb-4 flex-wrap items-center">
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 px-3 py-2 w-40 placeholder-slate-500" />
              <select value={industryFilter} onChange={e => setIndustryFilter(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 px-3 py-2">
                {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind === 'all' ? 'All Industries' : ind}</option>)}
              </select>
              {['all', 'new', 'contacted', 'replied', 'qualified', 'converted', 'lost'].map(s => (
                <button key={s} onClick={() => setFilter(s)} className={`text-[10px] px-3 py-1.5 rounded-lg border transition ${filter === s ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'}`}>
                  {s === 'all' ? 'All' : STATUS_LABELS[s] || s}
                </button>
              ))}
              <div className="flex-1" />
              <button onClick={() => setShowAddLead(true)} className="text-[10px] bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-500">+ Add Lead</button>
              <button onClick={() => bulkAction('export')} className="text-[10px] bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-600">📥 Export CSV</button>
              {activeTab === 'discovered' && (
                <button onClick={() => bulkAction('mark-contacted')} className="text-[10px] bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-500">📧 Mark All Contacted</button>
              )}
            </div>
            <div className="space-y-3">
              {(activeTab === 'leads' ? manualLeads : discoveredLeads).map(lead => (
                <div key={lead.id} className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 hover:border-amber-500/30 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-sm font-semibold text-slate-200">{lead.company}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border ${STATUS_COLORS[lead.status]}`}>{STATUS_LABELS[lead.status]}</span>
                        <span className="text-[9px] text-cyan-400">Score: {lead.score}</span>
                        <span className="text-[9px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{lead.source}</span>
                      </div>
                      <div className="text-xs text-slate-400 mb-1">{lead.contact} {lead.email ? `· ${lead.email}` : ''} · {lead.industry}</div>
                      <div className="text-xs text-slate-500 mb-2">{lead.notes}</div>
                      {lead.painPoints && lead.painPoints.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1">
                          {lead.painPoints.map(p => (<span key={p} className="text-[9px] bg-red-500/10 text-red-300 px-1.5 py-0.5 rounded">⚠ {p}</span>))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {lead.services.map(s => (<span key={s} className="text-[9px] bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded">{s}</span>))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      {lead.status === 'new' && <button onClick={() => updateLeadStatus(lead.id, 'contacted')} className="text-[10px] bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-500">📧 Contacted</button>}
                      {lead.status === 'contacted' && <button onClick={() => updateLeadStatus(lead.id, 'replied')} className="text-[10px] bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-500">💬 Replied</button>}
                      {lead.status === 'replied' && <button onClick={() => updateLeadStatus(lead.id, 'qualified')} className="text-[10px] bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-500">✅ Qualify</button>}
                      {lead.status === 'qualified' && <button onClick={() => updateLeadStatus(lead.id, 'converted')} className="text-[10px] bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-500">🎉 Convert</button>}
                      <button onClick={() => openCompose(lead, 't001')} className="text-[10px] bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-600">📧 Compose</button>
                    </div>
                  </div>
                </div>
              ))}
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

        {/* Templates Tab */}
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

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Pipeline Funnel</h3>
              <div className="space-y-3">
                {[
                  { label: 'New', count: stats.new, total: stats.total, color: 'bg-blue-500' },
                  { label: 'Contacted', count: stats.contacted, total: stats.total, color: 'bg-amber-500' },
                  { label: 'Replied', count: stats.replied, total: stats.total, color: 'bg-purple-500' },
                  { label: 'Qualified', count: stats.qualified, total: stats.total, color: 'bg-emerald-500' },
                  { label: 'Converted', count: stats.converted, total: stats.total, color: 'bg-green-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-20">{item.label}</span>
                    <div className="flex-1 h-6 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full flex items-center justify-end pr-2`} style={{ width: `${Math.max(5, (item.count / item.total) * 100)}%` }}>
                        <span className="text-[10px] text-white font-bold">{item.count}</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 w-12 text-right">{Math.round((item.count / item.total) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-amber-300 mb-3">📋 Lead Generation Strategy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { title: '🔥 High-Priority (80+ score)', desc: 'Contact within 24h. Use Proposal template. Personalize with company-specific pain points.' },
                  { title: '📧 Cold Outreach Best Practices', desc: 'Research company first. Reference their recent news. Keep under 150 words. Specific CTA.' },
                  { title: '💬 Follow-Up Schedule', desc: 'Day 1: Initial. Day 3: Follow-up. Day 7: Re-engage. Day 14: Final. Then monthly nurture.' },
                  { title: '🎯 Conversion Tips', desc: 'Free proposal. Reference similar companies. ROI projection. <150 words. One clear CTA.' },
                  { title: '🏥 Healthcare IT', desc: 'Lead with HIPAA compliance. Emphasize patient outcomes. Reference EHR integration.' },
                  { title: '💰 FinTech', desc: 'Lead with fraud reduction stats. Emphasize regulatory compliance. Reference real-time processing.' },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-900/60 rounded-lg p-3">
                    <div className="text-xs font-semibold text-slate-200">{s.title}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-200 mb-3">📊 Lead Sources</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { source: 'LinkedIn', count: leads.filter(l => l.source === 'LinkedIn').length, color: 'text-blue-400' },
                  { source: 'Web Search', count: leads.filter(l => l.source === 'Web Search').length, color: 'text-cyan-400' },
                  { source: 'Referral', count: leads.filter(l => l.source === 'Referral').length, color: 'text-emerald-400' },
                  { source: 'Cold Outreach', count: leads.filter(l => l.source === 'Cold Outreach').length, color: 'text-amber-400' },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <div className={`text-lg font-bold ${s.color}`}>{s.count}</div>
                    <div className="text-[9px] text-slate-500">{s.source}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Lead Modal */}
        {showAddLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAddLead(false)}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">+ Add New Lead</h3>
                <button onClick={() => setShowAddLead(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
              </div>
              <div className="space-y-3">
                <input value={newLead.company || ''} onChange={e => setNewLead(p => ({ ...p, company: e.target.value }))} placeholder="Company name *" className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 px-3 py-2" />
                <input value={newLead.contact || ''} onChange={e => setNewLead(p => ({ ...p, contact: e.target.value }))} placeholder="Contact name" className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 px-3 py-2" />
                <input value={newLead.email || ''} onChange={e => setNewLead(p => ({ ...p, email: e.target.value }))} placeholder="Email" className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 px-3 py-2" />
                <select value={newLead.industry || ''} onChange={e => setNewLead(p => ({ ...p, industry: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 px-3 py-2">
                  <option value="">Select industry...</option>
                  {INDUSTRIES.filter(i => i !== 'all').map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
                <textarea value={newLead.notes || ''} onChange={e => setNewLead(p => ({ ...p, notes: e.target.value }))} placeholder="Notes..." rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 px-3 py-2 resize-none" />
                <button onClick={addLead} className="w-full px-4 py-2 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-500 font-medium">Add Lead</button>
              </div>
            </div>
          </div>
        )}

        {/* Compose Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedLead(null)}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">📧 Compose to {selectedLead.contact}</h3>
                <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-white text-xl">✕</button>
              </div>
              <div className="space-y-3">
                <div className="text-xs text-slate-400">To: {selectedLead.contact} &lt;{selectedLead.email}&gt; · {selectedLead.company} · {selectedLead.industry}</div>
                <select value={composeTemplate} onChange={e => handleTemplateChange(selectedLead, e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 px-3 py-2">
                  <option value="">Select template...</option>
                  {OUTREACH_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}{t.industry ? ` (${t.industry})` : ''}</option>)}
                </select>
                <input value={composeSubject} onChange={e => setComposeSubject(e.target.value)} placeholder="Subject..." className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 px-3 py-2" />
                <textarea value={composeBody} onChange={e => setComposeBody(e.target.value)} rows={12} className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 px-3 py-2 resize-none font-mono" />
                <div className="flex gap-2">
                  <button onClick={() => { if (selectedLead.email) window.open(`mailto:${selectedLead.email}?subject=${encodeURIComponent(composeSubject)}&body=${encodeURIComponent(composeBody)}`); }} className="px-4 py-2 bg-amber-600 text-white text-xs rounded-lg hover:bg-amber-500">📧 Open in Email</button>
                  <button onClick={() => { updateLeadStatus(selectedLead.id, 'contacted'); setSelectedLead(null); }} className="px-4 py-2 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-500">✅ Mark Contacted</button>
                  <button onClick={() => setSelectedLead(null)} className="px-4 py-2 bg-slate-700 text-slate-300 text-xs rounded-lg hover:bg-slate-600">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800/60 mt-8 py-4 text-center text-[10px] text-slate-600">
        <p>Zion Tech Group — Leads Control · {currentTime || '—'} · {stats.total} leads · {stats.discovered} discovered</p>
      </footer>
    </div>
  );
}
