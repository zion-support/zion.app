'use client';
export default function BusinessTransformationRoadmap() {
  return (
    <section className="py-16 bg-slate-950">
      <div className="container-page text-center">
        <h2 className="section-heading">🗺️ Business Transformation Roadmap</h2>
        <p className="section-subheading">Your journey from idea to production-ready solution</p>
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          {[
            { step: '1', title: 'Discovery', desc: 'Free consultation to understand your needs', emoji: '🔍' },
            { step: '2', title: 'Architecture', desc: 'Custom solution design and proposal', emoji: '📐' },
            { step: '3', title: 'Build', desc: 'Agile development with weekly demos', emoji: '⚡' },
            { step: '4', title: 'Deploy', desc: 'Production deployment and 24/7 support', emoji: '🚀' },
          ].map(s => (
            <div key={s.step} className="bg-slate-900/60 rounded-xl p-6 border border-slate-700/50">
              <div className="text-3xl mb-3">{s.emoji}</div>
              <div className="text-purple-400 font-bold text-sm mb-1">Step {s.step}</div>
              <div className="text-white font-bold mb-2">{s.title}</div>
              <p className="text-gray-400 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
