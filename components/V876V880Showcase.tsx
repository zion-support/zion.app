import React from 'react'
import { TrendingUp, Target, Users, Briefcase, DollarSign } from 'lucide-react'

export default function V876V880Showcase() {
  const engines = [
    {
      id: 'V876',
      name: 'AI Sales Forecasting',
      icon: TrendingUp,
      description: 'Pipeline analysis and win probability scoring',
      color: 'from-blue-500 to-cyan-500',
      features: ['Pipeline health analysis', 'Win probability scoring', 'Forecast accuracy tracking', 'Revenue prediction']
    },
    {
      id: 'V877',
      name: 'Marketing Attribution',
      icon: Target,
      description: 'Multi-touch attribution and channel effectiveness',
      color: 'from-purple-500 to-pink-500',
      features: ['Multi-touch attribution', 'Channel effectiveness', 'ROI optimization', 'Budget allocation']
    },
    {
      id: 'V878',
      name: 'Customer Success Intelligence',
      icon: Users,
      description: 'Health scoring and churn prevention',
      color: 'from-green-500 to-emerald-500',
      features: ['Customer health scoring', 'Churn prediction', 'Expansion opportunities', 'NPS analysis']
    },
    {
      id: 'V879',
      name: 'HR & Talent Intelligence',
      icon: Briefcase,
      description: 'Engagement analysis and retention risk',
      color: 'from-orange-500 to-red-500',
      features: ['Engagement analysis', 'Retention risk', 'Performance trends', 'Skills gaps']
    },
    {
      id: 'V880',
      name: 'Financial Planning & Analysis',
      icon: DollarSign,
      description: 'Budget variance and cash flow forecasting',
      color: 'from-yellow-500 to-amber-500',
      features: ['Budget variance', 'Cash flow forecast', 'Scenario modeling', 'KPI tracking']
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            V876-V880: Advanced Analytics & Automation Suite
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Five cutting-edge AI engines delivering actionable intelligence across sales, marketing, 
            customer success, HR, and finance operations
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">880+</div>
            <div className="text-gray-600">Total Engines</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">4,177</div>
            <div className="text-gray-600">Total Services</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">20+</div>
            <div className="text-gray-600">Domains</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
            <div className="text-gray-600">Reply-All Enforced</div>
          </div>
        </div>

        {/* Engines Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {engines.map((engine) => {
            const Icon = engine.icon
            return (
              <div
                key={engine.id}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${engine.color} mb-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="mb-2">
                  <span className="text-sm font-semibold text-gray-500">{engine.id}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{engine.name}</h3>
                <p className="text-gray-600 mb-6">{engine.description}</p>
                <ul className="space-y-2">
                  {engine.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Services Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-6">30 New Services Added</h3>
          <div className="grid md:grid-cols-5 gap-6 mb-8">
            <div>
              <div className="text-3xl font-bold mb-2">6</div>
              <div className="text-blue-100">Sales Intelligence</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">6</div>
              <div className="text-blue-100">Marketing Intelligence</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">6</div>
              <div className="text-blue-100">Customer Success</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">6</div>
              <div className="text-blue-100">HR Intelligence</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">6</div>
              <div className="text-blue-100">Financial Intelligence</div>
            </div>
          </div>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Each engine includes 6 specialized services with intelligent email analysis, 
            actionable recommendations, and reply-all enforcement for team collaboration
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/services"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-shadow duration-300"
          >
            Explore All 4,177 Services →
          </a>
        </div>
      </div>
    </section>
  )
}
