/**
 * Market Price Tracker Component
 * Displays real-time market pricing for AI products and services
 */

'use client';

import { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, ChevronRight, Loader2 } from 'lucide-react';

type PriceData = {
  slug: string;
  title: string;
  category: string;
  price: number;
  priceRange?: { min: number; max: number };
  confidence: string;
  purchaseUrl: string;
};

const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'Customer Experience', label: 'Customer Experience' },
  { id: 'Growth', label: 'Growth' },
  { id: 'Operations', label: 'Operations' },
  { id: 'Security', label: 'Security' },
  { id: 'Development', label: 'Development' }
];

export default function MarketPriceTracker() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/market-prices');
      if (response.ok) {
        const data = await response.json();
        setPrices(data.prices || []);
        setLastUpdated(data.lastUpdated);
      }
    } catch (e) {
      console.error('Failed to load prices:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrices = category === 'all' 
    ? prices 
    : prices.filter(p => p.category === category);

  const totalMonthly = filteredPrices.reduce((sum, p) => sum + (p.price || 0), 0);
  const avgPrice = filteredPrices.length > 0 
    ? Math.round(totalMonthly / filteredPrices.length) 
    : 0;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="text-green-400" />
            Market Price Tracker
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time pricing for all AI products & services
          </p>
        </div>
        
        <button 
          onClick={loadPrices}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="text-slate-400 text-xs uppercase tracking-wider">Products</div>
          <div className="text-2xl font-bold text-white mt-1">{filteredPrices.length}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="text-slate-400 text-xs uppercase tracking-wider">Avg Price</div>
          <div className="text-2xl font-bold text-green-400 mt-1">${avgPrice}/mo</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="text-slate-400 text-xs uppercase tracking-wider">Total</div>
          <div className="text-2xl font-bold text-white mt-1">${totalMonthly}/mo</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              category === cat.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Price List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-400" size={32} />
        </div>
      ) : (
        <div className="space-y-2">
          {filteredPrices.map(product => (
            <div 
              key={product.slug}
              className="flex items-center justify-between bg-slate-800/50 hover:bg-slate-700/50 rounded-xl p-4 border border-slate-700 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{product.title}</span>
                  <span className="px-2 py-0.5 bg-slate-600 rounded text-xs text-slate-300">
                    {product.category}
                  </span>
                  {product.confidence === 'high' && (
                    <span className="px-2 py-0.5 bg-green-900/50 rounded text-xs text-green-400">
                      Verified
                    </span>
                  )}
                </div>
                {product.priceRange && (
                  <div className="text-slate-400 text-sm mt-1">
                    Range: ${product.priceRange.min} - ${product.priceRange.max}/mo
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">
                    ${product.price}
                  </div>
                  <div className="text-slate-500 text-xs">/month</div>
                </div>
                
                <a
                  href={product.purchaseUrl}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm transition-colors"
                >
                  Buy
                  <ChevronRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {lastUpdated && (
        <div className="text-center text-slate-500 text-xs mt-4">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  );
}