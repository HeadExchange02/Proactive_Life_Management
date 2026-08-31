import { Router } from 'express'
import { aiMetaController } from '../controllers/aiMetaController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/providers', aiMetaController.listProviders)

export default router