import { env } from '../../config/env.js'

export const geminiProvider = {
  name: 'gemini',
  async complete({ system, prompt }) {
    if (!env.ai.geminiKey) {
      throw new Error('Gemini is selected but GEMINI_API_KEY is not configured')
    }

    const url = new URL(
      `https://generativelanguage.googleapis.com/v1beta/models/${env.ai.geminiModel}:generateContent`
    )
    url.searchParams.set('key', env.ai.geminiKey)

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      const providerMessage = data.error?.message
      throw new Error(
        `Gemini request failed (${response.status}): ${providerMessage || 'The provider rejected the request'}`
      )
    }

    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
      .trim()

    if (!text) {
      const reason = data.candidates?.[0]?.finishReason || 'unknown response'
      throw new Error(`Gemini returned no response content (${reason})`)
    }

    return text
  },
}
