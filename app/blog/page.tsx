'use client'
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { ArrowRight, Calendar, User } from 'lucide-react'
import Footer from '../components/Footer'

export default function Page() {
  const posts = [
    {
      title: 'The AI Automation Revolution: How Small Businesses Can Compete with Enterprise',
      excerpt: 'Small businesses can leverage AI automation to level the playing field with larger competitors. This post explores practical AI tools and implementation strategies.',
      slug: 'ai-automation-revolution-small-business',
      date: 'May 15, 2026',
    },
    {
      title: 'Zero-Trust Security: Protecting Your Business in the Age of Remote Work',
      excerpt: 'With distributed teams, traditional security perimeters are obsolete. Zero-trust architecture assumes no implicit trust and verifies everything.',
      slug: 'zero-trust-security-remote-work',
      date: 'May 10, 2026',
    },
    {
      title: 'The Cloud Migration Playbook: 5 Critical Steps Before You Move',
      excerpt: 'Moving to the cloud isn\'t just about lifting and shifting. This practical guide covers essential planning steps to avoid costly mistakes.',
      slug: 'cloud-migration-playbook',
      date: 'May 5, 2026',
    },
    {
      title: 'Data Lake vs Data Warehouse: Which is Right for Your Business?',
      excerpt: 'Understanding the differences between data lakes and data warehouses to choose the right architecture for your analytics needs.',
      slug: 'data-lake-vs-warehouse',
      date: 'April 28, 2026',
    },
    {
      title: 'The State of AI in 2026: Trends Shaping Business Operations',
      excerpt: 'Current AI trends that businesses should be aware of, including agentic workflows, multimodal models, and edge deployment.',
      slug: 'state-of-ai-2026',
      date: 'April 20, 2026',
    },
  ]

  return (
    <>
      <Head>
        <title>Blog - Zion Tech Group</title>
        <meta name="description" content="Latest insights on AI, automation, cloud, and cybersecurity from Zion Tech Group." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-white mb-8">
            From the Blog
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            AI automation strategies, industry insights, and platform updates.
          </p>

          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 hover:bg-white/10 transition-colors">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-purple-300">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-400 mb-4">{post.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{post.date}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400">Subscribe to our newsletter for weekly insights.</p>
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