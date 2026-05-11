import ErrorBoundary from '../../components/GlobalErrorBoundary';
import React from "react";
import { ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: CheckCircle,
    title: 'Advanced Infrastructure',
    description: 'State-of-the-art 5G network infrastructure solutions',
    benefits: ['High-speed connectivity', 'Low latency', 'Scalable architecture']
  },
  {
    icon: CheckCircle,
    title: 'AI-Powered Optimization',
    description: 'Intelligent network optimization using AI',
    benefits: ['Predictive maintenance', 'Performance optimization', 'Automated management']
  },
  {
    icon: CheckCircle,
    title: 'Security & Compliance',
    description: 'Enterprise-grade security and compliance',
    benefits: ['End-to-end encryption', 'Compliance standards', 'Threat detection']
  },
  {
    icon: CheckCircle,
    title: '24/7 Support',
    description: 'Round-the-clock technical support',
    benefits: ['Expert assistance', 'Rapid response', 'Proactive monitoring']
  }
];

const benefits = [
  'Cutting-edge 5G technology implementation',
  'Scalable and flexible infrastructure solutions',
  'AI-powered network optimization',
  'Enterprise-grade security and compliance',
  '24/7 monitoring and support',
  'Cost-effective deployment strategies',
  'Future-proof technology architecture',
  'Expert technical consultation'
];

export const metadata = {
  title: '5G Network Infrastructure | Zion Tech Group',
  description: 'Professional 5G network infrastructure services by Zion Tech Group. Advanced AI and technology solutions.',
  keywords: '5G network infrastructure, technology, services, AI, automation',
  openGraph: {
    title: '5G Network Infrastructure | Zion Tech Group',
    description: 'Professional 5G network infrastructure services by Zion Tech Group.',
    type: 'website',
  },
};

function FiveGNetworkInfrastructure() {
  return (
    <div>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            5G Network Infrastructure
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Professional 5G network infrastructure services by Zion Tech Group.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Coming Soon</h2>
            <p className="text-gray-300">
              This service is currently under development. Contact us to learn more about our upcoming services.
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-4xl mx-auto">
              Transform your network operations with our cutting-edge 5G infrastructure solutions. 
              We provide comprehensive services to help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/about"
                className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                  <feature.icon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 mb-4">{feature.description}</p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Why Choose Our 5G Network Infrastructure?
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-lg text-gray-300">
                    <CheckCircle className="h-6 w-6 text-green-400 mr-4 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Wrapped(props: { [key: string]: unknown }) {
  return (
    <ErrorBoundary>
      <FiveGNetworkInfrastructure {...props} />
    </ErrorBoundary>
  );
}
