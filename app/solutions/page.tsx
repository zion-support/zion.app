'use client'
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { ArrowRight, HeartPulse, Banknote, ShoppingCart, Factory, Code2, Briefcase } from 'lucide-react'
import Footer from '../components/Footer'

export default function Page() {
  const industries = [
    { name: 'Healthcare', icon: HeartPulse, href: '/industry-solutions/healthcare', desc: 'AI-powered patient care, HIPAA compliance, and health data analytics.' },
    { name: 'Financial Services', icon: Banknote, href: '/industry-solutions/finance', desc: 'Fraud detection, regulatory compliance, algorithmic trading tools.' },
    { name: 'Retail & E-commerce', icon: ShoppingCart, href: '/industry-solutions/retail', desc: 'Personalization engines, inventory forecasting, dynamic pricing.' },
    { name: 'Manufacturing', icon: Factory, href: '/industry-solutions/manufacturing', desc: 'IoT sensors, predictive maintenance, smart factory automation.' },
    { name: 'Technology', icon: Code2, href: '/industry-solutions/technology', desc: 'DevOps automation, API management, observability platforms.' },
    { name: 'Professional Services', icon: Briefcase, href: '/industry-solutions/professional-services', desc: 'Proposal automation, knowledge management, client portals.' },
  ]

  return (
    <>
      <Head>
        <title>Industry Solutions - Zion Tech Group</title>
        <meta name="description" content="Industry-specific AI and IT solutions for healthcare, finance, retail, manufacturing, and technology sectors." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Industry Solutions
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Tailored AI and IT solutions for your specific industry needs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry) => {
              const Icon = industry.icon
              return (
                <Link key={industry.name} href={industry.href} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 hover:bg-white/10 transition-colors">
                  <Icon className="w-10 h-10 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{industry.name}</h3>
                  <p className="text-gray-400 text-sm">{industry.desc}</p>
                </Link>
              )
            })}
          </div>

          <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Custom Solutions</h2>
            <p className="text-gray-300 mb-4">
              Don't see your industry? We build custom solutions for any business challenge.
            </p>
            <Link href="/contact" className="inline-flex items-center text-purple-400 hover:text-purple-300">
              Contact us for a custom solution
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <Link href="/" className="inline-flex items-center mt-8 text-purple-400 hover:text-purple-300">
            <ArrowRight className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    </>
  )
}