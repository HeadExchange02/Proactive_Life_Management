import { Link } from 'react-router-dom'
import { services } from '../../constants/content'
import Reveal from '../common/Reveal'

export default function ServicesGrid() {
  return (
    <section id="services" className="max-w-7xl mx-auto px-6 py-20">
      <Reveal className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">Everything you need, in one place</h2>
        <p className="text-[var(--color-text-secondary)]">AI-powered guidance across the areas that matter most.</p>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <Reveal
            key={s.id}
            as={Link}
            to={`/services#${s.id}`}
            delay={(i % 3) * 100}
            className="group card card-hover p-6"
          >
            <span className="inline-block text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
              {s.icon}
            </span>
            <h3 className="font-bold text-lg mt-4 mb-2 text-[var(--color-text-primary)]">{s.title}</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">{s.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
