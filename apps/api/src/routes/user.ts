import { Elysia, t } from 'elysia'
import sharp from 'sharp'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { users } from '../db/schema.js'
import { authMiddleware } from '../middleware/auth.js'
import { hashPassword, verifyPassword } from '../utils/password.js'
import { storage } from '../utils/storage/factory.js'

export const userRoutes = new Elysia({ prefix: '/user' })
  .use(authMiddleware)
  .get(
    '/profile',
    async ({ userId, set }) => {
      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          avatarUrl: users.avatarUrl,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(eq(users.id, userId))

      if (!user) {
        set.status = 404
        return { error: 'User not found' }
      }

      return {
        ...user,
        storage: {
          provider: process.env.STORAGE_PROVIDER || 'local',
          isServerless: process.env.VERCEL === '1'
        }
      }
    },
    {
      response: {
        200: t.Object({
          id: t.Number(),
          email: t.String(),
          name: t.String(),
          avatarUrl: t.Optional(t.Nullable(t.String())),
          createdAt: t.Optional(t.Any()),
          updatedAt: t.Optional(t.Any()),
          storage: t.Object({
            provider: t.String(),
            isServerless: t.Boolean()
          })
        }),
        404: t.Object({
          error: t.String(),
        }),
        401: t.Object({
          error: t.String(),
        }),
      },
      detail: {
        tags: ['User'],
        summary: 'Get user profile',
        description: "Retrieve the authenticated user's profile. Requires a Bearer token.",
        security: [{ bearerAuth: [] }],
      },
    }
  )
  .put(
    '/profile',
    async ({ userId, body, set }) => {
      const updateData: Partial<{ name: string; email: string }> = {}
      if (body.name !== undefined) updateData.name = body.name
      if (body.email !== undefined) updateData.email = body.email

      if (Object.keys(updateData).length === 0) {
        set.status = 400
        return { error: 'No fields to update' }
      }

      if (updateData.email) {
        const [existing] = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, updateData.email))
        if (existing && existing.id !== userId) {
          set.status = 409
          return { error: 'Email already in use' }
        }
      }

      await db.update(users).set(updateData).where(eq(users.id, userId))

      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          avatarUrl: users.avatarUrl,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(eq(users.id, userId))

      return user
    },
    {
      body: t.Object({
        name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
        email: t.Optional(t.String({ format: 'email' })),
      }),
      response: {
        200: t.Object({
          id: t.Number(),
          email: t.String(),
          name: t.String(),
          avatarUrl: t.Optional(t.Nullable(t.String())),
          updatedAt: t.Optional(t.Any()),
        }),
        400: t.Object({
          error: t.String(),
        }),
        409: t.Object({
          error: t.String(),
        }),
        401: t.Object({
          error: t.String(),
        }),
      },
      detail: {
        tags: ['User'],
        summary: 'Update user profile',
        description: "Update the authenticated user's name and/or email. Requires a Bearer token.",
        security: [{ bearerAuth: [] }],
      },
    }
  )
  .put(
    '/password',
    async ({ userId, body, set }) => {
      const { currentPassword, newPassword } = body

      const [user] = await db
        .select({ id: users.id, password: users.password })
        .from(users)
        .where(eq(users.id, userId))

      if (!user) {
        set.status = 404
        return { error: 'User not found' }
      }

      const valid = await verifyPassword(currentPassword, user.password)
      if (!valid) {
        set.status = 401
        return { error: 'Incorrect current password' }
      }

      const hashed = await hashPassword(newPassword)
      await db.update(users).set({ password: hashed }).where(eq(users.id, userId))

      return { message: 'Password updated successfully' }
    },
    {
      body: t.Object({
        currentPassword: t.String({ minLength: 1 }),
        newPassword: t.String({ minLength: 6, maxLength: 72 }),
      }),
      response: {
        200: t.Object({
          message: t.String(),
        }),
        401: t.Object({
          error: t.String(),
        }),
        404: t.Object({
          error: t.String(),
        }),
      },
      detail: {
        tags: ['User'],
        summary: 'Change user password',
        description: "Change the authenticated user's password. Requires current password.",
        security: [{ bearerAuth: [] }],
      },
    }
  )
  .put(
    '/avatar',
    async ({ userId, body, set }) => {
      const { file } = body

      if (!file) {
        set.status = 400
        return { error: 'No file uploaded' }
      }

      try {
        // 1. Get the old avatar URL FIRST (before uploading new one)
        const [user] = await db
          .select({ avatarUrl: users.avatarUrl })
          .from(users)
          .where(eq(users.id, userId))

        // 2. Process image with Sharp
        // Resize to 350x350, crop to center, and convert to WebP for optimization
        const processedImageBuffer = await sharp(await file.arrayBuffer())
          .resize(350, 350, { fit: 'cover' })
          .webp({ quality: 80 })
          .toBuffer();

        // Create a new File-like object from the buffer for the storage providers
        const processedFile = new Blob([new Uint8Array(processedImageBuffer)], { type: 'image/webp' });

        // 3. Upload using our generic storage provider
        const avatarUrl = await storage.upload(processedFile, `avatar-${userId}-${Date.now()}.webp`);

        // 4. Update database with new URL (atomic)
        await db.update(users).set({ avatarUrl }).where(eq(users.id, userId))

        // 5. Delete old avatar AFTER successful DB update (best-effort cleanup)
        if (user?.avatarUrl) {
          try {
            await storage.delete(user.avatarUrl)
          } catch (e) {
            console.error('Failed to delete old avatar:', e)
          }
        }

        return { avatarUrl }
      } catch (error) {
        console.error('Upload error:', error)
        set.status = 500
        return { error: 'Failed to upload image' }
      }
    },
    {
      body: t.Object({
        file: t.File({
          type: ['image/jpeg', 'image/png', 'image/webp'],
          maxSize: '2m', // 2MB limit
        }),
      }),
      response: {
        200: t.Object({
          avatarUrl: t.String(),
        }),
        400: t.Object({
          error: t.String(),
        }),
        500: t.Object({
          error: t.String(),
        }),
      },
      detail: {
        tags: ['User'],
        summary: 'Update user avatar',
        description: 'Upload a new profile picture. Requires a Bearer token.',
        security: [{ bearerAuth: [] }],
      },
    }
  )
