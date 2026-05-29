import Link from 'next/link'

export default function AIFeedbackAnalyzerPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950">
      <div className="container-page py-12">
        <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          AI Feedback Analyzer
        </h1>
        <p className="text-xl text-center text-slate-300 mb-8">
          Transform customer feedback into actionable business intelligence with AI-powered sentiment analysis, trend detection, and automated insights.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
            <ul className="space-y-2 text-slate-400">
              <li>• Multi-channel feedback collection</li>
              <li>• Advanced sentiment intelligence</li>
              <li>• Intent & topic discovery</li>
              <li>• Real-time insights dashboard</li>
              <li>• Actionable recommendations</li>
              <li>• Enterprise security & compliance</li>
            </ul>
          </div>

          <div className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Use Cases</h3>
            <ul className="space-y-2 text-slate-400">
              <li>• Product Management</li>
              <li>• Customer Support</li>
              <li>• Marketing & Brand</li>
              <li>• Customer Success</li>
              <li>• UX/UI Design</li>
              <li>• Executive Leadership</li>
            </ul>
          </div>

          <div className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Benefits</h3>
            <ul className="space-y-2 text-slate-400">
              <li>• Reduce costs by eliminating guesswork</li>
              <li>• Increase revenue through improved satisfaction</li>
              <li>• Accelerate innovation with rapid feedback loops</li>
              <li>• Improve customer retention and loyalty</li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-center mb-4">Pricing</h3>
          <div className="grid gap-4">
            <div className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6 text-center">
              <h4 className="text-lg font-semibold text-white mb-2">Basic</h4>
              <p className="text-slate-400">$99/month</p>
              <p className="text-slate-400 text-sm">Up to 1,000 feedback items/month<br/>Basic sentiment analysis<br/>Email support</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6 text-center">
              <h4 className="text-lg font-semibold text-white mb-2">Professional</h4>
              <p className="text-lg font-semibold text-white">$299/month</p>
              <p className="text-slate-400 text-sm">Up to 10,000 feedback items/month<br/>Advanced sentiment & intent analysis<br/>Custom dashboards<br/>Priority support</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6 text-center">
              <h4 className="text-lg font-semibold text-white mb-2">Enterprise</h4>
              <p className="text-lg font-semibold text-white">Custom</p>
              <p className="text-slate-400 text-sm">Unlimited feedback items<br/>Full AI suite<br/>Custom integrations<br/>Dedicated account manager<br/>SLA-backed uptime</p>
              <Link href="/configurator/?service=ai-feedback-analyzer" className="mt-4 btn-primary text-sm px-4 py-2">
                Get Custom Quote →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="italic text-slate-400 max-w-2xl mx-auto">
            "The AI Feedback Analyzer helped us identify a critical usability issue in our checkout flow that was causing 15% cart abandonment. We fixed it and saw conversion increase by 22% within two weeks."
          </p>
          <p className="text-slate-300 text-right font-medium">— Sarah K., Director of Product, FinTech Startup</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/configurator/?service=ai-feedback-analyzer" className="btn-primary text-lg px-8 py-3">
          ⚡ Get Started Today →
        </Link>
        <Link href="/services/" className="btn-secondary text-lg px-8 py-3 ml-4">
          🔍 Explore All Services
        </Link>
      </div>
    </div>
  );
}