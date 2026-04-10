/**
 * Shared types for the web application.
 */

export interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface UserProfile {
  id: number
  email: string
  name: string
  avatarUrl?: string
  createdAt?: string
  storage: {
    provider: string
    isServerless: boolean
  }
}
