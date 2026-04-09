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

  test('GET /api/docs/json should return openapi spec', async () => {
    const response = await app.handle(
      new Request('http://localhost/api/docs/json')
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
})
