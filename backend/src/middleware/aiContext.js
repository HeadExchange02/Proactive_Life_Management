import { AsyncLocalStorage } from 'node:async_hooks'
import { providerCatalog } from '../ai/providerCatalog.js'

const storage = new AsyncLocalStorage()

/**
 * Reads the user's selected AI provider/model (sent by the frontend as
 * X-AI-Provider / X-AI-Model headers) and makes it available for the
 * duration of the request via getAIContext(), without changing the
 * signature of every service/controller that eventually calls aiService.
 * Unknown/unavailable providers are ignored — aiService falls back to
 * the env-configured default.
 */
export function aiContextMiddleware(req, res, next) {
  const requestedProvider = req.header('X-AI-Provider')
  const requestedModel = req.header('X-AI-Model')

  const isValidProvider = requestedProvider && providerCatalog[requestedProvider]?.available
  const context = {
    provider: isValidProvider ? requestedProvider : undefined,
    model: isValidProvider && requestedModel ? requestedModel : undefined,
  }

  storage.run(context, next)
}

export function getAIContext() {
  return storage.getStore() || {}
}