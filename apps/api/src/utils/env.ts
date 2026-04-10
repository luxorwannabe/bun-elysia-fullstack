/**
 * Shared environment utilities.
 * Extracted from auth.ts and middleware/auth.ts to avoid duplication (CQ-1).
 */

/**
 * Get a secret from environment variables.
 * Throws in production if the secret is not defined.
 */
export const getSecret = (key: string, fallback: string): string => {
  const secret = process.env[key]
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error(`${key} must be defined in production!`)
  }
  return secret || fallback
}
