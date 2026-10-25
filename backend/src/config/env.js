import { config as dotenvConfig } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
dotenvConfig({ path: path.join(backendDir, '.env'), quiet: true })

const nodeEnv = process.env.NODE_ENV || 'development'

export const env = {
  nodeEnv,
  port: process.env.PORT || 4000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',

  requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION
    ? process.env.REQUIRE_EMAIL_VERIFICATION === 'true'
    : nodeEnv === 'production',

  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || 'no-reply@proactivelife.app',
  },

  ai: {
    provider: process.env.AI_PROVIDER || 'gemini', // openai | claude | gemini | groq | mistral
    openaiKey: process.env.OPENAI_API_KEY,
    claudeKey: process.env.ANTHROPIC_API_KEY,
    geminiKey: process.env.GEMINI_API_KEY,
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3-flash-preview',
    groqKey: process.env.GROQ_API_KEY,
    groqModel: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
    mistralKey: process.env.MISTRAL_API_KEY,
    bluesmindsKey: process.env.BLUESMINDS_API_KEY,
  },
}

const REQUIRED_KEYS = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']
const MIN_PRODUCTION_SECRET_LENGTH = 32

export function validateEnv(source = process.env) {
  const errors = REQUIRED_KEYS.filter((key) => !source[key]).map((key) => `${key} is required`)

  if (source.NODE_ENV === 'production') {
    for (const key of ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']) {
      if (source[key] && source[key].length < MIN_PRODUCTION_SECRET_LENGTH) {
        errors.push(`${key} must be at least ${MIN_PRODUCTION_SECRET_LENGTH} characters in production`)
      }
    }
  }

  if (errors.length) {
    throw new Error(`Invalid environment configuration: ${errors.join('; ')}`)
  }

  const warnings = []
  const verificationRequired = source.REQUIRE_EMAIL_VERIFICATION
    ? source.REQUIRE_EMAIL_VERIFICATION === 'true'
    : source.NODE_ENV === 'production'
  if (verificationRequired && !source.SMTP_HOST) {
    warnings.push('Email verification is required but SMTP_HOST is not set; new users will not receive verification links')
  }
  return warnings
}
