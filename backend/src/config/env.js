import { config as dotenvConfig } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Ensure dotenv loads from the backend directory (where .env lives)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const backendDir = path.resolve(__dirname, '../..')
const dotenvPath = path.join(backendDir, '.env')
console.log('Loading .env from:', dotenvPath)
const result = dotenvConfig({ path: dotenvPath })
console.log('Dotenv result:', result.error ? result.error.message : 'OK', 'Parsed:', result.parsed ? Object.keys(result.parsed).length : 0, 'vars')
console.log('JWT_ACCESS_SECRET:', process.env.JWT_ACCESS_SECRET ? 'SET' : 'NOT SET')

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',

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
    bluesmindsKey: process.env.BLUESMINDS_API_KEY || 'nvidia/nemotron-3.5-lightning-30b-a3b' ,
  },
}
