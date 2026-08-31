import { providerCatalog } from '../ai/providerCatalog.js'
import { env } from '../config/env.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const aiMetaController = {
  listProviders: asyncHandler(async (req, res) => {
    const providers = Object.entries(providerCatalog)
      .filter(([, info]) => info.available)
      .map(([id, info]) => ({ id, label: info.label, defaultModel: info.defaultModel }))

    res.json({ providers, activeProvider: env.ai.provider })
  }),
}