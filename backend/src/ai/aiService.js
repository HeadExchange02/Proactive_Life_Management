import { env } from '../config/env.js'
import { openaiProvider } from './providers/openaiProvider.js'
import { claudeProvider } from './providers/claudeProvider.js'
import { geminiProvider } from './providers/geminiProvider.js'
import { groqProvider } from './providers/groqProvider.js'
import { mistralProvider } from './providers/mistralProvider.js'
import { bluesmindsProvider } from './providers/bluesmindsProvider.js'
import { getAIContext } from '../middleware/aiContext.js'

const providers = {
  openai: openaiProvider,
  claude: claudeProvider,
  gemini: geminiProvider,
  groq: groqProvider,
  mistral: mistralProvider,
  bluesminds: bluesmindsProvider,
}

/**
 * Strips ```json / ``` fences and surrounding prose that providers
 * (especially Gemini) sometimes wrap around JSON output despite being
 * told not to. Falls back to the trimmed raw string if no fence is found,
 * so a clean JSON response still parses normally.
 */
function stripMarkdownFence(raw) {
  const trimmed = raw.trim()
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (fenceMatch) return fenceMatch[1].trim()
  return trimmed
}

/**
 * Single entry point the rest of the backend uses for AI calls.
 * Swap providers globally via AI_PROVIDER in .env, or per-call via
 * `providerName`, without any calling code changing.
 */


export const aiService = {
  async complete({ system, prompt }, providerName, model) {
    const context = getAIContext()
    const resolvedProviderName = providerName || context.provider || env.ai.provider
    const provider = providers[resolvedProviderName]
    if (!provider) throw new Error(`Unknown AI provider: ${resolvedProviderName}`)
    const resolvedModel = model || (providerName ? undefined : context.model)
    return provider.complete({ system, prompt, model: resolvedModel })
  },

  /**
   * Convenience helper for structured JSON recommendations. Instructs the
   * model to return JSON only, then parses it — used by career/travel/
   * healthcare/agriculture/budget modules.
   */
  async completeJSON(system, prompt, providerName, model) {
    const raw = await this.complete(
      { system: `${system}\nRespond with ONLY valid JSON, no markdown fences, no prose.`, prompt },
      providerName,
      model
    )
    const cleaned = stripMarkdownFence(raw)
    try {
      return JSON.parse(cleaned)
    } catch {
      throw new Error('AI provider returned non-JSON output')
    }
  },
}