import { expect, test, describe } from 'bun:test'
import { hashPassword, verifyPassword } from '../src/utils/password.js'

describe('Password Utilities', () => {
  const password = 'mySecretPassword123'

  test('should hash a password successfully', async () => {
    const hash = await hashPassword(password)
    expect(hash).toBeDefined()
    expect(hash.length).toBeGreaterThan(0)
    expect(hash).not.toBe(password)
  })

  test('should verify a correct password', async () => {
    const hash = await hashPassword(password)
    const isValid = await verifyPassword(password, hash)
    expect(isValid).toBe(true)
  })

  test('should not verify an incorrect password', async () => {
    const hash = await hashPassword(password)
    const isValid = await verifyPassword('wrongPassword', hash)
    expect(isValid).toBe(false)
  })

  test('should produce different hashes for the same password', async () => {
    const hash1 = await hashPassword(password)
    const hash2 = await hashPassword(password)
    expect(hash1).not.toBe(hash2) // Salt is unique per hash
  })
})
