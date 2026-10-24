import { providerCatalog } from '../ai/providerCatalog.js'
import { env } from '../config/env.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getAllProviders } from '../ai/modelCatalog.js'

export const aiMetaController = {
  listProviders: asyncHandler(async (req, res) => {
    const allProviders = getAllProviders()
    
    const providers = allProviders
      .filter((p) => providerCatalog[p.id]?.available)
      .map((p) => ({
        id: p.id,
        label: p.label,
        models: p.models,
        defaultModel: providerCatalog[p.id]?.defaultModel || p.defaultModel,
      }))

    res.json({ providers, activeProvider: env.ai.provider })
  }),
}