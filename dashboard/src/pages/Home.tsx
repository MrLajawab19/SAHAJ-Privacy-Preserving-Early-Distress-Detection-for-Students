// src/pages/Home.tsx
import { Link } from 'react-router-dom'
import { Shield, Brain, Globe, Users, ChevronRight, FlaskConical } from 'lucide-react'
import heroImg from '../assets/hero.png'

const features = [
  {
    icon: Shield,
    title: 'Privacy-First by Design',
    description:
      'Federated Learning ensures raw journal text never leaves the student\'s device. Only aggregated model updates travel the network — never personal data.',
    color: 'blue',
  },
  {
    icon: Brain,
    title: 'Early Distress Detection',
    description:
      'Longitudinal mood tracking catches declining wellbeing trends before they escalate, enabling timely, compassionate intervention.',
    color: 'violet',
  },
  {
    icon: Globe,
    title: 'Hinglish-Aware NLP',
    description:
      'Our sentiment engine understands the natural code-mixed Hindi–English (Hinglish) that Indian students actually use — not just formal English.',
    color: 'teal',
  },
  {
    icon: Users,
    title: 'Parental Insights (Opt-In)',
    description:
      'Students control consent. Parents see only aggregated score trends — never raw journal entries. Privacy is not a feature; it\'s the architecture.',
    color: 'amber',
  },
]

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  violet: 'bg-violet-50 text-violet-600 border-violet-100',
  teal: 'bg-teal-50 text-teal-600 border-teal-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">SAHAJ</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/research"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors font-medium"
            >
              <FlaskConical className="w-4 h-4" />
              Researcher View
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200 mb-4 tracking-wide uppercase">
            Privacy-Preserving · Federated Learning · Hinglish NLP
          </span>
          <h1 className="text-4xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
            Early Distress Detection for Students,{' '}
            <span className="text-blue-600">Without Compromising Their Privacy</span>
          </h1>
          <p className="text-slate-600 text-base leading-relaxed mb-8">
            SAHAJ uses Federated Learning and Hinglish-aware sentiment analysis to detect early
            signs of student distress — without ever seeing their raw journal entries. Your
            words stay on your device. Always.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/login?role=student"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              Student Login
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login?role=parent"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 hover:border-blue-300 hover:text-blue-700 transition-colors shadow-sm"
            >
              Parent Login
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
            <img
              src={heroImg}
              alt="SAHAJ student wellbeing dashboard illustration"
              className="w-full h-64 object-cover"
            />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-4 -left-4 bg-white rounded-xl border border-slate-200 shadow-md px-4 py-2.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-700">On-device NLP · Zero data leakage</span>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Built for Trust</h2>
          <p className="text-slate-500 text-center text-sm mb-10">
            Every design decision in SAHAJ is grounded in student privacy and clinical early-warning research.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${colorMap[f.color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Ready to explore?</h2>
        <p className="text-slate-500 text-sm mb-6">
          Use a demo account below or check out the federated learning research dashboard.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/login?role=student"
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            Student Demo Login
          </Link>
          <Link
            to="/login?role=parent"
            className="px-5 py-2.5 bg-white text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 hover:border-blue-300 hover:text-blue-700 transition-colors shadow-sm"
          >
            Parent Demo Login
          </Link>
          <Link
            to="/research"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
          >
            <FlaskConical className="w-4 h-4" />
            Research Dashboard
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-slate-700">SAHAJ</span>
            <span className="text-xs text-slate-400">· Privacy-Preserving Early Distress Detection</span>
          </div>
          <p className="text-xs text-slate-400">
            IEEE Conference Prototype · Federated Learning Research Project
          </p>
        </div>
      </footer>
    </div>
  )
}
