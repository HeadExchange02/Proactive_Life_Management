import { env } from '../config/env.js'

/**
 * Single source of truth for which AI providers are actually usable
 * (i.e. have an API key configured) and what their default model is.
 * Used to build the /api/ai/providers response for the frontend selector,
 * and to validate X-AI-Provider headers in aiContext middleware.
 */
export const providerCatalog = {
  gemini: { label: 'Gemini', available: Boolean(env.ai.geminiKey), defaultModel: env.ai.geminiModel },
  groq: { label: 'Groq', available: Boolean(env.ai.groqKey), defaultModel: env.ai.groqModel },
  openai: { label: 'OpenAI', available: Boolean(env.ai.openaiKey), defaultModel: 'gpt-4o-mini' },
  claude: { label: 'Claude', available: Boolean(env.ai.claudeKey), defaultModel: 'claude-sonnet-4-6' },
  mistral: { label: 'Mistral', available: Boolean(env.ai.mistralKey), defaultModel: 'mistral-small-latest' },
}