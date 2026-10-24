import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const AIProviderContext = createContext(null)

export function AIProviderProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [providers, setProviders] = useState([])
  const [selectedProvider, setSelectedProvider] = useState(() => localStorage.getItem('aiProvider') || '')
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('aiModel') || '')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    let cancelled = false
    api
      .get('/ai/providers')
      .then(({ data }) => {
        if (cancelled) return
        setProviders(data.providers)

        // If nothing selected yet, or the saved selection is no longer
        // configured on the backend, fall back to the server's active provider.
        const savedIsValid = data.providers.some((p) => p.id === selectedProvider)
        if (!savedIsValid) {
          const fallback = data.providers.find((p) => p.id === data.activeProvider) || data.providers[0]
          if (fallback) {
            selectProvider(fallback.id, fallback.defaultModel)
          }
        }
      })
      .catch(() => {
        // AI provider list is a nice-to-have UI feature — silently ignore
        // failures here rather than breaking the rest of the app.
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const selectProvider = useCallback((providerId, model) => {
    setSelectedProvider(providerId)
    setSelectedModel(model || '')
    localStorage.setItem('aiProvider', providerId)
    if (model) localStorage.setItem('aiModel', model)
    else localStorage.removeItem('aiModel')
  }, [])

  const selectModel = useCallback((model) => {
    setSelectedModel(model)
    localStorage.setItem('aiModel', model)
  }, [])

  // Get models for currently selected provider
  const currentProvider = providers.find((p) => p.id === selectedProvider)
  const availableModels = currentProvider?.models || []

  return (
    <AIProviderContext.Provider
      value={{
        providers,
        selectedProvider,
        selectedModel,
        loading,
        selectProvider,
        selectModel,
        availableModels,
        currentProvider,
      }}
    >
      {children}
    </AIProviderContext.Provider>
  )
}

export function useAIProvider() {
  const ctx = useContext(AIProviderContext)
  if (!ctx) throw new Error('useAIProvider must be used within AIProviderProvider')
  return ctx
}