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
        <title>Privacy Policy - Zion Tech Group</title>
        <meta name="description" content="Privacy Policy for Zion Tech Group - Learn how we collect, use, and protect your information." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-white mb-8">
            Privacy Policy
          </h1>
          <p className="text-gray-300 mb-6"><strong>Last Updated:</strong> May 2026</p>
          
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Introduction</h2>
            <p className="text-gray-300">Zion Tech Group ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Information We Collect</h2>
            <p className="text-gray-300"><strong>Personal Information:</strong> Name, email, phone, company name, business requirements.</p>
            <p className="text-gray-300"><strong>Technical Information:</strong> IP address, browser type, usage data, cookies.</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">How We Use Your Information</h2>
            <ul className="text-gray-300 list-disc list-inside">
              <li>Service delivery and support</li>
              <li>Communication about services and updates</li>
              <li>Analytics to improve our website</li>
              <li>Legal compliance</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Data Sharing</h2>
            <p className="text-gray-300">We do not sell your personal information. We may share with service providers, for legal requirements, or in business transfers.</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Your Rights</h2>
            <p className="text-gray-300">You may request access, correction, or deletion of your personal data by contacting kleber@ziontechgroup.com.</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Data Retention</h2>
            <p className="text-gray-300">We retain information for as long as necessary to provide services and comply with legal obligations.</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Contact Us</h2>
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