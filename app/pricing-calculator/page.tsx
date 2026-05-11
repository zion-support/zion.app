'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Brain, Rocket } from 'lucide-react';

const PLANS = [
  { name: 'Starter', price: 499, icon: Zap, features: ['5 AI Services', '1,000 API calls/mo', 'Email Support', 'Basic Analytics'] },
  { name: 'Professional', price: 999, icon: Brain, popular: true, features: ['25 AI Services', '50,000 API calls/mo', 'Priority Support', 'Advanced Analytics', 'Custom Integration'] },
  { name: 'Enterprise', price: 2499, icon: Rocket, features: ['Unlimited AI Services', 'Unlimited API calls', '24/7 Phone Support', 'Custom SLA', 'Dedicated Manager', 'On-premise option'] }
];

export default function PricingCalculator() {
  const [users, setUsers] = useState(10);
  const [apiCalls, setApiCalls] = useState(10000);
  
  const getPrice = (basePrice: number) => {
    const userMultiplier = Math.max(1, users / 10);
    const apiMultiplier = Math.max(1, apiCalls / 10000);
    return Math.round(basePrice * userMultiplier * Math.sqrt(apiMultiplier));
  };

  return (
    <div className="min-h-screen bg-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Pricing Calculator</h1>
          <p className="text-xl text-slate-400">Calculate your custom AI solution pricing</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`bg-slate-800 rounded-2xl p-8 border ${plan.popular ? 'border-violet-500 relative' : 'border-slate-700'}`}>
              {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs px-3 py-1 rounded-full">Most Popular</span>}
              <plan.icon className="w-10 h-10 text-violet-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold text-white mb-6">${getPrice(plan.price)}<span className="text-lg text-slate-400 font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => <li key={f} className="flex items-center gap-2 text-slate-300"><Check className="w-4 h-4 text-green-400" />{f}</li>)}
              </ul>
              <a href="/contact" className={`block text-center py-3 rounded-lg font-medium transition-colors ${plan.popular ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}>Get Started</a>
            </motion.div>
          ))}
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-6">Estimate Your Needs</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-slate-300 mb-2">Number of Users: {users}</label>
              <input type="range" min="1" max="100" value={users} onChange={e => setUsers(+e.target.value)} className="w-full accent-violet-500" />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Monthly API Calls: {apiCalls.toLocaleString()}</label>
              <input type="range" min="1000" max="100000" step="1000" value={apiCalls} onChange={e => setApiCalls(+e.target.value)} className="w-full accent-violet-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
