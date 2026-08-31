import { useState } from 'react'
import { Cpu, ChevronDown } from 'lucide-react'
import { useAIProvider } from '../contexts/AIProviderContext'

export default function ModelSelector() {
  const { providers, selectedProvider, selectedModel, loading, selectProvider, selectModel } = useAIProvider()
  const [open, setOpen] = useState(false)

  if (loading || providers.length === 0) return null

  const current = providers.find((p) => p.id === selectedProvider)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 h-10 rounded-full bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border-light)] transition border border-[var(--color-border-light)] text-sm font-medium text-[var(--color-text-primary)]"
        title="AI provider & model"
      >
        <Cpu size={15} />
        <span className="hidden sm:inline">{current?.label || 'AI'}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 w-72 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] shadow-xl z-50 p-3 space-y-3">
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 px-1">AI Provider</p>
              <div className="space-y-1">
                {providers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => selectProvider(p.id, p.defaultModel)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      p.id === selectedProvider
                        ? 'bg-[var(--color-primary-100)] text-[var(--color-primary)] font-medium'
                        : 'hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {current && (
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 px-1">Model</p>
                <input
                  type="text"
                  value={selectedModel || current.defaultModel}
                  onChange={(e) => selectModel(e.target.value)}
                  placeholder={current.defaultModel}
                  className="w-full px-3 py-2 rounded-lg text-sm border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <p className="text-[11px] text-[var(--color-text-muted)] mt-1 px-1">
                  Default: {current.defaultModel}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}