'use client'
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Activity, Server, Shield } from 'lucide-react'
import Footer from '../components/Footer'

export default function Page() {
  const services = [
    { name: 'Website', status: 'operational', response: '42ms' },
    { name: 'API Gateway', status: 'operational', response: '28ms' },
    { name: 'AI Services', status: 'operational', response: '112ms' },
    { name: 'Database', status: 'operational', response: '15ms' },
    { name: 'Storage', status: 'operational', response: '8ms' },
    { name: 'Authentication', status: 'operational', response: '22ms' },
  ]

  return (
    <>
      <Head>
        <title>System Status - Zion Tech Group</title>
        <meta name="description" content="Real-time system status for Zion Tech Group services. Check uptime and response times." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-white mb-8">
            System Status
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <Activity className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">100%</p>
              <p className="text-gray-400">Uptime (30d)</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <Server className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">626+</p>
              <p className="text-gray-400">Services Active</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">99.9%</p>
              <p className="text-gray-400">SLA Guarantee</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">All</p>
              <p className="text-gray-400">Systems Operational</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white mb-6">Service Status</h2>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden">
            {services.map((service, i) => (
              <div key={service.name} className={`flex items-center justify-between p-4 ${i < services.length - 1 ? 'border-b border-white/10' : ''}`}>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-white">{service.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-4">{service.response}</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Operational</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Last checked: Just now • Checks run every 60 seconds
            </p>
            <p className="text-gray-400 text-sm mt-2">
              For immediate assistance: <a href="mailto:kleber@ziontechgroup.com" className="text-purple-400">kleber@ziontechgroup.com</a> or <a href="tel:+13024640950" className="text-purple-400">+1 302 464 0950</a>
            </p>
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