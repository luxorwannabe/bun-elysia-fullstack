import Elysia, { t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { cookie } from '@elysiajs/cookie'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { users } from '../db/schema.ts'
import { hashPassword, verifyPassword } from '../utils/password.ts'
import { rateLimit } from 'elysia-rate-limit'

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET!,
      exp: '15m',
    })
  )
  .use(
    jwt({
      name: 'refreshJwt',
      secret: process.env.REFRESH_SECRET!,
      exp: '7d',
    })
  )
  .use(cookie())
  .use(
    rateLimit({
      duration: 60000, // 1 minute
      max: process.env.NODE_ENV === 'production' ? 15 : 100, // higher limit in dev due to React strict mode
      generator: (request, server) => {
        return server?.requestIP(request)?.address || request.headers.get('x-forwarded-for') || '127.0.0.1'
      },
      errorResponse: new Response(
        JSON.stringify({ error: 'Too many requests, please try again later' }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      ),
    })
  )

  .post(
    '/register',
    async ({ body, jwt, refreshJwt, set, cookie: { accessToken, refreshToken } }) => {
      const { email, password, name } = body

      const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email))
      if (existing.length > 0) {
        set.status = 409
        return { error: 'Email already registered' }
      }

      const hashed = await hashPassword(password)
      const [result] = await db.insert(users).values({ email, password: hashed, name }).$returningId()

      const at = await jwt.sign({ sub: String(result.id) })
      const rt = await refreshJwt.sign({ sub: String(result.id) })

      accessToken.set({
        value: at,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 15 * 60, // 15 minutes
      })

      refreshToken.set({
        value: rt,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      })

      return {
        user: { id: result.id, email, name },
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email', minLength: 1 }),
        password: t.String({ minLength: 6, maxLength: 72 }),
        name: t.String({ minLength: 1 }),
      }),
      response: {
        200: t.Object({
          user: t.Object({
            id: t.Number(),
            email: t.String(),
            name: t.String(),
          }),
        }),
        409: t.Object({
          error: t.String(),
        }),
      },
      detail: {
        tags: ['Auth'],
        summary: 'Register a new user',
        description: 'Register with email, password, and name. Returns user data and sets HttpOnly cookies.',
      },
    }
  )
  .post(
    '/login',
    async ({ body, jwt, refreshJwt, set, cookie: { accessToken, refreshToken } }) => {
      const { email, password } = body

      const [user] = await db.select().from(users).where(eq(users.email, email))
      if (!user) {
        set.status = 401
        return { error: 'Invalid credentials' }
      }

      const valid = await verifyPassword(password, user.password)
      if (!valid) {
        set.status = 401
        return { error: 'Invalid credentials' }
      }

      const at = await jwt.sign({ sub: String(user.id) })
      const rt = await refreshJwt.sign({ sub: String(user.id) })

      accessToken.set({
        value: at,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 15 * 60,
      })

      refreshToken.set({
        value: rt,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      })

      return {
        user: { id: user.id, email: user.email, name: user.name },
      }
    },
    {
      body: t.Object({
        email: t.String({ minLength: 1 }),
        password: t.String({ minLength: 1, maxLength: 72 }),
      }),
      response: {
        200: t.Object({
          user: t.Object({
            id: t.Number(),
            email: t.String(),
            name: t.String(),
          }),
        }),
        401: t.Object({
          error: t.String(),
        }),
      },
      detail: {
        tags: ['Auth'],
        summary: 'Login user',
        description: 'Authenticate with email and password. Sets HttpOnly cookies.',
      },
    }
  )
  .post(
    '/refresh',
    async ({ refreshJwt, jwt, set, cookie: { accessToken, refreshToken } }) => {
      const token = refreshToken.value
      if (!token || typeof token !== 'string') {
        set.status = 401
        return { error: 'No refresh token provided' }
      }

      const payload = await refreshJwt.verify(token)
      if (!payload) {
        set.status = 401
        return { error: 'Invalid or expired refresh token' }
      }

      const at = await jwt.sign({ sub: payload.sub })
      
      accessToken.set({
        value: at,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 15 * 60,
      })

      return { message: 'Token refreshed' }
    },
    {
      response: {
        200: t.Object({
          message: t.String(),
        }),
        401: t.Object({
          error: t.String(),
        }),
      },
      detail: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        description: 'Obtain a new access token using the refresh token from cookies.',
      },
    }
  )
  .post('/logout', ({ cookie: { accessToken, refreshToken } }) => {
    accessToken.remove()
    refreshToken.remove()
    return { message: 'Logged out successfully' }
  }, {
    response: {
      200: t.Object({
        message: t.String(),
      }),
    },
    detail: {
      tags: ['Auth'],
      summary: 'Logout user',
      description: 'Clears the authentication cookies.',
    },
  })


