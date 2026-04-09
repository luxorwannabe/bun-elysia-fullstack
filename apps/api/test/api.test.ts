import { expect, test, describe } from 'bun:test'
import app from '../src/index.js'

describe('API Smoke Tests', () => {
  test('GET /api should return success status', async () => {
    const response = await app.handle(
      new Request('http://localhost/api')
    )
    
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toMatchObject({
      status: 'success',
      message: 'Bun Elysia Fullstack API is running'
    })
  })

  test('GET /docs/json should return openapi spec', async () => {
    const response = await app.handle(
      new Request('http://localhost/docs/json')
    )
    
    expect(response.status).toBe(200)
    const spec = await response.json()
    expect(spec.openapi).toBeDefined()
    expect(spec.info.title).toBe('Bun Elysia Fullstack API')
  })

  test('GET /non-existent-route should return 404', async () => {
    const response = await app.handle(
      new Request('http://localhost/unknown')
    )
    
    expect(response.status).toBe(404)
    const body = await response.json()
    expect(body.error).toBe('Route not found')
  })

  test('POST /api/auth/logout should clear cookies', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/auth/logout', {
        method: 'POST',
        headers: {
          'Cookie': 'accessToken=dummy; refreshToken=dummy'
        }
      })
    )

    expect(response.status).toBe(200)
    const cookies = response.headers.getSetCookie()
    
    // Core check: We should have Set-Cookie for both tokens
    expect(cookies.length).toBeGreaterThanOrEqual(2)
    
    const cookieStrings = cookies.join(', ')
    expect(cookieStrings).toContain('accessToken=')
    expect(cookieStrings).toContain('refreshToken=')
    
    // Check for removal indicator (Max-Age=0 or Expires in the past)
    // Elysia sets Max-Age=0 or an old date for removal.
    expect(cookieStrings).toContain('Max-Age=0') 
    expect(cookieStrings).toContain('Path=/')
  })
})
