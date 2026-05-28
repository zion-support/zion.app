import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — Zion Tech Group',
  description: 'Frequently asked questions about Zion Tech Group services, pricing, and implementation.',
  alternates: { canonical: '/faq' },
};

const contactInfo = {
  mobile: '+1 302 464 0950',
  email: 'kleber@ziontechgroup.com',
  address: '364 E Main St STE 1008, Middletown, DE 19709',
};

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is Zion Tech Group?',
        a: 'Zion Tech Group delivers AI services, IT infrastructure, micro-SaaS products, and strategic consulting to businesses of all sizes — helping teams modernize, optimize, and grow with practical, cutting-edge technology.'
      },
      {
        q: 'How do I get started with Zion Tech Group?',
        a: 'Reach out via our contact page or call +1 302 464 0950. We\'ll schedule a free discovery call, understand your needs, and recommend the best-fit solutions.'
      },
      {
        q: 'What industries do you serve?',
        a: 'Finance, healthcare, manufacturing, e-commerce, logistics, education, real estate, government, and technology startups.'
      },
      {
        q: 'Do you offer custom solutions?',
        a: 'Yes. Every business is unique. We build fully customized solutions tailored to your requirements, budget, and timeline.'
      }
    ]
  },
  {
    category: 'AI Services',
    questions: [
      {
        q: 'What AI services do you offer?',
        a: 'A full AI stack: predictive analytics, recommendation engines, identity verification, content intelligence, autonomous agents, knowledge-graph search, and more — deployed as managed APIs or embedded workflows.'
      },
      {
        q: 'Do I need an AI team to use your services?',
        a: 'No. We handle model training, deployment, and maintenance. You get a simple API or dashboard that plugs into your existing stack.'
      },
      {
        q: 'How do you ensure data privacy in AI solutions?',
        a: 'Encryption at rest and in transit, role-based access controls, data anonymization, and GDPR/CCPA/HIPAA-aligned governance.'
      },
      {
        q: 'What is the typical ROI of implementing AI solutions?',
        a: 'Most clients see ROI within 3–6 months — 20–40% cost reduction, 15–35% revenue uplift, and measurable efficiency gains. Actual results depend on workflow maturity and scope.'
      }
    ]
  },
  {
    category: 'IT Solutions',
    questions: [
      {
        q: 'What IT services do you provide?',
        a: 'We offer web application development, data engineering, mobile app development, cloud infrastructure management, DevOps automation, API management, edge computing, and data mesh implementation.'
      },
      {
        q: 'What technologies do you work with?',
        a: 'We work with modern technology stacks including Next.js, React, Vue, Node.js, Python, Rust, AWS, Azure, GCP, Kubernetes, Terraform, and many more.'
      },
      {
        q: 'Do you offer ongoing support and maintenance?',
        a: 'Yes. We offer flexible support packages including 24/7 monitoring, bug fixes, feature updates, performance optimization, and dedicated account management.'
      }
    ]
  },
  {
    category: 'Consulting',
    questions: [
      {
        q: 'What consulting services do you offer?',
        a: 'Our consulting services include digital transformation strategy, cloud-native transformation, AI readiness assessment, data strategy, MLOps implementation, cybersecurity assessment, and technical architecture consulting.'
      },
      {
        q: 'How long does a consulting engagement typically last?',
        a: 'Engagements typically range from 4-12 weeks depending on scope. We work in agile sprints with regular deliverables and checkpoints.'
      },
      {
        q: 'Do you provide post-engagement support?',
        a: 'Yes. We offer ongoing support packages to ensure successful implementation of recommendations, including hands-on technical assistance and progress monitoring.'
      }
    ]
  },
  {
    category: 'Pricing & Billing',
    questions: [
      {
        q: 'How do you price your services?',
        a: 'We offer flexible pricing models including monthly subscriptions for SaaS products, per-project pricing for consulting engagements, and usage-based pricing for certain AI services. Contact us for a custom quote.'
      },
      {
        q: 'Do you offer free trials?',
        a: 'Yes, we offer free trials for select services. Contact us to learn more about available trial options and eligibility.'
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards, bank transfers, and purchase orders. Annual billing options are available with discounts.'
      }
    ]
  }
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.flatMap((section) =>
    section.questions.map((qa) => ({
      '@type': 'Question',
      name: qa.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.a,
      },
    }))
  ),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ziontechgroup.com/' },
    { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://ziontechgroup.com/faq/' },
  ],
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Find answers to the most common questions about our AI services, IT solutions, consulting, and SaaS products.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {faqs.map((section, si) => (
          <div key={si} className="mb-16">
            <h2 className="text-2xl font-bold text-purple-400 mb-8 pb-2 border-b border-slate-700">
              {section.category}
            </h2>
            <div className="space-y-4">
              {section.questions.map((qa, qi) => (
                <details
                  key={qi}
                  className="group bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-colors"
                >
                  <summary className="cursor-pointer px-6 py-4 font-semibold text-white text-lg flex justify-between items-center">
                    <span>{qa.q}</span>
                    <span className="text-purple-400 transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <div className="px-6 py-4 text-slate-300 leading-relaxed">
                    {qa.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Our team is here to help. Reach out and we'll get back to you within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a href={`tel:${contactInfo.mobile}`} className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
              📞 {contactInfo.mobile}
            </a>
            <a href={`mailto:${contactInfo.email}`} className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              ✉️ {contactInfo.email}
            </a>
          </div>
          <p className="text-slate-400 text-sm">
            📍 {contactInfo.address}
          </p>
        </div>
      </section>
    </main>
  );
}
