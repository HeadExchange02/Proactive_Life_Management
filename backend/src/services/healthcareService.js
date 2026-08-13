import { healthcareRepository } from '../repositories/healthcareRepository.js'
import { aiService } from '../ai/aiService.js'

const SYSTEM_PROMPT = `You are a healthcare guidance assistant for Bangladesh. You do NOT diagnose.
Given symptoms and a district, return JSON: { "possibleConditions": string[],
"recommendedSpecialists": string[], "hospitals": [ { "name": string, "address": string } ] }.
Always include a note to see a licensed doctor for an actual diagnosis.`

export const healthcareService = {
  async getRecommendation(userId, { symptoms, district }) {
    const aiResult = await aiService.completeJSON(
      SYSTEM_PROMPT,
      `Symptoms: ${symptoms}\nDistrict: ${district || 'N/A'}`
    )

    await healthcareRepository.create(userId, { symptoms, district, aiAnalysis: aiResult })
    return aiResult
  },
  getHistory(userId) {
    return healthcareRepository.findByUser(userId)
  },
}
