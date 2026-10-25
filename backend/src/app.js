import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import pinoHttp from 'pino-http'
import path from 'path'
import { fileURLToPath } from 'url'

import { env } from './config/env.js'
import { logger } from './config/logger.js'
import routes from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { aiContextMiddleware } from './middleware/aiContext.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const app = express()

app.use(helmet())
app.use(cors({ origin: env.clientUrl, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use(aiContextMiddleware)
app.use(pinoHttp({ logger }))

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }))

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again later.' },
})
app.use(
  [
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/google',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/verify-email',
  ],
  authLimiter,
)

app.use('/api', routes)

// Serve frontend build (same-origin — cookie/CORS ঝামেলা এড়াতে)
const frontendPath = path.join(__dirname, '../../frontend/dist')
app.use(express.static(frontendPath))
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'))
})

app.use(notFoundHandler)
app.use(errorHandler)