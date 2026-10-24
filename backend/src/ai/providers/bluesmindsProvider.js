import { env } from '../../config/env.js'

/**
 * BlueSminds Provider - OpenAI-compatible API
 * Hosts NVIDIA NIM models and other open models via BlueSminds API
 */
export const bluesmindsProvider = {
  name: 'bluesminds',
  defaultModel: 'nvidia/nemotron-3.5-lightning-30b-a3b',
  
  async complete({ system, prompt, model }) {
    if (!env.ai.bluesmindsKey) {
      throw new Error('BlueSminds is selected but BLUESMINDS_API_KEY is not configured')
    }

    // Use BlueSminds API endpoint (OpenAI-compatible) - exact format from working example
    const response = await fetch('https://api.bluesminds.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.ai.bluesmindsKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'nvidia/nemotron-3.5-lightning-30b-a3b',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `BlueSminds request failed (${response.status}): ${errorData.error?.message || 'The provider rejected the request'}`
      )
    }

    const data = await response.json()
    return data.choices[0].message.content
  },
}