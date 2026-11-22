import { Link } from 'react-router-dom'
import { ArrowRight, Bot, Sprout } from 'lucide-react'
import { stats } from '../../constants/content'
import CountUp from '../common/CountUp'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -left-28 h-96 w-96 rounded-full bg-[var(--color-primary)]/10 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden="true"
        style={{ '--i': 2 }}
        className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[var(--color-accent)]/15 blur-3xl animate-float-slow"
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1
            style={{ '--i': 0 }}
            className="animate-fade-up text-5xl sm:text-6xl font-extrabold text-[var(--color-text-primary)] leading-[1.05] mb-6"
          >
            Your Budget. Your Skills. <span className="text-gradient">Our Smart Logic.</span>
          </h1>
          <p
            style={{ '--i': 1 }}
            className="animate-fade-up text-lg text-[var(--color-text-secondary)] mb-8 max-w-xl"
          >
            Get personalized recommendations for travel, healthcare, agriculture, and budget planning.
          </p>
          <div style={{ '--i': 2 }} className="animate-fade-up flex flex-wrap gap-4 mb-12">
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[var(--color-primary)] text-white font-semibold shadow-lg shadow-[var(--color-primary)]/25 hover:bg-[var(--color-primary-dark)] hover:shadow-xl hover:shadow-[var(--color-primary)]/30 hover:-translate-y-0.5 transition"
            >
              Get Started
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[var(--color-text-primary)] font-semibold border border-[var(--color-border-light)] hover:border-[var(--color-primary)] hover:-translate-y-0.5 hover:shadow-md transition"
            >
              Explore Services
            </Link>
          </div>

          <div style={{ '--i': 3 }} className="animate-fade-up flex flex-wrap gap-10">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold text-[var(--color-primary)]">
                  <CountUp value={s.value} />
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute inset-0 bg-white/40 rounded-[50%] blur-3xl" />
          <div className="relative space-y-4">
            <div style={{ '--i': 3 }} className="animate-fade-up max-w-xs ml-auto">
              <div className="card p-6 animate-float">
                <Bot className="text-[var(--color-primary)] mb-3" size={28} />
                <h3 className="font-bold mb-1">AI-Powered Analysis</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Our AI analyzes your unique situation to provide personalized recommendations.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div style={{ '--i': 4 }} className="animate-fade-up w-40 mt-8">
                <div style={{ '--i': 2 }} className="card p-5 animate-float">
                  <Sprout className="text-[var(--color-success)] mb-2" size={22} />
                  <h4 className="font-semibold text-sm">Crop Advisor</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
