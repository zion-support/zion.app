'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  ChevronRight,
  Zap,
  Brain,
  Target,
  TrendingUp,
  Star,
  MessageCircle,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  href: string;
  icon: string;
  popularity: number;
  trending: boolean;
}

interface SmartRecommendationEngineProps {
  userId?: string;
  pageContext?: string;
}

const aiProducts: Product[] = [
  {
    id: '1',
    name: 'AI Business Advisor',
    description: 'Intelligent business decisions made easy',
    category: 'Business',
    href: '/ai-business-advisor',
    icon: 'Brain',
    popularity: 98,
    trending: true
  },
  {
    id: '2',
    name: 'AI Content Generator',
    description: 'Create content at scale with AI',
    category: 'Marketing',
    href: '/ai-content-generator',
    icon: 'Sparkles',
    popularity: 95,
    trending: true
  },
  {
    id: '3',
    name: 'AI Analytics Pro',
    description: 'Deep insights from your data',
    category: 'Analytics',
    href: '/analytics-dashboard',
    icon: 'TrendingUp',
    popularity: 92,
    trending: false
  },
  {
    id: '4',
    name: 'AI Customer Chat',
    description: '24/7 AI-powered customer support',
    category: 'Support',
    href: '/ai-chatbot-builder',
    icon: 'MessageCircle',
    popularity: 94,
    trending: true
  },
  {
    id: '5',
    name: 'AI Voice Assistant',
    description: 'Natural language voice interactions',
    category: 'AI',
    href: '/ai-voice-assistant',
    icon: 'Mic',
    popularity: 89,
    trending: true
  },
  {
    id: '6',
    name: 'AI Security Monitor',
    description: 'Real-time threat detection',
    category: 'Security',
    href: '/ai-security-monitor',
    icon: 'Shield',
    popularity: 96,
    trending: false
  },
];

export default function SmartRecommendationEngine({
  userId: _userId,
  pageContext: _pageContext,
}: SmartRecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [viewedProducts, setViewedProducts] = useState<Set<string>>(new Set());
  const showTimeRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Track viewed products from localStorage
    const stored = localStorage.getItem('zion_viewed_products');
    if (stored) {
      setViewedProducts(new Set(JSON.parse(stored)));
    }

    // Generate personalized recommendations
    generateRecommendations();

    // Show after 15 seconds
    showTimeRef.current = setTimeout(() => {
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 15000);

    return () => {
      if (showTimeRef.current) clearTimeout(showTimeRef.current);
    };
  }, [dismissed, _pageContext]);

  const generateRecommendations = () => {
    // Simple recommendation algorithm based on popularity and trending
    const sorted = [...aiProducts].sort((a, b) => {
      const scoreA = a.popularity + (a.trending ? 20 : 0);
      const scoreB = b.popularity + (b.trending ? 20 : 0);
      return scoreB - scoreA;
    });
    setRecommendations(sorted.slice(0, 3));
  };

  const dismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    localStorage.setItem('zion_recommendation_dismissed', Date.now().toString());
  };

  const trackClick = (product: Product) => {
    const newViewed = new Set(viewedProducts);
    newViewed.add(product.id);
    setViewedProducts(newViewed);
    localStorage.setItem('zion_viewed_products', JSON.stringify([...newViewed]));
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, typeof Brain> = {
      Brain: Brain,
      Sparkles: Sparkles,
      TrendingUp: TrendingUp,
      MessageCircle: MessageCircle,
      Mic: Zap,
      Shield: Target,
    };
    const Icon = icons[iconName] || Sparkles;
    return <Icon className="w-5 h-5" />;
  };

  // Check if recently dismissed
  useEffect(() => {
    const dismissedTime = localStorage.getItem('zion_recommendation_dismissed');
    if (dismissedTime) {
      const hoursSinceDismiss = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
      if (hoursSinceDismiss < 24) {
        setDismissed(true);
      }
    }
  }, []);

  if (dismissed && !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-6 right-6 z-50 w-80"
        >
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm">AI Picks For You</span>
              </div>
              <button onClick={dismiss} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Recommendations */}
            <div className="p-3 space-y-2">
              {recommendations.map((product, index) => (
                <motion.a
                  key={product.id}
                  href={product.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => trackClick(product)}
                  className="block bg-slate-700/50 hover:bg-slate-700 rounded-xl p-3 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shrink-0">
                      {getIcon(product.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-medium text-sm truncate">{product.name}</h4>
                        {product.trending && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Hot
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{product.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Star className="w-3 h-3" /> {product.popularity}%
                        </span>
                        <span className="text-xs text-slate-500">{product.category}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors shrink-0" />
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Footer */}
            <div className="px-3 pb-3">
              <button
                onClick={() => setIsVisible(false)}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Show less suggestions
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}