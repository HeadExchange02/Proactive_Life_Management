import { useState } from 'react'
import { Cpu, ChevronDown, ChevronRight, Check } from 'lucide-react'
import { useAIProvider } from '../contexts/AIProviderContext'

export default function ModelSelector() {
  const { providers, selectedProvider, selectedModel, loading, selectProvider, selectModel, availableModels, currentProvider } = useAIProvider()
  const [open, setOpen] = useState(false)
  const [modelsOpen, setModelsOpen] = useState(false)

  if (loading || providers.length === 0) return null

  const current = currentProvider

  const handleProviderSelect = (provider) => {
    selectProvider(provider.id, provider.defaultModel)
    setModelsOpen(false)
    setOpen(false)
  }

  const handleModelSelect = (modelId) => {
    selectModel(modelId)
    setModelsOpen(false)
  }

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
          <div className="absolute right-0 top-12 w-80 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] shadow-xl z-50 p-3 space-y-3">
            {/* Provider Selection */}
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-1.5 px-1">AI Provider</p>
              <div className="space-y-1">
                {providers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleProviderSelect(p)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between ${
                      p.id === selectedProvider
                        ? 'bg-[var(--color-primary-100)] text-[var(--color-primary)] font-medium'
                        : 'hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'
                    }`}
                  >
                    <span>{p.label}</span>
                    {p.id === selectedProvider && <Check size={14} className="text-[var(--color-primary)]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selection for Current Provider */}
            {current && availableModels.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <p className="text-xs font-semibold text-[var(--color-text-muted)]">Model</p>
                  <button
                    onClick={() => setModelsOpen((v) => !v)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] transition"
                    type="button"
                  >
                    <span>{selectedModel || current.defaultModel}</span>
                    <ChevronDown size={12} />
                  </button>
                </div>

                {modelsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setModelsOpen(false)} />
                    <div className="absolute right-0 top-full w-72 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] shadow-xl z-50 p-2 max-h-64 overflow-auto space-y-1">
                      {availableModels.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => handleModelSelect(model.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between ${
                            model.id === (selectedModel || current.defaultModel)
                              ? 'bg-[var(--color-primary-100)] text-[var(--color-primary)] font-medium'
                              : 'hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'
                          }`}
                        >
                          <span>{model.label}</span>
                          {model.id === (selectedModel || current.defaultModel) && (
                            <Check size={14} className="text-[var(--color-primary)]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {!modelsOpen && (
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-1 px-1">
                    Default: {current.defaultModel}
                  </p>
                )}
              </div>
            )}

            {current && availableModels.length === 0 && (
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