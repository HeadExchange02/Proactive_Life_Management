import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { faqs } from '../../constants/content'
import Reveal from '../common/Reveal'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <Reveal as="h2" className="text-3xl font-bold text-center mb-12 text-[var(--color-text-primary)]">
        Frequently asked questions
      </Reveal>
      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i
          return (
            <Reveal key={faq.question} delay={i * 70} className="card overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left font-medium"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                {faq.question}
                <ChevronDown
                  size={18}
                  className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                aria-hidden={!isOpen}
                className={`grid transition-all duration-300 ease-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm text-[var(--color-text-secondary)]">{faq.answer}</p>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
