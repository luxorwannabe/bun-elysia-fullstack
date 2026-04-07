import { edenTreaty } from '@elysiajs/eden'
import type { App } from '@bun-elysia-fullstack/api'

export const api = edenTreaty<App>('/api', {
  $fetch: {
    credentials: 'include',
  },
})




