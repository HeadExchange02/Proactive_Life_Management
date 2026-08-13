import { travelRepository } from '../repositories/travelRepository.js'
import { aiService } from '../ai/aiService.js'

const SYSTEM_PROMPT = `You are a travel planner for Bangladesh. Given a destination, budget,
travel dates, and preferences, return JSON: { "itinerary": [ { "name": string, "notes": string } ] }.
Include 3-6 stops covering destinations, hotels, and transportation.`

export const travelService = {
  async getRecommendation(userId, { destination, budget, travelDates, preferences }) {
    const aiResult = await aiService.completeJSON(
      SYSTEM_PROMPT,
      `Destination: ${destination}\nBudget: ${budget}\nDates: ${travelDates || 'flexible'}\nPreferences: ${preferences || 'N/A'}`
    )

    await travelRepository.create(userId, {
      destination,
      budget,
      travelDates,
      preferences,
      aiItinerary: aiResult.itinerary,
    })

    return aiResult
  },
  getHistory(userId) {
    return travelRepository.findByUser(userId)
  },
}
