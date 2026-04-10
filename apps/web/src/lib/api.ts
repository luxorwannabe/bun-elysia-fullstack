import { treaty } from '@elysiajs/eden'
import type { App } from '@bun-elysia-fullstack/api'

const baseUrl = typeof window !== 'undefined' 
  ? `${window.location.origin}/api` 
  : '/api'

export const api = treaty<App>(baseUrl, {
  fetch: {
    credentials: 'include',
  },
})




