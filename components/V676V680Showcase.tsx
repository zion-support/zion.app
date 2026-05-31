'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  MessageSquare,
  BookOpen,
  AlertTriangle,
  Users,
  TrendingUp,
  Clock,
  Target,
  Zap,
  CheckCircle2,
  Brain,
  GitBranch,
  Activity,
  BarChart3,
  Lightbulb
} from 'lucide-react';

export default function V676V680Showcase() {
  const engines = [
    {
      id: 'V676',
      name: 'Meeting Effectiveness Analyzer',
      icon: Calendar,
      description: 'Analyze meeting effectiveness, calculate ROI, and identify time wasters to optimize your meeting culture.',
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Meeting ROI calculation',
        'Time waster detection',
        'Agenda optimization',
        'Action item tracking',
        'Effectiveness scoring'
      ]
    },
    {
      id: 'V677',
      name: 'Communication Pattern Optimizer',
      icon: MessageSquare,
      description: 'Detect communication patterns and suggest optimizations to improve team efficiency and information flow.',
      color: 'from-purple-500 to-pink-500',
      features: [
        'Response time analysis',
        'Channel optimization',
        'Information density scoring',
        'Bottleneck detection',
        'Cross-team collaboration'
      ]
    },
    {
      id: 'V678',
      name: 'Knowledge Base Builder',
      icon: BookOpen,
      description: 'Automatically extract and organize knowledge from emails into a searchable database with FAQ generation.',
      color: 'from-green-500 to-emerald-500',
      features: [
        'Knowledge extraction',
        'FAQ auto-generation',
        'Process documentation',
        'Expert identification',
        'Knowledge gap analysis'
      ]
    },
    {
      id: 'V679',
      name: 'Project Risk Detector',
      icon: AlertTriangle,
      description: 'Identify project risks from email communications and generate mitigation strategies to prevent failures.',
      color: 'from-orange-500 to-red-500',
      features: [
        'Timeline risk analysis',
        'Resource constraint detection',
        'Scope creep identification',
        'Risk scoring',
        'Mitigation strategies'
      ]
    },
    {
      id: 'V680',
      name: 'Team Collaboration Scorer',
      icon: Users,
      description: 'Score team collaboration effectiveness and suggest improvements based on communication patterns and teamwork.',
      color: 'from-indigo-500 to-purple-500',
      features: [
        'Collaboration scoring',
        'Responsiveness analysis',
        'Inclusivity assessment',
        'Pattern identification',
        'Improvement recommendations'
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-white/80">Latest Intelligence Engines</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              V676-V680: Productivity & Team Intelligence
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Five advanced engines that optimize meetings, improve communication, build knowledge,
            detect project risks, and enhance team collaboration.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {engines.map((engine, index) => {
            const Icon = engine.icon;
            return (
              <motion.div
                key={engine.id}
                variants={itemVariants}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                     style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
                
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 h-full">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${engine.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-mono text-white/50">{engine.id}</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">{engine.name}</h3>
                  <p className="text-white/60 mb-6 text-sm leading-relaxed">{engine.description}</p>

                  <ul className="space-y-2">
                    {engine.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-white/70">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-5 gap-6 mb-16"
        >
          {[
            { icon: TrendingUp, label: 'Meeting ROI', value: '+45%' },
            { icon: Clock, label: 'Response Time', value: '-60%' },
            { icon: Brain, label: 'Knowledge Capture', value: '3x' },
            { icon: Target, label: 'Risk Detection', value: '85%' },
            { icon: Activity, label: 'Team Score', value: '+40%' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center"
              >
                <Icon className="w-8 h-8 text-white/60 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Use Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Real-World Applications
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Calendar,
                title: 'Optimize Meeting Culture',
                description: 'Reduce meeting time by 40% while improving outcomes through ROI analysis and time waster detection.'
              },
              {
                icon: MessageSquare,
                title: 'Streamline Communication',
                description: 'Improve response times by 60% and reduce communication bottlenecks across teams.'
              },
              {
                icon: BookOpen,
                title: 'Build Institutional Knowledge',
                description: 'Capture 3x more knowledge from daily communications and make it searchable.'
              },
              {
                icon: AlertTriangle,
                title: 'Prevent Project Failures',
                description: 'Detect 85% of project risks early and generate actionable mitigation strategies.'
              },
              {
                icon: Users,
                title: 'Enhance Team Collaboration',
                description: 'Improve team collaboration scores by 40% through pattern analysis and recommendations.'
              },
              {
                icon: Lightbulb,
                title: 'Drive Continuous Improvement',
                description: 'Get actionable insights to continuously improve productivity and team effectiveness.'
              }
            ].map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white/5 rounded-xl p-6 border border-white/10"
                >
                  <Icon className="w-10 h-10 text-white/60 mb-4" />
                  <h4 className="text-lg font-bold text-white mb-2">{useCase.title}</h4>
                  <p className="text-white/60 text-sm">{useCase.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
