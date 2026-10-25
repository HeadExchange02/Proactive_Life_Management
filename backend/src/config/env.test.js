import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { validateEnv } from './env.js'

const valid = {
  DATABASE_URL: 'postgresql://u:p@localhost:5432/db',
  JWT_ACCESS_SECRET: 'a'.repeat(32),
  JWT_REFRESH_SECRET: 'b'.repeat(32),
}

describe('validateEnv', () => {
  it('accepts a complete development configuration', () => {
    assert.deepEqual(validateEnv(valid), [])
  })

  it('lists every missing required variable', () => {
    assert.throws(
      () => validateEnv({}),
      /DATABASE_URL is required.*JWT_ACCESS_SECRET is required.*JWT_REFRESH_SECRET is required/,
    )
  })

  it('rejects short JWT secrets in production', () => {
    assert.throws(
      () => validateEnv({ ...valid, NODE_ENV: 'production', JWT_ACCESS_SECRET: 'short' }),
      /JWT_ACCESS_SECRET must be at least 32 characters/,
    )
  })

  it('allows short JWT secrets outside production', () => {
    assert.deepEqual(validateEnv({ ...valid, JWT_ACCESS_SECRET: 'short' }), [])
  })

  it('warns when verification is required but SMTP is not configured', () => {
    const warnings = validateEnv({ ...valid, NODE_ENV: 'production' })
    assert.equal(warnings.length, 1)
    assert.match(warnings[0], /SMTP_HOST/)
  })

  it('does not warn when verification is explicitly disabled', () => {
    assert.deepEqual(
      validateEnv({ ...valid, NODE_ENV: 'production', REQUIRE_EMAIL_VERIFICATION: 'false' }),
      [],
    )
  })
})
