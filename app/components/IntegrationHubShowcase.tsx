'use client';

import { useState } from 'react';

export default function IntegrationHubShowcase() {
  const [activeTab, setActiveTab] = useState<'crm' | 'calendar' | 'tasks' | 'communication'>('crm');

  const platforms = {
    crm: [
      { name: 'Salesforce', icon: '☁️', color: 'from-blue-500 to-blue-700', features: ['Contact sync', 'Opportunity tracking', 'Email logging', 'Lead scoring'] },
      { name: 'HubSpot', icon: '🧡', color: 'from-orange-500 to-orange-700', features: ['Deal pipeline', 'Contact management', 'Email sequences', 'Analytics'] },
      { name: 'Zoho CRM', icon: '🔵', color: 'from-cyan-500 to-cyan-700', features: ['Contact sync', 'Deal tracking', 'Workflow automation', 'Reports'] },
    ],
    calendar: [
      { name: 'Google Calendar', icon: '📅', color: 'from-red-500 to-red-700', features: ['Auto-scheduling', 'Availability check', 'Time zone handling', 'Recurring events'] },
      { name: 'Outlook', icon: '📧', color: 'from-blue-600 to-blue-800', features: ['Meeting booking', 'Room reservation', 'Attendee tracking', 'Reminders'] },
      { name: 'Calendly', icon: '🗓️', color: 'from-blue-400 to-blue-600', features: ['Self-scheduling', 'Buffer times', 'Custom questions', 'Payment collection'] },
    ],
    tasks: [
      { name: 'Asana', icon: '✅', color: 'from-pink-500 to-pink-700', features: ['Task creation', 'Project tracking', 'Deadline management', 'Team assignments'] },
      { name: 'Trello', icon: '📋', color: 'from-blue-500 to-blue-700', features: ['Card creation', 'Board organization', 'Checklists', 'Labels'] },
      { name: 'Jira', icon: '🔧', color: 'from-blue-700 to-blue-900', features: ['Issue tracking', 'Sprint planning', 'Bug reports', 'Agile workflows'] },
    ],
    communication: [
      { name: 'Slack', icon: '💬', color: 'from-purple-500 to-purple-700', features: ['Channel notifications', 'Direct messages', 'Thread replies', 'File sharing'] },
      { name: 'Microsoft Teams', icon: '🟣', color: 'from-indigo-500 to-indigo-700', features: ['Team alerts', 'Meeting links', 'Channel posts', 'File collaboration'] },
      { name: 'Discord', icon: '🎮', color: 'from-indigo-600 to-purple-600', features: ['Server notifications', 'Voice channels', 'Bot integration', 'Role management'] },
    ]
  };

  const workflowSteps = [
    {
      step: 1,
      icon: '📧',
      title: 'Email Arrives',
      description: 'AI analyzes email content, detects intent, extracts key information',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: 2,
      icon: '🤖',
      title: 'Smart Routing',
      description: 'Determines best action: create contact, schedule meeting, or create task',
      color: 'from-purple-500 to-pink-500'
    },
    {
      step: 3,
      icon: '🔗',
      title: 'Auto-Sync',
      description: 'Automatically syncs to CRM, Calendar, or Project Management tool',
      color: 'from-orange-500 to-red-500'
    },
    {
      step: 4,
      icon: '🔔',
      title: 'Notify Team',
      description: 'Sends notifications to Slack, Teams, or Discord with context',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const stats = [
    { value: '60%', label: 'Time Saved', description: 'On manual data entry' },
    { value: '12+', label: 'Integrations', description: 'Supported platforms' },
    { value: '100%', label: 'Automation', description: 'Zero manual steps' },
    { value: '24/7', label: 'Active', description: 'Always syncing' },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      <div className="container-page">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold mb-4">
            🔗 V87: AI Email Integration Hub
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Connect Email Intelligence to
            <span className="block text-purple-400 mt-2">All Your Business Tools</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Automatically sync contacts to CRM, schedule meetings, create tasks, and notify your team. 
            Zero manual steps, complete integration.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-colors">
              <div className="text-4xl font-bold text-purple-400 mb-2">{stat.value}</div>
              <div className="text-white font-semibold mb-1">{stat.label}</div>
              <div className="text-slate-400 text-sm">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Workflow Steps */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-8">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {workflowSteps.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 h-full hover:border-purple-500/50 transition-all hover:transform hover:-translate-y-1">
                  <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                    {step.icon}
                  </div>
                  <div className="text-purple-400 text-sm font-semibold mb-2">Step {step.step}</div>
                  <h4 className="text-white font-bold text-lg mb-2">{step.title}</h4>
                  <p className="text-slate-400 text-sm">{step.description}</p>
                </div>
                {i < workflowSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 text-purple-500 text-2xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-white text-center mb-8">Supported Integrations</h3>
          
          {/* Tab Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { id: 'crm', label: '📇 CRM Systems', count: 3 },
              { id: 'calendar', label: '📅 Calendar', count: 3 },
              { id: 'tasks', label: '✅ Project Management', count: 3 },
              { id: 'communication', label: '💬 Communication', count: 3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                {tab.label}
                <span className="ml-2 text-xs opacity-75">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Platform Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {platforms[activeTab].map((platform, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${platform.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {platform.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{platform.name}</h4>
                    <div className="text-green-400 text-sm">✓ Connected</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {platform.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2 text-slate-300 text-sm">
                      <span className="text-purple-400">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Example Workflow */}
        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-3xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Real-World Example: Sales Email Processing
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📧</div>
                <div className="flex-1">
                  <div className="text-purple-400 text-sm font-semibold mb-1">Email Received</div>
                  <div className="text-white font-semibold">From: John Smith (Enterprise Corp)</div>
                  <div className="text-slate-300 text-sm">Subject: RFP for AI Document Processing - Budget $50K</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                <div className="text-green-400 font-semibold mb-2">✅ Automatic Actions Taken:</div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>✓ Contact created in Salesforce</li>
                  <li>✓ Opportunity logged: $50,000</li>
                  <li>✓ Meeting scheduled for tomorrow 2 PM</li>
                  <li>✓ Task created: "Send proposal by Friday"</li>
                  <li>✓ Slack notification sent to #sales-team</li>
                </ul>
              </div>
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                <div className="text-blue-400 font-semibold mb-2">📊 Data Extracted:</div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>👤 Name: John Smith</li>
                  <li>🏢 Company: Enterprise Corp</li>
                  <li>💰 Budget: $50,000</li>
                  <li>📅 Timeline: Q2 2026</li>
                  <li>📞 Phone: +1 302 555 1234</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
              <div className="text-purple-400 font-semibold mb-2">⏱️ Time Saved: 45 minutes</div>
              <div className="text-slate-300 text-sm">
                Manual process would require: data entry (15 min) + calendar check (10 min) + task creation (10 min) + team notification (10 min)
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Automate Your Email Workflows?
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Connect all your business tools and save 60% of your time on manual data entry.
            Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:kleber@ziontechgroup.com?subject=V87%20Integration%20Hub%20Demo%20Request"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-purple-500/30"
            >
              🚀 Request Demo
            </a>
            <a
              href="tel:+130****0950"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-xl transition-all border border-slate-700"
            >
              📞 Call +1 302 464 0950
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
