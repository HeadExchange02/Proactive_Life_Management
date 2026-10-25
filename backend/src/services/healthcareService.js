import { healthcareRepository } from '../repositories/healthcareRepository.js'
import { aiService } from '../ai/aiService.js'
import { hospitalRepository } from '../repositories/hospitalRepository.js'

import { prisma } from '../config/prisma.js'
import { env } from '../config/env.js'
import { logger } from '../config/logger.js'
import { findSpecialty, SPECIALTIES } from '../data/specialtyHospitals.js'

const SYSTEM_PROMPT = `You are a healthcare guidance assistant for Bangladesh. You do NOT diagnose. 
Given symptoms and a district, return JSON: { "possibleConditions": string[], 
"recommendedSpecialists": string[], "hospitals": [ { "name": string, "address": string } ] }. 
Always include a note to see a licensed doctor for an actual diagnosis.`

export const healthcareService = {
  async getRecommendation(userId, { symptoms, district }) {
    
    let aiResult = {};
    
    // Template for dummy data fallback
    const dummyData = {
      possibleConditions: ['Common Cold', 'General Weakness'],
      recommendedSpecialists: ['General Physician', 'Internal Medicine Specialist'],
      hospitals: [
        { name: 'Dhaka Medical College Hospital', address: 'Dhaka' },
        { name: 'Local General Hospital', address: district || 'Your Area' }
      ]
    };

    // 1. Smart Check: use AI only if any provider key is configured (openai, claude, gemini, groq, mistral)
    const { openaiKey, claudeKey, geminiKey, groqKey, mistralKey } = env.ai
    if (openaiKey || claudeKey || geminiKey || groqKey || mistralKey) {
      try {
        const parsed = await aiService.completeJSON(
          SYSTEM_PROMPT,
          `Symptoms: ${symptoms}\nDistrict: ${district || 'N/A'}`
        )
        aiResult = parsed && typeof parsed === 'object' ? parsed : dummyData
      } catch (error) {
        logger.warn({ err: error }, 'AI request failed; using fallback healthcare data')
        aiResult = dummyData;
      }
    } else {
      logger.info('No AI provider key configured; using fallback healthcare data')
      aiResult = dummyData;
    }

    let matchingMedicines = [];
    
    const keywords = symptoms
      ? symptoms
          .toLowerCase()
          .split(/[,\s]+/) 
          .filter((w) => w.length > 2) 
      : [];

    if (keywords.length > 0) {
      matchingMedicines = await prisma.medicine.findMany({
        where: {
          OR: keywords.flatMap((word) => [
            { name: { contains: word, mode: 'insensitive' } },
            { indication: { contains: word, mode: 'insensitive' } }
          ])
        },
        take: 10,
        distinct: ['id'] 
      });
    }

    // Hospital list order: curated specialist hospitals -> real hospitals in the
    // user's district (Hospitals_count_in_Bangladesh table) -> AI suggestions.
    const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    const specialty = findSpecialty(symptoms)

    const curated = specialty
      ? await Promise.all(
          specialty.hospitals.map(async (h) => {
            const row = h.match ? await hospitalRepository.findByNameKeyword(h.match) : null
            const bedText = row?.beds ? `${row.beds} beds` : null
            return {
              name: h.name,
              address: h.address,
              note: [h.note, bedText].filter(Boolean).join(' · '),
              beds: row?.beds ?? undefined,
              curated: true,
            }
          })
        )
      : []

    const districtRows = await hospitalRepository.findByDistrict(district, 12)
    const isListed = (name, list) => {
      const n = norm(name)
      return list.some((h) => {
        const o = norm(h.name)
        return o === n || o.includes(n) || n.includes(o)
      })
    }
    // With a specialty detected, keep other specialties' institutes (e.g. a
    // children's or eye hospital for a heart complaint) out of the nearby list.
    const ownMatches = new Set(specialty ? specialty.hospitals.map((h) => h.match) : [])
    const otherMatches = specialty
      ? SPECIALTIES.flatMap((sp) => sp.hospitals.map((h) => h.match)).filter(
          (m) => m && !ownMatches.has(m)
        )
      : []
    const nearby = []
    for (const r of districtRows) {
      if (nearby.length >= 5) break
      if (!r.name || isListed(r.name, curated) || isListed(r.name, nearby)) continue
      if (otherMatches.some((m) => norm(r.name).includes(norm(m)))) continue
      nearby.push({
        name: r.name,
        address: [r.upazila, r.district].filter(Boolean).join(', '),
        note: `Hospital in ${r.district}${r.beds ? ` · ${r.beds} beds` : ''}`,
        beds: r.beds ?? undefined,
        source: 'dataset',
      })
    }

    const base = [...curated, ...nearby]
    const aiHospitals = (Array.isArray(aiResult.hospitals) ? aiResult.hospitals : []).filter(
      (h) => h?.name && !isListed(h.name, base)
    )
    // Placeholder entries from the dummy fallback add nothing once real data exists.
    const extra = nearby.length
      ? aiHospitals.filter((h) => norm(h.name) !== 'local general hospital')
      : aiHospitals

    aiResult = {
      ...aiResult,
      ...(specialty && {
        specialty: { id: specialty.id, label: specialty.label },
        recommendedSpecialists: [
          ...new Set([...specialty.specialists, ...(aiResult.recommendedSpecialists || [])]),
        ],
      }),
      hospitals: [...base, ...extra],
    }

    await healthcareRepository.create(userId, {
      symptoms, 
      district, 
      aiAnalysis: aiResult 
    });

    return {
      success: true,
      aiAnalysis: aiResult,
      medicines: matchingMedicines,
      message: `Found ${matchingMedicines.length} matching medicine(s) from database.`
    }
  },

  getHistory(userId) {
    return healthcareRepository.findByUser(userId)
  }
}