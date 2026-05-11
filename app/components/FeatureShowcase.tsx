/**
 * Feature Showcase Component
 * Advertises new AI features and autonomous capabilities
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  Shield,
  Zap,
  TrendingUp,
  HeadphonesIcon,
  Globe,
  Cpu,
  Sparkles,
  ArrowRight,
  DollarSign,
} from 'lucide-react';

type Feature = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  href?: string;
  stat?: string;
};

const AUTONOMOUS_FEATURES: Feature[] = [
  {
    id: 'ai-chat',
    icon: <HeadphonesIcon size={24} />,
    title: 'AI Chat Support',
    description: '24/7 intelligent assistance for all your questions',
    badge: 'NEW',
    href: '#',
    stat: 'Instant'
  },
  {
    id: 'error-boundary',
    icon: <Shield size={24} />,
    title: 'Self-Healing App',
    description: 'Automatic error detection and recovery system',
    badge: 'AI',
    stat: '99.9%'
  },
  {
    id: 'auto-seo',
    icon: <Globe size={24} />,
    title: 'Auto-SEO',
    description: 'Continuously optimized for search engines',
    badge: 'AUTO',
    stat: 'Real-time'
  },
  {
    id: 'smart-optimization',
    icon: <Zap size={24} />,
    title: 'Smart Optimization',
    description: 'AI-powered performance improvements',
    stat: '+40%'
  },
  {
    id: 'market-prices',
    icon: <DollarSign size={24} />,
    title: 'Market Price Tracker',
    description: 'Real-time AI product pricing with purchase links',
    badge: 'NEW',
    href: '/market-prices',
    stat: '27 Products'
  }
];

const AI_PRODUCTS: Feature[] = [
  {
    id: 'ai-business',
    icon: <Bot size={24} />,
    title: 'AI Business Advisor',
    description: 'Intelligent strategic planning assistant',
    href: '/ai-business-advisor'
  },
  {
    id: 'ai-finance',
    icon: <TrendingUp size={24} />,
    title: 'AI Financial Suite',
    description: 'Forecasting, planning & analysis',
    href: '/ai-financial-services'
  },
  {
    id: 'ai-healthcare',
    icon: <Cpu size={24} />,
    title: 'AI Healthcare',
    description: 'Diagnostics & patient care AI',
    href: '/ai-healthcare'
  },
  {
    id: 'ai-hr',
    icon: <Sparkles size={24} />,
    title: 'AI HR Assistant',
    description: 'Recruitment & employee management',
    href: '/ai-hr'
  }
];

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState<'autonomous' | 'products'>('autonomous');

  return (
    <section style={{
      padding: '80px 20px',
      background: '#0a0a0a',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '20px',
            marginBottom: '20px',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            <Sparkles size={16} color="#3b82f6" />
            <span style={{ color: '#3b82f6', fontSize: '14px', fontWeight: 500 }}>
              Powered by Autonomous AI
            </span>
          </div>

          <h2 style={{
            fontSize: '48px',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '16px',
            lineHeight: 1.2
          }}>
            Intelligent. Autonomous. {''}
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Continuous Evolution
            </span>
          </h2>

          <p style={{
            fontSize: '18px',
            color: '#888',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Our app continuously improves itself through AI agents that analyze, optimize, and enhance every aspect of your experience.
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '40px'
        }}>
          <button
            onClick={() => setActiveTab('autonomous')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'autonomous' ? '#3b82f6' : '#1a1a1a',
              border: `1px solid ${activeTab === 'autonomous' ? '#3b82f6' : '#333'}`,
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Zap size={16} style={{ marginRight: '8px', display: 'inline' }} />
            Autonomous Features
          </button>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'products' ? '#3b82f6' : '#1a1a1a',
              border: `1px solid ${activeTab === 'products' ? '#3b82f6' : '#333'}`,
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Bot size={16} style={{ marginRight: '8px', display: 'inline' }} />
            AI Products
          </button>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {(activeTab === 'autonomous' ? AUTONOMOUS_FEATURES : AI_PRODUCTS).map((feature) => (
            <div
              key={feature.id}
              style={{
                padding: '30px',
                background: '#1a1a1a',
                borderRadius: '16px',
                border: '1px solid #333',
                transition: 'all 0.3s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#333';
              }}
            >
              {/* Badge */}
              {feature.badge && (
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  padding: '4px 10px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#fff',
                  textTransform: 'uppercase'
                }}>
                  {feature.badge}
                </div>
              )}

              {/* Icon */}
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6',
                marginBottom: '20px'
              }}>
                {feature.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '10px'
              }}>
                {feature.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '14px',
                color: '#888',
                marginBottom: '15px',
                lineHeight: 1.5
              }}>
                {feature.description}
              </p>

              {/* Stat or Link */}
              {feature.stat && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#10b981',
                  fontSize: '14px',
                  fontWeight: 600
                }}>
                  <TrendingUp size={14} />
                  {feature.stat}
                </div>
              )}
              
              {feature.href && (
                <a
                  href={feature.href}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#3b82f6',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    marginTop: '10px'
                  }}
                >
                  Learn more <ArrowRight size={14} />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          marginTop: '60px',
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'AI Agents Running', value: '7+' },
            { label: 'Issues Auto-Fixed', value: '10K+' },
            { label: 'Uptime', value: '99.9%' },
            { label: 'Daily Improvements', value: '50+' }
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#fff',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {item.value}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          textAlign: 'center',
          marginTop: '50px'
        }}>
          <a
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'transform 0.2s'
            }}
          >
            <Bot size={20} />
            Explore Our AI Solutions
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
