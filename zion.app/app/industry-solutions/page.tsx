import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Industry Solutions | Zion Tech Group',
  description: 'Explore tailored technology solutions for finance, healthcare, manufacturing, e-commerce, logistics, education, government, and real estate industries.',
};


function industrySlug(name: string): string {
  return name.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const industries = [
  {
    icon: '🏦',
    name: 'Financial Services',
    challenges: ['Regulatory compliance', 'Fraud detection', 'Real-time transaction processing'],
    solutions: [
      'AI-powered fraud detection reducing false positives by 85%',
      'Regulatory compliance automation with real-time monitoring',
      'High-frequency trading algorithms with sub-millisecond latency',
      'Customer risk scoring and credit decisioning engines'
    ],
    cta: 'Secure Financial Solutions'
  },
  {
    icon: '🏥',
    name: 'Healthcare',
    challenges: ['HIPAA compliance', 'Patient data security', 'Operational efficiency'],
    solutions: [
      'HIPAA-compliant AI diagnostics and imaging analysis',
      'Patient data encryption and access control systems',
      'Predictive analytics for patient outcomes and readmission',
      'Automated claims processing and revenue cycle management'
    ],
    cta: 'Transform Healthcare Delivery'
  },
  {
    icon: '🏭',
    name: 'Manufacturing',
    challenges: ['Equipment downtime', 'Supply chain disruptions', 'Quality control'],
    solutions: [
      'Predictive maintenance reducing unplanned downtime by 45%',
      'Supply chain optimization with demand sensing AI',
      'Computer vision-based quality inspection systems',
      'Digital twin simulation for process optimization'
    ],
    cta: 'Smart Manufacturing Solutions'
  },
  {
    icon: '🛒',
    name: 'E-Commerce',
    challenges: ['Customer retention', 'Cart abandonment', 'Personalization at scale'],
    solutions: [
      'AI recommendation engines boosting AOV by 18-35%',
      'Dynamic pricing optimization algorithms',
      'Chatbot and virtual shopping assistant integration',
      'Customer lifetime value prediction and churn prevention'
    ],
    cta: 'Grow Your Online Business'
  },
  {
    icon: '🚚',
    name: 'Logistics & Supply Chain',
    challenges: ['Route optimization', 'Fleet management', 'Warehouse efficiency'],
    solutions: [
      'AI-powered route optimization reducing fuel costs by 20%',
      'Real-time fleet tracking and predictive maintenance',
      'Warehouse automation with demand forecasting',
      'Last-mile delivery optimization and tracking'
    ],
    cta: 'Optimize Your Supply Chain'
  },
  {
    icon: '🎓',
    name: 'Education',
    challenges: ['Student engagement', 'Administrative burden', 'Personalized learning'],
    solutions: [
      'Adaptive learning platforms powered by AI',
      'Automated grading and feedback systems',
      'Student performance prediction and early intervention',
      'Virtual classroom and content delivery platforms'
    ],
    cta: 'Revolutionize Education'
  },
  {
    icon: '🏛️',
    name: 'Government & Public Sector',
    challenges: ['Legacy modernization', 'Citizen services', 'Data security'],
    solutions: [
      'Legacy system modernization with zero-downtime migration',
      'AI-powered citizen service chatbots and portals',
      'Secure cloud infrastructure with FedRAMP compliance',
      'Data analytics for policy decision support'
    ],
    cta: 'Modernize Government IT'
  },
  {
    icon: '🏢',
    name: 'Real Estate',
    challenges: ['Market analytics', 'Property management', 'Tenant experience'],
    solutions: [
      'AI-driven property valuation and market prediction',
      'Smart building management with IoT integration',
      'Tenant experience platforms with AI concierge',
      'Automated lease analysis and portfolio optimization'
    ],
    cta: 'Build Smarter Real Estate'
  }
];

const contactInfo = {
  mobile: '+1 302 464 0950',
  email: 'kleber@ziontechgroup.com',
  address: '364 E Main St STE 1008, Middletown, DE 19709',
};

export default function IndustrySolutionsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Industry Solutions
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Tailored technology solutions for your industry — from AI-powered analytics to full digital transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Industry Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((industry, i) => (
            <div
              key={i}
              className="bg-slate-900/50 border border-slate-700 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
            id={industrySlug(industry.name)}
            >
              <div className="text-5xl mb-4">{industry.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{industry.name}</h3>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-2">Key Challenges We Solve</h4>
                <ul className="space-y-1">
                  {industry.challenges.map((c, ci) => (
                    <li key={ci} className="text-slate-400 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-2">Our Solutions</h4>
                <ul className="space-y-1">
                  {industry.solutions.map((s, si) => (
                    <li key={si} className="text-slate-300 text-sm flex items-start gap-2">
                      <span className="text-cyan-400 mt-1 flex-shrink-0">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/contact"
                className="inline-block w-full text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition text-sm"
              >
                {industry.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-2xl p-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Not Your Industry?</h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Our solutions are highly adaptable. Our team will work with you to design a custom technology strategy for your specific vertical.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`tel:${contactInfo.mobile}`} className="inline-flex items-center gap-2 bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition">
              📞 {contactInfo.mobile}
            </a>
            <a href={`mailto:${contactInfo.email}`} className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              ✉️ {contactInfo.email}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}