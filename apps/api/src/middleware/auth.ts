import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { cookie } from '@elysiajs/cookie'
import { getSecret } from '../utils/env.js'

export const authMiddleware = new Elysia({ name: 'auth-middleware' })
  .use(
    jwt({
      name: 'jwt',
      secret: getSecret('JWT_SECRET', 'fallback-jwt-secret-key-at-least-32-chars-long'),
    })
  )
  .use(cookie())
  .derive({ as: 'scoped' }, async ({ jwt, cookie, set, request }) => {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : cookie.accessToken.value



    if (!token || typeof token !== 'string') {
      set.status = 401
      throw new Error('Unauthorized: No token provided')
    }


    const payload = await jwt.verify(token)
    if (!payload) {
      set.status = 401
      throw new Error('Unauthorized: Invalid or expired token')
    }

    return { userId: Number(payload.sub) }
  })


