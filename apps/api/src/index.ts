import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { authRoutes } from './routes/auth.js'
import { userRoutes } from './routes/user.js'

const routes = new Elysia()
  .use(authRoutes)
  .use(userRoutes)
  .get('/', () => {
    return {
      status: 'success',
      message: 'Bun Elysia Fullstack API is running',
      docs: '/api/docs',
    }
  })

const app = new Elysia()
  .use(
    cors({
      origin: process.env.CORS_ORIGIN || true,
      credentials: true,
    })
  )
  .onError(({ code, error, set }) => {
    if (code === 'NOT_FOUND') {
      set.status = 404
      return { error: 'Route not found' }
    }
    if (code === 'VALIDATION') {
      set.status = 422
      const fieldErrors: Record<string, string> = {}

      if (error.all) {
        for (const err of error.all) {
          const fieldName = err.path.toString().replace('/', '')
          if (!fieldErrors[fieldName]) {
            fieldErrors[fieldName] = err.message
          }
        }
      }

      return { error: 'Validation failed', fields: fieldErrors }
    }
    if (code === 'UNKNOWN') {
      const message = error instanceof Error ? error.message : 'Unknown error'
      if (set.status === 401) {
        return { error: message }
      }
    }

    // Log error for production monitoring
    console.error(`[API Error] Code: ${code}`, error)

    set.status = 500
    return { error: 'Internal server error' }
  })
  .group('/api', (app) =>
    app
      .use(
        swagger({
          path: '/docs',
          documentation: {
            info: {
              title: 'Bun Elysia Fullstack API',
              version: '0.1.0',
              description: 'REST API authentication using Bun + ElysiaJS + Drizzle ORM + MySQL',
            },
            tags: [
              {
                name: 'Auth',
                description: 'Authentication endpoints (register, login, refresh, logout)',
              },
              { name: 'User', description: 'User profile endpoints (requires Bearer token)' },
            ],
            components: {
              securitySchemes: {
                bearerAuth: {
                  type: 'http',
                  scheme: 'bearer',
                  bearerFormat: 'JWT',
                },
              },
            },
          },
        })
      )
      .use(routes)
  )

const port = Number(process.env.PORT) || 3000

if (process.env.VERCEL !== '1') {
  app.listen(port)
  console.log(`🚀 Server running at http://${app.server?.hostname}:${app.server?.port}`)
  console.log(`📖 API Documentation: http://${app.server?.hostname}:${app.server?.port}/api/docs`)
}

export type App = typeof routes
export default app

if (!process.env.CORS_ORIGIN) {
  console.warn('⚠️  CORS_ORIGIN is not defined. CORS is running in a fully permissive state (*).')
}
