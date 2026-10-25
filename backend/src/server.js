import { app } from './app.js'
import { env, validateEnv } from './config/env.js'
import { logger } from './config/logger.js'

try {
  validateEnv().forEach((warning) => logger.warn(warning))
} catch (err) {
  logger.fatal(err.message)
  process.exit(1)
}

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught exception — shutting down')
  process.exit(1)
})
process.on('unhandledRejection', (err) => {
  logger.error({ err }, 'Unhandled promise rejection — shutting down')
  process.exit(1)
})

app.listen(env.port, () => {
  logger.info(`Proactive Life API listening on http://localhost:${env.port}`)
})
