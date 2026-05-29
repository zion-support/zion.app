'use client';

import { useState } from 'react';
import { allServices } from '../data/servicesData';

interface SelectedService {
  id: string;
  title: string;
  category: string;
  pricing: { basic: string; pro: string; enterprise: string };
  tier: 'basic' | 'pro' | 'enterprise';
}

export default function ServiceConfigurator() {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProposal, setShowProposal] = useState(false);

  const filteredServices = allServices
    .filter(s => 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 15);

  const addService = (service: any) => {
    if (!selectedServices.find(s => s.id === service.id)) {
      setSelectedServices([
        ...selectedServices,
        {
          id: service.id,
          title: service.title,
          category: service.category,
          pricing: service.pricing,
          tier: 'pro' as const
        }
      ]);
    }
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(s => s.id !== serviceId));
  };

  const updateTier = (serviceId: string, tier: 'basic' | 'pro' | 'enterprise') => {
    setSelectedServices(selectedServices.map(s => 
      s.id === serviceId ? { ...s, tier } : s
    ));
  };

  const calculateTotal = () => {
    const subtotal = selectedServices.reduce((sum, service) => {
      const price = parseInt(service.pricing[service.tier].replace(/\D/g, ''));
      return sum + price;
    }, 0);
    
    // Bundle discount: 10% for 3+ services, 15% for 5+ services, 20% for 8+ services
    let discount = 0;
    if (selectedServices.length >= 8) discount = 0.20;
    else if (selectedServices.length >= 5) discount = 0.15;
    else if (selectedServices.length >= 3) discount = 0.10;
    
    const discountAmount = Math.round(subtotal * discount);
    const total = subtotal - discountAmount;
    
    return { subtotal, discount, discountAmount, total };
  };

  const { subtotal, discount, discountAmount, total } = calculateTotal();

  const generateProposal = () => {
    setShowProposal(true);
  };

  const resetConfigurator = () => {
    setSelectedServices([]);
    setShowProposal(false);
    setSearchTerm('');
  };

  if (showProposal && selectedServices.length > 0) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-3xl p-8 md:p-12 border border-purple-500/30">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            📋 Your Custom Solution Proposal
          </h2>
          <p className="text-slate-300 text-lg">
            {selectedServices.length} services configured with {discount * 100}% bundle discount
          </p>
        </div>

        {/* Architecture Diagram */}
        <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-700 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">🏗️ Solution Architecture</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedServices.map((service, idx) => (
              <div
                key={service.id}
                className="bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-lg p-4 border border-purple-500/30 text-center"
              >
                <div className="text-2xl mb-2">
                  {service.category === 'ai' ? '🧠' : 
                   service.category === 'security' ? '🛡️' :
                   service.category === 'cloud' ? '☁️' :
                   service.category === 'data' ? '📊' : '⚙️'}
                </div>
                <div className="text-white text-sm font-semibold">{service.title}</div>
                <div className="text-slate-400 text-xs mt-1">{service.tier.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-700 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">💰 Pricing Breakdown</h3>
          <div className="space-y-3">
            {selectedServices.map(service => (
              <div key={service.id} className="flex justify-between items-center py-2 border-b border-slate-700">
                <div>
                  <span className="text-white font-medium">{service.title}</span>
                  <span className="text-slate-400 text-sm ml-2">({service.tier})</span>
                </div>
                <span className="text-green-400 font-semibold">
                  ${service.pricing[service.tier]}/mo
                </span>
              </div>
            ))}
            
            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString()}/mo</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Bundle Discount ({discount * 100}%):</span>
                  <span>-${discountAmount.toLocaleString()}/mo</span>
                </div>
              )}
              <div className="flex justify-between text-white text-xl font-bold pt-2 border-t border-slate-600">
                <span>Total:</span>
                <span className="text-purple-400">${total.toLocaleString()}/mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl p-6 border border-green-500/30 mb-8">
          <h3 className="text-xl font-bold text-white mb-3">✨ What You Get</h3>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Dedicated implementation team</li>
            <li>✓ 24/7 priority support</li>
            <li>✓ Custom integrations with your existing systems</li>
            <li>✓ Monthly optimization reviews</li>
            <li>✓ 30-day money-back guarantee</li>
            {selectedServices.length >= 5 && <li>✓ Free training sessions for your team</li>}
            {selectedServices.length >= 8 && <li>✓ Dedicated account manager</li>}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetConfigurator}
            className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-all"
          >
            ← Modify Configuration
          </button>
          <a
            href="mailto:kleber@ziontechgroup.com?subject=Custom Solution Proposal Request"
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all text-center"
          >
            📧 Request Full Proposal
          </a>
          <a
            href="tel:+13024640950"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all text-center"
          >
            📞 Call +1 302 464 0950
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-3xl p-8 md:p-12 border border-purple-500/30">
      <div className="text-center mb-8">
        <span className="inline-block px-4 py-2 bg-green-600/30 text-green-300 rounded-full text-sm font-semibold mb-4">
          🎨 NEW: Build Your Custom Solution
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Interactive Service Configurator
        </h2>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          Build your perfect solution by selecting services. Get bundle discounts and see real-time pricing.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Service Selection */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Add Services</h3>
          
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all mb-4"
          />

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredServices.map(service => {
              const isSelected = selectedServices.find(s => s.id === service.id);
              return (
                <button
                  key={service.id}
                  onClick={() => !isSelected && addService(service)}
                  disabled={!!isSelected}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-purple-600/30 border-purple-500 cursor-not-allowed'
                      : 'bg-slate-900/60 border-slate-700 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-sm mb-1">{service.title}</h4>
                      <p className="text-slate-400 text-xs line-clamp-2">{service.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-slate-500">{service.category}</span>
                        <span className="text-xs text-green-400 font-semibold">
                          From ${service.pricing.basic}/mo
                        </span>
                      </div>
                    </div>
                    {isSelected && <span className="text-purple-400 text-xl">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Configuration Panel */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Your Configuration ({selectedServices.length} services)
          </h3>

          {selectedServices.length === 0 ? (
            <div className="bg-slate-900/60 rounded-lg p-8 border border-slate-700 text-center">
              <div className="text-4xl mb-3">📦</div>
              <p className="text-slate-400">No services selected yet</p>
              <p className="text-slate-500 text-sm mt-2">Add services to build your custom solution</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedServices.map(service => (
                <div key={service.id} className="bg-slate-900/60 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-white font-semibold text-sm">{service.title}</h4>
                    <button
                      onClick={() => removeService(service.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {(['basic', 'pro', 'enterprise'] as const).map(tier => (
                      <button
                        key={tier}
                        onClick={() => updateTier(service.id, tier)}
                        className={`flex-1 py-2 px-3 rounded text-xs font-semibold transition-all ${
                          service.tier === tier
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {tier.toUpperCase()}
                        <div className="text-xs mt-1">${service.pricing[tier]}/mo</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Pricing Summary */}
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-4 border border-purple-500/30">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal:</span>
                    <span>${subtotal.toLocaleString()}/mo</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Bundle Discount ({discount * 100}%):</span>
                      <span>-${discountAmount.toLocaleString()}/mo</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white text-lg font-bold pt-2 border-t border-slate-600">
                    <span>Total:</span>
                    <span className="text-purple-400">${total.toLocaleString()}/mo</span>
                  </div>
                </div>
              </div>

              {selectedServices.length >= 3 && (
                <div className="bg-green-600/20 rounded-lg p-3 border border-green-500/30 text-center">
                  <span className="text-green-300 text-sm font-semibold">
                    💰 You're saving ${discountAmount.toLocaleString()}/mo with bundle pricing!
                  </span>
                </div>
              )}

              <button
                onClick={generateProposal}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all text-lg"
              >
                Generate Proposal →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
