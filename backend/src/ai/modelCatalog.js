/**
 * Centralized catalog of AI providers and their available models.
 * This is the single source of truth for what models each provider supports.
 * Used by both backend (aiMetaController) and can be imported by providers if needed.
 */

export const modelCatalog = {
  openai: {
    label: 'OpenAI',
    models: [
      { id: 'gpt-4o', label: 'GPT-4o' },
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      { id: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
      { id: 'gpt-4', label: 'GPT-4' },
      { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
      { id: 'o1-preview', label: 'o1 Preview' },
      { id: 'o1-mini', label: 'o1 Mini' },
    ],
    defaultModel: 'gpt-4o-mini',
  },
  claude: {
    label: 'Claude (Anthropic)',
    models: [
      { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
      { id: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' },
      { id: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
      { id: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
      { id: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
    ],
    defaultModel: 'claude-3-5-sonnet-20241022',
  },
  gemini: {
    label: 'Gemini (Google)',
    models: [
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
      { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
      { id: 'gemini-1.5-flash-8b', label: 'Gemini 1.5 Flash-8B' },
      { id: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash (Experimental)' },
      { id: 'gemini-3-flash-preview', label: 'Gemini 3 Flash Preview' },
    ],
    defaultModel: 'gemini-3-flash-preview',
  },
  groq: {
    label: 'Groq',
    models: [
      { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B' },
      { id: 'openai/gpt-oss-20b', label: 'GPT-OSS 20B' },
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile' },
      { id: 'llama-3.1-70b-versatile', label: 'Llama 3.1 70B Versatile' },
      { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant' },
      { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
      { id: 'gemma2-9b-it', label: 'Gemma 2 9B IT' },
      { id: 'gemma-7b-it', label: 'Gemma 7B IT' },
    ],
    defaultModel: 'openai/gpt-oss-120b',
  },
  mistral: {
    label: 'Mistral',
    models: [
      { id: 'mistral-large-latest', label: 'Mistral Large' },
      { id: 'mistral-small-latest', label: 'Mistral Small' },
      { id: 'mistral-medium-latest', label: 'Mistral Medium' },
      { id: 'open-mistral-7b', label: 'Open Mistral 7B' },
      { id: 'open-mixtral-8x7b', label: 'Open Mixtral 8x7B' },
      { id: 'open-mixtral-8x22b', label: 'Open Mixtral 8x22B' },
    ],
    defaultModel: 'mistral-small-latest',
  },
  bluesminds: {
    label: 'BlueSminds',
    models: [
      { id: 'nvidia/nemotron-3.5-lightning-30b-a3b', label: 'Nemotron 3.5 Lightning 30B A3B' },
      { id: 'nvidia/riva-translate-4b-instruct-v2', label: 'NVIDIA Riva Translate 4B Instruct v2' },
      { id: 'nvidia/nemotron-3-ultra', label: 'Nemotron 3 Ultra' },
      { id: 'nvidia/nemotron-3-ultra-chat', label: 'Nemotron 3 Ultra Chat' },
      { id: 'nvidia/llama-3.1-nemotron-70b-instruct', label: 'Llama 3.1 Nemotron 70B Instruct' },
      { id: 'nvidia/llama-3.1-nemotron-70b-reward', label: 'Llama 3.1 Nemotron 70B Reward' },
      { id: 'nvidia/nemotron-4-340b-instruct', label: 'Nemotron 4 340B Instruct' },
      { id: 'nvidia/nemotron-4-340b-reward', label: 'Nemotron 4 340B Reward' },
      { id: 'meta/llama-3.1-405b-instruct', label: 'Llama 3.1 405B Instruct' },
      { id: 'meta/llama-3.1-70b-instruct', label: 'Llama 3.1 70B Instruct' },
      { id: 'meta/llama-3.1-8b-instruct', label: 'Llama 3.1 8B Instruct' },
      { id: 'mistralai/mistral-7b-instruct-v0.3', label: 'Mistral 7B Instruct v0.3' },
      { id: 'google/gemma-2-27b-it', label: 'Gemma 2 27B IT' },
      { id: 'google/gemma-2-9b-it', label: 'Gemma 2 9B IT' },
    ],
    defaultModel: 'nvidia/nemotron-3.5-lightning-30b-a3b',
  },
}

/**
 * Get the list of models for a specific provider
 */
export function getModelsForProvider(providerId) {
  return modelCatalog[providerId]?.models || []
}

/**
 * Get the default model for a provider
 */
export function getDefaultModel(providerId) {
  return modelCatalog[providerId]?.defaultModel || modelCatalog[providerId]?.models?.[0]?.id
}

/**
 * Get all providers with their model info (for API response)
 */
export function getAllProviders() {
  return Object.entries(modelCatalog).map(([id, info]) => ({
    id,
    label: info.label,
    models: info.models,
    defaultModel: info.defaultModel,
  }))
}

/**
 * Validate if a provider+model combination is valid
 */
export function isValidModel(providerId, modelId) {
  const models = getModelsForProvider(providerId)
  return models.some((m) => m.id === modelId)
}