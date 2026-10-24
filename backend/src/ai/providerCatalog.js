import { env } from '../config/env.js'
import { getAllProviders, getDefaultModel } from './modelCatalog.js'

/**
 * Single source of truth for which AI providers are actually usable
 * (i.e. have an API key configured) and what their default model is.
 * Used to build the /api/ai/providers response for the frontend selector,
 * and to validate X-AI-Provider headers in aiContext middleware.
 */
const allProviders = getAllProviders()

export const providerCatalog = {
  gemini: { 
    label: 'Gemini', 
    available: Boolean(env.ai.geminiKey), 
    defaultModel: env.ai.geminiModel || getDefaultModel('gemini') 
  },
  groq: { 
    label: 'Groq', 
    available: Boolean(env.ai.groqKey), 
    defaultModel: env.ai.groqModel || getDefaultModel('groq') 
  },
  openai: { 
    label: 'OpenAI', 
    available: Boolean(env.ai.openaiKey), 
    defaultModel: getDefaultModel('openai') 
  },
  claude: { 
    label: 'Claude', 
    available: Boolean(env.ai.claudeKey), 
    defaultModel: getDefaultModel('claude') 
  },
  mistral: { 
    label: 'Mistral', 
    available: Boolean(env.ai.mistralKey), 
    defaultModel: getDefaultModel('mistral') 
  },
  bluesminds: { 
    label: 'BlueSminds', 
    available: Boolean(env.ai.bluesmindsKey), 
    defaultModel: getDefaultModel('bluesminds') 
  },
}