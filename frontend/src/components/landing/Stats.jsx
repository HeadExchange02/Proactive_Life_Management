import { stats } from '../../constants/content'
import CountUp from '../common/CountUp'
import Reveal from '../common/Reveal'

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-primary)] py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 left-1/4 h-56 w-56 rounded-full bg-white/10 blur-3xl animate-float-slow"
      />
      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 100}>
            <div className="text-3xl font-extrabold text-white">
              <CountUp value={s.value} />
            </div>
            <div className="text-sm text-white/80">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
