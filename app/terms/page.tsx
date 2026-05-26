'use client'
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Footer from '../components/Footer'

export default function Page() {
  return (
    <>
      <Head>
        <title>Terms of Service - Zion Tech Group</title>
        <meta name="description" content="Terms of Service for Zion Tech Group - Legal terms governing use of our services." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-white mb-8">
            Terms of Service
          </h1>
          <p className="text-gray-300 mb-6"><strong>Last Updated:</strong> May 2026</p>
          
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Agreement to Terms</h2>
            <p className="text-gray-300">By accessing or using our Services, you agree to be bound by these Terms of Service.</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Services</h2>
            <p className="text-gray-300">We provide AI, IT, and Micro SAAS solutions including automation, cybersecurity, cloud, data, and custom development services.</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Payment Terms</h2>
            <ul className="text-gray-300 list-disc list-inside">
              <li><strong>Pricing:</strong> As specified in proposals or service agreements</li>
              <li><strong>Billing:</strong> Monthly in advance unless otherwise agreed</li>
              <li><strong>Late Payment:</strong> 1.5% monthly interest on overdue amounts</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Intellectual Property</h2>
            <p className="text-gray-300"><strong>Our IP:</strong> All software, tools, and pre-existing IP remain our property.</p>
            <p className="text-gray-300"><strong>Client Data:</strong> You retain ownership of your data.</p>
            <p className="text-gray-300"><strong>Deliverables:</strong> Upon full payment, license to delivered assets.</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Warranty and Disclaimer</h2>
            <p className="text-gray-300">Services performed in workmanlike manner for 30 days. EXCEPT AS EXPRESSLY PROVIDED, SERVICES ARE PROVIDED "AS IS."</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-gray-300">Our liability is limited to fees paid in the 12 months preceding claim. Not liable for lost profits or indirect damages.</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Termination</h2>
            <p className="text-gray-300">30 days written notice. Upon termination, all unpaid fees become immediately due.</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Governing Law</h2>
            <p className="text-gray-300">Delaware law governs. Exclusive jurisdiction in Delaware courts.</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Contact</h2>
            <p className="text-gray-300">
              Zion Tech Group<br/>
              364 E Main St STE 1008<br/>
              Middletown, DE 19709<br/>
              Email: kleber@ziontechgroup.com<br/>
              Phone: +1 302 464 0950
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